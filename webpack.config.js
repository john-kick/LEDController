const path = require('path');
const glob = require('glob');

module.exports = {
    entry: glob.sync('./src/frontend/**/*.ts'),
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules:[
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.resolve(__dirname, "src/frontend"), "node_modules"],
        preferRelative: true
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}