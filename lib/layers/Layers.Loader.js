var fs = require('fs'),
    merger = require('./merger.js'),
    defaults = {
        excludePrefix: "Base"
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
    options = merger(defaults, options);
    getLayers(rootPath).forEach(function(layer) {
        if (!server[layer]) {
            server[layer] = {};
        }

        loadFiles(server, __dirname + '/layers/' + layer, layer, options);
        loadFiles(server, rootPath + "/" + layer, layer, options);
    });
}

/**
 * Returns a list of layer names.
 * 
 * Finds the directories in the root path supplied
 * and returns their names as the layers this application
 * makes use of.
 */
function getLayers(rootPath) {
    var files = getDirectoryFileListSync(rootPath),
        directories = [];

    files.forEach(function(fileName) {
        var fullPathToFile = rootPath + "/" + fileName;
        if (isDirectory(fullPathToFile)) {
            directories.push(fileName.toLowerCase());
        }
    });

    return directories;
}

/**
 * Recursively loads and instantiates javascript files within a path
 * adding references to them under the current layer namespace on the
 * supplied server object.
 */
function loadFiles(server, path, layer, options) {
    var files = getDirectoryFileListSync(path);

	files.forEach(function(fileName) {
       var fullPathToFile = path + "/" + fileName;
       if (isDirectory(fullPathToFile)) {
           loadFiles(server, fullPathToFile, layer, options);
        } else if (fileName.indexOf(options.excludePrefix) != 0 && fileName.indexOf(".js") === fileName.length - 3) {
            var name = getRequireName(fileName),
                item = require(path + "/" + name);

            if (typeof item === "function") {
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

module.exports = {
    loadLayers: loadLayers
};
