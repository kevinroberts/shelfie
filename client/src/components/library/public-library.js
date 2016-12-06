import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Clip from './clip-card';

class Library extends Component {

  constructor(props) {
    super(props);
  }

  renderClips() {
    return [
      <Clip key="1" audioSrc="/static/gameover.wav" />,
      <Clip key="2" audioSrc="/static/gameover.wav" />,
      <Clip key="3" audioSrc="/static/gameover.wav"/>,
      <Clip key="4" audioSrc="/static/gameover.wav"/>,
      <Clip key="5" audioSrc="/static/gameover.wav"/>,
    ]

  }

  render() {

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
                {this.renderClips()}
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

