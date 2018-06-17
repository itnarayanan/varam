import mongoose from 'mongoose';
import util from 'util';
import gridfs from 'gridfs-stream';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
gridfs.mongo = mongoose.mongo;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {  autoReconnect : true });

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

var gfs = null;
mongoose.connection.once('open', function () {
  gfs = gridfs(mongoose.connection.db);
  global.gfs = gfs;
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
   // debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

export default {app, gfs};