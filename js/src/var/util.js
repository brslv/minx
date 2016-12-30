Minx.Util = (function () {

    function Util() { }

    Util.prototype._start = function () { };

    // Escape
    Util.prototype.e = function (text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };

    return Util;

}());
