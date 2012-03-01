# Layers

Layers is a helper module for [nodejs](http://nodejs.org) web apps. It will
automatically load and loosely couple the layers of your web app.

Layers does not strictly prescribe which layers it supports. Instead it
facilitates the loading of the files which make up your web app running them 
(if they're functions) or simply loading them if they're plain old javascript
objects and adding them as properties of your app/server object.

The app is then passed to the wiring function (see below) which wires up the 
layers of your application.

Note. Layers v1.0.0 is simplification of 0.0.3 and has api breaking changes.
As of v1.0.0 layers will no longer wire up your application. Instead it will
simply load the components and namespace them on your app according to their
layer. Each component can setup routes or whatever is required of it when
it is initialised.

## Installation

To install Layers:

    $ npm install layers

## Usage

The Layers module accepts a server object (or app in the case of Express), 
the path to the files making up your layers and a function which will return
the routes definition object (see Wiring section below).

i.e. for Express:

    var layers = require('layers');
    layers(app, {
		rootPath: __dirname + '/layers'
	});

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

    layers(app, {
		rootPath: __dirname + '/layers',
		excludePrefix: "Abstract"
	});

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
