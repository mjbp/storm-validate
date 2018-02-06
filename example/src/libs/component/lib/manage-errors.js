export const clear = groups => {
    for(let group in groups){
        if(groups[group].errorDOM) remove(group);
    }
    return groups;
};

export const remove = props => {

};

export const render = props => {
    //support for inline and error list?
		for(let group in props){
			if(!props[group].valid) renderError(group);
		}
};

const removeError = group => {
    group.errorDOM.parentNode.removeChild(group.errorDOM);
    group.serverErrorNode && group.serverErrorNode.classList.remove('error');
    group.fields.forEach(field => { field.removeAttribute('aria-invalid'); });//or should i set this to false if field passes validation?
    delete group.errorDOM;
}

const renderError = group => {
    if(group.errorDOM) removeError(group);

    //mutation
    group.errorDOM = 
        group.serverErrorNode ? 
            createErrorTextNode(group) : 
                group
                    .fields[group.fields.length-1]
                    .parentNode
                    .appendChild(h('div', { class: 'error' }, group.errorMessages[0]));
    
    //set aria-invalid on invalid inputs
    group.fields.forEach(field => { field.setAttribute('aria-invalid', 'true'); });
};