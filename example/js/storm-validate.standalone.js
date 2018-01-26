/**
 * @name storm-validate: 
 * @version 0.1.0: Fri, 26 Jan 2018 13:32:56 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaults = {
    errorsInline: true,
    errorSummary: false
    // callback: null
};

var isSelect = function isSelect(field) {
    return field.nodeName.toLowerCase() === 'select';
};

var isCheckable = function isCheckable(field) {
    return (/radio|checkbox/i.test(field.type)
    );
};

var isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
};

var hasValue = function hasValue(input) {
    return input.value !== undefined && input.value !== null && input.value.length > 0;
};

var extractValueFromGroup = function extractValueFromGroup(group) {
    return group.fields.reduce(function (acc, input) {
        if (isCheckable(input)) {
            if (input.checked) {
                if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
            }
        } else if (hasValue(input)) acc = input.value;
        return acc;
    }, false);
};

var chooseRealTimeEvent = function chooseRealTimeEvent(input) {
    return ['input', 'change'][Number(isCheckable(input) || isSelect(input))];
};

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)


// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//https://mathiasbynens.be/demo/url-regex
var URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var DATE_ISO_REGEX = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

var NUMBER_REGEX = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

var DIGITS_REGEX = /^\d+$/;

var DOTNETCORE_PARAMS = {
    length: ['min', 'max'],
    range: ['min', 'max'],
    min: ['min'],
    max: ['max'],
    minlength: ['min'],
    maxlength: ['max'],
    remote: ['url', 'type', 'additionalfields'] //??
};

var DOTNETCORE_ADAPTORS = [
//'regex', -> same as pattern, how is it applied to an element? pattern attribute? data-val-regex?
'required', 'date', 'digits', 'email', 'number', 'url', 'length', 'range', 'equalto', 'remote', 'password' //-> maps to min, nonalphamain, and regex methods
];

//isn't required and no value
var isOptional = function isOptional(group) {
    return !isRequired(group) && extractValueFromGroup(group) === false;
};

var regexMethod = function regexMethod(regex) {
    return function (group) {
        return isOptional(group) || group.fields.reduce(function (acc, input) {
            return acc = regex.test(input.value), acc;
        }, false);
    };
};

var paramMethod = function paramMethod(type, reducer) {
    return function (group) {
        return isOptional(group) || group.fields.reduce(reducer(group.validators.filter(function (validator) {
            return validator.type === type;
        })[0].params), false);
    };
};

var methods = {
    required: function required(group) {
        return extractValueFromGroup(group) !== false;
    },
    email: regexMethod(EMAIL_REGEX),
    url: regexMethod(URL_REGEX),
    date: function date(group) {
        return isOptional(group) || group.fields.reduce(function (acc, input) {
            return acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc;
        }, false);
    },
    dateISO: regexMethod(DATE_ISO_REGEX),
    number: regexMethod(NUMBER_REGEX),
    digits: regexMethod(DIGITS_REGEX),
    minlength: paramMethod('minlength', function (param) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length >= +param : +input.value.length >= +param, acc;
        };
    }),
    maxlength: paramMethod('maxlength', function (param) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length <= +param : +input.value.length <= +param, acc;
        };
    }),
    min: paramMethod('min', function (params) {
        return function (acc, input) {
            return acc = +input.value >= +param, acc;
        };
    }),
    max: paramMethod('max', function (params) {
        return function (acc, input) {
            return acc = +input.value <= +param, acc;
        };
    }),
    length: paramMethod('length', function (params) {
        return function (acc, input) {
            return acc = +input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1]), acc;
        };
    }),
    range: paramMethod('range', function (params) {
        return function (acc, input) {
            return acc = +input.value >= +params[0] && +input.value <= +params[1], acc;
        };
    })

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

var messages = {
    required: function required() {
        return 'This field is required.';
    },
    email: function email() {
        return 'Please enter a valid email address.';
    },
    url: function url() {
        return 'Please enter a valid URL.';
    },
    date: function date() {
        return 'Please enter a valid date.';
    },
    dateISO: function dateISO() {
        return 'Please enter a valid date (ISO).';
    },
    number: function number() {
        return 'Please enter a valid number.';
    },
    digits: function digits() {
        return 'Please enter only digits.';
    },
    maxlength: function maxlength(props) {
        return 'Please enter no more than ' + props + ' characters.';
    },
    minlength: function minlength(props) {
        return 'Please enter at least ' + props + ' characters.';
    },
    max: function max(props) {
        return 'Please enter a value less than or equal to ' + [props] + '.';
    },
    min: function min(props) {
        return 'Please enter a value greater than or equal to ' + props + '.';
    }
};

// const checkForDataRuleConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

// const checkForDataValConstraint = (input, constraint) => input.getAttribute(`data-val-${constraint}`) && input.getAttribute(`data-val-${constraint}`) !== 'false';

// const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);

var extractDataValValidators = function extractDataValValidators(input) {
    return DOTNETCORE_ADAPTORS.reduce(function (validators, adaptor) {
        if (!input.getAttribute('data-val-' + adaptor)) return validators;
        validators.push(Object.assign({ type: adaptor, message: input.getAttribute('data-val-' + adaptor) }, DOTNETCORE_PARAMS[adaptor] && {
            params: DOTNETCORE_PARAMS[adaptor].reduce(function (acc, param) {
                input.hasAttribute('data-val-' + param) && acc.push(input.getAttribute('data-val-' + param));
                return acc;
            }, [])
        }));
        return validators;
    }, []);
};

//for data-rule-* support
//const hasDataAttributePart = (node, part) => Array.from(node.dataset).filter(attribute => !!~attribute.indexOf(part)).length > 0;

var extractAttributeValidators = function extractAttributeValidators(input) {
    var validators = [];
    if (input.hasAttribute('required') && input.getAttribute('required') !== 'false') validators.push({ type: 'required' });
    if (input.getAttribute('type') === 'email') validators.push({ type: 'email' });
    if (input.getAttribute('type') === 'url') validators.push({ type: 'url' });
    if (input.getAttribute('type') === 'number') validators.push({ type: 'number' });
    if (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') validators.push({ type: 'minlength', params: [input.getAttribute('minlength')] });
    if (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') validators.push({ type: 'maxlength', params: [input.getAttribute('maxlength')] });
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
var normaliseValidators = function normaliseValidators(input) {
    var validators = [];

    //how to merge the same validator from multiple sources, e.g. DOM attribute versus data-val?
    //assume data-val is cannonical?
    if (input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));else validators = validators.concat(extractAttributeValidators(input));
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

var validationReducer = function validationReducer(group) {
    return function (acc, validator) {
        if (methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
        return {
            valid: false,
            errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [extractErrorMessage(validator, group)]) : [extractErrorMessage(validator, group)]
        };
    };
};

var assembleValidationGroup = function assembleValidationGroup(acc, input) {
    if (!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid: false,
            validators: normaliseValidators(input),
            fields: [input]
        };
    } else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

var extractErrorMessage = function extractErrorMessage(validator, group) {
    return validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);
};

var removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

var h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

// import inputPrototype from './input-prototype';
var componentPrototype = {
    init: function init() {
        //prevent browser validation
        this.form.setAttribute('novalidate', 'novalidate');

        this.groups = removeUnvalidatableGroups(Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}));

        this.initListeners();

        console.log(this.groups);

        /*
        	1. ref. <input data-rule-minlength="2" data-rule-maxlength="4" data-msg-minlength="At least two chars" data-msg-maxlength="At most fours chars">
        		2. ref. https://jqueryvalidation.org/files/demo/
        
        3. ref. Constraint validation API
        Validation-repated attributes
        	- pattern, regex, 'The value must match the pattern'
        	- min, number, 'The value must be greater than or equal to the value.'
        	- max, number, 'The value must be less than or equal to the value',
        	- required, none, 'There must be a value',
        	- maxlength, int length, 'The number of characters (code points) must not exceed the value of the attribute.' 
        	4. ref. https://github.com/aspnet/jquery-validation-unobtrusive/blob/master/src/jquery.validate.unobtrusive.js
        	*/

        //validate whole form

        return this;
    },
    initListeners: function initListeners() {
        var _this = this;

        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.clearErrors();
            if (_this.setValidityState()) _this.form.submit();else _this.renderErrors(), _this.initRealTimeValidation();
        });

        this.form.addEventListener('reset', function (e) {
            _this.clearErrors();
        });
    },
    initRealTimeValidation: function initRealTimeValidation() {
        var handler = function (e) {
            var group = e.target.getAttribute('name');
            if (this.groups[group].errorDOM) this.removeError(group);
            if (!this.setGroupValidityState(group)) this.renderError(group);
        }.bind(this);

        for (var group in this.groups) {
            this.groups[group].fields.forEach(function (input) {
                input.addEventListener(chooseRealTimeEvent(input), handler);
            });
        }
    },
    setGroupValidityState: function setGroupValidityState(group) {
        this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] }, //reset validity and errorMessagesa
        this.groups[group].validators.reduce(validationReducer(this.groups[group]), true));
        return this.groups[group].valid;
    },
    setValidityState: function setValidityState() {
        var numErrors = 0;
        for (var group in this.groups) {
            this.setGroupValidityState(group);
            !this.groups[group].valid && ++numErrors;
        }
        return numErrors === 0;
    },
    clearErrors: function clearErrors() {
        for (var group in this.groups) {
            if (this.groups[group].errorDOM) this.removeError(group);
        }
    },
    removeError: function removeError(group) {
        this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
        this.groups[group].fields.forEach(function (field) {
            field.removeAttribute('aria-invalid');
        }); //or should i set this to false if field passes validation?
        delete this.groups[group].errorDOM;
    },
    renderErrors: function renderErrors() {
        //support for inline and error list?
        for (var group in this.groups) {
            if (!this.groups[group].valid) this.renderError(group);
        }
    },
    renderError: function renderError(group) {
        this.groups[group].errorDOM = this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));

        //set aria-invalid on invalid inputs
        this.groups[group].fields.forEach(function (field) {
            field.setAttribute('aria-invalid', 'true');
        });
    },
    addMethod: function addMethod(name, fn, message) {
        this.groups.validators.push(fn);
        //extend messages
    }
};

var init = function init(sel, opts) {
    // let els = [].slice.call(document.querySelectorAll(sel));
    var els = Array.from(document.querySelectorAll(sel));

    if (!els.length) return console.warn('Validation not initialised, no augmentable elements found for selector ' + sel);

    return els.reduce(function (acc, el) {
        if (el.getAttribute('novalidate')) return;
        acc.push(Object.assign(Object.create(componentPrototype), {
            form: el,
            settings: Object.assign({}, defaults, opts)
        }).init());
        return acc;
    }, []);
};

/*
	Check whether a form containing any fields with data-val=true
	Initialise using data-val-true to designate validateable inputs
*/

var index = { init: init };

exports.default = index;;
}));
