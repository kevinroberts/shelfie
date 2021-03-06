import React from 'react'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux'
import Helmet from 'react-helmet'

import Header from './header'
import Footer from './footer'

class App extends React.Component {
  render () {
    const {notifications} = this.props

    return (
      <div className='content'>
        <Helmet title='Shelfie - Public Library'
          meta={[
            { name: 'description',
              content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
            },
            {property: 'og:type', content: 'website'}
          ]}
        />
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
    )
  }
}

export default connect(
  state => ({notifications: state.notifications})
)(App)
