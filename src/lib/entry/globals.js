let { mapValues } = require( 'lodash' );
module.exports = ( slice = [], { config = {} } = {}) => {
    config.entry = mapValues(
        config.entry,
        ( array ) => (
            slice.concat( array )
        )
    );
    return;
};
