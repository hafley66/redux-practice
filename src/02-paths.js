const { Path, FilePath, PublicPath } = require( './path' );
const { omit, get, set } = require( 'lodash' );
const WebpackOptionsDefaulter = require( 'webpack/lib/WebpackOptionsDefaulter' );


module.exports = function extractPaths( resolvedConfig ) {
    const c = omit( resolvedConfig, 'meta' );
    const meta = resolvedConfig.meta;

    c.output.filename = c.output.filename || '';

    new WebpackOptionsDefaulter().process( c );
    const buildPath = Path.CWD.resolve( get( c, 'output.path' ) || './build' );
    const originalPublicPath = withSlashes(
        get( c, 'devServer.publicPath' ) || get( c, 'output.publicPath' ) || '/'
    );
    const absolutePublicPath = getUrl({
        host:       get( c, 'devServer.host' ),
        https:      get( c, 'devServer.https' ),
        port:       get( c, 'devServer.port' ),
        publicPath: originalPublicPath
    });

    c.devServer = c.devServer || {};

    set( c, 'output.publicPath', absolutePublicPath );
    set( c, 'devServer.publicPath', absolutePublicPath );
    set( c, 'output.path', ( buildPath ));
    set( c, 'context', Path.CWD.resolve( c.context ));

    return ({
        meta: {
            ...meta,
            absolutePublicPath,
            relativePublicPath: originalPublicPath,

            $build:              new FilePath( buildPath ),
            $context:            Path.CWD.resolves( c.context ),
            $absolutePublicPath: new PublicPath( absolutePublicPath ),
            $relativePublicPath: new PublicPath( originalPublicPath )
        },
        ...c
    });
};

function withSlashes( publicPath ) {
    if ( !publicPath.endsWith( '/' ))
        return publicPath = `${publicPath}/`;
    return publicPath;
}

function getUrl({
    https,
    host = 'localhost',
    port = '8080',
    publicPath = '/'
}) {
    return `${https ? 'https' : 'http'}://${host}${port ? `:${port}` : ''}${publicPath}`;
}
