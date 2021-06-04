const del = require('del')
const fs = require('fs')
const AWS = require('aws-sdk')
const async = require('async')
const axios = require('axios')
const swlog = require('./utilities/stopwatch-log.js')
const util = require('util')
const copyFile = util.promisify(fs.copyFile)
const unlink = util.promisify(fs.unlink)
const path = require('path')  


const gIcons = require('./build-icons')
const map = require('./map.json')
const apiEndpoint = 'https://g4zv2x9d77.execute-api.us-east-1.amazonaws.com/prod/api'
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
 * Move a file to another destination.
 * 
 * @param {string} file - Path to file to be moved.
 * @param {string} dest - New location.
 */
function moveFileTo(file, dest) {
    const fileName = path.basename(file)
    const destPath = path.join(dest, fileName)
    copyFile(file, destPath)
    unlink(file)
}


/**
 * Generate a themes metadata.json for dist/
 * 
 * @param {integer} col_id - Collection id.
 * @param {string} dest - Path to place the metadata.json file to.
 * @returns 
 */
 function generateMeta(col_id, dest) {
  return new Promise((resolve, reject) => {
    const startTaskName = swlog.logTaskStart(`creating themes figma metadata file ${dest}`)

    axios.get(`${apiEndpoint}/collections/${col_id}/`)
    .then((response) => {
      try {
        const metaObj = response.data.meta_data.exported_list
        
        if (metaObj) {
          createDirs([dest])
          fs.writeFileSync(`${dest}/metadata.json`, JSON.stringify(metaObj, null, 4), 'utf-8')
        }

        resolve()
      } catch (e) {
        console.log(e)
      }
    })
    .catch(error => {
      console.log(error)
      reject()
    })
  })
}


/**
 * Fetch icons from S3 and move them into appropriate directories in dist.
 * 
 * @param {object} config - Export configuration object.
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
      Delimiter: '/svg',
      Prefix: `${prefix}/svg`
    }

    createDirs([`${destination}/svg`])

    s3.listObjects(bucketParams, function (err, data) {
      if (err) return console.log(err)

      async.eachSeries(data.Contents, function (fileObj, callback) {
        var key = fileObj.Key

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
            
            fs.writeFile(`${destination}${fileName}`, content, err => {
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


/**
 * Fetch Figma exported icons, 
 * and generate additional metadata files.
 * 
 * @returns promise
 */
function run() {
  return new Promise((resolve, reject) => {
    if (map.length == 0) {
      reject()
    }

    for (let i = 0; i < map.length; i++) {
      promises.push(() => {
        console.log(`Fetching icons into ${map[i].destination_path}/svg.`)
        return fetchIcons(map[i])
      })
    
      promises.push(() => {
        console.log(`Optimizing icons in ${map[i].destination_path}/svg.`)
        return gIcons.optimizeSVGs(`./dist/${map[i].destination_path}/svg`)
      })

      promises.push(() => {
        console.log(`Moving path-data.json to ${map[i].destination_path}.`)
        let file = `./dist/${map[i].destination_path}/svg/path-data.json`
        let dest = `./dist/${map[i].destination_path}`
        
        return moveFileTo(file, dest)
      })

      promises.push(() => {
        console.log(`Generating meta in ${map[i].destination_path}.`)
        const dest = `./dist/${map[i].destination_path}`
        return generateMeta(map[i].source.col_id, dest)
      })
    }

    runSync(promises).then(() => {})
    resolve()
  })
}

module.exports = run;