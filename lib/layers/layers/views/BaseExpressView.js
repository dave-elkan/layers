BaseExpressView = function() {};

/**
 * Renders a view with the result of the action.
 * 
 * This function will send the result to the view's
 * format function so any last-minute formatting can be
 * performed. 
 * 
 * If an error occurs during the formatting an error is 
 * displayed in the Error View. If no Error View is present
 * then the default Express error handler is utilised.
 *
 * @param {Object}    req     The request object.
 * @param {Object}    res     The response object.
 * @param {Object}    result  The object(s) being rendered.
 * @param {Function}  next    The next function in the middleware stack.
 */
BaseExpressView.prototype.render = function(req, res, result, next) {
    var self = this;
    this.format(result, function(error, result) {
        if (error) {
            var errorView = self.getErrorView();
            if (!errorView) {
                next(error);
            } else {
                errorView.render(req, res, error);
            }
        } else {
            res.render(self.getTemplate(), self.getRenderParameters(result));
        }
    });
};

/**
 * Returns an error view.
 *
 * This stub returns null to enforce reverting to Express'
 * internal error handler.
 * Override this function to define your own error view.
 */
BaseExpressView.prototype.getErrorView = function() {
    return null;
};

/**
 * Returns the name of the template file to use for this view.
 */
BaseExpressView.prototype.getTemplate = function() {
    throw new Error("No view template specified.");
};

/**
 * Returns an Express render parameters object containing only the 
 * result object.
 */
BaseExpressView.prototype.getRenderParameters = function(result) {
    return {
        locals: {
            result: result
        }
    };
};

/**
 * Placeholder function allowing for the formatting of 
 * objects to be sent to the BaseExpressView layer.
 *
 * @param {Object}   result     The object to format.
 * @param {Function} callback   The function to call when formatting is complete.
 */
BaseExpressView.prototype.format = function(result, callback) {
    callback(null, result);
};

module.exports = BaseExpressView;