let {createStore, combineReducers} = require('redux');
import middleware from './middlware';

const store = (
    reducers = combineReducers({
        a: (state = 0, action) =>  (state + (action.value ? action.value : 0))
    })
    ,
    dummyState = undefined
) => createStore(
    reducers,
    dummyState,
    middleware
);

export default store();
export {store};
