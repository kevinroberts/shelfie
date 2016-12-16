import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { ROOT_URL } from '../../actions/index'
import FineUploaderTraditional from 'react-fine-uploader'
import LocalStorageUtils from '../../utils/local-storage-utils';
import Gallery from 'react-fine-uploader/components/gallery';
import UploadedClip from './uploaded-clip';


class AddClip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
      uploadedClips: []
    };
  }

  renderUploadedClips() {
    if (this.state.uploadedClips.length === 0) {
      return <span />;
    }

    return this.state.uploadedClips.map(function (clip) {
      return (
        <UploadedClip key={clip.id} clip={clip} />
      );
    });
  }

  render() {

    const uploader = new FineUploaderTraditional({
      options: {
        chunking: {
          enabled: false
        },
        request: {
          endpoint: `${ROOT_URL}/uploads`,
          customHeaders: {
            "authorization": LocalStorageUtils.getToken()
          }
        },
        validation: {
          allowedExtensions: ['wav'],
          itemLimit: 15,
          sizeLimit: 10485760 // 10 mB = 10 * 1024 * 1024 bytes
      },
        messages : {
          typeError : "{file} has an invalid extension. Only files with the extension .wav are allowed."
        },
        callbacks: {
          onComplete: (id, name, response) => {
            // handle completed upload
            console.log('uploaded completed');
            let newClip = {...response};

            this.setState( function (state) {
              return {
                errorMsg: '',
                uploadedClips: state.uploadedClips.concat(newClip)
              }
            });
          },
          onValidate: (data, buttonContainer) => {
            console.log('validating upload...');
          },
          onError: (id, name, errorReason, xhr) => {
            console.log('file validation failed, msg: ', errorReason);
            this.setState({
              errorMsg: errorReason
            });
          }
        }
      }
    });

    return (
      <div className="row col-sm-7 col-md-6 offset-md-3">
        <div className="card">
          <div className="card-header">
            Upload new audio clips
          </div>
          <div className="card-block">
            <h4 className="card-title">Click below to select files from your computer</h4>
            {this.state.errorMsg && <div className="alert alert-danger"><strong>Error!</strong> {this.state.errorMsg}</div>}

            <Gallery uploader={ uploader } />

            <div className="uploaded-clips">
              {this.renderUploadedClips()}
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