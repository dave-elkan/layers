ErrorView = function() {};

ErrorView.prototype.render = function(req, res, error) {
    console.log(req);
    res.send(result);
};

module.exports = ErrorView;