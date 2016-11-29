import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router';
import LocalStorageUtils from '../../utils/local-storage-utils';


class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.props.clearAuthErrors();

    this.state = {
      hiddenForm : ""
    };

  }

  handleFormSubmit(formProps) {
    // Call action creator to send reset request to server
    formProps.key = this.props.params.key;
    this.props.sendPasswordReset(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
          <p>Need help? <Link to="/resetRequest">Request a new password reset email</Link>.</p>
        </div>
      );
    }
  }

  renderSuccess() {
    if (this.props.successMessage) {

      // un-auth user if they are logged in
      const token = LocalStorageUtils.getToken();
      if (token) {
        this.props.signoutUser();
      }

      this.setState({hiddenForm: 'invisible'});
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.successMessage}
          <br />
          <Link to="/login">You may now login with your new password.</Link>
        </div>
      );
    }
  }

  render() {

    const { handleSubmit, fields: { password, passwordConfirm }} = this.props;

    return (
      <div className="form-gap">
        {this.renderSuccess()}
      <div className={'card' + this.state.hiddenForm} >
        <div className="card-block">
          <h4 className="card-title">Choose a new password</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="card-text">
            <fieldset className="form-group">
              <label>New Password:</label>
              <input className="form-control" type="password" {...password} />
              {password.touched && password.error && <div className="error">{password.error}</div>}
            </fieldset>
            <fieldset className="form-group">
              <label>Confirm Password:</label>
              <input className="form-control" type="password" {...passwordConfirm} />
              {passwordConfirm.touched && passwordConfirm.error && <div className="error">{passwordConfirm.error}</div>}
            </fieldset>
            {this.renderAlert()}
            <button action="submit" className="btn btn-primary">Reset Password!</button>
          </form>
        </div>
      </div>
      </div>
    );
  }

}

function validate(formProps) {
  const errors = {};

  if (!formProps.password) {
    errors.password = 'Please enter an password';
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
  return { errorMessage: state.auth.error,
    successMessage : state.auth.successMessage };
}

export default reduxForm({
  form: 'resetPassword',
  fields: [ 'password', 'passwordConfirm' ],
  validate
}, mapStateToProps, actions)(ResetPassword);

