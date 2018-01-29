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
	if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

	return els.reduce(function (acc, el) {
		if (el.getAttribute('novalidate')) return;
		acc.push(Object.assign(Object.create(_componentPrototype2.default), {
			form: el,
			settings: Object.assign({}, _defaults2.default, opts)
		}).init());
		return acc;
	}, []);
};

//Auto-initialise
{
	[].slice.call(document.querySelectorAll('form')).forEach(function (form) {
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
		//prevent browser validation
		this.form.setAttribute('novalidate', 'novalidate');
		this.groups = (0, _validators.removeUnvalidatableGroups)([].slice.call(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(_validators.assembleValidationGroup, {}));
		this.initListeners();

		console.log(this.groups);
		return this;
	},
	initListeners: function initListeners() {
		var _this = this;

		this.form.addEventListener('submit', function (e) {
			e.preventDefault();
			_this.clearErrors();
			_this.setValidityState().then(function (res) {
				var _ref;

				if (!(_ref = []).concat.apply(_ref, _toConsumableArray(res)).includes(false)) _this.form.submit();else _this.renderErrors(), _this.initRealTimeValidation();
			});
		});

		this.form.addEventListener('reset', function (e) {
			_this.clearErrors();
		});
	},
	initRealTimeValidation: function initRealTimeValidation() {
		var handler = function (e) {
			var _this2 = this;

			var group = e.target.getAttribute('name');
			if (this.groups[group].errorDOM) this.removeError(group);
			// if(!this.setGroupValidityState(group)) this.renderError(group);
			this.setGroupValidityState(group).then(function (res) {
				if (res.includes(false)) _this2.renderError(group);
			});
		}.bind(this);

		for (var group in this.groups) {
			this.groups[group].fields.forEach(function (input) {
				input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler);
			});
		}
	},
	setGroupValidityState: function setGroupValidityState(group) {
		var _this3 = this;

		//reset validity and errorMessages
		this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] });
		return Promise.all(this.groups[group].validators.map(function (validator) {
			return new Promise(function (resolve) {
				//only perform the remote validation if all else passes?

				//refactor, extract this whole fn...
				if (validator.type !== 'remote') {
					if ((0, _validators.validate)(_this3.groups[group], validator)) resolve(true);else {
						//mutation and side effect...
						_this3.groups[group].valid = false;
						_this3.groups[group].errorMessages.push((0, _validators.extractErrorMessage)(validator, group));
						resolve(false);
					}
				} else (0, _validators.validate)(_this3.groups[group], validator).then(function (res) {
					if (res) resolve(true);else {
						//mutation, side effect, and un-DRY...
						_this3.groups[group].valid = false;
						_this3.groups[group].errorMessages.push((0, _validators.extractErrorMessage)(validator, group));
						resolve(false);
					}
				});
			});
		}));
	},
	setValidityState: function setValidityState() {
		var groupValidators = [];
		for (var group in this.groups) {
			groupValidators.push(this.setGroupValidityState(group));
		} //Object.keys(this.groups).map(this.setGroupValidityState)
		return Promise.all(groupValidators);
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
};

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
    length: ['length-min', 'length-max'],
    stringlength: ['length-max'],
    range: ['range-min', 'range-max'],
    // min: ['min'],?
    // max:  ['max'],?
    minlength: ['minlength-min'],
    maxlength: ['maxlength-max'],
    regex: ['regex-pattern'],
    equalTo: ['equalto-other'],
    remote: ['remote-url', 'remote-additionalfields', 'remote-type'] //??
};

var DOTNET_ADAPTORS = exports.DOTNET_ADAPTORS = ['required', 'stringlength', 'regex',
// 'digits',
'email', 'number', 'url', 'length', 'range', 'equalto', 'remote'];

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
    },
    equalTo: function equalTo() {
        return 'Please enter the same value again.';
    },
    remote: function remote() {
        return 'Please fix this field.';
    }
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;_e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }return _arr;
    }return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();

var _utils = require('./utils');

var _constants = require('./constants');

var isOptional = function isOptional(group) {
    return !(0, _utils.isRequired)(group) && (0, _utils.extractValueFromGroup)(group) === '';
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
        return (0, _utils.extractValueFromGroup)(group) !== '';
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
    }),
    remote: function remote(group, params) {
        var _params = _slicedToArray(params, 3),
            url = _params[0],
            additionalfields = _params[1],
            _params$ = _params[2],
            type = _params$ === undefined ? 'get' : _params$;

        return new Promise(function (resolve, reject) {
            fetch(type !== 'get' ? url : (0, _utils.composeGetURL)(url, group, additionalfields), {
                method: type.toUpperCase(),
                body: type === 'get' ? null : JSON.stringify((0, _utils.composeRequestBody)(group, additionalfields)),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function (res) {
                resolve(true);
            }); //what to do if endpoint validation fails?
        });
    }

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

var isFile = exports.isFile = function isFile(field) {
    return field.getAttribute('type') === 'file';
};

var isRequired = exports.isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
};

var getName = exports.getName = function getName(group) {
    return group.fields[0].getAttribute('name');
};

var unfold = function unfold(acc, curr, i, arr) {
    if (arr.length < 2) return acc;
    return arr;
};

var requestBodyReducer = function requestBodyReducer(acc, curr) {
    acc[curr.substr(2)] = [].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, []).reduce(unfold, '');
    return acc;
};

var composeRequestBody = exports.composeRequestBody = function composeRequestBody(group, additionalfields) {
    return additionalfields.split(',').reduce(requestBodyReducer, {});
};

var getURLReducer = function getURLReducer(acc, curr) {
    return acc + '&' + curr.substr(2) + '=' + [].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, []).join(',');
};

var composeGetURL = exports.composeGetURL = function composeGetURL(baseURL, group, additionalfields) {
    return additionalfields.split(',').reduce(getURLReducer, baseURL + '?');
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
    return group.fields.reduce(groupValueReducer, '');
};

var chooseRealTimeEvent = exports.chooseRealTimeEvent = function chooseRealTimeEvent(input) {
    return ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];
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
exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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
//const hasDataAttributePart = (node, part) => [].slice.call(node.dataset).filter(attribute => !!~attribute.indexOf(part)).length > 0;

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

// export const validationReducer = group => (acc, validator) => {
//     if(methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
//     return {
//         valid: false,
//         errorMessages: acc.errorMessages 
//                         ? [...acc.errorMessages, extractErrorMessage(validator, group)] 
//                         : [extractErrorMessage(validator, group)]
//     };;
// };

var validate = exports.validate = function validate(group, validator) {
    return _methods2.default[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sR0FBQSxBQUFHLE1BQUgs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QW1CLFNBQXZCLEFBQWdDLE9BQWhDLEFBQXVDLEtBQXZDLEFBQTRDLEFBQ2pEO1dBQUEsQUFBTyxBQUNWO0FBWE07O0FBYUEsSUFBTSxvREFBc0IsU0FBdEIsQUFBc0Isb0JBQUEsQUFBQyxXQUFELEFBQVksT0FBWjtXQUFzQixVQUFBLEFBQVUsV0FBVyxtQkFBUyxVQUFULEFBQW1CLE1BQU0sVUFBQSxBQUFVLFdBQVYsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxTQUEvRyxBQUEyQyxBQUE2RTtBQUFwSjs7QUFFQSxJQUFNLGdFQUE0QixTQUE1QixBQUE0QixrQ0FBVSxBQUMvQztRQUFJLG1CQUFKLEFBQXVCLEFBRXZCOztTQUFJLElBQUosQUFBUSxTQUFSLEFBQWlCLFFBQ2I7WUFBRyxPQUFBLEFBQU8sT0FBUCxBQUFjLFdBQWQsQUFBeUIsU0FBNUIsQUFBcUMsR0FDakMsaUJBQUEsQUFBaUIsU0FBUyxPQUZsQyxBQUVRLEFBQTBCLEFBQU87QUFFekMsWUFBQSxBQUFPLEFBQ1Y7QUFSTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICAvLyBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChjYW5kaWRhdGUsIG9wdHMpID0+IHtcblx0bGV0IGVscztcblxuXHQvL2Fzc3VtZSBpdCdzIGEgZG9tIG5vZGVcblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG4gICAgXG5cdHJldHVybiBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRhY2MucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0Zm9ybTogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCIvLyBpbXBvcnQgaW5wdXRQcm90b3R5cGUgZnJvbSAnLi9pbnB1dC1wcm90b3R5cGUnO1xuaW1wb3J0IHsgY2hvb3NlUmVhbFRpbWVFdmVudCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtcblx0dmFsaWRhdGUsXG5cdGV4dHJhY3RFcnJvck1lc3NhZ2UsXG5cdGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLFxuXHRub3JtYWxpc2VWYWxpZGF0b3JzLFxuXHRyZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzXG59IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBoLCBjcmVhdGVFcnJvclRleHROb2RlIH0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhbXS5zbGljZS5jYWxsKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0dGhpcy5zZXRWYWxpZGl0eVN0YXRlKClcblx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0aWYoIVtdLmNvbmNhdCguLi5yZXMpLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHRcdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGxldCBncm91cCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXHRcdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHQvLyBpZighdGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdFx0dGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApXG5cdFx0XHRcdFx0LnRoZW4ocmVzID0+IHtcblx0XHRcdFx0XHRcdGlmKHJlcy5pbmNsdWRlcyhmYWxzZSkpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXHRcdFxuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihjaG9vc2VSZWFsVGltZUV2ZW50KGlucHV0KSwgaGFuZGxlcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCl7XG5cdFx0Ly9yZXNldCB2YWxpZGl0eSBhbmQgZXJyb3JNZXNzYWdlc1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ3JvdXBzW2dyb3VwXSx7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9KTtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdC8vb25seSBwZXJmb3JtIHRoZSByZW1vdGUgdmFsaWRhdGlvbiBpZiBhbGwgZWxzZSBwYXNzZXM/XG5cdFx0XHRcdFxuXHRcdFx0XHQvL3JlZmFjdG9yLCBleHRyYWN0IHRoaXMgd2hvbGUgZm4uLi5cblx0XHRcdFx0aWYodmFsaWRhdG9yLnR5cGUgIT09ICdyZW1vdGUnKXtcblx0XHRcdFx0XHRpZih2YWxpZGF0ZSh0aGlzLmdyb3Vwc1tncm91cF0sIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQvL211dGF0aW9uIGFuZCBzaWRlIGVmZmVjdC4uLlxuXHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlcy5wdXNoKGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCkpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdmFsaWRhdGUodGhpcy5ncm91cHNbZ3JvdXBdLCB2YWxpZGF0b3IpXG5cdFx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZihyZXMpIHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vbXV0YXRpb24sIHNpZGUgZWZmZWN0LCBhbmQgdW4tRFJZLi4uXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXMucHVzaChleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApKTtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cdH0sXG5cdHNldFZhbGlkaXR5U3RhdGUoKXtcblx0XHRsZXQgZ3JvdXBWYWxpZGF0b3JzID0gW107XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3VwcykgZ3JvdXBWYWxpZGF0b3JzLnB1c2godGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKTtcblxuXHRcdC8vT2JqZWN0LmtleXModGhpcy5ncm91cHMpLm1hcCh0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZSlcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXBWYWxpZGF0b3JzKTtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlICYmIHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuXHRcdGRlbGV0ZSB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET007XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NID0gXG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlID8gXG5cdFx0XHRcdGNyZWF0ZUVycm9yVGV4dE5vZGUodGhpcy5ncm91cHNbZ3JvdXBdKSA6IFxuXHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXVxuXHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0LnBhcmVudE5vZGVcblx0XHRcdFx0XHRcdC5hcHBlbmRDaGlsZChoKCdkaXYnLCB7IGNsYXNzOiAnZXJyb3InIH0sIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzWzBdKSk7XG5cdFx0XG5cdFx0Ly9zZXQgYXJpYS1pbnZhbGlkIG9uIGludmFsaWQgaW5wdXRzXG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcblx0fSxcblx0YWRkTWV0aG9kKG5hbWUsIGZuLCBtZXNzYWdlKXtcblx0XHR0aGlzLmdyb3Vwcy52YWxpZGF0b3JzLnB1c2goZm4pO1xuXHRcdC8vZXh0ZW5kIG1lc3NhZ2VzXG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWxUbzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICByZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGdldE5hbWUsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgY29tcG9zZVJlcXVlc3RCb2R5LCBjb21wb3NlR2V0VVJMIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gJyc7XG5cbmNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gKGdyb3VwLCB0eXBlKSA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcztcblxuY29uc3QgY3VycnlSZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IGN1cnJ5UGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKGdyb3VwLCB0eXBlKSksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSAnJyxcbiAgICBlbWFpbDogY3VycnlSZWdleE1ldGhvZChFTUFJTF9SRUdFWCksXG4gICAgdXJsOiBjdXJyeVJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiBjdXJyeVJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IGN1cnJ5UmVnZXhNZXRob2QoTlVNQkVSX1JFR0VYKSxcbiAgICBkaWdpdHM6IGN1cnJ5UmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCAoLi4ucmVnZXhTdHIpID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHJlZ2V4U3RyKS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgKC4uLnJlZ2V4U3RyKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChyZWdleFN0cikudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgKC4uLm1pbikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK21pbiwgYWNjKSksXG4gICAgbWF4OiBjdXJyeVBhcmFtTWV0aG9kKCdtYXgnLCAoLi4ubWF4KSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArbWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXNbMF0gJiYgKHBhcmFtc1sxXSA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtc1sxXSkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXNbMF0gJiYgK2lucHV0LnZhbHVlIDw9ICtwYXJhbXNbMV0pLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGxldCBbIHVybCwgYWRkaXRpb25hbGZpZWxkcywgdHlwZSA9ICdnZXQnXSA9IHBhcmFtcztcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmZXRjaCgodHlwZSAhPT0gJ2dldCcgPyB1cmwgOiBjb21wb3NlR2V0VVJMKHVybCwgZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpKSwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogdHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgICAgIGJvZHk6IHR5cGUgPT09ICdnZXQnID8gbnVsbCA6IEpTT04uc3RyaW5naWZ5KGNvbXBvc2VSZXF1ZXN0Qm9keShncm91cCwgYWRkaXRpb25hbGZpZWxkcykpLCBcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUodHJ1ZSk7IH0pOy8vd2hhdCB0byBkbyBpZiBlbmRwb2ludCB2YWxpZGF0aW9uIGZhaWxzP1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gcmFuZ2VsZW5ndGhcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0MjBcblxuICAgIC8vIHJhbmdlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXG4gICAgLy8gXG4gICAgLy8gc3RlcFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDQxXG5cbiAgICAvLyBlcXVhbFRvXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NzlcblxuXG4gICAgLyogXG4gICAgRXh0ZW5zaW9uc1xuICAgICAgICAtIHBhc3N3b3JkXG4gICAgICAgIC0gbm9uYWxwaGFtaW4gL1xcVy9nXG4gICAgICAgIC0gcmVnZXgvcGF0dGVyblxuICAgICAgICAtIGJvb2xcbiAgICAgICAgLSBmaWxlZXh0ZW5zaW9uc1xuICAgICovXG59OyIsImV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGdyb3VwLmVycm9yTWVzc2FnZXNbMF0pO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybiBncm91cC5zZXJ2ZXJFcnJvck5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG59OyIsImV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNDaGVja2FibGUgPSBmaWVsZCA9PiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZmllbGQudHlwZSk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpbGUgPSBmaWVsZCA9PiBmaWVsZC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2ZpbGUnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGdldE5hbWUgPSBncm91cCA9PiBncm91cC5maWVsZHNbMF0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cbmNvbnN0IHVuZm9sZCA9IChhY2MsIGN1cnIsIGksIGFycikgPT4ge1xuICAgIGlmKGFyci5sZW5ndGggPCAyKSByZXR1cm4gYWNjO1xuICAgIHJldHVybiBhcnI7XG59O1xuXG5jb25zdCByZXF1ZXN0Qm9keVJlZHVjZXIgPSAoYWNjLCBjdXJyKSA9PiB7XG4gICAgYWNjW2N1cnIuc3Vic3RyKDIpXSA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtjdXJyLnN1YnN0cigyKX1dYCkpLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgW10pLnJlZHVjZSh1bmZvbGQsICcnKTtcbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2VSZXF1ZXN0Qm9keSA9IChncm91cCwgYWRkaXRpb25hbGZpZWxkcykgPT4ge1xuICAgIHJldHVybiBhZGRpdGlvbmFsZmllbGRzLnNwbGl0KCcsJykucmVkdWNlKHJlcXVlc3RCb2R5UmVkdWNlciwge30pO1xufTtcblxuY29uc3QgZ2V0VVJMUmVkdWNlciA9IChhY2MsIGN1cnIpID0+IGAke2FjY30mJHtjdXJyLnN1YnN0cigyKX09JHtbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7Y3Vyci5zdWJzdHIoMil9XWApKS5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsIFtdKS5qb2luKCcsJyl9YDtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2VHZXRVUkwgPSAoYmFzZVVSTCwgZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpID0+IGFkZGl0aW9uYWxmaWVsZHMuc3BsaXQoJywnKS5yZWR1Y2UoZ2V0VVJMUmVkdWNlciwgYCR7YmFzZVVSTH0/YCk7XG4gICAgXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5jb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKTtcblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWxUaW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTtcblxuXG4vLyBjb25zdCBjb21wb3NlciA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKTtcbi8vIGV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZShjb21wb3Nlcik7XG4vLyBleHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2VSaWdodChjb21wb3Nlcik7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBjb21wb3NlLmFwcGx5KGNvbXBvc2UsIGZucy5yZXZlcnNlKCkpOyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IERPVE5FVF9BREFQVE9SUywgRE9UTkVUX1BBUkFNUywgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vL1NvcnJ5Li4uXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhZGFwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPVE5FVF9QQVJBTVNbYWRhcHRvcl0gJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBhY2MucHVzaChpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gW10uc2xpY2UuY2FsbChub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW4nLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpXX0pO1xuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJykgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dCkpO1xuICAgIGVsc2UgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgLypcbiAgICAvL2RhdGVcbiAgICAvL2RhdGVJU09cbiAgICAvL21pblxuICAgIC8vbWF4XG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cbiAgICAgICAgYWRhcHRlcnMuYWRkKFwiZXF1YWx0b1wiLCBbXCJvdGhlclwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBnZXRNb2RlbFByZWZpeChvcHRpb25zLmVsZW1lbnQubmFtZSksXG4gICAgICAgICAgICAgICAgb3RoZXIgPSBvcHRpb25zLnBhcmFtcy5vdGhlcixcbiAgICAgICAgICAgICAgICBmdWxsT3RoZXJOYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgob3RoZXIsIHByZWZpeCksXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQob3B0aW9ucy5mb3JtKS5maW5kKFwiOmlucHV0XCIpLmZpbHRlcihcIltuYW1lPSdcIiArIGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGZ1bGxPdGhlck5hbWUpICsgXCInXVwiKVswXTtcblxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcImVxdWFsVG9cIiwgZWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgLy9yZW1vdGVcbiAgICAvL2RpZ2l0c1xuICAgIC8vcmFuZ2VsZW5ndGhcbiAgICAqL1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbi8vICAgICBpZihtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCkpIHJldHVybiBhY2M7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuLy8gICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDogW2V4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldXG4vLyAgICAgfTs7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMgJiYgdmFsaWRhdG9yLnBhcmFtcy5sZW5ndGggPiAwID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG4gICAgICAgIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSB7XG4gICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9ICh2YWxpZGF0b3IsIGdyb3VwKSA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKSBcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
