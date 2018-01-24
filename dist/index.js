/**
 * @name storm-validate: 
 * @version 0.1.0: Wed, 24 Jan 2018 18:01:45 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	// let els = [].slice.call(document.querySelectorAll(sel));
    let els = Array.from(document.querySelectorAll(sel));

	if(!els.length) return console.warn(`Validation not initialised, no augmentable elements found for selector ${sel}`);
    
	return els.reduce((acc, el) => {
		if(el.getAttribute('novalidate')) return;
		acc.push(Object.assign(Object.create(componentPrototype), {
			form: el,
			inputs: Array.from(el.querySelectorAll('input:not([type=submit]), textarea, select')),
			settings: Object.assign({}, defaults, opts)
		}).init());
		return acc;
	}, []);
};

export default { init };