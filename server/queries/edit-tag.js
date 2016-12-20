const Tag = require('../models/tag');

/**
 * Edits a single tag in the Tags collection
 * @param {string} _id - The ID of the tag to edit.
 * @param {object} tagProps - An object with a
 * @return {promise} A promise that resolves when the record is edited
 */
module.exports = (_id, tagProps) => {
  return Tag.update({ _id }, tagProps);
};
