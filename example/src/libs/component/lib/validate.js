import {
    validate,
    extractErrorMessage
} from './utils/validators';


export const validateForm = groups => {
    let groupValidators = [];
    for(let group in groups) groupValidators.push(setGroupValidityState(group));
    return Promise.all(groupValidators);
};

const setGroupValidityState = group => {
    //group is groupName here...
    
    
   return Object.assign({}, group, { valid: true, errorMessages: [] });
		return Promise.all(group.validators.map(validator => {
			return new Promise(resolve => {
				//to do?
				//only perform the remote validation if all else passes
				
				//refactor, extract this whole fn...
				if(validator.type !== 'remote'){
					if(validate(group, validator)) resolve(true);
					else {
						//mutation and side effect...
						group.valid = false;
						group.errorMessages.push(extractErrorMessage(validator, group));
						resolve(false);
					}
				}
				else validate(group, validator)
						.then(res => {
							if(res && res === true) resolve(true);								
							else {
								//mutation, side effect, and un-DRY...
								group.valid = false;
								group.errorMessages.push(typeof res === 'boolean' 
																		? extractErrorMessage(validator, group)
																		: `Server error: ${res}`);
								resolve(false);
							}
						});
			});
		}));
}