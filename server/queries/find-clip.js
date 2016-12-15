const Clip = require('../models/clip');

/**
 * Finds a single clip in the clip collection.
 * @param {string} _id - The ID of the record to find.
 * @return {promise} A promise that resolves with the Clip that matches the id
 */
module.exports = (_id) => {
  return Clip.findById(_id).populate({
    path: 'tags'
  }).populate({
    path: '_creator'
  });
};
