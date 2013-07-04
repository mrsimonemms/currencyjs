/**
 * DB
 * 
 * This is our database class, which
 * connects to the databases and looks
 * after our queries.
 */
module.exports = DB;

var DataUtils = require('../helpers').datautils;

/**
 * Encapsulated methods
 * 
 * @param {object} objConfig
 */
function DB(objConfig) {
    
    var self = this;
    
    /**
     * Get Config
     * 
     * Gets the config item
     * 
     * @param {string} key
     * @returns {mixed}
     */
    self.getConfig = function(key) {
        return self._objConfig[key];
    };
    
    
    /* Set our DB settings */
    self._objConfig = {
        type: DataUtils.setString(objConfig.type, 'mysql').toLowerCase(), /* DB type - default to MySQL */
        host: DataUtils.setString(objConfig.host, 'localhost'), /* Host */
        user: DataUtils.setString(objConfig.user, null), /* Username */
        pass: DataUtils.setString(objConfig.pass, null), /* Password */
        db: DataUtils.setString(objConfig.db, null), /* DB name - required */
        port: DataUtils.setInt(objConfig.port, null) /* Port - null will go to default */
    };
    
    /* Check the DB name is set */
    if(self.getConfig('db') === null) {
        throw new Error('DB_NOT_SET');
    }
    
    /* Check the DB type is possible */
    var db = null;
    try {
        db = require('./' + self.getConfig('type'));
    } catch(err) {
        /* Invalid DB - throw error */
        throw new Error('INVALID_DB_TYPE');
    }
    
    /* Instantiate the DB connection - will throw error if fails */
    self._objDb = new db(self._objConfig);
    
    return self;
    
}



/**
 * Public methods
 * 
 * In the absence of PHP-style magic methods,
 * we have to put each DB call we want to make
 * in here.
 * 
 * These should call the helper method _toDb().
 */
DB.prototype = {
    
    /**
     * Create Table
     * 
     * Creates the database table
     * 
     * @param {function} cb
     * @returns {callback}
     */
    createTable: function(cb) {
        this._objDb.createTable(cb);
    }
    
};