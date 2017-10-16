const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
let {compact} = require('lodash');

const DEFAULTS = {
    uglify: {
        js: {
            extractComments: true,
            parallel: {
                cache: true,
                workers: 3
            }
        },
        css: true
    },
    compress: {
        asset: `[path].gz[query]`,
        algorithm: `gzip`,
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8
    }
};


// TODO: CSS Nano support
module.exports = (config, slice = {}) => {
    if(slice === true)
        slice = DEFAULTS;
    if(slice && slice.uglify) {
        if(slice.uglify === true) slice.uglify = DEFAULTS.uglify;
        if(slice.uglify.js === true) slice.uglify.js = DEFAULTS.uglify.js;
        if(slice.uglify.css === true) slice.uglify.css = DEFAULTS.uglify.css;
    }
    if(slice && slice.compress === true)
        slice.compress = DEFAULTS.compress;

    if(slice){
        let
            { uglify, compress } = slice,
            plugins = compact([
                (uglify && uglify.js)
                    ? new UglifyJsPlugin(uglify.js)
                    : null,
                (compress)
                    ? new CompressionPlugin(compress)
                    : null
            ]);
        return {
            config: {plugins}
        };
    } else {
        return {};
    }
};
