import updates from '../updates';
// import render from '../renderer';

let model = {};

window.MODEL_HISTORY = [];

const getModel = () => model;

const update = function(type, nextModel, effects) {
    model = nextModel ? updates[type](model, nextModel) : model;
    // window.MODEL_HISTORY.push({[action.type]: model});
    console.log({[type]: model});
    if(!effects) return;
    effects.forEach(effect => {
        effect(model);
    });
};

export default {
    update,
    getModel
};