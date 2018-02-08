import Model from './model';
import { UPDATES } from './constants';
import { 
    getInitialModel,
    getValidityModel,
    getGroupValidityModel,
    reduceGroupValidityModel,
    resolveRealTimeValidationEvent,
    reduceErrorMessages
} from './validator';
import {
    clearErrors,
    clearError,
    renderError,
    renderErrors
}  from './view';

const validate = e => {
    e && e.preventDefault();
    Model.update(UPDATES.CLEAR_ERRORS, null, [clearErrors]);

    getValidityModel(Model.getModel().groups)
        .then(validityModel => {
            //no errors (all true, no false or error Strings), just submit
            if(e && e.target && [].concat(...validityModel).reduce(reduceGroupValidityModel, true)) return form.submit();

            Model.update(
                UPDATES.VALIDATION_ERRORS,
                Object.keys(Model.getModel().groups)
                    .reduce((acc, group, i) => {                                         
                        return acc[group] = {
                            valid: validityModel[i].reduce(reduceGroupValidityModel, true),
                            errorMessages: validityModel[i].reduce(reduceErrorMessages(group, Model.getModel()), [])
                        }, acc;
                    }, {}),
                [renderErrors]
            );

            realTimeValidation();
        });
};

const addMethod = (type, groupName, method, message) => {
    if(type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    model.groups[groupName].validators.push({type, method, message});
};


const realTimeValidation = () => {
    let handler = groupName => () => {
        if(!Model.getModel().groups[groupName].valid) Model.update(UPDATES.CLEAR_ERROR, groupName, [clearError(groupName)]);
        getGroupValidityModel(Model.getModel().groups[groupName])
            .then(res => {
                if(!res.reduce(reduceGroupValidityModel, true)) 
                    Model.update(
                        UPDATES.VALIDATION_ERROR,
                        {
                            group: groupName,
                            errorMessages: res.reduce(reduceErrorMessages(groupName, Model.getModel()), [])
                        },
                        [renderError(groupName)]
                    );
            });
    };

    Object.keys(Model.getModel().groups).forEach(groupName => {
        Model.getModel().groups[groupName].fields.forEach(input => {
            input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName));
        });
        let equalToValidator = Model.getModel().groups[groupName].validators.filter(validator => validator.type === 'equalto');
        
        equalToValidator.length > 0 
            && equalToValidator[0].params.other.forEach(subgroup => {
                subgroup.forEach(item => { item.addEventListener('blur', handler(groupName)); });
            });
    });
};

export default (form, settings) => {
    Model.update(UPDATES.SET_INITIAL_MODEL, (getInitialModel(form)));

    form.addEventListener('submit', validate);

    form.addEventListener('reset', () => { Model.update(UPDATES.CLEAR_ERRORS, null, [clearErrors]); });

    return {
        validate,
        addMethod
    }
};