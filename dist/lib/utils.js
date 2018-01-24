export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const h = (nodeName, attributes, text) => {
    let node = document.createElement(nodeName);

    for(let prop in attributes) node.setAttribute(prop, attributes[prop]);
    if(text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

const checkForDataConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataConstraint(input, constraint);

export const normaliseValidators = input => {
    let validators = [];
    /* 
        Extract from 
        - data-attributes
        - element attributes
        - classNames (x)
        - staticRules (x)
    */
    
    //required
    if((input.hasAttribute('required') && input.getAttribute('required') !== 'false') || checkForDataConstraint(input, 'required')) validators.push('required');

    // //email
    if(checkForConstraint(input, 'email')) validators.push('email');

    // //url
    if(checkForConstraint(input, 'url')) validators.push('url');

    // //date
    if(checkForConstraint(input, 'date')) validators.push('date');

    // //dateISO
    if(checkForConstraint(input, 'dateISO')) validators.push('dateISO');

    // //number
    if(checkForConstraint(input, 'number')) validators.push('number');

    // //digits
    // //to do

    // //minlength
    if((input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') || checkForDataConstraint(input, 'minlength')) validators.push('minlength');

    // //maxlength
    if((input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') || checkForDataConstraint(input, 'maxlength')) validators.push('maxlength');

    // //rangelength

    // //min
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false') || checkForDataConstraint(input, 'min')) validators.push('min');

    // //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataConstraint(input, 'max')) validators.push('max');


    // //step
    // //to do

    // //equalTo
    // //to do

    // //remote
    // //to do

    return validators;
};