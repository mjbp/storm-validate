import Validate from '../../dist';

const onDOMContentLoadedTasks = [() => {
    let validator = Validate.init('form');

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

{ onDOMContentLoadedTasks.forEach((fn) => fn()); }