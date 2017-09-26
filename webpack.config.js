const fs = require('fs');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const licensePlugin = require('license-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const ***REMOVED*** NoEmitOnErrorsPlugin, EnvironmentPlugin, HashedModuleIdsPlugin ***REMOVED*** = require('webpack');
const ***REMOVED*** GlobCopyWebpackPlugin, BaseHrefWebpackPlugin, SuppressExtractedTextChunksWebpackPlugin ***REMOVED*** = require('@angular/cli/plugins/webpack');
const ***REMOVED*** CommonsChunkPlugin, UglifyJsPlugin ***REMOVED*** = require('webpack').optimize;
const ***REMOVED*** AotPlugin ***REMOVED*** = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","scripts","styles","vendor","main"];
const minimizeCss = true;
const baseHref = "";
const deployUrl = "";
const postcssPlugins = function () ***REMOVED***
        // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
        const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
        const minimizeOptions = ***REMOVED***
            autoprefixer: false,
            safe: true,
            mergeLonghand: false,
            discardComments: ***REMOVED*** remove: (comment) => !importantCommentRe.test(comment) ***REMOVED***
        ***REMOVED***;
        return [
            postcssUrl(***REMOVED***
                url: (URL) => ***REMOVED***
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    if (!URL.startsWith('/') || URL.startsWith('//')) ***REMOVED***
                        return URL;
                    ***REMOVED***
                    if (deployUrl.match(/:\/\//)) ***REMOVED***
                        // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                        return `$***REMOVED***deployUrl.replace(/\/$/, '')***REMOVED***$***REMOVED***URL***REMOVED***`;
                    ***REMOVED***
                    else if (baseHref.match(/:\/\//)) ***REMOVED***
                        // If baseHref contains a scheme, include it as is.
                        return baseHref.replace(/\/$/, '') +
                            `/$***REMOVED***deployUrl***REMOVED***/$***REMOVED***URL***REMOVED***`.replace(/\/\/+/g, '/');
                    ***REMOVED***
                    else ***REMOVED***
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/$***REMOVED***baseHref***REMOVED***/$***REMOVED***deployUrl***REMOVED***/$***REMOVED***URL***REMOVED***`.replace(/\/\/+/g, '/');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***),
            autoprefixer(),
        ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
    ***REMOVED***;




module.exports = ***REMOVED***
  "resolve": ***REMOVED***
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true
  ***REMOVED***,
  "resolveLoader": ***REMOVED***
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  ***REMOVED***,
  "entry": ***REMOVED***
    "main": [
      "./src/main.ts"
    ],
    "polyfills": [
      "./src/polyfills.ts"
    ],
    "scripts": [
      "script-loader!./node_modules/chart.js/dist/Chart.bundle.min.js",
      "script-loader!./node_modules/chart.js/dist/Chart.min.js"
    ],
    "styles": [
      "./src/scss/style.scss"
    ]
  ***REMOVED***,
  "output": ***REMOVED***
    "path": path.join(process.cwd(), "dist"),
    "filename": "../[name].[chunkhash:20].bundle.js",
    "chunkFilename": "[id].[chunkhash:20].chunk.js"
  ***REMOVED***,
  "module": ***REMOVED***
    "rules": [
      ***REMOVED***
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /\/node_modules\//
        ]
      ***REMOVED***,
      ***REMOVED***
        "test": /\.json$/,
        "loader": "json-loader"
      ***REMOVED***,
      ***REMOVED***
        "test": /\.html$/,
        "loader": "raw-loader"
      ***REMOVED***,
      ***REMOVED***
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      ***REMOVED***,
      ***REMOVED***
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      ***REMOVED***,
      ***REMOVED***
        "exclude": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          ***REMOVED***
            "loader": "css-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "importLoaders": 1
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "postcss-loader",
            "options": ***REMOVED***
              "ident": "postcss",
              "plugins": postcssPlugins
            ***REMOVED***
          ***REMOVED***
        ]
      ***REMOVED***,
      ***REMOVED***
        "exclude": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          ***REMOVED***
            "loader": "css-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "importLoaders": 1
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "postcss-loader",
            "options": ***REMOVED***
              "ident": "postcss",
              "plugins": postcssPlugins
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "sass-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            ***REMOVED***
          ***REMOVED***
        ]
      ***REMOVED***,
      ***REMOVED***
        "exclude": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.less$/,
        "use": [
          "exports-loader?module.exports.toString()",
          ***REMOVED***
            "loader": "css-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "importLoaders": 1
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "postcss-loader",
            "options": ***REMOVED***
              "ident": "postcss",
              "plugins": postcssPlugins
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "less-loader",
            "options": ***REMOVED***
              "sourceMap": false
            ***REMOVED***
          ***REMOVED***
        ]
      ***REMOVED***,
      ***REMOVED***
        "exclude": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.styl$/,
        "use": [
          "exports-loader?module.exports.toString()",
          ***REMOVED***
            "loader": "css-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "importLoaders": 1
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "postcss-loader",
            "options": ***REMOVED***
              "ident": "postcss",
              "plugins": postcssPlugins
            ***REMOVED***
          ***REMOVED***,
          ***REMOVED***
            "loader": "stylus-loader",
            "options": ***REMOVED***
              "sourceMap": false,
              "paths": []
            ***REMOVED***
          ***REMOVED***
        ]
      ***REMOVED***,
      ***REMOVED***
        "include": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.css$/,
        "loaders": ExtractTextPlugin.extract(***REMOVED***
  "use": [
    ***REMOVED***
      "loader": "css-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "importLoaders": 1
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "postcss-loader",
      "options": ***REMOVED***
        "ident": "postcss",
        "plugins": postcssPlugins
      ***REMOVED***
    ***REMOVED***
  ],
  "publicPath": ""
***REMOVED***)
      ***REMOVED***,
      ***REMOVED***
        "include": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": ExtractTextPlugin.extract(***REMOVED***
  "use": [
    ***REMOVED***
      "loader": "css-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "importLoaders": 1
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "postcss-loader",
      "options": ***REMOVED***
        "ident": "postcss",
        "plugins": postcssPlugins
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "sass-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "precision": 8,
        "includePaths": []
      ***REMOVED***
    ***REMOVED***
  ],
  "publicPath": ""
***REMOVED***)
      ***REMOVED***,
      ***REMOVED***
        "include": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.less$/,
        "loaders": ExtractTextPlugin.extract(***REMOVED***
  "use": [
    ***REMOVED***
      "loader": "css-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "importLoaders": 1
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "postcss-loader",
      "options": ***REMOVED***
        "ident": "postcss",
        "plugins": postcssPlugins
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "less-loader",
      "options": ***REMOVED***
        "sourceMap": false
      ***REMOVED***
    ***REMOVED***
  ],
  "publicPath": ""
***REMOVED***)
      ***REMOVED***,
      ***REMOVED***
        "include": [
          path.join(process.cwd(), "src/scss/style.scss")
        ],
        "test": /\.styl$/,
        "loaders": ExtractTextPlugin.extract(***REMOVED***
  "use": [
    ***REMOVED***
      "loader": "css-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "importLoaders": 1
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "postcss-loader",
      "options": ***REMOVED***
        "ident": "postcss",
        "plugins": postcssPlugins
      ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
      "loader": "stylus-loader",
      "options": ***REMOVED***
        "sourceMap": false,
        "paths": []
      ***REMOVED***
    ***REMOVED***
  ],
  "publicPath": ""
***REMOVED***)
      ***REMOVED***,
      ***REMOVED***
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      ***REMOVED***
    ]
  ***REMOVED***,
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new GlobCopyWebpackPlugin(***REMOVED***
      "patterns": [
        "../static/webapp/assets"
      ],
      "globOptions": ***REMOVED***
        "cwd": path.join(process.cwd(), "src"),
        "dot": true,
        "ignore": "**/.gitkeep"
      ***REMOVED***
    ***REMOVED***),
    new ProgressPlugin(),
    new HtmlWebpackPlugin(***REMOVED***
      "template": "./src/index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": ***REMOVED***
        "caseSensitive": true,
        "collapseWhitespace": true,
        "keepClosingSlash": true
      ***REMOVED***,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) ***REMOVED***
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) ***REMOVED***
            return 1;
        ***REMOVED***
        else if (leftIndex < rightindex) ***REMOVED***
            return -1;
        ***REMOVED***
        else ***REMOVED***
            return 0;
        ***REMOVED***
    ***REMOVED***
    ***REMOVED***),
    new BaseHrefWebpackPlugin(***REMOVED******REMOVED***),
    new CommonsChunkPlugin(***REMOVED***
      "minChunks": 2,
      "async": "common"
    ***REMOVED***),
    new CommonsChunkPlugin(***REMOVED***
      "name": [
        "inline"
      ],
      "minChunks": null
    ***REMOVED***),
    new CommonsChunkPlugin(***REMOVED***
      "name": [
        "vendor"
      ],
      "minChunks": (module) => ***REMOVED***
                return module.resource
                    && (module.resource.startsWith(nodeModules)
                        || module.resource.startsWith(genDirNodeModules)
                        || module.resource.startsWith(realNodeModules));
            ***REMOVED***,
      "chunks": [
        "main"
      ]
    ***REMOVED***),
    new ExtractTextPlugin(***REMOVED***
      "filename": "[name].[contenthash:20].bundle.css"
    ***REMOVED***),
    new SuppressExtractedTextChunksWebpackPlugin(),
    new EnvironmentPlugin(***REMOVED***
      "NODE_ENV": "production"
    ***REMOVED***),
    new HashedModuleIdsPlugin(***REMOVED***
      "hashFunction": "md5",
      "hashDigest": "base64",
      "hashDigestLength": 4
    ***REMOVED***),
    new UglifyJsPlugin(***REMOVED***
      "mangle": ***REMOVED***
        "screw_ie8": true
      ***REMOVED***,
      "compress": ***REMOVED***
        "screw_ie8": true,
        "warnings": false
      ***REMOVED***,
      "sourceMap": false,
      "comments": false
    ***REMOVED***),
    new licensePlugin(***REMOVED***
      "pattern": /^(MIT|ISC|BSD.*)$/
    ***REMOVED***),
    new AotPlugin(***REMOVED***
      "mainPath": "main.ts",
      "hostReplacementPaths": ***REMOVED***
        "environments/environment.ts": "environments/environment.prod.ts"
      ***REMOVED***,
      "exclude": [],
      "tsConfigPath": "src/tsconfig.app.json"
    ***REMOVED***)
  ],
  "node": ***REMOVED***
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  ***REMOVED***,
  "devServer": ***REMOVED***
    "historyApiFallback": true
  ***REMOVED***
***REMOVED***;
