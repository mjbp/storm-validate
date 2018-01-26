import methods from '../methods';
import messages from '../messages';
import { DOTNET_ADAPTORS, DOTNET_PARAMS, DOTNET_ERROR_SPAN_DATA_ATTRIBUTE } from '../constants';

//Sorry...
const extractDataValValidators = input => DOTNET_ADAPTORS
                                            .reduce((validators, adaptor) => 
                                                !input.getAttribute(`data-val-${adaptor}`) 
                                                ? validators 
                                                : [...validators, 
                                                        Object.assign({
                                                            type: adaptor,
                                                            message: input.getAttribute(`data-val-${adaptor}`)}, 
                                                            DOTNET_PARAMS[adaptor] && 
                                                            { 
                                                                params: DOTNET_PARAMS[adaptor]
                                                                    .reduce((acc, param) => {
                                                                        input.hasAttribute(`data-val-${param}`) 
                                                                        && acc.push(input.getAttribute(`data-val-${param}`))
                                                                        return acc;
                                                                    }, []) 
                                                            })
                                                    ],
                                                []);

//for data-rule-* support
//const hasDataAttributePart = (node, part) => [].slice.call(node.dataset).filter(attribute => !!~attribute.indexOf(part)).length > 0;

const extractAttributeValidators = input => {
    let validators = [];
    if(input.hasAttribute('required') && input.getAttribute('required') !== 'false') validators.push({type: 'required'});
    if(input.getAttribute('type') === 'email') validators.push({type: 'email'});
    if(input.getAttribute('type') === 'url') validators.push({type: 'url'});
    if(input.getAttribute('type') === 'number') validators.push({type: 'number'});
    if(input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') validators.push({type: 'minlength', params: [input.getAttribute('minlength')]});
    if(input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') validators.push({type: 'maxlength', params: [input.getAttribute('maxlength')]});
    if(input.getAttribute('min') && input.getAttribute('min') !== 'false') validators.push({type: 'min', params: [input.getAttribute('min')]});
    if(input.getAttribute('max') && input.getAttribute('max') !== 'false') validators.push({type: 'max', params: [input.getAttribute('max')]});
    if(input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') validators.push({type: 'pattern', params: [input.getAttribute('pattern')]});
    return validators;
};

export const normaliseValidators = input => {
    let validators = [];
    
    if(input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));
    else validators = validators.concat(extractAttributeValidators(input));
    /*
    //date
    //dateISO
    //min
    //max
    //step

    //equalTo
        adapters.add("equalto", ["other"], function (options) {
            var prefix = getModelPrefix(options.element.name),
                other = options.params.other,
                fullOtherName = appendModelPrefix(other, prefix),
                element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];

            setValidationValues(options, "equalTo", element);
        });

    //remote
    //digits
    //rangelength
    */

    return validators;
};

export const validationReducer = group => (acc, validator) => {
    if(methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
    return {
        valid: false,
        errorMessages: acc.errorMessages 
                        ? [...acc.errorMessages, extractErrorMessage(validator, group)] 
                        : [extractErrorMessage(validator, group)]
    };;
};

export const assembleValidationGroup = (acc, input) => {
    if(!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid:  false,
            validators: normaliseValidators(input),
            fields: [input],
            serverErrorNode: document.querySelector(`[${DOTNET_ERROR_SPAN_DATA_ATTRIBUTE}=${input.getAttribute('name')}]`) || false
        };
    }
    else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

export const extractErrorMessage = (validator, group) => validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);

export const removeUnvalidatableGroups = groups => {
    let validationGroups = {};

    for(let group in groups) 
        if(groups[group].validators.length > 0)
            validationGroups[group] = groups[group];

    return validationGroups;
};