const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = (env, argv) => ({
    context: ROOT,

    entry: {
        'main': './main.ts'
    },
    
    output: {
        filename: '[name].bundle.js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader'
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: path.join(ROOT, 'index.html'), to: DESTINATION },
            { from: path.join(ROOT, 'assets'), to: path.join(DESTINATION, 'assets') }
        ]),
        new webpack.EnvironmentPlugin({
            HOST: argv.mode === 'production' ? 'http://95.216.169.56' : 'http://localhost',
            PORT: 9009
        })
    ],

    devtool: 'cheap-module-source-map',
    devServer: {}
});

