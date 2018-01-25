// const checkForDataRuleConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

// const checkForDataValConstraint = (input, constraint) => input.getAttribute(`data-val-${constraint}`) && input.getAttribute(`data-val-${constraint}`) !== 'false';

// const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);

const extractDataValValidators = input => {


};

export const normaliseValidators = input => {
    let validators = [];

    if(input.getAttribute('data-val') === 'true') validators.push(extractDataValValidators(input));

    

    // To do
    // validate the validation parameters

    /*
        - check if data-val="true"

            validator:
            {
                type: String [required],
                params: Array [optional],
                message: String [optional]
            }

    */
    /*
    //required
    if((input.hasAttribute('required') && input.getAttribute('required') !== 'false') || checkForDataRuleConstraint(input, 'required') || checkForDataValConstraint(input, 'required')) validators.push({type: 'required'});

    //email
    if(checkForConstraint(input, 'email') || checkForDataValConstraint(input, 'email')) validators.push({type: 'email'});

    //url
    if(checkForConstraint(input, 'url') || checkForDataValConstraint(input, 'url')) validators.push({type: 'url'});

    //date
    if(checkForConstraint(input, 'date') || checkForDataValConstraint(input, 'date')) validators.push({type: 'date'});

    //dateISO
    if(checkForConstraint(input, 'dateISO') || checkForDataValConstraint(input, 'dateISO')) validators.push({type: 'dateISO'});

    //number
    if(checkForConstraint(input, 'number') || checkForDataValConstraint(input, 'number')) validators.push({type: 'number'});

    //minlength
    if((input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') || checkForDataRuleConstraint(input, 'minlength') || checkForDataValConstraint(input, 'minlength')) validators.push({type: 'minlength', param: extractValidationParams('minlength')});

    //maxlength
    if((input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') || checkForDataRuleConstraint(input, 'maxlength') || checkForDataValConstraint(input, 'maxlength')) validators.push({type: 'maxlength', param: input.getAttribute('maxlength')});

    //min
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false') || checkForDataRuleConstraint(input, 'min') || checkForDataValConstraint(input, 'min')) validators.push({type: 'min', param: input.getAttribute('min')});

    //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataRuleConstraint(input, 'max') || checkForDataValConstraint(input, 'max')) validators.push({type: 'max', param: input.getAttribute('max')});

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