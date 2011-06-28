# Node Layers

Node Layers is a helper module for [nodejs](http://nodejs.org) web apps. It will
automatically load and loosely couple the layers of your web app.

If you prefer a real-world implementation rather than abstract documentation
please see [Layered Express](https://github.com/dave-elkan/layered-express).

Node Layers does not strictly prescribe which layers it supports. Instead it
facilitates the loading of the files which make up your web app running them 
(if they're functions) or simply loading them if they're plain old javascript
objects and adding them as properties of your app/server object.

The app is then passed to the wiring function (see below) which wires up the 
layers of your application.

Currently the only supported framework is Express, however Node Layers has been
designed to be extended to work with any framework. Feel free to submit a patch.

## Installation

To install Node Layers:

    $ npm install layers

## Usage

The Layers module accepts a server object (or app in the case of Express), 
the path to the files making up your layers and a function which will return
the routes definition object (see Wiring section below).

i.e. for Express:

    var Layers = require('layers').Express,
		wiring = require('./layers/wiring');
    new Layers(app, __dirname + '/layers', wiring);

## Loading Layers

Each directory nested immediately within the layers directory defines a layer.

Each of these layer directories are recursively scanned for javascript files which are imported using require. The result of the require is inspected for two possibilities: 

* An object
* A function which returns an object.

The object loaded or returned from the function is appended to the app object under the layer's namespace.
 
e.g.
 
/path/to/app/layers/controllers/BookController.js becomes app.controllers.bookController
/path/to/app/layers/services/AuthorService.js becomes app.services.authorService

One exception is made when loading the layer files: Any file whose name begins with "Base" is ignored.
This name can be overriden by specifying the `excludePrefix` option.

i.e. 

    new Layers(app, __dirname + '/layers', routes, {
		excludePrefix: "Abstract"
	});

## Wiring

To wire the layers together you need to create a 'wiring' function. 
This function takes the layer populated app object as it's only parameter 
and returns a hash of arrays indexed by the route they service.

i.e.

	`module.exports = function(app) {
		var controllers = app.controllers,
			views = app.views;
		return {
   			"/": [{
   					action: controllers.homeController.homeGetAction,
   					views: {
						html: views.homeView,
						json: views.jsonView
	   				}
   				}, {
					method: "post",
					action: controllers.homeController.homePostAction,
					views: {
						json: views.jsonView
					}
				}
	   		],

   			"/path/of/route": [{
					action: controllers.someController.doesSomething,
					views: {
						html: views.someView,
						json: views.jsonView
					}
   				}
   			]
		}
	}`

The format of the wiring object is important. Each route supports many 
handlers which all have to define Action and View properties.

The method property is optional and defaults to 'get'.

## Actions

A handler's action property is simply a reference to a function which accepts a 
request and response objects as well as a callback and next function. They are 
called in the context of the app object which allows for easy access to all of the other layers.

Action functions generally belong to the Controller layer. They are responsible for pulling 
variables from the request, their validation and sending them to the Service layer. 
The following contrived example does not allow any '1s' in the Author's key.

You will also notice that this controller simply delegates to the service layer, but at the same time it shields it from the request and response objects.

The callback variable which is owned and created by Layers is passed straight through to the service layer. 
It accepts the result of the service or an Error.

i.e.

	module.exports = {
    
	    displayAuthorList: function(req, res, callback) {
	        this.services.authorService.getList(callback);
	    },

	    displayAuthorByKey: function(req, res, callback, next) {
	        var authorKey = req.params.key;
	        if (authorKey.indexOf("1") > -1) {
	            callback(new Error("No ones allowed!"));
	        } else {
	            this.services.authorService.getAuthorAndTheirBooks(authorKey, callback);            
	        }
	    }
	};

## Views

Views are wrappers around your favourite templating system. They accept the request and response objects and the result of the handler's action.

BaseExpressView can be used as a basis for your own Express (jade) Views. You only need to specify the "getTemplate" function.

## Error View

Node Layers supplies an ErrorView function which is be used by default to display errors.
It is advisable that you define your own ErrorView function so you can better 
display errors as you see fit when they occur.

## License

(The MIT License)

Copyright (C) 2011 by Dave Elkan &lt;dave@edave.net&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
