import path from 'path';
import {pick, curry, mapValues} from 'lodash';
const
    CONTEXT = -1,
    BUILD = -2,
    CACHE = -3,
    PUBLIC_PATH = -4;
const selectors = mapValues({
    resolvePath:({paths}, name) => {
        let record = paths[name];
        if(record) {
            if(record.relativePathId) {
                let base = selectors.resolvePath({paths}, record.relativePathId);
                return path.resolve(base, record.value);
            } else
                return record.value;
        } else
            return '';
    },
    resolvePublicPath:({paths}, name) =>
        path.resolve(
            paths[PUBLIC_PATH].value,
            paths[name].value
        ),
    resolvePaths:(state, ids) => ids.map(selectors.resolvePath(state)),
    resolvePublicPaths:(state, ids) => ids.map(selectors.resolvePublicPath(state)),

    getPath:({paths}, name) => paths[name],
    getBuildPath:({paths}) => paths[BUILD],
    getCachePath:({paths}) => paths[CACHE],
    getContextPath:({paths}) => paths[CONTEXT],
    getPublicPath:({paths}) => paths[PUBLIC_PATH],
    getPaths:({paths}, args) =>
        pick(paths, args)
}, curry);


module.exports = {
    ...selectors,
    BUILD,
    CACHE,
    CONTEXT,
    PUBLIC_PATH
};
