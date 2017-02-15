/* eslint-disable react/jsx-boolean-value */
import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import * as actions from '../../actions'
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux'
import LocalStorageUtils from '../../utils/local-storage-utils'
import { Link } from 'react-router'
import ActionsBar from './actions'
import Loading from '../../utils/react-loading-animation'
import ReactTags from 'react-tag-autocomplete'
import axios from 'axios'
import _ from 'lodash'

let initialized = false

class EditClip extends Component {

  constructor (props) {
    super(props)

    this.state = {
      requestSuccess: false,
      successMessage: '',
      tagError: '',
      tagSuccess: '',
      tags: [],
      suggestions: []
    }
  }

  componentDidMount () {
    this.props.getTagList()
    this.props.findClip(this.props.params.id)
    this.handleInitialize(this.props.clip)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.clip) {
      this.handleInitialize(nextProps.clip)
    }
  }

  componentWillUnmount () {
    initialized = false
  }

  handleInitialize (clip) {
    if (!initialized && clip) {
      this.props.initialize(clip)

      const tagsList = clip.tags.map(t => {
        return {id: t._id, name: t.name}
      })
      this.setState({
        tags: tagsList
      })

      initialized = true
    }
  }

  renderField ({input, label, type, placeholder, meta: {touched, error}}) {
    return (
      <div className='form-group'>
        <label>{label}</label>
        <input {...input} placeholder={placeholder} className='form-control' type={type} />
        {touched && error && <div className='error'>{error}</div>}
      </div>
    )
  }

  renderTextAreaField ({input, label, type, meta: {touched, error}}) {
    return (
      <div className='form-group'>
        <label>{label}</label>
        <textarea {...input} className='form-control' type={type} defaultValue={input.value} />
        {touched && error && <div className='error'>{error}</div>}
      </div>
    )
  }

  handleFormSubmit (values) {
    // Call action creator to send reset request to server
    if (values.title === this.props.clip.title) {
      values = _.omit(values, ['title'])
    }

    var updatedTags = this.state.tags.map(t => { return {_id: t.id, name: t.name} })

    // check if updated tags are different from initial tags
    var diff = false

    // check if number of tags is same but now different tags
    if (updatedTags.length === values.tags.length) {
      diff = _.reduce(values.tags, function (result, value, key) {
        return value._id === updatedTags[key]._id ? result : result.concat(key)
      }, [])
    } else {
      diff = true
    }

    if (diff === true || diff.length > 0) {
      values.tags = updatedTags
    } else {
      values = _.omit(values, ['tags'])
    }

    return axios({
      method: 'post',
      url: `${ROOT_URL}/edit-clip`,
      data: {...values},
      headers: {authorization: LocalStorageUtils.getToken()}
    })
      .then(response => {
        // display a success message to the user
        this.setState({requestSuccess: true, successMessage: response.data.message})
        setTimeout(() => {
          this.setState({requestSuccess: false, successMessage: ''})
        }, 5000) // show message for 5 seconds
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

  removeClip (id) {
    if (window.confirm('Are you sure you want to remove ' + this.props.clip.title + '?')) {
      this.props.removeClip(id, this.props.clip.title)
    } else {
      console.log('Cancelled remove clip')
    }
  }

  handleDelete (i) {
    let tags = this.state.tags
    let removedTag = tags.splice(i, 1)
    removedTag = removedTag[0]

    axios({
      method: 'post',
      url: `${ROOT_URL}/remove-tags`,
      data: {tagId: removedTag.id, clipId: this.props.clip._id},
      headers: {authorization: LocalStorageUtils.getToken()}
    })
      .then(response => {
        this.setState({tags: tags})
        this.refs.editClipSaveBtn.disabled = ''
      })
      .catch(response => {
        this.setState({
          tagError: _.has(response.data, '_error') ? response.data._error : 'An error occurred trying to remove your tag. Please try again.'
        })
        setTimeout(() => {
          this.setState({tagError: ''})
        }, 3000)
      })
  }

  handleAddition (tag) {
    var tags = this.state.tags

    // check if this is a new tag or existing
    var existingTag = _.find(this.props.fullTagList, {'name': tag.name})

    if (existingTag) {
      // grab existing tags set of clips and add this clip's id to it
      let existingClips = existingTag.clips
      existingClips.push(this.props.clip._id)

      // this is an existing tag -> post a request to add the clip to it
      axios({
        method: 'post',
        url: `${ROOT_URL}/edit-tags`,
        data: {_id: existingTag._id, clips: existingClips, addToClip: true, clipId: this.props.clip._id},
        headers: {authorization: LocalStorageUtils.getToken()}
      })
        .then(response => {
          tags.push(tag)
          this.setState({tags: tags})
          this.refs.editClipSaveBtn.disabled = ''
        })
        .catch(response => {
          this.setState({
            tagError: _.has(response.data, '_error') ? response.data._error : 'An error occurred trying to save your tag update. Please try again.'
          })
          setTimeout(() => {
            this.setState({tagError: ''})
          }, 3000)
        })

      // enable submit button
      this.refs.editClipSaveBtn.disabled = ''
    } else {
      // adding a brand new tag -> post it to the API
      axios({
        method: 'post',
        url: `${ROOT_URL}/tags`,
        data: {name: tag.name, clip: this.props.clip._id, addToClip: true},
        headers: {authorization: LocalStorageUtils.getToken()}
      })
        .then(response => {
          tags.push({id: response.data.tag._id, name: response.data.tag.name})
          // display a success message to the user
          this.setState({tagSuccess: 'A new tag with the name ' + tag.name + ' was successfully created.', tags: tags})
          setTimeout(() => {
            this.setState({tagSuccess: ''})
          }, 3000)
          this.refs.editClipSaveBtn.disabled = ''
        })
        .catch(response => {
          this.setState({
            tagError: _.has(response.data, '_error') ? response.data._error : 'An error occurred trying to save your tag update. Please try again.'
          })
          setTimeout(() => {
            this.setState({tagError: ''})
          }, 3000)
        })
    }
  }

  render () {
    const {clip, fullTagList, error, handleSubmit, pristine, submitting} = this.props
    const {tags, tagError, tagSuccess} = this.state

    if (!clip || !fullTagList) {
      return <Loading margin={'11% auto'} />
    }

    // map out from the list of all tags except the ones already selected.
    let suggestions = fullTagList.map(t => {
      if (_.find(tags, {'name': t.name})) {
        return false
      }
      return {id: t._id, name: t.name}
    })

    return (

      <div>
        <ActionsBar />

        <div className='row md-content-spacer'>

          <div className='col-sm-7 offset-sm-2'>
            <div className='card view-edit-clip'>
              <div className='card-header'>
                <div className='float-xs-left'>{clip.title}</div>

                <div className={'btn-group btn-group-sm float-xs-right'}>
                  <Link to={'/clip/' + clip._id} className='btn btn-info' title='View clip'>
                    <i className='fa fa-eye' />
                  </Link>
                  <a href='#' className='btn btn-danger' title='Remove' onClick={() => this.removeClip(clip._id)}>
                    <i className='fa fa-times' />
                  </a>
                </div>
              </div>

              <div className='card-block'>
                {this.renderSuccess()}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='form'>
                  <Field name='title' type='text' component={this.renderField} label='Clip Title' />

                  <Field name='length' type='number' component={this.renderField} label='Clip Length in Milliseconds (1 Second x 1000)' />

                  <label className='tag-title'>Tags</label>

                  {tagError && <div className='alert alert-danger'><strong>Error!</strong> {tagError}</div>}
                  <ReactTags tags={tags} suggestions={suggestions} allowNew={true} handleDelete={this.handleDelete.bind(this)} handleAddition={this.handleAddition.bind(this)} />
                  {tagSuccess && <div className='alert alert-success'><strong>Success!</strong> {tagSuccess}</div>}

                  <Field name='description' type='textarea' label='Description' component={this.renderTextAreaField} />

                  <div className='form-group edit-submit'>
                    {error && <div className='alert alert-danger'><strong>Error!</strong> {error}</div>}
                    <button ref='editClipSaveBtn' className='btn btn-lg btn-primary' type='submit' disabled={pristine || submitting}>Save changes</button>
                    {/* <button type="button" className="btn btn-lg btn-gray-light undo-btn" disabled={pristine || submitting} onClick={reset}>Undo Changes</button>  */}
                  </div>
                </form>
              </div>

            </div>

          </div>
        </div>

      </div>

    )
  }

}

function mapStateToProps (state) {
  const {filterCriteria, clips, auth} = state

  return {clip: clips.clip, username: auth.username, fullTagList: filterCriteria.tags}
}

const form = reduxForm({
  form: 'edit-clip'
})

export default connect(mapStateToProps, actions)(form(EditClip))
