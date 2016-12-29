Minx.Task = (function () {

    var obj;

    /**
     * Things to do here:
     *      - Mark a task as done
     */

    function Task() {
        this.coupler = Minx.Coupler;
        this.util = this.coupler.util;
        this.obj = this;
        this.el = null;
    }

    Task.prototype._start = function () {
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
        this.coupler.emit('task-html-created', task);
    };

    Task.prototype.changeState = function (task) {
        this.el = task;

        if (this.isDone()) {
            console.log(this.el);
            this.coupler.dom.removeClass(this.el, '__Done');
        } else {
            console.log(this.el);
            this.coupler.dom.addClass(this.el, '__Done');
        }
    };

    Task.prototype.isDone = function () {
        if (null === this.el || undefined === this.el) {
            throw new Error('Invalid DOM element reference.');
        }

        return !!this.coupler.dom.hasClass(this.el, '__Done')
    };

    return Task;

}());
