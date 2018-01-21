import { loadAssetManifest } from '../actions';
import { store, expect, recursiveDescribeFile } from '../../../spec/boilerplate';
import webpack from 'webpack';
import path from 'path';
import reducers from '../reducers';
import pathsReducers from '../../paths/reducers';
import configReducers from '../../configs/reducers';
import { loadConfig } from '../../configs/actions';
let config = require( path.resolve( __dirname, 'fixtures', 'config.js' ));
let rimraf = require( 'rimraf' );
import { getManifest, resolveManifestBuildFiles, resolvePublicManifestFiles } from '../selectors';

let s;

const
    dir = ( f ) => path.resolve( __dirname, f ),

    S = () => (
        s = store({
            paths:     pathsReducers,
            manifests: reducers,
            configs:   configReducers
        }),
        D( loadConfig({ path: dir( './fixtures/config.js' ) }))
    ),
    state = () => s.getState(),
    D = ( ...args ) => s.dispatch( ...args ),
    setup = () => (
        new Promise(
            ( res, rej ) =>
                webpack( config(), ( err, stats ) => {
                    if ( err ) rej( err );
                    if ( stats ) res( stats );
                })
        )
    ).then(() =>
        D( loadAssetManifest({
            name: 'main',
            path: dir( './fixtures/output/manifest.json' )
        }))
    );

recursiveDescribeFile( __filename )({
    after:                () => rimraf.sync( dir( './fixtures/output' )),
    '.loadAssetManifest': {
        before:                                                                                                () => S(),
        'reads the manifest file and creates a new record for the file and its contents and associated files': () =>
            setup().then(() => {
                expect( getManifest( state(), 'main' ).value ).to.not.be.undefined;
                expect( getManifest( state(), 'main' ).assetPathIds.length ).to.equal( 4 );
            })
    },
    'selectors': {
        before:                  () => S(),
        '.resolveManifestFiles': {
            'resolves associated asset paths with build path': () =>
                setup().then(() => {
                    let resolved = resolveManifestBuildFiles( state(), 'main' );
                    expect( resolved.length ).to.equal( 2 );
                    expect( resolved ).to.deep.equal([
                        dir( './fixtures/output/main.js' ),
                        dir( './fixtures/output/main.js.map' )
                    ]);
                })
        },
        '.resolvePublicManifestFiles': {
            'resolves associated asset paths with public path': () =>
                setup().then(() => {
                    let x = resolvePublicManifestFiles( state(), 'main' );
                    expect( x.length ).to.equal( 2 );
                    expect( x ).to.not.deep.equals([
                        '/build/main.js',
                        '/build/main.js.map'
                    ]);
                })
        }
    }
});

