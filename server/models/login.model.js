import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  aadhar: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
LoginSchema.method({
});

/**
 * Statics
 */
LoginSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getUserByuserName(username) {
    console.log("username...",username)
    return this.findOne({"username": username}, function(err, doc) {
        if (err) {
          console.log("err....",err);
          return null;
        } else {
          return doc;
        }
        
      });
  },

  getUserByAadhar(aadhar) {
    console.log("aadhar...",aadhar)
    return this.findOne({"aadhar": aadhar}, function(err, doc) {
        if (err) {
          console.log("err....",err);
          return null;
        } else {
          return doc;
        }
      });
  }
};

/**
 * @typedef Login
 */
export default mongoose.model('Login', LoginSchema);
