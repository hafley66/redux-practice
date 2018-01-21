const
    { omit, map, merge, compact } = require( 'lodash' ),
    make = require( './make_style_loader' ),
    ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const
    DEFAULTS = {
        css: {
            test: /\.css$/ig
        },
        less: {
            test: /\.less$/ig,
            use:  {
                loader: 'less-loader'
            }
        },
        sass: {
            test: /\.s(a|c)ss$/ig,
            use:  {
                loader: 'sass-loader'
            }
        }
    };

module.exports = (
    {
        args = {},
        options = {
            extract:   false,
            minify:    false,
            sourceMap: false,
            filename:  undefined
        }
    } = {},
    { config = {} } = {}
) => {

    options.filename = options.filename || config.meta.filenames.css();

    const
        usedDefaults = args.defaults && args.defaults === false
            ? {}
            : DEFAULTS,
        defaultedArgs = merge({}, usedDefaults, omit( args, 'defaults' )),
        easyMake = loaderSpec => {
            let res = (
                merge( loaderSpec, {
                    use: make( loaderSpec.use, options )
                })
            );
            return res;
        },
        rules = map( defaultedArgs, easyMake )
        ;



    return {
        global: {
            module:  { rules },
            plugins: compact([
                ( options && options.extract )
                    ? new ExtractTextPlugin( options.filename )
                    : null
            ])
        }
    };
};
