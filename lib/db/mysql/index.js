/**
 * MySQL
 *
 * This is our MySQL class, which handles
 * MySQL connections.
 */
module.exports = MySQL;

/* Required modules */
var async = require('async');
var _ = require('underscore');
var db = require('mysql');

var arrayUtils = require('../../helpers/arrayutils');
var Insert = require('../../model/Insert');
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
     * @returns {object}
     */
    self._getDb = function() {

        return new db.createConnection({
            host: self._objConfig.host,
            user: self._objConfig.user,
            password: self._objConfig.pass,
            database: self._objConfig.db,
            port: self._objConfig.port
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
    },

    currencyIsPresent: function(currency, base, date, cb) {
        this._single(store.currencyIsPresent(), [currency, base, date], function(err, result) {

            if(err) { return cb(err, null); }

            if(result === null) {
                return cb(null, false);
            }

            return cb(null, true);

        });
    },

    getAllCurrencies: function(cb) {
        this._query(store.getAllCurrencies(), function(err, result) {
            if(err) {
                return cb(err, null);
            }

            var out = [];
            if(result instanceof Array) {
                result.forEach(function(model) {
                    var currency = _.values(model);

                    out = out.concat(currency);
                });
            }

            return cb(null, out);
        });
    },

    getMaxDate: function(date, currency, cb) {

        this._single(store.getMaxDate(), [date, currency], function(err, result) {

            if(err) { return cb(err, null); }

            return cb(null, result);

        });

    },

    insertData: function(arrInput, cb) {
        /* Push data array to simple arrays, so we can use batch stuff */
        var arrData = [];

        /* Get the object's values */
        arrInput.forEach(function(input) {
            arrData.push(arrayUtils.objectValues(input));
        });

        /* Check if something to do */
        if(arrData.length === 0) {
            /* Nothing to do - return empty insert object */
            return cb(null, new Insert());
        }

        /* Bulk insert - make sure it's sent as an array */
        this._query(store.insertData(), [arrData], function(err, data) {

            if(err) { return cb(err, null); }

            /* Push to the Insert model and output */
            return cb(null, new Insert(data));

        });
    }

};