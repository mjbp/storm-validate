 export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

const groupValueReducer = (acc, input) => {
    if(isCheckable(input)) {
        if(input.checked){
            if(Array.isArray(acc)) acc.push(input.value);
            else acc = [input.value];
        }
    }
    else if(hasValue(input)) acc = input.value;
    return acc;
}

export const extractValueFromGroup = group => {
    return group.fields
            .reduce((acc, input) => {
                if(isCheckable(input)) {
                    if(input.checked){
                        if(Array.isArray(acc)) acc.push(input.value)
                        else acc = [input.value];
                    }
                }
                else if(hasValue(input)) acc = input.value;
                return acc;
            }, false);
};


export const chooseRealTimeEvent = input => ['input', 'change'][Number(isCheckable(input) || isSelect(input))];

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)


// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
export const pipe = (...fns) => compose.apply(compose, fns.reverse());