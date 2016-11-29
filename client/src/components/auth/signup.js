import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class Signup extends Component {

  constructor(props) {
    super(props);

    this.props.clearAuthErrors();
  }

  handleFormSubmit(formProps) {
    // Call action creator to sign up the user!
    this.props.signupUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { firstName, lastName, username, email, password, passwordConfirm }} = this.props;

    return (
      <div className="row form-gap">
        <div className="col-sm-7 col-md-5 offset-md-3">
          <form className="card" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <h3 className="card-header"><i className="fa fa-user-plus" aria-hidden="true" /> Sign up</h3>
            <div className="card-block">


              <label>Name:</label>
              <div className="row sign-up-name">
                <div className="col-xs-6 col-md-6">
                  <label className="sr-only">First name</label>
                  <input className="form-control" placeholder="First Name" type="text" {...firstName} />
                </div>
                <div className="col-xs-6 col-md-6">
                  <label className="sr-only">Last name</label>
                  <input className="form-control" placeholder="Last Name" type="text" {...lastName} />
                </div>
                {firstName.touched && firstName.error && <div className="error">{firstName.error}</div>}
                {lastName.touched && lastName.error && <div className="error">{lastName.error}</div>}
              </div>

              <fieldset className="form-group">
                <label>Username:</label>
                <input className="form-control" placeholder="Your Username" {...username} />
                {username.touched && username.error && <div className="error">{username.error}</div>}
              </fieldset>
              <fieldset className="form-group">
                <label>Email:</label>
                <input type="email" className="form-control" placeholder="Your Email" {...email} />
                {email.touched && email.error && <div className="error">{email.error}</div>}
              </fieldset>
              <fieldset className="form-group">
                <label>Password:</label>
                <input className="form-control" placeholder="New Password" {...password} type="password" />
                {password.touched && password.error && <div className="error">{password.error}</div>}
              </fieldset>
              <fieldset className="form-group">
                <label>Confirm Password:</label>
                <input className="form-control" placeholder="Re-enter Password" {...passwordConfirm} type="password" />
                {passwordConfirm.touched && passwordConfirm.error && <div className="error">{passwordConfirm.error}</div>}
              </fieldset>
              {this.renderAlert()}
              <button action="submit" className="btn btn-primary">Sign up!</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.firstName) {
    errors.firstName = 'Please enter a first name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (!formProps.username) {
    errors.username = 'Please enter a username';
  }

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  } else {
    if (formProps.password && formProps.password.length < 7) {
      errors.password = 'Your password must be at least 7 characters.';
    }
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signup',
  fields: ['firstName', 'lastName', 'username', 'email', 'password', 'passwordConfirm'],
  validate
}, mapStateToProps, actions)(Signup);
