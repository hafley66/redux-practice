import {getPaths, resolvePaths, resolvePublicPaths} from '../paths/selectors';
import {mapValues, curry} from 'lodash';

const selectors = mapValues({
    getManifest: (state, id) => state.manifest[id],
    getManifestFiles: (state, id) => getPaths(state,
        selectors.getManifest(state, id).pathIds
    ),
    resolveManifestFiles: (state, id) => resolvePaths(
        selectors.getManifestFiles(state, id)
    ),
    resolvePublicManifestFiles: (state, id) => resolvePublicPaths(
        selectors.getManifestFiles(state, id)
    )
}, curry);
export default selectors;
