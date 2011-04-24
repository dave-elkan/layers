var fs = require('fs');

function loader(app, rootPath, namespace) {
    if (!app[namespace]) {
        app[namespace] = {}
    }

    loadFiles(app, __dirname + '/../layers/' + namespace, namespace);    
    loadFiles(app, rootPath + '/' + namespace, namespace);
}

function loadFiles(app, path, namespace) {
    if (dirExistsSync(path)) {
        var files = fs.readdirSync(path);

        files.forEach(function(file, i) {
            if (file.indexOf("Abstract") == -1) {
                var className = getClassName(file),
                    clazz = require(path + "/" + className);

                app[namespace][getInstanceName(className)] = new clazz(app);
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
    
function getClassName(file) {
    return file.substr(0, file.lastIndexOf(".js"));
}

function getInstanceName(className) {
    return className[0].toLowerCase() + className.substr(1);
}

module.exports = loader