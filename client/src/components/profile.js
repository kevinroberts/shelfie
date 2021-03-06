import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Loading from '../utils/react-loading-animation'
import Gravatar from 'react-gravatar'
import moment from 'moment'
import ProfileEdit from './auth/profile-edit'
import Helmet from 'react-helmet'

class Profile extends Component {

  componentDidMount () {
    this.props.fetchProfile(this.props.params.username)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.props.fetchProfile(nextProps.params.username)
    }
  }

  render () {
    const {user} = this.props

    if (!user) {
      return <Loading margin={'11% auto'}/>
    }

    let userAnniversary = moment(user.createdAt).fromNow()

    return (
      <div className='row col-sm-7 offset-sm-2'>
        <Helmet title={this.props.user.username + '\'s profile'}
                meta={[
                  {
                    name: 'description',
                    content: 'Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account.'
                  },
                  {property: 'og:type', content: 'website'}
                ]}
        />
        <div className='row profile card'>
          <div className='card-block'>
            <div className='col-sm-2'>
              <Gravatar md5={this.props.user.gravitarMd5} size={125} className={'rounded'}/>
            </div>
            <div className='col-sm-4'>
              <h2>{this.props.user.username}</h2>
              <ul className='list-unstyled profile-details'>
                <li>Member since {userAnniversary}</li>
              </ul>
            </div>
            <div className='col-sm-6'>
              <ul className='stats list-inline'>
                <li className='list-inline-item'>
                  <span>{this.props.user.clips.length}</span>
                  Clips
                </li>
                <li className='list-inline-item'>
                  <span>{this.props.user.numberOfFaves}</span>
                  Favorites
                </li>
                <li className='list-inline-item invisible'>
                  <span>186</span>
                  Photos
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ProfileEdit user={this.props.user}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {user: state.auth.user}
}

export default connect(mapStateToProps, actions)(Profile)
