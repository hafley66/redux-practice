import {
    ADD_ASSET_MANIFEST_FILE,
    LOAD_ASSET_MANIFEST_FILE
} from '../actions/types';
import { addToBuildPath, addToCachePath, addToPublicPath } from '../paths/actions';
import { flatMap } from 'lodash';

export const
    buildRelatedPaths = ( dispatch ) => ( publicPath, filename ) => (
        [
            dispatch( addToBuildPath({
                value: filename
            })).id,
            dispatch( addToPublicPath({
                value: publicPath
            })).id
        ]
    ),
    addAssetManifest = ({ id, pathId, assetPathIds, value }) => (
        {
            type: ADD_ASSET_MANIFEST_FILE,
            id,
            value,
            pathId,
            assetPathIds
        }
    ),
    loadAssetManifest = ({ name, path }) => ( dispatch ) => {
        try {
            let
                manifest = require( path ),
                assetPathIds = flatMap( manifest, buildRelatedPaths( dispatch )),
                { id: pathId } = dispatch( addToCachePath({
                    value: path
                }));

            dispatch( addAssetManifest({

                id: name,

                pathId,
                assetPathIds,

                value: manifest
            }));
            return {
                type:  LOAD_ASSET_MANIFEST_FILE,
                value: manifest
            };
        } catch ( err ) {
            return dispatch({
                type: 'error',
                err,
                what: `Could not load asset manifest at path:\n\t${path}`
            });
        }
    };


