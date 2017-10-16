let instanceFn = require('./instance');

module.exports = (config) => {
    let { devServer } = config;
    if(devServer){
        let {
                meta: {
                    constants: { server },
                    job
                }
            } = config,
            {publicPath} = devServer,
            err = ()=>{throw new Error('Must implement "all" function for proxy server');};

        let addToExpress = (app = {all: err}) => {
            const proxy = require('http-proxy').createProxyServer();
            let bundler = instanceFn(job);

            bundler().then(()=> {
                console.log(`========= Starting WebpackDevServer with NODE_ENV: ${process.env.NODE_ENV} =========`);
            });

            proxy.on('error', function() {
                global.console.log('Could not connect to proxy, please try again...', arguments[0]);
            });

            global.console.log(`Starting Webpack dev server at ${server.url}`);
            console.log('THE PUBLIC SERVER...', `${publicPath }*`, server);

            app.all( `${publicPath}*`, function (req, res) {
                console.log('THE REQUESt...', req.url);
                proxy.web(req, res, {
                    target: server.url
                });
            });

            return bundler;
        };


        return {
            slice: addToExpress
        };
    }
    else return {};
};
