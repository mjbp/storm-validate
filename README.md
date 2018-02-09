# Storm Validate

Light, depenendency-free client-side form validation library to support .NET MVC (core) unobtrusive validation (using data-val attributes) and HTML5 constraint validation.


## Usage
```
npm i -S storm-validate
```
```
import Validate from 'storm-validate';
```

or include dist/storm-validate.standalone.js in a script tag for unobstrusive auto-validation.

To add a custom validation method:
```
let validator = Validate.init('form');

validator.addMethod(
    'RequiredString', //input/input group name
    (value, fields, params) => { //validation method
        return value === 'test'; //must return boolean
    },
    'Value must equal "test"' //error message on validation failure
);

```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.