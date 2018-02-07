import reducers from '../reducers';
// import render from '../renderer';

let state = {};

window.STATE_HISTORY = [];

const getState = () => state;

const dispatch = function(action, listeners) {
    state = action ? reducers(state, action) : state;
    // window.STATE_HISTORY.push({[action.type]: state});
    console.log({[action.type]: state});
    if(!listeners) return;
    listeners.forEach(listener => {
        listener(state);
        // render[renderer] ? render[renderer](state) : renderer(state);
    });
};

export default {
    dispatch,
    
    getState
};