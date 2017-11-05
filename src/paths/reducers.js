import {
    ADD_PATH,
    ADD_RELATIVE_PATH,
    ADD_HOME_PATH,
    ADD_CONTEXT_PATH,
    ADD_BUILD_PATH,
    ADD_CACHE_PATH,
    ADD_PUBLIC_PATH
} from '../actions/types';

import {
    HOME,
    CONTEXT,
    BUILD,
    PUBLIC_PATH,
    CACHE
} from './selectors';
import {isObject} from 'lodash';

const addToPaths = (paths = {}, action) => (
    isObject(paths[action.id])
        ? paths
        : {
            ...paths,
            [action.id]: action
        }
);

const addSpecialPath = (id) => (paths, {value, relativePathId}) =>
    addToPaths(paths, {
        id,
        value,
        relativePathId
    });

export default {
    defaults: () => ({}),
    [ADD_PATH]: addToPaths,
    [ADD_RELATIVE_PATH]: addToPaths,
    [ADD_HOME_PATH]: addSpecialPath(HOME),
    [ADD_CONTEXT_PATH]: addSpecialPath(CONTEXT),
    [ADD_BUILD_PATH]: addSpecialPath(BUILD),
    [ADD_CACHE_PATH]: addSpecialPath(CACHE),
    [ADD_PUBLIC_PATH]: addSpecialPath(PUBLIC_PATH)
};
