(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    var validator = _component2.default.init('form');

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

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

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
		acc[el] = Object.assign(Object.create((0, _lib2.default)(el, Object.assign({}, _defaults2.default, opts))));
		return el.setAttribute('novalidate', 'novalidate'), acc;
	}, {}));
};

//Auto-initialise
{
	[].slice.call(document.querySelectorAll('form')).forEach(function (form) {
		form.querySelector('[data-val=true]') && init(form);
	});
}

exports.default = { init: init };

},{"./lib":6,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ACTIONS$SET_INITIAL_;

var _constants = require('../constants');

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

exports.default = (_ACTIONS$SET_INITIAL_ = {}, _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.SET_INITIAL_STATE, function (data) {
    return {
        type: _constants.ACTIONS.SET_INITIAL_STATE,
        data: data
    };
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.START_VALIDATION, function (data) {
    return {
        type: _constants.ACTIONS.START_VALIDATION
    };
}), _ACTIONS$SET_INITIAL_);

},{"../constants":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var SELECTOR = exports.SELECTOR = {};

var DATA_ATTRIBUTES = exports.DATA_ATTRIBUTES = {};

var TRIGGER_EVENTS = exports.TRIGGER_EVENTS = ['click', 'keydown'];

var KEY_CODES = exports.KEY_CODES = {
    ENTER: 13
};

var ACTIONS = exports.ACTIONS = {
    SET_INITIAL_STATE: 'SET_INITIAL_STATE',
    START_VALIDATION: 'START_VALIDATION'
};

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

var DOTNET_CLASSNAMES = exports.DOTNET_CLASSNAMES = {
    VALID: 'field-validation-valid',
    ERROR: 'field-validation-error'
};

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

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _validators = require('./utils/validators');

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
// import { TRIGGER_EVENTS, KEY_CODES, DATA_ATTRIBUTES } from  './constants';


// import { clear, render } from './manage-errors';

var validate = function validate() {};

var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({ type: type, method: method, message: message });
};

exports.default = function (form, settings) {
    _store2.default.dispatch(_actions2.default.SET_INITIAL_STATE((0, _validators.getInitialState)(form)));

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        //pass subscribed side-effects in action..?
        _store2.default.dispatch(_actions2.default.START_VALIDATION(), ['clearErrors']);

        //dispatch valdate
        (0, _validators.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
            var _ref;

            console.log((_ref = []).concat.apply(_ref, _toConsumableArray(validityState)));
            // Store.dispatch(ACTIONS.START_VALIDATION(), ['clearErrors']);
            //submit
            // if(![].concat(...res).includes(false)) form.submit();
            // else {
            //     //dispatch errors
            //     render(state.group);
            //     //dispatch init real-time validation

            //     // initRealTimeValidation();
            // }
        });
    });

    // form.addEventListener('reset', clear);

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./actions":3,"./store":11,"./utils/validators":13}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./constants":4,"./utils":12}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionHandlers;

var _constants = require('../constants');

var _utils = require('../utils');

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

var actionHandlers = (_actionHandlers = {}, _defineProperty(_actionHandlers, _constants.ACTIONS.SET_INITIAL_STATE, function (state, action) {
    return Object.assign({}, state, action.data);
}), _defineProperty(_actionHandlers, _constants.ACTIONS.START_VALIDATION, function (state) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], {
                errorDOM: false,
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    });
}), _actionHandlers);
exports.default = (0, _utils.createReducer)({}, actionHandlers);

},{"../constants":4,"../utils":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var clearErrors = function clearErrors(state) {
    for (var group in state.groups) {
        if (state.groups[group].errorDOM) removeError(group);
    }
};
var removeError = function removeError(group) {
    group.errorDOM.parentNode.removeChild(group.errorDOM);
    if (group.serverErrorNode) {
        group.serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        group.serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    group.fields.forEach(function (field) {
        field.removeAttribute('aria-invalid');
    }); //or should i set this to false if field passes validation?
    delete group.errorDOM; //??
};

exports.default = { clearErrors: clearErrors };

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _renderer = require('../renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

var state = {};

window.STATE_HISTORY = [];

var getState = function getState() {
    return state;
};

var dispatch = function dispatch(action, renderers) {
    state = action ? (0, _reducers2.default)(state, action) : state;
    // window.STATE_HISTORY.push({[action.type]: state});
    console.log(_defineProperty({}, action.type, state));
    if (!renderers) return;
    renderers.forEach(function (renderer) {
        _renderer2.default[renderer] ? _renderer2.default[renderer](state) : renderer(state);
    });
};

exports.default = {
    dispatch: dispatch,
    getState: getState
};

},{"../reducers":9,"../renderer":10}],12:[function(require,module,exports){
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

var createReducer = exports.createReducer = function createReducer(initialState, actionHandlers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments[1];

        if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action);else return state;
    };
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getValidityState = exports.getInitialState = exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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

var getInitialState = exports.getInitialState = function getInitialState(form) {
    return {
        groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}))
    };
};

var getValidityState = exports.getValidityState = function getValidityState(groups) {
    return Promise.all(Object.keys(groups).map(function (group) {
        return _defineProperty({}, group, getGroupValidityState(groups[group]));
    }));
};

var getGroupValidityState = function getGroupValidityState(group) {
    var hasError = false;
    return Promise.all(group.validators.map(function (validator) {
        return new Promise(function (resolve) {
            /*
                @return 
                     {
                        valid: bool,
                        errorMessages: []//just first?
                    }
            */
            if (validator.type !== 'remote') {
                if (validate(group, validator)) resolve({ valid: true });else {
                    hasError = true;
                    resolve({ valid: false, errorMessages: [extractErrorMessage(validator, group)] });
                }
            } else if (hasError) resolve({ valid: false });else validate(group, validator).then(function (res) {
                if (res && res === true) resolve({ valid: true });else resolve({
                    valid: false,
                    errorMessages: [typeof res === 'boolean' ? extractErrorMessage(validator, group) : 'Server error: ' + res] });
            });
            //to do?
            //only perform the remote validation if all else passes

            //refactor, extract this whole fn...
            // if(validator.type !== 'remote'){
            // 	if(validate(group, validator)) resolve(true);
            // 	else {
            // 		//mutation and side effect...
            // 		group.valid = false;
            // 		group.errorMessages.push(extractErrorMessage(validator, group));
            // 		resolve(false);
            // 	}
            // }
            // else validate(group, validator)
            // 		.then(res => {
            // 			if(res && res === true) resolve(true);								
            // 			else {
            // 				//mutation, side effect, and un-DRY...
            // 				group.valid = false;
            // 				group.errorMessages.push(typeof res === 'boolean' 
            // 														? extractErrorMessage(validator, group)
            // 														: `Server error: ${res}`);
            // 				resolve(false);
            // 			}
            // 		});
        });
    }));
};

},{"../constants":4,"../messages":7,"../methods":8,"./":12}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9hY3Rpb25zL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlbmRlcmVyL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3N0b3JlL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL3ZhbGlkYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7UUFBSSxZQUFZLG9CQUFBLEFBQVMsS0FBekIsQUFBZ0IsQUFBYyxBQUU5Qjs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBWkQsQUFBZ0MsQ0FBQTs7QUFjaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztB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QjtvQkFBRyxTQUFBLEFBQVMsT0FBWixBQUFHLEFBQWdCLFlBQVksUUFBUSxFQUFDLE9BQXhDLEFBQStCLEFBQVEsQUFBUSxhQUMxQyxBQUNEOytCQUFBLEFBQVcsQUFDWDs0QkFBUSxFQUFDLE9BQUQsQUFBUSxPQUFPLGVBQWUsQ0FBQyxvQkFBQSxBQUFvQixXQUEzRCxBQUFRLEFBQThCLEFBQUMsQUFBK0IsQUFDekU7QUFDSjtBQU5ELG1CQU9JLElBQUEsQUFBRyxVQUFVLFFBQVEsRUFBQyxPQUF0QixBQUFhLEFBQVEsQUFBUSx1QkFDeEIsQUFBUyxPQUFULEFBQWdCLFdBQWhCLEFBQ0ksS0FBSyxlQUFPLEFBQ1Q7b0JBQUcsT0FBTyxRQUFWLEFBQWtCLE1BQU0sUUFBUSxFQUFDLE9BQWpDLEFBQXdCLEFBQVEsQUFBUSxhQUNuQzsyQkFBUSxBQUNNLEFBQ1AsS0FGQyxBQUNEO21DQUNlLENBQUMsT0FBQSxBQUFPLFFBQVAsQUFBZSxZQUNiLG9CQUFBLEFBQW9CLFdBRHRCLEFBQ0UsQUFBK0IsNEJBSHhELEFBQVEsQUFFYyxBQUVvQixBQUNsRDtBQVJKLEFBU1QsYUFUUztBQVVyQjtBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVLO0FBbkRELEFBQU8sQUFvRFYsU0FwRFU7QUFEZCxBQUFPLEFBQVksQUFzRG5CLEtBdERtQixDQUFaO0FBRlIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgZmFjdG9yeSBmcm9tICcuL2xpYic7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG5cdFxuXHRpZihlbHMubGVuZ3RoID09PSAxICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyAmJiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXSlcblx0XHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL2F0dGFjaGVkIHRvIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1xuXHQvL3NvIHdlIGNhbiBib3RoIGluaXQsIGF1dG8taW5pdGlhbGlzZSBhbmQgcmVmZXIgYmFjayB0byBhbiBpbnN0YW5jZSBhdHRhY2hlZCB0byBhIGZvcm0gdG8gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdG9yc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gXG5cdFx0T2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdFx0YWNjW2VsXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShmYWN0b3J5KGVsLCBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cykpKSk7XG5cdFx0XHRyZXR1cm4gZWwuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKSwgYWNjO1xuXHRcdH0sIHt9KSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdFx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IEFDVElPTlMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEUsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5TVEFSVF9WQUxJREFUSU9OXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLlNUQVJUX1ZBTElEQVRJT05cbiAgICB9KSxcbiAgICBcbn07IiwiZXhwb3J0IGNvbnN0IFNFTEVDVE9SID0ge1xufTtcblxuZXhwb3J0IGNvbnN0IERBVEFfQVRUUklCVVRFUyA9IHtcbn07XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIEVOVEVSOiAxM1xufTtcblxuZXhwb3J0IGNvbnN0IEFDVElPTlMgPSB7XG4gICAgU0VUX0lOSVRJQUxfU1RBVEU6ICdTRVRfSU5JVElBTF9TVEFURScsXG4gICAgU1RBUlRfVkFMSURBVElPTjogJ1NUQVJUX1ZBTElEQVRJT04nXG59O1xuXG5leHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG5leHBvcnQgY29uc3QgRE9NX1NFTEVDVE9SX1BBUkFNUyA9IFsncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAnZXF1YWx0by1vdGhlciddO1xuXG4vKiBDYW4gdGhlc2UgdHdvIGJlIGZvbGRlZCBpbnRvIHRoZSBzYW1lIHZhcmlhYmxlPyAqL1xuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ2xlbmd0aC1taW4nLCAnbGVuZ3RoLW1heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbHRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdyZW1vdGUtdHlwZSddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAncmVxdWlyZWQnLFxuICAgICdzdHJpbmdsZW5ndGgnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAnbWlubGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJywvL3Nob3VsZCBiZSBsYXN0XG4gICAgLy8gJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0NMQVNTTkFNRVMgPSB7XG4gICAgVkFMSUQ6ICdmaWVsZC12YWxpZGF0aW9uLXZhbGlkJyxcbiAgICBFUlJPUjogJ2ZpZWxkLXZhbGlkYXRpb24tZXJyb3InXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImltcG9ydCBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucyc7XG4vLyBpbXBvcnQgeyBUUklHR0VSX0VWRU5UUywgS0VZX0NPREVTLCBEQVRBX0FUVFJJQlVURVMgfSBmcm9tICAnLi9jb25zdGFudHMnO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgZ2V0SW5pdGlhbFN0YXRlLCBnZXRWYWxpZGl0eVN0YXRlIH0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcblxuLy8gaW1wb3J0IHsgY2xlYXIsIHJlbmRlciB9IGZyb20gJy4vbWFuYWdlLWVycm9ycyc7XG5cbmNvbnN0IHZhbGlkYXRlID0gKCkgPT4ge307XG5cbmNvbnN0IGFkZE1ldGhvZCA9ICh0eXBlLCBncm91cE5hbWUsIG1ldGhvZCwgbWVzc2FnZSkgPT4ge1xuICAgIGlmKHR5cGUgPT09IHVuZGVmaW5lZCB8fCBncm91cE5hbWUgPT09IHVuZGVmaW5lZCB8fCBtZXRob2QgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHJldHVybiBjb25zb2xlLndhcm4oJ0N1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCBjYW5ub3QgYmUgYWRkZWQuJyk7XG4gICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWRhdG9ycy5wdXNoKHt0eXBlLCBtZXRob2QsIG1lc3NhZ2V9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IChmb3JtLCBzZXR0aW5ncykgPT4ge1xuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEUoZ2V0SW5pdGlhbFN0YXRlKGZvcm0pKSk7XG5cblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vcGFzcyBzdWJzY3JpYmVkIHNpZGUtZWZmZWN0cyBpbiBhY3Rpb24uLj9cbiAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5TVEFSVF9WQUxJREFUSU9OKCksIFsnY2xlYXJFcnJvcnMnXSk7XG5cbiAgICAgICAgLy9kaXNwYXRjaCB2YWxkYXRlXG4gICAgICAgIGdldFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAudGhlbih2YWxpZGl0eVN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbXS5jb25jYXQoLi4udmFsaWRpdHlTdGF0ZSkpO1xuICAgICAgICAgICAgICAgIC8vIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuU1RBUlRfVkFMSURBVElPTigpLCBbJ2NsZWFyRXJyb3JzJ10pO1xuICAgICAgICAgICAgICAgIC8vc3VibWl0XG4gICAgICAgICAgICAgICAgLy8gaWYoIVtdLmNvbmNhdCguLi5yZXMpLmluY2x1ZGVzKGZhbHNlKSkgZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy9kaXNwYXRjaCBlcnJvcnNcbiAgICAgICAgICAgICAgICAvLyAgICAgcmVuZGVyKHN0YXRlLmdyb3VwKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy9kaXNwYXRjaCBpbml0IHJlYWwtdGltZSB2YWxpZGF0aW9uXG5cbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gaW5pdFJlYWxUaW1lVmFsaWRhdGlvbigpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGNsZWFyKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkYXRlLFxuICAgICAgICBhZGRNZXRob2RcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfVxufTsiLCJpbXBvcnQgeyBmZXRjaCwgaXNSZXF1aXJlZCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwLCByZXNvbHZlR2V0UGFyYW1zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gJyc7XG5cbmNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gKGdyb3VwLCB0eXBlKSA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcztcblxuY29uc3QgY3VycnlSZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IGN1cnJ5UGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKGdyb3VwLCB0eXBlKSksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSAnJyxcbiAgICBlbWFpbDogY3VycnlSZWdleE1ldGhvZChFTUFJTF9SRUdFWCksXG4gICAgdXJsOiBjdXJyeVJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiBjdXJyeVJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IGN1cnJ5UmVnZXhNZXRob2QoTlVNQkVSX1JFR0VYKSxcbiAgICBkaWdpdHM6IGN1cnJ5UmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4IDogK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCwgYWNjKVxuICAgICksXG4gICAgZXF1YWx0bzogY3VycnlQYXJhbU1ldGhvZCgnZXF1YWx0bycsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjID0gcGFyYW1zLm90aGVyLnJlZHVjZSgoc3ViZ3JvdXBBY2MsIHN1Ymdyb3VwKSA9PiB7XG4gICAgICAgICAgICBpZihleHRyYWN0VmFsdWVGcm9tR3JvdXAoc3ViZ3JvdXApICE9PSBpbnB1dC52YWx1ZSkgc3ViZ3JvdXBBY2MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzdWJncm91cEFjYztcbiAgICAgICAgfSwgdHJ1ZSksIGFjYztcbiAgICB9KSxcbiAgICBwYXR0ZXJuOiBjdXJyeVBhcmFtTWV0aG9kKCdwYXR0ZXJuJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIHJlZ2V4OiBjdXJyeVBhcmFtTWV0aG9kKCdyZWdleCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICBtaW46IGN1cnJ5UGFyYW1NZXRob2QoJ21pbicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiwgYWNjKSksXG4gICAgbWF4OiBjdXJyeVBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgsIGFjYykpLFxuICAgIGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZCgnbGVuZ3RoJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gJiYgKHBhcmFtcy5tYXggPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4KSksIGFjYykpLFxuICAgIHJhbmdlOiBjdXJyeVBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4gJiYgK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4KSwgYWNjKSksXG4gICAgcmVtb3RlOiAoZ3JvdXAsIHBhcmFtcykgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmZXRjaCgocGFyYW1zLnR5cGUgIT09ICdnZXQnID8gcGFyYW1zLnVybCA6IGAke3BhcmFtcy51cmx9PyR7cmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyl9YCksIHtcbiAgICAgICAgICAgIG1ldGhvZDogcGFyYW1zLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgIGJvZHk6IHBhcmFtcy50eXBlID09PSAnZ2V0JyA/IG51bGwgOiByZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAuY2F0Y2gocmVzID0+IHsgcmVzb2x2ZShyZXMpOyB9KTtcbiAgICB9KVxufTsiLCJpbXBvcnQgeyBBQ1RJT05TLCBTRUxFQ1RPUiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjcmVhdGVSZWR1Y2VyIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBhY3Rpb25IYW5kbGVycyA9IHtcbiAgICBbQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURV06IChzdGF0ZSwgYWN0aW9uKSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgYWN0aW9uLmRhdGEpLFxuICAgIFtBQ1RJT05TLlNUQVJUX1ZBTElEQVRJT05dOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIHtcbiAgICAgICAgICAgICAgICBlcnJvckRPTTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pXG4gICAgfSlcbn07XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWR1Y2VyKHt9LCBhY3Rpb25IYW5kbGVycyk7IiwiY29uc3QgY2xlYXJFcnJvcnMgPSBzdGF0ZSA9PiB7XG4gICAgZm9yKGxldCBncm91cCBpbiBzdGF0ZS5ncm91cHMpe1xuICAgICAgICBpZihzdGF0ZS5ncm91cHNbZ3JvdXBdLmVycm9yRE9NKSByZW1vdmVFcnJvcihncm91cCk7XG4gICAgfVxufTtcbmNvbnN0IHJlbW92ZUVycm9yID0gZ3JvdXAgPT4ge1xuICAgIGdyb3VwLmVycm9yRE9NLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ3JvdXAuZXJyb3JET00pO1xuICAgIGlmKGdyb3VwLnNlcnZlckVycm9yTm9kZSkge1xuICAgICAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICB9XG4gICAgZ3JvdXAuZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTsvL29yIHNob3VsZCBpIHNldCB0aGlzIHRvIGZhbHNlIGlmIGZpZWxkIHBhc3NlcyB2YWxpZGF0aW9uP1xuICAgIGRlbGV0ZSBncm91cC5lcnJvckRPTTsvLz8/XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGNsZWFyRXJyb3JzIH0iLCJpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnO1xuaW1wb3J0IHJlbmRlciBmcm9tICcuLi9yZW5kZXJlcic7XG5cbmxldCBzdGF0ZSA9IHt9O1xuXG53aW5kb3cuU1RBVEVfSElTVE9SWSA9IFtdO1xuXG5jb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuXG5jb25zdCBkaXNwYXRjaCA9IGZ1bmN0aW9uKGFjdGlvbiwgcmVuZGVyZXJzKSB7XG4gICAgc3RhdGUgPSBhY3Rpb24gPyByZWR1Y2VycyhzdGF0ZSwgYWN0aW9uKSA6IHN0YXRlO1xuICAgIC8vIHdpbmRvdy5TVEFURV9ISVNUT1JZLnB1c2goe1thY3Rpb24udHlwZV06IHN0YXRlfSk7XG4gICAgY29uc29sZS5sb2coe1thY3Rpb24udHlwZV06IHN0YXRlfSk7XG4gICAgaWYoIXJlbmRlcmVycykgcmV0dXJuO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyID0+IHtcbiAgICAgICAgcmVuZGVyW3JlbmRlcmVyXSA/IHJlbmRlcltyZW5kZXJlcl0oc3RhdGUpIDogcmVuZGVyZXIoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGRpc3BhdGNoLFxuICAgIGdldFN0YXRlXG59OyIsImV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNDaGVja2FibGUgPSBmaWVsZCA9PiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZmllbGQudHlwZSk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpbGUgPSBmaWVsZCA9PiBmaWVsZC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2ZpbGUnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuZXhwb3J0IGNvbnN0IGdldE5hbWUgPSBncm91cCA9PiBncm91cC5maWVsZHNbMF0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlR2V0UGFyYW1zID0gbm9kZUFycmF5cyA9PiBub2RlQXJyYXlzLm1hcCgobm9kZXMpID0+IHtcbiAgICByZXR1cm4gYCR7bm9kZXNbMF0uZ2V0QXR0cmlidXRlKCduYW1lJyl9PSR7ZXh0cmFjdFZhbHVlRnJvbUdyb3VwKG5vZGVzKX1gO1xufSkuam9pbignJicpO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5oYXNPd25Qcm9wZXJ0eSgnZmllbGRzJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZ3JvdXAucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJylcblxuZXhwb3J0IGNvbnN0IGNob29zZVJlYWxUaW1lRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTtcblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuZXhwb3J0IGNvbnN0IGZldGNoID0gKHVybCwgcHJvcHMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKHByb3BzLm1ldGhvZCB8fCAnR0VUJywgdXJsKTtcbiAgICAgICAgaWYgKHByb3BzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHByb3BzLmhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHByb3BzLmhlYWRlcnNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgeGhyLnNlbmQocHJvcHMuYm9keSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlUmVkdWNlciA9IChpbml0aWFsU3RhdGUsIGFjdGlvbkhhbmRsZXJzKSA9PiAoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikgPT4ge1xuICAgIGlmIChhY3Rpb25IYW5kbGVycy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24udHlwZSkpIHJldHVybiBhY3Rpb25IYW5kbGVyc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbilcbiAgICBlbHNlIHJldHVybiBzdGF0ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSAobGlzdCwgaW5wdXQpID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRTZWxlY3RvciA9IGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGFwcGVuZE1vZGVsUHJlZml4KGl0ZW0sIGdldE1vZGVsUHJlZml4KGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7cmVzb2x2ZWRTZWxlY3Rvcn1dYCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbmNvbnN0IGVzY2FwZUF0dHJpYnV0ZVZhbHVlID0gdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgvKFshXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxcXFxcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIpO1xuXG5jb25zdCBnZXRNb2RlbFByZWZpeCA9IGZpZWxkTmFtZSA9PiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG5cbmNvbnN0IGFwcGVuZE1vZGVsUHJlZml4ID0gKHZhbHVlLCBwcmVmaXgpID0+IHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIiouXCIpID09PSAwKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIqLlwiLCBwcmVmaXgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbiIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IHBpcGUsIERPTU5vZGVzRnJvbUNvbW1hTGlzdCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSwgRE9NX1NFTEVDVE9SX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgaW5wdXQpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCk7XG4gICAgcmV0dXJuICh7W3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlLCBpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlIH0pXG59O1xuXG5jb25zdCBleHRyYWN0UGFyYW1zID0gKGlucHV0LCBhZGFwdG9yKSA9PiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHsgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdLnJlZHVjZSgoYWNjLCBwYXJhbSkgPT4gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApID8gT2JqZWN0LmFzc2lnbihhY2MsIHJlc29sdmVQYXJhbShwYXJhbSwgaW5wdXQpKSA6IGFjYywge30pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICBcbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG5jb25zdCBleHRyYWN0QXR0clZhbGlkYXRvcnMgPSBpbnB1dCA9PiBwaXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4oaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4vL3VuLURSWS4uLiBhbmQgdW5yZWFkYWJsZVxuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3JlcXVpcmVkJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IGVtYWlsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnZW1haWwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgdXJsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3VybCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBudW1iZXIgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbnVtYmVyJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbmxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbmxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4bGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW4nLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgcGF0dGVybiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyl9fV0gOiB2YWxpZGF0b3JzO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLm1ldGhvZCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvci5tZXRob2QoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSwgZ3JvdXAuZmllbGRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSAodmFsaWRhdG9yLCBncm91cCkgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbml0aWFsU3RhdGUgPSBmb3JtID0+ICh7XG4gICAgZ3JvdXBzOiByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKFtdLnNsaWNlLmNhbGwoZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKVxufSk7XG5cbmV4cG9ydCBjb25zdCBnZXRWYWxpZGl0eVN0YXRlID0gZ3JvdXBzID0+IFByb21pc2UuYWxsKFxuICAgIE9iamVjdC5rZXlzKGdyb3VwcylcbiAgICAgICAgLm1hcChncm91cCA9PiAoe1tncm91cF06IGdldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cHNbZ3JvdXBdKX0pKVxuKTtcblxuY29uc3QgZ2V0R3JvdXBWYWxpZGl0eVN0YXRlID0gZ3JvdXAgPT4ge1xuICAgIGxldCBoYXNFcnJvciA9IGZhbHNlO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXAudmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIEByZXR1cm4gXG4gICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiBib29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFtdLy9qdXN0IGZpcnN0P1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdG9yLnR5cGUgIT09ICdyZW1vdGUnKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUoe3ZhbGlkOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7dmFsaWQ6IGZhbHNlLCBlcnJvck1lc3NhZ2VzOiBbZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKV19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICAgICAgICAgaWYoaGFzRXJyb3IpIHJlc29sdmUoe3ZhbGlkOiBmYWxzZX0pIFxuICAgICAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzICYmIHJlcyA9PT0gdHJ1ZSkgcmVzb2x2ZSh7dmFsaWQ6IHRydWV9KTtcdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFt0eXBlb2YgcmVzID09PSAnYm9vbGVhbicgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYFNlcnZlciBlcnJvcjogJHtyZXN9YF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL3RvIGRvP1xuXHRcdFx0XHQvL29ubHkgcGVyZm9ybSB0aGUgcmVtb3RlIHZhbGlkYXRpb24gaWYgYWxsIGVsc2UgcGFzc2VzXG5cdFx0XHRcdFxuXHRcdFx0XHQvL3JlZmFjdG9yLCBleHRyYWN0IHRoaXMgd2hvbGUgZm4uLi5cblx0XHRcdFx0Ly8gaWYodmFsaWRhdG9yLnR5cGUgIT09ICdyZW1vdGUnKXtcblx0XHRcdFx0Ly8gXHRpZih2YWxpZGF0ZShncm91cCwgdmFsaWRhdG9yKSkgcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0Ly8gXHRlbHNlIHtcblx0XHRcdFx0Ly8gXHRcdC8vbXV0YXRpb24gYW5kIHNpZGUgZWZmZWN0Li4uXG5cdFx0XHRcdC8vIFx0XHRncm91cC52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHQvLyBcdFx0Z3JvdXAuZXJyb3JNZXNzYWdlcy5wdXNoKGV4dHJhY3RFcnJvck1lc3NhZ2UodmFsaWRhdG9yLCBncm91cCkpO1xuXHRcdFx0XHQvLyBcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9XG5cdFx0XHRcdC8vIGVsc2UgdmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcilcblx0XHRcdFx0Ly8gXHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdC8vIFx0XHRcdGlmKHJlcyAmJiByZXMgPT09IHRydWUpIHJlc29sdmUodHJ1ZSk7XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHQvLyBcdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gXHRcdFx0XHQvL211dGF0aW9uLCBzaWRlIGVmZmVjdCwgYW5kIHVuLURSWS4uLlxuXHRcdFx0XHQvLyBcdFx0XHRcdGdyb3VwLnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdC8vIFx0XHRcdFx0Z3JvdXAuZXJyb3JNZXNzYWdlcy5wdXNoKHR5cGVvZiByZXMgPT09ICdib29sZWFuJyBcblx0XHRcdFx0Ly8gXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD8gZXh0cmFjdEVycm9yTWVzc2FnZSh2YWxpZGF0b3IsIGdyb3VwKVxuXHRcdFx0XHQvLyBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBgU2VydmVyIGVycm9yOiAke3Jlc31gKTtcblx0XHRcdFx0Ly8gXHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0Ly8gXHRcdFx0fVxuXHRcdFx0XHQvLyBcdFx0fSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSkpO1xufSJdfQ==
