const Clip = require('../models/clip');
const Checkit = require('checkit');
const Tag = require('../models/tag');
const TagController = require('./tag-controller');
const User = require('../models/user');
const async = require('async');
const RemovedClip = require('../models/removed-clips');
const Validator = require('../helpers/checkit-validation');
const SearchClips = require('../queries/search-clips');
const EditClip = require('../queries/edit-clip');
const FindClip = require('../queries/find-clip');
const RemoveClip = require('../queries/remove-clip');
const ObjectID = require('mongodb').ObjectID;
const rimraf = require("rimraf");
const xss = require('xss');
const env = require('get-env')();
const _ = require('lodash');

const uploadedFilesPath = process.env.UPLOADED_FILES_DIR + '/';
const UUIDRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

exports.createClip = function(req, res, next) {
  const authedUser = req.user;
  const clipValidator = new Checkit(Validator.clipValidation);

  clipValidator.run(req.body).then((validated)=>{
      let length = validated.length ? validated.length : 0;
      var clip = new Clip({
        title : xss(validated.title, {}),
        sourceUrl: validated.sourceUrl,
        description: validated.description,
        tags : [ '584727de6574dd6df2406f5a', '585027957e4d16f42b95d92d'],
        length: length,
        _creator: authedUser._id
      });

    async.waterfall([
      function(done) {
        clip.save(function (err) {
          if (err) { done(err, clip) }

          done(err, clip);

        });
      },
      function (clip, done) {

        authedUser.clips.push(clip);
        authedUser.save(function (err) {

          done(err, clip);

        });
      },
      function (clip, done) {
        TagController.addClipToTag('584727de6574dd6df2406f5a', clip._id, function (err, tag) {

          done(err, clip);

        });
      },function (clip, done) {
        TagController.addClipToTag('585027957e4d16f42b95d92d', clip._id, function (err, tag) {

          done(err, clip);

        });
      }], function(err, clip) {
      if (err) {
        console.log('error occurred creating clip: ', err);
        return res.status(422).send({ _error: 'Error occurred trying to create clip.'});
      } else {
        return res.json({clip});
      }

    });



  }).catch( function(err) {
    return res.status(422).send(err.toJSON());
  });

};

exports.findClip = function (req, res, next) {
  let id = req.query.id;

  if (!id) {
    return res.status(422).send({ _error: 'ID is required to fetch clip' });
  }

  FindClip(id).then((result = []) =>
    res.json(result)
  ).catch (function (err) {
      console.log("find clip query error:" , err);
      res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
    }
  );

};

exports.addTagToClip = function (clipID, tagID, cb) {
  Clip.findOne({ _id: clipID }, function(err, existingClip) {

    existingClip.tags.push(tagID);

    existingClip.save(function (err) {
      if (err) {
        return cb(err);
      }

      // respond with successfully updated clip
      return cb(err, existingClip);
    });

  });
};

exports.getClips = function (req, res, next) {
  let limit = req.query.limit ? _.toNumber(req.query.limit) : 20;
  let offset = req.query.offset ? _.toNumber(req.query.offset) : 0;
  let tags = req.query.tags ? _.split(req.query.tags, ',') : null;
  let sort = req.query.sort ? req.query.sort : 'createdAt';
  let sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

  let criteria = {title: ''};

  if (tags) {
    criteria.tags = tags;
  }

  if (!_.isInteger(limit) || !_.isInteger(offset)) {
    return res.status(422).send({ _error: 'Invalid query format.' });
  }

  SearchClips(criteria, sort, sortOrder, offset, limit).then((result = []) =>
    res.json(result)
  ).catch (function (err) {
      console.log("query error:" , err);
      res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' })
    }
  );
};

exports.editClip = function (req, res, next) {
  const authedUser = req.user;
  const clipValidator = new Checkit(Validator.editClipValidation);

  clipValidator.run(req.body).then((validated)=>{

    // make sure this request is from the clip's original author
    var clipId = new ObjectID(validated._id);
    if (!_.find(authedUser.clips, clipId)) {
      return res.status(422).send({ _error: 'You may only edit clips that you have created.'});
    }

    let updatedProps = {};

    if (validated.title) {
      updatedProps.title = validated.title;
    }

    if (validated.length) {
      updatedProps.length = validated.length;
    }

    if (req.body.tags) {
      updatedProps.tags = req.body.tags.map(t => {return t._id});
    }

    if (validated.description) {
      updatedProps.description = validated.description;
    }

    EditClip(validated._id, updatedProps).then((result = []) =>
      res.json({message: 'Your clip was successfully updated.'})
    ).catch (function (err) {
        console.log("edit clip error:" , err);
        res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
      }
    );


  }).catch( function(err) {
    return res.status(422).send(err.toJSON());
  });

};

exports.removeClip = function (req, res, next) {
  const authedUser = req.user;

  const clipId = req.body.clip;

  if (!clipId) {
    return res.status(422).send({ _error: 'A clip id is required.'});
  }

  var query = Clip.findOne({_id: clipId});

  query.then(function (clip) {
    if (!clip._creator.equals(authedUser._id)) {
      return res.status(422).send({ _error: 'You may only remove clips that you have created.'});
    }

    if (clip.tags.length > 0) {
      // remove the clip from the associated tag(s)
      async.filter(clip.tags, function (tag, callback) {
        const update = Tag.update({_id: tag}, {$pullAll: { clips: [clipId] } } );

        update.then(function (updatedTag) {
          console.log("removed " + clipId + " from tag ", tag);
          callback(null, updatedTag)
        }).catch(function(err) {
          callback(err);
        });

      }, function (err, results) {
        if (err) {
          console.error("error removing clip from tag", err);
        }

        updateUserAndProcessClipFileRemoval(res, authedUser, clipId, clip);

      })

    } else {
      updateUserAndProcessClipFileRemoval(res, authedUser, clipId, clip);
    }


  }).catch(function (err) {
    console.log("find clip query error:" , err);
    res.status(422).send({ _error: 'Could not find clip.' });
  });

};

function updateUserAndProcessClipFileRemoval(res, authedUser, clipId, clip) {
  // remove clip from user's list of created clips & faves
  const updateUser = User.update({_id: authedUser._id}, {$pullAll: { clips: [clipId], favoriteClips: [clipId] } } );

  updateUser.then(function (updatedUser) {
    RemoveClip(clipId).then((result = []) => {

      // create copy of removed clip to a removed table
      var removedClip = new RemovedClip({
        _creator: clip._creator,
        clipId: clip._id,
        sourceUrl: clip.sourceUrl,
        title: clip.title});

      removedClip.save(function (err) {
        if (err) {
          console.error("could not save new removed clip", err);
        }

        var uuid = clip.sourceUrl.match(UUIDRegex);

        if (uuid) {
          var dirToDelete = uploadedFilesPath + uuid[0];

          rimraf(dirToDelete, function(error) {
            if (error) {
              console.error("Problem deleting file! " + error);
              return res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
            }

            return res.json({message: 'Your clip was successfully removed.'})
          });
        } else {
          console.error("Problem deleting file! - file path could not be found");
          return res.json({message: 'Your clip was successfully removed from our records. File was not deleted.'})
        }

      });

    }).catch (function (err) {
        console.log("remove clip error:" , err);
        return res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
      }
    );
  }).catch(function (err) {
    console.error("error occurred trying to update user's clip removal", err);
    return res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
  });

}
