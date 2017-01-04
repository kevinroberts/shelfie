const Clip = require('../models/clip');
const Tag = require('../models/tag');
const xss = require('xss');
const SearchTags = require('../queries/search-tags');
const _ = require('lodash');
const mongoose = require('mongoose');
const Checkit = require('checkit');
const Validator = require('../helpers/checkit-validation');
const EditTag = require('../queries/edit-tag');
const ObjectID = require('mongodb').ObjectID;
const async = require('async');
const ClipController = require('./clip-controller');


exports.createTag = function (req, res, next) {
  const authedUser = req.user;

  const name = req.body.name;
  const clip = req.body.clip;

  if (!name) {
    return res.status(422).send({ _error: 'A tag name is required.'});
  }
  let properties = { name: xss(name, {}), _creator: authedUser._id};

  if (clip) {
    properties.clips = [clip];
  }

  Tag.findOne( { name: name } , function(err, existingTag) {

    if (existingTag) {
      return res.status(422).send({ _error: 'A tag with that name already exists.' });
    }

    var tag = new Tag(properties);

    tag.save(function (err) {
      if (err) {
        console.error('problem saving tag', err);
        return next(err);
      }

      // check if we should add the newly created tag to the clip
      const addToClip = req.body.addToClip;
      if (addToClip && clip) {
        ClipController.addTagToClip(clip, tag._id, function (err, result) {
          if (err) {
            console.error('problem saving tag to clip', err);
            return next(err);
          }
          return res.json({tag});
        })
      } else {
        // respond with successfully created tag
        return res.json({tag});
      }


    });

  });

};

exports.addClipToTag = function (tagID, clipID, cb) {
  Tag.findOne({ _id: tagID }, function(err, existingTag) {

    existingTag.clips.push(clipID);

    existingTag.save(function (err) {
      if (err) {
        return cb(err);
      }

      // respond with successfully updated tag
      return cb(err, existingTag);
    });

  });
};

exports.getTags = function (req, res, next) {

  let limit = req.query.limit ? _.toNumber(req.query.limit) : 150;
  let offset = req.query.offset ? _.toNumber(req.query.offset) : 0;
  let clips = req.query.clips ? _.split(req.query.clips, ',') : null;

  let criteria = {name: ''};

  if (clips) {
    criteria.clips = clips;
  }

  if (!_.isInteger(limit) || !_.isInteger(offset)) {
    return res.status(422).send({ _error: 'Invalid query format.' });
  }

  SearchTags(criteria, 'name', offset, limit).then((result = []) =>
      res.json(result)
  ).catch (function (err) {
      console.log("query error:" , err);
      res.status(500).send({ _error: 'A server error occurred while tyring to process your request. Please try again later.' })
    }
  );

};


/**
 * Removes the associated tag from a given clip
 * @param req
 * @param res
 * @param next
 * @returns {*|void}
 */
exports.removeTag = function (req, res, next) {
  const authedUser = req.user;

  const tagId = req.body.tagId;
  const clipId = req.body.clipId;

  if (!tagId) {
    return res.status(422).send({ _error: 'A tag id is required.'});
  }
  if (!clipId) {
    return res.status(422).send({ _error: 'A tag id is required.'});
  }

  const clipIdObject = new ObjectID(clipId);

  if (!_.find(authedUser.clips, clipIdObject)) {
    return res.status(422).send({ _error: 'You may only edit clips that you have created.'});
  }

  async.waterfall([
    function(done) {
      // remove the tag from the clip
      const updateClip = Clip.update({_id: clipId}, {$pullAll: { tags: [tagId] } } );
      updateClip.then(function (updatedClip) {
        done(null, updatedClip);
      }).catch(function (err) {
        done(err);
      });
    },function (updatedClip, done) {
      // remove the clip from the tag
      const updateTag = Tag.update({_id: tagId}, {$pullAll: { clips: [clipId] } } );
      updateTag.then(function (updatedTag) {
        done(null, updatedTag);
      }).catch(function (err) {
        done(err);
      });

    }], function(err, updatedTag) {
      if (err) {
        console.error('error occurred remove tag from clip: ', err);
        return res.status(422).send({ _error: 'Error occurred trying to remove tag from clip.'});
      } else {
        return res.json({updatedTag});
      }
    });

};

exports.editTag = function (req, res, next) {
  const authedUser = req.user;
  const tagValidator = new Checkit(Validator.editTagValidation);

  tagValidator.run(req.body).then((validated)=>{

    let updatedProps = {};

    if (validated.name) {
      updatedProps.name = validated.name;
    }

    if (req.body.clips && _.isArray(req.body.clips)) {
      updatedProps.clips = req.body.clips;
    }

    EditTag(validated._id, updatedProps).then((result = []) => {
      // check if we should add the tag to the clip as well
      const addToClip = req.body.addToClip;
      const clipId = req.body.clipId;
      if (addToClip && clipId) {
        const clipIdObject = new ObjectID(clipId);
        if (!_.find(authedUser.clips, clipIdObject)) {
          return res.status(422).send({ _error: 'You may only edit clips that you have created.'});
        }
        ClipController.addTagToClip(clipId, validated._id, function (err, result) {
          if (err) {
            console.error('problem saving tag to clip', err);
            return next(err);
          }
          return res.json({message: 'Your clip was successfully updated.'});
        })
      } else {
        res.json({message: 'Your clip was successfully updated.'});
      }



    }).catch (function (err) {
        console.log("edit clip error:" , err);
        res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
      }
    );

  }).catch( function(err) {
    return res.status(422).send(err.toJSON());
  });

};