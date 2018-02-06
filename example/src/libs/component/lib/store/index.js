import reducers from '../reducers';
import render from '../renderer';

let state = {};

window.STATE_HISTORY = [];

const getState = () => state;

const dispatch = function(action, renderers) {
    state = action ? reducers(state, action) : state;
    // window.STATE_HISTORY.push({[action.type]: state});
    console.log({[action.type]: state});
    if(!renderers) return;
    renderers.forEach(renderer => {
        render[renderer] ? render[renderer](state) : renderer(state);
    });
};

export default {
    dispatch,
    getState
};