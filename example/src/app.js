import Validate from './libs/component';

const onDOMContentLoadedTasks = [() => {
    let validator = Validate.init('form');

    validator.addMethod(
        'test',
        'RequiredString',
        (value, fields, params) => {
            return value === 'test';
        },
        'Value must equal "test"'
    );

}];

{ onDOMContentLoadedTasks.forEach((fn) => fn()); }