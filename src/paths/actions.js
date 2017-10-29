import {
    ADD_BUILD_PATH,
    ADD_CONTEXT_PATH,
    ADD_CACHE_PATH,
    ADD_PUBLIC_PATH,
    ADD_PATH,
    ADD_RELATIVE_PATH
} from '../actions/types';
import {BUILD, CONTEXT, CACHE, PUBLIC_PATH} from './selectors';

let id = 0;

const
    addPath = ({value}) => ({
        type: ADD_PATH,
        id: id++,
        value
    }),

    addRelativePath = ({value, relativePathId = CONTEXT}) => (
        {
            type: ADD_RELATIVE_PATH,
            id: id++,
            value,
            relativePathId
        }
    ),

    addBuildPath = (value) => ({
        type: ADD_BUILD_PATH,
        id: BUILD,
        value,
        relativePathId: CONTEXT
    }),

    addCachePath = (value) => ({
        type: ADD_CACHE_PATH,
        id: CACHE,
        value,
        relativePathId: CONTEXT
    }),
    addContextPath = (value) => ({
        type: ADD_CONTEXT_PATH,
        id: CONTEXT,
        value
    }),

    addPublicPath = (value) => ({
        type: ADD_PUBLIC_PATH,
        id: PUBLIC_PATH,
        value
    }),

    addToBuildPath = (pathRecord) =>
        addRelativePath({
            ...pathRecord,
            relativePathId: BUILD
        }),

    addToCachePath = (pathRecord) =>
        addRelativePath({
            ...pathRecord,
            relativePathId: CACHE
        })
;

export {
    addPath,
    addRelativePath,
    addBuildPath,
    addCachePath,
    addContextPath,
    addToBuildPath,
    addToCachePath,
    addPublicPath
};
