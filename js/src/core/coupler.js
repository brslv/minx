Minx.Coupler = {
    evtHandlers: [],

    subscribe: function (evt, handler) {
        if (undefined !== this.evtHandlers[evt] && null !== this.evtHandlers[evt]) {
            this.evtHandlers[evt].push(handler);
        } else {
            this.evtHandlers[evt] = [handler];
        }
    },

    batchSubscribe: function (evts) {
        for (evt in evts) {
            this.subscribe(evt, evts[evt]);
        }
    },

    emit: function (evt, data) {
        if (undefined !== this.evtHandlers[evt]) {
            this.evtHandlers[evt].forEach(function (handler) {
                handler(data);
            });
        }
    }
};
