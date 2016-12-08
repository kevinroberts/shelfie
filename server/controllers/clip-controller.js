const Clip = require('../models/clip');
const Checkit = require('checkit');
const Tag = require('../models/tag');
const TagController = require('./tag-controller');
const User = require('../models/user');
const async = require('async');
const Validator = require('../helpers/checkit-validation');
const SearchClips = require('../queries/search-clips');
const xss = require('xss');
const _ = require('lodash');

exports.createClip = function(req, res, next) {
  const authedUser = req.user;
  const clipValidator = new Checkit(Validator.clipValidation);

  clipValidator.run(req.body).then((validated)=>{

      var clip = new Clip({
        title : xss(validated.title, {}),
        sourceUrl: validated.sourceUrl,
        tags : [ '58472b4d23f5229b16a0bd1c', '584727de6574dd6df2406f5a'],
        length: 9.9874,
        _creator: authedUser._id
      });

    async.waterfall([
      function(done) {
        Clip.findOne({title: validated.title}, function (err, existingClip) {
          if (existingClip) {
            return res.status(422).send({ _error: 'A clip with that name already exists.' });
          } else {
            done(err, clip)
          }
        })
      },
      function(clip, done) {
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
        TagController.addClipToTag('58472b4d23f5229b16a0bd1c', clip._id, function (err, tag) {

          done(err, clip);

        });
      },
      function (clip, done) {
        TagController.addClipToTag('584727de6574dd6df2406f5a', clip._id, function (err, tag) {

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

exports.getClips = function (req, res, next) {
  let limit = req.query.limit ? _.toNumber(req.query.limit) : 150;
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
      res.status(500).send({ _error: 'A server error occurred while tyring to process your request. Please try again later.' })
    }
  );
};

