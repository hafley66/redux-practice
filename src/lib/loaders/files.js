const
    {merge, values} = require('lodash');

module.exports = (config, {args = {}} = {}) => {
    const
        DEFAULTS = {
            yaml: {
                test: /\.ya?ml$/ig,
                loader: ['json-loader','yaml-loader'],
                exclude: /node_modules/
            },
            json: {
                test: /\.json$/ig,
                loader: 'json-loader',
                exclude: /node_modules/
            }
        },
        loaders = values(merge(
            {},
            DEFAULTS,
            args
        ));

    return {
        config: {
            module: {rules: values(loaders)}
        }
    };
};
