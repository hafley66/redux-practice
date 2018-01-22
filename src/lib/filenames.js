let webpack = require( 'webpack' );
module.exports = ( args, { config = {} }) => {
    let { output: { filename } = {} } = config,
        { hash = false } = args || {};

    try {
        let { meta: { hashnames = hash } } = config;
        hash = hashnames;
    } catch ( err ) {
        undefined;
    }

    let nextSlice = {
        js:   () => !hash ? `[name].js` : `[name].[chunkhash].js`,
        css:  () => !hash ? `[name].css` : `[name].[contenthash].css`,
        file: () => !hash ? `[name].[ext]` : `[name].[ext]?[hash]`
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
        local:  nextSlice,
        global: configNext
    };
};

