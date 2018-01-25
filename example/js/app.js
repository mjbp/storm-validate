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
			settings: Object.assign({}, _defaults2.default, opts)
		}).init());
		return acc;
	}, []);
};

/*
	Check whether a form containing any fields with data-val=true
	Initialise using data-val-true to designate validateable inputs
*/

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

exports.default = {
	init: function init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');

		//delete me please
		this.inputs = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'));

		this.groups = (0, _utils.removeUnvalidatedGroups)(this.inputs.reduce(_utils.extractGroups, {}));

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
			if (_this.setValidityState()) _this.form.submit();else _this.renderErrors(), _this.initRealtimeValidation();
		});

		this.form.addEventListener('reset', function (e) {
			_this.clearErrors();
		});
	},
	initRealtimeValidation: function initRealtimeValidation() {
		var handler = function (e) {
			var group = e.target.getAttribute('name');
			if (this.groups[group].errorDOM) this.removeError(group);
			var validityState = this.setGroupValidityState(group);
			if (!validityState) this.renderError(group);
		}.bind(this);

		//map/over groups instead
		this.inputs.forEach(function (input) {
			var ev = (0, _utils.chooseRealtimeEvent)(input);
			input.addEventListener(ev, handler);
		});
	},
	setGroupValidityState: function setGroupValidityState(group) {
		this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] }, //reset validity and errorMessagesa
		this.groups[group].validators.reduce((0, _utils.validationReducer)(this.groups[group]), true));
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
		this.groups[group].errorDOM = this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild((0, _utils.h)('div', { class: 'error' }, this.groups[group].errorMessages[0]));

		//set aria-invalid on invalid inputs
		this.groups[group].fields.forEach(function (field) {
			field.setAttribute('aria-invalid', 'true');
		});
	},
	addMethod: function addMethod(name, fn, message) {
		this.groups.validators.push(fn);
		//extend messages
	}
}; // import inputPrototype from './input-prototype';

},{"./utils":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CLASSNAMES = exports.CLASSNAMES = {};

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var EMAIL_REGEX = exports.EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//https://mathiasbynens.be/demo/url-regex
var URL_REGEX = exports.URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var DATE_ISO_REGEX = exports.DATE_ISO_REGEX = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

var NUMBER_REGEX = exports.NUMBER_REGEX = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

var DIGITS_REGEX = exports.DIGITS_REGEX = /^\d+$/;

var DOTNETCORE_PARAMS = exports.DOTNETCORE_PARAMS = {
    length: ['min', 'max'],
    range: ['min', 'max'],
    min: ['min'],
    max: ['max'],
    minlength: ['min'],
    maxlength: ['max'],
    remote: ['url', 'type', 'additionalfields'] //??
};

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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _constants = require('./constants');

var regexMethod = function regexMethod(regex) {
    return function (group) {
        return (0, _utils.isOptional)(group) || group.fields.reduce(function (acc, input) {
            return acc = regex.test(input.value), acc;
        }, false);
    };
};

var paramMethod = function paramMethod(type, reducer) {
    return function (group) {
        return (0, _utils.isOptional)(group) || group.fields.reduce(reducer(group.validators.filter(function (validator) {
            return validator.type === type;
        })[0].param), false);
    };
};

exports.default = {
    required: function required(group) {
        return (0, _utils.extractValueFromGroup)(group) !== false;
    },
    email: regexMethod(_constants.EMAIL_REGEX),
    url: regexMethod(_constants.URL_REGEX),
    date: function date(group) {
        return (0, _utils.isOptional)(group) || group.fields.reduce(function (acc, input) {
            return acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc;
        }, false);
    },
    dateISO: regexMethod(_constants.DATE_ISO_REGEX),
    number: regexMethod(_constants.NUMBER_REGEX),
    digits: regexMethod(_constants.DIGITS_REGEX),
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
    min: paramMethod('min', function (param) {
        return function (acc, input) {
            return acc = +input.value >= +param, acc;
        };
    }),
    max: paramMethod('max', function (param) {
        return function (acc, input) {
            return acc = +input.value <= +param, acc;
        };
    }),
    range: paramMethod('range', function (param) {
        return function (acc, input) {
            return acc = +input.value >= +param[0] && +input.value <= +param[1], acc;
        };
    })

    //return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );

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

},{"./constants":4,"./utils":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normaliseValidators = exports.pipe = exports.compose = exports.validationReducer = exports.chooseRealtimeEvent = exports.h = exports.extractErrorMessage = exports.extractGroups = exports.removeUnvalidatedGroups = exports.extractValueFromGroup = exports.isOptional = exports.isRequired = exports.isCheckable = exports.isSelect = undefined;

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

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
}

var isSelect = exports.isSelect = function isSelect(field) {
    return field.nodeName.toLowerCase() === 'select';
};

var isCheckable = exports.isCheckable = function isCheckable(field) {
    return (/radio|checkbox/i.test(field.type)
    );
};

var isRequired = exports.isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
};

//isn't required and no value
var isOptional = exports.isOptional = function isOptional(group) {
    return !isRequired(group) && extractValueFromGroup(group) === false;
};

var hasValue = function hasValue(input) {
    return input.value !== undefined && input.value !== null && input.value.length > 0;
};

var groupValueReducer = function groupValueReducer(value, input) {
    if (isCheckable(input) && input.checked) {
        if (Array.isArray(value)) value.push(input.value);else value = [input.value];
    } else if (hasValue(input)) value = input.value;
    return value;
};

var extractValueFromGroup = exports.extractValueFromGroup = function extractValueFromGroup(group) {
    return group.fields.reduce(groupValueReducer, false);
};

var removeUnvalidatedGroups = exports.removeUnvalidatedGroups = function removeUnvalidatedGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

var extractGroups = exports.extractGroups = function extractGroups(acc, input) {
    if (!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid: false,
            validators: normaliseValidators(input),
            fields: [input]
        };
    } else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

var extractErrorMessage = exports.extractErrorMessage = function extractErrorMessage(validator, group) {
    // to do
    // implement custom vaidation messages
    return _messages2.default[validator.type](validator.param !== undefined ? validator.param : null);
};

var h = exports.h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

var chooseRealtimeEvent = exports.chooseRealtimeEvent = function chooseRealtimeEvent(input) {
    return ['keyup', 'change'][Number(isCheckable(input) || isSelect(input))];
};

var checkForDataRuleConstraint = function checkForDataRuleConstraint(input, constraint) {
    return input.getAttribute('data-rule-' + constraint) && input.getAttribute('data-rule-' + constraint) !== 'false';
};

var checkForDataValConstraint = function checkForDataValConstraint(input, constraint) {
    return input.getAttribute('data-val-' + constraint) && input.getAttribute('data-val-' + constraint) !== 'false';
};

var checkForConstraint = function checkForConstraint(input, constraint) {
    return input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);
};

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)

var validationReducer = exports.validationReducer = function validationReducer(group) {
    return function (acc, validator) {
        if (!_methods2.default[validator.type](group, validator.param !== undefined ? validator.param : null)) {
            acc = {
                valid: false,
                errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [extractErrorMessage(validator, group)]) : [extractErrorMessage(validator, group)]
            };
        }
        return acc;
    };
};

// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

var compose = exports.compose = function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return fns.reduce(function (f, g) {
        return function () {
            return f(g.apply(undefined, arguments));
        };
    });
};
var pipe = exports.pipe = function pipe() {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fns[_key2] = arguments[_key2];
    }

    return compose.apply(compose, fns.reverse());
};

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    var validators = [];
    // To do
    // validate the validation parameters

    /*
        - check if data-val="true"
             validator:
            {
                type: String [required],
                params: Array [optional],
                message: String [optional]
            }
     */
    /*
    //required
    if((input.hasAttribute('required') && input.getAttribute('required') !== 'false') || checkForDataRuleConstraint(input, 'required') || checkForDataValConstraint(input, 'required')) validators.push({type: 'required'});
     //email
    if(checkForConstraint(input, 'email') || checkForDataValConstraint(input, 'email')) validators.push({type: 'email'});
     //url
    if(checkForConstraint(input, 'url') || checkForDataValConstraint(input, 'url')) validators.push({type: 'url'});
     //date
    if(checkForConstraint(input, 'date') || checkForDataValConstraint(input, 'date')) validators.push({type: 'date'});
     //dateISO
    if(checkForConstraint(input, 'dateISO') || checkForDataValConstraint(input, 'dateISO')) validators.push({type: 'dateISO'});
     //number
    if(checkForConstraint(input, 'number') || checkForDataValConstraint(input, 'number')) validators.push({type: 'number'});
     //minlength
    if((input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') || checkForDataRuleConstraint(input, 'minlength') || checkForDataValConstraint(input, 'minlength')) validators.push({type: 'minlength', param: extractValidationParams('minlength')});
     //maxlength
    if((input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') || checkForDataRuleConstraint(input, 'maxlength') || checkForDataValConstraint(input, 'maxlength')) validators.push({type: 'maxlength', param: input.getAttribute('maxlength')});
     //min
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false') || checkForDataRuleConstraint(input, 'min') || checkForDataValConstraint(input, 'min')) validators.push({type: 'min', param: input.getAttribute('min')});
     //max
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false') || checkForDataRuleConstraint(input, 'max') || checkForDataValConstraint(input, 'max')) validators.push({type: 'max', param: input.getAttribute('max')});
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

},{"./messages":6,"./methods":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixBQUU5Rzs7WUFBTyxBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQzlCO01BQUcsR0FBQSxBQUFHLGFBQU4sQUFBRyxBQUFnQixlQUFlLEFBQ2xDO01BQUEsQUFBSSxZ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QixTQUF0QixBQUFzQiwyQkFBUyxBQUN4QztRQUFJLGFBQUosQUFBaUIsQUFDakI7QUFDQTtBQUVBOztBQVdBOzs7Ozs7Ozs7QUE4Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQUFBLEFBQU8sQUFDVjtBQS9ETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0Ly8gbGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICBsZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKGBWYWxpZGF0aW9uIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQgZm9yIHNlbGVjdG9yICR7c2VsfWApO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwgW10pO1xufTtcblxuLypcblx0Q2hlY2sgd2hldGhlciBhIGZvcm0gY29udGFpbmluZyBhbnkgZmllbGRzIHdpdGggZGF0YS12YWw9dHJ1ZVxuXHRJbml0aWFsaXNlIHVzaW5nIGRhdGEtdmFsLXRydWUgdG8gZGVzaWduYXRlIHZhbGlkYXRlYWJsZSBpbnB1dHNcbiovXG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBcblx0aCxcblx0ZXh0cmFjdEdyb3Vwcyxcblx0bm9ybWFsaXNlVmFsaWRhdG9ycyxcblx0Y2hvb3NlUmVhbHRpbWVFdmVudCxcblx0ZXh0cmFjdEVycm9yTWVzc2FnZSxcblx0dmFsaWRhdGlvblJlZHVjZXIsXG5cdHJlbW92ZVVudmFsaWRhdGVkR3JvdXBzXG59IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXG5cdFx0Ly9kZWxldGUgbWUgcGxlYXNlXG5cdFx0dGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSk7XG5cblx0XHR0aGlzLmdyb3VwcyA9IHJlbW92ZVVudmFsaWRhdGVkR3JvdXBzKHRoaXMuaW5wdXRzLnJlZHVjZShleHRyYWN0R3JvdXBzLCB7fSkpO1xuXG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cdFx0XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdyb3Vwcyk7XG5cblx0XHQvKlxuXG5cdFx0MS4gcmVmLiA8aW5wdXQgZGF0YS1ydWxlLW1pbmxlbmd0aD1cIjJcIiBkYXRhLXJ1bGUtbWF4bGVuZ3RoPVwiNFwiIGRhdGEtbXNnLW1pbmxlbmd0aD1cIkF0IGxlYXN0IHR3byBjaGFyc1wiIGRhdGEtbXNnLW1heGxlbmd0aD1cIkF0IG1vc3QgZm91cnMgY2hhcnNcIj5cblxuXG5cdFx0Mi4gcmVmLiBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGVzL2RlbW8vXG5cdFx0XG5cdFx0My4gcmVmLiBDb25zdHJhaW50IHZhbGlkYXRpb24gQVBJXG5cdFx0VmFsaWRhdGlvbi1yZXBhdGVkIGF0dHJpYnV0ZXNcblx0XHRcdC0gcGF0dGVybiwgcmVnZXgsICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybidcblx0XHRcdC0gbWluLCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlLidcblx0XHRcdC0gbWF4LCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlJyxcblx0XHRcdC0gcmVxdWlyZWQsIG5vbmUsICdUaGVyZSBtdXN0IGJlIGEgdmFsdWUnLFxuXHRcdFx0LSBtYXhsZW5ndGgsIGludCBsZW5ndGgsICdUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgKGNvZGUgcG9pbnRzKSBtdXN0IG5vdCBleGNlZWQgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuJyBcblxuXHRcdDQuIHJlZi4gaHR0cHM6Ly9naXRodWIuY29tL2FzcG5ldC9qcXVlcnktdmFsaWRhdGlvbi11bm9idHJ1c2l2ZS9ibG9iL21hc3Rlci9zcmMvanF1ZXJ5LnZhbGlkYXRlLnVub2J0cnVzaXZlLmpzXG5cblx0XHQqL1xuXG5cdFx0Ly92YWxpZGF0ZSB3aG9sZSBmb3JtXG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdExpc3RlbmVycygpe1xuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuY2xlYXJFcnJvcnMoKTtcblx0XHRcdGlmKHRoaXMuc2V0VmFsaWRpdHlTdGF0ZSgpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRlbHNlIHRoaXMucmVuZGVyRXJyb3JzKCksIHRoaXMuaW5pdFJlYWx0aW1lVmFsaWRhdGlvbigpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgZSA9PiB7IHRoaXMuY2xlYXJFcnJvcnMoKTsgfSk7XG5cdH0sXG5cdGluaXRSZWFsdGltZVZhbGlkYXRpb24oKXtcblx0XHRsZXQgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0bGV0IGdyb3VwID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0XHRcdGxldCB2YWxpZGl0eVN0YXRlID0gdGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApO1xuXHRcdFx0XHRpZighdmFsaWRpdHlTdGF0ZSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHQvL21hcC9vdmVyIGdyb3VwcyBpbnN0ZWFkXG5cdFx0dGhpcy5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG5cdFx0XHRsZXQgZXYgPSBjaG9vc2VSZWFsdGltZUV2ZW50KGlucHV0KTtcblx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoZXYsIGhhbmRsZXIpO1xuXHRcdH0pO1xuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSxcblx0XHRcdFx0XHRcdFx0XHR7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9LCAvL3Jlc2V0IHZhbGlkaXR5IGFuZCBlcnJvck1lc3NhZ2VzYVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLnJlZHVjZSh2YWxpZGF0aW9uUmVkdWNlcih0aGlzLmdyb3Vwc1tncm91cF0pLCB0cnVlKSk7XG5cdFx0cmV0dXJuIHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZDtcblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBudW1FcnJvcnMgPSAwO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApO1xuXHRcdFx0IXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCAmJiArK251bUVycm9ycztcblx0XHR9XG5cdFx0cmV0dXJuIG51bUVycm9ycyA9PT0gMDtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuXHRcdGRlbGV0ZSB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET007XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NID0gdGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRDT1JFX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbWluJywgJ21heCddLFxuICAgIHJhbmdlOiBbJ21pbicsICdtYXgnXSxcbiAgICBtaW46IFsnbWluJ10sXG4gICAgbWF4OiAgWydtYXgnXSxcbiAgICBtaW5sZW5ndGg6IFsnbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heCddLFxuICAgIHJlbW90ZTogWyd1cmwnLCAndHlwZScsICdhZGRpdGlvbmFsZmllbGRzJ10vLz8/XG59IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgLy8gZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICAvL3JhbmdlbGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fSBjaGFyYWN0ZXJzIGxvbmcuYDsgfSxcbiAgICAvL3JhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgLy9yZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9zdGVwKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSBtdWx0aXBsZSBvZiAke3Byb3BzfS5gOyB9XG59OyIsImltcG9ydCB7IGlzU2VsZWN0LCBpc0NoZWNrYWJsZSwgaXNSZXF1aXJlZCwgaXNPcHRpb25hbCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgcGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW0pLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gZmFsc2UsXG4gICAgZW1haWw6IHJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IHJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiByZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiByZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogcmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IHBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogcGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWluOiBwYXJhbU1ldGhvZCgnbWluJywgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtLCBhY2MpKSxcbiAgICBtYXg6IHBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW0sIGFjYykpLFxuICAgIHJhbmdlOiBwYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1bMV0pLCBhY2MpKSxcblxuICAgIC8vcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xuICAgIFxuICAgIC8vIHJhbmdlbGVuZ3RoXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDIwXG5cblxuICAgIC8vIHJhbmdlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXG4gICAgLy8gXG4gICAgLy8gc3RlcFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDQxXG5cbiAgICAvLyBlcXVhbFRvXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NzlcblxuICAgIC8vIHJlbW90ZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVtb3RlLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0OTJcblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4vbWVzc2FnZXMnO1xuXG5leHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuLy9pc24ndCByZXF1aXJlZCBhbmQgbm8gdmFsdWVcbmV4cG9ydCBjb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09IGZhbHNlO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5jb25zdCBncm91cFZhbHVlUmVkdWNlciA9ICh2YWx1ZSwgaW5wdXQpID0+IHtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCl7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZS5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIHZhbHVlID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgZWxzZSBpZihoYXNWYWx1ZShpbnB1dCkpIHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsIGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGVkR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIGlmKGdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5sZW5ndGggPiAwKSB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0R3JvdXBzID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSkge1xuICAgICAgICBhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldID0ge1xuICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHtcbiAgICAvLyB0byBkb1xuICAgIC8vIGltcGxlbWVudCBjdXN0b20gdmFpZGF0aW9uIG1lc3NhZ2VzXG4gICAgcmV0dXJuIG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW0gIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbSA6IG51bGwpO1xufTtcblxuZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsdGltZUV2ZW50ID0gaW5wdXQgPT4gWydrZXl1cCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSldO1xuXG5jb25zdCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuY29uc3QgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbmNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsIGNvbnN0cmFpbnQpO1xuXG4vLyBjb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IHR5cGUgPT4gaW5wdXQuaGFzQXR0cmlidXRlKHR5cGUpID8gaW5wdXQuZ2V0QXR0cmlidXRlKHR5cGUpIDogaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXJ1bGUtJHt0eXBlfWApID8gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3R5cGV9YClcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25SZWR1Y2VyID0gZ3JvdXAgPT4gKGFjYywgdmFsaWRhdG9yKSA9PiB7XG4gICAgaWYoIW1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW0gIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbSA6IG51bGwpKSB7XG4gICAgICAgIGFjYyA9IHtcbiAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSA6IFtleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuXG4vLyBjb25zdCBjb21wb3NlciA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKTtcbi8vIGV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZShjb21wb3Nlcik7XG4vLyBleHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2VSaWdodChjb21wb3Nlcik7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBjb21wb3NlLmFwcGx5KGNvbXBvc2UsIGZucy5yZXZlcnNlKCkpO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIC8vIFRvIGRvXG4gICAgLy8gdmFsaWRhdGUgdGhlIHZhbGlkYXRpb24gcGFyYW1ldGVyc1xuXG4gICAgLypcbiAgICAgICAgLSBjaGVjayBpZiBkYXRhLXZhbD1cInRydWVcIlxuXG4gICAgICAgICAgICB2YWxpZGF0b3I6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nIFtyZXF1aXJlZF0sXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBBcnJheSBbb3B0aW9uYWxdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFN0cmluZyBbb3B0aW9uYWxdXG4gICAgICAgICAgICB9XG5cbiAgICAqL1xuICAgIC8qXG4gICAgLy9yZXF1aXJlZFxuICAgIGlmKChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ3JlcXVpcmVkJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ3JlcXVpcmVkJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ3JlcXVpcmVkJ30pO1xuXG4gICAgLy9lbWFpbFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuXG4gICAgLy91cmxcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICd1cmwnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAndXJsJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ3VybCd9KTtcblxuICAgIC8vZGF0ZVxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2RhdGUnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnZGF0ZScpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdkYXRlJ30pO1xuXG4gICAgLy9kYXRlSVNPXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZUlTTycpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdkYXRlSVNPJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2RhdGVJU08nfSk7XG5cbiAgICAvL251bWJlclxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ251bWJlcicpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdudW1iZXInKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuXG4gICAgLy9taW5sZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtaW5sZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW06IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKCdtaW5sZW5ndGgnKX0pO1xuXG4gICAgLy9tYXhsZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heGxlbmd0aCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9KTtcblxuICAgIC8vbWluXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWluJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfSk7XG5cbiAgICAvL21heFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4JykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX0pO1xuXG4gICAgLy9tYXhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9KTtcblxuXG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cblxuICAgIC8vcmVtb3RlXG5cbiAgICAvL2RpZ2l0c1xuXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07Il19
