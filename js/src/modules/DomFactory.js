Minx.DomFactory = (function () {
        
    function DomFactory() { }

    DomFactory.prototype._start = function (coupler) {
        this.coupler = coupler;
    };

    DomFactory.prototype.task = function (opts) {
        var content = opts.content || "&mdash;",
            state = opts.state || 0,
            id = opts.id || 0,
            html = this.coupler.dom.create('div', {
                attrs: {
                    class: 'TaskContainer',
                },
                content: '<li class="Task' + ((state === 1) ? ' __Done' : '') + '" data-content="' + content + '" data-id="' + id + '">' + content + '</li>'
            });

        this.coupler.emit('task-html-created', html);

        return html;
    };

    return DomFactory;

}());
