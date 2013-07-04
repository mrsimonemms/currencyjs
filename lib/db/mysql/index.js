/**
 * MySQL
 * 
 * This is our MySQL class, which handles
 * MySQL connections.
 */
module.exports = MySQL;

/* Required modules */
var async = require('async');
var db = require('mysql');

var store = require('./store');

/**
 * Encapsulated methods
 * 
 * @param {object} objConfig
 */
function MySQL(objConfig) {
    
    var self = this;
    
    self._objConfig = objConfig || {};
    
    
    
    
    
    
    /**
     * Get DB
     * 
     * Gets a new reference to the database.
     * 
     * The isMigration setting can lead to SQL
     * injection attacks to must, under no
     * circumstances, be used for actual
     * production code.
     * 
     * @param {bool} isMigration
     * @returns {object}
     */
    self._getDb = function(isMigration) {
        
        if(isMigration !== true) { isMigration = false; }
        
        return new db.createConnection({
            host: self._objConfig.host,
            user: self._objConfig.user,
            password: self._objConfig.pass,
            database: self._objConfig.db,
            port: self._objConfig.port,
            multipleStatements: isMigration
        });
        
    };
    
    
    
    
    
    /**
     * Query
     * 
     * Makes a query to the database
     * 
     * @param {string} sql
     * @param {mixed} values
     * @param {function} cb
     * @returns {callback}
     */
    self._query = function(sql, values, cb) {
        
        /* Make the values optional */
        if(typeof values === 'function') {
            cb = values;
            values = null;
        }
        
        /* Get DB */
        var objDb = self._getDb();
        
        /* Connect to the database */
        objDb.connect(function(err) {
            
            /* Check for a connection error */
            if(err) { return cb(err, null); }
            
            if((values instanceof Array) === false) { values = [values]; }
            
            /* Perform the query */
            objDb.query(sql, values, function(err, result) {
                
                /* Close the connection */
                objDb.end();
                
                /* Check for a query error */
                if(err) { return cb(err, null); }
                
                return cb(null, result);

            });
            
        });
        
        
        
    };
    
    
    
    /**
     * Single
     * 
     * Same as query, but returns just
     * one row of results.
     * 
     * @param {string} sql
     * @param {mixed} values
     * @param {function} cb
     * @returns {callback}
     */
    self._single = function(sql, values, cb) {
        
        self._query(sql, values, function(err, result) {
            
            /* No need to wrap the error - just return */
            if(err) { return cb(err, null); }
            
            /* Something found - return first record */
            if(result !== null && result.length > 0) {
                return cb(null, result[0]);
            }
            
            /* Nothing returned */
            return cb(null, null);
            
        });
        
    };
    
    
    
    return self;
    
}




MySQL.prototype = {
    
    createTable: function(cb) {
        this._query(store.createTable(), cb);
    }
    
};