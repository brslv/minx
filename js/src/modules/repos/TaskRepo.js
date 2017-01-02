Minx.TaskRepo = (function() {

    function TaskRepo() { }

    TaskRepo.prototype._start = function (coupler) {
        this.coupler = coupler;
        this.rand = Minx.Rand,
        this.model = this.coupler.task.model;
        this.coupler.subscribe('new-task-submitted', this.save.bind(this));

        if ( null === (this.tasks = this.coupler.storage.get('tasks')) ) {
            // create a tasks object.
            this.coupler.storage.set('tasks', JSON.stringify([]));
            this.tasks = this.coupler.storage.get('tasks');
        }

        this.tasks = JSON.parse(this.tasks);
    };

    TaskRepo.prototype.all = function () {
        return JSON.parse(this.coupler.storage.get('tasks'));
    };

    TaskRepo.prototype.save = function (content, state) {
        var saved,
            task = this.model({
                id: this.rand.id(),
                content: content,
                state: state
            });

        this.tasks.push(task);

        saved = this.coupler.storage.set('tasks', JSON.stringify(this.tasks));

        // Inform the application a new task is added to the storage.
        this.coupler.emit('new-task-saved', {
            task: task,
            tasks: this.tasks
        }); 

        return saved;
    };

    TaskRepo.prototype.update = function (data) {
        var id = data.id,
            state = data.state,
            tasks = this.all(),
            updated,
            task;

        tasks.forEach(function (t) {
            if (t.id === id) {
                task = t
                t.state = t.state === 0 ? 1 : 0;
            }
        });

        updated = this.coupler.storage.set('tasks', JSON.stringify(tasks));
        this.coupler.emit('task-updated', task);

        return updated;
    };

    TaskRepo.prototype.delete = function (data) {
        var tasks = this.all(),
            task,
            deleted;

        tasks = tasks.filter(function (t) {
            if (t.id !== data.id) {
                task = t;
                return t;
            }
        });

        // @TODO: Abstract the 'tasks' key.
        deleted = this.coupler.storage.set('tasks', JSON.stringify(tasks));
        this.coupler.emit('task-deleted', task);

        return deleted;
    };

    return TaskRepo;

}());
