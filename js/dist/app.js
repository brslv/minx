var Minx = Minx || {};

Minx.Dom = (function () {

    /**
     * I should have an option to:
     *
     * Get an element by id/class
     *      - getById('id');
     *      - getByClass('class')
     *          - first()
     *          - last()
     *          - index()
     *      - getByData('data-name')
     *      - getByName('')
     * Create an element
     * Apppend/Preprend
     * Remove an element
     * Attach events on elements (?)
     */

    function Dom() {
        this.types = ['#', '.'];
    }

    Dom.prototype._start = function () {
        // start the Dom
    };

    Dom.prototype.get = function (selector) {
        var type = selector.substr(0, selector.indexOf('|')),
        real = selector.substr(type.length + 1);

        if (this.types.indexOf(type) === -1) {
            return null;
        }

        switch (type) {
            case '#':
            return this.byId(real);
            case '.':
            return this.byClass(real);
            default:
            return null;
        }
    };

    Dom.prototype.byId = function (id) {
        return document.getElementById(id);
    };

    Dom.prototype.byClass = function (cls) {
        return document.getElementsByClassName(cls);
    };

    Dom.prototype.create = function (el, opt) {
        if (undefined === opt) {
            opt = {};
        }

        var created = getHtmlEl(el || 'div'),
        attrName,
        attrValue;

        populateAttributesAndContent(created, opt);

        return created;
    };

    Dom.prototype.append = function (parent, child) {
        if (undefined === parent) {
            throw new Error('Invalid parent. Cannot append to undefined parent.');
        }

        return parent.appendChild(child);
    };

    function populateAttributesAndContent(el, opt) {
        var attrs = opt.attrs || {class: 'Task'};

        for(attrIdx in attrs) {
            attrName = attrIdx, attrValue = attrs[attrIdx];
            el.setAttribute(attrName, attrValue);
        }

        if (opt.hasOwnProperty('content')) {
            el.innerHTML = opt.content;
        }
    }

    function getHtmlEl(el) {
        return document.createElement(el);
    }

    return Dom;

}());

Minx.TaskList = (function() {

    var obj;

    function TaskList() {
        obj = this;
        this.coupler = Minx.Coupler;
        this.tasksList = null;
    }

    TaskList.prototype._start = function () {
        this.tasksList = this.coupler.dom.get('.|TasksList')[0];
        this.newTask = this.coupler.dom.get('.|NewTask')[0];

        // Focus on the input
        this.newTask.focus();

        this.registerEvents();
        this.subscribeForEvents();
    };

    TaskList.prototype.registerEvents = function () {
        this.newTask.onkeypress = $addTask;
    };

    TaskList.prototype.subscribeForEvents = function () {
        this.coupler.subscribe('task-html-created', this.visuallyAdd.bind(obj));
    };

    TaskList.prototype.emitTaskSubmission = function (content) {
        this.coupler.emit('new-task-submitted', content);
    };

    TaskList.prototype.visuallyAdd = function (task) {
        this.coupler.dom.append(this.tasksList, task);
    };

    function $addTask(e) {
        if (e.keyCode === 13) {
            target = e.target;
            obj.emitTaskSubmission(target.value);
            target.value = '';
        }
    }

    return TaskList;

})();

Minx.Core = (function() {

    function Core() {
        this.modules = [];
        this.coupler = Minx.Coupler;
    }

    Core.prototype.run = function () {
        this.registerModule(new Minx.Dom());
        this.registerModule(new Minx.TaskList());
        this.registerModule(new Minx.Task());

        this.startAllModules();
    };

    Core.prototype.registerModule = function (module) {
        var moduleName = getModuleName(module);
        this[moduleName] = module;
        this.coupler[moduleName] = module;
        this.modules.push(module);
    };

    Core.prototype.startAllModules = function () {
        this.modules.forEach(function (module) {
            module._start();
        });
    };

    function getModuleName(module) {
        var moduleName = module.constructor.name;
        return moduleName.charAt(0).toLowerCase() + moduleName.substring(1);
    }

    return Core;

}());

var core = new Minx.Core();
core.run();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNaW54ID0gTWlueCB8fCB7fTtcbiIsIk1pbnguRG9tID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKlxuICAgICAqIEkgc2hvdWxkIGhhdmUgYW4gb3B0aW9uIHRvOlxuICAgICAqXG4gICAgICogR2V0IGFuIGVsZW1lbnQgYnkgaWQvY2xhc3NcbiAgICAgKiAgICAgIC0gZ2V0QnlJZCgnaWQnKTtcbiAgICAgKiAgICAgIC0gZ2V0QnlDbGFzcygnY2xhc3MnKVxuICAgICAqICAgICAgICAgIC0gZmlyc3QoKVxuICAgICAqICAgICAgICAgIC0gbGFzdCgpXG4gICAgICogICAgICAgICAgLSBpbmRleCgpXG4gICAgICogICAgICAtIGdldEJ5RGF0YSgnZGF0YS1uYW1lJylcbiAgICAgKiAgICAgIC0gZ2V0QnlOYW1lKCcnKVxuICAgICAqIENyZWF0ZSBhbiBlbGVtZW50XG4gICAgICogQXBwcGVuZC9QcmVwcmVuZFxuICAgICAqIFJlbW92ZSBhbiBlbGVtZW50XG4gICAgICogQXR0YWNoIGV2ZW50cyBvbiBlbGVtZW50cyAoPylcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIERvbSgpIHtcbiAgICAgICAgdGhpcy50eXBlcyA9IFsnIycsICcuJ107XG4gICAgfVxuXG4gICAgRG9tLnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHN0YXJ0IHRoZSBEb21cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzZWxlY3Rvci5zdWJzdHIoMCwgc2VsZWN0b3IuaW5kZXhPZignfCcpKSxcbiAgICAgICAgcmVhbCA9IHNlbGVjdG9yLnN1YnN0cih0eXBlLmxlbmd0aCArIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGVzLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUlkKHJlYWwpO1xuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUNsYXNzKHJlYWwpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5Q2xhc3MgPSBmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNscyk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0KSB7XG4gICAgICAgICAgICBvcHQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjcmVhdGVkID0gZ2V0SHRtbEVsKGVsIHx8ICdkaXYnKSxcbiAgICAgICAgYXR0ck5hbWUsXG4gICAgICAgIGF0dHJWYWx1ZTtcblxuICAgICAgICBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGNyZWF0ZWQsIG9wdCk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyZW50LiBDYW5ub3QgYXBwZW5kIHRvIHVuZGVmaW5lZCBwYXJlbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChlbCwgb3B0KSB7XG4gICAgICAgIHZhciBhdHRycyA9IG9wdC5hdHRycyB8fCB7Y2xhc3M6ICdUYXNrJ307XG5cbiAgICAgICAgZm9yKGF0dHJJZHggaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0cklkeCwgYXR0clZhbHVlID0gYXR0cnNbYXR0cklkeF07XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0Lmhhc093blByb3BlcnR5KCdjb250ZW50JykpIHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG9wdC5jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SHRtbEVsKGVsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9tO1xuXG59KCkpO1xuIiwiTWlueC5UYXNrTGlzdCA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBUYXNrTGlzdCgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy5jb3VwbGVyID0gTWlueC5Db3VwbGVyO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50YXNrc0xpc3QgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxUYXNrc0xpc3QnKVswXTtcbiAgICAgICAgdGhpcy5uZXdUYXNrID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58TmV3VGFzaycpWzBdO1xuXG4gICAgICAgIC8vIEZvY3VzIG9uIHRoZSBpbnB1dFxuICAgICAgICB0aGlzLm5ld1Rhc2suZm9jdXMoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlRm9yRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXdUYXNrLm9ua2V5cHJlc3MgPSAkYWRkVGFzaztcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnN1YnNjcmliZUZvckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLnN1YnNjcmliZSgndGFzay1odG1sLWNyZWF0ZWQnLCB0aGlzLnZpc3VhbGx5QWRkLmJpbmQob2JqKSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5lbWl0VGFza1N1Ym1pc3Npb24gPSBmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgICB0aGlzLmNvdXBsZXIuZW1pdCgnbmV3LXRhc2stc3VibWl0dGVkJywgY29udGVudCk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS52aXN1YWxseUFkZCA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5kb20uYXBwZW5kKHRoaXMudGFza3NMaXN0LCB0YXNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gJGFkZFRhc2soZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBvYmouZW1pdFRhc2tTdWJtaXNzaW9uKHRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB0YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBUYXNrTGlzdDtcblxufSkoKTtcbiIsIk1pbnguQ29yZSA9IChmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIENvcmUoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvdXBsZXIgPSBNaW54LkNvdXBsZXI7XG4gICAgfVxuXG4gICAgQ29yZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LkRvbSgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrTGlzdCgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrKCkpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRBbGxNb2R1bGVzKCk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLnJlZ2lzdGVyTW9kdWxlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZSA9IGdldE1vZHVsZU5hbWUobW9kdWxlKTtcbiAgICAgICAgdGhpc1ttb2R1bGVOYW1lXSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5jb3VwbGVyW21vZHVsZU5hbWVdID0gbW9kdWxlO1xuICAgICAgICB0aGlzLm1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5zdGFydEFsbE1vZHVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgICAgIG1vZHVsZS5fc3RhcnQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE1vZHVsZU5hbWUobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gbW9kdWxlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIHJldHVybiBtb2R1bGVOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgbW9kdWxlTmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIENvcmU7XG5cbn0oKSk7XG5cbnZhciBjb3JlID0gbmV3IE1pbnguQ29yZSgpO1xuY29yZS5ydW4oKTtcbiJdfQ==
