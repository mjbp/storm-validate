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

var DOTNET_ADAPTORS = exports.DOTNET_ADAPTORS = [
//'regex', -> same as pattern, how is it applied to an element? pattern attribute? data-val-regex?
'required', 'stringlength',
// 'date',
'regex',
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

        //compose URL and body differently if GET/POST


        return new Promise(function (resolve, reject) {
            fetch(url + '?' + (0, _utils.getName)(group) + '=' + (0, _utils.extractValueFromGroup)(group), {
                method: type.toUpperCase(),
                // body: JSON.stringify(composeRequestBody(group, additionalfields)), 
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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

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

var extractAdditionalFieldData = function extractAdditionalFieldData(sel) {
    sel.split(',').map(function (selector) {
        //document.querySelectorAll('name');
    });
};

var composeRequestBody = exports.composeRequestBody = function composeRequestBody(group, additionalFields) {
    return Object.assign({}, _defineProperty({}, getName(group), extractValueFromGroup(group)), additionalFields ? {} : {});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sR0FBQSxBQUFHLE1BQUgs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LEFBQU0sYUFBckUsQUFBK0QsQUFBbUIsa0JBSnZHLEFBQWtDLEFBSW9GLEFBRXpIO0FBTnFDLEFBQzlCO0FBRlIsV0FRSyxJQUFJLE1BQUEsQUFBTSxhQUFWLEFBQUksQUFBbUIsU0FBdkIsQUFBZ0MsT0FBaEMsQUFBdUMsS0FBdkMsQUFBNEMsQUFDakQ7V0FBQSxBQUFPLEFBQ1Y7QUFYTTs7QUFhQSxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLFdBQUQsQUFBWSxPQUFaO1dBQXNCLFVBQUEsQUFBVSxXQUFXLG1CQUFTLFVBQVQsQUFBbUIsTUFBTSxVQUFBLEFBQVUsV0FBVixBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFNBQS9HLEFBQTJDLEFBQTZFO0FBQXBKOztBQUVBLElBQU0sZ0VBQTRCLFNBQTVCLEFBQTRCLGtDQUFVLEFBQy9DO1FBQUksbUJBQUosQUFBdUIsQUFFdkI7O1NBQUksSUFBSixBQUFRLFNBQVIsQUFBaUIsUUFDYjtZQUFHLE9BQUEsQUFBTyxPQUFQLEFBQWMsV0FBZCxBQUF5QixTQUE1QixBQUFxQyxHQUNqQyxpQkFBQSxBQUFpQixTQUFTLE9BRmxDLEFBRVEsQUFBMEIsQUFBTztBQUV6QyxZQUFBLEFBQU8sQUFDVjtBQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIC8vIFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdC8vYXNzdW1lIGl0J3MgYSBkb20gbm9kZVxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcbiAgICBcblx0cmV0dXJuIGVscy5yZWR1Y2UoKGFjYywgZWwpID0+IHtcblx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdGFjYy5wdXNoKE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRmb3JtOiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCkpO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIFtdKTtcbn07XG5cbi8vQXV0by1pbml0aWFsaXNlXG57IFxuXHRbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKSlcblx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuXHR2YWxpZGF0ZSxcblx0ZXh0cmFjdEVycm9yTWVzc2FnZSxcblx0YXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsXG5cdG5vcm1hbGlzZVZhbGlkYXRvcnMsXG5cdHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHNcbn0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcbmltcG9ydCB7IGgsIGNyZWF0ZUVycm9yVGV4dE5vZGUgfSBmcm9tICcuL3V0aWxzL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHQvL3ByZXZlbnQgYnJvd3NlciB2YWxpZGF0aW9uXG5cdFx0dGhpcy5mb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cdFx0dGhpcy5ncm91cHMgPSByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKFtdLnNsaWNlLmNhbGwodGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKS5yZWR1Y2UoYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAsIHt9KSk7XG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLmdyb3Vwcyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGluaXRMaXN0ZW5lcnMoKXtcblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmNsZWFyRXJyb3JzKCk7XG5cdFx0XHR0aGlzLnNldFZhbGlkaXR5U3RhdGUoKVxuXHRcdFx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHRpZighW10uY29uY2F0KC4uLnJlcykuaW5jbHVkZXMoZmFsc2UpKSB0aGlzLmZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0XHRlbHNlIHRoaXMucmVuZGVyRXJyb3JzKCksIHRoaXMuaW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgZSA9PiB7IHRoaXMuY2xlYXJFcnJvcnMoKTsgfSk7XG5cdH0sXG5cdGluaXRSZWFsVGltZVZhbGlkYXRpb24oKXtcblx0XHRsZXQgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0bGV0IGdyb3VwID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cdFx0XHRcdGlmKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSkgdGhpcy5yZW1vdmVFcnJvcihncm91cCk7XG5cdFx0XHRcdC8vIGlmKCF0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cCkpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdFx0XHR0aGlzLnNldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cClcblx0XHRcdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdFx0aWYocmVzLmluY2x1ZGVzKGZhbHNlKSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9LmJpbmQodGhpcyk7XG5cdFx0XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHR0aGlzLmdyb3Vwc1tncm91cF0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuXHRcdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKGNob29zZVJlYWxUaW1lRXZlbnQoaW5wdXQpLCBoYW5kbGVyKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0c2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKXtcblx0XHQvL3Jlc2V0IHZhbGlkaXR5IGFuZCBlcnJvck1lc3NhZ2VzXG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5ncm91cHNbZ3JvdXBdLHsgdmFsaWQ6IHRydWUsIGVycm9yTWVzc2FnZXM6IFtdIH0pO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbCh0aGlzLmdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRcdFx0Ly9yZWZhY3RvciwgZXh0cmFjdCB0aGlzIHdob2xlIGZuLi4uXG5cdFx0XHRcdGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG5cdFx0XHRcdFx0aWYodmFsaWRhdGUodGhpcy5ncm91cHNbZ3JvdXBdLCB2YWxpZGF0b3IpKSByZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly9tdXRhdGlvbiBhbmQgc2lkZSBlZmZlY3QuLi5cblx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yTWVzc2FnZXMucHVzaChleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApKTtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHZhbGlkYXRlKHRoaXMuZ3JvdXBzW2dyb3VwXSwgdmFsaWRhdG9yKVxuXHRcdFx0XHRcdFx0LnRoZW4ocmVzID0+IHtcblx0XHRcdFx0XHRcdFx0aWYocmVzKSByZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvL211dGF0aW9uLCBzaWRlIGVmZmVjdCwgYW5kIHVuLURSWS4uLlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvck1lc3NhZ2VzLnB1c2goZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKSk7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSkpO1xuXHR9LFxuXHRzZXRWYWxpZGl0eVN0YXRlKCl7XG5cdFx0bGV0IGdyb3VwVmFsaWRhdG9ycyA9IFtdO1xuXHRcdGZvcihsZXQgZ3JvdXAgaW4gdGhpcy5ncm91cHMpIGdyb3VwVmFsaWRhdG9ycy5wdXNoKHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKSk7XG5cblx0XHQvL09iamVjdC5rZXlzKHRoaXMuZ3JvdXBzKS5tYXAodGhpcy5zZXRHcm91cFZhbGlkaXR5U3RhdGUpXG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwVmFsaWRhdG9ycyk7XG5cdH0sXG5cdGNsZWFyRXJyb3JzKCl7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSAmJiB0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7Ly9vciBzaG91bGQgaSBzZXQgdGhpcyB0byBmYWxzZSBpZiBmaWVsZCBwYXNzZXMgdmFsaWRhdGlvbj9cblx0XHRkZWxldGUgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NO1xuXHR9LFxuXHRyZW5kZXJFcnJvcnMoKXtcblx0XHQvL3N1cHBvcnQgZm9yIGlubGluZSBhbmQgZXJyb3IgbGlzdD9cblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSA9IFxuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSA/IFxuXHRcdFx0XHRjcmVhdGVFcnJvclRleHROb2RlKHRoaXMuZ3JvdXBzW2dyb3VwXSkgOiBcblx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF1cblx0XHRcdFx0XHRcdC5maWVsZHNbdGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogJ2Vycm9yJyB9LCB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG5cdH0sXG5cdGFkZE1ldGhvZChuYW1lLCBmbiwgbWVzc2FnZSl7XG5cdFx0dGhpcy5ncm91cHMudmFsaWRhdG9ycy5wdXNoKGZuKTtcblx0XHQvL2V4dGVuZCBtZXNzYWdlc1xuXHR9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge307XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFID0gJ2RhdGEtdmFsbXNnLWZvcic7XG5cbi8qIENhbiB0aGVzZSB0d28gYmUgZm9sZGVkIGludG8gdGhlIHNhbWUgdmFyaWFibGU/ICovXG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbGVuZ3RoLW1pbicsICdsZW5ndGgtbWF4J10sXG4gICAgc3RyaW5nbGVuZ3RoOiBbJ2xlbmd0aC1tYXgnXSxcbiAgICByYW5nZTogWydyYW5nZS1taW4nLCAncmFuZ2UtbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWlubGVuZ3RoLW1pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXhsZW5ndGgtbWF4J10sXG4gICAgcmVnZXg6IFsncmVnZXgtcGF0dGVybiddLFxuICAgIGVxdWFsVG86IFsnZXF1YWx0by1vdGhlciddLFxuICAgIHJlbW90ZTogWydyZW1vdGUtdXJsJywgJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ3JlbW90ZS10eXBlJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0FEQVBUT1JTID0gW1xuICAgIC8vJ3JlZ2V4JywgLT4gc2FtZSBhcyBwYXR0ZXJuLCBob3cgaXMgaXQgYXBwbGllZCB0byBhbiBlbGVtZW50PyBwYXR0ZXJuIGF0dHJpYnV0ZT8gZGF0YS12YWwtcmVnZXg/XG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAvLyAnZGF0ZScsXG4gICAgJ3JlZ2V4JyxcbiAgICAvLyAnZGlnaXRzJyxcbiAgICAnZW1haWwnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdsZW5ndGgnLFxuICAgICdyYW5nZScsXG4gICAgJ2VxdWFsdG8nLFxuICAgICdyZW1vdGUnLFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICAvL3JhbmdlbGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fSBjaGFyYWN0ZXJzIGxvbmcuYDsgfSxcbiAgICAvL3JhbmdlKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuICR7cHJvcHMubWlufSBhbmQgJHtwcm9wcy5tYXh9LmA7IH0sXG4gICAgLy9yZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH0sXG4gICAgLy9zdGVwKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSBtdWx0aXBsZSBvZiAke3Byb3BzfS5gOyB9XG59OyIsImltcG9ydCB7IGlzU2VsZWN0LCBpc0NoZWNrYWJsZSwgaXNSZXF1aXJlZCwgZ2V0TmFtZSwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwLCBjb21wb3NlUmVxdWVzdEJvZHkgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLCBcbiAgICAgICAgcGFyYW0gPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW0gOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSwgYWNjKVxuICAgICksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsICguLi5yZWdleFN0cikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocmVnZXhTdHIpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCAoLi4ucmVnZXhTdHIpID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHJlZ2V4U3RyKS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCAoLi4ubWluKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA+PSArbWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsICguLi5tYXgpID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICttYXgsIGFjYykpLFxuICAgIGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZCgnbGVuZ3RoJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtc1swXSAmJiAocGFyYW1zWzFdID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zWzFdKSksIGFjYykpLFxuICAgIHJhbmdlOiBjdXJyeVBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtc1swXSAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtc1sxXSksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IHtcbiAgICAgICAgbGV0IFsgdXJsLCBhZGRpdGlvbmFsZmllbGRzLCB0eXBlID0gJ2dldCddID0gcGFyYW1zO1xuXG4gICAgICAgIC8vY29tcG9zZSBVUkwgYW5kIGJvZHkgZGlmZmVyZW50bHkgaWYgR0VUL1BPU1RcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZldGNoKGAke3VybH0/JHtnZXROYW1lKGdyb3VwKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApfWAsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAvLyBib2R5OiBKU09OLnN0cmluZ2lmeShjb21wb3NlUmVxdWVzdEJvZHkoZ3JvdXAsIGFkZGl0aW9uYWxmaWVsZHMpKSwgXG4gICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKHRydWUpOyB9KTsvL3doYXQgdG8gZG8gaWYgZW5kcG9pbnQgdmFsaWRhdGlvbiBmYWlscz9cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIHJhbmdlbGVuZ3RoXG4gICAgLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDIwXG5cbiAgICAvLyByYW5nZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuICAgIC8vIFxuICAgIC8vIHN0ZXBcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ0MVxuXG4gICAgLy8gZXF1YWxUb1xuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDc5XG5cblxuICAgIC8qIFxuICAgIEV4dGVuc2lvbnNcbiAgICAgICAgLSBwYXNzd29yZFxuICAgICAgICAtIG5vbmFscGhhbWluIC9cXFcvZ1xuICAgICAgICAtIHJlZ2V4L3BhdHRlcm5cbiAgICAgICAgLSBib29sXG4gICAgICAgIC0gZmlsZWV4dGVuc2lvbnNcbiAgICAqL1xufTsiLCJleHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSBncm91cCA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShncm91cC5lcnJvck1lc3NhZ2VzWzBdKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTsiLCJleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNGaWxlID0gZmllbGQgPT4gZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdmaWxlJztcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmV4cG9ydCBjb25zdCBnZXROYW1lID0gZ3JvdXAgPT4gZ3JvdXAuZmllbGRzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG5jb25zdCBleHRyYWN0QWRkaXRpb25hbEZpZWxkRGF0YSA9IHNlbCA9PiB7XG4gICAgc2VsLnNwbGl0KCcsJykubWFwKHNlbGVjdG9yID0+IHtcbiAgICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYW1lJyk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29tcG9zZVJlcXVlc3RCb2R5ID0gKGdyb3VwLCBhZGRpdGlvbmFsRmllbGRzKSA9PiBPYmplY3QuYXNzaWduKHt9LCB7W2dldE5hbWUoZ3JvdXApXTpleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApfSwgYWRkaXRpb25hbEZpZWxkcyA/IHt9IDoge30pO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5jb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKTtcblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWxUaW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTtcblxuXG4vLyBjb25zdCBjb21wb3NlciA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKTtcbi8vIGV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZShjb21wb3Nlcik7XG4vLyBleHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2VSaWdodChjb21wb3Nlcik7XG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBjb21wb3NlLmFwcGx5KGNvbXBvc2UsIGZucy5yZXZlcnNlKCkpOyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IERPVE5FVF9BREFQVE9SUywgRE9UTkVUX1BBUkFNUywgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vL1NvcnJ5Li4uXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhZGFwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPVE5FVF9QQVJBTVNbYWRhcHRvcl0gJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBhY2MucHVzaChpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbi8vZm9yIGRhdGEtcnVsZS0qIHN1cHBvcnRcbi8vY29uc3QgaGFzRGF0YUF0dHJpYnV0ZVBhcnQgPSAobm9kZSwgcGFydCkgPT4gW10uc2xpY2UuY2FsbChub2RlLmRhdGFzZXQpLmZpbHRlcihhdHRyaWJ1dGUgPT4gISF+YXR0cmlidXRlLmluZGV4T2YocGFydCkpLmxlbmd0aCA+IDA7XG5cbmNvbnN0IGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzID0gaW5wdXQgPT4ge1xuICAgIGxldCB2YWxpZGF0b3JzID0gW107XG4gICAgaWYoaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncmVxdWlyZWQnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ2VtYWlsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAndXJsJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbnVtYmVyJ30pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW4nLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4JywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpXX0pO1xuICAgIHJldHVybiB2YWxpZGF0b3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJykgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dCkpO1xuICAgIGVsc2UgdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuY29uY2F0KGV4dHJhY3RBdHRyaWJ1dGVWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgLypcbiAgICAvL2RhdGVcbiAgICAvL2RhdGVJU09cbiAgICAvL21pblxuICAgIC8vbWF4XG4gICAgLy9zdGVwXG5cbiAgICAvL2VxdWFsVG9cbiAgICAgICAgYWRhcHRlcnMuYWRkKFwiZXF1YWx0b1wiLCBbXCJvdGhlclwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBnZXRNb2RlbFByZWZpeChvcHRpb25zLmVsZW1lbnQubmFtZSksXG4gICAgICAgICAgICAgICAgb3RoZXIgPSBvcHRpb25zLnBhcmFtcy5vdGhlcixcbiAgICAgICAgICAgICAgICBmdWxsT3RoZXJOYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgob3RoZXIsIHByZWZpeCksXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQob3B0aW9ucy5mb3JtKS5maW5kKFwiOmlucHV0XCIpLmZpbHRlcihcIltuYW1lPSdcIiArIGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGZ1bGxPdGhlck5hbWUpICsgXCInXVwiKVswXTtcblxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcImVxdWFsVG9cIiwgZWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgLy9yZW1vdGVcbiAgICAvL2RpZ2l0c1xuICAgIC8vcmFuZ2VsZW5ndGhcbiAgICAqL1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG4vLyBleHBvcnQgY29uc3QgdmFsaWRhdGlvblJlZHVjZXIgPSBncm91cCA9PiAoYWNjLCB2YWxpZGF0b3IpID0+IHtcbi8vICAgICBpZihtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyAmJiB2YWxpZGF0b3IucGFyYW1zLmxlbmd0aCA+IDAgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCkpIHJldHVybiBhY2M7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuLy8gICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY2MuZXJyb3JNZXNzYWdlcyBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gWy4uLmFjYy5lcnJvck1lc3NhZ2VzLCBleHRyYWN0RXJyb3JNZXNzYWdlKHZhbGlkYXRvciwgZ3JvdXApXSBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDogW2V4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldXG4vLyAgICAgfTs7XG4vLyB9O1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMgJiYgdmFsaWRhdG9yLnBhcmFtcy5sZW5ndGggPiAwID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFhY2NbaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyldKSB7XG4gICAgICAgIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSB7XG4gICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0uZmllbGRzLnB1c2goaW5wdXQpO1xuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9ICh2YWxpZGF0b3IsIGdyb3VwKSA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKSBcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07Il19
