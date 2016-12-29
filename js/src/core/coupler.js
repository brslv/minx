Minx.Coupler = {
    evtHandlers: [],

    subscribe: function (evt, handler) {
        if (undefined !== this.evtHandlers[evt] && null !== this.evtHandlers[evt]) {
            this.evtHandlers[evt].push(handler);
        } else {
            this.evtHandlers[evt] = [handler];
        }
    },

    emit: function (evt, data) {
        this.evtHandlers[evt].forEach(function (handler) {
            handler(data);
        });
    }
};
