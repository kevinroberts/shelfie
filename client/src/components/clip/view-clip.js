import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Loading from '../../utils/react-loading-animation';
import { formatMilliseconds } from '../../utils/clip-utils';
import TagList from './tag-list';
import ActionsBar from './actions';
import Wavesurfer from 'react-wavesurfer';
import Gravatar from 'react-gravatar';
import FavoriteButton from './favorite-button';
import { Link } from 'react-router';
import moment from 'moment';

class ViewClip extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      pos: 0
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  componentDidMount() {
    this.props.findClip(this.props.params.id);
  }

  handleFinish() {
    this.setState({
      playing: false
    });
  }

  handleTogglePlay() {
    this.setState({
      playing: !this.state.playing
    });
  }

  handleStop() {
    this.setState({
      playing: false,
      pos: 0
    });
  }

  handlePosChange(e) {
    this.setState({
      pos: e.originalArgs[0]
    });
  }

  removeClip(id) {
    if (confirm("Are you sure you want to remove \"" + this.props.clip.title + "\"?")) {
      this.props.removeClip(id, this.props.clip.title);
    } else {
      console.log('Cancelled remove clip');
    }
  }

  render() {

    const { clip } = this.props;

    if (!clip) {
      return <Loading margin={'11% auto'} />;
    }

    let createdDate = moment(clip.createdAt).format('MMMM Do YYYY, h:mm a');
    let actionsVisibleToggle = 'invisible';

    if (clip._creator.username === this.props.username) {
      actionsVisibleToggle = '';
    }

    return (
      <div>
        <ActionsBar/>
      <div className="row md-content-spacer">
        <div className="col-sm-7 offset-sm-2">
          <div className="card view-edit-clip">
            <div className="card-header">
              <div className="float-xs-left">{clip.title}</div>
              <div className={'btn-group btn-group-sm float-xs-right ' + actionsVisibleToggle}>
                <Link to={"/clip/" + clip._id + "/edit"} className="btn btn-warning" title="Edit">
                  <i className="fa fa-edit" />
                </Link>
                <a href="#" className="btn btn-danger" title="Remove" onClick={() => this.removeClip(clip._id)}>
                  <i className="fa fa-times" />
                </a>
              </div>
            </div>
            <Wavesurfer
              audioFile={clip.sourceUrl}
              pos={this.state.pos}
              onPosChange={this.handlePosChange}
              playing={this.state.playing}
              onFinish={this.handleFinish}
            />

            <div className="card-block">
              <div className="clip-duration float-sm-right">
                <i className="fa fa-clock-o" aria-hidden="true" /> <span className="player__time-total">{formatMilliseconds(clip.length)} sec</span>
              </div>
              <div className="btn-toolbar clearfix" role="toolbar">
                <div className="btn-group" role="group">
                  <button type="button" onClick={this.handleTogglePlay}  className="btn btn-secondary"><i className={!this.state.playing ? "fa fa-play" : "fa fa-pause"} aria-hidden="true" /></button>
                  <button type="button" onClick={this.handleStop} className="btn btn-secondary hidden-lg-down"><i className="fa fa-stop" aria-hidden="true" /></button>
                </div>
                <div className="btn-group" role="group">
                  <FavoriteButton clipId={clip._id} clipTitle={clip.title} />
                </div>
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-success" title="download this clip"><i className="fa fa-download" aria-hidden="true" /></button>
                </div>
                <TagList tags={clip.tags} />
              </div>
              <div className="clip-subTitle text-muted">added {createdDate}</div>
              {clip.description && <p className="clip-description lead">{clip.description}</p>}

              <div className="clip-userInfo">
                <h4>Uploaded By</h4>
                <Link className="float-sm-left" to={'/profile/' + clip._creator.username}>
                  <Gravatar email={clip._creator.email} size={100} className={'rounded'} />
                </Link>
                <div className="clip-userBody">
                  <h4>
                    <Link to={'/profile/' + clip._creator.username}>{clip._creator.username}</Link>
                  </h4>
                  <hr />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { clip: state.clips.clip, username: state.auth.username };
}

export default connect(mapStateToProps, actions)(ViewClip);
