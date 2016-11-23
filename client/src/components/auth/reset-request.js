import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';


class ResetRequest extends Component {

  constructor(props) {
    super(props);

    this.props.clearAuthErrors();

    this.state = {
      hiddenForm : ""
    };
  }

  handleFormSubmit(formProps) {
    // Call action creator to send reset request to server
    this.props.sendResetRequest(formProps);
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
      this.setState({hiddenForm: 'invisible'});
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.successMessage}
        </div>
      );
    }
  }

  render() {

    const { handleSubmit, fields: { email }} = this.props;

    return (

    <div className="row form-gap">
      {this.renderSuccess()}
      <div className={'col-sm-6 col-md-4 offset-md-4 ' + this.state.hiddenForm}>
        <div className="card card-block">
          <div className="text-xs-center">
          <i className="fa fa-lock fa-4x" aria-hidden="true" />

          <h4 className="card-title text-center">Forgot Password?</h4>
          <p className="card-text">You can reset your password here.</p>
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="form">
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon"><i className="fa fa-envelope color-blue" /></span>
                  <input placeholder="email address" className="form-control"  type="email" {...email} />
                </div>
              </div>
              <div className="form-group">
                {email.touched && email.error && <div className="alert alert-danger">{email.error}</div>}
                {this.renderAlert()}
                <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Reset Password" type="submit" />
              </div>
            </form>
        </div>
        </div>

      </div>
    </div>

    );
  }

}

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error,
    successMessage : state.auth.successMessage };
}

export default reduxForm({
  form: 'resetRequest',
  fields: [ 'email' ],
  validate
}, mapStateToProps, actions)(ResetRequest);

