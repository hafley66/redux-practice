let {
        fs: {tryRequire, glob},
        path
    } = require('../util'),
    {map, values, get, flatten} = require('lodash'),
    AS_PUBLIC_PATH = 1,
    AS_PRIVATE_PATHS = 2,
    AS_NAME = 3;

module.exports = ({
    cache = false,
    folder = path.cwd(),
    file = 'assets.json',
    publicPath = path.cwd('build'),
    buildFolder = path.cwd('build')
}) =>
{

    const clipPublicPath = path => path.match(/\.map$/) ? path : path.toString().replace(publicPath.toString(), '');

    console.log(file, folder, publicPath, buildFolder);

    let finder = {
        MODE: AS_PUBLIC_PATH,
        load: () => tryRequire(path(folder, file)),
        get: (filename) => {
            let r = (get(finder.load(), filename) || '');
            return r;
        },
        all: (withSourceMaps = true) => {
            let vals = flatten(map(finder.load(), values));
            return (
                vals.concat(withSourceMaps ? finder.allSourceMaps(vals) : [])
            ).map(finder.toMode);
        },
        setTo: {
            publicPath: () => (finder.setTo.save(), finder.MODE = AS_PUBLIC_PATH),
            buildPath: () => (finder.setTo.save(), finder.MODE = AS_PRIVATE_PATHS),
            filename: () => (finder.setTo.save(), finder.MODE = AS_NAME),
            mode: (mode) => (finder.setTo.save(), finder.MODE = mode),
            save: () => finder.PREV_MODE = finder.MODE,
            restore: () => finder.MODE = finder.PREV_MODE
        },
        findAllWithName: (name, sourceMaps = true) => finder.all(sourceMaps).filter(x=>x.match(name)),
        allSourceMaps: (all) => (
            finder.setTo.filename(),
            all = glob(path.resolve(buildFolder, `?(${all.map(finder.toMode).join('|')}).map`)),
            finder.setTo.restore(),
            all
        ),
        toMode: (filepath) => (finder.MODE === AS_PUBLIC_PATH)
            ? filepath
            : finder.MODE === AS_PRIVATE_PATHS
                ? filepath && path.resolve(buildFolder, clipPublicPath(filepath)).toString()
                : filepath && clipPublicPath(filepath)
    };

    ['js', 'css'].map( x =>{
        let fileEnding = new RegExp(`\\.${x}$`);
        finder[x] = (filename => finder.toMode(finder.get(
            filename.match(fileEnding)
                ? filename
                : `${filename  }.${x}`
        )));

        finder[`all:${  x}`] = () => finder.findAllWithName(fileEnding);
    });

    ['load', 'allSourceMaps'].forEach(method => {
        let cached;
        let old =  finder[method];
        finder[method] = (...args) => cache && cached
            ? cached
            : cached = old(...args);
    });

    return finder;
};
