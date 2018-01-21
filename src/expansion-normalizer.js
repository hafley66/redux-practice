import { mapKeys, isFunction, isPlainObject } from 'lodash';

export const
    normalizeTransformPlainObject = ({ expander, normalizer }) => (
        normalizer
            ? ( arg, { dispatch, state, global, parent } = {}) => {
                let result = normalizer( arg, {
                    state,
                    global,
                    parent
                });
                if ( result !== null && result !== undefined ) {
                    return expander(
                        result,
                        {
                            dispatch,
                            state,
                            global,
                            parent
                        }
                    );
                }
            }

            : expander
    ),
    normalizeTransform = ({ key, transform, ...rest }) => ({
        ...rest,
        key,
        transform: isFunction( transform )
            ? transform
            : isPlainObject( transform )
                ? normalizeTransformPlainObject( transform )
                : new Error( 'Invalid transform' )
    });

export default function normalize( expansions ) {
    return expansions.map( normalizeTransform );
}
