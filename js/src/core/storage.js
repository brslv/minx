Minx.Storage = (function () {

    function Storage(opts) {
        opts = opts || {};
        this.storage = loadStorage(opts.storage || 'LocalStorage');
    }

    function loadStorage(adapter) {
        if (typeof Minx[adapter] !== 'function') {
            throw new Error(adapter + ' is not a valid storage adapter.');
        }

        return new Minx[adapter];
    }

    return Storage;

}());
