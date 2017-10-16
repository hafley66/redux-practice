
// /* eslint-disable no-console */
let { isEmpty} = require('lodash');
let getDependencies = require('./dependencies');
let [
    {
        fs: {ensureDir}
    },
    InputChecker,
    OutputChecker
] = [
    '../../../util', './input_checker', './output_checker'
].map(require);

module.exports = (config, slice, parent) => {
    let {
            'meta.constants.paths': { cache, build, publicPath, dll: {manifest} },
            devtool: sourceMaps
        } = config,
        {'entry:expanded': dlls} = parent;

    if(!isEmpty(dlls)) {
        ensureDir(cache());
    }

    let nextSlice = {
        locks: InputChecker(
            (getDependencies(config)),
            cache('dll-lock.json'),
            cache('dll.assets.json')
        ),
        assets: OutputChecker({
            build,
            dlls,
            cache,
            dllManifest: manifest,
            sourceMaps,
            publicPath
        }),
        clean: ({locks, assets} = nextSlice) => [locks,assets].forEach(x=>x.clean()),
        upToDate: ({locks, assets} = nextSlice) => {
            if(!locks.upToDate() || !assets.upToDate()) {
                nextSlice.clean();
                return false;
            } else return true;
        },
        wrapBuild: toBuild => (
            Promise.resolve().then(() =>
                nextSlice.needsToBuild()
                    ? (
                        toBuild()
                            .then(res=> (
                                nextSlice.locks.update(),
                                res
                            ))
                    )
                    : {}
            )
        ),
        needsToBuild: () => !nextSlice.upToDate() && !isEmpty(dlls)
    };

    return {slice: nextSlice};

};
