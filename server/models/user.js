const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;

// Define our model
const userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  firstName: String,
  lastName: String,
  timezone: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  clips: [{ type: Schema.Types.ObjectId, ref: 'Clip' } ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt then run callback
  bcrypt.genSalt(process.env.SALT_WORK_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model('User', userSchema);

// Export the model
module.exports = ModelClass;
