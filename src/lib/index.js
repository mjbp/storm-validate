import ACTIONS from './actions';
// import { TRIGGER_EVENTS, KEY_CODES, DATA_ATTRIBUTES } from  './constants';
import Store from './store';
import { getInitialState, getValidityState, extractErrorMessage, reduceGroupValidityState } from './utils/validators';
import { clearErrors, renderErrors }  from './utils/dom';

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
        //or add subscribe fn to store?
        Store.dispatch(ACTIONS.CLEAR_ERRORS(), [clearErrors]);

        getValidityState(Store.getState().groups)
            .then(validityState => {
                //either have connected ValidtionContainer that dispatches updates to the store for group vaildation states
                //requires adding subscribe function... which we might need anyway...
                //or extract validity booleans and map onto validation groups in reducer?
                //let's try the second one for now...

                //no errors (all true, no false or error Strings), just submit
                if([].concat(...validityState).reduce(reduceGroupValidityState, true)) return form.submit();

                Store.dispatch(ACTIONS.VALIDATION_ERRORS(
                    Object.keys(Store.getState().groups)
                        .reduce((acc, group, i) => {
                            //reeeeeeeefactor pls ;_;
                            let groupValidityState = validityState[i].reduce(reduceGroupValidityState, true),
                                errorMessages = validityState[i]
                                                    .reduce((acc, validity, j) => {
                                                        return validity === true 
                                                                    ? acc 
                                                                    : [...acc, typeof validity === 'boolean' 
                                                                                ? extractErrorMessage(Store.getState().groups[group].validators[j])
                                                                                : validity];
                                                    }, []);
                                                                                                
                            return acc[group] = {
                                valid: groupValidityState,
                                errorMessages: errorMessages
                            }, acc;
                        }, {})), [renderErrors]
                );

                // initRealTimeValidation();
            });
    });

    // form.addEventListener('reset', clear);

    return {
        validate,
        addMethod
    }
};