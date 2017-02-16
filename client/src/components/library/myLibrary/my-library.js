import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import LibraryFilter from './my-library-filter'
import Paginator from './my-paginator'
import DocumentTitle from 'react-document-title'
// import Clip from '../clip/clip-reduxAudio-card';
import Clip from '../../clip/clip-sound'

class MyLibrary extends Component {

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
        <h2 className='text-xs-center'>My Library - {this.props.activeTag.name}</h2>
      )
    } else {
      return (
        <h2 className='text-xs-center'>My Clip Library</h2>
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
      <DocumentTitle title={'Shelfie - ' + this.props.username + '\'s library'}>
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
      </DocumentTitle>
    )
  }
}

function mapStateToProps (state) {
  const { filterCriteria, auth, myClips } = state

  return { authenticated: auth.authenticated,
    username: auth.username,
    activeTag: filterCriteria.tag,
    clips: myClips }
}

export default connect(mapStateToProps, actions)(MyLibrary)
