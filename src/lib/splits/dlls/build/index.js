let
    BuildDlls = require('./dlls'),
    BuildRefs = require('./refs');

module.exports = (config, slice, parent) => {

    let {'cache_check': cache} = parent;

    let willBuild = BuildDlls()(config, slice, parent),
        willReference = BuildRefs()(config, slice, parent),
        wrapped = () => cache.wrapBuild(willBuild).then(willReference);

    return {
        config: {
            meta: {
                jobs: {
                    dlls: wrapped
                }
            }
        }
    };

};
