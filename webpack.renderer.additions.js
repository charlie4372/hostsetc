const path = require ('path');

module.exports = function(config) {
  // set the aliases
  config.resolve.alias['@renderer'] = path.resolve(__dirname, 'src', 'renderer');
  config.resolve.alias['@common'] = path.resolve(__dirname, 'src', 'common');
  config.resolve.alias['@static'] = path.resolve(__dirname, 'static');
  // TODO Add production vue build
  config.resolve.alias['vue$'] = path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.common.dev.js');

  // externals
  config.externals.push('vue'); // vuetify and vue bundled with webpack dons't like each others.

  //stats
  config.stats = config.stats || {};
  config.stats.modules = false;
  // config.stats.errorStack = false;

  // modules
  // config.module.rules.filter(rule => rule.test.toString() === /\.tsx?$/.toString())
  //   .forEach(rule => {
  //     console.log("LOADERS", JSON.stringify(rule, null, 4));
  //   });

  // console.log("LOADERS", JSON.stringify(config.module.rules, null, 4));

  config.module.rules.push({
    enforce: 'pre',
    test: /\.ts$/,
    exclude: /node_modules/,
    loader: 'eslint-loader'
  });

  // update the rules
  // config.module.rules.forEach((rule) => {
  //   if (rule.use && rule.use.loader && rule.use.loader === 'babel-loader') {
  //     console.log(JSON.stringify(rule, null, 4))
  //     if (!Array.isArray(rule.exclude)) {
  //       // TODO what is the risk here?
  //       rule.exclude = [];
  //     }
  //     rule.exclude.push(/node_modules/);
  //   }
  // });

  // console.log(JSON.stringify(config.module, null, 4))

  return config;
}
