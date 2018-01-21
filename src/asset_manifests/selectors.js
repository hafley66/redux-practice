import {
    getPaths,
    getBuildPaths,
    getPublicPath,
    getPublicPaths,
    resolvePath,
    resolvePaths,
    resolvePublicPaths
} from '../paths/selectors';
import WebpackManifestPlugin from 'webpack-manifest-plugin';

let ids = collection => collection.map( x => x.id );
const
    getManifest = ( state, id ) => state.manifests[ id ],
    getManifestFiles = ( state, id ) => getPaths(
        state,
        getManifest( state, id ).assetPathIds
    ),
    resolveManifestBuildFiles = ( state, id ) => resolvePaths(
        state,
        ids( getBuildPaths( state, ids( getManifestFiles( state, id ))))
    ),
    resolvePublicManifestFiles = ( state, id ) => resolvePublicPaths(
        state,
        ids( getPublicPaths( state, ids( getManifestFiles( state, id ))))
    ),
    makeManifestPlugin = ( state, id ) => {
        let manifest = state.manifests[ id ];
        [ new WebpackManifestPlugin({
            publicPath: resolvePath( state, manifest.pathId )
        }) ];
    };
export {
    getManifest,
    getManifestFiles,
    resolveManifestBuildFiles,
    resolvePublicManifestFiles
};
