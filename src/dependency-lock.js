const { isEqual } = require( 'lodash' );
const { writeFileSync } = require( 'fs' );

class DependencyLock {
    constructor( path, value = {}) {
        this.path = path;
        this.value = value;
    }

    isUpToDate() {
        return isEqual( JSON.parse( JSON.stringify( this.value )), this.path.tryRequire());
    }

    writeJson() {
        writeFileSync( this.path.resolve(), JSON.stringify( this.value ));
    }
}

module.exports = DependencyLock;
