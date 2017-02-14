import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import UltimatePagination from '../../../utils/pagination/UltimatePaginationBootstrap4'

class MyFavoritesPaginator extends Component {

  constructor (props) {
    super(props)

    this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this)
  }

  onPageChangeFromPagination (newPage) {
    const queryParams = this.props.queryParams.query
    const { limit, activeTag, sort } = this.props

    let criteria = {
      offset: ((newPage - 1) * limit),
      limit: limit
    }

    if (activeTag._id) {
      criteria.tags = activeTag._id
    }

    if (sort) {
      criteria.sort = sort
    }

    if (queryParams.title) {
      criteria.title = queryParams.title
    }

    this.props.searchMyFavorites(criteria)
  }

  render () {
    return (
      <div className='col-sm-7 col-md-5 offset-md-3 paginationBlock'>

        <UltimatePagination currentPage={this.props.currentPage} totalPages={this.props.totalPages} onChange={this.onPageChangeFromPagination} />

        <div className='invisible'>
          {this.props.count} Clips Found
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { limit, offset, count, currentPage, totalPages, sort } = state.myFavorites

  return { limit, offset, count, currentPage, totalPages, sort, activeTag: state.filterCriteria.tag }
}

export default connect(mapStateToProps, actions)(MyFavoritesPaginator)
