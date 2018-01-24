export default {
	init(){
		// this.label = this.node.querySelector('.' + this.settings.labelClassName);
		// this.input = this.node.querySelector('.' + this.settings.fieldClassName);

		this.boundSetState = this.setState.bind(this);
		this.boundChangeHandler = this.changeHandler.bind(this);

		this.input.addEventListener('change', this.boundChangeHandler);
		this.input.addEventListener('focus', this.focusHandler.bind(this));
		this.input.addEventListener('blur', this.blurHandler.bind(this));
		this.input.addEventListener('invalid', this.invalidHandler.bind(this));
		
		this.setState();
		this.isSwapped = false;

		return this;
	},
	swapHandlers(){
	   this.input.removeEventListener('change', this.boundChangeHandler);
	   this.input.addEventListener('input', this.boundSetState);
	   this.isSwapped = true;
	},
	invalidHandler() {
		this.isDirty = true;
		!this.isSwapped && this.swapHandlers();
		this.validate();
	},
	changeHandler() {
		this.setState();
		this.swapHandlers();
	},
	setState(){
		this.checkDirty();
		this.validate();
	},
	checkDirty(){
		if(this.input.value && this.input.value.length > 0) {
			this.isDirty = true;
			// this.node.classList.add(this.settings.dirtyClassName);
		}
		else {
			// this.node.classList.remove(this.settings.dirtyClassName);
			this.isDirty = false;
		}
	},
	// addError(){
	// 	this.errorMsg = document.createElement('div');
	// 	this.errorMsg.classList.add(this.settings.errorMsgClassName);
	// 	this.errorMsg.innerText = this.input.validationMessage || this.input.setCustomValidity;
	// 	this.node.appendChild(this.errorMsg);
	// },
	// removeError(){
	// 	if (this.errorMsg) {
	// 		this.errorMsg.parentNode.removeChild(this.errorMsg);
	// 		this.errorMsg = false;
	// 	}
	// },
	validate(){
		// this.input.setCustomValidity = this.settings.customConstraint && !this.settings.customConstraint.check(this.input) ? this.settings.customConstraint.customValidity : '';

		// this.removeError();
		// if (this.input.validity && this.isDirty) {
		// 	if (this.input.validity.valid && this.input.setCustomValidity === '') this.node.classList.remove(this.settings.invalidClassName);
		// 	else {
		// 		this.node.classList.add(this.settings.invalidClassName);
		// 		this.addError();
		// 	}
		// }
	}
}