import {isArray, isString, isPlainObject, mapValues, reduce} from 'lodash';
export const
    strings2ConstantsHash = (seq, sum = {}) => (
        reduce(
            seq,
            (sum, action, key, iterator) => {

                if(isArray(iterator) && isPlainObject(action)) {
                    return strings2ConstantsHash(action, sum);
                } else {
                    return {
                        ...sum,
                        [isArray(iterator) ? action : key]: (
                            isString(action)
                                ? action
                                : isPlainObject(action)
                                    ? mapValues(action, x=>strings2ConstantsHash(x))
                                    : strings2ConstantsHash(action)
                        )
                    };
                }
            },
            sum
        )
    )
    ;
