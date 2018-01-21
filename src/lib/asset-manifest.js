const WebpackManifestPlugin = require( 'webpack-manifest-plugin' );
const DEFAULT_DYNAMIC = ( config ) => ({
    fileName:   'asset-manifest.json',
    publicPath: config.meta.relativePublicPath
});

module.exports = function makeAssetManifest( args, { config }) {
    if ( args === true ) args = DEFAULT_DYNAMIC( config );
    return {
        global: {
            plugins: [ new WebpackManifestPlugin( args ) ]
        }
    };
};
