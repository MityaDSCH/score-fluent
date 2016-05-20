require('dotenv').config();

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'src/client/app'),
    style: path.join(__dirname, 'src/client/app/main.scss'),
    build: path.join(__dirname, 'dist/client')
};
process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.style
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'node_modules/html-webpack-template/index.ejs',
      title: 'Score Fluent',
      appMountId: 'app',
      inject: false
    })
  ]
}

// Add dev server config
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    output: {
      filename: '[name].[hash].js',
    },
    module: {
      loaders: [
        {
          test: /\.s(c|a)ss$/,
          loaders: ['style', 'css', 'sass'],
          include: PATHS.app
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

// Just build it
if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        return v !== 'alt-utils'
      })
    },
    output: {
      filename: '[name].[chunkhash].js'
    },
    module: {
      loaders: [
        {
          test: /\.s(c|a)ss$/,
          loader: ExtractTextPlugin.extract('style', 'css', 'sass'),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new CleanPlugin([PATHS.build]),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
