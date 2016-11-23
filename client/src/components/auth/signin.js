import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router';

class Signin extends Component {

  constructor(props) {
    super(props);

    this.props.clearAuthErrors();
  }

  handleFormSubmit({ username, password }) {
    // Need to do something to log user in
    this.props.signinUser({ username, password });
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
    const { handleSubmit, fields: { username, password }} = this.props;

    return (
      <div className="row form-gap">
        <div className="col-sm-6 col-md-4 offset-md-4">
          <h1 className="text-xs-center login-title">Sign in to continue</h1>

          <div className="account-wall">
            <img className="profile-img" src="/static/img/photo.png"
                 alt="empty profile image" />
            <form className="form-signin" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              <input {...username} placeholder="Username or Email" className="form-control" />
              <input {...password} type="password" placeholder="Password" className="form-control" />
              {this.renderAlert()}
              <button action="submit" className="btn btn-lg btn-primary btn-block">Sign in</button>
              <Link to="/resetRequest" className="pull-right need-help">Need help? </Link>
              <span className="clearfix" />
            </form>
          </div>
          <Link to="/signup" className="text-center new-account">Create an account </Link>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signin',
  fields: ['username', 'password']
}, mapStateToProps, actions)(Signin);
