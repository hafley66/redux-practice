import {getPaths, getBuildPaths, getPublicPaths, resolvePaths, resolvePublicPaths} from '../paths/selectors';

const
    getManifest = (state, id) => state.manifests[id],
    getManifestFiles = (state, id) => getPaths(
        state,
        getManifest(state, id).assetPathIds
    ),
    getManifestBuildFiles = (state, id) => getBuildPaths(
        state,
        getManifestFiles(state, id).map(x=>x.id)
    ),
    getManifestPublicFiles = (state, id) => getPublicPaths(
        state,
        getManifestFiles(state, id).map(x=>x.id)
    ),
    resolveManifestBuildFiles = (state, id) => resolvePaths(
        state,
        getManifestBuildFiles(state, id).map(x=>x.id)
    ),
    resolvePublicManifestFiles = (state, id) => resolvePublicPaths(
        state,
        getManifestPublicFiles(state, id).map(x=>x.id)
    );
export {
    getManifest,
    getManifestFiles,
    resolveManifestBuildFiles,
    resolvePublicManifestFiles
};
