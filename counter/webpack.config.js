module.exports = {
  entry: './src/counter.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
