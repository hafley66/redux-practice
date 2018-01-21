let { compact, values, isPlainObject } = require( 'lodash' );
const
    DEFAULTS_OUT = {
        css: null,
        js:  {
            test:    /\.jsx?$/,
            enforce: 'pre',
            loader:  'eslint-loader',
            exclude: /node_modules/,
            options: {
                fix:           true,
                failOnWarning: false,
                failOnError:   true
            }
        }
    };


module.exports = ( args ) => {
    let getOutputs = () =>
        args
            ? (
                args === true
                    ? values( DEFAULTS_OUT )
                    : isPlainObject( args )
                        ? [
                            args.css && DEFAULTS_OUT.css,
                            args.js && DEFAULTS_OUT.js
                        ]
                        : [])
            : [];

    return {
        global: {
            module: {
                rules: compact( getOutputs())
            }
        }
    };

};
