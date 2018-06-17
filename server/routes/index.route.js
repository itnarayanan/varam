import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import config from '../config/config';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/posts', postRoutes);

/*router.use(function(req, res, next) {

  if (req.path.includes("/auth/login")) return next();

  // check header or url parameters or post parameters for token
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];

  var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, config.jwtSecret, function(err, decoded) {    
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            next();      
          }
        });
    } else {
          return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
});
*/
export default router;
