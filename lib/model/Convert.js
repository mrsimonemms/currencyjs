/**
 * Convert
 * 
 * Model the currency conversion
 * 
 * @param {object} module
 * @author Simon Emms <simon@simonemms.com>
 */
module.exports = Convert;

var _ = require('underscore');
var bignumber = require('bignumber.js');
var dateformat = require('dateformat');
var humanize = require('humanize');

var DataUtils = require('../helpers').datautils;
var Feed = require('./Feed');

function Convert(objFrom, objTo, value) {
    
    if(objFrom instanceof Feed === false) { throw new Error('From not instance of Feed'); }
    if(objTo instanceof Feed === false) { throw new Error('To not instance of Feed'); }
    
    /* Set the object values */
    this.objFrom = objFrom;
    this.objTo = objTo;
    this.fromValue = DataUtils.setFloat(value, 0);
    this.toValue = 0;
    this.date = setDate(objFrom.getDate(), objTo.getDate());
    this.rate = null;
    this.reverseRate = null;
    
    /* Calculate the rate */
    var objRates = calculateRates(this.objFrom, this.objTo);
    
    this.rate = objRates.rate;
    this.reverseRate = objRates.reverseRate;

    /* Calculate the new value */
    this.calculate();
    
    return this;

}



/**
 * Calculate Rates
 * 
 * Calcules the rate and reverse rate between
 * the two currencies
 * 
 * @param {Feed} objFrom
 * @param {Feed} objTo
 * @returns {object}
 */
function calculateRates(objFrom, objTo) {
    
    /* Get the to/from rate */
    var fromRate = new bignumber(objFrom.getRate());
    var toRate = new bignumber(objTo.getRate());
    var one = new bignumber(1);
    
    /* Check neither 0 - this means not got the data */
    if(fromRate === 0 || toRate === 0) {
        throw new Error('The rate is displaying as 0 - have you imported your data?');
    }
    
    /* Rate is "from" divided by "to" */
    var rate = fromRate.dividedBy(toRate);
    
    /* Reverse rate is 1 / rate */
    var reverseRate = one.dividedBy(rate);
    
    return {
        rate: rate,
        reverseRate: reverseRate
    };
    
}



/**
 * Set Date
 * 
 * Sets the date and ensures that the
 * from and to dates are the same
 * 
 * @param {Date} objFrom
 * @param {Date} objTo
 * @returns {Date}
 */
function setDate(objFrom, objTo) {
    
    if(objFrom instanceof Date === false) { throw new Error('From not instance of Date'); }
    if(objTo instanceof Date === false) { throw new Error('To not instance of Date'); }
    
    /* Check dates the same */
    if(dateformat(objFrom, 'yyyy-mm-dd') !== dateformat(objTo, 'yyyy-mm-dd')) {
        throw new Error('From and to dates are different');
    }
    
    /* Doesn't matter which we return as both the same */
    return objFrom;
    
}


/**
 * Prototype
 * 
 * The public methods
 */
Convert.prototype = {
    
    
    /**
     * Calculate
     * 
     * Calculate what the given value will
     * be in the new currency
     * 
     * @param {number} value
     * @returns {undefined}
     */
    calculate: function(value) {
        
        /* Are we specifying the value? */
        if(value !== undefined) {
            /* Yup - this would be after we've created the object */
            this.fromValue = DataUtils.setFloat(value, 0);
        }
        
        var fromValue = new bignumber(this.getFromValue());
        var rate = this.rate;
        
        this.toValue = DataUtils.setFloat(Number(fromValue.times(rate)), 0);
        
    },
    
    
    /**
     * Calculate Reverse
     * 
     * Calculate what the given value will
     * be in the original currency
     * 
     * @param {number} value
     * @returns {undefined}
     */
    calculateReverse: function(value) {
        
        /* Are we specifying the value? */
        if(value !== undefined) {
            /* Yup - this would be after we've created the object */
            this.toValue = DataUtils.setFloat(value, 0);
        }
        
        var toValue = new bignumber(this.getToValue());
        var reverseRate = this.reverseRate;
        
        this.fromValue = DataUtils.setFloat(Number(toValue.times(reverseRate)), 0);
        
    },
    
    
    /**
     * Get From Formatted
     * 
     * Gets the from value formatted
     * 
     * @param {number} decimals
     * @param {string} decPoint
     * @param {string} thousandsSep
     * @returns {string}
     */
    getFromFormatted: function(decimals, decPoint, thousandsSep) {
        if(decimals === undefined) { decimals = 2; }
        if(decPoint === undefined) { decPoint = '.'; }
        if(thousandsSep === undefined) { thousandsSep = ','; }
        
        return humanize.numberFormat(this.fromValue);
    },
    
    
    /**
     * Get From Value
     * 
     * Gets the from value
     * 
     * @returns {number}
     */
    getFromValue: function() {
        return this.fromValue;
    },
    
    
    /**
     * Get Rate
     * 
     * Gets the rate
     * 
     * @returns {number}
     */
    getRate: function() {
        return Number(this.rate);
    },
    
    
    /**
     * Get Reverse Rate
     * 
     * Gets the rate to reverse back to
     * the original currency
     * 
     * @returns {number}
     */
    getReverseRate: function() {
        return Number(this.reverseRate);
    },
    
    
    /**
     * Get To Formatted
     * 
     * Gets the To value formatted
     * 
     * @param {number} decimals
     * @param {string} decPoint
     * @param {string} thousandsSep
     * @returns {string}
     */
    getToFormatted: function(decimals, decPoint, thousandsSep) {
        if(decimals === undefined) { decimals = 2; }
        if(decPoint === undefined) { decPoint = '.'; }
        if(thousandsSep === undefined) { thousandsSep = ','; }
        
        return humanize.numberFormat(this.toValue);
    },
    
    
    /**
     * Get To Value
     * 
     * Gets the to value
     * 
     * @returns {number}
     */
    getToValue: function() {
        return this.toValue;
    }
    
    
};