import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as actions from '../../actions';

class Actions extends Component {

  render() {

    return (
      <div className="actions">
        <div className="container">
          <div className="btn-group btn-group-sm float-xs-left">
            <Link to="/" className="btn btn-gray-light" title="Back to list">
              <i className="fa fa-arrow-left" aria-hidden="true" />
              <span className="hidden-xs-down margin-left-sm">Back to list</span>
            </Link>
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps, actions)(Actions);
