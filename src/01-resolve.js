// let webpackFields = require( 'webpack/schemas/webpackOptionsSchema.json' ).properties;
let { FilePath, Path } = require( './path' );
let concatMerge = require( './lib/util/concat_merge' );
const DEFAULT_PATH = () => FilePath.CWD.resolve( 'webpack-config', 'index.yaml' );

module.exports = function resolveAllConfigs( indexPath = DEFAULT_PATH()) {

    const
        $main = new FilePath( indexPath ),
        $folder = $main.dirnames(),
        config = $main.require();

    config.meta = config.meta || {};

    const
        extension = getExtension( config.meta.extends ),
        metaConfig = $folder
            .resolves( 'meta.yaml' )
            .tryRequire(),
        envConfig = $folder
            .resolves( 'environments', `${process.env.NODE_ENV }.yaml` )
            .tryRequire();

    return concatMerge(
        extension,
        {
            meta: {
                $config: $folder,
                $cwd:    Path.CWD
            }
        },
        config,
        { meta: metaConfig },
        envConfig
    );
};

function getExtension( path ) {
    if ( !path ) return {};
    return (
        new FilePath(
            /^\w/.test( path )
                ? require.resolve(
                    ( new FilePath( 'webpack-config.yaml', path ))
                        .join()
                )
                : path
        )
    ).tryRequire();
}
