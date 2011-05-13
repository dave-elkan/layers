IndexView = function() {};

IndexView.prototype.render = function(req, res, result) {
    res.render("index.jade", {
        locals: {
            title: "Index",
            result: result
        }
    });
};

module.exports = IndexView;