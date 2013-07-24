/**
 * Mongo
 * 
 * This is our Mongo class, which handles
 * Mongo connections.
 */
module.exports = Mongo;

/* Required modules */
var async = require('async');
var db = require('mongodb').MongoClient;

var arrayUtils = require('../../helpers/arrayutils');
var Insert = require('../../model/Insert');

/**
 * Encapsulated methods
 * 
 * @param {object} objConfig
 */
function Mongo(objConfig) {
    
    var self = this;
    
    self._objConfig = objConfig || {};
    
    
    
    
    
    
    /**
     * Get DB
     * 
     * Gets a new reference to the database.
     * 
     * @param {function} cb
     * @returns {callback}
     */
    self._getDb = function(cb) {
        
        /* Build the connection string */
        var string = 'mongodb://';
        
        /* Username/password */
        if(self._objConfig.user !== null) {
            string += self._objConfig.user;
            string += ':';
            string += self._objConfig.pass;
            string += '@';
        }
        
        /* Host */
        string += self._objConfig.host;
        
        /* Port */
        if(self._objConfig.port !== null) {
            string += ':';
            string += self._objConfig.port;
        }
        
        /* Database */
        string += '/';
        string += self._objConfig.db;
        
        /* Connect and return */
        db.connect(string, cb);
        
    };
    
    return self;
    
}




Mongo.prototype = {
    
    createTable: function(cb) {
        /* We don't create tables in Mongo */
        return cb(null, null);
    },
    
    currencyIsPresent: function(currency, base, date, cb) {
        
        var self = this;
        
        self._getDb(function(err, objDb) {
            
            if(err) { return cb(err, null); }
            
            objDb.collection('currencyjs').find({currency: currency, base: base, date: date}).toArray(function(err, result) {
                
                /* Close the connection */
                objDb.close();
                
                if(err) { return cb(err, null); }
                
                return cb(null, result.length > 0);
                
            });
            
        });
        
    },
    
    getMaxDate: function(date, currency, cb) {
        
        var self = this;
        
        self._getDb(function(err, objDb) {
            
            if(err) { return cb(err, null); }
            
            objDb.collection('currencyjs').findOne({currency: currency, date: {$lte: date}}, function(err, result) {
                
                /* Close the connection */
                objDb.close();
                
                if(err) { return cb(err, null); }
                
                return cb(null, result);
                
            });
            
        });
    
    },
    
    insertData: function(arrData, cb) {
        
        var self = this;
        
        /* Check if something to do */
        if(arrData.length === 0) {
            /* Nothing to do - return empty insert object */
            return cb(null, new Insert());
        }
        
        self._getDb(function(err, objDb) {
            
            if(err) { return cb(err, null); }
            
            objDb.collection('currencyjs').insert(arrData, {w: 1}, function(err, result) {
                
                /* Close the connection */
                objDb.close();
                
                if(err) { return cb(err, null); }
                
                return cb(null, new Insert({
                    affectedRows: result.length
                }));
                
            });
            
        });
        
    }
    
};