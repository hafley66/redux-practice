import {strings2ConstantsHash} from '../../lib/actions/boilerplate';
export default strings2ConstantsHash(
    [

        'LOAD_CONFIG',
        'EVAL_CONFIG',
        'READ_OPTION',

        'ADD_ASSET_FINDER',

        {
            ENTRY: [
                'SET!',
                'ADD_GLOBAL'
            ]
        },

        {
            DLLS: [
                'CHECK_CACHE',
                'CLEAN_CACHE',
                'ADD_COMPILATION_JOB',
                'SAVE_CACHE',
                'ADD_ASSET_FINDER',
                'ADD_REFERENCES'
            ]
        },

        {
            WEBPACK: [
                'NORMALIZE_CONFIG',
                'ADD_PLUGIN',
                'ADD_MODULE_RULE',

                'ADD_STYLE_LOADER',
                'ADD_COMMON_CHUNK',

                'ADD_ASSET_FINDER',
                'ADD_COMPILATION_JOB'
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
