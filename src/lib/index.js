let redux = require('./util/folder_redux');
let loadConfig = require('./util/config_resolution');

module.exports = (config = loadConfig()) =>(
    redux(
        config,
        'meta',
        [
            'environments',
            'env',
            'constants',
            'entry',
            'loaders',
            'minify',
            'splits',
            'asset_manifest',
            'asset_order',
            'compile',
            'jobs',
            'server'
        ],
        {cwd: __dirname,
            targetFolder: ''}
    )
)
;
