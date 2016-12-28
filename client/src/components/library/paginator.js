import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router';
import Qs from 'Qs';
import UltimatePagination from '../../utils/pagination/UltimatePaginationBootstrap4';

class Paginator extends Component {

  constructor(props) {
    super(props);

    this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);
  }


  onPageChangeFromPagination(newPage) {

    const { limit, activeTag, sort } = this.props;

    let criteria = {
      offset: ((newPage-1) * limit),
      limit: limit
    };

    if (activeTag._id) {
      criteria.tags = activeTag._id;
    }

    if (sort) {
      criteria.sort = sort;
    }

    browserHistory.push(`/library?${Qs.stringify(criteria)}`);

    this.props.searchClips(criteria);
  }

  render() {

    return (
      <div className="col-sm-7 col-md-5 offset-md-3 paginationBlock">

        <UltimatePagination currentPage={this.props.currentPage} totalPages={this.props.totalPages} onChange={this.onPageChangeFromPagination} />

        <div className="invisible">
        {this.props.count} Clips Found
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { limit, offset, count, currentPage, totalPages, sort } = state.clips;

  return { limit, offset, count, currentPage, totalPages, sort, activeTag : state.filterCriteria.tag,};
};

export default connect(mapStateToProps, actions)(Paginator);
