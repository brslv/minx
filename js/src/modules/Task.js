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

        this.coupler.batchSubscribe({
            'new-task-saved': this.html.bind(this),
            'task-state-changed': this.changeState.bind(this),
        });
    };

    Task.prototype.model = function (data) {
        if (!data.content) {
            throw new Error('A task must have a content.');
        }

        return {
            content: data.content,
            status: data.status || 0
        };
    };

    Task.prototype.html = function (data) {
        content = this.util.e(data.task.content);

        var task = this.coupler.dom.create('div', {
            attrs: {
                class: 'TaskContainer',
            },
            content: '<li class="Task" data-content="' + content + '">' + content + '</li>'
        });

        this.el = task;

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
