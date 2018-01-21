const concatMerge = require( './lib/util/concat_merge' );

const isJson = x => /\.json$/.test( `${x}` );
const grepJson = pathFn => pathFn.resolvesDir().filter( isJson );
const getAndMapManifests = files => files.reduce(
    ( sum, fileFn ) => (
        sum[ fileFn.basename() ] = fileFn.require(),
        sum
    ),
    {}
);
module.exports = function loadCaches( config ) {
    const { $build } = config.meta;

    $build.ensure();

    const [
        $locks,
        $dllManifests,
        $assetManifest
    ] = [ 'locks', 'dll-manifests', 'asset-manifest.json' ].map( x => $build.resolves( x ).ensure());

    return concatMerge({
        meta: {
            $dllManifests,
            $locks,
            $assetManifest,

            manifests: {
                get dlls() {
                    return getAndMapManifests( grepJson( $dllManifests ));
                },
                get locks() {
                    return getAndMapManifests( grepJson( $locks ));
                },
                get assets() {
                    return $assetManifest.tryRequire();
                }
            }
        }
    }, config );
};
