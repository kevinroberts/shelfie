import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
const Loading = require('../utils/react-loading-animation');
import Gravatar from 'react-gravatar';


class Profile extends Component {

  componentWillMount() {
    this.props.fetchProfile(this.props.params.username);
  }

  renderProfileEdit() {
    if (this.props.user.isOwnProfile) {
      return (
      <div className="row profile card">
        <form className="card-block">
          <h4 className="card-title">Edit profile</h4>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">First Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" placeholder={this.props.user.firstName} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Last Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" placeholder={this.props.user.lastName} />
            </div>
          </div>

          <div className="form-group row submitRow">
            <div className="offset-sm-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <a className="" href="#">Reset password</a>
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
        <div>Not own profile</div>
      );
    }
  }

  render() {
    const { user } = this.props;

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
          {this.renderProfileEdit()}
        </div>
    );
  }

}

function mapStateToProps(state) {
  return { user: state.auth.user };
}

export default connect(mapStateToProps, actions)(Profile);