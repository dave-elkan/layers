TestController = function() {};

TestController.prototype = {
    
    getIndex: function(req, res, callback) {
        callback(null, [{
            _id: "test",
            name: "Test"
        }, {
                _id: "test",
                name: "Test"
        }]);
    },

    getItemByKey: function(req, res, callback) {
        callback()
    }
};

module.exports = TestController;
