const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TagSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  clips: [{ type: Schema.Types.ObjectId, ref: 'Clip' }]
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})

// Create the model class
const ModelClass = mongoose.model('Tag', TagSchema)

// Export the model
module.exports = ModelClass
