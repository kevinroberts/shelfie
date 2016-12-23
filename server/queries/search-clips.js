const Clip = require('../models/clip');
const env = require('get-env')();

/**
 * Searches through the Clip collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {String} sortOrder 'asc' or 'desc'
 * @param {Number} offset How many records to skip in the result set
 * @param {Number} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [clips], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, sortOrder, offset = 0, limit = 20) => {
  if (!sortOrder) {
    sortOrder = 'asc';
  }
  const query = Clip.find(buildQuery(criteria))
    .sort({ [sortProperty]: sortOrder })
    .skip(offset)
    .limit(limit);

  if (env !== 'prod') {
    console.time('search clip operation');
  }

  return Promise.all([query, Clip.find(buildQuery(criteria)).count()])
    .then((results) => {
      if (env !== 'prod') {
        console.timeEnd('search clip operation');
      }
      return {
        all: results[0],
        count: results[1],
        offset: offset,
        totalPages: Math.ceil(results[1]/ limit),
        currentPage: offset / limit + 1,
        limit: limit
      };
    });
};

const buildQuery = (criteria) => {
  const query = {};

  if (criteria.title) {
    query.$text = { $search: criteria.title };
  }

  if (criteria.tags) {
    query.tags = { $in : criteria.tags }
  }

  if (criteria.length) {
    query.length = {
      $gte: criteria.length.min,
      $lte: criteria.length.max
    };
  }

  return query;
};
