import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router';

class PageNotFound extends Component {

  constructor(props) {
    super(props);
  }


  render() {


    return (
      <div className="row col-sm-7 offset-sm-2">
        <div className="row card">
          <div className="card-block">
            <h4 className="card-title">404 - Your Page Doesn't Exist</h4>
            <p className="card-text">We couldn't find the page you're looking for.</p>
            <Link to="/library" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

}


function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(PageNotFound);