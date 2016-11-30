

exports.signUpValidation = {
  firstName: [{
    rule: 'required',
    message: 'You must provide a first name.'
  }, {
    rule: 'maxLength:50',
    message: 'Sorry, we cannot store first names longer than 50 characters.'
  }],
  lastName: [{
    rule: 'required',
    message: 'You must provide a last name.'
  }, {
    rule: 'maxLength:50',
    message: 'Sorry, we cannot store last names longer than 50 characters.'
  }],
  username: [{
    rule: 'required',
    message: 'A valid username is required.'
  }, {
    rule: 'alphaDash',
    message: 'Your username must only contain Alpha-Numeric characters (underscores or dashes are allowed)'
  }, {
    rule: 'minLength:4',
    message: 'Your username must be at least 5 characters long.'
  }, {
    rule: 'maxLength:60',
    message: 'Your username cannot be longer than 60 characters.'
  }],
  password: [{
    rule: 'required',
    message: 'A password is required to register.'
  }, {
    rule: 'minLength:7',
    message: 'Your password must contain a minimum of 7 characters'
  }],
  email: [{
    rule: 'required',
    message: 'An email is required to register.'
  }, {
    rule: 'email',
    message: 'A valid email address is required to register.'
  }]
};

exports.editProfileValidation = {
  password: [{
    rule: 'minLength:7',
    message: 'Your password must contain a minimum of 7 characters.'
  }],
  firstName: [ {
    rule: 'maxLength:50',
    message: 'Sorry, we cannot store first names longer than 50 characters.'
  }],
  lastName: [ {
    rule: 'maxLength:50',
    message: 'Sorry, we cannot store last names longer than 50 characters.'
  }]
};

exports.resetRequestValidation = {
  email: [{
    rule: 'required',
    message: 'You must provide an email address.'
  }, {
    rule: 'email',
    message: 'You must provide a valid email address.'
  }]
};

exports.resetPasswordValidation = {
  password: [{
    rule: 'required',
    message: 'You must provide a new password.'
  }, {
    rule: 'minLength:7',
    message: 'Your password must contain a minimum of 7 characters.'
  }]
};