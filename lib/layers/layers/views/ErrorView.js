ErrorView = function() {};

/**
 * Renders an Error.
 *
 * Generic place-holder error view.
 *
 * You should consider creating your own version of this
 * View to allow for a better error page.
 *
 * @param {Object}  req     The request object.
 * @param {Object}  res     The response object.
 * @param {Object}  error   The error.
 */
ErrorView.prototype.render = function(req, res, error) {
    res.statusCode = 500;
    res.end("Error", "utf8");
}

module.exports = ErrorView;