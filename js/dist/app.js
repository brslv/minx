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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1pbnggPSBNaW54IHx8IHt9O1xuIiwiTWlueC5Eb20gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqXG4gICAgICogSSBzaG91bGQgaGF2ZSBhbiBvcHRpb24gdG86XG4gICAgICpcbiAgICAgKiBHZXQgYW4gZWxlbWVudCBieSBpZC9jbGFzc1xuICAgICAqICAgICAgLSBnZXRCeUlkKCdpZCcpO1xuICAgICAqICAgICAgLSBnZXRCeUNsYXNzKCdjbGFzcycpXG4gICAgICogICAgICAgICAgLSBmaXJzdCgpXG4gICAgICogICAgICAgICAgLSBsYXN0KClcbiAgICAgKiAgICAgICAgICAtIGluZGV4KClcbiAgICAgKiAgICAgIC0gZ2V0QnlEYXRhKCdkYXRhLW5hbWUnKVxuICAgICAqICAgICAgLSBnZXRCeU5hbWUoJycpXG4gICAgICogQ3JlYXRlIGFuIGVsZW1lbnRcbiAgICAgKiBBcHBwZW5kL1ByZXByZW5kXG4gICAgICogUmVtb3ZlIGFuIGVsZW1lbnRcbiAgICAgKiBBdHRhY2ggZXZlbnRzIG9uIGVsZW1lbnRzICg/KVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gRG9tKCkge1xuICAgICAgICB0aGlzLnR5cGVzID0gWycjJywgJy4nXTtcbiAgICAgICAgdGhpcy5kb2MgPSBkb2N1bWVudDtcbiAgICAgICAgdGhpcy5ib2R5ID0gdGhpcy5kb2MuYm9keTtcbiAgICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XG4gICAgfVxuXG4gICAgRG9tLnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHN0YXJ0IHRoZSBEb21cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzZWxlY3Rvci5zdWJzdHIoMCwgc2VsZWN0b3IuaW5kZXhPZignfCcpKSxcbiAgICAgICAgcmVhbCA9IHNlbGVjdG9yLnN1YnN0cih0eXBlLmxlbmd0aCArIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGVzLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUlkKHJlYWwpO1xuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUNsYXNzKHJlYWwpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5Q2xhc3MgPSBmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNscyk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0KSB7XG4gICAgICAgICAgICBvcHQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjcmVhdGVkID0gZ2V0SHRtbEVsKGVsIHx8ICdkaXYnKSxcbiAgICAgICAgYXR0ck5hbWUsXG4gICAgICAgIGF0dHJWYWx1ZTtcblxuICAgICAgICBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGNyZWF0ZWQsIG9wdCk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyZW50LiBDYW5ub3QgYXBwZW5kIHRvIHVuZGVmaW5lZCBwYXJlbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBlbC5jbGFzc05hbWUsXG4gICAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAoY2wpO1xuXG4gICAgICAgIHJldHVybiBjbGFzc2VzLm1hdGNoKHJlZ2V4KTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbDtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2wpIHtcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKD86XnxcXFxccyknICsgY2wgKyAnKD8hXFxcXFMpJyk7XG5cbiAgICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZ2V4ICwgJycpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGVsLCBvcHQpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gb3B0LmF0dHJzIHx8IHtjbGFzczogJ1Rhc2snfTtcblxuICAgICAgICBmb3IoYXR0cklkeCBpbiBhdHRycykge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySWR4LCBhdHRyVmFsdWUgPSBhdHRyc1thdHRySWR4XTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHQuaGFzT3duUHJvcGVydHkoJ2NvbnRlbnQnKSkge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gb3B0LmNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIdG1sRWwoZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBEb207XG5cbn0oKSk7XG4iLCJNaW54LlRhc2tMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGZ1bmN0aW9uIFRhc2tMaXN0KCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uIChjb3VwbGVyKSB7XG4gICAgICAgIHRoaXMuY291cGxlciA9IGNvdXBsZXI7XG4gICAgICAgIHRoaXMudGFza3NMaXN0ID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58VGFza3NMaXN0JylbMF07XG4gICAgICAgIHRoaXMubmV3VGFzayA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2snKVswXTtcbiAgICAgICAgdGhpcy5uZXdUYXNrQnRuID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58TmV3VGFza0J0bicpWzBdO1xuICAgICAgICB0aGlzLnRhc2sgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxUYXNrQ29udGFpbmVyJyk7XG5cbiAgICAgICAgLy8gRm9jdXMgb24gdGhlIGlucHV0XG4gICAgICAgIHRoaXMubmV3VGFzay5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVGb3JFdmVudHMoKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5ld1Rhc2suYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCAkYWRkVGFzayk7XG4gICAgICAgIHRoaXMubmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICRhZGRUYXNrKTtcbiAgICAgICAgdGhpcy50YXNrc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAkY2hhbmdlVGFza1N0YXRlKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnN1YnNjcmliZUZvckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLnN1YnNjcmliZSgndGFzay1odG1sLWNyZWF0ZWQnLCB0aGlzLnZpc3VhbGx5QWRkVGFzay5iaW5kKG9iaikpO1xuICAgIH07XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUudmlzdWFsbHlBZGRUYXNrID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLmRvbS5hcHBlbmQodGhpcy50YXNrc0xpc3QsIHRhc2spO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkYWRkVGFzayhlKSB7XG4gICAgICAgIHZhciBpc0lucHV0ID0gZS50YXJnZXQubm9kZU5hbWUgPT09ICdJTlBVVCcsXG4gICAgICAgICAgICB0YXJnZXQgPSBpc0lucHV0ID8gZS50YXJnZXQgOiBvYmoubmV3VGFzayxcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0YXJnZXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgIGlmICggKChlLmtleUNvZGUgPT09IDEzICYmIGlzSW5wdXQpIHx8ICFpc0lucHV0KSAmJiBjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgICAgb2JqLmNvdXBsZXIuZW1pdCgnbmV3LXRhc2stc3VibWl0dGVkJywgY29udGVudCk7XG4gICAgICAgICAgICB0YXJnZXQudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICRjaGFuZ2VUYXNrU3RhdGUoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQsXG4gICAgICAgICAgICBpc1Rhc2sgPSB0YXJnZXQubm9kZU5hbWUgPT09ICdMSSc7XG5cbiAgICAgICAgaWYgKGlzVGFzaykge1xuICAgICAgICAgICAgb2JqLmNvdXBsZXIuZW1pdCgndGFzay1zdGF0ZS1jaGFuZ2VkJywgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBUYXNrTGlzdDtcblxufSkoKTtcbiIsIk1pbnguQ29yZSA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBDb3JlKCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb3VwbGVyID0gTWlueC5Db3VwbGVyO1xuICAgIH1cblxuICAgIENvcmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RvcmFnZSgpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguRG9tKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LkRvbUZhY3RvcnkoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVXRpbCgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrTGlzdCgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuZXcgTWlueC5UYXNrKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tSZXBvKCkpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRBbGxNb2R1bGVzKCk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLmluaXRpYWxpemVTdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvdXBsZXIuc3RvcmFnZSA9IG5ldyBNaW54LlN0b3JhZ2Uoe1xuICAgICAgICAgICAgZW5naW5lOiAnTG9jYWxTdG9yYWdlJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUucmVnaXN0ZXJNb2R1bGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gZ2V0TW9kdWxlTmFtZShtb2R1bGUpO1xuICAgICAgICB0aGlzW21vZHVsZU5hbWVdID0gbW9kdWxlO1xuICAgICAgICB0aGlzLmNvdXBsZXJbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLnN0YXJ0QWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgbW9kdWxlLl9zdGFydChvYmouY291cGxlcik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKG1vZHVsZSkge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZSA9IG1vZHVsZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICByZXR1cm4gbW9kdWxlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIG1vZHVsZU5hbWUuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHJldHVybiBDb3JlO1xuXG59KCkpO1xuXG52YXIgY29yZSA9IG5ldyBNaW54LkNvcmUoKTtcbmNvcmUucnVuKCk7XG4iXX0=
