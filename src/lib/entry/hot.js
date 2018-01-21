const DEFAULTS = {
    react:   true,
    webpack: true
};
let { compact } = require( 'lodash' );
module.exports = ( arg = false, { config }) => {
    let globals = [];
    if ( arg ) {
        if ( arg === true ) arg = DEFAULTS;

        let { react, webpack } = arg;

        globals = globals.concat( compact([
            ( react )
                ? 'react-hot-loader/patch'
                : undefined,
            ...(
                webpack
                    ? [ `webpack-dev-server/client?${config.meta.absolutePublicPath}`,
                        'webpack/hot/only-dev-server' ]
                    : []
            )

        ]));
    }
    return { parent: { globals } };
};
