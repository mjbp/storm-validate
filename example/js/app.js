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
		this.inputs = this.form.querySelectorAll('input:not([type=submit]), textarea, select');
		this.groups = this.inputs.reduce(function (acc, input) {
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
			if (_this.setValidityState()) _this.form.submit();else _this.renderErrors(), initRealtimeValidation();
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
	initRealtimeValidation: function initRealtimeValidation() {
		var _this2 = this;

		this.inputs.forEach(function (input) {
			input.addEventListener('change', _this2.setValidityState);
		});
	},
	setGroupValidityState: function setGroupValidityState() {},
	setValidityState: function setValidityState() {
		var _this3 = this;

		var numErrors = 0;

		var _loop = function _loop(group) {
			_this3.groups[group] = Object.assign({}, _this3.groups[group], { valid: true, errorMessages: [] }, _this3.groups[group].validators.reduce(function (acc, validator) {
				if (!_methods2.default[validator](_this3.groups[group])) {
					acc = {
						valid: false,
						dirty: true,
						errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [_messages2.default[validator]()]) : [_messages2.default[validator]()]
					};
				}
				return acc;
			}, true));
			!_this3.groups[group].valid && ++numErrors;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixBQUU5Rzs7WUFBTyxBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQzlCO01BQUcsR0FBQSxBQUFHLGFBQU4sQUFBRyxBQUFnQixlQUFlLEFBQ2xDO01BQUEsQUFBSSxZ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QUFBTSxhQUFOLEFBQW1CLFdBQWpELEFBQTRELFdBQVksdUJBQUEsQUFBdUIsT0FBbEcsQUFBMkUsQUFBOEIsUUFBUSxXQUFBLEFBQVcsS0FBWCxBQUFnQixBQUdqSTs7QUFDQTtBQUVBOztBQUNBO0FBRUE7O0FBQ0E7QUFFQTs7V0FBQSxBQUFPLEFBQ1Y7QUF4RE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgVmFsaWRhdGUuaW5pdCgnZm9ybScpO1xufV07XG5cbnsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdC8vIGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG4gICAgbGV0IGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblxuXHRpZighZWxzLmxlbmd0aCkgcmV0dXJuIGNvbnNvbGUud2FybihgVmFsaWRhdGlvbiBub3QgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kIGZvciBzZWxlY3RvciAke3NlbH1gKTtcbiAgICBcblx0cmV0dXJuIGVscy5yZWR1Y2UoKGFjYywgZWwpID0+IHtcblx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdGFjYy5wdXNoKE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRmb3JtOiBlbCxcblx0XHRcdGlucHV0czogQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSksXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCIvLyBpbXBvcnQgaW5wdXRQcm90b3R5cGUgZnJvbSAnLi9pbnB1dC1wcm90b3R5cGUnO1xuaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuL21lc3NhZ2VzJztcbmltcG9ydCB7IGgsIG5vcm1hbGlzZVZhbGlkYXRvcnMgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdC8vcHJldmVudCBicm93c2VyIHZhbGlkYXRpb25cblx0XHR0aGlzLmZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcblx0XHR0aGlzLmlucHV0cyA9IHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKTtcblx0XHR0aGlzLmdyb3VwcyA9IHRoaXMuaW5wdXRzXG5cdFx0XHRcdFx0XHQucmVkdWNlKChhY2MsIGlucHV0KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG5cdFx0XHRcdFx0XHRcdFx0YWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbGlkOiAgZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcblx0XHRcdFx0XHRcdFx0XHRcdGZpZWxkczogW2lucHV0XVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldLmZpZWxkcy5wdXNoKGlucHV0KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0XHRcdH0sIFtdKTtcblxuXHRcdFxuXG5cdFx0Ly8gdGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG5cdFx0Ly8gXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmJvdW5kQ2hhbmdlSGFuZGxlcik7XG5cdFx0Ly8gXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuZm9jdXNIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdC8vIFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYmx1ckhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0Ly8gXHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnZhbGlkJywgdGhpcy5pbnZhbGlkSGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHQvLyB9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuY2xlYXJFcnJvcnMoKTtcblx0XHRcdGlmKHRoaXMuc2V0VmFsaWRpdHlTdGF0ZSgpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRlbHNlIHRoaXMucmVuZGVyRXJyb3JzKCksIGluaXRSZWFsdGltZVZhbGlkYXRpb24oKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXG5cdFx0LypcblxuXHRcdHJlZi4gPGlucHV0IGRhdGEtcnVsZS1taW5sZW5ndGg9XCIyXCIgZGF0YS1ydWxlLW1heGxlbmd0aD1cIjRcIiBkYXRhLW1zZy1taW5sZW5ndGg9XCJBdCBsZWFzdCB0d28gY2hhcnNcIiBkYXRhLW1zZy1tYXhsZW5ndGg9XCJBdCBtb3N0IGZvdXJzIGNoYXJzXCI+XG5cblxuXHRcdHJlZi4gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9maWxlcy9kZW1vL1xuXHRcdFxuXHRcdHJlZi4gQ29uc3RyYWludCB2YWxpZGF0aW9uIEFQSVxuXHRcdFZhbGlkYXRpb24tcmVwYXRlZCBhdHRyaWJ1dGVzXG5cdFx0XHQtIHBhdHRlcm4sIHJlZ2V4LCAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4nXG5cdFx0XHQtIG1pbiwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZS4nXG5cdFx0XHQtIG1heCwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZScsXG5cdFx0XHQtIHJlcXVpcmVkLCBub25lLCAnVGhlcmUgbXVzdCBiZSBhIHZhbHVlJyxcblx0XHRcdC0gbWF4bGVuZ3RoLCBpbnQgbGVuZ3RoLCAnVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIChjb2RlIHBvaW50cykgbXVzdCBub3QgZXhjZWVkIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLicgXG5cblx0XHQqL1xuXG5cdFx0Ly92YWxpZGF0ZSB3aG9sZSBmb3JtXG5cdFx0Ly9zZXQgYXJpYS1pbnZhbGlkIG9uIGludmFsaWQgaW5wdXRzXG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdFJlYWx0aW1lVmFsaWRhdGlvbigpe1xuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5zZXRWYWxpZGl0eVN0YXRlKTtcblx0XHR9KTtcblx0fSxcblx0c2V0R3JvdXBWYWxpZGl0eVN0YXRlKCl7XG5cblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBudW1FcnJvcnMgPSAwO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gXG5cdFx0XHRcdE9iamVjdC5hc3NpZ24oe30sIFxuXHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSxcblx0XHRcdFx0XHR7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9LCBcblx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5yZWR1Y2UoKGFjYywgdmFsaWRhdG9yKSA9PiB7XG5cdFx0XHRcdFx0XHRpZighbWV0aG9kc1t2YWxpZGF0b3JdKHRoaXMuZ3JvdXBzW2dyb3VwXSkpIHtcblx0XHRcdFx0XHRcdFx0YWNjID0ge1xuXHRcdFx0XHRcdFx0XHRcdHZhbGlkOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRkaXJ0eTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyA/IFsuLi5hY2MuZXJyb3JNZXNzYWdlcywgbWVzc2FnZXNbdmFsaWRhdG9yXSgpXSA6IFttZXNzYWdlc1t2YWxpZGF0b3JdKCldXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdFx0fSwgdHJ1ZSkpO1xuXHRcdFx0IXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCAmJiArK251bUVycm9ycztcblx0XHR9XG5cdFx0cmV0dXJuIG51bUVycm9ycyA9PT0gMDtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkge1xuXHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdFx0XHRkZWxldGUgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB7XG5cdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSA9IHRoaXMuZ3JvdXBzW2dyb3VwXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnBhcmVudE5vZGVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5hcHBlbmRDaGlsZChoKCdkaXYnLCB7IGNsYXNzOiAnZXJyb3InIH0sIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzWzBdKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbilcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBlbWFpbFJlZ2V4ID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICByYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgcmFuZ2UocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0uYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGVtYWlsUmVnZXggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlcXVpcmVkLW1ldGhvZC9cbiAgICAvLyBvbGRSZXF1aXJlZDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblxuICAgIC8vICAgICAvLyBDaGVjayBpZiBkZXBlbmRlbmN5IGlzIG1ldFxuICAgIC8vICAgICBpZiAoICF0aGlzLmRlcGVuZCggcGFyYW0sIGVsZW1lbnQgKSApIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBpZiAoIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiApIHtcblxuICAgIC8vICAgICAgICAgLy8gQ291bGQgYmUgYW4gYXJyYXkgZm9yIHNlbGVjdC1tdWx0aXBsZSBvciBhIHN0cmluZywgYm90aCBhcmUgZmluZSB0aGlzIHdheVxuICAgIC8vICAgICAgICAgdmFyIHZhbCA9ICQoIGVsZW1lbnQgKS52YWwoKTtcbiAgICAvLyAgICAgICAgIHJldHVybiB2YWwgJiYgdmFsLmxlbmd0aCA+IDA7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgaWYgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApICkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApID4gMDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5sZW5ndGggPiAwO1xuICAgIC8vIH0sXG5cbiAgICByZXF1aXJlZChncm91cCl7XG4gICAgICAgIHJldHVybiBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgICAgICBpZihpc1NlbGVjdChpbnB1dCkpIGFjYyA9IChpbnB1dC52YWx1ZSgpICYmIGlucHV0LnZhbHVlKCkubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkpIGFjYyA9IHRoaXMuY2hlY2tlZDtcbiAgICAgICAgICAgIGVsc2UgYWNjID0gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7IFxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2VtYWlsLW1ldGhvZC9cbiAgICAvLyBlbWFpbDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXG4gICAgLy8gICAgIC8vIEZyb20gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuICAgIC8vICAgICAvLyBSZXRyaWV2ZWQgMjAxNC0wMS0xNFxuICAgIC8vICAgICAvLyBJZiB5b3UgaGF2ZSBhIHByb2JsZW0gd2l0aCB0aGlzIGltcGxlbWVudGF0aW9uLCByZXBvcnQgYSBidWcgYWdhaW5zdCB0aGUgYWJvdmUgc3BlY1xuICAgIC8vICAgICAvLyBPciB1c2UgY3VzdG9tIG1ldGhvZHMgdG8gaW1wbGVtZW50IHlvdXIgb3duIGVtYWlsIHZhbGlkYXRpb25cbiAgICAvLyAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLy50ZXN0KCB2YWx1ZSApO1xuICAgIC8vIH0sXG5cbiAgICBlbWFpbChncm91cCkge1xuICAgICAgICByZXR1cm4gZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgYWNjID0gZW1haWxSZWdleC50ZXN0KGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy91cmwtbWV0aG9kL1xuICAgIC8vIHVybDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXG4gICAgLy8gICAgIC8vIENvcHlyaWdodCAoYykgMjAxMC0yMDEzIERpZWdvIFBlcmluaSwgTUlUIGxpY2Vuc2VkXG4gICAgLy8gICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2RwZXJpbmkvNzI5Mjk0XG4gICAgLy8gICAgIC8vIHNlZSBhbHNvIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuICAgIC8vICAgICAvLyBtb2RpZmllZCB0byBhbGxvdyBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzXG4gICAgLy8gICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pLnRlc3QoIHZhbHVlICk7XG4gICAgLy8gfSxcblxuICAgIHVybChncm91cCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZGF0ZS1tZXRob2QvXG4gICAgZGF0ZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICEvSW52YWxpZHxOYU4vLnRlc3QoIG5ldyBEYXRlKCB2YWx1ZSApLnRvU3RyaW5nKCkgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kYXRlSVNPLW1ldGhvZC9cbiAgICBkYXRlSVNPOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLy50ZXN0KCB2YWx1ZSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL251bWJlci1tZXRob2QvXG4gICAgbnVtYmVyOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC8udGVzdCggdmFsdWUgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kaWdpdHMtbWV0aG9kL1xuICAgIGRpZ2l0czogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkKyQvLnRlc3QoIHZhbHVlICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWlubGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBtaW5sZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgLy8gICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBsZW5ndGggPj0gcGFyYW07XG4gICAgLy8gfSxcbiAgICBtaW5sZW5ndGgoZ3JvdXApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWF4bGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBtYXhsZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgLy8gICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBsZW5ndGggPD0gcGFyYW07XG4gICAgLy8gfSxcbiAgICBtYXhsZW5ndGgoZ3JvdXApe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgcmFuZ2VsZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIGxlbmd0aCA+PSBwYXJhbVsgMCBdICYmIGxlbmd0aCA8PSBwYXJhbVsgMSBdICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWluLW1ldGhvZC9cbiAgICBtaW46IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUgPj0gcGFyYW07XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWF4LW1ldGhvZC9cbiAgICBtYXg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUgPD0gcGFyYW07XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuICAgIHJhbmdlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICggdmFsdWUgPj0gcGFyYW1bIDAgXSAmJiB2YWx1ZSA8PSBwYXJhbVsgMSBdICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgc3RlcDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcbiAgICAgICAgdmFyIHR5cGUgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJ0eXBlXCIgKSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiU3RlcCBhdHRyaWJ1dGUgb24gaW5wdXQgdHlwZSBcIiArIHR5cGUgKyBcIiBpcyBub3Qgc3VwcG9ydGVkLlwiLFxuICAgICAgICAgICAgc3VwcG9ydGVkVHlwZXMgPSBbIFwidGV4dFwiLCBcIm51bWJlclwiLCBcInJhbmdlXCIgXSxcbiAgICAgICAgICAgIHJlID0gbmV3IFJlZ0V4cCggXCJcXFxcYlwiICsgdHlwZSArIFwiXFxcXGJcIiApLFxuICAgICAgICAgICAgbm90U3VwcG9ydGVkID0gdHlwZSAmJiAhcmUudGVzdCggc3VwcG9ydGVkVHlwZXMuam9pbigpICksXG4gICAgICAgICAgICBkZWNpbWFsUGxhY2VzID0gZnVuY3Rpb24oIG51bSApIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSAoIFwiXCIgKyBudW0gKS5tYXRjaCggLyg/OlxcLihcXGQrKSk/JC8gKTtcbiAgICAgICAgICAgICAgICBpZiAoICFtYXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTnVtYmVyIG9mIGRpZ2l0cyByaWdodCBvZiBkZWNpbWFsIHBvaW50LlxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsgMSBdID8gbWF0Y2hbIDEgXS5sZW5ndGggOiAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvSW50ID0gZnVuY3Rpb24oIG51bSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCggbnVtICogTWF0aC5wb3coIDEwLCBkZWNpbWFscyApICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmFsaWQgPSB0cnVlLFxuICAgICAgICAgICAgZGVjaW1hbHM7XG5cbiAgICAgICAgLy8gV29ya3Mgb25seSBmb3IgdGV4dCwgbnVtYmVyIGFuZCByYW5nZSBpbnB1dCB0eXBlc1xuICAgICAgICAvLyBUT0RPIGZpbmQgYSB3YXkgdG8gc3VwcG9ydCBpbnB1dCB0eXBlcyBkYXRlLCBkYXRldGltZSwgZGF0ZXRpbWUtbG9jYWwsIG1vbnRoLCB0aW1lIGFuZCB3ZWVrXG4gICAgICAgIGlmICggbm90U3VwcG9ydGVkICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBlcnJvck1lc3NhZ2UgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlY2ltYWxzID0gZGVjaW1hbFBsYWNlcyggcGFyYW0gKTtcblxuICAgICAgICAvLyBWYWx1ZSBjYW4ndCBoYXZlIHRvbyBtYW55IGRlY2ltYWxzXG4gICAgICAgIGlmICggZGVjaW1hbFBsYWNlcyggdmFsdWUgKSA+IGRlY2ltYWxzIHx8IHRvSW50KCB2YWx1ZSApICUgdG9JbnQoIHBhcmFtICkgIT09IDAgKSB7XG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCB2YWxpZDtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICBlcXVhbFRvOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXG4gICAgICAgIC8vIEJpbmQgdG8gdGhlIGJsdXIgZXZlbnQgb2YgdGhlIHRhcmdldCBpbiBvcmRlciB0byByZXZhbGlkYXRlIHdoZW5ldmVyIHRoZSB0YXJnZXQgZmllbGQgaXMgdXBkYXRlZFxuICAgICAgICB2YXIgdGFyZ2V0ID0gJCggcGFyYW0gKTtcbiAgICAgICAgaWYgKCB0aGlzLnNldHRpbmdzLm9uZm9jdXNvdXQgJiYgdGFyZ2V0Lm5vdCggXCIudmFsaWRhdGUtZXF1YWxUby1ibHVyXCIgKS5sZW5ndGggKSB7XG4gICAgICAgICAgICB0YXJnZXQuYWRkQ2xhc3MoIFwidmFsaWRhdGUtZXF1YWxUby1ibHVyXCIgKS5vbiggXCJibHVyLnZhbGlkYXRlLWVxdWFsVG9cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCggZWxlbWVudCApLnZhbGlkKCk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0YXJnZXQudmFsKCk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVtb3RlLW1ldGhvZC9cbiAgICByZW1vdGU6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0sIG1ldGhvZCApIHtcbiAgICAgICAgaWYgKCB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XG4gICAgICAgIH1cblxuICAgICAgICBtZXRob2QgPSB0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiICYmIG1ldGhvZCB8fCBcInJlbW90ZVwiO1xuXG4gICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMucHJldmlvdXNWYWx1ZSggZWxlbWVudCwgbWV0aG9kICksXG4gICAgICAgICAgICB2YWxpZGF0b3IsIGRhdGEsIG9wdGlvbkRhdGFTdHJpbmc7XG5cbiAgICAgICAgaWYgKCAhdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZSA9IHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZSB8fCB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXVsgbWV0aG9kIF07XG4gICAgICAgIHRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdWyBtZXRob2QgXSA9IHByZXZpb3VzLm1lc3NhZ2U7XG5cbiAgICAgICAgcGFyYW0gPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgJiYgeyB1cmw6IHBhcmFtIH0gfHwgcGFyYW07XG4gICAgICAgIG9wdGlvbkRhdGFTdHJpbmcgPSAkLnBhcmFtKCAkLmV4dGVuZCggeyBkYXRhOiB2YWx1ZSB9LCBwYXJhbS5kYXRhICkgKTtcbiAgICAgICAgaWYgKCBwcmV2aW91cy5vbGQgPT09IG9wdGlvbkRhdGFTdHJpbmcgKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJldmlvdXMudmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2aW91cy5vbGQgPSBvcHRpb25EYXRhU3RyaW5nO1xuICAgICAgICB2YWxpZGF0b3IgPSB0aGlzO1xuICAgICAgICB0aGlzLnN0YXJ0UmVxdWVzdCggZWxlbWVudCApO1xuICAgICAgICBkYXRhID0ge307XG4gICAgICAgIGRhdGFbIGVsZW1lbnQubmFtZSBdID0gdmFsdWU7XG4gICAgICAgICQuYWpheCggJC5leHRlbmQoIHRydWUsIHtcbiAgICAgICAgICAgIG1vZGU6IFwiYWJvcnRcIixcbiAgICAgICAgICAgIHBvcnQ6IFwidmFsaWRhdGVcIiArIGVsZW1lbnQubmFtZSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjb250ZXh0OiB2YWxpZGF0b3IuY3VycmVudEZvcm0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gcmVzcG9uc2UgPT09IHRydWUgfHwgcmVzcG9uc2UgPT09IFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMsIG1lc3NhZ2UsIHN1Ym1pdHRlZDtcblxuICAgICAgICAgICAgICAgIHZhbGlkYXRvci5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdID0gcHJldmlvdXMub3JpZ2luYWxNZXNzYWdlO1xuICAgICAgICAgICAgICAgIGlmICggdmFsaWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdHRlZCA9IHZhbGlkYXRvci5mb3JtU3VibWl0dGVkO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3IucmVzZXRJbnRlcm5hbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnRvSGlkZSA9IHZhbGlkYXRvci5lcnJvcnNGb3IoIGVsZW1lbnQgKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLmZvcm1TdWJtaXR0ZWQgPSBzdWJtaXR0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5zdWNjZXNzTGlzdC5wdXNoKCBlbGVtZW50ICk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5pbnZhbGlkWyBlbGVtZW50Lm5hbWUgXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc2hvd0Vycm9ycygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gcmVzcG9uc2UgfHwgdmFsaWRhdG9yLmRlZmF1bHRNZXNzYWdlKCBlbGVtZW50LCB7IG1ldGhvZDogbWV0aG9kLCBwYXJhbWV0ZXJzOiB2YWx1ZSB9ICk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yc1sgZWxlbWVudC5uYW1lIF0gPSBwcmV2aW91cy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLmludmFsaWRbIGVsZW1lbnQubmFtZSBdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnNob3dFcnJvcnMoIGVycm9ycyApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cy52YWxpZCA9IHZhbGlkO1xuICAgICAgICAgICAgICAgIHZhbGlkYXRvci5zdG9wUmVxdWVzdCggZWxlbWVudCwgdmFsaWQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgcGFyYW0gKSApO1xuICAgICAgICByZXR1cm4gXCJwZW5kaW5nXCI7XG4gICAgfVxufTsiLCJleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuY29uc3QgY2hlY2tGb3JEYXRhQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuY29uc3QgY2hlY2tGb3JDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gY29uc3RyYWludCB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCBjb25zdHJhaW50KTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICAvKiBcbiAgICAgICAgRXh0cmFjdCBmcm9tIFxuICAgICAgICAtIGRhdGEtYXR0cmlidXRlc1xuICAgICAgICAtIGVsZW1lbnQgYXR0cmlidXRlc1xuICAgICAgICAtIGNsYXNzTmFtZXMgKHgpXG4gICAgICAgIC0gc3RhdGljUnVsZXMgKHgpXG4gICAgKi9cbiAgICBcbiAgICAvL3JlcXVpcmVkXG4gICAgaWYoKGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YUNvbnN0cmFpbnQoaW5wdXQsICdyZXF1aXJlZCcpKSB2YWxpZGF0b3JzLnB1c2goJ3JlcXVpcmVkJyk7XG5cbiAgICAvLyAvL2VtYWlsXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZW1haWwnKSkgdmFsaWRhdG9ycy5wdXNoKCdlbWFpbCcpO1xuXG4gICAgLy8gLy91cmxcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICd1cmwnKSkgdmFsaWRhdG9ycy5wdXNoKCd1cmwnKTtcblxuICAgIC8vIC8vZGF0ZVxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2RhdGUnKSkgdmFsaWRhdG9ycy5wdXNoKCdkYXRlJyk7XG5cbiAgICAvLyAvL2RhdGVJU09cbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdkYXRlSVNPJykpIHZhbGlkYXRvcnMucHVzaCgnZGF0ZUlTTycpO1xuXG4gICAgLy8gLy9udW1iZXJcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdudW1iZXInKSkgdmFsaWRhdG9ycy5wdXNoKCdudW1iZXInKTtcblxuICAgIC8vIC8vZGlnaXRzXG4gICAgLy8gLy90byBkb1xuXG4gICAgLy8gLy9taW5sZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAnbWlubGVuZ3RoJykpIHZhbGlkYXRvcnMucHVzaCgnbWlubGVuZ3RoJyk7XG5cbiAgICAvLyAvL21heGxlbmd0aFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YUNvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKCdtYXhsZW5ndGgnKTtcblxuICAgIC8vIC8vcmFuZ2VsZW5ndGhcblxuICAgIC8vIC8vbWluXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgJ21pbicpKSB2YWxpZGF0b3JzLnB1c2goJ21pbicpO1xuXG4gICAgLy8gLy9tYXhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAnbWF4JykpIHZhbGlkYXRvcnMucHVzaCgnbWF4Jyk7XG5cblxuICAgIC8vIC8vc3RlcFxuICAgIC8vIC8vdG8gZG9cblxuICAgIC8vIC8vZXF1YWxUb1xuICAgIC8vIC8vdG8gZG9cblxuICAgIC8vIC8vcmVtb3RlXG4gICAgLy8gLy90byBkb1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59OyJdfQ==
