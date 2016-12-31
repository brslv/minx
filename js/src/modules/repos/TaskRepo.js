Minx.TaskRepo = (function() {

    function TaskRepo() {
    }

    TaskRepo.prototype._start = function (coupler) {
        this.coupler = coupler;
        this.model = this.coupler.task.model;
        this.coupler.subscribe('new-task-submitted', this.save.bind(this));

        if ( null === (this.tasks = this.coupler.storage.get('tasks')) ) {
            // create a tasks object.
            this.coupler.storage.set('tasks', JSON.stringify([]));
            this.tasks = this.coupler.storage.get('tasks');
        }

        // @TODO: extract the parse json to a service object
        this.tasks = JSON.parse(this.tasks);
    };

    TaskRepo.prototype.all = function () {
        // @TODO: implement
    };

    TaskRepo.prototype.save = function (content, status) {
        var saved,
            task = this.model({
                content: content,
                status: status
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

    return TaskRepo;

}());
