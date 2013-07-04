/**
 * Data Utils
 * 
 * A series of utility functions that allow
 * us to ensure consistent data coming into
 * the library.
 */


/**
 * Set Bool
 * 
 * Sets an input value as a boolean, or
 * the default value
 * 
 * @param {type} input
 * @param {type} def
 * @returns {unresolved}
 */
exports.setBool = function(input, def) {
    
    if(typeof input === 'boolean') {
        return input;
    }
    
    if(typeof input === 'string') {
        input = input.toUpperCase();
        
        /* True */
        if(input === 'Y' || input === '1' || input === 'TRUE' || input === 'T' || input === 'YES') {
            return true;
        }
        
        /* False */
        if(input === 'N' || input === '0' || input === 'FALSE' || input === 'F' || input === 'NO') {
            return false;
        }
        
    }
    
    if(typeof input === 'number') {
        /* True */
        if(input === 1) {
            return true;
        }
        
        /* False */
        if(input === 0) {
            return false;
        }
    }
    
    return def;
    
};



/**
 * Set Date
 * 
 * Sets an input value as a date object, or
 * the default value
 * 
 * @param {mixed} input
 * @param {mixed} def
 * @returns {mixed}
 */
exports.setDate = function(input, def) {
    
    if(input instanceof Date) {
        /* Already date object - return */
        return input;
    }
    
    if(typeof input === 'string') {
        /* Match ISO8601 date */
        if(input.match(/(\d{4}(?:(?:(?:\-)?(?:00[1-9]|0[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-6]))?|(?:(?:\-)?(?:1[0-2]|0[1-9]))?|(?:(?:\-)?(?:1[0-2]|0[1-9])(?:\-)?(?:0[1-9]|[12][0-9]|3[01]))?|(?:(?:\-)?W(?:0[1-9]|[1-4][0-9]5[0-3]))?|(?:(?:\-)?W(?:0[1-9]|[1-4][0-9]5[0-3])(?:\-)?[1-7])?)?)/)) {
            return new Date(input);
        }
    }
    
    return def;
    
};



/**
 * Set Float
 * 
 * Sets an input value as an integer, or
 * the default value
 * 
 * @param {mixed} input
 * @param {mixed} def
 * @returns {mixed}
 */
exports.setFloat = function(input, def) {
    
    if(typeof input === 'string' || typeof input === 'number') {
        /* Cast to string so we can see if integer */
        var value = String(input);
        
        if(isNaN(value) === false) {
            return parseFloat(value);
        }
    }
    
    return def;
    
};



/**
 * Set Int
 * 
 * Sets an input value as an integer, or
 * the default value
 * 
 * @param {mixed} input
 * @param {mixed} def
 * @returns {mixed}
 */
exports.setInt = function(input, def) {
    
    if(typeof input === 'string' || typeof input === 'number') {
        /* Cast to string so we can see if integer */
        var value = String(input);
        
        if(value.match(/^(\-|\+)?\d+$/)) {
            /* It's an integer - push to integer and carry on */
            return parseInt(value, 10);
        }
    }
    
    return def;
    
};



/**
 * Set String
 * 
 * Sets an input value as a string, or
 * the default value
 * 
 * @param {type} input
 * @param {type} def
 * @returns {unresolved}
 */
exports.setString = function(input, def) {
    
    if(typeof input === 'string' || typeof input === 'number') {
        return String(input);
    }
    
    return def;
    
};