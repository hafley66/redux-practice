import {
    SET_EXPANSION
} from '../actions/types';


export const
    setExpansion = ({key, transform}) => ({
        type: SET_EXPANSION,
        id: key,
        key,
        transform
    });
