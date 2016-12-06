const Clip = require('../models/clip');
const Checkit = require('checkit');
const Tag = require('../models/tag');
const Validator = require('../helpers/checkit-validation');
const xss = require('xss');

exports.createTag = function (req, res, next) {
  const authedUser = req.user;

  const name = req.body.name;

  if (!name) {
    return res.status(422).send({ _error: 'A tag name is required.'});
  }

  Tag.findOne({ name: name }, function(err, existingTag) {

    if (existingTag) {
      return res.status(422).send({ _error: 'A tag with that name already exists.' });
    }

    var tag = new Tag({
      name: xss(name, {}),
      _creator: authedUser._id
    });

    tag.save(function (err) {
      if (err) { return next(err); }

      // respond with successfully created clip
      return res.json({tag});
    });

  });

};