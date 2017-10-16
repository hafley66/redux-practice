const
    {isBoolean, omit, map, merge, compact} = require('lodash'),
    make = require('./make_style_loader'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const
    DEFAULTS = {
        css: {
            test: /\.css$/ig
        },
        less: {
            test: /\.less$/ig,
            use: {
                loader: 'less-loader'
            }
        }
    };

module.exports = (
    {meta:{constants:{filenames}}},
    {
        args = {},
        options = {
            extract: false,
            minify: false,
            sourceMap: false
        }
    } = {}
) => {

    const
        usedDefaults = isBoolean(args.defaults) && args.defaults === false
            ? {}
            : DEFAULTS
        ,
        defaultedArgs = merge({}, usedDefaults, omit(args, 'defaults'))
        ,
        easyMake = loaderSpec => {
            let res = (
                merge(loaderSpec, {
                    use: make(loaderSpec.use, options)
                })
            );
            return res;
        }
        ,
        rules = map(defaultedArgs, easyMake)
        ;



    return {
        config: {
            module: {rules},
            plugins: compact([
                (options && options.extract)
                    ? new ExtractTextPlugin(filenames.css())
                    : null
            ])
        }
    };
};
