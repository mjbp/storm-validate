/**
 * @name storm-validate: 
 * @version 0.1.0: Wed, 24 Jan 2018 22:42:32 GMT
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

var h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

var checkForDataConstraint = function checkForDataConstraint(input, constraint) {
    return input.getAttribute('data-rule-' + constraint) && input.getAttribute('data-rule-' + constraint) !== 'false';
};

var checkForConstraint = function checkForConstraint(input, constraint) {
    return input.getAttribute('type') === constraint || checkForDataConstraint(input, constraint);
};

var normaliseValidators = function normaliseValidators(input) {
    var validators = [];
    /* 
        Extract from 
        - data-attributes
        - element attributes
        - classNames (x)
        - staticRules (x)
    */

    //required
    if (input.hasAttribute('required') && input.getAttribute('required') !== 'false' || checkForDataConstraint(input, 'required')) validators.push('required');

    // //email
    if (checkForConstraint(input, 'email')) validators.push('email');

    // //url
    if (checkForConstraint(input, 'url')) validators.push('url');

    // //date
    if (checkForConstraint(input, 'date')) validators.push('date');

    // //dateISO
    if (checkForConstraint(input, 'dateISO')) validators.push('dateISO');

    // //number
    if (checkForConstraint(input, 'number')) validators.push('number');

    // //digits
    // //to do

    // //minlength
    if (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false' || checkForDataConstraint(input, 'minlength')) validators.push('minlength');

    // //maxlength
    if (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false' || checkForDataConstraint(input, 'maxlength')) validators.push('maxlength');

    // //rangelength

    // //min
    if (input.getAttribute('min') && input.getAttribute('min') !== 'false' || checkForDataConstraint(input, 'min')) validators.push('min');

    // //max
    if (input.getAttribute('max') && input.getAttribute('max') !== 'false' || checkForDataConstraint(input, 'max')) validators.push('max');

    // //step
    // //to do

    // //equalTo
    // //to do

    // //remote
    // //to do

    return validators;
};

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

var methods = {
    // https://jqueryvalidation.org/required-method/
    // oldRequired: function( value, element, param ) {

    //     // Check if dependency is met
    //     if ( !this.depend( param, element ) ) {
    //         return "dependency-mismatch";
    //     }
    //     if ( element.nodeName.toLowerCase() === "select" ) {

    //         // Could be an array for select-multiple or a string, both are fine this way
    //         var val = $( element ).val();
    //         return val && val.length > 0;
    //     }
    //     if ( this.checkable( element ) ) {
    //         return this.getLength( value, element ) > 0;
    //     }
    //     return value !== undefined && value !== null && value.length > 0;
    // },

    required: function required(group) {
        var _this = this;

        return group.fields.reduce(function (acc, input) {
            if (isSelect(input)) acc = input.value() && input.value().length > 0;
            if (isCheckable(input)) acc = _this.checked;else acc = input.value !== undefined && input.value !== null && input.value.length > 0;
            return acc;
        }, false);
    },


    // https://jqueryvalidation.org/email-method/
    // email: function( value, element ) {

    //     // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    //     // Retrieved 2014-01-14
    //     // If you have a problem with this implementation, report a bug against the above spec
    //     // Or use custom methods to implement your own email validation
    //     return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
    // },

    email: function email(group) {
        return group.fields.reduce(function (acc, input) {
            acc = emailRegex.test(input.value);
            return acc;
        }, false);
    },


    // https://jqueryvalidation.org/url-method/
    // url: function( value, element ) {

    //     // Copyright (c) 2010-2013 Diego Perini, MIT licensed
    //     // https://gist.github.com/dperini/729294
    //     // see also https://mathiasbynens.be/demo/url-regex
    //     // modified to allow protocol-relative URLs
    //     return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    // },

    url: function url(group) {
        return false;
    },


    // https://jqueryvalidation.org/date-method/
    date: function date(value, element) {
        return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
    },

    // https://jqueryvalidation.org/dateISO-method/
    dateISO: function dateISO(value, element) {
        return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
    },

    // https://jqueryvalidation.org/number-method/
    number: function number(value, element) {
        return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    },

    // https://jqueryvalidation.org/digits-method/
    digits: function digits(value, element) {
        return this.optional(element) || /^\d+$/.test(value);
    },

    // https://jqueryvalidation.org/minlength-method/
    // minlength: function( value, element, param ) {
    //     var length = $.isArray( value ) ? value.length : this.getLength( value, element );
    //     return this.optional( element ) || length >= param;
    // },
    minlength: function minlength(group) {
        return false;
    },


    // https://jqueryvalidation.org/maxlength-method/
    // maxlength: function( value, element, param ) {
    //     var length = $.isArray( value ) ? value.length : this.getLength( value, element );
    //     return this.optional( element ) || length <= param;
    // },
    maxlength: function maxlength(group) {
        return true;
    },


    // https://jqueryvalidation.org/rangelength-method/
    rangelength: function rangelength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length >= param[0] && length <= param[1];
    },

    // https://jqueryvalidation.org/min-method/
    min: function min(value, element, param) {
        return this.optional(element) || value >= param;
    },

    // https://jqueryvalidation.org/max-method/
    max: function max(value, element, param) {
        return this.optional(element) || value <= param;
    },

    // https://jqueryvalidation.org/range-method/
    range: function range(value, element, param) {
        return this.optional(element) || value >= param[0] && value <= param[1];
    },

    // https://jqueryvalidation.org/step-method/
    step: function step(value, element, param) {
        var type = $(element).attr("type"),
            errorMessage = "Step attribute on input type " + type + " is not supported.",
            supportedTypes = ["text", "number", "range"],
            re = new RegExp("\\b" + type + "\\b"),
            notSupported = type && !re.test(supportedTypes.join()),
            decimalPlaces = function decimalPlaces(num) {
            var match = ("" + num).match(/(?:\.(\d+))?$/);
            if (!match) {
                return 0;
            }

            // Number of digits right of decimal point.
            return match[1] ? match[1].length : 0;
        },
            toInt = function toInt(num) {
            return Math.round(num * Math.pow(10, decimals));
        },
            valid = true,
            decimals;

        // Works only for text, number and range input types
        // TODO find a way to support input types date, datetime, datetime-local, month, time and week
        if (notSupported) {
            throw new Error(errorMessage);
        }

        decimals = decimalPlaces(param);

        // Value can't have too many decimals
        if (decimalPlaces(value) > decimals || toInt(value) % toInt(param) !== 0) {
            valid = false;
        }

        return this.optional(element) || valid;
    },

    // https://jqueryvalidation.org/equalTo-method/
    equalTo: function equalTo(value, element, param) {

        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $(param);
        if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
            target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                $(element).valid();
            });
        }
        return value === target.val();
    },

    // https://jqueryvalidation.org/remote-method/
    remote: function remote(value, element, param, method) {
        if (this.optional(element)) {
            return "dependency-mismatch";
        }

        method = typeof method === "string" && method || "remote";

        var previous = this.previousValue(element, method),
            validator,
            data,
            optionDataString;

        if (!this.settings.messages[element.name]) {
            this.settings.messages[element.name] = {};
        }
        previous.originalMessage = previous.originalMessage || this.settings.messages[element.name][method];
        this.settings.messages[element.name][method] = previous.message;

        param = typeof param === "string" && { url: param } || param;
        optionDataString = $.param($.extend({ data: value }, param.data));
        if (previous.old === optionDataString) {
            return previous.valid;
        }

        previous.old = optionDataString;
        validator = this;
        this.startRequest(element);
        data = {};
        data[element.name] = value;
        $.ajax($.extend(true, {
            mode: "abort",
            port: "validate" + element.name,
            dataType: "json",
            data: data,
            context: validator.currentForm,
            success: function success(response) {
                var valid = response === true || response === "true",
                    errors,
                    message,
                    submitted;

                validator.settings.messages[element.name][method] = previous.originalMessage;
                if (valid) {
                    submitted = validator.formSubmitted;
                    validator.resetInternals();
                    validator.toHide = validator.errorsFor(element);
                    validator.formSubmitted = submitted;
                    validator.successList.push(element);
                    validator.invalid[element.name] = false;
                    validator.showErrors();
                } else {
                    errors = {};
                    message = response || validator.defaultMessage(element, { method: method, parameters: value });
                    errors[element.name] = previous.message = message;
                    validator.invalid[element.name] = true;
                    validator.showErrors(errors);
                }
                previous.valid = valid;
                validator.stopRequest(element, valid);
            }
        }, param));
        return "pending";
    }
};

var messages = {
    required: function required() {
        return 'This field is required.';
    },
    remote: function remote() {
        return 'Please fix this field.';
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
    equalTo: function equalTo() {
        return 'Please enter the same value again.';
    },
    maxlength: function maxlength(props) {
        return 'Please enter no more than ' + props + ' characters.';
    },
    minlength: function minlength(props) {
        return 'Please enter at least ' + props + ' characters.';
    },
    rangelength: function rangelength(props) {
        return 'Please enter a value between ' + props.min + ' and ' + props.max + ' characters long.';
    },
    range: function range(props) {
        return 'Please enter a value between ' + props.min + ' and ' + props.max + '.';
    },
    max: function max(props) {
        return 'Please enter a value less than or equal to ' + [props] + '.';
    },
    min: function min(props) {
        return 'Please enter a value greater than or equal to ' + props + '.';
    },
    step: function step(props) {
        return 'Please enter a multiple of ' + props + '.';
    }
};

// import inputPrototype from './input-prototype';
var componentPrototype = {
    init: function init() {
        var _this2 = this;

        //prevent browser validation
        this.form.setAttribute('novalidate', 'novalidate');
        this.inputs = this.form.querySelectorAll('input:not([type=submit]), textarea, select');
        this.groups = this.inputs.reduce(function (acc, input) {
            if (!acc[input.getAttribute('name')]) {
                acc[input.getAttribute('name')] = {
                    valid: false,
                    validators: normaliseValidators(input),
                    fields: [input]
                };
            } else acc[input.getAttribute('name')].fields.push(input);
            return acc;
        }, []);

        // this.inputs.forEach(input => {
        // 	input.addEventListener('change', this.boundChangeHandler);
        // 	input.addEventListener('focus', this.focusHandler.bind(this));
        // 	input.addEventListener('blur', this.blurHandler.bind(this));
        // 	input.addEventListener('invalid', this.invalidHandler.bind(this));
        // });

        this.form.addEventListener('submit', function (e) {
            e.preventDefault();
            _this2.clearErrors();
            if (_this2.setValidityState()) _this2.form.submit();else _this2.renderErrors(), initRealtimeValidation();
        });

        this.form.addEventListener('reset', function (e) {
            _this2.clearErrors();
        });

        /*
        	ref. <input data-rule-minlength="2" data-rule-maxlength="4" data-msg-minlength="At least two chars" data-msg-maxlength="At most fours chars">
        		ref. https://jqueryvalidation.org/files/demo/
        
        ref. Constraint validation API
        Validation-repated attributes
        	- pattern, regex, 'The value must match the pattern'
        	- min, number, 'The value must be greater than or equal to the value.'
        	- max, number, 'The value must be less than or equal to the value',
        	- required, none, 'There must be a value',
        	- maxlength, int length, 'The number of characters (code points) must not exceed the value of the attribute.' 
        	*/

        //validate whole form
        //set aria-invalid on invalid inputs

        return this;
    },
    initRealtimeValidation: function initRealtimeValidation() {
        var _this3 = this;

        this.inputs.forEach(function (input) {
            input.addEventListener('change', _this3.setValidityState);
        });
    },
    setGroupValidityState: function setGroupValidityState() {},
    setValidityState: function setValidityState() {
        var _this4 = this;

        var numErrors = 0;

        var _loop = function _loop(group) {
            _this4.groups[group] = Object.assign({}, _this4.groups[group], { valid: true, errorMessages: [] }, _this4.groups[group].validators.reduce(function (acc, validator) {
                if (!methods[validator](_this4.groups[group])) {
                    acc = {
                        valid: false,
                        dirty: true,
                        errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [messages[validator]()]) : [messages[validator]()]
                    };
                }
                return acc;
            }, true));
            !_this4.groups[group].valid && ++numErrors;
        };

        for (var group in this.groups) {
            _loop(group);
        }
        return numErrors === 0;
    },
    clearErrors: function clearErrors() {
        for (var group in this.groups) {
            if (this.groups[group].errorDOM) {
                this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
                delete this.groups[group].errorDOM;
            }
        }
    },
    renderErrors: function renderErrors() {
        //support for inline and error list?
        for (var group in this.groups) {
            if (!this.groups[group].valid) {
                this.groups[group].errorDOM = this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));
            }
        }
    },
    addMethod: function addMethod(name, fn, message) {
        this.groups.validators.push(fn);
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
            inputs: Array.from(el.querySelectorAll('input:not([type=submit]), textarea, select')),
            settings: Object.assign({}, defaults, opts)
        }).init());
        return acc;
    }, []);
};

var index = { init: init };

exports.default = index;;
}));
