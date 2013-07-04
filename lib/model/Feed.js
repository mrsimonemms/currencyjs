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

var DataUtils = require('../helpers').datautils;

function Feed(values) {
    
    this.currencyId = values.currencyId || null;
    this.currency = DataUtils.setString(values.currency, null);
    this.base = DataUtils.setString(values.base, null);
    this.rate = DataUtils.setFloat(values.rate, null);
    this.date = DataUtils.setDate(values.date, null);
    
    return this;

}


/**
 * To Data
 * 
 * Convert from model to database
 * 
 * @param {object} objModel
 * @returns {object}
 */
Feed.toData = function(objModel) {
    return {
        currencyId: objModel.currencyId,
        currency: objModel.currency,
        base: objModel.base,
        rate: objModel.rate,
        date: objModel.date
    };
};


/**
 * To Model
 * 
 * Convert from database into a model
 * 
 * @param {object} objData
 * @returns {object}
 */
Feed.toModel = function(objData) {
    return new Feed({
        currencyId: objData.currencyId,
        currency: objData.currency,
        base: objData.base,
        rate: objData.rate,
        date: objData.date
    });
};


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
    
    var arrFeed = [];

    arrInput.forEach(function(input) {
        
        console.log(input);
        process.exit();
        
    });

    return callback(null, arrFeed);
    
};


/**
 * Prototype
 * 
 * The public methods
 */
Feed.prototype = {
    
    toDTO: function() {
        return _.pick(this, [
        ]);
    },

    update: function(objData) {
        this._updateTimestamp = new Date();
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
        
        return arrErrors.length > 0 ? new ValidationError("NONCE_ERROR", arrErrors) : null;

    }
    
};