let assetFinder = require('../asset_manifest/finder');
let {difference} = require('lodash');
let fs = require('../util/fs');
module.exports = (config) => {
    let {
            meta: {constants: {paths: {cache, build, publicPath} } },
            'meta.splits.dlls.cache_check.assets': {finder: dllFinder} = {}
        } = config,

        finder = assetFinder({
            cache: false,
            folder: cache(),
            file: ('assets.json'),
            buildFolder: build(),
            publicPath
        });

    let job = () => {

        return new Promise(
            (resolve, reject)=> {
                try {
                    let assets = finder.all(true);
                    let allBuildFiles = fs.glob(build('!(*manifest.dll.json)'));
                    if(dllFinder){
                        assets = assets.concat(dllFinder.all(true));
                    }
                    let removeableAssets = difference(allBuildFiles, assets);
                    let results = removeableAssets.map(fs.tryRm);


                    resolve({
                        slice: {
                            results,
                            name: 'Clean Job'
                        }
                    });
                } catch (err) {reject(err);}
            }
        );
    };


    return {
        config: {
            meta: {
                jobs: {
                    clean: job
                }
            }
        }
    };
};
