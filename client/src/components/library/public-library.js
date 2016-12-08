import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import LibraryFilter from './library-filter';
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
      <Clip key="5" audioSrc="http://static.vinberts.com/clips/BigBoss.wav"/>,
    ]

  }

  render() {

    return (
      <div className="row">
        <div className="col-sm-12">
          <h2 className="text-xs-center">Public Library</h2>
          <div className="row">
            <LibraryFilter />
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

