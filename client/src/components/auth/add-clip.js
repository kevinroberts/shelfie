import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'

class AddClip extends Component {

  constructor(props) {
    super(props);
    this.handleFinishedUpload = this.handleFinishedUpload.bind(this);
  }

  handleFinishedUpload() {
    console.log('finished');
  }


  render() {

    const style = {
      height: 240,
      border: 'dashed 2px #999',
      borderRadius: 5,
      position: 'relative',
      cursor: 'pointer',
    };

    const uploaderProps = {
      style,
      maxFileSize: 1024 * 1024 * 50,
      server: 'https://example/com',
      s3Url: 'https://my-bucket.s3.amazonaws.com/',
      signingUrlQueryParams: {uploadType: 'avatar'},
    };


    return (
      <div className="row form-gap col-sm-7 col-md-6 offset-md-3">
        <div className="card">
          <div className="card-header">
            Upload new audio clips
          </div>
          <div className="card-block">
            <h4 className="card-title">Click below to select files from your computer</h4>

            <h4>Or drag and drop files</h4>
            <DropzoneS3Uploader className={'upload-drop-zone'} onFinish={this.handleFinishedUpload} {...uploaderProps}>
              <span>Just drag and drop files here</span>
            </DropzoneS3Uploader>

            <p className="progress-header">
              <span className="sr-only">Progress</span>
            </p>
            <div>
              <div className="text-xs-center">Reticulating splines&hellip; 0%</div>
              <progress className="progress" value="10" max="100" />
            </div>
          </div>

        </div>
      </div>
    );

  }

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(AddClip);