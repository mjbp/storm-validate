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

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
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

exports.default = {
	init: function init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novaildate');

		this.inputs = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'));
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

		console.log(this);

		//validate whole form
		//set aria-invalid on invalid inputs

		return this;
	},
	addMethod: function addMethod(name, fn, message) {
		this.groups.validators.push(fn);
	}
}; // import inputPrototype from './input-prototype';

},{"./messages":5,"./methods":6,"./utils":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	// callback: null
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("./utils");

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

        return group.reduce(function (acc, input) {
            if ((0, _utils.isSelect)(input)) acc = input.value() && input.value().length > 0;
            if ((0, _utils.isCheckable)(input)) acc = _this.checked;else acc = input.value !== undefined && input.value !== null && input.value.length > 0;
        }, false);
    },

    // https://jqueryvalidation.org/email-method/
    email: function email(value, element) {

        // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
        // Retrieved 2014-01-14
        // If you have a problem with this implementation, report a bug against the above spec
        // Or use custom methods to implement your own email validation
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
    },

    // https://jqueryvalidation.org/url-method/
    url: function url(value, element) {

        // Copyright (c) 2010-2013 Diego Perini, MIT licensed
        // https://gist.github.com/dperini/729294
        // see also https://mathiasbynens.be/demo/url-regex
        // modified to allow protocol-relative URLs
        return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
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
    minlength: function minlength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length >= param;
    },

    // https://jqueryvalidation.org/maxlength-method/
    maxlength: function maxlength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length <= param;
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

},{"./utils":7}],7:[function(require,module,exports){
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

var checkForDataConstraint = function checkForDataConstraint(input, constraint) {
    return input.getAttribute('data-rule-' + constraint) && input.getAttribute('data-rule-' + constraint) !== 'false';
};

var checkForConstraint = function checkForConstraint(input, constraint) {
    return input.getAttribute('type') === constraint || checkForDataConstraint(input, constraint);
};

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    var validators = [];

    console.log(input.getAttribute('required') && input.getAttribute('required') !== 'false');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL21lc3NhZ2VzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL21ldGhvZHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7d0JBQUEsQUFBUyxLQUFULEFBQWMsQUFDakI7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7QUFDRztLQUFJLE1BQU0sTUFBQSxBQUFNLEtBQUssU0FBQSxBQUFTLGlCQUE5QixBQUFVLEFBQVcsQUFBMEIsQUFFbEQ7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxPQUFPLFFBQUEsQUFBUSxpRkFBZixBQUFPLEFBQXVGLEFBRTlHOztZQUFPLEFBQUksT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLElBQU8sQUFDOUI7TUFBRyxHQUFBLEFBQUcsYUFBTixBQUFHLEFBQWdCLGVBQWUsQUFDbEM7TUFBQSxBQUFJLFlBQUssQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7U0FBaUQsQUFDbkQsQUFD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NEQsV0FBWSx1QkFBQSxBQUF1QixPQUFsRyxBQUEyRSxBQUE4QixRQUFRLFdBQUEsQUFBVyxLQUFYLEFBQWdCLEFBR2pJOztBQUNBO0FBRUE7O0FBQ0E7QUFFQTs7QUFDQTtBQUVBOztXQUFBLEFBQU8sQUFDVjtBQTFETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0Ly8gbGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICBsZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKGBWYWxpZGF0aW9uIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQgZm9yIHNlbGVjdG9yICR7c2VsfWApO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0aW5wdXRzOiBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKSxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCkpO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIFtdKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXNlVmFsaWRhdG9ycyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWlsZGF0ZScpO1xuXG5cdFx0dGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSk7XG5cdFx0dGhpcy5ncm91cHMgPSB0aGlzLmlucHV0cy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IHtcblx0XHRcdGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG5cdFx0XHRcdGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSB7XG5cdFx0XHRcdFx0dmFsaWQ6ICBmYWxzZSxcblx0XHRcdFx0XHR2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcblx0XHRcdFx0XHRmaWVsZHM6IFtpbnB1dF1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sIFtdKTtcblxuXHRcdC8vIHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdC8vIFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIpO1xuXHRcdC8vIFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmZvY3VzSGFuZGxlci5iaW5kKHRoaXMpKTtcblx0XHQvLyBcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJsdXJIYW5kbGVyLmJpbmQodGhpcykpO1xuXHRcdC8vIFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW52YWxpZCcsIHRoaXMuaW52YWxpZEhhbmRsZXIuYmluZCh0aGlzKSk7XG5cdFx0Ly8gfSk7XG5cblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcblx0XHRcdFxuXG5cdFx0fSk7XG5cblx0XHQvKlxuXG5cdFx0cmVmLiA8aW5wdXQgZGF0YS1ydWxlLW1pbmxlbmd0aD1cIjJcIiBkYXRhLXJ1bGUtbWF4bGVuZ3RoPVwiNFwiIGRhdGEtbXNnLW1pbmxlbmd0aD1cIkF0IGxlYXN0IHR3byBjaGFyc1wiIGRhdGEtbXNnLW1heGxlbmd0aD1cIkF0IG1vc3QgZm91cnMgY2hhcnNcIj5cblxuXG5cdFx0cmVmLiBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGVzL2RlbW8vXG5cdFx0XG5cdFx0cmVmLiBDb25zdHJhaW50IHZhbGlkYXRpb24gQVBJXG5cdFx0VmFsaWRhdGlvbi1yZXBhdGVkIGF0dHJpYnV0ZXNcblx0XHRcdC0gcGF0dGVybiwgcmVnZXgsICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybidcblx0XHRcdC0gbWluLCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlLidcblx0XHRcdC0gbWF4LCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlJyxcblx0XHRcdC0gcmVxdWlyZWQsIG5vbmUsICdUaGVyZSBtdXN0IGJlIGEgdmFsdWUnLFxuXHRcdFx0LSBtYXhsZW5ndGgsIGludCBsZW5ndGgsICdUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgKGNvZGUgcG9pbnRzKSBtdXN0IG5vdCBleGNlZWQgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuJyBcblxuXHRcdCovXG5cblx0XHRjb25zb2xlLmxvZyh0aGlzKTtcblxuXHRcdC8vdmFsaWRhdGUgd2hvbGUgZm9ybVxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGFkZE1ldGhvZChuYW1lLCBmbiwgbWVzc2FnZSl7XG5cdFx0dGhpcy5ncm91cHMudmFsaWRhdG9ycy5wdXNoKGZuKVxuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICByYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgcmFuZ2UocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0uYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVxdWlyZWQtbWV0aG9kL1xuICAgIC8vIG9sZFJlcXVpcmVkOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXG4gICAgLy8gICAgIC8vIENoZWNrIGlmIGRlcGVuZGVuY3kgaXMgbWV0XG4gICAgLy8gICAgIGlmICggIXRoaXMuZGVwZW5kKCBwYXJhbSwgZWxlbWVudCApICkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGlmICggZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiICkge1xuXG4gICAgLy8gICAgICAgICAvLyBDb3VsZCBiZSBhbiBhcnJheSBmb3Igc2VsZWN0LW11bHRpcGxlIG9yIGEgc3RyaW5nLCBib3RoIGFyZSBmaW5lIHRoaXMgd2F5XG4gICAgLy8gICAgICAgICB2YXIgdmFsID0gJCggZWxlbWVudCApLnZhbCgpO1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbCAmJiB2YWwubGVuZ3RoID4gMDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBpZiAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgKSB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICkgPiAwO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmxlbmd0aCA+IDA7XG4gICAgLy8gfSxcblxuICAgIHJlcXVpcmVkKGdyb3VwKXtcbiAgICAgICAgcmV0dXJuIGdyb3VwLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgaWYoaXNTZWxlY3QoaW5wdXQpKSBhY2MgPSAoaW5wdXQudmFsdWUoKSAmJiBpbnB1dC52YWx1ZSgpLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgaWYoaXNDaGVja2FibGUoaW5wdXQpKSBhY2MgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICBlbHNlIGFjYyA9IGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMDsgXG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lbWFpbC1tZXRob2QvXG4gICAgZW1haWw6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblxuICAgICAgICAvLyBGcm9tIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbiAgICAgICAgLy8gUmV0cmlldmVkIDIwMTQtMDEtMTRcbiAgICAgICAgLy8gSWYgeW91IGhhdmUgYSBwcm9ibGVtIHdpdGggdGhpcyBpbXBsZW1lbnRhdGlvbiwgcmVwb3J0IGEgYnVnIGFnYWluc3QgdGhlIGFib3ZlIHNwZWNcbiAgICAgICAgLy8gT3IgdXNlIGN1c3RvbSBtZXRob2RzIHRvIGltcGxlbWVudCB5b3VyIG93biBlbWFpbCB2YWxpZGF0aW9uXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC8udGVzdCggdmFsdWUgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy91cmwtbWV0aG9kL1xuICAgIHVybDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXG4gICAgICAgIC8vIENvcHlyaWdodCAoYykgMjAxMC0yMDEzIERpZWdvIFBlcmluaSwgTUlUIGxpY2Vuc2VkXG4gICAgICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2RwZXJpbmkvNzI5Mjk0XG4gICAgICAgIC8vIHNlZSBhbHNvIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuICAgICAgICAvLyBtb2RpZmllZCB0byBhbGxvdyBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pLnRlc3QoIHZhbHVlICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZGF0ZS1tZXRob2QvXG4gICAgZGF0ZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICEvSW52YWxpZHxOYU4vLnRlc3QoIG5ldyBEYXRlKCB2YWx1ZSApLnRvU3RyaW5nKCkgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kYXRlSVNPLW1ldGhvZC9cbiAgICBkYXRlSVNPOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLy50ZXN0KCB2YWx1ZSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL251bWJlci1tZXRob2QvXG4gICAgbnVtYmVyOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC8udGVzdCggdmFsdWUgKTtcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kaWdpdHMtbWV0aG9kL1xuICAgIGRpZ2l0czogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkKyQvLnRlc3QoIHZhbHVlICk7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWlubGVuZ3RoLW1ldGhvZC9cbiAgICBtaW5sZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBsZW5ndGggPj0gcGFyYW07XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWF4bGVuZ3RoLW1ldGhvZC9cbiAgICBtYXhsZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBsZW5ndGggPD0gcGFyYW07XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2VsZW5ndGgtbWV0aG9kL1xuICAgIHJhbmdlbGVuZ3RoOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgKCBsZW5ndGggPj0gcGFyYW1bIDAgXSAmJiBsZW5ndGggPD0gcGFyYW1bIDEgXSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21pbi1tZXRob2QvXG4gICAgbWluOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlID49IHBhcmFtO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21heC1tZXRob2QvXG4gICAgbWF4OiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlIDw9IHBhcmFtO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlLW1ldGhvZC9cbiAgICByYW5nZTogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIHN0ZXA6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG4gICAgICAgIHZhciB0eXBlID0gJCggZWxlbWVudCApLmF0dHIoIFwidHlwZVwiICksXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBcIlN0ZXAgYXR0cmlidXRlIG9uIGlucHV0IHR5cGUgXCIgKyB0eXBlICsgXCIgaXMgbm90IHN1cHBvcnRlZC5cIixcbiAgICAgICAgICAgIHN1cHBvcnRlZFR5cGVzID0gWyBcInRleHRcIiwgXCJudW1iZXJcIiwgXCJyYW5nZVwiIF0sXG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAoIFwiXFxcXGJcIiArIHR5cGUgKyBcIlxcXFxiXCIgKSxcbiAgICAgICAgICAgIG5vdFN1cHBvcnRlZCA9IHR5cGUgJiYgIXJlLnRlc3QoIHN1cHBvcnRlZFR5cGVzLmpvaW4oKSApLFxuICAgICAgICAgICAgZGVjaW1hbFBsYWNlcyA9IGZ1bmN0aW9uKCBudW0gKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gKCBcIlwiICsgbnVtICkubWF0Y2goIC8oPzpcXC4oXFxkKykpPyQvICk7XG4gICAgICAgICAgICAgICAgaWYgKCAhbWF0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE51bWJlciBvZiBkaWdpdHMgcmlnaHQgb2YgZGVjaW1hbCBwb2ludC5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbIDEgXSA/IG1hdGNoWyAxIF0ubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b0ludCA9IGZ1bmN0aW9uKCBudW0gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoIG51bSAqIE1hdGgucG93KCAxMCwgZGVjaW1hbHMgKSApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgIGRlY2ltYWxzO1xuXG4gICAgICAgIC8vIFdvcmtzIG9ubHkgZm9yIHRleHQsIG51bWJlciBhbmQgcmFuZ2UgaW5wdXQgdHlwZXNcbiAgICAgICAgLy8gVE9ETyBmaW5kIGEgd2F5IHRvIHN1cHBvcnQgaW5wdXQgdHlwZXMgZGF0ZSwgZGF0ZXRpbWUsIGRhdGV0aW1lLWxvY2FsLCBtb250aCwgdGltZSBhbmQgd2Vla1xuICAgICAgICBpZiAoIG5vdFN1cHBvcnRlZCApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggZXJyb3JNZXNzYWdlICk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWNpbWFscyA9IGRlY2ltYWxQbGFjZXMoIHBhcmFtICk7XG5cbiAgICAgICAgLy8gVmFsdWUgY2FuJ3QgaGF2ZSB0b28gbWFueSBkZWNpbWFsc1xuICAgICAgICBpZiAoIGRlY2ltYWxQbGFjZXMoIHZhbHVlICkgPiBkZWNpbWFscyB8fCB0b0ludCggdmFsdWUgKSAlIHRvSW50KCBwYXJhbSApICE9PSAwICkge1xuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsaWQ7XG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgZXF1YWxUbzogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblxuICAgICAgICAvLyBCaW5kIHRvIHRoZSBibHVyIGV2ZW50IG9mIHRoZSB0YXJnZXQgaW4gb3JkZXIgdG8gcmV2YWxpZGF0ZSB3aGVuZXZlciB0aGUgdGFyZ2V0IGZpZWxkIGlzIHVwZGF0ZWRcbiAgICAgICAgdmFyIHRhcmdldCA9ICQoIHBhcmFtICk7XG4gICAgICAgIGlmICggdGhpcy5zZXR0aW5ncy5vbmZvY3Vzb3V0ICYmIHRhcmdldC5ub3QoIFwiLnZhbGlkYXRlLWVxdWFsVG8tYmx1clwiICkubGVuZ3RoICkge1xuICAgICAgICAgICAgdGFyZ2V0LmFkZENsYXNzKCBcInZhbGlkYXRlLWVxdWFsVG8tYmx1clwiICkub24oIFwiYmx1ci52YWxpZGF0ZS1lcXVhbFRvXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoIGVsZW1lbnQgKS52YWxpZCgpO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0LnZhbCgpO1xuICAgIH0sXG5cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlbW90ZS1tZXRob2QvXG4gICAgcmVtb3RlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtLCBtZXRob2QgKSB7XG4gICAgICAgIGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0aG9kID0gdHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIiAmJiBtZXRob2QgfHwgXCJyZW1vdGVcIjtcblxuICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLnByZXZpb3VzVmFsdWUoIGVsZW1lbnQsIG1ldGhvZCApLFxuICAgICAgICAgICAgdmFsaWRhdG9yLCBkYXRhLCBvcHRpb25EYXRhU3RyaW5nO1xuXG4gICAgICAgIGlmICggIXRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdICkge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgPSBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgfHwgdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdO1xuICAgICAgICB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXVsgbWV0aG9kIF0gPSBwcmV2aW91cy5tZXNzYWdlO1xuXG4gICAgICAgIHBhcmFtID0gdHlwZW9mIHBhcmFtID09PSBcInN0cmluZ1wiICYmIHsgdXJsOiBwYXJhbSB9IHx8IHBhcmFtO1xuICAgICAgICBvcHRpb25EYXRhU3RyaW5nID0gJC5wYXJhbSggJC5leHRlbmQoIHsgZGF0YTogdmFsdWUgfSwgcGFyYW0uZGF0YSApICk7XG4gICAgICAgIGlmICggcHJldmlvdXMub2xkID09PSBvcHRpb25EYXRhU3RyaW5nICkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzLnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXMub2xkID0gb3B0aW9uRGF0YVN0cmluZztcbiAgICAgICAgdmFsaWRhdG9yID0gdGhpcztcbiAgICAgICAgdGhpcy5zdGFydFJlcXVlc3QoIGVsZW1lbnQgKTtcbiAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICBkYXRhWyBlbGVtZW50Lm5hbWUgXSA9IHZhbHVlO1xuICAgICAgICAkLmFqYXgoICQuZXh0ZW5kKCB0cnVlLCB7XG4gICAgICAgICAgICBtb2RlOiBcImFib3J0XCIsXG4gICAgICAgICAgICBwb3J0OiBcInZhbGlkYXRlXCIgKyBlbGVtZW50Lm5hbWUsXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY29udGV4dDogdmFsaWRhdG9yLmN1cnJlbnRGb3JtLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IHJlc3BvbnNlID09PSB0cnVlIHx8IHJlc3BvbnNlID09PSBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLCBtZXNzYWdlLCBzdWJtaXR0ZWQ7XG5cbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdWyBtZXRob2QgXSA9IHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZTtcbiAgICAgICAgICAgICAgICBpZiAoIHZhbGlkICkge1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXR0ZWQgPSB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZDtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnJlc2V0SW50ZXJuYWxzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci50b0hpZGUgPSB2YWxpZGF0b3IuZXJyb3JzRm9yKCBlbGVtZW50ICk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5mb3JtU3VibWl0dGVkID0gc3VibWl0dGVkO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc3VjY2Vzc0xpc3QucHVzaCggZWxlbWVudCApO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3IuaW52YWxpZFsgZWxlbWVudC5uYW1lIF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yLnNob3dFcnJvcnMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHJlc3BvbnNlIHx8IHZhbGlkYXRvci5kZWZhdWx0TWVzc2FnZSggZWxlbWVudCwgeyBtZXRob2Q6IG1ldGhvZCwgcGFyYW1ldGVyczogdmFsdWUgfSApO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnNbIGVsZW1lbnQubmFtZSBdID0gcHJldmlvdXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5pbnZhbGlkWyBlbGVtZW50Lm5hbWUgXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvci5zaG93RXJyb3JzKCBlcnJvcnMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMudmFsaWQgPSB2YWxpZDtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3Iuc3RvcFJlcXVlc3QoIGVsZW1lbnQsIHZhbGlkICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHBhcmFtICkgKTtcbiAgICAgICAgcmV0dXJuIFwicGVuZGluZ1wiO1xuICAgIH1cbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuY29uc3QgY2hlY2tGb3JEYXRhQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuY29uc3QgY2hlY2tGb3JDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gY29uc3RyYWludCB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCBjb25zdHJhaW50KTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcblxuICAgIGNvbnNvbGUubG9nKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSk7XG4gICAgLyogXG4gICAgICAgIEV4dHJhY3QgZnJvbSBcbiAgICAgICAgLSBkYXRhLWF0dHJpYnV0ZXNcbiAgICAgICAgLSBlbGVtZW50IGF0dHJpYnV0ZXNcbiAgICAgICAgLSBjbGFzc05hbWVzICh4KVxuICAgICAgICAtIHN0YXRpY1J1bGVzICh4KVxuICAgICovXG4gICAgXG4gICAgLy9yZXF1aXJlZFxuICAgIGlmKChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSkgdmFsaWRhdG9ycy5wdXNoKCdyZXF1aXJlZCcpO1xuXG4gICAgLy8gLy9lbWFpbFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykpIHZhbGlkYXRvcnMucHVzaCgnZW1haWwnKTtcblxuICAgIC8vIC8vdXJsXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAndXJsJykpIHZhbGlkYXRvcnMucHVzaCgndXJsJyk7XG5cbiAgICAvLyAvL2RhdGVcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdkYXRlJykpIHZhbGlkYXRvcnMucHVzaCgnZGF0ZScpO1xuXG4gICAgLy8gLy9kYXRlSVNPXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZUlTTycpKSB2YWxpZGF0b3JzLnB1c2goJ2RhdGVJU08nKTtcblxuICAgIC8vIC8vbnVtYmVyXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnbnVtYmVyJykpIHZhbGlkYXRvcnMucHVzaCgnbnVtYmVyJyk7XG5cbiAgICAvLyAvL2RpZ2l0c1xuICAgIC8vIC8vdG8gZG9cblxuICAgIC8vIC8vbWlubGVuZ3RoXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goJ21pbmxlbmd0aCcpO1xuXG4gICAgLy8gLy9tYXhsZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykpIHZhbGlkYXRvcnMucHVzaCgnbWF4bGVuZ3RoJyk7XG5cbiAgICAvLyAvL3JhbmdlbGVuZ3RoXG5cbiAgICAvLyAvL21pblxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YUNvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSkgdmFsaWRhdG9ycy5wdXNoKCdtaW4nKTtcblxuICAgIC8vIC8vbWF4XG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goJ21heCcpO1xuXG5cbiAgICAvLyAvL3N0ZXBcbiAgICAvLyAvL3RvIGRvXG5cbiAgICAvLyAvL2VxdWFsVG9cbiAgICAvLyAvL3RvIGRvXG5cbiAgICAvLyAvL3JlbW90ZVxuICAgIC8vIC8vdG8gZG9cblxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTsiXX0=
