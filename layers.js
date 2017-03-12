/* eslint no-use-before-define: 0 */
const fs = require('fs'),
    defaults = {
        excludePrefix: 'Base',
        rootPath: './layers/',
        contextName: 'IoC'
    };

/**
 * Loads the 'layers' of an application by loading their constituent
 * files, instantiating them and adding them to the server object.
 *
 * @param server The server object (i.e. Express app).
 * @param options An optional options object.
 */
module.exports = function (server, options) {
    options = Object.assign({}, defaults, options);

    const layers = options.layers || getLayers(options.rootPath),
        excludePrefix = options.excludePrefix,
        loadRecursivelyPerLayerName = options.loadRecursivelyPerLayerName,
        callbacks = options.callbacks || {},
        requirePath = options.requirePath,
        contextName = options.contextName;

    console.log('Wiring layers started');
    server[contextName] = server[contextName] || {};
    let searchPath = options.rootPath;
    layers.forEach(function (layer) {
        if (!loadRecursivelyPerLayerName) {
            searchPath = options.rootPath + '/' + layer + '/';
        }
        server[contextName][getInstanceName(layer)] = loadComponents(searchPath, requirePath || searchPath, layer);
    });
    console.log('Wiring layers done');
    console.log('');

    /**
     * Returns a list of layer names.
     *
     * Finds the directories in the root path supplied
     * and returns their names as the layers this application
     * makes use of.
     */
    function getLayers(rootPath) {
        const dirs = getDirectoryFileListSync(rootPath),
            directories = [];
        let hasControllers = false;

        dirs.forEach(function (layer) {
            if (layer === 'controllers') {
                hasControllers = true;
            } else {
                const fullPathToLayerDirectory = rootPath + '/' + layer;
                if (isDirectory(fullPathToLayerDirectory)) {
                    directories.push(layer.toLowerCase());
                }
            }
        });

        directories.sort();

        // Ensure handlers are always loaded last.
        if (hasControllers) {
            directories.push('controllers');
        }

        return directories;
    }

    /**
     * Recursively loads and instantiates javascript files within a path
     * adding references to them under the current layer namespace on the
     * supplied server object.
     */
    function loadComponents(path, rPath, layer, components) {
        const files = getDirectoryFileListSync(path);
        components = components || {};

        files.forEach(function (fileName) {
            const fullPathToFile = path + '/' + fileName;
            if (isDirectory(fullPathToFile)) {
                loadComponents(fullPathToFile, rPath + '/' + fileName, layer, components);
            } else if (loadRecursivelyPerLayerName &&
                fileName.indexOf(excludePrefix) !== 0 &&
                fileName.indexOf('.js') === fileName.length - 3 &&
                fileName.indexOf(layer) !== -1) {
                attachComponent(fileName, rPath, layer, components);
            } else if (!loadRecursivelyPerLayerName &&
                fileName.indexOf(excludePrefix) !== 0 &&
                fileName.indexOf('.js') === fileName.length - 3) {
                attachComponent(fileName, rPath, layer, components);
            }
        });

        if (callbacks[layer]) {
            callbacks[layer]();
        }

        return components;
    }

    function attachComponent(fileName, path, layer, components) {
        const name = getRequireName(fileName);
        let item = require(path + '/' + name);

        if (isFunction(item)) {
            item = item(server);
        }

        if (item) {
            console.log('Attaching', getInstanceName(layer) + '.' + getInstanceName(name));
            components[getInstanceName(name)] = item;
        }
    }

    function isFunction(functionToCheck) {
        const getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    /**
     * Synchronously returns a file list from a directory.
     */
    function getDirectoryFileListSync(directory) {
        if (dirExistsSync(directory) && isDirectory(directory)) {
            return fs.readdirSync(directory);
        }
        return [];
    }

    /**
     * Synchronously checks to see whether a directory exists or not.
     */
    function dirExistsSync(directory) {
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
            const stats = fs.statSync(file);
            return stats.isDirectory();
        } catch (err) {
            return false;
        }
    }

    /**
     * Synchronously returns the name of the file sans .js suffix.
     */
    function getRequireName(file) {
        return file.substr(0, file.lastIndexOf('.js'));
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
