Minx.Task = (function () {

    /**
     * Things to do here:
     *      - Mark a task as done
     */

    function Task() {
        this.coupler = Minx.Coupler;
        this.util = this.coupler.util;
    }

    Task.prototype._start = function () {
        this.subscribeForEvents([
            'new-task-submitted'
        ]);
    };

    Task.prototype.subscribeForEvents = function (evts) {
        var self = this;
        evts.forEach(function (evt) {
            Minx.Coupler.subscribe(evt, self.html.bind(self));
        });
    };

    Task.prototype.html = function (content) {
        content = this.util.e(content);

        var task = this.coupler.dom.create('div', {
            attrs: {
                class: 'TaskContainer',
            },
            content: '<div class="Task" data-content="' + content + '">' + content + '</div>'
        });

        this.coupler.emit('task-html-created', task);
    };

    return Task;

}());
