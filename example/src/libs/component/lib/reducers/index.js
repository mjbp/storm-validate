import { ACTIONS } from '../constants';
import { createReducer } from './create-reducer';

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
    [ACTIONS.CLEAR_ERROR]: (state, action) => Object.assign({}, state, {
        groups: Object.assign({}, state.groups, {
            [action.data]: Object.assign({}, state.groups[action.data], {
                errorMessages: [],
                valid: true
            })
        })
    }),
    [ACTIONS.VALIDATION_ERRORS]: (state, action) => {
        return Object.assign({}, state, { 
            groups: Object.keys(state.groups).reduce((acc, group) => {
                acc[group] = Object.assign({}, state.groups[group], action.data[group]);
                return acc;
            }, {})
        });
    },
    [ACTIONS.VALIDATION_ERROR]: (state, action) => {
        return Object.assign({}, state, {
            groups: Object.assign({}, state.groups, {
                [action.data.group]: Object.assign({}, state.groups[action.data.group], {
                    errorMessages: action.data.errorMessages,
                    valid: false
                })
            })
        })
    }
};
export default createReducer({}, actionHandlers);