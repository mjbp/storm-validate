import ACTIONS from './actions';
import Store from './store';
import { 
    getInitialState,
    getValidityState,
    getGroupValidityState,
    reduceGroupValidityState,
    resolveRealTimeValidationEvent,
    reduceErrorMessages
} from './validator';
import {
    clearErrors,
    clearError,
    renderError,
    renderErrors
}  from './dom';

const validate = e => {
    e && e.preventDefault();
    Store.dispatch(ACTIONS.CLEAR_ERRORS(), [clearErrors]);

    getValidityState(Store.getState().groups)
        .then(validityState => {
            //no errors (all true, no false or error Strings), just submit
            if(e && e.target && [].concat(...validityState).reduce(reduceGroupValidityState, true)) return form.submit();

            Store.dispatch(ACTIONS.VALIDATION_ERRORS(
                Object.keys(Store.getState().groups)
                    .reduce((acc, group, i) => {                                         
                        return acc[group] = {
                            valid: validityState[i].reduce(reduceGroupValidityState, true),
                            errorMessages: validityState[i].reduce(reduceErrorMessages(group, Store.getState()), [])
                        }, acc;
                    }, {})), [renderErrors]
            );

            realTimeValidation();
        });
};

const addMethod = (type, groupName, method, message) => {
    if(type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({type, method, message});
};


const realTimeValidation = () => {
    let handler = groupName => () => {
        if(!Store.getState().groups[groupName].valid) Store.dispatch(ACTIONS.CLEAR_ERROR(groupName), [clearError(groupName)]);
        getGroupValidityState(Store.getState().groups[groupName])
            .then(res => {
                if(!res.reduce(reduceGroupValidityState, true)) 
                    Store.dispatch(ACTIONS.VALIDATION_ERROR({
                        group: groupName,
                        errorMessages: res.reduce(reduceErrorMessages(groupName, Store.getState()), [])
                    }), [renderError(groupName)]);
            });
    };

    Object.keys(Store.getState().groups).forEach(groupName => {
        Store.getState().groups[groupName].fields.forEach(input => {
            input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName));
        });
        let equalToValidator = Store.getState().groups[groupName].validators.filter(validator => validator.type === 'equalto');
        
        equalToValidator.length > 0 
            && equalToValidator[0].params.other.forEach(subgroup => {
                subgroup.forEach(item => { item.addEventListener('blur', handler(groupName)); });
            });
    });
};

export default (form, settings) => {
    Store.dispatch(ACTIONS.SET_INITIAL_STATE(getInitialState(form)));

    form.addEventListener('submit', validate);

    form.addEventListener('reset', () => { Store.dispatch(ACTIONS.CLEAR_ERRORS(), [clearErrors]); });

    return {
        validate,
        addMethod
    }
};