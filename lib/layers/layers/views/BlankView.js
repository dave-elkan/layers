var View = require('./AbstractView');

BlankView = function() {};

BlankView.prototype = new AbstractView();

/**
 * Renders a blank page.
 *
 * @param {Object}  req     The request object.
 * @param {Object}  res     The response object.
 * @param {Object}  result  The object(s) being rendered.
 */
BlankView.prototype.render = function(req, res, result) {
    res.send(result);
};

module.exports = BlankView;