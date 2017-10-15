import store from './redux/store';

store.dispatch({
    type: 'add',
    value: 10
});

// Note: this API requires redux@>=3.1.0
module.exports = store;




