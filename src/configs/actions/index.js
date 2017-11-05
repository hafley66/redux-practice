import {
    LOAD_CONFIG,
    SET_CONFIG,
    UPDATE_CONFIG
} from '../../actions/types';
import {
    addPath,
    addBuildPath,
    addCachePath,
    addContextPath,
    addPublicPath
} from '../../paths/actions';
import Loader from './loader';
import {
    findOutputPath,
    findCachePath,
    findContextPath,
    findPublicPath
} from '../selectors';
export {expandConfig, handleExpansionOutput, SCOPED_KEYS} from './expansion';


export const
    setConfig = ({value, pathId}) => ({
        type: SET_CONFIG,
        value,
        pathId
    }),
    updateConfig = ({value}) => ({
        type: UPDATE_CONFIG,
        value
    }),
    loadConfig = ({path}) => (dispatch) => {
        let config = Loader(path);
        let pathId = dispatch( addPath({ value: path })).id;

        (
            dispatch(
                addBuildPath(findOutputPath(config))
            ),
            dispatch(
                addContextPath(findContextPath(config))
            ),
            dispatch(
                addCachePath(findCachePath(config))
            ),
            dispatch(
                addPublicPath(findPublicPath(config))
            ),
            dispatch(
                setConfig({
                    value: config,
                    pathId
                })
            )
        );

        return dispatch({
            type: LOAD_CONFIG,
            config,
            pathId
        });
    },
    compileConfig = ({id, value}) => (dispatch, getState) => {

    };
