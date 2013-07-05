/**
 * Insert
 * 
 * Model the DB insert into a common
 * format for consistency
 * 
 * @param {object} module
 * @author Simon Emms <simon@simonemms.com>
 */
module.exports = Insert;

var _ = require('underscore');

var DataUtils = require('../helpers').datautils;

function Insert(values) {
    
    var objValues = values || {};
    
    this.affectedRows = DataUtils.setInt(objValues.affectedRows, 0);
    this.changedRows = DataUtils.setInt(objValues.changedRows, 0);
    this.fieldCount = DataUtils.setInt(objValues.fieldCount, 0);
    this.insertId = DataUtils.setInt(objValues.insertId, 0);
    this.serverStatus = DataUtils.setInt(objValues.serverStatus, 0);
    this.warningCount = DataUtils.setInt(objValues.warningCount, 0);
    
    return this;

}


/**
 * Prototype
 * 
 * The public methods
 */
Insert.prototype = {
    
    getAffectedRows: function() { return this.affectedRows; }
    
};