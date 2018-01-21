const { isEqual } = require( 'lodash' );
const { writeFileSync } = require( 'fs' );
const Path = require( './Path' );

class DependencyLockPath extends Path {
    constructor( path, parent = null, value = {}) {
        super( path, parent );
        this.value = value;
    }

    upToDate() {
        return isEqual( this.value, this.tryRequire());
    }

    writeJson() {
        writeFileSync( JSON.stringify( this.value ));
    }

}

module.exports = DependencyLockPath;
