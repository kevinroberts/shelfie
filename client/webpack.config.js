var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.sass']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    proxy:{
      '/api/*' : {
        target: 'http://127.0.0.1:3090/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
