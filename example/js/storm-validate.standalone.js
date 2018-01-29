/**
 * @name storm-validate: 
 * @version 0.1.0: Mon, 29 Jan 2018 20:22:55 GMT
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
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var unfold = function unfold(value) {
  return value === false ? '' : value;
};

var requestBodyReducer = function requestBodyReducer(acc, curr) {
  acc[curr.substr(2)] = unfold([].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, ''));
  return acc;
};

var composeRequestBody = function composeRequestBody(group, additionalfields) {
  return additionalfields.split(',').reduce(requestBodyReducer, {});
};

var getURLReducer = function getURLReducer(acc, curr) {
  return acc + '&' + curr.substr(2) + '=' + [].slice.call(document.querySelectorAll('[name=' + curr.substr(2) + ']')).reduce(groupValueReducer, []).join(',');
};

var composeGetURL = function composeGetURL(baseURL, group, additionalfields) {
  return additionalfields.split(',').reduce(getURLReducer, baseURL + '?');
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
  return group.fields.reduce(groupValueReducer, '');
};

var chooseRealTimeEvent = function chooseRealTimeEvent(input) {
  return ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];
};

// const composer = (f, g) => (...args) => f(g(...args));
// export const compose = (...fns) => fns.reduce(composer);
// export const pipe = (...fns) => fns.reduceRight(composer);

//https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//https://mathiasbynens.be/demo/url-regex
var URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var DATE_ISO_REGEX = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

var NUMBER_REGEX = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

var DIGITS_REGEX = /^\d+$/;

var DOTNET_ERROR_SPAN_DATA_ATTRIBUTE = 'data-valmsg-for';

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
  equalTo: ['equalto-other'],
  remote: ['remote-url', 'remote-additionalfields', 'remote-type'] //??
};

var DOTNET_ADAPTORS = ['required', 'stringlength', 'regex',
// 'digits',
'email', 'number', 'url', 'length', 'range', 'equalto', 'remote'];

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
  minlength: curryParamMethod('minlength', function (param) {
    return function (acc, input) {
      return acc = Array.isArray(input.value) ? input.value.length >= +param : +input.value.length >= +param, acc;
    };
  }),
  maxlength: curryParamMethod('maxlength', function (param) {
    return function (acc, input) {
      return acc = Array.isArray(input.value) ? input.value.length <= +param : +input.value.length <= +param, acc;
    };
  }),
  pattern: curryParamMethod('pattern', function () {
    for (var _len = arguments.length, regexStr = Array(_len), _key = 0; _key < _len; _key++) {
      regexStr[_key] = arguments[_key];
    }

    return function (acc, input) {
      return acc = RegExp(regexStr).test(input.value), acc;
    };
  }),
  regex: curryParamMethod('regex', function () {
    for (var _len2 = arguments.length, regexStr = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      regexStr[_key2] = arguments[_key2];
    }

    return function (acc, input) {
      return acc = RegExp(regexStr).test(input.value), acc;
    };
  }),
  min: curryParamMethod('min', function () {
    for (var _len3 = arguments.length, min = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      min[_key3] = arguments[_key3];
    }

    return function (acc, input) {
      return acc = +input.value >= +min, acc;
    };
  }),
  max: curryParamMethod('max', function () {
    for (var _len4 = arguments.length, max = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      max[_key4] = arguments[_key4];
    }

    return function (acc, input) {
      return acc = +input.value <= +max, acc;
    };
  }),
  length: curryParamMethod('length', function (params) {
    return function (acc, input) {
      return acc = +input.value.length >= +params[0] && (params[1] === undefined || +input.value.length <= +params[1]), acc;
    };
  }),
  range: curryParamMethod('range', function (params) {
    return function (acc, input) {
      return acc = +input.value >= +params[0] && +input.value <= +params[1], acc;
    };
  }),
  remote: function remote(group, params) {
    var _params = _slicedToArray(params, 3),
        url = _params[0],
        additionalfields = _params[1],
        _params$ = _params[2],
        type = _params$ === undefined ? 'get' : _params$;

    return new Promise(function (resolve, reject) {
      fetch(type !== 'get' ? url : composeGetURL(url, group, additionalfields), {
        method: type.toUpperCase(),
        body: type === 'get' ? null : JSON.stringify(composeRequestBody(group, additionalfields)),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        resolve(data);
      }).catch(function (res) {
        resolve(true);
      }); //what to do if endpoint validation fails?
    });
  }

  // rangelength
  // https://jqueryvalidation.org/rangelength-method/
  // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1420

  // range
  // https://jqueryvalidation.org/range-method/
  // 
  // step
  // https://jqueryvalidation.org/step-method/
  // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1441

  // equalTo
  // https://jqueryvalidation.org/equalTo-method/
  // https://github.com/jquery-validation/jquery-validation/blob/master/src/core.js#L1479


  /* 
  Extensions
      - password
      - nonalphamin /\W/g
      - regex/pattern
      - bool
      - fileextensions
  */
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

//Sorry...
var extractDataValValidators = function extractDataValValidators(input) {
  return DOTNET_ADAPTORS.reduce(function (validators, adaptor) {
    return !input.getAttribute('data-val-' + adaptor) ? validators : [].concat(_toConsumableArray(validators), [Object.assign({
      type: adaptor,
      message: input.getAttribute('data-val-' + adaptor) }, DOTNET_PARAMS[adaptor] && {
      params: DOTNET_PARAMS[adaptor].reduce(function (acc, param) {
        input.hasAttribute('data-val-' + param) && acc.push(input.getAttribute('data-val-' + param));
        return acc;
      }, [])
    })]);
  }, []);
};

//for data-rule-* support
//const hasDataAttributePart = (node, part) => [].slice.call(node.dataset).filter(attribute => !!~attribute.indexOf(part)).length > 0;

var extractAttributeValidators = function extractAttributeValidators(input) {
  var validators = [];
  if (input.hasAttribute('required') && input.getAttribute('required') !== 'false') validators.push({ type: 'required' });
  if (input.getAttribute('type') === 'email') validators.push({ type: 'email' });
  if (input.getAttribute('type') === 'url') validators.push({ type: 'url' });
  if (input.getAttribute('type') === 'number') validators.push({ type: 'number' });
  if (input.getAttribute('minlength') && input.getAttribute('minlength') !== 'false') validators.push({ type: 'minlength', params: [input.getAttribute('minlength')] });
  if (input.getAttribute('maxlength') && input.getAttribute('maxlength') !== 'false') validators.push({ type: 'maxlength', params: [input.getAttribute('maxlength')] });
  if (input.getAttribute('min') && input.getAttribute('min') !== 'false') validators.push({ type: 'min', params: [input.getAttribute('min')] });
  if (input.getAttribute('max') && input.getAttribute('max') !== 'false') validators.push({ type: 'max', params: [input.getAttribute('max')] });
  if (input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false') validators.push({ type: 'pattern', params: [input.getAttribute('pattern')] });
  return validators;
};

var normaliseValidators = function normaliseValidators(input) {
  var validators = [];

  if (input.getAttribute('data-val') === 'true') validators = validators.concat(extractDataValValidators(input));else validators = validators.concat(extractAttributeValidators(input));
  /*
  //date
  //dateISO
  //min
  //max
  //step
   //equalTo
      adapters.add("equalto", ["other"], function (options) {
          var prefix = getModelPrefix(options.element.name),
              other = options.params.other,
              fullOtherName = appendModelPrefix(other, prefix),
              element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];
           setValidationValues(options, "equalTo", element);
      });
   //remote
  //digits
  //rangelength
  */

  return validators;
};

// export const validationReducer = group => (acc, validator) => {
//     if(methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null)) return acc;
//     return {
//         valid: false,
//         errorMessages: acc.errorMessages 
//                         ? [...acc.errorMessages, extractErrorMessage(validator, group)] 
//                         : [extractErrorMessage(validator, group)]
//     };;
// };

var validate = function validate(group, validator) {
  return methods[validator.type](group, validator.params && validator.params.length > 0 ? validator.params : null);
};

var assembleValidationGroup = function assembleValidationGroup(acc, input) {
  if (!acc[input.getAttribute('name')]) {
    acc[input.getAttribute('name')] = {
      valid: false,
      validators: normaliseValidators(input),
      fields: [input],
      serverErrorNode: document.querySelector('[' + DOTNET_ERROR_SPAN_DATA_ATTRIBUTE + '=' + input.getAttribute('name') + ']') || false
    };
  } else acc[input.getAttribute('name')].fields.push(input);
  return acc;
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
    //prevent browser validation
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
        var _ref;

        if (!(_ref = []).concat.apply(_ref, _toConsumableArray(res)).includes(false)) _this.form.submit();else _this.renderErrors(), _this.initRealTimeValidation();
      });
    });

    this.form.addEventListener('reset', function (e) {
      _this.clearErrors();
    });
  },
  initRealTimeValidation: function initRealTimeValidation() {
    var handler = function (e) {
      var _this2 = this;

      var group = e.target.getAttribute('name');
      if (this.groups[group].errorDOM) this.removeError(group);
      // if(!this.setGroupValidityState(group)) this.renderError(group);
      this.setGroupValidityState(group).then(function (res) {
        if (res.includes(false)) _this2.renderError(group);
      });
    }.bind(this);

    for (var group in this.groups) {
      this.groups[group].fields.forEach(function (input) {
        input.addEventListener(chooseRealTimeEvent(input), handler);
      });
    }
  },
  setGroupValidityState: function setGroupValidityState(group) {
    var _this3 = this;

    //reset validity and errorMessages
    this.groups[group] = Object.assign({}, this.groups[group], { valid: true, errorMessages: [] });
    return Promise.all(this.groups[group].validators.map(function (validator) {
      return new Promise(function (resolve) {
        //only perform the remote validation if all else passes?

        //refactor, extract this whole fn...
        if (validator.type !== 'remote') {
          if (validate(_this3.groups[group], validator)) resolve(true);else {
            //mutation and side effect...
            _this3.groups[group].valid = false;
            _this3.groups[group].errorMessages.push(extractErrorMessage(validator, group));
            resolve(false);
          }
        } else validate(_this3.groups[group], validator).then(function (res) {
          if (res) resolve(true);else {
            //mutation, side effect, and un-DRY...
            _this3.groups[group].valid = false;
            _this3.groups[group].errorMessages.push(extractErrorMessage(validator, group));
            resolve(false);
          }
        });
      });
    }));
  },
  setValidityState: function setValidityState() {
    var groupValidators = [];
    for (var group in this.groups) {
      groupValidators.push(this.setGroupValidityState(group));
    } //Object.keys(this.groups).map(this.setGroupValidityState)
    return Promise.all(groupValidators);
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
    this.groups[group].errorDOM = this.groups[group].serverErrorNode ? createErrorTextNode(this.groups[group]) : this.groups[group].fields[this.groups[group].fields.length - 1].parentNode.appendChild(h('div', { class: 'error' }, this.groups[group].errorMessages[0]));

    //set aria-invalid on invalid inputs
    this.groups[group].fields.forEach(function (field) {
      field.setAttribute('aria-invalid', 'true');
    });
  },
  addMethod: function addMethod(name, fn, message) {
    this.groups[name].validators.push(fn);
    //extend messages
  }
};

var init = function init(candidate, opts) {
  var els = void 0;

  //assume it's a dom node
  if (typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];else els = [].slice.call(document.querySelectorAll(candidate));

  return els.reduce(function (acc, el) {
    if (el.getAttribute('novalidate')) return;
    acc.push(Object.assign(Object.create(componentPrototype), {
      form: el,
      settings: Object.assign({}, defaults, opts)
    }).init());
    return acc;
  }, []);
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
