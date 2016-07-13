var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {

  devtool: 'source-map',

  entry: path.resolve(__dirname, './src/server/main.js'),

  output: {
    filename: 'server.bundle.js'
  },

  target: 'node',

  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),

  node: {
    __filename: false,
    __dirname: false
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        exclude: /node_modules/
      },
      {
        test: /\.json/,
        exclude: /node_modules/,
        loader: 'json'
      }
    ]
  },

  plugins: [
    // http://jlongster.com/Backend-Apps-with-Webpack--Part-I
    process.env.npm_lifecycle_event === 'start' ?
      new webpack.BannerPlugin('require("source-map-support").install();', {
        raw: true, entryOnly: false
      })
    : null
  ]

}
