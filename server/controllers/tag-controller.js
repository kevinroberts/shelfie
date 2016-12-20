const Clip = require('../models/clip');
const Tag = require('../models/tag');
const xss = require('xss');
const SearchTags = require('../queries/search-tags');
const _ = require('lodash');
const mongoose = require('mongoose');
const Checkit = require('checkit');
const Validator = require('../helpers/checkit-validation');
const EditTag = require('../queries/edit-tag')


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
      if (err) { return next(err); }

      // respond with successfully created clip
      return res.json({tag});
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

    EditTag(validated._id, updatedProps).then((result = []) =>
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