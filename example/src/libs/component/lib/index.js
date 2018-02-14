import Store from './store';
import { ACTIONS } from './constants';
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


const createValidate = form => {
    return e => {
        e && e.preventDefault();
        Store.dispatch(ACTIONS.CLEAR_ERRORS, null, [clearErrors]);

        getValidityState(Store.getState().groups)
            .then(validityState => {
                if(e && e.target && [].concat(...validityState).reduce(reduceGroupValidityState, true)) return form.submit();

                Store.dispatch(
                    ACTIONS.VALIDATION_ERRORS,
                    Object.keys(Store.getState().groups)
                        .reduce((acc, group, i) => {                                         
                            return acc[group] = {
                                valid: validityState[i].reduce(reduceGroupValidityState, true),
                                errorMessages: validityState[i].reduce(reduceErrorMessages(group, Store.getState()), [])
                            }, acc;
                        }, {}),
                    [renderErrors]
                );

                realTimeValidation();
            });
        }
};

const addMethod = (groupName, method, message) => {
    if((groupName === undefined || method === undefined || message === undefined) || !Store.getState()[groupName] && document.getElementsByName(groupName).length === 0)
        return console.warn('Custom validation method cannot be added.');

    Store.dispatch(ACTIONS.ADD_VALIDATION_METHOD, {groupName, validator: {type: 'custom', method, message}});
};


const realTimeValidation = () => {
    let handler = groupName => () => {
        if(!Store.getState().groups[groupName].valid) Store.dispatch(ACTIONS.CLEAR_ERROR, groupName, [clearError(groupName)]);
        getGroupValidityState(Store.getState().groups[groupName])
            .then(res => {
                if(!res.reduce(reduceGroupValidityState, true)) 
                Store.dispatch(
                        ACTIONS.VALIDATION_ERROR,
                        {
                            group: groupName,
                            errorMessages: res.reduce(reduceErrorMessages(groupName, Store.getState()), [])
                        },
                        [renderError(groupName)]
                    );
            });
    };

    Object.keys(Store.getState().groups).forEach(groupName => {
        Store.getState().groups[groupName].fields.forEach(input => {
            input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName));
        });
        //;_; can do better?
        let equalToValidator = Store.getState().groups[groupName].validators.filter(validator => validator.type === 'equalto');
        
        equalToValidator.length > 0 
            && equalToValidator[0].params.other.forEach(subgroup => {
                subgroup.forEach(item => { item.addEventListener('blur', handler(groupName)); });
            });
    });
};

export default (form, settings) => {
    Store.dispatch(ACTIONS.SET_INITIAL_STATE, (getInitialState(form)));
    form.addEventListener('submit', validate(form));
    form.addEventListener('reset', () => { Store.update(UPDATES.CLEAR_ERRORS, null, [clearErrors]); });

    return {
        validate: createValidate(form),
        addMethod
    }
};