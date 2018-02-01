import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (candidate, opts) => {
	let els;

	//assume it's a dom node
	if(typeof candidate !== 'string' && candidate.nodeName && candidate.nodeName === 'FORM') els = [candidate];
	else els = [].slice.call(document.querySelectorAll(candidate));
    
	return els.reduce((acc, el) => {
		if(el.getAttribute('novalidate')) return;
		acc.push(Object.assign(Object.create(componentPrototype), {
			form: el,
			settings: Object.assign({}, defaults, opts)
		}).init());
		return acc;
	}, []);
};

//Auto-initialise
{ 
	[].slice.call(document.querySelectorAll('form'))
	.forEach(form => { form.querySelector('[data-val=true]') && init(form); });
}

export default { init };