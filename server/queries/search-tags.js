const Tag = require('../models/tag');
const env = require('get-env')();

/**
 * Searches through the Tag collection
 * @param {object} criteria An object with a name, clips, createdAt
 * @param {string} sortProperty The property to sort the results by
 * @param {Number} offset How many records to skip in the result set
 * @param {Number} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [tags], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Tag.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit);

  if (env !== 'prod') {
    console.time('search tags operation');
  }

  return Promise.all([query, Tag.find(buildQuery(criteria)).count()])
    .then((results) => {
      if (env !== 'prod') {
        console.timeEnd('search tags operation');
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

  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }

  if (criteria.clips) {
    query.clips = { $in : criteria.clips }
  }

  return query;
};
