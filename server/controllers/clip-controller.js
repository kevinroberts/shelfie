const Clip = require('../models/clip');
const Checkit = require('checkit');
const Tag = require('../models/tag');
const TagController = require('./tag-controller');
const User = require('../models/user');
const async = require('async');
const Validator = require('../helpers/checkit-validation');
const xss = require('xss');

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

};

