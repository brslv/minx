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
            target = isInput
                ? e.target 
                : obj.coupler.dom.get('.|NewTask')[0];

        if ((e.keyCode === 13 && isInput) || !isInput) {
            if (target.value.trim() === '') {
                return false;
            }

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbS5qcyIsIlRhc2tMaXN0LmpzIiwiY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1pbnggPSBNaW54IHx8IHt9O1xuIiwiTWlueC5Eb20gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqXG4gICAgICogSSBzaG91bGQgaGF2ZSBhbiBvcHRpb24gdG86XG4gICAgICpcbiAgICAgKiBHZXQgYW4gZWxlbWVudCBieSBpZC9jbGFzc1xuICAgICAqICAgICAgLSBnZXRCeUlkKCdpZCcpO1xuICAgICAqICAgICAgLSBnZXRCeUNsYXNzKCdjbGFzcycpXG4gICAgICogICAgICAgICAgLSBmaXJzdCgpXG4gICAgICogICAgICAgICAgLSBsYXN0KClcbiAgICAgKiAgICAgICAgICAtIGluZGV4KClcbiAgICAgKiAgICAgIC0gZ2V0QnlEYXRhKCdkYXRhLW5hbWUnKVxuICAgICAqICAgICAgLSBnZXRCeU5hbWUoJycpXG4gICAgICogQ3JlYXRlIGFuIGVsZW1lbnRcbiAgICAgKiBBcHBwZW5kL1ByZXByZW5kXG4gICAgICogUmVtb3ZlIGFuIGVsZW1lbnRcbiAgICAgKiBBdHRhY2ggZXZlbnRzIG9uIGVsZW1lbnRzICg/KVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gRG9tKCkge1xuICAgICAgICB0aGlzLnR5cGVzID0gWycjJywgJy4nXTtcbiAgICB9XG5cbiAgICBEb20ucHJvdG90eXBlLl9zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gc3RhcnQgdGhlIERvbVxuICAgIH07XG5cbiAgICBEb20ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICB2YXIgdHlwZSA9IHNlbGVjdG9yLnN1YnN0cigwLCBzZWxlY3Rvci5pbmRleE9mKCd8JykpLFxuICAgICAgICByZWFsID0gc2VsZWN0b3Iuc3Vic3RyKHR5cGUubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZXMuaW5kZXhPZih0eXBlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ5SWQocmVhbCk7XG4gICAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ5Q2xhc3MocmVhbCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5ieUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfTtcblxuICAgIERvbS5wcm90b3R5cGUuYnlDbGFzcyA9IGZ1bmN0aW9uIChjbHMpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xzKTtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZWwsIG9wdCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBvcHQpIHtcbiAgICAgICAgICAgIG9wdCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNyZWF0ZWQgPSBnZXRIdG1sRWwoZWwgfHwgJ2RpdicpLFxuICAgICAgICBhdHRyTmFtZSxcbiAgICAgICAgYXR0clZhbHVlO1xuXG4gICAgICAgIHBvcHVsYXRlQXR0cmlidXRlc0FuZENvbnRlbnQoY3JlYXRlZCwgb3B0KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlZDtcbiAgICB9O1xuXG4gICAgRG9tLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBpZiAodW5kZWZpbmVkID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJlbnQuIENhbm5vdCBhcHBlbmQgdG8gdW5kZWZpbmVkIHBhcmVudC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZUF0dHJpYnV0ZXNBbmRDb250ZW50KGVsLCBvcHQpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gb3B0LmF0dHJzIHx8IHtjbGFzczogJ1Rhc2snfTtcblxuICAgICAgICBmb3IoYXR0cklkeCBpbiBhdHRycykge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySWR4LCBhdHRyVmFsdWUgPSBhdHRyc1thdHRySWR4XTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHQuaGFzT3duUHJvcGVydHkoJ2NvbnRlbnQnKSkge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gb3B0LmNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRIdG1sRWwoZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIH1cblxuICAgIHJldHVybiBEb207XG5cbn0oKSk7XG4iLCJNaW54LlRhc2tMaXN0ID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGZ1bmN0aW9uIFRhc2tMaXN0KCkge1xuICAgICAgICBvYmogPSB0aGlzO1xuICAgICAgICB0aGlzLmNvdXBsZXIgPSBNaW54LkNvdXBsZXI7XG4gICAgICAgIHRoaXMudGFza3NMaXN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUuX3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRhc2tzTGlzdCA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufFRhc2tzTGlzdCcpWzBdO1xuICAgICAgICB0aGlzLm5ld1Rhc2sgPSB0aGlzLmNvdXBsZXIuZG9tLmdldCgnLnxOZXdUYXNrJylbMF07XG4gICAgICAgIHRoaXMubmV3VGFza0J0biA9IHRoaXMuY291cGxlci5kb20uZ2V0KCcufE5ld1Rhc2tCdG4nKVswXTtcblxuICAgICAgICAvLyBGb2N1cyBvbiB0aGUgaW5wdXRcbiAgICAgICAgdGhpcy5uZXdUYXNrLmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICAgICAgICB0aGlzLnN1YnNjcmliZUZvckV2ZW50cygpO1xuICAgIH07XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUucmVnaXN0ZXJFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubmV3VGFzay5vbmtleXByZXNzID0gJGFkZFRhc2s7XG4gICAgICAgIHRoaXMubmV3VGFza0J0bi5vbmNsaWNrID0gJGFkZFRhc2s7XG4gICAgfTtcblxuICAgIFRhc2tMaXN0LnByb3RvdHlwZS5zdWJzY3JpYmVGb3JFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY291cGxlci5zdWJzY3JpYmUoJ3Rhc2staHRtbC1jcmVhdGVkJywgdGhpcy52aXN1YWxseUFkZC5iaW5kKG9iaikpO1xuICAgIH07XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUuZW1pdFRhc2tTdWJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5jb3VwbGVyLmVtaXQoJ25ldy10YXNrLXN1Ym1pdHRlZCcsIGNvbnRlbnQpO1xuICAgIH07XG5cbiAgICBUYXNrTGlzdC5wcm90b3R5cGUudmlzdWFsbHlBZGQgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB0aGlzLmNvdXBsZXIuZG9tLmFwcGVuZCh0aGlzLnRhc2tzTGlzdCwgdGFzayk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICRhZGRUYXNrKGUpIHtcbiAgICAgICAgdmFyIGlzSW5wdXQgPSBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyxcbiAgICAgICAgICAgIHRhcmdldCA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICA/IGUudGFyZ2V0IFxuICAgICAgICAgICAgICAgIDogb2JqLmNvdXBsZXIuZG9tLmdldCgnLnxOZXdUYXNrJylbMF07XG5cbiAgICAgICAgaWYgKChlLmtleUNvZGUgPT09IDEzICYmIGlzSW5wdXQpIHx8ICFpc0lucHV0KSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9iai5lbWl0VGFza1N1Ym1pc3Npb24odGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIHRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFRhc2tMaXN0O1xuXG59KSgpO1xuIiwiTWlueC5Db3JlID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gQ29yZSgpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gW107XG4gICAgICAgIHRoaXMuY291cGxlciA9IE1pbnguQ291cGxlcjtcbiAgICB9XG5cbiAgICBDb3JlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmV3IE1pbnguRG9tKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2tMaXN0KCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5ldyBNaW54LlRhc2soKSk7XG5cbiAgICAgICAgdGhpcy5zdGFydEFsbE1vZHVsZXMoKTtcbiAgICB9O1xuXG4gICAgQ29yZS5wcm90b3R5cGUucmVnaXN0ZXJNb2R1bGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIHZhciBtb2R1bGVOYW1lID0gZ2V0TW9kdWxlTmFtZShtb2R1bGUpO1xuICAgICAgICB0aGlzW21vZHVsZU5hbWVdID0gbW9kdWxlO1xuICAgICAgICB0aGlzLmNvdXBsZXJbbW9kdWxlTmFtZV0gPSBtb2R1bGU7XG4gICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgfTtcblxuICAgIENvcmUucHJvdG90eXBlLnN0YXJ0QWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgbW9kdWxlLl9zdGFydCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZShtb2R1bGUpIHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBtb2R1bGUuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgcmV0dXJuIG1vZHVsZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBtb2R1bGVOYW1lLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQ29yZTtcblxufSgpKTtcblxudmFyIGNvcmUgPSBuZXcgTWlueC5Db3JlKCk7XG5jb3JlLnJ1bigpO1xuIl19
