import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions';

class LibrarySearch extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //const queryParams = this.props.queryParams.query;

  }

  handleSubmit(event) {
    event.preventDefault();

    let searchValue = this.refs.librarySearch.value;

    let criteria = {
      title: searchValue,
    };

    if (this.props.activeTag) {
      criteria.tags = this.props.activeTag._id;
    }

    console.log("search triggered criteria", criteria);
  }



  render() {


    return (
      <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
        <div className="input-group nav-search">
          <input ref="librarySearch" className="form-control nav-search-input" type="text" placeholder="Search" />
          <span className="input-group-btn">
                       <button className="btn btn-secondary" type="submit">
                        <i className="fa fa-search" aria-hidden="true" />
                       </button>
                    </span>
        </div>
      </form>
    )

  };

}

const mapStateToProps = (state) => {
  const { filterCriteria, auth, clips } = state;

  return {
    tags: filterCriteria.tags,
    sort: clips.sort,
    authenticated: auth.authenticated,
    activeTag : filterCriteria.tag
  };
};

export default connect(mapStateToProps, actions)(LibrarySearch);

