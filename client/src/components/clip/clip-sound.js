import React from 'react';
import { Component } from 'react';
import Sound from '../../utils/react-sound';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Progress from '../library/Progress'
import DownloadButton from '../library/download-button';
import FavoriteButton from './favorite-button';
import { Link } from 'react-router';
import { formatMilliseconds } from '../../utils/clip-utils';

class Clip extends Component {

  constructor(props) {
    super(props);

    let total = '00:00.000';
    if (this.props.length) {
      total = formatMilliseconds(this.props.length);
    }

    this.state = {
      position: 0,
      elapsed: '00:00.000',
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
    this.setState({  elapsed: formatMilliseconds(audio.position),
      total: formatMilliseconds(audio.duration),
      position: audio.position / audio.duration })
  }


  render() {

    let filename = this.props.sourceUrl.substr(this.props.sourceUrl.lastIndexOf('/')+1, this.props.sourceUrl.length);
    const downloadTooltip = (
      <Tooltip id="downloadTooltip" className="tooltip tooltip-top">Download {filename}</Tooltip>
    );

    const audioUrl = `${this.props.sourceUrl}`;

    return (
      <div className="card audio-card">
        <div className="card-header">
          <Link to={'/clip/' + this.props._id}>{this.props.title}</Link>
        </div>
        <div>
          <Sound
            url={audioUrl}
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
              <FavoriteButton clipId={this.props._id} />
            </div>
            <OverlayTrigger placement="top" overlay={downloadTooltip}>
              <div className="btn-group" role="group">
                <DownloadButton className="btn btn-success" filename={this.props.sourceUrl}  />
              </div>
            </OverlayTrigger>
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