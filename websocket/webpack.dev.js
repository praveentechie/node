'use strict'

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'ws-client': './src/client/client.js',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ]
  },
  devtool: 'inline-source-map', // ### webpack: to track error using original file..not to be used in prod
  plugins: [
    // ### webpack: HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      title: 'welcome to Websocket',
      filename: 'index.html', // default value
      template: 'index.html',
      inject: true,
      excludeChunks: [ 'server' ]
    })
  ]
};