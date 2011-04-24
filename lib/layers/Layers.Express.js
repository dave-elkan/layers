var Layers = require('./Layers'),
    util = require('util');

ExpressLayers = function(server, rootPath, routes, options) {
    ExpressLayers.super_.call(this, server, rootPath, routes, options);
};

util.inherits(ExpressLayers, Layers);

ExpressLayers.prototype.setupRoute = function(path, fielder) {
    var self = this;
    if (typeof self.server[fielder.method] == "function") {
        self.server[fielder.method].call(self.server, path, [], function(req, res, next) {
            for (var view in fielder.views) {
                if (req.accepts(view)) {
                    fielder.action.call(self.server, req, res, function(error, result) {
                        if (error) {
                            self.server.views.errorView.render(error, req, res);
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
};

module.exports = ExpressLayers;