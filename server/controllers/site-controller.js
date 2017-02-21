const log = require('../helpers/logging')
const Site = require('../models/site')
const _ = require('lodash')

exports.getSiteSettings = function (req, res, next) {
  const authedUser = req.user
  // operation requires admin privileges
  if (!authedUser.isAdmin) {
    log.error('User is requesting site settings without admin rights', authedUser)
    return res.status(401).send({_error: 'unauthorized'})
  } else {
    Site.findOne({ runModeID: process.env.NODE_ENV }, function (err, site) {
      if (err) {
        log.error('could not retrieve site config for run mode: ' + process.env.NODE_ENV, err)
        return res.status(500).send({_error: 'server error'})
      }
      return res.send(site)
    })
  }
}

exports.editSiteSettings = function (req, res, next) {
  const authedUser = req.user
  // operation requires admin privileges
  if (!authedUser.isAdmin) {
    log.error('User is requesting site settings without admin rights', authedUser)
    return res.status(401).send({_error: 'unauthorized'})
  } else {
    Site.findOne({ runModeID: process.env.NODE_ENV }, function (err, site) {
      if (err) {
        log.error('could not retrieve site config for run mode: ' + process.env.NODE_ENV, err)
        return res.status(422).send({ _error: 'No site setting could be found to update' })
      }
      let modified = false
      if (_.has(req.body, 'registrationEnabled') && req.body.registrationEnabled === true) {
        site.registrationEnabled = true
        modified = true
      }
      if (_.has(req.body, 'registrationEnabled') && req.body.registrationEnabled === false) {
        site.registrationEnabled = false
        modified = true
      }
      if (modified) {
        site.save(function (err) {
          if (err) {
            log.error('error occurred trying to update site settings', err)
            return res.status(500)
          }
          site.message = 'Site settings updated successfully.'
          res.json({ message: site.message, settings: site })
        })
      } else {
        site.message = 'No site changes were made.'
        res.json({ message: site.message, settings: site })
      }
    })
  }
}
