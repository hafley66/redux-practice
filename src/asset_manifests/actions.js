import {
    ADD_ASSET_MANIFEST_FILE,
    LOAD_ASSET_MANIFEST_FILE
} from '../actions/types';
import {addToBuildPath, addToCachePath} from '../paths/actions';
import {map} from 'lodash';

export const
    buildRelatedPaths = (dispatch) => (publicPath, filename) => dispatch(addToBuildPath({
        value: filename,
        isFile: true
    })),
    addAssetManifest = ({id, pathId, assetPathIds, value}) =>
        ({
            type: ADD_ASSET_MANIFEST_FILE,
            id,
            value,
            pathId,
            assetPathIds
        }),
    loadAssetManifest = ({name, path}) => (dispatch) => {
        try {
            let
                manifest = require(path),
                assetPathIds = map(manifest, buildRelatedPaths(dispatch)).map(x=>x.id),
                cachedPathRecord = dispatch(addToCachePath({
                    value: path
                })),
                pathId = cachedPathRecord.id;

            dispatch(addAssetManifest({
                id: name,
                pathId,
                assetPathIds,
                value: manifest
            }));
            return {
                type: LOAD_ASSET_MANIFEST_FILE,
                value: manifest
            };
        } catch (err) {
            return dispatch({
                type: 'error',
                err,
                what: `Could not load asset manifest at path:\n\t${path}`
            });
        }
    };


