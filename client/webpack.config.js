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
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.sass']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
