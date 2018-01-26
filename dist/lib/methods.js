import { isSelect, isCheckable, isRequired, extractValueFromGroup } from './utils';
import { EMAIL_REGEX, URL_REGEX, DATE_ISO_REGEX, NUMBER_REGEX, DIGITS_REGEX } from './constants';

const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === false;

const extractValidationParams = (group, type) => group.validators.filter(validator => validator.type === type)[0].params;

const curryRegexMethod = regex => group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = regex.test(input.value), acc), false);

const curryParamMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), false);

export default {
    required: group => extractValueFromGroup(group) !== false,
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
    pattern: curryParamMethod('pattern', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    regex: curryParamMethod('regex', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    min: curryParamMethod('min', (...min) => (acc, input) => (acc = +input.value >= +min, acc)),
    max: curryParamMethod('max', (...max) => (acc, input) => (acc = +input.value <= +max, acc)),
    length: curryParamMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1])), acc)),
    range: curryParamMethod('range', params => (acc, input) => (acc = (+input.value >= +params[0] && +input.value <= +params[1]), acc)),
    remote: (group, params) => {
        let [ url, type] = params;
        fetch(url, {
            method: type.toUpperCase(),
            // body: JSON.stringify(data), 
            headers: new Headers({
              'Content-Type': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return true;
        })

        //async so are we returning pending state...
        // return true;
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

    // remote
    // https://jqueryvalidation.org/remote-method/
    // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1492
    // data-val-remote="&amp;#39;UserName&amp;#39; is invalid." data-val-remote-additionalfields="*.UserName" data-val-remote-url="/Validation/IsUID_Available"

    // regex
    // data-val-regex="White space is not allowed." 
    // data-val-regex-pattern="(\S)+" 



    /* 
    Extensions
        - password
        - nonalphamin /\W/g
        - regex/pattern
        - bool
        - fileextensions
    */
};