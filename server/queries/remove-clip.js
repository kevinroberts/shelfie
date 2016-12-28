const Clip = require('../models/clip');

/**
 * Removes a single clip in the Clips collection
 * @param {string} _id - The ID of the clip to remove.
 * @return {promise} A promise that resolves when the record is removed
 */
module.exports = (_id) => {
  return Clip.remove({ _id });
};
