import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import _ from 'lodash'

class MyFavoritesTagItem extends Component {

  handleTagClick () {
    this.props.setActiveTag(this.props.tag)
    const queryParams = this.props.queryParams.query

    let criteria = {
      title: '',
      sort: this.props.sort,
      tags: this.props.tag._id
    }

    // reset limit and offset if this is a new tag click
    if (queryParams.limit && queryParams.offset) {
      criteria.limit = 20
      criteria.offset = 0
    }

    this.props.searchMyFavorites(criteria)
  }

  render () {
    let { tag, favoriteClips } = this.props
    const queryParams = this.props.queryParams.query

    let activeClass = ''

    if (this.props.activeTag._id === tag._id) {
      activeClass = ' active'
    }
    if (queryParams.tags && queryParams.tags === tag._id) {
      activeClass = ' active'
    }

    // only count the clips contained in the favorites list
    let clipNumber = tag.clips.reduce(function (sum, clip) {
      if (favoriteClips) {
        if (_.indexOf(favoriteClips, clip) !== -1) {
          return sum + 1
        } else {
          return sum
        }
      } else {
        return sum
      }
    }, 0)

    if (tag.clips.length === 0) {
      return (
        <li key={tag._id}>
          <a href='javascript:void(0)' title={`No clips tagged under ${tag.name}`} className='nav-link empty-clips-link'> {tag.name} <span className='tag tag-default tag-pill'>{clipNumber}</span> </a>
        </li>
      )
    }

    return (
      <li key={tag._id} className='nav-item'>
        <a href='javascript:void(0)' onClick={this.handleTagClick.bind(this)} className={'nav-link ' + activeClass}>{tag.name} <span className='tag tag-default tag-pill'>{clipNumber}</span></a>
      </li>
    )
  }
}

const mapStateToProps = (state) => {
  const { filterCriteria, myFavorites } = state

  return {
    sort: myFavorites.sort,
    activeTag: filterCriteria.tag,
    favoriteClips: state.auth.favoriteClips
  }
}

export default connect(mapStateToProps, actions)(MyFavoritesTagItem)
