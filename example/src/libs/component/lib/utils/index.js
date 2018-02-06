export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isFile = field => field.getAttribute('type') === 'file';

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

export const getName = group => group.fields[0].getAttribute('name');

export const resolveGetParams = nodeArrays => nodeArrays.map((nodes) => {
    return `${nodes[0].getAttribute('name')}=${extractValueFromGroup(nodes)}`;
}).join('&');

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

export const groupValueReducer = (acc, input) => {
    if(!isCheckable(input) && hasValue(input)) acc = input.value;
    if(isCheckable(input) && input.checked) {
        if(Array.isArray(acc)) acc.push(input.value)
        else acc = [input.value];
    }
    return acc;
}

export const extractValueFromGroup = group => group.hasOwnProperty('fields') 
                                            ? group.fields.reduce(groupValueReducer, '')
                                            : group.reduce(groupValueReducer, '')

export const chooseRealTimeEvent = input => ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];

export const pipe = (...fns) => fns.reduce((acc, fn) => fn(acc));

export const fetch = (url, props) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(props.method || 'GET', url);
        if (props.headers) {
            Object.keys(props.headers).forEach(key => {
                xhr.setRequestHeader(key, props.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(props.body);
    });
};

export const createReducer = (initialState, actionHandlers) => (state = initialState, action) => {
    if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action)
    else return state;
};

export const DOMNodesFromCommaList = (list, input) => list.split(',')
                                                .map(item => {
                                                    let resolvedSelector = escapeAttributeValue(appendModelPrefix(item, getModelPrefix(input.getAttribute('name'))));
                                                    return [].slice.call(document.querySelectorAll(`[name=${resolvedSelector}]`));
                                                });

const escapeAttributeValue = value => value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");

const getModelPrefix = fieldName => fieldName.substr(0, fieldName.lastIndexOf('.') + 1);

const appendModelPrefix = (value, prefix) => {
    if (value.indexOf("*.") === 0) value = value.replace("*.", prefix);
    return value;
}
