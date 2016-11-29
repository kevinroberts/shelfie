import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';
const Loading = require('../utils/react-loading-animation');
import Gravatar from 'react-gravatar';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.props.clearAuthErrors();

  }

  handleFormSubmit(formProps) {
    // send form info to edit user action
    this.props.editUser(formProps);
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

  renderSuccess() {
    if (this.props.successMessage) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.successMessage}
        </div>
      );
    }
  }

  componentWillMount() {
    this.props.fetchProfile(this.props.params.username);
  }

  renderProfileEdit() {
    if (this.props.user.isOwnProfile) {
      return (
      <div className="row profile card">
        <form onSubmit={this.props.handleSubmit(this.handleFormSubmit.bind(this))} className="card-block">
          <h4 className="card-title">Edit profile</h4>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">First Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" placeholder={this.props.user.firstName} {...this.props.fields.firstName} />
              {this.props.fields.firstName.touched && this.props.fields.firstName.error && <div className="error">{this.props.fields.firstName.error}</div>}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Last Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" placeholder={this.props.user.lastName} {...this.props.fields.lastName} />
              {this.props.fields.lastName.touched && this.props.fields.lastName.error && <div className="error">{this.props.fields.lastName.error}</div>}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <div className="form-inline newPassword">
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="New Password" {...this.props.fields.password} />
                </div>
                <div className="form-group">
                  <label>Confirm</label>
                  <input type="password" className="form-control" placeholder="Confirm Password" {...this.props.fields.passwordConfirm}  />
                </div>
              </div>
              {this.props.fields.password.touched && this.props.fields.password.error && <div className="error">{this.props.fields.password.error}</div>}
              {this.props.fields.passwordConfirm.touched && this.props.fields.passwordConfirm.error && <div className="error">{this.props.fields.passwordConfirm.error}</div>}
            </div>
          </div>

          {this.renderAlert()}

          <div className="form-group row submitRow">
            <div className="offset-sm-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Photo</label>
            <div className="col-sm-10">
              <a target="_blank" className="" href="https://en.gravatar.com/emails">Change at Gravatar.com</a>
            </div>
          </div>

        </form>
      </div>
      );
    } else {
      return (
        <div><small>.</small></div>
      );
    }
  }

  render() {
    const { handleSubmit, user, fields: { firstName, lastName, password, passwordConfirm } } = this.props;

    if (!user) {
      return <Loading />;
    }

    return (
      <div>
      <div className="row profile card">
        <div className="card-block">
              <div className="col-sm-2">
                <Gravatar email={this.props.user.email} size={125} className={'rounded'} />
              </div>
              <div className="col-sm-4">
                <h2>{this.props.user.username}</h2>
                <ul className="list-unstyled profile-details">
                  <li><i className="fa fa-envelope" aria-hidden="true" />{this.props.user.email}</li>
                </ul>
              </div>
              <div className="col-sm-6">
                <ul className="stats list-inline">
                  <li className="list-inline-item">
                    <span>275</span>
                    Friends
                  </li>
                  <li className="list-inline-item">
                    <span>354</span>
                    Followers
                  </li>
                  <li className="list-inline-item">
                    <span>186</span>
                    Photos
                  </li>
                </ul>
              </div>

          </div>
        </div>
          {this.renderSuccess()}
          {this.renderProfileEdit()}
        </div>
    );
  }

}

function validate(formProps) {
  const errors = {};


  if (formProps.firstName && !formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (formProps.password) {

    if (formProps.password && formProps.password.length < 7) {
      errors.password = 'Your password must be at least 7 characters.';
    }

    if (!formProps.passwordConfirm) {
      errors.passwordConfirm = 'Please enter a password confirmation';
    } else {
      if (formProps.password !== formProps.passwordConfirm) {
        errors.password = 'Passwords must match';
      }
    }
  }

  return errors;
}

function mapStateToProps(state) {
  return { user: state.auth.user, errorMessage: state.auth.error, successMessage : state.auth.successMessage };
}

export default reduxForm({
  form: 'editUser',
  fields: ['firstName', 'lastName', 'password', 'passwordConfirm'],
  validate
}, mapStateToProps, actions)(Profile);