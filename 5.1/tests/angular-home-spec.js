const AngularHomePage = require('./pages/AngularHomePage');
let page = new AngularHomePage();
describe('angular todo list', function() {
    it('should add a todo', function() {
        page.get();
        page.setTask('foo bar');
        page.clickAdd();

        expect(page.todoList.count()).toEqual(3);
        expect(page.todoList.get(2).getText()).toEqual('foo bar');
    });

    it('should complete new task without error', function() {
        page.todoList.get(2).element(by.css('input')).click();
        let completedAmount = element.all(by.css('.done-true'));
        expect(completedAmount.count()).toEqual(2);
    });

    it('archive completed', function() {
        page.archiveLink.click();
        expect(page.todoList.count()).toEqual(1);
    });
});