ItemView = function() {};

ItemView.prototype.render = function(req, res, result) {
    res.render("item.jade", {
        locals: {
            title: "Item",
            result: result
        }
    });
};

module.exports = ItemView;