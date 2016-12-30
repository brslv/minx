Minx.TaskRepo = (function() {

    function TaskRepo() {
    }

    TaskRepo.prototype._start = function (coupler) {
        this.coupler = coupler;

        if ( null === (this.tasks = this.coupler.storage.get('tasks')) ) {
            // create a tasks object.
            this.coupler.storage.set('tasks', JSON.stringify([]));
            this.tasks = this.coupler.storage.get('tasks');
        }

        this.tasks = JSON.parse(this.tasks);
    };

    TaskRepo.prototype.all = function () {

    };

    TaskRepo.prototype.save = function (content, status) {
        // @TODO: Make the object to be represented by a model.
        this.tasks.push({
            content: content,
            status: status
        });

        // @TODO:
        // This should emit an event (entity-added), passing the 
        // this.tasks object. The Task repo should listen for this event
        // and perform the operation bellow (save the new tasks object).
        this.coupler.storage.set('tasks', JSON.stringify(this.tasks));
    };

    return TaskRepo;

}());
