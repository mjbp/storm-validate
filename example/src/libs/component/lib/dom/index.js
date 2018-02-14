import { DOTNET_CLASSNAMES } from '../constants';

let errorNodes = {};

export const h = (nodeName, attributes, text) => {
    let node = document.createElement(nodeName);

    for(let prop in attributes) node.setAttribute(prop, attributes[prop]);
    if(text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

export const createErrorTextNode = (group, msg) => {
    let node = document.createTextNode(msg);

    group.serverErrorNode.classList.remove(DOTNET_CLASSNAMES.VALID);
    group.serverErrorNode.classList.add(DOTNET_CLASSNAMES.ERROR);
    
    return group.serverErrorNode.appendChild(node);
};

export const clearError = groupName => state => {
    errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
    if(state.groups[groupName].serverErrorNode) {
        state.groups[groupName].serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        state.groups[groupName].serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    state.groups[groupName].fields.forEach(field => { field.removeAttribute('aria-invalid'); });
    delete errorNodes[groupName];
};

export const clearErrors = state => {
    Object.keys(errorNodes).forEach(name => {
        clearError(name)(state);
    });
};

export const renderErrors = state => {
    Object.keys(state.groups).forEach(groupName => {
        if(!state.groups[groupName].valid) renderError(groupName)(state);
    })
};

export const renderError = groupName => state => {
    if(errorNodes[groupName]) clearError(groupName)(state);
    
    errorNodes[groupName] = 
    state.groups[groupName].serverErrorNode 
            ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) 
            : state.groups[groupName]
						.fields[state.groups[groupName].fields.length-1]
						.parentNode
						.appendChild(h('div', { class: DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));
						
	state.groups[groupName].fields.forEach(field => { field.setAttribute('aria-invalid', 'true'); });
};