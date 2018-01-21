import { EXPAND_CONFIG } from '../../actions/types';
import { getParentKey, getExpansions } from '../../expansions/selectors';
import { getConfig } from '../selectors';
import { updateConfig } from '../actions';
import { isPlainObject, get, set } from 'lodash';
import concatMerge from '../../lib/util/concat_merge';

let isVoid = x => x === undefined || x === null;

class ParentOverrideError extends Error {
    static check( key, output ) {
        if ( output.parent && !isPlainObject( output.parent )) {
            throw new Error( `
Invariant: You cannot expand the parent into a non-object at "${getParentKey( key )}".
    Evaluating -> ${ key }.
    Output     -> ${ JSON.stringify( output )}
` );
        }
    }
}

export const
    SCOPED_KEYS = [ 'global', 'parent', 'local' ],
    isScopedExpansionOutput = ( transformed ) => isPlainObject( transformed ) && Object.keys( transformed ).some( x => SCOPED_KEYS.includes( x )),
    handleScopedExpansionOutput = ( key, { global, parent, local }) =>
        (
        ParentOverrideError.check( key, {
            global,
            parent,
            local
        }),
        concatMerge(
            {},
            !isVoid( global ) && global,
            !isVoid( parent ) && set({}, getParentKey( key ), parent ),
            !isVoid( local ) && set({}, key, local )
        )
        ),
    handleExpansionOutput = ( config, key, transformed ) => (
        ( transformed !== undefined )
            ? handleScopedExpansionOutput(
                key,
                isScopedExpansionOutput( transformed )
                    ? transformed
                    : { local: transformed }
            )
            : config
    ),
    expandConfig = ({ order }) => ( dispatch, getState ) => {
        dispatch({
            type: EXPAND_CONFIG,
            order
        });

        const expansions = getExpansions( getState(), order );

        return expansions.map(
            ( getState ) => ({ key, transform }) => {
                let state = getState(),
                    config = getConfig( state ),
                    arg = get( config, key ),
                    parent = get( config, getParentKey( key )),
                    transformed = transform( arg, {
                        dispatch,
                        state,
                        parent,
                        global: config
                    });

                if ( isVoid( transformed )) {
                    return;
                } else {
                    return dispatch(
                        updateConfig( handleExpansionOutput( config, key, transformed ))
                    );
                }
            }
        );
    };
