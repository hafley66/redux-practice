import {
    LOAD_CONFIG,
    ADD_CONFIG,
    UPDATE_CONFIG
} from '../../actions/types';
import {addPath} from '../../paths/actions';
import Loader from './loader';
export {expandConfig, handleExpansionOutput, SCOPED_KEYS} from './expansion';


export const
    addConfig = ({id, value, pathId}) => ({
        type: ADD_CONFIG,
        id,
        value,
        pathId
    }),
    updateConfig = ({id, value}) => ({
        type: UPDATE_CONFIG,
        id,
        value
    }),
    loadConfig = ({name, path}) => (dispatch) => {
        let config = Loader(path);
        let configId = name;

        let pathId = dispatch(
            addPath({
                value: path
            })
        ).id;

        dispatch(
            addConfig({
                id: configId,
                value: config,
                pathId
            })
        );

        return dispatch({
            type: LOAD_CONFIG,
            config,
            pathId,
            configId
        });
    };
