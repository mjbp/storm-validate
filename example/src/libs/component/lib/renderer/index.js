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

export default { clearErrors }