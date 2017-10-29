import { ADD_ASSET_MANIFEST_FILE } from '../actions/types';
import {isObject} from 'lodash';

export default  {
    defaults: () => ({}),
    [ADD_ASSET_MANIFEST_FILE]: (manifests, action) => (
        isObject(manifests[action.id])
            ? manifests
            : {
                ...manifests,
                [action.id]: action
            }
    )
};
