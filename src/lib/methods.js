import { isSelect, isCheckable, isRequired, extractValueFromGroup } from './utils';
import { EMAIL_REGEX, URL_REGEX, DATE_ISO_REGEX, NUMBER_REGEX, DIGITS_REGEX } from './constants';

//isn't required and no value
const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === false;

const regexMethod = regex => group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = regex.test(input.value), acc), false);

const paramMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(group.validators.filter(validator => validator.type === type)[0].params), false);

export default {
    required: group => extractValueFromGroup(group) !== false,
    email: regexMethod(EMAIL_REGEX),
    url: regexMethod(URL_REGEX),
    date: group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc), false),
    dateISO: regexMethod(DATE_ISO_REGEX),
    number: regexMethod(NUMBER_REGEX),
    digits: regexMethod(DIGITS_REGEX),
    minlength: paramMethod(
        'minlength', 
        param => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length >= +param : +input.value.length >= +param, acc)
    ),
    maxlength: paramMethod(
        'maxlength', 
        param => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length <= +param : +input.value.length <= +param, acc)
    ),
    min: paramMethod('min', params => (acc, input) => (acc = +input.value >= +param, acc)),
    max: paramMethod('max', params => (acc, input) => (acc = +input.value <= +param, acc)),
    length: paramMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1])), acc)),
    range: paramMethod('range', params => (acc, input) => (acc = (+input.value >= +params[0] && +input.value <= +params[1]), acc)),
    
    // rangelength
    // https://jqueryvalidation.org/rangelength-method/
    // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1420


    // range
    // https://jqueryvalidation.org/range-method/
    // 
    // step
    // https://jqueryvalidation.org/step-method/
    // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1441

    // equalTo
    // https://jqueryvalidation.org/equalTo-method/
    // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1479

    // remote
    // https://jqueryvalidation.org/remote-method/
    // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1492

    /* 
    Extensions
        - password
        - nonalphamin /\W/g
        - regex/pattern
        - bool
        - fileextensions
    */
};