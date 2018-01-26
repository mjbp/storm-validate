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
		this.groups[group].errorDOM = this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild((0, _dom.h)('div', { class: 'error' }, this.groups[group].errorMessages[0]));

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
"use strict";

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
    return _constants.DOTNETCORE_ADAPTORS.reduce(function (validators, adaptor) {
        if (!input.getAttribute('data-val-' + adaptor)) return validators;
        validators.push(Object.assign({ type: adaptor, message: input.getAttribute('data-val-' + adaptor) }, _constants.DOTNETCORE_PARAMS[adaptor] && {
            params: _constants.DOTNETCORE_PARAMS[adaptor].reduce(function (acc, param) {
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
            fields: [input]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixB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QUEyQyxBQUE2RTtBQUFwSjs7QUFFQSxJQUFNLGdFQUE0QixTQUE1QixBQUE0QixrQ0FBVSxBQUMvQztRQUFJLG1CQUFKLEFBQXVCLEFBRXZCOztTQUFJLElBQUosQUFBUSxTQUFSLEFBQWlCLFFBQ2I7WUFBRyxPQUFBLEFBQU8sT0FBUCxBQUFjLFdBQWQsQUFBeUIsU0FBNUIsQUFBcUMsR0FDakMsaUJBQUEsQUFBaUIsU0FBUyxPQUZsQyxBQUVRLEFBQTBCLEFBQU87QUFFekMsWUFBQSxBQUFPLEFBQ1Y7QUFSTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0Ly8gbGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICBsZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKGBWYWxpZGF0aW9uIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQgZm9yIHNlbGVjdG9yICR7c2VsfWApO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwgW10pO1xufTtcblxuLypcblx0Q2hlY2sgd2hldGhlciBhIGZvcm0gY29udGFpbmluZyBhbnkgZmllbGRzIHdpdGggZGF0YS12YWw9dHJ1ZVxuXHRJbml0aWFsaXNlIHVzaW5nIGRhdGEtdmFsLXRydWUgdG8gZGVzaWduYXRlIHZhbGlkYXRlYWJsZSBpbnB1dHNcbiovXG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBcblx0dmFsaWRhdGlvblJlZHVjZXIsXG5cdGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLFxuXHRub3JtYWxpc2VWYWxpZGF0b3JzLFxuXHRyZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzXG59IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBoIH0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdFxuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhBcnJheS5mcm9tKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cdFx0XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdyb3Vwcyk7XG5cblx0XHQvKlxuXG5cdFx0MS4gcmVmLiA8aW5wdXQgZGF0YS1ydWxlLW1pbmxlbmd0aD1cIjJcIiBkYXRhLXJ1bGUtbWF4bGVuZ3RoPVwiNFwiIGRhdGEtbXNnLW1pbmxlbmd0aD1cIkF0IGxlYXN0IHR3byBjaGFyc1wiIGRhdGEtbXNnLW1heGxlbmd0aD1cIkF0IG1vc3QgZm91cnMgY2hhcnNcIj5cblxuXG5cdFx0Mi4gcmVmLiBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGVzL2RlbW8vXG5cdFx0XG5cdFx0My4gcmVmLiBDb25zdHJhaW50IHZhbGlkYXRpb24gQVBJXG5cdFx0VmFsaWRhdGlvbi1yZXBhdGVkIGF0dHJpYnV0ZXNcblx0XHRcdC0gcGF0dGVybiwgcmVnZXgsICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybidcblx0XHRcdC0gbWluLCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlLidcblx0XHRcdC0gbWF4LCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlJyxcblx0XHRcdC0gcmVxdWlyZWQsIG5vbmUsICdUaGVyZSBtdXN0IGJlIGEgdmFsdWUnLFxuXHRcdFx0LSBtYXhsZW5ndGgsIGludCBsZW5ndGgsICdUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgKGNvZGUgcG9pbnRzKSBtdXN0IG5vdCBleGNlZWQgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuJyBcblxuXHRcdDQuIHJlZi4gaHR0cHM6Ly9naXRodWIuY29tL2FzcG5ldC9qcXVlcnktdmFsaWRhdGlvbi11bm9idHJ1c2l2ZS9ibG9iL21hc3Rlci9zcmMvanF1ZXJ5LnZhbGlkYXRlLnVub2J0cnVzaXZlLmpzXG5cblx0XHQqL1xuXG5cdFx0Ly92YWxpZGF0ZSB3aG9sZSBmb3JtXG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdExpc3RlbmVycygpe1xuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuY2xlYXJFcnJvcnMoKTtcblx0XHRcdGlmKHRoaXMuc2V0VmFsaWRpdHlTdGF0ZSgpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRlbHNlIHRoaXMucmVuZGVyRXJyb3JzKCksIHRoaXMuaW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgZSA9PiB7IHRoaXMuY2xlYXJFcnJvcnMoKTsgfSk7XG5cdH0sXG5cdGluaXRSZWFsVGltZVZhbGlkYXRpb24oKXtcblx0XHRsZXQgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0bGV0IGdyb3VwID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0XHRcdGlmKCF0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCkpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKGNob29zZVJlYWxUaW1lRXZlbnQoaW5wdXQpLCBoYW5kbGVyKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0c2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0sXG5cdFx0XHRcdFx0XHRcdFx0eyB2YWxpZDogdHJ1ZSwgZXJyb3JNZXNzYWdlczogW10gfSwgLy9yZXNldCB2YWxpZGl0eSBhbmQgZXJyb3JNZXNzYWdlc2Fcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5yZWR1Y2UodmFsaWRhdGlvblJlZHVjZXIodGhpcy5ncm91cHNbZ3JvdXBdKSwgdHJ1ZSkpO1xuXHRcdHJldHVybiB0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQ7XG5cdH0sXG5cdHNldFZhbGlkaXR5U3RhdGUoKXtcblx0XHRsZXQgbnVtRXJyb3JzID0gMDtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKTtcblx0XHRcdCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgJiYgKytudW1FcnJvcnM7XG5cdFx0fVxuXHRcdHJldHVybiBudW1FcnJvcnMgPT09IDA7XG5cdH0sXG5cdGNsZWFyRXJyb3JzKCl7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7Ly9vciBzaG91bGQgaSBzZXQgdGhpcyB0byBmYWxzZSBpZiBmaWVsZCBwYXNzZXMgdmFsaWRhdGlvbj9cblx0XHRkZWxldGUgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NO1xuXHR9LFxuXHRyZW5kZXJFcnJvcnMoKXtcblx0XHQvL3N1cHBvcnQgZm9yIGlubGluZSBhbmQgZXJyb3IgbGlzdD9cblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSA9IHRoaXMuZ3JvdXBzW2dyb3VwXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5maWVsZHNbdGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5hcHBlbmRDaGlsZChoKCdkaXYnLCB7IGNsYXNzOiAnZXJyb3InIH0sIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzWzBdKSk7XG5cdFx0XG5cdFx0Ly9zZXQgYXJpYS1pbnZhbGlkIG9uIGludmFsaWQgaW5wdXRzXG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcblx0fSxcblx0YWRkTWV0aG9kKG5hbWUsIGZuLCBtZXNzYWdlKXtcblx0XHR0aGlzLmdyb3Vwcy52YWxpZGF0b3JzLnB1c2goZm4pO1xuXHRcdC8vZXh0ZW5kIG1lc3NhZ2VzXG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUQ09SRV9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ21pbicsICdtYXgnXSxcbiAgICByYW5nZTogWydtaW4nLCAnbWF4J10sXG4gICAgbWluOiBbJ21pbiddLFxuICAgIG1heDogIFsnbWF4J10sXG4gICAgbWlubGVuZ3RoOiBbJ21pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXgnXSxcbiAgICByZW1vdGU6IFsndXJsJywgJ3R5cGUnLCAnYWRkaXRpb25hbGZpZWxkcyddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVENPUkVfQURBUFRPUlMgPSBbXG4gICAgLy8ncmVnZXgnLCAtPiBzYW1lIGFzIHBhdHRlcm4sIGhvdyBpcyBpdCBhcHBsaWVkIHRvIGFuIGVsZW1lbnQ/IHBhdHRlcm4gYXR0cmlidXRlPyBkYXRhLXZhbC1yZWdleD9cbiAgICAncmVxdWlyZWQnLFxuICAgICdkYXRlJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnZW1haWwnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdsZW5ndGgnLFxuICAgICdyYW5nZScsXG4gICAgJ2VxdWFsdG8nLFxuICAgICdyZW1vdGUnLFxuICAgICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICAvLyBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIC8vcmFuZ2VsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9IGNoYXJhY3RlcnMgbG9uZy5gOyB9LFxuICAgIC8vcmFuZ2UocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0uYDsgfSxcbiAgICAvL3JlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfSxcbiAgICAvL3N0ZXAocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIG11bHRpcGxlIG9mICR7cHJvcHN9LmA7IH1cbn07IiwiaW1wb3J0IHsgaXNTZWxlY3QsIGlzQ2hlY2thYmxlLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLy9pc24ndCByZXF1aXJlZCBhbmQgbm8gdmFsdWVcbmNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gZmFsc2U7XG5cbmNvbnN0IHJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgcGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09IGZhbHNlLFxuICAgIGVtYWlsOiByZWdleE1ldGhvZChFTUFJTF9SRUdFWCksXG4gICAgdXJsOiByZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogcmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogcmVnZXhNZXRob2QoTlVNQkVSX1JFR0VYKSxcbiAgICBkaWdpdHM6IHJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBwYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IHBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1pbjogcGFyYW1NZXRob2QoJ21pbicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA+PSArcGFyYW0sIGFjYykpLFxuICAgIG1heDogcGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW0sIGFjYykpLFxuICAgIGxlbmd0aDogcGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXNbMF0gJiYgKHBhcmFtc1sxXSA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtc1sxXSkpLCBhY2MpKSxcbiAgICByYW5nZTogcGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zWzFdKSwgYWNjKSksXG4gICAgXG4gICAgLy8gcmFuZ2VsZW5ndGhcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0MjBcblxuXG4gICAgLy8gcmFuZ2VcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlLW1ldGhvZC9cbiAgICAvLyBcbiAgICAvLyBzdGVwXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9zdGVwLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NDFcblxuICAgIC8vIGVxdWFsVG9cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2VxdWFsVG8tbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ3OVxuXG4gICAgLy8gcmVtb3RlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZW1vdGUtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ5MlxuXG4gICAgLyogXG4gICAgRXh0ZW5zaW9uc1xuICAgICAgICAtIHBhc3N3b3JkXG4gICAgICAgIC0gbm9uYWxwaGFtaW4gL1xcVy9nXG4gICAgICAgIC0gcmVnZXgvcGF0dGVyblxuICAgICAgICAtIGJvb2xcbiAgICAgICAgLSBmaWxlZXh0ZW5zaW9uc1xuICAgICovXG59OyIsImV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59OyIsIiBleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSkge1xuICAgICAgICBpZihpbnB1dC5jaGVja2VkKXtcbiAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpO1xuICAgICAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICByZXR1cm4gYWNjO1xufVxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4ge1xuICAgIHJldHVybiBncm91cC5maWVsZHNcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoaW5wdXQuY2hlY2tlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xufTtcblxuXG5leHBvcnQgY29uc3QgY2hvb3NlUmVhbFRpbWVFdmVudCA9IGlucHV0ID0+IFsnaW5wdXQnLCAnY2hhbmdlJ11bTnVtYmVyKGlzQ2hlY2thYmxlKGlucHV0KSB8fCBpc1NlbGVjdChpbnB1dCkpXTtcblxuLy8gY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSB0eXBlID0+IGlucHV0Lmhhc0F0dHJpYnV0ZSh0eXBlKSA/IGlucHV0LmdldEF0dHJpYnV0ZSh0eXBlKSA6IGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS1ydWxlLSR7dHlwZX1gKSA/IGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS12YWwtJHt0eXBlfWApXG5cblxuLy8gY29uc3QgY29tcG9zZXIgPSAoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSk7XG4vLyBleHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoY29tcG9zZXIpO1xuLy8gZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlUmlnaHQoY29tcG9zZXIpO1xuXG5leHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpKTtcbmV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gY29tcG9zZS5hcHBseShjb21wb3NlLCBmbnMucmV2ZXJzZSgpKTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9tZXNzYWdlcyc7XG5pbXBvcnQgeyBET1RORVRDT1JFX0FEQVBUT1JTLCBET1RORVRDT1JFX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG4vLyBjb25zdCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuLy8gY29uc3QgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbi8vIGNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsIGNvbnN0cmFpbnQpO1xuXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRDT1JFX0FEQVBUT1JTXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSkgcmV0dXJuIHZhbGlkYXRvcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzLnB1c2goT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZTogYWRhcHRvciwgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPVE5FVENPUkVfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IERPVE5FVENPUkVfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gQXJyYXkuZnJvbShub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuLypcbkBwYXJhbXMgRE9NIG5vZGUgaW5wdXRcbkByZXR1cm5zIE9iamVjdFxue1xuICAgIHR5cGU6IFN0cmluZyBbcmVxdWlyZWRdLFxuICAgIHBhcmFtczogQXJyYXkgW29wdGlvbmFsXSxcbiAgICBtZXNzYWdlOiBTdHJpbmcgW29wdGlvbmFsXVxufVxuKi9cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgXG4gICAgLy9ob3cgdG8gbWVyZ2UgdGhlIHNhbWUgdmFsaWRhdG9yIGZyb20gbXVsdGlwbGUgc291cmNlcywgZS5nLiBET00gYXR0cmlidXRlIHZlcnN1cyBkYXRhLXZhbD9cbiAgICAvL2Fzc3VtZSBkYXRhLXZhbCBpcyBjYW5ub25pY2FsP1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnKSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgZWxzZSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICAvLyBUbyBkb1xuICAgIC8vIHZhbGlkYXRlIHRoZSB2YWxpZGF0aW9uIHBhcmFtZXRlcnNcblxuICAgIC8qXG4gICAgLy9kYXRlXG5cbiAgICAvL2RhdGVJU09cblxuICAgIC8vbWF4bGVuZ3RoXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfSk7XG5cbiAgICAvL21pblxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWluJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21pbicpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW4nLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX0pO1xuXG4gICAgLy9tYXhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9KTtcblxuICAgIC8vc3RlcFxuXG4gICAgLy9lcXVhbFRvXG5cbiAgICAvL3JlbW90ZVxuXG4gICAgLy9kaWdpdHNcblxuICAgIC8vcmFuZ2VsZW5ndGhcbiAgICAqL1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbiAgICBpZihtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCkpIHJldHVybiBhY2M7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyA/IFsuLi5hY2MuZXJyb3JNZXNzYWdlcywgZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV0gOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbiAgICB9Oztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9ICh2YWxpZGF0b3IsIGdyb3VwKSA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKSBcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
