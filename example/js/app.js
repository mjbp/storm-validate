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

var DOTNETCORE_ADAPTORS = exports.DOTNETCORE_ADAPTORS = [
//'regex', -> same as pattern, how is it applied to an element? pattern attribute? data-val-regex?
'date', 'digits', 'email', 'number', 'url', 'length', 'range', 'equalto', 'required', 'remote', 'password' //-> maps to min, nonalphamain, and regex methods
];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixBQUU5Rzs7WUFBTyxBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQzlCO01BQUcsR0FBQSxBQUFHLGFBQU4sQUFBRyxBQUFnQixlQUFlLEFBQ2xDO01BQUEsQUFBSSxZQUFLLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ25ELEFBQ047YUFBVSxPQUFBLEFBQU8sT0FBUCxBQUFjLHdCQUZoQixBQUFpRCxBQUUvQyxBQUE0QjtBQUZtQixBQUN6RCxHQURRLEVBQVQsQUFBUyxBQUdOLEFBQ0g7U0FBQSxBQUFPLEFBQ1A7QUFQTSxFQUFBLEVBQVAsQUFBTyxBQU9KLEFBQ0g7QUFkRDs7QUFnQkE7Ozs7O2tCQUtlLEVBQUUsTSxBQUFGOzs7Ozs7Ozs7QUN2QmY7OztBQVVlLHVCQUNQLEFBQ047QUFDQTtPQUFBLEFBQUssS0FBTCxBQUFVLGFBQVYsQUFBdUIsY0FBdkIsQUFBcUMsQUFFckM7O0FBQ0E7T0FBQSxBQUFLLFNBQVMsTUFBQSxBQUFNLEtBQUssS0FBQSxBQUFLLEtBQUwsQUFBVSxpQkFBbkMsQUFBYyxBQUFXLEFBQTJCLEFBRXBEOztPQUFBLEFBQUssU0FBUyxvQ0FBd0IsS0FBQSxBQUFLLE9BQUwsQUFBWSw2QkFBbEQsQUFBYyxBQUF3QixBQUFrQyxBQUV4RTs7T0FBQSxBQUFLLEFBR0w7O1VBQUEsQUFBUSxJQUFJLEtBQVosQUFBaUIsQUFFakI7O0FBbUJBOzs7Ozs7Ozs7Ozs7OztBQUVBOztTQUFBLEFBQU8sQUFDUDtBQXJDYSxBQXNDZDtBQXRDYyx5Q0FzQ0M7Y0FDZDs7T0FBQSxBQUFLLEtBQUwsQUFBVSxpQkFBVixBQUEyQixVQUFVLGFBQUssQUFDekM7S0FBQSxBQUFFLEFBQ0Y7U0FBQSxBQUFLLEFBQ0w7T0FBRyxNQUFILEFBQUcsQUFBSyxvQkFBb0IsTUFBQSxBQUFLLEtBQWpDLEFBQTRCLEFBQVUsY0FDakMsTUFBQSxBQUFLLGdCQUFnQixNQUFyQixBQUFxQixBQUFLLEFBQy9CO0FBTEQsQUFPQTs7T0FBQSxBQUFLLEtBQUwsQUFBVSxpQkFBVixBQUEyQixTQUFTLGFBQUssQUFBRTtTQUFBLEFBQUssQUFBZ0I7QUFBaEUsQUFDQTtBQS9DYSxBQWdEZDtBQWhEYywyREFnRFUsQUFDdkI7TUFBSSxvQkFBVSxBQUFTLEdBQUcsQUFDeEI7T0FBSSxRQUFRLEVBQUEsQUFBRSxPQUFGLEFBQVMsYUFBckIsQUFBWSxBQUFzQixBQUNsQztPQUFHLEtBQUEsQUFBSyxPQUFMLEFBQVksT0FBZixBQUFzQixVQUFVLEtBQUEsQUFBSyxZQUFMLEFBQWlCLEFBQ2pEO09BQUksZ0JBQWdCLEtBQUEsQUFBSyxzQkFBekIsQUFBb0IsQUFBMkIsQUFDL0M7T0FBRyxDQUFILEFBQUksZUFBZSxLQUFBLEFBQUssWUFBTCxBQUFpQixBQUNwQztBQUxZLEdBQUEsQ0FBQSxBQUtYLEtBTEgsQUFBYyxBQUtOLEFBRVI7O0FBQ0E7T0FBQSxBQUFLLE9BQUwsQUFBWSxRQUFRLGlCQUFTLEFBQzVCO09BQUksS0FBSyxnQ0FBVCxBQUFTLEFBQW9CLEFBQzdCO1NBQUEsQUFBTSxpQkFBTixBQUF1QixJQUF2QixBQUEyQixBQUMzQjtBQUhELEFBSUE7QUE3RGEsQUE4RGQ7QUE5RGMsdURBQUEsQUE4RFEsT0FBTSxBQUMzQjtPQUFBLEFBQUssT0FBTCxBQUFZLFNBQVMsT0FBQSxBQUFPLE9BQVAsQUFBYyxJQUM3QixLQUFBLEFBQUssT0FEVSxBQUNmLEFBQVksUUFDWixFQUFFLE9BQUYsQUFBUyxNQUFNLGVBRkEsQUFFZixBQUE4QixNQUFNLEFBQ3BDO09BQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixXQUFuQixBQUE4QixPQUFPLDhCQUFrQixLQUFBLEFBQUssT0FBNUQsQUFBcUMsQUFBa0IsQUFBWSxTQUh6RSxBQUFxQixBQUdmLEFBQTRFLEFBQ2xGO1NBQU8sS0FBQSxBQUFLLE9BQUwsQUFBWSxPQUFuQixBQUEwQixBQUMxQjtBQXBFYSxBQXFFZDtBQXJFYywrQ0FxRUksQUFDakI7TUFBSSxZQUFKLEFBQWdCLEFBQ2hCO09BQUksSUFBSixBQUFRLFNBQVMsS0FBakIsQUFBc0IsUUFBTyxBQUM1QjtRQUFBLEFBQUssc0JBQUwsQUFBMkIsQUFDM0I7SUFBQyxLQUFBLEFBQUssT0FBTCxBQUFZLE9BQWIsQUFBb0IsU0FBUyxFQUE3QixBQUErQixBQUMvQjtBQUNEO1NBQU8sY0FBUCxBQUFxQixBQUNyQjtBQTVFYSxBQTZFZDtBQTdFYyxxQ0E2RUQsQUFDWjtPQUFJLElBQUosQUFBUSxTQUFTLEtBQWpCLEFBQXNCLFFBQU8sQUFDNUI7T0FBRyxLQUFBLEFBQUssT0FBTCxBQUFZLE9BQWYsQUFBc0IsVUFBVSxLQUFBLEFBQUssWUFBTCxBQUFpQixBQUNqRDtBQUNEO0FBakZhLEFBa0ZkO0FBbEZjLG1DQUFBLEFBa0ZGO09BQ1gsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixTQUFuQixBQUE0QixXQUE1QixBQUF1QyxZQUFZLEtBQUEsQUFBSyxPQUFMLEFBQVksT0FBL0QsQUFBc0UsQUFDdEU7T0FBQSxBQUFLLE9BQUwsQUFBWSxPQUFaLEFBQW1CLE9BQW5CLEFBQTBCLFFBQVEsaUJBQVMsQUFBRTtTQUFBLEFBQU0sZ0JBQU4sQUFBc0IsQUFBa0I7QUFGcEUsQUFFakIsS0FGaUIsQUFDakIsQ0FDdUYsQUFDdkY7U0FBTyxLQUFBLEFBQUssT0FBTCxBQUFZLE9BQW5CLEFBQTBCLEFBQzFCO0FBdEZhLEFBdUZkO0FBdkZjLHVDQXVGQSxBQUNiO0FBQ0E7T0FBSSxJQUFKLEFBQVEsU0FBUyxLQUFqQixBQUFzQixRQUFPLEFBQzVCO09BQUcsQ0FBQyxLQUFBLEFBQUssT0FBTCxBQUFZLE9BQWhCLEFBQXVCLE9BQU8sS0FBQSxBQUFLLFlBQUwsQUFBaUIsQUFDL0M7QUFDRDtBQTVGYSxBQTZGZDtBQTdGYyxtQ0FBQSxBQTZGRixPQUFNLEFBQ2pCO09BQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixXQUFXLEtBQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUNwQixPQUFPLEtBQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixPQUFuQixBQUEwQixTQURiLEFBQ29CLEdBRHBCLEFBRXBCLFdBRm9CLEFBR3BCLFlBQVksY0FBQSxBQUFFLE9BQU8sRUFBRSxPQUFYLEFBQVMsQUFBUyxXQUFXLEtBQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixjQUh0RSxBQUE4QixBQUdSLEFBQTZCLEFBQWlDLEFBRXBGOztBQUNBO09BQUEsQUFBSyxPQUFMLEFBQVksT0FBWixBQUFtQixPQUFuQixBQUEwQixRQUFRLGlCQUFTLEFBQUU7U0FBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQW5CLEFBQW1DLEFBQVU7QUFBMUYsQUFDQTtBQXJHYSxBQXNHZDtBQXRHYywrQkFBQSxBQXNHSixNQXRHSSxBQXNHRSxJQXRHRixBQXNHTSxTQUFRLEFBQzNCO09BQUEsQUFBSyxPQUFMLEFBQVksV0FBWixBQUF1QixLQUF2QixBQUE0QixBQUM1QjtBQUNBO0EsQUF6R2E7QUFBQSxBQUNkLEdBWkQ7Ozs7Ozs7O0FDQU8sSUFBTSxrQ0FBTixBQUFtQjs7QUFFMUI7QUFDTyxJQUFNLG9DQUFOLEFBQW9COztBQUUzQjtBQUNPLElBQU0sZ0NBQU4sQUFBa0I7O0FBRWxCLElBQU0sMENBQU4sQUFBdUI7O0FBRXZCLElBQU0sc0NBQU4sQUFBcUI7O0FBRXJCLElBQU0sc0NBQU4sQUFBcUI7O0FBRXJCLElBQU07WUFDRCxDQUFBLEFBQUMsT0FEb0IsQUFDckIsQUFBUSxBQUNoQjtXQUFPLENBQUEsQUFBQyxPQUZxQixBQUV0QixBQUFRLEFBQ2Y7U0FBSyxDQUh3QixBQUd4QixBQUFDLEFBQ047U0FBTSxDQUp1QixBQUl2QixBQUFDLEFBQ1A7ZUFBVyxDQUxrQixBQUtsQixBQUFDLEFBQ1o7ZUFBVyxDQU5rQixBQU1sQixBQUFDLEFBQ1o7WUFBUSxDQUFBLEFBQUMsT0FBRCxBQUFRLFFBUGEsQUFPckIsQUFBZ0Isb0JBUHJCLEFBQTBCLEFBT2M7QUFQZCxBQUM3Qjs7QUFTRyxJQUFNO0FBQ1Q7QUFEK0IsQUFFL0IsUUFGK0IsQUFHL0IsVUFIK0IsQUFJL0IsU0FKK0IsQUFLL0IsVUFMK0IsQUFNL0IsT0FOK0IsQUFPL0IsVUFQK0IsQUFRL0IsU0FSK0IsQUFTL0IsV0FUK0IsQUFVL0IsWUFWK0IsQUFXL0IsVUFYK0IsQUFZL0IsV0FaRyxBQUE0QixBQVlwQjtBQVpvQjs7Ozs7Ozs7O2VDeEJwQixBQUNBLEFBQ2Q7ZUFBYyxBQUNkO0EsQUFIYztBQUFBLEFBQ2Q7Ozs7Ozs7OztBQ0RjLGtDQUNBLEFBQUU7ZUFBQSxBQUFPLEFBQTRCO0FBRHJDLEFBRVg7QUFGVyw0QkFFSCxBQUFFO2VBQUEsQUFBTyxBQUF3QztBQUY5QyxBQUdYO0FBSFcsd0JBR04sQUFBRTtlQUFBLEFBQU8sQUFBOEI7QUFIakMsQUFJWDtBQUpXLDBCQUlKLEFBQUU7ZUFBQSxBQUFPLEFBQStCO0FBSnBDLEFBS1g7QUFMVyxnQ0FLRCxBQUFFO2VBQUEsQUFBTyxBQUFxQztBQUw3QyxBQU1YO0FBTlcsOEJBTUYsQUFBRTtlQUFBLEFBQU8sQUFBaUM7QUFOeEMsQUFPWDtBQVBXLDhCQU9GLEFBQUU7ZUFBQSxBQUFPLEFBQThCO0FBUHJDLEFBUVg7QUFSVyxrQ0FBQSxBQVFELE9BQU8sQUFBRTs4Q0FBQSxBQUFvQyxRQUFzQjtBQVJsRSxBQVNYO0FBVFcsa0NBQUEsQUFTRCxPQUFPLEFBQUU7MENBQUEsQUFBZ0MsUUFBc0I7QUFUOUQsQUFVWDtBQVZXLHNCQUFBLEFBVVAsT0FBTSxBQUFFOytEQUFxRCxDQUFyRCxBQUFxRCxBQUFDLFNBQVk7QUFWbkUsQUFXWDtBQVhXLHNCQUFBLEFBV1AsT0FBTSxBQUFFO2tFQUFBLEFBQXdELFFBQVM7QSxBQVhsRTtBQUFBLEFBQ1g7Ozs7Ozs7OztBQ0RKOztBQUNBOztBQUVBLElBQU0sY0FBYyxTQUFkLEFBQWMsbUJBQUE7V0FBUyxpQkFBQTtlQUFTLHVCQUFBLEFBQVcsZ0JBQVMsQUFBTSxPQUFOLEFBQWEsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sTUFBQSxBQUFNLEtBQUssTUFBakIsQUFBTSxBQUFpQixRQUF4QyxBQUFnRDtBQUFwRSxTQUFBLEVBQTdCLEFBQTZCLEFBQTBFO0FBQWhIO0FBQXBCOztBQUVBLElBQU0sY0FBYyxTQUFkLEFBQWMsWUFBQSxBQUFDLE1BQUQsQUFBTyxTQUFQO1dBQW1CLGlCQUFBO2VBQVMsdUJBQUEsQUFBVyxnQkFBVSxBQUFNLE9BQU4sQUFBYSxxQkFBZSxBQUFNLFdBQU4sQUFBaUIsT0FBTyxxQkFBQTttQkFBYSxVQUFBLEFBQVUsU0FBdkIsQUFBZ0M7QUFBeEQsU0FBQSxFQUFBLEFBQThELEdBQTFGLEFBQW9CLEFBQXlFLEtBQXpFLENBQXBCLEVBQTlCLEFBQThCLEFBQXFHO0FBQXRKO0FBQXBCOzs7Y0FHYyx5QkFBQTtlQUFTLGtDQUFBLEFBQXNCLFdBQS9CLEFBQTBDO0FBRHpDLEFBRVg7V0FBTyx1QkFGSSxBQUdYO1NBQUssdUJBSE0sQUFJWDtVQUFNLHFCQUFBO2VBQVMsdUJBQUEsQUFBVyxnQkFBUyxBQUFNLE9BQU4sQUFBYSxPQUFPLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxDQUFDLGNBQUEsQUFBYyxLQUFLLElBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxPQUF6QyxBQUFPLEFBQW1CLEFBQXNCLGFBQWpFLEFBQThFO0FBQWxHLFNBQUEsRUFBN0IsQUFBNkIsQUFBd0c7QUFKaEksQUFLWDthQUFTLHVCQUxFLEFBTVg7WUFBUSx1QkFORyxBQU9YO1lBQVEsdUJBUEcsQUFRWDsyQkFBVyxBQUNQLGFBQ0EsaUJBQUE7ZUFBUyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sTUFBQSxBQUFNLFFBQVEsTUFBZCxBQUFvQixTQUFTLE1BQUEsQUFBTSxNQUFOLEFBQVksVUFBVSxDQUFuRCxBQUFvRCxRQUFRLENBQUMsTUFBQSxBQUFNLE1BQVAsQUFBYSxVQUFVLENBQXpGLEFBQTBGLE9BQTNHLEFBQWtIO0FBQTNIO0FBVk8sQUFRQSxBQUlYLEtBSlc7MkJBSUEsQUFDUCxhQUNBLGlCQUFBO2VBQVMsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLE1BQUEsQUFBTSxRQUFRLE1BQWQsQUFBb0IsU0FBUyxNQUFBLEFBQU0sTUFBTixBQUFZLFVBQVUsQ0FBbkQsQUFBb0QsUUFBUSxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUF6RixBQUEwRixPQUEzRyxBQUFrSDtBQUEzSDtBQWRPLEFBWUEsQUFJWCxLQUpXO3FCQUlOLEFBQVksT0FBTyxpQkFBQTtlQUFTLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxDQUFDLE1BQUQsQUFBTyxTQUFTLENBQXRCLEFBQXVCLE9BQXhDLEFBQStDO0FBQXhEO0FBaEJiLEFBZ0JOLEFBQ0wsS0FESztxQkFDQSxBQUFZLE9BQU8saUJBQUE7ZUFBUyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUF0QixBQUF1QixPQUF4QyxBQUErQztBQUF4RDtBQWpCYixBQWlCTixBQUNMLEtBREs7dUJBQ0UsQUFBWSxTQUFTLGlCQUFBO2VBQVMsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFPLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxNQUFqQixBQUFpQixBQUFNLE1BQU0sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE1BQXJELEFBQXFELEFBQU0sSUFBNUUsQUFBaUY7QUFBMUY7QUFBckIsQUFFUCxLQUZPOztBQUlQOztBQUNBO0FBQ0E7QUFHQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUNBO0FBQ0E7QUFFQTs7QUFDQTtBQUNBO0FBRUE7O0EsQUExQ1c7Ozs7Ozs7O0FBQUEsQUFDWDs7Ozs7Ozs7OztBQ1JKOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU0sOEJBQVcsU0FBWCxBQUFXLGdCQUFBO1dBQVMsTUFBQSxBQUFNLFNBQU4sQUFBZSxrQkFBeEIsQUFBMEM7QUFBM0Q7O0FBRUEsSUFBTSxvQ0FBYyxTQUFkLEFBQWMsbUJBQUE7QUFBVSxXQUFELG1CQUFBLEFBQW9CLEtBQUssTUFBbEMsQUFBUyxBQUErQjs7QUFBNUQ7O0FBRUEsSUFBTSxrQ0FBYSxTQUFiLEFBQWEsa0JBQUE7aUJBQVMsQUFBTSxXQUFOLEFBQWlCLE9BQU8scUJBQUE7ZUFBYSxVQUFBLEFBQVUsU0FBdkIsQUFBZ0M7QUFBeEQsS0FBQSxFQUFBLEFBQW9FLFNBQTdFLEFBQXNGO0FBQXpHOztBQUVQO0FBQ08sSUFBTSxrQ0FBYSxTQUFiLEFBQWEsa0JBQUE7V0FBUyxDQUFDLFdBQUQsQUFBQyxBQUFXLFVBQVUsc0JBQUEsQUFBc0IsV0FBckQsQUFBZ0U7QUFBbkY7O0FBRVAsSUFBTSxXQUFXLFNBQVgsQUFBVyxnQkFBQTtXQUFVLE1BQUEsQUFBTSxVQUFOLEFBQWdCLGFBQWEsTUFBQSxBQUFNLFVBQW5DLEFBQTZDLFFBQVEsTUFBQSxBQUFNLE1BQU4sQUFBWSxTQUEzRSxBQUFvRjtBQUFyRzs7QUFFQSxJQUFNLG9CQUFvQixTQUFwQixBQUFvQixrQkFBQSxBQUFDLE9BQUQsQUFBUSxPQUFVLEFBQ3hDO1FBQUcsWUFBQSxBQUFZLFVBQVUsTUFBekIsQUFBK0IsU0FBUSxBQUNuQztZQUFHLE1BQUEsQUFBTSxRQUFULEFBQUcsQUFBYyxRQUFRLE1BQUEsQUFBTSxLQUFLLE1BQXBDLEFBQXlCLEFBQWlCLFlBQ3JDLFFBQVEsQ0FBQyxNQUFULEFBQVEsQUFBTyxBQUN2QjtBQUhELFdBSUssSUFBRyxTQUFILEFBQUcsQUFBUyxRQUFRLFFBQVEsTUFBUixBQUFjLEFBQ3ZDO1dBQUEsQUFBTyxBQUNWO0FBUEQ7O0FBU08sSUFBTSx3REFBd0IsU0FBeEIsQUFBd0IsNkJBQUE7V0FBUyxNQUFBLEFBQU0sT0FBTixBQUFhLE9BQWIsQUFBb0IsbUJBQTdCLEFBQVMsQUFBdUM7QUFBOUU7O0FBRUEsSUFBTSw0REFBMEIsU0FBMUIsQUFBMEIsZ0NBQVUsQUFDN0M7UUFBSSxtQkFBSixBQUF1QixBQUV2Qjs7U0FBSSxJQUFKLEFBQVEsU0FBUixBQUFpQixRQUFRO1lBQUcsT0FBQSxBQUFPLE9BQVAsQUFBYyxXQUFkLEFBQXlCLFNBQTVCLEFBQXFDLEdBQUcsaUJBQUEsQUFBaUIsU0FBUyxPQUEzRixBQUFpRSxBQUEwQixBQUFPO0FBRWxHLFlBQUEsQUFBTyxBQUNWO0FBTk07O0FBUUEsSUFBTSx3Q0FBZ0IsU0FBaEIsQUFBZ0IsY0FBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQ3pDO1FBQUcsQ0FBQyxJQUFJLE1BQUEsQUFBTSxhQUFkLEFBQUksQUFBSSxBQUFtQixVQUFVLEFBQ2pDO1lBQUksTUFBQSxBQUFNLGFBQVYsQUFBSSxBQUFtQjttQkFBVyxBQUN0QixBQUNSO3dCQUFZLG9CQUZrQixBQUVsQixBQUFvQixBQUNoQztvQkFBUSxDQUhaLEFBQWtDLEFBR3RCLEFBQUMsQUFFaEI7QUFMcUMsQUFDOUI7QUFGUixXQU9LLElBQUksTUFBQSxBQUFNLGFBQVYsQUFBSSxBQUFtQixTQUF2QixBQUFnQyxPQUFoQyxBQUF1QyxLQUF2QyxBQUE0QyxBQUNqRDtXQUFBLEFBQU8sQUFDVjtBQVZNOztBQVlBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQUMsV0FBRCxBQUFZLE9BQVUsQUFDckQ7QUFDQTtBQUNBO1dBQU8sbUJBQVMsVUFBVCxBQUFtQixNQUFNLFVBQUEsQUFBVSxVQUFWLEFBQW9CLFlBQVksVUFBaEMsQUFBMEMsUUFBMUUsQUFBTyxBQUEyRSxBQUNyRjtBQUpNOztBQU1BLElBQU0sZ0JBQUksU0FBSixBQUFJLEVBQUEsQUFBQyxVQUFELEFBQVcsWUFBWCxBQUF1QixNQUFTLEFBQzdDO1FBQUksT0FBTyxTQUFBLEFBQVMsY0FBcEIsQUFBVyxBQUF1QixBQUVsQzs7U0FBSSxJQUFKLEFBQVEsUUFBUixBQUFnQixZQUFZO2FBQUEsQUFBSyxhQUFMLEFBQWtCLE1BQU0sV0FBcEQsQUFBNEIsQUFBd0IsQUFBVztBQUMvRCxTQUFHLFNBQUEsQUFBUyxhQUFhLEtBQXpCLEFBQThCLFFBQVEsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLGVBQTFCLEFBQWlCLEFBQXdCLEFBRS9FOztXQUFBLEFBQU8sQUFDVjtBQVBNOztBQVNBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLDJCQUFBO1dBQVMsQ0FBQSxBQUFDLFNBQUQsQUFBVSxVQUFVLE9BQU8sWUFBQSxBQUFZLFVBQVUsU0FBMUQsQUFBUyxBQUFvQixBQUE2QixBQUFTO0FBQS9GOztBQUVQLElBQU0sNkJBQTZCLFNBQTdCLEFBQTZCLDJCQUFBLEFBQUMsT0FBRCxBQUFRLFlBQVI7V0FBdUIsTUFBQSxBQUFNLDRCQUFOLEFBQWdDLGVBQWlCLE1BQUEsQUFBTSw0QkFBTixBQUFnQyxnQkFBeEcsQUFBMEg7QUFBN0o7O0FBRUEsSUFBTSw0QkFBNEIsU0FBNUIsQUFBNEIsMEJBQUEsQUFBQyxPQUFELEFBQVEsWUFBUjtXQUF1QixNQUFBLEFBQU0sMkJBQU4sQUFBK0IsZUFBaUIsTUFBQSxBQUFNLDJCQUFOLEFBQStCLGdCQUF0RyxBQUF3SDtBQUExSjs7QUFFQSxJQUFNLHFCQUFxQixTQUFyQixBQUFxQixtQkFBQSxBQUFDLE9BQUQsQUFBUSxZQUFSO1dBQXVCLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFlBQW5CLEFBQStCLGNBQWMsMkJBQUEsQUFBMkIsT0FBL0YsQUFBb0UsQUFBa0M7QUFBakk7O0FBRUE7O0FBRU8sSUFBTSxnREFBb0IsU0FBcEIsQUFBb0IseUJBQUE7V0FBUyxVQUFBLEFBQUMsS0FBRCxBQUFNLFdBQWMsQUFDMUQ7WUFBRyxDQUFDLGtCQUFRLFVBQVIsQUFBa0IsTUFBbEIsQUFBd0IsT0FBTyxVQUFBLEFBQVUsVUFBVixBQUFvQixZQUFZLFVBQWhDLEFBQTBDLFFBQTdFLEFBQUksQUFBaUYsT0FBTyxBQUN4Rjs7dUJBQU0sQUFDSyxBQUNQOytCQUFlLElBQUEsQUFBSSw2Q0FBb0IsSUFBeEIsQUFBNEIsaUJBQWUsb0JBQUEsQUFBb0IsV0FBL0QsQUFBMkMsQUFBK0IsV0FBVSxDQUFDLG9CQUFBLEFBQW9CLFdBRjVILEFBQU0sQUFFaUcsQUFBQyxBQUErQixBQUUxSTtBQUpTLEFBQ0Y7QUFJUjtlQUFBLEFBQU8sQUFDVjtBQVJnQztBQUExQjs7QUFXUDtBQUNBO0FBQ0E7O0FBRU8sSUFBTSw0QkFBVSxTQUFWLEFBQVUsVUFBQTtzQ0FBQSxBQUFJLGtEQUFBO0FBQUosOEJBQUE7QUFBQTs7ZUFBWSxBQUFJLE9BQU8sVUFBQSxBQUFDLEdBQUQsQUFBSSxHQUFKO2VBQVUsWUFBQTttQkFBYSxFQUFFLG1CQUFmLEFBQWE7QUFBdkI7QUFBdkIsQUFBWSxLQUFBO0FBQTVCO0FBQ0EsSUFBTSxzQkFBTyxTQUFQLEFBQU8sT0FBQTt1Q0FBQSxBQUFJLHVEQUFBO0FBQUosK0JBQUE7QUFBQTs7V0FBWSxRQUFBLEFBQVEsTUFBUixBQUFjLFNBQVMsSUFBbkMsQUFBWSxBQUF1QixBQUFJO0FBQXBEOztBQUVBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLDJCQUFTLEFBQ3hDO1FBQUksYUFBSixBQUFpQixBQUNqQjtBQUNBO0FBRUE7O0FBV0E7Ozs7Ozs7OztBQThDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBQUEsQUFBTyxBQUNWO0FBL0RNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHQvLyBsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuICAgIGxldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cblx0aWYoIWVscy5sZW5ndGgpIHJldHVybiBjb25zb2xlLndhcm4oYFZhbGlkYXRpb24gbm90IGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCBmb3Igc2VsZWN0b3IgJHtzZWx9YCk7XG4gICAgXG5cdHJldHVybiBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRhY2MucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0Zm9ybTogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG59O1xuXG4vKlxuXHRDaGVjayB3aGV0aGVyIGEgZm9ybSBjb250YWluaW5nIGFueSBmaWVsZHMgd2l0aCBkYXRhLXZhbD10cnVlXG5cdEluaXRpYWxpc2UgdXNpbmcgZGF0YS12YWwtdHJ1ZSB0byBkZXNpZ25hdGUgdmFsaWRhdGVhYmxlIGlucHV0c1xuKi9cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiLy8gaW1wb3J0IGlucHV0UHJvdG90eXBlIGZyb20gJy4vaW5wdXQtcHJvdG90eXBlJztcbmltcG9ydCB7IFxuXHRoLFxuXHRleHRyYWN0R3JvdXBzLFxuXHRjaG9vc2VSZWFsdGltZUV2ZW50LFxuXHRleHRyYWN0RXJyb3JNZXNzYWdlLFxuXHR2YWxpZGF0aW9uUmVkdWNlcixcblx0cmVtb3ZlVW52YWxpZGF0ZWRHcm91cHMsXG5cdG5vcm1hbGlzZVZhbGlkYXRvcnNcbn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHQvL3ByZXZlbnQgYnJvd3NlciB2YWxpZGF0aW9uXG5cdFx0dGhpcy5mb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cblx0XHQvL2RlbGV0ZSBtZSBwbGVhc2Vcblx0XHR0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKTtcblxuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0ZWRHcm91cHModGhpcy5pbnB1dHMucmVkdWNlKGV4dHJhY3RHcm91cHMsIHt9KSk7XG5cblx0XHR0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblx0XHRcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ3JvdXBzKTtcblxuXHRcdC8qXG5cblx0XHQxLiByZWYuIDxpbnB1dCBkYXRhLXJ1bGUtbWlubGVuZ3RoPVwiMlwiIGRhdGEtcnVsZS1tYXhsZW5ndGg9XCI0XCIgZGF0YS1tc2ctbWlubGVuZ3RoPVwiQXQgbGVhc3QgdHdvIGNoYXJzXCIgZGF0YS1tc2ctbWF4bGVuZ3RoPVwiQXQgbW9zdCBmb3VycyBjaGFyc1wiPlxuXG5cblx0XHQyLiByZWYuIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZmlsZXMvZGVtby9cblx0XHRcblx0XHQzLiByZWYuIENvbnN0cmFpbnQgdmFsaWRhdGlvbiBBUElcblx0XHRWYWxpZGF0aW9uLXJlcGF0ZWQgYXR0cmlidXRlc1xuXHRcdFx0LSBwYXR0ZXJuLCByZWdleCwgJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuJ1xuXHRcdFx0LSBtaW4sIG51bWJlciwgJ1RoZSB2YWx1ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUuJ1xuXHRcdFx0LSBtYXgsIG51bWJlciwgJ1RoZSB2YWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUnLFxuXHRcdFx0LSByZXF1aXJlZCwgbm9uZSwgJ1RoZXJlIG11c3QgYmUgYSB2YWx1ZScsXG5cdFx0XHQtIG1heGxlbmd0aCwgaW50IGxlbmd0aCwgJ1RoZSBudW1iZXIgb2YgY2hhcmFjdGVycyAoY29kZSBwb2ludHMpIG11c3Qgbm90IGV4Y2VlZCB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS4nIFxuXG5cdFx0NC4gcmVmLiBodHRwczovL2dpdGh1Yi5jb20vYXNwbmV0L2pxdWVyeS12YWxpZGF0aW9uLXVub2J0cnVzaXZlL2Jsb2IvbWFzdGVyL3NyYy9qcXVlcnkudmFsaWRhdGUudW5vYnRydXNpdmUuanNcblxuXHRcdCovXG5cblx0XHQvL3ZhbGlkYXRlIHdob2xlIGZvcm1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0aWYodGhpcy5zZXRWYWxpZGl0eVN0YXRlKCkpIHRoaXMuZm9ybS5zdWJtaXQoKTtcblx0XHRcdGVsc2UgdGhpcy5yZW5kZXJFcnJvcnMoKSwgdGhpcy5pbml0UmVhbHRpbWVWYWxpZGF0aW9uKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBlID0+IHsgdGhpcy5jbGVhckVycm9ycygpOyB9KTtcblx0fSxcblx0aW5pdFJlYWx0aW1lVmFsaWRhdGlvbigpe1xuXHRcdGxldCBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRsZXQgZ3JvdXAgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHRcdFx0bGV0IHZhbGlkaXR5U3RhdGUgPSB0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCk7XG5cdFx0XHRcdGlmKCF2YWxpZGl0eVN0YXRlKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdC8vbWFwL292ZXIgZ3JvdXBzIGluc3RlYWRcblx0XHR0aGlzLmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdGxldCBldiA9IGNob29zZVJlYWx0aW1lRXZlbnQoaW5wdXQpO1xuXHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihldiwgaGFuZGxlcik7XG5cdFx0fSk7XG5cdH0sXG5cdHNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLFxuXHRcdFx0XHRcdFx0XHRcdHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0sIC8vcmVzZXQgdmFsaWRpdHkgYW5kIGVycm9yTWVzc2FnZXNhXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMucmVkdWNlKHZhbGlkYXRpb25SZWR1Y2VyKHRoaXMuZ3JvdXBzW2dyb3VwXSksIHRydWUpKTtcblx0XHRyZXR1cm4gdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkO1xuXHR9LFxuXHRzZXRWYWxpZGl0eVN0YXRlKCl7XG5cdFx0bGV0IG51bUVycm9ycyA9IDA7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCk7XG5cdFx0XHQhdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkICYmICsrbnVtRXJyb3JzO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVtRXJyb3JzID09PSAwO1xuXHR9LFxuXHRjbGVhckVycm9ycygpe1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pOy8vb3Igc2hvdWxkIGkgc2V0IHRoaXMgdG8gZmFsc2UgaWYgZmllbGQgcGFzc2VzIHZhbGlkYXRpb24/XG5cdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSB0aGlzLmdyb3Vwc1tncm91cF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuZmllbGRzW3RoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LnBhcmVudE5vZGVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogJ2Vycm9yJyB9LCB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG5cdH0sXG5cdGFkZE1ldGhvZChuYW1lLCBmbiwgbWVzc2FnZSl7XG5cdFx0dGhpcy5ncm91cHMudmFsaWRhdG9ycy5wdXNoKGZuKTtcblx0XHQvL2V4dGVuZCBtZXNzYWdlc1xuXHR9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge307XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuZXhwb3J0IGNvbnN0IERPVE5FVENPUkVfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydtaW4nLCAnbWF4J10sXG4gICAgcmFuZ2U6IFsnbWluJywgJ21heCddLFxuICAgIG1pbjogWydtaW4nXSxcbiAgICBtYXg6ICBbJ21heCddLFxuICAgIG1pbmxlbmd0aDogWydtaW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4J10sXG4gICAgcmVtb3RlOiBbJ3VybCcsICd0eXBlJywgJ2FkZGl0aW9uYWxmaWVsZHMnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRDT1JFX0FEQVBUT1JTID0gW1xuICAgIC8vJ3JlZ2V4JywgLT4gc2FtZSBhcyBwYXR0ZXJuLCBob3cgaXMgaXQgYXBwbGllZCB0byBhbiBlbGVtZW50PyBwYXR0ZXJuIGF0dHJpYnV0ZT8gZGF0YS12YWwtcmVnZXg/XG4gICAgJ2RhdGUnLFxuICAgICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmVtb3RlJyxcbiAgICAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgLy8gZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICAvL3JhbmdlbGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fSBjaGFyYWN0ZXJzIGxvbmcuYDsgfSxcbiAgICAvL3JhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgLy9yZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9zdGVwKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSBtdWx0aXBsZSBvZiAke3Byb3BzfS5gOyB9XG59OyIsImltcG9ydCB7IGlzU2VsZWN0LCBpc0NoZWNrYWJsZSwgaXNSZXF1aXJlZCwgaXNPcHRpb25hbCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgcGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW0pLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gZmFsc2UsXG4gICAgZW1haWw6IHJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IHJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiByZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiByZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogcmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IHBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogcGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWluOiBwYXJhbU1ldGhvZCgnbWluJywgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtLCBhY2MpKSxcbiAgICBtYXg6IHBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW0sIGFjYykpLFxuICAgIHJhbmdlOiBwYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1bMV0pLCBhY2MpKSxcblxuICAgIC8vcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xuICAgIFxuICAgIC8vIHJhbmdlbGVuZ3RoXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDIwXG5cblxuICAgIC8vIHJhbmdlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXG4gICAgLy8gXG4gICAgLy8gc3RlcFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDQxXG5cbiAgICAvLyBlcXVhbFRvXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NzlcblxuICAgIC8vIHJlbW90ZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVtb3RlLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0OTJcblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4vbWVzc2FnZXMnO1xuXG5leHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuLy9pc24ndCByZXF1aXJlZCBhbmQgbm8gdmFsdWVcbmV4cG9ydCBjb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09IGZhbHNlO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5jb25zdCBncm91cFZhbHVlUmVkdWNlciA9ICh2YWx1ZSwgaW5wdXQpID0+IHtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCl7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZS5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIHZhbHVlID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgZWxzZSBpZihoYXNWYWx1ZShpbnB1dCkpIHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsIGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGVkR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIGlmKGdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5sZW5ndGggPiAwKSB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0R3JvdXBzID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSkge1xuICAgICAgICBhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldID0ge1xuICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHtcbiAgICAvLyB0byBkb1xuICAgIC8vIGltcGxlbWVudCBjdXN0b20gdmFpZGF0aW9uIG1lc3NhZ2VzXG4gICAgcmV0dXJuIG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW0gIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbSA6IG51bGwpO1xufTtcblxuZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsdGltZUV2ZW50ID0gaW5wdXQgPT4gWydrZXl1cCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSldO1xuXG5jb25zdCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuY29uc3QgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbmNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsIGNvbnN0cmFpbnQpO1xuXG4vLyBjb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IHR5cGUgPT4gaW5wdXQuaGFzQXR0cmlidXRlKHR5cGUpID8gaW5wdXQuZ2V0QXR0cmlidXRlKHR5cGUpIDogaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXJ1bGUtJHt0eXBlfWApID8gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3R5cGV9YClcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25SZWR1Y2VyID0gZ3JvdXAgPT4gKGFjYywgdmFsaWRhdG9yKSA9PiB7XG4gICAgaWYoIW1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW0gIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbSA6IG51bGwpKSB7XG4gICAgICAgIGFjYyA9IHtcbiAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSA6IFtleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuXG4vLyBjb25zdCBjb21wb3NlciA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKTtcbi8vIGV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZShjb21wb3Nlcik7XG4vLyBleHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2VSaWdodChjb21wb3Nlcik7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBjb21wb3NlLmFwcGx5KGNvbXBvc2UsIGZucy5yZXZlcnNlKCkpO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIC8vIFRvIGRvXG4gICAgLy8gdmFsaWRhdGUgdGhlIHZhbGlkYXRpb24gcGFyYW1ldGVyc1xuXG4gICAgLypcbiAgICAgICAgLSBjaGVjayBpZiBkYXRhLXZhbD1cInRydWVcIlxuXG4gICAgICAgICAgICB2YWxpZGF0b3I6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nIFtyZXF1aXJlZF0sXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBBcnJheSBbb3B0aW9uYWxdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFN0cmluZyBbb3B0aW9uYWxdXG4gICAgICAgICAgICB9XG5cbiAgICAqL1xuICAgIC8qXG4gICAgLy9yZXF1aXJlZFxuICAgIGlmKChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ3JlcXVpcmVkJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ3JlcXVpcmVkJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ3JlcXVpcmVkJ30pO1xuXG4gICAgLy9lbWFpbFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ2VtYWlsJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuXG4gICAgLy91cmxcbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICd1cmwnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAndXJsJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ3VybCd9KTtcblxuICAgIC8vZGF0ZVxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ2RhdGUnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnZGF0ZScpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdkYXRlJ30pO1xuXG4gICAgLy9kYXRlSVNPXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZUlTTycpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdkYXRlSVNPJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2RhdGVJU08nfSk7XG5cbiAgICAvL251bWJlclxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ251bWJlcicpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdudW1iZXInKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuXG4gICAgLy9taW5sZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtaW5sZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW06IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKCdtaW5sZW5ndGgnKX0pO1xuXG4gICAgLy9tYXhsZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heGxlbmd0aCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9KTtcblxuICAgIC8vbWluXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWluJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfSk7XG5cbiAgICAvL21heFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4JykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX0pO1xuXG4gICAgLy9tYXhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9KTtcblxuXG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cblxuICAgIC8vcmVtb3RlXG5cbiAgICAvL2RpZ2l0c1xuXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07Il19
