import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import LibraryFilter from './my-favorites-filter'
import Paginator from './my-favorites-paginator'
// import Clip from '../clip/clip-reduxAudio-card';
import Clip from '../../clip/clip-sound'

class MyFavorites extends Component {

  renderPaginator () {
    if (this.props.clips.all.length) {
      return <Paginator queryParams={this.props.location} />
    }
  }

  renderList () {
    return this.props.clips.all.map(function (clip) {
      return (
        <Clip key={clip._id} {...clip} />
      )
    })
  }

  renderTitle () {
    if (this.props.activeTag.name) {
      return (
        <h2 className='text-xs-center'>My Favorites - {this.props.activeTag.name}</h2>
      )
    } else {
      return (
        <h2 className='text-xs-center'>My Favorites Library</h2>
      )
    }
  }

  renderSubTitle () {
    if (this.props.clips.title) {
      return (
        <h4 className='text-xs-center'>searching "{this.props.clips.title}"</h4>
      )
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-sm-12'>
          {this.renderTitle()}
          {this.renderSubTitle()}
          <div className='row'>
            <LibraryFilter queryParams={this.props.location} />
            <div className='col-sm-10'>
              <div className='card-columns'>
                {this.renderList()}
              </div>
              <div className='row'>
                {this.renderPaginator()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { filterCriteria, auth, myFavorites } = state

  return { authenticated: auth.authenticated, activeTag: filterCriteria.tag, clips: myFavorites }
}

export default connect(mapStateToProps, actions)(MyFavorites)
