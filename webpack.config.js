const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, arg) => ({
    entry: './src/index.js',
    output: {
        filename: 'perfanalytics.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Perfanalytics',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
    plugins : [
        new Dotenv({
            path: `./.env.${arg.mode === 'development' ? "dev" : "prod"}`,
        })
    ],
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
});