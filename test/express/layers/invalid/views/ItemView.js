module.exports = {
    render: function(req, res, result) {
        res.render("item.jade", {
            locals: {
                title: "Item",
                result: result
            }
        });
    }
}