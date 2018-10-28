(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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
		if (el.hasAttribute('novalidate')) return acc;
		acc[el] = Object.assign(Object.create((0, _lib2.default)(el, Object.assign({}, opts))));
		return el.setAttribute('novalidate', 'novalidate'), acc;
	}, {}));
};

//Auto-initialise
{
	[].slice.call(document.querySelectorAll('form')).forEach(function (form) {
		if (form.querySelector('[data-val=true]') && !form.hasAttribute('novalidate')) init(form);
	});
}

exports.default = { init: init };

},{"./lib":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.focusFirstInvalidField = exports.renderError = exports.renderErrors = exports.clearErrors = exports.clearError = exports.createErrorTextNode = exports.h = undefined;

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
        if (!state.groups[groupName].valid) renderError(groupName)(state);
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
 * @param groupName [String, validation group] 
 * @param state [Object, validation state]
 * 
 */
var renderError = exports.renderError = function renderError(groupName) {
    return function (state) {
        if (errorNodes[groupName]) clearError(groupName)(state);

        errorNodes[groupName] = state.groups[groupName].serverErrorNode ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) : state.groups[groupName].fields[state.groups[groupName].fields.length - 1].parentNode.appendChild(h('div', { class: _constants.DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));

        state.groups[groupName].fields.forEach(function (field) {
            field.setAttribute('aria-invalid', 'true');
        });
    };
};

/**
 * Set focus on first invalid field after form-level validate()
 * 
 * We can assume that there is a group in an invalid state,
 * and that the group has at least one field
 * 
 * @param groups [Object, validation group slice of state]
 * 
 */
var focusFirstInvalidField = exports.focusFirstInvalidField = function focusFirstInvalidField(groups) {
    groups[Object.keys(groups).filter(function (group) {
        return !group.valid;
    })[0]].fields[0].focus();
};

},{"../constants":2}],5:[function(require,module,exports){
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

            _store2.default.getState().realTimeValidation === false && startRealTimeValidation();

            (0, _dom.focusFirstInvalidField)(_store2.default.getState().groups);

            _store2.default.dispatch(_constants.ACTIONS.VALIDATION_ERRORS, Object.keys(_store2.default.getState().groups).reduce(function (acc, group, i) {
                return acc[group] = {
                    valid: validityState[i].reduce(_validator.reduceGroupValidityState, true),
                    errorMessages: validityState[i].reduce((0, _validator.reduceErrorMessages)(group, _store2.default.getState()), [])
                }, acc;
            }, {}), [_dom.renderErrors]);

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
var startRealTimeValidation = function startRealTimeValidation() {
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

},{"./constants":2,"./dom":4,"./store":7,"./validator":8}],6:[function(require,module,exports){
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
        realTimeValidation: true,
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

},{"../constants":2}],7:[function(require,module,exports){
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

},{"../reducers":6}],8:[function(require,module,exports){
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
        serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '="' + input.getAttribute('name') + '"]') || false
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
        realTimeValidation: false,
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

},{"../constants":2,"../constants/messages":3,"./methods":9,"./utils":10}],9:[function(require,module,exports){
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

},{"../constants":2,"./utils":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    var validator = _dist2.default.init('form');

    // console.log(validator);

    // validator.addMethod(
    //     'CustomValidator',
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

},{"../../dist":1}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL21lc3NhZ2VzLmpzIiwiZGlzdC9saWIvZG9tL2luZGV4LmpzIiwiZGlzdC9saWIvaW5kZXguanMiLCJkaXN0L2xpYi9yZWR1Y2Vycy9pbmRleC5qcyIsImRpc3QvbGliL3N0b3JlL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL21ldGhvZHMuanMiLCJkaXN0L2xpYi92YWxpZGF0b3IvdXRpbHMuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxXQUFELEFBQVksTUFBUyxBQUNqQztLQUFJLFdBQUosQUFFQTs7QUFDQTtBQUNBO0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEsQUFBVSxhQUFwRSxBQUFpRixRQUFRLE1BQU0sQ0FBL0YsQUFBeUYsQUFBTSxBQUFDLGdCQUMzRixNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQTdCLEFBQU0sQUFBYyxBQUEwQixBQUVuRDs7S0FBRyxJQUFBLEFBQUksV0FBSixBQUFlLEtBQUssT0FBcEIsQUFBMkIsa0JBQWtCLE9BQUEsQUFBTyxlQUFlLElBQXRFLEFBQWdELEFBQXNCLEFBQUksS0FDekUsT0FBTyxPQUFBLEFBQU8sZUFBZSxJQUE3QixBQUFPLEFBQXNCLEFBQUksQUFFbEM7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7UUFBTyxPQUFBLEFBQU8sd0JBQ2IsQUFBTyxPQUFQLEFBQWMsSUFBSSxPQUFsQixBQUF5QixvQkFBZ0IsQUFBSSxPQUFPLFVBQUEsQUFBQyxLQUFELEFBQU0sSUFBTyxBQUNoRTtNQUFHLEdBQUEsQUFBRyxhQUFOLEFBQUcsQUFBZ0IsZUFBZSxPQUFBLEFBQU8sQUFDekM7TUFBQSxBQUFJLE1BQU0sT0FBQSxBQUFPLE9BQU8sT0FBQSxBQUFPLE9BQU8sbUJBQUEsQUFBUSxJQUFJLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBaEUsQUFBVSxBQUFjLEFBQWMsQUFBWSxBQUFrQixBQUNwRTtTQUFPLEdBQUEsQUFBRyxhQUFILEFBQWdCLGNBQWhCLEFBQThCLGVBQXJDLEFBQW9ELEFBQ3BEO0FBSndDLEVBQUEsRUFEMUMsQUFDQyxBQUF5QyxBQUl0QyxBQUNKLEdBTEM7QUFoQkY7O0FBdUJBO0FBQ0EsQUFDQztJQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUF2QixBQUFjLEFBQTBCLFNBQXhDLEFBQ0UsUUFBUSxnQkFBUSxBQUNoQjtNQUFHLEtBQUEsQUFBSyxjQUFMLEFBQW1CLHNCQUFzQixDQUFDLEtBQUEsQUFBSyxhQUFsRCxBQUE2QyxBQUFrQixlQUFlLEtBQUEsQUFBSyxBQUNuRjtBQUhGLEFBSUE7OztrQkFFYyxFQUFFLE0sQUFBRjs7Ozs7Ozs7QUNqQ1IsSUFBTSwwQ0FBaUIsQ0FBQSxBQUFDLFNBQXhCLEFBQXVCLEFBQVU7O0FBRWpDLElBQU07V0FBTixBQUFrQixBQUNkO0FBRGMsQUFDckI7O0FBR0csSUFBTTt1QkFBVSxBQUNBLEFBQ25CO2tCQUZtQixBQUVMLEFBQ2Q7dUJBSG1CLEFBR0EsQUFDbkI7c0JBSm1CLEFBSUQsQUFDbEI7aUJBTG1CLEFBS04sQUFDYjsyQkFORyxBQUFnQixBQU1JO0FBTkosQUFDbkI7O0FBUUo7QUFDTyxJQUFNLG9DQUFOLEFBQW9COztBQUUzQjtBQUNPLElBQU0sZ0NBQU4sQUFBa0I7O0FBRWxCLElBQU0sMENBQU4sQUFBdUI7O0FBRXZCLElBQU0sc0NBQU4sQUFBcUI7O0FBRXJCLElBQU0sc0NBQU4sQUFBcUI7O0FBRTVCO0FBQ08sSUFBTSw4RUFBTixBQUF5Qzs7QUFFaEQ7QUFDTyxJQUFNLG9EQUFzQixDQUFBLEFBQUMsMkJBQTdCLEFBQTRCLEFBQTRCOztBQUUvRDtBQUNBO0FBQ08sSUFBTTtZQUNELENBQUEsQUFBQyxjQURnQixBQUNqQixBQUFlLEFBQ3ZCO2tCQUFjLENBRlcsQUFFWCxBQUFDLEFBQ2Y7V0FBTyxDQUFBLEFBQUMsYUFIaUIsQUFHbEIsQUFBYyxBQUNyQjtBQUNBO0FBQ0E7ZUFBVyxDQU5jLEFBTWQsQUFBQyxBQUNaO2VBQVcsQ0FQYyxBQU9kLEFBQUMsQUFDWjtXQUFPLENBUmtCLEFBUWxCLEFBQUMsQUFDUjthQUFTLENBVGdCLEFBU2hCLEFBQUMsQUFDVjtZQUFRLENBQUEsQUFBQyxjQUFELEFBQWUsMkJBVkUsQUFVakIsQUFBMEMsZUFWL0MsQUFBc0IsQUFVdUM7QUFWdkMsQUFDekI7O0FBWUo7QUFDTyxJQUFNLDZDQUFrQixBQUMzQixZQUQyQixBQUUzQixnQkFGMkIsQUFHM0I7QUFDQTtBQUoyQixBQUszQixPQUwyQixFQUFBLEFBTTNCLFVBTjJCLEFBTzNCLE9BUDJCLEFBUTNCLFVBUjJCLEFBUzNCLGFBVDJCLEFBVTNCLFNBVjJCLEFBVzNCLFdBWEcsQUFBd0IsQUFZM0I7O0FBSUo7QUFDTyxJQUFNO1dBQW9CLEFBQ3RCLEFBQ1A7V0FGRyxBQUEwQixBQUV0QjtBQUZzQixBQUM3Qjs7Ozs7Ozs7O0FDbkVXLGtDQUNBLEFBQUU7ZUFBQSxBQUFPLEFBQTRCO0FBRHJDLEFBRVg7QUFGVyw0QkFFSCxBQUFFO2VBQUEsQUFBTyxBQUF3QztBQUY5QyxBQUdYO0FBSFcsZ0NBR0QsQUFBRTtlQUFBLEFBQU8sQUFBc0M7QUFIOUMsQUFJWDtBQUpXLHdCQUlOLEFBQUU7ZUFBQSxBQUFPLEFBQThCO0FBSmpDLEFBS1g7QUFMVywwQkFLSixBQUFFO2VBQUEsQUFBTyxBQUErQjtBQUxwQyxBQU1YO0FBTlcsZ0NBTUQsQUFBRTtlQUFBLEFBQU8sQUFBcUM7QUFON0MsQUFPWDtBQVBXLDhCQU9GLEFBQUU7ZUFBQSxBQUFPLEFBQWlDO0FBUHhDLEFBUVg7QUFSVyw4QkFRRixBQUFFO2VBQUEsQUFBTyxBQUE4QjtBQVJyQyxBQVNYO0FBVFcsa0NBQUEsQUFTRCxPQUFPLEFBQUU7OENBQUEsQUFBb0MsUUFBc0I7QUFUbEUsQUFVWDtBQVZXLGtDQUFBLEFBVUQsT0FBTyxBQUFFOzBDQUFBLEFBQWdDLFFBQXNCO0FBVjlELEFBV1g7QUFYVyxzQkFBQSxBQVdQLE9BQU0sQUFBRTsrREFBcUQsQ0FBckQsQUFBcUQsQUFBQyxTQUFZO0FBWG5FLEFBWVg7QUFaVyxzQkFBQSxBQVlQLE9BQU0sQUFBRTtrRUFBQSxBQUF3RCxRQUFTO0FBWmxFLEFBYVg7QUFiVyxnQ0FhRCxBQUFFO2VBQUEsQUFBTyxBQUF1QztBQWIvQyxBQWNYO0FBZFcsOEJBY0YsQUFBRTtlQUFBLEFBQU8sQUFBMkI7QSxBQWRsQztBQUFBLEFBQ1g7Ozs7Ozs7Ozs7QUNESjs7QUFFQTtBQUNBLElBQUksYUFBSixBQUFpQjs7QUFFakI7Ozs7Ozs7Ozs7QUFVTyxJQUFNLGdCQUFJLFNBQUosQUFBSSxFQUFBLEFBQUMsVUFBRCxBQUFXLFlBQVgsQUFBdUIsTUFBUyxBQUM3QztRQUFJLE9BQU8sU0FBQSxBQUFTLGNBQXBCLEFBQVcsQUFBdUIsQUFFbEM7O1NBQUksSUFBSixBQUFRLFFBQVIsQUFBZ0IsWUFBWSxBQUN4QjthQUFBLEFBQUssYUFBTCxBQUFrQixNQUFNLFdBQXhCLEFBQXdCLEFBQVcsQUFDdEM7QUFDRDtRQUFHLFNBQUEsQUFBUyxhQUFhLEtBQXpCLEFBQThCLFFBQVEsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLGVBQTFCLEFBQWlCLEFBQXdCLEFBRS9FOztXQUFBLEFBQU8sQUFDVjtBQVRNOztBQVdQOzs7Ozs7Ozs7QUFTTyxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLE9BQUQsQUFBUSxLQUFRLEFBQy9DO1FBQUksT0FBTyxTQUFBLEFBQVMsZUFBcEIsQUFBVyxBQUF3QixBQUVuQzs7VUFBQSxBQUFNLGdCQUFOLEFBQXNCLFVBQXRCLEFBQWdDLE9BQU8sNkJBQXZDLEFBQXlELEFBQ3pEO1VBQUEsQUFBTSxnQkFBTixBQUFzQixVQUF0QixBQUFnQyxJQUFJLDZCQUFwQyxBQUFzRCxBQUV0RDs7V0FBTyxNQUFBLEFBQU0sZ0JBQU4sQUFBc0IsWUFBN0IsQUFBTyxBQUFrQyxBQUM1QztBQVBNOztBQVNQOzs7Ozs7Ozs7OztBQVdPLElBQU0sa0NBQWEsU0FBYixBQUFhLHNCQUFBO1dBQWEsaUJBQVMsQUFDNUM7bUJBQUEsQUFBVyxXQUFYLEFBQXNCLFdBQXRCLEFBQWlDLFlBQVksV0FBN0MsQUFBNkMsQUFBVyxBQUN4RDtZQUFHLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBaEIsQUFBMkIsaUJBQWlCLEFBQ3hDO2tCQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsZ0JBQXhCLEFBQXdDLFVBQXhDLEFBQWtELE9BQU8sNkJBQXpELEFBQTJFLEFBQzNFO2tCQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsZ0JBQXhCLEFBQXdDLFVBQXhDLEFBQWtELElBQUksNkJBQXRELEFBQXdFLEFBQzNFO0FBQ0Q7Y0FBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLE9BQXhCLEFBQStCLFFBQVEsaUJBQVMsQUFBRTtrQkFBQSxBQUFNLGdCQUFOLEFBQXNCLEFBQWtCO0FBQTFGLEFBQ0E7ZUFBTyxXQUFQLEFBQU8sQUFBVyxBQUNyQjtBQVJ5QjtBQUFuQjs7QUFVUDs7Ozs7O0FBTU8sSUFBTSxvQ0FBYyxTQUFkLEFBQWMsbUJBQVMsQUFDaEM7V0FBQSxBQUFPLEtBQVAsQUFBWSxZQUFaLEFBQXdCLFFBQVEsZ0JBQVEsQUFDcEM7bUJBQUEsQUFBVyxNQUFYLEFBQWlCLEFBQ3BCO0FBRkQsQUFHSDtBQUpNOztBQU1QOzs7Ozs7QUFNTyxJQUFNLHNDQUFlLFNBQWYsQUFBZSxvQkFBUyxBQUNqQztXQUFBLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLFFBQVEscUJBQWEsQUFDM0M7WUFBRyxDQUFDLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBakIsQUFBNEIsT0FBTyxZQUFBLEFBQVksV0FBWixBQUF1QixBQUM3RDtBQUZELEFBR0g7QUFKTTs7QUFNUDs7Ozs7Ozs7Ozs7OztBQWFPLElBQU0sb0NBQWMsU0FBZCxBQUFjLHVCQUFBO1dBQWEsaUJBQVMsQUFDN0M7WUFBRyxXQUFILEFBQUcsQUFBVyxZQUFZLFdBQUEsQUFBVyxXQUFYLEFBQXNCLEFBRWhEOzttQkFBQSxBQUFXLGFBQ1AsTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLGtCQUNkLG9CQUFvQixNQUFBLEFBQU0sT0FBMUIsQUFBb0IsQUFBYSxZQUFZLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixjQUQvRSxBQUNVLEFBQTZDLEFBQXNDLE1BQ25GLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUNXLE9BQU8sTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLE9BQXhCLEFBQStCLFNBRGpELEFBQ3dELEdBRHhELEFBRVcsV0FGWCxBQUdXLFlBQVksRUFBQSxBQUFFLE9BQU8sRUFBRSxPQUFPLDZCQUFsQixBQUFTLEFBQTJCLFNBQVMsTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLGNBTjFHLEFBR2MsQUFHdUIsQUFBNkMsQUFBc0MsQUFFM0g7O2NBQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixPQUF4QixBQUErQixRQUFRLGlCQUFTLEFBQ3pDO2tCQUFBLEFBQU0sYUFBTixBQUFtQixnQkFBbkIsQUFBbUMsQUFDdEM7QUFGSixBQUdBO0FBZDBCO0FBQXBCOztBQWdCUDs7Ozs7Ozs7O0FBU08sSUFBTSwwREFBeUIsU0FBekIsQUFBeUIsK0JBQVUsQUFDNUM7a0JBQU8sQUFBTyxLQUFQLEFBQVksUUFBWixBQUNGLE9BQU8saUJBQUE7ZUFBUyxDQUFDLE1BQVYsQUFBZ0I7QUFEckIsS0FBQSxFQUFQLEFBQU8sQUFDNEIsSUFEbkMsQUFFSyxPQUZMLEFBRVksR0FGWixBQUdLLEFBQ1I7QUFMTTs7Ozs7Ozs7O0FDL0hQOzs7O0FBQ0E7O0FBQ0E7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTSxXQUFXLFNBQVgsQUFBVyxlQUFBO1dBQVEsYUFBSyxBQUMxQjthQUFLLEVBQUwsQUFBSyxBQUFFLEFBQ1A7d0JBQUEsQUFBTSxTQUFTLG1CQUFmLEFBQXVCLGNBQXZCLEFBQXFDLE1BQU0sTUFBM0MsQUFFQTs7eUNBQWlCLGdCQUFBLEFBQU0sV0FBdkIsQUFBa0MsUUFBbEMsQUFDSyxLQUFLLHlCQUFpQjtnQkFDbkI7O2dCQUFHLFlBQUEsQUFBRyxzQ0FBSCxBQUFhLGdCQUFiLEFBQTRCLDRDQUEvQixBQUFHLEFBQTZELE9BQU0sQUFDbEU7b0JBQUcsS0FBSyxFQUFSLEFBQVUsUUFBUSxLQUFBLEFBQUssQUFDdkI7dUJBQUEsQUFBTyxBQUNWO0FBRUQ7OzRCQUFBLEFBQU0sV0FBTixBQUFpQix1QkFBakIsQUFBd0MsU0FBeEMsQUFBaUQsQUFFakQ7OzZDQUF1QixnQkFBQSxBQUFNLFdBQTdCLEFBQXdDLEFBRXhDOzs0QkFBQSxBQUFNLFNBQ0YsbUJBREosQUFDWSwwQkFDUixBQUFPLEtBQUssZ0JBQUEsQUFBTSxXQUFsQixBQUE2QixRQUE3QixBQUNLLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOLEFBQWEsR0FBTSxBQUN2QjsyQkFBTyxBQUFJOzJCQUNBLGNBQUEsQUFBYyxHQUFkLEFBQWlCLDRDQURSLEFBQ1QsQUFBa0QsQUFDekQ7bUNBQWUsY0FBQSxBQUFjLEdBQWQsQUFBaUIsT0FBTyxvQ0FBQSxBQUFvQixPQUFPLGdCQUFuRCxBQUF3QixBQUEyQixBQUFNLGFBRnJFLEFBQWEsQUFFRCxBQUFzRTtBQUZyRSxBQUNoQixpQkFERyxFQUFQLEFBR0csQUFDTjtBQU5MLGFBQUEsRUFGSixBQUVJLEFBTU8sS0FDUCxNQVRKLEFBWUE7O21CQUFBLEFBQU8sQUFDVjtBQXhCTCxBQXlCSDtBQTdCZ0I7QUFBakI7O0FBK0JBOzs7Ozs7Ozs7QUFTQSxJQUFNLFlBQVksU0FBWixBQUFZLFVBQUEsQUFBQyxXQUFELEFBQVksUUFBWixBQUFvQixTQUFZLEFBQzlDO1FBQUksY0FBQSxBQUFjLGFBQWEsV0FBM0IsQUFBc0MsYUFBYSxZQUFwRCxBQUFnRSxhQUFjLENBQUMsZ0JBQUEsQUFBTSxXQUFQLEFBQUMsQUFBaUIsY0FBYyxTQUFBLEFBQVMsa0JBQVQsQUFBMkIsV0FBM0IsQUFBc0MsV0FBdkosQUFBa0ssR0FDOUosT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFeEI7O29CQUFBLEFBQU0sU0FBUyxtQkFBZixBQUF1Qix1QkFBdUIsRUFBQyxXQUFELFdBQVksV0FBVyxFQUFDLE1BQUQsQUFBTyxVQUFVLFFBQWpCLFFBQXlCLFNBQTlGLEFBQThDLEFBQXVCLEFBQ3hFO0FBTEQ7O0FBUUE7Ozs7Ozs7Ozs7QUFVQSxJQUFNLDBCQUEwQixTQUExQixBQUEwQiwwQkFBTSxBQUNsQztRQUFJLFVBQVUsU0FBVixBQUFVLG1CQUFBO2VBQWEsWUFBTSxBQUM3QjtnQkFBRyxDQUFDLGdCQUFBLEFBQU0sV0FBTixBQUFpQixPQUFqQixBQUF3QixXQUE1QixBQUF1QyxPQUFPLEFBQzFDO2dDQUFBLEFBQU0sU0FBUyxtQkFBZixBQUF1QixhQUF2QixBQUFvQyxXQUFXLENBQUMscUJBQWhELEFBQStDLEFBQUMsQUFBVyxBQUM5RDtBQUVEOztrREFBc0IsZ0JBQUEsQUFBTSxXQUFOLEFBQWlCLE9BQXZDLEFBQXNCLEFBQXdCLFlBQTlDLEFBQ0ssS0FBSyxlQUFPLEFBQ1Q7b0JBQUcsQ0FBQyxJQUFBLEFBQUksNENBQVIsQUFBSSxBQUFxQyxPQUFPLEFBQzVDO29DQUFBLEFBQU0sU0FDRSxtQkFEUixBQUNnQjsrQkFDUixBQUNXLEFBQ1A7dUNBQWUsSUFBQSxBQUFJLE9BQU8sb0NBQUEsQUFBb0IsV0FBVyxnQkFBMUMsQUFBVyxBQUErQixBQUFNLGFBSjNFLEFBRVEsQUFFbUIsQUFBNkQ7QUFGaEYsQUFDSSx1QkFHSixDQUFDLHNCQU5ULEFBTVEsQUFBQyxBQUFZLEFBRXBCO0FBQ1I7QUFaTCxBQWFIO0FBbEJhO0FBQWQsQUFvQkE7O1dBQUEsQUFBTyxLQUFLLGdCQUFBLEFBQU0sV0FBbEIsQUFBNkIsUUFBN0IsQUFBcUMsUUFBUSxxQkFBYSxBQUN0RDt3QkFBQSxBQUFNLFdBQU4sQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsT0FBbkMsQUFBMEMsUUFBUSxpQkFBUyxBQUN2RDtrQkFBQSxBQUFNLGlCQUFpQiwrQ0FBdkIsQUFBdUIsQUFBK0IsUUFBUSxRQUE5RCxBQUE4RCxBQUFRLEFBQ3pFO0FBRkQsQUFHQTtBQUNBO1lBQUksbUNBQW1CLEFBQU0sV0FBTixBQUFpQixPQUFqQixBQUF3QixXQUF4QixBQUFtQyxXQUFuQyxBQUE4QyxPQUFPLHFCQUFBO21CQUFhLFVBQUEsQUFBVSxTQUF2QixBQUFnQztBQUE1RyxBQUF1QixBQUV2QixTQUZ1Qjs7WUFFcEIsaUJBQUEsQUFBaUIsU0FBcEIsQUFBNkIsR0FBRSxBQUMzQjs2QkFBQSxBQUFpQixHQUFqQixBQUFvQixPQUFwQixBQUEyQixNQUEzQixBQUFpQyxRQUFRLG9CQUFZLEFBQ2pEO3lCQUFBLEFBQVMsUUFBUSxnQkFBUSxBQUFFO3lCQUFBLEFBQUssaUJBQUwsQUFBc0IsUUFBUSxRQUE5QixBQUE4QixBQUFRLEFBQWM7QUFBL0UsQUFDSDtBQUZELEFBR0g7QUFDSjtBQVpELEFBYUg7QUFsQ0Q7O0FBb0NBOzs7Ozs7Ozs7a0JBUWUsZ0JBQVEsQUFDbkI7b0JBQUEsQUFBTSxTQUFTLG1CQUFmLEFBQXVCLG1CQUFvQixnQ0FBM0MsQUFBMkMsQUFBZ0IsQUFDM0Q7U0FBQSxBQUFLLGlCQUFMLEFBQXNCLFVBQVUsU0FBaEMsQUFBZ0MsQUFBUyxBQUN6QztTQUFBLEFBQUssaUJBQUwsQUFBc0IsU0FBUyxZQUFNLEFBQUU7d0JBQUEsQUFBTSxPQUFPLFFBQWIsQUFBcUIsY0FBckIsQUFBbUMsTUFBTSxNQUF6QyxBQUEwRDtBQUFqRyxBQUVBOzs7a0JBQ2MsU0FEUCxBQUNPLEFBQVMsQUFDbkI7bUJBRkosQUFBTyxBQUlWO0FBSlUsQUFDSDtBOzs7Ozs7Ozs7OztBQzFJUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O3NGQUlLLG1CLEFBQVEsbUJBQW9CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtXQUFpQixPQUFBLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0IsT0FBbkMsQUFBaUIsQUFBeUI7QSwyQ0FDdEUsbUIsQUFBUSxjQUFlLGlCQUFBO2tCQUFTLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0I7dUJBQ3ZDLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQ3JEO2dCQUFBLEFBQUksZ0JBQVMsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFBLEFBQU0sT0FBeEIsQUFBa0IsQUFBYTsrQkFBUSxBQUNqQyxBQUNmO3VCQUZKLEFBQWEsQUFBdUMsQUFFekMsQUFFWDtBQUpvRCxBQUNoRCxhQURTO21CQUliLEFBQU8sQUFDVjtBQU5PLFNBQUEsRUFEWSxBQUFTLEFBQXlCLEFBQzlDLEFBTUw7QUFQbUQsQUFDdEQsS0FENkI7QSwyQ0FTaEMsbUIsQUFBUSxhQUFjLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtrQkFBaUIsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjt1QkFDOUMsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFsQixBQUF3Qiw0QkFBeEIsQUFDSCxhQUFPLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBQSxBQUFNLE9BQXhCLEFBQWtCLEFBQWE7MkJBQU8sQUFDM0IsQUFDZjttQkFKVyxBQUFpQixBQUF5QixBQUNyRCxBQUNJLEFBQXNDLEFBRW5DO0FBRm1DLEFBQzFDLFNBREksRUFESjtBQURxRCxBQUM3RCxLQURvQztBLDJDQVF2QyxtQixBQUFRLHVCQUF3QixVQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVI7a0JBQWlCLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0I7dUJBQ3hELEFBQU8sT0FBUCxBQUFjLElBQUksTUFBbEIsQUFBd0IsNEJBQzNCLEtBREcsQUFDRSxrQkFBWSxBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQUEsQUFBTSxPQUFPLEtBQWIsQUFBa0IsYUFBYSxNQUFBLEFBQU0sT0FBTyxLQUE1QyxBQUErQixBQUFrQixhQUFuRSxBQUFnRixJQUM5RCxNQUFBLEFBQU0sT0FBTyxLQUFiLEFBQWtCLGFBQWMsRUFBRSx5Q0FBZ0IsTUFBQSxBQUFNLE9BQU8sS0FBYixBQUFrQixXQUFsQyxBQUE2QyxjQUFZLEtBQTNGLEFBQWdDLEFBQUUsQUFBOEQ7b0JBRXBGLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsa0JBQWtCLEtBRG5ELEFBQ1UsQUFBYyxBQUFnQyxBQUN0RDs2QkFBaUIsU0FBQSxBQUFTLHdFQUFzRCxLQUEvRCxBQUFvRSxvQkFGdkYsQUFFd0csQUFDdEc7bUJBSEYsQUFHUyxBQUNQO3dCQUFZLENBQUMsS0FSNUIsQUFBaUIsQUFBeUIsQUFDL0QsQUFDYyxBQUVvQixBQUljLEFBQU07QUFKcEIsQUFDRSxTQUh0QixFQURkO0FBRCtELEFBQ3ZFLEtBRDhDO0EsMkNBWWpELG1CLEFBQVEsbUJBQW9CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUyxBQUMxQztrQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCOzRCQUFPLEFBQ1IsQUFDcEI7dUJBQVEsQUFBTyxLQUFLLE1BQVosQUFBa0IsUUFBbEIsQUFBMEIsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDckQ7Z0JBQUEsQUFBSSxTQUFTLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFBLEFBQU0sT0FBeEIsQUFBa0IsQUFBYSxRQUFRLEtBQXBELEFBQWEsQUFBdUMsQUFBSyxBQUN6RDttQkFBQSxBQUFPLEFBQ1Y7QUFITyxTQUFBLEVBRlosQUFBTyxBQUF5QixBQUVwQixBQUdMLEFBRVY7QUFQbUMsQUFDNUIsS0FERztBLDJDQVFWLG1CLEFBQVEsa0JBQW1CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUyxBQUN6QztrQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCO3VCQUNiLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBbEIsQUFBd0IsNEJBQzNCLEtBREcsQUFDRSxjQUFRLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBQSxBQUFNLE9BQU8sS0FBL0IsQUFBa0IsQUFBa0I7MkJBQy9CLEtBRHVDLEFBQ2xDLEFBQ3BCO21CQUpaLEFBQU8sQUFBeUIsQUFDcEIsQUFDVSxBQUE0QyxBQUUvQyxBQUl0QjtBQU5xRSxBQUN0RCxTQURVLEVBRFY7QUFEb0IsQUFDNUIsS0FERztBOzs7Ozs7Ozs7QUM5Q2Y7Ozs7Ozs7O0FBQ0E7QUFDQSxJQUFJLFFBQUosQUFBWTs7QUFFWjtBQUNBOztBQUVBO0FBQ0EsSUFBTSxXQUFXLFNBQVgsQUFBVyxXQUFBO1NBQUEsQUFBTTtBQUF2Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsSUFBTSxXQUFXLFNBQVgsQUFBVyxTQUFBLEFBQVMsTUFBVCxBQUFlLFdBQWYsQUFBMEIsU0FBUyxBQUNoRDtVQUFRLFlBQVksbUJBQUEsQUFBUyxNQUFULEFBQWUsT0FBM0IsQUFBWSxBQUFzQixhQUExQyxBQUF1RCxBQUN2RDtBQUNBO0FBQ0E7TUFBRyxDQUFILEFBQUksU0FBUyxBQUNiO1VBQUEsQUFBUSxRQUFRLGtCQUFVLEFBQUU7V0FBQSxBQUFPLEFBQVM7QUFBNUMsQUFDSDtBQU5EOztrQkFRZSxFQUFFLFVBQUYsVUFBWSxVLEFBQVo7Ozs7Ozs7Ozs7QUMzQmY7Ozs7QUFDQTs7OztBQUNBOztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7QUFRQSxJQUFNLGVBQWUsU0FBZixBQUFlLGFBQUEsQUFBQyxPQUFELEFBQVEsT0FBVSxBQUNuQztRQUFJLFFBQVEsTUFBQSxBQUFNLDJCQUFsQixBQUFZLEFBQStCLEFBQzNDOytCQUNhLE1BQUEsQUFBTSxNQUFOLEFBQVksS0FEekIsQUFDYSxBQUFpQixJQUFLLENBQUMsQ0FBQyxDQUFDLCtCQUFBLEFBQW9CLFFBQXZCLEFBQUcsQUFBNEIsU0FBUyxrQ0FBQSxBQUFzQixPQUE5RCxBQUF3QyxBQUE2QixTQUR4RyxBQUNnSCxBQUVuSDtBQUxEOztBQU9BOzs7Ozs7Ozs7QUFTQSxJQUFNLGdCQUFnQixTQUFoQixBQUFnQixjQUFBLEFBQUMsT0FBRCxBQUFRLFNBQVI7b0NBQW9CLEFBQWM7eUNBRUEsQUFBYyxTQUFkLEFBQ0ssT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDcEI7bUJBQU8sTUFBQSxBQUFNLDJCQUFOLEFBQStCLFNBQVcsT0FBQSxBQUFPLE9BQVAsQUFBYyxLQUFLLGFBQUEsQUFBYSxPQUExRSxBQUEwQyxBQUFtQixBQUFvQixVQUF4RixBQUFrRyxBQUNwRztBQUhOLFNBQUEsRUFGZCxBQUNJLEFBQ1UsQUFHUTtBQUpsQixBQUNFLEtBRk4sR0FBcEIsQUFPd0I7QUFQOUM7O0FBU0E7Ozs7Ozs7Ozs7O0FBV0EsSUFBTSwyQkFBMkIsU0FBM0IsQUFBMkIsZ0NBQUE7c0NBQVMsQUFBZ0IsT0FBTyxVQUFBLEFBQUMsWUFBRCxBQUFhLFNBQWI7ZUFDTCxDQUFDLE1BQUEsQUFBTSwyQkFBUCxBQUFDLEFBQStCLFdBQWhDLEFBQ0UsMENBREYsQUFFTSxxQkFDRixBQUFPO2tCQUFPLEFBQ0osQUFDTixPQUZVLEFBQ1Y7cUJBQ1MsTUFBQSxBQUFNLDJCQUZuQixBQUFjLEFBRUQsQUFBK0IsVUFGNUMsRUFHSSxjQUFBLEFBQWMsT0FQakIsQUFDTCxBQUdJLEFBR0ksQUFBcUI7QUFQL0MsS0FBQSxFQUFULEFBQVMsQUFVYztBQVZ4RDs7QUFhQTs7Ozs7Ozs7OztBQVVBLElBQU0sd0JBQXdCLFNBQXhCLEFBQXdCLDZCQUFBO1dBQVMsaUJBQUssTUFBTCxBQUFLLEFBQU0sUUFBUSxJQUFuQixBQUFtQixBQUFJLFFBQVEsT0FBL0IsQUFBK0IsQUFBTyxRQUFRLFVBQTlDLEFBQThDLEFBQVUsUUFBUSxVQUFoRSxBQUFnRSxBQUFVLFFBQVEsSUFBbEYsQUFBa0YsQUFBSSxRQUFRLElBQTlGLEFBQThGLEFBQUksUUFBUSxRQUExRyxBQUEwRyxBQUFRLFFBQVEsU0FBbkksQUFBUyxBQUEwSCxBQUFTO0FBQTFLOztBQUVBOzs7Ozs7QUFNQSxJQUFNLFdBQVcsU0FBWCxBQUFXLGdCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFRLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGVBQWUsTUFBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQXJELEFBQXFFLHVDQUFyRSxBQUFtRixjQUFZLEVBQUMsTUFBaEcsQUFBK0YsQUFBTyxpQkFBNUgsQUFBMkk7QUFBcEo7QUFBakI7QUFDQSxJQUFNLFFBQVEsU0FBUixBQUFRLGFBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0IsdUNBQS9CLEFBQTZDLGNBQVksRUFBQyxNQUExRCxBQUF5RCxBQUFPLGNBQXRGLEFBQWtHO0FBQTNHO0FBQWQ7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0IscUNBQS9CLEFBQTJDLGNBQVksRUFBQyxNQUF4RCxBQUF1RCxBQUFPLFlBQXBGLEFBQThGO0FBQXZHO0FBQVo7QUFDQSxJQUFNLFNBQVMsU0FBVCxBQUFTLGNBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0Isd0NBQS9CLEFBQThDLGNBQVksRUFBQyxNQUEzRCxBQUEwRCxBQUFPLGVBQXZGLEFBQW9HO0FBQTdHO0FBQWY7QUFDQSxJQUFNLFlBQVksU0FBWixBQUFZLGlCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFnQixNQUFBLEFBQU0sYUFBTixBQUFtQixpQkFBdkQsQUFBd0UsdUNBQXhFLEFBQXVGLGNBQVksRUFBQyxNQUFELEFBQU8sYUFBYSxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBNUksQUFBbUcsQUFBNEIsQUFBTyxBQUFtQixxQkFBL0ssQUFBaU07QUFBMU07QUFBbEI7QUFDQSxJQUFNLFlBQVksU0FBWixBQUFZLGlCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFnQixNQUFBLEFBQU0sYUFBTixBQUFtQixpQkFBdkQsQUFBd0UsdUNBQXhFLEFBQXVGLGNBQVksRUFBQyxNQUFELEFBQU8sYUFBYSxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBNUksQUFBbUcsQUFBNEIsQUFBTyxBQUFtQixxQkFBL0ssQUFBaU07QUFBMU07QUFBbEI7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsVUFBVSxNQUFBLEFBQU0sYUFBTixBQUFtQixXQUFqRCxBQUE0RCx1Q0FBNUQsQUFBMkUsY0FBWSxFQUFDLE1BQUQsQUFBTyxPQUFPLFFBQVEsRUFBRSxLQUFLLE1BQUEsQUFBTSxhQUExSCxBQUF1RixBQUFzQixBQUFPLEFBQW1CLGVBQTdKLEFBQXlLO0FBQWxMO0FBQVo7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsVUFBVSxNQUFBLEFBQU0sYUFBTixBQUFtQixXQUFqRCxBQUE0RCx1Q0FBNUQsQUFBMkUsY0FBWSxFQUFDLE1BQUQsQUFBTyxPQUFPLFFBQVEsRUFBRSxLQUFLLE1BQUEsQUFBTSxhQUExSCxBQUF1RixBQUFzQixBQUFPLEFBQW1CLGVBQTdKLEFBQXlLO0FBQWxMO0FBQVo7QUFDQSxJQUFNLFVBQVUsU0FBVixBQUFVLGVBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsY0FBYyxNQUFBLEFBQU0sYUFBTixBQUFtQixlQUFyRCxBQUFvRSx1Q0FBcEUsQUFBbUYsY0FBWSxFQUFDLE1BQUQsQUFBTyxXQUFXLFFBQVEsRUFBRSxPQUFPLE1BQUEsQUFBTSxhQUF4SSxBQUErRixBQUEwQixBQUFTLEFBQW1CLG1CQUEzSyxBQUEyTDtBQUFwTTtBQUFoQjs7QUFFQTs7Ozs7OztBQU9PLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLDJCQUFBO1dBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQW5CLEFBQW1DLFNBQ2pDLHlCQURGLEFBQ0UsQUFBeUIsU0FDekIsc0JBRlgsQUFFVyxBQUFzQjtBQUY3RDs7QUFJUDs7Ozs7OztBQU9PLElBQU0sOEJBQVcsU0FBWCxBQUFXLFNBQUEsQUFBQyxPQUFELEFBQVEsV0FBUjtXQUFzQixVQUFBLEFBQVUsU0FBVixBQUFtQixXQUNqQixrQkFBQSxBQUFRLFVBQVUsVUFBbEIsQUFBNEIsUUFEOUIsQUFDRSxBQUFvQyxTQUNwQyxrQkFBUSxVQUFSLEFBQWtCLE1BQWxCLEFBQXdCLE9BQU8sVUFGdkQsQUFFd0IsQUFBeUM7QUFGbEY7O0FBSVA7Ozs7Ozs7Ozs7OztBQVlPLElBQU0sNERBQTBCLFNBQTFCLEFBQTBCLHdCQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDbkQ7UUFBSSxPQUFPLE1BQUEsQUFBTSxhQUFqQixBQUFXLEFBQW1CLEFBQzlCO2VBQU8sQUFBSSxRQUFRLElBQUEsQUFBSSxRQUFRLE9BQUEsQUFBTyxPQUFPLElBQWQsQUFBYyxBQUFJLE9BQU8sRUFBRSxxQ0FBWSxJQUFBLEFBQUksTUFBaEIsQUFBc0IsVUFBN0QsQUFBWSxBQUF5QixBQUFFLEFBQThCO2VBQ3pELEFBQ2EsQUFDUjtvQkFBWSxvQkFGakIsQUFFaUIsQUFBb0IsQUFDaEM7Z0JBQVEsQ0FIYixBQUdhLEFBQUMsQUFDVDt5QkFBaUIsU0FBQSxBQUFTLHlFQUF1RCxNQUFBLEFBQU0sYUFBdEUsQUFBZ0UsQUFBbUIsbUJBTGpJLEFBQ3dCLEFBSXlIO0FBSnpILEFBQ0ssS0FGN0IsRUFBUCxBQU1tQyxBQUN0QztBQVRNOztBQVdQOzs7Ozs7OztBQVFBLElBQU0sc0JBQXNCLFNBQXRCLEFBQXNCLCtCQUFBO1dBQWEsVUFBQSxBQUFVLFdBQVcsbUJBQVMsVUFBVCxBQUFtQixNQUFNLFVBQUEsQUFBVSxXQUFWLEFBQXFCLFlBQVksVUFBakMsQUFBMkMsU0FBdEcsQUFBa0MsQUFBNkU7QUFBM0k7O0FBRUE7Ozs7Ozs7QUFPTyxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLE9BQUQsQUFBUSxPQUFSO1dBQWtCLFVBQUEsQUFBQyxLQUFELEFBQU0sVUFBTixBQUFnQixHQUFNLEFBQ3ZFO2VBQU8sYUFBQSxBQUFhLE9BQWIsQUFDTyxtQ0FEUCxBQUVXLE9BQUssT0FBQSxBQUFPLGFBQVAsQUFBb0IsWUFDakIsb0JBQW9CLE1BQUEsQUFBTSxPQUFOLEFBQWEsT0FBYixBQUFvQixXQUQzQyxBQUNHLEFBQW9CLEFBQStCLE1BSDdFLEFBQU8sQUFJbUIsQUFDN0I7QUFOa0M7QUFBNUI7O0FBUVA7Ozs7Ozs7O0FBUU8sSUFBTSxnRUFBNEIsU0FBNUIsQUFBNEIsa0NBQVUsQUFDL0M7UUFBSSxtQkFBSixBQUF1QixBQUV2Qjs7U0FBSSxJQUFKLEFBQVEsU0FBUixBQUFpQixRQUNiO1lBQUcsT0FBQSxBQUFPLE9BQVAsQUFBYyxXQUFkLEFBQXlCLFNBQTVCLEFBQXFDLEdBQ2pDLGlCQUFBLEFBQWlCLFNBQVMsT0FGbEMsQUFFUSxBQUEwQixBQUFPO0FBRXpDLFlBQUEsQUFBTyxBQUNWO0FBUk07O0FBVVA7Ozs7Ozs7OztBQVNPLElBQU0sNENBQWtCLFNBQWxCLEFBQWtCLHNCQUFBOzs0QkFBUyxBQUNoQixBQUNwQjtnQkFBUSwwQkFBMEIsR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyxpQkFBbkIsQUFBYyxBQUFzQiwrQ0FBcEMsQUFDakIsT0FEaUIsQUFDVix5QkFIRyxBQUFTLEFBRTVCLEFBQTBCLEFBQ2U7QUFIYixBQUNwQztBQURHOztBQU1QOzs7Ozs7QUFNTyxJQUFNLDhEQUEyQixTQUEzQixBQUEyQix5QkFBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQ25EO1FBQUcsU0FBSCxBQUFZLE1BQU0sTUFBQSxBQUFNLEFBQ3hCO1dBQUEsQUFBTyxBQUNWO0FBSE07O0FBS1A7Ozs7Ozs7O0FBUU8sSUFBTSw4Q0FBbUIsU0FBbkIsQUFBbUIseUJBQVUsQUFDdEM7bUJBQU8sQUFBUSxXQUNYLEFBQU8sS0FBUCxBQUFZLFFBQVosQUFDSyxJQUFJLGlCQUFBO2VBQVMsc0JBQXNCLE9BQS9CLEFBQVMsQUFBc0IsQUFBTztBQUZuRCxBQUFPLEFBQ0gsQUFHUCxLQUhPLENBREc7QUFESjs7QUFPUDs7Ozs7Ozs7QUFRTyxJQUFNLHdEQUF3QixTQUF4QixBQUF3Qiw2QkFBUyxBQUMxQztRQUFJLFdBQUosQUFBZSxBQUNsQjttQkFBTyxBQUFRLFVBQUksQUFBTSxXQUFOLEFBQWlCLElBQUkscUJBQWEsQUFDOUM7bUJBQU8sQUFBSSxRQUFRLG1CQUFXLEFBQzFCO2dCQUFHLFVBQUEsQUFBVSxTQUFiLEFBQXNCLFVBQVMsQUFDM0I7b0JBQUcsU0FBQSxBQUFTLE9BQVosQUFBRyxBQUFnQixZQUFZLFFBQS9CLEFBQStCLEFBQVEsV0FDbEMsQUFDRDsrQkFBQSxBQUFXLEFBQ1g7NEJBQUEsQUFBUSxBQUNYO0FBQ0o7QUFORCxtQkFNTyxJQUFBLEFBQUcsVUFBVSxRQUFiLEFBQWEsQUFBUSxxQkFDbkIsQUFBUyxPQUFULEFBQWdCLFdBQWhCLEFBQ0ksS0FBSyxlQUFPLEFBQUU7d0JBQUEsQUFBUSxBQUFNO0FBRGhDLEFBRVosYUFGWTtBQVJiLEFBQU8sQUFXVixTQVhVO0FBRGQsQUFBTyxBQUFZLEFBYW5CLEtBYm1CLENBQVo7QUFGRDs7QUFpQlA7Ozs7Ozs7O0FBUU8sSUFBTSwwRUFBaUMsU0FBakMsQUFBaUMsc0NBQUE7V0FBUyxDQUFBLEFBQUMsU0FBRCxBQUFVLFVBQVUsT0FBTyx3QkFBQSxBQUFZLFVBQVUscUJBQXRCLEFBQXNCLEFBQVMsVUFBVSxtQkFBN0UsQUFBUyxBQUFvQixBQUFnRCxBQUFPO0FBQTNIOzs7Ozs7Ozs7QUN4UVA7O0FBQ0E7O0FBRUEsSUFBTSxhQUFhLFNBQWIsQUFBYSxrQkFBQTtXQUFTLENBQUMsdUJBQUQsQUFBQyxBQUFXLFVBQVUsa0NBQUEsQUFBc0IsV0FBckQsQUFBZ0U7QUFBbkY7O0FBRUEsSUFBTSwwQkFBMEIsU0FBMUIsQUFBMEIsd0JBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtpQkFBaUIsQUFBTSxXQUFOLEFBQWlCLE9BQU8scUJBQUE7ZUFBYSxVQUFBLEFBQVUsU0FBdkIsQUFBZ0M7QUFBeEQsS0FBQSxFQUFBLEFBQThELEdBQS9FLEFBQWtGO0FBQWxIOztBQUVBLElBQU0sbUJBQW1CLFNBQW5CLEFBQW1CLHdCQUFBO1dBQVMsaUJBQUE7ZUFBUyxXQUFBLEFBQVcsZ0JBQVMsQUFBTSxPQUFOLEFBQWEsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sTUFBQSxBQUFNLEtBQUssTUFBakIsQUFBTSxBQUFpQixRQUF4QyxBQUFnRDtBQUFwRSxTQUFBLEVBQTdCLEFBQTZCLEFBQTBFO0FBQWhIO0FBQXpCOztBQUVBLElBQU0sbUJBQW1CLFNBQW5CLEFBQW1CLGlCQUFBLEFBQUMsTUFBRCxBQUFPLFNBQVA7V0FBbUIsaUJBQUE7ZUFBUyxXQUFBLEFBQVcsVUFBVSxNQUFBLEFBQU0sT0FBTixBQUFhLE9BQU8sUUFBUSx3QkFBQSxBQUF3QixPQUFwRCxBQUFvQixBQUFRLEFBQStCLFFBQXpGLEFBQThCLEFBQW1FO0FBQXBIO0FBQXpCOzs7Y0FHYyx5QkFBQTtlQUFTLGtDQUFBLEFBQXNCLFdBQS9CLEFBQTBDO0FBRHpDLEFBRVg7V0FBTyw0QkFGSSxBQUdYO1NBQUssNEJBSE0sQUFJWDtVQUFNLHFCQUFBO2VBQVMsV0FBQSxBQUFXLGdCQUFTLEFBQU0sT0FBTixBQUFhLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLENBQUMsY0FBQSxBQUFjLEtBQUssSUFBQSxBQUFJLEtBQUssTUFBVCxBQUFlLE9BQXpDLEFBQU8sQUFBbUIsQUFBc0IsYUFBakUsQUFBOEU7QUFBbEcsU0FBQSxFQUE3QixBQUE2QixBQUF3RztBQUpoSSxBQUtYO2FBQVMsNEJBTEUsQUFNWDtZQUFRLDRCQU5HLEFBT1g7WUFBUSw0QkFQRyxBQVFYO2dDQUFXLEFBQ1AsYUFDQSxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxNQUFBLEFBQU0sUUFBUSxNQUFkLEFBQW9CLFNBQVMsTUFBQSxBQUFNLE1BQU4sQUFBWSxVQUFVLENBQUMsT0FBcEQsQUFBMkQsTUFBTSxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQS9GLEFBQXNHLEtBQXZILEFBQTRIO0FBQXRJO0FBVk8sQUFRQSxBQUlYLEtBSlc7Z0NBSUEsQUFDUCxhQUNBLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLE1BQUEsQUFBTSxRQUFRLE1BQWQsQUFBb0IsU0FBUyxNQUFBLEFBQU0sTUFBTixBQUFZLFVBQVUsQ0FBQyxPQUFwRCxBQUEyRCxNQUFNLENBQUMsTUFBQSxBQUFNLE1BQVAsQUFBYSxVQUFVLENBQUMsT0FBL0YsQUFBc0csS0FBdkgsQUFBNEg7QUFBdEk7QUFkTyxBQVlBLEFBSVgsS0FKVzs4QkFJRixBQUFpQixXQUFXLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQzNEO21CQUFPLGFBQU0sQUFBTyxNQUFQLEFBQWEsT0FBTyxVQUFBLEFBQUMsYUFBRCxBQUFjLFVBQWEsQUFDeEQ7b0JBQUcsa0NBQUEsQUFBc0IsY0FBYyxNQUF2QyxBQUE2QyxPQUFPLGNBQUEsQUFBYyxBQUNsRTt1QkFBQSxBQUFPLEFBQ1Y7QUFIWSxhQUFBLEVBQU4sQUFBTSxBQUdWLE9BSEgsQUFHVSxBQUNiO0FBTG9DO0FBaEIxQixBQWdCRixBQU1ULEtBTlM7OEJBTUEsQUFBaUIsV0FBVyxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxPQUFPLE9BQVAsQUFBYyxPQUFkLEFBQXFCLEtBQUssTUFBaEMsQUFBTSxBQUFnQyxRQUF2RCxBQUErRDtBQUF6RTtBQXRCMUIsQUFzQkYsQUFDVCxLQURTOzRCQUNGLEFBQWlCLFNBQVMsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sT0FBTyxPQUFQLEFBQWMsT0FBZCxBQUFxQixLQUFLLE1BQWhDLEFBQU0sQUFBZ0MsUUFBdkQsQUFBK0Q7QUFBekU7QUF2QnRCLEFBdUJKLEFBQ1AsS0FETzswQkFDRixBQUFpQixPQUFPLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxPQUF2QixBQUE4QixLQUEvQyxBQUFvRDtBQUE5RDtBQXhCbEIsQUF3Qk4sQUFDTCxLQURLOzBCQUNBLEFBQWlCLE9BQU8sa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQXZCLEFBQThCLEtBQS9DLEFBQW9EO0FBQTlEO0FBekJsQixBQXlCTixBQUNMLEtBREs7NkJBQ0csQUFBaUIsVUFBVSxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTyxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQXhCLEFBQStCLFFBQVEsT0FBQSxBQUFPLFFBQVAsQUFBZSxhQUFhLENBQUMsTUFBQSxBQUFNLE1BQVAsQUFBYSxVQUFVLENBQUMsT0FBbEcsQUFBTyxBQUFrRyxNQUExSCxBQUFpSTtBQUEzSTtBQTFCeEIsQUEwQkgsQUFDUixLQURROzRCQUNELEFBQWlCLFNBQVMsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU8sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQWpCLEFBQXdCLE9BQU8sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQXZELEFBQThELEtBQS9FLEFBQXFGO0FBQS9GO0FBM0J0QixBQTJCSixBQUNQLEtBRE87WUFDQyxnQkFBQSxBQUFDLE9BQUQsQUFBUSxRQUFSO21CQUFtQixBQUFJLFFBQVEsVUFBQSxBQUFDLFNBQUQsQUFBVSxRQUFXLEFBQ3hEOzhCQUFPLE9BQUEsQUFBTyxTQUFQLEFBQWdCLFFBQVEsT0FBeEIsQUFBK0IsTUFBUyxPQUF4QyxBQUErQyxZQUFPLDZCQUFpQixPQUE5RSxBQUE2RCxBQUF3Qjt3QkFDekUsT0FBQSxBQUFPLEtBRHdGLEFBQy9GLEFBQVksQUFDcEI7c0JBQU0sT0FBQSxBQUFPLFNBQVAsQUFBZ0IsUUFBaEIsQUFBd0IsT0FBTyw2QkFBaUIsT0FGaUQsQUFFbEUsQUFBd0IsQUFDN0Q7NkJBQVMsQUFBSTtvQ0FIakIsQUFBMkcsQUFHOUYsQUFBWSxBQUNEO0FBREMsQUFDakIsaUJBREs7QUFIOEYsQUFDdkcsZUFESixBQU9DLEtBQUssZUFBQTt1QkFBTyxJQUFQLEFBQU8sQUFBSTtBQVBqQixlQUFBLEFBUUMsS0FBSyxnQkFBUSxBQUFFO3dCQUFBLEFBQVEsQUFBUTtBQVJoQyxlQUFBLEFBU0MsTUFBTSxlQUFPLEFBQUU7MkNBQUEsQUFBeUIsQUFBUztBQVRsRCxBQVVIO0FBWE8sQUFBbUIsU0FBQTtBQTVCaEIsQUF3Q1g7WUFBUSxnQkFBQSxBQUFDLFFBQUQsQUFBUyxPQUFUO2VBQW1CLFdBQUEsQUFBVyxVQUFTLE9BQU8sa0NBQVAsQUFBTyxBQUFzQixRQUFRLE1BQTVFLEFBQXVDLEFBQTJDO0EsQUF4Qy9FO0FBQUEsQUFDWDs7Ozs7Ozs7QUNaRyxJQUFNLG9DQUFjLFNBQWQsQUFBYyxtQkFBQTtBQUFVLFdBQUQsbUJBQUEsQUFBb0IsS0FBSyxNQUFsQyxBQUFTLEFBQStCOztBQUE1RDs7QUFFQSxJQUFNLDBCQUFTLFNBQVQsQUFBUyxjQUFBO1dBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBNUIsQUFBd0M7QUFBdkQ7O0FBRUEsSUFBTSw4QkFBVyxTQUFYLEFBQVcsZ0JBQUE7V0FBUyxNQUFBLEFBQU0sU0FBTixBQUFlLGtCQUF4QixBQUEwQztBQUEzRDs7QUFFQSxJQUFNLGtDQUFhLFNBQWIsQUFBYSxrQkFBQTtpQkFBUyxBQUFNLFdBQU4sQUFBaUIsT0FBTyxxQkFBQTtlQUFhLFVBQUEsQUFBVSxTQUF2QixBQUFnQztBQUF4RCxLQUFBLEVBQUEsQUFBb0UsU0FBN0UsQUFBc0Y7QUFBekc7O0FBRVAsSUFBTSxXQUFXLFNBQVgsQUFBVyxnQkFBQTtXQUFVLE1BQUEsQUFBTSxVQUFOLEFBQWdCLGFBQWEsTUFBQSxBQUFNLFVBQW5DLEFBQTZDLFFBQVEsTUFBQSxBQUFNLE1BQU4sQUFBWSxTQUEzRSxBQUFvRjtBQUFyRzs7QUFFTyxJQUFNLGdEQUFvQixTQUFwQixBQUFvQixrQkFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQzdDO1FBQUcsQ0FBQyxZQUFELEFBQUMsQUFBWSxVQUFVLFNBQTFCLEFBQTBCLEFBQVMsUUFBUSxNQUFNLE1BQU4sQUFBWSxBQUN2RDtRQUFHLFlBQUEsQUFBWSxVQUFVLE1BQXpCLEFBQStCLFNBQVMsQUFDcEM7WUFBRyxNQUFBLEFBQU0sUUFBVCxBQUFHLEFBQWMsTUFBTSxJQUFBLEFBQUksS0FBSyxNQUFoQyxBQUF1QixBQUFlLFlBQ2pDLE1BQU0sQ0FBQyxNQUFQLEFBQU0sQUFBTyxBQUNyQjtBQUNEO1dBQUEsQUFBTyxBQUNWO0FBUE07O0FBU0EsSUFBTSw4Q0FBbUIsU0FBbkIsQUFBbUIsNkJBQUE7c0JBQWMsQUFBVyxJQUFJLFVBQUEsQUFBQyxPQUFVLEFBQ3BFO2VBQVUsTUFBQSxBQUFNLEdBQU4sQUFBUyxhQUFuQixBQUFVLEFBQXNCLGdCQUFXLHNCQUEzQyxBQUEyQyxBQUFzQixBQUNwRTtBQUY2QyxLQUFBLEVBQUEsQUFFM0MsS0FGNkIsQUFBYyxBQUV0QztBQUZEOztBQUlBLElBQU0sd0RBQXdCLFNBQXhCLEFBQXdCLHNCQUFBLEFBQUMsTUFBRCxBQUFPLE9BQVA7Z0JBQWlCLEFBQUssTUFBTCxBQUFXLEtBQVgsQUFDTCxJQUFJLGdCQUFRLEFBQ1Q7WUFBSSxtQkFBbUIscUJBQXFCLGtCQUFBLEFBQWtCLE1BQU0sZUFBZSxNQUFBLEFBQU0sYUFBekYsQUFBdUIsQUFBcUIsQUFBd0IsQUFBZSxBQUFtQixBQUN0RztlQUFPLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsNEJBQVQsQUFBbUMsbUJBQXhELEFBQU8sQUFDVjtBQUpaLEFBQWlCLEtBQUE7QUFBL0M7O0FBTVAsSUFBTSx1QkFBdUIsU0FBdkIsQUFBdUIsNEJBQUE7V0FBUyxNQUFBLEFBQU0sUUFBTixBQUFjLDBDQUF2QixBQUFTLEFBQXdEO0FBQTlGOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLEFBQWlCLDBCQUFBO1dBQWEsVUFBQSxBQUFVLE9BQVYsQUFBaUIsR0FBRyxVQUFBLEFBQVUsWUFBVixBQUFzQixPQUF2RCxBQUFhLEFBQWlEO0FBQXJGOztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLEFBQW9CLGtCQUFBLEFBQUMsT0FBRCxBQUFRLFFBQVcsQUFDekM7UUFBSSxNQUFBLEFBQU0sUUFBTixBQUFjLFVBQWxCLEFBQTRCLEdBQUcsUUFBUSxNQUFBLEFBQU0sUUFBTixBQUFjLE1BQXRCLEFBQVEsQUFBb0IsQUFDM0Q7V0FBQSxBQUFPLEFBQ1Y7QUFIRDs7QUFLTyxJQUFNLHNCQUFPLFNBQVAsQUFBTyxPQUFBO3NDQUFBLEFBQUksa0RBQUE7QUFBSiw4QkFBQTtBQUFBOztlQUFZLEFBQUksT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLElBQU47ZUFBYSxHQUFiLEFBQWEsQUFBRztBQUF2QyxBQUFZLEtBQUE7QUFBekI7O0FBR0EsSUFBTSx3REFBd0IsU0FBeEIsQUFBd0IsNkJBQUE7V0FBUyxNQUFBLEFBQU0sZUFBTixBQUFxQixZQUNyQixNQUFBLEFBQU0sT0FBTixBQUFhLE9BQWIsQUFBb0IsbUJBRHBCLEFBQ0EsQUFBdUMsTUFDdkMsTUFBQSxBQUFNLE9BQU4sQUFBYSxtQkFGdEIsQUFFUyxBQUFnQztBQUZ2RTs7QUFJQSxJQUFNLHdCQUFRLFNBQVIsQUFBUSxNQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDakM7ZUFBTyxBQUFJLFFBQVEsVUFBQSxBQUFDLFNBQUQsQUFBVSxRQUFXLEFBQ3BDO1lBQUksTUFBTSxJQUFWLEFBQVUsQUFBSSxBQUNkO1lBQUEsQUFBSSxLQUFLLE1BQUEsQUFBTSxVQUFmLEFBQXlCLE9BQXpCLEFBQWdDLEFBQ2hDO1lBQUksTUFBSixBQUFVLFNBQVMsQUFDZjttQkFBQSxBQUFPLEtBQUssTUFBWixBQUFrQixTQUFsQixBQUEyQixRQUFRLGVBQU8sQUFDdEM7b0JBQUEsQUFBSSxpQkFBSixBQUFxQixLQUFLLE1BQUEsQUFBTSxRQUFoQyxBQUEwQixBQUFjLEFBQzNDO0FBRkQsQUFHSDtBQUNEO1lBQUEsQUFBSSxTQUFTLFlBQU0sQUFDZjtnQkFBSSxJQUFBLEFBQUksVUFBSixBQUFjLE9BQU8sSUFBQSxBQUFJLFNBQTdCLEFBQXNDLEtBQUssUUFBUSxJQUFuRCxBQUEyQyxBQUFZLGVBQ2xELE9BQU8sSUFBUCxBQUFXLEFBQ25CO0FBSEQsQUFJQTtZQUFBLEFBQUksVUFBVSxZQUFBO21CQUFNLE9BQU8sSUFBYixBQUFNLEFBQVc7QUFBL0IsQUFDQTtZQUFBLEFBQUksS0FBSyxNQUFULEFBQWUsQUFDbEI7QUFkRCxBQUFPLEFBZVYsS0FmVTtBQURKOzs7OztBQzdDUDs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxlQUFBLEFBQVMsS0FBekIsQUFBZ0IsQUFBYyxBQUU5Qjs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQXJCRCxBQUFnQyxDQUFBOztBQXVCaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXHRcblx0Ly9pZiB3ZSB0aGluayBjYW5kaWRhdGUgaXMgYSBmb3JtIERPTSBub2RlLCBwYXNzIGl0IGluIGFuIEFycmF5XG5cdC8vb3RoZXJ3aXNlIGNvbnZlcnQgY2FuZGlkYXRlIHRvIGFuIGFycmF5IG9mIE5vZGVzIHVzaW5nIGl0IGFzIGEgRE9NIHF1ZXJ5IFxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcblx0XG5cdGlmKGVscy5sZW5ndGggPT09IDEgJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dKVxuXHRcdHJldHVybiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXTtcblx0XG5cdC8vcmV0dXJuIGluc3RhbmNlIGlmIG9uZSBleGlzdHMgZm9yIGNhbmRpZGF0ZSBwYXNzZWQgdG8gaW5pdFxuXHQvL2lmIGluaXRpdGlhbGlzZWQgdXNpbmcgU3Rvcm1WYWlkYXRpb24uaW5pdCh7c2VsfSkgdGhlIGluc3RhbmNlIGFscmVhZHkgZXhpc3RzIHRoYW5rcyB0byBhdXRvLWluaXRcblx0Ly9idXQgcmVmZXJlbmNlIG1heSBiZSB3YW50ZWQgZm9yIGludm9raW5nIEFQSSBtZXRob2RzXG5cdC8vYWxzbyBmb3IgcmVwZWF0IGluaXRpYWxpc2F0aW9uc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gXG5cdFx0T2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5oYXNBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuIGFjYztcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgb3B0cykpKSk7XG5cdFx0XHRyZXR1cm4gZWwuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKSwgYWNjO1xuXHRcdH0sIHt9KSk7XG59O1xuXG4vL0F1dG8taW5pdGlhbGlzZVxueyBcblx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJykpXG5cdFx0LmZvckVhY2goZm9ybSA9PiB7IFxuXHRcdFx0aWYoZm9ybS5xdWVyeVNlbGVjdG9yKCdbZGF0YS12YWw9dHJ1ZV0nKSAmJiAhZm9ybS5oYXNBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgaW5pdChmb3JtKTtcblx0XHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgRU5URVI6IDEzXG59O1xuXG5leHBvcnQgY29uc3QgQUNUSU9OUyA9IHtcbiAgICBTRVRfSU5JVElBTF9TVEFURTogJ1NFVF9JTklUSUFMX1NUQVRFJyxcbiAgICBDTEVBUl9FUlJPUlM6ICdDTEVBUl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1JTOiAnVkFMSURBVElPTl9FUlJPUlMnLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBDTEVBUl9FUlJPUjogJ0NMRUFSX0VSUk9SJyxcbiAgICBBRERfVkFMSURBVElPTl9NRVRIT0Q6ICdBRERfVkFMSURBVElPTl9NRVRIT0QnXG59O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbi8vZGF0YS1hdHRyaWJ1dGUgYWRkZWQgdG8gZXJyb3IgbWVzc2FnZSBzcGFuIGNyZWF0ZWQgYnkgLk5FVCBNVkNcbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG4vL3ZhbGlkYXRvciBwYXJhbWV0ZXJzIHRoYXQgcmVxdWlyZSBET00gbG9va3VwXG5leHBvcnQgY29uc3QgRE9NX1NFTEVDVE9SX1BBUkFNUyA9IFsncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAnZXF1YWx0by1vdGhlciddO1xuXG4vLy5ORVQgTVZDIHZhbGlkYXRvciBkYXRhLWF0dHJpYnV0ZSBwYXJhbWV0ZXJzIGluZGV4ZWQgYnkgdGhlaXIgdmFsaWRhdG9yc1xuLy9lLmcuIDxpbnB1dCBkYXRhLXZhbC1sZW5ndGg9XCJFcnJvciBtZXNzZ2VcIiBkYXRhLXZhbC1sZW5ndGgtbWluPVwiOFwiIGRhdGEtdmFsLWxlbmd0aC1tYXg9XCIxMFwiIHR5cGU9XCJ0ZXh0XCIuLi4gLz5cbmV4cG9ydCBjb25zdCBET1RORVRfUEFSQU1TID0ge1xuICAgIGxlbmd0aDogWydsZW5ndGgtbWluJywgJ2xlbmd0aC1tYXgnXSxcbiAgICBzdHJpbmdsZW5ndGg6IFsnbGVuZ3RoLW1heCddLFxuICAgIHJhbmdlOiBbJ3JhbmdlLW1pbicsICdyYW5nZS1tYXgnXSxcbiAgICAvLyBtaW46IFsnbWluJ10sP1xuICAgIC8vIG1heDogIFsnbWF4J10sP1xuICAgIG1pbmxlbmd0aDogWydtaW5sZW5ndGgtbWluJ10sXG4gICAgbWF4bGVuZ3RoOiBbJ21heGxlbmd0aC1tYXgnXSxcbiAgICByZWdleDogWydyZWdleC1wYXR0ZXJuJ10sXG4gICAgZXF1YWx0bzogWydlcXVhbHRvLW90aGVyJ10sXG4gICAgcmVtb3RlOiBbJ3JlbW90ZS11cmwnLCAncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAncmVtb3RlLXR5cGUnXS8vPz9cbn07XG5cbi8vLk5FVCBNVkMgZGF0YS1hdHRyaWJ1dGVzIHRoYXQgaWRlbnRpZnkgdmFsaWRhdG9yc1xuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAncmVxdWlyZWQnLFxuICAgICdzdHJpbmdsZW5ndGgnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAnbWlubGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJywvL3Nob3VsZCBiZSBsYXN0XG4gICAgLy8gJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dO1xuXG4vL2NsYXNzTmFtZXMgYWRkZWQvdXBkYXRlZCBvbiAuTkVUIE1WQyBlcnJvciBtZXNzYWdlIHNwYW5cbmV4cG9ydCBjb25zdCBET1RORVRfQ0xBU1NOQU1FUyA9IHtcbiAgICBWQUxJRDogJ2ZpZWxkLXZhbGlkYXRpb24tdmFsaWQnLFxuICAgIEVSUk9SOiAnZmllbGQtdmFsaWRhdGlvbi1lcnJvcidcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlcXVpcmVkKCkgeyByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQuJzsgfSAsXG4gICAgZW1haWwoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nOyB9LFxuICAgIHBhdHRlcm4oKSB7IHJldHVybiAnVGhlIHZhbHVlIG11c3QgbWF0Y2ggdGhlIHBhdHRlcm4uJzsgfSxcbiAgICB1cmwoKXsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUkwuJzsgfSxcbiAgICBkYXRlKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuJzsgfSxcbiAgICBkYXRlSVNPKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUgKElTTykuJzsgfSxcbiAgICBudW1iZXIoKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyLic7IH0sXG4gICAgZGlnaXRzKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy4nOyB9LFxuICAgIG1heGxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1pbmxlbmd0aChwcm9wcykgeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhdCBsZWFzdCAke3Byb3BzfSBjaGFyYWN0ZXJzLmA7IH0sXG4gICAgbWF4KHByb3BzKXsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHtbcHJvcHNdfS5gOyB9LFxuICAgIG1pbihwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7cHJvcHN9LmB9LFxuICAgIGVxdWFsVG8oKSB7IHJldHVybiAnUGxlYXNlIGVudGVyIHRoZSBzYW1lIHZhbHVlIGFnYWluLic7IH0sXG4gICAgcmVtb3RlKCkgeyByZXR1cm4gJ1BsZWFzZSBmaXggdGhpcyBmaWVsZC4nOyB9XG59OyIsImltcG9ydCB7IERPVE5FVF9DTEFTU05BTUVTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLy9UcmFjayBlcnJvciBtZXNzYWdlIERPTSBub2RlcyBpbiBsb2NhbCBzY29wZVxubGV0IGVycm9yTm9kZXMgPSB7fTtcblxuLyoqXG4gKiBIeXBlcnRleHQgRE9NIGZhY3RvcnkgZnVuY3Rpb25cbiAqIFxuICogQHBhcmFtIG5vZGVOYW1lIFtTdHJpbmddXG4gKiBAcGFyYW0gYXR0cmlidXRlcyBbT2JqZWN0XVxuICogQHBhcmFtIHRleHQgW1N0cmluZ10gVGhlIGlubmVyVGV4dCBvZiB0aGUgbmV3IG5vZGVcbiAqIFxuICogQHJldHVybnMgbm9kZSBbRE9NIG5vZGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGggPSAobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIHRleHQpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuXG4gICAgZm9yKGxldCBwcm9wIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgfVxuICAgIGlmKHRleHQgIT09IHVuZGVmaW5lZCAmJiB0ZXh0Lmxlbmd0aCkgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSk7XG5cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgYXBwZW5kcyBhIHRleHQgbm9kZSBlcnJvciBtZXNzYWdlIHRvIGEgIGVycm9yIGNvbnRhaW5lciBET00gbm9kZSBmb3IgYSBncm91cFxuICogXG4gKiBAcGFyYW0gZ3JvdXAgW09iamVjdCwgdmFpZGF0aW9uIGdyb3VwXSBcbiAqIEBwYXJhbSBtc2cgW1N0cmluZ10gVGhlIGVycm9yIG1lc3NhZ2VcbiAqIFxuICogQHJldHVybnMgbm9kZSBbVGV4dCBub2RlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVFcnJvclRleHROb2RlID0gKGdyb3VwLCBtc2cpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1zZyk7XG5cbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5WQUxJRCk7XG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IpO1xuICAgIFxuICAgIHJldHVybiBncm91cC5zZXJ2ZXJFcnJvck5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGVycm9yIG1lc3NhZ2UgRE9NIG5vZGUsIHVwZGF0ZXMgLk5FVCBNVkMgZXJyb3Igc3BhbiBjbGFzc05hbWVzIGFuZCBkZWxldGVzIHRoZSBcbiAqIGVycm9yIGZyb20gbG9jYWwgZXJyb3JOb2RlcyB0cmFja2luZyBvYmplY3RcbiAqIFxuICogU2lnbmF0dXJlICgpID0+IGdyb3VwTmFtZSA9PiBzdGF0ZSA9PiB7fVxuICogKEN1cnJpZWQgZ3JvdXBOYW1lIGZvciBlYXNlIG9mIHVzZSBhcyBldmVudExpc3RlbmVyIGFuZCBpbiB3aG9sZSBmb3JtIGl0ZXJhdGlvbilcbiAqIFxuICogQHBhcmFtIGdyb3VwTmFtZSBbU3RyaW5nLCB2YWlkYXRpb24gZ3JvdXBdIFxuICogQHBhcmFtIHN0YXRlIFtPYmplY3QsIHZhbGlkYXRpb24gc3RhdGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGVycm9yTm9kZXNbZ3JvdXBOYW1lXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSk7XG4gICAgaWYoc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlKSB7XG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIH1cbiAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pO1xuICAgIGRlbGV0ZSBlcnJvck5vZGVzW2dyb3VwTmFtZV07XG59O1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGVycm9yTm9kZXMgaW4gbG9jYWwgc2NvcGUgdG8gcmVtb3ZlIGVhY2ggZXJyb3IgcHJpb3IgdG8gcmUtdmFsaWRhdGlvblxuICogXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvcnMgPSBzdGF0ZSA9PiB7XG4gICAgT2JqZWN0LmtleXMoZXJyb3JOb2RlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgY2xlYXJFcnJvcihuYW1lKShzdGF0ZSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgYWxsIGdyb3VwcyB0byByZW5kZXIgZWFjaCBlcnJvciBwb3N0LXZhaWRhdGlvblxuICogXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3JzID0gc3RhdGUgPT4ge1xuICAgIE9iamVjdC5rZXlzKHN0YXRlLmdyb3VwcykuZm9yRWFjaChncm91cE5hbWUgPT4ge1xuICAgICAgICBpZighc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWQpIHJlbmRlckVycm9yKGdyb3VwTmFtZSkoc3RhdGUpO1xuICAgIH0pXG59O1xuXG4vKipcbiAqIEFkZHMgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgRE9NIGFuZCBzYXZlcyBpdCB0byBsb2NhbCBzY29wZVxuICogXG4gKiBJZiAuTkVUIE1WQyBlcnJvciBzcGFuIGlzIHByZXNlbnQsIGl0IGlzIHVzZWQgd2l0aCBhIGFwcGVuZGVkIHRleHROb2RlLFxuICogaWYgbm90IGEgbmV3IERPTSBub2RlIGlzIGNyZWF0ZWRcbiAqIFxuICogU2lnbmF0dXJlICgpID0+IGdyb3VwTmFtZSA9PiBzdGF0ZSA9PiB7fVxuICogKEN1cnJpZWQgZ3JvdXBOYW1lIGZvciBlYXNlIG9mIHVzZSBhcyBldmVudExpc3RlbmVyIGFuZCBpbiB3aG9sZSBmb3JtIGl0ZXJhdGlvbilcbiAqIFxuICogQHBhcmFtIGdyb3VwTmFtZSBbU3RyaW5nLCB2YWxpZGF0aW9uIGdyb3VwXSBcbiAqIEBwYXJhbSBzdGF0ZSBbT2JqZWN0LCB2YWxpZGF0aW9uIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCByZW5kZXJFcnJvciA9IGdyb3VwTmFtZSA9PiBzdGF0ZSA9PiB7XG4gICAgaWYoZXJyb3JOb2Rlc1tncm91cE5hbWVdKSBjbGVhckVycm9yKGdyb3VwTmFtZSkoc3RhdGUpO1xuICAgIFxuICAgIGVycm9yTm9kZXNbZ3JvdXBOYW1lXSA9IFxuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUgXG4gICAgICAgICAgICAgICAgPyBjcmVhdGVFcnJvclRleHROb2RlKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLCBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5lcnJvck1lc3NhZ2VzWzBdKSBcbiAgICAgICAgICAgICAgICA6IHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpZWxkc1tzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQoaCgnZGl2JywgeyBjbGFzczogRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IgfSwgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkpO1xuXHRcdFx0XHRcdFx0XG5cdHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHsgXG4gICAgICAgIGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogU2V0IGZvY3VzIG9uIGZpcnN0IGludmFsaWQgZmllbGQgYWZ0ZXIgZm9ybS1sZXZlbCB2YWxpZGF0ZSgpXG4gKiBcbiAqIFdlIGNhbiBhc3N1bWUgdGhhdCB0aGVyZSBpcyBhIGdyb3VwIGluIGFuIGludmFsaWQgc3RhdGUsXG4gKiBhbmQgdGhhdCB0aGUgZ3JvdXAgaGFzIGF0IGxlYXN0IG9uZSBmaWVsZFxuICogXG4gKiBAcGFyYW0gZ3JvdXBzIFtPYmplY3QsIHZhbGlkYXRpb24gZ3JvdXAgc2xpY2Ugb2Ygc3RhdGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGZvY3VzRmlyc3RJbnZhbGlkRmllbGQgPSBncm91cHMgPT4ge1xuICAgIGdyb3Vwc1tPYmplY3Qua2V5cyhncm91cHMpXG4gICAgICAgIC5maWx0ZXIoZ3JvdXAgPT4gIWdyb3VwLnZhbGlkKVswXV1cbiAgICAgICAgLmZpZWxkc1swXVxuICAgICAgICAuZm9jdXMoKTtcbn07IiwiaW1wb3J0IFN0b3JlIGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgQUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IFxuICAgIGdldEluaXRpYWxTdGF0ZSxcbiAgICBnZXRWYWxpZGl0eVN0YXRlLFxuICAgIGdldEdyb3VwVmFsaWRpdHlTdGF0ZSxcbiAgICByZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsXG4gICAgcmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50LFxuICAgIHJlZHVjZUVycm9yTWVzc2FnZXNcbn0gZnJvbSAnLi92YWxpZGF0b3InO1xuaW1wb3J0IHtcbiAgICBjbGVhckVycm9ycyxcbiAgICBjbGVhckVycm9yLFxuICAgIHJlbmRlckVycm9yLFxuICAgIHJlbmRlckVycm9ycyxcbiAgICBmb2N1c0ZpcnN0SW52YWxpZEZpZWxkXG59ICBmcm9tICcuL2RvbSc7XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlIHZhbGlkaXR5U3RhdGUgb2YgdGhlIGVudGlyZSBmb3JtXG4gKiBjYW4gYmUgdXNlZCBhcyBhIGZvcm0gc3VibWl0IGV2ZW50TGlzdGVuZXIgb3IgdmlhIHRoZSBBUElcbiAqIFxuICogU3VibWl0cyB0aGUgZm9ybSBpZiBjYWxsZWQgYXMgYSBzdWJtaXQgZXZlbnRMaXN0ZW5lciBhbmQgaXMgdmFsaWRcbiAqIERpc3BhdGNoZXMgZXJyb3Igc3RhdGUgdG8gU3RvcmUgaWYgZXJyb3JzXG4gKiBcbiAqIEBwYXJhbSBmb3JtIFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybnMgW2Jvb2xlYW5dIFRoZSB2YWxpZGl0eSBzdGF0ZSBvZiB0aGUgZm9ybVxuICogXG4gKi9cbmNvbnN0IHZhbGlkYXRlID0gZm9ybSA9PiBlID0+IHtcbiAgICBlICYmIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SUywgbnVsbCwgW2NsZWFyRXJyb3JzXSk7XG5cbiAgICBnZXRWYWxpZGl0eVN0YXRlKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAudGhlbih2YWxpZGl0eVN0YXRlID0+IHtcbiAgICAgICAgICAgIGlmKFtdLmNvbmNhdCguLi52YWxpZGl0eVN0YXRlKS5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLCB0cnVlKSl7XG4gICAgICAgICAgICAgICAgaWYoZSAmJiBlLnRhcmdldCkgZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTdG9yZS5nZXRTdGF0ZSgpLnJlYWxUaW1lVmFsaWRhdGlvbiA9PT0gZmFsc2UgJiYgc3RhcnRSZWFsVGltZVZhbGlkYXRpb24oKTtcblxuICAgICAgICAgICAgZm9jdXNGaXJzdEludmFsaWRGaWVsZChTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwcyk7XG5cbiAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgIEFDVElPTlMuVkFMSURBVElPTl9FUlJPUlMsXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgZ3JvdXAsIGkpID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY1tncm91cF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IHZhbGlkaXR5U3RhdGVbaV0ucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogdmFsaWRpdHlTdGF0ZVtpXS5yZWR1Y2UocmVkdWNlRXJyb3JNZXNzYWdlcyhncm91cCwgU3RvcmUuZ2V0U3RhdGUoKSksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWNjO1xuICAgICAgICAgICAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgICAgICAgW3JlbmRlckVycm9yc11cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG59O1xuXG4vKipcbiAqIEFkZHMgYSBjdXN0b20gdmFsaWRhdGlvbiBtZXRob2QgdG8gdGhlIHZhbGlkYXRpb24gbW9kZWwsIHVzZWQgdmlhIHRoZSBBUElcbiAqIERpc3BhdGNoZXMgYWRkIHZhbGlkYXRpb24gbWV0aG9kIHRvIHN0b3JlIHRvIHVwZGF0ZSB0aGUgdmFsaWRhdG9ycyBpbiBhIGdyb3VwXG4gKiBcbiAqIEBwYXJhbSBncm91cE5hbWUgW1N0cmluZ10gVGhlIG5hbWUgYXR0cmlidXRlIHNoYXJlZCBieSB0aGUgRE9tIG5vZGVzIGluIHRoZSBncm91cFxuICogQHBhcmFtIG1ldGhvZCBbRnVuY3Rpb25dIFRoZSB2YWxpZGF0aW9uIG1ldGhvZCAoZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgb3IgZmFsc2UpIHRoYXQgdXMgY2FsbGVkIG9uIHRoZSBncm91cFxuICogQHBhcmFtIG1lc3NhZ2UgW1N0cmluZ10gVGUgZXJyb3IgbWVzc2FnZSBkaXNwbGF5ZWQgaWYgdGhlIHZhbGlkYXRpb24gbWV0aG9kIHJldHVybnMgZmFsc2VcbiAqIFxuICovXG5jb25zdCBhZGRNZXRob2QgPSAoZ3JvdXBOYW1lLCBtZXRob2QsIG1lc3NhZ2UpID0+IHtcbiAgICBpZigoZ3JvdXBOYW1lID09PSB1bmRlZmluZWQgfHwgbWV0aG9kID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB8fCAhU3RvcmUuZ2V0U3RhdGUoKVtncm91cE5hbWVdICYmIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGdyb3VwTmFtZSkubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDdXN0b20gdmFsaWRhdGlvbiBtZXRob2QgY2Fubm90IGJlIGFkZGVkLicpO1xuXG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5BRERfVkFMSURBVElPTl9NRVRIT0QsIHtncm91cE5hbWUsIHZhbGlkYXRvcjoge3R5cGU6ICdjdXN0b20nLCBtZXRob2QsIG1lc3NhZ2V9fSk7XG59O1xuXG5cbi8qKlxuICogU3RhcnRzIHJlYWwtdGltZSB2YWxpZGF0aW9uIG9uIGVhY2ggZ3JvdXAsIGFkZGluZyBhbiBldmVudExpc3RlbmVyIHRvIGVhY2ggZmllbGQgXG4gKiB0aGF0IHJlc2V0cyB0aGUgdmFsaWRpdHlTdGF0ZSBmb3IgdGhlIGZpZWxkJ3MgZ3JvdXAgYW5kIGFjcXVpcmVzIHRoZSBuZXcgdmFsaWRpdHkgc3RhdGVcbiAqIFxuICogVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcnMgdmFsaWRhdGlvbiBpcyBkZWZpbmVkIGJ5IHRoZSBmaWVsZCB0eXBlXG4gKiBcbiAqIE9ubHkgaWYgdGhlIG5ldyB2YWxpZGl0eVN0YXRlIGlzIGludmFsaWQgaXMgdGhlIHZhbGlkYXRpb24gZXJyb3Igb2JqZWN0IFxuICogZGlzcGF0Y2hlZCB0byB0aGUgc3RvcmUgdG8gdXBkYXRlIHN0YXRlIGFuZCByZW5kZXIgdGhlIGVycm9yXG4gKiBcbiAqL1xuY29uc3Qgc3RhcnRSZWFsVGltZVZhbGlkYXRpb24gPSAoKSA9PiB7XG4gICAgbGV0IGhhbmRsZXIgPSBncm91cE5hbWUgPT4gKCkgPT4ge1xuICAgICAgICBpZighU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZCkge1xuICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5DTEVBUl9FUlJPUiwgZ3JvdXBOYW1lLCBbY2xlYXJFcnJvcihncm91cE5hbWUpXSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldEdyb3VwVmFsaWRpdHlTdGF0ZShTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZighcmVzLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFDVElPTlMuVkFMSURBVElPTl9FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHJlcy5yZWR1Y2UocmVkdWNlRXJyb3JNZXNzYWdlcyhncm91cE5hbWUsIFN0b3JlLmdldFN0YXRlKCkpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcihncm91cE5hbWUpXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihyZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQoaW5wdXQpLCBoYW5kbGVyKGdyb3VwTmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy87XzsgY2FuIGRvIGJldHRlcj9cbiAgICAgICAgbGV0IGVxdWFsVG9WYWxpZGF0b3IgPSBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICBlcXVhbFRvVmFsaWRhdG9yWzBdLnBhcmFtcy5vdGhlci5mb3JFYWNoKHN1Ymdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICBzdWJncm91cC5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVyKGdyb3VwTmFtZSkpOyB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24sIHNldHMgaW5pdGlhbCBzdGF0ZSBhbmQgYWRkcyBmb3JtLWxldmVsIGV2ZW50IGxpc3RlbmVyc1xuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVdIHRoZSBmb3JtIHRvIHZhbGlkYXRlXG4gKiBcbiAqIEByZXR1cm5zIFtPYmplY3RdIFRoZSBBUEkgZm9yIHRoZSBpbnN0YW5jZVxuICogKlxuICovXG5leHBvcnQgZGVmYXVsdCBmb3JtID0+IHtcbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFLCAoZ2V0SW5pdGlhbFN0YXRlKGZvcm0pKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB2YWxpZGF0ZShmb3JtKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsICgpID0+IHsgU3RvcmUudXBkYXRlKFVQREFURVMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTsgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZGF0ZTogdmFsaWRhdGUoZm9ybSksXG4gICAgICAgIGFkZE1ldGhvZFxuICAgIH1cbn07IiwiaW1wb3J0IHsgQUNUSU9OUywgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEFsbCBzdGF0ZS9tb2RlbC1tb2RpZnlpbmcgb3BlcmF0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiAoc3RhdGUsIGRhdGEpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCBkYXRhKSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUl06IChzdGF0ZSwgZGF0YSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgIFtkYXRhXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGFdLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSksXG4gICAgW0FDVElPTlMuQUREX1ZBTElEQVRJT05fTUVUSE9EXTogKHN0YXRlLCBkYXRhKSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwcywge1xuICAgICAgICAgICAgW2RhdGEuZ3JvdXBOYW1lXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXSA/IHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gPyAgeyB2YWxpZGF0b3JzOiBbLi4uc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXS52YWxpZGF0b3JzLCBkYXRhLnZhbGlkYXRvcl0gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGRhdGEuZ3JvdXBOYW1lKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09JHtkYXRhLmdyb3VwTmFtZX1dYCkgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IFtkYXRhLnZhbGlkYXRvcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pLFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JTXTogKHN0YXRlLCBkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgcmVhbFRpbWVWYWxpZGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgICAgIGFjY1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZ3JvdXBdLCBkYXRhW2dyb3VwXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JdOiAoc3RhdGUsIGRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwcywge1xuICAgICAgICAgICAgICAgIFtkYXRhLmdyb3VwXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGRhdGEuZXJyb3JNZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufTsiLCJpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnO1xuLy9zaGFyZWQgY2VudHJhbGlzZWQgdmFsaWRhdG9yIHN0YXRlXG5sZXQgc3RhdGUgPSB7fTtcblxuLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4vLyB3aW5kb3cuX192YWxpZGF0b3JfaGlzdG9yeV9fID0gW107XG5cbi8vc3RhdGUgZ2V0dGVyXG5jb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuXG4vKipcbiAqIENyZWF0ZSBuZXh0IHN0YXRlIGJ5IGludm9raW5nIHJlZHVjZXIgb24gY3VycmVudCBzdGF0ZVxuICogXG4gKiBFeGVjdXRlIHNpZGUgZWZmZWN0cyBvZiBzdGF0ZSB1cGRhdGUsIGFzIHBhc3NlZCBpbiB0aGUgdXBkYXRlXG4gKiBcbiAqIEBwYXJhbSB0eXBlIFtTdHJpbmddIFxuICogQHBhcmFtIG5leHRTdGF0ZSBbT2JqZWN0XSBOZXcgc2xpY2Ugb2Ygc3RhdGUgdG8gY29tYmluZSB3aXRoIGN1cnJlbnQgc3RhdGUgdG8gY3JlYXRlIG5leHQgc3RhdGVcbiAqIEBwYXJhbSBlZmZlY3RzIFtBcnJheV0gQXJyYXkgb2YgZnVuY3Rpb25zIHRvIGludm9rZSBhZnRlciBzdGF0ZSB1cGRhdGUgKERPTSwgb3BlcmF0aW9ucywgY21kcy4uLilcbiAqL1xuY29uc3QgZGlzcGF0Y2ggPSBmdW5jdGlvbih0eXBlLCBuZXh0U3RhdGUsIGVmZmVjdHMpIHtcbiAgICBzdGF0ZSA9IG5leHRTdGF0ZSA/IHJlZHVjZXJzW3R5cGVdKHN0YXRlLCBuZXh0U3RhdGUpIDogc3RhdGU7XG4gICAgLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4gICAgLy8gd2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXy5wdXNoKHtbdHlwZV06IHN0YXRlfSksIGNvbnNvbGUubG9nKHdpbmRvdy5fX3ZhbGlkYXRvcl9oaXN0b3J5X18pO1xuICAgIGlmKCFlZmZlY3RzKSByZXR1cm47XG4gICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiB7IGVmZmVjdChzdGF0ZSk7IH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBkaXNwYXRjaCwgZ2V0U3RhdGUgfTsiLCJpbXBvcnQgbWV0aG9kcyBmcm9tICcuL21ldGhvZHMnO1xuaW1wb3J0IG1lc3NhZ2VzIGZyb20gJy4uL2NvbnN0YW50cy9tZXNzYWdlcyc7XG5pbXBvcnQgeyBcbiAgICBwaXBlLFxuICAgIGlzQ2hlY2thYmxlLFxuICAgIGlzU2VsZWN0LFxuICAgIGlzRmlsZSxcbiAgICBET01Ob2Rlc0Zyb21Db21tYUxpc3QsXG4gICAgZXh0cmFjdFZhbHVlRnJvbUdyb3VwXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtcbiAgICBET1RORVRfQURBUFRPUlMsXG4gICAgRE9UTkVUX1BBUkFNUyxcbiAgICBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSxcbiAgICBET01fU0VMRUNUT1JfUEFSQU1TXG59IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmVzb2x2ZSB2YWxpZGF0aW9uIHBhcmFtZXRlciB0byBhIHN0cmluZyBvciBhcnJheSBvZiBET00gbm9kZXNcbiAqIFxuICogQHBhcmFtIHBhcmFtIFtTdHJpbmddIGlkZW50aWZpZXIgZm9yIHRoZSBkYXRhLWF0dHJpYnV0ZSBgZGF0YS12YWwtJHtwYXJhbX1gXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXSB0aGUgbm9kZSB3aGljaCBjb250YWlucyB0aGUgZGF0YS12YWwtIGF0dHJpYnV0ZVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcGFyYW0gW09iamVjdF0gaW5kZXhlZCBieSBzZWNvbmQgcGFydCBvZiBwYXJhbSBuYW1lIChlLmcuLCAnbWluJyBwYXJ0IG9mIGxlbmd0aC1taW4nKSBhbmQgYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGEgc3RyaW5nXG4gKi9cbmNvbnN0IHJlc29sdmVQYXJhbSA9IChwYXJhbSwgaW5wdXQpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCk7XG4gICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgW3BhcmFtLnNwbGl0KCctJylbMV1dOiAhIX5ET01fU0VMRUNUT1JfUEFSQU1TLmluZGV4T2YocGFyYW0pID8gRE9NTm9kZXNGcm9tQ29tbWFMaXN0KHZhbHVlLCBpbnB1dCk6IHZhbHVlXG4gICAgICAgICAgICB9KVxufTtcblxuLyoqXG4gKiBMb29rcyB1cCB0aGUgZGF0YS12YWwgcHJvcGVydHkgYWdhaW5zdCB0aGUga25vd24gLk5FVCBNVkMgYWRhcHRvcnMvdmFsaWRhdGlvbiBtZXRob2RcbiAqIHJ1bnMgdGhlIG1hdGNoZXMgYWdhaW5zdCB0aGUgbm9kZSB0byBmaW5kIHBhcmFtIHZhbHVlcywgYW5kIHJldHVybnMgYW4gT2JqZWN0IGNvbnRhaW5pbmcgYWxsICBwYXJhbWV0ZXJzIGZvciB0aGF0IGFkYXB0b3IvdmFsaWRhdGlvbiBtZXRob2RcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV0gdGhlIG5vZGUgb24gd2hpY2ggdG8gbG9vayBmb3IgbWF0Y2hpbmcgYWRhcHRvcnNcbiAqIEBwYXJhbSBhZGFwdG9yIFtTdHJpbmddIC5ORVQgTVZDIGRhdGEtYXR0cmlidXRlIHRoYXQgaWRlbnRpZmllcyB2YWxpZGF0b3JcbiAqIFxuICogQHJldHVybiB2YWxpZGF0aW9uIHBhcmFtcyBbT2JqZWN0XSBWYWxpZGF0aW9uIHBhcmFtIG9iamVjdCBjb250YWluaW5nIGFsbCB2YWxpZGF0aW9uIHBhcmFtZXRlcnMgZm9yIGFuIGFkYXB0b3IvdmFsaWRhdGlvbiBtZXRob2RcbiAqL1xuY29uc3QgZXh0cmFjdFBhcmFtcyA9IChpbnB1dCwgYWRhcHRvcikgPT4gRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcGFyYW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQuaGFzQXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApID8gT2JqZWN0LmFzc2lnbihhY2MsIHJlc29sdmVQYXJhbShwYXJhbSwgaW5wdXQpKSA6IGFjYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XG5cbi8qKlxuICogUmVkdWNlciB0aGF0IHRha2VzIGFsbCBrbm93IC5ORVQgTVZDIGFkYXB0b3JzIChkYXRhLWF0dHJpYnV0ZXMgdGhhdCBzcGVjaWZpeSBhIHZhbGlkYXRpb24gbWV0aG9kIHRoYXQgc2hvdWxkIGJlIHBhcGlpZWQgdG8gdGhlIG5vZGUpXG4gKiBhbmQgY2hlY2tzIGFnYWluc3QgYSBET00gbm9kZSBmb3IgbWF0Y2hlcywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHZhbGlkYXRvcnNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0b3JzIFtBcnJheV0sIGVhY2ggdmFsaWRhdG9yIGNvbXBwb3NlZCBvZiBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSBbU3RyaW5nXSBuYW1pbmcgdGhlIHZhbGlkYXRvciBhbmQgbWF0Y2hpbmcgaXQgdG8gdmFsaWRhdGlvbiBtZXRob2QgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSBbU3RyaW5nXSB0aGUgZXJyb3IgbWVzc2FnZSBkaXNwbGF5ZWQgaWYgdGhlIHZhbGlkYXRpb24gbWV0aG9kIHJldHVybnMgZmFsc2VcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zIFtPYmplY3RdIChvcHRpb25hbCkgXG4gKi9cbmNvbnN0IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyA9IGlucHV0ID0+IERPVE5FVF9BREFQVE9SUy5yZWR1Y2UoKHZhbGlkYXRvcnMsIGFkYXB0b3IpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3JzIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4udmFsaWRhdG9ycywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFkYXB0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHthZGFwdG9yfWApfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RQYXJhbXMoaW5wdXQsIGFkYXB0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pO1xuXG4gICAgICBcbi8qKlxuICogUGlwZXMgYW4gaW5wdXQgdGhyb3VnaCBhIHNlcmllcyBvZiB2YWxpZGF0b3IgY2hlY2tzIChmbnMgZGlyZWN0bHkgYmVsb3cpIHRvIGV4dHJhY3QgYXJyYXkgb2YgdmFsaWRhdG9ycyBiYXNlZCBvbiBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBzbyBIVE1MNSBjb25zdHJhaW50cyB2YWxpZGF0aW9uIGlzIG5vdCB1c2VkLCB3ZSB1c2UgdGhlIHNhbWUgdmFsaWRhdGlvbiBtZXRob2RzIGFzIC5ORVQgTVZDIHZhbGlkYXRpb25cbiAqIFxuICogSWYgd2UgYXJlIHRvIGFjdHVhbGx5IHVzZSB0aGUgQ29uc3RyYWludCBWYWxpZGF0aW9uIEFQSSB3ZSB3b3VsZCBub3QgbmVlZCB0byBhc3NlbWJsZSB0aGlzIHZhbGlkYXRvciBhcnJheS4uLlxuICogXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRvcnMgW0FycmF5XVxuICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoZW1haWwoaW5wdXQpLCB1cmwoaW5wdXQpLCBudW1iZXIoaW5wdXQpLCBtaW5sZW5ndGgoaW5wdXQpLCBtYXhsZW5ndGgoaW5wdXQpLCBtaW4oaW5wdXQpLCBtYXgoaW5wdXQpLCBwYXR0ZXJuKGlucHV0KSwgcmVxdWlyZWQoaW5wdXQpKTtcblxuLyoqXG4gKiBWYWxpZGF0b3IgY2hlY2tzIHRvIGV4dHJhY3QgdmFsaWRhdG9ycyBiYXNlZCBvbiBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBcbiAqIEVhY2ggZnVuY3Rpb24gaXMgY3VycmllZCBzbyB3ZSBjYW4gc2VlZCBlYWNoIGZuIHdpdGggYW4gaW5wdXQgYW5kIHBpcGUgdGhlIHJlc3VsdCBhcnJheSB0aHJvdWdoIGVhY2ggZnVuY3Rpb25cbiAqIFNpZ25hdHVyZTogaW5wdXRET01Ob2RlID0+IHZhbGlkYXRvckFycmF5ID0+IHVwZGF0ZVZhbGlkYXRvckFycmF5XG4gKi9cbmNvbnN0IHJlcXVpcmVkID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdyZXF1aXJlZCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBlbWFpbCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ2VtYWlsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IHVybCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3VybCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICd1cmwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbnVtYmVyID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ251bWJlcid9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW5sZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heGxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWluID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWluJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IHBhdHRlcm4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3BhdHRlcm4nLCBwYXJhbXM6IHsgcmVnZXg6IGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpfX1dIDogdmFsaWRhdG9ycztcblxuLyoqXG4gKiBUYWtlcyBhbiBpbnB1dCBhbmQgcmV0dXJucyB0aGUgYXJyYXkgb2YgdmFsaWRhdG9ycyBiYXNlZCBvbiBlaXRoZXIgLk5FVCBNVkMgZGF0YS12YWwtIG9yIEhUTUw1IGF0dHJpYnV0ZXNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0b3JzIFtBcnJheV1cbiAqLyAgXG5leHBvcnQgY29uc3Qgbm9ybWFsaXNlVmFsaWRhdG9ycyA9IGlucHV0ID0+IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWwnKSA9PT0gJ3RydWUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3REYXRhVmFsVmFsaWRhdG9ycyhpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0QXR0clZhbGlkYXRvcnMoaW5wdXQpO1xuXG4vKipcbiAqIENhbGxzIGEgdmFsaWRhdGlvbiBtZXRob2QgYWdhaW5zdCBhbiBpbnB1dCBncm91cFxuICogXG4gKiBAcGFyYW0gZ3JvdXAgW0FycmF5XSBET00gbm9kZXMgd2l0aCB0aGUgc2FtZSBuYW1lIGF0dHJpYnV0ZVxuICogQHBhcmFtIHZhbGlkYXRvciBbU3RyaW5nXSBUaGUgdHlwZSBvZiB2YWxpZGF0b3IgbWF0Y2hpbmcgaXQgdG8gdmFsaWRhdGlvbiBtZXRob2QgZnVuY3Rpb25cbiAqIFxuICovICBcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IChncm91cCwgdmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2N1c3RvbScgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBtZXRob2RzWydjdXN0b20nXSh2YWxpZGF0b3IubWV0aG9kLCBncm91cClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zKTtcblxuLyoqXG4gKiBSZWR1Y2VyIGNvbnN0cnVjdGluZyBhbiB2YWxpZGF0aW9uIE9iamVjdCBmb3IgYSBncm91cCBvZiBET00gbm9kZXNcbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybnMgdmFsaWRhdGlvbiBvYmplY3QgW09iamVjdF0gY29uc2lzdGluZyBvZlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgW0Jvb2xlYW5dIHRoZSB2YWxpZGl0eVN0YXRlIG9mIHRoZSBncm91cFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9ycyBbQXJyYXldIG9mIHZhbGlkYXRvciBvYmplY3RzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMgW0FycmF5XSBET00gbm9kZXMgaW4gdGhlIGdyb3VwXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGUgW0RPTSBub2RlXSAuTkVUIE1WQyBzZXJ2ZXItcmVuZGVyZWQgZXJyb3IgbWVzc2FnZSBzcGFuXG4gKiBcbiAqLyAgXG5leHBvcnQgY29uc3QgYXNzZW1ibGVWYWxpZGF0aW9uR3JvdXAgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGxldCBuYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgcmV0dXJuIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSA/IE9iamVjdC5hc3NpZ24oYWNjW25hbWVdLCB7IGZpZWxkczogWy4uLmFjY1tuYW1lXS5maWVsZHMsIGlucHV0XX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IG5vcm1hbGlzZVZhbGlkYXRvcnMoaW5wdXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW2lucHV0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFcnJvck5vZGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske0RPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFfT1cIiR7aW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJyl9XCJdYCkgfHwgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBlcnJvciBtZXNzYWdlIHByb3BlcnR5IG9mIHRoZSB2YWxpZGF0b3IgT2JqZWN0IHRoYXQgaGFzIHJldHVybmVkIGZhbHNlIG9yIHRoZSBjb3JyZXNwb25kaW5nIGRlZmF1bHQgbWVzc2FnZVxuICogXG4gKiBAcGFyYW0gdmFsaWRhdG9yIFtPYmplY3RdIFxuICogXG4gKiBAcmV0dXJuIG1lc3NhZ2UgW1N0cmluZ10gZXJyb3IgbWVzc2FnZVxuICogXG4gKi8gXG5jb25zdCBleHRyYWN0RXJyb3JNZXNzYWdlID0gdmFsaWRhdG9yID0+IHZhbGlkYXRvci5tZXNzYWdlIHx8IG1lc3NhZ2VzW3ZhbGlkYXRvci50eXBlXSh2YWxpZGF0b3IucGFyYW1zICE9PSB1bmRlZmluZWQgPyB2YWxpZGF0b3IucGFyYW1zIDogbnVsbCk7XG5cbi8qKlxuICogQ3VycmllZCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSByZWR1Y2VyIHRoYXQgcmVkdWNlcyB0aGUgcmVzb2x2ZWQgcmVzcG9uc2UgZnJvbSBhbiBhcnJheSBvZiB2YWxpZGF0aW9uIFByb21pc2VzIHBlcmZvcm1lZCBhZ2FpbnN0IGEgZ3JvdXBcbiAqIGludG8gYW4gYXJyYXkgb2YgZXJyb3IgbWVzc2FnZXMgb3IgYW4gZW1wdHkgYXJyYXlcbiAqIFxuICogQHJldHVybiBlcnJvciBtZXNzYWdlcyBbQXJyYXldXG4gKiBcbiAqLyBcbmV4cG9ydCBjb25zdCByZWR1Y2VFcnJvck1lc3NhZ2VzID0gKGdyb3VwLCBzdGF0ZSkgPT4gKGFjYywgdmFsaWRpdHksIGopID0+IHtcbiAgICByZXR1cm4gdmFsaWRpdHkgPT09IHRydWUgXG4gICAgICAgICAgICAgICAgPyBhY2MgXG4gICAgICAgICAgICAgICAgOiBbLi4uYWNjLCB0eXBlb2YgdmFsaWRpdHkgPT09ICdib29sZWFuJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3RFcnJvck1lc3NhZ2Uoc3RhdGUuZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsaWRpdHldO1xufTtcblxuLyoqXG4gKiBGcm9tIGFsbCBncm91cHMgZm91bmQgaW4gdGhlIGN1cnJlbnQgZm9ybSwgdGhvc2V0aGF0IGRvIG5vdCByZXF1aXJlIHZhbGlkYXRpb24gKGhhdmUgbm8gYXNzb2NhdGVkIHZhbGlkYXRvcnMpIGFyZSByZW1vdmVkXG4gKiBcbiAqIEBwYXJhbSBncm91cHMgW09iamVjdF0gbmFtZS1pbmRleGVkIG9iamVjdCBjb25zaXN0aW5nIG9mIGFsbCBncm91cHMgZm91bmQgaW4gdGhlIGN1cnJlbnQgZm9ybVxuICogXG4gKiBAcmV0dXJuIGdyb3VwcyBbT2JqZWN0XSBuYW1lLWluZGV4ZWQgb2JqZWN0IGNvbnNpc3Rpbmcgb2YgYWxsIHZhbGlkYXRhYmxlIGdyb3Vwc1xuICogXG4gKi8gXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKVxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuLyoqXG4gKiBUYWtlcyBhIGZvcm0gRE9NIG5vZGUgYW5kIHJldHVybnMgdGhlIGluaXRpYWwgZm9ybSB2YWxpZGF0aW9uIHN0YXRlIC0gYW4gb2JqZWN0IGNvbnNpc3Rpbmcgb2YgYWxsIHRoZSB2YWxpZGF0YWJsZSBpbnB1dCBncm91cHNcbiAqIHdpdGggdmFsaWRpdHlTdGF0ZSwgZmllbGRzLCB2YWxpZGF0b3JzLCBhbmQgYXNzb2NpYXRlZCBkYXRhIHJlcXVpcmVkIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiBhbmQgcmVuZGVyIGVycm9ycy5cbiAqIFxuICogQHBhcmFtIGZvcm0gW0RPTSBub2Rlc10gXG4gKiBcbiAqIEByZXR1cm4gc3RhdGUgW09iamVjdF0gY29uc2lzdGluZyBvZiBncm91cHMgW09iamVjdF0gbmFtZS1pbmRleGVkIHZhbGlkYXRpb24gZ3JvdXBzXG4gKiBcbiAqLyBcbmV4cG9ydCBjb25zdCBnZXRJbml0aWFsU3RhdGUgPSBmb3JtID0+ICh7XG4gICAgcmVhbFRpbWVWYWxpZGF0aW9uOiBmYWxzZSxcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuLyoqXG4gKiBSZWR1Y2VyIHJ1biBhZ2FpbnN0IGFuIGFycmF5IG9mIHJlc29sdmVkIHZhbGlkYXRpb24gcHJvbWlzZXMgdG8gc2V0IHRoZSBvdmVyYWxsIHZhbGlkaXR5U3RhdGUgb2YgYSBncm91cFxuICogXG4gKiBAcmV0dXJuIHZhbGlkaXR5U3RhdGUgW0Jvb2xlYW5dIFxuICogXG4gKi8gXG5leHBvcnQgY29uc3QgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlID0gKGFjYywgY3VycikgPT4ge1xuICAgIGlmKGN1cnIgIT09IHRydWUpIGFjYyA9IGZhbHNlO1xuICAgIHJldHVybiBhY2M7IFxufTtcblxuLyoqXG4gKiBBZ2dyZWdhdGVzIHZhbGlkYXRpb24gcHJvbWlzZXMgZm9yIGFsbCBncm91cHMgaW50byBhIHNpbmdsZSBwcm9taXNlXG4gKiBcbiAqIEBwYXJhbXMgZ3JvdXBzIFtPYmplY3RdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdGlvbiByZXN1bHRzIFtQcm9taXNlXSBhZ2dyZWdhdGVkIHByb21pc2VcbiAqIFxuICovXG5leHBvcnQgY29uc3QgZ2V0VmFsaWRpdHlTdGF0ZSA9IGdyb3VwcyA9PiB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBPYmplY3Qua2V5cyhncm91cHMpXG4gICAgICAgICAgICAubWFwKGdyb3VwID0+IGdldEdyb3VwVmFsaWRpdHlTdGF0ZShncm91cHNbZ3JvdXBdKSlcbiAgICAgICAgKTtcbn07XG5cbi8qKlxuICogQWdncmVnYXRlcyBhbGwgb2YgdGhlIHZhbGlkYXRpb24gcHJvbWlzZXMgZm9yIGEgc2lubGdlIGdyb3VwIGludG8gYSBzaW5nbGUgcHJvbWlzZVxuICogXG4gKiBAcGFyYW1zIGdyb3VwcyBbT2JqZWN0XVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcmVzdWx0cyBbUHJvbWlzZV0gYWdncmVnYXRlZCBwcm9taXNlXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEdyb3VwVmFsaWRpdHlTdGF0ZSA9IGdyb3VwID0+IHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKGhhc0Vycm9yKSByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4geyByZXNvbHZlKHJlcyk7fSk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgZXZlbnQgdHlwZSB0byBiZSB1c2VkIGZvciByZWFsLXRpbWUgdmFsaWRhdGlvbiBhIGdpdmVuIGZpZWxkIGJhc2VkIG9uIGZpZWxkIHR5cGVcbiAqIFxuICogQHBhcmFtcyBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gZXZlbnQgdHlwZSBbU3RyaW5nXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTsiLCJpbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZmV0Y2gsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgcmVzb2x2ZUdldFBhcmFtcyB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09ICcnO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gJycsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgsIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyA9IHBhcmFtcy5vdGhlci5yZWR1Y2UoKHN1Ymdyb3VwQWNjLCBzdWJncm91cCkgPT4ge1xuICAgICAgICAgICAgaWYoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKHN1Ymdyb3VwKSAhPT0gaW5wdXQudmFsdWUpIHN1Ymdyb3VwQWNjID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3ViZ3JvdXBBY2M7XG4gICAgICAgIH0sIHRydWUpLCBhY2M7XG4gICAgfSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluICYmIChwYXJhbXMubWF4ID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmV0Y2goKHBhcmFtcy50eXBlICE9PSAnZ2V0JyA/IHBhcmFtcy51cmwgOiBgJHtwYXJhbXMudXJsfT8ke3Jlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpfWApLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICBib2R5OiBwYXJhbXMudHlwZSA9PT0gJ2dldCcgPyBudWxsIDogcmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyksXG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUoYFNlcnZlciBlcnJvcjogJHtyZXN9YCk7IH0pO1xuICAgIH0pLFxuICAgIGN1c3RvbTogKG1ldGhvZCwgZ3JvdXApID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgbWV0aG9kKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCksIGdyb3VwLmZpZWxkcylcbn07IiwiZXhwb3J0IGNvbnN0IGlzQ2hlY2thYmxlID0gZmllbGQgPT4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGZpZWxkLnR5cGUpO1xuXG5leHBvcnQgY29uc3QgaXNGaWxlID0gZmllbGQgPT4gZmllbGQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdmaWxlJztcblxuZXhwb3J0IGNvbnN0IGlzU2VsZWN0ID0gZmllbGQgPT4gZmllbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG5cbmV4cG9ydCBjb25zdCBpc1JlcXVpcmVkID0gZ3JvdXAgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSAncmVxdWlyZWQnKS5sZW5ndGggPiAwO1xuXG5jb25zdCBoYXNWYWx1ZSA9IGlucHV0ID0+IChpbnB1dC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0LnZhbHVlICE9PSBudWxsICYmIGlucHV0LnZhbHVlLmxlbmd0aCA+IDApO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBWYWx1ZVJlZHVjZXIgPSAoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGlmKCFpc0NoZWNrYWJsZShpbnB1dCkgJiYgaGFzVmFsdWUoaW5wdXQpKSBhY2MgPSBpbnB1dC52YWx1ZTtcbiAgICBpZihpc0NoZWNrYWJsZShpbnB1dCkgJiYgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGFjYykpIGFjYy5wdXNoKGlucHV0LnZhbHVlKVxuICAgICAgICBlbHNlIGFjYyA9IFtpbnB1dC52YWx1ZV07XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59O1xuXG5leHBvcnQgY29uc3QgcmVzb2x2ZUdldFBhcmFtcyA9IG5vZGVBcnJheXMgPT4gbm9kZUFycmF5cy5tYXAoKG5vZGVzKSA9PiB7XG4gICAgcmV0dXJuIGAke25vZGVzWzBdLmdldEF0dHJpYnV0ZSgnbmFtZScpfT0ke2V4dHJhY3RWYWx1ZUZyb21Hcm91cChub2Rlcyl9YDtcbn0pLmpvaW4oJyYnKTtcblxuZXhwb3J0IGNvbnN0IERPTU5vZGVzRnJvbUNvbW1hTGlzdCA9IChsaXN0LCBpbnB1dCkgPT4gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNvbHZlZFNlbGVjdG9yID0gZXNjYXBlQXR0cmlidXRlVmFsdWUoYXBwZW5kU3RhdGVQcmVmaXgoaXRlbSwgZ2V0U3RhdGVQcmVmaXgoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtyZXNvbHZlZFNlbGVjdG9yfV1gKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuY29uc3QgZXNjYXBlQXR0cmlidXRlVmFsdWUgPSB2YWx1ZSA9PiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG5cbmNvbnN0IGdldFN0YXRlUHJlZml4ID0gZmllbGROYW1lID0+IGZpZWxkTmFtZS5zdWJzdHIoMCwgZmllbGROYW1lLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcblxuY29uc3QgYXBwZW5kU3RhdGVQcmVmaXggPSAodmFsdWUsIHByZWZpeCkgPT4ge1xuICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgY29uc3QgcGlwZSA9ICguLi5mbnMpID0+IGZucy5yZWR1Y2UoKGFjYywgZm4pID0+IGZuKGFjYykpO1xuXG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VmFsdWVGcm9tR3JvdXAgPSBncm91cCA9PiBncm91cC5oYXNPd25Qcm9wZXJ0eSgnZmllbGRzJykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZ3JvdXAuZmllbGRzLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZ3JvdXAucmVkdWNlKGdyb3VwVmFsdWVSZWR1Y2VyLCAnJyk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaCA9ICh1cmwsIHByb3BzKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3Blbihwcm9wcy5tZXRob2QgfHwgJ0dFVCcsIHVybCk7XG4gICAgICAgIGlmIChwcm9wcy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcy5oZWFkZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBwcm9wcy5oZWFkZXJzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSByZXNvbHZlKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICBlbHNlIHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHhoci5zdGF0dXNUZXh0KTtcbiAgICAgICAgeGhyLnNlbmQocHJvcHMuYm9keSk7XG4gICAgfSk7XG59OyIsImltcG9ydCBWYWxpZGF0ZSBmcm9tICcuLi8uLi9kaXN0JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIGxldCB2YWxpZGF0b3IgPSBWYWxpZGF0ZS5pbml0KCdmb3JtJyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh2YWxpZGF0b3IpO1xuXG4gICAgLy8gdmFsaWRhdG9yLmFkZE1ldGhvZChcbiAgICAvLyAgICAgJ0N1c3RvbVZhbGlkYXRvcicsXG4gICAgLy8gICAgICh2YWx1ZSwgZmllbGRzLCBwYXJhbXMpID0+IHtcbiAgICAvLyAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gJ3Rlc3QnO1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICAnVmFsdWUgbXVzdCBlcXVhbCBcInRlc3RcIidcbiAgICAvLyApO1xuXG4gICAgLy8gdmFsaWRhdG9yLmFkZE1ldGhvZChcbiAgICAvLyAgICAgJ0N1c3RvbVZhbGlkYXRvcicsXG4gICAgLy8gICAgICh2YWx1ZSwgZmllbGRzLCBwYXJhbXMpID0+IHtcbiAgICAvLyAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gJ3Rlc3QgMic7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdCAyXCInXG4gICAgLy8gKTtcblxufV07XG5cbnsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9Il19
