let
    webpack = require( 'webpack' );

const referencer = {
    query: ( config, slice, parent ) => {
        const {
                meta: { constants: { paths: { dll: { manifest } } } },
                context
            } = config,
            { 'entry:expanded': dllsEntry } = parent;

        return {
            manifest,
            context,
            dllsEntry
        };
    },
    buildWith: ( manifestFn, context ) => dllName => new webpack.DllReferencePlugin(
        {
            manifest: require( manifestFn( dllName ).toString()),
            context:  context.toString()
        }
    )
};
let Referencer = ( ext = referencer ) =>
    function Referencer( config, slice, parent ) {
        let { dllsEntry, context, manifest } = ext.query( config, slice, parent );
        let referenceFn = ext.buildWith( manifest, context );

        let { 'meta.splits.dlls.cache_check': { assets } } = config;

        return function dsad( results ) {
            return {
                config: {
                    plugins: Object.keys( dllsEntry ).map( referenceFn ),
                    meta:    {
                        'asset_manifest': {
                            queue: assets.finder.all( true )
                        }
                    }
                },
                slice: {
                    name: 'dlls',
                    results
                }
            };
        };
    };


module.exports = Referencer;
