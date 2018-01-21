const DependencyLockPath = require( '../dependency-lock-path' );

function createPackageJsonLock( arg, { config }) {
    let packageJson = config.meta.$cwd.resolves( 'package.json' ).tryRequire();
    let lock = new DependencyLockPath(
        config.meta.$locks.resolve( 'package.json' ),
        null,
        transform( packageJson )
    );
    debugger;
    return { local: lock };
}

module.exports = createPackageJsonLock;
function transform({ dependencies, devDependencies } = {}) {
    return {
        dependencies,
        devDependencies
    };
}
