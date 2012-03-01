var fs = require('fs'),
    _ = require('underscore'),
    defaults = {
        excludePrefix: "Base",
        rootPath: "./layers/"
    };

/**
 * Loads the 'layers' of an application by loading their constituant
 * files, instanciating them and adding them to the server object.
 *
 * @param server The server object (i.e. Express app).
 * @param options An optional options object.
 */
module.exports = function(server, options) {
    _.defaults(options, defaults);

    var layers = options.layers || getLayers(options.rootPath),
        excludePrefix = options.excludePrefix;

    layers.forEach(function(layer) {
        server[layer] = loadComponents(options.rootPath + "/" + layer, layer);
    });

    /**
     * Returns a list of layer names.
     * 
     * Finds the directories in the root path supplied
     * and returns their names as the layers this application
     * makes use of.
     */
    function getLayers(rootPath) {
        var layers = getDirectoryFileListSync(rootPath),
            directories = [],
            hasControllers = false;

        layers.forEach(function(layer) {
            if (layer === "controllers") {
                hasControllers = true;
            } else {
                var fullPathToLayerDirectory = rootPath + "/" + layer;
                if (isDirectory(fullPathToLayerDirectory)) {
                    directories.push(layer.toLowerCase());
                }
            }
        });

        // Ensure handlers are always loaded last.
        if (hasControllers) {
            directories.push("controllers");
        }

        return directories;
    }

    /**
     * Recursively loads and instantiates javascript files within a path
     * adding references to them under the current layer namespace on the
     * supplied server object.
     */
    function loadComponents(path, layer) {
        var files = getDirectoryFileListSync(path),
            components = {};

        files.forEach(function(fileName) {
            var fullPathToFile = path + "/" + fileName;
            if (isDirectory(fullPathToFile)) {
                loadComponents(fullPathToFile, layer);
            } else if (fileName.indexOf(excludePrefix) != 0 && fileName.indexOf(".js") === fileName.length - 3) {
                var name = getRequireName(fileName),
                    item = require(path + "/" + name);

                if (typeof item === "function") {
                    item = item(server); 
                }
                
                if (item) {
                    console.log("Attaching", layer + "." + getInstanceName(name));
                    components[getInstanceName(name)] = item;
                }
            }
        });

        return components;
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
     * Synchronously returns the name of the file sans .js suffix.
     */
    function getRequireName(file) {
        return file.substr(0, file.lastIndexOf(".js"));
    }

    /**
     * Synchronously returns the name of an instance.
     *
     * i.e. The name of the file with the first letter lower case.
     */
    function getInstanceName(name) {
        return name[0].toLowerCase() + name.substr(1);
    }
};

