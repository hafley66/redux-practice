let {isEmpty} = require('lodash');
module.exports = (config) => {
    let nextSlice = {};
    if(config.devServer) {
        let {
            devServer: {port = '8080', host = 'localhost', publicPath = '/'}, output: {publicPath: outPath = ''} = {}
        } = config;

        if(outPath) publicPath = outPath;
        if(publicPath) publicPath = config.devServer.publicPath = fixPublicPath(publicPath);
        let url = `http://${  host  }${port ? `:${port}` : ''}`;
        nextSlice.url = url;
        if(publicPath) nextSlice.publicPath = publicPath;
    }
    if(config.output && config.output.publicPath) {
        let publicPath = config.output.publicPath;
        if(publicPath) nextSlice.publicPath = publicPath;
        config.output.publicPath = fixPublicPath(publicPath);
    }
    return !isEmpty(nextSlice) ? {slice: nextSlice} : {};
};
