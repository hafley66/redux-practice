import { SET_EXPANSION } from '../actions/types';
import {isFunction, isPlainObject} from 'lodash';

export const
    normalizeTransformPlainObject = ({expander, normalizer}) => (
        !!normalizer
            ? (arg, {dispatch, state} = {}) =>
                expander(
                    normalizer(arg, {state}),
                    {
                        dispatch,
                        state
                    }
                )
            : expander
    ),
    normalizeTransform = ({key, transform, ...rest}) => ({
        ...rest,
        key,
        transform: isFunction(transform)
            ? transform
            : isPlainObject(transform)
                ? normalizeTransformPlainObject(transform)
                : new Error('Invalid transform')
    });

export default {
    defaults: () => ({}),
    [SET_EXPANSION]: (expansions, action) => (
        {
            ...expansions,
            [action.id]: normalizeTransform(action)
        }
    )
};
