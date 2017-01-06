const Clip = require('../models/clip');
const env = require('get-env')();

/**
 * Searches through the Clip collection
 * @param {object} criteria An object with a title, tags etc..
 * @param {string} sortProperty The property to sort the results by
 * @param {String} sortOrder 'asc' or 'desc'
 * @param {Number} offset How many records to skip in the result set
 * @param {Number} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the clips, count, offset, sort, total pages, current page, and limit
 * like this: { all: [clips], count: count, totalPages: totalPages, currentPage: currentPage, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, sortOrder, offset = 0, limit = 20) => {

  let sortPropertyWithOrder = sortProperty;

  if (!sortOrder) {
    sortOrder = 'asc';
  }

  if (sortProperty === 'titleAZ') {
    sortProperty = 'title';
    sortOrder = 'asc';
    sortPropertyWithOrder = "titleAZ";
  }

  if (sortProperty === 'titleZA') {
    sortProperty = 'title';
    sortOrder = 'desc';
    sortPropertyWithOrder = "titleZA";
  }

  if (sortProperty === 'lengthPlus') {
    sortProperty = 'length';
    sortOrder = 'asc';
    sortPropertyWithOrder = "lengthPlus";
  }

  if (sortProperty === 'lengthMinus') {
    sortProperty = 'length';
    sortOrder = 'desc';
    sortPropertyWithOrder = "lengthMinus";
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
        title: criteria.title,
        sort: sortPropertyWithOrder,
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
