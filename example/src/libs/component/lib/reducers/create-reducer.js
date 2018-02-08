export const createReducer = (initialState, actionHandlers) => (state = initialState, action) => {
    if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action)
    else return state;
};