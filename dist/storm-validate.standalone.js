/**
 * @name storm-validate: 
 * @version 0.1.0: Wed, 24 Jan 2018 18:01:45 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	// callback: null
};

var checkForDataConstraint = function checkForDataConstraint(input, constraint) {
	return input.getAttribute('data-rule-' + constraint) && input.getAttribute('data-rule-' + constraint) !== 'false';
};

var checkForConstraint = function checkForConstraint(input, constraint) {
	return input.getAttribute('type') === constraint || checkForDataConstraint(input, constraint);
};

var normaliseValidators = function normaliseValidators(input) {
	var validators = [];

	console.log(input.getAttribute('required') && input.getAttribute('required') !== 'false');
	/* 
     Extract from 
     - data-attributes
     - element attributes
     - classNames (x)
     - staticRules (x)
 */

	//required
	if (input.hasAttribute('required') && input.getAttribute('required') !== 'false' || checkForDataConstraint(input, 'required')) validators.push('required');

	// //email
	if (checkForConstraint(input, 'email')) validators.push('email');

	// //url
	if (checkForConstraint(input, 'url')) validators.push('url');

	// //date
	if (checkForConstraint(input, 'date')) validators.push('date');

	// //dateISO
	if (checkForConstraint(input, 'dateISO')) validators.push('dateISO');

	// //number
	if (checkForConstraint(input, 'number')) validators.push('number');

	// //digits
	// //to do

	// //minlength
	if (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false' || checkForDataConstraint(input, 'minlength')) validators.push('minlength');

	// //maxlength
	if (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false' || checkForDataConstraint(input, 'maxlength')) validators.push('maxlength');

	// //rangelength

	// //min
	if (input.getAttribute('min') && input.getAttribute('min') !== 'false' || checkForDataConstraint(input, 'min')) validators.push('min');

	// //max
	if (input.getAttribute('max') && input.getAttribute('max') !== 'false' || checkForDataConstraint(input, 'max')) validators.push('max');

	// //step
	// //to do

	// //equalTo
	// //to do

	// //remote
	// //to do

	return validators;
};

// import inputPrototype from './input-prototype';
var componentPrototype = {
	init: function init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novaildate');

		this.inputs = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'));
		this.groups = this.inputs.reduce(function (acc, input) {
			if (!acc[input.getAttribute('name')]) {
				acc[input.getAttribute('name')] = {
					valid: false,
					validators: normaliseValidators(input),
					fields: [input]
				};
			} else acc[input.getAttribute('name')].fields.push(input);
			return acc;
		}, []);

		// this.inputs.forEach(input => {
		// 	input.addEventListener('change', this.boundChangeHandler);
		// 	input.addEventListener('focus', this.focusHandler.bind(this));
		// 	input.addEventListener('blur', this.blurHandler.bind(this));
		// 	input.addEventListener('invalid', this.invalidHandler.bind(this));
		// });

		this.form.addEventListener('submit', function (e) {
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
	addMethod: function addMethod(name, fn, message) {
		this.groups.validators.push(fn);
	}
};

var init = function init(sel, opts) {
	// let els = [].slice.call(document.querySelectorAll(sel));
	var els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Validation not initialised, no augmentable elements found for selector ' + sel);

	return els.reduce(function (acc, el) {
		if (el.getAttribute('novalidate')) return;
		acc.push(Object.assign(Object.create(componentPrototype), {
			form: el,
			inputs: Array.from(el.querySelectorAll('input:not([type=submit]), textarea, select')),
			settings: Object.assign({}, defaults, opts)
		}).init());
		return acc;
	}, []);
};

var index = { init: init };

exports.default = index;;
}));
