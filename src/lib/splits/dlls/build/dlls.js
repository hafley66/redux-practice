const {omit} = require('lodash'),
    {webpack: Compile, concatMerge} = require('../../../util'),
    webpack = require('webpack'),
    THIS_WILL_BECOME_A_GLOBAL_VAR_ON_THE_PAGE = '[name]_dll',
    makeAssetPlugin = require('../../../asset_manifest/make_plugin');

const builder = {
    query: (config, slice, parent) => {
        const
            { 'meta.constants' :{ filenames, paths}} = config,
            {'entry:expanded': dlls} = parent;

        return {
            dlls,
            filenames,
            paths
        };
    }
};

const Build = (ext = builder) => (config, slice, parent) => {
    let {dlls, filenames, paths} = ext.query(config, slice, parent);
    let
        dllConfig = concatMerge(
            {},
            omit(config, [
                'meta',
                'entry',
                'devServer',
                'hot'
            ]),

            {
                entry: dlls,
                output: {
                    filename: filenames.jsDLL()
                },
                plugins: [
                    makeAssetPlugin({
                        path: paths.cache(),
                        filename: 'dll.assets.json'
                    }),
                    new webpack.DllPlugin({
                        name: THIS_WILL_BECOME_A_GLOBAL_VAR_ON_THE_PAGE,
                        path: `${paths.dll.manifest()}`,
                        context: `${paths.context()}`
                    })
                ]
            }
        );

    return () => Compile(dllConfig).runPromise();
};

module.exports = Build;
