import Validate from './libs/component';

const onDOMContentLoadedTasks = [() => {
    Validate.init('form');
}];

{ onDOMContentLoadedTasks.forEach((fn) => fn()); }