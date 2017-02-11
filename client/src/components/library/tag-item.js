import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class TagItem extends Component {

  handleTagClick () {
    this.props.setActiveTag(this.props.tag);
    const queryParams = this.props.queryParams.query;

    let criteria = {
      title: '',
      sort: this.props.sort,
      tags: this.props.tag._id
    };

    // reset limit and offset if this is a new tag click
    if (queryParams.limit && queryParams.offset) {
      criteria.limit = 20;
      criteria.offset = 0;
    }

    this.props.searchClips(criteria);

  };


  render() {

    let { tag } = this.props;
    const queryParams = this.props.queryParams.query;

    let activeClass = '';

    if (this.props.activeTag._id === tag._id) {
      activeClass = ' active';
    }
    if (queryParams.tags && queryParams.tags === tag._id) {
      activeClass = ' active';
    }

    if (tag.clips.length === 0) {
      return (
        <li key={tag._id}>
          <a href="javascript:void(0)" title={`No clips tagged under ${tag.name}`} className="nav-link empty-clips-link"> {tag.name} <span className="tag tag-default tag-pill">{tag.clips.length}</span> </a>
        </li>
      )
    }

    return (
      <li key={tag._id} className="nav-item">
        <a href="javascript:void(0)" onClick={this.handleTagClick.bind(this)} className={'nav-link ' + activeClass}>{tag.name} <span className="tag tag-default tag-pill">{tag.clips.length}</span></a>
      </li>
    )
  };
}

const mapStateToProps = (state) => {
  const { auth, filterCriteria, clips } = state;

  return {
    sort: clips.sort,
    activeTag : filterCriteria.tag,
    authenticated: auth.authenticated
  };
};

export default connect(mapStateToProps, actions)(TagItem);