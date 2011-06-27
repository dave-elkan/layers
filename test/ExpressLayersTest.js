var assert = require('assert'),
    Layers = require('../index').Express;
    
exports["Ensure layers are loaded as expected"] = function() {
        
    function wiring() {
        return {
            "/": [{}],
            "/index": [{}]
        };
    }
    
    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function() {}
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
        
        assert.isNotNull(mockServer.views.itemView);
        assert.isNotNull(mockServer.controllers.testController);
        assert.isNotNull(mockServer.customlayer.custom);
};

exports["Ensure GET routes are installed correctly and in order"] = function() {
        
    function wiring() {
        return {
            "/": [{}],
            "/index": [{}]
        };
    }
    
    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                actions.push(path);
            }
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);

        assert.equal(0, actions.indexOf("/"));
        assert.equal(1, actions.indexOf("/index"));
};

exports["Ensure POST routes are installed correctly and in order"] = function() {
        
    function wiring() {
        return {
            "/": [{
                method: "POST"
            }],
            "/index": [{
                method: "post"
            }]
        };
    }
    
    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                assert.ok(false, "No GET handlers initialised");
            },
            post: function(path, middleware, callback) {
                actions.push(path);
            },
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);

        assert.equal(0, actions.indexOf("/"));
        assert.equal(1, actions.indexOf("/index"));
};

exports["Ensure mixed method routes are installed correctly and in order"] = function() {
        
    function wiring() {
        return {
            "/": [{
                method: "get"
            }],
            
            "/index": [{
                method: "POST"
            }],

            "/something": [{
                method: "POST"
            }]
        };
    }
    
    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                actions.push(path);
            },
            post: function(path, middleware, callback) {
                actions.push(path);
            },
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);

        assert.equal(0, actions.indexOf("/"));
        assert.equal(1, actions.indexOf("/index"));
        assert.equal(2, actions.indexOf("/something"));
        
};

exports["Ensure multi-handler routes are installed correctly and in order"] = function() {
        
    function wiring() {
        return {
            "/": [{
                method: "get"
            }, {
                method: "post"
            }]
        };
    }
    
    var actions = [],
        gets = [],
        posts = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                actions.push(path);
                gets.push(path);
            },
            post: function(path, middleware, callback) {
                actions.push(path);
                posts.push(path);
            },
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
    
    assert.equal(0, actions.indexOf("/"), "/ get handler");
    assert.equal(1, actions.lastIndexOf("/"), "/ post handler");
    assert.equal(0, gets.indexOf("/"), "/get handler");
    assert.equal(0, posts.indexOf("/"), "/ post handler");
};

exports["Ensure mixed multi/single-handler routes are installed correctly and in order"] = function() {
        
    function wiring() {
        return {
            "/": [{
                method: "get"
            }, {
                method: "post"
            }],

            "/single": [{
                method: "POST"
            }]
        };
    }
    
    var actions = [],
        gets = [],
        posts = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                actions.push(path);
                gets.push(path);
            },
            post: function(path, middleware, callback) {
                actions.push(path);
                posts.push(path);
            },
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
    
    assert.equal(0, actions.indexOf("/"), "/ get handler");
    assert.equal(1, actions.lastIndexOf("/"), "/ post handler");
    assert.equal(2, actions.indexOf("/single"), "/single post handler");

    assert.equal(0, gets.indexOf("/"), "/get handler");
    assert.equal(0, posts.indexOf("/"), "/ post handler");
    assert.equal(1, posts.indexOf("/single"), "/single post handler");

};

exports["Ensure middleware is correctly initialised"] = function(a) {

    function srcMiddleware() {}
        
    function wiring() {
        return {
            "/": [{
                middleware: [
                    srcMiddleware
                ]
            }]
        };
    }
    
    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function(path, middleware, callback) {
                assert.equal(srcMiddleware, middleware[0]);
            }
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
};

exports["Test dodgy wiring - wiring is invalid (an array)"] = function () {

    function wiring() {
        return [{}];
    }

    var actions = [],
        layersDir = __dirname + '/express/layers/valid',
        mockServer = {
            get: function (path, middleware, callback) {
                assert.ok(false, "Invalid hanlder should not be installed");
            }
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
};
