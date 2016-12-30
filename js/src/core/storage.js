Minx.Storage = (function () {

    function Storage(opts) {
        opts = opts || {};
        this.engine = loadStorage(opts.engine || 'LocalStorage');
    }

    Storage.prototype.get = function (key) {
        return this.engine.get(key);
    };

    Storage.prototype.set = function (key, value) {
        return this.engine.set(key, value);
    };

    Storage.prototype.remove = function(key) {
        return this.engine.removeItem(key);
    };

    function loadStorage(adapter) {
        if (typeof Minx[adapter] !== 'function') {
            throw new Error(adapter + ' is not a valid storage adapter.');
        }

        return new Minx[adapter];
    }

    return Storage;

}());
