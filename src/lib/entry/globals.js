let {mapValues} = require('lodash');
module.exports = (config, slice = []) => {
    config.entry = mapValues(
        config.entry,
        (array) => (
            slice.concat(array)
        )
    );
    return {};
};
