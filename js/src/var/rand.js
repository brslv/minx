Minx.Rand = {
    
    // Get random id for an article with 12 chars.
    id: function () {
        return Math.random().toString(36).substr(2, 12);
    }

};
