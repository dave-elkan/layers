module.exports = [{
    getIndex: function(req, res, callback) {
        callback(null, [{
            _id: "test",
            name: "Test"
        }, {
                _id: "test",
                name: "Test"
        }]);
    }
}];
