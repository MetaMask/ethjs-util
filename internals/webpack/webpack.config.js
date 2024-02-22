const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
  devtool: env === 'production'
    ? false
    : 'cheap-module-source-map',
  optimization: env === 'production'
    ? {
      minimize: true,
      minimizer: [new TerserPlugin({
        sourceMap: false,
        terserOptions: {
          ecma: 6,
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
          },
          ie8: false,
          mangle: false,
        },
      })],
    } : {},
  output: {
    path: path.resolve(path.join(__dirname, '../../dist')),
    filename: env === 'production'
      ? filename + '.min.js'    // eslint-disable-line
      : filename + '.js',       // eslint-disable-line
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

module.exports = config;
