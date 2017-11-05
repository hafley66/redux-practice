import {
    SET_CONFIG,
    UPDATE_CONFIG
} from '../actions/types';

import {merge} from 'lodash';

export default {
    defaults: ()=>({}),
    [SET_CONFIG]: (config, action) => (
        merge({}, action)
    ),
    [UPDATE_CONFIG]: (config, action) => (
        merge({}, config.value, action.value)
    )
};
