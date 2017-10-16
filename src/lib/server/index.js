module.exports = (config, slice) =>
    config && config.devServer && slice
        ? ['to_express_http_proxy']
        : [];
