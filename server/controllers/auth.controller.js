import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
import UserLogin from '../models/login.model';
import User from '../models/user.model';
import moment from "moment";

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  console.log("req.params.username...", req.body.username);
  return UserLogin.getUserByuserName(req.body.username).then(user => {
    if (user && req.body.username === user.username && req.body.password === user.password) {
      res.status(200).json(genToken(user));
    } else {
      res.status(401).json({ "message": "Invalid credentials"});
    }
  });
}

function genToken(user) {
  let expires = moment().utc().add({ days: 1 }).unix();
      const token = jwt.sign({
        exp: expires,
        //expiresInMinutes: 1440 // expires in 24,
        username: user.username
      }, config.jwtSecret);
      return {
        token:token,
        expires: moment.unix(expires).format(),
        username: user.username,
        _id: user._id
      };
}


function getUserLoginDeailsByUserName(req, res, next){
  UserLogin.getUserByuserName(req.params.username).then(doc => {
    if(doc) {
      return res.json({message:"DATA_FOUND", data:doc});
    } else {
      return res.json({message:"DATA_NOT_FOUND", data:doc});
    }
  });
}

function updateRole(req, res, next) {
  UserLogin.getUserByuserName(req.body.username).then(doc => {
    if (doc) {
       doc.role = req.body.role;
       var userLogin = new UserLogin(doc);
       userLogin.save()
        .then(updatedRoleResult => {
          console.log("savedUser.........", updatedRoleResult)
          res.status(200).json({ "message": "role updated Successfly", "data": updatedRoleResult.role})
        })
        .catch(e => {
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        });
    } else{
      res.status(200).json({ "message": "USER_NOT_FOUND", "data": null })
    }
  });
}


function signup(req, res, next) {
  UserLogin.getUserByuserName(req.body.username).then(doc => {
    if (doc) {
      const err = new APIError('Duplication error', httpStatus.NOT_ACCEPTABLE, true);
      return next(err);
    }
    else {
      // Ideally you'll fetch this from the db
      // Idea here was to show how jwt works with simplicity
      const userLogin = new UserLogin({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        aadhar: req.body.aadhar,
        mobileNumber: req.body.mobileNumber,
        role: "NORMAL",
        createdAt: new Date()
      });

      userLogin.save()
        .then(savedUser => {
          console.log("savedUser.........", savedUser)
          saveUserDeitals(savedUser, function (err, result) {
            if (err) {
              const err = new APIError(' error in saving user details', httpStatus.NOT_ACCEPTABLE, true);
              return next(err);
            }
            res.status(200).json({ "message": "Account Created Successfly", "data": result })
          })
        })
        .catch(e => {
          const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
          return next(err);
        });
    }
  });
}
/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

function saveUserDeitals(user, next) {
  console.log("saveUserDetails invoked............", user);
  User.findOneAndUpdate({"aadhar":user.aadhar},{$set:{userRegistrationId:user._id,name:user.name,fatherName:user.fatherName,motherName:user.motherName,mobileNumber:user.mobileNumber}},function(err, data) {
    console.log("saveUserDeitals....",err,data);
    if(!data) {
      const userDetails = new User({
        name: user.name,
        fatherName: user.fatherName,
        motherName: user.motherName,
        aadhar: user.aadhar,
        userRegistrationId: user._id,
        mobileNumber: user.mobileNumber,
        address: '',
        email: '',
        marriedStatus: '',
        educationStatus: '',
        marriedMember: '',
        linkedId: '',
        linkedStatus: 'NO',
        profilePhotoPath: "../../../assets/user.jpg"
      });
    
      userDetails.save()
        .then(savedUser => {
          console.log("saveUserDetails in User Db............", savedUser);
          next(null, savedUser)
        })
        .catch(e => next(e));
    } else {
      next(err);
    }
  });
}

export default { login, getUserLoginDeailsByUserName, getRandomNumber, updateRole, signup };
