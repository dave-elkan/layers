/**
 * Renders a (very basic) Error.
 *
 * Renders an error to either text/html or application/json depending on the
 * Accept header of the request.
 *
 * @param {Object}  req     The request object.
 * @param {Object}  res     The response object.
 * @param {Object}  error   The error to render.
 */
module.exports = {
    render: function(req, res, error) {
        var body = "Error";
        res.writeHead(500, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain'
        });
        res.end(body);
    }
};