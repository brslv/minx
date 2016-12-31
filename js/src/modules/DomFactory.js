Minx.DomFactory = (function () {
        
    function DomFactory() {

    }

    DomFactory.prototype._start = function (coupler) {
        this.coupler = coupler;
    };

    DomFactory.prototype.task = function (content) {
        var html = this.coupler.dom.create('div', {
            attrs: {
                class: 'TaskContainer',
            },
            content: '<li class="Task" data-content="' + content + '">' + content + '</li>'
        });

        this.coupler.emit('task-html-created', html);

        return html;
    };

    return DomFactory;

}());
