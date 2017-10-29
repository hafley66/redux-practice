import {strings2ConstantsHash} from '../lib/actions/boilerplate';
module.exports = strings2ConstantsHash(
    [
        'INIT',

        'LOAD_CONFIG',
        'LOAD_ENVIRONMENT_CONFIG',
        'LOAD_ENV_VARIABLES',

        'ADD_CONTEXT_PATH',
        'ADD_BUILD_PATH',
        'ADD_CACHE_PATH',
        'ADD_PUBLIC_PATH',

        'ADD_CONFIG',
        'UPDATE_CONFIG',

        'EXPAND_CONFIG',
        'SET_EXPANSION',

        'ADD_PATH',
        'ADD_RELATIVE_PATH',

        'ADD_ASSET_MANIFEST_PLUGIN',
        'ADD_ASSET_MANIFEST_FILE',
        'LOAD_ASSET_MANIFEST_FILE',

        'ADD_PACKAGE_JSON',
        'SET_ENTRY',
        'ADD_GLOBAL_ENTRY',

        {
            DLLS: [
                'CHECK_CACHE',
                'CLEAN_CACHE',
                'SAVE_CACHE',
                'ADD_REFERENCES'
            ]
        },

        {
            WEBPACK: [
                'ADD_PLUGIN',
                'ADD_MODULE_RULE',
                'ADD_STYLE_LOADER',
                'ADD_COMMON_CHUNK'
            ]
        },

        {
            JOBS: [
                'START',
                'ADD_ERROR',
                'ADD_SUCCESS'
            ]
        }
    ],
    '@@WEBPACK-CONFIG'
);
