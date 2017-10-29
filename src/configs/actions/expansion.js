import { EXPAND_CONFIG } from '../../actions/types';
import {getParentKey, getExpansions} from '../../expansions/selectors';
import {getConfig} from '../selectors';
import {updateConfig} from '../actions';
import {isPlainObject, merge, get, set} from 'lodash';

class ParentOverrideError extends Error {
    static check(key, output){
        if(output.parent && !isPlainObject(output.parent))
            throw new Error(`
Invariant: You can not expand the parent into a non-object at "${getParentKey(key)}".
    Evaluating -> ${  key  }.
    Output     -> ${  JSON.stringify(output)}
`);
    }
}

export const
    SCOPED_KEYS = ['global', 'parent', 'local'],
    handleScopedExpansionOutput = (key, {global, parent, local}) =>
        (
            ParentOverrideError.check(key, {
                global,
                parent,
                local
            }),
            merge(
                {},
                global,
                set({}, getParentKey(key), parent),
                set({}, key, local)
            )
        ),
    handleExpansionOutput = (config, key, transformed) => (
        handleScopedExpansionOutput(
            key,
            isPlainObject(transformed) && Object.keys(transformed).some(x=>SCOPED_KEYS.includes(x))
                ? transformed
                : {local: transformed}
        )

    ),
    expandConfig = ({id, order}) => (dispatch, getState) => {
        dispatch({
            type: EXPAND_CONFIG,
            id,
            order
        });

        const
            state = getState(),
            expansions = getExpansions(state, order);

        return expansions.map(
            ({key, transform}) => {
                let state = getState();
                let config = getConfig(state, id);
                let arg = get(config, key);
                let transformed = transform(arg, {
                    dispatch,
                    state
                });

                return dispatch(updateConfig({
                    id,
                    value: handleExpansionOutput(config, key, transformed)
                }));
            }
        );
    };
