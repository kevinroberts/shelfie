import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';

export default class TagList extends Component {

  renderList(tag) {
    return <span key={tag._id} className="tag tag-default"><Link title={`view clips tagged with ${tag.name}`} to={`/library?sort=createdAt&tags=${tag._id}`}>{tag.name}</Link></span>;
  }

  render() {

    return (
      <div className="tag-group">
        <i title="tagged under" className="fa fa-tags" aria-hidden="true" />
        {this.props.tags.map(this.renderList.bind(this))}
      </div>
    )

  };

}
