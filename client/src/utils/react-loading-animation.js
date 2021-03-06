const React = require('react')

const loadingStyle = {
  position: 'relative',
  margin: '0px auto',
  width: '40px',
  height: '40px'
}

const svgStyle = {
  animation: 'rotate 2s linear infinite',
  height: '100%',
  transformOrigin: 'center center',
  width: '100%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto'
}

const circleStyle = {
  strokeDasharray: '1,200',
  strokeDashoffset: '0',
  animation: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
  strokeLinecap: 'round'
}

const animation = `@keyframes rotate {
    100% {
        transform: rotate(360deg)
    }
}
@keyframes dash {
    0% {
        stroke-dasharray: 1,200
        stroke-dashoffset: 0
    }
    50% {
        stroke-dasharray: 89,200
        stroke-dashoffset: -35px
    }
    100% {
        stroke-dasharray: 89,200
        stroke-dashoffset: -124px
    }
}
@keyframes color {
    100%, 0% {
        stroke: #d62d20
    }
    40% {
        stroke: #0057e7
    }
    66% {
        stroke: #008744
    }
    80%, 90% {
        stroke: #ffa700
    }
}`

class Loading extends React.Component {
  render () {
    let {isLoading, children} = this.props

    if (isLoading) {
      let {width, height, margin, style} = this.props

      loadingStyle.width = width
      loadingStyle.height = height
      loadingStyle.margin = margin

      return (
        <div style={Object.assign({}, loadingStyle, style)}>
          <style>{animation}</style>
          <svg style={svgStyle} viewBox='25 25 50 50'>
            <circle style={circleStyle} cx='50' cy='50' r='20' fill='none' strokeWidth='7' strokeMiterlimit='10' />
          </svg>
          <p className='loading-text'>Loading...</p>
        </div>
      )
    } else {
      return (<div>{children || null}</div>)
    }
  }
}

// Loading.propTypes = {
//     isLoading: React.PropTypes.bool,
//     style: React.PropTypes.object,
//     width: React.PropTypes.string,
//     height: React.PropTypes.string,
//     margin: React.PropTypes.string
// };

Loading.defaultProps = {
  isLoading: true,
  style: {},
  width: '40px',
  height: '40px',
  margin: '0 auto'
}

module.exports = Loading
