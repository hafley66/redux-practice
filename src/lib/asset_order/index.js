let IncludeOrder = require('../asset_manifest/include_order');
module.exports = (config) => {
    let {
        'meta.asset_manifest.finder': asset,
        'meta.splits.dlls.cache_check.assets.finder': dlls
    } = config;

    return {
        slice: IncludeOrder(asset,dlls)
    };

};
