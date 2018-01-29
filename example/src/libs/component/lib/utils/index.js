export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isFile = field => field.getAttribute('type') === 'file';

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

export const getName = group => group.fields[0].getAttribute('name');

const unfold = (acc, curr, i, arr) => {
    if(arr.length < 2) return acc;
    return arr;
};

const requestBodyReducer = (acc, curr) => {
    acc[curr.substr(2)] = [].slice.call(document.querySelectorAll(`[name=${curr.substr(2)}]`)).reduce(groupValueReducer, []).reduce(unfold, '');
    return acc;
};

export const composeRequestBody = (group, additionalfields) => {
    return additionalfields.split(',').reduce(requestBodyReducer, {});
};

const getURLReducer = (acc, curr) => `${acc}&${curr.substr(2)}=${[].slice.call(document.querySelectorAll(`[name=${curr.substr(2)}]`)).reduce(groupValueReducer, []).join(',')}`;

export const composeGetURL = (baseURL, group, additionalfields) => additionalfields.split(',').reduce(getURLReducer, `${baseURL}?`);
    
const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

const groupValueReducer = (acc, input) => {
    if(!isCheckable(input) && hasValue(input)) acc = input.value;
    if(isCheckable(input) && input.checked) {
        if(Array.isArray(acc)) acc.push(input.value)
        else acc = [input.value];
    }
    return acc;
}

export const extractValueFromGroup = group => group.fields.reduce(groupValueReducer, '');

export const chooseRealTimeEvent = input => ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];


// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
export const pipe = (...fns) => compose.apply(compose, fns.reverse());