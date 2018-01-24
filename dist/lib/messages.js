export default {
    required() { return 'This field is required.'; } ,
    remote() { return 'Please fix this field.'; },
    email() { return 'Please enter a valid email address.'; },
    url(){ return 'Please enter a valid URL.'; },
    date() { return 'Please enter a valid date.'; },
    dateISO() { return 'Please enter a valid date (ISO).'; },
    number() { return 'Please enter a valid number.'; },
    digits() { return 'Please enter only digits.'; },
    equalTo() { return 'Please enter the same value again.'; },
    maxlength(props) { return `Please enter no more than ${props} characters.`; },
    minlength(props) { return `Please enter at least ${props} characters.`; },
    rangelength(props) { return `Please enter a value between ${props.min} and ${props.max} characters long.`; },
    range(props){ return `Please enter a value between ${props.min} and ${props.max}.`; },
    max(props){ return `Please enter a value less than or equal to ${[props]}.`; },
    min(props){ return `Please enter a value greater than or equal to ${props}.`},
    step(props){ return `Please enter a multiple of ${props}.`; }
};