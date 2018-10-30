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

	// if(els.length === 1 && window.__validators__ && window.__validators__[els[0]]) return window.__validators__[els[0]];

	//return instance if one exists for candidate passed to init
	//if inititialised using StormVaidation.init({sel}) the instance already exists thanks to auto-init
	//but reference may be wanted for invoking API methods
	//also for repeat initialisations
	return window.__validators__ = Object.assign({}, window.__validators__, els.reduce(function (acc, el) {
		if (el.hasAttribute('novalidate')) return acc;
		acc[el] = Object.create((0, _lib2.default)(el, opts));
		el.setAttribute('novalidate', 'novalidate');
		return acc;
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
    // let validator = Validate.init('form');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL21lc3NhZ2VzLmpzIiwiZGlzdC9saWIvZG9tL2luZGV4LmpzIiwiZGlzdC9saWIvaW5kZXguanMiLCJkaXN0L2xpYi9yZWR1Y2Vycy9pbmRleC5qcyIsImRpc3QvbGliL3N0b3JlL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL21ldGhvZHMuanMiLCJkaXN0L2xpYi92YWxpZGF0b3IvdXRpbHMuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxXQUFELEFBQVksTUFBUyxBQUNqQztLQUFJLFdBQUosQUFFQTs7QUFDQTtBQUNBO0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEsQUFBVSxhQUFwRSxBQUFpRixRQUFRLE1BQU0sQ0FBL0YsQUFBeUYsQUFBTSxBQUFDLGdCQUMzRixNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQTdCLEFBQU0sQUFBYyxBQUEwQixBQUVuRDs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtRQUFPLE9BQUEsQUFBTyx3QkFBaUIsQUFBTyxPQUFQLEFBQWMsSUFBSSxPQUFsQixBQUF5QixvQkFBZ0IsQUFBSSxPQUFPLFVBQUEsQUFBQyxLQUFELEFBQU0sSUFBTyxBQUM5RjtNQUFHLEdBQUEsQUFBRyxhQUFOLEFBQUcsQUFBZ0IsZUFBZSxPQUFBLEFBQU8sQUFDekM7TUFBQSxBQUFJLE1BQU0sT0FBQSxBQUFPLE9BQU8sbUJBQUEsQUFBUSxJQUFoQyxBQUFVLEFBQWMsQUFBWSxBQUNwQztLQUFBLEFBQUcsYUFBSCxBQUFnQixjQUFoQixBQUE4QixBQUM5QjtTQUFBLEFBQVEsQUFDUjtBQUxzRSxFQUFBLEVBQXhFLEFBQStCLEFBQXlDLEFBS3BFLEFBQ0osR0FOK0I7QUFkaEM7O0FBc0JBO0FBQ0EsQUFDQztJQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLGlCQUF2QixBQUFjLEFBQTBCLFNBQXhDLEFBQ0UsUUFBUSxnQkFBUSxBQUNoQjtNQUFHLEtBQUEsQUFBSyxjQUFMLEFBQW1CLHNCQUFzQixDQUFDLEtBQUEsQUFBSyxhQUFsRCxBQUE2QyxBQUFrQixlQUFlLEtBQUEsQUFBSyxBQUNuRjtBQUhGLEFBSUE7OztrQkFFYyxFQUFFLE0sQUFBRjs7Ozs7Ozs7QUNoQ1IsSUFBTSwwQ0FBaUIsQ0FBQSxBQUFDLFNBQXhCLEFBQXVCLEFBQVU7O0FBRWpDLElBQU07V0FBTixBQUFrQixBQUNkO0FBRGMsQUFDckI7O0FBR0csSUFBTTt1QkFBVSxBQUNBLEFBQ25CO2tCQUZtQixBQUVMLEFBQ2Q7dUJBSG1CLEFBR0EsQUFDbkI7c0JBSm1CLEFBSUQsQUFDbEI7aUJBTG1CLEFBS04sQUFDYjsyQkFORyxBQUFnQixBQU1JO0FBTkosQUFDbkI7O0FBUUo7QUFDTyxJQUFNLG9DQUFOLEFBQW9COztBQUUzQjtBQUNPLElBQU0sZ0NBQU4sQUFBa0I7O0FBRWxCLElBQU0sMENBQU4sQUFBdUI7O0FBRXZCLElBQU0sc0NBQU4sQUFBcUI7O0FBRXJCLElBQU0sc0NBQU4sQUFBcUI7O0FBRTVCO0FBQ08sSUFBTSw4RUFBTixBQUF5Qzs7QUFFaEQ7QUFDTyxJQUFNLG9EQUFzQixDQUFBLEFBQUMsMkJBQTdCLEFBQTRCLEFBQTRCOztBQUUvRDtBQUNBO0FBQ08sSUFBTTtZQUNELENBQUEsQUFBQyxjQURnQixBQUNqQixBQUFlLEFBQ3ZCO2tCQUFjLENBRlcsQUFFWCxBQUFDLEFBQ2Y7V0FBTyxDQUFBLEFBQUMsYUFIaUIsQUFHbEIsQUFBYyxBQUNyQjtBQUNBO0FBQ0E7ZUFBVyxDQU5jLEFBTWQsQUFBQyxBQUNaO2VBQVcsQ0FQYyxBQU9kLEFBQUMsQUFDWjtXQUFPLENBUmtCLEFBUWxCLEFBQUMsQUFDUjthQUFTLENBVGdCLEFBU2hCLEFBQUMsQUFDVjtZQUFRLENBQUEsQUFBQyxjQUFELEFBQWUsMkJBVkUsQUFVakIsQUFBMEMsZUFWL0MsQUFBc0IsQUFVdUM7QUFWdkMsQUFDekI7O0FBWUo7QUFDTyxJQUFNLDZDQUFrQixBQUMzQixZQUQyQixBQUUzQixnQkFGMkIsQUFHM0I7QUFDQTtBQUoyQixBQUszQixPQUwyQixFQUFBLEFBTTNCLFVBTjJCLEFBTzNCLE9BUDJCLEFBUTNCLFVBUjJCLEFBUzNCLGFBVDJCLEFBVTNCLFNBVjJCLEFBVzNCLFdBWEcsQUFBd0IsQUFZM0I7O0FBSUo7QUFDTyxJQUFNO1dBQW9CLEFBQ3RCLEFBQ1A7V0FGRyxBQUEwQixBQUV0QjtBQUZzQixBQUM3Qjs7Ozs7Ozs7O0FDbkVXLGtDQUNBLEFBQUU7ZUFBQSxBQUFPLEFBQTRCO0FBRHJDLEFBRVg7QUFGVyw0QkFFSCxBQUFFO2VBQUEsQUFBTyxBQUF3QztBQUY5QyxBQUdYO0FBSFcsZ0NBR0QsQUFBRTtlQUFBLEFBQU8sQUFBc0M7QUFIOUMsQUFJWDtBQUpXLHdCQUlOLEFBQUU7ZUFBQSxBQUFPLEFBQThCO0FBSmpDLEFBS1g7QUFMVywwQkFLSixBQUFFO2VBQUEsQUFBTyxBQUErQjtBQUxwQyxBQU1YO0FBTlcsZ0NBTUQsQUFBRTtlQUFBLEFBQU8sQUFBcUM7QUFON0MsQUFPWDtBQVBXLDhCQU9GLEFBQUU7ZUFBQSxBQUFPLEFBQWlDO0FBUHhDLEFBUVg7QUFSVyw4QkFRRixBQUFFO2VBQUEsQUFBTyxBQUE4QjtBQVJyQyxBQVNYO0FBVFcsa0NBQUEsQUFTRCxPQUFPLEFBQUU7OENBQUEsQUFBb0MsUUFBc0I7QUFUbEUsQUFVWDtBQVZXLGtDQUFBLEFBVUQsT0FBTyxBQUFFOzBDQUFBLEFBQWdDLFFBQXNCO0FBVjlELEFBV1g7QUFYVyxzQkFBQSxBQVdQLE9BQU0sQUFBRTsrREFBcUQsQ0FBckQsQUFBcUQsQUFBQyxTQUFZO0FBWG5FLEFBWVg7QUFaVyxzQkFBQSxBQVlQLE9BQU0sQUFBRTtrRUFBQSxBQUF3RCxRQUFTO0FBWmxFLEFBYVg7QUFiVyxnQ0FhRCxBQUFFO2VBQUEsQUFBTyxBQUF1QztBQWIvQyxBQWNYO0FBZFcsOEJBY0YsQUFBRTtlQUFBLEFBQU8sQUFBMkI7QSxBQWRsQztBQUFBLEFBQ1g7Ozs7Ozs7Ozs7QUNESjs7QUFFQTtBQUNBLElBQUksYUFBSixBQUFpQjs7QUFFakI7Ozs7Ozs7Ozs7QUFVTyxJQUFNLGdCQUFJLFNBQUosQUFBSSxFQUFBLEFBQUMsVUFBRCxBQUFXLFlBQVgsQUFBdUIsTUFBUyxBQUM3QztRQUFJLE9BQU8sU0FBQSxBQUFTLGNBQXBCLEFBQVcsQUFBdUIsQUFFbEM7O1NBQUksSUFBSixBQUFRLFFBQVIsQUFBZ0IsWUFBWSxBQUN4QjthQUFBLEFBQUssYUFBTCxBQUFrQixNQUFNLFdBQXhCLEFBQXdCLEFBQVcsQUFDdEM7QUFDRDtRQUFHLFNBQUEsQUFBUyxhQUFhLEtBQXpCLEFBQThCLFFBQVEsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLGVBQTFCLEFBQWlCLEFBQXdCLEFBRS9FOztXQUFBLEFBQU8sQUFDVjtBQVRNOztBQVdQOzs7Ozs7Ozs7QUFTTyxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLE9BQUQsQUFBUSxLQUFRLEFBQy9DO1FBQUksT0FBTyxTQUFBLEFBQVMsZUFBcEIsQUFBVyxBQUF3QixBQUVuQzs7VUFBQSxBQUFNLGdCQUFOLEFBQXNCLFVBQXRCLEFBQWdDLE9BQU8sNkJBQXZDLEFBQXlELEFBQ3pEO1VBQUEsQUFBTSxnQkFBTixBQUFzQixVQUF0QixBQUFnQyxJQUFJLDZCQUFwQyxBQUFzRCxBQUV0RDs7V0FBTyxNQUFBLEFBQU0sZ0JBQU4sQUFBc0IsWUFBN0IsQUFBTyxBQUFrQyxBQUM1QztBQVBNOztBQVNQOzs7Ozs7Ozs7OztBQVdPLElBQU0sa0NBQWEsU0FBYixBQUFhLHNCQUFBO1dBQWEsaUJBQVMsQUFDNUM7bUJBQUEsQUFBVyxXQUFYLEFBQXNCLFdBQXRCLEFBQWlDLFlBQVksV0FBN0MsQUFBNkMsQUFBVyxBQUN4RDtZQUFHLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBaEIsQUFBMkIsaUJBQWlCLEFBQ3hDO2tCQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsZ0JBQXhCLEFBQXdDLFVBQXhDLEFBQWtELE9BQU8sNkJBQXpELEFBQTJFLEFBQzNFO2tCQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsZ0JBQXhCLEFBQXdDLFVBQXhDLEFBQWtELElBQUksNkJBQXRELEFBQXdFLEFBQzNFO0FBQ0Q7Y0FBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLE9BQXhCLEFBQStCLFFBQVEsaUJBQVMsQUFBRTtrQkFBQSxBQUFNLGdCQUFOLEFBQXNCLEFBQWtCO0FBQTFGLEFBQ0E7ZUFBTyxXQUFQLEFBQU8sQUFBVyxBQUNyQjtBQVJ5QjtBQUFuQjs7QUFVUDs7Ozs7O0FBTU8sSUFBTSxvQ0FBYyxTQUFkLEFBQWMsbUJBQVMsQUFDaEM7V0FBQSxBQUFPLEtBQVAsQUFBWSxZQUFaLEFBQXdCLFFBQVEsZ0JBQVEsQUFDcEM7bUJBQUEsQUFBVyxNQUFYLEFBQWlCLEFBQ3BCO0FBRkQsQUFHSDtBQUpNOztBQU1QOzs7Ozs7QUFNTyxJQUFNLHNDQUFlLFNBQWYsQUFBZSxvQkFBUyxBQUNqQztXQUFBLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLFFBQVEscUJBQWEsQUFDM0M7WUFBRyxDQUFDLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBakIsQUFBNEIsT0FBTyxZQUFBLEFBQVksV0FBWixBQUF1QixBQUM3RDtBQUZELEFBR0g7QUFKTTs7QUFNUDs7Ozs7Ozs7Ozs7OztBQWFPLElBQU0sb0NBQWMsU0FBZCxBQUFjLHVCQUFBO1dBQWEsaUJBQVMsQUFDN0M7WUFBRyxXQUFILEFBQUcsQUFBVyxZQUFZLFdBQUEsQUFBVyxXQUFYLEFBQXNCLEFBRWhEOzttQkFBQSxBQUFXLGFBQ1AsTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLGtCQUNkLG9CQUFvQixNQUFBLEFBQU0sT0FBMUIsQUFBb0IsQUFBYSxZQUFZLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixjQUQvRSxBQUNVLEFBQTZDLEFBQXNDLE1BQ25GLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUNXLE9BQU8sTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLE9BQXhCLEFBQStCLFNBRGpELEFBQ3dELEdBRHhELEFBRVcsV0FGWCxBQUdXLFlBQVksRUFBQSxBQUFFLE9BQU8sRUFBRSxPQUFPLDZCQUFsQixBQUFTLEFBQTJCLFNBQVMsTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLGNBTjFHLEFBR2MsQUFHdUIsQUFBNkMsQUFBc0MsQUFFM0g7O2NBQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixPQUF4QixBQUErQixRQUFRLGlCQUFTLEFBQ3pDO2tCQUFBLEFBQU0sYUFBTixBQUFtQixnQkFBbkIsQUFBbUMsQUFDdEM7QUFGSixBQUdBO0FBZDBCO0FBQXBCOztBQWdCUDs7Ozs7Ozs7O0FBU08sSUFBTSwwREFBeUIsU0FBekIsQUFBeUIsK0JBQVUsQUFDNUM7a0JBQU8sQUFBTyxLQUFQLEFBQVksUUFBWixBQUNGLE9BQU8saUJBQUE7ZUFBUyxDQUFDLE1BQVYsQUFBZ0I7QUFEckIsS0FBQSxFQUFQLEFBQU8sQUFDNEIsSUFEbkMsQUFFSyxPQUZMLEFBRVksR0FGWixBQUdLLEFBQ1I7QUFMTTs7Ozs7Ozs7O0FDL0hQOzs7O0FBQ0E7O0FBQ0E7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTSxXQUFXLFNBQVgsQUFBVyxlQUFBO1dBQVEsYUFBSyxBQUMxQjthQUFLLEVBQUwsQUFBSyxBQUFFLEFBQ1A7d0JBQUEsQUFBTSxTQUFTLG1CQUFmLEFBQXVCLGNBQXZCLEFBQXFDLE1BQU0sTUFBM0MsQUFFQTs7eUNBQWlCLGdCQUFBLEFBQU0sV0FBdkIsQUFBa0MsUUFBbEMsQUFDSyxLQUFLLHlCQUFpQjtnQkFDbkI7O2dCQUFHLFlBQUEsQUFBRyxzQ0FBSCxBQUFhLGdCQUFiLEFBQTRCLDRDQUEvQixBQUFHLEFBQTZELE9BQU0sQUFDbEU7b0JBQUcsS0FBSyxFQUFSLEFBQVUsUUFBUSxLQUFBLEFBQUssQUFDdkI7dUJBQUEsQUFBTyxBQUNWO0FBRUQ7OzRCQUFBLEFBQU0sV0FBTixBQUFpQix1QkFBakIsQUFBd0MsU0FBeEMsQUFBaUQsQUFFakQ7OzZDQUF1QixnQkFBQSxBQUFNLFdBQTdCLEFBQXdDLEFBRXhDOzs0QkFBQSxBQUFNLFNBQ0YsbUJBREosQUFDWSwwQkFDUixBQUFPLEtBQUssZ0JBQUEsQUFBTSxXQUFsQixBQUE2QixRQUE3QixBQUNLLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOLEFBQWEsR0FBTSxBQUN2QjsyQkFBTyxBQUFJOzJCQUNBLGNBQUEsQUFBYyxHQUFkLEFBQWlCLDRDQURSLEFBQ1QsQUFBa0QsQUFDekQ7bUNBQWUsY0FBQSxBQUFjLEdBQWQsQUFBaUIsT0FBTyxvQ0FBQSxBQUFvQixPQUFPLGdCQUFuRCxBQUF3QixBQUEyQixBQUFNLGFBRnJFLEFBQWEsQUFFRCxBQUFzRTtBQUZyRSxBQUNoQixpQkFERyxFQUFQLEFBR0csQUFDTjtBQU5MLGFBQUEsRUFGSixBQUVJLEFBTU8sS0FDUCxNQVRKLEFBWUE7O21CQUFBLEFBQU8sQUFDVjtBQXhCTCxBQXlCSDtBQTdCZ0I7QUFBakI7O0FBK0JBOzs7Ozs7Ozs7QUFTQSxJQUFNLFlBQVksU0FBWixBQUFZLFVBQUEsQUFBQyxXQUFELEFBQVksUUFBWixBQUFvQixTQUFZLEFBQzlDO1FBQUksY0FBQSxBQUFjLGFBQWEsV0FBM0IsQUFBc0MsYUFBYSxZQUFwRCxBQUFnRSxhQUFjLENBQUMsZ0JBQUEsQUFBTSxXQUFQLEFBQUMsQUFBaUIsY0FBYyxTQUFBLEFBQVMsa0JBQVQsQUFBMkIsV0FBM0IsQUFBc0MsV0FBdkosQUFBa0ssR0FDOUosT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFeEI7O29CQUFBLEFBQU0sU0FBUyxtQkFBZixBQUF1Qix1QkFBdUIsRUFBQyxXQUFELFdBQVksV0FBVyxFQUFDLE1BQUQsQUFBTyxVQUFVLFFBQWpCLFFBQXlCLFNBQTlGLEFBQThDLEFBQXVCLEFBQ3hFO0FBTEQ7O0FBUUE7Ozs7Ozs7Ozs7QUFVQSxJQUFNLDBCQUEwQixTQUExQixBQUEwQiwwQkFBTSxBQUNsQztRQUFJLFVBQVUsU0FBVixBQUFVLG1CQUFBO2VBQWEsWUFBTSxBQUM3QjtnQkFBRyxDQUFDLGdCQUFBLEFBQU0sV0FBTixBQUFpQixPQUFqQixBQUF3QixXQUE1QixBQUF1QyxPQUFPLEFBQzFDO2dDQUFBLEFBQU0sU0FBUyxtQkFBZixBQUF1QixhQUF2QixBQUFvQyxXQUFXLENBQUMscUJBQWhELEFBQStDLEFBQUMsQUFBVyxBQUM5RDtBQUVEOztrREFBc0IsZ0JBQUEsQUFBTSxXQUFOLEFBQWlCLE9BQXZDLEFBQXNCLEFBQXdCLFlBQTlDLEFBQ0ssS0FBSyxlQUFPLEFBQ1Q7b0JBQUcsQ0FBQyxJQUFBLEFBQUksNENBQVIsQUFBSSxBQUFxQyxPQUFPLEFBQzVDO29DQUFBLEFBQU0sU0FDRSxtQkFEUixBQUNnQjsrQkFDUixBQUNXLEFBQ1A7dUNBQWUsSUFBQSxBQUFJLE9BQU8sb0NBQUEsQUFBb0IsV0FBVyxnQkFBMUMsQUFBVyxBQUErQixBQUFNLGFBSjNFLEFBRVEsQUFFbUIsQUFBNkQ7QUFGaEYsQUFDSSx1QkFHSixDQUFDLHNCQU5ULEFBTVEsQUFBQyxBQUFZLEFBRXBCO0FBQ1I7QUFaTCxBQWFIO0FBbEJhO0FBQWQsQUFvQkE7O1dBQUEsQUFBTyxLQUFLLGdCQUFBLEFBQU0sV0FBbEIsQUFBNkIsUUFBN0IsQUFBcUMsUUFBUSxxQkFBYSxBQUN0RDt3QkFBQSxBQUFNLFdBQU4sQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsT0FBbkMsQUFBMEMsUUFBUSxpQkFBUyxBQUN2RDtrQkFBQSxBQUFNLGlCQUFpQiwrQ0FBdkIsQUFBdUIsQUFBK0IsUUFBUSxRQUE5RCxBQUE4RCxBQUFRLEFBQ3pFO0FBRkQsQUFHQTtBQUNBO1lBQUksbUNBQW1CLEFBQU0sV0FBTixBQUFpQixPQUFqQixBQUF3QixXQUF4QixBQUFtQyxXQUFuQyxBQUE4QyxPQUFPLHFCQUFBO21CQUFhLFVBQUEsQUFBVSxTQUF2QixBQUFnQztBQUE1RyxBQUF1QixBQUV2QixTQUZ1Qjs7WUFFcEIsaUJBQUEsQUFBaUIsU0FBcEIsQUFBNkIsR0FBRSxBQUMzQjs2QkFBQSxBQUFpQixHQUFqQixBQUFvQixPQUFwQixBQUEyQixNQUEzQixBQUFpQyxRQUFRLG9CQUFZLEFBQ2pEO3lCQUFBLEFBQVMsUUFBUSxnQkFBUSxBQUFFO3lCQUFBLEFBQUssaUJBQUwsQUFBc0IsUUFBUSxRQUE5QixBQUE4QixBQUFRLEFBQWM7QUFBL0UsQUFDSDtBQUZELEFBR0g7QUFDSjtBQVpELEFBYUg7QUFsQ0Q7O0FBb0NBOzs7Ozs7Ozs7a0JBUWUsZ0JBQVEsQUFDbkI7b0JBQUEsQUFBTSxTQUFTLG1CQUFmLEFBQXVCLG1CQUFvQixnQ0FBM0MsQUFBMkMsQUFBZ0IsQUFDM0Q7U0FBQSxBQUFLLGlCQUFMLEFBQXNCLFVBQVUsU0FBaEMsQUFBZ0MsQUFBUyxBQUN6QztTQUFBLEFBQUssaUJBQUwsQUFBc0IsU0FBUyxZQUFNLEFBQUU7d0JBQUEsQUFBTSxPQUFPLFFBQWIsQUFBcUIsY0FBckIsQUFBbUMsTUFBTSxNQUF6QyxBQUEwRDtBQUFqRyxBQUVBOzs7a0JBQ2MsU0FEUCxBQUNPLEFBQVMsQUFDbkI7bUJBRkosQUFBTyxBQUlWO0FBSlUsQUFDSDtBOzs7Ozs7Ozs7OztBQzFJUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7O3NGQUlLLG1CLEFBQVEsbUJBQW9CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtXQUFpQixPQUFBLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0IsT0FBbkMsQUFBaUIsQUFBeUI7QSwyQ0FDdEUsbUIsQUFBUSxjQUFlLGlCQUFBO2tCQUFTLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0I7dUJBQ3ZDLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQ3JEO2dCQUFBLEFBQUksZ0JBQVMsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFBLEFBQU0sT0FBeEIsQUFBa0IsQUFBYTsrQkFBUSxBQUNqQyxBQUNmO3VCQUZKLEFBQWEsQUFBdUMsQUFFekMsQUFFWDtBQUpvRCxBQUNoRCxhQURTO21CQUliLEFBQU8sQUFDVjtBQU5PLFNBQUEsRUFEWSxBQUFTLEFBQXlCLEFBQzlDLEFBTUw7QUFQbUQsQUFDdEQsS0FENkI7QSwyQ0FTaEMsbUIsQUFBUSxhQUFjLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtrQkFBaUIsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjt1QkFDOUMsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFsQixBQUF3Qiw0QkFBeEIsQUFDSCxhQUFPLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBQSxBQUFNLE9BQXhCLEFBQWtCLEFBQWE7MkJBQU8sQUFDM0IsQUFDZjttQkFKVyxBQUFpQixBQUF5QixBQUNyRCxBQUNJLEFBQXNDLEFBRW5DO0FBRm1DLEFBQzFDLFNBREksRUFESjtBQURxRCxBQUM3RCxLQURvQztBLDJDQVF2QyxtQixBQUFRLHVCQUF3QixVQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVI7a0JBQWlCLEFBQU8sT0FBUCxBQUFjLElBQWQsQUFBa0I7dUJBQ3hELEFBQU8sT0FBUCxBQUFjLElBQUksTUFBbEIsQUFBd0IsNEJBQzNCLEtBREcsQUFDRSxrQkFBWSxBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQUEsQUFBTSxPQUFPLEtBQWIsQUFBa0IsYUFBYSxNQUFBLEFBQU0sT0FBTyxLQUE1QyxBQUErQixBQUFrQixhQUFuRSxBQUFnRixJQUM5RCxNQUFBLEFBQU0sT0FBTyxLQUFiLEFBQWtCLGFBQWMsRUFBRSx5Q0FBZ0IsTUFBQSxBQUFNLE9BQU8sS0FBYixBQUFrQixXQUFsQyxBQUE2QyxjQUFZLEtBQTNGLEFBQWdDLEFBQUUsQUFBOEQ7b0JBRXBGLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsa0JBQWtCLEtBRG5ELEFBQ1UsQUFBYyxBQUFnQyxBQUN0RDs2QkFBaUIsU0FBQSxBQUFTLHdFQUFzRCxLQUEvRCxBQUFvRSxvQkFGdkYsQUFFd0csQUFDdEc7bUJBSEYsQUFHUyxBQUNQO3dCQUFZLENBQUMsS0FSNUIsQUFBaUIsQUFBeUIsQUFDL0QsQUFDYyxBQUVvQixBQUljLEFBQU07QUFKcEIsQUFDRSxTQUh0QixFQURkO0FBRCtELEFBQ3ZFLEtBRDhDO0EsMkNBWWpELG1CLEFBQVEsbUJBQW9CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUyxBQUMxQztrQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCOzRCQUFPLEFBQ1IsQUFDcEI7dUJBQVEsQUFBTyxLQUFLLE1BQVosQUFBa0IsUUFBbEIsQUFBMEIsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDckQ7Z0JBQUEsQUFBSSxTQUFTLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFBLEFBQU0sT0FBeEIsQUFBa0IsQUFBYSxRQUFRLEtBQXBELEFBQWEsQUFBdUMsQUFBSyxBQUN6RDttQkFBQSxBQUFPLEFBQ1Y7QUFITyxTQUFBLEVBRlosQUFBTyxBQUF5QixBQUVwQixBQUdMLEFBRVY7QUFQbUMsQUFDNUIsS0FERztBLDJDQVFWLG1CLEFBQVEsa0JBQW1CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUyxBQUN6QztrQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCO3VCQUNiLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBbEIsQUFBd0IsNEJBQzNCLEtBREcsQUFDRSxjQUFRLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBQSxBQUFNLE9BQU8sS0FBL0IsQUFBa0IsQUFBa0I7MkJBQy9CLEtBRHVDLEFBQ2xDLEFBQ3BCO21CQUpaLEFBQU8sQUFBeUIsQUFDcEIsQUFDVSxBQUE0QyxBQUUvQyxBQUl0QjtBQU5xRSxBQUN0RCxTQURVLEVBRFY7QUFEb0IsQUFDNUIsS0FERztBOzs7Ozs7Ozs7QUM5Q2Y7Ozs7Ozs7O0FBQ0E7QUFDQSxJQUFJLFFBQUosQUFBWTs7QUFFWjtBQUNBOztBQUVBO0FBQ0EsSUFBTSxXQUFXLFNBQVgsQUFBVyxXQUFBO1NBQUEsQUFBTTtBQUF2Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsSUFBTSxXQUFXLFNBQVgsQUFBVyxTQUFBLEFBQVMsTUFBVCxBQUFlLFdBQWYsQUFBMEIsU0FBUyxBQUNoRDtVQUFRLFlBQVksbUJBQUEsQUFBUyxNQUFULEFBQWUsT0FBM0IsQUFBWSxBQUFzQixhQUExQyxBQUF1RCxBQUN2RDtBQUNBO0FBQ0E7TUFBRyxDQUFILEFBQUksU0FBUyxBQUNiO1VBQUEsQUFBUSxRQUFRLGtCQUFVLEFBQUU7V0FBQSxBQUFPLEFBQVM7QUFBNUMsQUFDSDtBQU5EOztrQkFRZSxFQUFFLFVBQUYsVUFBWSxVLEFBQVo7Ozs7Ozs7Ozs7QUMzQmY7Ozs7QUFDQTs7OztBQUNBOztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7QUFRQSxJQUFNLGVBQWUsU0FBZixBQUFlLGFBQUEsQUFBQyxPQUFELEFBQVEsT0FBVSxBQUNuQztRQUFJLFFBQVEsTUFBQSxBQUFNLDJCQUFsQixBQUFZLEFBQStCLEFBQzNDOytCQUNhLE1BQUEsQUFBTSxNQUFOLEFBQVksS0FEekIsQUFDYSxBQUFpQixJQUFLLENBQUMsQ0FBQyxDQUFDLCtCQUFBLEFBQW9CLFFBQXZCLEFBQUcsQUFBNEIsU0FBUyxrQ0FBQSxBQUFzQixPQUE5RCxBQUF3QyxBQUE2QixTQUR4RyxBQUNnSCxBQUVuSDtBQUxEOztBQU9BOzs7Ozs7Ozs7QUFTQSxJQUFNLGdCQUFnQixTQUFoQixBQUFnQixjQUFBLEFBQUMsT0FBRCxBQUFRLFNBQVI7b0NBQW9CLEFBQWM7eUNBRUEsQUFBYyxTQUFkLEFBQ0ssT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDcEI7bUJBQU8sTUFBQSxBQUFNLDJCQUFOLEFBQStCLFNBQVcsT0FBQSxBQUFPLE9BQVAsQUFBYyxLQUFLLGFBQUEsQUFBYSxPQUExRSxBQUEwQyxBQUFtQixBQUFvQixVQUF4RixBQUFrRyxBQUNwRztBQUhOLFNBQUEsRUFGZCxBQUNJLEFBQ1UsQUFHUTtBQUpsQixBQUNFLEtBRk4sR0FBcEIsQUFPd0I7QUFQOUM7O0FBU0E7Ozs7Ozs7Ozs7O0FBV0EsSUFBTSwyQkFBMkIsU0FBM0IsQUFBMkIsZ0NBQUE7c0NBQVMsQUFBZ0IsT0FBTyxVQUFBLEFBQUMsWUFBRCxBQUFhLFNBQWI7ZUFDTCxDQUFDLE1BQUEsQUFBTSwyQkFBUCxBQUFDLEFBQStCLFdBQWhDLEFBQ0UsMENBREYsQUFFTSxxQkFDRixBQUFPO2tCQUFPLEFBQ0osQUFDTixPQUZVLEFBQ1Y7cUJBQ1MsTUFBQSxBQUFNLDJCQUZuQixBQUFjLEFBRUQsQUFBK0IsVUFGNUMsRUFHSSxjQUFBLEFBQWMsT0FQakIsQUFDTCxBQUdJLEFBR0ksQUFBcUI7QUFQL0MsS0FBQSxFQUFULEFBQVMsQUFVYztBQVZ4RDs7QUFhQTs7Ozs7Ozs7OztBQVVBLElBQU0sd0JBQXdCLFNBQXhCLEFBQXdCLDZCQUFBO1dBQVMsaUJBQUssTUFBTCxBQUFLLEFBQU0sUUFBUSxJQUFuQixBQUFtQixBQUFJLFFBQVEsT0FBL0IsQUFBK0IsQUFBTyxRQUFRLFVBQTlDLEFBQThDLEFBQVUsUUFBUSxVQUFoRSxBQUFnRSxBQUFVLFFBQVEsSUFBbEYsQUFBa0YsQUFBSSxRQUFRLElBQTlGLEFBQThGLEFBQUksUUFBUSxRQUExRyxBQUEwRyxBQUFRLFFBQVEsU0FBbkksQUFBUyxBQUEwSCxBQUFTO0FBQTFLOztBQUVBOzs7Ozs7QUFNQSxJQUFNLFdBQVcsU0FBWCxBQUFXLGdCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFRLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGVBQWUsTUFBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQXJELEFBQXFFLHVDQUFyRSxBQUFtRixjQUFZLEVBQUMsTUFBaEcsQUFBK0YsQUFBTyxpQkFBNUgsQUFBMkk7QUFBcEo7QUFBakI7QUFDQSxJQUFNLFFBQVEsU0FBUixBQUFRLGFBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0IsdUNBQS9CLEFBQTZDLGNBQVksRUFBQyxNQUExRCxBQUF5RCxBQUFPLGNBQXRGLEFBQWtHO0FBQTNHO0FBQWQ7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0IscUNBQS9CLEFBQTJDLGNBQVksRUFBQyxNQUF4RCxBQUF1RCxBQUFPLFlBQXBGLEFBQThGO0FBQXZHO0FBQVo7QUFDQSxJQUFNLFNBQVMsU0FBVCxBQUFTLGNBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVEsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBbkIsQUFBK0Isd0NBQS9CLEFBQThDLGNBQVksRUFBQyxNQUEzRCxBQUEwRCxBQUFPLGVBQXZGLEFBQW9HO0FBQTdHO0FBQWY7QUFDQSxJQUFNLFlBQVksU0FBWixBQUFZLGlCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFnQixNQUFBLEFBQU0sYUFBTixBQUFtQixpQkFBdkQsQUFBd0UsdUNBQXhFLEFBQXVGLGNBQVksRUFBQyxNQUFELEFBQU8sYUFBYSxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBNUksQUFBbUcsQUFBNEIsQUFBTyxBQUFtQixxQkFBL0ssQUFBaU07QUFBMU07QUFBbEI7QUFDQSxJQUFNLFlBQVksU0FBWixBQUFZLGlCQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFnQixNQUFBLEFBQU0sYUFBTixBQUFtQixpQkFBdkQsQUFBd0UsdUNBQXhFLEFBQXVGLGNBQVksRUFBQyxNQUFELEFBQU8sYUFBYSxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBNUksQUFBbUcsQUFBNEIsQUFBTyxBQUFtQixxQkFBL0ssQUFBaU07QUFBMU07QUFBbEI7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsVUFBVSxNQUFBLEFBQU0sYUFBTixBQUFtQixXQUFqRCxBQUE0RCx1Q0FBNUQsQUFBMkUsY0FBWSxFQUFDLE1BQUQsQUFBTyxPQUFPLFFBQVEsRUFBRSxLQUFLLE1BQUEsQUFBTSxhQUExSCxBQUF1RixBQUFzQixBQUFPLEFBQW1CLGVBQTdKLEFBQXlLO0FBQWxMO0FBQVo7QUFDQSxJQUFNLE1BQU0sU0FBTixBQUFNLFdBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsVUFBVSxNQUFBLEFBQU0sYUFBTixBQUFtQixXQUFqRCxBQUE0RCx1Q0FBNUQsQUFBMkUsY0FBWSxFQUFDLE1BQUQsQUFBTyxPQUFPLFFBQVEsRUFBRSxLQUFLLE1BQUEsQUFBTSxhQUExSCxBQUF1RixBQUFzQixBQUFPLEFBQW1CLGVBQTdKLEFBQXlLO0FBQWxMO0FBQVo7QUFDQSxJQUFNLFVBQVUsU0FBVixBQUFVLGVBQUE7V0FBUyxZQUFBO1lBQUEsQUFBQyxpRkFBRCxBQUFjO2VBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsY0FBYyxNQUFBLEFBQU0sYUFBTixBQUFtQixlQUFyRCxBQUFvRSx1Q0FBcEUsQUFBbUYsY0FBWSxFQUFDLE1BQUQsQUFBTyxXQUFXLFFBQVEsRUFBRSxPQUFPLE1BQUEsQUFBTSxhQUF4SSxBQUErRixBQUEwQixBQUFTLEFBQW1CLG1CQUEzSyxBQUEyTDtBQUFwTTtBQUFoQjs7QUFFQTs7Ozs7OztBQU9PLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLDJCQUFBO1dBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsZ0JBQW5CLEFBQW1DLFNBQ2pDLHlCQURGLEFBQ0UsQUFBeUIsU0FDekIsc0JBRlgsQUFFVyxBQUFzQjtBQUY3RDs7QUFJUDs7Ozs7OztBQU9PLElBQU0sOEJBQVcsU0FBWCxBQUFXLFNBQUEsQUFBQyxPQUFELEFBQVEsV0FBUjtXQUFzQixVQUFBLEFBQVUsU0FBVixBQUFtQixXQUNqQixrQkFBQSxBQUFRLFVBQVUsVUFBbEIsQUFBNEIsUUFEOUIsQUFDRSxBQUFvQyxTQUNwQyxrQkFBUSxVQUFSLEFBQWtCLE1BQWxCLEFBQXdCLE9BQU8sVUFGdkQsQUFFd0IsQUFBeUM7QUFGbEY7O0FBSVA7Ozs7Ozs7Ozs7OztBQVlPLElBQU0sNERBQTBCLFNBQTFCLEFBQTBCLHdCQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDbkQ7UUFBSSxPQUFPLE1BQUEsQUFBTSxhQUFqQixBQUFXLEFBQW1CLEFBQzlCO2VBQU8sQUFBSSxRQUFRLElBQUEsQUFBSSxRQUFRLE9BQUEsQUFBTyxPQUFPLElBQWQsQUFBYyxBQUFJLE9BQU8sRUFBRSxxQ0FBWSxJQUFBLEFBQUksTUFBaEIsQUFBc0IsVUFBN0QsQUFBWSxBQUF5QixBQUFFLEFBQThCO2VBQ3pELEFBQ2EsQUFDUjtvQkFBWSxvQkFGakIsQUFFaUIsQUFBb0IsQUFDaEM7Z0JBQVEsQ0FIYixBQUdhLEFBQUMsQUFDVDt5QkFBaUIsU0FBQSxBQUFTLHlFQUF1RCxNQUFBLEFBQU0sYUFBdEUsQUFBZ0UsQUFBbUIsbUJBTGpJLEFBQ3dCLEFBSXlIO0FBSnpILEFBQ0ssS0FGN0IsRUFBUCxBQU1tQyxBQUN0QztBQVRNOztBQVdQOzs7Ozs7OztBQVFBLElBQU0sc0JBQXNCLFNBQXRCLEFBQXNCLCtCQUFBO1dBQWEsVUFBQSxBQUFVLFdBQVcsbUJBQVMsVUFBVCxBQUFtQixNQUFNLFVBQUEsQUFBVSxXQUFWLEFBQXFCLFlBQVksVUFBakMsQUFBMkMsU0FBdEcsQUFBa0MsQUFBNkU7QUFBM0k7O0FBRUE7Ozs7Ozs7QUFPTyxJQUFNLG9EQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFDLE9BQUQsQUFBUSxPQUFSO1dBQWtCLFVBQUEsQUFBQyxLQUFELEFBQU0sVUFBTixBQUFnQixHQUFNLEFBQ3ZFO2VBQU8sYUFBQSxBQUFhLE9BQWIsQUFDTyxtQ0FEUCxBQUVXLE9BQUssT0FBQSxBQUFPLGFBQVAsQUFBb0IsWUFDakIsb0JBQW9CLE1BQUEsQUFBTSxPQUFOLEFBQWEsT0FBYixBQUFvQixXQUQzQyxBQUNHLEFBQW9CLEFBQStCLE1BSDdFLEFBQU8sQUFJbUIsQUFDN0I7QUFOa0M7QUFBNUI7O0FBUVA7Ozs7Ozs7O0FBUU8sSUFBTSxnRUFBNEIsU0FBNUIsQUFBNEIsa0NBQVUsQUFDL0M7UUFBSSxtQkFBSixBQUF1QixBQUV2Qjs7U0FBSSxJQUFKLEFBQVEsU0FBUixBQUFpQixRQUNiO1lBQUcsT0FBQSxBQUFPLE9BQVAsQUFBYyxXQUFkLEFBQXlCLFNBQTVCLEFBQXFDLEdBQ2pDLGlCQUFBLEFBQWlCLFNBQVMsT0FGbEMsQUFFUSxBQUEwQixBQUFPO0FBRXpDLFlBQUEsQUFBTyxBQUNWO0FBUk07O0FBVVA7Ozs7Ozs7OztBQVNPLElBQU0sNENBQWtCLFNBQWxCLEFBQWtCLHNCQUFBOzs0QkFBUyxBQUNoQixBQUNwQjtnQkFBUSwwQkFBMEIsR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyxpQkFBbkIsQUFBYyxBQUFzQiwrQ0FBcEMsQUFDakIsT0FEaUIsQUFDVix5QkFIRyxBQUFTLEFBRTVCLEFBQTBCLEFBQ2U7QUFIYixBQUNwQztBQURHOztBQU1QOzs7Ozs7QUFNTyxJQUFNLDhEQUEyQixTQUEzQixBQUEyQix5QkFBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQ25EO1FBQUcsU0FBSCxBQUFZLE1BQU0sTUFBQSxBQUFNLEFBQ3hCO1dBQUEsQUFBTyxBQUNWO0FBSE07O0FBS1A7Ozs7Ozs7O0FBUU8sSUFBTSw4Q0FBbUIsU0FBbkIsQUFBbUIseUJBQVUsQUFDdEM7bUJBQU8sQUFBUSxXQUNYLEFBQU8sS0FBUCxBQUFZLFFBQVosQUFDSyxJQUFJLGlCQUFBO2VBQVMsc0JBQXNCLE9BQS9CLEFBQVMsQUFBc0IsQUFBTztBQUZuRCxBQUFPLEFBQ0gsQUFHUCxLQUhPLENBREc7QUFESjs7QUFPUDs7Ozs7Ozs7QUFRTyxJQUFNLHdEQUF3QixTQUF4QixBQUF3Qiw2QkFBUyxBQUMxQztRQUFJLFdBQUosQUFBZSxBQUNsQjttQkFBTyxBQUFRLFVBQUksQUFBTSxXQUFOLEFBQWlCLElBQUkscUJBQWEsQUFDOUM7bUJBQU8sQUFBSSxRQUFRLG1CQUFXLEFBQzFCO2dCQUFHLFVBQUEsQUFBVSxTQUFiLEFBQXNCLFVBQVMsQUFDM0I7b0JBQUcsU0FBQSxBQUFTLE9BQVosQUFBRyxBQUFnQixZQUFZLFFBQS9CLEFBQStCLEFBQVEsV0FDbEMsQUFDRDsrQkFBQSxBQUFXLEFBQ1g7NEJBQUEsQUFBUSxBQUNYO0FBQ0o7QUFORCxtQkFNTyxJQUFBLEFBQUcsVUFBVSxRQUFiLEFBQWEsQUFBUSxxQkFDbkIsQUFBUyxPQUFULEFBQWdCLFdBQWhCLEFBQ0ksS0FBSyxlQUFPLEFBQUU7d0JBQUEsQUFBUSxBQUFNO0FBRGhDLEFBRVosYUFGWTtBQVJiLEFBQU8sQUFXVixTQVhVO0FBRGQsQUFBTyxBQUFZLEFBYW5CLEtBYm1CLENBQVo7QUFGRDs7QUFpQlA7Ozs7Ozs7O0FBUU8sSUFBTSwwRUFBaUMsU0FBakMsQUFBaUMsc0NBQUE7V0FBUyxDQUFBLEFBQUMsU0FBRCxBQUFVLFVBQVUsT0FBTyx3QkFBQSxBQUFZLFVBQVUscUJBQXRCLEFBQXNCLEFBQVMsVUFBVSxtQkFBN0UsQUFBUyxBQUFvQixBQUFnRCxBQUFPO0FBQTNIOzs7Ozs7Ozs7QUN4UVA7O0FBQ0E7O0FBRUEsSUFBTSxhQUFhLFNBQWIsQUFBYSxrQkFBQTtXQUFTLENBQUMsdUJBQUQsQUFBQyxBQUFXLFVBQVUsa0NBQUEsQUFBc0IsV0FBckQsQUFBZ0U7QUFBbkY7O0FBRUEsSUFBTSwwQkFBMEIsU0FBMUIsQUFBMEIsd0JBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjtpQkFBaUIsQUFBTSxXQUFOLEFBQWlCLE9BQU8scUJBQUE7ZUFBYSxVQUFBLEFBQVUsU0FBdkIsQUFBZ0M7QUFBeEQsS0FBQSxFQUFBLEFBQThELEdBQS9FLEFBQWtGO0FBQWxIOztBQUVBLElBQU0sbUJBQW1CLFNBQW5CLEFBQW1CLHdCQUFBO1dBQVMsaUJBQUE7ZUFBUyxXQUFBLEFBQVcsZ0JBQVMsQUFBTSxPQUFOLEFBQWEsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sTUFBQSxBQUFNLEtBQUssTUFBakIsQUFBTSxBQUFpQixRQUF4QyxBQUFnRDtBQUFwRSxTQUFBLEVBQTdCLEFBQTZCLEFBQTBFO0FBQWhIO0FBQXpCOztBQUVBLElBQU0sbUJBQW1CLFNBQW5CLEFBQW1CLGlCQUFBLEFBQUMsTUFBRCxBQUFPLFNBQVA7V0FBbUIsaUJBQUE7ZUFBUyxXQUFBLEFBQVcsVUFBVSxNQUFBLEFBQU0sT0FBTixBQUFhLE9BQU8sUUFBUSx3QkFBQSxBQUF3QixPQUFwRCxBQUFvQixBQUFRLEFBQStCLFFBQXpGLEFBQThCLEFBQW1FO0FBQXBIO0FBQXpCOzs7Y0FHYyx5QkFBQTtlQUFTLGtDQUFBLEFBQXNCLFdBQS9CLEFBQTBDO0FBRHpDLEFBRVg7V0FBTyw0QkFGSSxBQUdYO1NBQUssNEJBSE0sQUFJWDtVQUFNLHFCQUFBO2VBQVMsV0FBQSxBQUFXLGdCQUFTLEFBQU0sT0FBTixBQUFhLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLENBQUMsY0FBQSxBQUFjLEtBQUssSUFBQSxBQUFJLEtBQUssTUFBVCxBQUFlLE9BQXpDLEFBQU8sQUFBbUIsQUFBc0IsYUFBakUsQUFBOEU7QUFBbEcsU0FBQSxFQUE3QixBQUE2QixBQUF3RztBQUpoSSxBQUtYO2FBQVMsNEJBTEUsQUFNWDtZQUFRLDRCQU5HLEFBT1g7WUFBUSw0QkFQRyxBQVFYO2dDQUFXLEFBQ1AsYUFDQSxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxNQUFBLEFBQU0sUUFBUSxNQUFkLEFBQW9CLFNBQVMsTUFBQSxBQUFNLE1BQU4sQUFBWSxVQUFVLENBQUMsT0FBcEQsQUFBMkQsTUFBTSxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQS9GLEFBQXNHLEtBQXZILEFBQTRIO0FBQXRJO0FBVk8sQUFRQSxBQUlYLEtBSlc7Z0NBSUEsQUFDUCxhQUNBLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLE1BQUEsQUFBTSxRQUFRLE1BQWQsQUFBb0IsU0FBUyxNQUFBLEFBQU0sTUFBTixBQUFZLFVBQVUsQ0FBQyxPQUFwRCxBQUEyRCxNQUFNLENBQUMsTUFBQSxBQUFNLE1BQVAsQUFBYSxVQUFVLENBQUMsT0FBL0YsQUFBc0csS0FBdkgsQUFBNEg7QUFBdEk7QUFkTyxBQVlBLEFBSVgsS0FKVzs4QkFJRixBQUFpQixXQUFXLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQzNEO21CQUFPLGFBQU0sQUFBTyxNQUFQLEFBQWEsT0FBTyxVQUFBLEFBQUMsYUFBRCxBQUFjLFVBQWEsQUFDeEQ7b0JBQUcsa0NBQUEsQUFBc0IsY0FBYyxNQUF2QyxBQUE2QyxPQUFPLGNBQUEsQUFBYyxBQUNsRTt1QkFBQSxBQUFPLEFBQ1Y7QUFIWSxhQUFBLEVBQU4sQUFBTSxBQUdWLE9BSEgsQUFHVSxBQUNiO0FBTG9DO0FBaEIxQixBQWdCRixBQU1ULEtBTlM7OEJBTUEsQUFBaUIsV0FBVyxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxPQUFPLE9BQVAsQUFBYyxPQUFkLEFBQXFCLEtBQUssTUFBaEMsQUFBTSxBQUFnQyxRQUF2RCxBQUErRDtBQUF6RTtBQXRCMUIsQUFzQkYsQUFDVCxLQURTOzRCQUNGLEFBQWlCLFNBQVMsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sT0FBTyxPQUFQLEFBQWMsT0FBZCxBQUFxQixLQUFLLE1BQWhDLEFBQU0sQUFBZ0MsUUFBdkQsQUFBK0Q7QUFBekU7QUF2QnRCLEFBdUJKLEFBQ1AsS0FETzswQkFDRixBQUFpQixPQUFPLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxPQUF2QixBQUE4QixLQUEvQyxBQUFvRDtBQUE5RDtBQXhCbEIsQUF3Qk4sQUFDTCxLQURLOzBCQUNBLEFBQWlCLE9BQU8sa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQXZCLEFBQThCLEtBQS9DLEFBQW9EO0FBQTlEO0FBekJsQixBQXlCTixBQUNMLEtBREs7NkJBQ0csQUFBaUIsVUFBVSxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTyxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQXhCLEFBQStCLFFBQVEsT0FBQSxBQUFPLFFBQVAsQUFBZSxhQUFhLENBQUMsTUFBQSxBQUFNLE1BQVAsQUFBYSxVQUFVLENBQUMsT0FBbEcsQUFBTyxBQUFrRyxNQUExSCxBQUFpSTtBQUEzSTtBQTFCeEIsQUEwQkgsQUFDUixLQURROzRCQUNELEFBQWlCLFNBQVMsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU8sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQWpCLEFBQXdCLE9BQU8sQ0FBQyxNQUFELEFBQU8sU0FBUyxDQUFDLE9BQXZELEFBQThELEtBQS9FLEFBQXFGO0FBQS9GO0FBM0J0QixBQTJCSixBQUNQLEtBRE87WUFDQyxnQkFBQSxBQUFDLE9BQUQsQUFBUSxRQUFSO21CQUFtQixBQUFJLFFBQVEsVUFBQSxBQUFDLFNBQUQsQUFBVSxRQUFXLEFBQ3hEOzhCQUFPLE9BQUEsQUFBTyxTQUFQLEFBQWdCLFFBQVEsT0FBeEIsQUFBK0IsTUFBUyxPQUF4QyxBQUErQyxZQUFPLDZCQUFpQixPQUE5RSxBQUE2RCxBQUF3Qjt3QkFDekUsT0FBQSxBQUFPLEtBRHdGLEFBQy9GLEFBQVksQUFDcEI7c0JBQU0sT0FBQSxBQUFPLFNBQVAsQUFBZ0IsUUFBaEIsQUFBd0IsT0FBTyw2QkFBaUIsT0FGaUQsQUFFbEUsQUFBd0IsQUFDN0Q7NkJBQVMsQUFBSTtvQ0FIakIsQUFBMkcsQUFHOUYsQUFBWSxBQUNEO0FBREMsQUFDakIsaUJBREs7QUFIOEYsQUFDdkcsZUFESixBQU9DLEtBQUssZUFBQTt1QkFBTyxJQUFQLEFBQU8sQUFBSTtBQVBqQixlQUFBLEFBUUMsS0FBSyxnQkFBUSxBQUFFO3dCQUFBLEFBQVEsQUFBUTtBQVJoQyxlQUFBLEFBU0MsTUFBTSxlQUFPLEFBQUU7MkNBQUEsQUFBeUIsQUFBUztBQVRsRCxBQVVIO0FBWE8sQUFBbUIsU0FBQTtBQTVCaEIsQUF3Q1g7WUFBUSxnQkFBQSxBQUFDLFFBQUQsQUFBUyxPQUFUO2VBQW1CLFdBQUEsQUFBVyxVQUFTLE9BQU8sa0NBQVAsQUFBTyxBQUFzQixRQUFRLE1BQTVFLEFBQXVDLEFBQTJDO0EsQUF4Qy9FO0FBQUEsQUFDWDs7Ozs7Ozs7QUNaRyxJQUFNLG9DQUFjLFNBQWQsQUFBYyxtQkFBQTtBQUFVLFdBQUQsbUJBQUEsQUFBb0IsS0FBSyxNQUFsQyxBQUFTLEFBQStCOztBQUE1RDs7QUFFQSxJQUFNLDBCQUFTLFNBQVQsQUFBUyxjQUFBO1dBQVMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsWUFBNUIsQUFBd0M7QUFBdkQ7O0FBRUEsSUFBTSw4QkFBVyxTQUFYLEFBQVcsZ0JBQUE7V0FBUyxNQUFBLEFBQU0sU0FBTixBQUFlLGtCQUF4QixBQUEwQztBQUEzRDs7QUFFQSxJQUFNLGtDQUFhLFNBQWIsQUFBYSxrQkFBQTtpQkFBUyxBQUFNLFdBQU4sQUFBaUIsT0FBTyxxQkFBQTtlQUFhLFVBQUEsQUFBVSxTQUF2QixBQUFnQztBQUF4RCxLQUFBLEVBQUEsQUFBb0UsU0FBN0UsQUFBc0Y7QUFBekc7O0FBRVAsSUFBTSxXQUFXLFNBQVgsQUFBVyxnQkFBQTtXQUFVLE1BQUEsQUFBTSxVQUFOLEFBQWdCLGFBQWEsTUFBQSxBQUFNLFVBQW5DLEFBQTZDLFFBQVEsTUFBQSxBQUFNLE1BQU4sQUFBWSxTQUEzRSxBQUFvRjtBQUFyRzs7QUFFTyxJQUFNLGdEQUFvQixTQUFwQixBQUFvQixrQkFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQzdDO1FBQUcsQ0FBQyxZQUFELEFBQUMsQUFBWSxVQUFVLFNBQTFCLEFBQTBCLEFBQVMsUUFBUSxNQUFNLE1BQU4sQUFBWSxBQUN2RDtRQUFHLFlBQUEsQUFBWSxVQUFVLE1BQXpCLEFBQStCLFNBQVMsQUFDcEM7WUFBRyxNQUFBLEFBQU0sUUFBVCxBQUFHLEFBQWMsTUFBTSxJQUFBLEFBQUksS0FBSyxNQUFoQyxBQUF1QixBQUFlLFlBQ2pDLE1BQU0sQ0FBQyxNQUFQLEFBQU0sQUFBTyxBQUNyQjtBQUNEO1dBQUEsQUFBTyxBQUNWO0FBUE07O0FBU0EsSUFBTSw4Q0FBbUIsU0FBbkIsQUFBbUIsNkJBQUE7c0JBQWMsQUFBVyxJQUFJLFVBQUEsQUFBQyxPQUFVLEFBQ3BFO2VBQVUsTUFBQSxBQUFNLEdBQU4sQUFBUyxhQUFuQixBQUFVLEFBQXNCLGdCQUFXLHNCQUEzQyxBQUEyQyxBQUFzQixBQUNwRTtBQUY2QyxLQUFBLEVBQUEsQUFFM0MsS0FGNkIsQUFBYyxBQUV0QztBQUZEOztBQUlBLElBQU0sd0RBQXdCLFNBQXhCLEFBQXdCLHNCQUFBLEFBQUMsTUFBRCxBQUFPLE9BQVA7Z0JBQWlCLEFBQUssTUFBTCxBQUFXLEtBQVgsQUFDTCxJQUFJLGdCQUFRLEFBQ1Q7WUFBSSxtQkFBbUIscUJBQXFCLGtCQUFBLEFBQWtCLE1BQU0sZUFBZSxNQUFBLEFBQU0sYUFBekYsQUFBdUIsQUFBcUIsQUFBd0IsQUFBZSxBQUFtQixBQUN0RztlQUFPLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsNEJBQVQsQUFBbUMsbUJBQXhELEFBQU8sQUFDVjtBQUpaLEFBQWlCLEtBQUE7QUFBL0M7O0FBTVAsSUFBTSx1QkFBdUIsU0FBdkIsQUFBdUIsNEJBQUE7V0FBUyxNQUFBLEFBQU0sUUFBTixBQUFjLDBDQUF2QixBQUFTLEFBQXdEO0FBQTlGOztBQUVBLElBQU0saUJBQWlCLFNBQWpCLEFBQWlCLDBCQUFBO1dBQWEsVUFBQSxBQUFVLE9BQVYsQUFBaUIsR0FBRyxVQUFBLEFBQVUsWUFBVixBQUFzQixPQUF2RCxBQUFhLEFBQWlEO0FBQXJGOztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLEFBQW9CLGtCQUFBLEFBQUMsT0FBRCxBQUFRLFFBQVcsQUFDekM7UUFBSSxNQUFBLEFBQU0sUUFBTixBQUFjLFVBQWxCLEFBQTRCLEdBQUcsUUFBUSxNQUFBLEFBQU0sUUFBTixBQUFjLE1BQXRCLEFBQVEsQUFBb0IsQUFDM0Q7V0FBQSxBQUFPLEFBQ1Y7QUFIRDs7QUFLTyxJQUFNLHNCQUFPLFNBQVAsQUFBTyxPQUFBO3NDQUFBLEFBQUksa0RBQUE7QUFBSiw4QkFBQTtBQUFBOztlQUFZLEFBQUksT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLElBQU47ZUFBYSxHQUFiLEFBQWEsQUFBRztBQUF2QyxBQUFZLEtBQUE7QUFBekI7O0FBR0EsSUFBTSx3REFBd0IsU0FBeEIsQUFBd0IsNkJBQUE7V0FBUyxNQUFBLEFBQU0sZUFBTixBQUFxQixZQUNyQixNQUFBLEFBQU0sT0FBTixBQUFhLE9BQWIsQUFBb0IsbUJBRHBCLEFBQ0EsQUFBdUMsTUFDdkMsTUFBQSxBQUFNLE9BQU4sQUFBYSxtQkFGdEIsQUFFUyxBQUFnQztBQUZ2RTs7QUFJQSxJQUFNLHdCQUFRLFNBQVIsQUFBUSxNQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDakM7ZUFBTyxBQUFJLFFBQVEsVUFBQSxBQUFDLFNBQUQsQUFBVSxRQUFXLEFBQ3BDO1lBQUksTUFBTSxJQUFWLEFBQVUsQUFBSSxBQUNkO1lBQUEsQUFBSSxLQUFLLE1BQUEsQUFBTSxVQUFmLEFBQXlCLE9BQXpCLEFBQWdDLEFBQ2hDO1lBQUksTUFBSixBQUFVLFNBQVMsQUFDZjttQkFBQSxBQUFPLEtBQUssTUFBWixBQUFrQixTQUFsQixBQUEyQixRQUFRLGVBQU8sQUFDdEM7b0JBQUEsQUFBSSxpQkFBSixBQUFxQixLQUFLLE1BQUEsQUFBTSxRQUFoQyxBQUEwQixBQUFjLEFBQzNDO0FBRkQsQUFHSDtBQUNEO1lBQUEsQUFBSSxTQUFTLFlBQU0sQUFDZjtnQkFBSSxJQUFBLEFBQUksVUFBSixBQUFjLE9BQU8sSUFBQSxBQUFJLFNBQTdCLEFBQXNDLEtBQUssUUFBUSxJQUFuRCxBQUEyQyxBQUFZLGVBQ2xELE9BQU8sSUFBUCxBQUFXLEFBQ25CO0FBSEQsQUFJQTtZQUFBLEFBQUksVUFBVSxZQUFBO21CQUFNLE9BQU8sSUFBYixBQUFNLEFBQVc7QUFBL0IsQUFDQTtZQUFBLEFBQUksS0FBSyxNQUFULEFBQWUsQUFDbEI7QUFkRCxBQUFPLEFBZVYsS0FmVTtBQURKOzs7OztBQzdDUDs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO0FBRUE7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBckJELEFBQWdDLENBQUE7O0FBdUJoQyxBQUFFOzRCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7ZUFBQSxBQUFRO0FBQXhDLEFBQWdEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZmFjdG9yeSBmcm9tICcuL2xpYic7XG5cbmNvbnN0IGluaXQgPSAoY2FuZGlkYXRlLCBvcHRzKSA9PiB7XG5cdGxldCBlbHM7XG5cdFxuXHQvL2lmIHdlIHRoaW5rIGNhbmRpZGF0ZSBpcyBhIGZvcm0gRE9NIG5vZGUsIHBhc3MgaXQgaW4gYW4gQXJyYXlcblx0Ly9vdGhlcndpc2UgY29udmVydCBjYW5kaWRhdGUgdG8gYW4gYXJyYXkgb2YgTm9kZXMgdXNpbmcgaXQgYXMgYSBET00gcXVlcnkgXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuXHRcblx0Ly8gaWYoZWxzLmxlbmd0aCA9PT0gMSAmJiB3aW5kb3cuX192YWxpZGF0b3JzX18gJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV0pIHJldHVybiB3aW5kb3cuX192YWxpZGF0b3JzX19bZWxzWzBdXTtcblx0XG5cdC8vcmV0dXJuIGluc3RhbmNlIGlmIG9uZSBleGlzdHMgZm9yIGNhbmRpZGF0ZSBwYXNzZWQgdG8gaW5pdFxuXHQvL2lmIGluaXRpdGlhbGlzZWQgdXNpbmcgU3Rvcm1WYWlkYXRpb24uaW5pdCh7c2VsfSkgdGhlIGluc3RhbmNlIGFscmVhZHkgZXhpc3RzIHRoYW5rcyB0byBhdXRvLWluaXRcblx0Ly9idXQgcmVmZXJlbmNlIG1heSBiZSB3YW50ZWQgZm9yIGludm9raW5nIEFQSSBtZXRob2RzXG5cdC8vYWxzbyBmb3IgcmVwZWF0IGluaXRpYWxpc2F0aW9uc1xuXHRyZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fID0gT2JqZWN0LmFzc2lnbih7fSwgd2luZG93Ll9fdmFsaWRhdG9yc19fLCBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0XHRpZihlbC5oYXNBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnKSkgcmV0dXJuIGFjYztcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuY3JlYXRlKGZhY3RvcnkoZWwsIG9wdHMpKTtcblx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyk7XG5cdFx0XHRyZXR1cm4gIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBcblx0XHRcdGlmKGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtdmFsPXRydWVdJykgJiYgIWZvcm0uaGFzQXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIGluaXQoZm9ybSk7XG5cdFx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIEVOVEVSOiAxM1xufTtcblxuZXhwb3J0IGNvbnN0IEFDVElPTlMgPSB7XG4gICAgU0VUX0lOSVRJQUxfU1RBVEU6ICdTRVRfSU5JVElBTF9TVEFURScsXG4gICAgQ0xFQVJfRVJST1JTOiAnQ0xFQVJfRVJST1JTJyxcbiAgICBWQUxJREFUSU9OX0VSUk9SUzogJ1ZBTElEQVRJT05fRVJST1JTJyxcbiAgICBWQUxJREFUSU9OX0VSUk9SOiAnVkFMSURBVElPTl9FUlJPUicsXG4gICAgQ0xFQVJfRVJST1I6ICdDTEVBUl9FUlJPUicsXG4gICAgQUREX1ZBTElEQVRJT05fTUVUSE9EOiAnQUREX1ZBTElEQVRJT05fTUVUSE9EJ1xufTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG4vL2RhdGEtYXR0cmlidXRlIGFkZGVkIHRvIGVycm9yIG1lc3NhZ2Ugc3BhbiBjcmVhdGVkIGJ5IC5ORVQgTVZDXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuLy92YWxpZGF0b3IgcGFyYW1ldGVycyB0aGF0IHJlcXVpcmUgRE9NIGxvb2t1cFxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLy8uTkVUIE1WQyB2YWxpZGF0b3IgZGF0YS1hdHRyaWJ1dGUgcGFyYW1ldGVycyBpbmRleGVkIGJ5IHRoZWlyIHZhbGlkYXRvcnNcbi8vZS5nLiA8aW5wdXQgZGF0YS12YWwtbGVuZ3RoPVwiRXJyb3IgbWVzc2dlXCIgZGF0YS12YWwtbGVuZ3RoLW1pbj1cIjhcIiBkYXRhLXZhbC1sZW5ndGgtbWF4PVwiMTBcIiB0eXBlPVwidGV4dFwiLi4uIC8+XG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbGVuZ3RoLW1pbicsICdsZW5ndGgtbWF4J10sXG4gICAgc3RyaW5nbGVuZ3RoOiBbJ2xlbmd0aC1tYXgnXSxcbiAgICByYW5nZTogWydyYW5nZS1taW4nLCAncmFuZ2UtbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWlubGVuZ3RoLW1pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXhsZW5ndGgtbWF4J10sXG4gICAgcmVnZXg6IFsncmVnZXgtcGF0dGVybiddLFxuICAgIGVxdWFsdG86IFsnZXF1YWx0by1vdGhlciddLFxuICAgIHJlbW90ZTogWydyZW1vdGUtdXJsJywgJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ3JlbW90ZS10eXBlJ10vLz8/XG59O1xuXG4vLy5ORVQgTVZDIGRhdGEtYXR0cmlidXRlcyB0aGF0IGlkZW50aWZ5IHZhbGlkYXRvcnNcbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTtcblxuLy9jbGFzc05hbWVzIGFkZGVkL3VwZGF0ZWQgb24gLk5FVCBNVkMgZXJyb3IgbWVzc2FnZSBzcGFuXG5leHBvcnQgY29uc3QgRE9UTkVUX0NMQVNTTkFNRVMgPSB7XG4gICAgVkFMSUQ6ICdmaWVsZC12YWxpZGF0aW9uLXZhbGlkJyxcbiAgICBFUlJPUjogJ2ZpZWxkLXZhbGlkYXRpb24tZXJyb3InXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfVxufTsiLCJpbXBvcnQgeyBET1RORVRfQ0xBU1NOQU1FUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vVHJhY2sgZXJyb3IgbWVzc2FnZSBET00gbm9kZXMgaW4gbG9jYWwgc2NvcGVcbmxldCBlcnJvck5vZGVzID0ge307XG5cbi8qKlxuICogSHlwZXJ0ZXh0IERPTSBmYWN0b3J5IGZ1bmN0aW9uXG4gKiBcbiAqIEBwYXJhbSBub2RlTmFtZSBbU3RyaW5nXVxuICogQHBhcmFtIGF0dHJpYnV0ZXMgW09iamVjdF1cbiAqIEBwYXJhbSB0ZXh0IFtTdHJpbmddIFRoZSBpbm5lclRleHQgb2YgdGhlIG5ldyBub2RlXG4gKiBcbiAqIEByZXR1cm5zIG5vZGUgW0RPTSBub2RlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xuICAgIH1cbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW5kIGFwcGVuZHMgYSB0ZXh0IG5vZGUgZXJyb3IgbWVzc2FnZSB0byBhICBlcnJvciBjb250YWluZXIgRE9NIG5vZGUgZm9yIGEgZ3JvdXBcbiAqIFxuICogQHBhcmFtIGdyb3VwIFtPYmplY3QsIHZhaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gbXNnIFtTdHJpbmddIFRoZSBlcnJvciBtZXNzYWdlXG4gKiBcbiAqIEByZXR1cm5zIG5vZGUgW1RleHQgbm9kZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IChncm91cCwgbXNnKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtc2cpO1xuXG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICBcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBlcnJvciBtZXNzYWdlIERPTSBub2RlLCB1cGRhdGVzIC5ORVQgTVZDIGVycm9yIHNwYW4gY2xhc3NOYW1lcyBhbmQgZGVsZXRlcyB0aGUgXG4gKiBlcnJvciBmcm9tIGxvY2FsIGVycm9yTm9kZXMgdHJhY2tpbmcgb2JqZWN0XG4gKiBcbiAqIFNpZ25hdHVyZSAoKSA9PiBncm91cE5hbWUgPT4gc3RhdGUgPT4ge31cbiAqIChDdXJyaWVkIGdyb3VwTmFtZSBmb3IgZWFzZSBvZiB1c2UgYXMgZXZlbnRMaXN0ZW5lciBhbmQgaW4gd2hvbGUgZm9ybSBpdGVyYXRpb24pXG4gKiBcbiAqIEBwYXJhbSBncm91cE5hbWUgW1N0cmluZywgdmFpZGF0aW9uIGdyb3VwXSBcbiAqIEBwYXJhbSBzdGF0ZSBbT2JqZWN0LCB2YWxpZGF0aW9uIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhckVycm9yID0gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHtcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlcnJvck5vZGVzW2dyb3VwTmFtZV0pO1xuICAgIGlmKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSkge1xuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICB9XG4gICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goZmllbGQgPT4geyBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpOyB9KTtcbiAgICBkZWxldGUgZXJyb3JOb2Rlc1tncm91cE5hbWVdO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBlcnJvck5vZGVzIGluIGxvY2FsIHNjb3BlIHRvIHJlbW92ZSBlYWNoIGVycm9yIHByaW9yIHRvIHJlLXZhbGlkYXRpb25cbiAqIFxuICogQHBhcmFtIHN0YXRlIFtPYmplY3QsIHZhbGlkYXRpb24gc3RhdGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3JzID0gc3RhdGUgPT4ge1xuICAgIE9iamVjdC5rZXlzKGVycm9yTm9kZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGNsZWFyRXJyb3IobmFtZSkoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBncm91cHMgdG8gcmVuZGVyIGVhY2ggZXJyb3IgcG9zdC12YWlkYXRpb25cbiAqIFxuICogQHBhcmFtIHN0YXRlIFtPYmplY3QsIHZhbGlkYXRpb24gc3RhdGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLmZvckVhY2goZ3JvdXBOYW1lID0+IHtcbiAgICAgICAgaWYoIXN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSByZW5kZXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICB9KVxufTtcblxuLyoqXG4gKiBBZGRzIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIERPTSBhbmQgc2F2ZXMgaXQgdG8gbG9jYWwgc2NvcGVcbiAqIFxuICogSWYgLk5FVCBNVkMgZXJyb3Igc3BhbiBpcyBwcmVzZW50LCBpdCBpcyB1c2VkIHdpdGggYSBhcHBlbmRlZCB0ZXh0Tm9kZSxcbiAqIGlmIG5vdCBhIG5ldyBET00gbm9kZSBpcyBjcmVhdGVkXG4gKiBcbiAqIFNpZ25hdHVyZSAoKSA9PiBncm91cE5hbWUgPT4gc3RhdGUgPT4ge31cbiAqIChDdXJyaWVkIGdyb3VwTmFtZSBmb3IgZWFzZSBvZiB1c2UgYXMgZXZlbnRMaXN0ZW5lciBhbmQgaW4gd2hvbGUgZm9ybSBpdGVyYXRpb24pXG4gKiBcbiAqIEBwYXJhbSBncm91cE5hbWUgW1N0cmluZywgdmFsaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGlmKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSkgY2xlYXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICBcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0gPSBcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlIFxuICAgICAgICAgICAgICAgID8gY3JlYXRlRXJyb3JUZXh0Tm9kZShzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXSwgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkgXG4gICAgICAgICAgICAgICAgOiBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZHNbc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcdFx0XHRcdFxuXHRzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IFxuICAgICAgICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFNldCBmb2N1cyBvbiBmaXJzdCBpbnZhbGlkIGZpZWxkIGFmdGVyIGZvcm0tbGV2ZWwgdmFsaWRhdGUoKVxuICogXG4gKiBXZSBjYW4gYXNzdW1lIHRoYXQgdGhlcmUgaXMgYSBncm91cCBpbiBhbiBpbnZhbGlkIHN0YXRlLFxuICogYW5kIHRoYXQgdGhlIGdyb3VwIGhhcyBhdCBsZWFzdCBvbmUgZmllbGRcbiAqIFxuICogQHBhcmFtIGdyb3VwcyBbT2JqZWN0LCB2YWxpZGF0aW9uIGdyb3VwIHNsaWNlIG9mIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBmb2N1c0ZpcnN0SW52YWxpZEZpZWxkID0gZ3JvdXBzID0+IHtcbiAgICBncm91cHNbT2JqZWN0LmtleXMoZ3JvdXBzKVxuICAgICAgICAuZmlsdGVyKGdyb3VwID0+ICFncm91cC52YWxpZClbMF1dXG4gICAgICAgIC5maWVsZHNbMF1cbiAgICAgICAgLmZvY3VzKCk7XG59OyIsImltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCB7IEFDVElPTlMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBcbiAgICBnZXRJbml0aWFsU3RhdGUsXG4gICAgZ2V0VmFsaWRpdHlTdGF0ZSxcbiAgICBnZXRHcm91cFZhbGlkaXR5U3RhdGUsXG4gICAgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLFxuICAgIHJlc29sdmVSZWFsVGltZVZhbGlkYXRpb25FdmVudCxcbiAgICByZWR1Y2VFcnJvck1lc3NhZ2VzXG59IGZyb20gJy4vdmFsaWRhdG9yJztcbmltcG9ydCB7XG4gICAgY2xlYXJFcnJvcnMsXG4gICAgY2xlYXJFcnJvcixcbiAgICByZW5kZXJFcnJvcixcbiAgICByZW5kZXJFcnJvcnMsXG4gICAgZm9jdXNGaXJzdEludmFsaWRGaWVsZFxufSAgZnJvbSAnLi9kb20nO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZSB2YWxpZGl0eVN0YXRlIG9mIHRoZSBlbnRpcmUgZm9ybVxuICogY2FuIGJlIHVzZWQgYXMgYSBmb3JtIHN1Ym1pdCBldmVudExpc3RlbmVyIG9yIHZpYSB0aGUgQVBJXG4gKiBcbiAqIFN1Ym1pdHMgdGhlIGZvcm0gaWYgY2FsbGVkIGFzIGEgc3VibWl0IGV2ZW50TGlzdGVuZXIgYW5kIGlzIHZhbGlkXG4gKiBEaXNwYXRjaGVzIGVycm9yIHN0YXRlIHRvIFN0b3JlIGlmIGVycm9yc1xuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm5zIFtib29sZWFuXSBUaGUgdmFsaWRpdHkgc3RhdGUgb2YgdGhlIGZvcm1cbiAqIFxuICovXG5jb25zdCB2YWxpZGF0ZSA9IGZvcm0gPT4gZSA9PiB7XG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5DTEVBUl9FUlJPUlMsIG51bGwsIFtjbGVhckVycm9yc10pO1xuXG4gICAgZ2V0VmFsaWRpdHlTdGF0ZShTdG9yZS5nZXRTdGF0ZSgpLmdyb3VwcylcbiAgICAgICAgLnRoZW4odmFsaWRpdHlTdGF0ZSA9PiB7XG4gICAgICAgICAgICBpZihbXS5jb25jYXQoLi4udmFsaWRpdHlTdGF0ZSkucmVkdWNlKHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSwgdHJ1ZSkpe1xuICAgICAgICAgICAgICAgIGlmKGUgJiYgZS50YXJnZXQpIGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU3RvcmUuZ2V0U3RhdGUoKS5yZWFsVGltZVZhbGlkYXRpb24gPT09IGZhbHNlICYmIHN0YXJ0UmVhbFRpbWVWYWxpZGF0aW9uKCk7XG5cbiAgICAgICAgICAgIGZvY3VzRmlyc3RJbnZhbGlkRmllbGQoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpO1xuXG4gICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICBBQ1RJT05TLlZBTElEQVRJT05fRVJST1JTLFxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKFN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIGdyb3VwLCBpKSA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NbZ3JvdXBdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiB2YWxpZGl0eVN0YXRlW2ldLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHZhbGlkaXR5U3RhdGVbaV0ucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXAsIFN0b3JlLmdldFN0YXRlKCkpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbiAgICAgICAgICAgICAgICAgICAgfSwge30pLFxuICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcnNdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xufTtcblxuLyoqXG4gKiBBZGRzIGEgY3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIHRvIHRoZSB2YWxpZGF0aW9uIG1vZGVsLCB1c2VkIHZpYSB0aGUgQVBJXG4gKiBEaXNwYXRjaGVzIGFkZCB2YWxpZGF0aW9uIG1ldGhvZCB0byBzdG9yZSB0byB1cGRhdGUgdGhlIHZhbGlkYXRvcnMgaW4gYSBncm91cFxuICogXG4gKiBAcGFyYW0gZ3JvdXBOYW1lIFtTdHJpbmddIFRoZSBuYW1lIGF0dHJpYnV0ZSBzaGFyZWQgYnkgdGhlIERPbSBub2RlcyBpbiB0aGUgZ3JvdXBcbiAqIEBwYXJhbSBtZXRob2QgW0Z1bmN0aW9uXSBUaGUgdmFsaWRhdGlvbiBtZXRob2QgKGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIG9yIGZhbHNlKSB0aGF0IHVzIGNhbGxlZCBvbiB0aGUgZ3JvdXBcbiAqIEBwYXJhbSBtZXNzYWdlIFtTdHJpbmddIFRlIGVycm9yIG1lc3NhZ2UgZGlzcGxheWVkIGlmIHRoZSB2YWxpZGF0aW9uIG1ldGhvZCByZXR1cm5zIGZhbHNlXG4gKiBcbiAqL1xuY29uc3QgYWRkTWV0aG9kID0gKGdyb3VwTmFtZSwgbWV0aG9kLCBtZXNzYWdlKSA9PiB7XG4gICAgaWYoKGdyb3VwTmFtZSA9PT0gdW5kZWZpbmVkIHx8IG1ldGhvZCA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgfHwgIVN0b3JlLmdldFN0YXRlKClbZ3JvdXBOYW1lXSAmJiBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShncm91cE5hbWUpLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ3VzdG9tIHZhbGlkYXRpb24gbWV0aG9kIGNhbm5vdCBiZSBhZGRlZC4nKTtcblxuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuQUREX1ZBTElEQVRJT05fTUVUSE9ELCB7Z3JvdXBOYW1lLCB2YWxpZGF0b3I6IHt0eXBlOiAnY3VzdG9tJywgbWV0aG9kLCBtZXNzYWdlfX0pO1xufTtcblxuXG4vKipcbiAqIFN0YXJ0cyByZWFsLXRpbWUgdmFsaWRhdGlvbiBvbiBlYWNoIGdyb3VwLCBhZGRpbmcgYW4gZXZlbnRMaXN0ZW5lciB0byBlYWNoIGZpZWxkIFxuICogdGhhdCByZXNldHMgdGhlIHZhbGlkaXR5U3RhdGUgZm9yIHRoZSBmaWVsZCdzIGdyb3VwIGFuZCBhY3F1aXJlcyB0aGUgbmV3IHZhbGlkaXR5IHN0YXRlXG4gKiBcbiAqIFRoZSBldmVudCB0aGF0IHRyaWdnZXJzIHZhbGlkYXRpb24gaXMgZGVmaW5lZCBieSB0aGUgZmllbGQgdHlwZVxuICogXG4gKiBPbmx5IGlmIHRoZSBuZXcgdmFsaWRpdHlTdGF0ZSBpcyBpbnZhbGlkIGlzIHRoZSB2YWxpZGF0aW9uIGVycm9yIG9iamVjdCBcbiAqIGRpc3BhdGNoZWQgdG8gdGhlIHN0b3JlIHRvIHVwZGF0ZSBzdGF0ZSBhbmQgcmVuZGVyIHRoZSBlcnJvclxuICogXG4gKi9cbmNvbnN0IHN0YXJ0UmVhbFRpbWVWYWxpZGF0aW9uID0gKCkgPT4ge1xuICAgIGxldCBoYW5kbGVyID0gZ3JvdXBOYW1lID0+ICgpID0+IHtcbiAgICAgICAgaWYoIVN0b3JlLmdldFN0YXRlKCkuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWQpIHtcbiAgICAgICAgICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuQ0xFQVJfRVJST1IsIGdyb3VwTmFtZSwgW2NsZWFyRXJyb3IoZ3JvdXBOYW1lKV0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXRHcm91cFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIXJlcy5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBQ1RJT05TLlZBTElEQVRJT05fRVJST1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cDogZ3JvdXBOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiByZXMucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXBOYW1lLCBTdG9yZS5nZXRTdGF0ZSgpKSwgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhTdG9yZS5nZXRTdGF0ZSgpLmdyb3VwcykuZm9yRWFjaChncm91cE5hbWUgPT4ge1xuICAgICAgICBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIocmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50KGlucHV0KSwgaGFuZGxlcihncm91cE5hbWUpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vO187IGNhbiBkbyBiZXR0ZXI/XG4gICAgICAgIGxldCBlcXVhbFRvVmFsaWRhdG9yID0gU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdlcXVhbHRvJyk7XG4gICAgICAgIFxuICAgICAgICBpZihlcXVhbFRvVmFsaWRhdG9yLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgZXF1YWxUb1ZhbGlkYXRvclswXS5wYXJhbXMub3RoZXIuZm9yRWFjaChzdWJncm91cCA9PiB7XG4gICAgICAgICAgICAgICAgc3ViZ3JvdXAuZm9yRWFjaChpdGVtID0+IHsgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlcihncm91cE5hbWUpKTsgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uLCBzZXRzIGluaXRpYWwgc3RhdGUgYW5kIGFkZHMgZm9ybS1sZXZlbCBldmVudCBsaXN0ZW5lcnNcbiAqIFxuICogQHBhcmFtIGZvcm0gW0RPTSBub2RlXSB0aGUgZm9ybSB0byB2YWxpZGF0ZVxuICogXG4gKiBAcmV0dXJucyBbT2JqZWN0XSBUaGUgQVBJIGZvciB0aGUgaW5zdGFuY2VcbiAqICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZm9ybSA9PiB7XG4gICAgU3RvcmUuZGlzcGF0Y2goQUNUSU9OUy5TRVRfSU5JVElBTF9TVEFURSwgKGdldEluaXRpYWxTdGF0ZShmb3JtKSkpO1xuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdmFsaWRhdGUoZm9ybSkpO1xuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCAoKSA9PiB7IFN0b3JlLnVwZGF0ZShVUERBVEVTLkNMRUFSX0VSUk9SUywgbnVsbCwgW2NsZWFyRXJyb3JzXSk7IH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWRhdGU6IHZhbGlkYXRlKGZvcm0pLFxuICAgICAgICBhZGRNZXRob2RcbiAgICB9XG59OyIsImltcG9ydCB7IEFDVElPTlMsIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBBbGwgc3RhdGUvbW9kZWwtbW9kaWZ5aW5nIG9wZXJhdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIFtBQ1RJT05TLlNFVF9JTklUSUFMX1NUQVRFXTogKHN0YXRlLCBkYXRhKSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgZGF0YSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JTXTogc3RhdGUgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgXG4gICAgICAgIGdyb3VwczogT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGFjY1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogW10sXG4gICAgICAgICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pXG4gICAgfSksXG4gICAgW0FDVElPTlMuQ0xFQVJfRVJST1JdOiAoc3RhdGUsIGRhdGEpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCB7XG4gICAgICAgICAgICBbZGF0YV06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tkYXRhXSwge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFtdLFxuICAgICAgICAgICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pLFxuICAgIFtBQ1RJT05TLkFERF9WQUxJREFUSU9OX01FVEhPRF06IChzdGF0ZSwgZGF0YSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgIFtkYXRhLmdyb3VwTmFtZV06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gPyBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdIDoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5ncm91cHNbZGF0YS5ncm91cE5hbWVdID8gIHsgdmFsaWRhdG9yczogWy4uLnN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0udmFsaWRhdG9ycywgZGF0YS52YWxpZGF0b3JdIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShkYXRhLmdyb3VwTmFtZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckVycm9yTm9kZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgWyR7RE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEV9PSR7ZGF0YS5ncm91cE5hbWV9XWApIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBbZGF0YS52YWxpZGF0b3JdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SU106IChzdGF0ZSwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIHJlYWxUaW1lVmFsaWRhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmtleXMoc3RhdGUuZ3JvdXBzKS5yZWR1Y2UoKGFjYywgZ3JvdXApID0+IHtcbiAgICAgICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2dyb3VwXSwgZGF0YVtncm91cF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SXTogKHN0YXRlLCBkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgZ3JvdXBzOiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHMsIHtcbiAgICAgICAgICAgICAgICBbZGF0YS5ncm91cF06IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwXSwge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBkYXRhLmVycm9yTWVzc2FnZXMsXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn07IiwiaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4uL3JlZHVjZXJzJztcbi8vc2hhcmVkIGNlbnRyYWxpc2VkIHZhbGlkYXRvciBzdGF0ZVxubGV0IHN0YXRlID0ge307XG5cbi8vdW5jb21tZW50IGZvciBkZWJ1Z2dpbmcgYnkgd3JpdGluZyBzdGF0ZSBoaXN0b3J5IHRvIHdpbmRvd1xuLy8gd2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXyA9IFtdO1xuXG4vL3N0YXRlIGdldHRlclxuY29uc3QgZ2V0U3RhdGUgPSAoKSA9PiBzdGF0ZTtcblxuLyoqXG4gKiBDcmVhdGUgbmV4dCBzdGF0ZSBieSBpbnZva2luZyByZWR1Y2VyIG9uIGN1cnJlbnQgc3RhdGVcbiAqIFxuICogRXhlY3V0ZSBzaWRlIGVmZmVjdHMgb2Ygc3RhdGUgdXBkYXRlLCBhcyBwYXNzZWQgaW4gdGhlIHVwZGF0ZVxuICogXG4gKiBAcGFyYW0gdHlwZSBbU3RyaW5nXSBcbiAqIEBwYXJhbSBuZXh0U3RhdGUgW09iamVjdF0gTmV3IHNsaWNlIG9mIHN0YXRlIHRvIGNvbWJpbmUgd2l0aCBjdXJyZW50IHN0YXRlIHRvIGNyZWF0ZSBuZXh0IHN0YXRlXG4gKiBAcGFyYW0gZWZmZWN0cyBbQXJyYXldIEFycmF5IG9mIGZ1bmN0aW9ucyB0byBpbnZva2UgYWZ0ZXIgc3RhdGUgdXBkYXRlIChET00sIG9wZXJhdGlvbnMsIGNtZHMuLi4pXG4gKi9cbmNvbnN0IGRpc3BhdGNoID0gZnVuY3Rpb24odHlwZSwgbmV4dFN0YXRlLCBlZmZlY3RzKSB7XG4gICAgc3RhdGUgPSBuZXh0U3RhdGUgPyByZWR1Y2Vyc1t0eXBlXShzdGF0ZSwgbmV4dFN0YXRlKSA6IHN0YXRlO1xuICAgIC8vdW5jb21tZW50IGZvciBkZWJ1Z2dpbmcgYnkgd3JpdGluZyBzdGF0ZSBoaXN0b3J5IHRvIHdpbmRvd1xuICAgIC8vIHdpbmRvdy5fX3ZhbGlkYXRvcl9oaXN0b3J5X18ucHVzaCh7W3R5cGVdOiBzdGF0ZX0pLCBjb25zb2xlLmxvZyh3aW5kb3cuX192YWxpZGF0b3JfaGlzdG9yeV9fKTtcbiAgICBpZighZWZmZWN0cykgcmV0dXJuO1xuICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4geyBlZmZlY3Qoc3RhdGUpOyB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgZGlzcGF0Y2gsIGdldFN0YXRlIH07IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9jb25zdGFudHMvbWVzc2FnZXMnO1xuaW1wb3J0IHsgXG4gICAgcGlwZSxcbiAgICBpc0NoZWNrYWJsZSxcbiAgICBpc1NlbGVjdCxcbiAgICBpc0ZpbGUsXG4gICAgRE9NTm9kZXNGcm9tQ29tbWFMaXN0LFxuICAgIGV4dHJhY3RWYWx1ZUZyb21Hcm91cFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG4gICAgRE9UTkVUX0FEQVBUT1JTLFxuICAgIERPVE5FVF9QQVJBTVMsXG4gICAgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUsXG4gICAgRE9NX1NFTEVDVE9SX1BBUkFNU1xufSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFJlc29sdmUgdmFsaWRhdGlvbiBwYXJhbWV0ZXIgdG8gYSBzdHJpbmcgb3IgYXJyYXkgb2YgRE9NIG5vZGVzXG4gKiBcbiAqIEBwYXJhbSBwYXJhbSBbU3RyaW5nXSBpZGVudGlmaWVyIGZvciB0aGUgZGF0YS1hdHRyaWJ1dGUgYGRhdGEtdmFsLSR7cGFyYW19YFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV0gdGhlIG5vZGUgd2hpY2ggY29udGFpbnMgdGhlIGRhdGEtdmFsLSBhdHRyaWJ1dGVcbiAqIFxuICogQHJldHVybiB2YWxpZGF0aW9uIHBhcmFtIFtPYmplY3RdIGluZGV4ZWQgYnkgc2Vjb25kIHBhcnQgb2YgcGFyYW0gbmFtZSAoZS5nLiwgJ21pbicgcGFydCBvZiBsZW5ndGgtbWluJykgYW5kIGFycmF5IG9mIERPTSBub2RlcyBvciBhIHN0cmluZ1xuICovXG5jb25zdCByZXNvbHZlUGFyYW0gPSAocGFyYW0sIGlucHV0KSA9PiB7XG4gICAgbGV0IHZhbHVlID0gaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke3BhcmFtfWApO1xuICAgIHJldHVybiAoe1xuICAgICAgICAgICAgICAgIFtwYXJhbS5zcGxpdCgnLScpWzFdXTogISF+RE9NX1NFTEVDVE9SX1BBUkFNUy5pbmRleE9mKHBhcmFtKSA/IERPTU5vZGVzRnJvbUNvbW1hTGlzdCh2YWx1ZSwgaW5wdXQpOiB2YWx1ZVxuICAgICAgICAgICAgfSlcbn07XG5cbi8qKlxuICogTG9va3MgdXAgdGhlIGRhdGEtdmFsIHByb3BlcnR5IGFnYWluc3QgdGhlIGtub3duIC5ORVQgTVZDIGFkYXB0b3JzL3ZhbGlkYXRpb24gbWV0aG9kXG4gKiBydW5zIHRoZSBtYXRjaGVzIGFnYWluc3QgdGhlIG5vZGUgdG8gZmluZCBwYXJhbSB2YWx1ZXMsIGFuZCByZXR1cm5zIGFuIE9iamVjdCBjb250YWluaW5nIGFsbCAgcGFyYW1ldGVycyBmb3IgdGhhdCBhZGFwdG9yL3ZhbGlkYXRpb24gbWV0aG9kXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdIHRoZSBub2RlIG9uIHdoaWNoIHRvIGxvb2sgZm9yIG1hdGNoaW5nIGFkYXB0b3JzXG4gKiBAcGFyYW0gYWRhcHRvciBbU3RyaW5nXSAuTkVUIE1WQyBkYXRhLWF0dHJpYnV0ZSB0aGF0IGlkZW50aWZpZXMgdmFsaWRhdG9yXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdGlvbiBwYXJhbXMgW09iamVjdF0gVmFsaWRhdGlvbiBwYXJhbSBvYmplY3QgY29udGFpbmluZyBhbGwgdmFsaWRhdGlvbiBwYXJhbWV0ZXJzIGZvciBhbiBhZGFwdG9yL3ZhbGlkYXRpb24gbWV0aG9kXG4gKi9cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKSA/IE9iamVjdC5hc3NpZ24oYWNjLCByZXNvbHZlUGFyYW0ocGFyYW0sIGlucHV0KSkgOiBhY2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuXG4vKipcbiAqIFJlZHVjZXIgdGhhdCB0YWtlcyBhbGwga25vdyAuTkVUIE1WQyBhZGFwdG9ycyAoZGF0YS1hdHRyaWJ1dGVzIHRoYXQgc3BlY2lmaXkgYSB2YWxpZGF0aW9uIG1ldGhvZCB0aGF0IHNob3VsZCBiZSBwYXBpaWVkIHRvIHRoZSBub2RlKVxuICogYW5kIGNoZWNrcyBhZ2FpbnN0IGEgRE9NIG5vZGUgZm9yIG1hdGNoZXMsIHJldHVybmluZyBhbiBhcnJheSBvZiB2YWxpZGF0b3JzXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdG9ycyBbQXJyYXldLCBlYWNoIHZhbGlkYXRvciBjb21wcG9zZWQgb2YgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgW1N0cmluZ10gbmFtaW5nIHRoZSB2YWxpZGF0b3IgYW5kIG1hdGNoaW5nIGl0IHRvIHZhbGlkYXRpb24gbWV0aG9kIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgW1N0cmluZ10gdGhlIGVycm9yIG1lc3NhZ2UgZGlzcGxheWVkIGlmIHRoZSB2YWxpZGF0aW9uIG1ldGhvZCByZXR1cm5zIGZhbHNlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcyBbT2JqZWN0XSAob3B0aW9uYWwpIFxuICovXG5jb25zdCBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMgPSBpbnB1dCA9PiBET1RORVRfQURBUFRPUlMucmVkdWNlKCh2YWxpZGF0b3JzLCBhZGFwdG9yKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsaWRhdG9ycyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogWy4uLnZhbGlkYXRvcnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhZGFwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBpbnB1dC5nZXRBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7YWRhcHRvcn1gKX0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0UGFyYW1zKGlucHV0LCBhZGFwdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKTtcblxuICAgICAgXG4vKipcbiAqIFBpcGVzIGFuIGlucHV0IHRocm91Z2ggYSBzZXJpZXMgb2YgdmFsaWRhdG9yIGNoZWNrcyAoZm5zIGRpcmVjdGx5IGJlbG93KSB0byBleHRyYWN0IGFycmF5IG9mIHZhbGlkYXRvcnMgYmFzZWQgb24gSFRNTDUgYXR0cmlidXRlc1xuICogc28gSFRNTDUgY29uc3RyYWludHMgdmFsaWRhdGlvbiBpcyBub3QgdXNlZCwgd2UgdXNlIHRoZSBzYW1lIHZhbGlkYXRpb24gbWV0aG9kcyBhcyAuTkVUIE1WQyB2YWxpZGF0aW9uXG4gKiBcbiAqIElmIHdlIGFyZSB0byBhY3R1YWxseSB1c2UgdGhlIENvbnN0cmFpbnQgVmFsaWRhdGlvbiBBUEkgd2Ugd291bGQgbm90IG5lZWQgdG8gYXNzZW1ibGUgdGhpcyB2YWxpZGF0b3IgYXJyYXkuLi5cbiAqIFxuICogQHBhcmFtIGlucHV0IFtET00gbm9kZV1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0b3JzIFtBcnJheV1cbiAqLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5jb25zdCBleHRyYWN0QXR0clZhbGlkYXRvcnMgPSBpbnB1dCA9PiBwaXBlKGVtYWlsKGlucHV0KSwgdXJsKGlucHV0KSwgbnVtYmVyKGlucHV0KSwgbWlubGVuZ3RoKGlucHV0KSwgbWF4bGVuZ3RoKGlucHV0KSwgbWluKGlucHV0KSwgbWF4KGlucHV0KSwgcGF0dGVybihpbnB1dCksIHJlcXVpcmVkKGlucHV0KSk7XG5cbi8qKlxuICogVmFsaWRhdG9yIGNoZWNrcyB0byBleHRyYWN0IHZhbGlkYXRvcnMgYmFzZWQgb24gSFRNTDUgYXR0cmlidXRlc1xuICogXG4gKiBFYWNoIGZ1bmN0aW9uIGlzIGN1cnJpZWQgc28gd2UgY2FuIHNlZWQgZWFjaCBmbiB3aXRoIGFuIGlucHV0IGFuZCBwaXBlIHRoZSByZXN1bHQgYXJyYXkgdGhyb3VnaCBlYWNoIGZ1bmN0aW9uXG4gKiBTaWduYXR1cmU6IGlucHV0RE9NTm9kZSA9PiB2YWxpZGF0b3JBcnJheSA9PiB1cGRhdGVWYWxpZGF0b3JBcnJheVxuICovXG5jb25zdCByZXF1aXJlZCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9PSAnZmFsc2UnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAncmVxdWlyZWQnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgZW1haWwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdlbWFpbCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCB1cmwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAndXJsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG51bWJlciA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdudW1iZXInfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWlubGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXhsZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbicsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4ID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4JywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBwYXR0ZXJuID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiB7IHJlZ2V4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKX19XSA6IHZhbGlkYXRvcnM7XG5cbi8qKlxuICogVGFrZXMgYW4gaW5wdXQgYW5kIHJldHVybnMgdGhlIGFycmF5IG9mIHZhbGlkYXRvcnMgYmFzZWQgb24gZWl0aGVyIC5ORVQgTVZDIGRhdGEtdmFsLSBvciBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdG9ycyBbQXJyYXldXG4gKi8gIFxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdEF0dHJWYWxpZGF0b3JzKGlucHV0KTtcblxuLyoqXG4gKiBDYWxscyBhIHZhbGlkYXRpb24gbWV0aG9kIGFnYWluc3QgYW4gaW5wdXQgZ3JvdXBcbiAqIFxuICogQHBhcmFtIGdyb3VwIFtBcnJheV0gRE9NIG5vZGVzIHdpdGggdGhlIHNhbWUgbmFtZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB2YWxpZGF0b3IgW1N0cmluZ10gVGhlIHR5cGUgb2YgdmFsaWRhdG9yIG1hdGNoaW5nIGl0IHRvIHZhbGlkYXRpb24gbWV0aG9kIGZ1bmN0aW9uXG4gKiBcbiAqLyAgXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdjdXN0b20nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbWV0aG9kc1snY3VzdG9tJ10odmFsaWRhdG9yLm1ldGhvZCwgZ3JvdXApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyk7XG5cbi8qKlxuICogUmVkdWNlciBjb25zdHJ1Y3RpbmcgYW4gdmFsaWRhdGlvbiBPYmplY3QgZm9yIGEgZ3JvdXAgb2YgRE9NIG5vZGVzXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm5zIHZhbGlkYXRpb24gb2JqZWN0IFtPYmplY3RdIGNvbnNpc3Rpbmcgb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkIFtCb29sZWFuXSB0aGUgdmFsaWRpdHlTdGF0ZSBvZiB0aGUgZ3JvdXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnMgW0FycmF5XSBvZiB2YWxpZGF0b3Igb2JqZWN0c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzIFtBcnJheV0gRE9NIG5vZGVzIGluIHRoZSBncm91cFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlIFtET00gbm9kZV0gLk5FVCBNVkMgc2VydmVyLXJlbmRlcmVkIGVycm9yIG1lc3NhZ2Ugc3BhblxuICogXG4gKi8gIFxuZXhwb3J0IGNvbnN0IGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBsZXQgbmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgIHJldHVybiBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gPyBPYmplY3QuYXNzaWduKGFjY1tuYW1lXSwgeyBmaWVsZHM6IFsuLi5hY2NbbmFtZV0uZmllbGRzLCBpbnB1dF19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09XCIke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfVwiXWApIHx8IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gZXJyb3IgbWVzc2FnZSBwcm9wZXJ0eSBvZiB0aGUgdmFsaWRhdG9yIE9iamVjdCB0aGF0IGhhcyByZXR1cm5lZCBmYWxzZSBvciB0aGUgY29ycmVzcG9uZGluZyBkZWZhdWx0IG1lc3NhZ2VcbiAqIFxuICogQHBhcmFtIHZhbGlkYXRvciBbT2JqZWN0XSBcbiAqIFxuICogQHJldHVybiBtZXNzYWdlIFtTdHJpbmddIGVycm9yIG1lc3NhZ2VcbiAqIFxuICovIFxuY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IHZhbGlkYXRvciA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG4vKipcbiAqIEN1cnJpZWQgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IHJlZHVjZXMgdGhlIHJlc29sdmVkIHJlc3BvbnNlIGZyb20gYW4gYXJyYXkgb2YgdmFsaWRhdGlvbiBQcm9taXNlcyBwZXJmb3JtZWQgYWdhaW5zdCBhIGdyb3VwXG4gKiBpbnRvIGFuIGFycmF5IG9mIGVycm9yIG1lc3NhZ2VzIG9yIGFuIGVtcHR5IGFycmF5XG4gKiBcbiAqIEByZXR1cm4gZXJyb3IgbWVzc2FnZXMgW0FycmF5XVxuICogXG4gKi8gXG5leHBvcnQgY29uc3QgcmVkdWNlRXJyb3JNZXNzYWdlcyA9IChncm91cCwgc3RhdGUpID0+IChhY2MsIHZhbGlkaXR5LCBqKSA9PiB7XG4gICAgcmV0dXJuIHZhbGlkaXR5ID09PSB0cnVlIFxuICAgICAgICAgICAgICAgID8gYWNjIFxuICAgICAgICAgICAgICAgIDogWy4uLmFjYywgdHlwZW9mIHZhbGlkaXR5ID09PSAnYm9vbGVhbicgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RXJyb3JNZXNzYWdlKHN0YXRlLmdyb3Vwc1tncm91cF0udmFsaWRhdG9yc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbGlkaXR5XTtcbn07XG5cbi8qKlxuICogRnJvbSBhbGwgZ3JvdXBzIGZvdW5kIGluIHRoZSBjdXJyZW50IGZvcm0sIHRob3NldGhhdCBkbyBub3QgcmVxdWlyZSB2YWxpZGF0aW9uIChoYXZlIG5vIGFzc29jYXRlZCB2YWxpZGF0b3JzKSBhcmUgcmVtb3ZlZFxuICogXG4gKiBAcGFyYW0gZ3JvdXBzIFtPYmplY3RdIG5hbWUtaW5kZXhlZCBvYmplY3QgY29uc2lzdGluZyBvZiBhbGwgZ3JvdXBzIGZvdW5kIGluIHRoZSBjdXJyZW50IGZvcm1cbiAqIFxuICogQHJldHVybiBncm91cHMgW09iamVjdF0gbmFtZS1pbmRleGVkIG9iamVjdCBjb25zaXN0aW5nIG9mIGFsbCB2YWxpZGF0YWJsZSBncm91cHNcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB2YWxpZGF0aW9uR3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF07XG5cbiAgICByZXR1cm4gdmFsaWRhdGlvbkdyb3Vwcztcbn07XG5cbi8qKlxuICogVGFrZXMgYSBmb3JtIERPTSBub2RlIGFuZCByZXR1cm5zIHRoZSBpbml0aWFsIGZvcm0gdmFsaWRhdGlvbiBzdGF0ZSAtIGFuIG9iamVjdCBjb25zaXN0aW5nIG9mIGFsbCB0aGUgdmFsaWRhdGFibGUgaW5wdXQgZ3JvdXBzXG4gKiB3aXRoIHZhbGlkaXR5U3RhdGUsIGZpZWxkcywgdmFsaWRhdG9ycywgYW5kIGFzc29jaWF0ZWQgZGF0YSByZXF1aXJlZCB0byBwZXJmb3JtIHZhbGlkYXRpb24gYW5kIHJlbmRlciBlcnJvcnMuXG4gKiBcbiAqIEBwYXJhbSBmb3JtIFtET00gbm9kZXNdIFxuICogXG4gKiBAcmV0dXJuIHN0YXRlIFtPYmplY3RdIGNvbnNpc3Rpbmcgb2YgZ3JvdXBzIFtPYmplY3RdIG5hbWUtaW5kZXhlZCB2YWxpZGF0aW9uIGdyb3Vwc1xuICogXG4gKi8gXG5leHBvcnQgY29uc3QgZ2V0SW5pdGlhbFN0YXRlID0gZm9ybSA9PiAoe1xuICAgIHJlYWxUaW1lVmFsaWRhdGlvbjogZmFsc2UsXG4gICAgZ3JvdXBzOiByZW1vdmVVbnZhbGlkYXRhYmxlR3JvdXBzKFtdLnNsaWNlLmNhbGwoZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9c3VibWl0XSksIHRleHRhcmVhLCBzZWxlY3QnKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKVxufSk7XG5cbi8qKlxuICogUmVkdWNlciBydW4gYWdhaW5zdCBhbiBhcnJheSBvZiByZXNvbHZlZCB2YWxpZGF0aW9uIHByb21pc2VzIHRvIHNldCB0aGUgb3ZlcmFsbCB2YWxpZGl0eVN0YXRlIG9mIGEgZ3JvdXBcbiAqIFxuICogQHJldHVybiB2YWxpZGl0eVN0YXRlIFtCb29sZWFuXSBcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cbi8qKlxuICogQWdncmVnYXRlcyB2YWxpZGF0aW9uIHByb21pc2VzIGZvciBhbGwgZ3JvdXBzIGludG8gYSBzaW5nbGUgcHJvbWlzZVxuICogXG4gKiBAcGFyYW1zIGdyb3VwcyBbT2JqZWN0XVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcmVzdWx0cyBbUHJvbWlzZV0gYWdncmVnYXRlZCBwcm9taXNlXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGdldFZhbGlkaXR5U3RhdGUgPSBncm91cHMgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXBzKVxuICAgICAgICAgICAgLm1hcChncm91cCA9PiBnZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXBzW2dyb3VwXSkpXG4gICAgICAgICk7XG59O1xuXG4vKipcbiAqIEFnZ3JlZ2F0ZXMgYWxsIG9mIHRoZSB2YWxpZGF0aW9uIHByb21pc2VzIGZvciBhIHNpbmxnZSBncm91cCBpbnRvIGEgc2luZ2xlIHByb21pc2VcbiAqIFxuICogQHBhcmFtcyBncm91cHMgW09iamVjdF1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0aW9uIHJlc3VsdHMgW1Byb21pc2VdIGFnZ3JlZ2F0ZWQgcHJvbWlzZVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRHcm91cFZhbGlkaXR5U3RhdGUgPSBncm91cCA9PiB7XG4gICAgbGV0IGhhc0Vycm9yID0gZmFsc2U7XG5cdHJldHVybiBQcm9taXNlLmFsbChncm91cC52YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBpZih2YWxpZGF0b3IudHlwZSAhPT0gJ3JlbW90ZScpe1xuICAgICAgICAgICAgICAgIGlmKHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpKSByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZihoYXNFcnJvcikgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB2YWxpZGF0ZShncm91cCwgdmFsaWRhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHsgcmVzb2x2ZShyZXMpO30pO1xuICAgICAgICB9KTtcbiAgICB9KSk7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGV2ZW50IHR5cGUgdG8gYmUgdXNlZCBmb3IgcmVhbC10aW1lIHZhbGlkYXRpb24gYSBnaXZlbiBmaWVsZCBiYXNlZCBvbiBmaWVsZCB0eXBlXG4gKiBcbiAqIEBwYXJhbXMgaW5wdXQgW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJuIGV2ZW50IHR5cGUgW1N0cmluZ11cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07IiwiaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKChwYXJhbXMudHlwZSAhPT0gJ2dldCcgPyBwYXJhbXMudXJsIDogYCR7cGFyYW1zLnVybH0/JHtyZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKX1gKSwge1xuICAgICAgICAgICAgbWV0aG9kOiBwYXJhbXMudHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7IHJlc29sdmUoZGF0YSk7IH0pXG4gICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKGBTZXJ2ZXIgZXJyb3I6ICR7cmVzfWApOyB9KTtcbiAgICB9KSxcbiAgICBjdXN0b206IChtZXRob2QsIGdyb3VwKSA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IG1ldGhvZChleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApLCBncm91cC5maWVsZHMpXG59OyIsImV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSAobGlzdCwgaW5wdXQpID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRTZWxlY3RvciA9IGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGFwcGVuZFN0YXRlUHJlZml4KGl0ZW0sIGdldFN0YXRlUHJlZml4KGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7cmVzb2x2ZWRTZWxlY3Rvcn1dYCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbmNvbnN0IGVzY2FwZUF0dHJpYnV0ZVZhbHVlID0gdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgvKFshXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxcXFxcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIpO1xuXG5jb25zdCBnZXRTdGF0ZVByZWZpeCA9IGZpZWxkTmFtZSA9PiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG5cbmNvbnN0IGFwcGVuZFN0YXRlUHJlZml4ID0gKHZhbHVlLCBwcmVmaXgpID0+IHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIiouXCIpID09PSAwKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIqLlwiLCBwcmVmaXgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZWxzZSByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTsiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi4vLi4vZGlzdCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICAvLyBsZXQgdmFsaWRhdG9yID0gVmFsaWRhdGUuaW5pdCgnZm9ybScpO1xuXG4gICAgLy8gY29uc29sZS5sb2codmFsaWRhdG9yKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICdDdXN0b21WYWxpZGF0b3InLFxuICAgIC8vICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0JztcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgJ1ZhbHVlIG11c3QgZXF1YWwgXCJ0ZXN0XCInXG4gICAgLy8gKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICdDdXN0b21WYWxpZGF0b3InLFxuICAgIC8vICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0IDInO1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICAnVmFsdWUgbXVzdCBlcXVhbCBcInRlc3QgMlwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSJdfQ==
