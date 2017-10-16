const
    {merge, values} = require('lodash');

module.exports = (config, {args = {}} = {}) => {
    const
        DEFAULTS = {
            js: {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true
                }
            }
        },
        rules = values(merge(
            {},
            DEFAULTS,
            args
        ));

    return {
        config: {
            module: {rules: (rules)}
        }
    };
};
