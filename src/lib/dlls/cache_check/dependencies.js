let { pick } = require( 'lodash' );
module.exports = ( config ) => function getDependencies() {
    try {
        let {
            'meta.constants': {
                filenames: { hash },
                paths: {
                    home,
                    cache,
                    publicPath,
                    home: Home
                }
            },
            'meta.splits.dlls': dlls,
            output,
            context,
            module: { extensions } = {},
            resolve: { alias } = {}
        } = config;

        let pack = require( home( 'package.json' ).str());

        return Object.assign(
            pick( pack, 'dependencies', 'devDependencies' ),
            {
                config: {
                    dlls,
                    hash,
                    output,
                    context,
                    extensions,
                    alias,

                    entry:      dlls.entry,
                    home:       Home(),
                    cache:      cache(),
                    publicPath: publicPath()
                }
            }
        );
    } catch ( err ) {
        /* eslint-disable */
        console.log(err);
        console.log('[CACHE FATAL] Cannot access package.json');
        process.exit(1);
    }
}