const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// TODO: temporary workaround for making webpack 4 work across Node.js versions
// Remove once project upgraded to webpack 5
// https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported/69691525#69691525
const crypto = require('crypto');

const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = (algorithm) => cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm);

const env = process.env.NODE_ENV;
const filename = 'ethjs-util';
const library = 'ethUtil';
const config = {
  module: {
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(path.join(__dirname, '../../dist')),
    filename: filename + '.js',       // eslint-disable-line
    library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '/* eslint-disable */', raw: true, entryOnly: true }),
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
        },
        screw_ie8: true,
      },
    }));
}

module.exports = config;
