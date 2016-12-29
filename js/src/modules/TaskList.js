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
