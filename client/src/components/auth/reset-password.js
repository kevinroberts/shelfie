import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class ResetPassword extends Component {


  render() {

    return (
      <div className="card">
        <div className="card-block">
          <h4 className="card-title">Choose a new password</h4>
          <form className="card-text">
            <fieldset className="form-group">
              <label>New Password:</label>
              <input className="form-control" type="password" />
            </fieldset>
            <fieldset className="form-group">
              <label>Confirm Password:</label>
              <input className="form-control" type="password" />
            </fieldset>
            <button action="submit" className="btn btn-primary">Reset Password!</button>
          </form>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(ResetPassword);