const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FavoriteSchema = new mongoose.Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _clip: { type: Schema.Types.ObjectId, ref: 'Clip' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

// Create the model class
const ModelClass = mongoose.model('Clip', FavoriteSchema);

// Export the model
module.exports = ModelClass;