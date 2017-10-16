let {isEmpty} = require('lodash');
module.exports = (_, slice) =>
    slice && !isEmpty(slice)
        ? ['dlls','commons']
        : []
;
