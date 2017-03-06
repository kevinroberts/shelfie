import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'
import Helmet from 'react-helmet'

class Signup extends Component {

  renderField ({input, label, type, placeholder, meta: {touched, error}}) {
    return (<fieldset className='form-group'>
      <label>{label + ':'}</label>
      <input {...input} placeholder={placeholder} className='form-control' type={type}/>
      {touched && error && <div className='error'>{error}</div>}
    </fieldset>)
  }

  renderInlineField ({input, label, type, meta: {touched, error}}) {
    return (<div className='col-xs-6 col-md-6'>
      <label className='sr-only'>{label}</label>
      <input className='form-control' {...input} placeholder={label} type={type}/>
      {touched && error && <div className='error row'>{error}</div>}
    </div>)
  }

  handleFormSubmit (values) {
    // Call api to sign up the user
    return axios.post(`${ROOT_URL}/signup`, {...values})
      .then(response => {
        // success response - pass action creator to update state
        this.props.signupUser(response)
      })
      .catch(response => {
        if (response instanceof SubmissionError) throw SubmissionError
        throw new SubmissionError({_error: 'Sign up failed', ...response.data})
      })
  }

  render () {
    const {error, handleSubmit, submitting} = this.props

    return (
      <div className='row form-gap'>
        <Helmet title={'Shelfie - new user registration'}
                meta={[
                  {
                    name: 'description',
                    content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
                  },
                  {property: 'og:type', content: 'website'}
                ]}
        />
        <div className='col-sm-7 col-md-5 offset-md-3'>
          <form className='card' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <h3 className='card-header'><i className='fa fa-user-plus' aria-hidden='true' /> Sign up</h3>
            <div className='card-block'>
              <label>Name:</label>

              <div className='row sign-up-name'>
                <Field name='firstName' type='text' component={this.renderInlineField} label='First Name' />
                <Field name='lastName' type='text' component={this.renderInlineField} label='Last Name' />
              </div>

              <Field name='username' type='text' component={this.renderField} label='Username' placeholder='Your Username' />
              <Field name='email' type='email' component={this.renderField} label='Email ' placeholder='Your Email' />
              <Field name='password' type='password' component={this.renderField} label='Password' placeholder='New Password' />
              <Field name='passwordConfirm' type='password' component={this.renderField} label='Confirm Password' placeholder='Re-enter Password' />
              {error && <div className='error row'>{error}</div>}

              <button action='submit' className='btn btn-primary' disabled={submitting}>Sign up!</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function validate (values) {
  const errors = {}

  if (!values.firstName) {
    errors.firstName = 'Please enter a first name'
  }
  if (!values.lastName) {
    errors.lastName = 'Please enter a last name'
  }
  if (!values.username) {
    errors.username = 'Please enter a username'
  }
  if (!values.email) {
    errors.email = 'Please enter an email'
  }
  if (!values.password) {
    errors.password = 'Please enter a password'
  } else {
    if (values.password && values.password.length < 7) {
      errors.password = 'Your password must be at least 7 characters.'
    }
  }
  if (!values.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation'
  }
  if (values.password !== values.passwordConfirm) {
    errors.password = 'Passwords must match'
  }
  return errors
}

function mapStateToProps (state) {
  return {errorMessage: state.auth.error}
}

export default reduxForm({
  form: 'signup',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
})(connect(mapStateToProps, actions)(Signup))
