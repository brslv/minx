Minx.TaskList = (function() {

    var obj;

    function TaskList() {
        obj = this;
        this.tasksList = null;
    }

    TaskList.prototype._start = function (coupler) {
        this.coupler = coupler;
        this.taskModel = this.coupler.task.model;
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

        // attach event on each delete button (throught the document object)
        // and listen for click -> delete task.
        this.coupler.dom.doc.addEventListener('click', $deleteTask);
        this.tasksList.addEventListener('click', $changeTaskState);
    };

    TaskList.prototype.visuallyAddTask = function (task) {
        return this.coupler.dom.prepend(this.tasksList, task);
    };

    TaskList.prototype.visuallyDeleteTask = function (task) {
        return this.coupler.dom.remove(task);
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

    function $deleteTask(e) {
        var target = e.target,
            isDeleteButton = obj.coupler.dom.hasClass(target, 'DeleteButton'),
            parent,
            task,
            taskId,
            data;

        if (isDeleteButton) {
            task = obj.coupler.dom.parentWithClass(target, 'Task');
            taskId = task.dataset.id;

            obj.visuallyDeleteTask(obj.coupler.dom.parentWithClass(task, 'TaskContainer'));
            obj.coupler.emit('task-delete', obj.taskModel({id: taskId}));
        }
    }

    return TaskList;

})();
