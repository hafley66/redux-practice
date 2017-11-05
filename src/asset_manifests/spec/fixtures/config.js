let path = require('path');
let WebpackManifestPlugin = require('webpack-manifest-plugin');
const  dir = (f) => path.resolve(__dirname, f);
module.exports = () => ({
    entry: dir('a.js'),
    output: {
        filename: '[name].[chunkhash].js',
        path: dir('output'),
        publicPath: '/build/'
    },
    devtool: 'source-map',
    context: dir('..'),
    plugins: [new WebpackManifestPlugin({
        publicPath: '/build/'
    })]
});
