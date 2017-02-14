import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import * as actions from '../../actions'
import Wavesurfer from 'react-wavesurfer'
// import ReactAudioPlayer from 'react-audio-player';

class Clip extends Component {

  constructor (props) {
    super(props)

    this.state = {
      playing: false,
      pos: 0
    }
    this.handleTogglePlay = this.handleTogglePlay.bind(this)
    this.handlePosChange = this.handlePosChange.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
    this.handleStop = this.handleStop.bind(this)
  }

  handleFinish () {
    this.setState({
      playing: false
    })
  }

  handleTogglePlay () {
    this.setState({
      playing: !this.state.playing
    })
  }

  handleStop () {
    this.setState({
      playing: false,
      pos: 0
    })
  }

  handlePosChange (e) {
    this.setState({
      pos: e.originalArgs[0]
    })
  }

  render () {
    const faveTooltip = (
      <Tooltip id='faveTooltip' className='tooltip tooltip-top'>Add this clip to your favorites!</Tooltip>
    )

    return (
      <div className='card audio-card'>
        <div className='card-header'>
          {this.props.title}
        </div>
        <div>

          <Wavesurfer
            audioFile={this.props.sourceUrl}
            pos={this.state.pos}
            onPosChange={this.handlePosChange}
            playing={this.state.playing}
            onFinish={this.handleFinish}
          />

        </div>
        <div className='card-footer text-muted text-xs-center'>
          <div className='btn-toolbar' role='toolbar'>
            <div className='btn-group' role='group'>
              <button type='button' onClick={this.handleTogglePlay} className='btn btn-secondary'>
                <i className={!this.state.playing ? 'fa fa-play' : 'fa fa-pause'} aria-hidden='true' />
              </button>
              <button type='button' onClick={this.handleStop} className='btn btn-secondary hidden-lg-down'>
                <i className='fa fa-stop' aria-hidden='true' />
              </button>
            </div>
            <div className='btn-group' role='group'>
              <OverlayTrigger placement='top' overlay={faveTooltip}>
                <button className='btn btn-secondary'><i className='fa fa-heart-o' aria-hidden='true' /></button>
              </OverlayTrigger>
            </div>
            <div className='btn-group' role='group'>
              <button type='button' className='btn btn-success' title='download this clip'>
                <i className='fa fa-download' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {authenticated: state.auth.authenticated}
}

export default connect(mapStateToProps, actions)(Clip)
