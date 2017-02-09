const test = require('tap').test;

test('Ensure loader loads layers by directory', function (t) {
    const layers = require('../layers'),
        server = {};
    layers(server, {
        rootPath: __dirname + '/../testLayers'
    });


    t.ok(server.IoC.controllers, 'Controllers stack exists');
    t.equal(Object.keys(server.IoC.controllers).length, 2, 'Loaded correct number of controllers');
    t.ok(server.IoC.controllers.testController, 'Test controller is present');
    t.ok(server.IoC.controllers.testController.testControllerPresent, 'Test controller property is present');
    t.equal(server.IoC.controllers.anotherTestController.testControllerFunction(), 'Hello', 'Test controller function is present and returns correct value');

    t.ok(server.IoC.services, 'Services stack exists');
    t.equal(Object.keys(server.IoC.services).length, 2, 'Loaded correct number of services');
    t.ok(server.IoC.services.testService, 'Test service is present');
    t.ok(server.IoC.services.testService.testServicePresent, 'Test service property is present');
    t.equal(server.IoC.services.testService.testServiceFunction(), 'A Test value', 'Test service function is present and returns correct value');
    t.ok(server.IoC.services.testInnerService, 'testInnerService is present');
    t.end();
});

test('Ensure loader loads layers by file names', function (t) {
    const layers = require('../layers'),
        server = {};
    layers(server, {
        rootPath: __dirname + '/../testLayers',
        loadRecursivelyPerLayerName: true,
        layers: ['Service', 'Controller']
    });
    t.ok(server.IoC.controller, 'Controllers stack exists');
    t.equal(Object.keys(server.IoC.controller).length, 2, 'Loaded correct number of controllers');
    t.ok(server.IoC.controller.testController, 'Test controller is present');
    t.ok(server.IoC.controller.testController.testControllerPresent, 'Test controller property is present');
    t.equal(server.IoC.controller.anotherTestController.testControllerFunction(), 'Hello', 'Test controller function is present and returns correct value');

    t.ok(server.IoC.service, 'Services stack exists');
    t.equal(Object.keys(server.IoC.service).length, 3, 'Loaded correct number of services');
    t.ok(server.IoC.service.testService, 'Test service is present');
    t.ok(server.IoC.service.testService.testServicePresent, 'Test service property is present');
    t.equal(server.IoC.service.testService.testServiceFunction(), 'A Test value', 'Test service function is present and returns correct value');
    t.ok(server.IoC.service.testInnerService, 'testInnerService is present');
    t.equal(server.IoC.service.testInnerService.testServiceFunction(), 'A Inner Test value', 'testInnerService function is present and returns correct value');
    t.ok(server.IoC.service.byFunctionalityTestService, 'byFunctionalityTestService is present');
    t.equal(server.IoC.service.byFunctionalityTestService.testServiceFunction(), 'A by functionality Test value', 'byFunctionalityTestService function is present and returns correct value');
    t.end();
});

test('Ensure loader loads layers by file names in specific contextName', function (t) {
    const layers = require('../layers'),
        server = {};
    layers(server, {
        rootPath: __dirname + '/../testLayers',
        loadRecursivelyPerLayerName: true,
        layers: ['Service', 'Controller'],
        contextName: 'IOC2'
    });
    t.equal(Object.keys(server.IOC2.controller).length, 2, 'Loaded correct number of controllers');
    t.equal(Object.keys(server.IOC2.service).length, 3, 'Loaded correct number of services');
    t.end();
});

test('test layer callback', function (t) {
    const layers = require('../layers'),
        server = {};

    let called = false;
    layers(server, {
        rootPath: __dirname + '/../testLayers',
        callbacks: {
            controllers: function () {
                called = true;
            }
        }
    });

    t.ok(called, 'Callback was hit');
    t.end();
});
