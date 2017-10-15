let { combineReducers, createStore, applyMiddleware } = require('redux'),
    thunk = require('redux-thunk');


let reducers = {
    a: (a = 0, action) =>  ({a: a + action ? action.value : 0})
};

// Note: this API requires redux@>=3.1.0
const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk)
);


