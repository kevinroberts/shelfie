import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class UploadedClip extends Component {

  render() {

    const { clip } = this.props;

    return (
      <div className="uploaded-clip">
        <h5 className="text-xs-center">Customize {clip.fileName}</h5>
        <form name="uploadedClip">
        <div className="form-group row">
          <label className="col-xs-2 col-form-label">Title:</label>
          <div className="col-xs-10">
            <input className="form-control" type="text" placeholder={clip.fileName} />
          </div>
        </div>
          <p className="text-xs-center"><button action="submit" className="btn btn-md btn-primary">Save!!!</button></p>
        </form>
      </div>
    )
  }
}

export default connect(null, actions)(UploadedClip);
