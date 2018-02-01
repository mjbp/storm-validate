import methods from '../methods';
import messages from '../messages';
import { pipe, DOMNodesFromCommaList, extractValueFromGroup } from './';
import { DOTNET_ADAPTORS, DOTNET_PARAMS, DOTNET_ERROR_SPAN_DATA_ATTRIBUTE, DOM_SELECTOR_PARAMS } from '../constants';

const resolveParam = (param, value) => !!~DOM_SELECTOR_PARAMS.indexOf(param) 
                                        ? DOMNodesFromCommaList(value)
                                        : value;

const extractParams = (input, adaptor) => DOTNET_PARAMS[adaptor]
                                          ? { 
                                              params: DOTNET_PARAMS[adaptor].reduce((acc, param) => [...acc, input.hasAttribute(`data-val-${param}`) ? resolveParam(param, input.getAttribute(`data-val-${param}`)) : []], [])
                                            }
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

const extractAttrValidators = input => pipe(
                                            email(input),
                                            url(input),
                                            number(input),
                                            minlength(input),
                                            maxlength(input),
                                            min(input),
                                            max(input),
                                            pattern(input),
                                            required(input)
                                        );

//un-DRY
const required = input => (validators = [])  => input.hasAttribute('required') && input.getAttribute('required') !== 'false' ? [...validators, {type: 'required'}] : validators;
const email = input => (validators = [])  => input.getAttribute('type') === 'email' ? [...validators, {type: 'email'}] : validators;
const url = input => (validators = [])  => input.getAttribute('type') === 'url' ? [...validators, {type: 'url'}] : validators;
const number = input => (validators = [])  => input.getAttribute('type') === 'number' ? [...validators, {type: 'number'}] : validators;
const minlength = input => (validators = [])  => (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') ? [...validators, {type: 'minlength', params: [input.getAttribute('minlength')]}] : validators;
const maxlength = input => (validators = [])  => (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') ? [...validators, {type: 'maxlength', params: [input.getAttribute('maxlength')]}] : validators;
const min = input => (validators = [])  => (input.getAttribute('min') && input.getAttribute('min') !== 'false') ? [...validators, {type: 'min', params: [input.getAttribute('min')]}] : validators;
const max = input => (validators = [])  => (input.getAttribute('max') && input.getAttribute('max') !== 'false') ? [...validators, {type: 'max', params: [input.getAttribute('max')]}] : validators;
const pattern = input => (validators = [])  => (input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') ? [...validators, {type: 'pattern', params: [input.getAttribute('pattern')]}] : validators;

export const normaliseValidators = input => input.getAttribute('data-val') === 'true' 
                                            ? extractDataValValidators(input)
                                            : extractAttrValidators(input);

export const validate = (group, validator) => validator.method 
                                              ? validator.method(extractValueFromGroup(group), group.fields, validator.params)
                                              : methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null);

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

export const extractErrorMessage = (validator, group) => validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);

export const removeUnvalidatableGroups = groups => {
    let validationGroups = {};

    for(let group in groups)
        if(groups[group].validators.length > 0)
            validationGroups[group] = groups[group];

    return validationGroups;
};