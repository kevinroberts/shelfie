const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClipSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, unique: true },
  sourceUrl: String,
  description: String,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' } ],
  length: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


// Create the model class
const ModelClass = mongoose.model('Clip', ClipSchema);

// Export the model
module.exports = ModelClass;