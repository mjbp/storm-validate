import { ACTIONS, SELECTOR } from '../constants';
import { createReducer } from '../utils';

const actionHandlers = {
    [ACTIONS.SET_INITIAL_STATE]: (state, action) => Object.assign({}, state, action.data),
    [ACTIONS.CLEAR_ERRORS]: state => Object.assign({}, state, { groups: state.groups.map(group => Object.assign({}, group, {
        errorDOM: false,
        errorMessages: []
    }))})
};
export default createReducer({}, actionHandlers);