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
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.CLEAR_ERROR, function (data) {
    return {
        type: _constants.ACTIONS.CLEAR_ERROR,
        data: data
    };
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.VALIDATION_ERRORS, function (data) {
    return {
        type: _constants.ACTIONS.VALIDATION_ERRORS,
        data: data
    };
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.VALIDATION_ERROR, function (data) {
    return {
        type: _constants.ACTIONS.VALIDATION_ERROR,
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
    VALIDATION_ERRORS: 'VALIDATION_ERRORS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
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

var _utils = require('./utils');

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

var validate = function validate() {};

var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({ type: type, method: method, message: message });
};

var realTimeValidation = function realTimeValidation() {
    var handler = function handler(groupName) {
        return function () {
            if (!_store2.default.getState().groups[groupName].valid) _store2.default.dispatch(_actions2.default.CLEAR_ERROR(groupName), [(0, _dom.clearError)(groupName)]);
            (0, _validators.getGroupValidityState)(_store2.default.getState().groups[groupName]).then(function (res) {
                if (!res.reduce(_validators.reduceGroupValidityState, true)) _store2.default.dispatch(_actions2.default.VALIDATION_ERROR({
                    group: groupName,
                    errorMessages: res.reduce(function (acc, validity, j) {
                        return validity === true ? acc : [].concat(_toConsumableArray(acc), [typeof validity === 'boolean' ? (0, _validators.extractErrorMessage)(_store2.default.getState().groups[groupName].validators[j]) : validity]);
                    }, [])
                }), [(0, _dom.renderError)(groupName)]);
            });
        };
    };

    Object.keys(_store2.default.getState().groups).forEach(function (groupName) {
        _store2.default.getState().groups[groupName].fields.forEach(function (input) {
            input.addEventListener((0, _utils.chooseRealTimeEvent)(input), handler(groupName));
        });
        var equalToValidator = _store2.default.getState().groups[groupName].validators.filter(function (validator) {
            return validator.type === 'equalto';
        });

        equalToValidator.length > 0 && equalToValidator[0].params.other.forEach(function (subgroup) {
            subgroup.forEach(function (item) {
                item.addEventListener('blur', handler(groupName));
            });
        });
    });
};

exports.default = function (form, settings) {
    _store2.default.dispatch(_actions2.default.SET_INITIAL_STATE((0, _validators.getInitialState)(form)));

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        _store2.default.dispatch(_actions2.default.CLEAR_ERRORS(), [_dom.clearErrors]);

        (0, _validators.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
            var _ref;

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

            realTimeValidation();
        });
    });

    // form.addEventListener('reset', clear);

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./actions":3,"./store":10,"./utils":12,"./utils/dom":11,"./utils/validators":13}],7:[function(require,module,exports){
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
}), _defineProperty(_actionHandlers, _constants.ACTIONS.CLEAR_ERROR, function (state, action) {
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, _defineProperty({}, action.data, Object.assign({}, state.groups[action.data], {
            errorMessages: [],
            valid: true
        })))
    });
}), _defineProperty(_actionHandlers, _constants.ACTIONS.VALIDATION_ERRORS, function (state, action) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], action.data[group]);
            return acc;
        }, {})
    });
}), _defineProperty(_actionHandlers, _constants.ACTIONS.VALIDATION_ERROR, function (state, action) {
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, _defineProperty({}, action.data.group, Object.assign({}, state.groups[action.data.group], {
            errorMessages: action.data.errorMessages,
            valid: false
        })))
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
exports.renderError = exports.renderErrors = exports.clearErrors = exports.clearError = exports.createErrorNode = exports.createErrorTextNode = exports.h = undefined;

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

var clearError = exports.clearError = function clearError(groupName) {
    return function (state) {
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
};

var clearErrors = exports.clearErrors = function clearErrors(state) {
    Object.keys(errorNodes).forEach(function (name) {
        clearError(name)(state);
    });
};

var renderErrors = exports.renderErrors = function renderErrors(state) {
    Object.keys(state.groups).forEach(function (groupName) {
        if (!state.groups[groupName].valid) renderError(groupName)(state);
    });
};

var renderError = exports.renderError = function renderError(groupName) {
    return function (state) {
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
exports.getGroupValidityState = exports.getValidityState = exports.reduceGroupValidityState = exports.getInitialState = exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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

var getGroupValidityState = exports.getGroupValidityState = function getGroupValidityState(group) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9hY3Rpb25zL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3N0b3JlL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2RvbS5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxvQkFBQSxBQUFTLEtBQXpCLEFBQWdCLEFBQWMsQUFFOUI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQVpELEFBQWdDLENBQUE7O0FBY2hDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7Ozs7Ozs7Ozs7QUNoQmxE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S0EsSUFBTSw4REFBMkIsU0FBM0IsQUFBMkIseUJBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUNuRDtRQUFHLFNBQUgsQUFBWSxNQUFNLE1BQUEsQUFBTSxBQUN4QjtXQUFBLEFBQU8sQUFDVjtBQUhNOztBQU1BLElBQU0sOENBQW1CLFNBQW5CLEFBQW1CLHlCQUFVLEFBQ3RDO0FBQ0E7QUFDQTtBQUNBO21CQUFPLEFBQVEsV0FDWCxBQUFPLEtBQVAsQUFBWSxRQUFaLEFBQ0ssSUFBSSxpQkFBQTtlQUFTLHNCQUFzQixPQUEvQixBQUFTLEFBQXNCLEFBQU87QUFGbkQsQUFBTyxBQUNILEFBR1AsS0FITyxDQURHO0FBSko7O0FBVUEsSUFBTSx3REFBd0IsU0FBeEIsQUFBd0IsNkJBQVMsQUFDMUM7UUFBSSxXQUFKLEFBQWUsQUFDbEI7bUJBQU8sQUFBUSxVQUFJLEFBQU0sV0FBTixBQUFpQixJQUFJLHFCQUFhLEFBQzlDO21CQUFPLEFBQUksUUFBUSxtQkFBVyxBQUMxQjtnQkFBRyxVQUFBLEFBQVUsU0FBYixBQUFzQixVQUFTLEFBQzNCO29CQUFHLFNBQUEsQUFBUyxPQUFaLEFBQUcsQUFBZ0IsWUFBWSxRQUEvQixBQUErQixBQUFRLFdBQ2xDLEFBQ0Q7K0JBQUEsQUFBVyxBQUNYOzRCQUFBLEFBQVEsQUFDWDtBQUNKO0FBTkQsbUJBT0ksSUFBQSxBQUFHLFVBQVUsUUFBYixBQUFhLEFBQVEscUJBQ2hCLEFBQVMsT0FBVCxBQUFnQixXQUFoQixBQUNJLEtBQUssZUFBTyxBQUFFO3dCQUFBLEFBQVEsQUFBTTtBQURoQyxBQUdaLGFBSFk7QUFUYixBQUFPLEFBYVYsU0FiVTtBQURkLEFBQU8sQUFBWSxBQWVuQixLQWZtQixDQUFaO0FBRkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgZmFjdG9yeSBmcm9tICcuL2xpYic7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG5cdFxuXHRpZihlbHMubGVuZ3RoID09PSAxICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyAmJiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXSlcblx0XHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL2F0dGFjaGVkIHRvIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1xuXHQvL3NvIHdlIGNhbiBib3RoIGluaXQsIGF1dG8taW5pdGlhbGlzZSBhbmQgcmVmZXIgYmFjayB0byBhbiBpbnN0YW5jZSBhdHRhY2hlZCB0byBhIGZvcm0gdG8gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdG9yc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gXG5cdFx0T2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5nZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuO1xuXHRcdFx0YWNjW2VsXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShmYWN0b3J5KGVsLCBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cykpKSk7XG5cdFx0XHRyZXR1cm4gZWwuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKSwgYWNjO1xuXHRcdH0sIHt9KSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdFx0LmZvckVhY2goZm9ybSA9PiB7IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgaW5pdChmb3JtKTsgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IEFDVElPTlMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEUsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuQ0xFQVJfRVJST1JTXG4gICAgfSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuQ0xFQVJfRVJST1IsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SU106IGRhdGEgPT4gKHtcbiAgICAgICAgdHlwZTogQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SUyxcbiAgICAgICAgZGF0YVxuICAgIH0pLFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuVkFMSURBVElPTl9FUlJPUixcbiAgICAgICAgZGF0YVxuICAgIH0pLFxufTsiLCJleHBvcnQgY29uc3QgU0VMRUNUT1IgPSB7XG59O1xuXG5leHBvcnQgY29uc3QgREFUQV9BVFRSSUJVVEVTID0ge1xufTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgRU5URVI6IDEzXG59O1xuXG5leHBvcnQgY29uc3QgQUNUSU9OUyA9IHtcbiAgICBTRVRfSU5JVElBTF9TVEFURTogJ1NFVF9JTklUSUFMX1NUQVRFJyxcbiAgICBDTEVBUl9FUlJPUlM6ICdDTEVBUl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1JTOiAnVkFMSURBVElPTl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBDTEVBUl9FUlJPUjogJ0NMRUFSX0VSUk9SJ1xufTtcblxuZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9DTEFTU05BTUVTID0ge1xuICAgIFZBTElEOiAnZmllbGQtdmFsaWRhdGlvbi12YWxpZCcsXG4gICAgRVJST1I6ICdmaWVsZC12YWxpZGF0aW9uLWVycm9yJ1xufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGVycm9yc0lubGluZTogdHJ1ZSxcblx0ZXJyb3JTdW1tYXJ5OiBmYWxzZVxuXHQvLyBjYWxsYmFjazogbnVsbFxufTsiLCJpbXBvcnQgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgZ2V0SW5pdGlhbFN0YXRlLCBnZXRWYWxpZGl0eVN0YXRlLCBnZXRHcm91cFZhbGlkaXR5U3RhdGUsIGV4dHJhY3RFcnJvck1lc3NhZ2UsIHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSB9IGZyb20gJy4vdXRpbHMvdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBjbGVhckVycm9ycywgY2xlYXJFcnJvciwgcmVuZGVyRXJyb3IsIHJlbmRlckVycm9ycyB9ICBmcm9tICcuL3V0aWxzL2RvbSc7XG5pbXBvcnQgeyBjaG9vc2VSZWFsVGltZUV2ZW50IH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHZhbGlkYXRlID0gKCkgPT4ge307XG5cbmNvbnN0IGFkZE1ldGhvZCA9ICh0eXBlLCBncm91cE5hbWUsIG1ldGhvZCwgbWVzc2FnZSkgPT4ge1xuICAgIGlmKHR5cGUgPT09IHVuZGVmaW5lZCB8fCBncm91cE5hbWUgPT09IHVuZGVmaW5lZCB8fCBtZXRob2QgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHJldHVybiBjb25zb2xlLndhcm4oJ0N1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCBjYW5ub3QgYmUgYWRkZWQuJyk7XG4gICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWRhdG9ycy5wdXNoKHt0eXBlLCBtZXRob2QsIG1lc3NhZ2V9KTtcbn07XG5cbmNvbnN0IHJlYWxUaW1lVmFsaWRhdGlvbiA9ICgpID0+IHtcbiAgICBsZXQgaGFuZGxlciA9IGdyb3VwTmFtZSA9PiAoKSA9PiB7XG4gICAgICAgIGlmKCFTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SKGdyb3VwTmFtZSksIFtjbGVhckVycm9yKGdyb3VwTmFtZSldKTtcbiAgICAgICAgZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFyZXMucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpIFxuICAgICAgICAgICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLlZBTElEQVRJT05fRVJST1Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHJlcy5yZWR1Y2UoKGFjYywgdmFsaWRpdHksIGopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkaXR5ID09PSB0cnVlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4uYWNjLCB0eXBlb2YgdmFsaWRpdHkgPT09ICdib29sZWFuJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RXJyb3JNZXNzYWdlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWRhdG9yc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWxpZGl0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgICAgICAgICAgIH0pLCBbcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihjaG9vc2VSZWFsVGltZUV2ZW50KGlucHV0KSwgaGFuZGxlcihncm91cE5hbWUpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBlcXVhbFRvVmFsaWRhdG9yID0gU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdlcXVhbHRvJyk7XG4gICAgICAgIFxuICAgICAgICBlcXVhbFRvVmFsaWRhdG9yLmxlbmd0aCA+IDAgXG4gICAgICAgICAgICAmJiBlcXVhbFRvVmFsaWRhdG9yWzBdLnBhcmFtcy5vdGhlci5mb3JFYWNoKHN1Ymdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICBzdWJncm91cC5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVyKGdyb3VwTmFtZSkpOyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGZvcm0sIHNldHRpbmdzKSA9PiB7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURShnZXRJbml0aWFsU3RhdGUoZm9ybSkpKTtcblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SUygpLCBbY2xlYXJFcnJvcnNdKTtcblxuICAgICAgICBnZXRWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAgICAgLnRoZW4odmFsaWRpdHlTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgLy9ubyBlcnJvcnMgKGFsbCB0cnVlLCBubyBmYWxzZSBvciBlcnJvciBTdHJpbmdzKSwganVzdCBzdWJtaXRcbiAgICAgICAgICAgICAgICBpZihbXS5jb25jYXQoLi4udmFsaWRpdHlTdGF0ZSkucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpIHJldHVybiBmb3JtLnN1Ym1pdCgpO1xuXG4gICAgICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SUyhcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIGdyb3VwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZWVlZWVlZWVmYWN0b3IgcGxzIDtfO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBncm91cFZhbGlkaXR5U3RhdGUgPSB2YWxpZGl0eVN0YXRlW2ldLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzID0gdmFsaWRpdHlTdGF0ZVtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgdmFsaWRpdHksIGopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkaXR5ID09PSB0cnVlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4uYWNjLCB0eXBlb2YgdmFsaWRpdHkgPT09ICdib29sZWFuJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RXJyb3JNZXNzYWdlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbGlkaXR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjW2dyb3VwXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGdyb3VwVmFsaWRpdHlTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogZXJyb3JNZXNzYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSksIFtyZW5kZXJFcnJvcnNdXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHJlYWxUaW1lVmFsaWRhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgY2xlYXIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWRhdGUsXG4gICAgICAgIGFkZE1ldGhvZFxuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9XG59OyIsImltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKChwYXJhbXMudHlwZSAhPT0gJ2dldCcgPyBwYXJhbXMudXJsIDogYCR7cGFyYW1zLnVybH0/JHtyZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKX1gKSwge1xuICAgICAgICAgICAgbWV0aG9kOiBwYXJhbXMudHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7IHJlc29sdmUoZGF0YSk7IH0pXG4gICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKGBTZXJ2ZXIgZXJyb3I6ICR7cmVzfWApOyB9KTtcbiAgICB9KVxufTsiLCJpbXBvcnQgeyBBQ1RJT05TLCBTRUxFQ1RPUiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjcmVhdGVSZWR1Y2VyIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBhY3Rpb25IYW5kbGVycyA9IHtcbiAgICBbQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURV06IChzdGF0ZSwgYWN0aW9uKSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgYWN0aW9uLmRhdGEpLFxuICAgIFtBQ1RJT05TLkNMRUFSX0VSUk9SU106IHN0YXRlID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IFxuICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2dyb3VwXSwge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFtdLFxuICAgICAgICAgICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KVxuICAgIH0pLFxuICAgIFtBQ1RJT05TLkNMRUFSX0VSUk9SXTogKHN0YXRlLCBhY3Rpb24pID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCB7XG4gICAgICAgICAgICBbYWN0aW9uLmRhdGFdOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbYWN0aW9uLmRhdGFdLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSksXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUlNdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgXG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIGFjdGlvbi5kYXRhW2dyb3VwXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JdOiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCB7XG4gICAgICAgICAgICAgICAgW2FjdGlvbi5kYXRhLmdyb3VwXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2FjdGlvbi5kYXRhLmdyb3VwXSwge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBhY3Rpb24uZGF0YS5lcnJvck1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUmVkdWNlcih7fSwgYWN0aW9uSGFuZGxlcnMpOyIsImltcG9ydCByZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycyc7XG4vLyBpbXBvcnQgcmVuZGVyIGZyb20gJy4uL3JlbmRlcmVyJztcblxubGV0IHN0YXRlID0ge307XG5cbndpbmRvdy5TVEFURV9ISVNUT1JZID0gW107XG5cbmNvbnN0IGdldFN0YXRlID0gKCkgPT4gc3RhdGU7XG5cbmNvbnN0IGRpc3BhdGNoID0gZnVuY3Rpb24oYWN0aW9uLCBsaXN0ZW5lcnMpIHtcbiAgICBzdGF0ZSA9IGFjdGlvbiA/IHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pIDogc3RhdGU7XG4gICAgLy8gd2luZG93LlNUQVRFX0hJU1RPUlkucHVzaCh7W2FjdGlvbi50eXBlXTogc3RhdGV9KTtcbiAgICBjb25zb2xlLmxvZyh7W2FjdGlvbi50eXBlXTogc3RhdGV9KTtcbiAgICBpZighbGlzdGVuZXJzKSByZXR1cm47XG4gICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgICBsaXN0ZW5lcihzdGF0ZSk7XG4gICAgICAgIC8vIHJlbmRlcltyZW5kZXJlcl0gPyByZW5kZXJbcmVuZGVyZXJdKHN0YXRlKSA6IHJlbmRlcmVyKHN0YXRlKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBkaXNwYXRjaCxcbiAgICBcbiAgICBnZXRTdGF0ZVxufTsiLCJpbXBvcnQgeyBET1RORVRfQ0xBU1NOQU1FUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vcmV0YWluIGVycm9yTm9kZXMgaW4gY2xvc3VyZSwgbm90IHN0YXRlXG5sZXQgZXJyb3JOb2RlcyA9IHt9O1xuXG5leHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSAoZ3JvdXAsIG1zZykgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobXNnKTtcblxuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgXG4gICAgcmV0dXJuIGdyb3VwLnNlcnZlckVycm9yTm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFcnJvck5vZGUgPSAoZ3JvdXAsIG1zZykgPT4ge1xuICAgIGxldCBub2RlID0gZ3JvdXAuZmllbGRzW2dyb3VwLmZpZWxkcy5sZW5ndGgtMV1cbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIG1zZykpO1xuXG4gICAgZ3JvdXAuZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBjb25zdCBjbGVhckVycm9yID0gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHtcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlcnJvck5vZGVzW2dyb3VwTmFtZV0pO1xuICAgIGlmKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSkge1xuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICB9XG4gICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTtcbiAgICBkZWxldGUgZXJyb3JOb2Rlc1tncm91cE5hbWVdO1xufTtcblxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JzID0gc3RhdGUgPT4ge1xuICAgIE9iamVjdC5rZXlzKGVycm9yTm9kZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGNsZWFyRXJyb3IobmFtZSkoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLmZvckVhY2goZ3JvdXBOYW1lID0+IHtcbiAgICAgICAgaWYoIXN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSByZW5kZXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICB9KVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckVycm9yID0gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHtcbiAgICBpZihlcnJvck5vZGVzW2dyb3VwTmFtZV0pIGNsZWFyRXJyb3IoZ3JvdXBOYW1lLCBzdGF0ZSk7XG4gICAgXG4gICAgZXJyb3JOb2Rlc1tncm91cE5hbWVdID0gXG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSA/IFxuXHRcdFx0XHRjcmVhdGVFcnJvclRleHROb2RlKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLCBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5lcnJvck1lc3NhZ2VzWzBdKSA6IFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXVxuXHRcdFx0XHRcdFx0LmZpZWxkc1tzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcdFx0XHRcdFxuXHRcdC8vc2V0IGFyaWEtaW52YWxpZCBvbiBpbnZhbGlkIGlucHV0c1xuXHRcdHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZ2V0TmFtZSA9IGdyb3VwID0+IGdyb3VwLmZpZWxkc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmV4cG9ydCBjb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RWYWx1ZUZyb21Hcm91cCA9IGdyb3VwID0+IGdyb3VwLmhhc093blByb3BlcnR5KCdmaWVsZHMnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBncm91cC5maWVsZHMucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBncm91cC5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuXG5leHBvcnQgY29uc3QgY2hvb3NlUmVhbFRpbWVFdmVudCA9IGlucHV0ID0+IFsnaW5wdXQnLCAnY2hhbmdlJ11bTnVtYmVyKGlzQ2hlY2thYmxlKGlucHV0KSB8fCBpc1NlbGVjdChpbnB1dCkgfHwgaXNGaWxlKGlucHV0KSldO1xuXG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGFjYywgZm4pID0+IGZuKGFjYykpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB4aHIuc2VuZChwcm9wcy5ib2R5KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWR1Y2VyID0gKGluaXRpYWxTdGF0ZSwgYWN0aW9uSGFuZGxlcnMpID0+IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgaWYgKGFjdGlvbkhhbmRsZXJzLmhhc093blByb3BlcnR5KGFjdGlvbi50eXBlKSkgcmV0dXJuIGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICAgIGVsc2UgcmV0dXJuIHN0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IChsaXN0LCBpbnB1dCkgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFNlbGVjdG9yID0gZXNjYXBlQXR0cmlidXRlVmFsdWUoYXBwZW5kTW9kZWxQcmVmaXgoaXRlbSwgZ2V0TW9kZWxQcmVmaXgoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtyZXNvbHZlZFNlbGVjdG9yfV1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuY29uc3QgZXNjYXBlQXR0cmlidXRlVmFsdWUgPSB2YWx1ZSA9PiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG5cbmNvbnN0IGdldE1vZGVsUHJlZml4ID0gZmllbGROYW1lID0+IGZpZWxkTmFtZS5zdWJzdHIoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcblxuY29uc3QgYXBwZW5kTW9kZWxQcmVmaXggPSAodmFsdWUsIHByZWZpeCkgPT4ge1xuICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgcGlwZSwgRE9NTm9kZXNGcm9tQ29tbWFMaXN0LCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgfSBmcm9tICcuLyc7XG5pbXBvcnQgeyBET1RORVRfQURBUFRPUlMsIERPVE5FVF9QQVJBTVMsIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLCBET01fU0VMRUNUT1JfUEFSQU1TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgcmVzb2x2ZVBhcmFtID0gKHBhcmFtLCBpbnB1dCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKTtcbiAgICByZXR1cm4gKHtbcGFyYW0uc3BsaXQoJy0nKVsxXV06ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBET01Ob2Rlc0Zyb21Db21tYUxpc3QodmFsdWUsIGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSlcbn07XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dCkpIDogYWNjLCB7fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIFxuY29uc3QgZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzID0gaW5wdXQgPT4gRE9UTkVUX0FEQVBUT1JTLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYWRhcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtcyhpbnB1dCwgYWRhcHRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWlubGVuZ3RoKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4bGVuZ3RoKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4KGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbi8vdW4tRFJZLi4uIGFuZCB1bnJlYWRhYmxlXG5jb25zdCByZXF1aXJlZCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncmVxdWlyZWQnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgZW1haWwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdlbWFpbCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCB1cmwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAndXJsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG51bWJlciA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdudW1iZXInfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWlubGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXhsZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbicsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4ID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4JywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBwYXR0ZXJuID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiB7IHJlZ2V4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKX19XSA6IHZhbGlkYXRvcnM7XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpc2VWYWxpZGF0b3JzID0gaW5wdXQgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbCcpID09PSAndHJ1ZScgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyhpbnB1dCk7XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IChncm91cCwgdmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IubWV0aG9kIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9yLm1ldGhvZChleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApLCBncm91cC5maWVsZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyk7XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgbGV0IG5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICByZXR1cm4gYWNjW25hbWVdID0gYWNjW25hbWVdID8gT2JqZWN0LmFzc2lnbihhY2NbbmFtZV0sIHsgZmllbGRzOiBbLi4uYWNjW25hbWVdLmZpZWxkcywgaW5wdXRdfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IHZhbGlkYXRvciA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKVxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxTdGF0ZSA9IGZvcm0gPT4gKHtcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdldFZhbGlkaXR5U3RhdGUgPSBncm91cHMgPT4ge1xuICAgIC8vIGxldCBncm91cFZhbGlkYXRvcnMgPSBbXTtcbiAgICAvLyBmb3IobGV0IGdyb3VwIGluIGdyb3VwcykgZ3JvdXBWYWxpZGF0b3JzLnB1c2goZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3Vwc1tncm91cF0pKTtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5hbGwoZ3JvdXBWYWxpZGF0b3JzKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwcylcbiAgICAgICAgICAgIC5tYXAoZ3JvdXAgPT4gZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3Vwc1tncm91cF0pKVxuICAgICAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEdyb3VwVmFsaWRpdHlTdGF0ZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIFxuICAgICAgICAgICAgICAgIGlmKGhhc0Vycm9yKSByZXNvbHZlKGZhbHNlKSBcbiAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4geyByZXNvbHZlKHJlcyk7fSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSkpO1xufSJdfQ==
