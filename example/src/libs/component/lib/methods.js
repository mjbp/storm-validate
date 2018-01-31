import { isSelect, isCheckable, isRequired, getName, extractValueFromGroup, composeRequestBody, composeGetURL } from './utils';
import { EMAIL_REGEX, URL_REGEX, DATE_ISO_REGEX, NUMBER_REGEX, DIGITS_REGEX } from './constants';

const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === '';

const extractValidationParams = (group, type) => group.validators.filter(validator => validator.type === type)[0].params;

const curryRegexMethod = regex => group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = regex.test(input.value), acc), false);

const curryParamMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), false);

export default {
    required: group => extractValueFromGroup(group) !== '',
    email: curryRegexMethod(EMAIL_REGEX),
    url: curryRegexMethod(URL_REGEX),
    date: group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc), false),
    dateISO: curryRegexMethod(DATE_ISO_REGEX),
    number: curryRegexMethod(NUMBER_REGEX),
    digits: curryRegexMethod(DIGITS_REGEX),
    minlength: curryParamMethod(
        'minlength', 
        param => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length >= +param : +input.value.length >= +param, acc)
    ),
    maxlength: curryParamMethod(
        'maxlength', 
        param => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length <= +param : +input.value.length <= +param, acc)
    ),
    equalto: curryParamMethod('equalto', params => (acc, input) => (acc = input.value === document.querySelector(`[name=${params[0].substr(2)}]`).value, acc)),
    pattern: curryParamMethod('pattern', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    regex: curryParamMethod('regex', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    min: curryParamMethod('min', (...min) => (acc, input) => (acc = +input.value >= +min, acc)),
    max: curryParamMethod('max', (...max) => (acc, input) => (acc = +input.value <= +max, acc)),
    length: curryParamMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1])), acc)),
    range: curryParamMethod('range', params => (acc, input) => (acc = (+input.value >= +params[0] && +input.value <= +params[1]), acc)),
    remote: (group, params) => {
        let [ url, additionalfields, type = 'get'] = params;
        return new Promise((resolve, reject) => {
            fetch((type !== 'get' ? url : composeGetURL(`${url}?`, group, additionalfields)), {
                method: type.toUpperCase(),
                // body: type === 'get' ? null : JSON.stringify(composeRequestBody(group, additionalfields)), 
                body: type === 'get' ? null : composeGetURL('', group, additionalfields),
                headers: new Headers({
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                })
            })
            .then(res => res.json())
            .then(data => { resolve(data); })
            .catch(res => { resolve(true); });//what to do if endpoint validation fails?
        });
    }
    
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


    /* 
    Extensions
        - password
        - nonalphamin /\W/g
        - regex/pattern
        - bool
        - fileextensions
    */
};