var fs = require('fs'),
    loader = require('./Layers.Loader'),
    defaulthandler = {
        method: "get",
    	  middleware: []
    };

/**
 * Layers. 
 *
 * A helper to create a layered application in node.js
 *
 * For more information see https://github.com/dave-elkan/node-layers
 *
 * @param server The server object (i.e. Express app).
 * @param rootPath The path to the layers directory for this app.
 * @param wiring The wiring object. See Layers#setupWiring for more information.
 * @param options An optional options object to override the defaults.
 */
Layers = function(server, rootPath, wiring, options) {
  	loader.loadLayers(server, rootPath, options);
    setupWiring.call(this, server, wiring(server));
};

/**
 * This function must be defined in a framework-specific 
 * implementation of Layers to setup a route for that 
 * framework.
 * 
 * See Layers.Express#setupRoute if you intend of implementing this function
 * for a framework other than Express.
 *
 * @param path The path of the route to setup.
 * @param handler The handler for this current route.
 */
Layers.prototype.setupRoute = function(path, handler) {
    throw new Error("Must implement Layers::setupRoute");
};

/**
 * Adds routes to an app and wires up the layers for each action.
 * 
 * @param server The Server to add the routes to.
 * @param wiring The Wiring object.
 *
 * The wiring object is a map of arrays of route objects.
 * i.e.
 * 
 * {
 *   "/": [{
 *   		method: "get",
 *   		action: actionFunctionToCallForGet,
 *   		views: {
 *				html: htmlViewForGetRequest,
 *				json: jsonViewForGetRequest
 *   		}
 *   	}, {
 *			method: "post",
 *			action: actionFunctionToCallForPost,
 *			views: {
 *				json: jsonViewForPostRequest
 *			}
 *  	}
 *   ],
 *
 *   "/path/of/route": [{
 *			action: actionFunctionToCallForGetRequest,
 *      middleware: [someMiddleware, someOtherMiddleware],
 *			views: {
 *				html: htmlViewForGetRequest,
 *				json: jsonViewForGetRequest
 *			}
 *   	}
 *   ]
 * }
 *
 * Each path can have multiple handlers. If for any reason the handler 
 * cannot respond to the request then the next is tried until all of the
 * handlers are extinguished at which point a 404 will be thrown.
 */
function setupWiring(server, wiring) {
    var self = this;
    for (var path in wiring) {
        var handlers = wiring[path];
        if (handlers instanceof Array) {
            handlers.forEach(function(handler) {
                self.setupRoute(server, path, merge(defaulthandler, handler));
            });
        }
    }
}

/**
 * Synchronously merges two objects and returns the merged result.
 */
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
