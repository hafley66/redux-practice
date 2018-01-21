const ExtractTextPlugin = require( `extract-text-webpack-plugin` ),
    { isString, merge, compact } = require( 'lodash' ),
    path = require( 'path' ),
    fs = require( 'fs' );

let no = undefined;

module.exports = function makeStyleLoader(
    loader,
    {
        sourceMap = false,
        extract = false,
        withCssModules = false
    } = {}
) {
    if ( extract ) {
        return ExtractTextPlugin.extract({
            use:       ensureLoaderOrder(),
            fallback:  'style-loader',
            allChunks: true
        });
    } else {
        return ensureLoaderOrder();
    }

    function ensureLoaderOrder() {
        return compact([
            !extract
                ? {
                    loader:  'style-loader',
                    options: { sourceMap }
                }
                : no,
            {
                loader:  'css-loader',
                options: merge(
                    { sourceMap },
                    withCssModules
                        ? {
                            modules:       true,
                            importLoaders: 1
                        }
                        : no,
                    hasPostCssConfig()
                        ? {
                            importLoaders: 1
                        }
                        : no
                )
            },
            hasPostCssConfig()
                ? {
                    loader:  'postcss-loader',
                    options: { sourceMap }
                }
                : no,
            loader
                ? normalizeLoader( loader, sourceMap )
                : no
        ]);
    }
};

function hasPostCssConfig() {
    return fs.existsSync( path.resolve( process.cwd(), 'postcss.config.js' ));
}

function normalizeLoader( loader, sourceMap = false ) {
    if ( isString( loader )) {
        loader = { loader };
    }

    loader.options = merge({ sourceMap }, loader.options );
    return loader;
}
