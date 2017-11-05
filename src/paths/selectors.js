import path from 'path';
import {curry, pick, camelCase, capitalize, map} from 'lodash';
const
    HOME = -1,
    CONTEXT = -2,
    BUILD = -3,
    CACHE = -4,
    PUBLIC_PATH = -5,
    resolvePath = curry(
        ({paths}, name) => {
            let record = paths[name];
            if(record) {
                if(record.relativePathId) {
                    let base = resolvePath({paths}, record.relativePathId);
                    return path.resolve(base, record.value);
                } else
                    return record.value;
            } else
                return '';
        }
    ),
    resolvePublicPath = curry(
        ({paths}, name) =>(
            path.resolve(
                paths[PUBLIC_PATH].value,
                paths[name].value
            )
        )
    ),
    resolvePaths = curry(
        (state, ids) => ids.map(id=>resolvePath(state, id))
    ),
    resolvePublicPaths = curry(
        (state, ids) => ids.map(id=>resolvePublicPath(state, id))

    ),
    getPath = curry(
        ({paths}, name) => paths[name]
    ),
    getPaths = curry(
        ({paths}, args) =>
            Object.values(pick(paths, args))
    ),
    getPublicPaths = (state, ids) =>
        getPaths(state, ids).filter(x=>x.relativePathId === PUBLIC_PATH),
    getBuildPaths = (state, ids) =>
        getPaths(state, ids).filter(x=>x.relativePathId === BUILD)

;

let toExport = {};
map({
    HOME,
    CONTEXT,
    BUILD,
    CACHE
}, (specialPath, name)=>{
    const
        getter = ({paths}) => paths[specialPath],
        resolver = (state) => resolvePath(getter(state)),
        fname = capitalize(camelCase(name.toLowerCase()));
    toExport[`get${fname}Path`] = getter;
    toExport[`resolve${fname}Path`] = resolver;
});
module.exports = {
    HOME,
    CACHE,
    BUILD,
    CONTEXT,
    PUBLIC_PATH,
    ...toExport,
    resolvePublicPath,
    resolvePublicPaths,
    resolvePath,
    resolvePaths,
    getPath,
    getPaths,
    getPublicPaths,
    getBuildPaths
};
