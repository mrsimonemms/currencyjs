/**
 * In Array
 * 
 * Checks if the needle is in the haystack
 * 
 * @param {mixed} needle
 * @param {mixed} haystack
 * @returns {Boolean}
 */
exports.inArray = function(needle, haystack) {
    
    if(typeof haystack === 'object' && haystack instanceof Array) {
        return haystack.indexOf(needle) !== -1;
    }
    
    return false;
    
};