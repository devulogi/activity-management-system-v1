const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const { ADMIN, USER, PARTICIPANT } = require("../constants").ROLES;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return v && v.length > 6;
      },
      message: "Username must be at least 6 characters long",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: [ADMIN, USER, PARTICIPANT],
    default: USER,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  // bcrypt compare takes a candidate password and a hash and returns a boolean
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err); // return the error
    }
    cb(null, isMatch); // return the boolean
  });
};

UserSchema.pre("save", function (next) {
  // check if document is new or a new password has been modified
  if (this.isNew || this.isModified("password")) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, 10, function (err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  }
});

module.exports = mongoose.model("User", UserSchema);
