const
    DEFAULTS = {
        vendors: false,
        commons: false,
        bootloader: false
    },
    webpack = require('webpack'),
    {merge, compact, isArray} = require('lodash'),
    make = x => new webpack.optimize.CommonsChunkPlugin(x);

const DEFAULT_STATIC = {
    commons: {name: 'implicit_commons',
        minChunks: 2},
    bootloader: {name: 'webpack_manifest',
        minChunks: Infinity}
};

const DEFAULT_DYNAMIC = (depsSet = new Set) => merge(
    {},
    DEFAULT_STATIC,
    {
        vendors: (config) => ({
            name: 'implicit_vendors',
            minChunks( module ) {
                let index = module.context && module.context.indexOf( 'node_modules' );
                if(index && index !== -1) {
                    let {context} = module;
                    let c = context.replace(/.*node_modules[\\/]/i, '');
                    depsSet.add(c);
                    return true;
                }
                return false;
            },
            names: Object.keys(config.entry)
        }),
        depsSet
    }
);

module.exports = (config, slice = DEFAULTS) => {
    let
        defaults = DEFAULT_DYNAMIC(),
        vendors = (slice === true || slice.vendors) && defaults.vendors(config) || undefined,
        commons = (slice === true || slice.commons) && defaults.commons || undefined,
        bootloader = (slice === true || slice.bootloader) && defaults.bootloader || undefined,
        rest = [];

    if(slice && isArray(slice.args)) {
        rest = slice.args;
    }

    let commonConfigs = [
        ...rest,
        commons,
        vendors,
        bootloader
    ];

    return {

        config: {
            plugins: compact(commonConfigs).map(make)
        },
        parent: {
            dependencyRequests: defaults.depsSet
        }
    };
};
