import path from 'path'
import 'webpack'
import autoprefixer from 'autoprefixer'


export default ***REMOVED***
    entry:  './web_client/app.js',
    output:  ***REMOVED***
        path: `$***REMOVED***__dirname***REMOVED***/main/static`,
        filename: 'app.js'
    ***REMOVED***,
    resolve: ***REMOVED***
        extensions: ['', '.js', '.jsx', '.scss'],
        modulesDirectories: [
            'node_modules'
        ]
    ***REMOVED***,
    module: ***REMOVED***
        loaders: [
            ***REMOVED***
                test: /\.jsx?$/,
                loader: ['babel'],
                include: [
                    path.resolve(__dirname, "web_client")
                ],
                query: ***REMOVED***
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                ***REMOVED***
            ***REMOVED***,
            ***REMOVED***
                test: /\.s[a|c]ss$/,
                loaders: [
                    'style',
                    'css',
                    'postcss',
                    'sass'
                ]
            ***REMOVED***
        ]
    ***REMOVED***,
    sassLoader: ***REMOVED***
        includePaths: [
            path.resolve(__dirname, "./web_client"),
            path.resolve(__dirname, "./node_modules/bootstrap/scss")
        ]
    ***REMOVED***,
    postcss: () => [autoprefixer(***REMOVED*** browsers: ['> 1%'] ***REMOVED***)]
***REMOVED***
