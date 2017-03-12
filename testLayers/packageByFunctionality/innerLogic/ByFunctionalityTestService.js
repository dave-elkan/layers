module.exports = function(app) {
    return {
        testServicePresent: true,
        testServiceFunction: function() {
            return "A by functionality Test value";
        }
    }
};
