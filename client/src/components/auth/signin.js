import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'

class Signin extends Component {

  constructor (props) {
    super(props)
    const redirectRoute = this.props.location.query.next || '/library'
    this.state = {
      redirectTo: redirectRoute
    }
  }

  renderField ({input, label, type, placeholder, meta: {touched, error}}) {
    return (
      <span>
        <label className='sr-only'>{label}</label>
        <input {...input} placeholder={placeholder} className='form-control' type={type} />
        {touched && error && <div className='error'>{error}</div>}
      </span>
    )
  }

  renderCheckboxField ({input, label, type, placeholder, meta: {touched, error}}) {
    return (
      <div className='form-check pull-left need-help'>
        <label className='form-check-label'>
          <input {...input} className='form-check-input' type={type} />
          {label}
        </label>
      </div>
    )
  }

  handleFormSubmit (values) {
    // Call api to sign in user
    return axios.post(`${ROOT_URL}/signin`, {...values})
      .then(response => {
        // success response - pass action creator to update state
        this.props.signinUser(response, _.isUndefined(values.rememberMe), this.state.redirectTo)
      })
      .catch(response => {
        if (response instanceof SubmissionError) throw SubmissionError
        // If request is bad...
        // - Show an error to the user
        let responseMessage = 'Bad log in credentials.'
        if (response.status === 401) {
          responseMessage = 'Incorrect user credentials. Please check your username or password.'
        }
        if (_.has(response, 'data.error')) {
          responseMessage = response.data.error
        }
        throw new SubmissionError({_error: responseMessage})
      })
  }

  renderMessage () {
    if (this.props.loginMessage) {
      return (
        <div className='alert alert-success'>
          <strong>Note: </strong> {this.props.loginMessage}
        </div>
      )
    }
  }

  render () {
    const {error, handleSubmit, submitting} = this.props // pristine, reset (available too)

    return (
      <DocumentTitle title={'Shelfie - Please sign in'}>
        <div className='row form-gap'>
          <div className='col-sm-6 col-md-4 offset-md-4'>
            {this.renderMessage()}
            <h1 className='text-xs-center login-title'>Sign in to continue</h1>

            <div className='account-wall'>
              <img className='profile-img' src='/static/img/photo.png' alt='empty profile image' />
              <form className='form-signin' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <Field name='username' type='text' component={this.renderField} label='Username' placeholder='Username or Email' />
                <Field name='password' type='password' component={this.renderField} label='Password' placeholder='Password' />

                {error && <div className='alert alert-danger'><strong>Error!</strong> {error}</div>}
                <button action='submit' className='btn btn-lg btn-primary btn-block' disabled={submitting}>Sign in
                </button>

                <Field name='rememberMe' type='checkbox' component={this.renderCheckboxField} label='Remember me' />

                <Link to='/resetRequest' className='pull-right need-help'>Need help? </Link>
                <span className='clearfix' />
              </form>
            </div>
            <Link to='/signup' className='text-center new-account'>Create an account </Link>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

function validate (values) {
  const errors = {}

  if (!values.username) {
    errors.username = 'Please enter a username or email'
  }
  if (!values.password) {
    errors.password = 'Please enter a password'
  }
  return errors
}

function mapStateToProps (state) {
  return {loginMessage: state.auth.loginMessage}
}

export default reduxForm({
  form: 'signin',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
})(connect(mapStateToProps, actions)(Signin))
