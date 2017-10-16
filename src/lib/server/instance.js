/* eslint-disable no-console, no-unused-vars */
let webpack = require('webpack'),
    pick = require('../compile/_pick_');
let WebpackDevServer = require('webpack-dev-server');


module.exports = (job) => {
    let once = fn => {
        let cache;
        return (...args) => {
            return (!cache)
                ? cache = fn(...args)
                : cache;
        };
    };
    return once(
        () => job.then(finalConfig => {

            let {devServer} = finalConfig;
            let bundleStart = null;
            let compiler = webpack(pick(finalConfig));

            let bundler = new WebpackDevServer(
                compiler,
                Object.assign({}, devServer)
            );

            compiler.plugin('compile', function(...args) {
                console.log('Bundling...');
                bundleStart = Date.now();
            });

            compiler.plugin('done', function() {
                console.log(`Bundled in ${(Date.now() - bundleStart)}ms!`);
            });

            return bundler;
        })
    );
};
