import Validation from '../src';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<form method="post" action="" autocomplete="off">
        <label for="clen">Text (required, min 2 characters, max 8 characters)</label>
        <input id="clen" name="clen" data-val="true" data-val-length="Please enter between 2 and 8 characters"  data-val-required="This field is required" data-val-min="2" data-val-max="8" type="text">
        <span class="text-danger field-validation-valid" data-valmsg-for="cn" data-valmsg-replace="true"></span>
  </form>`;

    const validator = Validation.init('form');
};


describe('Initialisation', () => {
  beforeAll(init);
  it('should return an Object with validate and addMethod functions', async () => {
      expect(window.__validators__).not.toBeNull();

    // validator.should.be.an.instanceOf(Object).and.not.empty();
    // validator[form].should.have.property('validate').Function()
    // validator[form].should.have.property('addMethod').Function();

  });

//   it('should write errors to the dom on validation', () => {

//     validator[form].validate();

//     //validate required text input
//     window.setTimeout(()=> {
//         document.getElementById('cn').nextElementSibling.innerHTML.should.be.equal('Custom error message');
//         document.getElementById('cn').nextElementSibling.classList.should.containEql('field-validation-error');
//     }, 0);

//   });

});