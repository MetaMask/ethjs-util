const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var env = process.env.NODE_ENV;   // eslint-disable-line
var filename = 'ethjs-util';      // eslint-disable-line
var library = 'ethUtil';          // eslint-disable-line
var config = {                    // eslint-disable-line
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: ['json-loader'],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(path.join(__dirname, '../../dist')),
    filename: filename + '.js',       // eslint-disable-line
    library: library,                 // eslint-disable-line
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.BannerPlugin({ banner: ' /* eslint-disable */ ', raw: true, entryOnly: true }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
};

if (env === 'production') {
  config.output.filename = filename + '.min.js'; // eslint-disable-line
  config.plugins
    .push(new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
        screw_ie8: true,
      },
    }));
}

module.exports = config;
