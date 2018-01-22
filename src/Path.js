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
    if ( path.path && path.parent ) {
        this.path = path.path;
        this.parent = getParent( parent || path.parent );
    } else {
        this.path = path;
        this.parent = getParent( parent );
    }
}

const Prototype = {
    toFilePath() {
        return new FilePath( this.path, this.parent );
    },
    toPublicPath() {
        return new PublicPath( this.path, this.parent );
    },
    resolve( ...args ) {
        return path.resolve( this.parent, this.path, ...args );
    },
    resolves( ...args ) {
        return new this.constructor(
            path.join( ...args ),
            `${this}`
        );
    },

    join( ...args ) {
        return path.join( this.parent, this.path, ...args );
    },
    joins( ...args ) {
        return new this.constructor( path.join( ...args ), this.join());
    },
    dirname() {
        return path.dirname( `${this}` );
    },
    dirnames() {
        return new this.constructor( this.dirname());
    },
    rebase( newParent ) {
        return new this.constructor( this.path, newParent );
    },

    isAbsolute() {
        return isAbsolute( `${this }` );
    },

    extension() {
        return path.extension( `${this }` );
    },
    basename() {
        return path.basename( `${this}` );
    },
    basenames() {
        return new this.constructor( path.basename( `${this}` ));
    },
    toJSON() {
        return this.toString();
    }
};

Object.assign(
    Path.prototype,
    Prototype
);

Path.isAbsolute = isAbsolute;

class FilePath extends Path {
    constructor( ...args ) {
        super( ...args );
    }
}
Object.assign(
    FilePath.prototype,
    {
        toString() {
            return this.resolve();
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

        dir() {
            return this.isDirectory() ? readdir( `${this }` ) : [];
        },
        resolveDir() {
            return this.dir().map( x => this.resolve( x ));
        },
        resolvesDir() {
            return this.dir().map( x => this.resolves( x ));
        }
    }
);


class PublicPath extends Path {
    constructor( ...args ) {
        super( ...args );
    }
}

Object.assign(
    PublicPath.prototype,
    {
        toString() {
            return this.joins().withSlashes();
        },
        withEndingSlash() {
            let s = this.join();
            return (
                s.endsWith( '/' )
                    ? s
                    : `${s}/`
            );
        },

        withEndingSlashs() {
            return new PublicPath( this.withEndingSlash());
        },

        withStartingSlash() {
            let s = this.join();
            return (
                s.startsWith( '/' )
                    ? s
                    : `/${s}`
            );
        },

        withStartingSlashs() {
            return new PublicPath( this.withStartingSlash());
        },

        withSlashes() {
            return this.withStartingSlashs().withEndingSlash();
        },

        withSlashess() {
            return new PublicPath( this.withSlashes());
        }
    }
);
Path.CWD = new FilePath( process.cwd());
FilePath.CWD = Path.CWD;
module.exports = Path;
module.exports.PublicPath = PublicPath;
module.exports.FilePath = FilePath;
module.exports.Path = Path;
