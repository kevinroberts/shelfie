const log = require('../helpers/logging')

function resetEmail (toEmail, resetLink) {
  const helper = require('sendgrid').mail

  const fromEmail = new helper.Email(process.env.FROM_EMAIL)
  const toEmailObj = new helper.Email(toEmail)
  const subject = 'Shelfie Password Reset'

  const content = new helper.Content('text/plain', `Please visit this link to reset your password (only valid for the next hour):\n 
   ${resetLink} \n\n
   If you did not request this, please ignore this email and your password will remain unchanged.`)

  const mail = new helper.Mail(fromEmail, subject, toEmailObj, content)

  return mail.toJSON()
}

function passwordChangedEmail (user) {
  const helper = require('sendgrid').mail

  const fromEmail = new helper.Email(process.env.FROM_EMAIL)
  const toEmail = new helper.Email(user.email)
  const subject = 'Shelfie - Your password has been changed'

  const content = new helper.Content('text/plain', `Hello ${user.firstName},\n\nThis is a confirmation that the password for your account with username ${user.username} has been changed.\n\nRegards,\nShelfie`)

  const mail = new helper.Mail(fromEmail, subject, toEmail, content)

  return mail.toJSON()
}

function send (toSend, callback) {
  const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
  var requestBody = toSend
  var emptyRequest = require('sendgrid-rest').request
  var requestPost = JSON.parse(JSON.stringify(emptyRequest))
  requestPost.method = 'POST'
  requestPost.path = '/v3/mail/send'
  requestPost.body = requestBody
  sg.API(requestPost, function (error, response) {
    log.debug('send-grid email sent: ', response.statusCode)
    log.debug(response.body)
    log.debug(response.headers)
    callback(error, response)
  })
}

exports.sendResetEmail = function (toEmail, resetLink, callback) {
  send(resetEmail(toEmail, resetLink), function (error, response) {
    callback(error, response)
  })
}

exports.sendPasswordChangedEmail = function (user, callback) {
  send(passwordChangedEmail(user), function (error, response) {
    callback(error, response)
  })
}
