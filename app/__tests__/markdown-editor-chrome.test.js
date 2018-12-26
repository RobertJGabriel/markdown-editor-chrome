
import Chrome from 'sinon-chrome';
import App from '../scripts.babel/components/app.vue';


describe('License test', () => {

  beforeEach(() => {
    global.chrome = Chrome;
  });

  it('Update License to Paid', () => {
    const license = {
      license: 'FULL'
    }
    return expect(App.methods.updateLicense(license)).toEqual(true);
  });
  it('Update License to not Paid', () => {
    const license = {
      license: 'OVER'
    }
    return expect(App.methods.updateLicense(license)).toEqual(false);
  });
});


describe('Save feature', () => {

  beforeEach(() => {
    const get = jest.fn()
    const set = jest.fn()
    global.chrome = {
      storage: {
        local: {
          set,
          get
        }
      }
    }
  });

  it('Save', () => {
    return expect(App.methods.save(true)).toEqual(true);
  });


});
