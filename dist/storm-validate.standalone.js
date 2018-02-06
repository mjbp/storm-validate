/**
 * @name storm-validate: 
<<<<<<< HEAD
 * @version 0.3.1: Mon, 05 Feb 2018 21:41:20 GMT
=======
 * @version 0.4.4: Tue, 06 Feb 2018 15:25:43 GMT
>>>>>>> master
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormValidate = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ACTIONS$, _actionHandlers;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaults = {
<<<<<<< HEAD
    errorsInline: true,
    errorSummary: false
    // callback: null
=======
  errorsInline: true,
  errorSummary: false
  // callback: null
};

var isSelect = function isSelect(field) {
  return field.nodeName.toLowerCase() === 'select';
};

var isCheckable = function isCheckable(field) {
  return (/radio|checkbox/i.test(field.type)
  );
};

var isFile = function isFile(field) {
  return field.getAttribute('type') === 'file';
};

var isRequired = function isRequired(group) {
  return group.validators.filter(function (validator) {
    return validator.type === 'required';
  }).length > 0;
};

var resolveGetParams = function resolveGetParams(nodeArrays) {
  return nodeArrays.map(function (nodes) {
    return nodes[0].getAttribute('name') + '=' + extractValueFromGroup(nodes);
  }).join('&');
};

var hasValue = function hasValue(input) {
  return input.value !== undefined && input.value !== null && input.value.length > 0;
};

var groupValueReducer = function groupValueReducer(acc, input) {
  if (!isCheckable(input) && hasValue(input)) acc = input.value;
  if (isCheckable(input) && input.checked) {
    if (Array.isArray(acc)) acc.push(input.value);else acc = [input.value];
  }
  return acc;
};

var extractValueFromGroup = function extractValueFromGroup(group) {
  return group.hasOwnProperty('fields') ? group.fields.reduce(groupValueReducer, '') : group.reduce(groupValueReducer, '');
};

var chooseRealTimeEvent = function chooseRealTimeEvent(input) {
  return ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];
};

var pipe = function pipe() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(function (acc, fn) {
    return fn(acc);
  });
>>>>>>> master
};

var ACTIONS = {
    SET_INITIAL_STATE: 'SET_INITIAL_STATE',
    CLEAR_ERRORS: 'CLEAR_ERRORS'
};

var DOMNodesFromCommaList = function DOMNodesFromCommaList(list, input) {
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

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address


//https://mathiasbynens.be/demo/url-regex


var DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = 'data-valmsg-for';

var DOM_SELECTOR_PARAMS = ['remote-additionalfields', 'equalto-other'];

/* Can these two be folded into the same variable? */
var DOTNET_PARAMS = {
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

var DOTNET_ADAPTORS = ['required', 'stringlength', 'regex',
// 'digits',
'email', 'number', 'url', 'length', 'minlength', 'range', 'equalto', 'remote'];

var DOTNET_CLASSNAMES = {
  VALID: 'field-validation-valid',
  ERROR: 'field-validation-error'
};

var ACTIONS$1 = (_ACTIONS$ = {}, _defineProperty(_ACTIONS$, ACTIONS.SET_INITIAL_STATE, function (data) {
    return {
        type: ACTIONS.SET_INITIAL_STATE,
        data: data
    };
}), _defineProperty(_ACTIONS$, ACTIONS.CLEAR_ERRORS, function (data) {
    return {
        type: ACTIONS.CLEAR_ERRORS
    };
}), _ACTIONS$);

var DOMNodesFromCommaList = function DOMNodesFromCommaList(list) {
    return list.split(',').map(function (item) {
        return [].slice.call(document.querySelectorAll('[name=' + item.substr(2) + ']'));
    });
};

var pipe = function pipe() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return fns.reduce(function (acc, fn) {
        return fn(acc);
    });
};

var createReducer = function createReducer(initialState, actionHandlers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments[1];

        if (actionHandlers.hasOwnProperty(action.type)) return actionHandlers[action.type](state, action);else return state;
    };
};

var actionHandlers = (_actionHandlers = {}, _defineProperty(_actionHandlers, ACTIONS.SET_INITIAL_STATE, function (state, action) {
    return Object.assign({}, state, action.data);
}), _defineProperty(_actionHandlers, ACTIONS.CLEAR_ERRORS, function (state) {
    return Object.assign({}, state, { groups: state.groups.map(function (group) {
            return Object.assign({}, group, {
                errorDOM: false,
                errorMessages: []
            });
        }) });
}), _actionHandlers);
var reducers = createReducer({}, actionHandlers);

var render$1 = function render$1() {};

var state$1 = {};

window.STATE_HISTORY = [];

var getState = function getState() {
    return state$1;
};

var dispatch = function dispatch(action, renderers) {
    state$1 = action ? reducers(state$1, action) : state$1;
    // window.STATE_HISTORY.push({[action.type]: state});
    console.log(_defineProperty({}, action.type, state$1));
    if (!renderers) return;
    renderers.forEach(function (renderer) {
        render$1[renderer] ? render$1[renderer](state$1) : renderer(state$1);
    });
};

var Store = {
    dispatch: dispatch,
    getState: getState
};

<<<<<<< HEAD
var resolveParam = function resolveParam(param, value) {
    return _defineProperty({}, param.split('-')[1], !!~DOM_SELECTOR_PARAMS.indexOf(param) ? DOMNodesFromCommaList(value) : value);
};

var extractParams = function extractParams(input, adaptor) {
    return DOTNET_PARAMS[adaptor] ? { params: DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
            return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input.getAttribute('data-val-' + param))) : acc;
        }, {}) } : false;
=======
var resolveParam = function resolveParam(param, input) {
  var value = input.getAttribute('data-val-' + param);
  return _defineProperty({}, param.split('-')[1], !!~DOM_SELECTOR_PARAMS.indexOf(param) ? DOMNodesFromCommaList(value, input) : value);
};

var extractParams = function extractParams(input, adaptor) {
  return DOTNET_PARAMS[adaptor] ? { params: DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
      return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input)) : acc;
    }, {}) } : false;
>>>>>>> master
};

var extractDataValValidators = function extractDataValValidators(input) {
    return DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
        return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
            type: adaptor,
            message: input.getAttribute('data-val-' + adaptor) }, extractParams(input, adaptor))]);
    }, []);
};

var extractAttrValidators = function extractAttrValidators(input) {
    return pipe(email(input), url(input), number(input), minlength(input), maxlength(input), min(input), max(input), pattern(input), required(input));
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

var normaliseValidators = function normaliseValidators(input) {
    return input.getAttribute('data-val') === 'true' ? extractDataValValidators(input) : extractAttrValidators(input);
};

var assembleValidationGroup = function assembleValidationGroup(acc, input) {
    var name = input.getAttribute('name');
    return acc[name] = acc[name] ? Object.assign(acc[name], { fields: [].concat(_toConsumableArray(acc[name].fields), [input]) }) : {
        valid: false,
        validators: normaliseValidators(input),
        fields: [input],
        serverErrorNode: document.querySelector('[' + DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + input.getAttribute('name') + ']') || false
    }, acc;
};

var removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
    var validationGroups = {};

    for (var group in groups) {
        if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
    }return validationGroups;
};

var getInitialState = function getInitialState(form) {
    return {
        groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}))
    };
};

// import { TRIGGER_EVENTS, KEY_CODES, DATA_ATTRIBUTES } from  './constants';
// import { clear, render } from './manage-errors';
// import { validateForm } from './validate';

var validate$1 = function validate$1() {};

<<<<<<< HEAD
var addMethod = function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({ type: type, method: method, message: message });
=======
var createErrorTextNode = function createErrorTextNode(group) {
  var node = document.createTextNode(group.errorMessages[0]);

  group.serverErrorNode.classList.remove(DOTNET_CLASSNAMES.VALID);
  group.serverErrorNode.classList.add(DOTNET_CLASSNAMES.ERROR);

  return group.serverErrorNode.appendChild(node);
>>>>>>> master
};

var factory = function factory(form, settings) {
    Store.dispatch(ACTIONS$1.SET_INITIAL_STATE(getInitialState(form)));

    form.addEventListener('submit', function (e) {
        e.preventDefault();

<<<<<<< HEAD
        //dispatch clear
        // clear(state.groups);
        Store.dispatch(ACTIONS$1.CLEAR_ERRORS(), ['errors']);

        //dispatch valdate
        validateForm().then(function (res) {
            var _ref2;

            //submit
            if (!(_ref2 = []).concat.apply(_ref2, _toConsumableArray(res)).includes(false)) form.submit();else {
                //dispatch errors
                render(state.group);
                //dispatch init real-time validation

                // initRealTimeValidation();
            }
        });
=======
    for (var group in this.groups) {
      _loop(group);
    }
  },
  setGroupValidityState: function setGroupValidityState(group) {
    var _this4 = this;

    //reset validity and errorMessages
    this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] });
    return Promise.all(this.groups[group].validators.map(function (validator) {
      return new Promise(function (resolve) {

        //refactor, extract this whole fn...
        if (validator.type !== 'remote') {
          if (validate(_this4.groups[group], validator)) resolve(true);else {
            //mutation and side effect...
            _this4.groups[group].valid = false;
            _this4.groups[group].errorMessages.push(extractErrorMessage(validator, group));
            resolve(false);
          }
        } else if (_this4.groups[group].valid === true) {
          validate(_this4.groups[group], validator).then(function (res) {
            if (res && res === true) resolve(true);else {
              //mutation, side effect, and un-DRY...
              _this4.groups[group].valid = false;
              _this4.groups[group].errorMessages.push(typeof res === 'boolean' ? extractErrorMessage(validator, group) : 'Server error: ' + res);
              resolve(false);
            }
          });
        } else resolve(true);
      });
    }));
  },
  setValidityState: function setValidityState() {
    var groupValidators = [];
    for (var group in this.groups) {
      groupValidators.push(this.setGroupValidityState(group));
    }return Promise.all(groupValidators);
  },
  clearErrors: function clearErrors() {
    for (var group in this.groups) {
      if (this.groups[group].errorDOM) this.removeError(group);
    }
  },
  removeError: function removeError(group) {
    this.groups[group].errorDOM.parentNode.removeChild(this.groups[group].errorDOM);
    if (this.groups[group].serverErrorNode) {
      this.groups[group].serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
      this.groups[group].serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    this.groups[group].fields.forEach(function (field) {
      field.removeAttribute('aria-invalid');
    }); //or should i set this to false if field passes validation?
    delete this.groups[group].errorDOM;
  },
  renderErrors: function renderErrors() {
    //support for inline and error list?
    for (var group in this.groups) {
      if (!this.groups[group].valid) this.renderError(group);
    }
  },
  renderError: function renderError(group) {
    if (this.groups[group].errorDOM) this.removeError(group);
    this.groups[group].errorDOM = this.groups[group].serverErrorNode ? createErrorTextNode(this.groups[group]) : this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild(h('div', { class: 'field-validation-valid' }, this.groups[group].errorMessages[0]));

    //set aria-invalid on invalid inputs
    this.groups[group].fields.forEach(function (field) {
      field.setAttribute('aria-invalid', 'true');
>>>>>>> master
    });

    // form.addEventListener('reset', clear);

    return {
        validate: validate$1,
        addMethod: addMethod
    };
};

// import componentPrototype from './lib/component-prototype';
var init = function init(candidate, opts) {
    var els = void 0;

    if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

    if (els.length === 1 && window.__validators__ && window.__validators__[els[0]]) return window.__validators__[els[0]];

    //attached to window.__validators__
    //so we can both init, auto-initialise and refer back to an instance attached to a form to add additional validators
    return window.__validators__ = Object.assign({}, window.__validators__, els.reduce(function (acc, el) {
        if (el.getAttribute('novalidate')) return;
        acc[el] = Object.assign(Object.create(factory(el, Object.assign({}, defaults, opts))));
        return el.setAttribute('novalidate', 'novalidate'), acc;
    }, {}));
};

//Auto-initialise
{
    [].slice.call(document.querySelectorAll('form')).forEach(function (form) {
        form.querySelector('[data-val=true]') && init(form);
    });
}

var index = { init: init };

exports.default = index;;
}));
