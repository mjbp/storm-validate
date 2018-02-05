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

// import componentPrototype from './lib/component-prototype';
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
    CLEAR_ERRORS: 'CLEAR_ERRORS'
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
// import { validateForm } from './validate';

var validate = function validate() {};

var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({ type: type, method: method, message: message });
};

exports.default = function (form, settings) {
    _store2.default.dispatch(_actions2.default.SET_INITIAL_STATE((0, _validators.getInitialState)(form)));

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        //dispatch clear
        // clear(state.groups);
        _store2.default.dispatch(_actions2.default.CLEAR_ERRORS(), ['errors']);

        //dispatch valdate
        validateForm().then(function (res) {
            var _ref;

            //submit
            if (!(_ref = []).concat.apply(_ref, _toConsumableArray(res)).includes(false)) form.submit();else {
                //dispatch errors
                render(state.group);
                //dispatch init real-time validation

                // initRealTimeValidation();
            }
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
}), _defineProperty(_actionHandlers, _constants.ACTIONS.CLEAR_ERRORS, function (state) {
    return Object.assign({}, state, { groups: state.groups.map(function (group) {
            return Object.assign({}, group, {
                errorDOM: false,
                errorMessages: []
            });
        }) });
}), _actionHandlers);
exports.default = (0, _utils.createReducer)({}, actionHandlers);

},{"../constants":4,"../utils":12}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {};

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

var createReducer = exports.createReducer = function createReducer(initialState, actionHandlers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments[1];

        if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action);else return state;
    };
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInitialState = exports.removeUnvalidatableGroups = exports.extractErrorMessage = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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

var getInitialState = exports.getInitialState = function getInitialState(form) {
    return {
        groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}))
    };
};

},{"../constants":4,"../messages":7,"../methods":8,"./":12}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9hY3Rpb25zL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3JlbmRlcmVyL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3N0b3JlL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzL3ZhbGlkYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7UUFBSSxZQUFZLG9CQUFBLEFBQVMsS0FBekIsQUFBZ0IsQUFBYyxBQUU5Qjs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBWkQsQUFBZ0MsQ0FBQTs7QUFjaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDs7Ozs7Ozs7OztB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QUFBcUMsR0FDakMsaUJBQUEsQUFBaUIsU0FBUyxPQUZsQyxBQUVRLEFBQTBCLEFBQU87QUFFekMsWUFBQSxBQUFPLEFBQ1Y7QUFSTTs7QUFVQSxJQUFNLDRDQUFrQixTQUFsQixBQUFrQixzQkFBQTs7Z0JBQ25CLDBCQUEwQixHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssS0FBQSxBQUFLLGlCQUFuQixBQUFjLEFBQXNCLCtDQUFwQyxBQUNqQixPQURpQixBQUNWLHlCQUZHLEFBQVMsQUFDNUIsQUFBMEIsQUFDZTtBQUZiLEFBQ3BDO0FBREciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG4vLyBpbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuXHRcblx0aWYoZWxzLmxlbmd0aCA9PT0gMSAmJiB3aW5kb3cuX192YWxpZGF0b3JzX18gJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV0pXG5cdFx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dO1xuXHRcblx0Ly9hdHRhY2hlZCB0byB3aW5kb3cuX192YWxpZGF0b3JzX19cblx0Ly9zbyB3ZSBjYW4gYm90aCBpbml0LCBhdXRvLWluaXRpYWxpc2UgYW5kIHJlZmVyIGJhY2sgdG8gYW4gaW5zdGFuY2UgYXR0YWNoZWQgdG8gYSBmb3JtIHRvIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRvcnNcblx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyA9IFxuXHRcdE9iamVjdC5hc3NpZ24oe30sIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXywgZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpKSkpO1xuXHRcdFx0cmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBBQ1RJT05TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIFtBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFLFxuICAgICAgICBkYXRhXG4gICAgfSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JTXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLkNMRUFSX0VSUk9SU1xuICAgIH0pLFxuICAgIFxufTsiLCJleHBvcnQgY29uc3QgU0VMRUNUT1IgPSB7XG59O1xuXG5leHBvcnQgY29uc3QgREFUQV9BVFRSSUJVVEVTID0ge1xufTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgRU5URVI6IDEzXG59O1xuXG5leHBvcnQgY29uc3QgQUNUSU9OUyA9IHtcbiAgICBTRVRfSU5JVElBTF9TVEFURTogJ1NFVF9JTklUSUFMX1NUQVRFJyxcbiAgICBDTEVBUl9FUlJPUlM6ICdDTEVBUl9FUlJPUlMnXG59O1xuXG5leHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHt9O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG5leHBvcnQgY29uc3QgRE9NX1NFTEVDVE9SX1BBUkFNUyA9IFsncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAnZXF1YWx0by1vdGhlciddO1xuXG4vKiBDYW4gdGhlc2UgdHdvIGJlIGZvbGRlZCBpbnRvIHRoZSBzYW1lIHZhcmlhYmxlPyAqL1xuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ2xlbmd0aC1taW4nLCAnbGVuZ3RoLW1heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbHRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdyZW1vdGUtdHlwZSddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAncmVxdWlyZWQnLFxuICAgICdzdHJpbmdsZW5ndGgnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJywvL3Nob3VsZCBiZSBsYXN0XG4gICAgLy8gJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dOyIsImV4cG9ydCBkZWZhdWx0IHtcblx0ZXJyb3JzSW5saW5lOiB0cnVlLFxuXHRlcnJvclN1bW1hcnk6IGZhbHNlXG5cdC8vIGNhbGxiYWNrOiBudWxsXG59OyIsImltcG9ydCBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucyc7XG4vLyBpbXBvcnQgeyBUUklHR0VSX0VWRU5UUywgS0VZX0NPREVTLCBEQVRBX0FUVFJJQlVURVMgfSBmcm9tICAnLi9jb25zdGFudHMnO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuXG5pbXBvcnQgeyBnZXRJbml0aWFsU3RhdGUgfSBmcm9tICcuL3V0aWxzL3ZhbGlkYXRvcnMnO1xuLy8gaW1wb3J0IHsgY2xlYXIsIHJlbmRlciB9IGZyb20gJy4vbWFuYWdlLWVycm9ycyc7XG4vLyBpbXBvcnQgeyB2YWxpZGF0ZUZvcm0gfSBmcm9tICcuL3ZhbGlkYXRlJztcblxuY29uc3QgdmFsaWRhdGUgPSAoKSA9PiB7fTtcblxuY29uc3QgYWRkTWV0aG9kID0gKHR5cGUsIGdyb3VwTmFtZSwgbWV0aG9kLCBtZXNzYWdlKSA9PiB7XG4gICAgaWYodHlwZSA9PT0gdW5kZWZpbmVkIHx8IGdyb3VwTmFtZSA9PT0gdW5kZWZpbmVkIHx8IG1ldGhvZCA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnNvbGUud2FybignQ3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIGNhbm5vdCBiZSBhZGRlZC4nKTtcbiAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLnB1c2goe3R5cGUsIG1ldGhvZCwgbWVzc2FnZX0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGZvcm0sIHNldHRpbmdzKSA9PiB7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURShnZXRJbml0aWFsU3RhdGUoZm9ybSkpKTtcblxuXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBcbiAgICAgICAgLy9kaXNwYXRjaCBjbGVhclxuICAgICAgICAvLyBjbGVhcihzdGF0ZS5ncm91cHMpO1xuICAgICAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SUygpLCBbJ2Vycm9ycyddKTtcblxuICAgICAgICAvL2Rpc3BhdGNoIHZhbGRhdGVcbiAgICAgICAgdmFsaWRhdGVGb3JtKClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgLy9zdWJtaXRcbiAgICAgICAgICAgICAgICBpZighW10uY29uY2F0KC4uLnJlcykuaW5jbHVkZXMoZmFsc2UpKSBmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2Rpc3BhdGNoIGVycm9yc1xuICAgICAgICAgICAgICAgICAgICByZW5kZXIoc3RhdGUuZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAvL2Rpc3BhdGNoIGluaXQgcmVhbC10aW1lIHZhbGlkYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAvLyBpbml0UmVhbFRpbWVWYWxpZGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgY2xlYXIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWRhdGUsXG4gICAgICAgIGFkZE1ldGhvZFxuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9XG59OyIsImltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEVNQUlMX1JFR0VYLCBVUkxfUkVHRVgsIERBVEVfSVNPX1JFR0VYLCBOVU1CRVJfUkVHRVgsIERJR0lUU19SRUdFWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmZXRjaCgocGFyYW1zLnR5cGUgIT09ICdnZXQnID8gcGFyYW1zLnVybCA6IGAke3BhcmFtcy51cmx9PyR7cmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyl9YCksIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4geyByZXNvbHZlKGRhdGEpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUocmVzKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiaW1wb3J0IHsgQUNUSU9OUywgU0VMRUNUT1IgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgY3JlYXRlUmVkdWNlciB9IGZyb20gJy4uL3V0aWxzJztcblxuY29uc3QgYWN0aW9uSGFuZGxlcnMgPSB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiAoc3RhdGUsIGFjdGlvbikgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIGFjdGlvbi5kYXRhKSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBncm91cHM6IHN0YXRlLmdyb3Vwcy5tYXAoZ3JvdXAgPT4gT2JqZWN0LmFzc2lnbih7fSwgZ3JvdXAsIHtcbiAgICAgICAgZXJyb3JET006IGZhbHNlLFxuICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXVxuICAgIH0pKX0pXG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUmVkdWNlcih7fSwgYWN0aW9uSGFuZGxlcnMpOyIsImV4cG9ydCBkZWZhdWx0ICgpID0+IHt9OyIsImltcG9ydCByZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycyc7XG5pbXBvcnQgcmVuZGVyIGZyb20gJy4uL3JlbmRlcmVyJztcblxubGV0IHN0YXRlID0ge307XG5cbndpbmRvdy5TVEFURV9ISVNUT1JZID0gW107XG5cbmNvbnN0IGdldFN0YXRlID0gKCkgPT4gc3RhdGU7XG5cbmNvbnN0IGRpc3BhdGNoID0gZnVuY3Rpb24oYWN0aW9uLCByZW5kZXJlcnMpIHtcbiAgICBzdGF0ZSA9IGFjdGlvbiA/IHJlZHVjZXJzKHN0YXRlLCBhY3Rpb24pIDogc3RhdGU7XG4gICAgLy8gd2luZG93LlNUQVRFX0hJU1RPUlkucHVzaCh7W2FjdGlvbi50eXBlXTogc3RhdGV9KTtcbiAgICBjb25zb2xlLmxvZyh7W2FjdGlvbi50eXBlXTogc3RhdGV9KTtcbiAgICBpZighcmVuZGVyZXJzKSByZXR1cm47XG4gICAgcmVuZGVyZXJzLmZvckVhY2gocmVuZGVyZXIgPT4ge1xuICAgICAgICByZW5kZXJbcmVuZGVyZXJdID8gcmVuZGVyW3JlbmRlcmVyXShzdGF0ZSkgOiByZW5kZXJlcihzdGF0ZSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZGlzcGF0Y2gsXG4gICAgZ2V0U3RhdGVcbn07IiwiZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5leHBvcnQgY29uc3QgZ2V0TmFtZSA9IGdyb3VwID0+IGdyb3VwLmZpZWxkc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSBsaXN0ID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtpdGVtLnN1YnN0cigyKX1dYCkpKTtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufVxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpXG5cbmV4cG9ydCBjb25zdCBjaG9vc2VSZWFsVGltZUV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07XG5cbmV4cG9ydCBjb25zdCBwaXBlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoYWNjLCBmbikgPT4gZm4oYWNjKSk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaCA9ICh1cmwsIHByb3BzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3Blbihwcm9wcy5tZXRob2QgfHwgJ0dFVCcsIHVybCk7XG4gICAgICAgIGlmIChwcm9wcy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcy5oZWFkZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBwcm9wcy5oZWFkZXJzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlZHVjZXIgPSAoaW5pdGlhbFN0YXRlLCBhY3Rpb25IYW5kbGVycykgPT4gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBpZiAoYWN0aW9uSGFuZGxlcnMuaGFzT3duUHJvcGVydHkoYWN0aW9uLnR5cGUpKSByZXR1cm4gYWN0aW9uSGFuZGxlcnNbYWN0aW9uLnR5cGVdKHN0YXRlLCBhY3Rpb24pXG4gICAgZWxzZSByZXR1cm4gc3RhdGU7XG59OyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4uL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL21lc3NhZ2VzJztcbmltcG9ydCB7IHBpcGUsIERPTU5vZGVzRnJvbUNvbW1hTGlzdCwgZXh0cmFjdFZhbHVlRnJvbUdyb3VwIH0gZnJvbSAnLi8nO1xuaW1wb3J0IHsgRE9UTkVUX0FEQVBUT1JTLCBET1RORVRfUEFSQU1TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSwgRE9NX1NFTEVDVE9SX1BBUkFNUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgdmFsdWUpID0+ICh7W3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSk7XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkpKSA6IGFjYywge30pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICBcbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG5jb25zdCBleHRyYWN0QXR0clZhbGlkYXRvcnMgPSBpbnB1dCA9PiBwaXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGxlbmd0aChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbihpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heChpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4oaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4vL3VuLURSWS4uLiBhbmQgdW5yZWFkYWJsZVxuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3JlcXVpcmVkJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IGVtYWlsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnZW1haWwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgdXJsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3VybCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBudW1iZXIgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbnVtYmVyJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbmxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbmxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4bGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW4nLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgcGF0dGVybiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyl9fV0gOiB2YWxpZGF0b3JzO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLm1ldGhvZCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvci5tZXRob2QoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSwgZ3JvdXAuZmllbGRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbWV0aG9kc1t2YWxpZGF0b3IudHlwZV0oZ3JvdXAsIHZhbGlkYXRvci5wYXJhbXMpO1xuXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSAodmFsaWRhdG9yLCBncm91cCkgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbml0aWFsU3RhdGUgPSBmb3JtID0+ICh7XG4gICAgZ3JvdXBzOiByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKFtdLnNsaWNlLmNhbGwoZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKVxufSk7Il19
