import {isArray, isString, isPlainObject, mapValues, reduce} from 'lodash';


export const
    makeKey = (iterator, key, action) =>(
        isArray(iterator)
            ? action
            : key
    ),

    whenPlainObject = (action, namespace = '') => (
        isPlainObject(action)
            ? mapValues(action, (val, parentKey)=> strings2ConstantsHash(val, `${formatNamespace(namespace)}${parentKey}`))
            : strings2ConstantsHash(action, namespace)
    ),

    isObjectInMiddleOfArray = (iterator, action) =>
        isArray(iterator) && isPlainObject(action),

    formatNamespace = ns => ns
        ? ( ns.match(/\.$/) ? ns : `${ns}.`)
        : ns,

    strings2ConstantsHash = (seq, namespace = '', sum = {}) => (
        reduce(
            seq,
            (sum, action, key, iterator) => {

                let formatted = formatNamespace(namespace);
                if(isObjectInMiddleOfArray(iterator, action)) {
                    return strings2ConstantsHash(action, formatted, sum);
                } else {
                    let theKey = makeKey(iterator, key, action);
                    return {
                        ...sum,
                        [theKey]: (
                            isString(action)
                                ? `${formatted}${action}`
                                : whenPlainObject(action, `${formatted}${theKey}`)
                        )
                    };
                }
            },
            sum
        )
    )
;
