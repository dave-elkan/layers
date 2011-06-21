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
            get: function(path, middleware, callback) {
                actions.push(path);
            }
        },
        layeredApp = new Layers(mockServer, layersDir, wiring);
        
        assert.isNotNull(mockServer.views.itemView);
        assert.isNotNull(mockServer.controllers.testController);
        assert.isNotNull(mockServer.customlayer.custom);
        assert.equal(2, actions.length);
};

exports["Ensure routes are installed correctly"] = function() {
        
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

        assert.equal(2, actions.length);
};