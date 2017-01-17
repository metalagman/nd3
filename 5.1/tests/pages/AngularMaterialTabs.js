"use strict";
class AngularMaterialTabs {
    constructor() {
        this.titleInput = element(by.model('tTitle'));
        this.contentInput = element(by.model('tContent'));
    }
    get() {
        browser.get('https://material.angularjs.org/latest/demo/tabs');
    }
    setTitle(title) {
        this.titleInput.sendKeys(title);
    }
    setContent(content) {
        this.contentInput.sendKeys(content);
    }
    clickAddTab() {
        element(by.css(".tabsdemoDynamicTabs .add-tab")).click();
    }
    clickRemoveTab() {
        element(by.css(".tabsdemoDynamicTabs .md-active button")).click();
    }
}

module.exports = AngularMaterialTabs;