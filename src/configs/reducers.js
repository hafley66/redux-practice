import {
    ADD_CONFIG,
    UPDATE_CONFIG
} from '../actions/types';

import {isObject} from 'lodash';

export default {
    defaults: ()=>({}),
    [ADD_CONFIG]: (configs, action) => (
        isObject(configs[action.id])
            ? configs
            : {
                ...configs,
                [action.id]: action
            }
    ),
    [UPDATE_CONFIG]: (configs, action) => (
        {
            ...configs,
            [action.id]: {
                ...action
            }
        }
    )
};
