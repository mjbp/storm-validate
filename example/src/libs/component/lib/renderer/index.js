const clearErrors = state => {
    for(let group in state.groups){
        if(state.groups[group].errorDOM) removeError(group);
    }
};

const removeError = group => {
    group.errorDOM.parentNode.removeChild(group.errorDOM);
    if(group.serverErrorNode) {
        group.serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        group.serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    group.fields.forEach(field => { field.removeAttribute('aria-invalid'); });//or should i set this to false if field passes validation?
    delete group.errorDOM;//??
};



/*
    renderErrors(){
		//support for inline and error list?
		for(let group in this.groups){
			if(!this.groups[group].valid) this.renderError(group);
		}
	},
	renderError(group){
		if(this.groups[group].errorDOM) this.removeError(group);
		this.groups[group].errorDOM = 
			this.groups[group].serverErrorNode ? 
				createErrorTextNode(this.groups[group]) : 
					this.groups[group]
						.fields[this.groups[group].fields.length-1]
						.parentNode
						.appendChild(h('div', { class: 'field-validation-valid' }, this.groups[group].errorMessages[0]));
						
		//set aria-invalid on invalid inputs
		this.groups[group].fields.forEach(field => { field.setAttribute('aria-invalid', 'true'); });
	},
*/
export default { clearErrors }