"use strict";
class AngularHomePage {
    constructor() {
        this.taskInput = element(by.model('todoList.todoText'));
        this.todoList = element.all(by.repeater('todo in todoList.todos'));
        this.archiveLink = element(by.css('a[ng-click="todoList.archive()"]'));
    }
    get() {
        browser.get('https://angularjs.org/');
    }
    setTask(task) {
        this.taskInput.sendKeys(task);
    }
    clickAdd() {
        element(by.css('[value="add"]')).click();
    }
}

module.exports = AngularHomePage;