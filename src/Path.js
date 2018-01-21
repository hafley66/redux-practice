const path = require( 'path' ),
    { isString } = require( 'lodash' ),
    {
        existsSync: exists,
        removeSync: rm,
        mkdirsSync: ensureDir,
        ensureFileSync: ensureFile,
        statSync: stat,
        readdirSync: readdir
    } = require( 'fs-extra' ),
    load = require( './lib/loader' );

function getParent( parent ) {
    return (
        ( isString( parent ))
            ? parent
            : ( parent && parent.path )
                ? parent.path
                : ''
    );
}

const isAbsolute = ( str ) => /^(\/|https?:\/\/)/.test( str );


function Path( path, parent = null ) {
    if ( !this ) return new Path( path, parent );

    if ( path.path && path.parent ) {
        this.path = path.path;
        this.parent = getParent( parent || path.parent );
    } else {
        this.path = path;
        this.parent = getParent( parent );
    }
}

const Prototype = {
    toString() {
        return this.resolve();
    },

    resolve( ...args ) {
        return path.resolve( this.parent, this.path, ...args );
    },
    resolves( ...args ) {
        return new Path(
            path.join( ...args ),
            `${this}`
        );
    },

    join( ...args ) {
        return path.join( this.parent, this.path, ...args );
    },
    joins( ...args ) {
        return new Path( path.join( ...args ), this.join());
    },
    dirname() {
        return path.dirname( `${this}` );
    },
    dirnames() {
        return new Path( this.dirname());
    },
    rebase( newParent ) {
        return new Path( this.path, newParent );
    },

    exists() {
        return exists( `${this }` );
    },
    stats() {
        return stat( `${this}` );
    },
    isDirectory() {
        return this.exists() ? this.stats().isDirectory() : !path.extname( `${this}` );
    },
    isFile() {
        return this.exists() ? this.stats().isFile() : !!path.extname( `${this}` );
    },
    ensure() {
        (
            this.isFile()
                ? ensureFile
                : ensureDir
        )( `${this}` );
        return this;
    },

    remove() {
        return rm( `${this}` );
    },
    require() {
        return load( `${this}` );
    },
    tryRequire( defaults = {}) {
        return load.try( `${this }`, defaults );
    },

    isAbsolute() {
        return isAbsolute( `${this }` );
    },

    withEndingSlash() {
        let s = `${this}`;
        return (
            s.endsWith( '/' )
                ? s
                : `${s}/`
        );
    },

    dir() {
        return this.isDirectory() ? readdir( `${this }` ) : [];
    },
    resolveDir() {
        return this.dir().map( x => this.resolve( x ));
    },
    resolvesDir() {
        return this.dir().map( x => this.resolves( x ));
    },
    extension() {
        return path.extension( `${this }` );
    },
    basename() {
        return path.basename( `${this}` );
    }
};

Object.assign(
    Path.prototype,
    Prototype
);

Path.isAbsolute = isAbsolute;
Path.CWD = new Path( process.cwd());


module.exports = Path;
