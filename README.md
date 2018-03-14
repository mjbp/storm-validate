# Storm Validate
[![npm version](https://badge.fury.io/js/storm-validate.svg)](https://badge.fury.io/js/storm-validate)

Light, depenendency-free client-side form validation library to support .NET MVC (core) unobtrusive validation (using data-val attributes) and HTML5 constraint validation.

## Example
[https://stormid.github.io/storm-validate](https://stormid.github.io/storm-validate)

## Usage
HTML
```
<form action="./">
    <!-- Any form with inputs containing HTML validation attributes -->
	<input type="text" name="field-1" id="field-1" required>
	<input type="email" name="field-2" id="field-2" required>
	<input type="text" name="field-3" id="field-3" pattern="\d*" required>
    
    <!-- or .NET MVC-generated data-val attributes -->
    <input type="text" data-val="true" data-val-required="The Required String field is required." name="field-4" id="field-4" />
    <span style="color: red" class="field-validation-valid" data-valmsg-for="field-4" data-valmsg-replace="true" />
    <!-- The server-rendered error DOM is recycled by this client-side library to show errors -->
    <input type="submit">
</div>
```

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
    'MyFieldName', //input/input group name
    (value, fields, params) => { //validation method
        return value === 'test'; //must return boolean
    },
    'Value must equal "test"' //error message on validation failure
);

```

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign, Promises and element.classList so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT