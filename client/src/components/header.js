import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
            <div className="navbar-login">
              <div className="row">
                <div className="col-lg-4">
                  <p className="text-center">
                    <span className="fa fa-user icon-size" />
                  </p>
                </div>
                <div className="col-lg-8">
                  <p className="text-left"><strong>{this.props.username}</strong></p>
                  <p className="text-left small">{this.props.email}</p>
                  <p className="text-left">
                    <a href="#" className="btn btn-primary btn-block btn-sm">Profile settings</a>
                  </p>
                </div>
              </div>
            </div>
          </li>
          <li className="divider" />
          <li>
            <div className="navbar-login navbar-login-session">
              <div className="row">
                <div className="col-lg-12">
                  <p>
                    <Link className="nav-link btn btn-danger btn-block" to="/signout">Log Out</Link>
                  </p>
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
          <Link className="nav-link" to="/signin">Log In</Link>
        </li>,
        <li className="nav-item" key={2}>
          <Link className="nav-link" to="/signup">Register</Link>
        </li>
      ];
    }
  }

  render() {
    return (
    <nav className="navbar navbar-fixed-top navbar-dark bg-primary" role="navigation">
      <div className="container">
        <button className="navbar-toggler hidden-sm-up pull-right" type="button" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Toggle navigation" />

        <a className="navbar-brand" href="#">Shelfie</a>

        <div className="navbar-toggleable-xs collapse" id="menu" aria-expanded="true">
      <ul className="nav navbar-nav">
        <li className="nav-item"><a className="nav-link" href="#">Library</a></li>
        <li className="nav-item active"><a className="nav-link" href="http://bootsnipp.com/snippets/featured/nav-account-manager" target="_blank">Favorites</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Stats</a></li>
      </ul>

      <ul className="nav navbar-nav pull-right">
        <li className="nav-item hidden-sm-down">
          <form className="nav-search form-inline float-xs-left">
            <i className="fa fa-search" aria-hidden="true"></i>
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
