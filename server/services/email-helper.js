
function resetEmail(toEmail, resetLink) {
  const helper = require('sendgrid').mail;

  const from_email = new helper.Email(process.env.FROM_EMAIL);
  const to_email = new helper.Email(toEmail);
  const subject = "Shelfie Password Reset";

  const content = new helper.Content("text/plain", `Please visit this link to reset your password (only valid for the next hour):\n 
   ${resetLink} \n\n
   If you did not request this, please ignore this email and your password will remain unchanged.`);

  const mail = new helper.Mail(from_email, subject, to_email, content);

  return mail.toJSON();
}

function passwordChangedEmail(toEmail, toUser) {
  const helper = require('sendgrid').mail;

  const from_email = new helper.Email(process.env.FROM_EMAIL);
  const to_email = new helper.Email(toEmail);
  const subject = "Shelfie - Your password has been changed";

  const content = new helper.Content("text/plain", `Hello,\n\nThis is a confirmation that the password for your account with username ${toUser} has been changed.`);

  const mail = new helper.Mail(from_email, subject, to_email, content);

  return mail.toJSON();
}


function send (toSend, callback) {

  const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var requestBody = toSend;
  var emptyRequest = require('sendgrid-rest').request;
  var requestPost = JSON.parse(JSON.stringify(emptyRequest));
  requestPost.method = 'POST';
  requestPost.path = '/v3/mail/send';
  requestPost.body = requestBody;
  sg.API(requestPost, function (error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    callback(error, response);
  });
}


exports.sendResetEmail = function (toEmail, resetLink, callback) {
  send(resetEmail(toEmail, resetLink), function (error, response) {
    callback(error, response);
  });
};

exports.sendPasswordChangedEmail = function (toEmail, toUser, callback) {
  send(passwordChangedEmail(toEmail, toUser), function (error, response) {
    callback(error, response);
  });
};