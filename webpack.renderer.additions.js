const commonConfig = require('./webpack.common.additions.js');

module.exports = function(config) {
  config = commonConfig(config);

  return config;
}
