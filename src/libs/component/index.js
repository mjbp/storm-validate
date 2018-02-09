import defaults from './lib/constants/defaults';
import factory from './lib';

const init = (candidate, opts) => {
	let els;

	if(typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];
	else els = [].slice.call(document.querySelectorAll(candidate));
	
	if(els.length === 1 && window.__validators__ && window.__validators__[els[0]])
		return window.__validators__[els[0]];
	
	//attached to window.__validators__
	//so we can both init, auto-initialise and refer back to an instance attached to a form to add additional validators
	return window.__validators__ = 
		Object.assign({}, window.__validators__, els.reduce((acc, el) => {
			if(el.getAttribute('novalidate')) return;
			acc[el] = Object.assign(Object.create(factory(el, Object.assign({}, defaults, opts))));
			return el.setAttribute('novalidate', 'novalidate'), acc;
		}, {}));
};

//Auto-initialise
{ 
	[].slice.call(document.querySelectorAll('form'))
		.forEach(form => { form.querySelector('[data-val=true]') && init(form); });
}

export default { init };