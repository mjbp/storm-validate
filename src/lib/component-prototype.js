// import inputPrototype from './input-prototype';
import methods from './methods';
import messages from './messages';
import { h, normaliseValidators } from './utils';

export default {
	init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');

		this.groups = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'))
						.reduce((acc, input) => {
							if(!acc[input.getAttribute('name')]) {
								acc[input.getAttribute('name')] = {
									valid:  false,
									validators: normaliseValidators(input),
									fields: [input]
								};
							}
							else acc[input.getAttribute('name')].fields.push(input);
							return acc;
						}, []);

		

		// this.inputs.forEach(input => {
		// 	input.addEventListener('change', this.boundChangeHandler);
		// 	input.addEventListener('focus', this.focusHandler.bind(this));
		// 	input.addEventListener('blur', this.blurHandler.bind(this));
		// 	input.addEventListener('invalid', this.invalidHandler.bind(this));
		// });

		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.clearErrors();
			this.setValidityState();
		});

		this.form.addEventListener('reset', e => { this.clearErrors(); });

		/*

		ref. <input data-rule-minlength="2" data-rule-maxlength="4" data-msg-minlength="At least two chars" data-msg-maxlength="At most fours chars">


		ref. https://jqueryvalidation.org/files/demo/
		
		ref. Constraint validation API
		Validation-repated attributes
			- pattern, regex, 'The value must match the pattern'
			- min, number, 'The value must be greater than or equal to the value.'
			- max, number, 'The value must be less than or equal to the value',
			- required, none, 'There must be a value',
			- maxlength, int length, 'The number of characters (code points) must not exceed the value of the attribute.' 

		*/

		//validate whole form
		//set aria-invalid on invalid inputs

		return this;
	},
	setValidityState(){
		let numErrors = 0;
		for(let group in this.groups){
			// this.groups[group].errorMessages = [];
			this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] },  this.groups[group].validators.reduce((acc, validator) => {
				if(!methods[validator](this.groups[group])) {
					acc = {
						valid: false,
						errorMessages: acc.errorMessages ? [...acc.errorMessages, messages[validator]()] : [messages[validator]()]
					};
				}
				return acc;
			}, true));
			!this.groups[group].valid && ++numErrors;
		}
		numErrors > 0 && this.renderErrors();
	},
	clearErrors(){
		for(let group in this.groups){
			if(this.groups[group].errorDOM) {
				this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
				delete this.groups[group].errorDOM;
			}
		}
	},
	renderErrors(){
		//support for inline and error list?
		for(let group in this.groups){
			if(!this.groups[group].valid) {
				this.groups[group].errorDOM = this.groups[group]
												.fields[this.groups[group].fields.length-1]
												.parentNode
												.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));
			}
		}
	},
	addMethod(name, fn, message){
		this.groups.validators.push(fn)
	}
};