import React from 'react';
import { Component } from 'react';

import Header from './header';
import Footer from './footer';

export default class App extends Component {
  render() {
    return (
      <div className="content">
        <div className="container">
        <Header />
        </div>
        <div className="container-fluid">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}
