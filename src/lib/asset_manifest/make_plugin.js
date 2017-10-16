let ensureTrailingSlash = str => !str.match(/\/$/i) ? `${str}/` : str;
let AssetPlugin = require('assets-webpack-plugin');

module.exports = ({filename, path}) => new AssetPlugin({
    filename,
    path: ensureTrailingSlash(path)
});
