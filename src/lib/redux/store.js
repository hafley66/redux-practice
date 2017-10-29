let {createStore, combineReducers} = require('redux');
import middleware from './middlware';
import {omit, mapValues} from 'lodash';

export const
    convertToReducer = obj =>
        (
            state = obj.defaults && obj.defaults() || undefined,
            action
        ) =>
            (
                // console.log('Building object reducer...', obj, state, action),
                obj[action.type]
                    ? obj[action.type](state, omit(action, 'type'))
                    : (x=>x)(state, action)
            );

const tryConvert = (r) => (
    typeof r === 'function'
        ? r
        : r && convertToReducer(r)
);

export const
    combine = (reducers) =>
        combineReducers(mapValues(reducers, tryConvert)),

    store = ( reducers = (x=>x), dummyState = undefined ) =>
        createStore(
            typeof reducers === 'function'
                ? reducers
                : reducers && combine(reducers),
            dummyState,
            middleware
        );

export default store();
