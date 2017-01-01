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

    Dom.prototype.prepend = function (parent, child) {
        var firstEl = parent.firstChild.nextSibling;

        parent.insertBefore(child, firstEl);
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
        this.taskRepo = this.coupler.taskRepo;
        this.initialTasks = this.taskRepo.all();

        // Focus on the input
        this.newTask.focus();

        this.displayInitialTasks();
        this.registerEvents();
        this.coupler.batchSubscribe({
            'task-html-created': this.visuallyAddTask.bind(obj)
        });
    };

    TaskList.prototype.displayInitialTasks = function () {
        var t,
            el;

        for (t of this.initialTasks.reverse()) {
            el = this.coupler.domFactory.task({
                content: t.content,
                state: t.state
            });

            this.tasksList.appendChild(el);
        }
    };

    TaskList.prototype.registerEvents = function () {
        this.newTask.addEventListener('keypress', $addTask);
        this.newTaskBtn.addEventListener('click', $addTask);
        this.tasksList.addEventListener('click', $changeTaskState);
    };

    TaskList.prototype.visuallyAddTask = function (task) {
        this.coupler.dom.prepend(this.tasksList, task);
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
        this.registerModule(new Minx.TaskRepo());
        this.registerModule(new Minx.TaskList());
        this.registerModule(new Minx.Task());

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNaW54ID0gTWlueCB8fCB7fTtcbiIsIk1pbnguRG9tID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKlxuICAgICAqIEkgc2hvdWxkIGhhdmUgYW4gb3B0aW9uIHRvOlxuICAgICAqXG4gICAgICogR2V0IGFuIGVsZW1lbnQgYnkgaWQvY2xhc3NcbiAgICAgKiAgICAgIC0gZ2V0QnlJZCgnaWQnKTtcbiAgICAgKiAgICAgIC0gZ2V0QnlDbGFzcygnY2xhc3MnKVxuICAgICAqICAgICAgICAgIC0gZmlyc3QoKVxuICAgICAqICAgICAgICAgIC0gbGFzdCgpXG4gICAgICogICAgICAgICAgLSBpbmRleCgpXG4gICAgICogICAgICAtIGdldEJ5RGF0YSgnZGF0YS1uYW1lJylcbiAgICAgKiAgICAgIC0gZ2V0QnlOYW1lKCcnKVxuICAgICAqIENyZWF0ZSBhbiBlbGVtZW50XG4gICAgICogQXBwcGVuZC9QcmVwcmVuZFxuICAgICAqIFJlbW92ZSBhbiBlbGVtZW50XG4gICAgICogQXR0YWNoIGV2ZW50cyBvbiBlbGVtZW50cyAoPylcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIERvbSgpIHtcbiAgICAgICAgdGhpcy50eXBlcyA9IFsnIycsICcuJ107XG4gICAgICAgIHRoaXMuZG9jID0gZG9jdW1lbnQ7XG4gICAgICAgIHRoaXMuYm9keSA9IHRoaXMuZG9jLmJvZHk7XG4gICAgICAgIHRoaXMud2luZG93ID0gd2luZG93O1xuICAgIH1cblxuICAgIERvbS5wcm90b3R5cGUuX3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBzdGFydCB0aGUgRG9tXG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciB0eXBlID0gc2VsZWN0b3Iuc3Vic3RyKDAsIHNlbGVjdG9yLmluZGV4T2YoJ3wnKSksXG4gICAgICAgIHJlYWwgPSBzZWxlY3Rvci5zdWJzdHIodHlwZS5sZW5ndGggKyAxKTtcblxuICAgICAgICBpZiAodGhpcy50eXBlcy5pbmRleE9mKHR5cGUpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnlJZChyZWFsKTtcbiAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnlDbGFzcyhyZWFsKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5ieUNsYXNzID0gZnVuY3Rpb24gKGNscykge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbHMpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCwgb3B0KSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IG9wdCkge1xuICAgICAgICAgICAgb3B0ID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3JlYXRlZCA9IGdldEh0bWxFbChlbCB8fCAnZGl2JyksXG4gICAgICAgIGF0dHJOYW1lLFxuICAgICAgICBhdHRyVmFsdWU7XG5cbiAgICAgICAgcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChjcmVhdGVkLCBvcHQpO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVkO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGlmICh1bmRlZmluZWQgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmVudC4gQ2Fubm90IGFwcGVuZCB0byB1bmRlZmluZWQgcGFyZW50LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIHZhciBmaXJzdEVsID0gcGFyZW50LmZpcnN0Q2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgZmlyc3RFbCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLFxuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbCArICdcXFxcYicpO1xuXG4gICAgICAgIHJldHVybiBjbGFzc2VzLm1hdGNoKHJlZ2V4KTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbDtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKD86XnxcXFxccyknICsgY2wgKyAnKD8hXFxcXFMpJyk7XG5cbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZ2V4ICwgJycpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGVsLCBvcHQpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gb3B0LmF0dHJzIHx8IHtjbGFzczogJ1Rhc2snfTtcblxuICAgICAgICBmb3IoYXR0cklkeCBpbiBhdHRycykge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySWR4LCBhdHRyVmFsdWUgPSBhdHRyc1thdHRySWR4XTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHQuaGFzT3duUHJvcGVydHkoJ2NvbnRlbnQnKSkge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gb3B0LmNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIdG1sRWwoZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBEb207XG5cbn0oKSk7XG4iLCJNaW54LlRhc2tMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGZ1bmN0aW9uIFRhc2tMaXN0KCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uIChjb3VwbGVyKSB7XG4gICAgICAgIHRoaXMuY291cGxlciA9IGNvdXBsZXI7XG4gICAgICAgIHRoaXMudGFza3NMaXN0ID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58VGFza3NMaXN0JylbMF07XG4gICAgICAgIHRoaXMubmV3VGFzayA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2snKVswXTtcbiAgICAgICAgdGhpcy5uZXdUYXNrQnRuID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58TmV3VGFza0J0bicpWzBdO1xuICAgICAgICB0aGlzLnRhc2tSZXBvID0gdGhpcy5jb3VwbGVyLnRhc2tSZXBvO1xuICAgICAgICB0aGlzLmluaXRpYWxUYXNrcyA9IHRoaXMudGFza1JlcG8uYWxsKCk7XG5cbiAgICAgICAgLy8gRm9jdXMgb24gdGhlIGlucHV0XG4gICAgICAgIHRoaXMubmV3VGFzay5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUluaXRpYWxUYXNrcygpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuY291cGxlci5iYXRjaFN1YnNjcmliZSh7XG4gICAgICAgICAgICAndGFzay1odG1sLWNyZWF0ZWQnOiB0aGlzLnZpc3VhbGx5QWRkVGFzay5iaW5kKG9iailcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5kaXNwbGF5SW5pdGlhbFRhc2tzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCxcbiAgICAgICAgICAgIGVsO1xuXG4gICAgICAgIGZvciAodCBvZiB0aGlzLmluaXRpYWxUYXNrcy5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIGVsID0gdGhpcy5jb3VwbGVyLmRvbUZhY3RvcnkudGFzayh7XG4gICAgICAgICAgICAgICAgY29udGVudDogdC5jb250ZW50LFxuICAgICAgICAgICAgICAgIHN0YXRlOiB0LnN0YXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50YXNrc0xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXdUYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgJGFkZFRhc2spO1xuICAgICAgICB0aGlzLm5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkYWRkVGFzayk7XG4gICAgICAgIHRoaXMudGFza3NMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgJGNoYW5nZVRhc2tTdGF0ZSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS52aXN1YWxseUFkZFRhc2sgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB0aGlzLmNvdXBsZXIuZG9tLnByZXBlbmQodGhpcy50YXNrc0xpc3QsIHRhc2spO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkYWRkVGFzayhlKSB7XG4gICAgICAgIHZhciBpc0lucHV0ID0gZS50YXJnZXQubm9kZU5hbWUgPT09ICdJTlBVVCcsXG4gICAgICAgICAgICB0YXJnZXQgPSBpc0lucHV0ID8gZS50YXJnZXQgOiBvYmoubmV3VGFzayxcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0YXJnZXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgIGlmICggKChlLmtleUNvZGUgPT09IDEzICYmIGlzSW5wdXQpIHx8ICFpc0lucHV0KSAmJiBjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgICAgb2JqLmNvdXBsZXIuZW1pdCgnbmV3LXRhc2stc3VibWl0dGVkJywgY29udGVudCk7XG4gICAgICAgICAgICB0YXJnZXQudmFsdWUgPSAnJzsgLy8gQ2xlYW4gdGhlIGlucHV0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkY2hhbmdlVGFza1N0YXRlKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LFxuICAgICAgICAgICAgaXNUYXNrID0gb2JqLmNvdXBsZXIuZG9tLmhhc0NsYXNzKHRhcmdldCwgJ1Rhc2snKTtcblxuICAgICAgICBpZiAoaXNUYXNrKSB7XG4gICAgICAgICAgICBvYmouY291cGxlci5lbWl0KCd0YXNrLXN0YXRlLWNoYW5nZScsIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gVGFza0xpc3Q7XG5cbn0pKCk7XG4iLCJNaW54LkNvcmUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgb2JqO1xuXG4gICAgZnVuY3Rpb24gQ29yZSgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gW107XG4gICAgICAgIHRoaXMuY291cGxlciA9IE1pbnguQ291cGxlcjtcbiAgICB9XG5cbiAgICBDb3JlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVN0b3JhZ2UoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LkRvbSgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5Eb21GYWN0b3J5KCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlV0aWwoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFza1JlcG8oKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFza0xpc3QoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFzaygpKTtcblxuICAgICAgICB0aGlzLnN0YXJ0QWxsTW9kdWxlcygpO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5pbml0aWFsaXplU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLnN0b3JhZ2UgPSBuZXcgTWlueC5TdG9yYWdlKHtcbiAgICAgICAgICAgIGVuZ2luZTogJ0xvY2FsU3RvcmFnZSdcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLnJlZ2lzdGVyTW9kdWxlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZSA9IGdldE1vZHVsZU5hbWUobW9kdWxlKTtcbiAgICAgICAgdGhpc1ttb2R1bGVOYW1lXSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5jb3VwbGVyW21vZHVsZU5hbWVdID0gbW9kdWxlO1xuICAgICAgICB0aGlzLm1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5zdGFydEFsbE1vZHVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgICAgIG1vZHVsZS5fc3RhcnQob2JqLmNvdXBsZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZShtb2R1bGUpIHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBtb2R1bGUuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgcmV0dXJuIG1vZHVsZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBtb2R1bGVOYW1lLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQ29yZTtcblxufSgpKTtcblxudmFyIGNvcmUgPSBuZXcgTWlueC5Db3JlKCk7XG5jb3JlLnJ1bigpO1xuIl19
