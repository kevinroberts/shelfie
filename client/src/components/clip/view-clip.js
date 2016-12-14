import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class ViewClip extends Component {
  componentDidMount() {
    //this.props.fetchMessage();
  }

  render() {
    return (
      <div>Your clip {this.props.params.id}</div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(ViewClip);
