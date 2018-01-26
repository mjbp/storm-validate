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
		var _this2 = this;

		//manage remote/async validators in reducer
		//return promise??
		//eagerly evaluate then update??

		//if one of the validators is asynchronous,
		//easerly set validity state to false if any of the synchronous validators are false
		//if all others pass,
		//set pending state whilst async validator resolves??

		//return promise from this fn everytime??
		/*
  	return new Promise((resolve, reject) => {
  	let s = document.createElement('script');
  	s.src = url;
  	s.async = async;
  	s.onload = s.onreadystatechange = function() {
  		if (!this.readyState || this.readyState === 'complete') resolve();
  	};
  	s.onerror = s.onabort = reject;
  	document.head.appendChild(s);
  });
  */
		return new Promise(function (resolve, reject) {
			_this2.groups[group] = Object.assign({}, _this2.groups[group], { valid: true, errorMessages: [] }, //reset validity and errorMessages
			_this2.groups[group].validators.reduce((0, _validators.validationReducer)(_this2.groups[group]), true));

			return resolve(_this2.groups[group].valid);
		});
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
    stringlength: ['length-max'],
    range: ['range-min', 'range-max'],
    // min: ['min'],?
    // max:  ['max'],?
    minlength: ['minlength-min'],
    maxlength: ['maxlength-max'],
    regex: ['regex-pattern'],
    equalTo: ['equalto-other'],
    remote: ['remote-url', 'remote-type', 'remote-additionalfields'] //??
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
    }),
    remote: function remote(group, params) {
        var _params = _slicedToArray(params, 2),
            url = _params[0],
            type = _params[1];

        fetch(url, {
            method: type.toUpperCase(),
            // body: JSON.stringify(data), 
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            console.log(data);
            return true;
        });

        //async so are we returning pending state...
        // return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBQ0g7QUFGRCxBQUFnQyxDQUFBOztBQUloQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEOzs7Ozs7Ozs7O0FDTmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0FBQ0E7S0FBRyxPQUFBLEFBQU8sY0FBUCxBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFlBQVksVUFBQSxBQUFVLGFBQXBFLEFBQWlGLFFBQVEsTUFBTSxDQUEvRixBQUF5RixBQUFNLEFBQUMsZ0JBQzNGLE1BQU0sR0FBQSxBQUFHLE1BQUgs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LEFBQ1Y7QUFYTTs7QUFhQSxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLFdBQUQsQUFBWSxPQUFaO1dBQXNCLFVBQUEsQUFBVSxXQUFXLG1CQUFTLFVBQVQsQUFBbUIsTUFBTSxVQUFBLEFBQVUsV0FBVixBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFNBQS9HLEFBQTJDLEFBQTZFO0FBQXBKOztBQUVBLElBQU0sZ0VBQTRCLFNBQTVCLEFBQTRCLGtDQUFVLEFBQy9DO1FBQUksbUJBQUosQUFBdUIsQUFFdkI7O1NBQUksSUFBSixBQUFRLFNBQVIsQUFBaUIsUUFDYjtZQUFHLE9BQUEsQUFBTyxPQUFQLEFBQWMsV0FBZCxBQUF5QixTQUE1QixBQUFxQyxHQUNqQyxpQkFBQSxBQUFpQixTQUFTLE9BRmxDLEFBRVEsQUFBMEIsQUFBTztBQUV6QyxZQUFBLEFBQU8sQUFDVjtBQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIC8vIFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdC8vYXNzdW1lIGl0J3MgYSBkb20gbm9kZVxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcbiAgICBcblx0cmV0dXJuIGVscy5yZWR1Y2UoKGFjYywgZWwpID0+IHtcblx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdGFjYy5wdXNoKE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRmb3JtOiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCkpO1xuXHRcdHJldHVybiBhY2M7XG5cdH0sIFtdKTtcbn07XG5cbi8vQXV0by1pbml0aWFsaXNlXG57IFxuXHRbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKSlcblx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsIi8vIGltcG9ydCBpbnB1dFByb3RvdHlwZSBmcm9tICcuL2lucHV0LXByb3RvdHlwZSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBcblx0dmFsaWRhdGlvblJlZHVjZXIsXG5cdGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLFxuXHRub3JtYWxpc2VWYWxpZGF0b3JzLFxuXHRyZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzXG59IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBoLCBjcmVhdGVFcnJvclRleHROb2RlIH0gZnJvbSAnLi91dGlscy9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0Ly9wcmV2ZW50IGJyb3dzZXIgdmFsaWRhdGlvblxuXHRcdHRoaXMuZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdHRoaXMuZ3JvdXBzID0gcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyhbXS5zbGljZS5jYWxsKHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSkucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXG5cdFx0Y29uc29sZS5sb2codGhpcy5ncm91cHMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRpbml0TGlzdGVuZXJzKCl7XG5cdFx0dGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5jbGVhckVycm9ycygpO1xuXHRcdFx0aWYodGhpcy5zZXRWYWxpZGl0eVN0YXRlKCkpIHRoaXMuZm9ybS5zdWJtaXQoKTtcblx0XHRcdGVsc2UgdGhpcy5yZW5kZXJFcnJvcnMoKSwgdGhpcy5pbml0UmVhbFRpbWVWYWxpZGF0aW9uKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBlID0+IHsgdGhpcy5jbGVhckVycm9ycygpOyB9KTtcblx0fSxcblx0aW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpe1xuXHRcdGxldCBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRsZXQgZ3JvdXAgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblx0XHRcdFx0aWYodGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSB0aGlzLnJlbW92ZUVycm9yKGdyb3VwKTtcblx0XHRcdFx0aWYoIXRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKSkgdGhpcy5yZW5kZXJFcnJvcihncm91cCk7XG5cdFx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChpbnB1dCA9PiB7XG5cdFx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoY2hvb3NlUmVhbFRpbWVFdmVudChpbnB1dCksIGhhbmRsZXIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHRzZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXApe1xuXHRcdC8vbWFuYWdlIHJlbW90ZS9hc3luYyB2YWxpZGF0b3JzIGluIHJlZHVjZXJcblx0XHQvL3JldHVybiBwcm9taXNlPz9cblx0XHQvL2VhZ2VybHkgZXZhbHVhdGUgdGhlbiB1cGRhdGU/P1xuXG5cdFx0Ly9pZiBvbmUgb2YgdGhlIHZhbGlkYXRvcnMgaXMgYXN5bmNocm9ub3VzLFxuXHRcdC8vZWFzZXJseSBzZXQgdmFsaWRpdHkgc3RhdGUgdG8gZmFsc2UgaWYgYW55IG9mIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFyZSBmYWxzZVxuXHRcdC8vaWYgYWxsIG90aGVycyBwYXNzLFxuXHRcdC8vc2V0IHBlbmRpbmcgc3RhdGUgd2hpbHN0IGFzeW5jIHZhbGlkYXRvciByZXNvbHZlcz8/XG5cblx0XHQvL3JldHVybiBwcm9taXNlIGZyb20gdGhpcyBmbiBldmVyeXRpbWU/P1xuXHRcdC8qXG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0bGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdHMuc3JjID0gdXJsO1xuXHRcdFx0cy5hc3luYyA9IGFzeW5jO1xuXHRcdFx0cy5vbmxvYWQgPSBzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIXRoaXMucmVhZHlTdGF0ZSB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHJlc29sdmUoKTtcblx0XHRcdH07XG5cdFx0XHRzLm9uZXJyb3IgPSBzLm9uYWJvcnQgPSByZWplY3Q7XG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHMpO1xuXHRcdH0pO1xuXHRcdCovXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuZ3JvdXBzW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLFxuXHRcdFx0XHRcdFx0XHRcdFx0eyB2YWxpZDogdHJ1ZSwgZXJyb3JNZXNzYWdlczogW10gfSwgLy9yZXNldCB2YWxpZGl0eSBhbmQgZXJyb3JNZXNzYWdlc1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMucmVkdWNlKHZhbGlkYXRpb25SZWR1Y2VyKHRoaXMuZ3JvdXBzW2dyb3VwXSksIHRydWUpKTtcblxuXHRcdFx0cmV0dXJuIHJlc29sdmUodGhpcy5ncm91cHNbZ3JvdXBdLnZhbGlkKTtcblx0XHR9KTtcblxuXG5cdFx0XG5cdH0sXG5cdHNldFZhbGlkaXR5U3RhdGUoKXtcblx0XHRsZXQgbnVtRXJyb3JzID0gMDtcblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdHRoaXMuc2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3VwKTtcblx0XHRcdCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQgJiYgKytudW1FcnJvcnM7XG5cdFx0fVxuXHRcdHJldHVybiBudW1FcnJvcnMgPT09IDA7XG5cdH0sXG5cdGNsZWFyRXJyb3JzKCl7XG5cdFx0Zm9yKGxldCBncm91cCBpbiB0aGlzLmdyb3Vwcyl7XG5cdFx0XHRpZih0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JET00pIHRoaXMucmVtb3ZlRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVtb3ZlRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSAmJiB0aGlzLmdyb3Vwc1tncm91cF0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG5cdFx0dGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7Ly9vciBzaG91bGQgaSBzZXQgdGhpcyB0byBmYWxzZSBpZiBmaWVsZCBwYXNzZXMgdmFsaWRhdGlvbj9cblx0XHRkZWxldGUgdGhpcy5ncm91cHNbZ3JvdXBdLmVycm9yRE9NO1xuXHR9LFxuXHRyZW5kZXJFcnJvcnMoKXtcblx0XHQvL3N1cHBvcnQgZm9yIGlubGluZSBhbmQgZXJyb3IgbGlzdD9cblx0XHRmb3IobGV0IGdyb3VwIGluIHRoaXMuZ3JvdXBzKXtcblx0XHRcdGlmKCF0aGlzLmdyb3Vwc1tncm91cF0udmFsaWQpIHRoaXMucmVuZGVyRXJyb3IoZ3JvdXApO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyRXJyb3IoZ3JvdXApe1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5lcnJvckRPTSA9IFxuXHRcdFx0dGhpcy5ncm91cHNbZ3JvdXBdLnNlcnZlckVycm9yTm9kZSA/IFxuXHRcdFx0XHRjcmVhdGVFcnJvclRleHROb2RlKHRoaXMuZ3JvdXBzW2dyb3VwXSkgOiBcblx0XHRcdFx0XHR0aGlzLmdyb3Vwc1tncm91cF1cblx0XHRcdFx0XHRcdC5maWVsZHNbdGhpcy5ncm91cHNbZ3JvdXBdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogJ2Vycm9yJyB9LCB0aGlzLmdyb3Vwc1tncm91cF0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHRoaXMuZ3JvdXBzW2dyb3VwXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG5cdH0sXG5cdGFkZE1ldGhvZChuYW1lLCBmbiwgbWVzc2FnZSl7XG5cdFx0dGhpcy5ncm91cHMudmFsaWRhdG9ycy5wdXNoKGZuKTtcblx0XHQvL2V4dGVuZCBtZXNzYWdlc1xuXHR9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge307XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFID0gJ2RhdGEtdmFsbXNnLWZvcic7XG5cbi8qIENhbiB0aGVzZSB0d28gYmUgZm9sZGVkIGludG8gdGhlIHNhbWUgdmFyaWFibGU/ICovXG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbWluJywgJ21heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbFRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtdHlwZScsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcyddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAvLydyZWdleCcsIC0+IHNhbWUgYXMgcGF0dGVybiwgaG93IGlzIGl0IGFwcGxpZWQgdG8gYW4gZWxlbWVudD8gcGF0dGVybiBhdHRyaWJ1dGU/IGRhdGEtdmFsLXJlZ2V4P1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ3N0cmluZ2xlbmd0aCcsXG4gICAgLy8gJ2RhdGUnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJyxcbiAgICAvLyAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRlcnJvcnNJbmxpbmU6IHRydWUsXG5cdGVycm9yU3VtbWFyeTogZmFsc2Vcblx0Ly8gY2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgLy9yYW5nZWxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGJldHdlZW4gJHtwcm9wcy5taW59IGFuZCAke3Byb3BzLm1heH0gY2hhcmFjdGVycyBsb25nLmA7IH0sXG4gICAgLy9yYW5nZShwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiAke3Byb3BzLm1pbn0gYW5kICR7cHJvcHMubWF4fS5gOyB9LFxuICAgIC8vcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9LFxuICAgIC8vc3RlcChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgJHtwcm9wc30uYDsgfVxufTsiLCJpbXBvcnQgeyBpc1NlbGVjdCwgaXNDaGVja2FibGUsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09IGZhbHNlO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gZmFsc2UsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJywgXG4gICAgICAgIHBhcmFtID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW0sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsIFxuICAgICAgICBwYXJhbSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbSA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtLCBhY2MpXG4gICAgKSxcbiAgICBwYXR0ZXJuOiBjdXJyeVBhcmFtTWV0aG9kKCdwYXR0ZXJuJywgKC4uLnJlZ2V4U3RyKSA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChyZWdleFN0cikudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIHJlZ2V4OiBjdXJyeVBhcmFtTWV0aG9kKCdyZWdleCcsICguLi5yZWdleFN0cikgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocmVnZXhTdHIpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICBtaW46IGN1cnJ5UGFyYW1NZXRob2QoJ21pbicsICguLi5taW4pID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICttaW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgKC4uLm1heCkgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK21heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zWzBdICYmIChwYXJhbXNbMV0gPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXNbMV0pKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zWzBdICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zWzFdKSwgYWNjKSksXG4gICAgcmVtb3RlOiAoZ3JvdXAsIHBhcmFtcykgPT4ge1xuICAgICAgICBsZXQgWyB1cmwsIHR5cGVdID0gcGFyYW1zO1xuICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogdHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgLy8gYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksIFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vYXN5bmMgc28gYXJlIHdlIHJldHVybmluZyBwZW5kaW5nIHN0YXRlLi4uXG4gICAgICAgIC8vIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvLyByYW5nZWxlbmd0aFxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2VsZW5ndGgtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQyMFxuXG5cbiAgICAvLyByYW5nZVxuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuICAgIC8vIFxuICAgIC8vIHN0ZXBcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnktdmFsaWRhdGlvbi9qcXVlcnktdmFsaWRhdGlvbi9ibG9iL21hc3Rlci9zcmMvY29yZS5qcyNMMTQ0MVxuXG4gICAgLy8gZXF1YWxUb1xuICAgIC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZXF1YWxUby1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDc5XG5cbiAgICAvLyByZW1vdGVcbiAgICAvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlbW90ZS1tZXRob2QvXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS12YWxpZGF0aW9uL2pxdWVyeS12YWxpZGF0aW9uL2Jsb2IvbWFzdGVyL3NyYy9jb3JlLmpzI0wxNDkyXG4gICAgLy8gZGF0YS12YWwtcmVtb3RlPVwiJmFtcDsjMzk7VXNlck5hbWUmYW1wOyMzOTsgaXMgaW52YWxpZC5cIiBkYXRhLXZhbC1yZW1vdGUtYWRkaXRpb25hbGZpZWxkcz1cIiouVXNlck5hbWVcIiBkYXRhLXZhbC1yZW1vdGUtdXJsPVwiL1ZhbGlkYXRpb24vSXNVSURfQXZhaWxhYmxlXCJcblxuICAgIC8vIHJlZ2V4XG4gICAgLy8gZGF0YS12YWwtcmVnZXg9XCJXaGl0ZSBzcGFjZSBpcyBub3QgYWxsb3dlZC5cIiBcbiAgICAvLyBkYXRhLXZhbC1yZWdleC1wYXR0ZXJuPVwiKFxcUykrXCIgXG5cblxuXG4gICAgLyogXG4gICAgRXh0ZW5zaW9uc1xuICAgICAgICAtIHBhc3N3b3JkXG4gICAgICAgIC0gbm9uYWxwaGFtaW4gL1xcVy9nXG4gICAgICAgIC0gcmVnZXgvcGF0dGVyblxuICAgICAgICAtIGJvb2xcbiAgICAgICAgLSBmaWxlZXh0ZW5zaW9uc1xuICAgICovXG59OyIsImV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGdyb3VwLmVycm9yTWVzc2FnZXNbMF0pO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgIHJldHVybiBncm91cC5zZXJ2ZXJFcnJvck5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG59OyIsIiBleHBvcnQgY29uc3QgaXNTZWxlY3QgPSBmaWVsZCA9PiBmaWVsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JztcblxuZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSldO1xuXG5cbi8vIGNvbnN0IGNvbXBvc2VyID0gKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpO1xuLy8gZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKGNvbXBvc2VyKTtcbi8vIGV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZVJpZ2h0KGNvbXBvc2VyKTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKSk7XG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGNvbXBvc2UuYXBwbHkoY29tcG9zZSwgZm5zLnJldmVyc2UoKSk7IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vU29ycnkuLi5cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SU1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKCh2YWxpZGF0b3JzLCBhZGFwdG9yKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9ycyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWy4uLnZhbGlkYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9UTkVUX1BBUkFNU1thZGFwdG9yXSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGFjYy5wdXNoKGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKTtcblxuLy9mb3IgZGF0YS1ydWxlLSogc3VwcG9ydFxuLy9jb25zdCBoYXNEYXRhQXR0cmlidXRlUGFydCA9IChub2RlLCBwYXJ0KSA9PiBbXS5zbGljZS5jYWxsKG5vZGUuZGF0YXNldCkuZmlsdGVyKGF0dHJpYnV0ZSA9PiAhIX5hdHRyaWJ1dGUuaW5kZXhPZihwYXJ0KSkubGVuZ3RoID4gMDtcblxuY29uc3QgZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiB7XG4gICAgbGV0IHZhbGlkYXRvcnMgPSBbXTtcbiAgICBpZihpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdyZXF1aXJlZCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnZW1haWwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICd1cmwnfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdudW1iZXInfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgdmFsaWRhdG9ycy5wdXNoKHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKV19KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ21pbicsIHBhcmFtczogW2lucHV0LmdldEF0dHJpYnV0ZSgnbWluJyldfSk7XG4gICAgaWYoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdtYXgnLCBwYXJhbXM6IFtpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpXX0pO1xuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiBbaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyldfSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIFxuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnKSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KSk7XG4gICAgZWxzZSB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQoZXh0cmFjdEF0dHJpYnV0ZVZhbGlkYXRvcnMoaW5wdXQpKTtcbiAgICAvKlxuICAgIC8vZGF0ZVxuICAgIC8vZGF0ZUlTT1xuICAgIC8vbWluXG4gICAgLy9tYXhcbiAgICAvL3N0ZXBcblxuICAgIC8vZXF1YWxUb1xuICAgICAgICBhZGFwdGVycy5hZGQoXCJlcXVhbHRvXCIsIFtcIm90aGVyXCJdLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGdldE1vZGVsUHJlZml4KG9wdGlvbnMuZWxlbWVudC5uYW1lKSxcbiAgICAgICAgICAgICAgICBvdGhlciA9IG9wdGlvbnMucGFyYW1zLm90aGVyLFxuICAgICAgICAgICAgICAgIGZ1bGxPdGhlck5hbWUgPSBhcHBlbmRNb2RlbFByZWZpeChvdGhlciwgcHJlZml4KSxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gJChvcHRpb25zLmZvcm0pLmZpbmQoXCI6aW5wdXRcIikuZmlsdGVyKFwiW25hbWU9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUoZnVsbE90aGVyTmFtZSkgKyBcIiddXCIpWzBdO1xuXG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwiZXF1YWxUb1wiLCBlbGVtZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAvL3JlbW90ZVxuICAgIC8vZGlnaXRzXG4gICAgLy9yYW5nZWxlbmd0aFxuICAgICovXG5cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbn07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0aW9uUmVkdWNlciA9IGdyb3VwID0+IChhY2MsIHZhbGlkYXRvcikgPT4ge1xuICAgIGlmKG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zICYmIHZhbGlkYXRvci5wYXJhbXMubGVuZ3RoID4gMCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKSkgcmV0dXJuIGFjYztcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZXM6IGFjYy5lcnJvck1lc3NhZ2VzIFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbLi4uYWNjLmVycm9yTWVzc2FnZXMsIGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCldIFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV1cbiAgICB9Oztcbn07XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWFjY1tpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0pIHtcbiAgICAgICAgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IHtcbiAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgYWNjW2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpXS5maWVsZHMucHVzaChpbnB1dCk7XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gKHZhbGlkYXRvciwgZ3JvdXApID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpIFxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTsiXX0=
