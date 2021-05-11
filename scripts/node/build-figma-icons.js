const del = require('del')
const fs = require('fs')
const AWS = require('aws-sdk')
const async = require('async')
const gIcons = require('./build-icons')
const map = require('./map.json')


const rootDest = './dist'
const promises = []


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
}


/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
 const createDirs = (arrPaths) => {
  arrPaths.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true})
    }
  })
}


/**
 * Fetch icons from S3 and move them into appropriate directories in dist.
 * 
 * @param {*} config 
 */
function fetchIcons(config) {
  return new Promise((resolve, reject) => {
    AWS.config.update({ region: config.source.region })

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
    const bucket_name = config.source.bucket_name
    const prefix = config.source.prefix
    const destination_path = config.destination_path
    const destination = rootDest + '/' + destination_path
    let bucketParams = {
      Bucket: bucket_name,
      Prefix: prefix
    }

    del.sync([destination]);
    createDirs([destination])

    s3.listObjects(bucketParams, function (err, data) {
      if (err) return console.log(err)

      async.eachSeries(data.Contents, function (fileObj, callback) {
        var key = fileObj.Key
        console.log('Downloading: ' + key)

        var fileParams = {
          Bucket: bucket_name,
          Key: key
        }

        s3.getObject(fileParams, function (err, fileContents) {
          if (err) {
            callback(err);
          } else {
            let content = fileContents.Body.toString()
            let fileName = key.replace(prefix, '')
            
            fs.writeFile(destination + '/' + fileName, content, err => {
              if (err) {
                console.error(err)
                return
              }
            })

            callback()
          }
        });
      }, function (err) {
        if (err) {
          console.log('Failed: ' + err)
          reject()
        } else {
          console.log('Finished')
          resolve()
        }
      })
    })
  })
}

function run(src, dest) {
  return new Promise((resolve, reject) => {
    if (map.length == 0) {
      reject()
    }

    for (let i = 0; i < map.length; i++) {
      promises.push(() => {
        return fetchIcons(map[i])
      })
    
      promises.push(() => {
        return gIcons.optimizeSVGs('./dist/' + map[i].destination_path)
      })
    }

    runSync(promises).then(() => {})
    resolve()
  })
}

module.exports = run;