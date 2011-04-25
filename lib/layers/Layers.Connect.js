var Layers = require('./Layers'),
    util = require('util'),
    connect = require('connect'),
    mime = require('mime');

ConnectLayers = function(server, rootPath, routes, options) {
    ConnectLayers.super_.call(this, server, rootPath, routes, options);
};

util.inherits(ConnectLayers, Layers);

ConnectLayers.prototype.setupRoute = function(path, fielder) {
    var self = this;
    self.server.use(connect.router(function(app) {
        app[fielder.method].call(app, path, function(req, res, next) {
            for (var view in fielder.views) {
                if (requestAccepts(req, view)) {
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
    }));
};

/**
 * Express request.accepts method.
 */
function requestAccepts(req, type){
  var accept = req.headers.accept;

  // normalize extensions ".json" -> "json"
  if (type && '.' == type[0]) type = type.substr(1);

  // when Accept does not exist, or is '*/*' return true 
  if (!accept || '*/*' == accept) {
    return true;
  } else if (type) {
    // allow "html" vs "text/html" etc
    if (type.indexOf('/') < 0) {
      type = mime.lookup(type);
    }

    // check if we have a direct match
    if (~accept.indexOf(type)) return true;

    // check if we have type/*
    type = type.split('/')[0] + '/*';
    return accept.indexOf(type) >= 0;
  } else {
    return false;
  }
}

module.exports = ConnectLayers;