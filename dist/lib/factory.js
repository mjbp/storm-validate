import ACTIONS from './actions';
// import { TRIGGER_EVENTS, KEY_CODES, DATA_ATTRIBUTES } from  './constants';
import Store from './store';

import { getInitialState } from './utils/validators';
// import { clear, render } from './manage-errors';
// import { validateForm } from './validate';

let state;

const validate = () => {};

const addMethod = (type, groupName, method, message) => {
    if(type === undefined || groupName === undefined || method === undefined || message === undefined) return console.warn('Custom validation method cannot be added.');
    state.groups[groupName].validators.push({type, method, message});
};

export default (form, settings) => {

    Store.dispatch(ACTIONS.SET_INITIAL_STATE(getInitialState(form)));

    /*
    state = Object.assign({}, { 
                groups: removeUnvalidatableGroups([].slice.call(form.querySelectorAll('input:not([type=submit]), textarea, select'))
                    .reduce(assembleValidationGroup, {}))
            });
            */

    // form.addEventListener('submit', e => {
    //     e.preventDefault();
    //     clear(state.groups);
    //     validateForm()
    //         .then(res => {
    //             if(![].concat(...res).includes(false)) form.submit();
    //             else {
    //                 render(state.group);
    //                 // initRealTimeValidation();
    //             }
    //         });
    // });

    // form.addEventListener('reset', clear);

    return {
        validate,
        addMethod
    }
};