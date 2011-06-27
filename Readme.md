# Node Layers

Node Layers is a helper module for [nodejs](http://nodejs.org) web apps.
It will automatically load and loosely couple the layers of your web app.

If you prefer a real-world implementation rather than abstract documentation
please see [Layered Express](https://github.com/dave-elkan/layered-express).

Node Layers does not strictly prescribe which layers it supports. Instead it
facilitates the loading of the files which make up your web app, instantiating 
them (if they're prototypal objects), running them (if they're functions) 
or simply loading them if they're plain old javascript objects and adding them 
as properties of your app/server object.

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

The default layers loaded are controllers and views.
There must be a directory for each of these layers in your layers directory.
i.e. In the above example the controllers will be found at:

	/path/to/app/layers/controllers
	/path/to/app/layers/views

Different or additional layers can be loaded by overriding the default options
of the Layers module.

i.e. To load a directory of code which will serve as the service layer.

	var Layers = require('layers').Express,
		wiring = require('./layers/wiring');
    new Layers(app, __dirname + '/layers', wiring, {
        layers: [
            "controllers",
            "services",
            "views"
        ]
    });
	
This will load and instantiate all of the files (with one exception) in the 
following directories:

	/path/to/app/layers/controllers
	/path/to/app/layers/services
	/path/to/app/layers/views

## Loading and Instantiation

Each layer directory is recursively searched for files with .js suffix which are 
then loaded using `require`, instantiated and appended to the app object under
the namespace they belong. 

i.e. `BookController` is instantiated as a singleton to `app[controllers].bookController`

One exception is made: any file beggining with "Base" is ignored.
This name can be overriden by specifying the `excludePrefix` option.

i.e. 

    new Layers(app, __dirname + '/layers', routes, {
		excludePrefix: "Abstract"
	});

## Wiring

The wiring argument is a reference to a function which will return the
wiring of your webapp, their actions and views.

The function's only parameter is the server/app object. When the wiring
function is called the app has already been populated with your layers.

The wiring is defined as a map of arrays of route objects.

i.e.
	`module.exports = function(app) {
		var controllers = app.controllers,
			views = app.views;
		return {
   			"/": [{
   					method: "get",
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
		}`

## Controllers

Controllers are simple functions which accept a request, response and callback
parameters. The Controller is responsible for attempting to do some work (it's not
concerned what) and calling the callback with either the result of that work or a 
subsequent error.

The functions are called with the context of the app/server object. Thus all other
layers are easily referenced.

i.e.

	AuthorController = function() {};

	AuthorController.prototype = {
    
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

	module.exports = AuthorController;

## Views

Views wrap template files and offer testable formatting for your view output.

## Error View

Node Layers supplies an ErrorView function which will be used to display errors.
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
