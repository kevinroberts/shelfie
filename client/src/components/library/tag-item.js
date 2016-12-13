import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class TagItem extends Component {

  handleTagClick () {
    this.props.setActiveTag(this.props.tag);

    this.props.searchClips({
      title: '',
      sort: 'createdAt',
      tags: this.props.tag._id
    });
  };


  render() {

    let { tag } = this.props;

    let activeClass = '';

    if (this.props.activeTag._id === tag._id) {
      activeClass = ' active';
    }

    if (tag.clips.length === 0) {
      return (
        <li key={tag._id}>
          {tag.name} <span className="tag tag-default tag-pill">{tag.clips.length}</span>
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
  const { auth, filterCriteria } = state;

  return {
    activeTag : filterCriteria.tag,
    authenticated: auth.authenticated
  };
};

export default connect(mapStateToProps, actions)(TagItem);