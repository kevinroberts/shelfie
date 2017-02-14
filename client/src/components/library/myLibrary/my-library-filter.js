import React, { Component } from 'react'
import { connect } from 'react-redux'
import TagItem from './my-tag-item'
import _ from 'lodash'
import * as actions from '../../../actions'

class MyLibraryFilter extends Component {

  componentWillMount () {
    const queryParams = this.props.queryParams.query

    const {activeTag} = this.props

    let criteria = {
      title: '',
      sort: 'createdAt'
    }

    if (queryParams.sort) {
      criteria.sort = queryParams.sort
    }

    if (queryParams.title) {
      criteria.title = queryParams.title
    }

    if (activeTag._id) {
      criteria.tags = activeTag._id
    }

    if (queryParams.tags) {
      criteria.tags = queryParams.tags
      this.props.setActiveTag({'_id': queryParams.tags})
    }

    if (queryParams.limit && queryParams.offset) {
      criteria.limit = _.toNumber(queryParams.limit)
      criteria.offset = _.toNumber(queryParams.offset)
    }

    this.props.searchMyClips(criteria)
  }

  componentDidMount () {
    this.props.getMyTagList()
  }

  handleSortChange (event) {
    console.log('new sort triggered', event.target.value)

    let criteria = {
      title: '',
      sort: event.target.value
    }

    if (this.props.activeTag) {
      criteria.tags = this.props.activeTag._id
    }

    this.props.searchMyClips(criteria)
  }

  handleTagClick () {
    this.props.setActiveTag({'_id': '', 'name': ''})

    this.props.searchMyClips({
      title: '',
      sort: 'createdAt'
    })
  }

  render () {
    const rows = this.props.tags.map((tag, i) => (
      <TagItem queryParams={this.props.queryParams} tag={tag} key={i} />
    ))

    return (
      <div className='col-sm-2'>
        <div className='sorting-actions'>
          <h4>Sort</h4>
          <select value={this.props.sort} onChange={this.handleSortChange.bind(this)}>
            <option value='' disabled>Sort by</option>
            <option value='createdAt'>Created date</option>
            <option value='titleAZ'>+Title</option>
            <option value='titleZA'>-Title</option>
            <option value='lengthPlus'>+Length</option>
            <option value='lengthMinus'>-Length</option>
          </select>
        </div>
        <h4>Tags</h4>
        <ul className='list-unstyled nav nav-pills nav-stacked tag-list'>
          <li className='nav-item'>
            <a className='nav-link' href='javascript:void(0)' onClick={this.handleTagClick.bind(this)}>All (clear
              filters)</a>
          </li>
          {rows}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {filterCriteria, auth, myClips} = state

  return {
    tags: filterCriteria.tags,
    sort: myClips.sort,
    authenticated: auth.authenticated,
    activeTag: filterCriteria.tag
  }
}

export default connect(mapStateToProps, actions)(MyLibraryFilter)

