const WebpackManifestPlugin = require( 'webpack-manifest-plugin' );
const DEFAULT_DYNAMIC = ( folder, config ) => ({
    fileName:   'manifest.json',
    publicPath: folder.basenames()
        .toPublicPath()
        .joins(
            config.meta.relativePublicPath
        )
        .withSlashes()
});

function AssetManifestFactory( selectTargetFolder ) {
    return function makeAssetManifest( args, { config }) {

        if ( args === true ) args = DEFAULT_DYNAMIC( selectTargetFolder( config ), config );
        let plugin = new WebpackManifestPlugin( args );
        return {
            global: {
                plugins: [ plugin ]
            },
            plugin
        };
    };
}


module.exports = AssetManifestFactory(( config ) => config.meta.$assets );
module.exports.factory = AssetManifestFactory;
module.exports.dlls = AssetManifestFactory(( config ) => config.meta.$dlls );
