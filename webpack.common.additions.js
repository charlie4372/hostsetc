var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var packageJson = fs.readFileSync('./package.json');
var version = JSON.parse(packageJson).version || '0';

module.exports = function(config) {

  // set the aliases
  config.resolve.alias['@renderer'] = path.resolve(__dirname, 'src', 'renderer');
  config.resolve.alias['@common'] = path.resolve(__dirname, 'src', 'common');
  config.resolve.alias['@static'] = path.resolve(__dirname, 'static');
  // TODO Add production vue build
  config.resolve.alias['vue$'] = path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.common.dev.js');

  // externals
  config.externals.push('vue'); // vuetify and vue bundled with webpack don't like each other.

  //stats
  config.stats = config.stats || {};
  config.stats.modules = false;

  config.module.rules.push({
    enforce: 'pre',
    test: /\.ts$/,
    exclude: /node_modules/,
    loader: 'eslint-loader'
  });

  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'PACKAGE_VERSION': '"'+ version +'"'
    }
  }));

  return config;
}
