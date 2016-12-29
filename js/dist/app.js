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
        this.newTaskBtn = this.coupler.dom.get('.|NewTaskBtn')[0];

        // Focus on the input
        this.newTask.focus();

        this.registerEvents();
        this.subscribeForEvents();
    };

    TaskList.prototype.registerEvents = function () {
        this.newTask.onkeypress = $addTask;
        this.newTaskBtn.onclick = $addTask;
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
        var isInput = e.target.nodeName === 'INPUT',
            target = isInput ? e.target : obj.newTask,
            content = target.value.trim();

        if ( ((e.keyCode === 13 && isInput) || !isInput) && content !== '') {
            obj.emitTaskSubmission(content);
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
        this.registerModule(new Minx.Util());
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNaW54ID0gTWlueCB8fCB7fTtcbiIsIk1pbnguRG9tID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIC8qKlxuICAgICAqIEkgc2hvdWxkIGhhdmUgYW4gb3B0aW9uIHRvOlxuICAgICAqXG4gICAgICogR2V0IGFuIGVsZW1lbnQgYnkgaWQvY2xhc3NcbiAgICAgKiAgICAgIC0gZ2V0QnlJZCgnaWQnKTtcbiAgICAgKiAgICAgIC0gZ2V0QnlDbGFzcygnY2xhc3MnKVxuICAgICAqICAgICAgICAgIC0gZmlyc3QoKVxuICAgICAqICAgICAgICAgIC0gbGFzdCgpXG4gICAgICogICAgICAgICAgLSBpbmRleCgpXG4gICAgICogICAgICAtIGdldEJ5RGF0YSgnZGF0YS1uYW1lJylcbiAgICAgKiAgICAgIC0gZ2V0QnlOYW1lKCcnKVxuICAgICAqIENyZWF0ZSBhbiBlbGVtZW50XG4gICAgICogQXBwcGVuZC9QcmVwcmVuZFxuICAgICAqIFJlbW92ZSBhbiBlbGVtZW50XG4gICAgICogQXR0YWNoIGV2ZW50cyBvbiBlbGVtZW50cyAoPylcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIERvbSgpIHtcbiAgICAgICAgdGhpcy50eXBlcyA9IFsnIycsICcuJ107XG4gICAgfVxuXG4gICAgRG9tLnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHN0YXJ0IHRoZSBEb21cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzZWxlY3Rvci5zdWJzdHIoMCwgc2VsZWN0b3IuaW5kZXhPZignfCcpKSxcbiAgICAgICAgcmVhbCA9IHNlbGVjdG9yLnN1YnN0cih0eXBlLmxlbmd0aCArIDEpO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGVzLmluZGV4T2YodHlwZSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUlkKHJlYWwpO1xuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ieUNsYXNzKHJlYWwpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmJ5Q2xhc3MgPSBmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNscyk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0KSB7XG4gICAgICAgICAgICBvcHQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjcmVhdGVkID0gZ2V0SHRtbEVsKGVsIHx8ICdkaXYnKSxcbiAgICAgICAgYXR0ck5hbWUsXG4gICAgICAgIGF0dHJWYWx1ZTtcblxuICAgICAgICBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGNyZWF0ZWQsIG9wdCk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyZW50LiBDYW5ub3QgYXBwZW5kIHRvIHVuZGVmaW5lZCBwYXJlbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVBdHRyaWJ1dGVzQW5kQ29udGVudChlbCwgb3B0KSB7XG4gICAgICAgIHZhciBhdHRycyA9IG9wdC5hdHRycyB8fCB7Y2xhc3M6ICdUYXNrJ307XG5cbiAgICAgICAgZm9yKGF0dHJJZHggaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0cklkeCwgYXR0clZhbHVlID0gYXR0cnNbYXR0cklkeF07XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0Lmhhc093blByb3BlcnR5KCdjb250ZW50JykpIHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IG9wdC5jb250ZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SHRtbEVsKGVsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9tO1xuXG59KCkpO1xuIiwiTWlueC5UYXNrTGlzdCA9IChmdW5jdGlvbigpIHtcblxuICAgIHZhciBvYmo7XG5cbiAgICBmdW5jdGlvbiBUYXNrTGlzdCgpIHtcbiAgICAgICAgb2JqID0gdGhpcztcbiAgICAgICAgdGhpcy5jb3VwbGVyID0gTWlueC5Db3VwbGVyO1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50YXNrc0xpc3QgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxUYXNrc0xpc3QnKVswXTtcbiAgICAgICAgdGhpcy5uZXdUYXNrID0gdGhpcy5jb3VwbGVyLmRvbS5nZXQoJy58TmV3VGFzaycpWzBdO1xuICAgICAgICB0aGlzLm5ld1Rhc2tCdG4gPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxOZXdUYXNrQnRuJylbMF07XG5cbiAgICAgICAgLy8gRm9jdXMgb24gdGhlIGlucHV0XG4gICAgICAgIHRoaXMubmV3VGFzay5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVGb3JFdmVudHMoKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5ld1Rhc2sub25rZXlwcmVzcyA9ICRhZGRUYXNrO1xuICAgICAgICB0aGlzLm5ld1Rhc2tCdG4ub25jbGljayA9ICRhZGRUYXNrO1xuICAgIH07XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUuc3Vic2NyaWJlRm9yRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvdXBsZXIuc3Vic2NyaWJlKCd0YXNrLWh0bWwtY3JlYXRlZCcsIHRoaXMudmlzdWFsbHlBZGQuYmluZChvYmopKTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLmVtaXRUYXNrU3VibWlzc2lvbiA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gICAgICAgIHRoaXMuY291cGxlci5lbWl0KCduZXctdGFzay1zdWJtaXR0ZWQnLCBjb250ZW50KTtcbiAgICB9O1xuXG4gICAgVGFza0xpc3QucHJvdG90eXBlLnZpc3VhbGx5QWRkID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLmRvbS5hcHBlbmQodGhpcy50YXNrc0xpc3QsIHRhc2spO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkYWRkVGFzayhlKSB7XG4gICAgICAgIHZhciBpc0lucHV0ID0gZS50YXJnZXQubm9kZU5hbWUgPT09ICdJTlBVVCcsXG4gICAgICAgICAgICB0YXJnZXQgPSBpc0lucHV0ID8gZS50YXJnZXQgOiBvYmoubmV3VGFzayxcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0YXJnZXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgIGlmICggKChlLmtleUNvZGUgPT09IDEzICYmIGlzSW5wdXQpIHx8ICFpc0lucHV0KSAmJiBjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgICAgb2JqLmVtaXRUYXNrU3VibWlzc2lvbihjb250ZW50KTtcbiAgICAgICAgICAgIHRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFRhc2tMaXN0O1xuXG59KSgpO1xuIiwiTWlueC5Db3JlID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gQ29yZSgpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gW107XG4gICAgICAgIHRoaXMuY291cGxlciA9IE1pbnguQ291cGxlcjtcbiAgICB9XG5cbiAgICBDb3JlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguRG9tKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlV0aWwoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFza0xpc3QoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguVGFzaygpKTtcblxuICAgICAgICB0aGlzLnN0YXJ0QWxsTW9kdWxlcygpO1xuICAgIH07XG5cbiAgICBDb3JlLnByb3RvdHlwZS5yZWdpc3Rlck1vZHVsZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBnZXRNb2R1bGVOYW1lKG1vZHVsZSk7XG4gICAgICAgIHRoaXNbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMuY291cGxlclttb2R1bGVOYW1lXSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5tb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUuc3RhcnRBbGxNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgICAgICBtb2R1bGUuX3N0YXJ0KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKG1vZHVsZSkge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZSA9IG1vZHVsZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICByZXR1cm4gbW9kdWxlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIG1vZHVsZU5hbWUuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHJldHVybiBDb3JlO1xuXG59KCkpO1xuXG52YXIgY29yZSA9IG5ldyBNaW54LkNvcmUoKTtcbmNvcmUucnVuKCk7XG4iXX0=
