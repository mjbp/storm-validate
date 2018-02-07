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
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.CLEAR_ERRORS, function (data) {
    return {
        type: _constants.ACTIONS.CLEAR_ERRORS
    };
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.VALIDATION_ERRORS, function (data) {
    return {
        type: _constants.ACTIONS.VALIDATION_ERRORS,
        data: data
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
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    VALIDATION_ERRORS: 'VALIDATION_ERRORS'
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

var _dom = require('./utils/dom');

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
        //or add subscribe fn to store?
        _store2.default.dispatch(_actions2.default.CLEAR_ERRORS(), [_dom.clearErrors]);

        (0, _validators.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
            var _ref;

            //either have connected ValidtionContainer that dispatches updates to the store for group vaildation states
            //requires adding subscribe function... which we might need anyway...
            //or extract validity booleans and map onto validation groups in reducer?
            //let's try the second one for now...

            //no errors (all true, no false or error Strings), just submit
            if ((_ref = []).concat.apply(_ref, _toConsumableArray(validityState)).reduce(_validators.reduceGroupValidityState, true)) return form.submit();

            _store2.default.dispatch(_actions2.default.VALIDATION_ERRORS(Object.keys(_store2.default.getState().groups).reduce(function (acc, group, i) {
                //reeeeeeeefactor pls ;_;
                var groupValidityState = validityState[i].reduce(_validators.reduceGroupValidityState, true),
                    errorMessages = validityState[i].reduce(function (acc, validity, j) {
                    return validity === true ? acc : [].concat(_toConsumableArray(acc), [typeof validity === 'boolean' ? (0, _validators.extractErrorMessage)(_store2.default.getState().groups[group].validators[j]) : validity]);
                }, []);

                return acc[group] = {
                    valid: groupValidityState,
                    errorMessages: errorMessages
                }, acc;
            }, {})), [_dom.renderErrors]);

            // initRealTimeValidation();
        });
    });

    // form.addEventListener('reset', clear);

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./actions":3,"./store":10,"./utils/dom":11,"./utils/validators":13}],7:[function(require,module,exports){
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
                resolve('Server error: ' + res);
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
}), _defineProperty(_actionHandlers, _constants.ACTIONS.CLEAR_ERRORS, function (state) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    });
}), _defineProperty(_actionHandlers, _constants.ACTIONS.VALIDATION_ERRORS, function (state, action) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], action.data[group]);
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

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

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

// import render from '../renderer';

var state = {};

window.STATE_HISTORY = [];

var getState = function getState() {
    return state;
};

var dispatch = function dispatch(action, listeners) {
    state = action ? (0, _reducers2.default)(state, action) : state;
    // window.STATE_HISTORY.push({[action.type]: state});
    console.log(_defineProperty({}, action.type, state));
    if (!listeners) return;
    listeners.forEach(function (listener) {
        listener(state);
        // render[renderer] ? render[renderer](state) : renderer(state);
    });
};

exports.default = {
    dispatch: dispatch,

    getState: getState
};

},{"../reducers":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderError = exports.renderErrors = exports.clearErrors = exports.createErrorNode = exports.createErrorTextNode = exports.h = undefined;

var _constants = require('../constants');

//retain errorNodes in closure, not state
var errorNodes = {};

var h = exports.h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

var createErrorTextNode = exports.createErrorTextNode = function createErrorTextNode(group, msg) {
    var node = document.createTextNode(msg);

    group.serverErrorNode.classList.remove(_constants.DOTNET_CLASSNAMES.VALID);
    group.serverErrorNode.classList.add(_constants.DOTNET_CLASSNAMES.ERROR);

    return group.serverErrorNode.appendChild(node);
};

var createErrorNode = exports.createErrorNode = function createErrorNode(group, msg) {
    var node = group.fields[group.fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, msg));

    group.fields.forEach(function (field) {
        field.setAttribute('aria-invalid', 'true');
    });

    return node;
};

var clearError = function clearError(groupName, state) {
    errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
    if (state.groups[groupName].serverErrorNode) {
        state.groups[groupName].serverErrorNode.classList.remove(_constants.DOTNET_CLASSNAMES.ERROR);
        state.groups[groupName].serverErrorNode.classList.add(_constants.DOTNET_CLASSNAMES.VALID);
    }
    state.groups[groupName].fields.forEach(function (field) {
        field.removeAttribute('aria-invalid');
    });
    delete errorNodes[groupName];
};

var clearErrors = exports.clearErrors = function clearErrors(state) {
    Object.keys(errorNodes).forEach(function (name) {
        clearError(name, state);
    });
};

var renderErrors = exports.renderErrors = function renderErrors(state) {
    Object.keys(state.groups).forEach(function (groupName) {
        if (!state.groups[groupName].valid) renderError(groupName, state)();
    });
};

var renderError = exports.renderError = function renderError(groupName, state) {
    return function () {
        if (errorNodes[groupName]) clearError(groupName, state);

        errorNodes[groupName] = state.groups[groupName].serverErrorNode ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) : state.groups[groupName].fields[state.groups[groupName].fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));

        //set aria-invalid on invalid inputs
        state.groups[groupName].fields.forEach(function (field) {
            field.setAttribute('aria-invalid', 'true');
        });
    };
};

},{"../constants":4}],12:[function(require,module,exports){
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
exports.getValidityState = exports.reduceGroupValidityState = exports.getInitialState = exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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

var extractErrorMessage = exports.extractErrorMessage = function extractErrorMessage(validator) {
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

var reduceGroupValidityState = exports.reduceGroupValidityState = function reduceGroupValidityState(acc, curr) {
    if (curr !== true) acc = false;
    return acc;
};

var getValidityState = exports.getValidityState = function getValidityState(groups) {
    // let groupValidators = [];
    // for(let group in groups) groupValidators.push(getGroupValidityState(groups[group]));
    // return Promise.all(groupValidators);
    return Promise.all(Object.keys(groups).map(function (group) {
        return getGroupValidityState(groups[group]);
    }));
};

var getGroupValidityState = function getGroupValidityState(group) {
    var hasError = false;
    return Promise.all(group.validators.map(function (validator) {
        return new Promise(function (resolve) {
            if (validator.type !== 'remote') {
                if (validate(group, validator)) resolve(true);else {
                    hasError = true;
                    resolve(false);
                }
            } else if (hasError) resolve(false);else validate(group, validator).then(function (res) {
                resolve(res);
            });
        });
    }));
};

},{"../constants":4,"../messages":7,"../methods":8,"./":12}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9hY3Rpb25zL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3N0b3JlL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxvQkFBQSxBQUFTLEtBQXpCLEFBQWdCLEFBQWMsQUFFOUI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQVpELEFBQWdDLENBQUE7O0FBY2hDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7Ozs7Ozs7Ozs7QUNoQmxE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TyxDQURHO0FBSko7O0FBVVAsSUFBTSx3QkFBd0IsU0FBeEIsQUFBd0IsNkJBQVMsQUFDbkM7UUFBSSxXQUFKLEFBQWUsQUFDbEI7bUJBQU8sQUFBUSxVQUFJLEFBQU0sV0FBTixBQUFpQixJQUFJLHFCQUFhLEFBQzlDO21CQUFPLEFBQUksUUFBUSxtQkFBVyxBQUMxQjtnQkFBRyxVQUFBLEFBQVUsU0FBYixBQUFzQixVQUFTLEFBQzNCO29CQUFHLFNBQUEsQUFBUyxPQUFaLEFBQUcsQUFBZ0IsWUFBWSxRQUEvQixBQUErQixBQUFRLFdBQ2xDLEFBQ0Q7K0JBQUEsQUFBVyxBQUNYOzRCQUFBLEFBQVEsQUFDWDtBQUNKO0FBTkQsbUJBT0ksSUFBQSxBQUFHLFVBQVUsUUFBYixBQUFhLEFBQVEscUJBQ2hCLEFBQVMsT0FBVCxBQUFnQixXQUFoQixBQUNJLEtBQUssZUFBTyxBQUFFO3dCQUFBLEFBQVEsQUFBTTtBQURoQyxBQUdaLGFBSFk7QUFUYixBQUFPLEFBYVYsU0FiVTtBQURkLEFBQU8sQUFBWSxBQWVuQixLQWZtQixDQUFaO0FBRlIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgZmFjdG9yeSBmcm9tICcuL2xpYic7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG5cdFxuXHRpZihlbHMubGVuZ3RoID09PSAxICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyAmJiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXSlcblx0XHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL2F0dGFjaGVkIHRvIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1xuXHQvL3NvIHdlIGNhbiBib3RoIGluaXQsIGF1dG8taW5pdGlhbGlzZSBhbmQgcmVmZXIgYmFjayB0byBhbiBpbnN0YW5jZSBhdHRhY2hlZCB0byBhIGZvcm0gdG8gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdG9yc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gXG5cdFx0T2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdFx0YWNjW2VsXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShmYWN0b3J5KGVsLCBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cykpKSk7XG5cdFx0XHRyZXR1cm4gZWwuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKSwgYWNjO1xuXHRcdH0sIHt9KSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdFx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IEFDVElPTlMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEUsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuQ0xFQVJfRVJST1JTXG4gICAgfSksXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUlNdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuVkFMSURBVElPTl9FUlJPUlMsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBcbn07IiwiZXhwb3J0IGNvbnN0IFNFTEVDVE9SID0ge1xufTtcblxuZXhwb3J0IGNvbnN0IERBVEFfQVRUUklCVVRFUyA9IHtcbn07XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIEVOVEVSOiAxM1xufTtcblxuZXhwb3J0IGNvbnN0IEFDVElPTlMgPSB7XG4gICAgU0VUX0lOSVRJQUxfU1RBVEU6ICdTRVRfSU5JVElBTF9TVEFURScsXG4gICAgQ0xFQVJfRVJST1JTOiAnQ0xFQVJfRVJST1JTJyxcbiAgICBWQUxJREFUSU9OX0VSUk9SUzogJ1ZBTElEQVRJT05fRVJST1JTJ1xufTtcblxuZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9DTEFTU05BTUVTID0ge1xuICAgIFZBTElEOiAnZmllbGQtdmFsaWRhdGlvbi12YWxpZCcsXG4gICAgRVJST1I6ICdmaWVsZC12YWxpZGF0aW9uLWVycm9yJ1xufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJpbXBvcnQgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMnO1xuLy8gaW1wb3J0IHsgVFJJR0dFUl9FVkVOVFMsIEtFWV9DT0RFUywgREFUQV9BVFRSSUJVVEVTIH0gZnJvbSAgJy4vY29uc3RhbnRzJztcbmltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCB7IGdldEluaXRpYWxTdGF0ZSwgZ2V0VmFsaWRpdHlTdGF0ZSwgZXh0cmFjdEVycm9yTWVzc2FnZSwgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlIH0gZnJvbSAnLi91dGlscy92YWxpZGF0b3JzJztcbmltcG9ydCB7IGNsZWFyRXJyb3JzLCByZW5kZXJFcnJvcnMgfSAgZnJvbSAnLi91dGlscy9kb20nO1xuXG4vLyBpbXBvcnQgeyBjbGVhciwgcmVuZGVyIH0gZnJvbSAnLi9tYW5hZ2UtZXJyb3JzJztcblxuY29uc3QgdmFsaWRhdGUgPSAoKSA9PiB7fTtcblxuY29uc3QgYWRkTWV0aG9kID0gKHR5cGUsIGdyb3VwTmFtZSwgbWV0aG9kLCBtZXNzYWdlKSA9PiB7XG4gICAgaWYodHlwZSA9PT0gdW5kZWZpbmVkIHx8IGdyb3VwTmFtZSA9PT0gdW5kZWZpbmVkIHx8IG1ldGhvZCA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnNvbGUud2FybignQ3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIGNhbm5vdCBiZSBhZGRlZC4nKTtcbiAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLnB1c2goe3R5cGUsIG1ldGhvZCwgbWVzc2FnZX0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGZvcm0sIHNldHRpbmdzKSA9PiB7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURShnZXRJbml0aWFsU3RhdGUoZm9ybSkpKTtcblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vcGFzcyBzdWJzY3JpYmVkIHNpZGUtZWZmZWN0cyBpbiBhY3Rpb24uLj9cbiAgICAgICAgLy9vciBhZGQgc3Vic2NyaWJlIGZuIHRvIHN0b3JlP1xuICAgICAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SUygpLCBbY2xlYXJFcnJvcnNdKTtcblxuICAgICAgICBnZXRWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAgICAgLnRoZW4odmFsaWRpdHlTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgLy9laXRoZXIgaGF2ZSBjb25uZWN0ZWQgVmFsaWR0aW9uQ29udGFpbmVyIHRoYXQgZGlzcGF0Y2hlcyB1cGRhdGVzIHRvIHRoZSBzdG9yZSBmb3IgZ3JvdXAgdmFpbGRhdGlvbiBzdGF0ZXNcbiAgICAgICAgICAgICAgICAvL3JlcXVpcmVzIGFkZGluZyBzdWJzY3JpYmUgZnVuY3Rpb24uLi4gd2hpY2ggd2UgbWlnaHQgbmVlZCBhbnl3YXkuLi5cbiAgICAgICAgICAgICAgICAvL29yIGV4dHJhY3QgdmFsaWRpdHkgYm9vbGVhbnMgYW5kIG1hcCBvbnRvIHZhbGlkYXRpb24gZ3JvdXBzIGluIHJlZHVjZXI/XG4gICAgICAgICAgICAgICAgLy9sZXQncyB0cnkgdGhlIHNlY29uZCBvbmUgZm9yIG5vdy4uLlxuXG4gICAgICAgICAgICAgICAgLy9ubyBlcnJvcnMgKGFsbCB0cnVlLCBubyBmYWxzZSBvciBlcnJvciBTdHJpbmdzKSwganVzdCBzdWJtaXRcbiAgICAgICAgICAgICAgICBpZihbXS5jb25jYXQoLi4udmFsaWRpdHlTdGF0ZSkucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpIHJldHVybiBmb3JtLnN1Ym1pdCgpO1xuXG4gICAgICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SUyhcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIGdyb3VwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZWVlZWVlZWVmYWN0b3IgcGxzIDtfO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBncm91cFZhbGlkaXR5U3RhdGUgPSB2YWxpZGl0eVN0YXRlW2ldLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdmFsaWRpdHlTdGF0ZVtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgdmFsaWRpdHksIGopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkaXR5ID09PSB0cnVlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4uYWNjLCB0eXBlb2YgdmFsaWRpdHkgPT09ICdib29sZWFuJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RXJyb3JNZXNzYWdlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbGlkaXR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjW2dyb3VwXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGdyb3VwVmFsaWRpdHlTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogZXJyb3JNZXNzYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSksIFtyZW5kZXJFcnJvcnNdXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIGluaXRSZWFsVGltZVZhbGlkYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGNsZWFyKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkYXRlLFxuICAgICAgICBhZGRNZXRob2RcbiAgICB9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfVxufTsiLCJpbXBvcnQgeyBmZXRjaCwgaXNSZXF1aXJlZCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwLCByZXNvbHZlR2V0UGFyYW1zIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IGlzT3B0aW9uYWwgPSBncm91cCA9PiAhaXNSZXF1aXJlZChncm91cCkgJiYgZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSA9PT0gJyc7XG5cbmNvbnN0IGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zID0gKGdyb3VwLCB0eXBlKSA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09IHR5cGUpWzBdLnBhcmFtcztcblxuY29uc3QgY3VycnlSZWdleE1ldGhvZCA9IHJlZ2V4ID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IHJlZ2V4LnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpLCBmYWxzZSk7XG5cbmNvbnN0IGN1cnJ5UGFyYW1NZXRob2QgPSAodHlwZSwgcmVkdWNlcikgPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCkgfHwgZ3JvdXAuZmllbGRzLnJlZHVjZShyZWR1Y2VyKGV4dHJhY3RWYWxpZGF0aW9uUGFyYW1zKGdyb3VwLCB0eXBlKSksIGZhbHNlKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkOiBncm91cCA9PiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApICE9PSAnJyxcbiAgICBlbWFpbDogY3VycnlSZWdleE1ldGhvZChFTUFJTF9SRUdFWCksXG4gICAgdXJsOiBjdXJyeVJlZ2V4TWV0aG9kKFVSTF9SRUdFWCksXG4gICAgZGF0ZTogZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gIS9JbnZhbGlkfE5hTi8udGVzdChuZXcgRGF0ZShpbnB1dC52YWx1ZSkudG9TdHJpbmcoKSksIGFjYyksIGZhbHNlKSxcbiAgICBkYXRlSVNPOiBjdXJyeVJlZ2V4TWV0aG9kKERBVEVfSVNPX1JFR0VYKSxcbiAgICBudW1iZXI6IGN1cnJ5UmVnZXhNZXRob2QoTlVNQkVSX1JFR0VYKSxcbiAgICBkaWdpdHM6IGN1cnJ5UmVnZXhNZXRob2QoRElHSVRTX1JFR0VYKSxcbiAgICBtaW5sZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtaW5sZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4sIGFjYylcbiAgICApLFxuICAgIG1heGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21heGxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4IDogK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCwgYWNjKVxuICAgICksXG4gICAgZXF1YWx0bzogY3VycnlQYXJhbU1ldGhvZCgnZXF1YWx0bycsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjID0gcGFyYW1zLm90aGVyLnJlZHVjZSgoc3ViZ3JvdXBBY2MsIHN1Ymdyb3VwKSA9PiB7XG4gICAgICAgICAgICBpZihleHRyYWN0VmFsdWVGcm9tR3JvdXAoc3ViZ3JvdXApICE9PSBpbnB1dC52YWx1ZSkgc3ViZ3JvdXBBY2MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzdWJncm91cEFjYztcbiAgICAgICAgfSwgdHJ1ZSksIGFjYztcbiAgICB9KSxcbiAgICBwYXR0ZXJuOiBjdXJyeVBhcmFtTWV0aG9kKCdwYXR0ZXJuJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIHJlZ2V4OiBjdXJyeVBhcmFtTWV0aG9kKCdyZWdleCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICBtaW46IGN1cnJ5UGFyYW1NZXRob2QoJ21pbicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiwgYWNjKSksXG4gICAgbWF4OiBjdXJyeVBhcmFtTWV0aG9kKCdtYXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgsIGFjYykpLFxuICAgIGxlbmd0aDogY3VycnlQYXJhbU1ldGhvZCgnbGVuZ3RoJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gJiYgKHBhcmFtcy5tYXggPT09IHVuZGVmaW5lZCB8fCAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4KSksIGFjYykpLFxuICAgIHJhbmdlOiBjdXJyeVBhcmFtTWV0aG9kKCdyYW5nZScsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4gJiYgK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4KSwgYWNjKSksXG4gICAgcmVtb3RlOiAoZ3JvdXAsIHBhcmFtcykgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmZXRjaCgocGFyYW1zLnR5cGUgIT09ICdnZXQnID8gcGFyYW1zLnVybCA6IGAke3BhcmFtcy51cmx9PyR7cmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyl9YCksIHtcbiAgICAgICAgICAgIG1ldGhvZDogcGFyYW1zLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgICAgIGJvZHk6IHBhcmFtcy50eXBlID09PSAnZ2V0JyA/IG51bGwgOiByZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAuY2F0Y2gocmVzID0+IHsgcmVzb2x2ZShgU2VydmVyIGVycm9yOiAke3Jlc31gKTsgfSk7XG4gICAgfSlcbn07IiwiaW1wb3J0IHsgQUNUSU9OUywgU0VMRUNUT1IgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgY3JlYXRlUmVkdWNlciB9IGZyb20gJy4uL3V0aWxzJztcblxuY29uc3QgYWN0aW9uSGFuZGxlcnMgPSB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiAoc3RhdGUsIGFjdGlvbikgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIGFjdGlvbi5kYXRhKSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2dyb3VwXSwgYWN0aW9uLmRhdGFbZ3JvdXBdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWR1Y2VyKHt9LCBhY3Rpb25IYW5kbGVycyk7IiwiaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4uL3JlZHVjZXJzJztcbi8vIGltcG9ydCByZW5kZXIgZnJvbSAnLi4vcmVuZGVyZXInO1xuXG5sZXQgc3RhdGUgPSB7fTtcblxud2luZG93LlNUQVRFX0hJU1RPUlkgPSBbXTtcblxuY29uc3QgZ2V0U3RhdGUgPSAoKSA9PiBzdGF0ZTtcblxuY29uc3QgZGlzcGF0Y2ggPSBmdW5jdGlvbihhY3Rpb24sIGxpc3RlbmVycykge1xuICAgIHN0YXRlID0gYWN0aW9uID8gcmVkdWNlcnMoc3RhdGUsIGFjdGlvbikgOiBzdGF0ZTtcbiAgICAvLyB3aW5kb3cuU1RBVEVfSElTVE9SWS5wdXNoKHtbYWN0aW9uLnR5cGVdOiBzdGF0ZX0pO1xuICAgIGNvbnNvbGUubG9nKHtbYWN0aW9uLnR5cGVdOiBzdGF0ZX0pO1xuICAgIGlmKCFsaXN0ZW5lcnMpIHJldHVybjtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGxpc3RlbmVyKHN0YXRlKTtcbiAgICAgICAgLy8gcmVuZGVyW3JlbmRlcmVyXSA/IHJlbmRlcltyZW5kZXJlcl0oc3RhdGUpIDogcmVuZGVyZXIoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGRpc3BhdGNoLFxuICAgIFxuICAgIGdldFN0YXRlXG59OyIsImltcG9ydCB7IERPVE5FVF9DTEFTU05BTUVTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLy9yZXRhaW4gZXJyb3JOb2RlcyBpbiBjbG9zdXJlLCBub3Qgc3RhdGVcbmxldCBlcnJvck5vZGVzID0ge307XG5cbmV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IChncm91cCwgbXNnKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtc2cpO1xuXG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICBcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yTm9kZSA9IChncm91cCwgbXNnKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBncm91cC5maWVsZHNbZ3JvdXAuZmllbGRzLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IgfSwgbXNnKSk7XG5cbiAgICBncm91cC5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuY29uc3QgY2xlYXJFcnJvciA9IChncm91cE5hbWUsIHN0YXRlKSA9PiB7XG4gICAgZXJyb3JOb2Rlc1tncm91cE5hbWVdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXJyb3JOb2Rlc1tncm91cE5hbWVdKTtcbiAgICBpZihzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUpIHtcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IpO1xuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5WQUxJRCk7XG4gICAgfVxuICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7XG4gICAgZGVsZXRlIGVycm9yTm9kZXNbZ3JvdXBOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjbGVhckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBPYmplY3Qua2V5cyhlcnJvck5vZGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjbGVhckVycm9yKG5hbWUsIHN0YXRlKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJFcnJvcnMgPSBzdGF0ZSA9PiB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIGlmKCFzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkgcmVuZGVyRXJyb3IoZ3JvdXBOYW1lLCBzdGF0ZSkoKTtcbiAgICB9KVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckVycm9yID0gKGdyb3VwTmFtZSwgc3RhdGUpID0+ICgpID0+IHtcbiAgICBpZihlcnJvck5vZGVzW2dyb3VwTmFtZV0pIGNsZWFyRXJyb3IoZ3JvdXBOYW1lLCBzdGF0ZSk7XG4gICAgXG4gICAgZXJyb3JOb2Rlc1tncm91cE5hbWVdID0gXG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSA/IFxuXHRcdFx0XHRjcmVhdGVFcnJvclRleHROb2RlKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLCBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5lcnJvck1lc3NhZ2VzWzBdKSA6IFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXVxuXHRcdFx0XHRcdFx0LmZpZWxkc1tzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcdFx0XHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZ2V0TmFtZSA9IGdyb3VwID0+IGdyb3VwLmZpZWxkc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmV4cG9ydCBjb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmhhc093blByb3BlcnR5KCdmaWVsZHMnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBncm91cC5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuXG5leHBvcnQgY29uc3QgY2hvb3NlUmVhbFRpbWVFdmVudCA9IGlucHV0ID0+IFsnaW5wdXQnLCAnY2hhbmdlJ11bTnVtYmVyKGlzQ2hlY2thYmxlKGlucHV0KSB8fCBpc1NlbGVjdChpbnB1dCkgfHwgaXNGaWxlKGlucHV0KSldO1xuXG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGFjYywgZm4pID0+IGZuKGFjYykpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB4aHIuc2VuZChwcm9wcy5ib2R5KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWR1Y2VyID0gKGluaXRpYWxTdGF0ZSwgYWN0aW9uSGFuZGxlcnMpID0+IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgaWYgKGFjdGlvbkhhbmRsZXJzLmhhc093blByb3BlcnR5KGFjdGlvbi50eXBlKSkgcmV0dXJuIGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICAgIGVsc2UgcmV0dXJuIHN0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IChsaXN0LCBpbnB1dCkgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFNlbGVjdG9yID0gZXNjYXBlQXR0cmlidXRlVmFsdWUoYXBwZW5kTW9kZWxQcmVmaXgoaXRlbSwgZ2V0TW9kZWxQcmVmaXgoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtyZXNvbHZlZFNlbGVjdG9yfV1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuY29uc3QgZXNjYXBlQXR0cmlidXRlVmFsdWUgPSB2YWx1ZSA9PiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG5cbmNvbnN0IGdldE1vZGVsUHJlZml4ID0gZmllbGROYW1lID0+IGZpZWxkTmFtZS5zdWJzdHIoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcblxuY29uc3QgYXBwZW5kTW9kZWxQcmVmaXggPSAodmFsdWUsIHByZWZpeCkgPT4ge1xuICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgcGlwZSwgRE9NTm9kZXNGcm9tQ29tbWFMaXN0LCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgfSBmcm9tICcuLyc7XG5pbXBvcnQgeyBET1RORVRfQURBUFRPUlMsIERPVE5FVF9QQVJBTVMsIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLCBET01fU0VMRUNUT1JfUEFSQU1TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgcmVzb2x2ZVBhcmFtID0gKHBhcmFtLCBpbnB1dCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKTtcbiAgICByZXR1cm4gKHtbcGFyYW0uc3BsaXQoJy0nKVsxXV06ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBET01Ob2Rlc0Zyb21Db21tYUxpc3QodmFsdWUsIGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSlcbn07XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dCkpIDogYWNjLCB7fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIFxuY29uc3QgZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzID0gaW5wdXQgPT4gRE9UTkVUX0FEQVBUT1JTLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYWRhcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtcyhpbnB1dCwgYWRhcHRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWlubGVuZ3RoKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4bGVuZ3RoKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4KGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbi8vdW4tRFJZLi4uIGFuZCB1bnJlYWRhYmxlXG5jb25zdCByZXF1aXJlZCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncmVxdWlyZWQnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgZW1haWwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdlbWFpbCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCB1cmwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAndXJsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG51bWJlciA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdudW1iZXInfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWlubGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXhsZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbicsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4ID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4JywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBwYXR0ZXJuID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiB7IHJlZ2V4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKX19XSA6IHZhbGlkYXRvcnM7XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbCcpID09PSAndHJ1ZScgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyhpbnB1dCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IChncm91cCwgdmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IubWV0aG9kIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9yLm1ldGhvZChleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApLCBncm91cC5maWVsZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyk7XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgbGV0IG5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICByZXR1cm4gYWNjW25hbWVdID0gYWNjW25hbWVdID8gT2JqZWN0LmFzc2lnbihhY2NbbmFtZV0sIHsgZmllbGRzOiBbLi4uYWNjW25hbWVdLmZpZWxkcywgaW5wdXRdfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IHZhbGlkYXRvciA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKVxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxTdGF0ZSA9IGZvcm0gPT4gKHtcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdldFZhbGlkaXR5U3RhdGUgPSBncm91cHMgPT4ge1xuICAgIC8vIGxldCBncm91cFZhbGlkYXRvcnMgPSBbXTtcbiAgICAvLyBmb3IobGV0IGdyb3VwIGluIGdyb3VwcykgZ3JvdXBWYWxpZGF0b3JzLnB1c2goZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3Vwc1tncm91cF0pKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXBWYWxpZGF0b3JzKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwcylcbiAgICAgICAgICAgIC5tYXAoZ3JvdXAgPT4gZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3Vwc1tncm91cF0pKVxuICAgICAgICApO1xufTtcblxuY29uc3QgZ2V0R3JvdXBWYWxpZGl0eVN0YXRlID0gZ3JvdXAgPT4ge1xuICAgIGxldCBoYXNFcnJvciA9IGZhbHNlO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXAudmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgaWYodmFsaWRhdG9yLnR5cGUgIT09ICdyZW1vdGUnKXtcbiAgICAgICAgICAgICAgICBpZih2YWxpZGF0ZShncm91cCwgdmFsaWRhdG9yKSkgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgXG4gICAgICAgICAgICAgICAgaWYoaGFzRXJyb3IpIHJlc29sdmUoZmFsc2UpIFxuICAgICAgICAgICAgICAgIGVsc2UgdmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7IHJlc29sdmUocmVzKTt9KTtcblxuICAgICAgICB9KTtcbiAgICB9KSk7XG59Il19
