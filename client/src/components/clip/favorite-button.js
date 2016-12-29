import React from 'react';
import { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

class FavoriteButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const faveTooltip = (
      <Tooltip id="faveTooltip" className="tooltip tooltip-top">Add this clip to your favorites!</Tooltip>
    );

    if (!this.props.authenticated) {
      return <span />
    }

    return (
    <OverlayTrigger placement="top" overlay={faveTooltip}>
      <button className="btn btn-secondary"><i className="fa fa-heart-o"/></button>
    </OverlayTrigger>
    )
  }

}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(FavoriteButton);