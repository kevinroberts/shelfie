const log = require('../helpers/logging')
var MongoClient = require('mongodb').MongoClient
var _ = require('lodash')

var getAllClips = function (db, callback) {
  // Get the clips collection
  var collection = db.collection('clips')

  collection.find({}).toArray(function (err, clips) {
    if (err) {
      log.error('error on find', err)
    }
    // console.log('Found the following records')
    // console.dir(clips)
    callback(clips)
  })
}

var updateClip = function (db, clipToUpdate, callback) {
  // Get the clips collection and update the source URL
  let oldSourceUrl = clipToUpdate.sourceUrl
  let newSourceUrl = '/static'

  oldSourceUrl = oldSourceUrl.substr(oldSourceUrl.indexOf('/clips/'), oldSourceUrl.length)

  newSourceUrl = newSourceUrl + oldSourceUrl
  log.debug('new url ', newSourceUrl)

  var collection = db.collection('clips')

  collection.updateOne({ _id: clipToUpdate._id }
    , { $set: { sourceUrl: newSourceUrl } }, function (err, result) {
      if (err) {
        log.error('error on db update', err)
      }
      callback(result)
    })
}

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, function (err, db) {
  if (err) {
    log.error('could not connect to db', err)
  }
  log.debug('Connected correctly to db server')

  getAllClips(db, function (clips) {
    log.debug('clips returned: ', clips.length)
    _.forEach(clips, function (clip) {
      log.debug('clip - ', clip._id)
      updateClip(db, clip, function (result) {
        log.debug('clip updated.')
      })
    })
  })
})

