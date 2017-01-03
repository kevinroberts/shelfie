import React from 'react';
import { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

class FavoriteButton extends Component {

  constructor(props) {
    super(props);
  }

  handleFavoriteRemove() {
    console.log("Removing clip from favorites", this.props.clipId);
    this.props.updateFavoriteClip(this.props.clipId, 'remove');
  }

  handleFavoriteAdd() {
    console.log("Adding clip to favorites", this.props.clipId);
    this.props.updateFavoriteClip(this.props.clipId, 'add');
  }

  render() {
    const faveTooltipAdd = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Add this clip to your favorites!</Tooltip>
    );
    const faveTooltipRemove = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Remove this clip to your favorites!</Tooltip>
    );

    if (!this.props.authenticated) {
      return <span />
    }

    if (this.props.favoriteClips && this.props.favoriteClips.includes(this.props.clipId)) {
      return (
        <OverlayTrigger placement="top" overlay={faveTooltipRemove}>
          <button onClick={this.handleFavoriteRemove.bind(this)} className="btn btn-secondary"><i className="fa fa-heart favoriteClip"/></button>
        </OverlayTrigger>
      )
    } else {
      return (
        <OverlayTrigger placement="top" overlay={faveTooltipAdd}>
          <button onClick={this.handleFavoriteAdd.bind(this)} className="btn btn-secondary"><i className="fa fa-heart-o"/></button>
        </OverlayTrigger>
      )
    }
  }

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated,
            favoriteClips: state.auth.favoriteClips };
}

export default connect(mapStateToProps, actions)(FavoriteButton);