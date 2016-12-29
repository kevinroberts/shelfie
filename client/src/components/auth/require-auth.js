import React, { Component } from 'react';
import { connect } from 'react-redux';
import {push} from 'redux-router';

export default function(ComposedComponent) {
  class Authentication extends Component {

    componentWillMount() {
      this.checkAuth(this.props.authenticated);
    }

    componentWillUpdate(nextProps) {
      this.checkAuth(nextProps.authenticated);
    }

    checkAuth (isAuthenticated) {
      if (!isAuthenticated) {
        let redirectAfterLogin = this.props.location.pathname;
        this.props
          .dispatch(push(`/signin?next=${redirectAfterLogin}`));
      }
    }

    render () {
      return (
        <div>
          {this.props.authenticated === true
            ? <ComposedComponent {...this.props}/>
            : null
          }
        </div>
      )

    }

  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
