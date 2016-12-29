import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

class NavLink extends Component {
  render() {
    let isActive = this.props.router.location.pathname === this.props.to;
    let className = isActive ? "active" : "";

    return (
      <li className={"nav-item " + className}>
        <Link className="nav-link" {...this.props}/>
      </li>
    );
  }
}


function mapStateToProps(state) {
  return {
    router : state.router
  }
}

export default connect(mapStateToProps)(NavLink);