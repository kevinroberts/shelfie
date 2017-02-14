var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: ['./src/index']
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: require.resolve('wavesurfer.js'), loader: 'expose-loader?$!expose-loader?jQuery' },
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: 'style!css!'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin('style.css', {
      allChunks: true
    })
  ],
  resolve: {
    alias: { soundmanager2: 'soundmanager2/script/soundmanager2-nodebug-jsmin.js' },
    extensions: ['', '.js', '.jsx', '.sass']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:3090/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
}
