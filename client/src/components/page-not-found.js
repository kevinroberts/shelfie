import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

class PageNotFound extends Component {

  render () {
    return (
      <div className='row col-sm-7 offset-sm-2'>
        <Helmet title={'404 - Page not found'}
                meta={[
                  {
                    name: 'description',
                    content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
                  },
                  {property: 'og:type', content: 'website'}
                ]}
        />
        <div className='row card'>
          <div className='card-block'>
            <h4 className='card-title'>404 - Your Page Doesn't Exist</h4>
            <p className='card-text'>We couldn't find the page you're looking for.</p>
            <Link to='/library' className='btn btn-primary'>Go Home</Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {authenticated: state.auth.authenticated}
}

export default connect(mapStateToProps, actions)(PageNotFound)
