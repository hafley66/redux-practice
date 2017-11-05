import {
    ADD_BUILD_PATH,
    ADD_CONTEXT_PATH,
    ADD_CACHE_PATH,
    ADD_PUBLIC_PATH,
    ADD_PATH,
    ADD_RELATIVE_PATH,
    ADD_HOME_PATH
} from '../actions/types';
import {BUILD, CONTEXT, CACHE, PUBLIC_PATH, HOME} from './selectors';

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

    addHomePath = (value = process.cwd()) => ({
        type: ADD_HOME_PATH,
        id: HOME,
        value
    }),

    addBuildPath = (value) => ({
        type: ADD_BUILD_PATH,
        id: BUILD,
        value,
        relativePathId: HOME
    }),

    addCachePath = (value) => ({
        type: ADD_CACHE_PATH,
        id: CACHE,
        value,
        relativePathId: HOME
    }),
    addContextPath = (value = process.cwd()) => ({
        type: ADD_CONTEXT_PATH,
        id: CONTEXT,
        relativePathId: HOME,
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
        }),

    addToPublicPath = (pathRecord) =>
        addRelativePath({
            ...pathRecord,
            relativePathId: PUBLIC_PATH
        })
;

export {
    addPath,
    addRelativePath,
    addHomePath,
    addBuildPath,
    addCachePath,
    addContextPath,
    addToBuildPath,
    addToCachePath,
    addToPublicPath,
    addPublicPath
};
