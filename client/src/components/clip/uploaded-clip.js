import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { ROOT_URL } from '../../actions/index'
import LocalStorageUtils from '../../utils/local-storage-utils';
import axios from 'axios';

class UploadedClip extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAlertDismiss() {
    // dismiss any error message
    this.refs.errorBlock.style.display="none";
  }

  handleSubmit() {

    // reset any error messages
    this.refs.errorBlock.style.display="none";

    const { clip } = this.props;

    var updatedTitle = this.refs.clipTitleInput.value;

    console.log('handle submit called for ', clip);


    if (updatedTitle === '' || updatedTitle === clip.fileName) {
      this.refs.errorBlock.style.display="block";
      this.refs.errorMsg.innerHTML="Please enter a valid title for your clip.";

    } else {
      let submitObj = {};
      submitObj.title = updatedTitle;
      submitObj._id = clip.id;
      // disable submit button while ajax request is processing
      this.refs.submitBtn.disabled = true;
      axios({
        method: 'post',
        url: `${ROOT_URL}/edit-clip`,
        data: submitObj,
        headers: { authorization: LocalStorageUtils.getToken() }
      })
        .then(response => {

          this.refs.submitBtn.disabled = false;
          // display a success message to the user
          this.refs.successBlock.style.display="block";
          this.refs.successMsg.innerHTML=response.data.message;
          setTimeout(() => {
            this.refs.successBlock.style.display="none";
          }, 5000);

        })
        .catch(response => {
          this.refs.submitBtn.disabled = false;
          this.refs.errorBlock.style.display="block";
          // show any error messages from the API response to the user
          if (response.data.title) {
            this.refs.errorMsg.innerHTML = response.data.title[0];
          } else if (response.data._error) {
            this.refs.errorMsg.innerHTML = response.data._error;
          } else {
            this.refs.errorMsg.innerHTML = "Your new title has been rejected. Please select something else.";
          }

        });
    }

  }

  render() {

    const { clip } = this.props;

    return (
      <div className="uploaded-clip">
        <h5 className="text-xs-center">Customize {clip.fileName}</h5>

        <div ref="successBlock" className="alert alert-success" style={{display: 'none'}}>
          <strong>Success!</strong> <span ref="successMsg">Your clip title was successfully updated.</span>
        </div>
        <div ref="errorBlock" className="alert alert-danger" style={{display: 'none'}}>
          <button onClick={() => this.handleAlertDismiss()} type="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>Error!</strong> <span ref="errorMsg" />
        </div>
        <div className="form-group row">
          <label className="col-xs-2 col-form-label">Title:</label>
          <div className="col-xs-10">
            <input ref="clipTitleInput" className="form-control" type="text" placeholder={clip.title}  />
          </div>
        </div>
        <p className="text-xs-center">
          <button ref="submitBtn" onClick={() => this.handleSubmit()} className="btn btn-md btn-primary">Save!!!</button>
        </p>
      </div>
    )
  }
}

export default connect(null, actions)(UploadedClip);
