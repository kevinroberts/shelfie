const Clip = require('../models/clip');
const Checkit = require('checkit');
const Tag = require('../models/tag');
const User = require('../models/user');
const Validator = require('../helpers/checkit-validation');
const xss = require('xss');

exports.createClip = function(req, res, next) {
  const authedUser = req.user;
  const clipValidator = new Checkit(Validator.clipValidation);

  clipValidator.run(req.body).then((validated)=>{

    var tag = new Tag({
      name: "Video games"
    });

    tag.save(function (err) {
      var clip = new Clip({
        title : xss(validated.title, {}),
        sourceUrl: '/static/gameover.wav',
        length: 1234,
        _creator: authedUser._id
      });

      clip.tags.push(tag);

      clip.save(function (err) {
        if (err) { return next(err); }

        authedUser.clips.push(clip);
        authedUser.save(function (err) {
          if (err) { return next(err); }

          // respond with successfully created clip
          return res.json({clip});

        });


      });

    });

  }).catch( function(err) {
    console.log(err);
    return res.status(422).send(err.toJSON());
  });

};

exports.getClips = function (req, res, next) {

};

