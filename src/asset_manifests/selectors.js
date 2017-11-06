import {getPaths, getBuildPaths, getPublicPaths, resolvePaths, resolvePublicPaths} from '../paths/selectors';

let ids = collection => collection.map(x=> x.id);
const
    getManifest = (state, id) => state.manifests[id],
    getManifestFiles = (state, id) => getPaths(
        state,
        getManifest(state, id).assetPathIds
    ),
    resolveManifestBuildFiles = (state, id) => resolvePaths(
        state,
        ids(getBuildPaths(state, ids(getManifestFiles(state, id))))
    ),
    resolvePublicManifestFiles = (state, id) => resolvePublicPaths(
        state,
        ids(getPublicPaths(state, ids(getManifestFiles(state, id))))
    );
export {
    getManifest,
    getManifestFiles,
    resolveManifestBuildFiles,
    resolvePublicManifestFiles
};
