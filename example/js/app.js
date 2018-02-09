(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    var validator = _component2.default.init('form');

    console.log(validator);

    validator.addMethod('RequiredString', function (value, fields, params) {
        return value === 'test';
    }, 'Value must equal "test"');

    validator.addMethod('CustomValidator', function (value, fields, params) {
        return value === 'test 2';
    }, 'Value must equal "test 2"');
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

},{"./lib":7,"./lib/constants/defaults":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

},{}],4:[function(require,module,exports){
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
    CLEAR_ERROR: 'CLEAR_ERROR',
    ADD_VALIDATION_METHOD: 'ADD_VALIDATION_METHOD'
};

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

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderError = exports.renderErrors = exports.clearErrors = exports.clearError = exports.createErrorTextNode = exports.h = undefined;

var _constants = require('../constants');

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
    return function (model) {
        errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
        if (model.groups[groupName].serverErrorNode) {
            model.groups[groupName].serverErrorNode.classList.remove(_constants.DOTNET_CLASSNAMES.ERROR);
            model.groups[groupName].serverErrorNode.classList.add(_constants.DOTNET_CLASSNAMES.VALID);
        }
        model.groups[groupName].fields.forEach(function (field) {
            field.removeAttribute('aria-invalid');
        });
        delete errorNodes[groupName];
    };
};

var clearErrors = exports.clearErrors = function clearErrors(model) {
    Object.keys(errorNodes).forEach(function (name) {
        clearError(name)(model);
    });
};

var renderErrors = exports.renderErrors = function renderErrors(model) {
    Object.keys(model.groups).forEach(function (groupName) {
        if (!model.groups[groupName].valid) renderError(groupName)(model);
    });
};

var renderError = exports.renderError = function renderError(groupName) {
    return function (model) {
        if (errorNodes[groupName]) clearError(groupName)(model);

        errorNodes[groupName] = model.groups[groupName].serverErrorNode ? createErrorTextNode(model.groups[groupName], model.groups[groupName].errorMessages[0]) : model.groups[groupName].fields[model.groups[groupName].fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, model.groups[groupName].errorMessages[0]));

        model.groups[groupName].fields.forEach(function (field) {
            field.setAttribute('aria-invalid', 'true');
        });
    };
};

},{"../constants":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _constants = require('./constants');

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
    _store2.default.dispatch(_constants.ACTIONS.CLEAR_ERRORS, null, [_dom.clearErrors]);

    (0, _validator.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
        var _ref;

        if (e && e.target && (_ref = []).concat.apply(_ref, _toConsumableArray(validityState)).reduce(_validator.reduceGroupValidityState, true)) return form.submit();

        _store2.default.dispatch(_constants.ACTIONS.VALIDATION_ERRORS, Object.keys(_store2.default.getState().groups).reduce(function (acc, group, i) {
            return acc[group] = {
                valid: validityState[i].reduce(_validator.reduceGroupValidityState, true),
                errorMessages: validityState[i].reduce((0, _validator.reduceErrorMessages)(group, _store2.default.getState()), [])
            }, acc;
        }, {}), [_dom.renderErrors]);

        realTimeValidation();
    });
};

var addMethod = function addMethod(groupName, method, message) {
    //also check if Store.getState()[groupName] exists, if not check that document.getElementsByName(groupName).length !== 0
    if (groupName === undefined || method === undefined || message === undefined || !_store2.default.getState()[groupName] && document.getElementsByName(groupName).length === 0) return console.warn('Custom validation method cannot be added.');

    _store2.default.dispatch(_constants.ACTIONS.ADD_VALIDATION_METHOD, { groupName: groupName, validator: { type: 'custom', method: method, message: message } });
};

var realTimeValidation = function realTimeValidation() {
    var handler = function handler(groupName) {
        return function () {
            if (!_store2.default.getState().groups[groupName].valid) _store2.default.dispatch(_constants.ACTIONS.CLEAR_ERROR, groupName, [(0, _dom.clearError)(groupName)]);
            (0, _validator.getGroupValidityState)(_store2.default.getState().groups[groupName]).then(function (res) {
                if (!res.reduce(_validator.reduceGroupValidityState, true)) _store2.default.dispatch(_constants.ACTIONS.VALIDATION_ERROR, {
                    group: groupName,
                    errorMessages: res.reduce((0, _validator.reduceErrorMessages)(groupName, _store2.default.getState()), [])
                }, [(0, _dom.renderError)(groupName)]);
            });
        };
    };

    Object.keys(_store2.default.getState().groups).forEach(function (groupName) {
        _store2.default.getState().groups[groupName].fields.forEach(function (input) {
            input.addEventListener((0, _validator.resolveRealTimeValidationEvent)(input), handler(groupName));
        });
        //;_; can do better?
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
    _store2.default.dispatch(_constants.ACTIONS.SET_INITIAL_STATE, (0, _validator.getInitialState)(form));
    form.addEventListener('submit', validate);
    form.addEventListener('reset', function () {
        _store2.default.update(UPDATES.CLEAR_ERRORS, null, [_dom.clearErrors]);
    });

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./constants":4,"./dom":6,"./store":9,"./validator":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ACTIONS$SET_INITIAL_;

var _constants = require('../constants');

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

exports.default = (_ACTIONS$SET_INITIAL_ = {}, _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.SET_INITIAL_STATE, function (state, data) {
    return Object.assign({}, state, data);
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.CLEAR_ERRORS, function (state) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    });
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.CLEAR_ERROR, function (state, data) {
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, _defineProperty({}, data, Object.assign({}, state.groups[data], {
            errorMessages: [],
            valid: true
        })))
    });
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.ADD_VALIDATION_METHOD, function (state, data) {
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, _defineProperty({}, data.groupName, Object.assign({}, state.groups[data.groupName] ? state.groups[data.groupName] : {}, state.groups[data.groupName] ? { validators: [].concat(_toConsumableArray(state.groups[data.groupName].validators), [data.validator]) } : {
            fields: [].slice.call(document.getElementsByName(data.groupName)),
            serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + data.groupName + ']') || false,
            valid: false,
            validators: [data.validator]
        })))
    });
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.VALIDATION_ERRORS, function (state, data) {
    return Object.assign({}, state, {
        groups: Object.keys(state.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, state.groups[group], data[group]);
            return acc;
        }, {})
    });
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.VALIDATION_ERROR, function (state, data) {
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, _defineProperty({}, data.group, Object.assign({}, state.groups[data.group], {
            errorMessages: data.errorMessages,
            valid: false
        })))
    });
}), _ACTIONS$SET_INITIAL_);

},{"../constants":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var state = {};

// window.__validator_history__ = [];

var getState = function getState() {
    return state;
};

var dispatch = function dispatch(type, nextState, effects) {
    state = nextState ? _reducers2.default[type](state, nextState) : state;
    // window.__validator_history__.push({[type]: state}), console.log(window.__validator_history__);
    // console.log({[type]: state});
    if (!effects) return;
    effects.forEach(function (effect) {
        effect(state);
    });
};

exports.default = { dispatch: dispatch, getState: getState };

},{"../reducers":8}],10:[function(require,module,exports){
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

//un-DRY...
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
    return validator.type === 'custom' ? _methods2.default['custom'](validator.method, group) : _methods2.default[validator.type](group, validator.params);
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

},{"../constants":4,"../constants/messages":5,"./methods":11,"./utils":12}],11:[function(require,module,exports){
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
    },
    custom: function custom(method, group) {
        return isOptional(group) || method((0, _utils.extractValueFromGroup)(group), group.fields);
    }
};

},{"../constants":4,"./utils":12}],12:[function(require,module,exports){
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
        var resolvedSelector = escapeAttributeValue(appendStatePrefix(item, getStatePrefix(input.getAttribute('name'))));
        return [].slice.call(document.querySelectorAll('[name=' + resolvedSelector + ']'));
    });
};

var escapeAttributeValue = function escapeAttributeValue(value) {
    return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
};

var getStatePrefix = function getStatePrefix(fieldName) {
    return fieldName.substr(0, fieldName.lastIndexOf('.') + 1);
};

var appendStatePrefix = function appendStatePrefix(value, prefix) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb25zdGFudHMvZGVmYXVsdHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kb20vaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvcmVkdWNlcnMvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvc3RvcmUvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdmFsaWRhdG9yL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3ZhbGlkYXRvci9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3ZhbGlkYXRvci91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQztRQUFJLFlBQVksb0JBQUEsQUFBUyxLQUF6QixBQUFnQixBQUFjLEFBRTlCOztZQUFBLEFBQVEsSUFBUixBQUFZLEFBRVo7O2NBQUEsQUFBVSxVQUFWLEFBQ0ksa0JBQ0EsVUFBQSxBQUFDLE9BQUQsQUFBUSxRQUFSLEFBQWdCLFFBQVcsQUFDdkI7ZUFBTyxVQUFQLEFBQWlCLEFBQ3BCO0FBSkwsT0FBQSxBQUtJLEFBR0o7O2NBQUEsQUFBVSxVQUFWLEFB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QSxBQUFJLGlCQUFKLEFBQXFCLEtBQUssTUFBQSxBQUFNLFFBQWhDLEFBQTBCLEFBQWMsQUFDM0M7QUFGRCxBQUdIO0FBQ0Q7WUFBQSxBQUFJLFNBQVMsWUFBTSxBQUNmO2dCQUFJLElBQUEsQUFBSSxVQUFKLEFBQWMsT0FBTyxJQUFBLEFBQUksU0FBN0IsQUFBc0MsS0FBSyxRQUFRLElBQW5ELEFBQTJDLEFBQVksZUFDbEQsT0FBTyxJQUFQLEFBQVcsQUFDbkI7QUFIRCxBQUlBO1lBQUEsQUFBSSxVQUFVLFlBQUE7bUJBQU0sT0FBTyxJQUFiLEFBQU0sQUFBVztBQUEvQixBQUNBO1lBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxBQUNsQjtBQWRELEFBQU8sQUFlVixLQWZVO0FBREoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgbGV0IHZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIGNvbnNvbGUubG9nKHZhbGlkYXRvcik7XG5cbiAgICB2YWxpZGF0b3IuYWRkTWV0aG9kKFxuICAgICAgICAnUmVxdWlyZWRTdHJpbmcnLFxuICAgICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0JztcbiAgICAgICAgfSxcbiAgICAgICAgJ1ZhbHVlIG11c3QgZXF1YWwgXCJ0ZXN0XCInXG4gICAgKTtcblxuICAgIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgICAgICdDdXN0b21WYWxpZGF0b3InLFxuICAgICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0IDInO1xuICAgICAgICB9LFxuICAgICAgICAnVmFsdWUgbXVzdCBlcXVhbCBcInRlc3QgMlwiJ1xuICAgICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9jb25zdGFudHMvZGVmYXVsdHMnO1xuaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuXHRcblx0aWYoZWxzLmxlbmd0aCA9PT0gMSAmJiB3aW5kb3cuX192YWxpZGF0b3JzX18gJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV0pXG5cdFx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dO1xuXHRcblx0Ly9hdHRhY2hlZCB0byB3aW5kb3cuX192YWxpZGF0b3JzX19cblx0Ly9zbyB3ZSBjYW4gYm90aCBpbml0LCBhdXRvLWluaXRpYWxpc2UgYW5kIHJlZmVyIGJhY2sgdG8gYW4gaW5zdGFuY2UgYXR0YWNoZWQgdG8gYSBmb3JtIHRvIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRvcnNcblx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyA9IFxuXHRcdE9iamVjdC5hc3NpZ24oe30sIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXywgZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpKSkpO1xuXHRcdFx0cmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJleHBvcnQgZGVmYXVsdCB7fTsiLCJleHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBFTlRFUjogMTNcbn07XG5cbmV4cG9ydCBjb25zdCBBQ1RJT05TID0ge1xuICAgIFNFVF9JTklUSUFMX1NUQVRFOiAnU0VUX0lOSVRJQUxfU1RBVEUnLFxuICAgIENMRUFSX0VSUk9SUzogJ0NMRUFSX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUlM6ICdWQUxJREFUSU9OX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUjogJ1ZBTElEQVRJT05fRVJST1InLFxuICAgIENMRUFSX0VSUk9SOiAnQ0xFQVJfRVJST1InLFxuICAgIEFERF9WQUxJREFUSU9OX01FVEhPRDogJ0FERF9WQUxJREFUSU9OX01FVEhPRCdcbn07XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFID0gJ2RhdGEtdmFsbXNnLWZvcic7XG5cbmV4cG9ydCBjb25zdCBET01fU0VMRUNUT1JfUEFSQU1TID0gWydyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdlcXVhbHRvLW90aGVyJ107XG5cbi8qIENhbiB0aGVzZSB0d28gYmUgZm9sZGVkIGludG8gdGhlIHNhbWUgdmFyaWFibGU/ICovXG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbGVuZ3RoLW1pbicsICdsZW5ndGgtbWF4J10sXG4gICAgc3RyaW5nbGVuZ3RoOiBbJ2xlbmd0aC1tYXgnXSxcbiAgICByYW5nZTogWydyYW5nZS1taW4nLCAncmFuZ2UtbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWlubGVuZ3RoLW1pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXhsZW5ndGgtbWF4J10sXG4gICAgcmVnZXg6IFsncmVnZXgtcGF0dGVybiddLFxuICAgIGVxdWFsdG86IFsnZXF1YWx0by1vdGhlciddLFxuICAgIHJlbW90ZTogWydyZW1vdGUtdXJsJywgJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ3JlbW90ZS10eXBlJ10vLz8/XG59O1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0FEQVBUT1JTID0gW1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ3N0cmluZ2xlbmd0aCcsXG4gICAgJ3JlZ2V4JyxcbiAgICAvLyAnZGlnaXRzJyxcbiAgICAnZW1haWwnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdsZW5ndGgnLFxuICAgICdtaW5sZW5ndGgnLFxuICAgICdyYW5nZScsXG4gICAgJ2VxdWFsdG8nLFxuICAgICdyZW1vdGUnLC8vc2hvdWxkIGJlIGxhc3RcbiAgICAvLyAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07XG5cbmV4cG9ydCBjb25zdCBET1RORVRfQ0xBU1NOQU1FUyA9IHtcbiAgICBWQUxJRDogJ2ZpZWxkLXZhbGlkYXRpb24tdmFsaWQnLFxuICAgIEVSUk9SOiAnZmllbGQtdmFsaWRhdGlvbi1lcnJvcidcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9XG59OyIsImltcG9ydCB7IERPVE5FVF9DTEFTU05BTUVTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxubGV0IGVycm9yTm9kZXMgPSB7fTtcblxuZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVFcnJvclRleHROb2RlID0gKGdyb3VwLCBtc2cpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1zZyk7XG5cbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5WQUxJRCk7XG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IpO1xuICAgIFxuICAgIHJldHVybiBncm91cC5zZXJ2ZXJFcnJvck5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG59O1xuXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9IGdyb3VwTmFtZSA9PiBtb2RlbCA9PiB7XG4gICAgZXJyb3JOb2Rlc1tncm91cE5hbWVdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXJyb3JOb2Rlc1tncm91cE5hbWVdKTtcbiAgICBpZihtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUpIHtcbiAgICAgICAgbW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IpO1xuICAgICAgICBtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5WQUxJRCk7XG4gICAgfVxuICAgIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7XG4gICAgZGVsZXRlIGVycm9yTm9kZXNbZ3JvdXBOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjbGVhckVycm9ycyA9IG1vZGVsID0+IHtcbiAgICBPYmplY3Qua2V5cyhlcnJvck5vZGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjbGVhckVycm9yKG5hbWUpKG1vZGVsKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJFcnJvcnMgPSBtb2RlbCA9PiB7XG4gICAgT2JqZWN0LmtleXMobW9kZWwuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIGlmKCFtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkgcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKShtb2RlbCk7XG4gICAgfSlcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJFcnJvciA9IGdyb3VwTmFtZSA9PiBtb2RlbCA9PiB7XG4gICAgaWYoZXJyb3JOb2Rlc1tncm91cE5hbWVdKSBjbGVhckVycm9yKGdyb3VwTmFtZSkobW9kZWwpO1xuICAgIFxuICAgIGVycm9yTm9kZXNbZ3JvdXBOYW1lXSA9IFxuICAgIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSBcbiAgICAgICAgICAgID8gY3JlYXRlRXJyb3JUZXh0Tm9kZShtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXSwgbW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkgXG4gICAgICAgICAgICA6IG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdXG5cdFx0XHRcdFx0XHQuZmllbGRzW21vZGVsLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5sZW5ndGgtMV1cblx0XHRcdFx0XHRcdC5wYXJlbnROb2RlXG5cdFx0XHRcdFx0XHQuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IgfSwgbW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFx0XHRcdFx0XG5cdG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpOyB9KTtcbn07IiwiaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgQUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IFxuICAgIGdldEluaXRpYWxTdGF0ZSxcbiAgICBnZXRWYWxpZGl0eVN0YXRlLFxuICAgIGdldEdyb3VwVmFsaWRpdHlTdGF0ZSxcbiAgICByZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsXG4gICAgcmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50LFxuICAgIHJlZHVjZUVycm9yTWVzc2FnZXNcbn0gZnJvbSAnLi92YWxpZGF0b3InO1xuaW1wb3J0IHtcbiAgICBjbGVhckVycm9ycyxcbiAgICBjbGVhckVycm9yLFxuICAgIHJlbmRlckVycm9yLFxuICAgIHJlbmRlckVycm9yc1xufSAgZnJvbSAnLi9kb20nO1xuXG5jb25zdCB2YWxpZGF0ZSA9IGUgPT4ge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTtcblxuICAgIGdldFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgIC50aGVuKHZhbGlkaXR5U3RhdGUgPT4ge1xuICAgICAgICAgICAgaWYoZSAmJiBlLnRhcmdldCAmJiBbXS5jb25jYXQoLi4udmFsaWRpdHlTdGF0ZSkucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpIHJldHVybiBmb3JtLnN1Ym1pdCgpO1xuXG4gICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICBBQ1RJT05TLlZBTElEQVRJT05fRVJST1JTLFxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIGdyb3VwLCBpKSA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NbZ3JvdXBdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiB2YWxpZGl0eVN0YXRlW2ldLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHZhbGlkaXR5U3RhdGVbaV0ucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXAsIFN0b3JlLmdldFN0YXRlKCkpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbiAgICAgICAgICAgICAgICAgICAgfSwge30pLFxuICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcnNdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZWFsVGltZVZhbGlkYXRpb24oKTtcbiAgICAgICAgfSk7XG59O1xuXG5jb25zdCBhZGRNZXRob2QgPSAoZ3JvdXBOYW1lLCBtZXRob2QsIG1lc3NhZ2UpID0+IHtcbiAgICAvL2Fsc28gY2hlY2sgaWYgU3RvcmUuZ2V0U3RhdGUoKVtncm91cE5hbWVdIGV4aXN0cywgaWYgbm90IGNoZWNrIHRoYXQgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoZ3JvdXBOYW1lKS5sZW5ndGggIT09IDBcbiAgICBpZigoZ3JvdXBOYW1lID09PSB1bmRlZmluZWQgfHwgbWV0aG9kID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB8fCAhU3RvcmUuZ2V0U3RhdGUoKVtncm91cE5hbWVdICYmIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGdyb3VwTmFtZSkubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDdXN0b20gdmFsaWRhdGlvbiBtZXRob2QgY2Fubm90IGJlIGFkZGVkLicpO1xuXG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5BRERfVkFMSURBVElPTl9NRVRIT0QsIHtncm91cE5hbWUsIHZhbGlkYXRvcjoge3R5cGU6ICdjdXN0b20nLCBtZXRob2QsIG1lc3NhZ2V9fSk7XG59O1xuXG5cbmNvbnN0IHJlYWxUaW1lVmFsaWRhdGlvbiA9ICgpID0+IHtcbiAgICBsZXQgaGFuZGxlciA9IGdyb3VwTmFtZSA9PiAoKSA9PiB7XG4gICAgICAgIGlmKCFTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SLCBncm91cE5hbWUsIFtjbGVhckVycm9yKGdyb3VwTmFtZSldKTtcbiAgICAgICAgZ2V0R3JvdXBWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFyZXMucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpIFxuICAgICAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogcmVzLnJlZHVjZShyZWR1Y2VFcnJvck1lc3NhZ2VzKGdyb3VwTmFtZSwgU3RvcmUuZ2V0U3RhdGUoKSksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcihncm91cE5hbWUpXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihyZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQoaW5wdXQpLCBoYW5kbGVyKGdyb3VwTmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy87XzsgY2FuIGRvIGJldHRlcj9cbiAgICAgICAgbGV0IGVxdWFsVG9WYWxpZGF0b3IgPSBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcbiAgICAgICAgXG4gICAgICAgIGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCBcbiAgICAgICAgICAgICYmIGVxdWFsVG9WYWxpZGF0b3JbMF0ucGFyYW1zLm90aGVyLmZvckVhY2goc3ViZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgIHN1Ymdyb3VwLmZvckVhY2goaXRlbSA9PiB7IGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZXIoZ3JvdXBOYW1lKSk7IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoZm9ybSwgc2V0dGluZ3MpID0+IHtcbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFLCAoZ2V0SW5pdGlhbFN0YXRlKGZvcm0pKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB2YWxpZGF0ZSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsICgpID0+IHsgU3RvcmUudXBkYXRlKFVQREFURVMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTsgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZGF0ZSxcbiAgICAgICAgYWRkTWV0aG9kXG4gICAgfVxufTsiLCJpbXBvcnQgeyBBQ1RJT05TLCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBbQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURV06IChzdGF0ZSwgZGF0YSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIGRhdGEpLFxuICAgIFtBQ1RJT05TLkNMRUFSX0VSUk9SU106IHN0YXRlID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IFxuICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2dyb3VwXSwge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFtdLFxuICAgICAgICAgICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KVxuICAgIH0pLFxuICAgIFtBQ1RJT05TLkNMRUFSX0VSUk9SXTogKHN0YXRlLCBkYXRhKSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwcywge1xuICAgICAgICAgICAgW2RhdGFdOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZGF0YV0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5BRERfVkFMSURBVElPTl9NRVRIT0RdOiAoc3RhdGUsIGRhdGEpID0+T2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgIFtkYXRhLmdyb3VwTmFtZV06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gPyBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdIDoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdID8gIHsgdmFsaWRhdG9yczogWy4uLnN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0udmFsaWRhdG9ycywgZGF0YS52YWxpZGF0b3JdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShkYXRhLmdyb3VwTmFtZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7ZGF0YS5ncm91cE5hbWV9XWApIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBbZGF0YS52YWxpZGF0b3JdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SU106IChzdGF0ZSwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgXG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIGRhdGFbZ3JvdXBdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUl06IChzdGF0ZSwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCB7XG4gICAgICAgICAgICAgICAgW2RhdGEuZ3JvdXBdOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cF0sIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogZGF0YS5lcnJvck1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59OyIsImltcG9ydCByZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycyc7XG5sZXQgc3RhdGUgPSB7fTtcblxuLy8gd2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXyA9IFtdO1xuXG5jb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuXG5jb25zdCBkaXNwYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIG5leHRTdGF0ZSwgZWZmZWN0cykge1xuICAgIHN0YXRlID0gbmV4dFN0YXRlID8gcmVkdWNlcnNbdHlwZV0oc3RhdGUsIG5leHRTdGF0ZSkgOiBzdGF0ZTtcbiAgICAvLyB3aW5kb3cuX192YWxpZGF0b3JfaGlzdG9yeV9fLnB1c2goe1t0eXBlXTogc3RhdGV9KSwgY29uc29sZS5sb2cod2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXyk7XG4gICAgLy8gY29uc29sZS5sb2coe1t0eXBlXTogc3RhdGV9KTtcbiAgICBpZighZWZmZWN0cykgcmV0dXJuO1xuICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4geyBlZmZlY3Qoc3RhdGUpOyB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgZGlzcGF0Y2gsIGdldFN0YXRlIH07IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9jb25zdGFudHMvbWVzc2FnZXMnO1xuaW1wb3J0IHsgXG4gICAgcGlwZSxcbiAgICBpc0NoZWNrYWJsZSxcbiAgICBpc1NlbGVjdCxcbiAgICBpc0ZpbGUsXG4gICAgRE9NTm9kZXNGcm9tQ29tbWFMaXN0LFxuICAgIGV4dHJhY3RWYWx1ZUZyb21Hcm91cFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG4gICAgRE9UTkVUX0FEQVBUT1JTLFxuICAgIERPVE5FVF9QQVJBTVMsXG4gICAgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUsXG4gICAgRE9NX1NFTEVDVE9SX1BBUkFNU1xufSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zdCByZXNvbHZlUGFyYW0gPSAocGFyYW0sIGlucHV0KSA9PiB7XG4gICAgbGV0IHZhbHVlID0gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApO1xuICAgIHJldHVybiAoe1twYXJhbS5zcGxpdCgnLScpWzFdXTogISF+RE9NX1NFTEVDVE9SX1BBUkFNUy5pbmRleE9mKHBhcmFtKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IERPTU5vZGVzRnJvbUNvbW1hTGlzdCh2YWx1ZSwgaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZSB9KVxufTtcblxuY29uc3QgZXh0cmFjdFBhcmFtcyA9IChpbnB1dCwgYWRhcHRvcikgPT4gRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB7IHBhcmFtczogRE9UTkVUX1BBUkFNU1thZGFwdG9yXS5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSA/IE9iamVjdC5hc3NpZ24oYWNjLCByZXNvbHZlUGFyYW0ocGFyYW0sIGlucHV0KSkgOiBhY2MsIHt9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgICAgXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlMucmVkdWNlKCh2YWxpZGF0b3JzLCBhZGFwdG9yKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9ycyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWy4uLnZhbGlkYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhZGFwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UGFyYW1zKGlucHV0LCBhZGFwdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKTtcblxuY29uc3QgZXh0cmFjdEF0dHJWYWxpZGF0b3JzID0gaW5wdXQgPT4gcGlwZShlbWFpbChpbnB1dCksIHVybChpbnB1dCksIG51bWJlcihpbnB1dCksIG1pbmxlbmd0aChpbnB1dCksIG1heGxlbmd0aChpbnB1dCksIG1pbihpbnB1dCksIG1heChpbnB1dCksIHBhdHRlcm4oaW5wdXQpLCByZXF1aXJlZChpbnB1dCkpO1xuXG4vL3VuLURSWS4uLlxuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuaGFzQXR0cmlidXRlKCdyZXF1aXJlZCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPT0gJ2ZhbHNlJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3JlcXVpcmVkJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IGVtYWlsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnZW1haWwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgdXJsID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAndXJsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3VybCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBudW1iZXIgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdudW1iZXInID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbnVtYmVyJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbmxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbmxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4bGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4bGVuZ3RoJywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW4nLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4Jyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgcGF0dGVybiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyl9fV0gOiB2YWxpZGF0b3JzO1xuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdjdXN0b20nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbWV0aG9kc1snY3VzdG9tJ10odmFsaWRhdG9yLm1ldGhvZCwgZ3JvdXApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyk7XG5cbmV4cG9ydCBjb25zdCBhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgbGV0IG5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICByZXR1cm4gYWNjW25hbWVdID0gYWNjW25hbWVdID8gT2JqZWN0LmFzc2lnbihhY2NbbmFtZV0sIHsgZmllbGRzOiBbLi4uYWNjW25hbWVdLmZpZWxkcywgaW5wdXRdfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yczogbm9ybWFsaXNlVmFsaWRhdG9ycyhpbnB1dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiBbaW5wdXRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XWApIHx8IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG59O1xuXG5jb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gdmFsaWRhdG9yID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbmV4cG9ydCBjb25zdCByZWR1Y2VFcnJvck1lc3NhZ2VzID0gKGdyb3VwLCBzdGF0ZSkgPT4gKGFjYywgdmFsaWRpdHksIGopID0+IHtcbiAgICByZXR1cm4gdmFsaWRpdHkgPT09IHRydWUgXG4gICAgICAgICAgICAgICAgPyBhY2MgXG4gICAgICAgICAgICAgICAgOiBbLi4uYWNjLCB0eXBlb2YgdmFsaWRpdHkgPT09ICdib29sZWFuJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3RFcnJvck1lc3NhZ2Uoc3RhdGUuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsaWRpdHldO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJbml0aWFsU3RhdGUgPSBmb3JtID0+ICh7XG4gICAgZ3JvdXBzOiByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKFtdLnNsaWNlLmNhbGwoZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKVxufSk7XG5cbmV4cG9ydCBjb25zdCByZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUgPSAoYWNjLCBjdXJyKSA9PiB7XG4gICAgaWYoY3VyciAhPT0gdHJ1ZSkgYWNjID0gZmFsc2U7XG4gICAgcmV0dXJuIGFjYzsgXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsaWRpdHlTdGF0ZSA9IGdyb3VwcyA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBPYmplY3Qua2V5cyhncm91cHMpXG4gICAgICAgICAgICAubWFwKGdyb3VwID0+IGdldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cHNbZ3JvdXBdKSlcbiAgICAgICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRHcm91cFZhbGlkaXR5U3RhdGUgPSBncm91cCA9PiB7XG4gICAgbGV0IGhhc0Vycm9yID0gZmFsc2U7XG5cdHJldHVybiBQcm9taXNlLmFsbChncm91cC52YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBpZih2YWxpZGF0b3IudHlwZSAhPT0gJ3JlbW90ZScpe1xuICAgICAgICAgICAgICAgIGlmKHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpKSByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZihoYXNFcnJvcikgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB2YWxpZGF0ZShncm91cCwgdmFsaWRhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHsgcmVzb2x2ZShyZXMpO30pO1xuICAgICAgICB9KTtcbiAgICB9KSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07IiwiaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKChwYXJhbXMudHlwZSAhPT0gJ2dldCcgPyBwYXJhbXMudXJsIDogYCR7cGFyYW1zLnVybH0/JHtyZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKX1gKSwge1xuICAgICAgICAgICAgbWV0aG9kOiBwYXJhbXMudHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7IHJlc29sdmUoZGF0YSk7IH0pXG4gICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKGBTZXJ2ZXIgZXJyb3I6ICR7cmVzfWApOyB9KTtcbiAgICB9KSxcbiAgICBjdXN0b206IChtZXRob2QsIGdyb3VwKSA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IG1ldGhvZChleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApLCBncm91cC5maWVsZHMpXG59OyIsImV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSAobGlzdCwgaW5wdXQpID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRTZWxlY3RvciA9IGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGFwcGVuZFN0YXRlUHJlZml4KGl0ZW0sIGdldFN0YXRlUHJlZml4KGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7cmVzb2x2ZWRTZWxlY3Rvcn1dYCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbmNvbnN0IGVzY2FwZUF0dHJpYnV0ZVZhbHVlID0gdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgvKFshXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxcXFxcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIpO1xuXG5jb25zdCBnZXRTdGF0ZVByZWZpeCA9IGZpZWxkTmFtZSA9PiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG5cbmNvbnN0IGFwcGVuZFN0YXRlUHJlZml4ID0gKHZhbHVlLCBwcmVmaXgpID0+IHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIiouXCIpID09PSAwKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIqLlwiLCBwcmVmaXgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZWxzZSByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTsiXX0=
