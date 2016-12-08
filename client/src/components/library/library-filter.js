import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class LibraryFilter extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTagList();
  }

  renderTags() {
    return this.props.tags.map((tag) =>
      <li>
          <a href="">{tag.name}</a> <span className="tag tag-default tag-pill">{tag.clips.length}</span>
      </li>
      );
  }


  render() {

    return (
            <div className="col-sm-2">
              <h4>Tags</h4>
              <ul className="list-unstyled">
                {this.renderTags()}
              </ul>
            </div>
    )

  };

}

const mapStateToProps = (state) => {
  const { filterCriteria, auth } = state;

  return {
    tags: filterCriteria.tags,
    authenticated: auth.authenticated
  };
};

export default connect(mapStateToProps, actions)(LibraryFilter);

