import {loadAssetManifest} from '../index';
import {store, expect, recursiveDescribeFile} from '../../../spec/boilerplate';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
import webpack from 'webpack';
import path from 'path';
import reducers from '../reducers';
import paths from '../../paths/reducers';



const
    dir = (f) => path.resolve(__dirname, f),
    setup = () => (
        new Promise(
            (res, rej) =>
                webpack({
                    entry: dir('./fixtures/a.js'),
                    output: {
                        filename: '[name].js',
                        path: dir('./fixtures/output'),
                        publicPath: '/build/'
                    },
                    devtool: 'source-map',
                    plugins: [new WebpackManifestPlugin({
                        publicPath: '/build/'
                    })]
                }, (err, stats) => {
                    if(err) rej(err);
                    if(stats) res(stats);
                })
        )
    ),
    s = () => store({
        paths,
        manifests: reducers
    });

recursiveDescribeFile(__filename)({
    '.loadAssetManifest': {
        'reads the manifest file and creates a new record for the file and its contents and associated files': () =>
            setup()
                .then(
                    () => {
                        let store = s(),
                            dispatch = store.dispatch,
                            test = loadAssetManifest({
                                name: 'main',
                                path: dir('./fixtures/output/manifest.json')
                            })(dispatch);
                        expect(test.manifest).to.not.be.undefined;
                    }
                )
    }
});

