let baseMetaExpansions = [
    {
        key:  'meta.filenames',
        file: './lib/filenames'
    },
    {
        key:  'meta.env',
        file: './lib/env'
    },
    {
        key:  'meta.cache.packageJson',
        file: './lib/cache-package-json'
    },
    {
        key:  'meta.entry.set!',
        file: './lib/entry/set!'
    },
    {
        key:  'entry',
        file: './lib/entry/map-entry-to-hash'
    },
    {
        key:  'meta.entry.hot',
        file: './lib/entry/hot'
    },
    {
        key:  'meta.entry.globals',
        file: './lib/entry/globals'
    },
    ...[ 'scripts', 'styles', 'linters', 'files', 'media' ].map( loader => ({
        key:  `meta.loaders.${loader}`,
        file: `./lib/loaders/${loader}`
    })),
    {
        key:  'meta.minify',
        file: './lib/minify'
    },
    {
        key:  'meta.cache.config',
        file: './lib/cache-config'
    },
    {
        key:  'meta.dlls.entry',
        file: './lib/dlls/entry'
    },
    {
        key:  'meta.dlls.build',
        file: './lib/dlls/build'
    },
    {
        key:  'meta.dlls.refs',
        file: './lib/dlls/refs'
    },
    {
        key:  'meta.commons',
        file: './lib/commons'
    },
    {
        key:  'meta.assetManifest',
        file: './lib/asset-manifest'
    },
    {
        key:  'meta.compiler',
        file: './lib/webpack/compiler'
    }

].map(({ key, file }) => {
    return {
        key,
        transform: require( file )
    };
});

module.exports = ( config ) => {
    config.meta.expansions = baseMetaExpansions;
    return config;
};
