import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import Helmet from 'react-helmet'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'

class ResetRequest extends Component {

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
      <div className='form-group'>
        <div className='input-group'>
          <label className='sr-only'>{label}</label>
          <span className='input-group-addon'>
            <i className='fa fa-envelope color-blue'/>
          </span>
          <input {...input} placeholder={placeholder} className='form-control' type={type}/>
        </div>
        {touched && error && <div className='alert alert-danger'>{error}</div>}
      </div>
    )
  }

  handleFormSubmit (values) {
    // Call action creator to send reset request to server
    return axios.post(`${ROOT_URL}/reset-request`, {...values})
      .then(response => {
        // reset the form so user can tell it successfully submitted
        this.props.reset()
        // display a success message to the user
        this.setState({requestSuccess: true, successMessage: response.data.message, hiddenForm: 'invisible'})
        setTimeout(() => {
          this.setState({requestSuccess: false, successMessage: '', hiddenForm: ''})
        }, 15000) // show message for 15 seconds

        this.props.sendResetRequest(response)
      })
      .catch(response => {
        if (response instanceof SubmissionError) throw SubmissionError
        throw new SubmissionError({...response.data})
      })
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
    const {error, handleSubmit, submitting} = this.props

    return (
      <div className='row form-gap'>
        <Helmet title={'Shelfie - Password reset'}
                meta={[
                  {
                    name: 'description',
                    content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
                  },
                  {property: 'og:type', content: 'website'}
                ]}
        />
        {this.renderSuccess()}
        <div className={'col-sm-6 col-md-4 offset-md-4 ' + this.state.hiddenForm}>
          <div className='card card-block'>
            <div className='text-xs-center'>
              <i className='fa fa-lock fa-4x' aria-hidden='true'/>
              <h4 className='card-title text-center'>Forgot Password?</h4>
              <p className='card-text'>You can reset your password here.</p>
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='form'>
                <Field name='email' type='email' component={this.renderField} label='Email' placeholder='email address' />

                <div className='form-group'>
                  {error && <div className='alert alert-danger'><strong>Error!</strong> {error}</div>}
                  <button className='btn btn-lg btn-primary btn-block' type='submit' disabled={submitting}>Reset
                    Password
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

function validate (formProps) {
  const errors = {}

  if (!formProps.email) {
    errors.email = 'Please enter an email'
  }

  return errors
}

function mapStateToProps (state) {
  return {authenticated: state.auth.authenticated}
}

export default reduxForm({
  form: 'resetRequest',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
})(connect(mapStateToProps, actions)(ResetRequest))
