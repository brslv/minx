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
        this.doc = document;
        this.body = this.doc.body;
        this.window = window;
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

    Dom.prototype.hasClass = function (el, cl) {
        var classes = el.className,
            regex = new RegExp('\\b' + cl + '\\b');

        return classes.match(regex);
    };

    Dom.prototype.addClass = function (el, cl) {
        return el.className += ' ' + cl;
    };

    Dom.prototype.removeClass = function (el, cl) {
        var regex = new RegExp('(?:^|\\s)' + cl + '(?!\\S)');

        return el.className = el.className.replace(regex , '');
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
        this.tasksList = null;
    }

    TaskList.prototype._start = function (coupler) {
        this.coupler = coupler;
        this.tasksList = this.coupler.dom.get('.|TasksList')[0];
        this.newTask = this.coupler.dom.get('.|NewTask')[0];
        this.newTaskBtn = this.coupler.dom.get('.|NewTaskBtn')[0];
        this.task = this.coupler.dom.get('.|TaskContainer');

        // Focus on the input
        this.newTask.focus();

        this.registerEvents();
        this.coupler.batchSubscribe({
            'task-html-created': this.visuallyAddTask.bind(obj)
        });
    };

    TaskList.prototype.registerEvents = function () {
        this.newTask.addEventListener('keypress', $addTask);
        this.newTaskBtn.addEventListener('click', $addTask);
        this.tasksList.addEventListener('click', $changeTaskState);
    };

    TaskList.prototype.visuallyAddTask = function (task) {
        this.coupler.dom.append(this.tasksList, task);
    };

    function $addTask(e) {
        var isInput = e.target.nodeName === 'INPUT',
            target = isInput ? e.target : obj.newTask,
            content = target.value.trim();

        if ( ((e.keyCode === 13 && isInput) || !isInput) && content !== '') {
            obj.coupler.emit('new-task-submitted', content);
            target.value = ''; // Clean the input
        }
    }

    function $changeTaskState(e) {
        var target = e.target,
            isTask = obj.coupler.dom.hasClass(target, 'Task');

        if (isTask) {
            obj.coupler.emit('task-state-change', target);
        }
    }

    return TaskList;

})();

Minx.Core = (function() {

    var obj;

    function Core() {
        obj = this;
        this.modules = [];
        this.coupler = Minx.Coupler;
    }

    Core.prototype.run = function () {
        this.initializeStorage();

        this.registerModule(new Minx.Dom());
        this.registerModule(new Minx.DomFactory());
        this.registerModule(new Minx.Util());
        this.registerModule(new Minx.TaskList());
        this.registerModule(new Minx.Task());
        this.registerModule(new Minx.TaskRepo());

        this.startAllModules();
    };

    Core.prototype.initializeStorage = function () {
        this.coupler.storage = new Minx.Storage({
            engine: 'LocalStorage'
        });
    };

    Core.prototype.registerModule = function (module) {
        var moduleName = getModuleName(module);
        this[moduleName] = module;
        this.coupler[moduleName] = module;
        this.modules.push(module);
    };

    Core.prototype.startAllModules = function () {
        this.modules.forEach(function (module) {
            module._start(obj.coupler);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTWlueCA9IE1pbnggfHwge307XG4iLCJNaW54LkRvbSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAvKipcbiAgICAgKiBJIHNob3VsZCBoYXZlIGFuIG9wdGlvbiB0bzpcbiAgICAgKlxuICAgICAqIEdldCBhbiBlbGVtZW50IGJ5IGlkL2NsYXNzXG4gICAgICogICAgICAtIGdldEJ5SWQoJ2lkJyk7XG4gICAgICogICAgICAtIGdldEJ5Q2xhc3MoJ2NsYXNzJylcbiAgICAgKiAgICAgICAgICAtIGZpcnN0KClcbiAgICAgKiAgICAgICAgICAtIGxhc3QoKVxuICAgICAqICAgICAgICAgIC0gaW5kZXgoKVxuICAgICAqICAgICAgLSBnZXRCeURhdGEoJ2RhdGEtbmFtZScpXG4gICAgICogICAgICAtIGdldEJ5TmFtZSgnJylcbiAgICAgKiBDcmVhdGUgYW4gZWxlbWVudFxuICAgICAqIEFwcHBlbmQvUHJlcHJlbmRcbiAgICAgKiBSZW1vdmUgYW4gZWxlbWVudFxuICAgICAqIEF0dGFjaCBldmVudHMgb24gZWxlbWVudHMgKD8pXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBEb20oKSB7XG4gICAgICAgIHRoaXMudHlwZXMgPSBbJyMnLCAnLiddO1xuICAgICAgICB0aGlzLmRvYyA9IGRvY3VtZW50O1xuICAgICAgICB0aGlzLmJvZHkgPSB0aGlzLmRvYy5ib2R5O1xuICAgICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcbiAgICB9XG5cbiAgICBEb20ucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gc3RhcnQgdGhlIERvbVxuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICB2YXIgdHlwZSA9IHNlbGVjdG9yLnN1YnN0cigwLCBzZWxlY3Rvci5pbmRleE9mKCd8JykpLFxuICAgICAgICByZWFsID0gc2VsZWN0b3Iuc3Vic3RyKHR5cGUubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZXMuaW5kZXhPZih0eXBlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ5SWQocmVhbCk7XG4gICAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ5Q2xhc3MocmVhbCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5ieUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlDbGFzcyA9IGZ1bmN0aW9uIChjbHMpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xzKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZWwsIG9wdCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBvcHQpIHtcbiAgICAgICAgICAgIG9wdCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNyZWF0ZWQgPSBnZXRIdG1sRWwoZWwgfHwgJ2RpdicpLFxuICAgICAgICBhdHRyTmFtZSxcbiAgICAgICAgYXR0clZhbHVlO1xuXG4gICAgICAgIHBvcHVsYXRlQXR0cmlidXRlc0FuZENvbnRlbnQoY3JlYXRlZCwgb3B0KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlZDtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJlbnQuIENhbm5vdCBhcHBlbmQgdG8gdW5kZWZpbmVkIHBhcmVudC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKGVsLCBjbCkge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgY2wgKyAnXFxcXGInKTtcblxuICAgICAgICByZXR1cm4gY2xhc3Nlcy5tYXRjaChyZWdleCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2w7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMpJyArIGNsICsgJyg/IVxcXFxTKScpO1xuXG4gICAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShyZWdleCAsICcnKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChlbCwgb3B0KSB7XG4gICAgICAgIHZhciBhdHRycyA9IG9wdC5hdHRycyB8fCB7Y2xhc3M6ICdUYXNrJ307XG5cbiAgICAgICAgZm9yKGF0dHJJZHggaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0cklkeCwgYXR0clZhbHVlID0gYXR0cnNbYXR0cklkeF07XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0Lmhhc093blByb3BlcnR5KCdjb250ZW50JykpIHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG9wdC5jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SHRtbEVsKGVsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9tO1xuXG59KCkpO1xuIiwiTWlueC5UYXNrTGlzdCA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBUYXNrTGlzdCgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy50YXNrc0xpc3QgPSBudWxsO1xuICAgIH1cblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoY291cGxlcikge1xuICAgICAgICB0aGlzLmNvdXBsZXIgPSBjb3VwbGVyO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufFRhc2tzTGlzdCcpWzBdO1xuICAgICAgICB0aGlzLm5ld1Rhc2sgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxOZXdUYXNrJylbMF07XG4gICAgICAgIHRoaXMubmV3VGFza0J0biA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2tCdG4nKVswXTtcbiAgICAgICAgdGhpcy50YXNrID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58VGFza0NvbnRhaW5lcicpO1xuXG4gICAgICAgIC8vIEZvY3VzIG9uIHRoZSBpbnB1dFxuICAgICAgICB0aGlzLm5ld1Rhc2suZm9jdXMoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuY291cGxlci5iYXRjaFN1YnNjcmliZSh7XG4gICAgICAgICAgICAndGFzay1odG1sLWNyZWF0ZWQnOiB0aGlzLnZpc3VhbGx5QWRkVGFzay5iaW5kKG9iailcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXdUYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgJGFkZFRhc2spO1xuICAgICAgICB0aGlzLm5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkYWRkVGFzayk7XG4gICAgICAgIHRoaXMudGFza3NMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgJGNoYW5nZVRhc2tTdGF0ZSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS52aXN1YWxseUFkZFRhc2sgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB0aGlzLmNvdXBsZXIuZG9tLmFwcGVuZCh0aGlzLnRhc2tzTGlzdCwgdGFzayk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICRhZGRUYXNrKGUpIHtcbiAgICAgICAgdmFyIGlzSW5wdXQgPSBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyxcbiAgICAgICAgICAgIHRhcmdldCA9IGlzSW5wdXQgPyBlLnRhcmdldCA6IG9iai5uZXdUYXNrLFxuICAgICAgICAgICAgY29udGVudCA9IHRhcmdldC52YWx1ZS50cmltKCk7XG5cbiAgICAgICAgaWYgKCAoKGUua2V5Q29kZSA9PT0gMTMgJiYgaXNJbnB1dCkgfHwgIWlzSW5wdXQpICYmIGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgICBvYmouY291cGxlci5lbWl0KCduZXctdGFzay1zdWJtaXR0ZWQnLCBjb250ZW50KTtcbiAgICAgICAgICAgIHRhcmdldC52YWx1ZSA9ICcnOyAvLyBDbGVhbiB0aGUgaW5wdXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICRjaGFuZ2VUYXNrU3RhdGUoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgICAgICBpc1Rhc2sgPSBvYmouY291cGxlci5kb20uaGFzQ2xhc3ModGFyZ2V0LCAnVGFzaycpO1xuXG4gICAgICAgIGlmIChpc1Rhc2spIHtcbiAgICAgICAgICAgIG9iai5jb3VwbGVyLmVtaXQoJ3Rhc2stc3RhdGUtY2hhbmdlJywgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBUYXNrTGlzdDtcblxufSkoKTtcbiIsIk1pbnguQ29yZSA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBDb3JlKCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb3VwbGVyID0gTWlueC5Db3VwbGVyO1xuICAgIH1cblxuICAgIENvcmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RvcmFnZSgpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguRG9tKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LkRvbUZhY3RvcnkoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVXRpbCgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrTGlzdCgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tSZXBvKCkpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRBbGxNb2R1bGVzKCk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLmluaXRpYWxpemVTdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvdXBsZXIuc3RvcmFnZSA9IG5ldyBNaW54LlN0b3JhZ2Uoe1xuICAgICAgICAgICAgZW5naW5lOiAnTG9jYWxTdG9yYWdlJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUucmVnaXN0ZXJNb2R1bGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gZ2V0TW9kdWxlTmFtZShtb2R1bGUpO1xuICAgICAgICB0aGlzW21vZHVsZU5hbWVdID0gbW9kdWxlO1xuICAgICAgICB0aGlzLmNvdXBsZXJbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLnN0YXJ0QWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgbW9kdWxlLl9zdGFydChvYmouY291cGxlcik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKG1vZHVsZSkge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZSA9IG1vZHVsZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICByZXR1cm4gbW9kdWxlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIG1vZHVsZU5hbWUuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHJldHVybiBDb3JlO1xuXG59KCkpO1xuXG52YXIgY29yZSA9IG5ldyBNaW54LkNvcmUoKTtcbmNvcmUucnVuKCk7XG4iXX0=
