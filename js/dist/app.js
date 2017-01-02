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

        return parent.insertBefore(child, firstEl);
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
            el,
            task,
            tasks = this.initialTasks.reverse();

        this.loadTasks(tasks);
    };

    TaskList.prototype.loadTasks = function (tasks) {
        for (t in tasks) {
            task = tasks[t];
            el = this.coupler.domFactory.task({
                id: task.id,
                content: task.content,
                state: task.state
            });

            this.tasksList.appendChild(el);
        }
    }

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
            isTask = obj.coupler.dom.hasClass(target, 'Task'),
            data;

        if (isTask) {
            data = {
                task: target,
                id: target.dataset.id
            };
            obj.coupler.emit('task-state-change', data);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1pbnggPSBNaW54IHx8IHt9O1xuIiwiTWlueC5Eb20gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqXG4gICAgICogSSBzaG91bGQgaGF2ZSBhbiBvcHRpb24gdG86XG4gICAgICpcbiAgICAgKiBHZXQgYW4gZWxlbWVudCBieSBpZC9jbGFzc1xuICAgICAqICAgICAgLSBnZXRCeUlkKCdpZCcpO1xuICAgICAqICAgICAgLSBnZXRCeUNsYXNzKCdjbGFzcycpXG4gICAgICogICAgICAgICAgLSBmaXJzdCgpXG4gICAgICogICAgICAgICAgLSBsYXN0KClcbiAgICAgKiAgICAgICAgICAtIGluZGV4KClcbiAgICAgKiAgICAgIC0gZ2V0QnlEYXRhKCdkYXRhLW5hbWUnKVxuICAgICAqICAgICAgLSBnZXRCeU5hbWUoJycpXG4gICAgICogQ3JlYXRlIGFuIGVsZW1lbnRcbiAgICAgKiBBcHBwZW5kL1ByZXByZW5kXG4gICAgICogUmVtb3ZlIGFuIGVsZW1lbnRcbiAgICAgKiBBdHRhY2ggZXZlbnRzIG9uIGVsZW1lbnRzICg/KVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gRG9tKCkge1xuICAgICAgICB0aGlzLnR5cGVzID0gWycjJywgJy4nXTtcbiAgICAgICAgdGhpcy5kb2MgPSBkb2N1bWVudDtcbiAgICAgICAgdGhpcy5ib2R5ID0gdGhpcy5kb2MuYm9keTtcbiAgICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XG4gICAgfVxuXG4gICAgRG9tLnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHN0YXJ0IHRoZSBEb21cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzZWxlY3Rvci5zdWJzdHIoMCwgc2VsZWN0b3IuaW5kZXhPZignfCcpKSxcbiAgICAgICAgcmVhbCA9IHNlbGVjdG9yLnN1YnN0cih0eXBlLmxlbmd0aCArIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGVzLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUlkKHJlYWwpO1xuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUNsYXNzKHJlYWwpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5Q2xhc3MgPSBmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNscyk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0KSB7XG4gICAgICAgICAgICBvcHQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjcmVhdGVkID0gZ2V0SHRtbEVsKGVsIHx8ICdkaXYnKSxcbiAgICAgICAgYXR0ck5hbWUsXG4gICAgICAgIGF0dHJWYWx1ZTtcblxuICAgICAgICBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGNyZWF0ZWQsIG9wdCk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyZW50LiBDYW5ub3QgYXBwZW5kIHRvIHVuZGVmaW5lZCBwYXJlbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgdmFyIGZpcnN0RWwgPSBwYXJlbnQuZmlyc3RDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICByZXR1cm4gcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgZmlyc3RFbCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNsKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLFxuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcYicgKyBjbCArICdcXFxcYicpO1xuXG4gICAgICAgIHJldHVybiBjbGFzc2VzLm1hdGNoKHJlZ2V4KTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbDtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKD86XnxcXFxccyknICsgY2wgKyAnKD8hXFxcXFMpJyk7XG5cbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZ2V4ICwgJycpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGVsLCBvcHQpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gb3B0LmF0dHJzIHx8IHtjbGFzczogJ1Rhc2snfTtcblxuICAgICAgICBmb3IoYXR0cklkeCBpbiBhdHRycykge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySWR4LCBhdHRyVmFsdWUgPSBhdHRyc1thdHRySWR4XTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHQuaGFzT3duUHJvcGVydHkoJ2NvbnRlbnQnKSkge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gb3B0LmNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIdG1sRWwoZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBEb207XG5cbn0oKSk7XG4iLCJNaW54LlRhc2tMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGZ1bmN0aW9uIFRhc2tMaXN0KCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uIChjb3VwbGVyKSB7XG4gICAgICAgIHRoaXMuY291cGxlciA9IGNvdXBsZXI7XG4gICAgICAgIHRoaXMudGFza3NMaXN0ID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58VGFza3NMaXN0JylbMF07XG4gICAgICAgIHRoaXMubmV3VGFzayA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2snKVswXTtcbiAgICAgICAgdGhpcy5uZXdUYXNrQnRuID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58TmV3VGFza0J0bicpWzBdO1xuICAgICAgICB0aGlzLnRhc2tSZXBvID0gdGhpcy5jb3VwbGVyLnRhc2tSZXBvO1xuICAgICAgICB0aGlzLmluaXRpYWxUYXNrcyA9IHRoaXMudGFza1JlcG8uYWxsKCk7XG5cbiAgICAgICAgLy8gRm9jdXMgb24gdGhlIGlucHV0XG4gICAgICAgIHRoaXMubmV3VGFzay5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUluaXRpYWxUYXNrcygpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuY291cGxlci5iYXRjaFN1YnNjcmliZSh7XG4gICAgICAgICAgICAndGFzay1odG1sLWNyZWF0ZWQnOiB0aGlzLnZpc3VhbGx5QWRkVGFzay5iaW5kKG9iailcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5kaXNwbGF5SW5pdGlhbFRhc2tzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdCxcbiAgICAgICAgICAgIGVsLFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgIHRhc2tzID0gdGhpcy5pbml0aWFsVGFza3MucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMubG9hZFRhc2tzKHRhc2tzKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLmxvYWRUYXNrcyA9IGZ1bmN0aW9uICh0YXNrcykge1xuICAgICAgICBmb3IgKHQgaW4gdGFza3MpIHtcbiAgICAgICAgICAgIHRhc2sgPSB0YXNrc1t0XTtcbiAgICAgICAgICAgIGVsID0gdGhpcy5jb3VwbGVyLmRvbUZhY3RvcnkudGFzayh7XG4gICAgICAgICAgICAgICAgaWQ6IHRhc2suaWQsXG4gICAgICAgICAgICAgICAgY29udGVudDogdGFzay5jb250ZW50LFxuICAgICAgICAgICAgICAgIHN0YXRlOiB0YXNrLnN0YXRlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50YXNrc0xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5ld1Rhc2suYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCAkYWRkVGFzayk7XG4gICAgICAgIHRoaXMubmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICRhZGRUYXNrKTtcbiAgICAgICAgdGhpcy50YXNrc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkY2hhbmdlVGFza1N0YXRlKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnZpc3VhbGx5QWRkVGFzayA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5kb20ucHJlcGVuZCh0aGlzLnRhc2tzTGlzdCwgdGFzayk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICRhZGRUYXNrKGUpIHtcbiAgICAgICAgdmFyIGlzSW5wdXQgPSBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyxcbiAgICAgICAgICAgIHRhcmdldCA9IGlzSW5wdXQgPyBlLnRhcmdldCA6IG9iai5uZXdUYXNrLFxuICAgICAgICAgICAgY29udGVudCA9IHRhcmdldC52YWx1ZS50cmltKCk7XG5cbiAgICAgICAgaWYgKCAoKGUua2V5Q29kZSA9PT0gMTMgJiYgaXNJbnB1dCkgfHwgIWlzSW5wdXQpICYmIGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICAgICAgICBvYmouY291cGxlci5lbWl0KCduZXctdGFzay1zdWJtaXR0ZWQnLCBjb250ZW50KTtcbiAgICAgICAgICAgIHRhcmdldC52YWx1ZSA9ICcnOyAvLyBDbGVhbiB0aGUgaW5wdXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICRjaGFuZ2VUYXNrU3RhdGUoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgICAgICBpc1Rhc2sgPSBvYmouY291cGxlci5kb20uaGFzQ2xhc3ModGFyZ2V0LCAnVGFzaycpLFxuICAgICAgICAgICAgZGF0YTtcblxuICAgICAgICBpZiAoaXNUYXNrKSB7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHRhc2s6IHRhcmdldCxcbiAgICAgICAgICAgICAgICBpZDogdGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBvYmouY291cGxlci5lbWl0KCd0YXNrLXN0YXRlLWNoYW5nZScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFRhc2tMaXN0O1xuXG59KSgpO1xuIiwiTWlueC5Db3JlID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGZ1bmN0aW9uIENvcmUoKSB7XG4gICAgICAgIG9iaiA9IHRoaXM7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvdXBsZXIgPSBNaW54LkNvdXBsZXI7XG4gICAgfVxuXG4gICAgQ29yZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVTdG9yYWdlKCk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5Eb20oKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguRG9tRmFjdG9yeSgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5VdGlsKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tSZXBvKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tMaXN0KCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2soKSk7XG5cbiAgICAgICAgdGhpcy5zdGFydEFsbE1vZHVsZXMoKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUuaW5pdGlhbGl6ZVN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5zdG9yYWdlID0gbmV3IE1pbnguU3RvcmFnZSh7XG4gICAgICAgICAgICBlbmdpbmU6ICdMb2NhbFN0b3JhZ2UnXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5yZWdpc3Rlck1vZHVsZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBnZXRNb2R1bGVOYW1lKG1vZHVsZSk7XG4gICAgICAgIHRoaXNbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMuY291cGxlclttb2R1bGVOYW1lXSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5tb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUuc3RhcnRBbGxNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgICAgICBtb2R1bGUuX3N0YXJ0KG9iai5jb3VwbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE1vZHVsZU5hbWUobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gbW9kdWxlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIHJldHVybiBtb2R1bGVOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgbW9kdWxlTmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIENvcmU7XG5cbn0oKSk7XG5cbnZhciBjb3JlID0gbmV3IE1pbnguQ29yZSgpO1xuY29yZS5ydW4oKTtcbiJdfQ==
