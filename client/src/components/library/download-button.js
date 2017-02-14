import React from 'react'

const DownloadButton = React.createClass({

  propTypes: {
    filename: React.PropTypes.string,
    label: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps () {
    return {
      filename: 'file.txt',
      label: '',
      style: {}
    }
  },

  handleDownloadClick: function (event) {
    function magicDownload (fileName) {
      // create hidden link
      var element = document.createElement('a')
      document.body.appendChild(element)
      element.setAttribute('href', fileName)
      element.setAttribute('download', fileName)
      element.style.display = ''

      element.click()

      document.body.removeChild(element)
      event.stopPropagation()
    }

    magicDownload(this.props.filename)
  },

  renderLabel () {
    if (!this.props.label) {
      return <i className='fa fa-download' aria-hidden='true' />
    } else {
      return <span />
    }
  },

  render: function () {
    // if (this.props.label) {
    //
    // }
    return (
      <button style={this.props.style} className={this.props.className} onClick={this.handleDownloadClick}>
        {this.renderLabel}
        <i className='fa fa-download' aria-hidden='true' />
      </button>
    )
  }
})

export default DownloadButton
