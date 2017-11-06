let {isEmpty} = require('lodash');
module.exports = (config, {entry} = {}) =>
    entry && !isEmpty(entry)
        ? ['entry','cache_check', 'build']
        : []
;
