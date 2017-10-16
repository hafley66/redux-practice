let {isEmpty, intersection, isBoolean} = require('lodash');

const BASE = ['linters','scripts', 'styles', 'files', 'media'];
let useDefaults = slice => (
    slice === true || (!isEmpty(slice) && isBoolean(slice.defaults) && slice.defaults)
);

module.exports = (__, slice = ['defaults']) => (
    useDefaults(slice)
        ? BASE
        : intersection(Object.keys(slice), BASE)
);
