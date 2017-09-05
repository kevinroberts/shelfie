import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import LocalStorageUtils from '../../utils/local-storage-utils'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'

class ProfileEdit extends Component {

  constructor (props) {
    super(props)

    this.state = {
      requestSuccess: false,
      successMessage: '',
      hiddenForm: ''
    }
  }

  renderField ({input, label, type, placeholder, meta: {touched, error}}) {
    return (
      <div className='form-group row'>
        <label className='col-sm-2 col-form-label'>{label}</label>
        <div className='col-sm-10'>
          <input {...input} placeholder={placeholder} className='form-control' type={type} />
          {touched && error && <div className='error'>{error}</div>}
        </div>
      </div>
    )
  }

  renderInlineField ({input, label, labelClass, type, placeholder, meta: {touched, error}}) {
    return (
      <div className='form-group'>
        <label className={labelClass}>{label}</label>
        <input {...input} placeholder={placeholder} className='form-control' type={type} />
        {touched && error && <div className='error'>{error}</div>}
      </div>
    )
  }

  handleFormSubmit (values) {
    // send form info to edit user action
    return axios({
      method: 'post',
      url: `${ROOT_URL}/profile`,
      data: {
        ...values
      },
      headers: {Authorization: 'Bearer ' + LocalStorageUtils.getToken()}
    }).then(response => {
      this.props.reset()

      // if password changed - > un-auth user and send them back to sign in
      if (values.password) {
        this.props.editUser(response, true)
      } else {
        // show success message
        this.setState({requestSuccess: true, successMessage: response.data.message, hiddenForm: 'invisible'})
        setTimeout(() => {
          this.setState({requestSuccess: false, successMessage: '', hiddenForm: ''})
        }, 10000) // show message for 10 seconds

        this.props.editUser(response, false)
      }
    }).catch(response => {
      if (response instanceof SubmissionError) throw SubmissionError
      throw new SubmissionError({...response.data})
    })
  }

  renderAlert () {
    if (this.props.error) {
      return (
        <div className='alert alert-danger'>
          <strong>Oops!</strong> {this.props.error}
        </div>
      )
    }
  }

  renderSuccess () {
    if (this.state.requestSuccess) {
      return (
        <div className='alert alert-success'>
          <strong>Success!</strong> {this.state.successMessage}
        </div>
      )
    }
  }

  render () {
    const {handleSubmit, pristine, submitting} = this.props

    if (!this.props.user.isOwnProfile) {
      return (
        <div>
          <small>.</small>
        </div>
      )
    }

    return (
      <div>
        {this.renderSuccess()}
        <div className='row profile card'>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='card-block'>
            <h4 className='card-title'>Edit profile</h4>

            <Field name='firstName' type='text' component={this.renderField} label='First Name' placeholder={this.props.user.firstName} />

            <Field name='lastName' type='text' component={this.renderField} label='Last Name' placeholder={this.props.user.lastName} />

            <div className='form-group row'>
              <label className='col-sm-2 col-form-label'>Password</label>
              <div className='col-sm-10'>
                <div className='form-inline newPassword'>
                  <Field name='password' type='password' component={this.renderInlineField} label='New Password:' labelClass='sr-only' placeholder='New Password' />
                  <Field name='passwordConfirm' type='password' component={this.renderInlineField} label='Confirm' labelClass='' placeholder='Confirm Password' />
                </div>
              </div>
            </div>

            {this.renderAlert()}

            <div className='form-group row submitRow'>
              <div className='offset-sm-2 col-sm-10'>
                <button type='submit' className='btn btn-primary' disabled={submitting || pristine}>Update</button>
              </div>
            </div>

            <div className='form-group row'>
              <label className='col-sm-2 col-form-label'>Profile Photo</label>
              <div className='col-sm-10 extra-top-pad'>
                <a target='_blank' href='https://en.gravatar.com/emails'>Change at Gravatar.com</a>
              </div>
            </div>

          </form>

        </div>
      </div>
    )
  }

}

function validate (formProps) {
  const errors = {}

  if (formProps.firstName && !formProps.lastName) {
    errors.lastName = 'Please confirm your last name'
  }

  if (formProps.password) {
    if (formProps.password && formProps.password.length < 7) {
      errors.password = 'Your password must be at least 7 characters.'
    }

    if (!formProps.passwordConfirm) {
      errors.passwordConfirm = 'Please enter a password confirmation'
    } else {
      if (formProps.password !== formProps.passwordConfirm) {
        errors.password = 'Passwords must match'
      }
    }
  }

  return errors
}

function mapStateToProps (state) {
  return {authenticated: state.auth.authenticated}
}

export default reduxForm({
  form: 'profileEdit',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
})(connect(mapStateToProps, actions)(ProfileEdit))

