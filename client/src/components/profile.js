import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
const Loading = require('../utils/react-loading-animation');
import Gravatar from 'react-gravatar';
import ProfileEdit from './auth/profile-edit'

class Profile extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchProfile(this.props.params.username);
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
          <ProfileEdit user={this.props.user} />
        </div>
    );
  }

}


function mapStateToProps(state) {
  return { user: state.auth.user };
}

export default connect(mapStateToProps, actions)(Profile);
