const del = require('del');
const fs = require('fs');
const AWS = require('aws-sdk');
const async = require('async');

const map = require('./map.json');

const rootDest = './dist';
const promises = [];

/**
 * Process promises synchronously
 * @param {object} arr
 */
const runSync = async (arr) => {
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    let r = await arr[i](); //eslint-disable-line
    results.push(r);
  }
  return results; // will be resolved value of promise
};

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
const createDirs = (arrPaths) => {
  arrPaths.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  });
};

/**
 * Fetch pngs from S3 and move them into appropriate directories in dist.
 *
 * @param {object} config - Export configuration object.
 */
function fetchPngs(config) {
  return new Promise((resolve, reject) => {
    AWS.config.update({ region: config.source.region });

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const { bucket_name } = config.source;
    const { prefix } = config.source;
    const { destination_path } = config;
    const destination = `${rootDest}/${destination_path}`;
    const bucketParams = {
      Bucket: bucket_name,
      Delimiter: '/png',
      Prefix: `${prefix}/png`
    };

    createDirs([`${destination}/png`]);

    s3.listObjects(bucketParams, (err, data) => {
      if (err) return console.log(err);

      async.eachSeries(data.Contents, (fileObj, callback) => {
        const key = fileObj.Key;

        const fileParams = {
          Bucket: bucket_name,
          Key: key
        };

        s3.getObject(fileParams, (err, fileContents) => {
          if (err) {
            callback(err);
          } else {
            const content = fileContents.Body;
            const fileName = key.replace(prefix, '');

            fs.writeFile(`${destination}${fileName}`, content, err => {
              if (err) {
                console.error(err);
              }
            });

            callback();
          }
        });
      }, (err) => {
        if (err) {
          console.log(`Failed: ${err}`);
          reject();
        } else {
          console.log('Finished');
          resolve();
        }
      });
    });
  });
}

/**
 * Fetch Figma exported pngs.
 *
 * @returns promise
 */
function run() {
  return new Promise((resolve, reject) => {
    if (map.length == 0) {
      reject();
    }

    for (let i = 0; i < map.length; i++) {
      promises.push(() => {
        console.log('Fetching pngs into', `${map[i].destination_path}/png`, 'dir.');
        return fetchPngs(map[i]);
      });
    }

    runSync(promises).then(() => { });
    resolve();
  });
}

module.exports = run;
