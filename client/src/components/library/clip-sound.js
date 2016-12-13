import React from 'react';
import { Component } from 'react';
import Sound from 'react-sound';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Progress from './Progress'
import DownloadButton from './download-button';

class Clip extends Component {

  constructor(props) {
    super(props);

    let total = '00:00.0';
    if (this.props.length) {
      total = this.formatMilliseconds(this.props.length, this.props.length);
    }

    this.state = {
      position: 0,
      elapsed: '00:00.0',
      total: total,
      bytesLoaded: 0,
      bytesTotal: 0,
      loaded: false,
      displayLoading: false,
      playFromPosition: 0,
      playStatus: Sound.status.STOPPED
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }


  handleTogglePlay() {
    if (this.state.playStatus === Sound.status.PLAYING) {
      this.setState({
        playStatus: Sound.status.PAUSED
      });
    }
    if (this.state.playStatus === Sound.status.STOPPED) {
      this.setState({
        playStatus: Sound.status.PLAYING
      });
    }
    if (this.state.playStatus === Sound.status.PAUSED) {
      this.setState({
        playStatus: Sound.status.PLAYING
      });
    }

  }

  handleSongLoading(audio) {
    console.log(`${audio.bytesLoaded / audio.bytesTotal * 100}% loaded`);
    var loaded = false;
    if ((audio.bytesLoaded / audio.bytesTotal * 100) > 50) {
      loaded = true;
    }
    this.setState({
      bytesLoaded: audio.bytesLoaded,
      bytesTotal: audio.bytesTotal,
      loaded: loaded
    });
  }

  handleStop() {
    this.setState({
      playStatus: Sound.status.STOPPED,
      position: 0
    });
  }

  handleSongPlaying(audio) {
    this.setState({  elapsed: this.formatMilliseconds(audio.position, audio.duration),
      total: this.formatMilliseconds(audio.duration, audio.duration),
      position: audio.position / audio.duration })
  }

  formatMilliseconds(milliseconds, totalLength) {
    // Format hours
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    // Format minutes
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    // Format seconds
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);
    totalLength = Math.floor(totalLength / 1000);
    // show milliseconds left if short clip
    if (totalLength < 2) {
      // Return as string
      return (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + '.' + milliseconds;
    } else {
      return (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
    }
  }

  render() {

    const faveTooltip = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Add this clip to your favorites!</Tooltip>
    );

    return (
      <div className="card audio-card">
        <div className="card-header">
          {this.props.title}
        </div>
        <div>
          <Sound
            url={this.props.sourceUrl}
            playStatus={this.state.playStatus}
            playFromPosition={this.state.playFromPosition}
            onLoading={this.handleSongLoading.bind(this)}
            onPlaying={this.handleSongPlaying.bind(this)}
            onFinishedPlaying={() => this.setState({playStatus: Sound.status.STOPPED, position: 0})} />

          <Progress
            elapsed={this.state.elapsed}
            total={this.state.total}
            position={this.state.position}/>

        </div>
        <div className="card-footer text-muted text-xs-center">

          <div className="btn-toolbar" role="toolbar">
            <div className="btn-group" role="group">
              <button type="button" onClick={this.handleTogglePlay} className="btn btn-secondary">
                <i className={this.state.playStatus === Sound.status.PLAYING ? "fa fa-pause" : "fa fa-play"} />
              </button>
              <button type="button" onClick={this.handleStop} className="btn btn-secondary hidden-lg-down"><i className="fa fa-stop" /></button>
            </div>
            <div className="btn-group" role="group">
              <OverlayTrigger placement="top" overlay={faveTooltip}>
                <button className="btn btn-secondary"><i className="fa fa-heart-o" /></button>
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
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(Clip);