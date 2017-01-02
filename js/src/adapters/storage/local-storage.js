Minx.LocalStorage = (function () {

    function LocalStorage() {
        this.length = localStorage.length;
    }

    LocalStorage.prototype.set = function (key, value) {
        return localStorage.setItem(key, value);
    };

    LocalStorage.prototype.get = function(key) {
        return localStorage.getItem(key);
    };

    LocalStorage.prototype.remove = function(key) {
        return localStorage.removeItem(key);
    };

    LocalStorage.prototype.clear = function() {
        return localStorage.clear();
    }

    return LocalStorage;

}());
