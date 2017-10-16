const {path: pathFn} = require('../util'),
    {mapValues} = require('lodash');

module.exports = (config = {}, slice = {}, parent) => {
    let P = pathFn(process.cwd()),
        {
            output: {
                path: output = P('build').str(),
                publicPath: publicPath = '/build'
            } = {},
            resolve: {
                alias = {}
            } = {},
            context = P.str()
        }
        = config,

        {
            home = `${P()}`,
            cache = `${P('build_cache')}`
        }
        = slice,

        {filenames}
        = parent;

    + function MapToPathFns() {
        let Home = home;

        [
            home, cache, context, output
        ] = [
            home, cache, context, output
        ].map(x=>pathFn.r(Home, x));

        alias = mapValues(alias, dest => pathFn.r(Home,dest).str());

        publicPath = pathFn(publicPath);
    }();

    return {
        config: {
            context: context(),
            output: {
                path: output()
            },
            resolve: {
                alias
            }
        },
        slice:{
            home,
            cache,
            output,
            build: output,
            context,
            publicPath,
            dll: {
                manifest: (file = '[name]') => output(filenames.plugins.dll.manifest(file)),
                file: file => output(filenames.plugins.dll.file(file))
            }
        }
    };
};
