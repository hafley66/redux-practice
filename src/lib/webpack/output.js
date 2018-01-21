let statsPresetToOptions = require( 'webpack/lib/Stats.js' ).presetToOptions;

module.exports = ( config, compiler, resolve, reject ) => ( err, stats ) => {
    let outputOptions = config.stats;
    if ( typeof outputOptions === 'boolean' || typeof outputOptions === 'string' ) {
        outputOptions = statsPresetToOptions( outputOptions );
    } else if ( !outputOptions ) {
        outputOptions = { colors: true };
    }


    if ( err ) {
        console.error( err.stack || err );
        if ( err.details ) console.error( err.details );
          process.exit(1); // eslint-disable-line
    }
    if ( outputOptions.json ) {
        process.stdout.write( `${JSON.stringify( stats.toJson( outputOptions ), null, 2 ) }\n` );
    } else {
        let statsString = stats.toString( outputOptions );
        if ( statsString )
            process.stdout.write( `${statsString }\n` );
    }
    if ( !config.watch && stats.hasErrors()) {
        process.exitCode = 2;
    }

    if ( err ) {
        console.log( 'ERRORS' );
        console.error( err.stack || err );
        if ( err.details ) {
            console.log( 'DETAILS' );

            console.error( err.details );
        }
        reject({
            err,
            compiler
        });
    }

    resolve({
        stats,
        compiler
    });

};
