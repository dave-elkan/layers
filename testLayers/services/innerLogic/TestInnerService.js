module.exports = function(app) {
    return {
        testServicePresent: true,
        testServiceFunction: function() {
            return "A Inner Test value";
        }
    }
};
