var path = require('path')

module.exports = {
    resolve: {
        alias: {
            '@renderer': path.resolve(__dirname, 'src', 'renderer'),
            '@common': path.resolve(__dirname, 'src', 'common'),
            '@static': path.resolve(__dirname, 'src', 'static'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}
