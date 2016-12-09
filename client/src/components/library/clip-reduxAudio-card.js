import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import DownloadButton from './download-button';
import  * as actions  from 'redux-audio/actions';

import { Audio } from 'redux-audio'

class Clip extends Component {

  constructor(props) {
    super(props);

    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleStop = this.handleStop.bind(this);
    // this.handleFinish = this.handleFinish.bind(this);
    this.state = {
      playing: false,
      pos: 0
    };
  }


  handleTogglePlay() {
    let audioState = this.props.audio.get(this.props._id)._root.entries[1][1];

    if (audioState === 'none' || audioState === 'paused') {
      this.props.audioPlay(this.props._id);
    } else if (audioState === 'ended') {
      setTimeout(() => {
        this.props.audioPlay(this.props._id);
      }, 200);
      this.props.audioPause(this.props._id);
      // this.props.audioPlay(this.props._id);
    } else {
      this.props.audioPause(this.props._id);
    }
  }

  // handleFinish() {
  //   let audioState = this.props.audio.get(this.props._id)._root.entries[1][1];
  //   console.log("checking audio state", audioState);
  // }

  handleStop() {
    this.props.audioPause(this.props._id);
  }


  render() {

    let playingState = 'none';

    if (this.props.audio.get(this.props._id)) {
      playingState = this.props.audio.get(this.props._id)._root.entries[1][1];
    }

    const faveTooltip = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Add this clip to your favorites!</Tooltip>
    );

      return (
        <div className="card audio-card">
          <div className="card-header">
            {this.props.title}
          </div>
          <div className="card-block">

            <Audio src={this.props.sourceUrl}
                   uniqueId={this.props._id} />

          </div>
          <div className="card-footer text-muted text-xs-center">
            <div className="btn-toolbar" role="toolbar">
              <div className="btn-group" role="group">
                <button type="button" onClick={this.handleTogglePlay}  className="btn btn-secondary"><i className={playingState === 'playing' ? "fa fa-pause" : "fa fa-play"} aria-hidden="true" /></button>
                <button type="button" onClick={this.handleStop} className="btn btn-secondary hidden-lg-down"><i className="fa fa-stop" aria-hidden="true" /></button>
              </div>
              <div className="btn-group" role="group">
                <OverlayTrigger placement="top" overlay={faveTooltip}>
                  <button className="btn btn-secondary"><i className="fa fa-heart-o" aria-hidden="true" /></button>
                </OverlayTrigger>
              </div>
              <div className="btn-group" role="group">
                <DownloadButton className="btn btn-success" filename={this.props.sourceUrl}  />
              </div>
            </div>
          </div>
        </div>
      );


  }

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated, audio: state.audio };
}

export default connect(mapStateToProps, actions)(Clip);