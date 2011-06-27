/**
 * Simple merge function. Probably wrongish.
 */
module.exports = function merge(base, inst) {
    var merged = {};
    for (var p in base) {
        merged[p] = base[p];
    }
    for (var p in inst || {}) {
        merged[p] = inst[p];
    }

    return merged;
};
