import methods from './methods';
import messages from './messages';

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

const checkForDataRuleConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

const checkForDataValConstraint = (input, constraint) => input.getAttribute(`data-val-${constraint}`) && input.getAttribute(`data-val-${constraint}`) !== 'false';

const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);

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

export const normaliseValidators = input => {
    let validators = [];
    // To do
    // validate the validation parameters

    /*
        - check if data-val="true"

            validator:
            {
                type: String [required],
                params: Array [optional],
                message: String [optional]
            }

    */
    /*
    //required
    if((input.hasAttribute('required') && input.getAttribute('required') !== 'false') || checkForDataRuleConstraint(input, 'required') || checkForDataValConstraint(input, 'required')) validators.push({type: 'required'});

    //email
    if(checkForConstraint(input, 'email') || checkForDataValConstraint(input, 'email')) validators.push({type: 'email'});

    //url
    if(checkForConstraint(input, 'url') || checkForDataValConstraint(input, 'url')) validators.push({type: 'url'});

    //date
    if(checkForConstraint(input, 'date') || checkForDataValConstraint(input, 'date')) validators.push({type: 'date'});

    //dateISO
    if(checkForConstraint(input, 'dateISO') || checkForDataValConstraint(input, 'dateISO')) validators.push({type: 'dateISO'});

    //number
    if(checkForConstraint(input, 'number') || checkForDataValConstraint(input, 'number')) validators.push({type: 'number'});

    //minlength
    if((input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') || checkForDataRuleConstraint(input, 'minlength') || checkForDataValConstraint(input, 'minlength')) validators.push({type: 'minlength', param: extractValidationParams('minlength')});

    //maxlength
    if((input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') || checkForDataRuleConstraint(input, 'maxlength') || checkForDataValConstraint(input, 'maxlength')) validators.push({type: 'maxlength', param: input.getAttribute('maxlength')});

    //min
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false') || checkForDataRuleConstraint(input, 'min') || checkForDataValConstraint(input, 'min')) validators.push({type: 'min', param: input.getAttribute('min')});

    //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataRuleConstraint(input, 'max') || checkForDataValConstraint(input, 'max')) validators.push({type: 'max', param: input.getAttribute('max')});

    //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataRuleConstraint(input, 'max') || checkForDataValConstraint(input, 'max')) validators.push({type: 'max', param: input.getAttribute('max')});


    //step

    //equalTo

    //remote

    //digits

    //rangelength
    */

    return validators;
};