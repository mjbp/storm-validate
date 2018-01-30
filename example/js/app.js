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
		var _this3 = this;

		var handler = function (group) {
			var _this2 = this;

			// let group = e.target.getAttribute('name');
			if (this.groups[group].errorDOM) this.removeError(group);
			// if(!this.setGroupValidityState(group)) this.renderError(group);
			this.setGroupValidityState(group).then(function (res) {
				if (res.includes(false)) _this2.renderError(group);
			});
		}.bind(this);

		var _loop = function _loop(group) {
			_this3.groups[group].fields.forEach(function (input) {
				input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler.bind(_this3, group));
			});
			var equalToValidator = _this3.groups[group].validators.filter(function (validator) {
				return validator.type === 'equalto';
			});

			if (equalToValidator.length > 0) document.querySelector('[name=' + equalToValidator[0].params[0].substr(2) + ']').addEventListener('blur', handler.bind(_this3, group));
		};

		for (var group in this.groups) {
			_loop(group);
		}
	},
	setGroupValidityState: function setGroupValidityState(group) {
		var _this4 = this;

		//reset validity and errorMessages
		this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] });
		return Promise.all(this.groups[group].validators.map(function (validator) {
			return new Promise(function (resolve) {
				//only perform the remote validation if all else passes?

				//refactor, extract this whole fn...
				if (validator.type !== 'remote') {
					if ((0, _validators.validate)(_this4.groups[group], validator)) resolve(true);else {
						//mutation and side effect...
						_this4.groups[group].valid = false;
						_this4.groups[group].errorMessages.push((0, _validators.extractErrorMessage)(validator, group));
						resolve(false);
					}
				} else (0, _validators.validate)(_this4.groups[group], validator).then(function (res) {
					if (res) resolve(true);else {
						//mutation, side effect, and un-DRY...
						_this4.groups[group].valid = false;
						_this4.groups[group].errorMessages.push((0, _validators.extractErrorMessage)(validator, group));
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
		this.groups[name].validators.push(fn);
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
    equalto: ['equalto-other'],
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
    equalto: curryParamMethod('equalto', function (params) {
        return function (acc, input) {
            return acc = input.value === document.querySelector('[name=' + params[0].substr(2) + ']').value, acc;
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

var unfold = function unfold(value) {
    return value === false ? '' : value;
};

var requestBodyReducer = function requestBodyReducer(acc, curr) {
    acc[curr.substr(2)] = unfold([].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, ''));
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

/*
const resolveParam = param => param === 'equalto-other' || 
//->params that are field names can be resolved to the fields themselves to 
//avoid having to perform ODM look ups every time it validates
*/
//Sorry...
var extractDataValValidators = function extractDataValValidators(input) {
    return _constants.DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
            type: adaptor,
            message: input.getAttribute('data-val-' + adaptor) }, _constants.DOTNET_PARAMS[adaptor] && {
            params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
                //to do: resolveParam
                //for remote and equalto validation
                //^ see above
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sR0FBQSxBQUFHLE1BQUgs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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICAvLyBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChjYW5kaWRhdGUsIG9wdHMpID0+IHtcblx0bGV0IGVscztcblxuXHQvL2Fzc3VtZSBpdCdzIGEgZG9tIG5vZGVcblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG4gICAgXG5cdHJldHVybiBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRhY2MucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0Zm9ybTogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpKTtcblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCIvLyBpbXBvcnQgaW5wdXRQcm90b3R5cGUgZnJvbSAnLi9pbnB1dC1wcm90b3R5cGUnO1xuaW1wb3J0IHsgY2hvb3NlUmVhbFRpbWVFdmVudCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtcblx0dmFsaWRhdGUsXG5cdGV4dHJhY3RFcnJvck1lc3NhZ2UsXG5cdGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLFxuXHRub3JtYWxpc2VWYWxpZGF0b3JzLFxuXHRyZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzXG59IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBoLCBjcmVhdGVFcnJvclRleHROb2RlIH0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhbXS5zbGljZS5jYWxsKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0dGhpcy5zZXRWYWxpZGl0eVN0YXRlKClcblx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0aWYoIVtdLmNvbmNhdCguLi5yZXMpLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHRcdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihncm91cCkge1xuXHRcdFx0XHQvLyBsZXQgZ3JvdXAgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHRcdFx0Ly8gaWYoIXRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHRcdHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKVxuXHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRpZihyZXMuaW5jbHVkZXMoZmFsc2UpKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHRcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChpbnB1dCA9PiB7XG5cdFx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoY2hvb3NlUmVhbFRpbWVFdmVudChpbnB1dCksIGhhbmRsZXIuYmluZCh0aGlzLCBncm91cCkpO1xuXHRcdFx0fSk7XG5cdFx0XHRsZXQgZXF1YWxUb1ZhbGlkYXRvciA9IHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdlcXVhbHRvJyk7XG5cdFx0XHRcblx0XHRcdGlmKGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCkgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW25hbWU9JHtlcXVhbFRvVmFsaWRhdG9yWzBdLnBhcmFtc1swXS5zdWJzdHIoMil9XWApLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVyLmJpbmQodGhpcywgZ3JvdXApKVxuXHRcdH1cblx0fSxcblx0c2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKXtcblx0XHQvL3Jlc2V0IHZhbGlkaXR5IGFuZCBlcnJvck1lc3NhZ2VzXG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5ncm91cHNbZ3JvdXBdLHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0pO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbCh0aGlzLmdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdFx0Ly9vbmx5IHBlcmZvcm0gdGhlIHJlbW90ZSB2YWxpZGF0aW9uIGlmIGFsbCBlbHNlIHBhc3Nlcz9cblx0XHRcdFx0XG5cdFx0XHRcdC8vcmVmYWN0b3IsIGV4dHJhY3QgdGhpcyB3aG9sZSBmbi4uLlxuXHRcdFx0XHRpZih2YWxpZGF0b3IudHlwZSAhPT0gJ3JlbW90ZScpe1xuXHRcdFx0XHRcdGlmKHZhbGlkYXRlKHRoaXMuZ3JvdXBzW2dyb3VwXSwgdmFsaWRhdG9yKSkgcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vbXV0YXRpb24gYW5kIHNpZGUgZWZmZWN0Li4uXG5cdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzLnB1c2goZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKSk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB2YWxpZGF0ZSh0aGlzLmdyb3Vwc1tncm91cF0sIHZhbGlkYXRvcilcblx0XHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmKHJlcykgcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9tdXRhdGlvbiwgc2lkZSBlZmZlY3QsIGFuZCB1bi1EUlkuLi5cblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlcy5wdXNoKGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCkpO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pKTtcblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBncm91cFZhbGlkYXRvcnMgPSBbXTtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKSBncm91cFZhbGlkYXRvcnMucHVzaCh0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCkpO1xuXG5cdFx0Ly9PYmplY3Qua2V5cyh0aGlzLmdyb3VwcykubWFwKHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKVxuXHRcdHJldHVybiBQcm9taXNlLmFsbChncm91cFZhbGlkYXRvcnMpO1xuXHR9LFxuXHRjbGVhckVycm9ycygpe1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgJiYgdGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pOy8vb3Igc2hvdWxkIGkgc2V0IHRoaXMgdG8gZmFsc2UgaWYgZmllbGQgcGFzc2VzIHZhbGlkYXRpb24/XG5cdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSBcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgPyBcblx0XHRcdFx0Y3JlYXRlRXJyb3JUZXh0Tm9kZSh0aGlzLmdyb3Vwc1tncm91cF0pIDogXG5cdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHQuZmllbGRzW3RoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QobmFtZSwgZm4sIG1lc3NhZ2Upe1xuXHRcdHRoaXMuZ3JvdXBzW25hbWVdLnZhbGlkYXRvcnMucHVzaChmbik7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG4vKiBDYW4gdGhlc2UgdHdvIGJlIGZvbGRlZCBpbnRvIHRoZSBzYW1lIHZhcmlhYmxlPyAqL1xuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ2xlbmd0aC1taW4nLCAnbGVuZ3RoLW1heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbHRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdyZW1vdGUtdHlwZSddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAncmVxdWlyZWQnLFxuICAgICdzdHJpbmdsZW5ndGgnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJywvL3Nob3VsZCBiZSBsYXN0XG4gICAgLy8gJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dOyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfSxcbiAgICAvL3JhbmdlbGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fSBjaGFyYWN0ZXJzIGxvbmcuYDsgfSxcbiAgICAvL3JhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgLy9zdGVwKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSBtdWx0aXBsZSBvZiAke3Byb3BzfS5gOyB9XG59OyIsImltcG9ydCB7IGlzU2VsZWN0LCBpc0NoZWNrYWJsZSwgaXNSZXF1aXJlZCwgZ2V0TmFtZSwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwLCBjb21wb3NlUmVxdWVzdEJvZHksIGNvbXBvc2VHZXRVUkwgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgZXF1YWx0bzogY3VycnlQYXJhbU1ldGhvZCgnZXF1YWx0bycsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IGlucHV0LnZhbHVlID09PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbbmFtZT0ke3BhcmFtc1swXS5zdWJzdHIoMil9XWApLnZhbHVlLCBhY2MpKSxcbiAgICBwYXR0ZXJuOiBjdXJyeVBhcmFtTWV0aG9kKCdwYXR0ZXJuJywgKC4uLnJlZ2V4U3RyKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChyZWdleFN0cikudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIHJlZ2V4OiBjdXJyeVBhcmFtTWV0aG9kKCdyZWdleCcsICguLi5yZWdleFN0cikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocmVnZXhTdHIpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICBtaW46IGN1cnJ5UGFyYW1NZXRob2QoJ21pbicsICguLi5taW4pID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICttaW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgKC4uLm1heCkgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK21heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zWzBdICYmIChwYXJhbXNbMV0gPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXNbMV0pKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zWzFdKSwgYWNjKSksXG4gICAgcmVtb3RlOiAoZ3JvdXAsIHBhcmFtcykgPT4ge1xuICAgICAgICBsZXQgWyB1cmwsIGFkZGl0aW9uYWxmaWVsZHMsIHR5cGUgPSAnZ2V0J10gPSBwYXJhbXM7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZmV0Y2goKHR5cGUgIT09ICdnZXQnID8gdXJsIDogY29tcG9zZUdldFVSTCh1cmwsIGdyb3VwLCBhZGRpdGlvbmFsZmllbGRzKSksIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICBib2R5OiB0eXBlID09PSAnZ2V0JyA/IG51bGwgOiBKU09OLnN0cmluZ2lmeShjb21wb3NlUmVxdWVzdEJvZHkoZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpKSwgXG4gICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKHRydWUpOyB9KTsvL3doYXQgdG8gZG8gaWYgZW5kcG9pbnQgdmFsaWRhdGlvbiBmYWlscz9cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIHJhbmdlbGVuZ3RoXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDIwXG5cbiAgICAvLyByYW5nZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuICAgIC8vIFxuICAgIC8vIHN0ZXBcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ0MVxuXG4gICAgLy8gZXF1YWxUb1xuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDc5XG5cblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSBncm91cCA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShncm91cC5lcnJvck1lc3NhZ2VzWzBdKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTsiLCJleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNGaWxlID0gZmllbGQgPT4gZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdmaWxlJztcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmV4cG9ydCBjb25zdCBnZXROYW1lID0gZ3JvdXAgPT4gZ3JvdXAuZmllbGRzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG5jb25zdCB1bmZvbGQgPSB2YWx1ZSA9PiB2YWx1ZSA9PT0gZmFsc2UgPyAnJyA6IHZhbHVlO1xuXG5jb25zdCByZXF1ZXN0Qm9keVJlZHVjZXIgPSAoYWNjLCBjdXJyKSA9PiB7XG4gICAgYWNjW2N1cnIuc3Vic3RyKDIpXSA9IHVuZm9sZChbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7Y3Vyci5zdWJzdHIoMil9XWApKS5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKSk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlUmVxdWVzdEJvZHkgPSAoZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpID0+IGFkZGl0aW9uYWxmaWVsZHMuc3BsaXQoJywnKS5yZWR1Y2UocmVxdWVzdEJvZHlSZWR1Y2VyLCB7fSk7XG5cbmNvbnN0IGdldFVSTFJlZHVjZXIgPSAoYWNjLCBjdXJyKSA9PiBgJHthY2N9JiR7Y3Vyci5zdWJzdHIoMil9PSR7W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke2N1cnIuc3Vic3RyKDIpfV1gKSkucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCBbXSkuam9pbignLCcpfWA7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlR2V0VVJMID0gKGJhc2VVUkwsIGdyb3VwLCBhZGRpdGlvbmFsZmllbGRzKSA9PiBhZGRpdGlvbmFsZmllbGRzLnNwbGl0KCcsJykucmVkdWNlKGdldFVSTFJlZHVjZXIsIGAke2Jhc2VVUkx9P2ApO1xuICAgIFxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07XG5cblxuLy8gY29uc3QgY29tcG9zZXIgPSAoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSk7XG4vLyBleHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoY29tcG9zZXIpO1xuLy8gZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlUmlnaHQoY29tcG9zZXIpO1xuXG5leHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpKTtcbmV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gY29tcG9zZS5hcHBseShjb21wb3NlLCBmbnMucmV2ZXJzZSgpKTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9tZXNzYWdlcyc7XG5pbXBvcnQgeyBET1RORVRfQURBUFRPUlMsIERPVE5FVF9QQVJBTVMsIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLypcbmNvbnN0IHJlc29sdmVQYXJhbSA9IHBhcmFtID0+IHBhcmFtID09PSAnZXF1YWx0by1vdGhlcicgfHwgXG4vLy0+cGFyYW1zIHRoYXQgYXJlIGZpZWxkIG5hbWVzIGNhbiBiZSByZXNvbHZlZCB0byB0aGUgZmllbGRzIHRoZW1zZWx2ZXMgdG8gXG4vL2F2b2lkIGhhdmluZyB0byBwZXJmb3JtIE9ETSBsb29rIHVwcyBldmVyeSB0aW1lIGl0IHZhbGlkYXRlc1xuKi9cbi8vU29ycnkuLi5cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SU1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCh2YWxpZGF0b3JzLCBhZGFwdG9yKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9ycyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWy4uLnZhbGlkYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9UTkVUX1BBUkFNU1thZGFwdG9yXSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBwYXJhbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RvIGRvOiByZXNvbHZlUGFyYW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgcmVtb3RlIGFuZCBlcXVhbHRvIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9eIHNlZSBhYm92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKTtcblxuLy9mb3IgZGF0YS1ydWxlLSogc3VwcG9ydFxuLy9jb25zdCBoYXNEYXRhQXR0cmlidXRlUGFydCA9IChub2RlLCBwYXJ0KSA9PiBbXS5zbGljZS5jYWxsKG5vZGUuZGF0YXNldCkuZmlsdGVyKGF0dHJpYnV0ZSA9PiAhIX5hdHRyaWJ1dGUuaW5kZXhPZihwYXJ0KSkubGVuZ3RoID4gMDtcblxuY29uc3QgZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBpZihpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdyZXF1aXJlZCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICd1cmwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWluJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIFxuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnKSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgZWxzZSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICAvKlxuICAgIC8vZGF0ZVxuICAgIC8vZGF0ZUlTT1xuICAgIC8vbWluXG4gICAgLy9tYXhcbiAgICAvL3N0ZXBcblxuICAgIC8vZXF1YWxUb1xuICAgICAgICBhZGFwdGVycy5hZGQoXCJlcXVhbHRvXCIsIFtcIm90aGVyXCJdLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGdldE1vZGVsUHJlZml4KG9wdGlvbnMuZWxlbWVudC5uYW1lKSxcbiAgICAgICAgICAgICAgICBvdGhlciA9IG9wdGlvbnMucGFyYW1zLm90aGVyLFxuICAgICAgICAgICAgICAgIGZ1bGxPdGhlck5hbWUgPSBhcHBlbmRNb2RlbFByZWZpeChvdGhlciwgcHJlZml4KSxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gJChvcHRpb25zLmZvcm0pLmZpbmQoXCI6aW5wdXRcIikuZmlsdGVyKFwiW25hbWU9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUoZnVsbE90aGVyTmFtZSkgKyBcIiddXCIpWzBdO1xuXG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwiZXF1YWxUb1wiLCBlbGVtZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAvL3JlbW90ZVxuICAgIC8vZGlnaXRzXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07XG5cbi8vIGV4cG9ydCBjb25zdCB2YWxpZGF0aW9uUmVkdWNlciA9IGdyb3VwID0+IChhY2MsIHZhbGlkYXRvcikgPT4ge1xuLy8gICAgIGlmKG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zICYmIHZhbGlkYXRvci5wYXJhbXMubGVuZ3RoID4gMCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKSkgcmV0dXJuIGFjYztcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICB2YWxpZDogZmFsc2UsXG4vLyAgICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPyBbLi4uYWNjLmVycm9yTWVzc2FnZXMsIGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbi8vICAgICB9Oztcbi8vIH07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IChncm91cCwgdmFsaWRhdG9yKSA9PiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIFxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTsiXX0=
