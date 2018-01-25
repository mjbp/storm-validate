import methods from './methods';
import messages from './messages';
import { normaliseValidators } from './normaliseValidators';

export const normaliseValidators;

export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

//isn't required and no value
export const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === false;

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

const groupValueReducer = (value, input) => {
    if(isCheckable(input) && input.checked){
        if(Array.isArray(value)) value.push(input.value)
        else value = [input.value];
    }
    else if(hasValue(input)) value = input.value;
    return value;
};

export const extractValueFromGroup = group => group.fields.reduce(groupValueReducer, false);

export const removeUnvalidatedGroups = groups => {
    let validationGroups = {};

    for(let group in groups) if(groups[group].validators.length > 0) validationGroups[group] = groups[group];

    return validationGroups;
};

export const extractGroups = (acc, input) => {
    if(!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid:  false,
            validators: normaliseValidators(input),
            fields: [input]
        };
    }
    else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

export const extractErrorMessage = (validator, group) => {
    // to do
    // implement custom vaidation messages
    return messages[validator.type](validator.param !== undefined ? validator.param : null);
};

export const h = (nodeName, attributes, text) => {
    let node = document.createElement(nodeName);

    for(let prop in attributes) node.setAttribute(prop, attributes[prop]);
    if(text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

export const chooseRealtimeEvent = input => ['keyup', 'change'][Number(isCheckable(input) || isSelect(input))];

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)

export const validationReducer = group => (acc, validator) => {
    if(!methods[validator.type](group, validator.param !== undefined ? validator.param : null)) {
        acc = {
            valid: false,
            errorMessages: acc.errorMessages ? [...acc.errorMessages, extractErrorMessage(validator, group)] : [extractErrorMessage(validator, group)]
        };
    }
    return acc;
};


// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
export const pipe = (...fns) => compose.apply(compose, fns.reverse());