import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import DocumentTitle from 'react-document-title'

class Signout extends Component {
  componentWillMount () {
    this.props.signoutUser()
  }

  render () {
    return (
      <DocumentTitle title={'Shelfie - sign out'}>
        <div>Sorry to see you go...</div>
      </DocumentTitle>
    )
  }
}

export default connect(null, actions)(Signout)
