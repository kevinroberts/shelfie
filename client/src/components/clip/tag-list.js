import React from 'react';
import { Component } from 'react';


export default class TagList extends Component {

  renderList(tag) {
    return <span key={tag._id} className="tag tag-default">{tag.name}</span>;
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
