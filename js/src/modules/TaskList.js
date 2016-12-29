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
