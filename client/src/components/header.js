import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Gravatar from 'react-gravatar';

class Header extends Component {
  renderLogin() {
    if (this.props.authenticated) {
      // show a link to sign out
      return (
      <li className="nav-login nav-item dropdown">
        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-user" aria-hidden="true" />
          <strong>{this.props.username}</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-right">
          <li>
            <div className="navbar-content">
              <div className="row">
                <div className="col-md-5">
                    <Gravatar email={this.props.email} size={120} className={'img-fluid'} />
                    <p className="text-xs-center small">
                      <a href="https://en.gravatar.com/emails" target="_blank">Change Photo</a>
                    </p>
                </div>
                <div className="col-md-7">
                  <span>{this.props.username}</span>
                  <p className="text-muted small">
                    {this.props.email}</p>
                  <div className="divider">
                  </div>
                  <Link className="btn btn-primary btn-sm active" to={'/profile/' + this.props.username}>View Profile</Link>
                </div>
              </div>
            </div>
            <div className="navbar-footer">
              <div className="navbar-footer-content">
                <div className="row">
                  <div className="col-md-6">
                    <Link className="btn btn-secondary btn-sm" to={'/profile/' + this.props.username}>Change Password</Link>
                  </div>
                  <div className="col-md-6">
                    <Link className="btn btn-secondary btn-sm pull-right" to="/signout">Sign Out</Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
        )
    } else {
      // show a link to sign in or sign up
      return [
        <li className="nav-item" key={1}>
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>,
        <li className="nav-item" key={2}>
          <Link className="nav-link" to="/signup">Register</Link>
        </li>
      ];
    }
  }

  render() {

    let authVisible = this.props.authenticated ? '' : 'invisible';

    return (
    <nav className="navbar navbar-fixed-top navbar-dark bg-primary" role="navigation">
      <div className="container">
        <button className="navbar-toggler hidden-sm-up pull-right" type="button" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle navigation" />

        <Link className="navbar-brand" to="/">Shelfie</Link>
        <div className="navbar-toggleable-xs collapse" id="menu" aria-expanded="true">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">My Library</a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="http://bootsnipp.com/snippets/featured/nav-account-manager" target="_blank">Favorites</a>
            </li>
            <li className={'nav-item ' + authVisible }>
              <a className="nav-link" href="#"><i className="fa fa-plus" aria-hidden="true" /> Add Clip</a>
            </li>
          </ul>

          <ul className="nav navbar-nav pull-right">
            <li className="nav-item hidden-sm-down">
              <form className="nav-search form-inline float-xs-left">
                <i className="fa fa-search" aria-hidden="true" />
                <input className="nav-search-input form-control" type="text" placeholder="Search" />
              </form>
            </li>
            {this.renderLogin()}
          </ul>
          </div>
      </div>
    </nav>

    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    username: state.auth.username,
    email: state.auth.email
  };
}

export default connect(mapStateToProps)(Header);
