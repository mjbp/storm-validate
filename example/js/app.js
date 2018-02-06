(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    var validator = _component2.default.init('.form');

    // validator.addMethod(
    //     'test',
    //     'RequiredString',
    //     (value, fields, params) => {
    //         return value === 'test';
    //     },
    //     'Value must equal "test"'
    // );
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

	if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

	if (els.length === 1 && window.__validators__ && window.__validators__[els[0]]) return window.__validators__[els[0]];

	//attached to window.__validators__
	//so we can both init, auto-initialise and refer back to an instance attached to a form to add additional validators
	return window.__validators__ = Object.assign({}, window.__validators__, els.reduce(function (acc, el) {
		if (el.getAttribute('novalidate')) return;
		acc[el] = Object.assign(Object.create(_componentPrototype2.default), {
			form: el,
			settings: Object.assign({}, _defaults2.default, opts)
		}).init();
		return acc;
	}, {}));
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

			this.setGroupValidityState(group).then(function (res) {
				if (_this2.groups[group].errorDOM) _this2.removeError(group);
				if (res.includes(false)) _this2.renderError(group);
			});
		}.bind(this);

		var _loop = function _loop(group) {
			_this3.groups[group].fields.forEach(function (input) {
				input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler.bind(_this3, group));
			});

			//pls, refactor me ;_;
			var equalToValidator = _this3.groups[group].validators.filter(function (validator) {
				return validator.type === 'equalto';
			});

			equalToValidator.length > 0 && equalToValidator[0].params.other.forEach(function (subgroup) {
				subgroup.forEach(function (item) {
					item.addEventListener('blur', handler.bind(_this3, group));
				});
			});
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
				//to do?
				//only perform the remote validation if all else passes

				//refactor, extract this whole fn...
				if (validator.type !== 'remote') {
					if ((0, _validators.validate)(_this4.groups[group], validator)) resolve(true);else {
						//mutation and side effect...
						_this4.groups[group].valid = false;
						_this4.groups[group].errorMessages.push((0, _validators.extractErrorMessage)(validator, group));
						resolve(false);
					}
				} else (0, _validators.validate)(_this4.groups[group], validator).then(function (res) {
					if (res && res === true) resolve(true);else {
						//mutation, side effect, and un-DRY...
						_this4.groups[group].valid = false;
						_this4.groups[group].errorMessages.push(typeof res === 'boolean' ? (0, _validators.extractErrorMessage)(validator, group) : 'Server error: ' + res);
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
		if (this.groups[group].errorDOM) this.removeError(group);
		this.groups[group].errorDOM = this.groups[group].serverErrorNode ? (0, _dom.createErrorTextNode)(this.groups[group]) : this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild((0, _dom.h)('div', { class: 'error' }, this.groups[group].errorMessages[0]));

		//set aria-invalid on invalid inputs
		this.groups[group].fields.forEach(function (field) {
			field.setAttribute('aria-invalid', 'true');
		});
	},
	addMethod: function addMethod(type, groupName, method, message) {
		if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
		this.groups[groupName].validators.push({ type: type, method: method, message: message });
		//extend messages
	}
};

/*
API
{
	validate(){},
	addMethod(){}
}
*/

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
'email', 'number', 'url', 'length', 'minlength', 'range', 'equalto', 'remote'];

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
    minlength: curryParamMethod('minlength', function (params) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length >= +params.min : +input.value.length >= +params.min, acc;
        };
    }),
    maxlength: curryParamMethod('maxlength', function (params) {
        return function (acc, input) {
            return acc = Array.isArray(input.value) ? input.value.length <= +params.max : +input.value.length <= +params.max, acc;
        };
    }),
    equalto: curryParamMethod('equalto', function (params) {
        return function (acc, input) {
            return acc = params.other.reduce(function (subgroupAcc, subgroup) {
                if ((0, _utils.extractValueFromGroup)(subgroup) !== input.value) subgroupAcc = false;
                return subgroupAcc;
            }, true), acc;
        };
    }),
    pattern: curryParamMethod('pattern', function (params) {
        return function (acc, input) {
            return acc = RegExp(params.regex).test(input.value), acc;
        };
    }),
    regex: curryParamMethod('regex', function (params) {
        return function (acc, input) {
            return acc = RegExp(params.regex).test(input.value), acc;
        };
    }),
    min: curryParamMethod('min', function (params) {
        return function (acc, input) {
            return acc = +input.value >= +params.min, acc;
        };
    }),
    max: curryParamMethod('max', function (params) {
        return function (acc, input) {
            return acc = +input.value <= +params.max, acc;
        };
    }),
    length: curryParamMethod('length', function (params) {
        return function (acc, input) {
            return acc = +input.value.length >= +params.min && (params.max === undefined || +input.value.length <= +params.max), acc;
        };
    }),
    range: curryParamMethod('range', function (params) {
        return function (acc, input) {
            return acc = +input.value >= +params.min && +input.value <= +params.max, acc;
        };
    }),
    remote: function remote(group, params) {
        return new Promise(function (resolve, reject) {
            (0, _utils.fetch)(params.type !== 'get' ? params.url : params.url + '?' + (0, _utils.resolveGetParams)(params.additionalfields), {
                method: params.type.toUpperCase(),
                body: params.type === 'get' ? null : (0, _utils.resolveGetParams)(params.additionalfields),
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function (res) {
                resolve(res);
            });
        });
    }
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

var resolveGetParams = exports.resolveGetParams = function resolveGetParams(nodeArrays) {
    return nodeArrays.map(function (nodes) {
        return nodes[0].getAttribute('name') + '=' + extractValueFromGroup(nodes);
    }).join('&');
};

var DOMNodesFromCommaList = exports.DOMNodesFromCommaList = function DOMNodesFromCommaList(list) {
    return list.split(',').map(function (item) {
        return [].slice.call(document.querySelectorAll('[name=' + item.substr(2) + ']'));
    });
};

var hasValue = function hasValue(input) {
    return input.value !== undefined && input.value !== null && input.value.length > 0;
};

var groupValueReducer = exports.groupValueReducer = function groupValueReducer(acc, input) {
    if (!isCheckable(input) && hasValue(input)) acc = input.value;
    if (isCheckable(input) && input.checked) {
        if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
    }
    return acc;
};

var extractValueFromGroup = exports.extractValueFromGroup = function extractValueFromGroup(group) {
    return group.hasOwnProperty('fields') ? group.fields.reduce(groupValueReducer, '') : group.reduce(groupValueReducer, '');
};

var chooseRealTimeEvent = exports.chooseRealTimeEvent = function chooseRealTimeEvent(input) {
    return ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];
};

var pipe = exports.pipe = function pipe() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return fns.reduce(function (acc, fn) {
        return fn(acc);
    });
};

var fetch = exports.fetch = function fetch(url, props) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(props.method || 'GET', url);
        if (props.headers) {
            Object.keys(props.headers).forEach(function (key) {
                xhr.setRequestHeader(key, props.headers[key]);
            });
        }
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            return reject(xhr.statusText);
        };
        xhr.send(props.body);
    });
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

var _ = require('./');

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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

var resolveParam = function resolveParam(param, value) {
    return _defineProperty({}, param.split('-')[1], !!~_constants.DOM_SELECTOR_PARAMS.indexOf(param) ? (0, _.DOMNodesFromCommaList)(value) : value);
};

var extractParams = function extractParams(input, adaptor) {
    return _constants.DOTNET_PARAMS[adaptor] ? { params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
            return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input.getAttribute('data-val-' + param))) : acc;
        }, {}) } : false;
};

var extractDataValValidators = function extractDataValValidators(input) {
    return _constants.DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
            type: adaptor,
            message: input.getAttribute('data-val-' + adaptor) }, extractParams(input, adaptor))]);
    }, []);
};

var extractAttrValidators = function extractAttrValidators(input) {
    return (0, _.pipe)(email(input), url(input), number(input), minlength(input), maxlength(input), min(input), max(input), pattern(input), required(input));
};

//un-DRY... and unreadable
var required = function required(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.hasAttribute('required') && input.getAttribute('required') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'required' }]) : validators;
    };
};
var email = function email(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('type') === 'email' ? [].concat(_toConsumableArray(validators), [{ type: 'email' }]) : validators;
    };
};
var url = function url(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('type') === 'url' ? [].concat(_toConsumableArray(validators), [{ type: 'url' }]) : validators;
    };
};
var number = function number(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('type') === 'number' ? [].concat(_toConsumableArray(validators), [{ type: 'number' }]) : validators;
    };
};
var minlength = function minlength(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'minlength', params: { min: input.getAttribute('minlength') } }]) : validators;
    };
};
var maxlength = function maxlength(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'maxlength', params: { max: input.getAttribute('maxlength') } }]) : validators;
    };
};
var min = function min(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('min') && input.getAttribute('min') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'min', params: { min: input.getAttribute('min') } }]) : validators;
    };
};
var max = function max(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('max') && input.getAttribute('max') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'max', params: { max: input.getAttribute('max') } }]) : validators;
    };
};
var pattern = function pattern(input) {
    return function () {
        var validators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false' ? [].concat(_toConsumableArray(validators), [{ type: 'pattern', params: { regex: input.getAttribute('pattern') } }]) : validators;
    };
};

var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    return input.getAttribute('data-val') === 'true' ? extractDataValValidators(input) : extractAttrValidators(input);
};

var validate = exports.validate = function validate(group, validator) {
    return validator.method ? validator.method((0, _.extractValueFromGroup)(group), group.fields) : _methods2.default[validator.type](group, validator.params);
};

var assembleValidationGroup = exports.assembleValidationGroup = function assembleValidationGroup(acc, input) {
    var name = input.getAttribute('name');
    return acc[name] = acc[name] ? Object.assign(acc[name], { fields: [].concat(_toConsumableArray(acc[name].fields), [input]) }) : {
        valid: false,
        validators: normaliseValidators(input),
        fields: [input],
        serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + input.getAttribute('name') + ']') || false
    }, acc;
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

},{"../constants":4,"../messages":6,"../methods":7,"./":9}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxvQkFBQSxBQUFTLEtBQXpCLEFBQWdCLEFBQWMsQUFFOUI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQVpELEFBQWdDLENBQUE7O0FBY2hDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7Ozs7Ozs7Ozs7QUNoQmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEs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Q2EsQUFDUjtvQkFBWSxvQkFGakIsQUFFaUIsQUFBb0IsQUFDaEM7Z0JBQVEsQ0FIYixBQUdhLEFBQUMsQUFDVDt5QkFBaUIsU0FBQSxBQUFTLHdFQUFzRCxNQUFBLEFBQU0sYUFBckUsQUFBK0QsQUFBbUIsa0JBTGhJLEFBQ3dCLEFBSXVIO0FBSnZILEFBQ0ssS0FGN0IsRUFBUCxBQU1tQyxBQUN0QztBQVRNOztBQVdBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQUMsV0FBRCxBQUFZLE9BQVo7V0FBc0IsVUFBQSxBQUFVLFdBQVcsbUJBQVMsVUFBVCxBQUFtQixNQUFNLFVBQUEsQUFBVSxXQUFWLEFBQXFCLFlBQVksVUFBakMsQUFBMkMsU0FBL0csQUFBMkMsQUFBNkU7QUFBcEo7O0FBRUEsSUFBTSxnRUFBNEIsU0FBNUIsQUFBNEIsa0NBQVUsQUFDL0M7UUFBSSxtQkFBSixBQUF1QixBQUV2Qjs7U0FBSSxJQUFKLEFBQVEsU0FBUixBQUFpQixRQUNiO1lBQUcsT0FBQSxBQUFPLE9BQVAsQUFBYyxXQUFkLEFBQXlCLFNBQTVCLEFBQXFDLEdBQ2pDLGlCQUFBLEFBQWlCLFNBQVMsT0FGbEMsQUFFUSxBQUEwQixBQUFPO0FBRXpDLFlBQUEsQUFBTyxBQUNWO0FBUk0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJy5mb3JtJyk7XG5cbiAgICAvLyB2YWxpZGF0b3IuYWRkTWV0aG9kKFxuICAgIC8vICAgICAndGVzdCcsXG4gICAgLy8gICAgICdSZXF1aXJlZFN0cmluZycsXG4gICAgLy8gICAgICh2YWx1ZSwgZmllbGRzLCBwYXJhbXMpID0+IHtcbiAgICAvLyAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gJ3Rlc3QnO1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICAnVmFsdWUgbXVzdCBlcXVhbCBcInRlc3RcIidcbiAgICAvLyApO1xuXG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChjYW5kaWRhdGUsIG9wdHMpID0+IHtcblx0bGV0IGVscztcblxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcblx0XG5cdGlmKGVscy5sZW5ndGggPT09IDEgJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dKVxuXHRcdHJldHVybiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXTtcblx0XG5cdC8vYXR0YWNoZWQgdG8gd2luZG93Ll9fdmFsaWRhdG9yc19fXG5cdC8vc28gd2UgY2FuIGJvdGggaW5pdCwgYXV0by1pbml0aWFsaXNlIGFuZCByZWZlciBiYWNrIHRvIGFuIGluc3RhbmNlIGF0dGFjaGVkIHRvIGEgZm9ybSB0byBhZGQgYWRkaXRpb25hbCB2YWxpZGF0b3JzXG5cdHJldHVybiB3aW5kb3cuX192YWxpZGF0b3JzX18gPSBcblx0XHRPYmplY3QuYXNzaWduKHt9LCB3aW5kb3cuX192YWxpZGF0b3JzX18sIGVscy5yZWR1Y2UoKGFjYywgZWwpID0+IHtcblx0XHRcdGlmKGVsLmdldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSByZXR1cm47XG5cdFx0XHRhY2NbZWxdID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdFx0XHRcdGZvcm06IGVsLFxuXHRcdFx0XHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdFx0XHRcdH0pLmluaXQoKTtcblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSwge30pKTtcbn07XG5cbi8vQXV0by1pbml0aWFsaXNlXG57IFxuXHRbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKSlcblx0XHQuZm9yRWFjaChmb3JtID0+IHsgZm9ybS5xdWVyeVNlbGVjdG9yKCdbZGF0YS12YWw9dHJ1ZV0nKSAmJiBpbml0KGZvcm0pOyB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiLy8gaW1wb3J0IGlucHV0UHJvdG90eXBlIGZyb20gJy4vaW5wdXQtcHJvdG90eXBlJztcbmltcG9ydCB7IGNob29zZVJlYWxUaW1lRXZlbnQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG5cdHZhbGlkYXRlLFxuXHRleHRyYWN0RXJyb3JNZXNzYWdlLFxuXHRhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCxcblx0bm9ybWFsaXNlVmFsaWRhdG9ycyxcblx0cmVtb3ZlVW52YWxpZGF0YWJsZUdyb3Vwc1xufSBmcm9tICcuL3V0aWxzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgaCwgY3JlYXRlRXJyb3JUZXh0Tm9kZSB9IGZyb20gJy4vdXRpbHMvZG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhbXS5zbGljZS5jYWxsKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0dGhpcy5zZXRWYWxpZGl0eVN0YXRlKClcblx0XHRcdFx0LnRoZW4ocmVzID0+IHtcblx0XHRcdFx0XHRpZighW10uY29uY2F0KC4uLnJlcykuaW5jbHVkZXMoZmFsc2UpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0ZWxzZSB0aGlzLnJlbmRlckVycm9ycygpLCB0aGlzLmluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcblx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBlID0+IHsgdGhpcy5jbGVhckVycm9ycygpOyB9KTtcblx0fSxcblx0aW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpe1xuXHRcdGxldCBoYW5kbGVyID0gZnVuY3Rpb24oZ3JvdXApIHtcblx0XHRcdFx0dGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApXG5cdFx0XHRcdFx0LnRoZW4ocmVzID0+IHtcblx0XHRcdFx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0XHRcdFx0XHRpZihyZXMuaW5jbHVkZXMoZmFsc2UpKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHRcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChpbnB1dCA9PiB7XG5cdFx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoY2hvb3NlUmVhbFRpbWVFdmVudChpbnB1dCksIGhhbmRsZXIuYmluZCh0aGlzLCBncm91cCkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vcGxzLCByZWZhY3RvciBtZSA7Xztcblx0XHRcdGxldCBlcXVhbFRvVmFsaWRhdG9yID0gdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcblx0XHRcdFxuXHRcdFx0ZXF1YWxUb1ZhbGlkYXRvci5sZW5ndGggPiAwIFxuXHRcdFx0XHQmJiBlcXVhbFRvVmFsaWRhdG9yWzBdLnBhcmFtcy5vdGhlci5mb3JFYWNoKHN1Ymdyb3VwID0+IHtcblx0XHRcdFx0XHRzdWJncm91cC5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVyLmJpbmQodGhpcywgZ3JvdXApKX0pO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCl7XG5cdFx0Ly9yZXNldCB2YWxpZGl0eSBhbmQgZXJyb3JNZXNzYWdlc1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ3JvdXBzW2dyb3VwXSx7IHZhbGlkOiB0cnVlLCBlcnJvck1lc3NhZ2VzOiBbXSB9KTtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdC8vdG8gZG8/XG5cdFx0XHRcdC8vb25seSBwZXJmb3JtIHRoZSByZW1vdGUgdmFsaWRhdGlvbiBpZiBhbGwgZWxzZSBwYXNzZXNcblx0XHRcdFx0XG5cdFx0XHRcdC8vcmVmYWN0b3IsIGV4dHJhY3QgdGhpcyB3aG9sZSBmbi4uLlxuXHRcdFx0XHRpZih2YWxpZGF0b3IudHlwZSAhPT0gJ3JlbW90ZScpe1xuXHRcdFx0XHRcdGlmKHZhbGlkYXRlKHRoaXMuZ3JvdXBzW2dyb3VwXSwgdmFsaWRhdG9yKSkgcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vbXV0YXRpb24gYW5kIHNpZGUgZWZmZWN0Li4uXG5cdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzLnB1c2goZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKSk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB2YWxpZGF0ZSh0aGlzLmdyb3Vwc1tncm91cF0sIHZhbGlkYXRvcilcblx0XHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmKHJlcyAmJiByZXMgPT09IHRydWUpIHJlc29sdmUodHJ1ZSk7XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvL211dGF0aW9uLCBzaWRlIGVmZmVjdCwgYW5kIHVuLURSWS4uLlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzLnB1c2godHlwZW9mIHJlcyA9PT0gJ2Jvb2xlYW4nIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ6IGBTZXJ2ZXIgZXJyb3I6ICR7cmVzfWApO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pKTtcblx0fSxcblx0c2V0VmFsaWRpdHlTdGF0ZSgpe1xuXHRcdGxldCBncm91cFZhbGlkYXRvcnMgPSBbXTtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKSBncm91cFZhbGlkYXRvcnMucHVzaCh0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCkpO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChncm91cFZhbGlkYXRvcnMpO1xuXHR9LFxuXHRjbGVhckVycm9ycygpe1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbW92ZUVycm9yKGdyb3VwKXtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgJiYgdGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pOy8vb3Igc2hvdWxkIGkgc2V0IHRoaXMgdG8gZmFsc2UgaWYgZmllbGQgcGFzc2VzIHZhbGlkYXRpb24/XG5cdFx0ZGVsZXRlIHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTTtcblx0fSxcblx0cmVuZGVyRXJyb3JzKCl7XG5cdFx0Ly9zdXBwb3J0IGZvciBpbmxpbmUgYW5kIGVycm9yIGxpc3Q/XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZighdGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKSB0aGlzLnJlbmRlckVycm9yKGdyb3VwKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckVycm9yKGdyb3VwKXtcblx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSA9IFxuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSA/IFxuXHRcdFx0XHRjcmVhdGVFcnJvclRleHROb2RlKHRoaXMuZ3JvdXBzW2dyb3VwXSkgOiBcblx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF1cblx0XHRcdFx0XHRcdC5maWVsZHNbdGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogJ2Vycm9yJyB9LCB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG5cdH0sXG5cdGFkZE1ldGhvZCh0eXBlLCBncm91cE5hbWUsIG1ldGhvZCwgbWVzc2FnZSl7XG5cdFx0aWYodHlwZSA9PT0gdW5kZWZpbmVkIHx8IGdyb3VwTmFtZSA9PT0gdW5kZWZpbmVkIHx8IG1ldGhvZCA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnNvbGUud2FybignQ3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIGNhbm5vdCBiZSBhZGRlZC4nKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMucHVzaCh7dHlwZSwgbWV0aG9kLCBtZXNzYWdlfSk7XG5cdFx0Ly9leHRlbmQgbWVzc2FnZXNcblx0fVxufTtcblxuLypcbkFQSVxue1xuXHR2YWxpZGF0ZSgpe30sXG5cdGFkZE1ldGhvZCgpe31cbn1cbiovIiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICByZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH1cbn07IiwiaW1wb3J0IHsgZmV0Y2gsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgcmVzb2x2ZUdldFBhcmFtcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09ICcnO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gJycsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgsIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyA9IHBhcmFtcy5vdGhlci5yZWR1Y2UoKHN1Ymdyb3VwQWNjLCBzdWJncm91cCkgPT4ge1xuICAgICAgICAgICAgaWYoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKHN1Ymdyb3VwKSAhPT0gaW5wdXQudmFsdWUpIHN1Ymdyb3VwQWNjID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3ViZ3JvdXBBY2M7XG4gICAgICAgIH0sIHRydWUpLCBhY2M7XG4gICAgfSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluICYmIChwYXJhbXMubWF4ID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZldGNoKChwYXJhbXMudHlwZSAhPT0gJ2dldCcgPyBwYXJhbXMudXJsIDogYCR7cGFyYW1zLnVybH0/JHtyZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKX1gKSwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogcGFyYW1zLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICBib2R5OiBwYXJhbXMudHlwZSA9PT0gJ2dldCcgPyBudWxsIDogcmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7IHJlc29sdmUoZGF0YSk7IH0pXG4gICAgICAgICAgICAuY2F0Y2gocmVzID0+IHsgcmVzb2x2ZShyZXMpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSBncm91cCA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShncm91cC5lcnJvck1lc3NhZ2VzWzBdKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTsiLCJleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNGaWxlID0gZmllbGQgPT4gZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdmaWxlJztcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmV4cG9ydCBjb25zdCBnZXROYW1lID0gZ3JvdXAgPT4gZ3JvdXAuZmllbGRzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG5leHBvcnQgY29uc3QgcmVzb2x2ZUdldFBhcmFtcyA9IG5vZGVBcnJheXMgPT4gbm9kZUFycmF5cy5tYXAoKG5vZGVzKSA9PiB7XG4gICAgcmV0dXJuIGAke25vZGVzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpfT0ke2V4dHJhY3RWYWx1ZUZyb21Hcm91cChub2Rlcyl9YDtcbn0pLmpvaW4oJyYnKTtcblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IGxpc3QgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke2l0ZW0uc3Vic3RyKDIpfV1gKSkpO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5oYXNPd25Qcm9wZXJ0eSgnZmllbGRzJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZ3JvdXAucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJylcblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWxUaW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTtcblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuZXhwb3J0IGNvbnN0IGZldGNoID0gKHVybCwgcHJvcHMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKHByb3BzLm1ldGhvZCB8fCAnR0VUJywgdXJsKTtcbiAgICAgICAgaWYgKHByb3BzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BzLmhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHByb3BzLmhlYWRlcnNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgeGhyLnNlbmQocHJvcHMuYm9keSk7XG4gICAgfSk7XG59OyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IHBpcGUsIERPTU5vZGVzRnJvbUNvbW1hTGlzdCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSwgRE9NX1NFTEVDVE9SX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgdmFsdWUpID0+ICh7W3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSk7XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkpKSA6IGFjYywge30pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICBcbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG5jb25zdCBleHRyYWN0QXR0clZhbGlkYXRvcnMgPSBpbnB1dCA9PiBwaXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4oaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4vL3VuLURSWS4uLiBhbmQgdW5yZWFkYWJsZVxuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3JlcXVpcmVkJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IGVtYWlsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnZW1haWwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgdXJsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3VybCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBudW1iZXIgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbnVtYmVyJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbmxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbmxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4bGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW4nLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgcGF0dGVybiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyl9fV0gOiB2YWxpZGF0b3JzO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLm1ldGhvZCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvci5tZXRob2QoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSwgZ3JvdXAuZmllbGRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSAodmFsaWRhdG9yLCBncm91cCkgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
