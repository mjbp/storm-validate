import { ACTIONS } from '../constants';

export default {
    [ACTIONS.SET_INITIAL_STATE]: data => ({
        type: ACTIONS.SET_INITIAL_STATE,
        data
    }),
    [ACTIONS.START_VALIDATION]: data => ({
        type: ACTIONS.START_VALIDATION
    }),
    
};