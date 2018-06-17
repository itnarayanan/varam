import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },
  // POST /api/posts
  createPost: {
    body: {
      title: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      id: Joi.string().hex().required()
    }
  },

  // UPDATE /api/posts/:postId
  updatePost: {
    body: {
      title: Joi.string().required(),
    },
    params: {
      postId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  signup: {
    body :{
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      fatherName: Joi.string().required(),
      motherName: Joi.string().required(),
      mobileNumber: Joi.string().required(),
      aadhar: Joi.string()
    }
  }
};
