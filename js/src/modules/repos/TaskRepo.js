Minx.TaskRepo = (function() {

    function TaskRepo() { }

    TaskRepo.prototype._start = function (coupler) {
        this.key = 'tasks';
        this.coupler = coupler;
        this.rand = Minx.Rand,
        this.model = this.coupler.task.model;
        this.coupler.subscribe('new-task-submitted', this.save.bind(this));

        if ( null === (this.tasks = this.coupler.storage.get(this.key)) ) {
            // create a tasks object.
            this.coupler.storage.set(this.key, JSON.stringify([]));
            this.tasks = this.coupler.storage.get(this.key);
        }
    };

    TaskRepo.prototype.all = function () {
        return JSON.parse(this.coupler.storage.get(this.key));
    };

    TaskRepo.prototype.save = function (content, state) {
        var saved,
            tasks = this.all(),
            task = this.model({
                id: this.rand.id(),
                content: content,
                state: state
            });

        tasks.push(task);

        saved = this.coupler.storage.set(this.key, JSON.stringify(tasks));

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

        updated = this.coupler.storage.set(this.key, JSON.stringify(tasks));
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

        deleted = this.coupler.storage.set(this.key, JSON.stringify(tasks));
        this.coupler.emit('task-deleted', task);

        return deleted;
    };

    return TaskRepo;

}());
