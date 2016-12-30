Minx.Task = (function () {

    var obj;

    function Task() {
        this.obj = this;
        this.el = null;
    }

    Task.prototype._start = function (coupler) {
        this.coupler = coupler;
        this.util = this.coupler.util;
        this.repo = this.coupler.taskRepo;

        this.subscribeForEvents({
            'new-task-submitted': this.html.bind(this),
            'task-state-changed': this.changeState.bind(this),
        });
    };

    Task.prototype.subscribeForEvents = function (evts) {
        for (evt in evts) {
            Minx.Coupler.subscribe(evt, evts[evt]);
        }
    };

    Task.prototype.html = function (content) {
        content = this.util.e(content);

        var task = this.coupler.dom.create('div', {
            attrs: {
                class: 'TaskContainer',
            },
            content: '<li class="Task" data-content="' + content + '">' + content + '</li>'
        });

        this.el = task;

        // Save the task to the storage through the repo
        this.repo.save(content, 0);
        this.coupler.emit('task-html-created', task);
    };

    Task.prototype.changeState = function (task) {
        this.el = task;

        if (this.isDone()) {
            this.coupler.dom.removeClass(this.el, '__Done');
        } else {
            this.coupler.dom.addClass(this.el, '__Done');
        }
    };

    Task.prototype.isDone = function () {
        if (null === this.el || undefined === this.el) {
            throw new Error('Invalid DOM element reference.');
        }

        return !! this.coupler.dom.hasClass(this.el, '__Done')
    };

    return Task;

}());
