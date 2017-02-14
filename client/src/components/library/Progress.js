import React, { Component } from 'react'

export default class Progress extends Component {
  render () {
    return (
      <div className='progress-bar'>
        <progress className='progress' max='1' value={this.props.position} />
        <i className='fa fa-clock-o' aria-hidden='true' />
        <span className='player__time-elapsed'>{this.props.elapsed}</span>
        <span className='player__time-separator'>--</span>
        <span className='player__time-total'>{this.props.total} sec</span>
      </div>
    )
  }
}
