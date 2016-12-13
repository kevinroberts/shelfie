var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

var getAllClips = function(db, callback) {
  // Get the clips collection
  var collection = db.collection('clips');

  collection.find({}).toArray(function(err, clips) {
    // console.log("Found the following records");
    // console.dir(clips);
    callback(clips);
  });

};

var updateClip = function(db, clipToUpdate, callback) {
  // Get the clips collection and update the source URL
  // "http://static.vinberts.com/clips/mgs/alert_spotted.wav",
  let oldSourceUrl = clipToUpdate.sourceUrl;
  let newSourceUrl = '/static';

  oldSourceUrl = oldSourceUrl.substr(oldSourceUrl.indexOf('/clips/'), oldSourceUrl.length);

  newSourceUrl = newSourceUrl + oldSourceUrl;
  console.log('new url ', newSourceUrl);

  var collection = db.collection('clips');

  collection.updateOne({ _id : clipToUpdate._id }
    , { $set: { sourceUrl : newSourceUrl } }, function(err, result) {
      if (err) {
        console.log('error ', err);
      }
      callback(result);
    });
};


MongoClient.connect(process.env.MONGO_CONNECTION_STRING, function(err, db) {
  console.log("Connected correctly to server");

  getAllClips(db, function (clips) {
    console.log("clips returned: ", clips.length);
    _.forEach(clips, function (clip) {
      console.log("clip - ", clip._id);
      updateClip(db, clip, function (result) {
        console.log("clip updated.");
      });
    })
  });
});



