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
            regex = new RegExp(cl);

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
        this.subscribeForEvents();
    };

    TaskList.prototype.registerEvents = function () {
        this.newTask.addEventListener('keypress', $addTask);
        this.newTaskBtn.addEventListener('click', $addTask);
        this.tasksList.addEventListener('click', $changeTaskState);
    };

    TaskList.prototype.subscribeForEvents = function () {
        this.coupler.subscribe('task-html-created', this.visuallyAddTask.bind(obj));
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
            target.value = '';
        }
    }

    function $changeTaskState(e) {
        var target = e.target,
            isTask = target.nodeName === 'LI';

        if (isTask) {
            obj.coupler.emit('task-state-changed', target);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNaW54ID0gTWlueCB8fCB7fTtcbiIsIk1pbnguRG9tID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKlxuICAgICAqIEkgc2hvdWxkIGhhdmUgYW4gb3B0aW9uIHRvOlxuICAgICAqXG4gICAgICogR2V0IGFuIGVsZW1lbnQgYnkgaWQvY2xhc3NcbiAgICAgKiAgICAgIC0gZ2V0QnlJZCgnaWQnKTtcbiAgICAgKiAgICAgIC0gZ2V0QnlDbGFzcygnY2xhc3MnKVxuICAgICAqICAgICAgICAgIC0gZmlyc3QoKVxuICAgICAqICAgICAgICAgIC0gbGFzdCgpXG4gICAgICogICAgICAgICAgLSBpbmRleCgpXG4gICAgICogICAgICAtIGdldEJ5RGF0YSgnZGF0YS1uYW1lJylcbiAgICAgKiAgICAgIC0gZ2V0QnlOYW1lKCcnKVxuICAgICAqIENyZWF0ZSBhbiBlbGVtZW50XG4gICAgICogQXBwcGVuZC9QcmVwcmVuZFxuICAgICAqIFJlbW92ZSBhbiBlbGVtZW50XG4gICAgICogQXR0YWNoIGV2ZW50cyBvbiBlbGVtZW50cyAoPylcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIERvbSgpIHtcbiAgICAgICAgdGhpcy50eXBlcyA9IFsnIycsICcuJ107XG4gICAgICAgIHRoaXMuZG9jID0gZG9jdW1lbnQ7XG4gICAgICAgIHRoaXMuYm9keSA9IHRoaXMuZG9jLmJvZHk7XG4gICAgICAgIHRoaXMud2luZG93ID0gd2luZG93O1xuICAgIH1cblxuICAgIERvbS5wcm90b3R5cGUuX3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBzdGFydCB0aGUgRG9tXG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciB0eXBlID0gc2VsZWN0b3Iuc3Vic3RyKDAsIHNlbGVjdG9yLmluZGV4T2YoJ3wnKSksXG4gICAgICAgIHJlYWwgPSBzZWxlY3Rvci5zdWJzdHIodHlwZS5sZW5ndGggKyAxKTtcblxuICAgICAgICBpZiAodGhpcy50eXBlcy5pbmRleE9mKHR5cGUpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnlJZChyZWFsKTtcbiAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnlDbGFzcyhyZWFsKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5ieUNsYXNzID0gZnVuY3Rpb24gKGNscykge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbHMpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCwgb3B0KSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IG9wdCkge1xuICAgICAgICAgICAgb3B0ID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3JlYXRlZCA9IGdldEh0bWxFbChlbCB8fCAnZGl2JyksXG4gICAgICAgIGF0dHJOYW1lLFxuICAgICAgICBhdHRyVmFsdWU7XG5cbiAgICAgICAgcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChjcmVhdGVkLCBvcHQpO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVkO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmVudC4gQ2Fubm90IGFwcGVuZCB0byB1bmRlZmluZWQgcGFyZW50LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLFxuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKGNsKTtcblxuICAgICAgICByZXR1cm4gY2xhc3Nlcy5tYXRjaChyZWdleCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2w7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMpJyArIGNsICsgJyg/IVxcXFxTKScpO1xuXG4gICAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShyZWdleCAsICcnKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChlbCwgb3B0KSB7XG4gICAgICAgIHZhciBhdHRycyA9IG9wdC5hdHRycyB8fCB7Y2xhc3M6ICdUYXNrJ307XG5cbiAgICAgICAgZm9yKGF0dHJJZHggaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0cklkeCwgYXR0clZhbHVlID0gYXR0cnNbYXR0cklkeF07XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0Lmhhc093blByb3BlcnR5KCdjb250ZW50JykpIHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG9wdC5jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SHRtbEVsKGVsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9tO1xuXG59KCkpO1xuIiwiTWlueC5UYXNrTGlzdCA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBUYXNrTGlzdCgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy50YXNrc0xpc3QgPSBudWxsO1xuICAgIH1cblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoY291cGxlcikge1xuICAgICAgICB0aGlzLmNvdXBsZXIgPSBjb3VwbGVyO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufFRhc2tzTGlzdCcpWzBdO1xuICAgICAgICB0aGlzLm5ld1Rhc2sgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxOZXdUYXNrJylbMF07XG4gICAgICAgIHRoaXMubmV3VGFza0J0biA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2tCdG4nKVswXTtcbiAgICAgICAgdGhpcy50YXNrID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58VGFza0NvbnRhaW5lcicpO1xuXG4gICAgICAgIC8vIEZvY3VzIG9uIHRoZSBpbnB1dFxuICAgICAgICB0aGlzLm5ld1Rhc2suZm9jdXMoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlRm9yRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXdUYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgJGFkZFRhc2spO1xuICAgICAgICB0aGlzLm5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkYWRkVGFzayk7XG4gICAgICAgIHRoaXMudGFza3NMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgJGNoYW5nZVRhc2tTdGF0ZSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5zdWJzY3JpYmVGb3JFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5zdWJzY3JpYmUoJ3Rhc2staHRtbC1jcmVhdGVkJywgdGhpcy52aXN1YWxseUFkZFRhc2suYmluZChvYmopKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnZpc3VhbGx5QWRkVGFzayA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5kb20uYXBwZW5kKHRoaXMudGFza3NMaXN0LCB0YXNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gJGFkZFRhc2soZSkge1xuICAgICAgICB2YXIgaXNJbnB1dCA9IGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnSU5QVVQnLFxuICAgICAgICAgICAgdGFyZ2V0ID0gaXNJbnB1dCA/IGUudGFyZ2V0IDogb2JqLm5ld1Rhc2ssXG4gICAgICAgICAgICBjb250ZW50ID0gdGFyZ2V0LnZhbHVlLnRyaW0oKTtcblxuICAgICAgICBpZiAoICgoZS5rZXlDb2RlID09PSAxMyAmJiBpc0lucHV0KSB8fCAhaXNJbnB1dCkgJiYgY29udGVudCAhPT0gJycpIHtcbiAgICAgICAgICAgIG9iai5jb3VwbGVyLmVtaXQoJ25ldy10YXNrLXN1Ym1pdHRlZCcsIGNvbnRlbnQpO1xuICAgICAgICAgICAgdGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkY2hhbmdlVGFza1N0YXRlKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICAgICAgaXNUYXNrID0gdGFyZ2V0Lm5vZGVOYW1lID09PSAnTEknO1xuXG4gICAgICAgIGlmIChpc1Rhc2spIHtcbiAgICAgICAgICAgIG9iai5jb3VwbGVyLmVtaXQoJ3Rhc2stc3RhdGUtY2hhbmdlZCcsIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gVGFza0xpc3Q7XG5cbn0pKCk7XG4iLCJNaW54LkNvcmUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgb2JqO1xuXG4gICAgZnVuY3Rpb24gQ29yZSgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gW107XG4gICAgICAgIHRoaXMuY291cGxlciA9IE1pbnguQ291cGxlcjtcbiAgICB9XG5cbiAgICBDb3JlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVN0b3JhZ2UoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LkRvbSgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5VdGlsKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tMaXN0KCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2soKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFza1JlcG8oKSk7XG5cbiAgICAgICAgdGhpcy5zdGFydEFsbE1vZHVsZXMoKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5zdG9yYWdlID0gbmV3IE1pbnguU3RvcmFnZSh7XG4gICAgICAgICAgICBlbmdpbmU6ICdMb2NhbFN0b3JhZ2UnXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5yZWdpc3Rlck1vZHVsZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBnZXRNb2R1bGVOYW1lKG1vZHVsZSk7XG4gICAgICAgIHRoaXNbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMuY291cGxlclttb2R1bGVOYW1lXSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5tb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUuc3RhcnRBbGxNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgICAgICBtb2R1bGUuX3N0YXJ0KG9iai5jb3VwbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE1vZHVsZU5hbWUobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gbW9kdWxlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIHJldHVybiBtb2R1bGVOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgbW9kdWxlTmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIENvcmU7XG5cbn0oKSk7XG5cbnZhciBjb3JlID0gbmV3IE1pbnguQ29yZSgpO1xuY29yZS5ydW4oKTtcbiJdfQ==
