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

export const chooseRealTimeEvent = input => ['keyup', 'input'][Number(isCheckable(input) || isSelect(input))];

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)


// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
export const pipe = (...fns) => compose.apply(compose, fns.reverse());