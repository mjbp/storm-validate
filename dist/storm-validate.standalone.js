/**
 * @name storm-validate: 
 * @version 0.4.4: Tue, 06 Feb 2018 15:04:49 GMT
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaults = {
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
};

var fetch = function fetch(url, props) {
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
var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//https://mathiasbynens.be/demo/url-regex
var URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var DATE_ISO_REGEX = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

var NUMBER_REGEX = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

var DIGITS_REGEX = /^\d+$/;

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

var isOptional = function isOptional(group) {
  return !isRequired(group) && extractValueFromGroup(group) === '';
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

var methods = {
  required: function required(group) {
    return extractValueFromGroup(group) !== '';
  },
  email: curryRegexMethod(EMAIL_REGEX),
  url: curryRegexMethod(URL_REGEX),
  date: function date(group) {
    return isOptional(group) || group.fields.reduce(function (acc, input) {
      return acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc;
    }, false);
  },
  dateISO: curryRegexMethod(DATE_ISO_REGEX),
  number: curryRegexMethod(NUMBER_REGEX),
  digits: curryRegexMethod(DIGITS_REGEX),
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
        if (extractValueFromGroup(subgroup) !== input.value) subgroupAcc = false;
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
    console.log('Remote validation');
    return new Promise(function (resolve, reject) {
      fetch(params.type !== 'get' ? params.url : params.url + '?' + resolveGetParams(params.additionalfields), {
        method: params.type.toUpperCase(),
        body: params.type === 'get' ? null : resolveGetParams(params.additionalfields),
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

var messages = {
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

var resolveParam = function resolveParam(param, input) {
  var value = input.getAttribute('data-val-' + param);
  return _defineProperty({}, param.split('-')[1], !!~DOM_SELECTOR_PARAMS.indexOf(param) ? DOMNodesFromCommaList(value, input) : value);
};

var extractParams = function extractParams(input, adaptor) {
  return DOTNET_PARAMS[adaptor] ? { params: DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
      return input.hasAttribute('data-val-' + param) ? Object.assign(acc, resolveParam(param, input)) : acc;
    }, {}) } : false;
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

var validate = function validate(group, validator) {
  return validator.method ? validator.method(extractValueFromGroup(group), group.fields) : methods[validator.type](group, validator.params);
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

var extractErrorMessage = function extractErrorMessage(validator, group) {
  return validator.message || messages[validator.type](validator.params !== undefined ? validator.params : null);
};

var removeUnvalidatableGroups = function removeUnvalidatableGroups(groups) {
  var validationGroups = {};

  for (var group in groups) {
    if (groups[group].validators.length > 0) validationGroups[group] = groups[group];
  }return validationGroups;
};

var h = function h(nodeName, attributes, text) {
  var node = document.createElement(nodeName);

  for (var prop in attributes) {
    node.setAttribute(prop, attributes[prop]);
  }if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

  return node;
};

var createErrorTextNode = function createErrorTextNode(group) {
  var node = document.createTextNode(group.errorMessages[0]);
  group.serverErrorNode.classList.add('error');
  return group.serverErrorNode.appendChild(node);
};

// import inputPrototype from './input-prototype';
var componentPrototype = {
  init: function init() {
    this.form.setAttribute('novalidate', 'novalidate');
    this.groups = removeUnvalidatableGroups([].slice.call(this.form.querySelectorAll('input:not([type=submit]), textarea, select')).reduce(assembleValidationGroup, {}));
    this.initListeners();

    console.log(this.groups);
    return this;
  },
  initListeners: function initListeners() {
    var _this = this;

    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
      _this.clearErrors();
      _this.setValidityState().then(function (res) {
        var _ref2;

        if (!(_ref2 = []).concat.apply(_ref2, _toConsumableArray(res)).includes(false)) _this.form.submit();else _this.renderErrors(), _this.initRealTimeValidation();
      });
    });

    this.form.addEventListener('reset', function (e) {
      _this.clearErrors();
    });
  },
  initRealTimeValidation: function initRealTimeValidation() {
    var _this3 = this;

    var handler = function (group) {
      var _this2 = this;

      this.setGroupValidityState(group).then(function (res) {
        if (_this2.groups[group].errorDOM) _this2.removeError(group);
        if (res.includes(false)) _this2.renderError(group);
      });
    }.bind(this);

    var _loop = function _loop(group) {
      _this3.groups[group].fields.forEach(function (input) {
        input.addEventListener(chooseRealTimeEvent(input), handler.bind(_this3, group));
      });

      //pls, refactor me ;_;
      var equalToValidator = _this3.groups[group].validators.filter(function (validator) {
        return validator.type === 'equalto';
      });

      equalToValidator.length > 0 && equalToValidator[0].params.other.forEach(function (subgroup) {
        subgroup.forEach(function (item) {
          item.addEventListener('blur', handler.bind(_this3, group));
        });
      });
    };

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
    this.groups[group].serverErrorNode && this.groups[group].serverErrorNode.classList.remove('error');
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
    this.groups[group].errorDOM = this.groups[group].serverErrorNode ? createErrorTextNode(this.groups[group]) : this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));

    //set aria-invalid on invalid inputs
    this.groups[group].fields.forEach(function (field) {
      field.setAttribute('aria-invalid', 'true');
    });
  },
  addMethod: function addMethod(type, groupName, method, message) {
    if (type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    this.groups[groupName].validators.push({ type: type, method: method, message: message });
    //extend messages
  }
};

/*
API
{
	validate(){},
	addMethod(){}
}
*/

var init = function init(candidate, opts) {
  var els = void 0;

  if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

  if (els.length === 1 && window.__validators__ && window.__validators__[els[0]]) return window.__validators__[els[0]];

  //attached to window.__validators__
  //so we can both init, auto-initialise and refer back to an instance attached to a form to add additional validators
  return window.__validators__ = Object.assign({}, window.__validators__, els.reduce(function (acc, el) {
    if (el.getAttribute('novalidate')) return;
    acc[el] = Object.assign(Object.create(componentPrototype), {
      form: el,
      settings: Object.assign({}, defaults, opts)
    }).init();
    return acc;
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
