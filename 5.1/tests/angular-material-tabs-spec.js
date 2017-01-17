const AngularMaterialTabs = require('./pages/AngularMaterialTabs');
let page = new AngularMaterialTabs();
describe('angular material tabs', function() {
    it('should add a tab', function() {
        page.get();
        page.setTitle('Sample title');
        page.setContent('Sample content');

        page.clickAddTab();

        let elements = element.all(by.css('.tabsdemoDynamicTabs md-tab'));
        expect(elements.count()).toEqual(11);
    });
    it('should remove a tab', function() {
        page.get();
        page.clickRemoveTab();
        let elements = element.all(by.css('.tabsdemoDynamicTabs md-tab'));
        expect(elements.count()).toEqual(9);
    });
});