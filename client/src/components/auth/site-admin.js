import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import LocalStorageUtils from '../../utils/local-storage-utils'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import axios from 'axios'

class SiteAdmin extends Component {

  constructor (props) {
    super(props)

    this.state = {
      requestSuccess: false,
      successMessage: ''
    }
  }

  componentDidMount () {
    this.props.fetchSiteSettings()
  }

  handleFormSubmit (values) {
    // send form info to edit user action
    console.log('submitting site settings form', values)
    return axios({
      method: 'post',
      url: `${ROOT_URL}/settings`,
      data: {
        ...values
      },
      headers: {authorization: LocalStorageUtils.getToken()}
    }).then(response => {
      // show success message
      this.setState({requestSuccess: true, successMessage: response.data.message})
      setTimeout(() => {
        this.setState({requestSuccess: false, successMessage: ''})
      }, 5000)
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
    const {handleSubmit, pristine, submitting, reset} = this.props

    return (
      <div className='container form-gap'>
        {this.renderSuccess()}
        <div className='row card'>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='card-block'>
            <h4 className='card-title'>Shelfie Administration Options</h4>
            <p>Running on site profile: <mark>{this.props.settings.runModeID}</mark></p>
            <div className='form-group row'>
              <label className='col-sm-2 col-form-label' htmlFor='registrationEnabled'>User registration enabled?</label>
              <div className='col-sm-10'>
                <Field name='registrationEnabled' id='registrationEnabled' component='input' title='check to enable site self-registration' type='checkbox' />
              </div>
            </div>

            {this.renderAlert()}

            <div className='form-group row submitRow btn-toolbar justify-content-between'>
              <div className='btn-group'>
                <button type='submit' className='btn btn-primary' disabled={submitting || pristine}>Update</button>
              </div>
              <div className='btn-group'>
                <button type='button' className='btn' disabled={pristine || submitting} onClick={reset}>Undo Changes</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

}

SiteAdmin = reduxForm({
  form: 'siteAdmin',  // a unique identifier for this form
  enableReinitialize: true
})(SiteAdmin)

SiteAdmin = connect(
  state => ({
    initialValues: state.site.settings,
    settings: state.site.settings
  }),
  actions
)(SiteAdmin)

export default SiteAdmin
