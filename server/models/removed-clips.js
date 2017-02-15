const mongoose = require('mongoose')
const Schema = mongoose.Schema

var RemovedClipSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  clipId: { type: String },
  title: { type: String, unique: false, required: true },
  sourceUrl: String,
  description: String,
  length: Number, // length is in milliseconds --> ex. 1.4 sec * 1000 = 1400
  audioChannels: Number,
  sampleRate: Number,
  bitPerSample: Number,
  fileSize: Number, // number in bytes 16000 -> 16kB
  processed: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})

// Create the model class
const ModelClass = mongoose.model('RemovedClip', RemovedClipSchema)

// Export the model
module.exports = ModelClass
