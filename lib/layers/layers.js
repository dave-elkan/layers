var loader = require("./loader/loader"),
    defaults = {
        basePath: "lib",
        layers: {
            services: "services",
            controllers: "controllers",
            views: "views"
        }
    },
    defaultFielder = {
        method: "get"
    };

var Layers = function(server, rootPath, routes, options) {
    this.server = server;
    this.loadLayers(rootPath, options);
    this.setupRoutes(routes(server))
};

Layers.prototype.loadLayers = function(rootPath, options) {
    this.options = merge(defaults, options);
    for (var layer in this.options.layers) {
        loader(this.server, rootPath, layer);
    }
};

Layers.prototype.setupRoutes = function(routes) {
    var self = this;
    for (var path in routes) {
        var fielders = routes[path];
        fielders.forEach(function(fielder) {
            self.setupRoute(path, merge(defaultFielder, fielder));
        });
    }
};

Layers.prototype.setupRoute = function(path, fielder) {
    throw new Error("Must implement Layers::setupRoute");
};

function merge(base, inst) {
    var merged = {};
    for (var p in base) {
        merged[p] = base[p];
    }
    for (var p in inst || {}) {
        merged[p] = inst[p];
    }
    
    return merged;
}

module.exports = Layers;