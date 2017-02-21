import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Gravatar from 'react-gravatar'
import NavLink from '../utils/nav-link'
import LibrarySearch from './library/library-search'

class Header extends Component {
  renderLogin () {
    if (this.props.authenticated) {
      // if authenticated -> show user drop down menu
      return (
        <li className='nav-login nav-item dropdown'>
          <a href='#' className='nav-link dropdown-toggle' data-toggle='dropdown'>
            <i className='fa fa-user' aria-hidden='true' />
            <strong>{this.props.username}</strong>
          </a>
          <ul className='dropdown-menu dropdown-menu-right'>
            <li>
              <div className='navbar-content'>
                <div className='row'>
                  <div className='col-md-5'>
                    <Gravatar email={this.props.email} size={120} className={'img-fluid'} />
                    <p className='text-xs-center small'>
                      <a href='https://en.gravatar.com/emails' target='_blank'>Change Photo</a>
                    </p>
                  </div>
                  <div className='col-md-7'>
                    <span>{this.props.username}</span>
                    <p className='text-muted small'>
                      {this.props.email}</p>
                    <div className='divider' />
                    <Link className='btn btn-primary btn-sm active' to={'/profile/' + this.props.username}>View
                      Profile</Link>
                  </div>
                </div>
              </div>
              <div className='navbar-footer'>
                <div className='navbar-footer-content'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <Link className='btn btn-secondary btn-sm' to={'/profile/' + this.props.username}>Change
                        Password</Link>
                    </div>
                    <div className='col-md-6'>
                      <Link className='btn btn-secondary btn-sm pull-right' to='/signout'>Sign Out</Link>
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
        <NavLink to='/signin' key={1}>Sign In</NavLink>,
        <NavLink to='/signup' key={2}>Register</NavLink>
      ]
    }
  }

  render () {
    let authVisible = this.props.authenticated ? '' : 'invisible'
    let adminVisible = this.props.isAdmin ? '' : 'invisible'

    return (
      <nav className='navbar navbar-fixed-top navbar-dark bg-primary' role='navigation'>
        <div className='container'>
          <button className='navbar-toggler hidden-sm-up pull-right' type='button' data-toggle='collapse' data-target='#menu' aria-controls='menu' aria-expanded='false' aria-label='Toggle navigation' />

          <Link className='navbar-brand' to='/'>Shelfie</Link>
          <div className='navbar-toggleable-xs collapse' id='menu' aria-expanded='true'>
            <ul className='nav navbar-nav'>

              <NavLink to='/my-library' className={'nav-link ' + authVisible}>
                My Library
              </NavLink>

              <NavLink to='/my-favorites' className={'nav-link ' + authVisible}>
                <i className='fa fa-heart' aria-hidden='true' /> Favorites
              </NavLink>

              <NavLink to='/add-clip' className={'nav-link ' + authVisible}>
                <i className='fa fa-plus' aria-hidden='true' /> Add Clip
              </NavLink>

              <NavLink to='/admin' className={'nav-link ' + adminVisible}>
                <i className='fa fa-cog' aria-hidden='true' /> Admin
              </NavLink>

            </ul>

            <ul className='nav navbar-nav pull-right'>
              <li className='nav-item hidden-sm-down'>
                <LibrarySearch queryParams={this.props.queryParams} />
              </li>
              {this.renderLogin()}
            </ul>
          </div>
        </div>
      </nav>

    )
  }
}

function mapStateToProps (state) {
  return {
    authenticated: state.auth.authenticated,
    isAdmin: state.auth.isAdmin,
    username: state.auth.username,
    email: state.auth.email
  }
}

export default connect(mapStateToProps)(Header)
