import { ACTIONS } from '../constants';

export default {
    [ACTIONS.SET_INITIAL_STATE]: data => ({
        type: ACTIONS.SET_INITIAL_STATE,
        data
    }),
    [ACTIONS.CLEAR_ERRORS]: data => ({
        type: ACTIONS.CLEAR_ERRORS
    }),
    [ACTIONS.CLEAR_ERROR]: data => ({
        type: ACTIONS.CLEAR_ERROR,
        data
    }),
    [ACTIONS.VALIDATION_ERRORS]: data => ({
        type: ACTIONS.VALIDATION_ERRORS,
        data
    }),
    [ACTIONS.VALIDATION_ERROR]: data => ({
        type: ACTIONS.VALIDATION_ERROR,
        data
    }),
};