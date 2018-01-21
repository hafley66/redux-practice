const
    DEFAULTS = {
        vendors:    false,
        commons:    false,
        bootloader: false
    },
    webpack = require( 'webpack' ),
    { merge, compact, isArray } = require( 'lodash' ),
    make = x => new webpack.optimize.CommonsChunkPlugin( x );

const DEFAULT_STATIC = {
    commons: {
        name:      '02-implicit_commons',
        minChunks: 2
    },
    bootloader: {
        name:      '00-webpack_manifest',
        minChunks: Infinity
    }
};

const DEFAULT_DYNAMIC = ( depsSet = new Set ) => merge(
    {},
    DEFAULT_STATIC,
    {
        vendors: ({
            name: '01-implicit_vendors',
            minChunks( module ) {
                let index = module.context && module.context.indexOf( 'node_modules' );
                if ( index && index !== -1 ) {
                    let { context } = module;
                    let c = context.replace( /.*node_modules[\\/]/i, '' );
                    depsSet.add( c );
                    return true;
                }
                return false;
            }
        }),
        depsSet
    }
);

module.exports = ( slice = DEFAULTS ) => {
    if ( slice ) {
        let
            defaults = DEFAULT_DYNAMIC(),
            vendors = ( slice === true || slice.vendors ) && defaults.vendors || undefined,
            commons = ( slice === true || slice.commons ) && defaults.commons || undefined,
            bootloader = ( slice === true || slice.bootloader ) && defaults.bootloader || undefined,
            rest = isArray( slice.args ) ? slice.args : [];

        let commonConfigs = [
            ...rest,
            commons,
            vendors,
            bootloader
        ];

        return {
            global: {
                plugins: compact( commonConfigs ).map( make )
            },
            parent: {
                dependencyRequests: defaults.depsSet
            }
        };
    }
};
