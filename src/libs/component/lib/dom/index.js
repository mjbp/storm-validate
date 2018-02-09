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

export const clearError = groupName => model => {
    errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
    if(model.groups[groupName].serverErrorNode) {
        model.groups[groupName].serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        model.groups[groupName].serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    model.groups[groupName].fields.forEach(field => { field.removeAttribute('aria-invalid'); });
    delete errorNodes[groupName];
};

export const clearErrors = model => {
    Object.keys(errorNodes).forEach(name => {
        clearError(name)(model);
    });
};

export const renderErrors = model => {
    Object.keys(model.groups).forEach(groupName => {
        if(!model.groups[groupName].valid) renderError(groupName)(model);
    })
};

export const renderError = groupName => model => {
    if(errorNodes[groupName]) clearError(groupName)(model);
    
    errorNodes[groupName] = 
    model.groups[groupName].serverErrorNode 
            ? createErrorTextNode(model.groups[groupName], model.groups[groupName].errorMessages[0]) 
            : model.groups[groupName]
						.fields[model.groups[groupName].fields.length-1]
						.parentNode
						.appendChild(h('div', { class: DOTNET_CLASSNAMES.ERROR }, model.groups[groupName].errorMessages[0]));
						
	model.groups[groupName].fields.forEach(field => { field.setAttribute('aria-invalid', 'true'); });
};