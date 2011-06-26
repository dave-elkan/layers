var Layers = require('./Layers'),
    util = require('util');

ExpressLayers = function(server, rootPath, routes, options) {
    ExpressLayers.super_.call(this, server, rootPath, routes, options);
};

util.inherits(ExpressLayers, Layers);

/**
 * Sets up a route for a layered express app.
 * 
 * Accepts a server along with a path and handler to map.
 *
 * @param server  The Express app object.
 * @param path    The path on which to listen.
 * @param handler The handler object containing the HTTP method, action to perform,
 * 				  an optional array of middleware a map of views keyed by the 
 * 				  content-type they will respond with.
 */
ExpressLayers.prototype.setupRoute = function(server, path, handler) {
    var self = this,
        method = handler.method.toLowerCase();
    if (typeof server[method] === "function") {
        server[method].call(server, path, handler.middleware, function(req, res, next) {
            for (var view in handler.views) {
                if (req.accepts(view)) {
                    handler.action.call(server, req, res, function(error, result) {
                        if (error) {
                            server.views.errorView.render(req, res, error, next);
                        } else {
                            handler.views[view].render(req, res, result, next);
                        }
                    }, next);
                    return;
                }
            }
            next();
        });
    }
};

module.exports = ExpressLayers;
