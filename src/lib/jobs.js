let concatMerge = require('./util/concat_merge');

const {reduce} = require('lodash');

let mergeOutput = prevState => (output) => {
        let {config: nextState, slice: {name, result}} = output;
        let cat = concatMerge(
            {},
            prevState,
            nextState,
            { meta:{ jobs: {results: { [name] : result } } } }
        );

        return cat;
    },

    asyncMergeResultsOf = job => prevState => {
        let impendingMerge = mergeOutput(prevState);
        return job(prevState).then(impendingMerge);
    },

    reduceJobFromConfig = (getPreviousState, job, name) => getPreviousState
        .then(asyncMergeResultsOf(job, name))
        .catch(err=> {
            console.log('Error reducing async jobs...');
            console.log(err);
            throw err;
        });


module.exports = (config, jobs) =>   {
    let {'meta.constants.jobs.pre': chain} = config;
    return {
        config: {
            meta: {
                job: reduce(
                    jobs,
                    reduceJobFromConfig,
                    chain(config)
                ).then(finalConfig => concatMerge(config, finalConfig))
            }
        }
    }
    ;
};
