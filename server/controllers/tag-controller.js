const Clip = require('../models/clip');
const Tag = require('../models/tag');
const xss = require('xss');
const SearchTags = require('../queries/search-tags');
const _ = require('lodash');
const mongoose = require('mongoose');

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