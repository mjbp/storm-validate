import should from 'should';
import 'jsdom-global/register';
import Validate from '../dist/storm-validate.standalone';

const html = `<form method="post" action="" autocomplete="off">
<fieldset>
  <div class="form-group">
    <label for="cn">Text (required, at least 2 characters)</label>
    <input id="cn" name="cn" data-val="true" data-val-length="Please enter at least 2 characters." data-val-min="2" type="text" data-val-required="Custom error message">
    <span class="text-danger field-validation-valid" data-valmsg-for="cn" data-valmsg-replace="true"></span>
  </div>
  <div class="form-group">
    <label for="clen">Text (required, min 2 characters, max 8 characters)</label>
    <input id="clen" name="clen" data-val="true" data-val-length="Please enter between 2 and 8 characters"  data-val-required="This field is required" data-val-min="2" data-val-max="8" type="text">
    <span class="text-danger field-validation-valid" data-valmsg-for="cn" data-valmsg-replace="true"></span>
  </div>
  <div class="form-group">
    <label for="ignored">Ignored</label>
    <input id="ignored" name="ignored" type="text">
   </div>
<div class="form-group">
    <label for="cemail">HTML5 email (required)</label>
    <input id="cemail" type="email" name="email" required>
</div>
<div class="form-group">
    <label for="dvemail">data-val email (required)</label>
    <input id="dvemail" type="text" data-val="true" data-val-email="Please enter a valid email address." data-val-required="This field is required." name="dvemail" >
</div>
<div class="form-group">
    <label for="curl">HTML5 URL (optional)</label>
    <input id="curl" type="url" name="url">
</div>
<div class="form-group">
    <label for="dv">data-val URL (optional)</label>
    <input id="dv" data-val="true" data-val-url="Please enter a valid URL" type="text" name="dvurl">
</div>
<div class="form-group">
    <label for="ccomment">HTML5 required</label>
    <textarea id="ccomment" name="comment" required></textarea>
</div>
<div class="form-group">
    <fieldset>
        <div class="boolean-group">
            <label for="cb-1">Option 1</label>
            <input type="checkbox" name="cb" id="cb-1" value="option 1" data-val="true" data-val-required="One of these fields is required">
        </div>
        <div class="boolean-group">
            <label for="cb-2">Option 2</label>
            <input type="checkbox" name="cb" id="cb-2" value="option 2">
        </div>
    </fieldset>
</div>
<div class="form-group">
    <fieldset>
        <div class="boolean-group">
            <label for="rb-1">Option 1</label>
            <input type="radio" name="rb" id="rb-1" value="option 1" required>
        </div>
        <div class="boolean-group">
            <label for="rb-2">Option 2</label>
            <input type="radio" name="rb" id="rb-2" value="option 2" required>
        </div>
    </fieldset>
</div>
<input type="submit" value="Submit">
<!-- <input type="reset" value="Reset"> -->
</fieldset>
</form>`;

document.body.innerHTML = html;
  
let validator = Validate.init('form');

let form = document.querySelector('form');


describe('Initialisation', () => {

  it('should return an Object with validate and addMethod functions', () => {

    validator.should.be.an.instanceOf(Object).and.not.empty();
    validator[form].should.have.property('validate').Function()
    validator[form].should.have.property('addMethod').Function();

  });

  it('should write errors to the dom on validation', () => {

    validator[form].validate();

    //validate required text input
    window.setTimeout(()=> {
        document.getElementById('cn').nextElementSibling.innerHTML.should.be.equal('Custom error message');
        document.getElementById('cn').nextElementSibling.classList.should.containEql('field-validation-error');
    }, 0);

  });

/*
Interegate individual fns
*/

});