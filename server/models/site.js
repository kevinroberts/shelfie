const mongoose = require('mongoose')
const Schema = mongoose.Schema

var SiteSchema = new Schema({
  runModeID: { type: String, unique: true },
  lastUpdatedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  registrationEnabled: { type: Boolean }
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})

// Create the model class
const ModelClass = mongoose.model('Site', SiteSchema)

// Export the model
module.exports = ModelClass
