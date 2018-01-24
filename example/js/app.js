(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    _component2.default.init('form');
}];

{
    onDOMContentLoadedTasks.forEach(function (fn) {
        return fn();
    });
}

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	// let els = [].slice.call(document.querySelectorAll(sel));
	var els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Validation not initialised, no augmentable elements found for selector ' + sel);

	return els.reduce(function (acc, el) {
		if (el.getAttribute('novalidate')) return;
		acc.push(Object.assign(Object.create(_componentPrototype2.default), {
			form: el,
			inputs: Array.from(el.querySelectorAll('input:not([type=submit]), textarea, select')),
			settings: Object.assign({}, _defaults2.default, opts)
		}).init());
		return acc;
	}, []);
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _utils = require('./utils');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}return arr2;
	} else {
		return Array.from(arr);
	}
} // import inputPrototype from './input-prototype';


exports.default = {
	init: function init() {
		var _this = this;

		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');

		this.groups = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(function (acc, input) {
			if (!acc[input.getAttribute('name')]) {
				acc[input.getAttribute('name')] = {
					valid: false,
					validators: (0, _utils.normaliseValidators)(input),
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
			_this.clearErrors();
			_this.setValidityState();
		});

		this.form.addEventListener('reset', function (e) {
			_this.clearErrors();
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
	setValidityState: function setValidityState() {
		var _this2 = this;

		var numErrors = 0;

		var _loop = function _loop(group) {
			// this.groups[group].errorMessages = [];
			_this2.groups[group] = Object.assign({}, _this2.groups[group], { valid: true, errorMessages: [] }, _this2.groups[group].validators.reduce(function (acc, validator) {
				if (!_methods2.default[validator](_this2.groups[group])) {
					acc = {
						valid: false,
						errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [_messages2.default[validator]()]) : [_messages2.default[validator]()]
					};
				}
				return acc;
			}, true));
			!_this2.groups[group].valid && ++numErrors;
		};

		for (var group in this.groups) {
			_loop(group);
		}
		numErrors > 0 && this.renderErrors();
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
				this.groups[group].errorDOM = this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild((0, _utils.h)('div', { class: 'error' }, this.groups[group].errorMessages[0]));
			}
		}
	},
	addMethod: function addMethod(name, fn, message) {
		this.groups.validators.push(fn);
	}
};

},{"./messages":6,"./methods":7,"./utils":8}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CLASSNAMES = exports.CLASSNAMES = {};

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var emailRegex = exports.emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	errorsInline: true,
	errorSummary: false
	// callback: null
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _constants = require('./constants');

exports.default = {
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
            if ((0, _utils.isSelect)(input)) acc = input.value() && input.value().length > 0;
            if ((0, _utils.isCheckable)(input)) acc = _this.checked;else acc = input.value !== undefined && input.value !== null && input.value.length > 0;
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
            acc = _constants.emailRegex.test(input.value);
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

},{"./constants":4,"./utils":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var isSelect = exports.isSelect = function isSelect(field) {
    return field.nodeName.toLowerCase() === 'select';
};

var isCheckable = exports.isCheckable = function isCheckable(field) {
    return (/radio|checkbox/i.test(field.type)
    );
};

var h = exports.h = function h(nodeName, attributes, text) {
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

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixBQUU5Rzs7WUFBTyxBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQzlCO01BQUcsR0FBQSxBQUFHLGFBQU4sQUFBRyxBQUFnQixlQUFlLEFBQ2xDO01BQUEsQUFBSSxZ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QixPQUF0QixBQUFHLEFBQTBCLFNBQVMsV0FBQSxBQUFXLEtBQVgsQUFBZ0IsQUFFdEQ7O0FBQ0E7UUFBRyxtQkFBQSxBQUFtQixPQUF0QixBQUFHLEFBQTBCLFlBQVksV0FBQSxBQUFXLEtBQVgsQUFBZ0IsQUFFekQ7O0FBQ0E7UUFBRyxtQkFBQSxBQUFtQixPQUF0QixBQUFHLEFBQTBCLFdBQVcsV0FBQSxBQUFXLEtBQVgsQUFBZ0IsQUFFeEQ7O0FBQ0E7QUFFQTs7QUFDQTtRQUFJLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFnQixNQUFBLEFBQU0sYUFBTixBQUFtQixpQkFBdkQsQUFBd0UsV0FBWSx1QkFBQSxBQUF1QixPQUE5RyxBQUF1RixBQUE4QixjQUFjLFdBQUEsQUFBVyxLQUFYLEFBQWdCLEFBRW5KOztBQUNBO1FBQUksTUFBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQWdCLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGlCQUF2RCxBQUF3RSxXQUFZLHVCQUFBLEFBQXVCLE9BQTlHLEFBQXVGLEFBQThCLGNBQWMsV0FBQSxBQUFXLEtBQVgsQUFBZ0IsQUFFbko7O0FBRUE7O0FBQ0E7UUFBSSxNQUFBLEFBQU0sYUFBTixBQUFtQixVQUFVLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFdBQWpELEFBQTRELFdBQVksdUJBQUEsQUFBdUIsT0FBbEcsQUFBMkUsQUFBOEIsUUFBUSxXQUFBLEFBQVcsS0FBWCxBQUFnQixBQUVqSTs7QUFDQTtRQUFJLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFVBQVUsTUFBQSxBQUFNLGFBQU4sQUFBbUIsV0FBakQsQUFBNEQsV0FBWSx1QkFBQSxBQUF1QixPQUFsRyxBQUEyRSxBQUE4QixRQUFRLFdBQUEsQUFBVyxLQUFYLEFBQWdCLEFBR2pJOztBQUNBO0FBRUE7O0FBQ0E7QUFFQTs7QUFDQTtBQUVBOztXQUFBLEFBQU8sQUFDVjtBQXhETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0Ly8gbGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICBsZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKGBWYWxpZGF0aW9uIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQgZm9yIHNlbGVjdG9yICR7c2VsfWApO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0aW5wdXRzOiBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKSxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCkpO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIFtdKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgaCwgbm9ybWFsaXNlVmFsaWRhdG9ycyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXG5cdFx0dGhpcy5ncm91cHMgPSBBcnJheS5mcm9tKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSlcblx0XHRcdFx0XHRcdC5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcblx0XHRcdFx0XHRcdFx0XHRhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsaWQ6ICBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZmllbGRzOiBbaW5wdXRdXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYWNjO1xuXHRcdFx0XHRcdFx0fSwgW10pO1xuXG5cdFx0XG5cblx0XHQvLyB0aGlzLmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHQvLyBcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuYm91bmRDaGFuZ2VIYW5kbGVyKTtcblx0XHQvLyBcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5mb2N1c0hhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0Ly8gXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5ibHVySGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHQvLyBcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCB0aGlzLmludmFsaWRIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdC8vIH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0dGhpcy5zZXRWYWxpZGl0eVN0YXRlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBlID0+IHsgdGhpcy5jbGVhckVycm9ycygpOyB9KTtcblxuXHRcdC8qXG5cblx0XHRyZWYuIDxpbnB1dCBkYXRhLXJ1bGUtbWlubGVuZ3RoPVwiMlwiIGRhdGEtcnVsZS1tYXhsZW5ndGg9XCI0XCIgZGF0YS1tc2ctbWlubGVuZ3RoPVwiQXQgbGVhc3QgdHdvIGNoYXJzXCIgZGF0YS1tc2ctbWF4bGVuZ3RoPVwiQXQgbW9zdCBmb3VycyBjaGFyc1wiPlxuXG5cblx0XHRyZWYuIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZmlsZXMvZGVtby9cblx0XHRcblx0XHRyZWYuIENvbnN0cmFpbnQgdmFsaWRhdGlvbiBBUElcblx0XHRWYWxpZGF0aW9uLXJlcGF0ZWQgYXR0cmlidXRlc1xuXHRcdFx0LSBwYXR0ZXJuLCByZWdleCwgJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuJ1xuXHRcdFx0LSBtaW4sIG51bWJlciwgJ1RoZSB2YWx1ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUuJ1xuXHRcdFx0LSBtYXgsIG51bWJlciwgJ1RoZSB2YWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUnLFxuXHRcdFx0LSByZXF1aXJlZCwgbm9uZSwgJ1RoZXJlIG11c3QgYmUgYSB2YWx1ZScsXG5cdFx0XHQtIG1heGxlbmd0aCwgaW50IGxlbmd0aCwgJ1RoZSBudW1iZXIgb2YgY2hhcmFjdGVycyAoY29kZSBwb2ludHMpIG11c3Qgbm90IGV4Y2VlZCB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS4nIFxuXG5cdFx0Ki9cblxuXHRcdC8vdmFsaWRhdGUgd2hvbGUgZm9ybVxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHNldFZhbGlkaXR5U3RhdGUoKXtcblx0XHRsZXQgbnVtRXJyb3JzID0gMDtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdC8vIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzID0gW107XG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdyb3Vwc1tncm91cF0sIHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0sICB0aGlzLmdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5yZWR1Y2UoKGFjYywgdmFsaWRhdG9yKSA9PiB7XG5cdFx0XHRcdGlmKCFtZXRob2RzW3ZhbGlkYXRvcl0odGhpcy5ncm91cHNbZ3JvdXBdKSkge1xuXHRcdFx0XHRcdGFjYyA9IHtcblx0XHRcdFx0XHRcdHZhbGlkOiBmYWxzZSxcblx0XHRcdFx0XHRcdGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBtZXNzYWdlc1t2YWxpZGF0b3JdKCldIDogW21lc3NhZ2VzW3ZhbGlkYXRvcl0oKV1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHR9LCB0cnVlKSk7XG5cdFx0XHQhdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkICYmICsrbnVtRXJyb3JzO1xuXHRcdH1cblx0XHRudW1FcnJvcnMgPiAwICYmIHRoaXMucmVuZGVyRXJyb3JzKCk7XG5cdH0sXG5cdGNsZWFyRXJyb3JzKCl7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHtcblx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkge1xuXHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSB0aGlzLmdyb3Vwc1tncm91cF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5maWVsZHNbdGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogJ2Vycm9yJyB9LCB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0YWRkTWV0aG9kKG5hbWUsIGZuLCBtZXNzYWdlKXtcblx0XHR0aGlzLmdyb3Vwcy52YWxpZGF0b3JzLnB1c2goZm4pXG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgZW1haWxSZWdleCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvOyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfSxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgcmFuZ2VsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9IGNoYXJhY3RlcnMgbG9uZy5gOyB9LFxuICAgIHJhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIHN0ZXAocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIG11bHRpcGxlIG9mICR7cHJvcHN9LmA7IH1cbn07IiwiaW1wb3J0IHsgaXNTZWxlY3QsIGlzQ2hlY2thYmxlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBlbWFpbFJlZ2V4IH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZXF1aXJlZC1tZXRob2QvXG4gICAgLy8gb2xkUmVxdWlyZWQ6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG5cbiAgICAvLyAgICAgLy8gQ2hlY2sgaWYgZGVwZW5kZW5jeSBpcyBtZXRcbiAgICAvLyAgICAgaWYgKCAhdGhpcy5kZXBlbmQoIHBhcmFtLCBlbGVtZW50ICkgKSB7XG4gICAgLy8gICAgICAgICByZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgaWYgKCBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgKSB7XG5cbiAgICAvLyAgICAgICAgIC8vIENvdWxkIGJlIGFuIGFycmF5IGZvciBzZWxlY3QtbXVsdGlwbGUgb3IgYSBzdHJpbmcsIGJvdGggYXJlIGZpbmUgdGhpcyB3YXlcbiAgICAvLyAgICAgICAgIHZhciB2YWwgPSAkKCBlbGVtZW50ICkudmFsKCk7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsICYmIHZhbC5sZW5ndGggPiAwO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGlmICggdGhpcy5jaGVja2FibGUoIGVsZW1lbnQgKSApIHtcbiAgICAvLyAgICAgICAgIHJldHVybiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKSA+IDA7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUubGVuZ3RoID4gMDtcbiAgICAvLyB9LFxuXG4gICAgcmVxdWlyZWQoZ3JvdXApe1xuICAgICAgICByZXR1cm4gZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgaWYoaXNTZWxlY3QoaW5wdXQpKSBhY2MgPSAoaW5wdXQudmFsdWUoKSAmJiBpbnB1dC52YWx1ZSgpLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgaWYoaXNDaGVja2FibGUoaW5wdXQpKSBhY2MgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICBlbHNlIGFjYyA9IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApOyBcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lbWFpbC1tZXRob2QvXG4gICAgLy8gZW1haWw6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblxuICAgIC8vICAgICAvLyBGcm9tIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbiAgICAvLyAgICAgLy8gUmV0cmlldmVkIDIwMTQtMDEtMTRcbiAgICAvLyAgICAgLy8gSWYgeW91IGhhdmUgYSBwcm9ibGVtIHdpdGggdGhpcyBpbXBsZW1lbnRhdGlvbiwgcmVwb3J0IGEgYnVnIGFnYWluc3QgdGhlIGFib3ZlIHNwZWNcbiAgICAvLyAgICAgLy8gT3IgdXNlIGN1c3RvbSBtZXRob2RzIHRvIGltcGxlbWVudCB5b3VyIG93biBlbWFpbCB2YWxpZGF0aW9uXG4gICAgLy8gICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC8udGVzdCggdmFsdWUgKTtcbiAgICAvLyB9LFxuXG4gICAgZW1haWwoZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgICAgIGFjYyA9IGVtYWlsUmVnZXgudGVzdChpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvdXJsLW1ldGhvZC9cbiAgICAvLyB1cmw6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblxuICAgIC8vICAgICAvLyBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMyBEaWVnbyBQZXJpbmksIE1JVCBsaWNlbnNlZFxuICAgIC8vICAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kcGVyaW5pLzcyOTI5NFxuICAgIC8vICAgICAvLyBzZWUgYWxzbyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbiAgICAvLyAgICAgLy8gbW9kaWZpZWQgdG8gYWxsb3cgcHJvdG9jb2wtcmVsYXRpdmUgVVJMc1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaS50ZXN0KCB2YWx1ZSApO1xuICAgIC8vIH0sXG5cbiAgICB1cmwoZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2RhdGUtbWV0aG9kL1xuICAgIGRhdGU6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAhL0ludmFsaWR8TmFOLy50ZXN0KCBuZXcgRGF0ZSggdmFsdWUgKS50b1N0cmluZygpICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZGF0ZUlTTy1tZXRob2QvXG4gICAgZGF0ZUlTTzogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC8udGVzdCggdmFsdWUgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9udW1iZXItbWV0aG9kL1xuICAgIG51bWJlcjogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvLnRlc3QoIHZhbHVlICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZGlnaXRzLW1ldGhvZC9cbiAgICBkaWdpdHM6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlxcZCskLy50ZXN0KCB2YWx1ZSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21pbmxlbmd0aC1tZXRob2QvXG4gICAgLy8gbWlubGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgIC8vICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgbGVuZ3RoID49IHBhcmFtO1xuICAgIC8vIH0sXG4gICAgbWlubGVuZ3RoKGdyb3VwKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21heGxlbmd0aC1tZXRob2QvXG4gICAgLy8gbWF4bGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgIC8vICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgbGVuZ3RoIDw9IHBhcmFtO1xuICAgIC8vIH0sXG4gICAgbWF4bGVuZ3RoKGdyb3VwKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2VsZW5ndGgtbWV0aG9kL1xuICAgIHJhbmdlbGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgKCBsZW5ndGggPj0gcGFyYW1bIDAgXSAmJiBsZW5ndGggPD0gcGFyYW1bIDEgXSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21pbi1tZXRob2QvXG4gICAgbWluOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlID49IHBhcmFtO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21heC1tZXRob2QvXG4gICAgbWF4OiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlIDw9IHBhcmFtO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlLW1ldGhvZC9cbiAgICByYW5nZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIHN0ZXA6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHZhciB0eXBlID0gJCggZWxlbWVudCApLmF0dHIoIFwidHlwZVwiICksXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBcIlN0ZXAgYXR0cmlidXRlIG9uIGlucHV0IHR5cGUgXCIgKyB0eXBlICsgXCIgaXMgbm90IHN1cHBvcnRlZC5cIixcbiAgICAgICAgICAgIHN1cHBvcnRlZFR5cGVzID0gWyBcInRleHRcIiwgXCJudW1iZXJcIiwgXCJyYW5nZVwiIF0sXG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAoIFwiXFxcXGJcIiArIHR5cGUgKyBcIlxcXFxiXCIgKSxcbiAgICAgICAgICAgIG5vdFN1cHBvcnRlZCA9IHR5cGUgJiYgIXJlLnRlc3QoIHN1cHBvcnRlZFR5cGVzLmpvaW4oKSApLFxuICAgICAgICAgICAgZGVjaW1hbFBsYWNlcyA9IGZ1bmN0aW9uKCBudW0gKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gKCBcIlwiICsgbnVtICkubWF0Y2goIC8oPzpcXC4oXFxkKykpPyQvICk7XG4gICAgICAgICAgICAgICAgaWYgKCAhbWF0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE51bWJlciBvZiBkaWdpdHMgcmlnaHQgb2YgZGVjaW1hbCBwb2ludC5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbIDEgXSA/IG1hdGNoWyAxIF0ubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b0ludCA9IGZ1bmN0aW9uKCBudW0gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoIG51bSAqIE1hdGgucG93KCAxMCwgZGVjaW1hbHMgKSApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgIGRlY2ltYWxzO1xuXG4gICAgICAgIC8vIFdvcmtzIG9ubHkgZm9yIHRleHQsIG51bWJlciBhbmQgcmFuZ2UgaW5wdXQgdHlwZXNcbiAgICAgICAgLy8gVE9ETyBmaW5kIGEgd2F5IHRvIHN1cHBvcnQgaW5wdXQgdHlwZXMgZGF0ZSwgZGF0ZXRpbWUsIGRhdGV0aW1lLWxvY2FsLCBtb250aCwgdGltZSBhbmQgd2Vla1xuICAgICAgICBpZiAoIG5vdFN1cHBvcnRlZCApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggZXJyb3JNZXNzYWdlICk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWNpbWFscyA9IGRlY2ltYWxQbGFjZXMoIHBhcmFtICk7XG5cbiAgICAgICAgLy8gVmFsdWUgY2FuJ3QgaGF2ZSB0b28gbWFueSBkZWNpbWFsc1xuICAgICAgICBpZiAoIGRlY2ltYWxQbGFjZXMoIHZhbHVlICkgPiBkZWNpbWFscyB8fCB0b0ludCggdmFsdWUgKSAlIHRvSW50KCBwYXJhbSApICE9PSAwICkge1xuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsaWQ7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgZXF1YWxUbzogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblxuICAgICAgICAvLyBCaW5kIHRvIHRoZSBibHVyIGV2ZW50IG9mIHRoZSB0YXJnZXQgaW4gb3JkZXIgdG8gcmV2YWxpZGF0ZSB3aGVuZXZlciB0aGUgdGFyZ2V0IGZpZWxkIGlzIHVwZGF0ZWRcbiAgICAgICAgdmFyIHRhcmdldCA9ICQoIHBhcmFtICk7XG4gICAgICAgIGlmICggdGhpcy5zZXR0aW5ncy5vbmZvY3Vzb3V0ICYmIHRhcmdldC5ub3QoIFwiLnZhbGlkYXRlLWVxdWFsVG8tYmx1clwiICkubGVuZ3RoICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkZENsYXNzKCBcInZhbGlkYXRlLWVxdWFsVG8tYmx1clwiICkub24oIFwiYmx1ci52YWxpZGF0ZS1lcXVhbFRvXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoIGVsZW1lbnQgKS52YWxpZCgpO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0LnZhbCgpO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlbW90ZS1tZXRob2QvXG4gICAgcmVtb3RlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtLCBtZXRob2QgKSB7XG4gICAgICAgIGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0aG9kID0gdHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIiAmJiBtZXRob2QgfHwgXCJyZW1vdGVcIjtcblxuICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLnByZXZpb3VzVmFsdWUoIGVsZW1lbnQsIG1ldGhvZCApLFxuICAgICAgICAgICAgdmFsaWRhdG9yLCBkYXRhLCBvcHRpb25EYXRhU3RyaW5nO1xuXG4gICAgICAgIGlmICggIXRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdICkge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgPSBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgfHwgdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdO1xuICAgICAgICB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXVsgbWV0aG9kIF0gPSBwcmV2aW91cy5tZXNzYWdlO1xuXG4gICAgICAgIHBhcmFtID0gdHlwZW9mIHBhcmFtID09PSBcInN0cmluZ1wiICYmIHsgdXJsOiBwYXJhbSB9IHx8IHBhcmFtO1xuICAgICAgICBvcHRpb25EYXRhU3RyaW5nID0gJC5wYXJhbSggJC5leHRlbmQoIHsgZGF0YTogdmFsdWUgfSwgcGFyYW0uZGF0YSApICk7XG4gICAgICAgIGlmICggcHJldmlvdXMub2xkID09PSBvcHRpb25EYXRhU3RyaW5nICkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzLnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXMub2xkID0gb3B0aW9uRGF0YVN0cmluZztcbiAgICAgICAgdmFsaWRhdG9yID0gdGhpcztcbiAgICAgICAgdGhpcy5zdGFydFJlcXVlc3QoIGVsZW1lbnQgKTtcbiAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICBkYXRhWyBlbGVtZW50Lm5hbWUgXSA9IHZhbHVlO1xuICAgICAgICAkLmFqYXgoICQuZXh0ZW5kKCB0cnVlLCB7XG4gICAgICAgICAgICBtb2RlOiBcImFib3J0XCIsXG4gICAgICAgICAgICBwb3J0OiBcInZhbGlkYXRlXCIgKyBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29udGV4dDogdmFsaWRhdG9yLmN1cnJlbnRGb3JtLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IHJlc3BvbnNlID09PSB0cnVlIHx8IHJlc3BvbnNlID09PSBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLCBtZXNzYWdlLCBzdWJtaXR0ZWQ7XG5cbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdWyBtZXRob2QgXSA9IHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZTtcbiAgICAgICAgICAgICAgICBpZiAoIHZhbGlkICkge1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXR0ZWQgPSB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnJlc2V0SW50ZXJuYWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci50b0hpZGUgPSB2YWxpZGF0b3IuZXJyb3JzRm9yKCBlbGVtZW50ICk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5mb3JtU3VibWl0dGVkID0gc3VibWl0dGVkO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc3VjY2Vzc0xpc3QucHVzaCggZWxlbWVudCApO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3IuaW52YWxpZFsgZWxlbWVudC5uYW1lIF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnNob3dFcnJvcnMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHJlc3BvbnNlIHx8IHZhbGlkYXRvci5kZWZhdWx0TWVzc2FnZSggZWxlbWVudCwgeyBtZXRob2Q6IG1ldGhvZCwgcGFyYW1ldGVyczogdmFsdWUgfSApO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbIGVsZW1lbnQubmFtZSBdID0gcHJldmlvdXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5pbnZhbGlkWyBlbGVtZW50Lm5hbWUgXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5zaG93RXJyb3JzKCBlcnJvcnMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMudmFsaWQgPSB2YWxpZDtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc3RvcFJlcXVlc3QoIGVsZW1lbnQsIHZhbGlkICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHBhcmFtICkgKTtcbiAgICAgICAgcmV0dXJuIFwicGVuZGluZ1wiO1xuICAgIH1cbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmNvbnN0IGNoZWNrRm9yRGF0YUNvbnN0cmFpbnQgPSAoaW5wdXQsIGNvbnN0cmFpbnQpID0+IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtcnVsZS0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbmNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgY29uc3RyYWludCk7XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgLyogXG4gICAgICAgIEV4dHJhY3QgZnJvbSBcbiAgICAgICAgLSBkYXRhLWF0dHJpYnV0ZXNcbiAgICAgICAgLSBlbGVtZW50IGF0dHJpYnV0ZXNcbiAgICAgICAgLSBjbGFzc05hbWVzICh4KVxuICAgICAgICAtIHN0YXRpY1J1bGVzICh4KVxuICAgICovXG4gICAgXG4gICAgLy9yZXF1aXJlZFxuICAgIGlmKChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSkgdmFsaWRhdG9ycy5wdXNoKCdyZXF1aXJlZCcpO1xuXG4gICAgLy8gLy9lbWFpbFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykpIHZhbGlkYXRvcnMucHVzaCgnZW1haWwnKTtcblxuICAgIC8vIC8vdXJsXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAndXJsJykpIHZhbGlkYXRvcnMucHVzaCgndXJsJyk7XG5cbiAgICAvLyAvL2RhdGVcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdkYXRlJykpIHZhbGlkYXRvcnMucHVzaCgnZGF0ZScpO1xuXG4gICAgLy8gLy9kYXRlSVNPXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZUlTTycpKSB2YWxpZGF0b3JzLnB1c2goJ2RhdGVJU08nKTtcblxuICAgIC8vIC8vbnVtYmVyXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnbnVtYmVyJykpIHZhbGlkYXRvcnMucHVzaCgnbnVtYmVyJyk7XG5cbiAgICAvLyAvL2RpZ2l0c1xuICAgIC8vIC8vdG8gZG9cblxuICAgIC8vIC8vbWlubGVuZ3RoXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goJ21pbmxlbmd0aCcpO1xuXG4gICAgLy8gLy9tYXhsZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykpIHZhbGlkYXRvcnMucHVzaCgnbWF4bGVuZ3RoJyk7XG5cbiAgICAvLyAvL3JhbmdlbGVuZ3RoXG5cbiAgICAvLyAvL21pblxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YUNvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSkgdmFsaWRhdG9ycy5wdXNoKCdtaW4nKTtcblxuICAgIC8vIC8vbWF4XG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goJ21heCcpO1xuXG5cbiAgICAvLyAvL3N0ZXBcbiAgICAvLyAvL3RvIGRvXG5cbiAgICAvLyAvL2VxdWFsVG9cbiAgICAvLyAvL3RvIGRvXG5cbiAgICAvLyAvL3JlbW90ZVxuICAgIC8vIC8vdG8gZG9cblxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTsiXX0=
