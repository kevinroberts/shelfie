import React from 'react'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux'
import DocumentTitle from 'react-document-title'

import Header from './header'
import Footer from './footer'

class App extends React.Component {
  render () {
    const {notifications} = this.props

    return (
      <DocumentTitle title='Shelfie - Public Library'>
        <div className='content'>
          <div className='container'>
            <Header queryParams={this.props.location} />
            <Notifications
              notifications={notifications}
            />
          </div>
          <div className='container-fluid'>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(
  state => ({notifications: state.notifications})
)(App)
