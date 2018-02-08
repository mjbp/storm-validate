import Validate from './libs/component';

const onDOMContentLoadedTasks = [() => {
    window.validator = Validate.init('form');

    // validator.addMethod(
    //     'test',
    //     'RequiredString',
    //     (value, fields, params) => {
    //         return value === 'test';
    //     },
    //     'Value must equal "test"'
    // );

}];

{ onDOMContentLoadedTasks.forEach((fn) => fn()); }