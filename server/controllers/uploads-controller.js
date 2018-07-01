const log = require('../helpers/logging')
const fs = require('fs')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const multiparty = require('multiparty')
const wavFileInfo = require('wav-file-info')
const mm = require('music-metadata');
const Clip = require('../models/clip')
const async = require('async')
const xss = require('xss')
const path = require('path')

const uploadedFilesPath = process.env.UPLOADED_FILES_DIR + '/'
const maxFileSize = process.env.MAX_FILE_SIZE || 0 // in bytes, 0 for unlimited
const fileInputName = 'qqfile'
const chunkDirName = 'chunks'

exports.onUpload = function (req, res, next) {
  var form = new multiparty.Form()
  var user = req.user

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.warn('form parse error', err)
    }
    var partIndex = fields.qqpartindex

    // text/plain is required to ensure support for IE9 and older
    res.set('Content-Type', 'text/plain')

    if (partIndex == null) {
      onSimpleUpload(fields, files[fileInputName][0], res, user)
    } else {
      onChunkedUpload(fields, files[fileInputName][0], res)
    }
  })
}

exports.onDeleteFile = function (req, res) {
  var uuid = req.params.uuid
  var dirToDelete = uploadedFilesPath + uuid

  rimraf(dirToDelete, function (error) {
    if (error) {
      console.error('Problem deleting file! ' + error)
      res.status(500)
    }

    res.send()
  })
}

function onSimpleUpload (fields, file, res, user) {
  const uuid = fields.qquuid
  const responseData = {success: false}

  file.name = fields.qqfilename
  file.ext = path.extname(file.path).toLowerCase()

  if (isValid(file.size)) {
    // if file is valid -- process it and add to the User's clip inventory
    async.waterfall([
      function (done) {
        if (file.ext === '.mp3') {
          // const readableStream = fs.createReadStream(file.path)
          const mp3info = {artist: '', title: '', album: '', duration: 0, bitRate: 0}

          mm.parseFile(file.path, {native: true, duration: true, skipCovers: true})
            .then(function (metadata) {
              if (metadata.format.duration) {
                mp3info.duration = metadata.format.duration
              }
              if (metadata.format.bitrate) {
                mp3info.bitRate = metadata.format.bitrate
              }
              if (metadata.common && metadata.common.artist) {
                mp3info.artist = metadata.common.artist
              }
              if (metadata.common && metadata.common.album) {
                mp3info.album = metadata.common.album
              }
              if (metadata.common && metadata.common.title) {
                mp3info.title = metadata.common.title
              }
              done(null, mp3info)
            })
            .catch(function (err) {
              console.error(err.message)
              done(err)
            })
        } else if (file.ext === '.wav') {
          wavFileInfo.infoByFilename(file.path, function (err, info) {
            if (err) { done(err) }
            done(null, info)
          })
        }
      },
      function (info, done) {
        moveUploadedFile(file, uuid, function (destFileLocation) {
          done(null, info, file, destFileLocation)
        }, function () {
          done(info)
        })
      },
      function (info, file, destFileLocation, done) {
        const sourceLoc = destFileLocation.substr(
          destFileLocation.lastIndexOf('/client/') + 7, destFileLocation.length)
        let fileName = xss(file.name[0], {})
        let clip
        fileName = fileName.substr(0, fileName.lastIndexOf('.'))

        if (file.ext === '.mp3') {
          const artist = info.artist ? info.artist : ''
          let title = info.title ? info.title : fileName
          if (artist) {
            title = artist + ' - ' + title
          }
          const album = info.album ? info.album : ''
          const duration = info.duration ? Math.floor(info.duration * 1000) : 0

          clip = new Clip({
            title: title,
            sourceUrl: sourceLoc,
            artist: artist,
            album: album,
            length: duration,
            fileSize: file.size,
            bitRate: info.bitRate,
            type: 'mp3',
            _creator: user._id
          })
          if (info.track) {
            clip.track = info.track
          }
          if (info.disk) {
            clip.disk = info.disk
          }
          if (info.genre) {
            clip.genre = info.genre
          }
        } else {
          clip = new Clip({
            title: fileName,
            sourceUrl: sourceLoc,
            length: Math.floor(info.duration * 1000),
            fileSize: info.stats.size,
            sampleRate: info.header.sample_rate,
            audioChannels: info.header.num_channels,
            bitsPerSample: info.header.bits_per_sample,
            type: 'wav',
            _creator: user._id
          })
        }

        clip.save(function (err) {
          done(err, clip)
        })
      },
      function (clip, done) {
        user.clips.push(clip)
        user.save(function (err) {
          done(err, clip)
        })
      }], function (err, clip) {
      if (err) {
        let errMsg = `Problem with ${file.ext} file format, please try again with another file.`
        // check if a duplicate title error occurred
        if (err.code === 11000) {
          errMsg = `Sorry a clip with the title "${clip.title}" has already been uploaded. Please check the site to avoid duplicates.`
        }
        log.error('error occurred trying to upload a clip: ', err)
        responseData.error = errMsg
        return res.send(responseData)
      }
      responseData.success = true
      responseData.id = clip._id
      responseData.title = clip.title
      responseData.sourceUrl = clip.sourceUrl
      responseData.fileName = file.name[0]
      return res.send(responseData)
    })
  } else {
    failWithTooBigFile(responseData, res)
  }
}

function onChunkedUpload (fields, file, res) {
  var size = parseInt(fields.qqtotalfilesize)
  var uuid = fields.qquuid
  var index = fields.qqpartindex
  var totalParts = parseInt(fields.qqtotalparts)
  var responseData = {success: false}

  file.name = fields.qqfilename

  if (isValid(size)) {
    storeChunk(file, uuid, index, totalParts, function () {
      if (index < totalParts - 1) {
        responseData.success = true
        res.send(responseData)
      } else {
        combineChunks(file, uuid, function () {
          responseData.success = true
          res.send(responseData)
        },
        function () {
          responseData.error = 'Problem combining the chunks!'
          res.send(responseData)
        })
      }
    },
    function (reset) {
      responseData.error = 'Problem storing the chunk!'
      res.send(responseData)
    })
  } else {
    failWithTooBigFile(responseData, res)
  }
}

function moveFile (destinationDir, sourceFile, destinationFile, success, failure) {
  mkdirp(destinationDir, function (error) {
    var sourceStream, destStream

    if (error) {
      console.error('Problem creating directory ' + destinationDir + ': ' + error)
      failure()
    } else {
      sourceStream = fs.createReadStream(sourceFile)
      destStream = fs.createWriteStream(destinationFile)

      sourceStream
        .on('error', function (error) {
          console.error('Problem copying file: ' + error.stack)
          destStream.end()
          failure()
        })
        .on('end', function () {
          destStream.end()
          success(destinationFile)
        })
        .pipe(destStream)
    }
  })
}

function moveUploadedFile (file, uuid, success, failure) {
  var destinationDir = uploadedFilesPath + uuid + '/'
  var fileDestination = destinationDir + file.name

  moveFile(destinationDir, file.path, fileDestination, success, failure)
}

function storeChunk (file, uuid, index, numChunks, success, failure) {
  var destinationDir = uploadedFilesPath + uuid + '/' + chunkDirName + '/'
  var chunkFilename = getChunkFilename(index, numChunks)
  var fileDestination = destinationDir + chunkFilename

  moveFile(destinationDir, file.path, fileDestination, success, failure)
}

function combineChunks (file, uuid, success, failure) {
  var chunksDir = uploadedFilesPath + uuid + '/' + chunkDirName + '/'
  var destinationDir = uploadedFilesPath + uuid + '/'
  var fileDestination = destinationDir + file.name

  fs.readdir(chunksDir, function (err, fileNames) {
    var destFileStream

    if (err) {
      console.error('Problem listing chunks! ' + err)
      failure()
    } else {
      fileNames.sort()
      destFileStream = fs.createWriteStream(fileDestination, {flags: 'a'})

      appendToStream(destFileStream, chunksDir, fileNames, 0, function () {
        rimraf(chunksDir, function (rimrafError) {
          if (rimrafError) {
            log.error('Problem deleting chunks dir! ' + rimrafError)
          }
        })
        success()
      },
      failure)
    }
  })
}

function appendToStream (destStream, srcDir, srcFilesnames, index, success, failure) {
  if (index < srcFilesnames.length) {
    fs.createReadStream(srcDir + srcFilesnames[index])
      .on('end', function () {
        appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure)
      })
      .on('error', function (error) {
        console.error('Problem appending chunk! ' + error)
        destStream.end()
        failure()
      })
      .pipe(destStream, {end: false})
  } else {
    destStream.end()
    success()
  }
}

function getChunkFilename (index, count) {
  var digits = String(count).length
  var zeros = new Array(digits + 1).join('0')

  return (zeros + index).slice(-digits)
}

function failWithTooBigFile (responseData, res) {
  responseData.error = 'File Too big!'
  responseData.preventRetry = true
  res.send(responseData)
}

function isValid (size) {
  return maxFileSize === 0 || size < maxFileSize
}
