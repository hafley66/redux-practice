const
    queryAble = require('../query_proxy'),
    {isArray, isFunction} = require('lodash');

class UnknownReducerTypeError extends Error {}
let err = path =>{throw new UnknownReducerTypeError(`(Error resolving reducer)>>${ JSON.stringify(path)}`);};

module.exports = ({resolve, joinPaths, inputs, outputs}) =>
    function reduceFrom(parentPath) {
        return (state, path) => {
            let nextPath = joinPaths(state, parentPath, path),
                lazyInputs = (bnd = inputs(state, nextPath, parentPath)) => (
                    // console.log(bnd),
                    bnd.map(queryAble)
                ),
                toNextState = (...args) => (
                    // console.log(outputs(state, nextPath, parentPath)(...args)),
                    outputs(state, nextPath, parentPath)(...args)
                ),
                resolved = resolve(nextPath),

                recursion = list => list.reduce(reduceFrom(nextPath), state),
                polymorphicOutput = output =>
                    (
                        isArray(output)
                            ? recursion(output)
                            : output
                    )
            ;
            console.log('NEXT_PATH:', nextPath);

            return queryAble(toNextState(
                isFunction(resolved)
                    ? polymorphicOutput(resolved(...lazyInputs()))
                    : isArray(resolved)
                        ? recursion(resolved)
                        : err(nextPath.toString())
            ))
            ;
        };
    }
;
