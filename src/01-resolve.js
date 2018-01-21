// let webpackFields = require( 'webpack/schemas/webpackOptionsSchema.json' ).properties;
let Path = require( './Path' );
let concatMerge = require( './lib/util/concat_merge' );

const DEFAULT_PATH = () => Path.CWD.resolve( 'webpack-config', 'index.yaml' );

module.exports = function resolveAllConfigs( indexPath = DEFAULT_PATH()) {
    const
        $main = new Path( indexPath ),
        $folder = $main.dirnames(),

        config = $main.require(),
        metaConfig = $folder
            .resolves( 'meta.yaml' )
            .tryRequire(),
        envConfig = $folder
            .resolves( 'environments', `${process.env.NODE_ENV }.yaml` )
            .tryRequire();

    return concatMerge({
        meta: {
            $config: $folder,
            $cwd:    Path.CWD
        }
    }, config, { meta: metaConfig }, envConfig );
};
