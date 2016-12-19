import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import LocalStorageUtils from '../../utils/local-storage-utils';
import { Link } from 'react-router';
import ActionsBar from './actions';
import Loading from '../../utils/react-loading-animation';
import ReactTags from 'react-tag-autocomplete';
import axios from 'axios';
import _ from 'lodash';

let initialized = false;

class EditClip extends Component {

  constructor(props) {
    super(props);

    this.state = {
      requestSuccess : false,
      successMessage: '',
      tags: [ ],
      suggestions: []
    };
  }

  componentDidMount() {
    this.props.getTagList();
    this.props.findClip(this.props.params.id);
    this.handleInitialize(this.props.clip);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clip) {
      this.handleInitialize(nextProps.clip);
    }
  }

  componentWillUnmount() {
    initialized = false;
  }

  handleInitialize(clip) {
    if (!initialized && clip) {
      this.props.initialize(clip);

      const tagsList = clip.tags.map(t => {return {id: t._id, name: t.name }});
      this.setState({
        tags : tagsList
      });

      initialized = true;
    }
  }


  renderField ({ input, label, type, placeholder, meta: { touched, error } }) {
    return (
      <div className="form-group">
          <label>{label}</label>
          <input {...input} placeholder={placeholder} className="form-control" type={type}/>
          {touched && error && <div className="error">{error}</div>}
      </div>
    );
  }

  handleFormSubmit(values) {
    // Call action creator to send reset request to server
    console.log("edit clip submitted", values);
    if (values.title === this.props.clip.title) {
      values = _.omit(values, ['title']);
    }
    return axios({method: 'post',
    url: `${ROOT_URL}/edit-clip`,
    data: {...values},
    headers: {authorization : LocalStorageUtils.getToken() } })
      .then(response => {

        // display a success message to the user
        this.setState({requestSuccess: true, successMessage: response.data.message});
        setTimeout(() => {
          this.setState({requestSuccess: false, successMessage: ''});
        }, 5000); // show message for 5 seconds


      })
      .catch(response => {
        if (response instanceof SubmissionError) throw err;
        throw new SubmissionError({ ...response.data });
      });
  }

  renderSuccess() {
    if (this.state.requestSuccess) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.state.successMessage}
        </div>
      );
    }
  }

  removeClip(id) {
    console.log('Removing clip', id);
  }

  handleDelete(i) {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags: tags});
  }


  handleAddition(tag) {
  var tags = this.state.tags;
  tags.push(tag);
  this.setState({ tags: tags });
  }

  handleDrag(tag, currPos, newPos) {
    let tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: tags });
  }


  render() {

    const { clip, tagList, error, handleSubmit, pristine, reset, submitting } = this.props;

    if (!clip || !tagList) {
      return <Loading margin={'11% auto'} />;
    }

    let tags = this.state.tags;
    // map out from the list of all tags except the ones already selected.
    let suggestions = tagList.map(t => {
      if (_.find(tags, {'name' : t.name})) {
        return false;
      }
      return {id: t._id, name: t.name }
    });


    return (

      <div>
        <ActionsBar/>

        <div className="row md-content-spacer">

          <div className="col-sm-7 offset-sm-2">
            <div className="card view-edit-clip">
              <div className="card-header">
                <div className="float-xs-left">{clip.title}</div>

                <div className={'btn-group btn-group-sm float-xs-right'}>
                  <Link to={'/clip/' + clip._id} className="btn btn-info" title="View clip">
                    <i className="fa fa-eye" />
                  </Link>
                  <a href="#" className="btn btn-danger" title="Remove" onClick={() => this.removeClip(clip._id)}>
                    <i className="fa fa-times" />
                  </a>
                </div>
              </div>

              <div className="card-block">
                {this.renderSuccess()}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="form">
                  <Field name="title" type="text" component={this.renderField} label="Clip Title" />

                  <Field name="length" type="number" component={this.renderField} label="Clip Length in Milliseconds (1 Second x 1000)" />

                  <label className="tag-title">Tags</label>

                  <ReactTags tags={tags}
                             suggestions={suggestions}
                             allowNew={true}
                             handleDelete={this.handleDelete.bind(this)}
                             handleAddition={this.handleAddition.bind(this)}
                             handleDrag={this.handleDrag.bind(this)} />



                  <div className="form-group edit-submit">
                    {error && <div className="alert alert-danger"><strong>Error!</strong> {error}</div>}
                    <button className="btn btn-lg btn-primary" type="submit" disabled={submitting || pristine}>Save changes</button>
                    {/*<button type="button" className="btn btn-lg btn-gray-light undo-btn" disabled={pristine || submitting} onClick={reset}>Undo Changes</button>*/}
                  </div>
                </form>

              </div>


          </div>

        </div>
      </div>

      </div>

    );
  }

}

function validate(formProps) {
  const errors = {};

  if (!formProps.title) {
    errors.title = 'Please enter a title.';
  }

  return errors;
}

function mapStateToProps(state) {
  const { filterCriteria, clips, auth } = state;

  return { clip: clips.clip, username: auth.username, tagList: filterCriteria.tags };
}

const form = reduxForm({
  form: 'edit-clip',
  validate
});

export default connect(mapStateToProps, actions)(form(EditClip));


