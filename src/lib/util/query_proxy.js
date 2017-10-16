let {isObject, get} = require('lodash');

let lodashHandler = {
    get(target, prop) {


        if(prop && prop.constructor === Symbol){
            prop = String(prop);
        }
        // console.log('Getting prop...', prop);

        return (
            (prop in target)
                ? target[prop]
                : get(target, prop)
        );
    }
};

let queryAble = (obj) => {
    if(isObject(obj)) {
        return new Proxy(obj, lodashHandler);
    } else {
        return obj;
    }
};

module.exports = queryAble;
