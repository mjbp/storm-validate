import methods from './methods';
import messages from '../constants/messages';
import { 
    pipe,
    isCheckable,
    isSelect,
    isFile,
    DOMNodesFromCommaList,
    extractValueFromGroup
} from './utils';
import {
    DOTNET_ADAPTORS,
    DOTNET_PARAMS,
    DOTNET_ERROR_SPAN_DATA_ATTRIBUTE,
    DOM_SELECTOR_PARAMS
} from '../constants';

const resolveParam = (param, input) => {
    let value = input.getAttribute(`data-val-${param}`);
    return ({[param.split('-')[1]]: !!~DOM_SELECTOR_PARAMS.indexOf(param) 
                                                    ? DOMNodesFromCommaList(value, input)
                                                    : value })
};

const extractParams = (input, adaptor) => DOTNET_PARAMS[adaptor]
                                          ? { params: DOTNET_PARAMS[adaptor].reduce((acc, param) => input.hasAttribute(`data-val-${param}`) ? Object.assign(acc, resolveParam(param, input)) : acc, {})}
                                          : false;
          
const extractDataValValidators = input => DOTNET_ADAPTORS.reduce((validators, adaptor) => 
                                                            !input.getAttribute(`data-val-${adaptor}`) 
                                                            ? validators 
                                                            : [...validators, 
                                                                Object.assign({
                                                                    type: adaptor,
                                                                    message: input.getAttribute(`data-val-${adaptor}`)}, 
                                                                    extractParams(input, adaptor)
                                                                )
                                                            ],
                                                        []);

const extractAttrValidators = input => pipe(email(input), url(input), number(input), minlength(input), maxlength(input), min(input), max(input), pattern(input), required(input));

//un-DRY...
const required = input => (validators = [])  => input.hasAttribute('required') && input.getAttribute('required') !== 'false' ? [...validators, {type: 'required'}] : validators;
const email = input => (validators = [])  => input.getAttribute('type') === 'email' ? [...validators, {type: 'email'}] : validators;
const url = input => (validators = [])  => input.getAttribute('type') === 'url' ? [...validators, {type: 'url'}] : validators;
const number = input => (validators = [])  => input.getAttribute('type') === 'number' ? [...validators, {type: 'number'}] : validators;
const minlength = input => (validators = [])  => (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') ? [...validators, {type: 'minlength', params: { min: input.getAttribute('minlength')}}] : validators;
const maxlength = input => (validators = [])  => (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') ? [...validators, {type: 'maxlength', params: { max: input.getAttribute('maxlength')}}] : validators;
const min = input => (validators = [])  => (input.getAttribute('min') && input.getAttribute('min') !== 'false') ? [...validators, {type: 'min', params: { min: input.getAttribute('min')}}] : validators;
const max = input => (validators = [])  => (input.getAttribute('max') && input.getAttribute('max') !== 'false') ? [...validators, {type: 'max', params: { max: input.getAttribute('max')}}] : validators;
const pattern = input => (validators = [])  => (input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') ? [...validators, {type: 'pattern', params: { regex: input.getAttribute('pattern')}}] : validators;

export const normaliseValidators = input => input.getAttribute('data-val') === 'true' 
                                            ? extractDataValValidators(input)
                                            : extractAttrValidators(input);

export const validate = (group, validator) => validator.type === 'custom' 
                                              ? methods['custom'](validator.method, group)
                                              : methods[validator.type](group, validator.params);

export const assembleValidationGroup = (acc, input) => {
    let name = input.getAttribute('name');
    return acc[name] = acc[name] ? Object.assign(acc[name], { fields: [...acc[name].fields, input]})
                                 : {
                                        valid:  false,
                                        validators: normaliseValidators(input),
                                        fields: [input],
                                        serverErrorNode: document.querySelector(`[${DOTNET_ERROR_SPAN_DATA_ATTRIBUTE}=${input.getAttribute('name')}]`) || false
                                    }, acc;
};

const extractErrorMessage = validator => validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);

export const reduceErrorMessages = (group, state) => (acc, validity, j) => {
    return validity === true 
                ? acc 
                : [...acc, typeof validity === 'boolean' 
                            ? extractErrorMessage(state.groups[group].validators[j])
                            : validity];
};

export const removeUnvalidatableGroups = groups => {
    let validationGroups = {};

    for(let group in groups)
        if(groups[group].validators.length > 0)
            validationGroups[group] = groups[group];

    return validationGroups;
};

export const getInitialState = form => ({
    groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select'))
                    .reduce(assembleValidationGroup, {}))
});

export const reduceGroupValidityState = (acc, curr) => {
    if(curr !== true) acc = false;
    return acc; 
};

export const getValidityState = groups => {
    return Promise.all(
        Object.keys(groups)
            .map(group => getGroupValidityState(groups[group]))
        );
};

export const getGroupValidityState = group => {
    let hasError = false;
	return Promise.all(group.validators.map(validator => {
        return new Promise(resolve => {
            if(validator.type !== 'remote'){
                if(validate(group, validator)) resolve(true);
                else {
                    hasError = true;
                    resolve(false);
                }
            } else if(hasError) resolve(false);
                else validate(group, validator)
                        .then(res => { resolve(res);});
        });
    }));
};

export const resolveRealTimeValidationEvent = input => ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];