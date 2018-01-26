import methods from '../methods';
import messages from '../messages';
import { DOTNETCORE_ADAPTORS, DOTNETCORE_PARAMS } from '../constants';
// const checkForDataRuleConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

// const checkForDataValConstraint = (input, constraint) => input.getAttribute(`data-val-${constraint}`) && input.getAttribute(`data-val-${constraint}`) !== 'false';

// const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);

const extractDataValValidators = input => DOTNETCORE_ADAPTORS
                                            .reduce((validators, adaptor) => {
                                                if(!input.getAttribute(`data-val-${adaptor}`)) return validators;
                                                validators.push(Object.assign(
                                                    {type: adaptor, message: input.getAttribute(`data-val-${adaptor}`)},
                                                    DOTNETCORE_PARAMS[adaptor]
                                                        && { 
                                                            params: DOTNETCORE_PARAMS[adaptor]
                                                                        .reduce((acc, param) => {
                                                                            input.hasAttribute(`data-val-${param}`) 
                                                                            && acc.push(input.getAttribute(`data-val-${param}`))
                                                                            return acc;
                                                                        }, []) 
                                                        }
                                                ));
                                                return validators;
                                            }, []);

//for data-rule-* support
//const hasDataAttributePart = (node, part) => Array.from(node.dataset).filter(attribute => !!~attribute.indexOf(part)).length > 0;

const extractAttributeValidators = input => {
    let validators = [];
    if(input.hasAttribute('required') && input.getAttribute('required') !== 'false') validators.push({type: 'required'});
    if(input.getAttribute('type') === 'email') validators.push({type: 'email'});
    if(input.getAttribute('type') === 'url') validators.push({type: 'url'});
    if(input.getAttribute('type') === 'number') validators.push({type: 'number'});
    if(input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') validators.push({type: 'minlength', params: [input.getAttribute('minlength')]});
    if(input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') validators.push({type: 'maxlength', params: [input.getAttribute('maxlength')]});
    return validators;
};
/*
@params DOM node input
@returns Object
{
    type: String [required],
    params: Array [optional],
    message: String [optional]
}
*/
export const normaliseValidators = input => {
    let validators = [];
    
    //how to merge the same validator from multiple sources, e.g. DOM attribute versus data-val?
    //assume data-val is cannonical?
    if(input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));
    else validators = validators.concat(extractAttributeValidators(input));
    // To do
    // validate the validation parameters

    /*
    //date

    //dateISO

    //maxlength
    if((input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') || checkForDataRuleConstraint(input, 'maxlength') || checkForDataValConstraint(input, 'maxlength')) validators.push({type: 'maxlength', param: input.getAttribute('maxlength')});

    //min
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false') || checkForDataRuleConstraint(input, 'min') || checkForDataValConstraint(input, 'min')) validators.push({type: 'min', param: input.getAttribute('min')});

    //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataRuleConstraint(input, 'max') || checkForDataValConstraint(input, 'max')) validators.push({type: 'max', param: input.getAttribute('max')});

    //step

    //equalTo

    //remote

    //digits

    //rangelength
    */

    return validators;
};

export const validationReducer = group => (acc, validator) => {
    if(methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
    return {
        valid: false,
        errorMessages: acc.errorMessages ? [...acc.errorMessages, extractErrorMessage(validator, group)] : [extractErrorMessage(validator, group)]
    };;
};

export const assembleValidationGroup = (acc, input) => {
    if(!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid:  false,
            validators: normaliseValidators(input),
            fields: [input]
        };
    }
    else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

export const extractErrorMessage = (validator, group) => validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);

export const removeUnvalidatableGroups = groups => {
    let validationGroups = {};

    for(let group in groups) 
        if(groups[group].validators.length > 0)
            validationGroups[group] = groups[group];

    return validationGroups;
};