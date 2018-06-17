import User from '../models/user.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next(null,req);
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  console.log("req.params.id...",req.params.id)
  var id = req.params.id;
  User.get(id)
    .then((user) => {
      if (user) {
        return res.json({"message":"DATA_FOUND", data:user});
      } else {
        return res.json({"message":"DATA_NOT_FOUND", data:null});
      }
    });
}

/**
 * Create new user
 * @property {string} req.body.userName - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    name: req.body.name,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    address: req.body.address,
    email: req.body.email,
    aadhar: req.body.aadhar,
    marriedStatus: req.body.marriedStatus,
    educationStatus: req.body.educationStatus,
    marriedMember: req.body.marriedMember,
    linkedId: req.body.linkedId,
    linkedStatus: req.body.linkedStatus,
    userRegistrationId: req.body.userRegistrationId,
    profilePhotoPath: req.body.profilePhotoPath,
    editContact: req.body.editContact,
    mobileNumber: req.body.mobileNumber
  });

  user.save()
    .then(savedUser => res.status(200).json({ "message": "User Created Successfly", "data": savedUser }))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body - The req.body of user.
 * @property {string} req.params.id - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  var upateContent = req.body;
  delete upateContent._id;
  console.log("req.params.id...",req.params.id)
  
  User.findByIdAndUpdate(
    // the id of the item to find
    req.params.id,

    // the change to be made. Mongoose will smartly combine your existing 
    // document with this change, which allows for partial updates too
    upateContent,

    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
    { new: true },


    // the callback function
    (err, docs) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.status(200).json(docs);
    })
}

function getUsersDetailsByLinkedId(req, res, next) {
  console.log("req.params.id....",req.params.linkedId)
  User.find({ "linkedId": { "$regex": req.params.linkedId + ".*", "$options": "i" } }, function(err, doc) {
      if (err) {
        return res.status(400).json("No  data exists");
      } else {
        return res.status(200).json(doc);
      }
      
    });
}

function search(req, res, next) {
  var query = null;
  console.log("req.params.key....",req.body.key,req.body.value)
  if (req.body.key==="FATHER") {
    query = { fatherName : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="MOTHER") {
    query = { motherName : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="MARRIEDMEMBER") {
    query = { marriedMember : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="LINKEDID") {
    query = { linkedId : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="ADDRESS") {
    query = { address : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="MOBILENUMBER") {
    query = { mobileNumber : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="EMAIL") {
    query = { email : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else if (req.body.key==="LINKEDID") {
    query = { linkedId : { "$regex": req.body.value + ".*", "$options": "i" } };
  } else {
    query = { name :{ "$regex": req.body.value + ".*", "$options": "i" } };
  }
  console.log("serach query..",query);
  User.find(query, function(err, doc) {
      if (err) {
        return res.status(400).json("No  data exists");
      } else {
        console.log("doc..",doc)
        return res.status(200).json(doc);
      }
      
    });
}
/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  console.log("remove user id...",req.params.id)
  User.findByIdAndRemove(
    // the id of the item to find
    req.params.id,
    (err, docs) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.status(200).json(docs);
    });
}

function uploadFile(req, res) {
  var gfs = global.gfs;
  console.log("req.files............", req.body.filename);
  var part = req.files.file;
  var writeStream = gfs.createWriteStream({
    filename: req.body.filename,
    mode: 'w',
    content_type: part.mimetype
  });

  writeStream.on('close', function () {
    console.log("successfully upated...");
    return res.status(200).send({
      message: 'Success'
    });
  });

  writeStream.write(part.data);
  writeStream.end();
}

function deletFile(req, res) {
  var gfs = global.gfs;
  gfs.exist({ filename: req.params.filename }, function (err, file) {
    if (err || !file) {
      res.status(200).json({ "message": 'File Not Found' ,"err":err})
    } else {
      gfs.remove({ filename: req.params.filename }, function (err) {
        if (err) res.status(500).json({ "err": err })
        res.status(200).json({ "message": "File Deleted'" });
      });
    }
  });
}

function readFile(req, res) {
  var gfs = global.gfs;
  gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {

    if (files.length === 0) {
      return res.status(400).send({
        message: 'File not found'
      });
    }

    res.writeHead(200, { 'Content-Type': files[0].contentType });

    var readstream = gfs.createReadStream({
      filename: files[0].filename
    });

    readstream.on('data', function (data) {
      res.write(data);
    });

    readstream.on('end', function () {
      res.end();
    });

    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });
  });
}

export default { search, load, get, create, update, list, remove, getUsersDetailsByLinkedId, readFile, uploadFile, deletFile };
