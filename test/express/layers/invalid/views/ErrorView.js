ErrorView = function() {};

ErrorView.prototype.render = function(req, res, error) {
    res.send(result);
};

module.exports = new ErrorView;