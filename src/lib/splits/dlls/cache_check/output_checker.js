/* eslint-disable no-console */
let  _ = require('lodash');
let {flatten, map, all}  = _;
let [
    {
        logger: {cond},
        fs: {
            exists,
            tryRm
        }
    }
] = [
    '../../../util'
].map(require);
let assetFinder = require('../../../asset_manifest/finder');
let glob = require('glob');

module.exports = function OutputChecker({
    cache,
    build,
    dllManifest,
    dlls,
    sourceMaps,
    publicPath
}){

    let finder =  assetFinder({
        cache: false,
        folder: cache(),
        file: 'dll.assets.json',
        buildFolder: build(),
        publicPath
    });

    let hasSourceMap = (sourceMaps && sourceMaps.match('source-map'));
    let loadAssetsIterator = (arrayOfVendors, dllName) => [
        dllManifest(dllName)(),
        ...(all=>(
            finder.setTo.buildPath(),
            all = finder.all(hasSourceMap),
            finder.setTo.restore(),
            all
        ))([])
    ];

    const assets = {
        load: (names = dlls) => {
            let loaded = (
                flatten(map(
                    names,
                    loadAssetsIterator
                ))
            );
            return loaded;
        },
        exists: () =>{
            let
                a = assets.load(),
                winning = all(a, exists);
            return (
                cond(winning,
                    '[CACHE HIT] Required DLL assets exist...',
                    '[CACHE MISS] Required DLL assets do not exist...')
            );
        },
        clean: () => {
            let glerb = build('*.dll.?(js|json)')();
            let manifests = cache('*dll*.json')();
            let outputs = glob.sync(glerb);
            let manifestsFile = glob.sync(manifests);
            return (
                all(outputs.concat(manifestsFile), file => (
                    cond.n(tryRm(file), `[CACHE ERROR] Could not remove dll asset file...${  file}`))
                )
            );
        },
        upToDate: () => assets.exists(),
        finder
    };

    return assets;
};
