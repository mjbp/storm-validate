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
				//in case last async validation took longer and we've re-rendered
				// if(this.groups[group].errorDOM) this.removeError(group);
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
					if (res) {
						if (typeof res === 'string') {
							_this4.groups[group].valid = false;
							_this4.groups[group].errorMessages.push(res);
							resolve(false);
						} else resolve(true);
					} else {
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
		}return Promise.all(groupValidators);
	},
	clearErrors: function clearErrors() {
		for (var group in this.groups) {
			if (this.groups[group].errorDOM) this.removeError(group);
		}
	},
	removeError: function removeError(group) {
		// this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
		this.groups[group].errorDOM.parentNode.innerHTML = '';
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
		if (this.groups[group].errorDOM) this.removeError(group);
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

var DOM_SELECTOR_PARAMS = exports.DOM_SELECTOR_PARAMS = ['remote-additionalfields', 'equalto-other'];

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
            fetch(type !== 'get' ? url : (0, _utils.composeGetURL)(url + '?', group, additionalfields), {
                method: type.toUpperCase(),
                // body: type === 'get' ? null : JSON.stringify(composeRequestBody(group, additionalfields)), 
                body: type === 'get' ? null : (0, _utils.composeGetURL)('', group, additionalfields),
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
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

var getURLReducer = function getURLReducer(acc, curr, i) {
    // console.log([].slice.call(document.querySelectorAll(`[name=${curr.substr(2)}]`)).reduce(groupValueReducer, []));
    return '' + (i === 0 ? acc : acc + '&') + encodeURIComponent(curr.substr(2)) + '=' + [].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, []);
};

var composeGetURL = exports.composeGetURL = function composeGetURL(baseURL, group, additionalfields) {
    return additionalfields.split(',').reduce(getURLReducer, '' + baseURL);
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
//avoid having to perform DOM look ups every time it validates
*/
var resolveParam = function resolveParam(param) {
    return !!~_constants.DOM_SELECTOR_PARAMS.indexOf(param) ? [].slice.call(document.querySelectorAll('[name$=' + params[0].substr(2) + ']')) : param;
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sR0FBQSxBQUFHLE1BQUgs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cUMsQUFDOUI7QUFGUixXQVFLLElBQUksTUFBQSxBQUFNLGFBQVYsQUFBSSxBQUFtQixTQUF2QixBQUFnQyxPQUFoQyxBQUF1QyxLQUF2QyxBQUE0QyxBQUNqRDtXQUFBLEFBQU8sQUFDVjtBQVhNOztBQWFBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQUMsV0FBRCxBQUFZLE9BQVo7V0FBc0IsVUFBQSxBQUFVLFdBQVcsbUJBQVMsVUFBVCxBQUFtQixNQUFNLFVBQUEsQUFBVSxXQUFWLEFBQXFCLFlBQVksVUFBakMsQUFBMkMsU0FBL0csQUFBMkMsQUFBNkU7QUFBcEo7O0FBRUEsSUFBTSxnRUFBNEIsU0FBNUIsQUFBNEIsa0NBQVUsQUFDL0M7UUFBSSxtQkFBSixBQUF1QixBQUV2Qjs7U0FBSSxJQUFKLEFBQVEsU0FBUixBQUFpQixRQUNiO1lBQUcsT0FBQSxBQUFPLE9BQVAsQUFBYyxXQUFkLEFBQXlCLFNBQTVCLEFBQXFDLEdBQ2pDLGlCQUFBLEFBQWlCLFNBQVMsT0FGbEMsQUFFUSxBQUEwQixBQUFPO0FBRXpDLFlBQUEsQUFBTyxBQUNWO0FBUk0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUuaW5pdCgnZm9ybScpO1xufV07XG5cbnsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0Ly9hc3N1bWUgaXQncyBhIGRvbSBub2RlXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuICAgIFxuXHRyZXR1cm4gZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0YWNjLnB1c2goT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdGZvcm06IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG5cdFx0cmV0dXJuIGFjYztcblx0fSwgW10pO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHQuZm9yRWFjaChmb3JtID0+IHsgZm9ybS5xdWVyeVNlbGVjdG9yKCdbZGF0YS12YWw9dHJ1ZV0nKSAmJiBpbml0KGZvcm0pOyB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiLy8gaW1wb3J0IGlucHV0UHJvdG90eXBlIGZyb20gJy4vaW5wdXQtcHJvdG90eXBlJztcbmltcG9ydCB7IGNob29zZVJlYWxUaW1lRXZlbnQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG5cdHZhbGlkYXRlLFxuXHRleHRyYWN0RXJyb3JNZXNzYWdlLFxuXHRhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCxcblx0bm9ybWFsaXNlVmFsaWRhdG9ycyxcblx0cmVtb3ZlVW52YWxpZGF0YWJsZUdyb3Vwc1xufSBmcm9tICcuL3V0aWxzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgaCwgY3JlYXRlRXJyb3JUZXh0Tm9kZSB9IGZyb20gJy4vdXRpbHMvZG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhbXS5zbGljZS5jYWxsKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0dGhpcy5zZXRWYWxpZGl0eVN0YXRlKClcblx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0aWYoIVtdLmNvbmNhdCguLi5yZXMpLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHRcdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGUgPT4geyB0aGlzLmNsZWFyRXJyb3JzKCk7IH0pO1xuXHR9LFxuXHRpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCl7XG5cdFx0bGV0IGhhbmRsZXIgPSBmdW5jdGlvbihncm91cCkge1xuXHRcdFx0XHQvLyBsZXQgZ3JvdXAgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHRcdFx0Ly8gaWYoIXRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHRcdHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKVxuXHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHQvL2luIGNhc2UgbGFzdCBhc3luYyB2YWxpZGF0aW9uIHRvb2sgbG9uZ2VyIGFuZCB3ZSd2ZSByZS1yZW5kZXJlZFxuXHRcdFx0XHRcdFx0Ly8gaWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHRcdFx0XHRcdGlmKHJlcy5pbmNsdWRlcyhmYWxzZSkpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpO1xuXHRcdFxuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihjaG9vc2VSZWFsVGltZUV2ZW50KGlucHV0KSwgaGFuZGxlci5iaW5kKHRoaXMsIGdyb3VwKSk7XG5cdFx0XHR9KTtcblx0XHRcdGxldCBlcXVhbFRvVmFsaWRhdG9yID0gdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcblx0XHRcdFxuXHRcdFx0aWYoZXF1YWxUb1ZhbGlkYXRvci5sZW5ndGggPiAwKSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbbmFtZT0ke2VxdWFsVG9WYWxpZGF0b3JbMF0ucGFyYW1zWzBdLnN1YnN0cigyKX1dYCkuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZXIuYmluZCh0aGlzLCBncm91cCkpXG5cdFx0fVxuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdC8vcmVzZXQgdmFsaWRpdHkgYW5kIGVycm9yTWVzc2FnZXNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdyb3Vwc1tncm91cF0seyB2YWxpZDogdHJ1ZSwgZXJyb3JNZXNzYWdlczogW10gfSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdFx0XHQvL29ubHkgcGVyZm9ybSB0aGUgcmVtb3RlIHZhbGlkYXRpb24gaWYgYWxsIGVsc2UgcGFzc2VzP1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9yZWZhY3RvciwgZXh0cmFjdCB0aGlzIHdob2xlIGZuLi4uXG5cdFx0XHRcdGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG5cdFx0XHRcdFx0aWYodmFsaWRhdGUodGhpcy5ncm91cHNbZ3JvdXBdLCB2YWxpZGF0b3IpKSByZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly9tdXRhdGlvbiBhbmQgc2lkZSBlZmZlY3QuLi5cblx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXMucHVzaChleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApKTtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHZhbGlkYXRlKHRoaXMuZ3JvdXBzW2dyb3VwXSwgdmFsaWRhdG9yKVxuXHRcdFx0XHRcdFx0LnRoZW4ocmVzID0+IHtcblx0XHRcdFx0XHRcdFx0aWYocmVzKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIHJlcyA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXMucHVzaChyZXMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvL211dGF0aW9uLCBzaWRlIGVmZmVjdCwgYW5kIHVuLURSWS4uLlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzLnB1c2goZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKSk7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSkpO1xuXHR9LFxuXHRzZXRWYWxpZGl0eVN0YXRlKCl7XG5cdFx0bGV0IGdyb3VwVmFsaWRhdG9ycyA9IFtdO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpIGdyb3VwVmFsaWRhdG9ycy5wdXNoKHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwVmFsaWRhdG9ycyk7XG5cdH0sXG5cdGNsZWFyRXJyb3JzKCl7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlRXJyb3IoZ3JvdXApe1xuXHRcdC8vIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUuaW5uZXJIVE1MID0gJyc7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSAmJiB0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7Ly9vciBzaG91bGQgaSBzZXQgdGhpcyB0byBmYWxzZSBpZiBmaWVsZCBwYXNzZXMgdmFsaWRhdGlvbj9cblx0XHRkZWxldGUgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NO1xuXHR9LFxuXHRyZW5kZXJFcnJvcnMoKXtcblx0XHQvL3N1cHBvcnQgZm9yIGlubGluZSBhbmQgZXJyb3IgbGlzdD9cblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyRXJyb3IoZ3JvdXApe1xuXHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NID0gXG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlID8gXG5cdFx0XHRcdGNyZWF0ZUVycm9yVGV4dE5vZGUodGhpcy5ncm91cHNbZ3JvdXBdKSA6IFxuXHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXVxuXHRcdFx0XHRcdFx0LmZpZWxkc1t0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0LnBhcmVudE5vZGVcblx0XHRcdFx0XHRcdC5hcHBlbmRDaGlsZChoKCdkaXYnLCB7IGNsYXNzOiAnZXJyb3InIH0sIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzWzBdKSk7XG5cdFx0XG5cdFx0Ly9zZXQgYXJpYS1pbnZhbGlkIG9uIGludmFsaWQgaW5wdXRzXG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcblx0fSxcblx0YWRkTWV0aG9kKG5hbWUsIGZuLCBtZXNzYWdlKXtcblx0XHR0aGlzLmdyb3Vwc1tuYW1lXS52YWxpZGF0b3JzLnB1c2goZm4pO1xuXHRcdC8vZXh0ZW5kIG1lc3NhZ2VzXG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICByZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGdldE5hbWUsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgY29tcG9zZVJlcXVlc3RCb2R5LCBjb21wb3NlR2V0VVJMIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gJyc7XG5cbmNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gKGdyb3VwLCB0eXBlKSA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcztcblxuY29uc3QgY3VycnlSZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IGN1cnJ5UGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKGdyb3VwLCB0eXBlKSksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSAnJyxcbiAgICBlbWFpbDogY3VycnlSZWdleE1ldGhvZChFTUFJTF9SRUdFWCksXG4gICAgdXJsOiBjdXJyeVJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiBjdXJyeVJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IGN1cnJ5UmVnZXhNZXRob2QoTlVNQkVSX1JFR0VYKSxcbiAgICBkaWdpdHM6IGN1cnJ5UmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBpbnB1dC52YWx1ZSA9PT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW25hbWU9JHtwYXJhbXNbMF0uc3Vic3RyKDIpfV1gKS52YWx1ZSwgYWNjKSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsICguLi5yZWdleFN0cikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocmVnZXhTdHIpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCAoLi4ucmVnZXhTdHIpID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHJlZ2V4U3RyKS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCAoLi4ubWluKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA+PSArbWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsICguLi5tYXgpID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICttYXgsIGFjYykpLFxuICAgIGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZCgnbGVuZ3RoJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtc1swXSAmJiAocGFyYW1zWzFdID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zWzFdKSksIGFjYykpLFxuICAgIHJhbmdlOiBjdXJyeVBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtc1swXSAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtc1sxXSksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IHtcbiAgICAgICAgbGV0IFsgdXJsLCBhZGRpdGlvbmFsZmllbGRzLCB0eXBlID0gJ2dldCddID0gcGFyYW1zO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZmV0Y2goKHR5cGUgIT09ICdnZXQnID8gdXJsIDogY29tcG9zZUdldFVSTChgJHt1cmx9P2AsIGdyb3VwLCBhZGRpdGlvbmFsZmllbGRzKSksIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAvLyBib2R5OiB0eXBlID09PSAnZ2V0JyA/IG51bGwgOiBKU09OLnN0cmluZ2lmeShjb21wb3NlUmVxdWVzdEJvZHkoZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpKSwgXG4gICAgICAgICAgICAgICAgYm9keTogdHlwZSA9PT0gJ2dldCcgPyBudWxsIDogY29tcG9zZUdldFVSTCgnJywgZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUodHJ1ZSk7IH0pOy8vd2hhdCB0byBkbyBpZiBlbmRwb2ludCB2YWxpZGF0aW9uIGZhaWxzP1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gcmFuZ2VsZW5ndGhcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0MjBcblxuICAgIC8vIHJhbmdlXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZS1tZXRob2QvXG4gICAgLy8gXG4gICAgLy8gc3RlcFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvc3RlcC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDQxXG5cbiAgICAvLyBlcXVhbFRvXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5LXZhbGlkYXRpb24vanF1ZXJ5LXZhbGlkYXRpb24vYmxvYi9tYXN0ZXIvc3JjL2NvcmUuanMjTDE0NzlcblxuXG4gICAgLyogXG4gICAgRXh0ZW5zaW9uc1xuICAgICAgICAtIHBhc3N3b3JkXG4gICAgICAgIC0gbm9uYWxwaGFtaW4gL1xcVy9nXG4gICAgICAgIC0gcmVnZXgvcGF0dGVyblxuICAgICAgICAtIGJvb2xcbiAgICAgICAgLSBmaWxlZXh0ZW5zaW9uc1xuICAgICovXG59OyIsImV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGdyb3VwLmVycm9yTWVzc2FnZXNbMF0pO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybiBncm91cC5zZXJ2ZXJFcnJvck5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG59OyIsImV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNDaGVja2FibGUgPSBmaWVsZCA9PiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZmllbGQudHlwZSk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpbGUgPSBmaWVsZCA9PiBmaWVsZC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2ZpbGUnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGdldE5hbWUgPSBncm91cCA9PiBncm91cC5maWVsZHNbMF0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cbmNvbnN0IHVuZm9sZCA9IHZhbHVlID0+IHZhbHVlID09PSBmYWxzZSA/ICcnIDogdmFsdWU7XG5cbmNvbnN0IHJlcXVlc3RCb2R5UmVkdWNlciA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBhY2NbY3Vyci5zdWJzdHIoMildID0gdW5mb2xkKFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtjdXJyLnN1YnN0cigyKX1dYCkpLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpKTtcbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2VSZXF1ZXN0Qm9keSA9IChncm91cCwgYWRkaXRpb25hbGZpZWxkcykgPT4gYWRkaXRpb25hbGZpZWxkcy5zcGxpdCgnLCcpLnJlZHVjZShyZXF1ZXN0Qm9keVJlZHVjZXIsIHt9KTtcblxuXG5jb25zdCBnZXRVUkxSZWR1Y2VyID0gKGFjYywgY3VyciwgaSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtjdXJyLnN1YnN0cigyKX1dYCkpLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgW10pKTtcbiAgICByZXR1cm4gYCR7aSA9PT0gMCA/IGFjYyA6IGAke2FjY30mYH0ke2VuY29kZVVSSUNvbXBvbmVudChjdXJyLnN1YnN0cigyKSl9PSR7W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke2N1cnIuc3Vic3RyKDIpfV1gKSkucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCBbXSl9YDtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBvc2VHZXRVUkwgPSAoYmFzZVVSTCwgZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpID0+IGFkZGl0aW9uYWxmaWVsZHMuc3BsaXQoJywnKS5yZWR1Y2UoZ2V0VVJMUmVkdWNlciwgYCR7YmFzZVVSTH1gKTtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07XG5cblxuLy8gY29uc3QgY29tcG9zZXIgPSAoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSk7XG4vLyBleHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoY29tcG9zZXIpO1xuLy8gZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlUmlnaHQoY29tcG9zZXIpO1xuXG5leHBvcnQgY29uc3QgY29tcG9zZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpKTtcbmV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gY29tcG9zZS5hcHBseShjb21wb3NlLCBmbnMucmV2ZXJzZSgpKTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9tZXNzYWdlcyc7XG5pbXBvcnQgeyBET1RORVRfQURBUFRPUlMsIERPVE5FVF9QQVJBTVMsIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLCBET01fU0VMRUNUT1JfUEFSQU1TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLypcbmNvbnN0IHJlc29sdmVQYXJhbSA9IHBhcmFtID0+IHBhcmFtID09PSAnZXF1YWx0by1vdGhlcicgfHwgXG4vLy0+cGFyYW1zIHRoYXQgYXJlIGZpZWxkIG5hbWVzIGNhbiBiZSByZXNvbHZlZCB0byB0aGUgZmllbGRzIHRoZW1zZWx2ZXMgdG8gXG4vL2F2b2lkIGhhdmluZyB0byBwZXJmb3JtIERPTSBsb29rIHVwcyBldmVyeSB0aW1lIGl0IHZhbGlkYXRlc1xuKi9cbmNvbnN0IHJlc29sdmVQYXJhbSA9IHBhcmFtID0+ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgPyBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lJD0ke3BhcmFtc1swXS5zdWJzdHIoMil9XWApKSA6IHBhcmFtO1xuXG4vL1NvcnJ5Li4uXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhZGFwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPVE5FVF9QQVJBTVNbYWRhcHRvcl0gJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90byBkbzogcmVzb2x2ZVBhcmFtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yIHJlbW90ZSBhbmQgZXF1YWx0byB2YWxpZGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXiBzZWUgYWJvdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gW10uc2xpY2UuY2FsbChub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW4nLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpXX0pO1xuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJykgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dCkpO1xuICAgIGVsc2UgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgLypcbiAgICAvL2RhdGVcbiAgICAvL2RhdGVJU09cbiAgICAvL21pblxuICAgIC8vbWF4XG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cbiAgICAgICAgYWRhcHRlcnMuYWRkKFwiZXF1YWx0b1wiLCBbXCJvdGhlclwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBnZXRNb2RlbFByZWZpeChvcHRpb25zLmVsZW1lbnQubmFtZSksXG4gICAgICAgICAgICAgICAgb3RoZXIgPSBvcHRpb25zLnBhcmFtcy5vdGhlcixcbiAgICAgICAgICAgICAgICBmdWxsT3RoZXJOYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgob3RoZXIsIHByZWZpeCksXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQob3B0aW9ucy5mb3JtKS5maW5kKFwiOmlucHV0XCIpLmZpbHRlcihcIltuYW1lPSdcIiArIGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGZ1bGxPdGhlck5hbWUpICsgXCInXVwiKVswXTtcblxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcImVxdWFsVG9cIiwgZWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgLy9yZW1vdGVcbiAgICAvL2RpZ2l0c1xuICAgIC8vcmFuZ2VsZW5ndGhcbiAgICAqL1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbi8vICAgICBpZihtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCkpIHJldHVybiBhY2M7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuLy8gICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDogW2V4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldXG4vLyAgICAgfTs7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMgJiYgdmFsaWRhdG9yLnBhcmFtcy5sZW5ndGggPiAwID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG4gICAgICAgIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSB7XG4gICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9ICh2YWxpZGF0b3IsIGdyb3VwKSA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKSBcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
