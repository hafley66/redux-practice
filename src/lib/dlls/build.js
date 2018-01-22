const
    { pick, isEmpty } = require( 'lodash' ),
    concatMerge = require( '../util/concat_merge' ),
    webpack = require( '../webpack/compiler' ),
    { DllPlugin } = require( 'webpack' ),
    THIS_WILL_BECOME_A_GLOBAL_VAR_ON_THE_PAGE = 'dll_[name]',
    makeAssetPlugin = require( '../asset-manifest' ).dlls;

const Build = ( slice, { config }) => {
    const {
        $dlls,
        dlls: {
            'entry:expanded': entry,
            manifestName = '[name]-manifest.json',
            cache = true
        } = {}
    } = config.meta;
    const badCache =  ( !cache || ( cache && cannotUseCache( config )));

    if ( !isEmpty( entry ) && badCache ) {

        const
            dllConfig = concatMerge(
                {},
                pick( config, [
                    'devtool',
                    'cache',
                    'context',
                    'module',
                    'resolve',
                    'plugins'
                ]),
                {
                    entry,
                    output: {
                        filename: config.output.filename,
                        path:     $dlls.resolve(),
                        library:  THIS_WILL_BECOME_A_GLOBAL_VAR_ON_THE_PAGE
                    },
                    plugins: [
                        makeAssetPlugin( true, { config }).plugin,
                        new DllPlugin({
                            name: THIS_WILL_BECOME_A_GLOBAL_VAR_ON_THE_PAGE,
                            path: $dlls.resolve( manifestName )
                        })
                    ]
                }
            );

        return webpack( undefined, { config: dllConfig }).then( transformed => (
            updateLocks( config ),
            transformed
        ));
    }
};

module.exports = Build;

function cannotUseCache({ meta }) {
    const {
        cache: {
            packageJson,
            config
        }
    } = meta;

    return !( packageJson && packageJson.isUpToDate() && config && config.isUpToDate());
}

function updateLocks({ meta }) {
    const {
        cache: {
            packageJson,
            config
        }
    } = meta;
    packageJson && packageJson.writeJson();
    config && config.writeJson();
}


