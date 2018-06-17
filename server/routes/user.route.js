import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import userCtrl from '../controllers/user.controller';
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.list)

  /** POST /api/users - Create new user */
  .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.createUser), userCtrl.create);

router.route('/profilePhoto/:filename')
  .delete(expressJwt({ secret: config.jwtSecret }), userCtrl.deletFile);

router.route('/upload')
  .post(userCtrl.uploadFile);
  
router.route('/profilePhoto/:filename')
  .get(userCtrl.readFile)
  
router.route('/allLinked/:linkedId')
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.getUsersDetailsByLinkedId)

router.route("/search")
  .post(expressJwt({ secret: config.jwtSecret }), userCtrl.search)

router.route('/:id')
  /** GET /api/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({ secret: config.jwtSecret }), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('id', userCtrl.load);

export default router;
