import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Paginator extends Component {
  back() {
    const { offset, limit, form: { filters: { values } } } = this.props;

    if (offset === 0 ) { return; }

    this.props.searchArtists(values, offset - 10, limit);
  }

  advance() {
    const { offset, limit, count, form: { filters: { values } } } = this.props;

    if ((offset + limit) > count) { return; }

    this.props.searchArtists(values, offset + 10, limit);
  }

  left() {
    return (
      <li className={this.props.offset === 0 ? 'disabled page-item' : 'page-item'}>
        <a className="page-link" onClick={this.back.bind(this)}>
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
        <a className="page-link" onClick={this.advance.bind(this)}>
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
        <div>
        {this.props.count} Records Found
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ clips }) => {
  const { limit, offset, count } = clips;

  return { limit, offset, count};
};

export default connect(mapStateToProps, actions)(Paginator);
