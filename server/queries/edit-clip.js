const Clip = require('../models/clip')

/**
 * Edits a single clip in the Clips collection
 * @param {string} _id - The ID of the clip to edit.
 * @param {object} clipProps - An object with a
 * @return {promise} A promise that resolves when the record is edited
 */
module.exports = (_id, clipProps) => {
  return Clip.update({ _id }, clipProps)
}
