/**
 * Object Values
 * 
 * Pass out the values of an object
 * as an array.  Similar to PHP's
 * array_values() function
 * 
 * @param {object} obj
 * @returns {array}
 * @todo unit tests
 */
exports.objectValues = function(obj) {
    var arrOut = [];
    
    for(var key in obj) {
        arrOut.push(obj[key]);
    }
    
    return arrOut;
};

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