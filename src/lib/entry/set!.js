let {isEmpty} = require('lodash');
module.exports = (config, entryOverride = {}) => {
    if(!isEmpty(entryOverride))
        config.entry = entryOverride;

    return {};
};
