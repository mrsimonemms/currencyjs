/**
 * Feed
 * 
 * Model the XML input feed
 * 
 * @param {object} module
 * @author Simon Emms <simon@simonemms.com>
 */
module.exports = Feed;

var _ = require('underscore');
var dateformat = require('dateformat');

var DataUtils = require('../helpers').datautils;

function Feed(values) {
    
    var objValues = values || {};
    
    this.currencyId = objValues.currencyId || null;
    this.currency = DataUtils.setString(objValues.currency, null);
    this.base = DataUtils.setString(objValues.base, 'EUR').toUpperCase(); /* Default to Euro */
    this.rate = DataUtils.setFloat(objValues.rate, 1);
    this.date = DataUtils.setDate(objValues.date, new Date());
    
    if(typeof this.currency === 'string') { this.currency = this.currency.toUpperCase(); }
    
    return this;

}


/**
 * Push Feed To Model
 * 
 * This pushes the actual feed to a model. Normally,
 * this would be done in the parseModelsFromXML
 * method, but that would an anonymous function in
 * an anonymous function, as JSHint will moan.
 * 
 * @param {array} arrCurrencies
 * @param {string} date
 * @returns {array}
 */
function pushFeedToModel(arrCurrencies, date) {
    
    var arrModels = [];
    
    arrCurrencies.forEach(function(currency) {
        
        var objModel = Feed.toModel({
            currency: currency.$.currency,
            rate: currency.$.rate,
            date: date
        });
        
        /* Validate the model */
        var err = objModel.validate();
        if(err === null) {
            arrModels.push(objModel);
        }
        
    });
    
    return arrModels;
    
}


/**
 * To Data
 * 
 * Convert from model to database
 * 
 * @param {object} options
 * @returns {object}
 */
Feed.toData = function(options) {
    
    var objModel = options || {};
    
    return {
        currencyId: objModel.currencyId,
        currency: objModel.currency,
        base: objModel.base,
        rate: objModel.rate,
        date: dateformat(objModel.date, 'yyyy-mm-dd')
    };
};


/**
 * To Model
 * 
 * Convert from database into a model
 * 
 * @param {object} options
 * @returns {object}
 */
Feed.toModel = function(options) {
    
    var objData = options || {};
    
    return new Feed({
        currencyId: objData.currencyId,
        currency: objData.currency,
        base: objData.base,
        rate: objData.rate,
        date: objData.date
    });
};



/**
 * Parse Models From XML
 * 
 * Parses the input XML and pushes it to
 * an array of models
 * 
 * @param {object} objData
 * @returns {array}
 */
Feed.parseModelsFromXML = function(objData) {
    
    /* Check that the feed is in correct format */
    if(
        objData['gesmes:Envelope'] === undefined ||
        objData['gesmes:Envelope'].Cube === undefined ||
        objData['gesmes:Envelope'].Cube[0] === undefined ||
        objData['gesmes:Envelope'].Cube[0].Cube === undefined ||
        objData['gesmes:Envelope'].Cube[0].Cube instanceof Array === false
    ) { throw new Error('Input XML feed is invalid'); }
    
    var arrInput = objData['gesmes:Envelope'].Cube[0].Cube;
    
    var arrModels = [];
    
    arrInput.forEach(function(input) {
        
        /* First layer is the date - oddly, this is called 'time' */
        var date = input.$.time;
        
        /* Now get rates for individual currencies */
        var arrCurrencies = input.Cube || [];
        
        /* Put to the output */
        arrModels = _.union(arrModels, pushFeedToModel(arrCurrencies, date));
        
    });
    
    return arrModels;
    
};


/**
 * Prototype
 * 
 * The public methods
 */
Feed.prototype = {
    
    
    /**
     * Get Date
     * 
     * Returns the date object
     * 
     * @returns {Date}
     */
    getDate: function() {
        return this.date;
    },
    
    
    /**
     * Get Formatted Date
     * 
     * Returns the date in ISO format
     * 
     * @returns {string}
     */
    getFormattedDate: function() {
        return dateformat(this.date, 'yyyy-mm-dd');
    },
    
    
    /**
     * Get Rate
     * 
     * Returns the rate
     * 
     * @returns {number}
     */
    getRate: function() {
        return this.rate;
    },
            
    
    /**
     * Validate
     *
     * Performs the validation of the data
     *
     * @returns exception/null
     */
    validate: function() {

        var arrErrors = [];
        
        if(this.currency === null) { arrErrors.push('Currency cannot be null'); }
        
        return arrErrors.length > 0 ? new Error(arrErrors) : null;

    }
    
    
};