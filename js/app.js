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

/* Can these two be folded into the same variable? */
var DOTNET_PARAMS = exports.DOTNET_PARAMS = {
    length: ['min', 'max'],
    range: ['min', 'max'],
    // min: ['min'],?
    // max:  ['max'],?
    minlength: ['min'],
    maxlength: ['max'],
    regex: ['regex-pattern'],
    remote: ['url', 'type', 'additionalfields'] //??
};

var DOTNET_ADAPTORS = exports.DOTNET_ADAPTORS = [
//'regex', -> same as pattern, how is it applied to an element? pattern attribute? data-val-regex?
'required', 'date', 'regex', 'digits', 'email', 'number', 'url', 'length', 'range', 'equalto', 'remote', 'password' //-> maps to min, nonalphamain, and regex methods
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
    pattern: function pattern() {
        return 'The value must match the pattern.';
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

var isOptional = function isOptional(group) {
    return !(0, _utils.isRequired)(group) && (0, _utils.extractValueFromGroup)(group) === false;
};

var extractValidationParams = function extractValidationParams(group, type) {
    return group.validators.filter(function (validator) {
        return validator.type === type;
    })[0].params;
};

var curryRegexMethod = function curryRegexMethod(regex) {
    return function (group) {
        return isOptional(group) || group.fields.reduce(function (acc, input) {
            return acc = regex.test(input.value), acc;
        }, false);
    };
};

var curryParamMethod = function curryParamMethod(type, reducer) {
    return function (group) {
        return isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), false);
    };
};

exports.default = {
    required: function required(group) {
        return (0, _utils.extractValueFromGroup)(group) !== false;
    },
    email: curryRegexMethod(_constants.EMAIL_REGEX),
    url: curryRegexMethod(_constants.URL_REGEX),
    date: function date(group) {
        return isOptional(group) || group.fields.reduce(function (acc, input) {
            return acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc;
        }, false);
    },
    dateISO: curryRegexMethod(_constants.DATE_ISO_REGEX),
    number: curryRegexMethod(_constants.NUMBER_REGEX),
    digits: curryRegexMethod(_constants.DIGITS_REGEX),
    minlength: curryParamMethod('minlength', function (param) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length >= +param : +input.value.length >= +param, acc;
        };
    }),
    maxlength: curryParamMethod('maxlength', function (param) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length <= +param : +input.value.length <= +param, acc;
        };
    }),
    pattern: curryParamMethod('pattern', function () {
        for (var _len = arguments.length, regexStr = Array(_len), _key = 0; _key < _len; _key++) {
            regexStr[_key] = arguments[_key];
        }

        return function (acc, input) {
            return acc = RegExp(regexStr).test(input.value), acc;
        };
    }),
    regex: curryParamMethod('regex', function () {
        for (var _len2 = arguments.length, regexStr = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            regexStr[_key2] = arguments[_key2];
        }

        return function (acc, input) {
            return acc = RegExp(regexStr).test(input.value), acc;
        };
    }),
    min: curryParamMethod('min', function () {
        for (var _len3 = arguments.length, min = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            min[_key3] = arguments[_key3];
        }

        return function (acc, input) {
            return acc = +input.value >= +min, acc;
        };
    }),
    max: curryParamMethod('max', function () {
        for (var _len4 = arguments.length, max = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            max[_key4] = arguments[_key4];
        }

        return function (acc, input) {
            return acc = +input.value <= +max, acc;
        };
    }),
    length: curryParamMethod('length', function (params) {
        return function (acc, input) {
            return acc = +input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1]), acc;
        };
    }),
    range: curryParamMethod('range', function (params) {
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
    // data-val-remote="&amp;#39;UserName&amp;#39; is invalid." data-val-remote-additionalfields="*.UserName" data-val-remote-url="/Validation/IsUID_Available"

    // regex
    // data-val-regex="White space is not allowed." 
    // data-val-regex-pattern="(\S)+" 


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
    if (!isCheckable(input) && hasValue(input)) acc = input.value;
    if (isCheckable(input) && input.checked) {
        if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
    }
    return acc;
};

var extractValueFromGroup = exports.extractValueFromGroup = function extractValueFromGroup(group) {
    return group.fields.reduce(groupValueReducer, false);
};

var chooseRealTimeEvent = exports.chooseRealTimeEvent = function chooseRealTimeEvent(input) {
    return ['input', 'change'][Number(isCheckable(input) || isSelect(input))];
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

//Sorry...
var extractDataValValidators = function extractDataValValidators(input) {
    return _constants.DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
            type: adaptor,
            message: input.getAttribute('data-val-' + adaptor) }, _constants.DOTNET_PARAMS[adaptor] && {
            params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
                input.hasAttribute('data-val-' + param) && acc.push(input.getAttribute('data-val-' + param));
                return acc;
            }, [])
        })]);
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
    if (input.getAttribute('min') && input.getAttribute('min') !== 'false') validators.push({ type: 'min', params: [input.getAttribute('min')] });
    if (input.getAttribute('max') && input.getAttribute('max') !== 'false') validators.push({ type: 'max', params: [input.getAttribute('max')] });
    if (input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') validators.push({ type: 'pattern', params: [input.getAttribute('pattern')] });
    return validators;
};

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    var validators = [];

    if (input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));else validators = validators.concat(extractAttributeValidators(input));
    /*
    //date
    //dateISO
    //min
    //max
    //step
     //equalTo
        adapters.add("equalto", ["other"], function (options) {
            var prefix = getModelPrefix(options.element.name),
                other = options.params.other,
                fullOtherName = appendModelPrefix(other, prefix),
                element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];
             setValidationValues(options, "equalTo", element);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sTUFBQSxBQUFNLEtBQUss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LEFBQW1CLFVBQVUsQUFDakM7WUFBSSxNQUFBLEFBQU0sYUFBVixBQUFJLEFBQW1CO21CQUFXLEFBQ3RCLEFBQ1I7d0JBQVksb0JBRmtCLEFBRWxCLEFBQW9CLEFBQ2hDO29CQUFRLENBSHNCLEFBR3RCLEFBQUMsQUFDVDs2QkFBaUIsU0FBQSxBQUFTLHdFQUFzRCxNQUFBLEFBQU0sYUFBckUsQUFBK0QsQUFBbUIsa0JBSnZHLEFBQWtDLEFBSW9GLEFBRXpIO0FBTnFDLEFBQzlCO0FBRlIsV0FRSyxJQUFJLE1BQUEsQUFBTSxhQUFWLEFBQUksQUFBbUIsU0FBdkIsQUFBZ0MsT0FBaEMsQUFBdUMsS0FBdkMsQUFBNEMsQUFDakQ7V0FBQSxBQUFPLEFBQ1Y7QUFYTTs7QUFhQSxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLFdBQUQsQUFBWSxPQUFaO1dBQXNCLFVBQUEsQUFBVSxXQUFXLG1CQUFTLFVBQVQsQUFBbUIsTUFBTSxVQUFBLEFBQVUsV0FBVixBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFNBQS9HLEFBQTJDLEFBQTZFO0FBQXBKOztBQUVBLElBQU0sZ0VBQTRCLFNBQTVCLEFBQTRCLGtDQUFVLEFBQy9DO1FBQUksbUJBQUosQUFBdUIsQUFFdkI7O1NBQUksSUFBSixBQUFRLFNBQVIsQUFBaUIsUUFDYjtZQUFHLE9BQUEsQUFBTyxPQUFQLEFBQWMsV0FBZCxBQUF5QixTQUE1QixBQUFxQyxHQUNqQyxpQkFBQSxBQUFpQixTQUFTLE9BRmxDLEFBRVEsQUFBMEIsQUFBTztBQUV6QyxZQUFBLEFBQU8sQUFDVjtBQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIC8vIFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdC8vYXNzdW1lIGl0J3MgYSBkb20gbm9kZVxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcbiAgICBcblx0cmV0dXJuIGVscy5yZWR1Y2UoKGFjYywgZWwpID0+IHtcblx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdGFjYy5wdXNoKE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRmb3JtOiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCkpO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIFtdKTtcbn07XG5cbi8qXG5cdEF1dG8taW5pdGlhbGlzZVxuKi9cbnsgXG5cdEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHQuZm9yRWFjaChmb3JtID0+IHsgZm9ybS5xdWVyeVNlbGVjdG9yKCdbZGF0YS12YWw9dHJ1ZV0nKSAmJiBpbml0KGZvcm0pOyB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiLy8gaW1wb3J0IGlucHV0UHJvdG90eXBlIGZyb20gJy4vaW5wdXQtcHJvdG90eXBlJztcbmltcG9ydCB7IGNob29zZVJlYWxUaW1lRXZlbnQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFxuXHR2YWxpZGF0aW9uUmVkdWNlcixcblx0YXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsXG5cdG5vcm1hbGlzZVZhbGlkYXRvcnMsXG5cdHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHNcbn0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcbmltcG9ydCB7IGgsIGNyZWF0ZUVycm9yVGV4dE5vZGUgfSBmcm9tICcuL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHQvL3ByZXZlbnQgYnJvd3NlciB2YWxpZGF0aW9uXG5cdFx0dGhpcy5mb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cdFx0dGhpcy5ncm91cHMgPSByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKEFycmF5LmZyb20odGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKS5yZWR1Y2UoYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsIHt9KSk7XG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdyb3Vwcyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRMaXN0ZW5lcnMoKXtcblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmNsZWFyRXJyb3JzKCk7XG5cdFx0XHRpZih0aGlzLnNldFZhbGlkaXR5U3RhdGUoKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGxldCBncm91cCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRpZighdGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihjaG9vc2VSZWFsVGltZUV2ZW50KGlucHV0KSwgaGFuZGxlcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLFxuXHRcdFx0XHRcdFx0XHRcdHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0sIC8vcmVzZXQgdmFsaWRpdHkgYW5kIGVycm9yTWVzc2FnZXNhXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMucmVkdWNlKHZhbGlkYXRpb25SZWR1Y2VyKHRoaXMuZ3JvdXBzW2dyb3VwXSksIHRydWUpKTtcblx0XHRyZXR1cm4gdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkO1xuXHR9LFxuXHRzZXRWYWxpZGl0eVN0YXRlKCl7XG5cdFx0bGV0IG51bUVycm9ycyA9IDA7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCk7XG5cdFx0XHQhdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkICYmICsrbnVtRXJyb3JzO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVtRXJyb3JzID09PSAwO1xuXHR9LFxuXHRjbGVhckVycm9ycygpe1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgJiYgdGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pOy8vb3Igc2hvdWxkIGkgc2V0IHRoaXMgdG8gZmFsc2UgaWYgZmllbGQgcGFzc2VzIHZhbGlkYXRpb24/XG5cdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSBcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgPyBcblx0XHRcdFx0Y3JlYXRlRXJyb3JUZXh0Tm9kZSh0aGlzLmdyb3Vwc1tncm91cF0pIDogXG5cdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHQuZmllbGRzW3RoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG4vKiBDYW4gdGhlc2UgdHdvIGJlIGZvbGRlZCBpbnRvIHRoZSBzYW1lIHZhcmlhYmxlPyAqL1xuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ21pbicsICdtYXgnXSxcbiAgICByYW5nZTogWydtaW4nLCAnbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICByZW1vdGU6IFsndXJsJywgJ3R5cGUnLCAnYWRkaXRpb25hbGZpZWxkcyddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAvLydyZWdleCcsIC0+IHNhbWUgYXMgcGF0dGVybiwgaG93IGlzIGl0IGFwcGxpZWQgdG8gYW4gZWxlbWVudD8gcGF0dGVybiBhdHRyaWJ1dGU/IGRhdGEtdmFsLXJlZ2V4P1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ2RhdGUnLFxuICAgICdyZWdleCcsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJyxcbiAgICAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIC8vIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09IGZhbHNlO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gZmFsc2UsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBwYXR0ZXJuOiBjdXJyeVBhcmFtTWV0aG9kKCdwYXR0ZXJuJywgKC4uLnJlZ2V4U3RyKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChyZWdleFN0cikudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIHJlZ2V4OiBjdXJyeVBhcmFtTWV0aG9kKCdyZWdleCcsICguLi5yZWdleFN0cikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocmVnZXhTdHIpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICBtaW46IGN1cnJ5UGFyYW1NZXRob2QoJ21pbicsICguLi5taW4pID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICttaW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgKC4uLm1heCkgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK21heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zWzBdICYmIChwYXJhbXNbMV0gPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXNbMV0pKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zWzFdKSwgYWNjKSksXG4gICAgXG4gICAgLy8gcmFuZ2VsZW5ndGhcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0MjBcblxuXG4gICAgLy8gcmFuZ2VcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlLW1ldGhvZC9cbiAgICAvLyBcbiAgICAvLyBzdGVwXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9zdGVwLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NDFcblxuICAgIC8vIGVxdWFsVG9cbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2VxdWFsVG8tbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ3OVxuXG4gICAgLy8gcmVtb3RlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZW1vdGUtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ5MlxuICAgIC8vIGRhdGEtdmFsLXJlbW90ZT1cIiZhbXA7IzM5O1VzZXJOYW1lJmFtcDsjMzk7IGlzIGludmFsaWQuXCIgZGF0YS12YWwtcmVtb3RlLWFkZGl0aW9uYWxmaWVsZHM9XCIqLlVzZXJOYW1lXCIgZGF0YS12YWwtcmVtb3RlLXVybD1cIi9WYWxpZGF0aW9uL0lzVUlEX0F2YWlsYWJsZVwiXG5cbiAgICAvLyByZWdleFxuICAgIC8vIGRhdGEtdmFsLXJlZ2V4PVwiV2hpdGUgc3BhY2UgaXMgbm90IGFsbG93ZWQuXCIgXG4gICAgLy8gZGF0YS12YWwtcmVnZXgtcGF0dGVybj1cIihcXFMpK1wiIFxuXG5cblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSBncm91cCA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShncm91cC5lcnJvck1lc3NhZ2VzWzBdKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTsiLCIgZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufVxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgZmFsc2UpO1xuXG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSldO1xuXG5cbi8vIGNvbnN0IGNvbXBvc2VyID0gKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpO1xuLy8gZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKGNvbXBvc2VyKTtcbi8vIGV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZVJpZ2h0KGNvbXBvc2VyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGNvbXBvc2UuYXBwbHkoY29tcG9zZSwgZm5zLnJldmVyc2UoKSk7IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vU29ycnkuLi5cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SU1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCh2YWxpZGF0b3JzLCBhZGFwdG9yKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9ycyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWy4uLnZhbGlkYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9UTkVUX1BBUkFNU1thZGFwdG9yXSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKTtcblxuLy9mb3IgZGF0YS1ydWxlLSogc3VwcG9ydFxuLy9jb25zdCBoYXNEYXRhQXR0cmlidXRlUGFydCA9IChub2RlLCBwYXJ0KSA9PiBBcnJheS5mcm9tKG5vZGUuZGF0YXNldCkuZmlsdGVyKGF0dHJpYnV0ZSA9PiAhIX5hdHRyaWJ1dGUuaW5kZXhPZihwYXJ0KSkubGVuZ3RoID4gMDtcblxuY29uc3QgZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBpZihpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdyZXF1aXJlZCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICd1cmwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWluJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIFxuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnKSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgZWxzZSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICAvKlxuICAgIC8vZGF0ZVxuICAgIC8vZGF0ZUlTT1xuICAgIC8vbWluXG4gICAgLy9tYXhcbiAgICAvL3N0ZXBcblxuICAgIC8vZXF1YWxUb1xuICAgICAgICBhZGFwdGVycy5hZGQoXCJlcXVhbHRvXCIsIFtcIm90aGVyXCJdLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGdldE1vZGVsUHJlZml4KG9wdGlvbnMuZWxlbWVudC5uYW1lKSxcbiAgICAgICAgICAgICAgICBvdGhlciA9IG9wdGlvbnMucGFyYW1zLm90aGVyLFxuICAgICAgICAgICAgICAgIGZ1bGxPdGhlck5hbWUgPSBhcHBlbmRNb2RlbFByZWZpeChvdGhlciwgcHJlZml4KSxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gJChvcHRpb25zLmZvcm0pLmZpbmQoXCI6aW5wdXRcIikuZmlsdGVyKFwiW25hbWU9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUoZnVsbE90aGVyTmFtZSkgKyBcIiddXCIpWzBdO1xuXG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwiZXF1YWxUb1wiLCBlbGVtZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAvL3JlbW90ZVxuICAgIC8vZGlnaXRzXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uUmVkdWNlciA9IGdyb3VwID0+IChhY2MsIHZhbGlkYXRvcikgPT4ge1xuICAgIGlmKG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zICYmIHZhbGlkYXRvci5wYXJhbXMubGVuZ3RoID4gMCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKSkgcmV0dXJuIGFjYztcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzIFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbLi4uYWNjLmVycm9yTWVzc2FnZXMsIGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldIFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbiAgICB9Oztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIFxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTsiXX0=
