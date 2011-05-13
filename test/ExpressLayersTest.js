var express = require('express'),
    assert = require('assert'),
    JsonView = require('./express/layers/views/JsonView'),
    ItemView = require('./express/layers/views/ItemView'),
    IndexView = require('./express/layers/views/IndexView'),
    jsonView = new JsonView(),
    itemView = new ItemView(),
    indexView = new IndexView(),
    Layers = require('../index').Express,
    server = express.createServer();
	
server.configure(function(){
  server.set('views', __dirname + '/express/templates');
  server.set('view engine', 'jade');
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(server.router);
  server.use(express.static(__dirname + '/public'));
});

var routes = function(app) {
    return {
            "/": [{
                    action: function(req, res, callback) {
                        callback(null, {
                            _id: "test-1",
                            name: "Test 1"
                        });
                    },
                    views: {
                        html: itemView
                    }
                }
            ],
    
                "/index": [{
                    action: function(req, res, callback) {
                        callback(null, [{
                            _id: "test-1",
                            name: "Test 1"
                        }, {
                            _id: "test-2",
                            name: "Test 2"
                        }]);
                    },
                    views: {
                        html: indexView,
                        json: jsonView
                    }
                }
            ]
        }
    },
    layeredApp = new Layers(server, __dirname + '/express/layers', routes);

exports["test routes are setup and responds as expected in html"] = function() {

	assert.response(server,
		{
			url: '/',
			headers: {
			    "Accept": "text/html"
			},
			timeout: 200
		},
		{
			status: 200,
			headers: {
				'Content-Type': "text/html; charset=utf-8"
			}
		}, function(res) {
		    assert.ok(res.body.indexOf('<h1>Test 1</h1>') >= 0, 'Ensure Test Heading exits');
		}
	);
	
	assert.response(server,
		{
			url: '/index',
			headers: {
			    "Accept": "text/html"
			},
			timeout: 200
		},
		{
			status: 200,
			headers: {
				'Content-Type': "text/html; charset=utf-8"
			}
		}, function(res) {
		    assert.ok(res.body.indexOf('<li>Test 1</li>') >= 0, 'Ensure Test 1 list item exists');
		    assert.ok(res.body.indexOf('<li>Test 2</li>') >= 0, 'Ensure Test 2 list item exists');
		}
	);
};

exports["Test routes are setup and respond (or don't) as expected in json"] = function() {

	assert.response(server,
		{
			url: '/',
			headers: {
			    "Accept": "application/json"
			},
			timeout: 200
		},
		{
			status: 404,
			headers: {
				'Content-Type': "text/plain"
			}
		}
	);
	
	assert.response(server,
		{
			url: '/index',
			headers: {
			    "Accept": "application/json"
			},
			timeout: 200
		},
		{
			status: 200,
			headers: {
				'Content-Type': "application/json; charset=utf-8"
			}
		}, function(res) {
		    assert.ok(res.body.indexOf('"name":"Test 1"') >= 0, 'Ensure Text 1 name property exists');
		    assert.ok(res.body.indexOf('"name":"Test 2"') >= 0, 'Ensure Text 2 name property exists');
		}
	);
};