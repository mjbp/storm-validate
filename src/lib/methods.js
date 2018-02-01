import { isSelect, isCheckable, isRequired, getName, extractValueFromGroup, resolveGetParams } from './utils';
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
    equalto: curryParamMethod('equalto', params => (acc, input) => {
        return acc = params[0].reduce((subgroupAcc, subgroup) => {
            if(extractValueFromGroup(subgroup) !== input.value) subgroupAcc = false;
            return subgroupAcc;
        }, true), acc;
    }),
    pattern: curryParamMethod('pattern', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    regex: curryParamMethod('regex', (...regexStr) => (acc, input) => (acc = RegExp(regexStr).test(input.value), acc)),
    min: curryParamMethod('min', (...min) => (acc, input) => (acc = +input.value >= +min, acc)),
    max: curryParamMethod('max', (...max) => (acc, input) => (acc = +input.value <= +max, acc)),
    length: curryParamMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1])), acc)),
    range: curryParamMethod('range', params => (acc, input) => (acc = (+input.value >= +params[0] && +input.value <= +params[1]), acc)),
    remote: (group, params) => {
        let [ url, additionalfields, type = 'get'] = params;

        return new Promise((resolve, reject) => {
            //to do?
            //change this to XHR
            fetch((type !== 'get' ? url : `${url}?${resolveGetParams(additionalfields)}`), {
                method: type.toUpperCase(),
                body: type === 'get' ? null : resolveGetParams(additionalfields),
                headers: new Headers({
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                })
            })
            .then(res => res.json())
            .then(data => { resolve(data); })
            .catch(res => { 
                resolve(res);
            });//what to do if endpoint validation fails? returning error message as validation error
        });
    }
};