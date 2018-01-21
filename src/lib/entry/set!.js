let { isEmpty } = require( 'lodash' );
module.exports = ( entryOverride, { config = {} } = {}) => {
    if ( !isEmpty( entryOverride ))
        config.entry = entryOverride;
    return;
};
