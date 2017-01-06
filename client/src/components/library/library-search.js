import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class LibrarySearch extends Component {

  constructor(props) {
    super(props);

    this.state = {value: ''};
  }

  componentWillMount() {
    const queryParams = this.props.queryParams.query;

    if (queryParams.title) {
      this.setState({value: queryParams.title});
    }
  }

  componentWillReceiveProps(nextProps) {
    // if title search was reset - clear the search box
    if (nextProps.queryParams) {
      var titleSearch = nextProps.queryParams.query.title;
      if (!titleSearch) {
        this.setState({value: ''});
      }
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    const { activeTag } = this.props;

    const queryParams = this.props.queryParams.query;

    let searchValue = this.state.value;

    let criteria = {
      title: searchValue,
      sort: 'createdAt'
    };

    if (queryParams.sort) {
      criteria.sort = queryParams.sort;
    }

    if (activeTag._id) {
      criteria.tags = activeTag._id;
    }

    this.props.searchClips(criteria);
  }



  render() {

    return (
      <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
        <div className="input-group nav-search">
          <input ref="librarySearch" className="form-control nav-search-input" type="text" placeholder="Search" value={this.state.value} onChange={this.handleChange.bind(this)} />
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

