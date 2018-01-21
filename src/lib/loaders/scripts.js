const { merge, values } = require( 'lodash' );
const DEFAULTS = {
    js: {
        test:    /\.jsx?$/,
        loader:  'babel-loader',
        exclude: /node_modules/,
        options: {
            cacheDirectory: true
        }
    }
};
module.exports = ( args = false ) => {
    const rules = values( merge(
        {},
        args === true ? DEFAULTS : args
    ));

    return {
        global: {
            module: { rules: ( rules ) }
        }
    };
};
