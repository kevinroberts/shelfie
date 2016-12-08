const Clip = require('../models/clip');

/**
 * Searches through the Clip collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [clips], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Clip.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Clip.find(buildQuery(criteria)).count()])
    .then((results) => {
      return {
        all: results[0],
        count: results[1],
        offset: offset,
        limit: limit
      };
    });
};

const buildQuery = (criteria) => {
  const query = {};

  if (criteria.title) {
    query.$text = { $search: criteria.title };
  }

  if (criteria.length) {
    query.length = {
      $gte: criteria.length.min,
      $lte: criteria.length.max
    };
  }

  return query;
};
