import ACTIONS from './actions';
import Store from './store';
import { getInitialState, getValidityState, getGroupValidityState, extractErrorMessage, reduceGroupValidityState } from './utils/validators';
import { clearErrors, clearError, renderError, renderErrors }  from './utils/dom';
import { chooseRealTimeEvent } from './utils';

const validate = () => {};

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
                        errorMessages: res.reduce((acc, validity, j) => {
                                            return validity === true 
                                                        ? acc 
                                                        : [...acc, typeof validity === 'boolean' 
                                                                    ? extractErrorMessage(Store.getState().groups[groupName].validators[j])
                                                                    : validity];
                                        }, [])
                    }), [renderError(groupName)]);
            });
    };

    Object.keys(Store.getState().groups).forEach(groupName => {
        Store.getState().groups[groupName].fields.forEach(input => {
            input.addEventListener(chooseRealTimeEvent(input), handler(groupName));
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

    form.addEventListener('submit', e => {
        e.preventDefault();

        Store.dispatch(ACTIONS.CLEAR_ERRORS(), [clearErrors]);

        getValidityState(Store.getState().groups)
            .then(validityState => {
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

                realTimeValidation();
            });
    });

    // form.addEventListener('reset', clear);

    return {
        validate,
        addMethod
    }
};