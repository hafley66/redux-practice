// import thunk from 'redux-thunk';
import {applyMiddleware} from 'redux';
import subscribeMiddlware from 'redux-subscribe';

// function logger({ getState }) {
//     return next => action => {
//         console.log('will dispatch', getState(), action);
//
//         // Call the next dispatch method in the middleware chain.
//         let returnValue = next(action);
//
//         console.log('state after dispatch', getState(), returnValue);
//
//         // This will likely be the action itself, unless
//         // a middleware further in chain changed it.
//         return returnValue;
//     };
// }
//

export default applyMiddleware(
    subscribeMiddlware
    // , logger
);
