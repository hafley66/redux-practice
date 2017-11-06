import {addToCachePath} from '../paths/actions';
import {resolvePath} from '../paths/selectors';
import {ADD_DEPENDENCY, UPDATE_DEPENDENCY} from '../actions/types';
import {isEqual, merge} from 'lodash';
import fs from 'fs';

const addDependency = ({name, currentValue, cachedValue, cachedPathId}) => ({
    type: ADD_DEPENDENCY,
    id: name,
    currentValue,
    cachedValue,
    cachedPathId
});

const loadDependency = ({name, cachePath, currentValue}) => (dispatch, getState) => {
    let cachedPathId = dispatch(addToCachePath({value: cachePath})).id;
    let cachedPath = resolvePath(getState(), cachedPathId);
    let cachedValue;

    try {
        cachedValue = require(cachedPath);
    }catch(err) {
        cachedValue = null;
    }

    dispatch(addDependency({
        name,
        cachedValue,
        currentValue,
        cachedPathId
    }));
};

const updateDependency = ({name}) => (dispatch, getState) => {
    let s = getState();
    let dep = s.dependencies[name];
    let cacheFile = resolvePath(s, dep.cachedPathId);
    fs.writeFileSync(cacheFile, JSON.stringify(dep.currentValue));
    return {
        type: UPDATE_DEPENDENCY,
        id: dep.id,
        cachedValue: dep.currentValue
    };
};

let actions = {
    addDependency,
    loadDependency,
    updateDependency
};
let reducers = {
    defaults: ()=>({}),
    [ADD_DEPENDENCY]: ({dependencies}, action) =>
        action.id
            ? {
                ...dependencies,
                [action.id]: {...action}
            }
            : dependencies
    ,
    [UPDATE_DEPENDENCY]: ({dependencies}, action) => ({
        ...dependencies,
        [action.id]: merge({}, dependencies[action.id], action)
    })
};
let selectors = {
    isDependencyUpToDate: ({dependencies}, id) => {
        let dep = dependencies[id];
        return isEqual(dep.currentValue, dep.cachedValue);
    }
};

export {actions, reducers, selectors};
