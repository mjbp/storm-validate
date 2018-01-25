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

var _validators = require('./utils/validators');

var _dom = require('./utils/dom');

// import inputPrototype from './input-prototype';
// import { chooseRealTimeEvent } from './utils';
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
			// let ev = chooseRealTimeEvent(input);
			input.addEventListener('input', handler);
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
};

},{"./utils/dom":9,"./utils/validators":10}],4:[function(require,module,exports){
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

},{"./messages":6,"./methods":7}],9:[function(require,module,exports){
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

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    var validators = [];

    //how to merge the same validator from multiple sources, e.g. DOM attribute versus data-val?
    //assume data-val is cannonical?
    if (input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));else validators = validators.concat(extractAttributeValidators(input));
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

var validationReducer = exports.validationReducer = function validationReducer(group) {
    return function (acc, validator) {
        if (!_methods2.default[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) {
            acc = {
                valid: false,
                errorMessages: acc.errorMessages ? [].concat(_toConsumableArray(acc.errorMessages), [extractErrorMessage(validator, group)]) : [extractErrorMessage(validator, group)]
            };
        }
        return acc;
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
    // to do
    // implement custom vaidation messages
    return validator.message || _messages2.default[validator.type](validator.params !== undefined ? validator.params : null);
};

var removeUnvalidatableGroups = exports.removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

},{"../constants":4,"../messages":6,"../methods":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztBQ05sRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0FBQ0c7S0FBSSxNQUFNLE1BQUEsQUFBTSxLQUFLLFNBQUEsQUFBUyxpQkFBOUIsQUFBVSxBQUFXLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsaUZBQWYsQUFBTyxBQUF1RixBQUU5Rzs7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UUFDYjtZQUFHLE9BQUEsQUFBTyxPQUFQLEFBQWMsV0FBZCxBQUF5QixTQUE1QixBQUFxQyxHQUNqQyxpQkFBQSxBQUFpQixTQUFTLE9BRmxDLEFBRVEsQUFBMEIsQUFBTztBQUV6QyxZQUFBLEFBQU8sQUFDVjtBQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHQvLyBsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuICAgIGxldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cblx0aWYoIWVscy5sZW5ndGgpIHJldHVybiBjb25zb2xlLndhcm4oYFZhbGlkYXRpb24gbm90IGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCBmb3Igc2VsZWN0b3IgJHtzZWx9YCk7XG4gICAgXG5cdHJldHVybiBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRhY2MucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0Zm9ybTogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG59O1xuXG4vKlxuXHRDaGVjayB3aGV0aGVyIGEgZm9ybSBjb250YWluaW5nIGFueSBmaWVsZHMgd2l0aCBkYXRhLXZhbD10cnVlXG5cdEluaXRpYWxpc2UgdXNpbmcgZGF0YS12YWwtdHJ1ZSB0byBkZXNpZ25hdGUgdmFsaWRhdGVhYmxlIGlucHV0c1xuKi9cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiLy8gaW1wb3J0IGlucHV0UHJvdG90eXBlIGZyb20gJy4vaW5wdXQtcHJvdG90eXBlJztcbi8vIGltcG9ydCB7IGNob29zZVJlYWxUaW1lRXZlbnQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFxuXHR2YWxpZGF0aW9uUmVkdWNlcixcblx0YXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsXG5cdG5vcm1hbGlzZVZhbGlkYXRvcnMsXG5cdHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHNcbn0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcbmltcG9ydCB7IGggfSBmcm9tICcuL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHQvL3ByZXZlbnQgYnJvd3NlciB2YWxpZGF0aW9uXG5cdFx0dGhpcy5mb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cblx0XHQvL2RlbGV0ZSBtZSBwbGVhc2Vcblx0XHR0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKTtcblx0XHRcblx0XHR0aGlzLmdyb3VwcyA9IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHModGhpcy5pbnB1dHMucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cdFx0XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdyb3Vwcyk7XG5cblx0XHQvKlxuXG5cdFx0MS4gcmVmLiA8aW5wdXQgZGF0YS1ydWxlLW1pbmxlbmd0aD1cIjJcIiBkYXRhLXJ1bGUtbWF4bGVuZ3RoPVwiNFwiIGRhdGEtbXNnLW1pbmxlbmd0aD1cIkF0IGxlYXN0IHR3byBjaGFyc1wiIGRhdGEtbXNnLW1heGxlbmd0aD1cIkF0IG1vc3QgZm91cnMgY2hhcnNcIj5cblxuXG5cdFx0Mi4gcmVmLiBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGVzL2RlbW8vXG5cdFx0XG5cdFx0My4gcmVmLiBDb25zdHJhaW50IHZhbGlkYXRpb24gQVBJXG5cdFx0VmFsaWRhdGlvbi1yZXBhdGVkIGF0dHJpYnV0ZXNcblx0XHRcdC0gcGF0dGVybiwgcmVnZXgsICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybidcblx0XHRcdC0gbWluLCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlLidcblx0XHRcdC0gbWF4LCBudW1iZXIsICdUaGUgdmFsdWUgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlJyxcblx0XHRcdC0gcmVxdWlyZWQsIG5vbmUsICdUaGVyZSBtdXN0IGJlIGEgdmFsdWUnLFxuXHRcdFx0LSBtYXhsZW5ndGgsIGludCBsZW5ndGgsICdUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgKGNvZGUgcG9pbnRzKSBtdXN0IG5vdCBleGNlZWQgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuJyBcblxuXHRcdDQuIHJlZi4gaHR0cHM6Ly9naXRodWIuY29tL2FzcG5ldC9qcXVlcnktdmFsaWRhdGlvbi11bm9idHJ1c2l2ZS9ibG9iL21hc3Rlci9zcmMvanF1ZXJ5LnZhbGlkYXRlLnVub2J0cnVzaXZlLmpzXG5cblx0XHQqL1xuXG5cdFx0Ly92YWxpZGF0ZSB3aG9sZSBmb3JtXG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdExpc3RlbmVycygpe1xuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuY2xlYXJFcnJvcnMoKTtcblx0XHRcdGlmKHRoaXMuc2V0VmFsaWRpdHlTdGF0ZSgpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRlbHNlIHRoaXMucmVuZGVyRXJyb3JzKCksIHRoaXMuaW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgZSA9PiB7IHRoaXMuY2xlYXJFcnJvcnMoKTsgfSk7XG5cdH0sXG5cdGluaXRSZWFsVGltZVZhbGlkYXRpb24oKXtcblx0XHRsZXQgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0bGV0IGdyb3VwID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0XHRcdGlmKCF0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCkpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0Ly9tYXAvb3ZlciBncm91cHMgaW5zdGVhZFxuXHRcdHRoaXMuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdFx0Ly8gbGV0IGV2ID0gY2hvb3NlUmVhbFRpbWVFdmVudChpbnB1dCk7XG5cdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGhhbmRsZXIpO1xuXHRcdH0pO1xuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSxcblx0XHRcdFx0XHRcdFx0XHR7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9LCAvL3Jlc2V0IHZhbGlkaXR5IGFuZCBlcnJvck1lc3NhZ2VzYVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLnJlZHVjZSh2YWxpZGF0aW9uUmVkdWNlcih0aGlzLmdyb3Vwc1tncm91cF0pLCB0cnVlKSk7XG5cdFx0cmV0dXJuIHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZDtcblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBudW1FcnJvcnMgPSAwO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApO1xuXHRcdFx0IXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCAmJiArK251bUVycm9ycztcblx0XHR9XG5cdFx0cmV0dXJuIG51bUVycm9ycyA9PT0gMDtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuXHRcdGRlbGV0ZSB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET007XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NID0gdGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRDT1JFX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbWluJywgJ21heCddLFxuICAgIHJhbmdlOiBbJ21pbicsICdtYXgnXSxcbiAgICBtaW46IFsnbWluJ10sXG4gICAgbWF4OiAgWydtYXgnXSxcbiAgICBtaW5sZW5ndGg6IFsnbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heCddLFxuICAgIHJlbW90ZTogWyd1cmwnLCAndHlwZScsICdhZGRpdGlvbmFsZmllbGRzJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUQ09SRV9BREFQVE9SUyA9IFtcbiAgICAvLydyZWdleCcsIC0+IHNhbWUgYXMgcGF0dGVybiwgaG93IGlzIGl0IGFwcGxpZWQgdG8gYW4gZWxlbWVudD8gcGF0dGVybiBhdHRyaWJ1dGU/IGRhdGEtdmFsLXJlZ2V4P1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ2RhdGUnLFxuICAgICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsXG4gICAgJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dOyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIC8vIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGlzT3B0aW9uYWwsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCByZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IHBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcyksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSBmYWxzZSxcbiAgICBlbWFpbDogcmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogcmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IHJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IHJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiByZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogcGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBwYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBtaW46IHBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtLCBhY2MpKSxcbiAgICBtYXg6IHBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK3BhcmFtLCBhY2MpKSxcbiAgICBsZW5ndGg6IHBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zWzBdICYmIChwYXJhbXNbMV0gPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXNbMV0pKSwgYWNjKSksXG4gICAgcmFuZ2U6IHBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtc1swXSAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtc1sxXSksIGFjYykpLFxuXG4gICAgLy9yZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICggdmFsdWUgPj0gcGFyYW1bIDAgXSAmJiB2YWx1ZSA8PSBwYXJhbVsgMSBdICk7XG4gICAgXG4gICAgLy8gcmFuZ2VsZW5ndGhcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0MjBcblxuXG4gICAgLy8gcmFuZ2VcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlLW1ldGhvZC9cbiAgICAvLyBcbiAgICAvLyBzdGVwXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9zdGVwLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NDFcblxuICAgIC8vIGVxdWFsVG9cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2VxdWFsVG8tbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ3OVxuXG4gICAgLy8gcmVtb3RlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZW1vdGUtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ5MlxuXG4gICAgLyogXG4gICAgRXh0ZW5zaW9uc1xuICAgICAgICAtIHBhc3N3b3JkXG4gICAgICAgIC0gbm9uYWxwaGFtaW4gL1xcVy9nXG4gICAgICAgIC0gcmVnZXgvcGF0dGVyblxuICAgICAgICAtIGJvb2xcbiAgICAgICAgLSBmaWxlZXh0ZW5zaW9uc1xuICAgICovXG59OyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi9tZXNzYWdlcyc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNDaGVja2FibGUgPSBmaWVsZCA9PiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZmllbGQudHlwZSk7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG4vL2lzbid0IHJlcXVpcmVkIGFuZCBubyB2YWx1ZVxuZXhwb3J0IGNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gZmFsc2U7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKHZhbHVlLCBpbnB1dCkgPT4ge1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKXtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgdmFsdWUgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICBlbHNlIGlmKGhhc1ZhbHVlKGlucHV0KSkgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0ZWRHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcykgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RHcm91cHMgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG4gICAgICAgIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSB7XG4gICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldLmZpZWxkcy5wdXNoKGlucHV0KTtcbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSAodmFsaWRhdG9yLCBncm91cCkgPT4ge1xuICAgIC8vIHRvIGRvXG4gICAgLy8gaW1wbGVtZW50IGN1c3RvbSB2YWlkYXRpb24gbWVzc2FnZXNcbiAgICByZXR1cm4gbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbSAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtIDogbnVsbCk7XG59O1xuXG5leHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWx0aW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2tleXVwJywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpKV07XG5cbmNvbnN0IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtcnVsZS0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICE9PSAnZmFsc2UnO1xuXG5jb25zdCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7Y29uc3RyYWludH1gKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuY29uc3QgY2hlY2tGb3JDb25zdHJhaW50ID0gKGlucHV0LCBjb25zdHJhaW50KSA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gY29uc3RyYWludCB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgY29uc3RyYWludCk7XG5cbi8vIGNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gdHlwZSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUodHlwZSkgPyBpbnB1dC5nZXRBdHRyaWJ1dGUodHlwZSkgOiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtcnVsZS0ke3R5cGV9YCkgPyBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7dHlwZX1gKVxuXG5leHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbiAgICBpZighbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbSAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtIDogbnVsbCkpIHtcbiAgICAgICAgYWNjID0ge1xuICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogYWNjLmVycm9yTWVzc2FnZXMgPyBbLi4uYWNjLmVycm9yTWVzc2FnZXMsIGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldIDogW2V4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59O1xuXG5cbi8vIGNvbnN0IGNvbXBvc2VyID0gKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpO1xuLy8gZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKGNvbXBvc2VyKTtcbi8vIGV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZVJpZ2h0KGNvbXBvc2VyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGNvbXBvc2UuYXBwbHkoY29tcG9zZSwgZm5zLnJldmVyc2UoKSk7XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgLy8gVG8gZG9cbiAgICAvLyB2YWxpZGF0ZSB0aGUgdmFsaWRhdGlvbiBwYXJhbWV0ZXJzXG5cbiAgICAvKlxuICAgICAgICAtIGNoZWNrIGlmIGRhdGEtdmFsPVwidHJ1ZVwiXG5cbiAgICAgICAgICAgIHZhbGlkYXRvcjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcgW3JlcXVpcmVkXSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IEFycmF5IFtvcHRpb25hbF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogU3RyaW5nIFtvcHRpb25hbF1cbiAgICAgICAgICAgIH1cblxuICAgICovXG4gICAgLypcbiAgICAvL3JlcXVpcmVkXG4gICAgaWYoKGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG5cbiAgICAvL2VtYWlsXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZW1haWwnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnZW1haWwnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG5cbiAgICAvL3VybFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ3VybCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICd1cmwnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuXG4gICAgLy9kYXRlXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZScpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdkYXRlJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2RhdGUnfSk7XG5cbiAgICAvL2RhdGVJU09cbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdkYXRlSVNPJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ2RhdGVJU08nKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZGF0ZUlTTyd9KTtcblxuICAgIC8vbnVtYmVyXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnbnVtYmVyJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ251bWJlcicpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG5cbiAgICAvL21pbmxlbmd0aFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWlubGVuZ3RoJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbTogZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoJ21pbmxlbmd0aCcpfSk7XG5cbiAgICAvL21heGxlbmd0aFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heGxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX0pO1xuXG4gICAgLy9taW5cbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21pbicpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWluJywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9KTtcblxuICAgIC8vbWF4XG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWF4JykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heCcsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfSk7XG5cbiAgICAvL21heFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4JykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX0pO1xuXG5cbiAgICAvL3N0ZXBcblxuICAgIC8vZXF1YWxUb1xuXG4gICAgLy9yZW1vdGVcblxuICAgIC8vZGlnaXRzXG5cbiAgICAvL3JhbmdlbGVuZ3RoXG4gICAgKi9cblxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9tZXNzYWdlcyc7XG5pbXBvcnQgeyBET1RORVRDT1JFX0FEQVBUT1JTLCBET1RORVRDT1JFX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG4vLyBjb25zdCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXJ1bGUtJHtjb25zdHJhaW50fWApICYmIGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS1ydWxlLSR7Y29uc3RyYWludH1gKSAhPT0gJ2ZhbHNlJztcblxuLy8gY29uc3QgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2NvbnN0cmFpbnR9YCkgIT09ICdmYWxzZSc7XG5cbi8vIGNvbnN0IGNoZWNrRm9yQ29uc3RyYWludCA9IChpbnB1dCwgY29uc3RyYWludCkgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IGNvbnN0cmFpbnQgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsIGNvbnN0cmFpbnQpO1xuXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRDT1JFX0FEQVBUT1JTXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSkgcmV0dXJuIHZhbGlkYXRvcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzLnB1c2goT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZTogYWRhcHRvciwgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPVE5FVENPUkVfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IERPVE5FVENPUkVfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gQXJyYXkuZnJvbShub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIFxuICAgIC8vaG93IHRvIG1lcmdlIHRoZSBzYW1lIHZhbGlkYXRvciBmcm9tIG11bHRpcGxlIHNvdXJjZXMsIGUuZy4gRE9NIGF0dHJpYnV0ZSB2ZXJzdXMgZGF0YS12YWw/XG4gICAgLy9hc3N1bWUgZGF0YS12YWwgaXMgY2Fubm9uaWNhbD9cbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJykgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dCkpO1xuICAgIGVsc2UgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgLy8gVG8gZG9cbiAgICAvLyB2YWxpZGF0ZSB0aGUgdmFsaWRhdGlvbiBwYXJhbWV0ZXJzXG5cbiAgICAvKlxuICAgICAgICAtIGNoZWNrIGlmIGRhdGEtdmFsPVwidHJ1ZVwiXG5cbiAgICAgICAgICAgIHZhbGlkYXRvcjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcgW3JlcXVpcmVkXSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IEFycmF5IFtvcHRpb25hbF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogU3RyaW5nIFtvcHRpb25hbF1cbiAgICAgICAgICAgIH1cblxuICAgICovXG4gICAgLypcbiAgICAvL3JlcXVpcmVkXG4gICAgaWYoKGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAncmVxdWlyZWQnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG5cbiAgICAvL2VtYWlsXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZW1haWwnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnZW1haWwnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG5cbiAgICAvL3VybFxuICAgIGlmKGNoZWNrRm9yQ29uc3RyYWludChpbnB1dCwgJ3VybCcpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICd1cmwnKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuXG4gICAgLy9kYXRlXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnZGF0ZScpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdkYXRlJykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2RhdGUnfSk7XG5cbiAgICAvL2RhdGVJU09cbiAgICBpZihjaGVja0ZvckNvbnN0cmFpbnQoaW5wdXQsICdkYXRlSVNPJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ2RhdGVJU08nKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZGF0ZUlTTyd9KTtcblxuICAgIC8vbnVtYmVyXG4gICAgaWYoY2hlY2tGb3JDb25zdHJhaW50KGlucHV0LCAnbnVtYmVyJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ251bWJlcicpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG5cbiAgICAvL21pbmxlbmd0aFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWlubGVuZ3RoJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21pbmxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbTogZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoJ21pbmxlbmd0aCcpfSk7XG5cbiAgICAvL21heGxlbmd0aFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4bGVuZ3RoJykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heGxlbmd0aCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX0pO1xuXG4gICAgLy9taW5cbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSB8fCBjaGVja0ZvckRhdGFSdWxlQ29uc3RyYWludChpbnB1dCwgJ21pbicpIHx8IGNoZWNrRm9yRGF0YVZhbENvbnN0cmFpbnQoaW5wdXQsICdtaW4nKSkgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWluJywgcGFyYW06IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9KTtcblxuICAgIC8vbWF4XG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgfHwgY2hlY2tGb3JEYXRhUnVsZUNvbnN0cmFpbnQoaW5wdXQsICdtYXgnKSB8fCBjaGVja0ZvckRhdGFWYWxDb25zdHJhaW50KGlucHV0LCAnbWF4JykpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heCcsIHBhcmFtOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfSk7XG5cbiAgICAvL21heFxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpIHx8IGNoZWNrRm9yRGF0YVJ1bGVDb25zdHJhaW50KGlucHV0LCAnbWF4JykgfHwgY2hlY2tGb3JEYXRhVmFsQ29uc3RyYWludChpbnB1dCwgJ21heCcpKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbTogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX0pO1xuXG5cbiAgICAvL3N0ZXBcblxuICAgIC8vZXF1YWxUb1xuXG4gICAgLy9yZW1vdGVcblxuICAgIC8vZGlnaXRzXG5cbiAgICAvL3JhbmdlbGVuZ3RoXG4gICAgKi9cblxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRpb25SZWR1Y2VyID0gZ3JvdXAgPT4gKGFjYywgdmFsaWRhdG9yKSA9PiB7XG4gICAgaWYoIW1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zICYmIHZhbGlkYXRvci5wYXJhbXMubGVuZ3RoID4gMCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKSkge1xuICAgICAgICBhY2MgPSB7XG4gICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyA/IFsuLi5hY2MuZXJyb3JNZXNzYWdlcywgZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV0gOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9ICh2YWxpZGF0b3IsIGdyb3VwKSA9PiB7XG4gICAgLy8gdG8gZG9cbiAgICAvLyBpbXBsZW1lbnQgY3VzdG9tIHZhaWRhdGlvbiBtZXNzYWdlc1xuICAgIHJldHVybiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcykgXG4gICAgICAgIGlmKGdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdmFsaWRhdGlvbkdyb3Vwc1tncm91cF0gPSBncm91cHNbZ3JvdXBdO1xuXG4gICAgcmV0dXJuIHZhbGlkYXRpb25Hcm91cHM7XG59OyJdfQ==
