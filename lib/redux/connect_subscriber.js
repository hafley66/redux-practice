import {subscribe} from 'redux-subscribe';
import {reduce, get, forEach, invert, values, isArray, isPlainObject} from 'lodash';

export let
    pathTail = path => path.split('.').slice(-1).join(),
    convertToStandardForm = (mapStateToArgs) => {
        if(isArray(mapStateToArgs)) {
            return {
                queries: mapStateToArgs,
                queries2args: (mapStateToArgs.reduce(
                    (sum, path) => (sum[(path)] = pathTail(path), sum),
                    {}
                ))
            };
        }
        else if(isPlainObject(mapStateToArgs)){
            return {
                queries: values(mapStateToArgs),
                queries2args: invert(mapStateToArgs)
            };
        }

    },
    subscribers = 0,
    handleMapState = ({dispatch, getState}) => mapStateToArgs => {
        let vals = {};
        let {queries, queries2args} = convertToStandardForm(mapStateToArgs);

        runSubscriber.queries = queries;
        runSubscriber.queries2args = queries2args;
        return runSubscriber;

        function runSubscriber(subscriberFn) {
            let onChange = ({path, next}) => {
                vals[queries2args[path]] = next;
                let maybeAction = subscriberFn(vals);
                if(maybeAction && maybeAction.type)
                    return maybeAction;
                else
                    return {type: ''};
            };

            forEach(queries, query => (
                vals[queries2args[query]] = get(getState(), query),
                dispatch(
                    subscribe(
                        query,
                        `SUBSCRIBER#${subscribers}`,
                        onChange
                    )
                )
            ));

            subscriberFn(vals);

            return vals;
        }
    },
    handleMapDispatch = ({dispatch}) => (mapDispatchToArgs, sum = {}) =>
        reduce(
            mapDispatchToArgs,
            (sum, fn, name) => (
                sum[name] = (...args) => dispatch(fn(...args)),
                sum
            ),
            sum
        )
    ;

const connect = (store) =>
    (mapStateToArgs, mapDispatchToArgs) => {
        let vals = handleMapState(store)(mapStateToArgs);
        handleMapDispatch(store)(mapDispatchToArgs, vals);
        return vals;
    };

export default connect;
