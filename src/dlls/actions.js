import { ASSET_MANIFEST_NAME, ASSET_MANIFEST_FILE } from './constants';
import { loadAssetManifest } from '../asset_manifests/actions';

export const
    compileDlls = ( config ) => {

        },
    loadManifest = ( path = ASSET_MANIFEST_FILE ) =>
        loadAssetManifest({
            name: ASSET_MANIFEST_NAME,
            path
        });
