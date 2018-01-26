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

		//delete me please
		this.inputs = Array.from(this.form.querySelectorAll('input:not([type=submit]), textarea, select'));

		this.groups = (0, _validators.removeUnvalidatableGroups)(this.inputs.reduce(_validators.assembleValidationGroup, {}));

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

		//map/over groups instead
		this.inputs.forEach(function (input) {
			input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler);
		});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixB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LGdFQUE0QixTQUE1QixBQUE0QixrQ0FBVSxBQUMvQztRQUFJLG1CQUFKLEFBQXVCLEFBRXZCOztTQUFJLElBQUosQUFBUSxTQUFSLEFBQWlCLFFBQ2I7WUFBRyxPQUFBLEFBQU8sT0FBUCxBQUFjLFdBQWQsQUFBeUIsU0FBNUIsQUFBcUMsR0FDakMsaUJBQUEsQUFBaUIsU0FBUyxPQUZsQyxBQUVRLEFBQTBCLEFBQU87QUFFekMsWUFBQSxBQUFPLEFBQ1Y7QUFSTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0Ly8gbGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICBsZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKGBWYWxpZGF0aW9uIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQgZm9yIHNlbGVjdG9yICR7c2VsfWApO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwgW10pO1xufTtcblxuLypcblx0Q2hlY2sgd2hldGhlciBhIGZvcm0gY29udGFpbmluZyBhbnkgZmllbGRzIHdpdGggZGF0YS12YWw9dHJ1ZVxuXHRJbml0aWFsaXNlIHVzaW5nIGRhdGEtdmFsLXRydWUgdG8gZGVzaWduYXRlIHZhbGlkYXRlYWJsZSBpbnB1dHNcbiovXG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBcblx0dmFsaWRhdGlvblJlZHVjZXIsXG5cdGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLFxuXHRub3JtYWxpc2VWYWxpZGF0b3JzLFxuXHRyZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzXG59IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBoIH0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXG5cdFx0Ly9kZWxldGUgbWUgcGxlYXNlXG5cdFx0dGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSk7XG5cdFx0XG5cdFx0dGhpcy5ncm91cHMgPSByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKHRoaXMuaW5wdXRzLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKTtcblxuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXHRcdFxuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXG5cdFx0LypcblxuXHRcdDEuIHJlZi4gPGlucHV0IGRhdGEtcnVsZS1taW5sZW5ndGg9XCIyXCIgZGF0YS1ydWxlLW1heGxlbmd0aD1cIjRcIiBkYXRhLW1zZy1taW5sZW5ndGg9XCJBdCBsZWFzdCB0d28gY2hhcnNcIiBkYXRhLW1zZy1tYXhsZW5ndGg9XCJBdCBtb3N0IGZvdXJzIGNoYXJzXCI+XG5cblxuXHRcdDIuIHJlZi4gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9maWxlcy9kZW1vL1xuXHRcdFxuXHRcdDMuIHJlZi4gQ29uc3RyYWludCB2YWxpZGF0aW9uIEFQSVxuXHRcdFZhbGlkYXRpb24tcmVwYXRlZCBhdHRyaWJ1dGVzXG5cdFx0XHQtIHBhdHRlcm4sIHJlZ2V4LCAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4nXG5cdFx0XHQtIG1pbiwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZS4nXG5cdFx0XHQtIG1heCwgbnVtYmVyLCAnVGhlIHZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZScsXG5cdFx0XHQtIHJlcXVpcmVkLCBub25lLCAnVGhlcmUgbXVzdCBiZSBhIHZhbHVlJyxcblx0XHRcdC0gbWF4bGVuZ3RoLCBpbnQgbGVuZ3RoLCAnVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIChjb2RlIHBvaW50cykgbXVzdCBub3QgZXhjZWVkIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLicgXG5cblx0XHQ0LiByZWYuIGh0dHBzOi8vZ2l0aHViLmNvbS9hc3BuZXQvanF1ZXJ5LXZhbGlkYXRpb24tdW5vYnRydXNpdmUvYmxvYi9tYXN0ZXIvc3JjL2pxdWVyeS52YWxpZGF0ZS51bm9idHJ1c2l2ZS5qc1xuXG5cdFx0Ki9cblxuXHRcdC8vdmFsaWRhdGUgd2hvbGUgZm9ybVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRMaXN0ZW5lcnMoKXtcblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmNsZWFyRXJyb3JzKCk7XG5cdFx0XHRpZih0aGlzLnNldFZhbGlkaXR5U3RhdGUoKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGxldCBncm91cCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRpZighdGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdC8vbWFwL292ZXIgZ3JvdXBzIGluc3RlYWRcblx0XHR0aGlzLmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoY2hvb3NlUmVhbFRpbWVFdmVudChpbnB1dCksIGhhbmRsZXIpO1xuXHRcdH0pO1xuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSxcblx0XHRcdFx0XHRcdFx0XHR7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9LCAvL3Jlc2V0IHZhbGlkaXR5IGFuZCBlcnJvck1lc3NhZ2VzYVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLnJlZHVjZSh2YWxpZGF0aW9uUmVkdWNlcih0aGlzLmdyb3Vwc1tncm91cF0pLCB0cnVlKSk7XG5cdFx0cmV0dXJuIHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZDtcblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBudW1FcnJvcnMgPSAwO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApO1xuXHRcdFx0IXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCAmJiArK251bUVycm9ycztcblx0XHR9XG5cdFx0cmV0dXJuIG51bUVycm9ycyA9PT0gMDtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuXHRcdGRlbGV0ZSB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET007XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NID0gdGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRDT1JFX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbWluJywgJ21heCddLFxuICAgIHJhbmdlOiBbJ21pbicsICdtYXgnXSxcbiAgICBtaW46IFsnbWluJ10sXG4gICAgbWF4OiAgWydtYXgnXSxcbiAgICBtaW5sZW5ndGg6IFsnbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heCddLFxuICAgIHJlbW90ZTogWyd1cmwnLCAndHlwZScsICdhZGRpdGlvbmFsZmllbGRzJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUQ09SRV9BREFQVE9SUyA9IFtcbiAgICAvLydyZWdleCcsIC0+IHNhbWUgYXMgcGF0dGVybiwgaG93IGlzIGl0IGFwcGxpZWQgdG8gYW4gZWxlbWVudD8gcGF0dGVybiBhdHRyaWJ1dGU/IGRhdGEtdmFsLXJlZ2V4P1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ2RhdGUnLFxuICAgICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsXG4gICAgJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dOyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIC8vIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vL2lzbid0IHJlcXVpcmVkIGFuZCBubyB2YWx1ZVxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSBmYWxzZTtcblxuY29uc3QgcmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBwYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXMpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gZmFsc2UsXG4gICAgZW1haWw6IHJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IHJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiByZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiByZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogcmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IHBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogcGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWluOiBwYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbSwgYWNjKSksXG4gICAgbWF4OiBwYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbSwgYWNjKSksXG4gICAgbGVuZ3RoOiBwYXJhbU1ldGhvZCgnbGVuZ3RoJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtc1swXSAmJiAocGFyYW1zWzFdID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zWzFdKSksIGFjYykpLFxuICAgIHJhbmdlOiBwYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXNbMF0gJiYgK2lucHV0LnZhbHVlIDw9ICtwYXJhbXNbMV0pLCBhY2MpKSxcbiAgICBcbiAgICAvLyByYW5nZWxlbmd0aFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2VsZW5ndGgtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQyMFxuXG5cbiAgICAvLyByYW5nZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuICAgIC8vIFxuICAgIC8vIHN0ZXBcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ0MVxuXG4gICAgLy8gZXF1YWxUb1xuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDc5XG5cbiAgICAvLyByZW1vdGVcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlbW90ZS1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDkyXG5cbiAgICAvKiBcbiAgICBFeHRlbnNpb25zXG4gICAgICAgIC0gcGFzc3dvcmRcbiAgICAgICAgLSBub25hbHBoYW1pbiAvXFxXL2dcbiAgICAgICAgLSByZWdleC9wYXR0ZXJuXG4gICAgICAgIC0gYm9vbFxuICAgICAgICAtIGZpbGVleHRlbnNpb25zXG4gICAgKi9cbn07IiwiZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07IiwiIGV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNDaGVja2FibGUgPSBmaWVsZCA9PiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZmllbGQudHlwZSk7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5jb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpKSB7XG4gICAgICAgIGlmKGlucHV0LmNoZWNrZWQpe1xuICAgICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiB7XG4gICAgcmV0dXJuIGdyb3VwLmZpZWxkc1xuICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZihpbnB1dC5jaGVja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSldO1xuXG4vLyBjb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IHR5cGUgPT4gaW5wdXQuaGFzQXR0cmlidXRlKHR5cGUpID8gaW5wdXQuZ2V0QXR0cmlidXRlKHR5cGUpIDogaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXJ1bGUtJHt0eXBlfWApID8gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3R5cGV9YClcblxuXG4vLyBjb25zdCBjb21wb3NlciA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKTtcbi8vIGV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZShjb21wb3Nlcik7XG4vLyBleHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2VSaWdodChjb21wb3Nlcik7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBjb21wb3NlLmFwcGx5KGNvbXBvc2UsIGZucy5yZXZlcnNlKCkpOyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IERPVE5FVENPUkVfQURBUFRPUlMsIERPVE5FVENPUkVfUEFSQU1TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbi8vIGNvbnN0IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtcnVsZS0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICE9PSAnZmFsc2UnO1xuXG4vLyBjb25zdCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7Y29uc3RyYWludH1gKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuLy8gY29uc3QgY2hlY2tGb3JDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gY29uc3RyYWludCB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgY29uc3RyYWludCk7XG5cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVENPUkVfQURBUFRPUlNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApKSByZXR1cm4gdmFsaWRhdG9ycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnMucHVzaChPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlOiBhZGFwdG9yLCBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9UTkVUQ09SRV9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogRE9UTkVUQ09SRV9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgYWNjLnB1c2goaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuLy9mb3IgZGF0YS1ydWxlLSogc3VwcG9ydFxuLy9jb25zdCBoYXNEYXRhQXR0cmlidXRlUGFydCA9IChub2RlLCBwYXJ0KSA9PiBBcnJheS5mcm9tKG5vZGUuZGF0YXNldCkuZmlsdGVyKGF0dHJpYnV0ZSA9PiAhIX5hdHRyaWJ1dGUuaW5kZXhPZihwYXJ0KSkubGVuZ3RoID4gMDtcblxuY29uc3QgZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBpZihpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdyZXF1aXJlZCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICd1cmwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKV19KTtcbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07XG4vKlxuQHBhcmFtcyBET00gbm9kZSBpbnB1dFxuQHJldHVybnMgT2JqZWN0XG57XG4gICAgdHlwZTogU3RyaW5nIFtyZXF1aXJlZF0sXG4gICAgcGFyYW1zOiBBcnJheSBbb3B0aW9uYWxdLFxuICAgIG1lc3NhZ2U6IFN0cmluZyBbb3B0aW9uYWxdXG59XG4qL1xuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBcbiAgICAvL2hvdyB0byBtZXJnZSB0aGUgc2FtZSB2YWxpZGF0b3IgZnJvbSBtdWx0aXBsZSBzb3VyY2VzLCBlLmcuIERPTSBhdHRyaWJ1dGUgdmVyc3VzIGRhdGEtdmFsP1xuICAgIC8vYXNzdW1lIGRhdGEtdmFsIGlzIGNhbm5vbmljYWw/XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbCcpID09PSAndHJ1ZScpIHZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmNvbmNhdChleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICBlbHNlIHZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmNvbmNhdChleHRyYWN0QXR0cmlidXRlVmFsaWRhdG9ycyhpbnB1dCkpO1xuICAgIC8vIFRvIGRvXG4gICAgLy8gdmFsaWRhdGUgdGhlIHZhbGlkYXRpb24gcGFyYW1ldGVyc1xuXG4gICAgLypcbiAgICAvL2RhdGVcblxuICAgIC8vZGF0ZUlTT1xuXG4gICAgLy9tYXhsZW5ndGhcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21heGxlbmd0aCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtYXhsZW5ndGgnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9KTtcblxuICAgIC8vbWluXG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWluJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfSk7XG5cbiAgICAvL21heFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4JykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX0pO1xuXG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cblxuICAgIC8vcmVtb3RlXG5cbiAgICAvL2RpZ2l0c1xuXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uUmVkdWNlciA9IGdyb3VwID0+IChhY2MsIHZhbGlkYXRvcikgPT4ge1xuICAgIGlmKG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zICYmIHZhbGlkYXRvci5wYXJhbXMubGVuZ3RoID4gMCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKSkgcmV0dXJuIGFjYztcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSA6IFtleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXVxuICAgIH07O1xufTtcblxuZXhwb3J0IGNvbnN0IGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSkge1xuICAgICAgICBhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldID0ge1xuICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIFxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTsiXX0=
