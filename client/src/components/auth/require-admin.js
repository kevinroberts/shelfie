import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'redux-router'

export default function (ComposedComponent) {
  class AdminAuthentication extends Component {

    componentWillMount () {
      this.checkAuth(this.props.authenticated, this.props.isAdmin)
    }

    componentWillUpdate (nextProps) {
      this.checkAuth(nextProps.authenticated)
    }

    checkAuth (isAuthenticated, isAdmin) {
      if (!isAdmin) {
        this.props
          .dispatch(push(`/404`))
      }
    }

    render () {
      return (
        <div>
          {this.props.isAdmin === true
            ? <ComposedComponent {...this.props} />
            : null
          }
        </div>
      )
    }
  }

  function mapStateToProps (state) {
    return {authenticated: state.auth.authenticated, isAdmin: state.auth.isAdmin}
  }

  return connect(mapStateToProps)(AdminAuthentication)
}
