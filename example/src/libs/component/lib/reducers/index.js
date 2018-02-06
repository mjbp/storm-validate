import { ACTIONS, SELECTOR } from '../constants';
import { createReducer } from '../utils';

const actionHandlers = {
    [ACTIONS.SET_INITIAL_STATE]: (state, action) => Object.assign({}, state, action.data),
    [ACTIONS.START_VALIDATION]: state => Object.assign({}, state, { 
        groups: Object.keys(state.groups).reduce((acc, group) => {
            acc[group] = Object.assign({}, state.groups[group], {
                errorDOM: false,
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    })
};
export default createReducer({}, actionHandlers);