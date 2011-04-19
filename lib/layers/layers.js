var loader = require("./loader/loader"),
    baseFielder = {
        method: "get",
        headers: {
            "accept": "text/html"
        }
    };

var Layers = function(app, rootPath) {
    this.app = app;
    loader(app, rootPath, "services");
    loader(app, rootPath, "controllers");
    loader(app, rootPath, "views");
};

Layers.prototype.setupRoutes = function(routes) {
    var self = this;
    for (var path in routes) {
        var fielders = routes[path];
        fielders.forEach(function(fielder) {
            self.setupRoute(path, fielder);
        });
    }
};

Layers.prototype.setupRoute = function(path, fielder) {
    var self = this;
    fielder = merge(baseFielder, fielder);
    if (typeof self.app[fielder.method] == "function") {
        self.app[fielder.method].call(self.app, path, [], function(req, res, next) {
            for (var view in fielder.views) {
                if (req.accepts(view)) {
                    fielder.action.call(self.app, req, res, function(error, result) {
                        if (error) {
                            self.app.views.errorView.render(error, req, res);
                            return;
                        }
                        fielder.views[view].render(req, res, result);
                    }, next);
                    return;
                }
            }
            next();
        });
    }
}

function merge(base, inst) {
    var merged = {};
    for (var p in base) {
        merged[p] = base[p];
    }
    for (var p in inst) {
        merged[p] = inst[p];
    }
    
    return merged;
}

module.exports = Layers;