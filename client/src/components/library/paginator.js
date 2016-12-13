import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Paginator extends Component {
  back() {
    const { offset, limit, activeTag } = this.props;

    if (offset === 0 ) { return; }

    let criteria = {
      offset: offset - 10,
      limit: limit
    };

    if (activeTag._id) {
      criteria.tags = activeTag._id;
    }

    this.props.searchClips(criteria);
  }

  advance() {
    const { offset, limit, count, activeTag } = this.props;

    if ((offset + limit) > count) { return; }

    let criteria = {
      offset: offset + 10,
      limit: limit
    };

    if (activeTag._id) {
      criteria.tags = activeTag._id;
    }

    this.props.searchClips(criteria);
  }

  left() {
    return (
      <li className={this.props.offset === 0 ? 'disabled page-item' : 'page-item'}>
        <a href="javascript:void(0)" className="page-link" onClick={this.back.bind(this)}>
          <span>&laquo;</span>
          <span className="sr-only">Previous</span>
        </a>
      </li>
    );
  }

  right() {
    const { offset, limit, count } = this.props;

    const end = ((offset + limit) >= count) ? true : false;

    return (
      <li className={end ? 'disabled page-item' : 'page-item'}>
        <a href="javascript:void(0)" className="page-link" onClick={this.advance.bind(this)}>
          <span>&raquo;</span>
          <span className="sr-only">Next</span>
        </a>
      </li>
    );
  }

  render() {
    return (
      <div className="col-sm-7 col-md-5 offset-md-3 paginationBlock">
        <ul className="pagination">
          {this.left()}
          <li className="page-item active"><a className="page-link">Page {this.props.offset / 10 + 1}</a></li>
          {this.right()}
        </ul>
        <div className="total-clips">
        {this.props.count} Clips Found
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { limit, offset, count } = state.clips;

  return { limit, offset, count, activeTag : state.filterCriteria.tag,};
};

export default connect(mapStateToProps, actions)(Paginator);
