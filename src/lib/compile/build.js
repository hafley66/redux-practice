let {webpack} = require('../util'),
    pick = require('./_pick_');

module.exports = () => {

    let job = config => webpack(pick(config)).runPromise().then(results=> ({
        slice: {
            name: 'build',
            results
        }
    }));

    return {
        config: {
            meta: {
                jobs: {
                    build: job
                }
            }
        }
    };
};
