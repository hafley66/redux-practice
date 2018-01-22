const webpack = require( 'webpack' );

function Referencer( slice, { config }) {
    const {
        meta: {
            $context,
            dllAssets,
            dlls: {
                'entry:expanded': dllsEntry
            } = {}
        }
    } = config;

    return {
        global: {
            plugins: Object.keys( dllsEntry ).map( entryName =>
                new webpack.DllReferencePlugin({
                    manifest: dllAssets()[ `${entryName}-manifest.json` ]
                })
            )
        }
    };
}

module.exports = Referencer;
