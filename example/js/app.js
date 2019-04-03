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

	return els.reduce(function (acc, el) {
		if (!el.hasAttribute('novalidate')) {
			acc.push(Object.create((0, _lib2.default)(el, opts)));
			el.setAttribute('novalidate', 'novalidate');
		}
		return acc;
	}, []);
};

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
    ERROR: 'error-message'
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
exports.cleanupButtonValueNode = exports.createButtonValueNode = exports.focusFirstInvalidField = exports.renderError = exports.renderErrors = exports.clearErrors = exports.clearError = exports.createErrorTextNode = exports.h = undefined;

var _constants = require('../constants');

//Track error message DOM nodes in local scope => ;_;
// let errorNodes = {};

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
        state.errorNodes[groupName].parentNode.removeChild(state.errorNodes[groupName]);
        // errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
        if (state.groups[groupName].serverErrorNode) {
            state.groups[groupName].serverErrorNode.classList.remove(_constants.DOTNET_CLASSNAMES.ERROR);
            state.groups[groupName].serverErrorNode.classList.add(_constants.DOTNET_CLASSNAMES.VALID);
        }
        state.groups[groupName].fields.forEach(function (field) {
            field.parentNode.classList.remove('is--invalid');
            field.removeAttribute('aria-invalid');
        });
        delete state.errorNodes[groupName]; //shouldn't be doing this here...
    };
};

/**
 * Iterates over all errorNodes in local scope to remove each error prior to re-validation
 * 
 * @param state [Object, validation state]
 * 
 */
var clearErrors = exports.clearErrors = function clearErrors(state) {
    state.errorNodes && Object.keys(state.errorNodes).forEach(function (name) {
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
        if (state.errorNodes[groupName]) clearError(groupName)(state);

        state.errorNodes[groupName] = state.groups[groupName].serverErrorNode ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) : state.groups[groupName].fields[state.groups[groupName].fields.length - 1].parentNode.appendChild(h('span', { class: _constants.DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]), state.groups[groupName].fields[state.groups[groupName].fields.length - 1]);

        state.groups[groupName].fields.forEach(function (field) {
            field.parentNode.classList.add('is--invalid');
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
var focusFirstInvalidField = exports.focusFirstInvalidField = function focusFirstInvalidField(state) {
    var firstInvalid = Object.keys(state.groups).reduce(function (acc, curr) {
        if (!acc && !state.groups[curr].valid) acc = state.groups[curr].fields[0];
        return acc;
    }, false);
    firstInvalid && firstInvalid.focus();
};

/**
 * Creates a hidden field duplicate of a given field, for conferring submit button values
 * 
 * @param source [Node] A submit input/button
 * @param form [Node] A form node
 * 
 */
var createButtonValueNode = exports.createButtonValueNode = function createButtonValueNode(source, form) {
    var node = document.createElement('input');
    node.setAttribute('type', 'hidden');
    node.setAttribute('name', source.getAttribute('name'));
    node.setAttribute('value', source.getAttribute('value'));
    return form.appendChild(node);
};

/**
 * Removes the node added in createButtonValueNode
 * 
 * @param node [Node] A hidden input
 * 
 */
var cleanupButtonValueNode = exports.cleanupButtonValueNode = function cleanupButtonValueNode(node) {
    node.parentNode.removeChild(node);
};

},{"../constants":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('./store');

var _constants = require('./constants');

var _utils = require('./validator/utils');

var _validator = require('./validator');

var _dom = require('./dom');

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
var validate = function validate(Store) {
    return function (e) {
        e && e.preventDefault();
        Store.dispatch(_constants.ACTIONS.CLEAR_ERRORS, null, [_dom.clearErrors]);

        (0, _validator.getValidityState)(Store.getState().groups).then(function (validityState) {
            var _ref;

            if ((_ref = []).concat.apply(_ref, _toConsumableArray(validityState)).reduce(_validator.reduceGroupValidityState, true)) {
                var buttonValueNode = false;
                if ((0, _utils.isSubmitButton)(document.activeElement) && (0, _utils.hasNameValue)(document.activeElement)) {
                    buttonValueNode = (0, _dom.createButtonValueNode)(document.activeElement, Store.getState().form);
                }
                if (e && e.target) Store.getState().form.submit();
                buttonValueNode && (0, _dom.cleanupButtonValueNode)(buttonValueNode);
                return true;
            }

            Store.getState().realTimeValidation === false && startRealTimeValidation(Store);

            Store.dispatch(_constants.ACTIONS.VALIDATION_ERRORS, Object.keys(Store.getState().groups).reduce(function (acc, group, i) {
                return acc[group] = {
                    valid: validityState[i].reduce(_validator.reduceGroupValidityState, true),
                    errorMessages: validityState[i].reduce((0, _validator.reduceErrorMessages)(group, Store.getState()), [])
                }, acc;
            }, {}), [_dom.renderErrors, _dom.focusFirstInvalidField]);

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
    if (groupName === undefined || method === undefined || message === undefined || !Store.getState()[groupName] && document.getElementsByName(groupName).length === 0) return console.warn('Custom validation method cannot be added.');

    Store.dispatch(_constants.ACTIONS.ADD_VALIDATION_METHOD, { groupName: groupName, validator: { type: 'custom', method: method, message: message } });
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
var startRealTimeValidation = function startRealTimeValidation(Store) {
    var handler = function handler(groupName) {
        return function () {
            if (!Store.getState().groups[groupName].valid) {
                Store.dispatch(_constants.ACTIONS.CLEAR_ERROR, groupName, [(0, _dom.clearError)(groupName)]);
            }
            (0, _validator.getGroupValidityState)(Store.getState().groups[groupName]).then(function (res) {
                if (!res.reduce(_validator.reduceGroupValidityState, true)) {
                    Store.dispatch(_constants.ACTIONS.VALIDATION_ERROR, {
                        group: groupName,
                        errorMessages: res.reduce((0, _validator.reduceErrorMessages)(groupName, Store.getState()), [])
                    }, [(0, _dom.renderError)(groupName)]);
                }
            });
        };
    };

    Object.keys(Store.getState().groups).forEach(function (groupName) {
        Store.getState().groups[groupName].fields.forEach(function (input) {
            input.addEventListener((0, _validator.resolveRealTimeValidationEvent)(input), handler(groupName));
        });
        //;_; can do better?
        var equalToValidator = Store.getState().groups[groupName].validators.filter(function (validator) {
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
    var Store = (0, _store.createStore)();
    Store.dispatch(_constants.ACTIONS.SET_INITIAL_STATE, (0, _validator.getInitialState)(form));
    form.addEventListener('submit', validate(Store));
    form.addEventListener('reset', function () {
        Store.update(UPDATES.CLEAR_ERRORS, null, [_dom.clearErrors]);
    });

    return {
        getState: Store.getState,
        validate: validate(Store),
        addMethod: addMethod
    };
};

},{"./constants":2,"./dom":4,"./store":7,"./validator":8,"./validator/utils":10}],6:[function(require,module,exports){
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
    var nextGroup = {};
    nextGroup[data] = Object.assign({}, state.groups[data], {
        errorMessages: [],
        valid: true
    });
    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, nextGroup)
    });
}), _defineProperty(_ACTIONS$SET_INITIAL_, _constants.ACTIONS.ADD_VALIDATION_METHOD, function (state, data) {
    var nextGroup = {};
    nextGroup[data.groupName] = Object.assign({}, state.groups[data.groupName] ? state.groups[data.groupName] : {}, state.groups[data.groupName] ? { validators: [].concat(_toConsumableArray(state.groups[data.groupName].validators), [data.validator]) } : {
        fields: [].slice.call(document.getElementsByName(data.groupName)),
        serverErrorNode: document.querySelector('[' + _constants.DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + data.groupName + ']') || false,
        valid: false,
        validators: [data.validator]
    });

    return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, nextGroup[data.groupName])
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
exports.createStore = undefined;

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var createStore = exports.createStore = function createStore() {
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
     * @param effects [Array] Array of side effect functions to invoke after state update (DOM, operations, cmds...)
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

    return { dispatch: dispatch, getState: getState };
};

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
 * Checks attributes on an input to generate an array of validators the attributes describe
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array]
 */
var extractAttrValidators = function extractAttrValidators(input) {
    var validators = [];
    if (input.hasAttribute('required') && input.getAttribute('required') !== 'false') {
        validators.push({ type: 'required' });
    }
    if (input.getAttribute('type') === 'email') validators.push({ type: 'email' });
    if (input.getAttribute('type') === 'url') validators.push({ type: 'url' });
    if (input.getAttribute('type') === 'number') validators.push({ type: 'number' });
    if (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') {
        validators.push({ type: 'minlength', params: { min: input.getAttribute('minlength') } });
    }
    if (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') {
        validators.push({ type: 'maxlength', params: { min: input.getAttribute('maxlength') } });
    }
    if (input.getAttribute('min') && input.getAttribute('min') !== 'false') {
        validators.push({ type: 'min', params: { min: input.getAttribute('min') } });
    }
    if (input.getAttribute('max') && input.getAttribute('max') !== 'false') {
        validators.push({ type: 'max', params: { min: input.getAttribute('max') } });
    }
    if (input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') {
        validators.push({ type: 'pattern', params: { regex: input.getAttribute('pattern') } });
    }
    return validators;
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

        // console.log(validators);
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
        if (groups[group].validators.length > 0 && !(0, _utils.groupIsHidden)(groups[group].fields)) validationGroups[group] = groups[group];
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
        form: form,
        errorNodes: {},
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

var isSubmitButton = exports.isSubmitButton = function isSubmitButton(node) {
    return node.getAttribute('type') === 'submit' || node.nodeName === 'BUTTON';
};

var hasNameValue = exports.hasNameValue = function hasNameValue(node) {
    return node.hasAttribute('name') && node.hasAttribute('value');
};

var isRequired = exports.isRequired = function isRequired(group) {
    return group.validators.filter(function (validator) {
        return validator.type === 'required';
    }).length > 0;
};

var groupIsHidden = exports.groupIsHidden = function groupIsHidden(fields) {
    return fields.reduce(function (acc, field) {
        if (field.type === 'hidden') acc = true;
        return acc;
    }, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZGlzdC9saWIvY29uc3RhbnRzL21lc3NhZ2VzLmpzIiwiZGlzdC9saWIvZG9tL2luZGV4LmpzIiwiZGlzdC9saWIvaW5kZXguanMiLCJkaXN0L2xpYi9yZWR1Y2Vycy9pbmRleC5qcyIsImRpc3QvbGliL3N0b3JlL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL2luZGV4LmpzIiwiZGlzdC9saWIvdmFsaWRhdG9yL21ldGhvZHMuanMiLCJkaXN0L2xpYi92YWxpZGF0b3IvdXRpbHMuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxXQUFELEFBQVksTUFBUyxBQUNqQztLQUFJLFdBQUosQUFFQTs7QUFDQTtBQUNBO0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEsQUFBVSxhQUFwRSxBQUFpRixRQUFRLE1BQU0sQ0FBL0YsQUFBeUYsQUFBTSxBQUFDLGdCQUMzRixNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQTdCLEFBQU0sQUFBYyxBQUEwQixBQUVuRDs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7WUFBTyxBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQzlCO01BQUcsQ0FBQyxHQUFBLEFBQUcsYUFBUCxBQUFJLEFBQWdCLGVBQWUsQUFDbEM7T0FBQSxBQUFJLEtBQUssT0FBQSxBQUFPLE9BQU8sbUJBQUEsQUFBUSxJQUEvQixBQUFTLEFBQWMsQUFBWSxBQUNuQztNQUFBLEFBQUcsYUFBSCxBQUFnQixjQUFoQixBQUE4QixBQUM5QjtBQUNEO1NBQUEs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VTtBQURKOzs7OztBQ3BEUDs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1FBQUksWUFBWSxlQUFBLEFBQVMsS0FBekIsQUFBZ0IsQUFBYyxBQUU5Qjs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQXJCRCxBQUFnQyxDQUFBOztBQXVCaEMsQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXHRcblx0Ly9pZiB3ZSB0aGluayBjYW5kaWRhdGUgaXMgYSBmb3JtIERPTSBub2RlLCBwYXNzIGl0IGluIGFuIEFycmF5XG5cdC8vb3RoZXJ3aXNlIGNvbnZlcnQgY2FuZGlkYXRlIHRvIGFuIGFycmF5IG9mIE5vZGVzIHVzaW5nIGl0IGFzIGEgRE9NIHF1ZXJ5IFxuXHRpZih0eXBlb2YgY2FuZGlkYXRlICE9PSAnc3RyaW5nJyAmJiBjYW5kaWRhdGUubm9kZU5hbWUgJiYgY2FuZGlkYXRlLm5vZGVOYW1lID09PSAnRk9STScpIGVscyA9IFtjYW5kaWRhdGVdO1xuXHRlbHNlIGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYW5kaWRhdGUpKTtcblx0XG5cdC8vIGlmKGVscy5sZW5ndGggPT09IDEgJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fICYmIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dKSByZXR1cm4gd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV07XG5cdFxuXHQvL3JldHVybiBpbnN0YW5jZSBpZiBvbmUgZXhpc3RzIGZvciBjYW5kaWRhdGUgcGFzc2VkIHRvIGluaXRcblx0Ly9pZiBpbml0aXRpYWxpc2VkIHVzaW5nIFN0b3JtVmFpZGF0aW9uLmluaXQoe3NlbH0pIHRoZSBpbnN0YW5jZSBhbHJlYWR5IGV4aXN0cyB0aGFua3MgdG8gYXV0by1pbml0XG5cdC8vYnV0IHJlZmVyZW5jZSBtYXkgYmUgd2FudGVkIGZvciBpbnZva2luZyBBUEkgbWV0aG9kc1xuXHQvL2Fsc28gZm9yIHJlcGVhdCBpbml0aWFsaXNhdGlvbnNcblx0XG5cdHJldHVybiBlbHMucmVkdWNlKChhY2MsIGVsKSA9PiB7XG5cdFx0aWYoIWVsLmhhc0F0dHJpYnV0ZSgnbm92YWxpZGF0ZScpKSB7XG5cdFx0XHRhY2MucHVzaChPYmplY3QuY3JlYXRlKGZhY3RvcnkoZWwsIG9wdHMpKSk7XG5cdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpO1xuXHRcdH1cblx0XHRyZXR1cm4gYWNjO1xuXHR9LCBbXSk7XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIEVOVEVSOiAxM1xufTtcblxuZXhwb3J0IGNvbnN0IEFDVElPTlMgPSB7XG4gICAgU0VUX0lOSVRJQUxfU1RBVEU6ICdTRVRfSU5JVElBTF9TVEFURScsXG4gICAgQ0xFQVJfRVJST1JTOiAnQ0xFQVJfRVJST1JTJyxcbiAgICBWQUxJREFUSU9OX0VSUk9SUzogJ1ZBTElEQVRJT05fRVJST1JTJyxcbiAgICBWQUxJREFUSU9OX0VSUk9SOiAnVkFMSURBVElPTl9FUlJPUicsXG4gICAgQ0xFQVJfRVJST1I6ICdDTEVBUl9FUlJPUicsXG4gICAgQUREX1ZBTElEQVRJT05fTUVUSE9EOiAnQUREX1ZBTElEQVRJT05fTUVUSE9EJ1xufTtcblxuLy9odHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG5leHBvcnQgY29uc3QgRU1BSUxfUkVHRVggPSAvXlthLXpBLVowLTkuISMkJSYnKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLy9odHRwczovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbmV4cG9ydCBjb25zdCBVUkxfUkVHRVggPSAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2k7XG5cbmV4cG9ydCBjb25zdCBEQVRFX0lTT19SRUdFWCA9IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC87XG5cbmV4cG9ydCBjb25zdCBOVU1CRVJfUkVHRVggPSAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLztcblxuZXhwb3J0IGNvbnN0IERJR0lUU19SRUdFWCA9IC9eXFxkKyQvO1xuXG4vL2RhdGEtYXR0cmlidXRlIGFkZGVkIHRvIGVycm9yIG1lc3NhZ2Ugc3BhbiBjcmVhdGVkIGJ5IC5ORVQgTVZDXG5leHBvcnQgY29uc3QgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgPSAnZGF0YS12YWxtc2ctZm9yJztcblxuLy92YWxpZGF0b3IgcGFyYW1ldGVycyB0aGF0IHJlcXVpcmUgRE9NIGxvb2t1cFxuZXhwb3J0IGNvbnN0IERPTV9TRUxFQ1RPUl9QQVJBTVMgPSBbJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ2VxdWFsdG8tb3RoZXInXTtcblxuLy8uTkVUIE1WQyB2YWxpZGF0b3IgZGF0YS1hdHRyaWJ1dGUgcGFyYW1ldGVycyBpbmRleGVkIGJ5IHRoZWlyIHZhbGlkYXRvcnNcbi8vZS5nLiA8aW5wdXQgZGF0YS12YWwtbGVuZ3RoPVwiRXJyb3IgbWVzc2dlXCIgZGF0YS12YWwtbGVuZ3RoLW1pbj1cIjhcIiBkYXRhLXZhbC1sZW5ndGgtbWF4PVwiMTBcIiB0eXBlPVwidGV4dFwiLi4uIC8+XG5leHBvcnQgY29uc3QgRE9UTkVUX1BBUkFNUyA9IHtcbiAgICBsZW5ndGg6IFsnbGVuZ3RoLW1pbicsICdsZW5ndGgtbWF4J10sXG4gICAgc3RyaW5nbGVuZ3RoOiBbJ2xlbmd0aC1tYXgnXSxcbiAgICByYW5nZTogWydyYW5nZS1taW4nLCAncmFuZ2UtbWF4J10sXG4gICAgLy8gbWluOiBbJ21pbiddLD9cbiAgICAvLyBtYXg6ICBbJ21heCddLD9cbiAgICBtaW5sZW5ndGg6IFsnbWlubGVuZ3RoLW1pbiddLFxuICAgIG1heGxlbmd0aDogWydtYXhsZW5ndGgtbWF4J10sXG4gICAgcmVnZXg6IFsncmVnZXgtcGF0dGVybiddLFxuICAgIGVxdWFsdG86IFsnZXF1YWx0by1vdGhlciddLFxuICAgIHJlbW90ZTogWydyZW1vdGUtdXJsJywgJ3JlbW90ZS1hZGRpdGlvbmFsZmllbGRzJywgJ3JlbW90ZS10eXBlJ10vLz8/XG59O1xuXG4vLy5ORVQgTVZDIGRhdGEtYXR0cmlidXRlcyB0aGF0IGlkZW50aWZ5IHZhbGlkYXRvcnNcbmV4cG9ydCBjb25zdCBET1RORVRfQURBUFRPUlMgPSBbXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAnc3RyaW5nbGVuZ3RoJyxcbiAgICAncmVnZXgnLFxuICAgIC8vICdkaWdpdHMnLFxuICAgICdlbWFpbCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ21pbmxlbmd0aCcsXG4gICAgJ3JhbmdlJyxcbiAgICAnZXF1YWx0bycsXG4gICAgJ3JlbW90ZScsLy9zaG91bGQgYmUgbGFzdFxuICAgIC8vICdwYXNzd29yZCcgLy8tPiBtYXBzIHRvIG1pbiwgbm9uYWxwaGFtYWluLCBhbmQgcmVnZXggbWV0aG9kc1xuXTtcblxuLy9jbGFzc05hbWVzIGFkZGVkL3VwZGF0ZWQgb24gLk5FVCBNVkMgZXJyb3IgbWVzc2FnZSBzcGFuXG5leHBvcnQgY29uc3QgRE9UTkVUX0NMQVNTTkFNRVMgPSB7XG4gICAgVkFMSUQ6ICdmaWVsZC12YWxpZGF0aW9uLXZhbGlkJyxcbiAgICBFUlJPUjogJ2Vycm9yLW1lc3NhZ2UnXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfVxufTsiLCJpbXBvcnQgeyBET1RORVRfQ0xBU1NOQU1FUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbi8vVHJhY2sgZXJyb3IgbWVzc2FnZSBET00gbm9kZXMgaW4gbG9jYWwgc2NvcGUgPT4gO187XG4vLyBsZXQgZXJyb3JOb2RlcyA9IHt9O1xuXG4vKipcbiAqIEh5cGVydGV4dCBET00gZmFjdG9yeSBmdW5jdGlvblxuICogXG4gKiBAcGFyYW0gbm9kZU5hbWUgW1N0cmluZ11cbiAqIEBwYXJhbSBhdHRyaWJ1dGVzIFtPYmplY3RdXG4gKiBAcGFyYW0gdGV4dCBbU3RyaW5nXSBUaGUgaW5uZXJUZXh0IG9mIHRoZSBuZXcgbm9kZVxuICogXG4gKiBAcmV0dXJucyBub2RlIFtET00gbm9kZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgaCA9IChub2RlTmFtZSwgYXR0cmlidXRlcywgdGV4dCkgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG5cbiAgICBmb3IobGV0IHByb3AgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICB9XG4gICAgaWYodGV4dCAhPT0gdW5kZWZpbmVkICYmIHRleHQubGVuZ3RoKSBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpKTtcblxuICAgIHJldHVybiBub2RlO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBhcHBlbmRzIGEgdGV4dCBub2RlIGVycm9yIG1lc3NhZ2UgdG8gYSAgZXJyb3IgY29udGFpbmVyIERPTSBub2RlIGZvciBhIGdyb3VwXG4gKiBcbiAqIEBwYXJhbSBncm91cCBbT2JqZWN0LCB2YWlkYXRpb24gZ3JvdXBdIFxuICogQHBhcmFtIG1zZyBbU3RyaW5nXSBUaGUgZXJyb3IgbWVzc2FnZVxuICogXG4gKiBAcmV0dXJucyBub2RlIFtUZXh0IG5vZGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUVycm9yVGV4dE5vZGUgPSAoZ3JvdXAsIG1zZykgPT4ge1xuICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobXNnKTtcblxuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICBncm91cC5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LmFkZChET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgXG4gICAgcmV0dXJuIGdyb3VwLnNlcnZlckVycm9yTm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgZXJyb3IgbWVzc2FnZSBET00gbm9kZSwgdXBkYXRlcyAuTkVUIE1WQyBlcnJvciBzcGFuIGNsYXNzTmFtZXMgYW5kIGRlbGV0ZXMgdGhlIFxuICogZXJyb3IgZnJvbSBsb2NhbCBlcnJvck5vZGVzIHRyYWNraW5nIG9iamVjdFxuICogXG4gKiBTaWduYXR1cmUgKCkgPT4gZ3JvdXBOYW1lID0+IHN0YXRlID0+IHt9XG4gKiAoQ3VycmllZCBncm91cE5hbWUgZm9yIGVhc2Ugb2YgdXNlIGFzIGV2ZW50TGlzdGVuZXIgYW5kIGluIHdob2xlIGZvcm0gaXRlcmF0aW9uKVxuICogXG4gKiBAcGFyYW0gZ3JvdXBOYW1lIFtTdHJpbmcsIHZhaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvciA9IGdyb3VwTmFtZSA9PiBzdGF0ZSA9PiB7XG4gICAgc3RhdGUuZXJyb3JOb2Rlc1tncm91cE5hbWVdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3RhdGUuZXJyb3JOb2Rlc1tncm91cE5hbWVdKTtcbiAgICAvLyBlcnJvck5vZGVzW2dyb3VwTmFtZV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlcnJvck5vZGVzW2dyb3VwTmFtZV0pO1xuICAgIGlmKHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZSkge1xuICAgICAgICBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUuY2xhc3NMaXN0LnJlbW92ZShET1RORVRfQ0xBU1NOQU1FUy5FUlJPUik7XG4gICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLlZBTElEKTtcbiAgICB9XG4gICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBmaWVsZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLS1pbnZhbGlkJyk7XG4gICAgICAgIGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7XG4gICAgfSk7XG4gICAgZGVsZXRlIHN0YXRlLmVycm9yTm9kZXNbZ3JvdXBOYW1lXTsvL3Nob3VsZG4ndCBiZSBkb2luZyB0aGlzIGhlcmUuLi5cbn07XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgZXJyb3JOb2RlcyBpbiBsb2NhbCBzY29wZSB0byByZW1vdmUgZWFjaCBlcnJvciBwcmlvciB0byByZS12YWxpZGF0aW9uXG4gKiBcbiAqIEBwYXJhbSBzdGF0ZSBbT2JqZWN0LCB2YWxpZGF0aW9uIHN0YXRlXVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBzdGF0ZS5lcnJvck5vZGVzICYmIE9iamVjdC5rZXlzKHN0YXRlLmVycm9yTm9kZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGNsZWFyRXJyb3IobmFtZSkoc3RhdGUpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBncm91cHMgdG8gcmVuZGVyIGVhY2ggZXJyb3IgcG9zdC12YWlkYXRpb25cbiAqIFxuICogQHBhcmFtIHN0YXRlIFtPYmplY3QsIHZhbGlkYXRpb24gc3RhdGVdXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlckVycm9ycyA9IHN0YXRlID0+IHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLmZvckVhY2goZ3JvdXBOYW1lID0+IHtcbiAgICAgICAgaWYoIXN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSByZW5kZXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICB9KVxufTtcblxuLyoqXG4gKiBBZGRzIGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIERPTSBhbmQgc2F2ZXMgaXQgdG8gbG9jYWwgc2NvcGVcbiAqIFxuICogSWYgLk5FVCBNVkMgZXJyb3Igc3BhbiBpcyBwcmVzZW50LCBpdCBpcyB1c2VkIHdpdGggYSBhcHBlbmRlZCB0ZXh0Tm9kZSxcbiAqIGlmIG5vdCBhIG5ldyBET00gbm9kZSBpcyBjcmVhdGVkXG4gKiBcbiAqIFNpZ25hdHVyZSAoKSA9PiBncm91cE5hbWUgPT4gc3RhdGUgPT4ge31cbiAqIChDdXJyaWVkIGdyb3VwTmFtZSBmb3IgZWFzZSBvZiB1c2UgYXMgZXZlbnRMaXN0ZW5lciBhbmQgaW4gd2hvbGUgZm9ybSBpdGVyYXRpb24pXG4gKiBcbiAqIEBwYXJhbSBncm91cE5hbWUgW1N0cmluZywgdmFsaWRhdGlvbiBncm91cF0gXG4gKiBAcGFyYW0gc3RhdGUgW09iamVjdCwgdmFsaWRhdGlvbiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3IgPSBncm91cE5hbWUgPT4gc3RhdGUgPT4ge1xuICAgIGlmKHN0YXRlLmVycm9yTm9kZXNbZ3JvdXBOYW1lXSkgY2xlYXJFcnJvcihncm91cE5hbWUpKHN0YXRlKTtcbiAgICBcbiAgICBzdGF0ZS5lcnJvck5vZGVzW2dyb3VwTmFtZV0gPSBcbiAgICAgICAgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlIFxuICAgICAgICAgICAgICAgID8gY3JlYXRlRXJyb3JUZXh0Tm9kZShzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXSwgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSkgXG4gICAgICAgICAgICAgICAgOiBzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWVsZHNbc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmxlbmd0aC0xXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdzcGFuJywgeyBjbGFzczogRE9UTkVUX0NMQVNTTkFNRVMuRVJST1IgfSwgc3RhdGUuZ3JvdXBzW2dyb3VwTmFtZV0uZXJyb3JNZXNzYWdlc1swXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkc1tzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMubGVuZ3RoLTFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblx0XHRcdFx0XHRcdFxuXHRzdGF0ZS5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGZpZWxkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnaXMtLWludmFsaWQnKTtcbiAgICAgICAgZmllbGQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBTZXQgZm9jdXMgb24gZmlyc3QgaW52YWxpZCBmaWVsZCBhZnRlciBmb3JtLWxldmVsIHZhbGlkYXRlKClcbiAqIFxuICogV2UgY2FuIGFzc3VtZSB0aGF0IHRoZXJlIGlzIGEgZ3JvdXAgaW4gYW4gaW52YWxpZCBzdGF0ZSxcbiAqIGFuZCB0aGF0IHRoZSBncm91cCBoYXMgYXQgbGVhc3Qgb25lIGZpZWxkXG4gKiBcbiAqIEBwYXJhbSBncm91cHMgW09iamVjdCwgdmFsaWRhdGlvbiBncm91cCBzbGljZSBvZiBzdGF0ZV1cbiAqIFxuICovXG5leHBvcnQgY29uc3QgZm9jdXNGaXJzdEludmFsaWRGaWVsZCA9IHN0YXRlID0+IHtcbiAgICBjb25zdCBmaXJzdEludmFsaWQgPSBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG4gICAgICAgIGlmKCFhY2MgJiYgIXN0YXRlLmdyb3Vwc1tjdXJyXS52YWxpZCkgYWNjID0gc3RhdGUuZ3JvdXBzW2N1cnJdLmZpZWxkc1swXTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBmYWxzZSk7XG4gICAgZmlyc3RJbnZhbGlkICYmIGZpcnN0SW52YWxpZC5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGlkZGVuIGZpZWxkIGR1cGxpY2F0ZSBvZiBhIGdpdmVuIGZpZWxkLCBmb3IgY29uZmVycmluZyBzdWJtaXQgYnV0dG9uIHZhbHVlc1xuICogXG4gKiBAcGFyYW0gc291cmNlIFtOb2RlXSBBIHN1Ym1pdCBpbnB1dC9idXR0b25cbiAqIEBwYXJhbSBmb3JtIFtOb2RlXSBBIGZvcm0gbm9kZVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVCdXR0b25WYWx1ZU5vZGUgPSAoc291cmNlLCBmb3JtKSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBzb3VyY2UuZ2V0QXR0cmlidXRlKCduYW1lJykpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHNvdXJjZS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykpO1xuICAgIHJldHVybiBmb3JtLmFwcGVuZENoaWxkKG5vZGUpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGFkZGVkIGluIGNyZWF0ZUJ1dHRvblZhbHVlTm9kZVxuICogXG4gKiBAcGFyYW0gbm9kZSBbTm9kZV0gQSBoaWRkZW4gaW5wdXRcbiAqIFxuICovXG5leHBvcnQgY29uc3QgY2xlYW51cEJ1dHRvblZhbHVlTm9kZSA9IG5vZGUgPT4ge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn0iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSB9IGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHsgQUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGlzU3VibWl0QnV0dG9uLCBoYXNOYW1lVmFsdWUgfSBmcm9tICcuL3ZhbGlkYXRvci91dGlscyc7XG5pbXBvcnQgeyBcbiAgICBnZXRJbml0aWFsU3RhdGUsXG4gICAgZ2V0VmFsaWRpdHlTdGF0ZSxcbiAgICBnZXRHcm91cFZhbGlkaXR5U3RhdGUsXG4gICAgcmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLFxuICAgIHJlc29sdmVSZWFsVGltZVZhbGlkYXRpb25FdmVudCxcbiAgICByZWR1Y2VFcnJvck1lc3NhZ2VzXG59IGZyb20gJy4vdmFsaWRhdG9yJztcbmltcG9ydCB7XG4gICAgY2xlYXJFcnJvcnMsXG4gICAgY2xlYXJFcnJvcixcbiAgICByZW5kZXJFcnJvcixcbiAgICByZW5kZXJFcnJvcnMsXG4gICAgZm9jdXNGaXJzdEludmFsaWRGaWVsZCxcbiAgICBjcmVhdGVCdXR0b25WYWx1ZU5vZGUsXG4gICAgY2xlYW51cEJ1dHRvblZhbHVlTm9kZVxufSAgZnJvbSAnLi9kb20nO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZSB2YWxpZGl0eVN0YXRlIG9mIHRoZSBlbnRpcmUgZm9ybVxuICogY2FuIGJlIHVzZWQgYXMgYSBmb3JtIHN1Ym1pdCBldmVudExpc3RlbmVyIG9yIHZpYSB0aGUgQVBJXG4gKiBcbiAqIFN1Ym1pdHMgdGhlIGZvcm0gaWYgY2FsbGVkIGFzIGEgc3VibWl0IGV2ZW50TGlzdGVuZXIgYW5kIGlzIHZhbGlkXG4gKiBEaXNwYXRjaGVzIGVycm9yIHN0YXRlIHRvIFN0b3JlIGlmIGVycm9yc1xuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm5zIFtib29sZWFuXSBUaGUgdmFsaWRpdHkgc3RhdGUgb2YgdGhlIGZvcm1cbiAqIFxuICovXG5jb25zdCB2YWxpZGF0ZSA9IFN0b3JlID0+IGUgPT4ge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTtcblxuICAgIGdldFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHMpXG4gICAgICAgIC50aGVuKHZhbGlkaXR5U3RhdGUgPT4ge1xuICAgICAgICAgICAgaWYoW10uY29uY2F0KC4uLnZhbGlkaXR5U3RhdGUpLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5U3RhdGUsIHRydWUpKXtcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uVmFsdWVOb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYoaXNTdWJtaXRCdXR0b24oZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgJiYgaGFzTmFtZVZhbHVlKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblZhbHVlTm9kZSA9IGNyZWF0ZUJ1dHRvblZhbHVlTm9kZShkb2N1bWVudC5hY3RpdmVFbGVtZW50LCBTdG9yZS5nZXRTdGF0ZSgpLmZvcm0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihlICYmIGUudGFyZ2V0KSBTdG9yZS5nZXRTdGF0ZSgpLmZvcm0uc3VibWl0KCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJ1dHRvblZhbHVlTm9kZSAmJiBjbGVhbnVwQnV0dG9uVmFsdWVOb2RlKGJ1dHRvblZhbHVlTm9kZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgU3RvcmUuZ2V0U3RhdGUoKS5yZWFsVGltZVZhbGlkYXRpb24gPT09IGZhbHNlICYmIHN0YXJ0UmVhbFRpbWVWYWxpZGF0aW9uKFN0b3JlKTtcblxuICAgICAgICAgICAgU3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgICAgICAgQUNUSU9OUy5WQUxJREFUSU9OX0VSUk9SUyxcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhTdG9yZS5nZXRTdGF0ZSgpLmdyb3VwcylcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBncm91cCwgaSkgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjW2dyb3VwXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZDogdmFsaWRpdHlTdGF0ZVtpXS5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLCB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiB2YWxpZGl0eVN0YXRlW2ldLnJlZHVjZShyZWR1Y2VFcnJvck1lc3NhZ2VzKGdyb3VwLCBTdG9yZS5nZXRTdGF0ZSgpKSwgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG4gICAgICAgICAgICAgICAgICAgIH0sIHt9KSxcbiAgICAgICAgICAgICAgICBbcmVuZGVyRXJyb3JzLCBmb2N1c0ZpcnN0SW52YWxpZEZpZWxkXVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbn07XG5cbi8qKlxuICogQWRkcyBhIGN1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCB0byB0aGUgdmFsaWRhdGlvbiBtb2RlbCwgdXNlZCB2aWEgdGhlIEFQSVxuICogRGlzcGF0Y2hlcyBhZGQgdmFsaWRhdGlvbiBtZXRob2QgdG8gc3RvcmUgdG8gdXBkYXRlIHRoZSB2YWxpZGF0b3JzIGluIGEgZ3JvdXBcbiAqIFxuICogQHBhcmFtIGdyb3VwTmFtZSBbU3RyaW5nXSBUaGUgbmFtZSBhdHRyaWJ1dGUgc2hhcmVkIGJ5IHRoZSBET20gbm9kZXMgaW4gdGhlIGdyb3VwXG4gKiBAcGFyYW0gbWV0aG9kIFtGdW5jdGlvbl0gVGhlIHZhbGlkYXRpb24gbWV0aG9kIChmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBvciBmYWxzZSkgdGhhdCB1cyBjYWxsZWQgb24gdGhlIGdyb3VwXG4gKiBAcGFyYW0gbWVzc2FnZSBbU3RyaW5nXSBUZSBlcnJvciBtZXNzYWdlIGRpc3BsYXllZCBpZiB0aGUgdmFsaWRhdGlvbiBtZXRob2QgcmV0dXJucyBmYWxzZVxuICogXG4gKi9cbmNvbnN0IGFkZE1ldGhvZCA9IChncm91cE5hbWUsIG1ldGhvZCwgbWVzc2FnZSkgPT4ge1xuICAgIGlmKChncm91cE5hbWUgPT09IHVuZGVmaW5lZCB8fCBtZXRob2QgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSB1bmRlZmluZWQpIHx8ICFTdG9yZS5nZXRTdGF0ZSgpW2dyb3VwTmFtZV0gJiYgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoZ3JvdXBOYW1lKS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0N1c3RvbSB2YWxpZGF0aW9uIG1ldGhvZCBjYW5ub3QgYmUgYWRkZWQuJyk7XG5cbiAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkFERF9WQUxJREFUSU9OX01FVEhPRCwge2dyb3VwTmFtZSwgdmFsaWRhdG9yOiB7dHlwZTogJ2N1c3RvbScsIG1ldGhvZCwgbWVzc2FnZX19KTtcbn07XG5cblxuLyoqXG4gKiBTdGFydHMgcmVhbC10aW1lIHZhbGlkYXRpb24gb24gZWFjaCBncm91cCwgYWRkaW5nIGFuIGV2ZW50TGlzdGVuZXIgdG8gZWFjaCBmaWVsZCBcbiAqIHRoYXQgcmVzZXRzIHRoZSB2YWxpZGl0eVN0YXRlIGZvciB0aGUgZmllbGQncyBncm91cCBhbmQgYWNxdWlyZXMgdGhlIG5ldyB2YWxpZGl0eSBzdGF0ZVxuICogXG4gKiBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB2YWxpZGF0aW9uIGlzIGRlZmluZWQgYnkgdGhlIGZpZWxkIHR5cGVcbiAqIFxuICogT25seSBpZiB0aGUgbmV3IHZhbGlkaXR5U3RhdGUgaXMgaW52YWxpZCBpcyB0aGUgdmFsaWRhdGlvbiBlcnJvciBvYmplY3QgXG4gKiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZSB0byB1cGRhdGUgc3RhdGUgYW5kIHJlbmRlciB0aGUgZXJyb3JcbiAqIFxuICovXG5jb25zdCBzdGFydFJlYWxUaW1lVmFsaWRhdGlvbiA9IFN0b3JlID0+IHtcbiAgICBsZXQgaGFuZGxlciA9IGdyb3VwTmFtZSA9PiAoKSA9PiB7XG4gICAgICAgIGlmKCFTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSB7XG4gICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChBQ1RJT05TLkNMRUFSX0VSUk9SLCBncm91cE5hbWUsIFtjbGVhckVycm9yKGdyb3VwTmFtZSldKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRHcm91cFZhbGlkaXR5U3RhdGUoU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIXJlcy5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eVN0YXRlLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBTdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBQ1RJT05TLlZBTElEQVRJT05fRVJST1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cDogZ3JvdXBOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiByZXMucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXBOYW1lLCBTdG9yZS5nZXRTdGF0ZSgpKSwgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVuZGVyRXJyb3IoZ3JvdXBOYW1lKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhTdG9yZS5nZXRTdGF0ZSgpLmdyb3VwcykuZm9yRWFjaChncm91cE5hbWUgPT4ge1xuICAgICAgICBTdG9yZS5nZXRTdGF0ZSgpLmdyb3Vwc1tncm91cE5hbWVdLmZpZWxkcy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIocmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50KGlucHV0KSwgaGFuZGxlcihncm91cE5hbWUpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vO187IGNhbiBkbyBiZXR0ZXI/XG4gICAgICAgIGxldCBlcXVhbFRvVmFsaWRhdG9yID0gU3RvcmUuZ2V0U3RhdGUoKS5ncm91cHNbZ3JvdXBOYW1lXS52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdlcXVhbHRvJyk7XG4gICAgICAgIFxuICAgICAgICBpZihlcXVhbFRvVmFsaWRhdG9yLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgZXF1YWxUb1ZhbGlkYXRvclswXS5wYXJhbXMub3RoZXIuZm9yRWFjaChzdWJncm91cCA9PiB7XG4gICAgICAgICAgICAgICAgc3ViZ3JvdXAuZm9yRWFjaChpdGVtID0+IHsgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlcihncm91cE5hbWUpKTsgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uLCBzZXRzIGluaXRpYWwgc3RhdGUgYW5kIGFkZHMgZm9ybS1sZXZlbCBldmVudCBsaXN0ZW5lcnNcbiAqIFxuICogQHBhcmFtIGZvcm0gW0RPTSBub2RlXSB0aGUgZm9ybSB0byB2YWxpZGF0ZVxuICogXG4gKiBAcmV0dXJucyBbT2JqZWN0XSBUaGUgQVBJIGZvciB0aGUgaW5zdGFuY2VcbiAqICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZm9ybSA9PiB7XG4gICAgY29uc3QgU3RvcmUgPSBjcmVhdGVTdG9yZSgpO1xuICAgIFN0b3JlLmRpc3BhdGNoKEFDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEUsIChnZXRJbml0aWFsU3RhdGUoZm9ybSkpKTtcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHZhbGlkYXRlKFN0b3JlKSk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsICgpID0+IHsgU3RvcmUudXBkYXRlKFVQREFURVMuQ0xFQVJfRVJST1JTLCBudWxsLCBbY2xlYXJFcnJvcnNdKTsgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTdGF0ZTogU3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZShTdG9yZSksXG4gICAgICAgIGFkZE1ldGhvZFxuICAgIH1cbn07IiwiaW1wb3J0IHsgQUNUSU9OUywgRE9UTkVUX0VSUk9SX1NQQU5fREFUQV9BVFRSSUJVVEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEFsbCBzdGF0ZS9tb2RlbC1tb2RpZnlpbmcgb3BlcmF0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW0FDVElPTlMuU0VUX0lOSVRJQUxfU1RBVEVdOiAoc3RhdGUsIGRhdGEpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCBkYXRhKSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUlNdOiBzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBcbiAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwc1tncm91cF0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSlcbiAgICB9KSxcbiAgICBbQUNUSU9OUy5DTEVBUl9FUlJPUl06IChzdGF0ZSwgZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBuZXh0R3JvdXAgPSB7fTtcbiAgICAgICAgbmV4dEdyb3VwW2RhdGFdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGFdLCB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCBuZXh0R3JvdXApXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW0FDVElPTlMuQUREX1ZBTElEQVRJT05fTUVUSE9EXTogKHN0YXRlLCBkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHRHcm91cCA9IHt9O1xuICAgICAgICBuZXh0R3JvdXBbZGF0YS5ncm91cE5hbWVdID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXSA/IHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gOiB7fSxcbiAgICAgICAgICAgIHN0YXRlLmdyb3Vwc1tkYXRhLmdyb3VwTmFtZV0gPyAgeyB2YWxpZGF0b3JzOiBbLi4uc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBOYW1lXS52YWxpZGF0b3JzLCBkYXRhLnZhbGlkYXRvcl0gfVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGRhdGEuZ3JvdXBOYW1lKSksXG4gICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09JHtkYXRhLmdyb3VwTmFtZX1dYCkgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcnM6IFtkYXRhLnZhbGlkYXRvcl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzLCBuZXh0R3JvdXBbZGF0YS5ncm91cE5hbWVdKVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JTXTogKHN0YXRlLCBkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgcmVhbFRpbWVWYWxpZGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZ3JvdXBzOiBPYmplY3Qua2V5cyhzdGF0ZS5ncm91cHMpLnJlZHVjZSgoYWNjLCBncm91cCkgPT4ge1xuICAgICAgICAgICAgICAgIGFjY1tncm91cF0gPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5ncm91cHNbZ3JvdXBdLCBkYXRhW2dyb3VwXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtBQ1RJT05TLlZBTElEQVRJT05fRVJST1JdOiAoc3RhdGUsIGRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmdyb3Vwcywge1xuICAgICAgICAgICAgICAgIFtkYXRhLmdyb3VwXTogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuZ3JvdXBzW2RhdGEuZ3JvdXBdLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IGRhdGEuZXJyb3JNZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gKCkgPT4ge1xuICAgIC8vc2hhcmVkIGNlbnRyYWxpc2VkIHZhbGlkYXRvciBzdGF0ZVxuICAgIGxldCBzdGF0ZSA9IHt9O1xuXG4gICAgLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4gICAgLy8gd2luZG93Ll9fdmFsaWRhdG9yX2hpc3RvcnlfXyA9IFtdO1xuXG4gICAgLy9zdGF0ZSBnZXR0ZXJcbiAgICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG5leHQgc3RhdGUgYnkgaW52b2tpbmcgcmVkdWNlciBvbiBjdXJyZW50IHN0YXRlXG4gICAgICogXG4gICAgICogRXhlY3V0ZSBzaWRlIGVmZmVjdHMgb2Ygc3RhdGUgdXBkYXRlLCBhcyBwYXNzZWQgaW4gdGhlIHVwZGF0ZVxuICAgICAqIFxuICAgICAqIEBwYXJhbSB0eXBlIFtTdHJpbmddIFxuICAgICAqIEBwYXJhbSBuZXh0U3RhdGUgW09iamVjdF0gTmV3IHNsaWNlIG9mIHN0YXRlIHRvIGNvbWJpbmUgd2l0aCBjdXJyZW50IHN0YXRlIHRvIGNyZWF0ZSBuZXh0IHN0YXRlXG4gICAgICogQHBhcmFtIGVmZmVjdHMgW0FycmF5XSBBcnJheSBvZiBzaWRlIGVmZmVjdCBmdW5jdGlvbnMgdG8gaW52b2tlIGFmdGVyIHN0YXRlIHVwZGF0ZSAoRE9NLCBvcGVyYXRpb25zLCBjbWRzLi4uKVxuICAgICAqL1xuICAgIGNvbnN0IGRpc3BhdGNoID0gZnVuY3Rpb24odHlwZSwgbmV4dFN0YXRlLCBlZmZlY3RzKSB7XG4gICAgICAgIHN0YXRlID0gbmV4dFN0YXRlID8gcmVkdWNlcnNbdHlwZV0oc3RhdGUsIG5leHRTdGF0ZSkgOiBzdGF0ZTtcbiAgICAgICAgLy91bmNvbW1lbnQgZm9yIGRlYnVnZ2luZyBieSB3cml0aW5nIHN0YXRlIGhpc3RvcnkgdG8gd2luZG93XG4gICAgICAgIC8vIHdpbmRvdy5fX3ZhbGlkYXRvcl9oaXN0b3J5X18ucHVzaCh7W3R5cGVdOiBzdGF0ZX0pLCBjb25zb2xlLmxvZyh3aW5kb3cuX192YWxpZGF0b3JfaGlzdG9yeV9fKTtcbiAgICAgICAgaWYoIWVmZmVjdHMpIHJldHVybjtcbiAgICAgICAgZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiB7IGVmZmVjdChzdGF0ZSk7IH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4geyBkaXNwYXRjaCwgZ2V0U3RhdGUgfTtcbn07IiwiaW1wb3J0IG1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJztcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuLi9jb25zdGFudHMvbWVzc2FnZXMnO1xuaW1wb3J0IHtcbiAgICBpc0NoZWNrYWJsZSxcbiAgICBpc1NlbGVjdCxcbiAgICBpc0ZpbGUsXG4gICAgRE9NTm9kZXNGcm9tQ29tbWFMaXN0LFxuICAgIGdyb3VwSXNIaWRkZW5cbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuICAgIERPVE5FVF9BREFQVE9SUyxcbiAgICBET1RORVRfUEFSQU1TLFxuICAgIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLFxuICAgIERPTV9TRUxFQ1RPUl9QQVJBTVNcbn0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBSZXNvbHZlIHZhbGlkYXRpb24gcGFyYW1ldGVyIHRvIGEgc3RyaW5nIG9yIGFycmF5IG9mIERPTSBub2Rlc1xuICogXG4gKiBAcGFyYW0gcGFyYW0gW1N0cmluZ10gaWRlbnRpZmllciBmb3IgdGhlIGRhdGEtYXR0cmlidXRlIGBkYXRhLXZhbC0ke3BhcmFtfWBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdIHRoZSBub2RlIHdoaWNoIGNvbnRhaW5zIHRoZSBkYXRhLXZhbC0gYXR0cmlidXRlXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdGlvbiBwYXJhbSBbT2JqZWN0XSBpbmRleGVkIGJ5IHNlY29uZCBwYXJ0IG9mIHBhcmFtIG5hbWUgKGUuZy4sICdtaW4nIHBhcnQgb2YgbGVuZ3RoLW1pbicpIGFuZCBhcnJheSBvZiBET00gbm9kZXMgb3IgYSBzdHJpbmdcbiAqL1xuY29uc3QgcmVzb2x2ZVBhcmFtID0gKHBhcmFtLCBpbnB1dCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKTtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICAgICBbcGFyYW0uc3BsaXQoJy0nKVsxXV06ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgPyBET01Ob2Rlc0Zyb21Db21tYUxpc3QodmFsdWUsIGlucHV0KTogdmFsdWVcbiAgICAgICAgICAgIH0pXG59O1xuXG4vKipcbiAqIExvb2tzIHVwIHRoZSBkYXRhLXZhbCBwcm9wZXJ0eSBhZ2FpbnN0IHRoZSBrbm93biAuTkVUIE1WQyBhZGFwdG9ycy92YWxpZGF0aW9uIG1ldGhvZFxuICogcnVucyB0aGUgbWF0Y2hlcyBhZ2FpbnN0IHRoZSBub2RlIHRvIGZpbmQgcGFyYW0gdmFsdWVzLCBhbmQgcmV0dXJucyBhbiBPYmplY3QgY29udGFpbmluZyBhbGwgIHBhcmFtZXRlcnMgZm9yIHRoYXQgYWRhcHRvci92YWxpZGF0aW9uIG1ldGhvZFxuICogXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXSB0aGUgbm9kZSBvbiB3aGljaCB0byBsb29rIGZvciBtYXRjaGluZyBhZGFwdG9yc1xuICogQHBhcmFtIGFkYXB0b3IgW1N0cmluZ10gLk5FVCBNVkMgZGF0YS1hdHRyaWJ1dGUgdGhhdCBpZGVudGlmaWVzIHZhbGlkYXRvclxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcGFyYW1zIFtPYmplY3RdIFZhbGlkYXRpb24gcGFyYW0gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHZhbGlkYXRpb24gcGFyYW1ldGVycyBmb3IgYW4gYWRhcHRvci92YWxpZGF0aW9uIG1ldGhvZFxuICovXG5jb25zdCBleHRyYWN0UGFyYW1zID0gKGlucHV0LCBhZGFwdG9yKSA9PiBET1RORVRfUEFSQU1TW2FkYXB0b3JdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogRE9UTkVUX1BBUkFNU1thZGFwdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBwYXJhbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dCkpIDogYWNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcblxuLyoqXG4gKiBSZWR1Y2VyIHRoYXQgdGFrZXMgYWxsIGtub3cgLk5FVCBNVkMgYWRhcHRvcnMgKGRhdGEtYXR0cmlidXRlcyB0aGF0IHNwZWNpZml5IGEgdmFsaWRhdGlvbiBtZXRob2QgdGhhdCBzaG91bGQgYmUgcGFwaWllZCB0byB0aGUgbm9kZSlcbiAqIGFuZCBjaGVja3MgYWdhaW5zdCBhIERPTSBub2RlIGZvciBtYXRjaGVzLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdmFsaWRhdG9yc1xuICogXG4gKiBAcGFyYW0gaW5wdXQgW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRvcnMgW0FycmF5XSwgZWFjaCB2YWxpZGF0b3IgY29tcHBvc2VkIG9mIFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlIFtTdHJpbmddIG5hbWluZyB0aGUgdmFsaWRhdG9yIGFuZCBtYXRjaGluZyBpdCB0byB2YWxpZGF0aW9uIG1ldGhvZCBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlIFtTdHJpbmddIHRoZSBlcnJvciBtZXNzYWdlIGRpc3BsYXllZCBpZiB0aGUgdmFsaWRhdGlvbiBtZXRob2QgcmV0dXJucyBmYWxzZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMgW09iamVjdF0gKG9wdGlvbmFsKSBcbiAqL1xuY29uc3QgZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzID0gaW5wdXQgPT4gRE9UTkVUX0FEQVBUT1JTLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYWRhcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtcyhpbnB1dCwgYWRhcHRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbiAgICAgIFxuLyoqXG4gKiBDaGVja3MgYXR0cmlidXRlcyBvbiBhbiBpbnB1dCB0byBnZW5lcmF0ZSBhbiBhcnJheSBvZiB2YWxpZGF0b3JzIHRoZSBhdHRyaWJ1dGVzIGRlc2NyaWJlXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdG9ycyBbQXJyYXldXG4gKi9cbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHtcbiAgICBsZXQgdmFsaWRhdG9ycyA9IFtdO1xuICAgIGlmKGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScpe1xuICAgICAgICB2YWxpZGF0b3JzLnB1c2goeyB0eXBlOiAncmVxdWlyZWQnfSApXG4gICAgfVxuICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZW1haWwnKSB2YWxpZGF0b3JzLnB1c2goe3R5cGU6ICdlbWFpbCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3VybCcpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ3VybCd9KTtcbiAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicpIHZhbGlkYXRvcnMucHVzaCh7dHlwZTogJ251bWJlcid9KTtcbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICE9PSAnZmFsc2UnKSl7XG4gICAgICAgIHZhbGlkYXRvcnMucHVzaCh7IHR5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpIH0gfSk7XG4gICAgfVxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgIT09ICdmYWxzZScpKXtcbiAgICAgICAgdmFsaWRhdG9ycy5wdXNoKHsgdHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgfSB9KTtcbiAgICB9XG4gICAgaWYoKGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAhPT0gJ2ZhbHNlJykpe1xuICAgICAgICB2YWxpZGF0b3JzLnB1c2goeyB0eXBlOiAnbWluJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSB9IH0pO1xuICAgIH1cbiAgICBpZigoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICE9PSAnZmFsc2UnKSl7XG4gICAgICAgIHZhbGlkYXRvcnMucHVzaCh7IHR5cGU6ICdtYXgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpIH0gfSk7XG4gICAgfVxuICAgIGlmKChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykpe1xuICAgICAgICB2YWxpZGF0b3JzLnB1c2goeyB0eXBlOiAncGF0dGVybicsIHBhcmFtczogeyByZWdleDogaW5wdXQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJykgfSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG59O1xuXG4vKipcbiAqIFZhbGlkYXRvciBjaGVja3MgdG8gZXh0cmFjdCB2YWxpZGF0b3JzIGJhc2VkIG9uIEhUTUw1IGF0dHJpYnV0ZXNcbiAqIFxuICogRWFjaCBmdW5jdGlvbiBpcyBjdXJyaWVkIHNvIHdlIGNhbiBzZWVkIGVhY2ggZm4gd2l0aCBhbiBpbnB1dCBhbmQgcGlwZSB0aGUgcmVzdWx0IGFycmF5IHRocm91Z2ggZWFjaCBmdW5jdGlvblxuICogU2lnbmF0dXJlOiBpbnB1dERPTU5vZGUgPT4gdmFsaWRhdG9yQXJyYXkgPT4gdXBkYXRlVmFsaWRhdG9yQXJyYXlcbiAqL1xuY29uc3QgcmVxdWlyZWQgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2codmFsaWRhdG9ycyk7XG4gICAgcmV0dXJuIGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdyZXF1aXJlZCd9XSA6IHZhbGlkYXRvcnM7XG59O1xuY29uc3QgZW1haWwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdlbWFpbCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdlbWFpbCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCB1cmwgPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICd1cmwnID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAndXJsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IG51bWJlciA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdudW1iZXInfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWlubGVuZ3RoID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWlubGVuZ3RoJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXhsZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXhsZW5ndGgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1pbiA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21pbicsIHBhcmFtczogeyBtaW46IGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWF4ID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWF4JywgcGFyYW1zOiB7IG1heDogaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBwYXR0ZXJuID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdwYXR0ZXJuJywgcGFyYW1zOiB7IHJlZ2V4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BhdHRlcm4nKX19XSA6IHZhbGlkYXRvcnM7XG5cbi8qKlxuICogVGFrZXMgYW4gaW5wdXQgYW5kIHJldHVybnMgdGhlIGFycmF5IG9mIHZhbGlkYXRvcnMgYmFzZWQgb24gZWl0aGVyIC5ORVQgTVZDIGRhdGEtdmFsLSBvciBIVE1MNSBhdHRyaWJ1dGVzXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm4gdmFsaWRhdG9ycyBbQXJyYXldXG4gKi8gIFxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdEF0dHJWYWxpZGF0b3JzKGlucHV0KTtcblxuLyoqXG4gKiBDYWxscyBhIHZhbGlkYXRpb24gbWV0aG9kIGFnYWluc3QgYW4gaW5wdXQgZ3JvdXBcbiAqIFxuICogQHBhcmFtIGdyb3VwIFtBcnJheV0gRE9NIG5vZGVzIHdpdGggdGhlIHNhbWUgbmFtZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB2YWxpZGF0b3IgW1N0cmluZ10gVGhlIHR5cGUgb2YgdmFsaWRhdG9yIG1hdGNoaW5nIGl0IHRvIHZhbGlkYXRpb24gbWV0aG9kIGZ1bmN0aW9uXG4gKiBcbiAqLyAgXG5leHBvcnQgY29uc3QgdmFsaWRhdGUgPSAoZ3JvdXAsIHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdjdXN0b20nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbWV0aG9kc1snY3VzdG9tJ10odmFsaWRhdG9yLm1ldGhvZCwgZ3JvdXApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtZXRob2RzW3ZhbGlkYXRvci50eXBlXShncm91cCwgdmFsaWRhdG9yLnBhcmFtcyk7XG5cbi8qKlxuICogUmVkdWNlciBjb25zdHJ1Y3RpbmcgYW4gdmFsaWRhdGlvbiBPYmplY3QgZm9yIGEgZ3JvdXAgb2YgRE9NIG5vZGVzXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbRE9NIG5vZGVdXG4gKiBcbiAqIEByZXR1cm5zIHZhbGlkYXRpb24gb2JqZWN0IFtPYmplY3RdIGNvbnNpc3Rpbmcgb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkIFtCb29sZWFuXSB0aGUgdmFsaWRpdHlTdGF0ZSBvZiB0aGUgZ3JvdXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnMgW0FycmF5XSBvZiB2YWxpZGF0b3Igb2JqZWN0c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzIFtBcnJheV0gRE9NIG5vZGVzIGluIHRoZSBncm91cFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlIFtET00gbm9kZV0gLk5FVCBNVkMgc2VydmVyLXJlbmRlcmVkIGVycm9yIG1lc3NhZ2Ugc3BhblxuICogXG4gKi8gIFxuZXhwb3J0IGNvbnN0IGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBsZXQgbmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgIHJldHVybiBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gPyBPYmplY3QuYXNzaWduKGFjY1tuYW1lXSwgeyBmaWVsZHM6IFsuLi5hY2NbbmFtZV0uZmllbGRzLCBpbnB1dF19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09XCIke2lucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpfVwiXWApIHx8IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBhY2M7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gZXJyb3IgbWVzc2FnZSBwcm9wZXJ0eSBvZiB0aGUgdmFsaWRhdG9yIE9iamVjdCB0aGF0IGhhcyByZXR1cm5lZCBmYWxzZSBvciB0aGUgY29ycmVzcG9uZGluZyBkZWZhdWx0IG1lc3NhZ2VcbiAqIFxuICogQHBhcmFtIHZhbGlkYXRvciBbT2JqZWN0XSBcbiAqIFxuICogQHJldHVybiBtZXNzYWdlIFtTdHJpbmddIGVycm9yIG1lc3NhZ2VcbiAqIFxuICovIFxuY29uc3QgZXh0cmFjdEVycm9yTWVzc2FnZSA9IHZhbGlkYXRvciA9PiB2YWxpZGF0b3IubWVzc2FnZSB8fCBtZXNzYWdlc1t2YWxpZGF0b3IudHlwZV0odmFsaWRhdG9yLnBhcmFtcyAhPT0gdW5kZWZpbmVkID8gdmFsaWRhdG9yLnBhcmFtcyA6IG51bGwpO1xuXG4vKipcbiAqIEN1cnJpZWQgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IHJlZHVjZXMgdGhlIHJlc29sdmVkIHJlc3BvbnNlIGZyb20gYW4gYXJyYXkgb2YgdmFsaWRhdGlvbiBQcm9taXNlcyBwZXJmb3JtZWQgYWdhaW5zdCBhIGdyb3VwXG4gKiBpbnRvIGFuIGFycmF5IG9mIGVycm9yIG1lc3NhZ2VzIG9yIGFuIGVtcHR5IGFycmF5XG4gKiBcbiAqIEByZXR1cm4gZXJyb3IgbWVzc2FnZXMgW0FycmF5XVxuICogXG4gKi8gXG5leHBvcnQgY29uc3QgcmVkdWNlRXJyb3JNZXNzYWdlcyA9IChncm91cCwgc3RhdGUpID0+IChhY2MsIHZhbGlkaXR5LCBqKSA9PiB7XG4gICAgcmV0dXJuIHZhbGlkaXR5ID09PSB0cnVlIFxuICAgICAgICAgICAgICAgID8gYWNjIFxuICAgICAgICAgICAgICAgIDogWy4uLmFjYywgdHlwZW9mIHZhbGlkaXR5ID09PSAnYm9vbGVhbicgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RXJyb3JNZXNzYWdlKHN0YXRlLmdyb3Vwc1tncm91cF0udmFsaWRhdG9yc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbGlkaXR5XTtcbn07XG5cbi8qKlxuICogRnJvbSBhbGwgZ3JvdXBzIGZvdW5kIGluIHRoZSBjdXJyZW50IGZvcm0sIHRob3NldGhhdCBkbyBub3QgcmVxdWlyZSB2YWxpZGF0aW9uIChoYXZlIG5vIGFzc29jYXRlZCB2YWxpZGF0b3JzKSBhcmUgcmVtb3ZlZFxuICogXG4gKiBAcGFyYW0gZ3JvdXBzIFtPYmplY3RdIG5hbWUtaW5kZXhlZCBvYmplY3QgY29uc2lzdGluZyBvZiBhbGwgZ3JvdXBzIGZvdW5kIGluIHRoZSBjdXJyZW50IGZvcm1cbiAqIFxuICogQHJldHVybiBncm91cHMgW09iamVjdF0gbmFtZS1pbmRleGVkIG9iamVjdCBjb25zaXN0aW5nIG9mIGFsbCB2YWxpZGF0YWJsZSBncm91cHNcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMgPSBncm91cHMgPT4ge1xuICAgIGxldCB2YWxpZGF0aW9uR3JvdXBzID0ge307XG5cbiAgICBmb3IobGV0IGdyb3VwIGluIGdyb3VwcylcbiAgICAgICAgaWYoZ3JvdXBzW2dyb3VwXS52YWxpZGF0b3JzLmxlbmd0aCA+IDAgJiYgIWdyb3VwSXNIaWRkZW4oZ3JvdXBzW2dyb3VwXS5maWVsZHMpKVxuICAgICAgICAgICAgdmFsaWRhdGlvbkdyb3Vwc1tncm91cF0gPSBncm91cHNbZ3JvdXBdO1xuXG4gICAgcmV0dXJuIHZhbGlkYXRpb25Hcm91cHM7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgZm9ybSBET00gbm9kZSBhbmQgcmV0dXJucyB0aGUgaW5pdGlhbCBmb3JtIHZhbGlkYXRpb24gc3RhdGUgLSBhbiBvYmplY3QgY29uc2lzdGluZyBvZiBhbGwgdGhlIHZhbGlkYXRhYmxlIGlucHV0IGdyb3Vwc1xuICogd2l0aCB2YWxpZGl0eVN0YXRlLCBmaWVsZHMsIHZhbGlkYXRvcnMsIGFuZCBhc3NvY2lhdGVkIGRhdGEgcmVxdWlyZWQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIGFuZCByZW5kZXIgZXJyb3JzLlxuICogXG4gKiBAcGFyYW0gZm9ybSBbRE9NIG5vZGVzXSBcbiAqIFxuICogQHJldHVybiBzdGF0ZSBbT2JqZWN0XSBjb25zaXN0aW5nIG9mIGdyb3VwcyBbT2JqZWN0XSBuYW1lLWluZGV4ZWQgdmFsaWRhdGlvbiBncm91cHNcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxTdGF0ZSA9IGZvcm0gPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm0sXG4gICAgICAgIGVycm9yTm9kZXM6IHt9LFxuICAgICAgICByZWFsVGltZVZhbGlkYXRpb246IGZhbHNlLFxuICAgICAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShhc3NlbWJsZVZhbGlkYXRpb25Hcm91cCwge30pKVxuICAgIH1cbn07XG5cbi8qKlxuICogUmVkdWNlciBydW4gYWdhaW5zdCBhbiBhcnJheSBvZiByZXNvbHZlZCB2YWxpZGF0aW9uIHByb21pc2VzIHRvIHNldCB0aGUgb3ZlcmFsbCB2YWxpZGl0eVN0YXRlIG9mIGEgZ3JvdXBcbiAqIFxuICogQHJldHVybiB2YWxpZGl0eVN0YXRlIFtCb29sZWFuXSBcbiAqIFxuICovIFxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlTdGF0ZSA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cbi8qKlxuICogQWdncmVnYXRlcyB2YWxpZGF0aW9uIHByb21pc2VzIGZvciBhbGwgZ3JvdXBzIGludG8gYSBzaW5nbGUgcHJvbWlzZVxuICogXG4gKiBAcGFyYW1zIGdyb3VwcyBbT2JqZWN0XVxuICogXG4gKiBAcmV0dXJuIHZhbGlkYXRpb24gcmVzdWx0cyBbUHJvbWlzZV0gYWdncmVnYXRlZCBwcm9taXNlXG4gKiBcbiAqL1xuZXhwb3J0IGNvbnN0IGdldFZhbGlkaXR5U3RhdGUgPSBncm91cHMgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXBzKVxuICAgICAgICAgICAgLm1hcChncm91cCA9PiBnZXRHcm91cFZhbGlkaXR5U3RhdGUoZ3JvdXBzW2dyb3VwXSkpXG4gICAgICAgICk7XG59O1xuXG4vKipcbiAqIEFnZ3JlZ2F0ZXMgYWxsIG9mIHRoZSB2YWxpZGF0aW9uIHByb21pc2VzIGZvciBhIHNpbmxnZSBncm91cCBpbnRvIGEgc2luZ2xlIHByb21pc2VcbiAqIFxuICogQHBhcmFtcyBncm91cHMgW09iamVjdF1cbiAqIFxuICogQHJldHVybiB2YWxpZGF0aW9uIHJlc3VsdHMgW1Byb21pc2VdIGFnZ3JlZ2F0ZWQgcHJvbWlzZVxuICogXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRHcm91cFZhbGlkaXR5U3RhdGUgPSBncm91cCA9PiB7XG4gICAgbGV0IGhhc0Vycm9yID0gZmFsc2U7XG5cdHJldHVybiBQcm9taXNlLmFsbChncm91cC52YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBpZih2YWxpZGF0b3IudHlwZSAhPT0gJ3JlbW90ZScpe1xuICAgICAgICAgICAgICAgIGlmKHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpKSByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZihoYXNFcnJvcikgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB2YWxpZGF0ZShncm91cCwgdmFsaWRhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHsgcmVzb2x2ZShyZXMpO30pO1xuICAgICAgICB9KTtcbiAgICB9KSk7XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGV2ZW50IHR5cGUgdG8gYmUgdXNlZCBmb3IgcmVhbC10aW1lIHZhbGlkYXRpb24gYSBnaXZlbiBmaWVsZCBiYXNlZCBvbiBmaWVsZCB0eXBlXG4gKiBcbiAqIEBwYXJhbXMgaW5wdXQgW0RPTSBub2RlXVxuICogXG4gKiBAcmV0dXJuIGV2ZW50IHR5cGUgW1N0cmluZ11cbiAqIFxuICovXG5leHBvcnQgY29uc3QgcmVzb2x2ZVJlYWxUaW1lVmFsaWRhdGlvbkV2ZW50ID0gaW5wdXQgPT4gWydpbnB1dCcsICdjaGFuZ2UnXVtOdW1iZXIoaXNDaGVja2FibGUoaW5wdXQpIHx8IGlzU2VsZWN0KGlucHV0KSB8fCBpc0ZpbGUoaW5wdXQpKV07IiwiaW1wb3J0IHsgRU1BSUxfUkVHRVgsIFVSTF9SRUdFWCwgREFURV9JU09fUkVHRVgsIE5VTUJFUl9SRUdFWCwgRElHSVRTX1JFR0VYIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IGZldGNoLCBpc1JlcXVpcmVkLCBleHRyYWN0VmFsdWVGcm9tR3JvdXAsIHJlc29sdmVHZXRQYXJhbXMgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgaXNPcHRpb25hbCA9IGdyb3VwID0+ICFpc1JlcXVpcmVkKGdyb3VwKSAmJiBleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApID09PSAnJztcblxuY29uc3QgZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMgPSAoZ3JvdXAsIHR5cGUpID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gdHlwZSlbMF0ucGFyYW1zO1xuXG5jb25zdCBjdXJyeVJlZ2V4TWV0aG9kID0gcmVnZXggPT4gZ3JvdXAgPT4gaXNPcHRpb25hbChncm91cCl8fCBncm91cC5maWVsZHMucmVkdWNlKChhY2MsIGlucHV0KSA9PiAoYWNjID0gcmVnZXgudGVzdChpbnB1dC52YWx1ZSksIGFjYyksIGZhbHNlKTtcblxuY29uc3QgY3VycnlQYXJhbU1ldGhvZCA9ICh0eXBlLCByZWR1Y2VyKSA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKSB8fCBncm91cC5maWVsZHMucmVkdWNlKHJlZHVjZXIoZXh0cmFjdFZhbGlkYXRpb25QYXJhbXMoZ3JvdXAsIHR5cGUpKSwgZmFsc2UpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVxdWlyZWQ6IGdyb3VwID0+IGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgIT09ICcnLFxuICAgIGVtYWlsOiBjdXJyeVJlZ2V4TWV0aG9kKEVNQUlMX1JFR0VYKSxcbiAgICB1cmw6IGN1cnJ5UmVnZXhNZXRob2QoVVJMX1JFR0VYKSxcbiAgICBkYXRlOiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSAhL0ludmFsaWR8TmFOLy50ZXN0KG5ldyBEYXRlKGlucHV0LnZhbHVlKS50b1N0cmluZygpKSwgYWNjKSwgZmFsc2UpLFxuICAgIGRhdGVJU086IGN1cnJ5UmVnZXhNZXRob2QoREFURV9JU09fUkVHRVgpLFxuICAgIG51bWJlcjogY3VycnlSZWdleE1ldGhvZChOVU1CRVJfUkVHRVgpLFxuICAgIGRpZ2l0czogY3VycnlSZWdleE1ldGhvZChESUdJVFNfUkVHRVgpLFxuICAgIG1pbmxlbmd0aDogY3VycnlQYXJhbU1ldGhvZChcbiAgICAgICAgJ21pbmxlbmd0aCcsXG4gICAgICAgIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IEFycmF5LmlzQXJyYXkoaW5wdXQudmFsdWUpID8gaW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluIDogK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiwgYWNjKVxuICAgICksXG4gICAgbWF4bGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWF4bGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXggOiAraW5wdXQudmFsdWUubGVuZ3RoIDw9ICtwYXJhbXMubWF4LCBhY2MpXG4gICAgKSxcbiAgICBlcXVhbHRvOiBjdXJyeVBhcmFtTWV0aG9kKCdlcXVhbHRvJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgPSBwYXJhbXMub3RoZXIucmVkdWNlKChzdWJncm91cEFjYywgc3ViZ3JvdXApID0+IHtcbiAgICAgICAgICAgIGlmKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChzdWJncm91cCkgIT09IGlucHV0LnZhbHVlKSBzdWJncm91cEFjYyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN1Ymdyb3VwQWNjO1xuICAgICAgICB9LCB0cnVlKSwgYWNjO1xuICAgIH0pLFxuICAgIHBhdHRlcm46IGN1cnJ5UGFyYW1NZXRob2QoJ3BhdHRlcm4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgcmVnZXg6IGN1cnJ5UGFyYW1NZXRob2QoJ3JlZ2V4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gUmVnRXhwKHBhcmFtcy5yZWdleCkudGVzdChpbnB1dC52YWx1ZSksIGFjYykpLFxuICAgIG1pbjogY3VycnlQYXJhbU1ldGhvZCgnbWluJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluLCBhY2MpKSxcbiAgICBtYXg6IGN1cnJ5UGFyYW1NZXRob2QoJ21heCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCwgYWNjKSksXG4gICAgbGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKCdsZW5ndGgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlLmxlbmd0aCA+PSArcGFyYW1zLm1pbiAmJiAocGFyYW1zLm1heCA9PT0gdW5kZWZpbmVkIHx8ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgpKSwgYWNjKSksXG4gICAgcmFuZ2U6IGN1cnJ5UGFyYW1NZXRob2QoJ3JhbmdlJywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gKCtpbnB1dC52YWx1ZSA+PSArcGFyYW1zLm1pbiAmJiAraW5wdXQudmFsdWUgPD0gK3BhcmFtcy5tYXgpLCBhY2MpKSxcbiAgICByZW1vdGU6IChncm91cCwgcGFyYW1zKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZldGNoKChwYXJhbXMudHlwZSAhPT0gJ2dldCcgPyBwYXJhbXMudXJsIDogYCR7cGFyYW1zLnVybH0/JHtyZXNvbHZlR2V0UGFyYW1zKHBhcmFtcy5hZGRpdGlvbmFsZmllbGRzKX1gKSwge1xuICAgICAgICAgICAgbWV0aG9kOiBwYXJhbXMudHlwZS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgYm9keTogcGFyYW1zLnR5cGUgPT09ICdnZXQnID8gbnVsbCA6IHJlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpLFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7IHJlc29sdmUoZGF0YSk7IH0pXG4gICAgICAgIC5jYXRjaChyZXMgPT4geyByZXNvbHZlKGBTZXJ2ZXIgZXJyb3I6ICR7cmVzfWApOyB9KTtcbiAgICB9KSxcbiAgICBjdXN0b206IChtZXRob2QsIGdyb3VwKSA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IG1ldGhvZChleHRyYWN0VmFsdWVGcm9tR3JvdXAoZ3JvdXApLCBncm91cC5maWVsZHMpXG59OyIsImV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNTdWJtaXRCdXR0b24gPSBub2RlID0+ICBub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnc3VibWl0JyB8fCBub2RlLm5vZGVOYW1lID09PSAnQlVUVE9OJztcblxuZXhwb3J0IGNvbnN0IGhhc05hbWVWYWx1ZSA9IG5vZGUgPT4gbm9kZS5oYXNBdHRyaWJ1dGUoJ25hbWUnKSAmJiBub2RlLmhhc0F0dHJpYnV0ZSgndmFsdWUnKTtcblxuZXhwb3J0IGNvbnN0IGlzUmVxdWlyZWQgPSBncm91cCA9PiBncm91cC52YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLnR5cGUgPT09ICdyZXF1aXJlZCcpLmxlbmd0aCA+IDA7XG5cbmV4cG9ydCBjb25zdCBncm91cElzSGlkZGVuID0gZmllbGRzID0+IGZpZWxkcy5yZWR1Y2UoKGFjYywgZmllbGQpID0+IHtcbiAgICBpZihmaWVsZC50eXBlID09PSAnaGlkZGVuJykgYWNjID0gdHJ1ZTtcbiAgICByZXR1cm4gYWNjO1xufSwgZmFsc2UpO1xuXG5cbmNvbnN0IGhhc1ZhbHVlID0gaW5wdXQgPT4gKGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaW5wdXQudmFsdWUgIT09IG51bGwgJiYgaW5wdXQudmFsdWUubGVuZ3RoID4gMCk7XG5cbmV4cG9ydCBjb25zdCBncm91cFZhbHVlUmVkdWNlciA9IChhY2MsIGlucHV0KSA9PiB7XG4gICAgaWYoIWlzQ2hlY2thYmxlKGlucHV0KSAmJiBoYXNWYWx1ZShpbnB1dCkpIGFjYyA9IGlucHV0LnZhbHVlO1xuICAgIGlmKGlzQ2hlY2thYmxlKGlucHV0KSAmJiBpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYWNjKSkgYWNjLnB1c2goaW5wdXQudmFsdWUpXG4gICAgICAgIGVsc2UgYWNjID0gW2lucHV0LnZhbHVlXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn07XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlR2V0UGFyYW1zID0gbm9kZUFycmF5cyA9PiBub2RlQXJyYXlzLm1hcCgobm9kZXMpID0+IHtcbiAgICByZXR1cm4gYCR7bm9kZXNbMF0uZ2V0QXR0cmlidXRlKCduYW1lJyl9PSR7ZXh0cmFjdFZhbHVlRnJvbUdyb3VwKG5vZGVzKX1gO1xufSkuam9pbignJicpO1xuXG5leHBvcnQgY29uc3QgRE9NTm9kZXNGcm9tQ29tbWFMaXN0ID0gKGxpc3QsIGlucHV0KSA9PiBsaXN0LnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc29sdmVkU2VsZWN0b3IgPSBlc2NhcGVBdHRyaWJ1dGVWYWx1ZShhcHBlbmRTdGF0ZVByZWZpeChpdGVtLCBnZXRTdGF0ZVByZWZpeChpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke3Jlc29sdmVkU2VsZWN0b3J9XWApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5jb25zdCBlc2NhcGVBdHRyaWJ1dGVWYWx1ZSA9IHZhbHVlID0+IHZhbHVlLnJlcGxhY2UoLyhbIVwiIyQlJicoKSorLC4vOjs8PT4/QFxcW1xcXFxcXF1eYHt8fX5dKS9nLCBcIlxcXFwkMVwiKTtcblxuY29uc3QgZ2V0U3RhdGVQcmVmaXggPSBmaWVsZE5hbWUgPT4gZmllbGROYW1lLnN1YnN0cigwLCBmaWVsZE5hbWUubGFzdEluZGV4T2YoJy4nKSArIDEpO1xuXG5jb25zdCBhcHBlbmRTdGF0ZVByZWZpeCA9ICh2YWx1ZSwgcHJlZml4KSA9PiB7XG4gICAgaWYgKHZhbHVlLmluZGV4T2YoXCIqLlwiKSA9PT0gMCkgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKFwiKi5cIiwgcHJlZml4KTtcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZWxzZSByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTsiLCJpbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi4vLi4vZGlzdCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBsZXQgdmFsaWRhdG9yID0gVmFsaWRhdGUuaW5pdCgnZm9ybScpO1xuXG4gICAgLy8gY29uc29sZS5sb2codmFsaWRhdG9yKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICdDdXN0b21WYWxpZGF0b3InLFxuICAgIC8vICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0JztcbiAgICAvLyAgICAgfSxcbiAgICAvLyAgICAgJ1ZhbHVlIG11c3QgZXF1YWwgXCJ0ZXN0XCInXG4gICAgLy8gKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICdDdXN0b21WYWxpZGF0b3InLFxuICAgIC8vICAgICAodmFsdWUsIGZpZWxkcywgcGFyYW1zKSA9PiB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmFsdWUgPT09ICd0ZXN0IDInO1xuICAgIC8vICAgICB9LFxuICAgIC8vICAgICAnVmFsdWUgbXVzdCBlcXVhbCBcInRlc3QgMlwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSJdfQ==
