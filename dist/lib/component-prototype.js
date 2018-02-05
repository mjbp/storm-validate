// import inputPrototype from './input-prototype';
import { chooseRealTimeEvent } from './utils';
import {
	validate,
	extractErrorMessage,
	assembleValidationGroup,
	normaliseValidators,
	removeUnvalidatableGroups
} from './utils/validators';
import { h, createErrorTextNode } from './utils/dom';

export default {
	init() {
		this.form.setAttribute('novalidate', 'novalidate');
		this.groups = removeUnvalidatableGroups([].slice.call(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}));
		this.initListeners();

		console.log(this.groups);
		return this;
	},
	initListeners(){
		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.clearErrors();
			this.setValidityState()
				.then(res => {
					if(![].concat(...res).includes(false)) this.form.submit();
					else this.renderErrors(), this.initRealTimeValidation();
				});
		});

		this.form.addEventListener('reset', e => { this.clearErrors(); });
	},
	initRealTimeValidation(){
		let handler = function(group) {
				this.setGroupValidityState(group)
					.then(res => {
						if(this.groups[group].errorDOM) this.removeError(group);
						if(res.includes(false)) this.renderError(group);
					});
			}.bind(this);
		
		for(let group in this.groups){
			this.groups[group].fields.forEach(input => {
				input.addEventListener(chooseRealTimeEvent(input), handler.bind(this, group));
			});

			//pls, refactor me ;_;
			let equalToValidator = this.groups[group].validators.filter(validator => validator.type === 'equalto');
			
			equalToValidator.length > 0 
				&& equalToValidator[0].params.other.forEach(subgroup => {
					subgroup.forEach(item => { item.addEventListener('blur', handler.bind(this, group))});
				});
		}
	},
	setGroupValidityState(group){
		//reset validity and errorMessages
		this.groups[group] = Object.assign({}, this.groups[group],{ valid: true, errorMessages: [] });
		return Promise.all(this.groups[group].validators.map(validator => {
			return new Promise(resolve => {
				//to do?
				//only perform the remote validation if all else passes
				
				//refactor, extract this whole fn...
				if(validator.type !== 'remote'){
					if(validate(this.groups[group], validator)) resolve(true);
					else {
						//mutation and side effect...
						this.groups[group].valid = false;
						this.groups[group].errorMessages.push(extractErrorMessage(validator, group));
						resolve(false);
					}
				}
				else validate(this.groups[group], validator)
						.then(res => {
							if(res && res === true) resolve(true);								
							else {
								//mutation, side effect, and un-DRY...
								this.groups[group].valid = false;
								this.groups[group].errorMessages.push(typeof res === 'boolean' 
																		? extractErrorMessage(validator, group)
																		: `Server error: ${res}`);
								resolve(false);
							}
						});
			});
		}));
	},
	setValidityState(){
		let groupValidators = [];
		for(let group in this.groups) groupValidators.push(this.setGroupValidityState(group));
		return Promise.all(groupValidators);
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
		if(this.groups[group].errorDOM) this.removeError(group);
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
	addMethod(type, groupName, method, message){
		if(type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
		this.groups[groupName].validators.push({type, method, message});
		//extend messages
	}
};

/*
API
{
	validate(){},
	addMethod(){}
}
*/