import { ACTIONS, SELECTOR } from '../constants';
import { createReducer } from '../utils';

const actionHandlers = {
    [ACTIONS.SET_INITIAL_STATE]: (state, action) => Object.assign({}, state, action.data),
    [ACTIONS.CLEAR_ERRORS]: state => Object.assign({}, state, { 
        groups: Object.keys(state.groups).reduce((acc, group) => {
            acc[group] = Object.assign({}, state.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    }),
    [ACTIONS.VALIDATION_ERRORS]: (state, action) => {
        return Object.assign({}, state, { 
            groups: Object.keys(state.groups).reduce((acc, group) => {
                acc[group] = Object.assign({}, state.groups[group], action.data[group]);
                return acc;
            }, {})
        });
    }
};
export default createReducer({}, actionHandlers);