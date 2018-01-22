const concatMerge = require( './lib/util/concat_merge' );

const isJson = x => /\.json$/.test( `${x}` );
const grepJson = pathFn => pathFn.resolvesDir().filter( isJson );
const getAndMapManifests = files => files.reduce(
    ( sum, fileFn ) => (
        sum[ fileFn.basename() ] = fileFn.tryRequire(),
        sum
    ),
    {}
);
module.exports = function loadCaches( config ) {
    const { $build } = config.meta;

    $build.ensure();

    const [
        $locks,
        $dlls,
        $assets
    ] = [ 'locks', 'dlls', 'assets' ].map( x => $build.resolves( x ).ensure());

    config.output.path = $assets.resolve();

    return concatMerge({
        meta: {
            $dlls,
            $locks,
            $assets,

            dllAssets() {
                return getAndMapManifests( grepJson( $dlls ));
            },
            locks() {
                return getAndMapManifests( grepJson( $locks ));
            },
            assets() {
                return getAndMapManifests( grepJson( $assets ));
            }
        }
    }, config );
};
