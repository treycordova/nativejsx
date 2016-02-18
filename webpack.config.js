var webpack = require('webpack');

module.exports = {
  entry: {
    'nativejsx-prototypes': './source/prototypal-helpers/index.js',
    'nativejsx-prototypes.min': './source/prototypal-helpers/index.js'
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /min\.js$/,
      minify: true
    })
  ]
};
