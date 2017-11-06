/* eslint-disable no-console */
let  {isEqual} = require('lodash'),
    glob = require('glob');

let [
    {
        logger: {cond},
        fs: {
            exists,
            tryRm,
            tryWriteJson,
            safeRequire
        },
        path: {
            basename
        }
    }
] = ['../../../util'].map(require);

module.exports = function InputChecker(getSource, lockPath, cache) {
    let lockFile = basename(lockPath);
    let cacher =  {
        load: () => (
            cond.n(
                safeRequire(lockPath),
                `[CACHE MISS] Couldn't load cache lock \n\t${lockPath}`
            )
        ),
        exists: () => (
            cond(
                exists(lockPath),
                `[CACHE HIT] Cache lock (${  lockPath  }) exists!`,
                `[CACHE MISS] Missing cache lock ${ lockPath }`
            )
        ),
        clean:() => {
            return (
                cond.n(
                    [
                        lockPath,
                        cache('dll.assets.json'),
                        ...glob.sync('*.dll.json')
                    ].map(tryRm),
                    `[CACHE ERROR] Error deleting cache lock ${  lockPath  }!`
                )
            );
        },
        update:() => (
            cond(
                tryWriteJson(
                    lockPath,
                    getSource()
                ),
                (`[CACHE WRITE] ${lockFile} updated!`)
            )
        ),
        upToDate:() => {
            let source = getSource();
            let x = JSON.parse(JSON.stringify(source)),
                y = cacher.load();

            let test = isEqual(
                x, y
            );
            return cond(
                test,
                `[CACHE HIT] Dependencies for ${  lockFile } match!`,
                `[CACHE MISS] Dependencies for ${ lockFile } do not match!`
            );
        }
    };
    return cacher;
};
