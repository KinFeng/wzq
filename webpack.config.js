const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isPRD = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    app: isPRD ? ['./src/index.js'] : ['./src/index.js', 'webpack-hot-middleware/client?reload=true'],
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, minimize: true },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcss: () => [
                  autoprefixer({
                    browsers: ['ie>=8', '>1% in CN'],
                  }),
                ],
              },
            },
            'sass-loader',
          ],
        }),
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ['url-loader?limit=8192'] },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app'),
    ],
    extensions: ['.js', '.json', '.jsx', '.css'],
    // alias: {
    //   'module': path.resolve(__dirname, 'app/third/module.js'),
    // },
  },
  devtool: 'source-map',
  externals: ['Stomp'],
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunksSortMode: 'dependency',
    }),
    new CopyWebpackPlugin([
      { from: 'static', to: 'static' },
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[hash:8].js',
      minChunks: function minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // CommonChunksPlugin will now extract all the common modules from vendor and main bundles,
      // But since there are no more common modules between them we end up with
      // just the runtime code included in the manifest file
      name: 'manifest',
    }),
    new ExtractTextPlugin({
      filename: 'index.min.css',
      allChunks: true,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // compile time plugins
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
};

if (isPRD) {
  config.plugins.push(new CleanWebpackPlugin(
    ['dist/*'],
    {
      root: __dirname,
      verbose: true,
      dry: false,
    }), new webpack.optimize.UglifyJsPlugin(
      { compress: {
        warnings: false,
        drop_console: false,
      } }));
} else {
  config.plugins.push(
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
