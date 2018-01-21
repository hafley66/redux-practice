const { merge, values } = require( 'lodash' );

module.exports = ( args ) => {
    const
        DEFAULTS = {
            yaml: {
                test:   /\.ya?ml$/ig,
                loader: [ 'json-loader', 'yaml-loader' ]
            },
            json: {
                test:   /\.json$/ig,
                loader: 'json-loader'
            }
        },
        loaders = values( merge(
            {},
            DEFAULTS,
            args
        ));

    return {
        global: {
            module: { rules: values( loaders ) }
        }
    };
};
