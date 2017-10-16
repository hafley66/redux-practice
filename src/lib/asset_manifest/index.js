let makeAssetPlugin = require('./make_plugin');
let {isString} = require('lodash');
let finder = require('./finder');

const DEFAULT = {
    filename: 'assets.json',
    cache: false
};

module.exports = (config, arg = DEFAULT) => {
    let { 'meta.constants.paths': {cache, build, publicPath} } = config;

    if(isString(arg))
        arg = {
            filename: arg,
            cache: DEFAULT.cache
        };

    let mainFinder = finder({
        cache: arg.cache,
        folder: cache.toString(),
        file: arg.filename,
        publicPath: publicPath.toString(),
        buildFolder: build.toString()
    });

    return {
        config: {
            plugins: [
                makeAssetPlugin({
                    path: cache.toString(),
                    filename: arg.filename
                })
            ]
        },
        slice: {
            finder: mainFinder,
            queue: []
        }
    };
};
