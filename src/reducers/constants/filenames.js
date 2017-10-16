let webpack = require('webpack');
module.exports = (config = {}, args) => {
    let {
            output: {
                filename
            } = {}
        } = config,
        {
            hash = false
        } = args || {};

    try {
        let {meta: {hashnames = hash} } = config;
        hash = hashnames;
    } catch(err){
        undefined;
    }


    let nextSlice = {
        js: () => !hash ? `[name].js` : `[name].[chunkhash].js`,
        jsDLL: () => !hash ? `[name].dll.js` : `[name].[chunkhash].dll.js`,
        css: () => !hash ? `[name].css` : `[name].[contenthash].css`,
        file: () => !hash ? `[name].[ext]` : `[name].[ext]?[hash]`,
        plugins: {
            chunks: {
                runtime: 'runtime',
                implicitVendors: 'vendor',
                implicitCommons: 'commons'
            },
            dll: {
                manifest: (file = '[name]') => `${file}-manifest.dll.json`,
                file: (file = '[name]') => `${file  }.dll.js`
            }
        }
    };
    let configNext =  {
        output: {
            filename: filename || nextSlice.js()
        },
        plugins: [
            hash
                ? new webpack.HashedModuleIdsPlugin()
                : new webpack.NamedModulesPlugin()
        ]
    };

    return {
        slice: nextSlice,
        config: configNext
    };
};

