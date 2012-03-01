var test = require("tap").test;

test("Ensure loader loads layers", function(t) {
    var layers = require('../layers'),
        server = {};
    debugger;
    layers(server, {
        rootPath: __dirname + "/../testLayers"
    });
    t.ok(server.controllers, "Controllers stack exists");
    t.ok(server.services, "Services stack exists");
    t.ok(server.controllers.testController, "Test controller is present");
    t.ok(server.controllers.testController.testControllerPresent, "Test controller property is present");
    t.equal(server.controllers.anotherTestController.testControllerFunction(), "Hello", "Test controller function is present and returns correct value");
    
    t.ok(server.services.testService, "Test service is present");
    t.ok(server.services.testService.testServicePresent, "Test service property is present");
    t.equal(server.services.testService.testServiceFunction(), "A Test value", "Test service function is present and returns correct value");
    t.end();
});
