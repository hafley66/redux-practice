let configLoader = require('./load_config');
let {merge} = require('lodash');

module.exports = (
) => {
    let matches = configLoader();
    try {
        let meta = configLoader('{.,/}meta.yaml');
        matches = merge(
            {},
            matches,
            {meta}
        );

    } catch (err) {
        console.info('No meta match');
    }
    return matches;
};
