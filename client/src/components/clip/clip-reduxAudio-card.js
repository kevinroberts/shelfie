import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import DownloadButton from '../library/download-button'
import * as actions from 'redux-audio/actions'
import { Link } from 'react-router'
import { Audio } from 'redux-audio'

class Clip extends Component {

  constructor (props) {
    super(props)

    this.handleTogglePlay = this.handleTogglePlay.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.state = {
      playing: false,
      pos: 0
    }
  }

  handleTogglePlay () {
    let audioState = this.props.audio.get(this.props._id)._root.entries[1][1]

    if (audioState === 'none' || audioState === 'paused') {
      this.props.audioPlay(this.props._id)
    } else if (audioState === 'ended') {
      setTimeout(() => {
        this.props.audioPlay(this.props._id)
      }, 200)
      this.props.audioPause(this.props._id)
      // this.props.audioPlay(this.props._id);
    } else {
      this.props.audioPause(this.props._id)
    }
  }

  handleStop () {
    this.props.audioPause(this.props._id)
  }

  formatMilliseconds (milliseconds, totalLength) {
    // Format hours
    milliseconds = milliseconds % 3600000

    // Format minutes
    var minutes = Math.floor(milliseconds / 60000)
    milliseconds = milliseconds % 60000

    // Format seconds
    var seconds = Math.floor(milliseconds / 1000)
    milliseconds = Math.floor(milliseconds % 1000)
    totalLength = Math.floor(totalLength / 1000)
    // show milliseconds left if short clip
    if (totalLength < 2) {
      // Return as string
      return (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + '.' + milliseconds
    } else {
      return (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds
    }
  }

  render () {
    let playingState = 'none'

    if (this.props.audio.get(this.props._id)) {
      playingState = this.props.audio.get(this.props._id)._root.entries[1][1]
    }

    let filename = this.props.sourceUrl.substr(this.props.sourceUrl.lastIndexOf('/') + 1, this.props.sourceUrl.length)

    const faveTooltip = (
      <Tooltip id='faveTooltip' className='tooltip tooltip-top'>Add this clip to your favorites!</Tooltip>
    )
    const downloadTooltip = (
      <Tooltip id='downloadTooltip' className='tooltip tooltip-top'>Download {filename}</Tooltip>
    )

    const audioUrl = `${this.props.sourceUrl}` // ?cb=${new Date().getTime()}

    return (
      <div className='card audio-card'>
        <div className='card-header'>
          <Link to={'/clip/' + this.props._id}>{this.props.title}</Link>
        </div>
        <div className=''>

          <Audio src={audioUrl} uniqueId={this.props._id} controls />
        </div>
        <div className='card-footer text-muted'>
          <div className='btn-toolbar card-toolbar' role='toolbar'>
            {/* <div className="btn-group" role="group">  */}
            {/* <button type="button" onClick={this.handleTogglePlay}  className="btn btn-secondary"><i className={playingState === 'playing' ? "fa fa-pause" : "fa fa-play"} aria-hidden="true" /></button>  */}
            {/* <button type="button" onClick={this.handleStop} className="btn btn-secondary hidden-lg-down"><i className="fa fa-stop" aria-hidden="true" /></button> */}
            {/* </div>  */}
            {playingState}
            <div className='btn-group' role='group'>
              <OverlayTrigger placement='top' overlay={faveTooltip}>
                <button className='btn btn-secondary'><i className='fa fa-heart-o' aria-hidden='true' /></button>
              </OverlayTrigger>
            </div>
            <OverlayTrigger placement='top' overlay={downloadTooltip}>
              <div className='btn-group' role='group'>
                <DownloadButton className='btn btn-success' filename={this.props.sourceUrl} />
              </div>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {authenticated: state.auth.authenticated, audio: state.audio}
}

export default connect(mapStateToProps, actions)(Clip)
