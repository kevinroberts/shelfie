import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import LibraryFilter from './library-filter';
import Paginator from './paginator';
// import Clip from '../clip/clip-reduxAudio-card';
import Clip from '../clip/clip-sound';

class Library extends Component {

  constructor(props) {
    super(props);
  }

  renderPaginator() {
    if (this.props.clips.all.length) {
      return <Paginator />;
    }
  }

  renderList() {
    return this.props.clips.all.map(function (clip) {
      // Browsers can only render 6 audio contexts per page
      return (
        <Clip key={clip._id} {...clip} />
      );
    });
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
                {this.renderList()}
              </div>
              <div className="row">
                {this.renderPaginator()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  };

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated,
            clips: state.clips };
}

export default connect(mapStateToProps, actions)(Library);

