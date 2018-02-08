import { UPDATES } from '../constants';

export default {
    [UPDATES.SET_INITIAL_MODEL]: (model, data) => Object.assign({}, model, data),
    [UPDATES.CLEAR_ERRORS]: mdoel => Object.assign({}, model, { 
        groups: Object.keys(model.groups).reduce((acc, group) => {
            acc[group] = Object.assign({}, model.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    }),
    [UPDATES.CLEAR_ERROR]: (model, data) => Object.assign({}, model, {
        groups: Object.assign({}, model.groups, {
            [data]: Object.assign({}, model.groups[data], {
                errorMessages: [],
                valid: true
            })
        })
    }),
    [UPDATES.VALIDATION_ERRORS]: (model, data) => {
        return Object.assign({}, model, { 
            groups: Object.keys(model.groups).reduce((acc, group) => {
                acc[group] = Object.assign({}, model.groups[group], data[group]);
                return acc;
            }, {})
        });
    },
    [UPDATES.VALIDATION_ERROR]: (model, data) => {
        return Object.assign({}, model, {
            groups: Object.assign({}, model.groups, {
                [data.group]: Object.assign({}, model.groups[data.group], {
                    errorMessages: data.errorMessages,
                    valid: false
                })
            })
        })
    }
};