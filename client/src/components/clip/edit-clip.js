import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { ROOT_URL } from '../../actions/index'
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import ActionsBar from './actions';
import Loading from '../../utils/react-loading-animation';
import axios from 'axios';

let initialized = false;

class EditClip extends Component {

  constructor(props) {
    super(props);

    this.state = {
      requestSuccess : false,
      successMessage: ''
    };

  }

  componentDidMount() {
    this.props.findClip(this.props.params.id);
    this.handleInitialize(this.props.clip);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps called ", nextProps);
    if (nextProps.clip) {
      this.handleInitialize(nextProps.clip);
    }
  }

  handleInitialize(clip) {
    console.log('initializing form');
    if (!initialized && clip) {
      console.log('initializing form action');
      this.props.initialize(clip);
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
    // return axios.post(`${ROOT_URL}/reset-request`, { ...values })
    //   .then(response => {
    //     // reset the form so user can tell it successfully submitted
    //     this.props.reset();
    //     // display a success message to the user
    //     this.setState({requestSuccess: true, successMessage: response.data.message, hiddenForm: 'invisible'});
    //     setTimeout(() => {
    //       this.setState({requestSuccess: false, successMessage: '', hiddenForm: ''});
    //     }, 15000); // show message for 15 seconds
    //
    //     this.props.sendResetRequest(response);
    //   })
    //   .catch(response => {
    //     if (response instanceof SubmissionError) throw err;
    //     throw new SubmissionError({ ...response.data });
    //   });
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

  render() {

    const { clip, error, handleSubmit, pristine, reset, submitting } = this.props;

    if (!clip) {
      return <Loading margin={'11% auto'} />;
    }

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

                  <div className="form-group">
                    {error && <div className="alert alert-danger"><strong>Error!</strong> {error}</div>}
                    <button className="btn btn-lg btn-primary" type="submit" disabled={submitting || pristine}>Save changes</button>
                    <button type="button" className="btn btn-lg btn-gray-light undo-btn" disabled={pristine || submitting} onClick={reset}>Undo Changes</button>
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
  return { clip: state.clips.clip, username: state.auth.username };
}

const form = reduxForm({
  form: 'edit-clip',
  validate
});

export default connect(mapStateToProps, actions)(form(EditClip));


