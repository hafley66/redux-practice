const DependencyLock = require( '../dependency-lock' );

function createConfigJsonLock( arg, { config }) {
    let lock = new DependencyLock(
        config.meta.$locks.resolves( 'config.json' ),
        transform( config )
    );
    return { local: lock };
}

module.exports = createConfigJsonLock;

function transform( config = {}) {

    const {
        context,
        meta: {
            dlls,
            filenames,
            minify,
            $build,
            $relativePublicPath,
            $absolutePublicPath
        } = {},
        module: { extensions, rules } = {},
        resolve: { alias } = {}
    } = config;


    return {
        dlls,
        context,
        extensions,
        alias,
        filenames,
        minify,
        rules,
        $build,
        $relativePublicPath,
        $absolutePublicPath
    };
}
