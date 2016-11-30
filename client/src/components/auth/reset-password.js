import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router';
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import axios from 'axios';
import LocalStorageUtils from '../../utils/local-storage-utils';


class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      requestSuccess : false,
      successMessage : '',
      hiddenForm : ''
    };

  }

  renderField ({ input, label, type, placeholder, meta: { touched, error } }) {
    return (
      <fieldset className="form-group">
          <label>{label}</label>
          <input {...input} placeholder={placeholder} className="form-control" type={type}/>
          {touched && error && <div className="error">{error}</div>}
      </fieldset>
    );
  }

  handleFormSubmit(values) {
    // Call action creator to send reset request to server
    return axios.post(`${ROOT_URL}/reset/${this.props.params.key}`, { ...values })
      .then(response => {

        this.props.reset();

        this.setState({requestSuccess: true, successMessage: response.data.message, hiddenForm: 'invisible'});
        setTimeout(() => {
          this.setState({requestSuccess: false, successMessage: '', hiddenForm: ''});
        }, 30000); // show message for 30 seconds

        this.props.sendPasswordReset(response);
      })
      .catch(response => {
        if (response instanceof SubmissionError) throw err;
        throw new SubmissionError({ ...response.data });
      });
  }

  renderAlert() {
    if (this.props.error) {
      return (
        <div>
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.error}
        </div>
          <p>Need help? <Link to="/resetRequest">Request a new password reset email</Link>.</p>
        </div>
      );
    }
  }

  renderSuccess() {
    if (this.state.requestSuccess) {

      // un-auth user if they are logged in
      const token = LocalStorageUtils.getToken();
      if (token) {
        this.props.signoutUser();
      }
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.state.successMessage}
          <br />
          <Link to="/signin">You may now sign in with your new password.</Link>
        </div>
      );
    }
  }

  render() {

    const { error, handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div className="form-gap">
        {this.renderSuccess()}
      <div className={'card ' + this.state.hiddenForm}>
        <div className="card-block">
          <h4 className="card-title">Choose a new password</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="card-text">

            <Field name="password" type="password" component={this.renderField} label="New Password:" placeholder="new password" />

            <Field name="passwordConfirm" type="password" component={this.renderField} label="Confirm Password:" placeholder="confirm password" />

            {this.renderAlert()}
            <button action="submit" className="btn btn-primary" disabled={submitting}>Reset Password!</button>
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
  return { authenticated: state.auth.authenticated };
}

export default reduxForm({
  form: 'resetPassword',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
})(connect(mapStateToProps, actions)(ResetPassword))

