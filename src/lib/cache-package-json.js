const DependencyLock = require( '../dependency-lock' );

function createPackageJsonLock( arg, { config }) {
    let packageJson = config.meta.$cwd.resolves( 'package.json' ).tryRequire();
    let lock = new DependencyLock(
        config.meta.$locks.resolves( 'package.json' ),
        transform( packageJson )
    );
    return { local: lock };
}

module.exports = createPackageJsonLock;
function transform({ dependencies, devDependencies } = {}) {
    return {
        dependencies,
        devDependencies
    };
}
