(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    window.validator = _component2.default.init('form');

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

var _defaults = require('./lib/constants/defaults');

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

},{"./lib":8,"./lib/constants/defaults":4}],3:[function(require,module,exports){
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

},{"../constants":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
exports.renderError = exports.renderErrors = exports.clearErrors = exports.clearError = exports.createErrorTextNode = exports.h = undefined;

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
        if (errorNodes[groupName]) clearError(groupName)(state);

        errorNodes[groupName] = state.groups[groupName].serverErrorNode ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) : state.groups[groupName].fields[state.groups[groupName].fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));

        state.groups[groupName].fields.forEach(function (field) {
            field.setAttribute('aria-invalid', 'true');
        });
    };
};

},{"../constants":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _validator = require('./validator');

var _dom = require('./dom');

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

var validate = function validate(e) {
    e && e.preventDefault();
    _store2.default.dispatch(_actions2.default.CLEAR_ERRORS(), [_dom.clearErrors]);

    (0, _validator.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
        var _ref;

        //no errors (all true, no false or error Strings), just submit
        if (e && e.target && (_ref = []).concat.apply(_ref, _toConsumableArray(validityState)).reduce(_validator.reduceGroupValidityState, true)) return form.submit();

        _store2.default.dispatch(_actions2.default.VALIDATION_ERRORS(Object.keys(_store2.default.getState().groups).reduce(function (acc, group, i) {
            return acc[group] = {
                valid: validityState[i].reduce(_validator.reduceGroupValidityState, true),
                errorMessages: validityState[i].reduce((0, _validator.reduceErrorMessages)(group, _store2.default.getState()), [])
            }, acc;
        }, {})), [_dom.renderErrors]);

        realTimeValidation();
    });
};

var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({ type: type, method: method, message: message });
};

var realTimeValidation = function realTimeValidation() {
    var handler = function handler(groupName) {
        return function () {
            if (!_store2.default.getState().groups[groupName].valid) _store2.default.dispatch(_actions2.default.CLEAR_ERROR(groupName), [(0, _dom.clearError)(groupName)]);
            (0, _validator.getGroupValidityState)(_store2.default.getState().groups[groupName]).then(function (res) {
                if (!res.reduce(_validator.reduceGroupValidityState, true)) _store2.default.dispatch(_actions2.default.VALIDATION_ERROR({
                    group: groupName,
                    errorMessages: res.reduce((0, _validator.reduceErrorMessages)(groupName, _store2.default.getState()), [])
                }), [(0, _dom.renderError)(groupName)]);
            });
        };
    };

    Object.keys(_store2.default.getState().groups).forEach(function (groupName) {
        _store2.default.getState().groups[groupName].fields.forEach(function (input) {
            input.addEventListener((0, _validator.resolveRealTimeValidationEvent)(input), handler(groupName));
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
    _store2.default.dispatch(_actions2.default.SET_INITIAL_STATE((0, _validator.getInitialState)(form)));

    form.addEventListener('submit', validate);

    form.addEventListener('reset', function () {
        _store2.default.dispatch(_actions2.default.CLEAR_ERRORS(), [_dom.clearErrors]);
    });

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./actions":3,"./dom":7,"./store":11,"./validator":12}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createReducer = exports.createReducer = function createReducer(initialState, actionHandlers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments[1];

        if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action);else return state;
    };
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionHandlers;

var _constants = require('../constants');

var _createReducer = require('./create-reducer');

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
exports.default = (0, _createReducer.createReducer)({}, actionHandlers);

},{"../constants":5,"./create-reducer":9}],11:[function(require,module,exports){
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

},{"../reducers":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveRealTimeValidationEvent = exports.getGroupValidityState = exports.getValidityState = exports.reduceGroupValidityState = exports.getInitialState = exports.removeUnvalidatableGroups = exports.reduceErrorMessages = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _messages = require('../constants/messages');

var _messages2 = _interopRequireDefault(_messages);

var _utils = require('./utils');

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
    return _defineProperty({}, param.split('-')[1], !!~_constants.DOM_SELECTOR_PARAMS.indexOf(param) ? (0, _utils.DOMNodesFromCommaList)(value, input) : value);
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
    return (0, _utils.pipe)(email(input), url(input), number(input), minlength(input), maxlength(input), min(input), max(input), pattern(input), required(input));
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
    return validator.method ? validator.method((0, _utils.extractValueFromGroup)(group), group.fields) : _methods2.default[validator.type](group, validator.params);
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

var extractErrorMessage = function extractErrorMessage(validator) {
    return validator.message || _messages2.default[validator.type](validator.params !== undefined ? validator.params : null);
};

var reduceErrorMessages = exports.reduceErrorMessages = function reduceErrorMessages(group, state) {
    return function (acc, validity, j) {
        return validity === true ? acc : [].concat(_toConsumableArray(acc), [typeof validity === 'boolean' ? extractErrorMessage(state.groups[group].validators[j]) : validity]);
    };
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

var resolveRealTimeValidationEvent = exports.resolveRealTimeValidationEvent = function resolveRealTimeValidationEvent(input) {
    return ['input', 'change'][Number((0, _utils.isCheckable)(input) || (0, _utils.isSelect)(input) || (0, _utils.isFile)(input))];
};

},{"../constants":5,"../constants/messages":6,"./methods":13,"./utils":14}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

var _utils = require('./utils');

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

},{"../constants":5,"./utils":14}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var isCheckable = exports.isCheckable = function isCheckable(field) {
    return (/radio|checkbox/i.test(field.type)
    );
};

var isFile = exports.isFile = function isFile(field) {
    return field.getAttribute('type') === 'file';
};

var isSelect = exports.isSelect = function isSelect(field) {
    return field.nodeName.toLowerCase() === 'select';
};

var isRequired = exports.isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
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

var resolveGetParams = exports.resolveGetParams = function resolveGetParams(nodeArrays) {
    return nodeArrays.map(function (nodes) {
        return nodes[0].getAttribute('name') + '=' + extractValueFromGroup(nodes);
    }).join('&');
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

var pipe = exports.pipe = function pipe() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return fns.reduce(function (acc, fn) {
        return fn(acc);
    });
};

var extractValueFromGroup = exports.extractValueFromGroup = function extractValueFromGroup(group) {
    return group.hasOwnProperty('fields') ? group.fields.reduce(groupValueReducer, '') : group.reduce(groupValueReducer, '');
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
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);else reject(xhr.statusText);
        };
        xhr.onerror = function () {
            return reject(xhr.statusText);
        };
        xhr.send(props.body);
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9hY3Rpb25zL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb25zdGFudHMvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvY29uc3RhbnRzL21lc3NhZ2VzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RvbS9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZWR1Y2Vycy9jcmVhdGUtcmVkdWNlci5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZWR1Y2Vycy9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9zdG9yZS9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi92YWxpZGF0b3IvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdmFsaWRhdG9yL21ldGhvZHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdmFsaWRhdG9yL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1dBQUEsQUFBTyxZQUFZLG9CQUFBLEFBQVMsS0FBNUIsQUFBbUIsQUFBYyxBQUVqQzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVI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TUFBQSxBQUFNLFFBQWhDLEFBQTBCLEFBQWMsQUFDM0M7QUFGRCxBQUdIO0FBQ0Q7WUFBQSxBQUFJLFNBQVMsWUFBTSxBQUNmO2dCQUFJLElBQUEsQUFBSSxVQUFKLEFBQWMsT0FBTyxJQUFBLEFBQUksU0FBN0IsQUFBc0MsS0FBSyxRQUFRLElBQW5ELEFBQTJDLEFBQVksZUFDbEQsT0FBTyxJQUFQLEFBQVcsQUFDbkI7QUFIRCxBQUlBO1lBQUEsQUFBSSxVQUFVLFlBQUE7bUJBQU0sT0FBTyxJQUFiLEFBQU0sQUFBVztBQUEvQixBQUNBO1lBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxBQUNsQjtBQWRELEFBQU8sQUFlVixLQWZVO0FBREoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgd2luZG93LnZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9jb25zdGFudHMvZGVmYXVsdHMnO1xuaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuXHRcblx0aWYoZWxzLmxlbmd0aCA9PT0gMSAmJiB3aW5kb3cuX192YWxpZGF0b3JzX18gJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV0pXG5cdFx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dO1xuXHRcblx0Ly9hdHRhY2hlZCB0byB3aW5kb3cuX192YWxpZGF0b3JzX19cblx0Ly9zbyB3ZSBjYW4gYm90aCBpbml0LCBhdXRvLWluaXRpYWxpc2UgYW5kIHJlZmVyIGJhY2sgdG8gYW4gaW5zdGFuY2UgYXR0YWNoZWQgdG8gYSBmb3JtIHRvIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRvcnNcblx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyA9IFxuXHRcdE9iamVjdC5hc3NpZ24oe30sIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXywgZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpKSkpO1xuXHRcdFx0cmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBBQ1RJT05TIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIFtBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFLFxuICAgICAgICBkYXRhXG4gICAgfSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JTXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLkNMRUFSX0VSUk9SU1xuICAgIH0pLFxuICAgIFtBQ1RJT05TLkNMRUFSX0VSUk9SXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLkNMRUFSX0VSUk9SLFxuICAgICAgICBkYXRhXG4gICAgfSksXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUlNdOiBkYXRhID0+ICh7XG4gICAgICAgIHR5cGU6IEFDVElPTlMuVkFMSURBVElPTl9FUlJPUlMsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SXTogZGF0YSA9PiAoe1xuICAgICAgICB0eXBlOiBBQ1RJT05TLlZBTElEQVRJT05fRVJST1IsXG4gICAgICAgIGRhdGFcbiAgICB9KSxcbn07IiwiZXhwb3J0IGRlZmF1bHQge307IiwiZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgRU5URVI6IDEzXG59O1xuXG5leHBvcnQgY29uc3QgQUNUSU9OUyA9IHtcbiAgICBTRVRfSU5JVElBTF9TVEFURTogJ1NFVF9JTklUSUFMX1NUQVRFJyxcbiAgICBDTEVBUl9FUlJPUlM6ICdDTEVBUl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1JTOiAnVkFMSURBVElPTl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBDTEVBUl9FUlJPUjogJ0NMRUFSX0VSUk9SJ1xufTtcblxuZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7fTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLyogQ2FuIHRoZXNlIHR3byBiZSBmb2xkZWQgaW50byB0aGUgc2FtZSB2YXJpYWJsZT8gKi9cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9DTEFTU05BTUVTID0ge1xuICAgIFZBTElEOiAnZmllbGQtdmFsaWRhdGlvbi12YWxpZCcsXG4gICAgRVJST1I6ICdmaWVsZC12YWxpZGF0aW9uLWVycm9yJ1xufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICByZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH1cbn07IiwiaW1wb3J0IHsgRE9UTkVUX0NMQVNTTkFNRVMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuLy9yZXRhaW4gZXJyb3JOb2RlcyBpbiBjbG9zdXJlLCBub3Qgc3RhdGVcbmxldCBlcnJvck5vZGVzID0ge307XG5cbmV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IChncm91cCwgbXNnKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtc2cpO1xuXG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICBcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGVycm9yTm9kZXNbZ3JvdXBOYW1lXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSk7XG4gICAgaWYoc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlKSB7XG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIH1cbiAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pO1xuICAgIGRlbGV0ZSBlcnJvck5vZGVzW2dyb3VwTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvcnMgPSBzdGF0ZSA9PiB7XG4gICAgT2JqZWN0LmtleXMoZXJyb3JOb2RlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgY2xlYXJFcnJvcihuYW1lKShzdGF0ZSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3JzID0gc3RhdGUgPT4ge1xuICAgIE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykuZm9yRWFjaChncm91cE5hbWUgPT4ge1xuICAgICAgICBpZighc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWQpIHJlbmRlckVycm9yKGdyb3VwTmFtZSkoc3RhdGUpO1xuICAgIH0pXG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGlmKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSkgY2xlYXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICBcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0gPSBcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlIFxuICAgICAgICAgICAgPyBjcmVhdGVFcnJvclRleHROb2RlKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLCBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5lcnJvck1lc3NhZ2VzWzBdKSBcbiAgICAgICAgICAgIDogc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV1cblx0XHRcdFx0XHRcdC5maWVsZHNbc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmxlbmd0aC0xXVxuXHRcdFx0XHRcdFx0LnBhcmVudE5vZGVcblx0XHRcdFx0XHRcdC5hcHBlbmRDaGlsZChoKCdkaXYnLCB7IGNsYXNzOiBET1RORVRfQ0xBU1NOQU1FUy5FUlJPUiB9LCBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5lcnJvck1lc3NhZ2VzWzBdKSk7XG5cdFx0XHRcdFx0XHRcblx0c3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7IH0pO1xufTsiLCJpbXBvcnQgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgXG4gICAgZ2V0SW5pdGlhbFN0YXRlLFxuICAgIGdldFZhbGlkaXR5U3RhdGUsXG4gICAgZ2V0R3JvdXBWYWxpZGl0eVN0YXRlLFxuICAgIHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSxcbiAgICByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQsXG4gICAgcmVkdWNlRXJyb3JNZXNzYWdlc1xufSBmcm9tICcuL3ZhbGlkYXRvcic7XG5pbXBvcnQge1xuICAgIGNsZWFyRXJyb3JzLFxuICAgIGNsZWFyRXJyb3IsXG4gICAgcmVuZGVyRXJyb3IsXG4gICAgcmVuZGVyRXJyb3JzXG59ICBmcm9tICcuL2RvbSc7XG5cbmNvbnN0IHZhbGlkYXRlID0gZSA9PiB7XG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5DTEVBUl9FUlJPUlMoKSwgW2NsZWFyRXJyb3JzXSk7XG5cbiAgICBnZXRWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAudGhlbih2YWxpZGl0eVN0YXRlID0+IHtcbiAgICAgICAgICAgIC8vbm8gZXJyb3JzIChhbGwgdHJ1ZSwgbm8gZmFsc2Ugb3IgZXJyb3IgU3RyaW5ncyksIGp1c3Qgc3VibWl0XG4gICAgICAgICAgICBpZihlICYmIGUudGFyZ2V0ICYmIFtdLmNvbmNhdCguLi52YWxpZGl0eVN0YXRlKS5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLCB0cnVlKSkgcmV0dXJuIGZvcm0uc3VibWl0KCk7XG5cbiAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuVkFMSURBVElPTl9FUlJPUlMoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgZ3JvdXAsIGkpID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY1tncm91cF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IHZhbGlkaXR5U3RhdGVbaV0ucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogdmFsaWRpdHlTdGF0ZVtpXS5yZWR1Y2UocmVkdWNlRXJyb3JNZXNzYWdlcyhncm91cCwgU3RvcmUuZ2V0U3RhdGUoKSksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xuICAgICAgICAgICAgICAgICAgICB9LCB7fSkpLCBbcmVuZGVyRXJyb3JzXVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmVhbFRpbWVWYWxpZGF0aW9uKCk7XG4gICAgICAgIH0pO1xufTtcblxuY29uc3QgYWRkTWV0aG9kID0gKHR5cGUsIGdyb3VwTmFtZSwgbWV0aG9kLCBtZXNzYWdlKSA9PiB7XG4gICAgaWYodHlwZSA9PT0gdW5kZWZpbmVkIHx8IGdyb3VwTmFtZSA9PT0gdW5kZWZpbmVkIHx8IG1ldGhvZCA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnNvbGUud2FybignQ3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIGNhbm5vdCBiZSBhZGRlZC4nKTtcbiAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLnB1c2goe3R5cGUsIG1ldGhvZCwgbWVzc2FnZX0pO1xufTtcblxuXG5jb25zdCByZWFsVGltZVZhbGlkYXRpb24gPSAoKSA9PiB7XG4gICAgbGV0IGhhbmRsZXIgPSBncm91cE5hbWUgPT4gKCkgPT4ge1xuICAgICAgICBpZighU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5DTEVBUl9FUlJPUihncm91cE5hbWUpLCBbY2xlYXJFcnJvcihncm91cE5hbWUpXSk7XG4gICAgICAgIGdldEdyb3VwVmFsaWRpdHlTdGF0ZShTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZighcmVzLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpKSBcbiAgICAgICAgICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiByZXMucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXBOYW1lLCBTdG9yZS5nZXRTdGF0ZSgpKSwgW10pXG4gICAgICAgICAgICAgICAgICAgIH0pLCBbcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihyZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQoaW5wdXQpLCBoYW5kbGVyKGdyb3VwTmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGVxdWFsVG9WYWxpZGF0b3IgPSBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcbiAgICAgICAgXG4gICAgICAgIGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCBcbiAgICAgICAgICAgICYmIGVxdWFsVG9WYWxpZGF0b3JbMF0ucGFyYW1zLm90aGVyLmZvckVhY2goc3ViZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgIHN1Ymdyb3VwLmZvckVhY2goaXRlbSA9PiB7IGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZXIoZ3JvdXBOYW1lKSk7IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoZm9ybSwgc2V0dGluZ3MpID0+IHtcbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFKGdldEluaXRpYWxTdGF0ZShmb3JtKSkpO1xuXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB2YWxpZGF0ZSk7XG5cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgKCkgPT4geyBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SUygpLCBbY2xlYXJFcnJvcnNdKTsgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZGF0ZSxcbiAgICAgICAgYWRkTWV0aG9kXG4gICAgfVxufTsiLCJleHBvcnQgY29uc3QgY3JlYXRlUmVkdWNlciA9IChpbml0aWFsU3RhdGUsIGFjdGlvbkhhbmRsZXJzKSA9PiAoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikgPT4ge1xuICAgIGlmIChhY3Rpb25IYW5kbGVycy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24udHlwZSkpIHJldHVybiBhY3Rpb25IYW5kbGVyc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbilcbiAgICBlbHNlIHJldHVybiBzdGF0ZTtcbn07IiwiaW1wb3J0IHsgQUNUSU9OUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjcmVhdGVSZWR1Y2VyIH0gZnJvbSAnLi9jcmVhdGUtcmVkdWNlcic7XG5cbmNvbnN0IGFjdGlvbkhhbmRsZXJzID0ge1xuICAgIFtBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFXTogKHN0YXRlLCBhY3Rpb24pID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCBhY3Rpb24uZGF0YSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JTXTogc3RhdGUgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgXG4gICAgICAgIGdyb3VwczogT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGFjY1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pXG4gICAgfSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JdOiAoc3RhdGUsIGFjdGlvbikgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgIFthY3Rpb24uZGF0YV06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1thY3Rpb24uZGF0YV0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SU106IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2dyb3VwXSwgYWN0aW9uLmRhdGFbZ3JvdXBdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUl06IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgICAgICBbYWN0aW9uLmRhdGEuZ3JvdXBdOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbYWN0aW9uLmRhdGEuZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGFjdGlvbi5kYXRhLmVycm9yTWVzc2FnZXMsXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVSZWR1Y2VyKHt9LCBhY3Rpb25IYW5kbGVycyk7IiwiaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4uL3JlZHVjZXJzJztcbi8vIGltcG9ydCByZW5kZXIgZnJvbSAnLi4vcmVuZGVyZXInO1xuXG5sZXQgc3RhdGUgPSB7fTtcblxud2luZG93LlNUQVRFX0hJU1RPUlkgPSBbXTtcblxuY29uc3QgZ2V0U3RhdGUgPSAoKSA9PiBzdGF0ZTtcblxuY29uc3QgZGlzcGF0Y2ggPSBmdW5jdGlvbihhY3Rpb24sIGxpc3RlbmVycykge1xuICAgIHN0YXRlID0gYWN0aW9uID8gcmVkdWNlcnMoc3RhdGUsIGFjdGlvbikgOiBzdGF0ZTtcbiAgICAvLyB3aW5kb3cuU1RBVEVfSElTVE9SWS5wdXNoKHtbYWN0aW9uLnR5cGVdOiBzdGF0ZX0pO1xuICAgIGNvbnNvbGUubG9nKHtbYWN0aW9uLnR5cGVdOiBzdGF0ZX0pO1xuICAgIGlmKCFsaXN0ZW5lcnMpIHJldHVybjtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGxpc3RlbmVyKHN0YXRlKTtcbiAgICAgICAgLy8gcmVuZGVyW3JlbmRlcmVyXSA/IHJlbmRlcltyZW5kZXJlcl0oc3RhdGUpIDogcmVuZGVyZXIoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGRpc3BhdGNoLFxuICAgIFxuICAgIGdldFN0YXRlXG59OyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vY29uc3RhbnRzL21lc3NhZ2VzJztcbmltcG9ydCB7IFxuICAgIHBpcGUsXG4gICAgaXNDaGVja2FibGUsXG4gICAgaXNTZWxlY3QsXG4gICAgaXNGaWxlLFxuICAgIERPTU5vZGVzRnJvbUNvbW1hTGlzdCxcbiAgICBleHRyYWN0VmFsdWVGcm9tR3JvdXBcbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuICAgIERPVE5FVF9BREFQVE9SUyxcbiAgICBET1RORVRfUEFSQU1TLFxuICAgIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLFxuICAgIERPTV9TRUxFQ1RPUl9QQVJBTVNcbn0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgcmVzb2x2ZVBhcmFtID0gKHBhcmFtLCBpbnB1dCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKTtcbiAgICByZXR1cm4gKHtbcGFyYW0uc3BsaXQoJy0nKVsxXV06ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBET01Ob2Rlc0Zyb21Db21tYUxpc3QodmFsdWUsIGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSlcbn07XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dCkpIDogYWNjLCB7fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIFxuY29uc3QgZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzID0gaW5wdXQgPT4gRE9UTkVUX0FEQVBUT1JTLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYWRhcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtcyhpbnB1dCwgYWRhcHRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoZW1haWwoaW5wdXQpLCB1cmwoaW5wdXQpLCBudW1iZXIoaW5wdXQpLCBtaW5sZW5ndGgoaW5wdXQpLCBtYXhsZW5ndGgoaW5wdXQpLCBtaW4oaW5wdXQpLCBtYXgoaW5wdXQpLCBwYXR0ZXJuKGlucHV0KSwgcmVxdWlyZWQoaW5wdXQpKTtcblxuLy91bi1EUlkuLi4gYW5kIHVucmVhZGFibGVcbmNvbnN0IHJlcXVpcmVkID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdyZXF1aXJlZCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBlbWFpbCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ2VtYWlsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IHVybCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3VybCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICd1cmwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbnVtYmVyID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ251bWJlcid9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW5sZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heGxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWluID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWluJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IHBhdHRlcm4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3BhdHRlcm4nLCBwYXJhbXM6IHsgcmVnZXg6IGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpfX1dIDogdmFsaWRhdG9ycztcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdEF0dHJWYWxpZGF0b3JzKGlucHV0KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gKGdyb3VwLCB2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5tZXRob2QgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3IubWV0aG9kKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCksIGdyb3VwLmZpZWxkcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zKTtcblxuZXhwb3J0IGNvbnN0IGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBsZXQgbmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgIHJldHVybiBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gPyBPYmplY3QuYXNzaWduKGFjY1tuYW1lXSwgeyBmaWVsZHM6IFsuLi5hY2NbbmFtZV0uZmllbGRzLCBpbnB1dF19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09JHtpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKX1dYCkgfHwgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbn07XG5cbmNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSB2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUVycm9yTWVzc2FnZXMgPSAoZ3JvdXAsIHN0YXRlKSA9PiAoYWNjLCB2YWxpZGl0eSwgaikgPT4ge1xuICAgIHJldHVybiB2YWxpZGl0eSA9PT0gdHJ1ZSBcbiAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICA6IFsuLi5hY2MsIHR5cGVvZiB2YWxpZGl0eSA9PT0gJ2Jvb2xlYW4nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdEVycm9yTWVzc2FnZShzdGF0ZS5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnNbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWxpZGl0eV07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKVxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxTdGF0ZSA9IGZvcm0gPT4gKHtcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRWYWxpZGl0eVN0YXRlID0gZ3JvdXBzID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwcylcbiAgICAgICAgICAgIC5tYXAoZ3JvdXAgPT4gZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKGdyb3Vwc1tncm91cF0pKVxuICAgICAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEdyb3VwVmFsaWRpdHlTdGF0ZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKGhhc0Vycm9yKSByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4geyByZXNvbHZlKHJlcyk7fSk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTsiLCJpbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZmV0Y2gsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgcmVzb2x2ZUdldFBhcmFtcyB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09ICcnO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gJycsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgsIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyA9IHBhcmFtcy5vdGhlci5yZWR1Y2UoKHN1Ymdyb3VwQWNjLCBzdWJncm91cCkgPT4ge1xuICAgICAgICAgICAgaWYoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKHN1Ymdyb3VwKSAhPT0gaW5wdXQudmFsdWUpIHN1Ymdyb3VwQWNjID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3ViZ3JvdXBBY2M7XG4gICAgICAgIH0sIHRydWUpLCBhY2M7XG4gICAgfSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluICYmIChwYXJhbXMubWF4ID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmV0Y2goKHBhcmFtcy50eXBlICE9PSAnZ2V0JyA/IHBhcmFtcy51cmwgOiBgJHtwYXJhbXMudXJsfT8ke3Jlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpfWApLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICBib2R5OiBwYXJhbXMudHlwZSA9PT0gJ2dldCcgPyBudWxsIDogcmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyksXG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUoYFNlcnZlciBlcnJvcjogJHtyZXN9YCk7IH0pO1xuICAgIH0pXG59OyIsImV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSAobGlzdCwgaW5wdXQpID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRTZWxlY3RvciA9IGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGFwcGVuZE1vZGVsUHJlZml4KGl0ZW0sIGdldE1vZGVsUHJlZml4KGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7cmVzb2x2ZWRTZWxlY3Rvcn1dYCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbmNvbnN0IGVzY2FwZUF0dHJpYnV0ZVZhbHVlID0gdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgvKFshXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxcXFxcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIpO1xuXG5jb25zdCBnZXRNb2RlbFByZWZpeCA9IGZpZWxkTmFtZSA9PiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG5cbmNvbnN0IGFwcGVuZE1vZGVsUHJlZml4ID0gKHZhbHVlLCBwcmVmaXgpID0+IHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIiouXCIpID09PSAwKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIqLlwiLCBwcmVmaXgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZWxzZSByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTsiXX0=
