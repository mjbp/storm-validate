import reducers from '../reducers';
let state = {};

// window.__validator_history__ = [];

const getState = () => state;

const dispatch = function(type, nextState, effects) {
    state = nextState ? reducers[type](state, nextState) : state;
    // window.__validator_history__.push({[type]: state}), console.log(window.__validator_history__);
    // console.log({[type]: state});
    if(!effects) return;
    effects.forEach(effect => { effect(state); });
};

export default { dispatch, getState };