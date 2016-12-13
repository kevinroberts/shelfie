import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import TagItem from './tag-item'
import * as actions from '../../actions';

class LibraryFilter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTag: null,
    };

  }

  componentWillMount() {
      this.props.searchClips({
        title: '',
        sort: 'createdAt'
      });
  }

  componentDidMount() {
    this.props.getTagList();
  }

  handleTagClick () {
    this.props.setActiveTag({  "_id": '', "name" : "" });

    this.props.searchClips({
      title: '',
      sort: 'createdAt',
    });
  };


  render() {

    const rows = this.props.tags.map((tag, i) => (
      <TagItem tag={tag} key={i} />
    ));

    return (
            <div className="col-sm-2">
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
  const { filterCriteria, auth } = state;

  return {
    tags: filterCriteria.tags,
    authenticated: auth.authenticated
  };
};

export default connect(mapStateToProps, actions)(LibraryFilter);

