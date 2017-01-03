const Clip = require('../models/clip');
const _ = require('lodash');
const Checkit = require('checkit');
const Validator = require('../helpers/checkit-validation');
const mongoose = require('mongoose');

/**
 * Handles requests to add and remove a User's favorite clips
 * @param req
 * @param res
 * @param next
 */
exports.createRemoveFavorite = function(req, res, next) {
  const authedUser = req.user;

  const favoriteValidation = new Checkit(Validator.favoritesValidation);

  favoriteValidation.run(req.body).then((validated)=>{

    if (validated.action === 'add') {
      authedUser.update({ $addToSet: { favoriteClips: validated.clipId }})
        .then((result = []) => {
          return res.json({message: 'Your favorite was successfully added.'});
        }).catch (function (err) {
          console.log("add favorite error:" , err);
          res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
        }
      );

    } else if (validated.action === 'remove') {

      authedUser.update({ $pullAll: { favoriteClips: [validated.clipId] }})
        .then((result = []) => {
          return res.json({message: 'Your favorite was successfully removed.'});
        }).catch (function (err) {
          console.log("remove favorite error:" , err);
          res.status(500).send({ _error: 'A server error occurred while trying to process your request. Please try again later.' });
        }
      );

    }

  }).catch( function(err) {
    return res.status(422).send(err.toJSON());
  });

};