var fs = require('fs'),
    defaults = {
        layers: [
            "controllers",
            "views"
        ],
        excludePrefix: "Base"
    },
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
var Layers = function(server, rootPath, wiring, options) {
	loadLayers(server, rootPath, options);
    this.setupWiring(server, wiring(server));
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
 *          middleware: [someMiddleware, someOtherMiddleware],
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
Layers.prototype.setupWiring = function(server, wiring) {
    var self = this;
    for (var path in wiring) {
        var handlers = wiring[path];
        handlers.forEach(function(handler) {
            self.setupRoute(server, path, merge(defaulthandler, handler));
        });
    }
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
 * Loads the 'layers' of an application by loading their constituant
 * files, instanciating them and adding them to the server object.
 *
 * @param server The server object (i.e. Express app).
 * @param rootPath The path to the layers directory for this app.
 * @param options An optional options object.
 */
function loadLayers(server, rootPath, options) {
    options = merge(defaults, options);
    options.layers.forEach(function(layer) {
        if (!server[layer]) {
            server[layer] = {};
        }
        
        loadFiles(server, __dirname + '/layers/' + layer, layer, options);
        loadFiles(server, rootPath + "/" + layer, layer, options);
    });
}

/**
 * Recursively loads and instantiates javascript files within a path
 * adding references to them under the current layer namespace on the
 * supplied app/server object.
 */
function loadFiles(server, path, layer, options) {
    var files = getDirectoryFileListSync(path);
    
	files.forEach(function(fileName) {
       var fullPathToFile = path + "/" + fileName;
       if (isDirectory(fullPathToFile)) {
           loadFiles(server, fullPathToFile, layer, options);
        } else if(fileName.indexOf(options.excludePrefix) != 0 && fileName.indexOf(".js") == fileName.length - 3) {
            var name = getRequireName(fileName),
                item = require(path + "/" + name);
                
            if (typeof item == "function") {
               item = item(server); 
            }
            
            server[layer][getInstanceName(name)] = item;
        }
    });
}

/**
 * Synchronously returns a file list from a directory.
 */
function getDirectoryFileListSync(directory) {
	var files = [];
	if (dirExistsSync(directory) && isDirectory(directory)) {
		files = fs.readdirSync(directory);
	}

	return files;
}

/**
 * Synchronously checks to see whether a directory exists or not.
 */
function dirExistsSync (directory) { 
    try {
        fs.statSync(directory);
        return true;
    } catch (err) {
        return false;
    } 
}

/**
 * Synchronously checks whether the file at the path specified is a 
 * directory or not.
 */
function isDirectory(file) {
    try {
        var stats = fs.statSync(file);
        return stats.isDirectory();
    } catch (err) {
        return false;
    }
}
   
/**
 * Returns the name of the file sans .js suffix.
 */
function getRequireName(file) {
    return file.substr(0, file.lastIndexOf(".js"));
}

/**
 * Returns the name of an instance.
 *
 * i.e. The name of the file with the first letter lower case.
 */
function getInstanceName(name) {
    return name[0].toLowerCase() + name.substr(1);
}

/**
 * Merges two objects and returns the merged result.
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