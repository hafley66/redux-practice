/* eslint-disable no-console */
const webpack = require( 'webpack' );
const { omit } = require( 'lodash' );
const outputWith = require( './output' );

module.exports = ( arg, { config }) => {
    debugger;
    const validConfig = omit( config, 'meta' );
    const instance = webpack( validConfig );

    const compiledPromise = new Promise(( resolve, reject ) =>
        instance.run(
            outputWith( validConfig, instance, resolve, reject ))
    );
    return compiledPromise.then(() => ({ local: instance }));
};

