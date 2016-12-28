import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TagItem from './tag-item'
import Qs from 'Qs';
import * as actions from '../../actions';

class LibraryFilter extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const queryParams = this.props.queryParams.query;

    const { activeTag } = this.props;

    let criteria = {
      title: '',
      sort: 'createdAt'
    };

    if (queryParams.sort) {
      criteria.sort = queryParams.sort;
    }

    if (activeTag._id) {
      criteria.tags = activeTag._id;
    }

    if (queryParams.tags) {
      criteria.tags = queryParams.tags;
      this.props.setActiveTag({  "_id": queryParams.tags });
    }

    this.props.searchClips(criteria);
  }

  componentDidMount() {
    this.props.getTagList();
  }

  handleSortChange(event) {
    console.log("new sort triggered", event.target.value);

    let criteria = {
      title: '',
      sort: event.target.value,
    };

    if (this.props.activeTag) {
      criteria.tags = this.props.activeTag._id;
    }

    this.props.searchClips(criteria);

    browserHistory.push(`/library?${Qs.stringify(criteria)}`);

  }

  handleTagClick () {
    this.props.setActiveTag({  "_id": '', "name" : "" });

    this.props.searchClips({
      title: '',
      sort: 'createdAt',
    });

    browserHistory.push('/library');
  };


  render() {

    const rows = this.props.tags.map((tag, i) => (
      <TagItem queryParams={this.props.queryParams} tag={tag} key={i} />
    ));

    return (
            <div className="col-sm-2">
              <div className="sorting-actions">
                <h4>Sort</h4>
              <select value={this.props.sort} onChange={this.handleSortChange.bind(this)}>
                <option value="" disabled>Sort by</option>
                <option value="createdAt">Created date</option>
                <option value="titleAZ">+Title</option>
                <option value="titleZA">-Title</option>
                <option value="lengthPlus">+Length</option>
                <option value="lengthMinus">-Length</option>
              </select>
              </div>
              <h4>Tags</h4>
              <ul className="list-unstyled nav nav-pills nav-stacked tag-list">
                <li className="nav-item">
                  <a className="nav-link" href="javascript:void(0)" onClick={this.handleTagClick.bind(this)}>All </a>
                </li>
                {rows}
              </ul>
            </div>
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

export default connect(mapStateToProps, actions)(LibraryFilter);

