import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, Button, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import Wavesurfer from 'react-wavesurfer';

class Library extends Component {


  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      pos: 0
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
  }
  handleTogglePlay() {
    this.setState({
      playing: !this.state.playing
    });
  }
  handleStop() {
    this.setState({
      playing: false
    });
  }
  handlePosChange(e) {
    this.setState({
      pos: e.originalArgs[0]
    });
  }


  render() {

    const faveTooltip = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Add this clip to your favorites!</Tooltip>
    );

    return (
      <div className="row">
        <div className="col-sm-12">
          <h2 className="text-xs-center">Public Library</h2>
          <div className="row">
            <div className="col-sm-2">
              <h4>Tags</h4>
              <ul className="list-unstyled">
                <li>Movies <span className="tag tag-default tag-pill">14</span></li>
                <li>Video Games <span className="tag tag-default tag-pill">24</span></li>
                <li>Metal Gear Solid <span className="tag tag-default tag-pill">14</span></li>
              </ul>
            </div>
            <div className="col-sm-10">
              <div className="card-columns">
                  <div className="card audio-card">
                    <div className="card-header">
                      Game over - MSG
                    </div>
                    <div>

                      <Wavesurfer
                        audioFile={'/static/gameover.wav'}
                        pos={this.state.pos}
                        onPosChange={this.handlePosChange}
                        playing={this.state.playing}
                      />

                    </div>
                    <div className="card-footer text-muted">
                      <div className="btn-toolbar" role="toolbar">
                        <div className="btn-group" role="group">
                          <button type="button" onClick={this.handleTogglePlay}  className="btn btn-secondary"><i className="fa fa-play" aria-hidden="true" /></button>
                          <button type="button" onClick={this.handleStop} className="btn btn-secondary"><i className="fa fa-stop" aria-hidden="true" /></button>
                        </div>
                        <div className="btn-group" role="group">
                          <OverlayTrigger placement="top" overlay={faveTooltip}>
                            <button className="btn btn-secondary"><i className="fa fa-heart-o" aria-hidden="true" /></button>
                          </OverlayTrigger>
                        </div>
                        <div className="btn-group" role="group">
                          <button type="button" className="btn btn-success" title="download this clip"><i className="fa fa-download" aria-hidden="true" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      Featured
                    </div>
                    <div className="card-block">
                      <h4 className="card-title">Special title treatment</h4>
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">
                      2 days ago
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )

  };

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(Library);

