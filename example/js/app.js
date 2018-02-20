(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    var validator = _component2.default.init('form');

    console.log(validator);

    // validator.addMethod(
    //     'RequiredString',
    //     (value, fields, params) => {
    //         return value === 'test';
    //     },
    //     'Value must equal "test"'
    // );

    // validator.addMethod(
    //     'CustomValidator',
    //     (value, fields, params) => {
    //         return value === 'test 2';
    //     },
    //     'Value must equal "test 2"'
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

	//if we think candidate is a form DOM node, pass it in an Array
	//otherwise convert candidate to an array of Nodes using it as a DOM query 
	if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

	if (els.length === 1 && window.__validators__ && window.__validators__[els[0]]) return window.__validators__[els[0]];

	//return instance if one exists for candidate passed to init
	//if inititialised using StormVaidation.init({sel}) the instance already exists thanks to auto-init
	//but reference may be wanted for invoking API methods
	//also for repeat initialisations
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

//data-attribute added to error message span created by .NET MVC
var DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = exports.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = 'data-valmsg-for';

//validator parameters that require DOM lookup
var DOM_SELECTOR_PARAMS = exports.DOM_SELECTOR_PARAMS = ['remote-additionalfields', 'equalto-other'];

//.NET MVC validator data-attribute parameters indexed by their validators
//e.g. <input data-val-length="Error messge" data-val-length-min="8" data-val-length-max="10" type="text"... />
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

//.NET MVC data-attributes that identify validators
var DOTNET_ADAPTORS = exports.DOTNET_ADAPTORS = ['required', 'stringlength', 'regex',
// 'digits',
'email', 'number', 'url', 'length', 'minlength', 'range', 'equalto', 'remote'];

//classNames added/updated on .NET MVC error message span
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

//Track error message DOM nodes in local scope
var errorNodes = {};

/**
 * Hypertext DOM factory function
 * 
 * @param nodeName [String]
 * @param attributes [Object]
 * @param text [String] The innerText of the new node
 * 
 * @returns node [DOM node]
 * 
 */
var h = exports.h = function h(nodeName, attributes, text) {
    var node = document.createElement(nodeName);

    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }
    if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

/**
 * Creates and appends a text node error message to a  error container DOM node for a group
 * 
 * @param group [Object, vaidation group] 
 * @param msg [String] The error message
 * 
 * @returns node [Text node]
 * 
 */
var createErrorTextNode = exports.createErrorTextNode = function createErrorTextNode(group, msg) {
    var node = document.createTextNode(msg);

    group.serverErrorNode.classList.remove(_constants.DOTNET_CLASSNAMES.VALID);
    group.serverErrorNode.classList.add(_constants.DOTNET_CLASSNAMES.ERROR);

    return group.serverErrorNode.appendChild(node);
};

/**
 * Removes the error message DOM node, updates .NET MVC error span classNames and deletes the 
 * error from local errorNodes tracking object
 * 
 * Signature () => groupName => state => {}
 * (Curried groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, vaidation group] 
 * @param state [Object, validation state]
 * 
 */
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

/**
 * Iterates over all errorNodes in local scope to remove each error prior to re-validation
 * 
 * @param state [Object, validation state]
 * 
 */
var clearErrors = exports.clearErrors = function clearErrors(state) {
    Object.keys(errorNodes).forEach(function (name) {
        clearError(name)(state);
    });
};

/**
 * Iterates over all groups to render each error post-vaidation
 * 
 * @param state [Object, validation state]
 * 
 */
var renderErrors = exports.renderErrors = function renderErrors(state) {
    Object.keys(state.groups).forEach(function (groupName) {
        if (!state.groups[groupName].valid) renderError(groupName)(model);
    });
};

/**
 * Adds an error message to the DOM and saves it to local scope
 * 
 * If .NET MVC error span is present, it is used with a appended textNode,
 * if not a new DOM node is created
 * 
 * Signature () => groupName => state => {}
 * (Curried groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, vaidation group] 
 * @param state [Object, validation state]
 * 
 */
var renderError = exports.renderError = function renderError(groupName) {
    return function (state) {
        if (errorNodes[groupName]) clearError(groupName)(state);

        errorNodes[groupName] = state.groups[groupName].serverErrorNode ? createErrorTextNode(model.groups[groupName], state.groups[groupName].errorMessages[0]) : state.groups[groupName].fields[state.groups[groupName].fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));

        state.groups[groupName].fields.forEach(function (field) {
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

/**
 * Returns a function that extracts the validityState of the entire form
 * can be used as a form submit eventListener or via the API
 * 
 * Submits the form if called as a submit eventListener and is valid
 * Dispatches error state to Store if errors
 * 
 * @param form [DOM node]
 * 
 * @returns [boolean] The validity state of the form
 * 
 */
var validate = function validate(form) {
    return function (e) {
        e && e.preventDefault();
        _store2.default.dispatch(_constants.ACTIONS.CLEAR_ERRORS, null, [_dom.clearErrors]);

        (0, _validator.getValidityState)(_store2.default.getState().groups).then(function (validityState) {
            var _ref;

            if ((_ref = []).concat.apply(_ref, _toConsumableArray(validityState)).reduce(_validator.reduceGroupValidityState, true)) {
                if (e && e.target) form.submit();
                return true;
            }

            _store2.default.dispatch(_constants.ACTIONS.VALIDATION_ERRORS, Object.keys(_store2.default.getState().groups).reduce(function (acc, group, i) {
                return acc[group] = {
                    valid: validityState[i].reduce(_validator.reduceGroupValidityState, true),
                    errorMessages: validityState[i].reduce((0, _validator.reduceErrorMessages)(group, _store2.default.getState()), [])
                }, acc;
            }, {}), [_dom.renderErrors]);

            realTimeValidation();
            return false;
        });
    };
};

/**
 * Adds a custom validation method to the validation model, used via the API
 * Dispatches add validation method to store to update the validators in a group
 * 
 * @param groupName [String] The name attribute shared by the DOm nodes in the group
 * @param method [Function] The validation method (function that returns true or false) that us called on the group
 * @param message [String] Te error message displayed if the validation method returns false
 * 
 */
var addMethod = function addMethod(groupName, method, message) {
    if (groupName === undefined || method === undefined || message === undefined || !_store2.default.getState()[groupName] && document.getElementsByName(groupName).length === 0) return console.warn('Custom validation method cannot be added.');

    _store2.default.dispatch(_constants.ACTIONS.ADD_VALIDATION_METHOD, { groupName: groupName, validator: { type: 'custom', method: method, message: message } });
};

/**
 * Starts real-time validation on each group, adding an eventListener to each field 
 * that resets the validityState for the field's group and acquires the new validity state
 * 
 * The event that triggers validation is defined by the field type
 * 
 * Only if the new validityState is invalid is the validation error object 
 * dispatched to the store to update state and render the error
 * 
 */
var realTimeValidation = function realTimeValidation() {
    var handler = function handler(groupName) {
        return function () {
            if (!_store2.default.getState().groups[groupName].valid) {
                _store2.default.dispatch(_constants.ACTIONS.CLEAR_ERROR, groupName, [(0, _dom.clearError)(groupName)]);
            }

            (0, _validator.getGroupValidityState)(_store2.default.getState().groups[groupName]).then(function (res) {
                if (!res.reduce(_validator.reduceGroupValidityState, true)) {
                    _store2.default.dispatch(_constants.ACTIONS.VALIDATION_ERROR, {
                        group: groupName,
                        errorMessages: res.reduce((0, _validator.reduceErrorMessages)(groupName, _store2.default.getState()), [])
                    }, [(0, _dom.renderError)(groupName)]);
                }
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

        if (equalToValidator.length > 0) {
            equalToValidator[0].params.other.forEach(function (subgroup) {
                subgroup.forEach(function (item) {
                    item.addEventListener('blur', handler(groupName));
                });
            });
        }
    });
};

/**
 * Default function, sets initial state and adds form-level event listeners
 * 
 * @param form [DOM node] the form to validate
 * 
 * @returns [Object] The API for the instance
 * *
 */

exports.default = function (form) {
    _store2.default.dispatch(_constants.ACTIONS.SET_INITIAL_STATE, (0, _validator.getInitialState)(form));
    form.addEventListener('submit', validate(form));
    form.addEventListener('reset', function () {
        _store2.default.update(UPDATES.CLEAR_ERRORS, null, [_dom.clearErrors]);
    });

    return {
        validate: validate(form),
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

/**
 * All state/model-modifying operations
 */
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

//shared centralised validator state
var state = {};

//uncomment for debugging by writing state history to window
// window.__validator_history__ = [];

//state getter
var getState = function getState() {
  return state;
};

/**
 * Create next state by invoking reducer on current state
 * 
 * Execute side effects of state update, as passed in the update
 * 
 * @param type [String] 
 * @param nextState [Object] New slice of state to combine with current state to create next state
 * @param effects [Array] Array of functions to invoke after state update (DOM, operations, cmds...)
 */
var dispatch = function dispatch(type, nextState, effects) {
  state = nextState ? _reducers2.default[type](state, nextState) : state;
  //uncomment for debugging by writing state history to window
  // window.__validator_history__.push({[type]: state}), console.log(window.__validator_history__);
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

/**
 * Resolve validation parameter to a string or array of DOM nodes
 * 
 * @param param [String] identifier for the data-attribute `data-val-${param}`
 * @param input [DOM node] the node which contains the data-val- attribute
 * 
 * @return validation param [Object] indexed by second part of param name (e.g., 'min' part of length-min') and array of DOM nodes or a string
 */
var resolveParam = function resolveParam(param, input) {
    var value = input.getAttribute('data-val-' + param);
    return _defineProperty({}, param.split('-')[1], !!~_constants.DOM_SELECTOR_PARAMS.indexOf(param) ? (0, _utils.DOMNodesFromCommaList)(value, input) : value);
};

/**
 * Looks up the data-val property against the known .NET MVC adaptors/validation method
 * runs the matches against the node to find param values, and returns an Object containing all  parameters for that adaptor/validation method
 * 
 * @param input [DOM node] the node on which to look for matching adaptors
 * @param adaptor [String] .NET MVC data-attribute that identifies validator
 * 
 * @return validation params [Object] Validation param object containing all validation parameters for an adaptor/validation method
 */
var extractParams = function extractParams(input, adaptor) {
    return _constants.DOTNET_PARAMS[adaptor] ? {
        params: _constants.DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
            return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input)) : acc;
        }, {})
    } : false;
};

/**
 * Reducer that takes all know .NET MVC adaptors (data-attributes that specifiy a validation method that should be papiied to the node)
 * and checks against a DOM node for matches, returning an array of validators
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array], each validator compposed of 
 *                              type [String] naming the validator and matching it to validation method function
 *                              message [String] the error message displayed if the validation method returns false
 *                              params [Object] (optional) 
 */
var extractDataValValidators = function extractDataValValidators(input) {
    return _constants.DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
            type: adaptor,
            message: input.getAttribute('data-val-' + adaptor) }, extractParams(input, adaptor))]);
    }, []);
};

/**
 * Pipes an input through a series of validator checks (fns directly below) to extract array of validators based on HTML5 attributes
 * so HTML5 constraints validation is not used, we use the same validation methods as .NET MVC validation
 * 
 * If we are to actually use the Constraint Validation API we would not need to assemble this validator array...
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array]
 */
var extractAttrValidators = function extractAttrValidators(input) {
    return (0, _utils.pipe)(email(input), url(input), number(input), minlength(input), maxlength(input), min(input), max(input), pattern(input), required(input));
};

/**
 * Validator checks to extract validators based on HTML5 attributes
 * 
 * Each function is curried so we can seed each fn with an input and pipe the result array through each function
 * Signature: inputDOMNode => validatorArray => updateValidatorArray
 */
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

/**
 * Takes an input and returns the array of validators based on either .NET MVC data-val- or HTML5 attributes
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array]
 */
var normaliseValidators = exports.normaliseValidators = function normaliseValidators(input) {
    return input.getAttribute('data-val') === 'true' ? extractDataValValidators(input) : extractAttrValidators(input);
};

/**
 * Calls a validation method against an input group
 * 
 * @param group [Array] DOM nodes with the same name attribute
 * @param validator [String] The type of validator matching it to validation method function
 * 
 */
var validate = exports.validate = function validate(group, validator) {
    return validator.type === 'custom' ? _methods2.default['custom'](validator.method, group) : _methods2.default[validator.type](group, validator.params);
};

/**
 * Reducer constructing an validation Object for a group of DOM nodes
 * 
 * @param input [DOM node]
 * 
 * @returns validation object [Object] consisting of
 *                            valid [Boolean] the validityState of the group
 *                            validators [Array] of validator objects
 *                            fields [Array] DOM nodes in the group
 *                            serverErrorNode [DOM node] .NET MVC server-rendered error message span
 * 
 */
var assembleValidationGroup = exports.assembleValidationGroup = function assembleValidationGroup(acc, input) {
    var name = input.getAttribute('name');
    return acc[name] = acc[name] ? Object.assign(acc[name], { fields: [].concat(_toConsumableArray(acc[name].fields), [input]) }) : {
        valid: false,
        validators: normaliseValidators(input),
        fields: [input],
        serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + input.getAttribute('name') + ']') || false
    }, acc;
};

/**
 * Returns an error message property of the validator Object that has returned false or the corresponding default message
 * 
 * @param validator [Object] 
 * 
 * @return message [String] error message
 * 
 */
var extractErrorMessage = function extractErrorMessage(validator) {
    return validator.message || _messages2.default[validator.type](validator.params !== undefined ? validator.params : null);
};

/**
 * Curried function that returns a reducer that reduces the resolved response from an array of validation Promises performed against a group
 * into an array of error messages or an empty array
 * 
 * @return error messages [Array]
 * 
 */
var reduceErrorMessages = exports.reduceErrorMessages = function reduceErrorMessages(group, state) {
    return function (acc, validity, j) {
        return validity === true ? acc : [].concat(_toConsumableArray(acc), [typeof validity === 'boolean' ? extractErrorMessage(state.groups[group].validators[j]) : validity]);
    };
};

/**
 * From all groups found in the current form, thosethat do not require validation (have no assocated validators) are removed
 * 
 * @param groups [Object] name-indexed object consisting of all groups found in the current form
 * 
 * @return groups [Object] name-indexed object consisting of all validatable groups
 * 
 */
var removeUnvalidatableGroups = exports.removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

/**
 * Takes a form DOM node and returns the initial form validation state - an object consisting of all the validatable input groups
 * with validityState, fields, validators, and associated data required to perform validation and render errors.
 * 
 * @param form [DOM nodes] 
 * 
 * @return state [Object] consisting of groups [Object] name-indexed validation groups
 * 
 */
var getInitialState = exports.getInitialState = function getInitialState(form) {
    return {
        groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}))
    };
};

/**
 * Reducer run against an array of resolved validation promises to set the overall validityState of a group
 * 
 * @return validityState [Boolean] 
 * 
 */
var reduceGroupValidityState = exports.reduceGroupValidityState = function reduceGroupValidityState(acc, curr) {
    if (curr !== true) acc = false;
    return acc;
};

/**
 * Aggregates validation promises for all groups into a single promise
 * 
 * @params groups [Object]
 * 
 * @return validation results [Promise] aggregated promise
 * 
 */
var getValidityState = exports.getValidityState = function getValidityState(groups) {
    return Promise.all(Object.keys(groups).map(function (group) {
        return getGroupValidityState(groups[group]);
    }));
};

/**
 * Aggregates all of the validation promises for a sinlge group into a single promise
 * 
 * @params groups [Object]
 * 
 * @return validation results [Promise] aggregated promise
 * 
 */
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

/**
 * Determines the event type to be used for real-time validation a given field based on field type
 * 
 * @params input [DOM node]
 * 
 * @return event type [String]
 * 
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb25zdGFudHMvZGVmYXVsdHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kb20vaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvcmVkdWNlcnMvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvc3RvcmUvaW5kZXguanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdmFsaWRhdG9yL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3ZhbGlkYXRvci9tZXRob2RzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3ZhbGlkYXRvci91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQztRQUFJLFlBQVksb0JBQUEsQUFBUyxLQUF6QixBQUFnQixBQUFjLEFBRTlCOztZQUFBLEFBQVEsSUFBUixBQUFZLEFBRVo7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFyQkQsQUFBZ0MsQ0FBQTs7QUF1QmhDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMs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LE1BQUEsQUFBTSxPQUFOLEFBQWEsT0FBYixBQUFvQixtQkFEcEIsQUFDQSxBQUF1QyxNQUN2QyxNQUFBLEFBQU0sT0FBTixBQUFhLG1CQUZ0QixBQUVTLEFBQWdDO0FBRnZFOztBQUlBLElBQU0sd0JBQVEsU0FBUixBQUFRLE1BQUEsQUFBQyxLQUFELEFBQU0sT0FBVSxBQUNqQztlQUFPLEFBQUksUUFBUSxVQUFBLEFBQUMsU0FBRCxBQUFVLFFBQVcsQUFDcEM7WUFBSSxNQUFNLElBQVYsQUFBVSxBQUFJLEFBQ2Q7WUFBQSxBQUFJLEtBQUssTUFBQSxBQUFNLFVBQWYsQUFBeUIsT0FBekIsQUFBZ0MsQUFDaEM7WUFBSSxNQUFKLEFBQVUsU0FBUyxBQUNmO21CQUFBLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFNBQWxCLEFBQTJCLFFBQVEsZUFBTyxBQUN0QztvQkFBQSxBQUFJLGlCQUFKLEFBQXFCLEtBQUssTUFBQSxBQUFNLFFBQWhDLEFBQTBCLEFBQWMsQUFDM0M7QUFGRCxBQUdIO0FBQ0Q7WUFBQSxBQUFJLFNBQVMsWUFBTSxBQUNmO2dCQUFJLElBQUEsQUFBSSxVQUFKLEFBQWMsT0FBTyxJQUFBLEFBQUksU0FBN0IsQUFBc0MsS0FBSyxRQUFRLElBQW5ELEFBQTJDLEFBQVksZUFDbEQsT0FBTyxJQUFQLEFBQVcsQUFDbkI7QUFIRCxBQUlBO1lBQUEsQUFBSSxVQUFVLFlBQUE7bUJBQU0sT0FBTyxJQUFiLEFBQU0sQUFBVztBQUEvQixBQUNBO1lBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxBQUNsQjtBQWRELEFBQU8sQUFlVixLQWZVO0FBREoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIGxldCB2YWxpZGF0b3IgPSBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG5cbiAgICBjb25zb2xlLmxvZyh2YWxpZGF0b3IpO1xuXG4gICAgLy8gdmFsaWRhdG9yLmFkZE1ldGhvZChcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbiAgICAvLyB2YWxpZGF0b3IuYWRkTWV0aG9kKFxuICAgIC8vICAgICAnQ3VzdG9tVmFsaWRhdG9yJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCAyJztcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgJ1ZhbHVlIG11c3QgZXF1YWwgXCJ0ZXN0IDJcIidcbiAgICAvLyApO1xuXG59XTtcblxueyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0iLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvY29uc3RhbnRzL2RlZmF1bHRzJztcbmltcG9ydCBmYWN0b3J5IGZyb20gJy4vbGliJztcblxuY29uc3QgaW5pdCA9IChjYW5kaWRhdGUsIG9wdHMpID0+IHtcblx0bGV0IGVscztcblx0XG5cdC8vaWYgd2UgdGhpbmsgY2FuZGlkYXRlIGlzIGEgZm9ybSBET00gbm9kZSwgcGFzcyBpdCBpbiBhbiBBcnJheVxuXHQvL290aGVyd2lzZSBjb252ZXJ0IGNhbmRpZGF0ZSB0byBhbiBhcnJheSBvZiBOb2RlcyB1c2luZyBpdCBhcyBhIERPTSBxdWVyeSBcblx0aWYodHlwZW9mIGNhbmRpZGF0ZSAhPT0gJ3N0cmluZycgJiYgY2FuZGlkYXRlLm5vZGVOYW1lICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nKSBlbHMgPSBbY2FuZGlkYXRlXTtcblx0ZWxzZSBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FuZGlkYXRlKSk7XG5cdFxuXHRpZihlbHMubGVuZ3RoID09PSAxICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyAmJiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXSlcblx0XHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL3JldHVybiBpbnN0YW5jZSBpZiBvbmUgZXhpc3RzIGZvciBjYW5kaWRhdGUgcGFzc2VkIHRvIGluaXRcblx0Ly9pZiBpbml0aXRpYWxpc2VkIHVzaW5nIFN0b3JtVmFpZGF0aW9uLmluaXQoe3NlbH0pIHRoZSBpbnN0YW5jZSBhbHJlYWR5IGV4aXN0cyB0aGFua3MgdG8gYXV0by1pbml0XG5cdC8vYnV0IHJlZmVyZW5jZSBtYXkgYmUgd2FudGVkIGZvciBpbnZva2luZyBBUEkgbWV0aG9kc1xuXHQvL2Fsc28gZm9yIHJlcGVhdCBpbml0aWFsaXNhdGlvbnNcblx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyA9IFxuXHRcdE9iamVjdC5hc3NpZ24oe30sIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXywgZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpKSkpO1xuXHRcdFx0cmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJleHBvcnQgZGVmYXVsdCB7fTsiLCJleHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBFTlRFUjogMTNcbn07XG5cbmV4cG9ydCBjb25zdCBBQ1RJT05TID0ge1xuICAgIFNFVF9JTklUSUFMX1NUQVRFOiAnU0VUX0lOSVRJQUxfU1RBVEUnLFxuICAgIENMRUFSX0VSUk9SUzogJ0NMRUFSX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUlM6ICdWQUxJREFUSU9OX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUjogJ1ZBTElEQVRJT05fRVJST1InLFxuICAgIENMRUFSX0VSUk9SOiAnQ0xFQVJfRVJST1InLFxuICAgIEFERF9WQUxJREFUSU9OX01FVEhPRDogJ0FERF9WQUxJREFUSU9OX01FVEhPRCdcbn07XG5cbi8vaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuZXhwb3J0IGNvbnN0IEVNQUlMX1JFR0VYID0gL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG5cbi8vaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG5leHBvcnQgY29uc3QgVVJMX1JFR0VYID0gL14oPzooPzooPzpodHRwcz98ZnRwKTopP1xcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ISg/OjEwfDEyNykoPzpcXC5cXGR7MSwzfSl7M30pKD8hKD86MTY5XFwuMjU0fDE5MlxcLjE2OCkoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZl17Mix9KSkuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC9pO1xuXG5leHBvcnQgY29uc3QgREFURV9JU09fUkVHRVggPSAvXlxcZHs0fVtcXC9cXC1dKDA/WzEtOV18MVswMTJdKVtcXC9cXC1dKDA/WzEtOV18WzEyXVswLTldfDNbMDFdKSQvO1xuXG5leHBvcnQgY29uc3QgTlVNQkVSX1JFR0VYID0gL14oPzotP1xcZCt8LT9cXGR7MSwzfSg/OixcXGR7M30pKyk/KD86XFwuXFxkKyk/JC87XG5cbmV4cG9ydCBjb25zdCBESUdJVFNfUkVHRVggPSAvXlxcZCskLztcblxuLy9kYXRhLWF0dHJpYnV0ZSBhZGRlZCB0byBlcnJvciBtZXNzYWdlIHNwYW4gY3JlYXRlZCBieSAuTkVUIE1WQ1xuZXhwb3J0IGNvbnN0IERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFID0gJ2RhdGEtdmFsbXNnLWZvcic7XG5cbi8vdmFsaWRhdG9yIHBhcmFtZXRlcnMgdGhhdCByZXF1aXJlIERPTSBsb29rdXBcbmV4cG9ydCBjb25zdCBET01fU0VMRUNUT1JfUEFSQU1TID0gWydyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdlcXVhbHRvLW90aGVyJ107XG5cbi8vLk5FVCBNVkMgdmFsaWRhdG9yIGRhdGEtYXR0cmlidXRlIHBhcmFtZXRlcnMgaW5kZXhlZCBieSB0aGVpciB2YWxpZGF0b3JzXG4vL2UuZy4gPGlucHV0IGRhdGEtdmFsLWxlbmd0aD1cIkVycm9yIG1lc3NnZVwiIGRhdGEtdmFsLWxlbmd0aC1taW49XCI4XCIgZGF0YS12YWwtbGVuZ3RoLW1heD1cIjEwXCIgdHlwZT1cInRleHRcIi4uLiAvPlxuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ2xlbmd0aC1taW4nLCAnbGVuZ3RoLW1heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbHRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdyZW1vdGUtdHlwZSddLy8/P1xufTtcblxuLy8uTkVUIE1WQyBkYXRhLWF0dHJpYnV0ZXMgdGhhdCBpZGVudGlmeSB2YWxpZGF0b3JzXG5leHBvcnQgY29uc3QgRE9UTkVUX0FEQVBUT1JTID0gW1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ3N0cmluZ2xlbmd0aCcsXG4gICAgJ3JlZ2V4JyxcbiAgICAvLyAnZGlnaXRzJyxcbiAgICAnZW1haWwnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdsZW5ndGgnLFxuICAgICdtaW5sZW5ndGgnLFxuICAgICdyYW5nZScsXG4gICAgJ2VxdWFsdG8nLFxuICAgICdyZW1vdGUnLC8vc2hvdWxkIGJlIGxhc3RcbiAgICAvLyAncGFzc3dvcmQnIC8vLT4gbWFwcyB0byBtaW4sIG5vbmFscGhhbWFpbiwgYW5kIHJlZ2V4IG1ldGhvZHNcbl07XG5cbi8vY2xhc3NOYW1lcyBhZGRlZC91cGRhdGVkIG9uIC5ORVQgTVZDIGVycm9yIG1lc3NhZ2Ugc3BhblxuZXhwb3J0IGNvbnN0IERPVE5FVF9DTEFTU05BTUVTID0ge1xuICAgIFZBTElEOiAnZmllbGQtdmFsaWRhdGlvbi12YWxpZCcsXG4gICAgRVJST1I6ICdmaWVsZC12YWxpZGF0aW9uLWVycm9yJ1xufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQoKSB7IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nOyB9ICxcbiAgICBlbWFpbCgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLic7IH0sXG4gICAgcGF0dGVybigpIHsgcmV0dXJuICdUaGUgdmFsdWUgbXVzdCBtYXRjaCB0aGUgcGF0dGVybi4nOyB9LFxuICAgIHVybCgpeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC4nOyB9LFxuICAgIGRhdGUoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZS4nOyB9LFxuICAgIGRhdGVJU08oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZGF0ZSAoSVNPKS4nOyB9LFxuICAgIG51bWJlcigpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuJzsgfSxcbiAgICBkaWdpdHMoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIG9ubHkgZGlnaXRzLic7IH0sXG4gICAgbWF4bGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIG5vIG1vcmUgdGhhbiAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWlubGVuZ3RoKHByb3BzKSB7IHJldHVybiBgUGxlYXNlIGVudGVyIGF0IGxlYXN0ICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtYXgocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAke1twcm9wc119LmA7IH0sXG4gICAgbWluKHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtwcm9wc30uYH0sXG4gICAgZXF1YWxUbygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgdGhlIHNhbWUgdmFsdWUgYWdhaW4uJzsgfSxcbiAgICByZW1vdGUoKSB7IHJldHVybiAnUGxlYXNlIGZpeCB0aGlzIGZpZWxkLic7IH1cbn07IiwiaW1wb3J0IHsgRE9UTkVUX0NMQVNTTkFNRVMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vL1RyYWNrIGVycm9yIG1lc3NhZ2UgRE9NIG5vZGVzIGluIGxvY2FsIHNjb3BlXG5sZXQgZXJyb3JOb2RlcyA9IHt9O1xuXG4vKipcbiAqIEh5cGVydGV4dCBET00gZmFjdG9yeSBmdW5jdGlvblxuICogXG4gKiBAcGFyYW0gbm9kZU5hbWUgW1N0cmluZ11cbiAqIEBwYXJhbSBhdHRyaWJ1dGVzIFtPYmplY3RdXG4gKiBAcGFyYW0gdGV4dCBbU3RyaW5nXSBUaGUgaW5uZXJUZXh0IG9mIHRoZSBuZXcgbm9kZVxuICogXG4gKiBAcmV0dXJucyBub2RlIFtET00gbm9kZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICB9XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBhcHBlbmRzIGEgdGV4dCBub2RlIGVycm9yIG1lc3NhZ2UgdG8gYSAgZXJyb3IgY29udGFpbmVyIERPTSBub2RlIGZvciBhIGdyb3VwXG4gKiBcbiAqIEBwYXJhbSBncm91cCBbT2JqZWN0LCB2YWlkYXRpb24gZ3JvdXBdIFxuICogQHBhcmFtIG1zZyBbU3RyaW5nXSBUaGUgZXJyb3IgbWVzc2FnZVxuICogXG4gKiBAcmV0dXJucyBub2RlIFtUZXh0IG5vZGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSAoZ3JvdXAsIG1zZykgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobXNnKTtcblxuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgXG4gICAgcmV0dXJuIGdyb3VwLnNlcnZlckVycm9yTm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZXJyb3IgbWVzc2FnZSBET00gbm9kZSwgdXBkYXRlcyAuTkVUIE1WQyBlcnJvciBzcGFuIGNsYXNzTmFtZXMgYW5kIGRlbGV0ZXMgdGhlIFxuICogZXJyb3IgZnJvbSBsb2NhbCBlcnJvck5vZGVzIHRyYWNraW5nIG9iamVjdFxuICogXG4gKiBTaWduYXR1cmUgKCkgPT4gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHt9XG4gKiAoQ3VycmllZCBncm91cE5hbWUgZm9yIGVhc2Ugb2YgdXNlIGFzIGV2ZW50TGlzdGVuZXIgYW5kIGluIHdob2xlIGZvcm0gaXRlcmF0aW9uKVxuICogXG4gKiBAcGFyYW0gZ3JvdXBOYW1lIFtTdHJpbmcsIHZhaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9IGdyb3VwTmFtZSA9PiBzdGF0ZSA9PiB7XG4gICAgZXJyb3JOb2Rlc1tncm91cE5hbWVdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZXJyb3JOb2Rlc1tncm91cE5hbWVdKTtcbiAgICBpZihzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUpIHtcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IpO1xuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5WQUxJRCk7XG4gICAgfVxuICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgZmllbGQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTsgfSk7XG4gICAgZGVsZXRlIGVycm9yTm9kZXNbZ3JvdXBOYW1lXTtcbn07XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgZXJyb3JOb2RlcyBpbiBsb2NhbCBzY29wZSB0byByZW1vdmUgZWFjaCBlcnJvciBwcmlvciB0byByZS12YWxpZGF0aW9uXG4gKiBcbiAqIEBwYXJhbSBzdGF0ZSBbT2JqZWN0LCB2YWxpZGF0aW9uIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBPYmplY3Qua2V5cyhlcnJvck5vZGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjbGVhckVycm9yKG5hbWUpKHN0YXRlKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgZ3JvdXBzIHRvIHJlbmRlciBlYWNoIGVycm9yIHBvc3QtdmFpZGF0aW9uXG4gKiBcbiAqIEBwYXJhbSBzdGF0ZSBbT2JqZWN0LCB2YWxpZGF0aW9uIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCByZW5kZXJFcnJvcnMgPSBzdGF0ZSA9PiB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIGlmKCFzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkgcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKShtb2RlbCk7XG4gICAgfSlcbn07XG5cbi8qKlxuICogQWRkcyBhbiBlcnJvciBtZXNzYWdlIHRvIHRoZSBET00gYW5kIHNhdmVzIGl0IHRvIGxvY2FsIHNjb3BlXG4gKiBcbiAqIElmIC5ORVQgTVZDIGVycm9yIHNwYW4gaXMgcHJlc2VudCwgaXQgaXMgdXNlZCB3aXRoIGEgYXBwZW5kZWQgdGV4dE5vZGUsXG4gKiBpZiBub3QgYSBuZXcgRE9NIG5vZGUgaXMgY3JlYXRlZFxuICogXG4gKiBTaWduYXR1cmUgKCkgPT4gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHt9XG4gKiAoQ3VycmllZCBncm91cE5hbWUgZm9yIGVhc2Ugb2YgdXNlIGFzIGV2ZW50TGlzdGVuZXIgYW5kIGluIHdob2xlIGZvcm0gaXRlcmF0aW9uKVxuICogXG4gKiBAcGFyYW0gZ3JvdXBOYW1lIFtTdHJpbmcsIHZhaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGlmKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSkgY2xlYXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICBcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0gPSBcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlIFxuICAgICAgICAgICAgICAgID8gY3JlYXRlRXJyb3JUZXh0Tm9kZShtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXSwgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkgXG4gICAgICAgICAgICAgICAgOiBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZHNbc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcdFx0XHRcdFxuXHRzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IFxuICAgICAgICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG4gICAgfSk7XG59OyIsImltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCB7IEFDVElPTlMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBcbiAgICBnZXRJbml0aWFsU3RhdGUsXG4gICAgZ2V0VmFsaWRpdHlTdGF0ZSxcbiAgICBnZXRHcm91cFZhbGlkaXR5U3RhdGUsXG4gICAgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLFxuICAgIHJlc29sdmVSZWFsVGltZVZhbGlkYXRpb25FdmVudCxcbiAgICByZWR1Y2VFcnJvck1lc3NhZ2VzXG59IGZyb20gJy4vdmFsaWRhdG9yJztcbmltcG9ydCB7XG4gICAgY2xlYXJFcnJvcnMsXG4gICAgY2xlYXJFcnJvcixcbiAgICByZW5kZXJFcnJvcixcbiAgICByZW5kZXJFcnJvcnNcbn0gIGZyb20gJy4vZG9tJztcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGUgdmFsaWRpdHlTdGF0ZSBvZiB0aGUgZW50aXJlIGZvcm1cbiAqIGNhbiBiZSB1c2VkIGFzIGEgZm9ybSBzdWJtaXQgZXZlbnRMaXN0ZW5lciBvciB2aWEgdGhlIEFQSVxuICogXG4gKiBTdWJtaXRzIHRoZSBmb3JtIGlmIGNhbGxlZCBhcyBhIHN1Ym1pdCBldmVudExpc3RlbmVyIGFuZCBpcyB2YWxpZFxuICogRGlzcGF0Y2hlcyBlcnJvciBzdGF0ZSB0byBTdG9yZSBpZiBlcnJvcnNcbiAqIFxuICogQHBhcmFtIGZvcm0gW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJucyBbYm9vbGVhbl0gVGhlIHZhbGlkaXR5IHN0YXRlIG9mIHRoZSBmb3JtXG4gKiBcbiAqL1xuY29uc3QgdmFsaWRhdGUgPSBmb3JtID0+IGUgPT4ge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTtcblxuICAgIGdldFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgIC50aGVuKHZhbGlkaXR5U3RhdGUgPT4ge1xuICAgICAgICAgICAgaWYoW10uY29uY2F0KC4uLnZhbGlkaXR5U3RhdGUpLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpKXtcbiAgICAgICAgICAgICAgICBpZihlICYmIGUudGFyZ2V0KSBmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgIEFDVElPTlMuVkFMSURBVElPTl9FUlJPUlMsXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgZ3JvdXAsIGkpID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY1tncm91cF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IHZhbGlkaXR5U3RhdGVbaV0ucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogdmFsaWRpdHlTdGF0ZVtpXS5yZWR1Y2UocmVkdWNlRXJyb3JNZXNzYWdlcyhncm91cCwgU3RvcmUuZ2V0U3RhdGUoKSksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xuICAgICAgICAgICAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgICAgICAgW3JlbmRlckVycm9yc11cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJlYWxUaW1lVmFsaWRhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbn07XG5cbi8qKlxuICogQWRkcyBhIGN1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCB0byB0aGUgdmFsaWRhdGlvbiBtb2RlbCwgdXNlZCB2aWEgdGhlIEFQSVxuICogRGlzcGF0Y2hlcyBhZGQgdmFsaWRhdGlvbiBtZXRob2QgdG8gc3RvcmUgdG8gdXBkYXRlIHRoZSB2YWxpZGF0b3JzIGluIGEgZ3JvdXBcbiAqIFxuICogQHBhcmFtIGdyb3VwTmFtZSBbU3RyaW5nXSBUaGUgbmFtZSBhdHRyaWJ1dGUgc2hhcmVkIGJ5IHRoZSBET20gbm9kZXMgaW4gdGhlIGdyb3VwXG4gKiBAcGFyYW0gbWV0aG9kIFtGdW5jdGlvbl0gVGhlIHZhbGlkYXRpb24gbWV0aG9kIChmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBvciBmYWxzZSkgdGhhdCB1cyBjYWxsZWQgb24gdGhlIGdyb3VwXG4gKiBAcGFyYW0gbWVzc2FnZSBbU3RyaW5nXSBUZSBlcnJvciBtZXNzYWdlIGRpc3BsYXllZCBpZiB0aGUgdmFsaWRhdGlvbiBtZXRob2QgcmV0dXJucyBmYWxzZVxuICogXG4gKi9cbmNvbnN0IGFkZE1ldGhvZCA9IChncm91cE5hbWUsIG1ldGhvZCwgbWVzc2FnZSkgPT4ge1xuICAgIGlmKChncm91cE5hbWUgPT09IHVuZGVmaW5lZCB8fCBtZXRob2QgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHx8ICFTdG9yZS5nZXRTdGF0ZSgpW2dyb3VwTmFtZV0gJiYgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoZ3JvdXBOYW1lKS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0N1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCBjYW5ub3QgYmUgYWRkZWQuJyk7XG5cbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkFERF9WQUxJREFUSU9OX01FVEhPRCwge2dyb3VwTmFtZSwgdmFsaWRhdG9yOiB7dHlwZTogJ2N1c3RvbScsIG1ldGhvZCwgbWVzc2FnZX19KTtcbn07XG5cblxuLyoqXG4gKiBTdGFydHMgcmVhbC10aW1lIHZhbGlkYXRpb24gb24gZWFjaCBncm91cCwgYWRkaW5nIGFuIGV2ZW50TGlzdGVuZXIgdG8gZWFjaCBmaWVsZCBcbiAqIHRoYXQgcmVzZXRzIHRoZSB2YWxpZGl0eVN0YXRlIGZvciB0aGUgZmllbGQncyBncm91cCBhbmQgYWNxdWlyZXMgdGhlIG5ldyB2YWxpZGl0eSBzdGF0ZVxuICogXG4gKiBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB2YWxpZGF0aW9uIGlzIGRlZmluZWQgYnkgdGhlIGZpZWxkIHR5cGVcbiAqIFxuICogT25seSBpZiB0aGUgbmV3IHZhbGlkaXR5U3RhdGUgaXMgaW52YWxpZCBpcyB0aGUgdmFsaWRhdGlvbiBlcnJvciBvYmplY3QgXG4gKiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSB0byB1cGRhdGUgc3RhdGUgYW5kIHJlbmRlciB0aGUgZXJyb3JcbiAqIFxuICovXG5jb25zdCByZWFsVGltZVZhbGlkYXRpb24gPSAoKSA9PiB7XG4gICAgbGV0IGhhbmRsZXIgPSBncm91cE5hbWUgPT4gKCkgPT4ge1xuICAgICAgICBpZighU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkge1xuICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5DTEVBUl9FUlJPUiwgZ3JvdXBOYW1lLCBbY2xlYXJFcnJvcihncm91cE5hbWUpXSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldEdyb3VwVmFsaWRpdHlTdGF0ZShTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZighcmVzLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFDVElPTlMuVkFMSURBVElPTl9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHJlcy5yZWR1Y2UocmVkdWNlRXJyb3JNZXNzYWdlcyhncm91cE5hbWUsIFN0b3JlLmdldFN0YXRlKCkpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcihncm91cE5hbWUpXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihyZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQoaW5wdXQpLCBoYW5kbGVyKGdyb3VwTmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy87XzsgY2FuIGRvIGJldHRlcj9cbiAgICAgICAgbGV0IGVxdWFsVG9WYWxpZGF0b3IgPSBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICBlcXVhbFRvVmFsaWRhdG9yWzBdLnBhcmFtcy5vdGhlci5mb3JFYWNoKHN1Ymdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICBzdWJncm91cC5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVyKGdyb3VwTmFtZSkpOyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24sIHNldHMgaW5pdGlhbCBzdGF0ZSBhbmQgYWRkcyBmb3JtLWxldmVsIGV2ZW50IGxpc3RlbmVyc1xuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVdIHRoZSBmb3JtIHRvIHZhbGlkYXRlXG4gKiBcbiAqIEByZXR1cm5zIFtPYmplY3RdIFRoZSBBUEkgZm9yIHRoZSBpbnN0YW5jZVxuICogKlxuICovXG5leHBvcnQgZGVmYXVsdCBmb3JtID0+IHtcbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFLCAoZ2V0SW5pdGlhbFN0YXRlKGZvcm0pKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB2YWxpZGF0ZShmb3JtKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsICgpID0+IHsgU3RvcmUudXBkYXRlKFVQREFURVMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTsgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZGF0ZTogdmFsaWRhdGUoZm9ybSksXG4gICAgICAgIGFkZE1ldGhvZFxuICAgIH1cbn07IiwiaW1wb3J0IHsgQUNUSU9OUywgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEFsbCBzdGF0ZS9tb2RlbC1tb2RpZnlpbmcgb3BlcmF0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiAoc3RhdGUsIGRhdGEpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCBkYXRhKSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUl06IChzdGF0ZSwgZGF0YSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgIFtkYXRhXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGFdLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSksXG4gICAgW0FDVElPTlMuQUREX1ZBTElEQVRJT05fTUVUSE9EXTogKHN0YXRlLCBkYXRhKSA9Pk9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCB7XG4gICAgICAgICAgICBbZGF0YS5ncm91cE5hbWVdOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdID8gc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXSA6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXSA/ICB7IHZhbGlkYXRvcnM6IFsuLi5zdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdLnZhbGlkYXRvcnMsIGRhdGEudmFsaWRhdG9yXSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoZGF0YS5ncm91cE5hbWUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2RhdGEuZ3JvdXBOYW1lfV1gKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yczogW2RhdGEudmFsaWRhdG9yXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSksXG4gICAgW0FDVElPTlMuVkFMSURBVElPTl9FUlJPUlNdOiAoc3RhdGUsIGRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IFxuICAgICAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgICAgIGFjY1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZ3JvdXBdLCBkYXRhW2dyb3VwXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JdOiAoc3RhdGUsIGRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwcywge1xuICAgICAgICAgICAgICAgIFtkYXRhLmdyb3VwXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGRhdGEuZXJyb3JNZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufTsiLCJpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnO1xuLy9zaGFyZWQgY2VudHJhbGlzZWQgdmFsaWRhdG9yIHN0YXRlXG5sZXQgc3RhdGUgPSB7fTtcblxuLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4vLyB3aW5kb3cuX192YWxpZGF0b3JfaGlzdG9yeV9fID0gW107XG5cbi8vc3RhdGUgZ2V0dGVyXG5jb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuXG4vKipcbiAqIENyZWF0ZSBuZXh0IHN0YXRlIGJ5IGludm9raW5nIHJlZHVjZXIgb24gY3VycmVudCBzdGF0ZVxuICogXG4gKiBFeGVjdXRlIHNpZGUgZWZmZWN0cyBvZiBzdGF0ZSB1cGRhdGUsIGFzIHBhc3NlZCBpbiB0aGUgdXBkYXRlXG4gKiBcbiAqIEBwYXJhbSB0eXBlIFtTdHJpbmddIFxuICogQHBhcmFtIG5leHRTdGF0ZSBbT2JqZWN0XSBOZXcgc2xpY2Ugb2Ygc3RhdGUgdG8gY29tYmluZSB3aXRoIGN1cnJlbnQgc3RhdGUgdG8gY3JlYXRlIG5leHQgc3RhdGVcbiAqIEBwYXJhbSBlZmZlY3RzIFtBcnJheV0gQXJyYXkgb2YgZnVuY3Rpb25zIHRvIGludm9rZSBhZnRlciBzdGF0ZSB1cGRhdGUgKERPTSwgb3BlcmF0aW9ucywgY21kcy4uLilcbiAqL1xuY29uc3QgZGlzcGF0Y2ggPSBmdW5jdGlvbih0eXBlLCBuZXh0U3RhdGUsIGVmZmVjdHMpIHtcbiAgICBzdGF0ZSA9IG5leHRTdGF0ZSA/IHJlZHVjZXJzW3R5cGVdKHN0YXRlLCBuZXh0U3RhdGUpIDogc3RhdGU7XG4gICAgLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4gICAgLy8gd2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXy5wdXNoKHtbdHlwZV06IHN0YXRlfSksIGNvbnNvbGUubG9nKHdpbmRvdy5fX3ZhbGlkYXRvcl9oaXN0b3J5X18pO1xuICAgIGlmKCFlZmZlY3RzKSByZXR1cm47XG4gICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiB7IGVmZmVjdChzdGF0ZSk7IH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBkaXNwYXRjaCwgZ2V0U3RhdGUgfTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL2NvbnN0YW50cy9tZXNzYWdlcyc7XG5pbXBvcnQgeyBcbiAgICBwaXBlLFxuICAgIGlzQ2hlY2thYmxlLFxuICAgIGlzU2VsZWN0LFxuICAgIGlzRmlsZSxcbiAgICBET01Ob2Rlc0Zyb21Db21tYUxpc3QsXG4gICAgZXh0cmFjdFZhbHVlRnJvbUdyb3VwXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtcbiAgICBET1RORVRfQURBUFRPUlMsXG4gICAgRE9UTkVUX1BBUkFNUyxcbiAgICBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSxcbiAgICBET01fU0VMRUNUT1JfUEFSQU1TXG59IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmVzb2x2ZSB2YWxpZGF0aW9uIHBhcmFtZXRlciB0byBhIHN0cmluZyBvciBhcnJheSBvZiBET00gbm9kZXNcbiAqIFxuICogQHBhcmFtIHBhcmFtIFtTdHJpbmddIGlkZW50aWZpZXIgZm9yIHRoZSBkYXRhLWF0dHJpYnV0ZSBgZGF0YS12YWwtJHtwYXJhbX1gXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXSB0aGUgbm9kZSB3aGljaCBjb250YWlucyB0aGUgZGF0YS12YWwtIGF0dHJpYnV0ZVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcGFyYW0gW09iamVjdF0gaW5kZXhlZCBieSBzZWNvbmQgcGFydCBvZiBwYXJhbSBuYW1lIChlLmcuLCAnbWluJyBwYXJ0IG9mIGxlbmd0aC1taW4nKSBhbmQgYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGEgc3RyaW5nXG4gKi9cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgaW5wdXQpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCk7XG4gICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgW3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlLCBpbnB1dCk6IHZhbHVlXG4gICAgICAgICAgICB9KVxufTtcblxuLyoqXG4gKiBMb29rcyB1cCB0aGUgZGF0YS12YWwgcHJvcGVydHkgYWdhaW5zdCB0aGUga25vd24gLk5FVCBNVkMgYWRhcHRvcnMvdmFsaWRhdGlvbiBtZXRob2RcbiAqIHJ1bnMgdGhlIG1hdGNoZXMgYWdhaW5zdCB0aGUgbm9kZSB0byBmaW5kIHBhcmFtIHZhbHVlcywgYW5kIHJldHVybnMgYW4gT2JqZWN0IGNvbnRhaW5pbmcgYWxsICBwYXJhbWV0ZXJzIGZvciB0aGF0IGFkYXB0b3IvdmFsaWRhdGlvbiBtZXRob2RcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV0gdGhlIG5vZGUgb24gd2hpY2ggdG8gbG9vayBmb3IgbWF0Y2hpbmcgYWRhcHRvcnNcbiAqIEBwYXJhbSBhZGFwdG9yIFtTdHJpbmddIC5ORVQgTVZDIGRhdGEtYXR0cmlidXRlIHRoYXQgaWRlbnRpZmllcyB2YWxpZGF0b3JcbiAqIFxuICogQHJldHVybiB2YWxpZGF0aW9uIHBhcmFtcyBbT2JqZWN0XSBWYWxpZGF0aW9uIHBhcmFtIG9iamVjdCBjb250YWluaW5nIGFsbCB2YWxpZGF0aW9uIHBhcmFtZXRlcnMgZm9yIGFuIGFkYXB0b3IvdmFsaWRhdGlvbiBtZXRob2RcbiAqL1xuY29uc3QgZXh0cmFjdFBhcmFtcyA9IChpbnB1dCwgYWRhcHRvcikgPT4gRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApID8gT2JqZWN0LmFzc2lnbihhY2MsIHJlc29sdmVQYXJhbShwYXJhbSwgaW5wdXQpKSA6IGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XG5cbi8qKlxuICogUmVkdWNlciB0aGF0IHRha2VzIGFsbCBrbm93IC5ORVQgTVZDIGFkYXB0b3JzIChkYXRhLWF0dHJpYnV0ZXMgdGhhdCBzcGVjaWZpeSBhIHZhbGlkYXRpb24gbWV0aG9kIHRoYXQgc2hvdWxkIGJlIHBhcGlpZWQgdG8gdGhlIG5vZGUpXG4gKiBhbmQgY2hlY2tzIGFnYWluc3QgYSBET00gbm9kZSBmb3IgbWF0Y2hlcywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHZhbGlkYXRvcnNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0b3JzIFtBcnJheV0sIGVhY2ggdmFsaWRhdG9yIGNvbXBwb3NlZCBvZiBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSBbU3RyaW5nXSBuYW1pbmcgdGhlIHZhbGlkYXRvciBhbmQgbWF0Y2hpbmcgaXQgdG8gdmFsaWRhdGlvbiBtZXRob2QgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSBbU3RyaW5nXSB0aGUgZXJyb3IgbWVzc2FnZSBkaXNwbGF5ZWQgaWYgdGhlIHZhbGlkYXRpb24gbWV0aG9kIHJldHVybnMgZmFsc2VcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zIFtPYmplY3RdIChvcHRpb25hbCkgXG4gKi9cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG4gICAgICBcbi8qKlxuICogUGlwZXMgYW4gaW5wdXQgdGhyb3VnaCBhIHNlcmllcyBvZiB2YWxpZGF0b3IgY2hlY2tzIChmbnMgZGlyZWN0bHkgYmVsb3cpIHRvIGV4dHJhY3QgYXJyYXkgb2YgdmFsaWRhdG9ycyBiYXNlZCBvbiBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBzbyBIVE1MNSBjb25zdHJhaW50cyB2YWxpZGF0aW9uIGlzIG5vdCB1c2VkLCB3ZSB1c2UgdGhlIHNhbWUgdmFsaWRhdGlvbiBtZXRob2RzIGFzIC5ORVQgTVZDIHZhbGlkYXRpb25cbiAqIFxuICogSWYgd2UgYXJlIHRvIGFjdHVhbGx5IHVzZSB0aGUgQ29uc3RyYWludCBWYWxpZGF0aW9uIEFQSSB3ZSB3b3VsZCBub3QgbmVlZCB0byBhc3NlbWJsZSB0aGlzIHZhbGlkYXRvciBhcnJheS4uLlxuICogXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRvcnMgW0FycmF5XVxuICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoZW1haWwoaW5wdXQpLCB1cmwoaW5wdXQpLCBudW1iZXIoaW5wdXQpLCBtaW5sZW5ndGgoaW5wdXQpLCBtYXhsZW5ndGgoaW5wdXQpLCBtaW4oaW5wdXQpLCBtYXgoaW5wdXQpLCBwYXR0ZXJuKGlucHV0KSwgcmVxdWlyZWQoaW5wdXQpKTtcblxuLyoqXG4gKiBWYWxpZGF0b3IgY2hlY2tzIHRvIGV4dHJhY3QgdmFsaWRhdG9ycyBiYXNlZCBvbiBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBcbiAqIEVhY2ggZnVuY3Rpb24gaXMgY3VycmllZCBzbyB3ZSBjYW4gc2VlZCBlYWNoIGZuIHdpdGggYW4gaW5wdXQgYW5kIHBpcGUgdGhlIHJlc3VsdCBhcnJheSB0aHJvdWdoIGVhY2ggZnVuY3Rpb25cbiAqIFNpZ25hdHVyZTogaW5wdXRET01Ob2RlID0+IHZhbGlkYXRvckFycmF5ID0+IHVwZGF0ZVZhbGlkYXRvckFycmF5XG4gKi9cbmNvbnN0IHJlcXVpcmVkID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdyZXF1aXJlZCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBlbWFpbCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ2VtYWlsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IHVybCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3VybCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICd1cmwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbnVtYmVyID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ251bWJlcid9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW5sZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heGxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWluID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWluJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IHBhdHRlcm4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3BhdHRlcm4nLCBwYXJhbXM6IHsgcmVnZXg6IGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpfX1dIDogdmFsaWRhdG9ycztcblxuLyoqXG4gKiBUYWtlcyBhbiBpbnB1dCBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgdmFsaWRhdG9ycyBiYXNlZCBvbiBlaXRoZXIgLk5FVCBNVkMgZGF0YS12YWwtIG9yIEhUTUw1IGF0dHJpYnV0ZXNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0b3JzIFtBcnJheV1cbiAqLyAgXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG4vKipcbiAqIENhbGxzIGEgdmFsaWRhdGlvbiBtZXRob2QgYWdhaW5zdCBhbiBpbnB1dCBncm91cFxuICogXG4gKiBAcGFyYW0gZ3JvdXAgW0FycmF5XSBET00gbm9kZXMgd2l0aCB0aGUgc2FtZSBuYW1lIGF0dHJpYnV0ZVxuICogQHBhcmFtIHZhbGlkYXRvciBbU3RyaW5nXSBUaGUgdHlwZSBvZiB2YWxpZGF0b3IgbWF0Y2hpbmcgaXQgdG8gdmFsaWRhdGlvbiBtZXRob2QgZnVuY3Rpb25cbiAqIFxuICovICBcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IChncm91cCwgdmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2N1c3RvbScgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBtZXRob2RzWydjdXN0b20nXSh2YWxpZGF0b3IubWV0aG9kLCBncm91cClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zKTtcblxuLyoqXG4gKiBSZWR1Y2VyIGNvbnN0cnVjdGluZyBhbiB2YWxpZGF0aW9uIE9iamVjdCBmb3IgYSBncm91cCBvZiBET00gbm9kZXNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybnMgdmFsaWRhdGlvbiBvYmplY3QgW09iamVjdF0gY29uc2lzdGluZyBvZlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgW0Jvb2xlYW5dIHRoZSB2YWxpZGl0eVN0YXRlIG9mIHRoZSBncm91cFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9ycyBbQXJyYXldIG9mIHZhbGlkYXRvciBvYmplY3RzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMgW0FycmF5XSBET00gbm9kZXMgaW4gdGhlIGdyb3VwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGUgW0RPTSBub2RlXSAuTkVUIE1WQyBzZXJ2ZXItcmVuZGVyZWQgZXJyb3IgbWVzc2FnZSBzcGFuXG4gKiBcbiAqLyAgXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT0ke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfV1gKSB8fCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGVycm9yIG1lc3NhZ2UgcHJvcGVydHkgb2YgdGhlIHZhbGlkYXRvciBPYmplY3QgdGhhdCBoYXMgcmV0dXJuZWQgZmFsc2Ugb3IgdGhlIGNvcnJlc3BvbmRpbmcgZGVmYXVsdCBtZXNzYWdlXG4gKiBcbiAqIEBwYXJhbSB2YWxpZGF0b3IgW09iamVjdF0gXG4gKiBcbiAqIEByZXR1cm4gbWVzc2FnZSBbU3RyaW5nXSBlcnJvciBtZXNzYWdlXG4gKiBcbiAqLyBcbmNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSB2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuLyoqXG4gKiBDdXJyaWVkIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHJlZHVjZXIgdGhhdCByZWR1Y2VzIHRoZSByZXNvbHZlZCByZXNwb25zZSBmcm9tIGFuIGFycmF5IG9mIHZhbGlkYXRpb24gUHJvbWlzZXMgcGVyZm9ybWVkIGFnYWluc3QgYSBncm91cFxuICogaW50byBhbiBhcnJheSBvZiBlcnJvciBtZXNzYWdlcyBvciBhbiBlbXB0eSBhcnJheVxuICogXG4gKiBAcmV0dXJuIGVycm9yIG1lc3NhZ2VzIFtBcnJheV1cbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IHJlZHVjZUVycm9yTWVzc2FnZXMgPSAoZ3JvdXAsIHN0YXRlKSA9PiAoYWNjLCB2YWxpZGl0eSwgaikgPT4ge1xuICAgIHJldHVybiB2YWxpZGl0eSA9PT0gdHJ1ZSBcbiAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICA6IFsuLi5hY2MsIHR5cGVvZiB2YWxpZGl0eSA9PT0gJ2Jvb2xlYW4nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdEVycm9yTWVzc2FnZShzdGF0ZS5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnNbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWxpZGl0eV07XG59O1xuXG4vKipcbiAqIEZyb20gYWxsIGdyb3VwcyBmb3VuZCBpbiB0aGUgY3VycmVudCBmb3JtLCB0aG9zZXRoYXQgZG8gbm90IHJlcXVpcmUgdmFsaWRhdGlvbiAoaGF2ZSBubyBhc3NvY2F0ZWQgdmFsaWRhdG9ycykgYXJlIHJlbW92ZWRcbiAqIFxuICogQHBhcmFtIGdyb3VwcyBbT2JqZWN0XSBuYW1lLWluZGV4ZWQgb2JqZWN0IGNvbnNpc3Rpbmcgb2YgYWxsIGdyb3VwcyBmb3VuZCBpbiB0aGUgY3VycmVudCBmb3JtXG4gKiBcbiAqIEByZXR1cm4gZ3JvdXBzIFtPYmplY3RdIG5hbWUtaW5kZXhlZCBvYmplY3QgY29uc2lzdGluZyBvZiBhbGwgdmFsaWRhdGFibGUgZ3JvdXBzXG4gKiBcbiAqLyBcbmV4cG9ydCBjb25zdCByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzID0gZ3JvdXBzID0+IHtcbiAgICBsZXQgdmFsaWRhdGlvbkdyb3VwcyA9IHt9O1xuXG4gICAgZm9yKGxldCBncm91cCBpbiBncm91cHMpXG4gICAgICAgIGlmKGdyb3Vwc1tncm91cF0udmFsaWRhdG9ycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdmFsaWRhdGlvbkdyb3Vwc1tncm91cF0gPSBncm91cHNbZ3JvdXBdO1xuXG4gICAgcmV0dXJuIHZhbGlkYXRpb25Hcm91cHM7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgZm9ybSBET00gbm9kZSBhbmQgcmV0dXJucyB0aGUgaW5pdGlhbCBmb3JtIHZhbGlkYXRpb24gc3RhdGUgLSBhbiBvYmplY3QgY29uc2lzdGluZyBvZiBhbGwgdGhlIHZhbGlkYXRhYmxlIGlucHV0IGdyb3Vwc1xuICogd2l0aCB2YWxpZGl0eVN0YXRlLCBmaWVsZHMsIHZhbGlkYXRvcnMsIGFuZCBhc3NvY2lhdGVkIGRhdGEgcmVxdWlyZWQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIGFuZCByZW5kZXIgZXJyb3JzLlxuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVzXSBcbiAqIFxuICogQHJldHVybiBzdGF0ZSBbT2JqZWN0XSBjb25zaXN0aW5nIG9mIGdyb3VwcyBbT2JqZWN0XSBuYW1lLWluZGV4ZWQgdmFsaWRhdGlvbiBncm91cHNcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxTdGF0ZSA9IGZvcm0gPT4gKHtcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuLyoqXG4gKiBSZWR1Y2VyIHJ1biBhZ2FpbnN0IGFuIGFycmF5IG9mIHJlc29sdmVkIHZhbGlkYXRpb24gcHJvbWlzZXMgdG8gc2V0IHRoZSBvdmVyYWxsIHZhbGlkaXR5U3RhdGUgb2YgYSBncm91cFxuICogXG4gKiBAcmV0dXJuIHZhbGlkaXR5U3RhdGUgW0Jvb2xlYW5dIFxuICogXG4gKi8gXG5leHBvcnQgY29uc3QgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlID0gKGFjYywgY3VycikgPT4ge1xuICAgIGlmKGN1cnIgIT09IHRydWUpIGFjYyA9IGZhbHNlO1xuICAgIHJldHVybiBhY2M7IFxufTtcblxuLyoqXG4gKiBBZ2dyZWdhdGVzIHZhbGlkYXRpb24gcHJvbWlzZXMgZm9yIGFsbCBncm91cHMgaW50byBhIHNpbmdsZSBwcm9taXNlXG4gKiBcbiAqIEBwYXJhbXMgZ3JvdXBzIFtPYmplY3RdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdGlvbiByZXN1bHRzIFtQcm9taXNlXSBhZ2dyZWdhdGVkIHByb21pc2VcbiAqIFxuICovXG5leHBvcnQgY29uc3QgZ2V0VmFsaWRpdHlTdGF0ZSA9IGdyb3VwcyA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBPYmplY3Qua2V5cyhncm91cHMpXG4gICAgICAgICAgICAubWFwKGdyb3VwID0+IGdldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cHNbZ3JvdXBdKSlcbiAgICAgICAgKTtcbn07XG5cbi8qKlxuICogQWdncmVnYXRlcyBhbGwgb2YgdGhlIHZhbGlkYXRpb24gcHJvbWlzZXMgZm9yIGEgc2lubGdlIGdyb3VwIGludG8gYSBzaW5nbGUgcHJvbWlzZVxuICogXG4gKiBAcGFyYW1zIGdyb3VwcyBbT2JqZWN0XVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcmVzdWx0cyBbUHJvbWlzZV0gYWdncmVnYXRlZCBwcm9taXNlXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEdyb3VwVmFsaWRpdHlTdGF0ZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKGhhc0Vycm9yKSByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4geyByZXNvbHZlKHJlcyk7fSk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgZXZlbnQgdHlwZSB0byBiZSB1c2VkIGZvciByZWFsLXRpbWUgdmFsaWRhdGlvbiBhIGdpdmVuIGZpZWxkIGJhc2VkIG9uIGZpZWxkIHR5cGVcbiAqIFxuICogQHBhcmFtcyBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gZXZlbnQgdHlwZSBbU3RyaW5nXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTsiLCJpbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZmV0Y2gsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgcmVzb2x2ZUdldFBhcmFtcyB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09ICcnO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gJycsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgsIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyA9IHBhcmFtcy5vdGhlci5yZWR1Y2UoKHN1Ymdyb3VwQWNjLCBzdWJncm91cCkgPT4ge1xuICAgICAgICAgICAgaWYoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKHN1Ymdyb3VwKSAhPT0gaW5wdXQudmFsdWUpIHN1Ymdyb3VwQWNjID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3ViZ3JvdXBBY2M7XG4gICAgICAgIH0sIHRydWUpLCBhY2M7XG4gICAgfSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluICYmIChwYXJhbXMubWF4ID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmV0Y2goKHBhcmFtcy50eXBlICE9PSAnZ2V0JyA/IHBhcmFtcy51cmwgOiBgJHtwYXJhbXMudXJsfT8ke3Jlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpfWApLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICBib2R5OiBwYXJhbXMudHlwZSA9PT0gJ2dldCcgPyBudWxsIDogcmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyksXG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUoYFNlcnZlciBlcnJvcjogJHtyZXN9YCk7IH0pO1xuICAgIH0pLFxuICAgIGN1c3RvbTogKG1ldGhvZCwgZ3JvdXApID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgbWV0aG9kKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCksIGdyb3VwLmZpZWxkcylcbn07IiwiZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNGaWxlID0gZmllbGQgPT4gZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdmaWxlJztcblxuZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgcmVzb2x2ZUdldFBhcmFtcyA9IG5vZGVBcnJheXMgPT4gbm9kZUFycmF5cy5tYXAoKG5vZGVzKSA9PiB7XG4gICAgcmV0dXJuIGAke25vZGVzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpfT0ke2V4dHJhY3RWYWx1ZUZyb21Hcm91cChub2Rlcyl9YDtcbn0pLmpvaW4oJyYnKTtcblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IChsaXN0LCBpbnB1dCkgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFNlbGVjdG9yID0gZXNjYXBlQXR0cmlidXRlVmFsdWUoYXBwZW5kU3RhdGVQcmVmaXgoaXRlbSwgZ2V0U3RhdGVQcmVmaXgoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtyZXNvbHZlZFNlbGVjdG9yfV1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuY29uc3QgZXNjYXBlQXR0cmlidXRlVmFsdWUgPSB2YWx1ZSA9PiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG5cbmNvbnN0IGdldFN0YXRlUHJlZml4ID0gZmllbGROYW1lID0+IGZpZWxkTmFtZS5zdWJzdHIoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcblxuY29uc3QgYXBwZW5kU3RhdGVQcmVmaXggPSAodmFsdWUsIHByZWZpeCkgPT4ge1xuICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGFjYywgZm4pID0+IGZuKGFjYykpO1xuXG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5oYXNPd25Qcm9wZXJ0eSgnZmllbGRzJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZ3JvdXAucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaCA9ICh1cmwsIHByb3BzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3Blbihwcm9wcy5tZXRob2QgfHwgJ0dFVCcsIHVybCk7XG4gICAgICAgIGlmIChwcm9wcy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcy5oZWFkZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBwcm9wcy5oZWFkZXJzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICBlbHNlIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgeGhyLnNlbmQocHJvcHMuYm9keSk7XG4gICAgfSk7XG59OyJdfQ==
