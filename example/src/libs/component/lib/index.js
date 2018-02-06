import ACTIONS from './actions';
// import { TRIGGER_EVENTS, KEY_CODES, DATA_ATTRIBUTES } from  './constants';
import Store from './store';
import { getInitialState, getValidityState } from './utils/validators';

// import { clear, render } from './manage-errors';

const validate = () => {};

const addMethod = (type, groupName, method, message) => {
    if(type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({type, method, message});
};

export default (form, settings) => {
    Store.dispatch(ACTIONS.SET_INITIAL_STATE(getInitialState(form)));


    form.addEventListener('submit', e => {
        e.preventDefault();
        
        //pass subscribed side-effects in action..?
        Store.dispatch(ACTIONS.START_VALIDATION(), ['clearErrors']);

        //dispatch valdate
        getValidityState(Store.getState().groups)
            .then(validityState => {
                console.log([].concat(...validityState));
                // Store.dispatch(ACTIONS.START_VALIDATION(), ['clearErrors']);
                //submit
                // if(![].concat(...res).includes(false)) form.submit();
                // else {
                //     //dispatch errors
                //     render(state.group);
                //     //dispatch init real-time validation

                //     // initRealTimeValidation();
                // }
            });
    });

    // form.addEventListener('reset', clear);

    return {
        validate,
        addMethod
    }
};