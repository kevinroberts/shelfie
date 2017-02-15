const log = require('../helpers/logging')
const Tag = require('../models/tag')
const now = require('performance-now')

/**
 * Searches through the Tag collection
 * @param {object} criteria An object with a name, clips, createdAt
 * @param {string} sortProperty The property to sort the results by
 * @param {Number} offset How many records to skip in the result set
 * @param {Number} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the tags, count, offset, total pages, current page, and limit
 * like this: { all: [tags], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Tag.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit)

  var t0 = now()

  return Promise.all([query, Tag.find(buildQuery(criteria)).count()])
    .then((results) => {
      var t1 = now()
      log.debug('search tags operation finished took: ' + (t1 - t0).toFixed(3) + ' milliseconds.')
      return {
        all: results[0],
        count: results[1],
        offset: offset,
        totalPages: Math.ceil(results[1] / limit),
        currentPage: offset / limit + 1,
        limit: limit
      }
    })
}

const buildQuery = (criteria) => {
  const query = {}

  if (criteria.name) {
    query.$text = { $search: criteria.name }
  }

  if (criteria.clips) {
    query.clips = { $in: criteria.clips }
  }

  return query
}
