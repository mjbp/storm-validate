import { ACTIONS } from '../constants';

export default {
    [ACTIONS.SET_INITIAL_STATE]: data => ({
        type: ACTIONS.SET_INITIAL_STATE,
        data
    }),
    [ACTIONS.CLEAR_ERRORS]: data => ({
        type: ACTIONS.CLEAR_ERRORS
    }),
    
};