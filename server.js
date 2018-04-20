/* eslint-disable */
var express = require('express');
var proxy = require('http-proxy-middleware');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var history = require('connect-history-api-fallback');

var app = express();
var compiler = webpack(webpackConfig);

// app.use('/api', proxy({target: 'http://localhost:8080', pathRewrite: {'^/api':''}, changeOrigin: true}));

app.use(history());

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/',
  noInfo: 'error',
  historyApiFallback: true,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/static', express.static('static')); 

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});