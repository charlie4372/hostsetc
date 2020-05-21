var path = require('path')

// This is pulled from electron-webpack build output.
// Using it to mimic the electron build process for WebStorm and jest
module.exports = {
    resolve: {
        alias: {
            '@renderer': path.resolve(__dirname, 'src', 'renderer'),
            '@common': path.resolve(__dirname, 'src', 'common'),
            '@static': path.resolve(__dirname, 'src', 'static'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },

  module: {
    "rules": [
      {
        "test": {},
        "exclude": {},
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              [
                null,
                {
                  "modules": false,
                  "targets": {
                    "electron": "8.2.0"
                  }
                }
              ]
            ],
            "plugins": [
              null
            ]
          }
        }
      },
      {
        "test": {},
        "use": "node-loader"
      },
      {
        "test": {},
        "enforce": "pre",
        "exclude": {},
        "loader": "eslint-loader",
        "options": {
          "cwd": path.resolve(__dirname)
        }
      },
      {
        "test": {},
        "use": [
          "css-hot-loader",
          path.resolve(__dirname, "node_modules/mini-css-extract-plugin/dist/loader.js"),
          {
            "loader": "css-loader",
            "options": {
              "modules": "global"
            }
          }
        ]
      },
      {
        "test": {},
        "use": [
          "css-hot-loader",
          path.resolve(__dirname, "node_modules/mini-css-extract-plugin/dist/loader.js"),
          {
            "loader": "css-loader",
            "options": {
              "modules": "global"
            }
          },
          "less-loader"
        ]
      },
      {
        "test": {},
        "use": [
          "css-hot-loader",
          path.resolve(__dirname, "node_modules/mini-css-extract-plugin/dist/loader.js"),
          {
            "loader": "css-loader",
            "options": {
              "modules": "global"
            }
          },
          "sass-loader"
        ]
      },
      {
        "test": {},
        "use": {
          "loader": "url-loader",
          "options": {
            "limit": 10240,
            "name": "imgs/[name]--[folder].[ext]"
          }
        }
      },
      {
        "test": {},
        "loader": "url-loader",
        "options": {
          "limit": 10240,
          "name": "media/[name]--[folder].[ext]"
        }
      },
      {
        "test": {},
        "use": {
          "loader": "url-loader",
          "options": {
            "limit": 10240,
            "name": "fonts/[name]--[folder].[ext]"
          }
        }
      },
      {
        "test": {},
        "use": "vue-html-loader"
      },
      {
        "test": {},
        "use": {
          "loader": "vue-loader",
          "options": {
            "loaders": {
              "sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax=1",
              "scss": "vue-style-loader!css-loader!sass-loader"
            }
          }
        }
      },
      {
        "test": {},
        "exclude": {},
        "use": [
          {
            "loader": "ts-loader",
            "options": {
              "transpileOnly": true,
              "appendTsSuffixTo": [
                {}
              ],
              "configFile": path.resolve(__dirname, "tsconfig.json")
            }
          }
        ]
      },
      {
        "enforce": "pre",
        "test": {},
        "exclude": {},
        "loader": "eslint-loader"
      }
    ]
  }
}
