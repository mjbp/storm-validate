// import inputPrototype from './input-prototype';
import methods from './methods';
import messages from './messages';
import { normaliseValidators } from './utils';

export default {
	init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novaildate');

		this.inputs = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'));
		this.groups = this.inputs.reduce((acc, input) => {
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
			
			

		});

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

		console.log(this);

		//validate whole form
		//set aria-invalid on invalid inputs

		return this;
	},
	addMethod(name, fn, message){
		this.groups.validators.push(fn)
	}
};