Minx.Storage = (function () {

    function Storage(opts) {
        opts = opts || {};

        this.storage = opts.storage || 'LocalStorage';

        // Load the storage adapter
        this.storageEngine = new Minx[this.storage];
        console.log(this.storageEngine);
    }

    return Storage;

}());
