const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

const groupValueReducer = (value, input) => {
    if(isCheckable(input) && input.checked){
        if(Array.isArray(value)) value.push(input.value)
        else value = [input.value];
    }
    else if(hasValue(input)) value = input.value;
    return value;
};

export const extractValue = group => group.fields.reduce(groupValueReducer, false);

export const removeUnvalidatable = groups => {
    let validationGroups = {};

    for(let group in groups) 
        if(groups[group].validators.length > 0)
            validationGroups[group] = groups[group];

    return validationGroups;
};

export const assemble = (acc, input) => {
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