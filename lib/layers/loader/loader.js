var fs = require('fs');

function loader(app, rootPath, namespace) {
    if (!app[namespace]) {
        app[namespace] = {}
    }

    loadFiles(app, __dirname + '/../layers/' + namespace, namespace, 0);
    loadFiles(app, rootPath + '/' + namespace, namespace, 0);
}

function loadFiles(app, path, namespace, i) {
    if (dirExistsSync(path) && i < 20) {
        var files = fs.readdirSync(path);

        files.forEach(function(fileName) {
            var fullPathToFile = path + "/" + fileName;
            if (isDirectory(fullPathToFile)) {
                loadFiles(app, fullPathToFile, namespace, ++i);
            } else {
                var className = getClassName(fileName),
                    clazz = require(path + "/" + className);

                console.log(clazz.prototype.toString(), fileName);
                if (fileName.indexOf("Abstract") == -1) {
//                    console.log("loading: ", fullPathToFile);
                    var className = getClassName(fileName),
                        clazz = require(path + "/" + className);

                    app[namespace][getInstanceName(className)] = new clazz(app);
                }
            }
        });
    }
}

function dirExistsSync (directory) { 
    try {
        fs.statSync(directory);
        return true;
    } catch (err) {
        return false;
    } 
}

function isDirectory(file) {
    try {
        var stats = fs.statSync(file);
        return stats.isDirectory();
    } catch (err) {
        return false;
    }
}
    
function getClassName(file) {
    return file.substr(0, file.lastIndexOf(".js"));
}

function getInstanceName(className) {
    return className[0].toLowerCase() + className.substr(1);
}

module.exports = loader