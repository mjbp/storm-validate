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

},{"./lib":6,"./lib/constants/defaults":3}],3:[function(require,module,exports){
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

var UPDATES = exports.UPDATES = {
    SET_INITIAL_MODEL: 'SET_INITIAL_MODEL',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    VALIDATION_ERRORS: 'VALIDATION_ERRORS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
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

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _constants = require('./constants');

var _validator = require('./validator');

var _view = require('./view');

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
    _model2.default.update(_constants.UPDATES.CLEAR_ERRORS, null, [_view.clearErrors]);

    (0, _validator.getValidityModel)(_model2.default.getModel().groups).then(function (validityModel) {
        var _ref;

        //no errors (all true, no false or error Strings), just submit
        if (e && e.target && (_ref = []).concat.apply(_ref, _toConsumableArray(validityModel)).reduce(_validator.reduceGroupValidityModel, true)) return form.submit();

        _model2.default.update(_constants.UPDATES.VALIDATION_ERRORS, Object.keys(_model2.default.getModel().groups).reduce(function (acc, group, i) {
            return acc[group] = {
                valid: validityModel[i].reduce(_validator.reduceGroupValidityModel, true),
                errorMessages: validityModel[i].reduce((0, _validator.reduceErrorMessages)(group, _model2.default.getModel()), [])
            }, acc;
        }, {}), [_view.renderErrors]);

        realTimeValidation();
    });
};

var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    model.groups[groupName].validators.push({ type: type, method: method, message: message });
};

var realTimeValidation = function realTimeValidation() {
    var handler = function handler(groupName) {
        return function () {
            if (!_model2.default.getModel().groups[groupName].valid) _model2.default.update(_constants.UPDATES.CLEAR_ERROR, groupName, [(0, _view.clearError)(groupName)]);
            (0, _validator.getGroupValidityModel)(_model2.default.getModel().groups[groupName]).then(function (res) {
                if (!res.reduce(_validator.reduceGroupValidityModel, true)) _model2.default.update(_constants.UPDATES.VALIDATION_ERROR, {
                    group: groupName,
                    errorMessages: res.reduce((0, _validator.reduceErrorMessages)(groupName, _model2.default.getModel()), [])
                }, [(0, _view.renderError)(groupName)]);
            });
        };
    };

    Object.keys(_model2.default.getModel().groups).forEach(function (groupName) {
        _model2.default.getModel().groups[groupName].fields.forEach(function (input) {
            input.addEventListener((0, _validator.resolveRealTimeValidationEvent)(input), handler(groupName));
        });
        var equalToValidator = _model2.default.getModel().groups[groupName].validators.filter(function (validator) {
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
    _model2.default.update(_constants.UPDATES.SET_INITIAL_MODEL, (0, _validator.getInitialModel)(form));

    form.addEventListener('submit', validate);

    form.addEventListener('reset', function () {
        _model2.default.update(_constants.UPDATES.CLEAR_ERRORS, null, [_view.clearErrors]);
    });

    return {
        validate: validate,
        addMethod: addMethod
    };
};

},{"./constants":4,"./model":7,"./validator":9,"./view":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _updates = require('../updates');

var _updates2 = _interopRequireDefault(_updates);

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

var model = {};

window.MODEL_HISTORY = [];

var getModel = function getModel() {
    return model;
};

var update = function update(type, nextModel, effects) {
    model = nextModel ? _updates2.default[type](model, nextModel) : model;
    // window.MODEL_HISTORY.push({[action.type]: model});
    console.log(_defineProperty({}, type, model));
    if (!effects) return;
    effects.forEach(function (effect) {
        effect(model);
    });
};

exports.default = {
    update: update,
    getModel: getModel
};

},{"../updates":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _UPDATES$SET_INITIAL_;

var _constants = require('../constants');

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

exports.default = (_UPDATES$SET_INITIAL_ = {}, _defineProperty(_UPDATES$SET_INITIAL_, _constants.UPDATES.SET_INITIAL_MODEL, function (model, data) {
    return Object.assign({}, model, data);
}), _defineProperty(_UPDATES$SET_INITIAL_, _constants.UPDATES.CLEAR_ERRORS, function (mdoel) {
    return Object.assign({}, model, {
        groups: Object.keys(model.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, model.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    });
}), _defineProperty(_UPDATES$SET_INITIAL_, _constants.UPDATES.CLEAR_ERROR, function (model, data) {
    return Object.assign({}, model, {
        groups: Object.assign({}, model.groups, _defineProperty({}, data, Object.assign({}, model.groups[data], {
            errorMessages: [],
            valid: true
        })))
    });
}), _defineProperty(_UPDATES$SET_INITIAL_, _constants.UPDATES.VALIDATION_ERRORS, function (model, data) {
    return Object.assign({}, model, {
        groups: Object.keys(model.groups).reduce(function (acc, group) {
            acc[group] = Object.assign({}, model.groups[group], data[group]);
            return acc;
        }, {})
    });
}), _defineProperty(_UPDATES$SET_INITIAL_, _constants.UPDATES.VALIDATION_ERROR, function (model, data) {
    return Object.assign({}, model, {
        groups: Object.assign({}, model.groups, _defineProperty({}, data.group, Object.assign({}, model.groups[data.group], {
            errorMessages: data.errorMessages,
            valid: false
        })))
    });
}), _UPDATES$SET_INITIAL_);

},{"../constants":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveRealTimeValidationEvent = exports.getGroupValidityModel = exports.getValidityModel = exports.reduceGroupValidityModel = exports.getInitialModel = exports.removeUnvalidatableGroups = exports.reduceErrorMessages = exports.assembleValidationGroup = exports.validate = exports.normaliseValidators = undefined;

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

var reduceErrorMessages = exports.reduceErrorMessages = function reduceErrorMessages(group, model) {
    return function (acc, validity, j) {
        return validity === true ? acc : [].concat(_toConsumableArray(acc), [typeof validity === 'boolean' ? extractErrorMessage(model.groups[group].validators[j]) : validity]);
    };
};

var removeUnvalidatableGroups = exports.removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

var getInitialModel = exports.getInitialModel = function getInitialModel(form) {
    return {
        groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}))
    };
};

var reduceGroupValidityModel = exports.reduceGroupValidityModel = function reduceGroupValidityModel(acc, curr) {
    if (curr !== true) acc = false;
    return acc;
};

var getValidityModel = exports.getValidityModel = function getValidityModel(groups) {
    return Promise.all(Object.keys(groups).map(function (group) {
        return getGroupValidityModel(groups[group]);
    }));
};

var getGroupValidityModel = exports.getGroupValidityModel = function getGroupValidityModel(group) {
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

},{"../constants":4,"../constants/messages":5,"./methods":10,"./utils":11}],10:[function(require,module,exports){
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

},{"../constants":4,"./utils":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"../constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb25zdGFudHMvZGVmYXVsdHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvY29uc3RhbnRzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy9tZXNzYWdlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9tb2RlbC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91cGRhdGVzL2luZGV4LmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3ZhbGlkYXRvci9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi92YWxpZGF0b3IvbWV0aG9kcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi92YWxpZGF0b3IvdXRpbHMuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdmlldy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQztXQUFBLEFBQU8sWUFBWSxvQkFBQSxBQUFTLEtBQTVCLEFBQW1CLEFBQWMsQUFFakM7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQVpELEFBQWdDLENBQUE7O0FBY2hDLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7Ozs7Ozs7Ozs7QUNoQmxEOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsV0FBRCxBQUFZLE1BQVMsQUFDakM7S0FBSSxXQUFKLEFBRUE7O0tBQUcsT0FBQSxBQUFPLGNBQVAsQUFBcUIsWUFBWSxVQUFqQyxBQUEyQyxZQUFZLFVBQUEsQUFBVSxhQUFwRSxBQUFpRixRQUFRLE1BQU0sQ0FBL0YsQUFBeUYsQUFBTSxBQUFDLGdCQUMzRixNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQTdCLEFBQU0sQUFBYyxBQUEwQixBQUVuRDs7S0FBRyxJQUFBLEFBQUksV0FBSixBQUFlLEtBQUssT0FBcEIsQUFBMkIsa0JBQWtCLE9BQUEsQUFBTyxlQUFlLElBQXRFLEFBQWdELEFBQXNCLEFBQUksS0FDekUsT0FBTyxPQUFBLEFBQU8sZUFBZSxJQUE3QixBQUFPLEFBQXNCLEFBQUksQUFFbEM7O0FBQ0E7QUFDQTtRQUFPLE9BQUEsQUFBTyx3QkFDYixBQUFPLE9BQVAsQUFBYyxJQUFJLE9BQWxCLEFBQXlCLG9CQUFnQixBQUFJLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxJQUFPLEFBQ2hFO01BQUcsR0FBQSxBQUFHLGFBQU4sQUFBRyxBQUFnQixlQUFlLEFBQ2xDO01BQUEsQUFBSSxNQUFNLE9BQUEsQUFBTyxPQUFPLE9BQUEsQUFBTyxPQUFPLG1CQUFBLEFBQVEsSUFBSSxPQUFBLEFBQU8sT0FBUCxBQUFjLHdCQUFoRSxBQUFVLEFBQWMsQUFBYyxBQUFZLEFBQTRCLEFBQzlFO1NBQU8sR0FBQSxBQUFHLGFBQUgsQUFBZ0IsY0FBaEIsQUFBOEIsZUFBckMsQUFBb0QsQUFDcEQ7QUFKd0MsRUFBQSxFQUQxQyxBQUNDLEFBQXlDLEFBSXRDLEFBQ0osR0FMQztBQVpGOztBQW1CQTtBQUNBLEFBQ0M7SUFBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyxpQkFBdkIsQUFBYyxBQUEwQixTQUF4QyxBQUNFLFFBQVEsZ0JBQVEsQUFBRTtPQUFBLEFBQUssY0FBTCxBQUFtQixzQkFBc0IsS0FBekMsQUFBeUMsQUFBSyxBQUFRO0FBRDFFLEFBRUE7OztrQkFFYyxFQUFFLE0sQUFBRjs7Ozs7Ozs7a0IsQUM1QkE7Ozs7Ozs7O0FDQVIsSUFBTSwwQ0FBaUIsQ0FBQSxBQUFDLFNBQXhCLEFBQXVCLEFBQVU7O0FBRWpDLElBQU07V0FBTixBQUFrQixBQUNkO0FBRGMsQUFDckI7O0FBR0csSUFBTTt1QkFBVSxBQUNBLEFBQ25CO2tCQUZtQixBQUVMLEFBQ2Q7dUJBSG1CLEFBR0EsQUFDbkI7c0JBSm1CLEFBSUQsQUFDbEI7aUJBTEcsQUFBZ0IsQUFLTjtBQUxNLEFBQ25COztBQU9KO0FBQ08sSUFBTSxvQ0FBTixBQUFvQjs7QUFFM0I7QUFDTyxJQUFNLGdDQUFOLEFBQWtCOztBQUVsQixJQUFNLDBDQUFOLEFBQXVCOztBQUV2QixJQUFNLHNDQUFOLEFBQXFCOztBQUVyQixJQUFNLHNDQUFOLEFBQXFCOztBQUVyQixJQUFNLDhFQUFOLEFBQXlDOztBQUV6QyxJQUFNLG9EQUFzQixDQUFBLEFBQUMsMkJBQTdCLEFBQTRCLEFBQTRCOztBQUUvRDtBQUNPLElBQU07WUFDRCxDQUFBLEFBQUMsY0FEZ0IsQUFDakIsQUFBZSxBQUN2QjtrQkFBYyxDQUZXLEFBRVgsQUFBQyxBQUNmO1dBQU8sQ0FBQSxBQUFDLGFBSGlCLEFBR2xCLEFBQWMsQUFDckI7QUFDQTtBQUNBO2VBQVcsQ0FOYyxBQU1kLEFBQUMsQUFDWjtlQUFXLENBUGMsQUFPZCxBQUFDLEFBQ1o7V0FBTyxDQVJrQixBQVFsQixBQUFDLEFBQ1I7YUFBUyxDQVRnQixBQVNoQixBQUFDLEFBQ1Y7WUFBUSxDQUFBLEFBQUMsY0FBRCxBQUFlLDJCQVZFLEFBVWpCLEFBQTBDLGVBVi9DLEFBQXNCLEFBVXVDO0FBVnZDLEFBQ3pCOztBQVlHLElBQU0sNkNBQWtCLEFBQzNCLFlBRDJCLEFBRTNCLGdCQUYyQixBQUczQjtBQUNBO0FBSjJCLEFBSzNCLE9BTDJCLEVBQUEsQUFNM0IsVUFOMkIsQUFPM0IsT0FQMkIsQUFRM0IsVUFSMkIsQUFTM0IsYUFUMkIsQUFVM0IsU0FWMkIsQUFXM0IsV0FYRyxBQUF3QixBQVkzQjs7QUFJRyxJQUFNO1dBQW9CLEFBQ3RCLEFBQ1A7V0FGRyxBQUEwQixBQUV0QjtBQUZzQixBQUM3Qjs7Ozs7Ozs7O0FDN0RXLGtDQUNBLEFBQUU7ZUFBQSxBQUFPLEFBQTRCO0FBRHJDLEFBRVg7QUFGVyw0QkFFSCxBQUFFO2VBQUEsQUFBTyxBQUF3QztBQUY5QyxBQUdYO0FBSFcsZ0NBR0QsQUFBRTtlQUFBLEFBQU8sQUFBc0M7QUFIOUMsQUFJWDtBQUpXLHdCQUlOLEFBQUU7ZUFBQSxBQUFPLEFBQThCO0FBSmpDLEFBS1g7QUFMVywwQkFLSixBQUFFO2VBQUEsQUFBTyxBQUErQjtBQUxwQyxBQU1YO0FBTlcsZ0NBTUQsQUFBRTtlQUFBLEFBQU8sQUFBcUM7QUFON0MsQUFPWDtBQVBXLDhCQU9GLEFBQUU7ZUFBQSxBQUFPLEFBQWlDO0FBUHhDLEFBUVg7QUFSVyw4QkFRRixBQUFFO2VBQUEsQUFBTyxBQUE4QjtBQVJyQyxBQVNYO0FBVFcsa0NBQUEsQUFTRCxPQUFPLEFBQUU7OENBQUEsQUFBb0MsUUFBc0I7QUFUbEUsQUFVWDtBQVZXLGtDQUFBLEFBVUQsT0FBTyxBQUFFOzBDQUFBLEFBQWdDLFFBQXNCO0FBVjlELEFBV1g7QUFYVyxzQkFBQSxBQVdQLE9BQU0sQUFBRTsrREFBcUQsQ0FBckQsQUFBcUQsQUFBQyxTQUFZO0FBWG5FLEFBWVg7QUFaVyxzQkFBQSxBQVlQLE9BQU0sQUFBRTtrRUFBQSxBQUF3RCxRQUFTO0FBWmxFLEFBYVg7QUFiVyxnQ0FhRCxBQUFFO2VBQUEsQUFBTyxBQUF1QztBQWIvQyxBQWNYO0FBZFcsOEJBY0YsQUFBRTtlQUFBLEFBQU8sQUFBMkI7QSxBQWRsQztBQUFBLEFBQ1g7Ozs7Ozs7OztBQ0RKOzs7O0FBQ0E7O0FBQ0E7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxJQUFNLFdBQVcsU0FBWCxBQUFXLFlBQUssQUFDbEI7U0FBSyxFQUFMLEFBQUssQUFBRSxBQUNQO29CQUFBLEFBQU0sT0FBTyxtQkFBYixBQUFxQixjQUFyQixBQUFtQyxNQUFNLE9BQXpDLEFBRUE7O3FDQUFpQixnQkFBQSxBQUFNLFdBQXZCLEFBQWtDLFFBQWxDLEFBQ0ssS0FBSyx5QkFBaUI7WUFDbkI7O0FBQ0E7WUFBRyxLQUFLLEVBQUwsQUFBTyxVQUFVLFlBQUEsQUFBRyxzQ0FBSCxBQUFhLGdCQUFiLEFBQTRCLDRDQUFoRCxBQUFvQixBQUE2RCxPQUFPLE9BQU8sS0FBUCxBQUFPLEFBQUssQUFFcEc7O3dCQUFBLEFBQU0sT0FDRixtQkFESixBQUNZLDBCQUNSLEFBQU8sS0FBSyxnQkFBQSxBQUFNLFdBQWxCLEFBQTZCLFFBQTdCLEFBQ0ssT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU4sQUFBYSxHQUFNLEFBQ3ZCO3VCQUFPLEFBQUk7dUJBQ0EsY0FBQSxBQUFjLEdBQWQsQUFBaUIsNENBRFIsQUFDVCxBQUFrRCxBQUN6RDsrQkFBZSxjQUFBLEFBQWMsR0FBZCxBQUFpQixPQUFPLG9DQUFBLEFBQW9CLE9BQU8sZ0JBQW5ELEFBQXdCLEFBQTJCLEFBQU0sYUFGckUsQUFBYSxBQUVELEFBQXNFO0FBRnJFLEFBQ2hCLGFBREcsRUFBUCxBQUdHLEFBQ047QUFOTCxTQUFBLEVBRkosQUFFSSxBQU1PLEtBQ1AsT0FUSixBQVlBOztBQUNIO0FBbEJMLEFBbUJIO0FBdkJEOztBQXlCQSxJQUFNLFlBQVksU0FBWixBQUFZLFVBQUEsQUFBQyxNQUFELEFBQU8sV0FBUCxBQUFrQixRQUFsQixBQUEwQixTQUFZLEFBQ3BEO1FBQUcsU0FBQSxBQUFTLGFBQWEsY0FBdEIsQUFBb0MsYUFBYSxXQUFqRCxBQUE0RCxhQUFhLFlBQTVFLEFBQXdGLFdBQVcsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFDdkg7VUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFiLEFBQXdCLFdBQXhCLEFBQW1DLEtBQUssRUFBQyxNQUFELE1BQU8sUUFBUCxRQUFlLFNBQXZELEFBQXdDLEFBQzNDO0FBSEQ7O0FBTUEsSUFBTSxxQkFBcUIsU0FBckIsQUFBcUIscUJBQU0sQUFDN0I7UUFBSSxVQUFVLFNBQVYsQUFBVSxtQkFBQTtlQUFhLFlBQU0sQUFDN0I7Z0JBQUcsQ0FBQyxnQkFBQSxBQUFNLFdBQU4sQUFBaUIsT0FBakIsQUFBd0IsV0FBNUIsQUFBdUMsT0FBTyxnQkFBQSxBQUFNLE9BQU8sbUJBQWIsQUFBcUIsYUFBckIsQUFBa0MsV0FBVyxDQUFDLHNCQUE5QyxBQUE2QyxBQUFDLEFBQVcsQUFDdkc7a0RBQXNCLGdCQUFBLEFBQU0sV0FBTixBQUFpQixPQUF2QyxBQUFzQixBQUF3QixZQUE5QyxBQUNLLEtBQUssZUFBTyxBQUNUO29CQUFHLENBQUMsSUFBQSxBQUFJLDRDQUFSLEFBQUksQUFBcUMsdUJBQ3JDLEFBQU0sT0FDRixtQkFESixBQUNZOzJCQUNSLEFBQ1csQUFDUDttQ0FBZSxJQUFBLEFBQUksT0FBTyxvQ0FBQSxBQUFvQixXQUFXLGdCQUExQyxBQUFXLEFBQStCLEFBQU0sYUFKdkUsQUFFSSxBQUVtQixBQUE2RDtBQUZoRixBQUNJLGlCQUhSLEVBTUksQ0FBQyx1QkFOTCxBQU1JLEFBQUMsQUFBWSxBQUV4QjtBQVhMLEFBWUg7QUFkYTtBQUFkLEFBZ0JBOztXQUFBLEFBQU8sS0FBSyxnQkFBQSxBQUFNLFdBQWxCLEFBQTZCLFFBQTdCLEFBQXFDLFFBQVEscUJBQWEsQUFDdEQ7d0JBQUEsQUFBTSxXQUFOLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLE9BQW5DLEFBQTBDLFFBQVEsaUJBQVMsQUFDdkQ7a0JBQUEsQUFBTSxpQkFBaUIsK0NBQXZCLEFBQXVCLEFBQStCLFFBQVEsUUFBOUQsQUFBOEQsQUFBUSxBQUN6RTtBQUZELEFBR0E7WUFBSSxtQ0FBbUIsQUFBTSxXQUFOLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFdBQW5DLEFBQThDLE9BQU8scUJBQUE7bUJBQWEsVUFBQSxBQUFVLFNBQXZCLEFBQWdDO0FBQTVHLEFBQXVCLEFBRXZCLFNBRnVCOzt5QkFFdkIsQUFBaUIsU0FBakIsQUFBMEIsc0JBQ25CLEFBQWlCLEdBQWpCLEFBQW9CLE9BQXBCLEFBQTJCLE1BQTNCLEFBQWlDLFFBQVEsb0JBQVksQUFDcEQ7cUJBQUEsQUFBUyxRQUFRLGdCQUFRLEFBQUU7cUJBQUEsQUFBSyxpQkFBTCxBQUFzQixRQUFRLFFBQTlCLEFBQThCLEFBQVEsQUFBYztBQUEvRSxBQUNIO0FBSEwsQUFDTyxBQUdWLFNBSFU7QUFQWCxBQVdIO0FBNUJEOztrQkE4QmUsVUFBQSxBQUFDLE1BQUQsQUFBTyxVQUFhLEFBQy9CO29CQUFBLEFBQU0sT0FBTyxtQkFBYixBQUFxQixtQkFBb0IsZ0NBQXpDLEFBQXlDLEFBQWdCLEFBRXpEOztTQUFBLEFBQUssaUJBQUwsQUFBc0IsVUFBdEIsQUFBZ0MsQUFFaEM7O1NBQUEsQUFBSyxpQkFBTCxBQUFzQixTQUFTLFlBQU0sQUFBRTt3QkFBQSxBQUFNLE9BQU8sbUJBQWIsQUFBcUIsY0FBckIsQUFBbUMsTUFBTSxPQUF6QyxBQUEwRDtBQUFqRyxBQUVBOzs7a0JBQU8sQUFFSDttQkFGSixBQUFPLEFBSVY7QUFKVSxBQUNIO0E7Ozs7Ozs7OztBQ3RGUjs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUVBLElBQUksUUFBSixBQUFZOztBQUVaLE9BQUEsQUFBTyxnQkFBUCxBQUF1Qjs7QUFFdkIsSUFBTSxXQUFXLFNBQVgsQUFBVyxXQUFBO1dBQUEsQUFBTTtBQUF2Qjs7QUFFQSxJQUFNLFNBQVMsU0FBVCxBQUFTLE9BQUEsQUFBUyxNQUFULEFBQWUsV0FBZixBQUEwQixTQUFTLEFBQzlDO1lBQVEsWUFBWSxrQkFBQSxBQUFRLE1BQVIsQUFBYyxPQUExQixBQUFZLEFBQXFCLGFBQXpDLEFBQXNELEFBQ3REO0FBQ0E7WUFBQSxBQUFRLHdCQUFSLEFBQWMsTUFBZCxBQUFxQixBQUNyQjtRQUFHLENBQUgsQUFBSSxTQUFTLEFBQ2I7WUFBQSxBQUFRLFFBQVEsa0JBQVUsQUFDdEI7ZUFBQSxBQUFPLEFBQ1Y7QUFGRCxBQUdIO0FBUkQ7OztZQVVlLEFBRVg7YyxBQUZXO0FBQUEsQUFDWDs7Ozs7Ozs7Ozs7QUNwQko7Ozs7Ozs7Ozs7c0ZBR0ssbUIsQUFBUSxtQkFBb0IsVUFBQSxBQUFDLE9BQUQsQUFBUSxNQUFSO1dBQWlCLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQixPQUFuQyxBQUFpQixBQUF5QjtBLDJDQUN0RSxtQixBQUFRLGNBQWUsaUJBQUE7a0JBQVMsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjt1QkFDdkMsQUFBTyxLQUFLLE1BQVosQUFBa0IsUUFBbEIsQUFBMEIsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDckQ7Z0JBQUEsQUFBSSxnQkFBUyxBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQUEsQUFBTSxPQUF4QixBQUFrQixBQUFhOytCQUFRLEFBQ2pDLEFBQ2Y7dUJBRkosQUFBYSxBQUF1QyxBQUV6QyxBQUVYO0FBSm9ELEFBQ2hELGFBRFM7bUJBSWIsQUFBTyxBQUNWO0FBTk8sU0FBQSxFQURZLEFBQVMsQUFBeUIsQUFDOUMsQUFNTDtBQVBtRCxBQUN0RCxLQUQ2QjtBLDJDQVNoQyxtQixBQUFRLGFBQWMsVUFBQSxBQUFDLE9BQUQsQUFBUSxNQUFSO2tCQUFpQixBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCO3VCQUM5QyxBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQWxCLEFBQXdCLDRCQUF4QixBQUNILGFBQU8sQUFBTyxPQUFQLEFBQWMsSUFBSSxNQUFBLEFBQU0sT0FBeEIsQUFBa0IsQUFBYTsyQkFBTyxBQUMzQixBQUNmO21CQUpXLEFBQWlCLEFBQXlCLEFBQ3JELEFBQ0ksQUFBc0MsQUFFbkM7QUFGbUMsQUFDMUMsU0FESSxFQURKO0FBRHFELEFBQzdELEtBRG9DO0EsMkNBUXZDLG1CLEFBQVEsbUJBQW9CLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUyxBQUMxQztrQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCO3VCQUNiLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQ3JEO2dCQUFBLEFBQUksU0FBUyxPQUFBLEFBQU8sT0FBUCxBQUFjLElBQUksTUFBQSxBQUFNLE9BQXhCLEFBQWtCLEFBQWEsUUFBUSxLQUFwRCxBQUFhLEFBQXVDLEFBQUssQUFDekQ7bUJBQUEsQUFBTyxBQUNWO0FBSE8sU0FBQSxFQURaLEFBQU8sQUFBeUIsQUFDcEIsQUFHTCxBQUVWO0FBTm1DLEFBQzVCLEtBREc7QSwyQ0FPVixtQixBQUFRLGtCQUFtQixVQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVMsQUFDekM7a0JBQU8sQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjt1QkFDYixBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQWxCLEFBQXdCLDRCQUMzQixLQURHLEFBQ0UsY0FBUSxBQUFPLE9BQVAsQUFBYyxJQUFJLE1BQUEsQUFBTSxPQUFPLEtBQS9CLEFBQWtCLEFBQWtCOzJCQUMvQixLQUR1QyxBQUNsQyxBQUNwQjttQkFKWixBQUFPLEFBQXlCLEFBQ3BCLEFBQ1UsQUFBNEMsQUFFL0MsQUFJdEI7QUFOcUUsQUFDdEQsU0FEVSxFQURWO0FBRG9CLEFBQzVCLEtBREc7QTs7Ozs7Ozs7OztBQzlCZjs7OztBQUNBOzs7O0FBQ0E7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLElBQU0sZUFBZSxTQUFmLEFBQWUsYUFBQSxBQUFDLE9BQUQsQUFBUSxPQUFVLEFBQ25DO1FBQUksUUFBUSxNQUFBLEFBQU0sMkJBQWxCLEFBQVksQUFBK0IsQUFDM0M7K0JBQVUsTUFBQSxBQUFNLE1BQU4sQUFBWSxLQUF0QixBQUFVLEFBQWlCLElBQUssQ0FBQyxDQUFDLENBQUMsK0JBQUEsQUFBb0IsUUFBdkIsQUFBRyxBQUE0QixTQUNiLGtDQUFBLEFBQXNCLE9BRHhDLEFBQ2tCLEFBQTZCLFNBRC9FLEFBRWtELEFBQ3JEO0FBTEQ7O0FBT0EsSUFBTSxnQkFBZ0IsU0FBaEIsQUFBZ0IsY0FBQSxBQUFDLE9BQUQsQUFBUSxTQUFSO1dBQW9CLHlCQUFBLEFBQWMsYUFDVixpQ0FBUSxBQUFjLFNBQWQsQUFBdUIsT0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWdCLE1BQUEsQUFBTSwyQkFBTixBQUErQixTQUFXLE9BQUEsQUFBTyxPQUFQLEFBQWMsS0FBSyxhQUFBLEFBQWEsT0FBMUUsQUFBMEMsQUFBbUIsQUFBb0IsVUFBakcsQUFBMkc7QUFBekksU0FBQSxFQURaLEFBQ0UsQUFBVSxBQUE4SSxHQUF4SixLQUR0QixBQUVzQjtBQUY1Qzs7QUFJQSxJQUFNLDJCQUEyQixTQUEzQixBQUEyQixnQ0FBQTtzQ0FBUyxBQUFnQixPQUFPLFVBQUEsQUFBQyxZQUFELEFBQWEsU0FBYjtlQUNMLENBQUMsTUFBQSxBQUFNLDJCQUFQLEFBQUMsQUFBK0IsV0FBaEMsQUFDRSwwQ0FERixBQUVNLHFCQUNGLEFBQU87a0JBQU8sQUFDSixBQUNOLE9BRlUsQUFDVjtxQkFDUyxNQUFBLEFBQU0sMkJBRm5CLEFBQWMsQUFFRCxBQUErQixVQUY1QyxFQUdJLGNBQUEsQUFBYyxPQVBqQixBQUNMLEFBR0ksQUFHSSxBQUFxQjtBQVAvQyxLQUFBLEVBQVQsQUFBUyxBQVVjO0FBVnhEOztBQVlBLElBQU0sd0JBQXdCLFNBQXhCLEFBQXdCLDZCQUFBO1dBQVMsaUJBQUssTUFBTCxBQUFLLEFBQU0sUUFBUSxJQUFuQixBQUFtQixBQUFJLFFBQVEsT0FBL0IsQUFBK0IsQUFBTyxRQUFRLFVBQTlDLEFBQThDLEFBQVUsUUFBUSxVQUFoRSxBQUFnRSxBQUFVLFFBQVEsSUFBbEYsQUFBa0YsQUFBSSxRQUFRLElBQTlGLEFBQThGLEFBQUksUUFBUSxRQUExRyxBQUEwRyxBQUFRLFFBQVEsU0FBbkksQUFBUyxBQUEwSCxBQUFTO0FBQTFLOztBQUVBO0FBQ0EsSUFBTSxXQUFXLFNBQVgsQUFBVyxnQkFBQTtXQUFTLFlBQUE7WUFBQSxBQUFDLGlGQUFELEFBQWM7ZUFBUSxNQUFBLEFBQU0sYUFBTixBQUFtQixlQUFlLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFyRCxBQUFxRSx1Q0FBckUsQUFBbUYsY0FBWSxFQUFDLE1BQWhHLEFBQStGLEFBQU8saUJBQTVILEFBQTJJO0FBQXBKO0FBQWpCO0FBQ0EsSUFBTSxRQUFRLFNBQVIsQUFBUSxhQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFRLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFlBQW5CLEFBQStCLHVDQUEvQixBQUE2QyxjQUFZLEVBQUMsTUFBMUQsQUFBeUQsQUFBTyxjQUF0RixBQUFrRztBQUEzRztBQUFkO0FBQ0EsSUFBTSxNQUFNLFNBQU4sQUFBTSxXQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFRLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFlBQW5CLEFBQStCLHFDQUEvQixBQUEyQyxjQUFZLEVBQUMsTUFBeEQsQUFBdUQsQUFBTyxZQUFwRixBQUE4RjtBQUF2RztBQUFaO0FBQ0EsSUFBTSxTQUFTLFNBQVQsQUFBUyxjQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFRLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFlBQW5CLEFBQStCLHdDQUEvQixBQUE4QyxjQUFZLEVBQUMsTUFBM0QsQUFBMEQsQUFBTyxlQUF2RixBQUFvRztBQUE3RztBQUFmO0FBQ0EsSUFBTSxZQUFZLFNBQVosQUFBWSxpQkFBQTtXQUFTLFlBQUE7WUFBQSxBQUFDLGlGQUFELEFBQWM7ZUFBUyxNQUFBLEFBQU0sYUFBTixBQUFtQixnQkFBZ0IsTUFBQSxBQUFNLGFBQU4sQUFBbUIsaUJBQXZELEFBQXdFLHVDQUF4RSxBQUF1RixjQUFZLEVBQUMsTUFBRCxBQUFPLGFBQWEsUUFBUSxFQUFFLEtBQUssTUFBQSxBQUFNLGFBQTVJLEFBQW1HLEFBQTRCLEFBQU8sQUFBbUIscUJBQS9LLEFBQWlNO0FBQTFNO0FBQWxCO0FBQ0EsSUFBTSxZQUFZLFNBQVosQUFBWSxpQkFBQTtXQUFTLFlBQUE7WUFBQSxBQUFDLGlGQUFELEFBQWM7ZUFBUyxNQUFBLEFBQU0sYUFBTixBQUFtQixnQkFBZ0IsTUFBQSxBQUFNLGFBQU4sQUFBbUIsaUJBQXZELEFBQXdFLHVDQUF4RSxBQUF1RixjQUFZLEVBQUMsTUFBRCxBQUFPLGFBQWEsUUFBUSxFQUFFLEtBQUssTUFBQSxBQUFNLGFBQTVJLEFBQW1HLEFBQTRCLEFBQU8sQUFBbUIscUJBQS9LLEFBQWlNO0FBQTFNO0FBQWxCO0FBQ0EsSUFBTSxNQUFNLFNBQU4sQUFBTSxXQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFVBQVUsTUFBQSxBQUFNLGFBQU4sQUFBbUIsV0FBakQsQUFBNEQsdUNBQTVELEFBQTJFLGNBQVksRUFBQyxNQUFELEFBQU8sT0FBTyxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBMUgsQUFBdUYsQUFBc0IsQUFBTyxBQUFtQixlQUE3SixBQUF5SztBQUFsTDtBQUFaO0FBQ0EsSUFBTSxNQUFNLFNBQU4sQUFBTSxXQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLFVBQVUsTUFBQSxBQUFNLGFBQU4sQUFBbUIsV0FBakQsQUFBNEQsdUNBQTVELEFBQTJFLGNBQVksRUFBQyxNQUFELEFBQU8sT0FBTyxRQUFRLEVBQUUsS0FBSyxNQUFBLEFBQU0sYUFBMUgsQUFBdUYsQUFBc0IsQUFBTyxBQUFtQixlQUE3SixBQUF5SztBQUFsTDtBQUFaO0FBQ0EsSUFBTSxVQUFVLFNBQVYsQUFBVSxlQUFBO1dBQVMsWUFBQTtZQUFBLEFBQUMsaUZBQUQsQUFBYztlQUFTLE1BQUEsQUFBTSxhQUFOLEFBQW1CLGNBQWMsTUFBQSxBQUFNLGFBQU4sQUFBbUIsZUFBckQsQUFBb0UsdUNBQXBFLEFBQW1GLGNBQVksRUFBQyxNQUFELEFBQU8sV0FBVyxRQUFRLEVBQUUsT0FBTyxNQUFBLEFBQU0sYUFBeEksQUFBK0YsQUFBMEIsQUFBUyxBQUFtQixtQkFBM0ssQUFBMkw7QUFBcE07QUFBaEI7O0FBRU8sSUFBTSxvREFBc0IsU0FBdEIsQUFBc0IsMkJBQUE7V0FBUyxNQUFBLEFBQU0sYUFBTixBQUFtQixnQkFBbkIsQUFBbUMsU0FDakMseUJBREYsQUFDRSxBQUF5QixTQUN6QixzQkFGWCxBQUVXLEFBQXNCO0FBRjdEOztBQUlBLElBQU0sOEJBQVcsU0FBWCxBQUFXLFNBQUEsQUFBQyxPQUFELEFBQVEsV0FBUjtXQUFzQixVQUFBLEFBQVUsU0FDUixVQUFBLEFBQVUsT0FBTyxrQ0FBakIsQUFBaUIsQUFBc0IsUUFBUSxNQURqRCxBQUNFLEFBQXFELFVBQ3JELGtCQUFRLFVBQVIsQUFBa0IsTUFBbEIsQUFBd0IsT0FBTyxVQUZ2RCxBQUV3QixBQUF5QztBQUZsRjs7QUFJQSxJQUFNLDREQUEwQixTQUExQixBQUEwQix3QkFBQSxBQUFDLEtBQUQsQUFBTSxPQUFVLEFBQ25EO1FBQUksT0FBTyxNQUFBLEFBQU0sYUFBakIsQUFBVyxBQUFtQixBQUM5QjtlQUFPLEFBQUksUUFBUSxJQUFBLEFBQUksUUFBUSxPQUFBLEFBQU8sT0FBTyxJQUFkLEFBQWMsQUFBSSxPQUFPLEVBQUUscUNBQVksSUFBQSxBQUFJLE1BQWhCLEFBQXNCLFVBQTdELEFBQVksQUFBeUIsQUFBRSxBQUE4QjtlQUN6RCxBQUNhLEFBQ1I7b0JBQVksb0JBRmpCLEFBRWlCLEFBQW9CLEFBQ2hDO2dCQUFRLENBSGIsQUFHYSxBQUFDLEFBQ1Q7eUJBQWlCLFNBQUEsQUFBUyx3RUFBc0QsTUFBQSxBQUFNLGFBQXJFLEFBQStELEFBQW1CLGtCQUxoSSxBQUN3QixBQUl1SDtBQUp2SCxBQUNLLEtBRjdCLEVBQVAsQUFNbUMsQUFDdEM7QUFUTTs7QUFXUCxJQUFNLHNCQUFzQixTQUF0QixBQUFzQiwrQkFBQTtXQUFhLFVBQUEsQUFBVSxXQUFXLG1CQUFTLFVBQVQsQUFBbUIsTUFBTSxVQUFBLEFBQVUsV0FBVixBQUFxQixZQUFZLFVBQWpDLEFBQTJDLFNBQXRHLEFBQWtDLEFBQTZFO0FBQTNJOztBQUVPLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQUMsT0FBRCxBQUFRLE9BQVI7V0FBa0IsVUFBQSxBQUFDLEtBQUQsQUFBTSxVQUFOLEFBQWdCLEdBQU0sQUFDdkU7ZUFBTyxhQUFBLEFBQWEsT0FBYixBQUNPLG1DQURQLEFBRVcsT0FBSyxPQUFBLEFBQU8sYUFBUCxBQUFvQixZQUNqQixvQkFBb0IsTUFBQSxBQUFNLE9BQU4sQUFBYSxPQUFiLEFBQW9CLFdBRDNDLEFBQ0csQUFBb0IsQUFBK0IsTUFIN0UsQUFBTyxBQUltQixBQUM3QjtBQU5rQztBQUE1Qjs7QUFRQSxJQUFNLGdFQUE0QixTQUE1QixBQUE0QixrQ0FBVSxBQUMvQztRQUFJLG1CQUFKLEFBQXVCLEFBRXZCOztTQUFJLElBQUosQUFBUSxTQUFSLEFBQWlCLFFBQ2I7WUFBRyxPQUFBLEFBQU8sT0FBUCxBQUFjLFdBQWQsQUFBeUIsU0FBNUIsQUFBcUMsR0FDakMsaUJBQUEsQUFBaUIsU0FBUyxPQUZsQyxBQUVRLEFBQTBCLEFBQU87QUFFekMsWUFBQSxBQUFPLEFBQ1Y7QUFSTTs7QUFVQSxJQUFNLDRDQUFrQixTQUFsQixBQUFrQixzQkFBQTs7Z0JBQ25CLDBCQUEwQixHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssS0FBQSxBQUFLLGlCQUFuQixBQUFjLEFBQXNCLCtDQUFwQyxBQUNqQixPQURpQixBQUNWLHlCQUZHLEFBQVMsQUFDNUIsQUFBMEIsQUFDZTtBQUZiLEFBQ3BDO0FBREc7O0FBS0EsSUFBTSw4REFBMkIsU0FBM0IsQUFBMkIseUJBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUNuRDtRQUFHLFNBQUgsQUFBWSxNQUFNLE1BQUEsQUFBTSxBQUN4QjtXQUFBLEFBQU8sQUFDVjtBQUhNOztBQUtBLElBQU0sOENBQW1CLFNBQW5CLEFBQW1CLHlCQUFVLEFBQ3RDO21CQUFPLEFBQVEsV0FDWCxBQUFPLEtBQVAsQUFBWSxRQUFaLEFBQ0ssSUFBSSxpQkFBQTtlQUFTLHNCQUFzQixPQUEvQixBQUFTLEFBQXNCLEFBQU87QUFGbkQsQUFBTyxBQUNILEFBR1AsS0FITyxDQURHO0FBREo7O0FBT0EsSUFBTSx3REFBd0IsU0FBeEIsQUFBd0IsNkJBQVMsQUFDMUM7UUFBSSxXQUFKLEFBQWUsQUFDbEI7bUJBQU8sQUFBUSxVQUFJLEFBQU0sV0FBTixBQUFpQixJQUFJLHFCQUFhLEFBQzlDO21CQUFPLEFBQUksUUFBUSxtQkFBVyxBQUMxQjtnQkFBRyxVQUFBLEFBQVUsU0FBYixBQUFzQixVQUFTLEFBQzNCO29CQUFHLFNBQUEsQUFBUyxPQUFaLEFBQUcsQUFBZ0IsWUFBWSxRQUEvQixBQUErQixBQUFRLFdBQ2xDLEFBQ0Q7K0JBQUEsQUFBVyxBQUNYOzRCQUFBLEFBQVEsQUFDWDtBQUNKO0FBTkQsbUJBTU8sSUFBQSxBQUFHLFVBQVUsUUFBYixBQUFhLEFBQVEscUJBQ25CLEFBQVMsT0FBVCxBQUFnQixXQUFoQixBQUNJLEtBQUssZUFBTyxBQUFFO3dCQUFBLEFBQVEsQUFBTTtBQURoQyxBQUVaLGFBRlk7QUFSYixBQUFPLEFBV1YsU0FYVTtBQURkLEFBQU8sQUFBWSxBQWFuQixLQWJtQixDQUFaO0FBRkQ7O0FBaUJBLElBQU0sMEVBQWlDLFNBQWpDLEFBQWlDLHNDQUFBO1dBQVMsQ0FBQSxBQUFDLFNBQUQsQUFBVSxVQUFVLE9BQU8sd0JBQUEsQUFBWSxVQUFVLHFCQUF0QixBQUFzQixBQUFTLFVBQVUsbUJBQTdFLEFBQVMsQUFBb0IsQUFBZ0QsQUFBTztBQUEzSDs7Ozs7Ozs7O0FDOUhQOztBQUNBOztBQUVBLElBQU0sYUFBYSxTQUFiLEFBQWEsa0JBQUE7V0FBUyxDQUFDLHVCQUFELEFBQUMsQUFBVyxVQUFVLGtDQUFBLEFBQXNCLFdBQXJELEFBQWdFO0FBQW5GOztBQUVBLElBQU0sMEJBQTBCLFNBQTFCLEFBQTBCLHdCQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVI7aUJBQWlCLEFBQU0sV0FBTixBQUFpQixPQUFPLHFCQUFBO2VBQWEsVUFBQSxBQUFVLFNBQXZCLEFBQWdDO0FBQXhELEtBQUEsRUFBQSxBQUE4RCxHQUEvRSxBQUFrRjtBQUFsSDs7QUFFQSxJQUFNLG1CQUFtQixTQUFuQixBQUFtQix3QkFBQTtXQUFTLGlCQUFBO2VBQVMsV0FBQSxBQUFXLGdCQUFTLEFBQU0sT0FBTixBQUFhLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLE1BQUEsQUFBTSxLQUFLLE1BQWpCLEFBQU0sQUFBaUIsUUFBeEMsQUFBZ0Q7QUFBcEUsU0FBQSxFQUE3QixBQUE2QixBQUEwRTtBQUFoSDtBQUF6Qjs7QUFFQSxJQUFNLG1CQUFtQixTQUFuQixBQUFtQixpQkFBQSxBQUFDLE1BQUQsQUFBTyxTQUFQO1dBQW1CLGlCQUFBO2VBQVMsV0FBQSxBQUFXLFVBQVUsTUFBQSxBQUFNLE9BQU4sQUFBYSxPQUFPLFFBQVEsd0JBQUEsQUFBd0IsT0FBcEQsQUFBb0IsQUFBUSxBQUErQixRQUF6RixBQUE4QixBQUFtRTtBQUFwSDtBQUF6Qjs7O2NBR2MseUJBQUE7ZUFBUyxrQ0FBQSxBQUFzQixXQUEvQixBQUEwQztBQUR6QyxBQUVYO1dBQU8sNEJBRkksQUFHWDtTQUFLLDRCQUhNLEFBSVg7VUFBTSxxQkFBQTtlQUFTLFdBQUEsQUFBVyxnQkFBUyxBQUFNLE9BQU4sQUFBYSxPQUFPLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxDQUFDLGNBQUEsQUFBYyxLQUFLLElBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxPQUF6QyxBQUFPLEFBQW1CLEFBQXNCLGFBQWpFLEFBQThFO0FBQWxHLFNBQUEsRUFBN0IsQUFBNkIsQUFBd0c7QUFKaEksQUFLWDthQUFTLDRCQUxFLEFBTVg7WUFBUSw0QkFORyxBQU9YO1lBQVEsNEJBUEcsQUFRWDtnQ0FBVyxBQUNQLGFBQ0Esa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sTUFBQSxBQUFNLFFBQVEsTUFBZCxBQUFvQixTQUFTLE1BQUEsQUFBTSxNQUFOLEFBQVksVUFBVSxDQUFDLE9BQXBELEFBQTJELE1BQU0sQ0FBQyxNQUFBLEFBQU0sTUFBUCxBQUFhLFVBQVUsQ0FBQyxPQUEvRixBQUFzRyxLQUF2SCxBQUE0SDtBQUF0STtBQVZPLEFBUUEsQUFJWCxLQUpXO2dDQUlBLEFBQ1AsYUFDQSxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxNQUFBLEFBQU0sUUFBUSxNQUFkLEFBQW9CLFNBQVMsTUFBQSxBQUFNLE1BQU4sQUFBWSxVQUFVLENBQUMsT0FBcEQsQUFBMkQsTUFBTSxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQS9GLEFBQXNHLEtBQXZILEFBQTRIO0FBQXRJO0FBZE8sQUFZQSxBQUlYLEtBSlc7OEJBSUYsQUFBaUIsV0FBVyxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBVSxBQUMzRDttQkFBTyxhQUFNLEFBQU8sTUFBUCxBQUFhLE9BQU8sVUFBQSxBQUFDLGFBQUQsQUFBYyxVQUFhLEFBQ3hEO29CQUFHLGtDQUFBLEFBQXNCLGNBQWMsTUFBdkMsQUFBNkMsT0FBTyxjQUFBLEFBQWMsQUFDbEU7dUJBQUEsQUFBTyxBQUNWO0FBSFksYUFBQSxFQUFOLEFBQU0sQUFHVixPQUhILEFBR1UsQUFDYjtBQUxvQztBQWhCMUIsQUFnQkYsQUFNVCxLQU5TOzhCQU1BLEFBQWlCLFdBQVcsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU0sT0FBTyxPQUFQLEFBQWMsT0FBZCxBQUFxQixLQUFLLE1BQWhDLEFBQU0sQUFBZ0MsUUFBdkQsQUFBK0Q7QUFBekU7QUF0QjFCLEFBc0JGLEFBQ1QsS0FEUzs0QkFDRixBQUFpQixTQUFTLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLE9BQU8sT0FBUCxBQUFjLE9BQWQsQUFBcUIsS0FBSyxNQUFoQyxBQUFNLEFBQWdDLFFBQXZELEFBQStEO0FBQXpFO0FBdkJ0QixBQXVCSixBQUNQLEtBRE87MEJBQ0YsQUFBaUIsT0FBTyxrQkFBQTtlQUFVLFVBQUEsQUFBQyxLQUFELEFBQU0sT0FBTjttQkFBaUIsTUFBTSxDQUFDLE1BQUQsQUFBTyxTQUFTLENBQUMsT0FBdkIsQUFBOEIsS0FBL0MsQUFBb0Q7QUFBOUQ7QUF4QmxCLEFBd0JOLEFBQ0wsS0FESzswQkFDQSxBQUFpQixPQUFPLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFNLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxPQUF2QixBQUE4QixLQUEvQyxBQUFvRDtBQUE5RDtBQXpCbEIsQUF5Qk4sQUFDTCxLQURLOzZCQUNHLEFBQWlCLFVBQVUsa0JBQUE7ZUFBVSxVQUFBLEFBQUMsS0FBRCxBQUFNLE9BQU47bUJBQWlCLE1BQU8sQ0FBQyxNQUFBLEFBQU0sTUFBUCxBQUFhLFVBQVUsQ0FBQyxPQUF4QixBQUErQixRQUFRLE9BQUEsQUFBTyxRQUFQLEFBQWUsYUFBYSxDQUFDLE1BQUEsQUFBTSxNQUFQLEFBQWEsVUFBVSxDQUFDLE9BQWxHLEFBQU8sQUFBa0csTUFBMUgsQUFBaUk7QUFBM0k7QUExQnhCLEFBMEJILEFBQ1IsS0FEUTs0QkFDRCxBQUFpQixTQUFTLGtCQUFBO2VBQVUsVUFBQSxBQUFDLEtBQUQsQUFBTSxPQUFOO21CQUFpQixNQUFPLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxPQUFqQixBQUF3QixPQUFPLENBQUMsTUFBRCxBQUFPLFNBQVMsQ0FBQyxPQUF2RCxBQUE4RCxLQUEvRSxBQUFxRjtBQUEvRjtBQTNCdEIsQUEyQkosQUFDUCxLQURPO1lBQ0MsZ0JBQUEsQUFBQyxPQUFELEFBQVEsUUFBUjttQkFBbUIsQUFBSSxRQUFRLFVBQUEsQUFBQyxTQUFELEFBQVUsUUFBVyxBQUN4RDs4QkFBTyxPQUFBLEFBQU8sU0FBUCxBQUFnQixRQUFRLE9BQXhCLEFBQStCLE1BQVMsT0FBeEMsQUFBK0MsWUFBTyw2QkFBaUIsT0FBOUUsQUFBNkQsQUFBd0I7d0JBQ3pFLE9BQUEsQUFBTyxLQUR3RixBQUMvRixBQUFZLEFBQ3BCO3NCQUFNLE9BQUEsQUFBTyxTQUFQLEFBQWdCLFFBQWhCLEFBQXdCLE9BQU8sNkJBQWlCLE9BRmlELEFBRWxFLEFBQXdCLEFBQzdEOzZCQUFTLEFBQUk7b0NBSGpCLEFBQTJHLEFBRzlGLEFBQVksQUFDRDtBQURDLEFBQ2pCLGlCQURLO0FBSDhGLEFBQ3ZHLGVBREosQUFPQyxLQUFLLGVBQUE7dUJBQU8sSUFBUCxBQUFPLEFBQUk7QUFQakIsZUFBQSxBQVFDLEtBQUssZ0JBQVEsQUFBRTt3QkFBQSxBQUFRLEFBQVE7QUFSaEMsZUFBQSxBQVNDLE1BQU0sZUFBTyxBQUFFOzJDQUFBLEFBQXlCLEFBQVM7QUFUbEQsQUFVSDtBQVhPLEFBQW1CLFNBQUE7QSxBQTVCaEI7QUFBQSxBQUNYOzs7Ozs7OztBQ1pHLElBQU0sb0NBQWMsU0FBZCxBQUFjLG1CQUFBO0FBQVUsV0FBRCxtQkFBQSxBQUFvQixLQUFLLE1BQWxDLEFBQVMsQUFBK0I7O0FBQTVEOztBQUVBLElBQU0sMEJBQVMsU0FBVCxBQUFTLGNBQUE7V0FBUyxNQUFBLEFBQU0sYUFBTixBQUFtQixZQUE1QixBQUF3QztBQUF2RDs7QUFFQSxJQUFNLDhCQUFXLFNBQVgsQUFBVyxnQkFBQTtXQUFTLE1BQUEsQUFBTSxTQUFOLEFBQWUsa0JBQXhCLEFBQTBDO0FBQTNEOztBQUVBLElBQU0sa0NBQWEsU0FBYixBQUFhLGtCQUFBO2lCQUFTLEFBQU0sV0FBTixBQUFpQixPQUFPLHFCQUFBO2VBQWEsVUFBQSxBQUFVLFNBQXZCLEFBQWdDO0FBQXhELEtBQUEsRUFBQSxBQUFvRSxTQUE3RSxBQUFzRjtBQUF6Rzs7QUFFUCxJQUFNLFdBQVcsU0FBWCxBQUFXLGdCQUFBO1dBQVUsTUFBQSxBQUFNLFVBQU4sQUFBZ0IsYUFBYSxNQUFBLEFBQU0sVUFBbkMsQUFBNkMsUUFBUSxNQUFBLEFBQU0sTUFBTixBQUFZLFNBQTNFLEFBQW9GO0FBQXJHOztBQUVPLElBQU0sZ0RBQW9CLFNBQXBCLEFBQW9CLGtCQUFBLEFBQUMsS0FBRCxBQUFNLE9BQVUsQUFDN0M7UUFBRyxDQUFDLFlBQUQsQUFBQyxBQUFZLFVBQVUsU0FBMUIsQUFBMEIsQUFBUyxRQUFRLE1BQU0sTUFBTixBQUFZLEFBQ3ZEO1FBQUcsWUFBQSxBQUFZLFVBQVUsTUFBekIsQUFBK0IsU0FBUyxBQUNwQztZQUFHLE1BQUEsQUFBTSxRQUFULEFBQUcsQUFBYyxNQUFNLElBQUEsQUFBSSxLQUFLLE1BQWhDLEFBQXVCLEFBQWUsWUFDakMsTUFBTSxDQUFDLE1BQVAsQUFBTSxBQUFPLEFBQ3JCO0FBQ0Q7V0FBQSxBQUFPLEFBQ1Y7QUFQTTs7QUFTQSxJQUFNLDhDQUFtQixTQUFuQixBQUFtQiw2QkFBQTtzQkFBYyxBQUFXLElBQUksVUFBQSxBQUFDLE9BQVUsQUFDcEU7ZUFBVSxNQUFBLEFBQU0sR0FBTixBQUFTLGFBQW5CLEFBQVUsQUFBc0IsZ0JBQVcsc0JBQTNDLEFBQTJDLEFBQXNCLEFBQ3BFO0FBRjZDLEtBQUEsRUFBQSxBQUUzQyxLQUY2QixBQUFjLEFBRXRDO0FBRkQ7O0FBSUEsSUFBTSx3REFBd0IsU0FBeEIsQUFBd0Isc0JBQUEsQUFBQyxNQUFELEFBQU8sT0FBUDtnQkFBaUIsQUFBSyxNQUFMLEFBQVcsS0FBWCxBQUNMLElBQUksZ0JBQVEsQUFDVDtZQUFJLG1CQUFtQixxQkFBcUIsa0JBQUEsQUFBa0IsTUFBTSxlQUFlLE1BQUEsQUFBTSxhQUF6RixBQUF1QixBQUFxQixBQUF3QixBQUFlLEFBQW1CLEFBQ3RHO2VBQU8sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyw0QkFBVCxBQUFtQyxtQkFBeEQsQUFBTyxBQUNWO0FBSlosQUFBaUIsS0FBQTtBQUEvQzs7QUFNUCxJQUFNLHVCQUF1QixTQUF2QixBQUF1Qiw0QkFBQTtXQUFTLE1BQUEsQUFBTSxRQUFOLEFBQWMsMENBQXZCLEFBQVMsQUFBd0Q7QUFBOUY7O0FBRUEsSUFBTSxpQkFBaUIsU0FBakIsQUFBaUIsMEJBQUE7V0FBYSxVQUFBLEFBQVUsT0FBVixBQUFpQixHQUFHLFVBQUEsQUFBVSxZQUFWLEFBQXNCLE9BQXZELEFBQWEsQUFBaUQ7QUFBckY7O0FBRUEsSUFBTSxvQkFBb0IsU0FBcEIsQUFBb0Isa0JBQUEsQUFBQyxPQUFELEFBQVEsUUFBVyxBQUN6QztRQUFJLE1BQUEsQUFBTSxRQUFOLEFBQWMsVUFBbEIsQUFBNEIsR0FBRyxRQUFRLE1BQUEsQUFBTSxRQUFOLEFBQWMsTUFBdEIsQUFBUSxBQUFvQixBQUMzRDtXQUFBLEFBQU8sQUFDVjtBQUhEOztBQUtPLElBQU0sc0JBQU8sU0FBUCxBQUFPLE9BQUE7c0NBQUEsQUFBSSxrREFBQTtBQUFKLDhCQUFBO0FBQUE7O2VBQVksQUFBSSxPQUFPLFVBQUEsQUFBQyxLQUFELEFBQU0sSUFBTjtlQUFhLEdBQWIsQUFBYSxBQUFHO0FBQXZDLEFBQVksS0FBQTtBQUF6Qjs7QUFHQSxJQUFNLHdEQUF3QixTQUF4QixBQUF3Qiw2QkFBQTtXQUFTLE1BQUEsQUFBTSxlQUFOLEFBQXFCLFlBQ3JCLE1BQUEsQUFBTSxPQUFOLEFBQWEsT0FBYixBQUFvQixtQkFEcEIsQUFDQSxBQUF1QyxNQUN2QyxNQUFBLEFBQU0sT0FBTixBQUFhLG1CQUZ0QixBQUVTLEFBQWdDO0FBRnZFOztBQUlBLElBQU0sd0JBQVEsU0FBUixBQUFRLE1BQUEsQUFBQyxLQUFELEFBQU0sT0FBVSxBQUNqQztlQUFPLEFBQUksUUFBUSxVQUFBLEFBQUMsU0FBRCxBQUFVLFFBQVcsQUFDcEM7WUFBSSxNQUFNLElBQVYsQUFBVSxBQUFJLEFBQ2Q7WUFBQSxBQUFJLEtBQUssTUFBQSxBQUFNLFVBQWYsQUFBeUIsT0FBekIsQUFBZ0MsQUFDaEM7WUFBSSxNQUFKLEFBQVUsU0FBUyxBQUNmO21CQUFBLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFNBQWxCLEFBQTJCLFFBQVEsZUFBTyxBQUN0QztvQkFBQSxBQUFJLGlCQUFKLEFBQXFCLEtBQUssTUFBQSxBQUFNLFFBQWhDLEFBQTBCLEFBQWMsQUFDM0M7QUFGRCxBQUdIO0FBQ0Q7WUFBQSxBQUFJLFNBQVMsWUFBTSxBQUNmO2dCQUFJLElBQUEsQUFBSSxVQUFKLEFBQWMsT0FBTyxJQUFBLEFBQUksU0FBN0IsQUFBc0MsS0FBSyxRQUFRLElBQW5ELEFBQTJDLEFBQVksZUFDbEQsT0FBTyxJQUFQLEFBQVcsQUFDbkI7QUFIRCxBQUlBO1lBQUEsQUFBSSxVQUFVLFlBQUE7bUJBQU0sT0FBTyxJQUFiLEFBQU0sQUFBVztBQUEvQixBQUNBO1lBQUEsQUFBSSxLQUFLLE1BQVQsQUFBZSxBQUNsQjtBQWRELEFBQU8sQUFlVixLQWZVO0FBREo7Ozs7Ozs7Ozs7QUM3Q1A7O0FBRUEsSUFBSSxhQUFKLEFBQWlCOztBQUVWLElBQU0sZ0JBQUksU0FBSixBQUFJLEVBQUEsQUFBQyxVQUFELEFBQVcsWUFBWCxBQUF1QixNQUFTLEFBQzdDO1FBQUksT0FBTyxTQUFBLEFBQVMsY0FBcEIsQUFBVyxBQUF1QixBQUVsQzs7U0FBSSxJQUFKLEFBQVEsUUFBUixBQUFnQixZQUFZO2FBQUEsQUFBSyxhQUFMLEFBQWtCLE1BQU0sV0FBcEQsQUFBNEIsQUFBd0IsQUFBVztBQUMvRCxTQUFHLFNBQUEsQUFBUyxhQUFhLEtBQXpCLEFBQThCLFFBQVEsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLGVBQTFCLEFBQWlCLEFBQXdCLEFBRS9FOztXQUFBLEFBQU8sQUFDVjtBQVBNOztBQVNBLElBQU0sb0RBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQUMsT0FBRCxBQUFRLEtBQVEsQUFDL0M7UUFBSSxPQUFPLFNBQUEsQUFBUyxlQUFwQixBQUFXLEFBQXdCLEFBRW5DOztVQUFBLEFBQU0sZ0JBQU4sQUFBc0IsVUFBdEIsQUFBZ0MsT0FBTyw2QkFBdkMsQUFBeUQsQUFDekQ7VUFBQSxBQUFNLGdCQUFOLEFBQXNCLFVBQXRCLEFBQWdDLElBQUksNkJBQXBDLEFBQXNELEFBRXREOztXQUFPLE1BQUEsQUFBTSxnQkFBTixBQUFzQixZQUE3QixBQUFPLEFBQWtDLEFBQzVDO0FBUE07O0FBU0EsSUFBTSxrQ0FBYSxTQUFiLEFBQWEsc0JBQUE7V0FBYSxpQkFBUyxBQUM1QzttQkFBQSxBQUFXLFdBQVgsQUFBc0IsV0FBdEIsQUFBaUMsWUFBWSxXQUE3QyxBQUE2QyxBQUFXLEFBQ3hEO1lBQUcsTUFBQSxBQUFNLE9BQU4sQUFBYSxXQUFoQixBQUEyQixpQkFBaUIsQUFDeEM7a0JBQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixnQkFBeEIsQUFBd0MsVUFBeEMsQUFBa0QsT0FBTyw2QkFBekQsQUFBMkUsQUFDM0U7a0JBQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixnQkFBeEIsQUFBd0MsVUFBeEMsQUFBa0QsSUFBSSw2QkFBdEQsQUFBd0UsQUFDM0U7QUFDRDtjQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsT0FBeEIsQUFBK0IsUUFBUSxpQkFBUyxBQUFFO2tCQUFBLEFBQU0sZ0JBQU4sQUFBc0IsQUFBa0I7QUFBMUYsQUFDQTtlQUFPLFdBQVAsQUFBTyxBQUFXLEFBQ3JCO0FBUnlCO0FBQW5COztBQVVBLElBQU0sb0NBQWMsU0FBZCxBQUFjLG1CQUFTLEFBQ2hDO1dBQUEsQUFBTyxLQUFQLEFBQVksWUFBWixBQUF3QixRQUFRLGdCQUFRLEFBQ3BDO21CQUFBLEFBQVcsTUFBWCxBQUFpQixBQUNwQjtBQUZELEFBR0g7QUFKTTs7QUFNQSxJQUFNLHNDQUFlLFNBQWYsQUFBZSxvQkFBUyxBQUNqQztXQUFBLEFBQU8sS0FBSyxNQUFaLEFBQWtCLFFBQWxCLEFBQTBCLFFBQVEscUJBQWEsQUFDM0M7WUFBRyxDQUFDLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBakIsQUFBNEIsT0FBTyxZQUFBLEFBQVksV0FBWixBQUF1QixBQUM3RDtBQUZELEFBR0g7QUFKTTs7QUFNQSxJQUFNLG9DQUFjLFNBQWQsQUFBYyx1QkFBQTtXQUFhLGlCQUFTLEFBQzdDO1lBQUcsV0FBSCxBQUFHLEFBQVcsWUFBWSxXQUFBLEFBQVcsV0FBWCxBQUFzQixBQUVoRDs7bUJBQUEsQUFBVyxhQUNYLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixrQkFDZCxvQkFBb0IsTUFBQSxBQUFNLE9BQTFCLEFBQW9CLEFBQWEsWUFBWSxNQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFBd0IsY0FEL0UsQUFDVSxBQUE2QyxBQUFzQyxNQUNuRixNQUFBLEFBQU0sT0FBTixBQUFhLFdBQWIsQUFDUCxPQUFPLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixPQUF4QixBQUErQixTQUQvQixBQUNzQyxHQUR0QyxBQUVQLFdBRk8sQUFHUCxZQUFZLEVBQUEsQUFBRSxPQUFPLEVBQUUsT0FBTyw2QkFBbEIsQUFBUyxBQUEyQixTQUFTLE1BQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixjQU5wRixBQUdVLEFBR0ssQUFBNkMsQUFBc0MsQUFFckc7O2NBQUEsQUFBTSxPQUFOLEFBQWEsV0FBYixBQUF3QixPQUF4QixBQUErQixRQUFRLGlCQUFTLEFBQUU7a0JBQUEsQUFBTSxhQUFOLEFBQW1CLGdCQUFuQixBQUFtQyxBQUFVO0FBQS9GLEFBQ0E7QUFaMEI7QUFBcEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgd2luZG93LnZhbGlkYXRvciA9IFZhbGlkYXRlLmluaXQoJ2Zvcm0nKTtcblxuICAgIC8vIHZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgLy8gICAgICd0ZXN0JyxcbiAgICAvLyAgICAgJ1JlcXVpcmVkU3RyaW5nJyxcbiAgICAvLyAgICAgKHZhbHVlLCBmaWVsZHMsIHBhcmFtcykgPT4ge1xuICAgIC8vICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndGVzdCc7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgICdWYWx1ZSBtdXN0IGVxdWFsIFwidGVzdFwiJ1xuICAgIC8vICk7XG5cbn1dO1xuXG57IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9jb25zdGFudHMvZGVmYXVsdHMnO1xuaW1wb3J0IGZhY3RvcnkgZnJvbSAnLi9saWInO1xuXG5jb25zdCBpbml0ID0gKGNhbmRpZGF0ZSwgb3B0cykgPT4ge1xuXHRsZXQgZWxzO1xuXG5cdGlmKHR5cGVvZiBjYW5kaWRhdGUgIT09ICdzdHJpbmcnICYmIGNhbmRpZGF0ZS5ub2RlTmFtZSAmJiBjYW5kaWRhdGUubm9kZU5hbWUgPT09ICdGT1JNJykgZWxzID0gW2NhbmRpZGF0ZV07XG5cdGVsc2UgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhbmRpZGF0ZSkpO1xuXHRcblx0aWYoZWxzLmxlbmd0aCA9PT0gMSAmJiB3aW5kb3cuX192YWxpZGF0b3JzX18gJiYgd2luZG93Ll9fdmFsaWRhdG9yc19fW2Vsc1swXV0pXG5cdFx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfX1tlbHNbMF1dO1xuXHRcblx0Ly9hdHRhY2hlZCB0byB3aW5kb3cuX192YWxpZGF0b3JzX19cblx0Ly9zbyB3ZSBjYW4gYm90aCBpbml0LCBhdXRvLWluaXRpYWxpc2UgYW5kIHJlZmVyIGJhY2sgdG8gYW4gaW5zdGFuY2UgYXR0YWNoZWQgdG8gYSBmb3JtIHRvIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRvcnNcblx0cmV0dXJuIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXyA9IFxuXHRcdE9iamVjdC5hc3NpZ24oe30sIHdpbmRvdy5fX3ZhbGlkYXRvcnNfXywgZWxzLnJlZHVjZSgoYWNjLCBlbCkgPT4ge1xuXHRcdFx0aWYoZWwuZ2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJykpIHJldHVybjtcblx0XHRcdGFjY1tlbF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoZmFjdG9yeShlbCwgT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpKSkpO1xuXHRcdFx0cmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICdub3ZhbGlkYXRlJyksIGFjYztcblx0XHR9LCB7fSkpO1xufTtcblxuLy9BdXRvLWluaXRpYWxpc2VcbnsgXG5cdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpKVxuXHRcdC5mb3JFYWNoKGZvcm0gPT4geyBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbD10cnVlXScpICYmIGluaXQoZm9ybSk7IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJleHBvcnQgZGVmYXVsdCB7fTsiLCJleHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBFTlRFUjogMTNcbn07XG5cbmV4cG9ydCBjb25zdCBVUERBVEVTID0ge1xuICAgIFNFVF9JTklUSUFMX01PREVMOiAnU0VUX0lOSVRJQUxfTU9ERUwnLFxuICAgIENMRUFSX0VSUk9SUzogJ0NMRUFSX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUlM6ICdWQUxJREFUSU9OX0VSUk9SUycsXG4gICAgVkFMSURBVElPTl9FUlJPUjogJ1ZBTElEQVRJT05fRVJST1InLFxuICAgIENMRUFSX0VSUk9SOiAnQ0xFQVJfRVJST1InXG59O1xuXG4vL2h0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3NcbmV4cG9ydCBjb25zdCBFTUFJTF9SRUdFWCA9IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vL2h0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuZXhwb3J0IGNvbnN0IFVSTF9SRUdFWCA9IC9eKD86KD86KD86aHR0cHM/fGZ0cCk6KT9cXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyEoPzoxMHwxMjcpKD86XFwuXFxkezEsM30pezN9KSg/ISg/OjE2OVxcLjI1NHwxOTJcXC4xNjgpKD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpLj8pKD86OlxcZHsyLDV9KT8oPzpbLz8jXVxcUyopPyQvaTtcblxuZXhwb3J0IGNvbnN0IERBVEVfSVNPX1JFR0VYID0gL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9SRUdFWCA9IC9eKD86LT9cXGQrfC0/XFxkezEsM30oPzosXFxkezN9KSspPyg/OlxcLlxcZCspPyQvO1xuXG5leHBvcnQgY29uc3QgRElHSVRTX1JFR0VYID0gL15cXGQrJC87XG5cbmV4cG9ydCBjb25zdCBET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURSA9ICdkYXRhLXZhbG1zZy1mb3InO1xuXG5leHBvcnQgY29uc3QgRE9NX1NFTEVDVE9SX1BBUkFNUyA9IFsncmVtb3RlLWFkZGl0aW9uYWxmaWVsZHMnLCAnZXF1YWx0by1vdGhlciddO1xuXG4vKiBDYW4gdGhlc2UgdHdvIGJlIGZvbGRlZCBpbnRvIHRoZSBzYW1lIHZhcmlhYmxlPyAqL1xuZXhwb3J0IGNvbnN0IERPVE5FVF9QQVJBTVMgPSB7XG4gICAgbGVuZ3RoOiBbJ2xlbmd0aC1taW4nLCAnbGVuZ3RoLW1heCddLFxuICAgIHN0cmluZ2xlbmd0aDogWydsZW5ndGgtbWF4J10sXG4gICAgcmFuZ2U6IFsncmFuZ2UtbWluJywgJ3JhbmdlLW1heCddLFxuICAgIC8vIG1pbjogWydtaW4nXSw/XG4gICAgLy8gbWF4OiAgWydtYXgnXSw/XG4gICAgbWlubGVuZ3RoOiBbJ21pbmxlbmd0aC1taW4nXSxcbiAgICBtYXhsZW5ndGg6IFsnbWF4bGVuZ3RoLW1heCddLFxuICAgIHJlZ2V4OiBbJ3JlZ2V4LXBhdHRlcm4nXSxcbiAgICBlcXVhbHRvOiBbJ2VxdWFsdG8tb3RoZXInXSxcbiAgICByZW1vdGU6IFsncmVtb3RlLXVybCcsICdyZW1vdGUtYWRkaXRpb25hbGZpZWxkcycsICdyZW1vdGUtdHlwZSddLy8/P1xufTtcblxuZXhwb3J0IGNvbnN0IERPVE5FVF9BREFQVE9SUyA9IFtcbiAgICAncmVxdWlyZWQnLFxuICAgICdzdHJpbmdsZW5ndGgnLFxuICAgICdyZWdleCcsXG4gICAgLy8gJ2RpZ2l0cycsXG4gICAgJ2VtYWlsJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAnbWlubGVuZ3RoJyxcbiAgICAncmFuZ2UnLFxuICAgICdlcXVhbHRvJyxcbiAgICAncmVtb3RlJywvL3Nob3VsZCBiZSBsYXN0XG4gICAgLy8gJ3Bhc3N3b3JkJyAvLy0+IG1hcHMgdG8gbWluLCBub25hbHBoYW1haW4sIGFuZCByZWdleCBtZXRob2RzXG5dO1xuXG5leHBvcnQgY29uc3QgRE9UTkVUX0NMQVNTTkFNRVMgPSB7XG4gICAgVkFMSUQ6ICdmaWVsZC12YWxpZGF0aW9uLXZhbGlkJyxcbiAgICBFUlJPUjogJ2ZpZWxkLXZhbGlkYXRpb24tZXJyb3InXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZCgpIHsgcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLic7IH0gLFxuICAgIGVtYWlsKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJzsgfSxcbiAgICBwYXR0ZXJuKCkgeyByZXR1cm4gJ1RoZSB2YWx1ZSBtdXN0IG1hdGNoIHRoZSBwYXR0ZXJuLic7IH0sXG4gICAgdXJsKCl7IHJldHVybiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLic7IH0sXG4gICAgZGF0ZSgpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLic7IH0sXG4gICAgZGF0ZUlTTygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLic7IH0sXG4gICAgbnVtYmVyKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci4nOyB9LFxuICAgIGRpZ2l0cygpIHsgcmV0dXJuICdQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuJzsgfSxcbiAgICBtYXhsZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuICR7cHJvcHN9IGNoYXJhY3RlcnMuYDsgfSxcbiAgICBtaW5sZW5ndGgocHJvcHMpIHsgcmV0dXJuIGBQbGVhc2UgZW50ZXIgYXQgbGVhc3QgJHtwcm9wc30gY2hhcmFjdGVycy5gOyB9LFxuICAgIG1heChwcm9wcyl7IHJldHVybiBgUGxlYXNlIGVudGVyIGEgdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7W3Byb3BzXX0uYDsgfSxcbiAgICBtaW4ocHJvcHMpeyByZXR1cm4gYFBsZWFzZSBlbnRlciBhIHZhbHVlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3Byb3BzfS5gfSxcbiAgICBlcXVhbFRvKCkgeyByZXR1cm4gJ1BsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi4nOyB9LFxuICAgIHJlbW90ZSgpIHsgcmV0dXJuICdQbGVhc2UgZml4IHRoaXMgZmllbGQuJzsgfVxufTsiLCJpbXBvcnQgTW9kZWwgZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQgeyBVUERBVEVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgXG4gICAgZ2V0SW5pdGlhbE1vZGVsLFxuICAgIGdldFZhbGlkaXR5TW9kZWwsXG4gICAgZ2V0R3JvdXBWYWxpZGl0eU1vZGVsLFxuICAgIHJlZHVjZUdyb3VwVmFsaWRpdHlNb2RlbCxcbiAgICByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQsXG4gICAgcmVkdWNlRXJyb3JNZXNzYWdlc1xufSBmcm9tICcuL3ZhbGlkYXRvcic7XG5pbXBvcnQge1xuICAgIGNsZWFyRXJyb3JzLFxuICAgIGNsZWFyRXJyb3IsXG4gICAgcmVuZGVyRXJyb3IsXG4gICAgcmVuZGVyRXJyb3JzXG59ICBmcm9tICcuL3ZpZXcnO1xuXG5jb25zdCB2YWxpZGF0ZSA9IGUgPT4ge1xuICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIE1vZGVsLnVwZGF0ZShVUERBVEVTLkNMRUFSX0VSUk9SUywgbnVsbCwgW2NsZWFyRXJyb3JzXSk7XG5cbiAgICBnZXRWYWxpZGl0eU1vZGVsKE1vZGVsLmdldE1vZGVsKCkuZ3JvdXBzKVxuICAgICAgICAudGhlbih2YWxpZGl0eU1vZGVsID0+IHtcbiAgICAgICAgICAgIC8vbm8gZXJyb3JzIChhbGwgdHJ1ZSwgbm8gZmFsc2Ugb3IgZXJyb3IgU3RyaW5ncyksIGp1c3Qgc3VibWl0XG4gICAgICAgICAgICBpZihlICYmIGUudGFyZ2V0ICYmIFtdLmNvbmNhdCguLi52YWxpZGl0eU1vZGVsKS5yZWR1Y2UocmVkdWNlR3JvdXBWYWxpZGl0eU1vZGVsLCB0cnVlKSkgcmV0dXJuIGZvcm0uc3VibWl0KCk7XG5cbiAgICAgICAgICAgIE1vZGVsLnVwZGF0ZShcbiAgICAgICAgICAgICAgICBVUERBVEVTLlZBTElEQVRJT05fRVJST1JTLFxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKE1vZGVsLmdldE1vZGVsKCkuZ3JvdXBzKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIGdyb3VwLCBpKSA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NbZ3JvdXBdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkOiB2YWxpZGl0eU1vZGVsW2ldLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5TW9kZWwsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IHZhbGlkaXR5TW9kZWxbaV0ucmVkdWNlKHJlZHVjZUVycm9yTWVzc2FnZXMoZ3JvdXAsIE1vZGVsLmdldE1vZGVsKCkpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbiAgICAgICAgICAgICAgICAgICAgfSwge30pLFxuICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcnNdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZWFsVGltZVZhbGlkYXRpb24oKTtcbiAgICAgICAgfSk7XG59O1xuXG5jb25zdCBhZGRNZXRob2QgPSAodHlwZSwgZ3JvdXBOYW1lLCBtZXRob2QsIG1lc3NhZ2UpID0+IHtcbiAgICBpZih0eXBlID09PSB1bmRlZmluZWQgfHwgZ3JvdXBOYW1lID09PSB1bmRlZmluZWQgfHwgbWV0aG9kID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gY29uc29sZS53YXJuKCdDdXN0b20gdmFsaWRhdGlvbiBtZXRob2QgY2Fubm90IGJlIGFkZGVkLicpO1xuICAgIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMucHVzaCh7dHlwZSwgbWV0aG9kLCBtZXNzYWdlfSk7XG59O1xuXG5cbmNvbnN0IHJlYWxUaW1lVmFsaWRhdGlvbiA9ICgpID0+IHtcbiAgICBsZXQgaGFuZGxlciA9IGdyb3VwTmFtZSA9PiAoKSA9PiB7XG4gICAgICAgIGlmKCFNb2RlbC5nZXRNb2RlbCgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkKSBNb2RlbC51cGRhdGUoVVBEQVRFUy5DTEVBUl9FUlJPUiwgZ3JvdXBOYW1lLCBbY2xlYXJFcnJvcihncm91cE5hbWUpXSk7XG4gICAgICAgIGdldEdyb3VwVmFsaWRpdHlNb2RlbChNb2RlbC5nZXRNb2RlbCgpLmdyb3Vwc1tncm91cE5hbWVdKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZighcmVzLnJlZHVjZShyZWR1Y2VHcm91cFZhbGlkaXR5TW9kZWwsIHRydWUpKSBcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwudXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgVVBEQVRFUy5WQUxJREFUSU9OX0VSUk9SLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogcmVzLnJlZHVjZShyZWR1Y2VFcnJvck1lc3NhZ2VzKGdyb3VwTmFtZSwgTW9kZWwuZ2V0TW9kZWwoKSksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyZW5kZXJFcnJvcihncm91cE5hbWUpXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKE1vZGVsLmdldE1vZGVsKCkuZ3JvdXBzKS5mb3JFYWNoKGdyb3VwTmFtZSA9PiB7XG4gICAgICAgIE1vZGVsLmdldE1vZGVsKCkuZ3JvdXBzW2dyb3VwTmFtZV0uZmllbGRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihyZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQoaW5wdXQpLCBoYW5kbGVyKGdyb3VwTmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGVxdWFsVG9WYWxpZGF0b3IgPSBNb2RlbC5nZXRNb2RlbCgpLmdyb3Vwc1tncm91cE5hbWVdLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ2VxdWFsdG8nKTtcbiAgICAgICAgXG4gICAgICAgIGVxdWFsVG9WYWxpZGF0b3IubGVuZ3RoID4gMCBcbiAgICAgICAgICAgICYmIGVxdWFsVG9WYWxpZGF0b3JbMF0ucGFyYW1zLm90aGVyLmZvckVhY2goc3ViZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgIHN1Ymdyb3VwLmZvckVhY2goaXRlbSA9PiB7IGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZXIoZ3JvdXBOYW1lKSk7IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoZm9ybSwgc2V0dGluZ3MpID0+IHtcbiAgICBNb2RlbC51cGRhdGUoVVBEQVRFUy5TRVRfSU5JVElBTF9NT0RFTCwgKGdldEluaXRpYWxNb2RlbChmb3JtKSkpO1xuXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB2YWxpZGF0ZSk7XG5cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgKCkgPT4geyBNb2RlbC51cGRhdGUoVVBEQVRFUy5DTEVBUl9FUlJPUlMsIG51bGwsIFtjbGVhckVycm9yc10pOyB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkYXRlLFxuICAgICAgICBhZGRNZXRob2RcbiAgICB9XG59OyIsImltcG9ydCB1cGRhdGVzIGZyb20gJy4uL3VwZGF0ZXMnO1xuLy8gaW1wb3J0IHJlbmRlciBmcm9tICcuLi9yZW5kZXJlcic7XG5cbmxldCBtb2RlbCA9IHt9O1xuXG53aW5kb3cuTU9ERUxfSElTVE9SWSA9IFtdO1xuXG5jb25zdCBnZXRNb2RlbCA9ICgpID0+IG1vZGVsO1xuXG5jb25zdCB1cGRhdGUgPSBmdW5jdGlvbih0eXBlLCBuZXh0TW9kZWwsIGVmZmVjdHMpIHtcbiAgICBtb2RlbCA9IG5leHRNb2RlbCA/IHVwZGF0ZXNbdHlwZV0obW9kZWwsIG5leHRNb2RlbCkgOiBtb2RlbDtcbiAgICAvLyB3aW5kb3cuTU9ERUxfSElTVE9SWS5wdXNoKHtbYWN0aW9uLnR5cGVdOiBtb2RlbH0pO1xuICAgIGNvbnNvbGUubG9nKHtbdHlwZV06IG1vZGVsfSk7XG4gICAgaWYoIWVmZmVjdHMpIHJldHVybjtcbiAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IHtcbiAgICAgICAgZWZmZWN0KG1vZGVsKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICB1cGRhdGUsXG4gICAgZ2V0TW9kZWxcbn07IiwiaW1wb3J0IHsgVVBEQVRFUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBbVVBEQVRFUy5TRVRfSU5JVElBTF9NT0RFTF06IChtb2RlbCwgZGF0YSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwsIGRhdGEpLFxuICAgIFtVUERBVEVTLkNMRUFSX0VSUk9SU106IG1kb2VsID0+IE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLCB7IFxuICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKG1vZGVsLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICBhY2NbZ3JvdXBdID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwuZ3JvdXBzW2dyb3VwXSwge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZXM6IFtdLFxuICAgICAgICAgICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KVxuICAgIH0pLFxuICAgIFtVUERBVEVTLkNMRUFSX0VSUk9SXTogKG1vZGVsLCBkYXRhKSA9PiBPYmplY3QuYXNzaWduKHt9LCBtb2RlbCwge1xuICAgICAgICBncm91cHM6IE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLmdyb3Vwcywge1xuICAgICAgICAgICAgW2RhdGFdOiBPYmplY3QuYXNzaWduKHt9LCBtb2RlbC5ncm91cHNbZGF0YV0sIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgICAgICB2YWxpZDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSxcbiAgICBbVVBEQVRFUy5WQUxJREFUSU9OX0VSUk9SU106IChtb2RlbCwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwsIHsgXG4gICAgICAgICAgICBncm91cHM6IE9iamVjdC5rZXlzKG1vZGVsLmdyb3VwcykucmVkdWNlKChhY2MsIGdyb3VwKSA9PiB7XG4gICAgICAgICAgICAgICAgYWNjW2dyb3VwXSA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLmdyb3Vwc1tncm91cF0sIGRhdGFbZ3JvdXBdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwge30pXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW1VQREFURVMuVkFMSURBVElPTl9FUlJPUl06IChtb2RlbCwgZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwsIHtcbiAgICAgICAgICAgIGdyb3VwczogT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwuZ3JvdXBzLCB7XG4gICAgICAgICAgICAgICAgW2RhdGEuZ3JvdXBdOiBPYmplY3QuYXNzaWduKHt9LCBtb2RlbC5ncm91cHNbZGF0YS5ncm91cF0sIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlczogZGF0YS5lcnJvck1lc3NhZ2VzLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59OyIsImltcG9ydCBtZXRob2RzIGZyb20gJy4vbWV0aG9kcyc7XG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi4vY29uc3RhbnRzL21lc3NhZ2VzJztcbmltcG9ydCB7IFxuICAgIHBpcGUsXG4gICAgaXNDaGVja2FibGUsXG4gICAgaXNTZWxlY3QsXG4gICAgaXNGaWxlLFxuICAgIERPTU5vZGVzRnJvbUNvbW1hTGlzdCxcbiAgICBleHRyYWN0VmFsdWVGcm9tR3JvdXBcbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuICAgIERPVE5FVF9BREFQVE9SUyxcbiAgICBET1RORVRfUEFSQU1TLFxuICAgIERPVE5FVF9FUlJPUl9TUEFOX0RBVEFfQVRUUklCVVRFLFxuICAgIERPTV9TRUxFQ1RPUl9QQVJBTVNcbn0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuY29uc3QgcmVzb2x2ZVBhcmFtID0gKHBhcmFtLCBpbnB1dCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZShgZGF0YS12YWwtJHtwYXJhbX1gKTtcbiAgICByZXR1cm4gKHtbcGFyYW0uc3BsaXQoJy0nKVsxXV06ICEhfkRPTV9TRUxFQ1RPUl9QQVJBTVMuaW5kZXhPZihwYXJhbSkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBET01Ob2Rlc0Zyb21Db21tYUxpc3QodmFsdWUsIGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWUgfSlcbn07XG5cbmNvbnN0IGV4dHJhY3RQYXJhbXMgPSAoaW5wdXQsIGFkYXB0b3IpID0+IERPVE5FVF9QQVJBTVNbYWRhcHRvcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8geyBwYXJhbXM6IERPVE5FVF9QQVJBTVNbYWRhcHRvcl0ucmVkdWNlKChhY2MsIHBhcmFtKSA9PiBpbnB1dC5oYXNBdHRyaWJ1dGUoYGRhdGEtdmFsLSR7cGFyYW19YCkgPyBPYmplY3QuYXNzaWduKGFjYywgcmVzb2x2ZVBhcmFtKHBhcmFtLCBpbnB1dCkpIDogYWNjLCB7fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIFxuY29uc3QgZXh0cmFjdERhdGFWYWxWYWxpZGF0b3JzID0gaW5wdXQgPT4gRE9UTkVUX0FEQVBUT1JTLnJlZHVjZSgodmFsaWRhdG9ycywgYWRhcHRvcikgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbGlkYXRvcnMgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFsuLi52YWxpZGF0b3JzLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogYWRhcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaW5wdXQuZ2V0QXR0cmlidXRlKGBkYXRhLXZhbC0ke2FkYXB0b3J9YCl9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtcyhpbnB1dCwgYWRhcHRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSk7XG5cbmNvbnN0IGV4dHJhY3RBdHRyVmFsaWRhdG9ycyA9IGlucHV0ID0+IHBpcGUoZW1haWwoaW5wdXQpLCB1cmwoaW5wdXQpLCBudW1iZXIoaW5wdXQpLCBtaW5sZW5ndGgoaW5wdXQpLCBtYXhsZW5ndGgoaW5wdXQpLCBtaW4oaW5wdXQpLCBtYXgoaW5wdXQpLCBwYXR0ZXJuKGlucHV0KSwgcmVxdWlyZWQoaW5wdXQpKTtcblxuLy91bi1EUlkuLi4gYW5kIHVucmVhZGFibGVcbmNvbnN0IHJlcXVpcmVkID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT09ICdmYWxzZScgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdyZXF1aXJlZCd9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBlbWFpbCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2VtYWlsJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ2VtYWlsJ31dIDogdmFsaWRhdG9ycztcbmNvbnN0IHVybCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3VybCcgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICd1cmwnfV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbnVtYmVyID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnbnVtYmVyJyA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ251bWJlcid9XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtaW5sZW5ndGggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWlubGVuZ3RoJykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtaW5sZW5ndGgnLCBwYXJhbXM6IHsgbWluOiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbmxlbmd0aCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IG1heGxlbmd0aCA9IGlucHV0ID0+ICh2YWxpZGF0b3JzID0gW10pICA9PiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ21heGxlbmd0aCcsIHBhcmFtczogeyBtYXg6IGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJyl9fV0gOiB2YWxpZGF0b3JzO1xuY29uc3QgbWluID0gaW5wdXQgPT4gKHZhbGlkYXRvcnMgPSBbXSkgID0+IChpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgnbWluJykgIT09ICdmYWxzZScpID8gWy4uLnZhbGlkYXRvcnMsIHt0eXBlOiAnbWluJywgcGFyYW1zOiB7IG1pbjogaW5wdXQuZ2V0QXR0cmlidXRlKCdtaW4nKX19XSA6IHZhbGlkYXRvcnM7XG5jb25zdCBtYXggPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgnbWF4JykgJiYgaW5wdXQuZ2V0QXR0cmlidXRlKCdtYXgnKSAhPT0gJ2ZhbHNlJykgPyBbLi4udmFsaWRhdG9ycywge3R5cGU6ICdtYXgnLCBwYXJhbXM6IHsgbWF4OiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ21heCcpfX1dIDogdmFsaWRhdG9ycztcbmNvbnN0IHBhdHRlcm4gPSBpbnB1dCA9PiAodmFsaWRhdG9ycyA9IFtdKSAgPT4gKGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICYmIGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpICE9PSAnZmFsc2UnKSA/IFsuLi52YWxpZGF0b3JzLCB7dHlwZTogJ3BhdHRlcm4nLCBwYXJhbXM6IHsgcmVnZXg6IGlucHV0LmdldEF0dHJpYnV0ZSgncGF0dGVybicpfX1dIDogdmFsaWRhdG9ycztcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGlzZVZhbGlkYXRvcnMgPSBpbnB1dCA9PiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsJykgPT09ICd0cnVlJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBleHRyYWN0RGF0YVZhbFZhbGlkYXRvcnMoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdEF0dHJWYWxpZGF0b3JzKGlucHV0KTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gKGdyb3VwLCB2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5tZXRob2QgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWxpZGF0b3IubWV0aG9kKGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCksIGdyb3VwLmZpZWxkcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1ldGhvZHNbdmFsaWRhdG9yLnR5cGVdKGdyb3VwLCB2YWxpZGF0b3IucGFyYW1zKTtcblxuZXhwb3J0IGNvbnN0IGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBsZXQgbmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgIHJldHVybiBhY2NbbmFtZV0gPSBhY2NbbmFtZV0gPyBPYmplY3QuYXNzaWduKGFjY1tuYW1lXSwgeyBmaWVsZHM6IFsuLi5hY2NbbmFtZV0uZmllbGRzLCBpbnB1dF19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQ6ICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBub3JtYWxpc2VWYWxpZGF0b3JzKGlucHV0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IFtpbnB1dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXJyb3JOb2RlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtET1RORVRfRVJST1JfU1BBTl9EQVRBX0FUVFJJQlVURX09JHtpbnB1dC5nZXRBdHRyaWJ1dGUoJ25hbWUnKX1dYCkgfHwgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGFjYztcbn07XG5cbmNvbnN0IGV4dHJhY3RFcnJvck1lc3NhZ2UgPSB2YWxpZGF0b3IgPT4gdmFsaWRhdG9yLm1lc3NhZ2UgfHwgbWVzc2FnZXNbdmFsaWRhdG9yLnR5cGVdKHZhbGlkYXRvci5wYXJhbXMgIT09IHVuZGVmaW5lZCA/IHZhbGlkYXRvci5wYXJhbXMgOiBudWxsKTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUVycm9yTWVzc2FnZXMgPSAoZ3JvdXAsIG1vZGVsKSA9PiAoYWNjLCB2YWxpZGl0eSwgaikgPT4ge1xuICAgIHJldHVybiB2YWxpZGl0eSA9PT0gdHJ1ZSBcbiAgICAgICAgICAgICAgICA/IGFjYyBcbiAgICAgICAgICAgICAgICA6IFsuLi5hY2MsIHR5cGVvZiB2YWxpZGl0eSA9PT0gJ2Jvb2xlYW4nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdEVycm9yTWVzc2FnZShtb2RlbC5ncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnNbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWxpZGl0eV07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlVW52YWxpZGF0YWJsZUdyb3VwcyA9IGdyb3VwcyA9PiB7XG4gICAgbGV0IHZhbGlkYXRpb25Hcm91cHMgPSB7fTtcblxuICAgIGZvcihsZXQgZ3JvdXAgaW4gZ3JvdXBzKVxuICAgICAgICBpZihncm91cHNbZ3JvdXBdLnZhbGlkYXRvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHZhbGlkYXRpb25Hcm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXTtcblxuICAgIHJldHVybiB2YWxpZGF0aW9uR3JvdXBzO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluaXRpYWxNb2RlbCA9IGZvcm0gPT4gKHtcbiAgICBncm91cHM6IHJlbW92ZVVudmFsaWRhdGFibGVHcm91cHMoW10uc2xpY2UuY2FsbChmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1zdWJtaXRdKSwgdGV4dGFyZWEsIHNlbGVjdCcpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGFzc2VtYmxlVmFsaWRhdGlvbkdyb3VwLCB7fSkpXG59KTtcblxuZXhwb3J0IGNvbnN0IHJlZHVjZUdyb3VwVmFsaWRpdHlNb2RlbCA9IChhY2MsIGN1cnIpID0+IHtcbiAgICBpZihjdXJyICE9PSB0cnVlKSBhY2MgPSBmYWxzZTtcbiAgICByZXR1cm4gYWNjOyBcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRWYWxpZGl0eU1vZGVsID0gZ3JvdXBzID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwcylcbiAgICAgICAgICAgIC5tYXAoZ3JvdXAgPT4gZ2V0R3JvdXBWYWxpZGl0eU1vZGVsKGdyb3Vwc1tncm91cF0pKVxuICAgICAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEdyb3VwVmFsaWRpdHlNb2RlbCA9IGdyb3VwID0+IHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcblx0cmV0dXJuIFByb21pc2UuYWxsKGdyb3VwLnZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHZhbGlkYXRvci50eXBlICE9PSAncmVtb3RlJyl7XG4gICAgICAgICAgICAgICAgaWYodmFsaWRhdGUoZ3JvdXAsIHZhbGlkYXRvcikpIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKGhhc0Vycm9yKSByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbHNlIHZhbGlkYXRlKGdyb3VwLCB2YWxpZGF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4geyByZXNvbHZlKHJlcyk7fSk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlUmVhbFRpbWVWYWxpZGF0aW9uRXZlbnQgPSBpbnB1dCA9PiBbJ2lucHV0JywgJ2NoYW5nZSddW051bWJlcihpc0NoZWNrYWJsZShpbnB1dCkgfHwgaXNTZWxlY3QoaW5wdXQpIHx8IGlzRmlsZShpbnB1dCkpXTsiLCJpbXBvcnQgeyBFTUFJTF9SRUdFWCwgVVJMX1JFR0VYLCBEQVRFX0lTT19SRUdFWCwgTlVNQkVSX1JFR0VYLCBESUdJVFNfUkVHRVggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZmV0Y2gsIGlzUmVxdWlyZWQsIGV4dHJhY3RWYWx1ZUZyb21Hcm91cCwgcmVzb2x2ZUdldFBhcmFtcyB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBpc09wdGlvbmFsID0gZ3JvdXAgPT4gIWlzUmVxdWlyZWQoZ3JvdXApICYmIGV4dHJhY3RWYWx1ZUZyb21Hcm91cChncm91cCkgPT09ICcnO1xuXG5jb25zdCBleHRyYWN0VmFsaWRhdGlvblBhcmFtcyA9IChncm91cCwgdHlwZSkgPT4gZ3JvdXAudmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvci50eXBlID09PSB0eXBlKVswXS5wYXJhbXM7XG5cbmNvbnN0IGN1cnJ5UmVnZXhNZXRob2QgPSByZWdleCA9PiBncm91cCA9PiBpc09wdGlvbmFsKGdyb3VwKXx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UoKGFjYywgaW5wdXQpID0+IChhY2MgPSByZWdleC50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSwgZmFsc2UpO1xuXG5jb25zdCBjdXJyeVBhcmFtTWV0aG9kID0gKHR5cGUsIHJlZHVjZXIpID0+IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApIHx8IGdyb3VwLmZpZWxkcy5yZWR1Y2UocmVkdWNlcihleHRyYWN0VmFsaWRhdGlvblBhcmFtcyhncm91cCwgdHlwZSkpLCBmYWxzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZXF1aXJlZDogZ3JvdXAgPT4gZXh0cmFjdFZhbHVlRnJvbUdyb3VwKGdyb3VwKSAhPT0gJycsXG4gICAgZW1haWw6IGN1cnJ5UmVnZXhNZXRob2QoRU1BSUxfUkVHRVgpLFxuICAgIHVybDogY3VycnlSZWdleE1ldGhvZChVUkxfUkVHRVgpLFxuICAgIGRhdGU6IGdyb3VwID0+IGlzT3B0aW9uYWwoZ3JvdXApfHwgZ3JvdXAuZmllbGRzLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICEvSW52YWxpZHxOYU4vLnRlc3QobmV3IERhdGUoaW5wdXQudmFsdWUpLnRvU3RyaW5nKCkpLCBhY2MpLCBmYWxzZSksXG4gICAgZGF0ZUlTTzogY3VycnlSZWdleE1ldGhvZChEQVRFX0lTT19SRUdFWCksXG4gICAgbnVtYmVyOiBjdXJyeVJlZ2V4TWV0aG9kKE5VTUJFUl9SRUdFWCksXG4gICAgZGlnaXRzOiBjdXJyeVJlZ2V4TWV0aG9kKERJR0lUU19SRUdFWCksXG4gICAgbWlubGVuZ3RoOiBjdXJyeVBhcmFtTWV0aG9kKFxuICAgICAgICAnbWlubGVuZ3RoJyxcbiAgICAgICAgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gQXJyYXkuaXNBcnJheShpbnB1dC52YWx1ZSkgPyBpbnB1dC52YWx1ZS5sZW5ndGggPj0gK3BhcmFtcy5taW4gOiAraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluLCBhY2MpXG4gICAgKSxcbiAgICBtYXhsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoXG4gICAgICAgICdtYXhsZW5ndGgnLFxuICAgICAgICBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBBcnJheS5pc0FycmF5KGlucHV0LnZhbHVlKSA/IGlucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCA6ICtpbnB1dC52YWx1ZS5sZW5ndGggPD0gK3BhcmFtcy5tYXgsIGFjYylcbiAgICApLFxuICAgIGVxdWFsdG86IGN1cnJ5UGFyYW1NZXRob2QoJ2VxdWFsdG8nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyA9IHBhcmFtcy5vdGhlci5yZWR1Y2UoKHN1Ymdyb3VwQWNjLCBzdWJncm91cCkgPT4ge1xuICAgICAgICAgICAgaWYoZXh0cmFjdFZhbHVlRnJvbUdyb3VwKHN1Ymdyb3VwKSAhPT0gaW5wdXQudmFsdWUpIHN1Ymdyb3VwQWNjID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3ViZ3JvdXBBY2M7XG4gICAgICAgIH0sIHRydWUpLCBhY2M7XG4gICAgfSksXG4gICAgcGF0dGVybjogY3VycnlQYXJhbU1ldGhvZCgncGF0dGVybicsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9IFJlZ0V4cChwYXJhbXMucmVnZXgpLnRlc3QoaW5wdXQudmFsdWUpLCBhY2MpKSxcbiAgICByZWdleDogY3VycnlQYXJhbU1ldGhvZCgncmVnZXgnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSBSZWdFeHAocGFyYW1zLnJlZ2V4KS50ZXN0KGlucHV0LnZhbHVlKSwgYWNjKSksXG4gICAgbWluOiBjdXJyeVBhcmFtTWV0aG9kKCdtaW4nLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAraW5wdXQudmFsdWUgPj0gK3BhcmFtcy5taW4sIGFjYykpLFxuICAgIG1heDogY3VycnlQYXJhbU1ldGhvZCgnbWF4JywgcGFyYW1zID0+IChhY2MsIGlucHV0KSA9PiAoYWNjID0gK2lucHV0LnZhbHVlIDw9ICtwYXJhbXMubWF4LCBhY2MpKSxcbiAgICBsZW5ndGg6IGN1cnJ5UGFyYW1NZXRob2QoJ2xlbmd0aCcsIHBhcmFtcyA9PiAoYWNjLCBpbnB1dCkgPT4gKGFjYyA9ICgraW5wdXQudmFsdWUubGVuZ3RoID49ICtwYXJhbXMubWluICYmIChwYXJhbXMubWF4ID09PSB1bmRlZmluZWQgfHwgK2lucHV0LnZhbHVlLmxlbmd0aCA8PSArcGFyYW1zLm1heCkpLCBhY2MpKSxcbiAgICByYW5nZTogY3VycnlQYXJhbU1ldGhvZCgncmFuZ2UnLCBwYXJhbXMgPT4gKGFjYywgaW5wdXQpID0+IChhY2MgPSAoK2lucHV0LnZhbHVlID49ICtwYXJhbXMubWluICYmICtpbnB1dC52YWx1ZSA8PSArcGFyYW1zLm1heCksIGFjYykpLFxuICAgIHJlbW90ZTogKGdyb3VwLCBwYXJhbXMpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmV0Y2goKHBhcmFtcy50eXBlICE9PSAnZ2V0JyA/IHBhcmFtcy51cmwgOiBgJHtwYXJhbXMudXJsfT8ke3Jlc29sdmVHZXRQYXJhbXMocGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMpfWApLCB7XG4gICAgICAgICAgICBtZXRob2Q6IHBhcmFtcy50eXBlLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICBib2R5OiBwYXJhbXMudHlwZSA9PT0gJ2dldCcgPyBudWxsIDogcmVzb2x2ZUdldFBhcmFtcyhwYXJhbXMuYWRkaXRpb25hbGZpZWxkcyksXG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHsgcmVzb2x2ZShkYXRhKTsgfSlcbiAgICAgICAgLmNhdGNoKHJlcyA9PiB7IHJlc29sdmUoYFNlcnZlciBlcnJvcjogJHtyZXN9YCk7IH0pO1xuICAgIH0pXG59OyIsImV4cG9ydCBjb25zdCBpc0NoZWNrYWJsZSA9IGZpZWxkID0+ICgvcmFkaW98Y2hlY2tib3gvaSkudGVzdChmaWVsZC50eXBlKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlsZSA9IGZpZWxkID0+IGZpZWxkLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAnZmlsZSc7XG5cbmV4cG9ydCBjb25zdCBpc1NlbGVjdCA9IGZpZWxkID0+IGZpZWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnO1xuXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZCA9IGdyb3VwID0+IGdyb3VwLnZhbGlkYXRvcnMuZmlsdGVyKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IudHlwZSA9PT0gJ3JlcXVpcmVkJykubGVuZ3RoID4gMDtcblxuY29uc3QgaGFzVmFsdWUgPSBpbnB1dCA9PiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gbnVsbCAmJiBpbnB1dC52YWx1ZS5sZW5ndGggPiAwKTtcblxuZXhwb3J0IGNvbnN0IGdyb3VwVmFsdWVSZWR1Y2VyID0gKGFjYywgaW5wdXQpID0+IHtcbiAgICBpZighaXNDaGVja2FibGUoaW5wdXQpICYmIGhhc1ZhbHVlKGlucHV0KSkgYWNjID0gaW5wdXQudmFsdWU7XG4gICAgaWYoaXNDaGVja2FibGUoaW5wdXQpICYmIGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhY2MpKSBhY2MucHVzaChpbnB1dC52YWx1ZSlcbiAgICAgICAgZWxzZSBhY2MgPSBbaW5wdXQudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gYWNjO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVHZXRQYXJhbXMgPSBub2RlQXJyYXlzID0+IG5vZGVBcnJheXMubWFwKChub2RlcykgPT4ge1xuICAgIHJldHVybiBgJHtub2Rlc1swXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKX09JHtleHRyYWN0VmFsdWVGcm9tR3JvdXAobm9kZXMpfWA7XG59KS5qb2luKCcmJyk7XG5cbmV4cG9ydCBjb25zdCBET01Ob2Rlc0Zyb21Db21tYUxpc3QgPSAobGlzdCwgaW5wdXQpID0+IGxpc3Quc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRTZWxlY3RvciA9IGVzY2FwZUF0dHJpYnV0ZVZhbHVlKGFwcGVuZE1vZGVsUHJlZml4KGl0ZW0sIGdldE1vZGVsUHJlZml4KGlucHV0LmdldEF0dHJpYnV0ZSgnbmFtZScpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7cmVzb2x2ZWRTZWxlY3Rvcn1dYCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbmNvbnN0IGVzY2FwZUF0dHJpYnV0ZVZhbHVlID0gdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgvKFshXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxcXFxcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIpO1xuXG5jb25zdCBnZXRNb2RlbFByZWZpeCA9IGZpZWxkTmFtZSA9PiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZignLicpICsgMSk7XG5cbmNvbnN0IGFwcGVuZE1vZGVsUHJlZml4ID0gKHZhbHVlLCBwcmVmaXgpID0+IHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIiouXCIpID09PSAwKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIqLlwiLCBwcmVmaXgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBpcGUgPSAoLi4uZm5zKSA9PiBmbnMucmVkdWNlKChhY2MsIGZuKSA9PiBmbihhY2MpKTtcblxuXG5leHBvcnQgY29uc3QgZXh0cmFjdFZhbHVlRnJvbUdyb3VwID0gZ3JvdXAgPT4gZ3JvdXAuaGFzT3duUHJvcGVydHkoJ2ZpZWxkcycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGdyb3VwLmZpZWxkcy5yZWR1Y2UoZ3JvdXBWYWx1ZVJlZHVjZXIsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGdyb3VwLnJlZHVjZShncm91cFZhbHVlUmVkdWNlciwgJycpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2ggPSAodXJsLCBwcm9wcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4ocHJvcHMubWV0aG9kIHx8ICdHRVQnLCB1cmwpO1xuICAgICAgICBpZiAocHJvcHMuaGVhZGVycykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcHMuaGVhZGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgcHJvcHMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZWxzZSByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHJlamVjdCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIHhoci5zZW5kKHByb3BzLmJvZHkpO1xuICAgIH0pO1xufTsiLCJpbXBvcnQgeyBET1RORVRfQ0xBU1NOQU1FUyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmxldCBlcnJvck5vZGVzID0ge307XG5cbmV4cG9ydCBjb25zdCBoID0gKG5vZGVOYW1lLCBhdHRyaWJ1dGVzLCB0ZXh0KSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblxuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICBpZih0ZXh0ICE9PSB1bmRlZmluZWQgJiYgdGV4dC5sZW5ndGgpIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRXJyb3JUZXh0Tm9kZSA9IChncm91cCwgbXNnKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtc2cpO1xuXG4gICAgZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5yZW1vdmUoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIGdyb3VwLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICBcbiAgICByZXR1cm4gZ3JvdXAuc2VydmVyRXJyb3JOb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNsZWFyRXJyb3IgPSBncm91cE5hbWUgPT4gbW9kZWwgPT4ge1xuICAgIGVycm9yTm9kZXNbZ3JvdXBOYW1lXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSk7XG4gICAgaWYobW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlKSB7XG4gICAgICAgIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLnNlcnZlckVycm9yTm9kZS5jbGFzc0xpc3QucmVtb3ZlKERPVE5FVF9DTEFTU05BTUVTLkVSUk9SKTtcbiAgICAgICAgbW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0uc2VydmVyRXJyb3JOb2RlLmNsYXNzTGlzdC5hZGQoRE9UTkVUX0NMQVNTTkFNRVMuVkFMSUQpO1xuICAgIH1cbiAgICBtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7IH0pO1xuICAgIGRlbGV0ZSBlcnJvck5vZGVzW2dyb3VwTmFtZV07XG59O1xuXG5leHBvcnQgY29uc3QgY2xlYXJFcnJvcnMgPSBtb2RlbCA9PiB7XG4gICAgT2JqZWN0LmtleXMoZXJyb3JOb2RlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgY2xlYXJFcnJvcihuYW1lKShtb2RlbCk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3JzID0gbW9kZWwgPT4ge1xuICAgIE9iamVjdC5rZXlzKG1vZGVsLmdyb3VwcykuZm9yRWFjaChncm91cE5hbWUgPT4ge1xuICAgICAgICBpZighbW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0udmFsaWQpIHJlbmRlckVycm9yKGdyb3VwTmFtZSkobW9kZWwpO1xuICAgIH0pXG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyRXJyb3IgPSBncm91cE5hbWUgPT4gbW9kZWwgPT4ge1xuICAgIGlmKGVycm9yTm9kZXNbZ3JvdXBOYW1lXSkgY2xlYXJFcnJvcihncm91cE5hbWUpKG1vZGVsKTtcbiAgICBcbiAgICBlcnJvck5vZGVzW2dyb3VwTmFtZV0gPSBcbiAgICBtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5zZXJ2ZXJFcnJvck5vZGUgXG4gICAgICAgICAgICA/IGNyZWF0ZUVycm9yVGV4dE5vZGUobW9kZWwuZ3JvdXBzW2dyb3VwTmFtZV0sIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pIFxuICAgICAgICAgICAgOiBtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXVxuXHRcdFx0XHRcdFx0LmZpZWxkc1ttb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMubGVuZ3RoLTFdXG5cdFx0XHRcdFx0XHQucGFyZW50Tm9kZVxuXHRcdFx0XHRcdFx0LmFwcGVuZENoaWxkKGgoJ2RpdicsIHsgY2xhc3M6IERPVE5FVF9DTEFTU05BTUVTLkVSUk9SIH0sIG1vZGVsLmdyb3Vwc1tncm91cE5hbWVdLmVycm9yTWVzc2FnZXNbMF0pKTtcblx0XHRcdFx0XHRcdFxuXHRtb2RlbC5ncm91cHNbZ3JvdXBOYW1lXS5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7IGZpZWxkLnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTsgfSk7XG59OyJdfQ==
