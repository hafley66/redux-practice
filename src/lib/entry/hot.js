const DEFAULTS = {
    react: true,
    webpack: true
};
let {compact} = require('lodash');
module.exports = (config, arg = false) => {
    let globals = [];
    if(arg) {
        if(arg === true) arg = DEFAULTS;

        let {react, webpack} = arg;

        globals = compact([
            react ? 'react-hot-loader/patch' : undefined,
            ...(
                webpack
                    ? [ getWebpackDevServerEntry(config),
                        'webpack/hot/only-dev-server' ]
                    : []
            )
        ]);
    }
    return {parent: {globals}};
};

function getWebpackDevServerEntry(config) {
    let {'meta.constants.server.url':url} = config;
    return url ? `webpack-dev-server/client?${  url  }` : '';
}
