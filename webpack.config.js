const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    'nativejsx-prototypes': './source/prototypal-helpers/index.js',
    'nativejsx-prototypes.min': './source/prototypal-helpers/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /min\.js$/,
      minify: true
    })
  ]
}
