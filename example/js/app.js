(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    // Validate.init('form');
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

var init = function init(candidate, opts) {
	var els = void 0;

	//assume it's a dom node
	if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = Array.from(document.querySelectorAll(candidate));

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
	Auto-initialise
*/
{
	Array.from(document.querySelectorAll('form')).forEach(function (form) {
		form.querySelector('[data-val=true]') && init(form);
	});
}

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

var _validators = require('./utils/validators');

var _dom = require('./utils/dom');

exports.default = {
	init: function init() {
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');

		this.groups = (0, _validators.removeUnvalidatableGroups)(Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(_validators.assembleValidationGroup, {}));

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
				input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler);
			});
		}
	},
	setGroupValidityState: function setGroupValidityState(group) {
		this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] }, //reset validity and errorMessagesa
		this.groups[group].validators.reduce((0, _validators.validationReducer)(this.groups[group]), true));
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
		this.groups[group].serverErrorNode && this.groups[group].serverErrorNode.classList.remove('error');
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
		this.groups[group].errorDOM = this.groups[group].serverErrorNode ? (0, _dom.createErrorTextNode)(this.groups[group]) : this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild((0, _dom.h)('div', { class: 'error' }, this.groups[group].errorMessages[0]));

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

},{"./utils":9,"./utils/dom":8,"./utils/validators":10}],4:[function(require,module,exports){
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

var DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = exports.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = 'data-valmsg-for';

var DOTNET_PARAMS = exports.DOTNET_PARAMS = {
    length: ['min', 'max'],
    range: ['min', 'max'],
    min: ['min'],
    max: ['max'],
    minlength: ['min'],
    maxlength: ['max'],
    remote: ['url', 'type', 'additionalfields'] //??
};

var DOTNET_ADAPTORS = exports.DOTNET_ADAPTORS = [
//'regex', -> same as pattern, how is it applied to an element? pattern attribute? data-val-regex?
'required', 'date', 'digits', 'email', 'number', 'url', 'length', 'range', 'equalto', 'remote', 'password' //-> maps to min, nonalphamain, and regex methods
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

//isn't required and no value
var isOptional = function isOptional(group) {
    return !(0, _utils.isRequired)(group) && (0, _utils.extractValueFromGroup)(group) === false;
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

exports.default = {
    required: function required(group) {
        return (0, _utils.extractValueFromGroup)(group) !== false;
    },
    email: regexMethod(_constants.EMAIL_REGEX),
    url: regexMethod(_constants.URL_REGEX),
    date: function date(group) {
        return isOptional(group) || group.fields.reduce(function (acc, input) {
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

},{"./constants":4,"./utils":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var h = exports.h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

var createErrorTextNode = exports.createErrorTextNode = function createErrorTextNode(group) {
    var node = document.createTextNode(group.errorMessages[0]);
    group.serverErrorNode.classList.add('error');
    return group.serverErrorNode.appendChild(node);
};

},{}],9:[function(require,module,exports){
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

var isRequired = exports.isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
};

var hasValue = function hasValue(input) {
    return input.value !== undefined && input.value !== null && input.value.length > 0;
};

var groupValueReducer = function groupValueReducer(acc, input) {
    if (isCheckable(input)) {
        if (input.checked) {
            if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
        }
    } else if (hasValue(input)) acc = input.value;
    return acc;
};

var extractValueFromGroup = exports.extractValueFromGroup = function extractValueFromGroup(group) {
    return group.fields.reduce(function (acc, input) {
        if (isCheckable(input)) {
            if (input.checked) {
                if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
            }
        } else if (hasValue(input)) acc = input.value;
        return acc;
    }, false);
};

var chooseRealTimeEvent = exports.chooseRealTimeEvent = function chooseRealTimeEvent(input) {
    return ['input', 'change'][Number(isCheckable(input) || isSelect(input))];
};

// const extractValidationParams = type => input.hasAttribute(type) ? input.getAttribute(type) : input.hasAttribute(`data-rule-${type}`) ? input.hasAttribute(`data-val-${type}`)


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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validationReducer = exports.normaliseValidators = undefined;

var _methods = require('../methods');

var _methods2 = _interopRequireDefault(_methods);

var _messages = require('../messages');

var _messages2 = _interopRequireDefault(_messages);

var _constants = require('../constants');

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

// const checkForDataRuleConstraint = (input, constraint) => input.getAttribute(`data-rule-${constraint}`) && input.getAttribute(`data-rule-${constraint}`) !== 'false';

// const checkForDataValConstraint = (input, constraint) => input.getAttribute(`data-val-${constraint}`) && input.getAttribute(`data-val-${constraint}`) !== 'false';

// const checkForConstraint = (input, constraint) => input.getAttribute('type') === constraint || checkForDataRuleConstraint(input, constraint);

var extractDataValValidators = function extractDataValValidators(input) {
    return _constants.DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        if (!input.getAttribute('data-val-' + adaptor)) return validators;
        validators.push(Object.assign({ type: adaptor, message: input.getAttribute('data-val-' + adaptor) }, _constants.DOTNET_PARAMS[adaptor] && {
            params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
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
var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
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

var validationReducer = exports.validationReducer = function validationReducer(group) {
    return function (acc, validator) {
        if (_methods2.default[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
        return {
            valid: false,
            errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [extractErrorMessage(validator, group)]) : [extractErrorMessage(validator, group)]
        };;
    };
};

var assembleValidationGroup = exports.assembleValidationGroup = function assembleValidationGroup(acc, input) {
    if (!acc[input.getAttribute('name')]) {
        acc[input.getAttribute('name')] = {
            valid: false,
            validators: normaliseValidators(input),
            fields: [input],
            serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + input.getAttribute('name') + ']') || false
        };
    } else acc[input.getAttribute('name')].fields.push(input);
    return acc;
};

var extractErrorMessage = exports.extractErrorMessage = function extractErrorMessage(validator, group) {
    return validator.message || _messages2.default[validator.type](validator.params !== undefined ? validator.params : null);
};

var removeUnvalidatableGroups = exports.removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

},{"../constants":4,"../messages":6,"../methods":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sTUFBQSxBQUFNLEtBQUss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QUNWO0FBUk0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUuaW5pdCgnZm9ybScpO1xufV07XG5cbnsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0Ly9hc3N1bWUgaXQncyBhIGRvbSBub2RlXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwgW10pO1xufTtcblxuLypcblx0QXV0by1pbml0aWFsaXNlXG4qL1xueyBcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCIvLyBpbXBvcnQgaW5wdXRQcm90b3R5cGUgZnJvbSAnLi9pbnB1dC1wcm90b3R5cGUnO1xuaW1wb3J0IHsgY2hvb3NlUmVhbFRpbWVFdmVudCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgXG5cdHZhbGlkYXRpb25SZWR1Y2VyLFxuXHRhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCxcblx0bm9ybWFsaXNlVmFsaWRhdG9ycyxcblx0cmVtb3ZlVW52YWxpZGF0YWJsZUdyb3Vwc1xufSBmcm9tICcuL3V0aWxzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgaCwgY3JlYXRlRXJyb3JUZXh0Tm9kZSB9IGZyb20gJy4vdXRpbHMvZG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdC8vcHJldmVudCBicm93c2VyIHZhbGlkYXRpb25cblx0XHR0aGlzLmZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcblx0XHRcblx0XHR0aGlzLmdyb3VwcyA9IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoQXJyYXkuZnJvbSh0aGlzLmZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pLCB0ZXh0YXJlYSwgc2VsZWN0JykpLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKTtcblxuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXHRcdFxuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXG5cdFx0LypcblxuXHRcdDEuIHJlZi4gPGlucHV0IGRhdGEtcnVsZS1taW5sZW5ndGg9XCIyXCIgZGF0YS1ydWxlLW1heGxlbmd0aD1cIjRcIiBkYXRhLW1zZy1taW5sZW5ndGg9XCJBdCBsZWFzdCB0d28gY2hhcnNcIiBkYXRhLW1zZy1tYXhsZW5ndGg9XCJBdCBtb3N0IGZvdXJzIGNoYXJzXCI+XG5cblxuXHRcdDIuIHJlZi4gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9maWxlcy9kZW1vL1xuXHRcdFxuXHRcdDMuIHJlZi4gQ29uc3RyYWludCB2YWxpZGF0aW9uIEFQSVxuXHRcdFZhbGlkYXRpb24tcmVwYXRlZCBhdHRyaWJ1dGVzXG5cdFx0XHQtIHBhdHRlcm4sIHJlZ2V4LCAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4nXG5cdFx0XHQtIG1pbiwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZS4nXG5cdFx0XHQtIG1heCwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZScsXG5cdFx0XHQtIHJlcXVpcmVkLCBub25lLCAnVGhlcmUgbXVzdCBiZSBhIHZhbHVlJyxcblx0XHRcdC0gbWF4bGVuZ3RoLCBpbnQgbGVuZ3RoLCAnVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIChjb2RlIHBvaW50cykgbXVzdCBub3QgZXhjZWVkIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLicgXG5cblx0XHQ0LiByZWYuIGh0dHBzOi8vZ2l0aHViLmNvbS9hc3BuZXQvanF1ZXJ5LXZhbGlkYXRpb24tdW5vYnRydXNpdmUvYmxvYi9tYXN0ZXIvc3JjL2pxdWVyeS52YWxpZGF0ZS51bm9idHJ1c2l2ZS5qc1xuXG5cdFx0Ki9cblxuXHRcdC8vdmFsaWRhdGUgd2hvbGUgZm9ybVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRMaXN0ZW5lcnMoKXtcblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmNsZWFyRXJyb3JzKCk7XG5cdFx0XHRpZih0aGlzLnNldFZhbGlkaXR5U3RhdGUoKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGxldCBncm91cCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRpZighdGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihjaG9vc2VSZWFsVGltZUV2ZW50KGlucHV0KSwgaGFuZGxlcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLFxuXHRcdFx0XHRcdFx0XHRcdHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0sIC8vcmVzZXQgdmFsaWRpdHkgYW5kIGVycm9yTWVzc2FnZXNhXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMucmVkdWNlKHZhbGlkYXRpb25SZWR1Y2VyKHRoaXMuZ3JvdXBzW2dyb3VwXSksIHRydWUpKTtcblx0XHRyZXR1cm4gdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkO1xuXHR9LFxuXHRzZXRWYWxpZGl0eVN0YXRlKCl7XG5cdFx0bGV0IG51bUVycm9ycyA9IDA7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCk7XG5cdFx0XHQhdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkICYmICsrbnVtRXJyb3JzO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVtRXJyb3JzID09PSAwO1xuXHR9LFxuXHRjbGVhckVycm9ycygpe1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgJiYgdGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pOy8vb3Igc2hvdWxkIGkgc2V0IHRoaXMgdG8gZmFsc2UgaWYgZmllbGQgcGFzc2VzIHZhbGlkYXRpb24/XG5cdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSBcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgPyBcblx0XHRcdFx0Y3JlYXRlRXJyb3JUZXh0Tm9kZSh0aGlzLmdyb3Vwc1tncm91cF0pIDogXG5cdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHQuZmllbGRzW3RoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbWluJywgJ21heCddLFxuICAgIHJhbmdlOiBbJ21pbicsICdtYXgnXSxcbiAgICBtaW46IFsnbWluJ10sXG4gICAgbWF4OiAgWydtYXgnXSxcbiAgICBtaW5sZW5ndGg6IFsnbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heCddLFxuICAgIHJlbW90ZTogWyd1cmwnLCAndHlwZScsICdhZGRpdGlvbmFsZmllbGRzJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0FEQVBUT1JTID0gW1xuICAgIC8vJ3JlZ2V4JywgLT4gc2FtZSBhcyBwYXR0ZXJuLCBob3cgaXMgaXQgYXBwbGllZCB0byBhbiBlbGVtZW50PyBwYXR0ZXJuIGF0dHJpYnV0ZT8gZGF0YS12YWwtcmVnZXg/XG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnZGF0ZScsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJyxcbiAgICAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgLy8gZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICAvL3JhbmdlbGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fSBjaGFyYWN0ZXJzIGxvbmcuYDsgfSxcbiAgICAvL3JhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgLy9yZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9zdGVwKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSBtdWx0aXBsZSBvZiAke3Byb3BzfS5gOyB9XG59OyIsImltcG9ydCB7IGlzU2VsZWN0LCBpc0NoZWNrYWJsZSwgaXNSZXF1aXJlZCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8vaXNuJ3QgcmVxdWlyZWQgYW5kIG5vIHZhbHVlXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09IGZhbHNlO1xuXG5jb25zdCByZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IHBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcyksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSBmYWxzZSxcbiAgICBlbWFpbDogcmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogcmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IHJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IHJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiByZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogcGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBwYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBtaW46IHBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtLCBhY2MpKSxcbiAgICBtYXg6IHBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK3BhcmFtLCBhY2MpKSxcbiAgICBsZW5ndGg6IHBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zWzBdICYmIChwYXJhbXNbMV0gPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXNbMV0pKSwgYWNjKSksXG4gICAgcmFuZ2U6IHBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtc1swXSAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtc1sxXSksIGFjYykpLFxuICAgIFxuICAgIC8vIHJhbmdlbGVuZ3RoXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDIwXG5cblxuICAgIC8vIHJhbmdlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXG4gICAgLy8gXG4gICAgLy8gc3RlcFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDQxXG5cbiAgICAvLyBlcXVhbFRvXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NzlcblxuICAgIC8vIHJlbW90ZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVtb3RlLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0OTJcblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSBncm91cCA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShncm91cC5lcnJvck1lc3NhZ2VzWzBdKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTsiLCIgZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkpIHtcbiAgICAgICAgaWYoaW5wdXQuY2hlY2tlZCl7XG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IHtcbiAgICByZXR1cm4gZ3JvdXAuZmllbGRzXG4gICAgICAgICAgICAucmVkdWNlKChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoaXNDaGVja2FibGUoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlucHV0LmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWxUaW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpKV07XG5cbi8vIGNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gdHlwZSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUodHlwZSkgPyBpbnB1dC5nZXRBdHRyaWJ1dGUodHlwZSkgOiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtcnVsZS0ke3R5cGV9YCkgPyBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7dHlwZX1gKVxuXG5cbi8vIGNvbnN0IGNvbXBvc2VyID0gKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpO1xuLy8gZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKGNvbXBvc2VyKTtcbi8vIGV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZVJpZ2h0KGNvbXBvc2VyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGNvbXBvc2UuYXBwbHkoY29tcG9zZSwgZm5zLnJldmVyc2UoKSk7IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG4vLyBjb25zdCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuLy8gY29uc3QgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbi8vIGNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsIGNvbnN0cmFpbnQpO1xuXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApKSByZXR1cm4gdmFsaWRhdG9ycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnMucHVzaChPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlOiBhZGFwdG9yLCBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gQXJyYXkuZnJvbShub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuLypcbkBwYXJhbXMgRE9NIG5vZGUgaW5wdXRcbkByZXR1cm5zIE9iamVjdFxue1xuICAgIHR5cGU6IFN0cmluZyBbcmVxdWlyZWRdLFxuICAgIHBhcmFtczogQXJyYXkgW29wdGlvbmFsXSxcbiAgICBtZXNzYWdlOiBTdHJpbmcgW29wdGlvbmFsXVxufVxuKi9cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgXG4gICAgLy9ob3cgdG8gbWVyZ2UgdGhlIHNhbWUgdmFsaWRhdG9yIGZyb20gbXVsdGlwbGUgc291cmNlcywgZS5nLiBET00gYXR0cmlidXRlIHZlcnN1cyBkYXRhLXZhbD9cbiAgICAvL2Fzc3VtZSBkYXRhLXZhbCBpcyBjYW5ub25pY2FsP1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnKSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgZWxzZSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICAvLyBUbyBkb1xuICAgIC8vIHZhbGlkYXRlIHRoZSB2YWxpZGF0aW9uIHBhcmFtZXRlcnNcblxuICAgIC8qXG4gICAgLy9kYXRlXG5cbiAgICAvL2RhdGVJU09cblxuICAgIC8vbWF4bGVuZ3RoXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfSk7XG5cbiAgICAvL21pblxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWluJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21pbicpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW4nLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX0pO1xuXG4gICAgLy9tYXhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9KTtcblxuICAgIC8vc3RlcFxuXG4gICAgLy9lcXVhbFRvXG5cbiAgICAvL3JlbW90ZVxuXG4gICAgLy9kaWdpdHNcblxuICAgIC8vcmFuZ2VsZW5ndGhcbiAgICAqL1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbiAgICBpZihtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCkpIHJldHVybiBhY2M7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyA/IFsuLi5hY2MuZXJyb3JNZXNzYWdlcywgZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV0gOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbiAgICB9Oztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIFxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTsiXX0=
