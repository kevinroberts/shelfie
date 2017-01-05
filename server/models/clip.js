const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClipSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, unique: true, required: true },
  sourceUrl: String,
  description: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' } ],
  length: Number, // length is in milliseconds --> ex. 1.4 sec * 1000 = 1400
  audioChannels: Number,
  sampleRate: Number,
  bitPerSample: Number,
  fileSize: Number, // number in bytes 16000 -> 16kB
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ClipSchema.index({title: 'text', description: 'text'});

// Create the model class
const ModelClass = mongoose.model('Clip', ClipSchema);

// Export the model
module.exports = ModelClass;