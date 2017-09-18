import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import Helmet from 'react-helmet'

class Signout extends Component {
  componentWillMount () {
    this.props.signoutUser()
  }

  render () {
    return (
      <div className='row form-gap'>
        <Helmet title={'Shelfie - Sign out'}
                meta={[
                  {
                    name: 'description',
                    content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
                  },
                  {property: 'og:type', content: 'website'}
                ]}
        />
        <center>
          <iframe src='//giphy.com/embed/d2Zktmc1QMCTXtfi' width='480' height='360' frameBorder='0' className='giphy-embed' allowFullScreen />
          <h1>See yah!</h1>
        </center>
      </div>
    )
  }
}

export default connect(null, actions)(Signout)
