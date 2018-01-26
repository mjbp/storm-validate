// import inputPrototype from './input-prototype';
import { chooseRealTimeEvent } from './utils';
import { 
	validationReducer,
	assembleValidationGroup,
	normaliseValidators,
	removeUnvalidatableGroups
} from './utils/validators';
import { h, createErrorTextNode } from './utils/dom';

export default {
	init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');
		
		this.groups = removeUnvalidatableGroups(Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}));

		this.initListeners();
		

		console.log(this.groups);

		/*

		1. ref. <input data-rule-minlength="2" data-rule-maxlength="4" data-msg-minlength="At least two chars" data-msg-maxlength="At most fours chars">


		2. ref. https://jqueryvalidation.org/files/demo/
		
		3. ref. Constraint validation API
		Validation-repated attributes
			- pattern, regex, 'The value must match the pattern'
			- min, number, 'The value must be greater than or equal to the value.'
			- max, number, 'The value must be less than or equal to the value',
			- required, none, 'There must be a value',
			- maxlength, int length, 'The number of characters (code points) must not exceed the value of the attribute.' 

		4. ref. https://github.com/aspnet/jquery-validation-unobtrusive/blob/master/src/jquery.validate.unobtrusive.js

		*/

		//validate whole form

		return this;
	},
	initListeners(){
		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.clearErrors();
			if(this.setValidityState()) this.form.submit();
			else this.renderErrors(), this.initRealTimeValidation();
		});

		this.form.addEventListener('reset', e => { this.clearErrors(); });
	},
	initRealTimeValidation(){
		let handler = function(e) {
				let group = e.target.getAttribute('name');
				if(this.groups[group].errorDOM) this.removeError(group);
				if(!this.setGroupValidityState(group)) this.renderError(group);
			}.bind(this);

		for(let group in this.groups){
			this.groups[group].fields.forEach(input => {
				input.addEventListener(chooseRealTimeEvent(input), handler);
			});
		}
	},
	setGroupValidityState(group){
		this.groups[group] = Object.assign({}, 
								this.groups[group],
								{ valid: true, errorMessages: [] }, //reset validity and errorMessagesa
								this.groups[group].validators.reduce(validationReducer(this.groups[group]), true));
		return this.groups[group].valid;
	},
	setValidityState(){
		let numErrors = 0;
		for(let group in this.groups){
			this.setGroupValidityState(group);
			!this.groups[group].valid && ++numErrors;
		}
		return numErrors === 0;
	},
	clearErrors(){
		for(let group in this.groups){
			if(this.groups[group].errorDOM) this.removeError(group);
		}
	},
	removeError(group){
		this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
		this.groups[group].serverErrorNode && this.groups[group].serverErrorNode.classList.remove('error');
		this.groups[group].fields.forEach(field => { field.removeAttribute('aria-invalid'); });//or should i set this to false if field passes validation?
		delete this.groups[group].errorDOM;
	},
	renderErrors(){
		//support for inline and error list?
		for(let group in this.groups){
			if(!this.groups[group].valid) this.renderError(group);
		}
	},
	renderError(group){
		this.groups[group].errorDOM = 
			this.groups[group].serverErrorNode ? 
				createErrorTextNode(this.groups[group]) : 
					this.groups[group]
						.fields[this.groups[group].fields.length-1]
						.parentNode
						.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));
		
		//set aria-invalid on invalid inputs
		this.groups[group].fields.forEach(field => { field.setAttribute('aria-invalid', 'true'); });
	},
	addMethod(name, fn, message){
		this.groups.validators.push(fn);
		//extend messages
	}
};