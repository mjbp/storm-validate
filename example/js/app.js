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

var DOMNodesFromCommaList = exports.DOMNodesFromCommaList = function DOMNodesFromCommaList(list, input) {
    return list.split(',').map(function (item) {
        var resolvedSelector = escapeAttributeValue(appendModelPrefix(item, getModelPrefix(input.getAttribute('name'))));
        return [].slice.call(document.querySelectorAll('[name=' + resolvedSelector + ']'));
    });
};

var escapeAttributeValue = function escapeAttributeValue(value) {
    return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
};

var getModelPrefix = function getModelPrefix(fieldName) {
    return fieldName.substr(0, fieldName.lastIndexOf('.') + 1);
};

var appendModelPrefix = function appendModelPrefix(value, prefix) {
    if (value.indexOf("*.") === 0) value = value.replace("*.", prefix);
    return value;
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

var resolveParam = function resolveParam(param, input) {
    var value = input.getAttribute('data-val-' + param);
    return _defineProperty({}, param.split('-')[1], !!~_constants.DOM_SELECTOR_PARAMS.indexOf(param) ? (0, _.DOMNodesFromCommaList)(value, input) : value);
};

var extractParams = function extractParams(input, adaptor) {
    return _constants.DOTNET_PARAMS[adaptor] ? { params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
            return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input)) : acc;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxvQkFBQSxBQUFTLEtBQXpCLEFBQWdCLEFBQWMsQUFFOUI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQVpELEFBQWdDLENBQUE7O0FBY2hDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7Ozs7Ozs7Ozs7QUNoQmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEs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QUosQUFBdUIsQUFFdkI7O1NBQUksSUFBSixBQUFRLFNBQVIsQUFBaUIsUUFDYjtZQUFHLE9BQUEsQUFBTyxPQUFQLEFBQWMsV0FBZCxBQUF5QixTQUE1QixBQUFxQyxHQUNqQyxpQkFBQSxBQUFpQixTQUFTLE9BRmxDLEFBRVEsQUFBMEIsQUFBTztBQUV6QyxZQUFBLEFBQU8sQUFDVjtBQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIGxldCB2YWxpZGF0b3IgPSBWYWxpZGF0ZS5pbml0KCcuZm9ybScpO1xuXG4gICAgLy8gdmFsaWRhdG9yLmFkZE1ldGhvZChcbiAgICAvLyAgICAgJ3Rlc3QnLFxuICAgIC8vICAgICAnUmVxdWlyZWRTdHJpbmcnLFxuICAgIC8vICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0JztcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgJ1ZhbHVlIG11c3QgZXF1YWwgXCJ0ZXN0XCInXG4gICAgLy8gKTtcblxufV07XG5cbnsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG5cdFxuXHRpZihlbHMubGVuZ3RoID09PSAxICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyAmJiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXSlcblx0XHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL2F0dGFjaGVkIHRvIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1xuXHQvL3NvIHdlIGNhbiBib3RoIGluaXQsIGF1dG8taW5pdGlhbGlzZSBhbmQgcmVmZXIgYmFjayB0byBhbiBpbnN0YW5jZSBhdHRhY2hlZCB0byBhIGZvcm0gdG8gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdG9yc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gXG5cdFx0T2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdFx0YWNjW2VsXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRcdFx0XHRmb3JtOiBlbCxcblx0XHRcdFx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHRcdFx0XHR9KS5pbml0KCk7XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sIHt9KSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdFx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuXHR2YWxpZGF0ZSxcblx0ZXh0cmFjdEVycm9yTWVzc2FnZSxcblx0YXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsXG5cdG5vcm1hbGlzZVZhbGlkYXRvcnMsXG5cdHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHNcbn0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcbmltcG9ydCB7IGgsIGNyZWF0ZUVycm9yVGV4dE5vZGUgfSBmcm9tICcuL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLmZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcblx0XHR0aGlzLmdyb3VwcyA9IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbCh0aGlzLmZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pLCB0ZXh0YXJlYSwgc2VsZWN0JykpLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKTtcblx0XHR0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMuZ3JvdXBzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0aW5pdExpc3RlbmVycygpe1xuXHRcdHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuY2xlYXJFcnJvcnMoKTtcblx0XHRcdHRoaXMuc2V0VmFsaWRpdHlTdGF0ZSgpXG5cdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0aWYoIVtdLmNvbmNhdCguLi5yZXMpLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5mb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdGVsc2UgdGhpcy5yZW5kZXJFcnJvcnMoKSwgdGhpcy5pbml0UmVhbFRpbWVWYWxpZGF0aW9uKCk7XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgZSA9PiB7IHRoaXMuY2xlYXJFcnJvcnMoKTsgfSk7XG5cdH0sXG5cdGluaXRSZWFsVGltZVZhbGlkYXRpb24oKXtcblx0XHRsZXQgaGFuZGxlciA9IGZ1bmN0aW9uKGdyb3VwKSB7XG5cdFx0XHRcdHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKVxuXHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHRcdFx0aWYocmVzLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9LmJpbmQodGhpcyk7XG5cdFx0XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKGNob29zZVJlYWxUaW1lRXZlbnQoaW5wdXQpLCBoYW5kbGVyLmJpbmQodGhpcywgZ3JvdXApKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvL3BscywgcmVmYWN0b3IgbWUgO187XG5cdFx0XHRsZXQgZXF1YWxUb1ZhbGlkYXRvciA9IHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdlcXVhbHRvJyk7XG5cdFx0XHRcblx0XHRcdGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCBcblx0XHRcdFx0JiYgZXF1YWxUb1ZhbGlkYXRvclswXS5wYXJhbXMub3RoZXIuZm9yRWFjaChzdWJncm91cCA9PiB7XG5cdFx0XHRcdFx0c3ViZ3JvdXAuZm9yRWFjaChpdGVtID0+IHsgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlci5iaW5kKHRoaXMsIGdyb3VwKSl9KTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdC8vcmVzZXQgdmFsaWRpdHkgYW5kIGVycm9yTWVzc2FnZXNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdyb3Vwc1tncm91cF0seyB2YWxpZDogdHJ1ZSwgZXJyb3JNZXNzYWdlczogW10gfSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdFx0XHQvL3RvIGRvP1xuXHRcdFx0XHQvL29ubHkgcGVyZm9ybSB0aGUgcmVtb3RlIHZhbGlkYXRpb24gaWYgYWxsIGVsc2UgcGFzc2VzXG5cdFx0XHRcdFxuXHRcdFx0XHQvL3JlZmFjdG9yLCBleHRyYWN0IHRoaXMgd2hvbGUgZm4uLi5cblx0XHRcdFx0aWYodmFsaWRhdG9yLnR5cGUgIT09ICdyZW1vdGUnKXtcblx0XHRcdFx0XHRpZih2YWxpZGF0ZSh0aGlzLmdyb3Vwc1tncm91cF0sIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQvL211dGF0aW9uIGFuZCBzaWRlIGVmZmVjdC4uLlxuXHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlcy5wdXNoKGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCkpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdmFsaWRhdGUodGhpcy5ncm91cHNbZ3JvdXBdLCB2YWxpZGF0b3IpXG5cdFx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZihyZXMgJiYgcmVzID09PSB0cnVlKSByZXNvbHZlKHRydWUpO1x0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9tdXRhdGlvbiwgc2lkZSBlZmZlY3QsIGFuZCB1bi1EUlkuLi5cblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlcy5wdXNoKHR5cGVvZiByZXMgPT09ICdib29sZWFuJyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD8gZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBgU2VydmVyIGVycm9yOiAke3Jlc31gKTtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cdH0sXG5cdHNldFZhbGlkaXR5U3RhdGUoKXtcblx0XHRsZXQgZ3JvdXBWYWxpZGF0b3JzID0gW107XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3VwcykgZ3JvdXBWYWxpZGF0b3JzLnB1c2godGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApKTtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXBWYWxpZGF0b3JzKTtcblx0fSxcblx0Y2xlYXJFcnJvcnMoKXtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVFcnJvcihncm91cCl7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlICYmIHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuXHRcdGRlbGV0ZSB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET007XG5cdH0sXG5cdHJlbmRlckVycm9ycygpe1xuXHRcdC8vc3VwcG9ydCBmb3IgaW5saW5lIGFuZCBlcnJvciBsaXN0P1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpe1xuXHRcdFx0aWYoIXRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJFcnJvcihncm91cCl7XG5cdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00gPSBcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5zZXJ2ZXJFcnJvck5vZGUgPyBcblx0XHRcdFx0Y3JlYXRlRXJyb3JUZXh0Tm9kZSh0aGlzLmdyb3Vwc1tncm91cF0pIDogXG5cdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdXG5cdFx0XHRcdFx0XHQuZmllbGRzW3RoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6ICdlcnJvcicgfSwgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcblx0XHQvL3NldCBhcmlhLWludmFsaWQgb24gaW52YWxpZCBpbnB1dHNcblx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXHR9LFxuXHRhZGRNZXRob2QodHlwZSwgZ3JvdXBOYW1lLCBtZXRob2QsIG1lc3NhZ2Upe1xuXHRcdGlmKHR5cGUgPT09IHVuZGVmaW5lZCB8fCBncm91cE5hbWUgPT09IHVuZGVmaW5lZCB8fCBtZXRob2QgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHJldHVybiBjb25zb2xlLndhcm4oJ0N1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCBjYW5ub3QgYmUgYWRkZWQuJyk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLnB1c2goe3R5cGUsIG1ldGhvZCwgbWVzc2FnZX0pO1xuXHRcdC8vZXh0ZW5kIG1lc3NhZ2VzXG5cdH1cbn07XG5cbi8qXG5BUElcbntcblx0dmFsaWRhdGUoKXt9LFxuXHRhZGRNZXRob2QoKXt9XG59XG4qLyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge307XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFID0gJ2RhdGEtdmFsbXNnLWZvcic7XG5cbmV4cG9ydCBjb25zdCBET01fU0VMRUNUT1JfUEFSQU1TID0gWydyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdlcXVhbHRvLW90aGVyJ107XG5cbi8qIENhbiB0aGVzZSB0d28gYmUgZm9sZGVkIGludG8gdGhlIHNhbWUgdmFyaWFibGU/ICovXG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbGVuZ3RoLW1pbicsICdsZW5ndGgtbWF4J10sXG4gICAgc3RyaW5nbGVuZ3RoOiBbJ2xlbmd0aC1tYXgnXSxcbiAgICByYW5nZTogWydyYW5nZS1taW4nLCAncmFuZ2UtbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWlubGVuZ3RoLW1pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXhsZW5ndGgtbWF4J10sXG4gICAgcmVnZXg6IFsncmVnZXgtcGF0dGVybiddLFxuICAgIGVxdWFsdG86IFsnZXF1YWx0by1vdGhlciddLFxuICAgIHJlbW90ZTogWydyZW1vdGUtdXJsJywgJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ3JlbW90ZS10eXBlJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0FEQVBUT1JTID0gW1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ3N0cmluZ2xlbmd0aCcsXG4gICAgJ3JlZ2V4JyxcbiAgICAvLyAnZGlnaXRzJyxcbiAgICAnZW1haWwnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdsZW5ndGgnLFxuICAgICdtaW5sZW5ndGgnLFxuICAgICdyYW5nZScsXG4gICAgJ2VxdWFsdG8nLFxuICAgICdyZW1vdGUnLC8vc2hvdWxkIGJlIGxhc3RcbiAgICAvLyAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9XG59OyIsImltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmZXRjaCgocGFyYW1zLnR5cGUgIT09ICdnZXQnID8gcGFyYW1zLnVybCA6IGAke3BhcmFtcy51cmx9PyR7cmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyl9YCksIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUocmVzKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFcnJvclRleHROb2RlID0gZ3JvdXAgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZ3JvdXAuZXJyb3JNZXNzYWdlc1swXSk7XG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuIGdyb3VwLnNlcnZlckVycm9yTm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZ2V0TmFtZSA9IGdyb3VwID0+IGdyb3VwLmZpZWxkc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmV4cG9ydCBjb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmhhc093blByb3BlcnR5KCdmaWVsZHMnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBncm91cC5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuXG5leHBvcnQgY29uc3QgY2hvb3NlUmVhbFRpbWVFdmVudCA9IGlucHV0ID0+IFsnaW5wdXQnLCAnY2hhbmdlJ11bTnVtYmVyKGlzQ2hlY2thYmxlKGlucHV0KSB8fCBpc1NlbGVjdChpbnB1dCkgfHwgaXNGaWxlKGlucHV0KSldO1xuXG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGFjYywgZm4pID0+IGZuKGFjYykpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB4aHIuc2VuZChwcm9wcy5ib2R5KTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IChsaXN0LCBpbnB1dCkgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFNlbGVjdG9yID0gZXNjYXBlQXR0cmlidXRlVmFsdWUoYXBwZW5kTW9kZWxQcmVmaXgoaXRlbSwgZ2V0TW9kZWxQcmVmaXgoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtyZXNvbHZlZFNlbGVjdG9yfV1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuY29uc3QgZXNjYXBlQXR0cmlidXRlVmFsdWUgPSB2YWx1ZSA9PiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG5cbmNvbnN0IGdldE1vZGVsUHJlZml4ID0gZmllbGROYW1lID0+IGZpZWxkTmFtZS5zdWJzdHIoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcblxuY29uc3QgYXBwZW5kTW9kZWxQcmVmaXggPSAodmFsdWUsIHByZWZpeCkgPT4ge1xuICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufSIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IHBpcGUsIERPTU5vZGVzRnJvbUNvbW1hTGlzdCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSwgRE9NX1NFTEVDVE9SX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgaW5wdXQpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCk7XG4gICAgcmV0dXJuICh7W3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlLCBpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlIH0pXG59O1xuXG5jb25zdCBleHRyYWN0UGFyYW1zID0gKGlucHV0LCBhZGFwdG9yKSA9PiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHsgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdLnJlZHVjZSgoYWNjLCBwYXJhbSkgPT4gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApID8gT2JqZWN0LmFzc2lnbihhY2MsIHJlc29sdmVQYXJhbShwYXJhbSwgaW5wdXQpKSA6IGFjYywge30pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICBcbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG5jb25zdCBleHRyYWN0QXR0clZhbGlkYXRvcnMgPSBpbnB1dCA9PiBwaXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4oaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4vL3VuLURSWS4uLiBhbmQgdW5yZWFkYWJsZVxuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3JlcXVpcmVkJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IGVtYWlsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnZW1haWwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgdXJsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3VybCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBudW1iZXIgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbnVtYmVyJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbmxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbmxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4bGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW4nLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgcGF0dGVybiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyl9fV0gOiB2YWxpZGF0b3JzO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLm1ldGhvZCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvci5tZXRob2QoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSwgZ3JvdXAuZmllbGRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSAodmFsaWRhdG9yLCBncm91cCkgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
