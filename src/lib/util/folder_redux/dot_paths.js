const {isEmpty, isString, isFunction} = require('lodash');

class CannotResolveDotPathError extends Error {}
let err = path => {throw new CannotResolveDotPathError(`Cannot resolve reducer from path. Given --> ${path.toString()}`);};

let resolver = path => {
    if(isEmpty(path)) err(path);
    return (
        isFunction(path)
            ? path
            : isString(path)
                ? require(path)
                : err(path)
    );
}
;

module.exports = resolver;
