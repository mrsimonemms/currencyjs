/**
 * CurrencyJS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2013 Simon Emms <simon@simonemms.com>
 */
module.exports = CurrencyJS;

var async = require('async');
var dateformat = require('dateformat');
var fs = require('fs');
var http = require('http');
var request = require('request');
var xml2js = require('xml2js');

var Convert = require('./model/Convert');
var DataUtils = require('./helpers/datautils');
var DB = require('./db');
var Feed = require('./model/Feed');

/* Set base currency - ECB, unsurprisingly, uses the Euro */
var baseCurrency = 'EUR';

/* Configure the feed URL - use last 90 day version */
var feed = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

function CurrencyJS(objDb) {

    var self = this;

    /* Create the database object */
    if(objDb) { self._objDb = new DB(objDb); }
    else { self._objDb = {}; }



    self._fetchCurrencyData = function(objInput, cb) {

        /* Instantiate the variables */
        var objFrom;
        var objTo;

        /* Used for the DB queries */
        var isoDate = dateformat(objInput.date, 'yyyy-mm-dd');

        if(objInput.from === objInput.to) {

            /* Same currency - no DB call needed */
            objFrom = new Feed({
                currency: objInput.from,
                base: objInput.from,
                date: objInput.date
            });

            objTo = new Feed({
                currency: objInput.to,
                base: objInput.to,
                date: objInput.date
            });

            /* Return the model */
            return cb(null, {
                from: objFrom,
                to: objTo
            });

        } else if(objInput.from === baseCurrency || objInput.to === baseCurrency) {

            /* Different - but one is the base currency */

            if(objInput.from === baseCurrency) {

                /* "From" is the base currency */
                this._objDb.getMaxDate(isoDate, objInput.to, function(err, result) {

                    if(err) { return cb(err, null); }

                    if(result === null) { return cb(new Error('Invalid "to" currency'), null); }

                    /* Shove into a model */
                    objTo = Feed.toModel(result);

                    objFrom = new Feed({
                        currency: objInput.from,
                        base: baseCurrency,
                        date: objTo.getDate()
                    });

                    /* Return the model */
                    return cb(null, {
                        from: objFrom,
                        to: objTo
                    });

                });

            } else {

                /* It's the "to" currency */
                this._objDb.getMaxDate(isoDate, objInput.from, function(err, result) {

                    if(err) { return cb(err, null); }

                    if(result === null) { return cb(new Error('Invalid "from" currency'), null); }

                    /* Shove into a model */
                    objFrom = Feed.toModel(result);

                    objTo = new Feed({
                        currency: objInput.to,
                        base: baseCurrency,
                        date: objFrom.getDate()
                    });

                    /* Return the model */
                    return cb(null, {
                        from: objFrom,
                        to: objTo
                    });

                });

            }

        } else {

            /* Two different currencies that need querying - need to get data from same date */
            var isValid = false;

            async.doWhilst(
                function(callback) {

                    async.waterfall([
                        function(callback2) {

                            /* Get From info */
                            self._objDb.getMaxDate(isoDate, objInput.from, function(err, result) {

                                if(err) { return callback2(err, null); }

                                if(result === null) { return cb(new Error('Invalid "from" currency'), null); }

                                objFrom = Feed.toModel(result);

                                return callback2(null);

                            });

                        },
                        function(callback2) {

                            /* Get To info */
                            self._objDb.getMaxDate(isoDate, objInput.to, function(err, result) {

                                if(err) { return callback2(err, null); }

                                if(result === null) { return cb(new Error('Invalid "to" currency'), null); }

                                objTo = Feed.toModel(result);

                                return callback2(null);

                            });

                        }
                    ], function(err) {

                        if(err) { return callback(err, null); }

                        /* Make sure the latest dates match */
                        isValid = objFrom.getFormattedDate() === objTo.getFormattedDate();

                        if(isValid === false) {
                            /* Dates don't match - go back 1 day */
                            isoDate = dateformat(new Date(new Date(isoDate).getTime() - 86400000), 'yyyy-mm-dd');
                        }

                        return callback(null);

                    });

                },
                function() {

                    /* Continue until the dates match */
                    return isValid === false;

                },
                function(err) {

                    /* We should now have two matching dates */
                    if(err) { return cb(err, null); }

                    /* Return the model */
                    return cb(null, {
                        from: objFrom,
                        to: objTo
                    });

                }
            );
        }

    };



    /**
     * Fetch Data Feed
     *
     * Fetch the data feed from the XML source and
     * return as a collection of models
     *
     * @param {function} cb
     * @returns {callback}
     */
    self._fetchDataFeed = function(cb) {

        /* Download the XML from the web */
        async.waterfall([
            function(callback) {

                /* Get the XML from the URL */
                request(feed, function(err, response, body) {

                    if(err) { return callback(err, null); }

                    if(response.statusCode !== 200) { return callback(new Error('Feed not found', null)); }

                    return callback(null, body);

                });

            },
            function(strData, callback) {

                /* Convert the string to XML */
                var parser = new xml2js.Parser();
                parser.parseString(strData, callback);

            },
            function(objXML, callback) {

                /* Push the XML into an array of models */
                var arrFeed;
                try {
                    arrFeed = Feed.parseModelsFromXML(objXML);
                } catch(err) {
                    return callback(err, null);
                }

                return callback(null, arrFeed);

            }
        ], function(err, arrFeed) {

            /* Check for error */
            if(err) { return cb(err, null); }

            return cb(null, arrFeed);

        });

    };



    return self;

}

CurrencyJS.prototype = {


    convert: function(from, to, options, cb) {

        var self = this;

        var objOptions = options || {};

        if(typeof objOptions === 'function') {
            cb = options;
            objOptions = {};
        }

        /* Push to upper case */
        from = String(from).toUpperCase();
        to = String(to).toUpperCase();

        /* Options */
        var value = objOptions.value || 1;
        var objDate = objOptions.date || new Date();

        if(typeof value !== 'number') {
            return cb(new Error('Invalid value given - must be a number'), null);
        }

        if((objDate instanceof Date) === false) {
            return cb(new Error('Invalid date given - must be a date object'), null);
        }

        /* Push to an object model */
        var objInput = {
            from: from,
            to: to,
            value: value,
            date: objDate
        };

        /* Get the currency data */
        self._fetchCurrencyData(objInput, function(err, objData) {

            /* There's an error */
            if(err) { return cb(err, null); }

            return cb(null, new Convert(objData.from, objData.to, value));

        });

    },


    /**
     * Create Table
     *
     * Creates the data table in the DB
     *
     * @param {function} cb
     * @returns {callback}
     */
    createTable: function(cb) {

        this._objDb.createTable(function(err, result) {

            if(err) { return cb(err, null); }

            /* If no error, it must be true */
            return cb(null, true);

        });

    },



    /**
     * Get All Currencies
     *
     * Gets a list of all the currencies that we have
     * in our database
     * 
     * @param {function} cb
     * @returns {callback}
     */
    getAllCurrencies: function(cb) {

        this._objDb.getAllCurrencies(cb);

    },



    /**
     * Import
     *
     * Imports new data from the feed and parses
     * it into our database.
     *
     * This should be run from a CronJob and done
     * once per weekday
     *
     * @param {function} cb
     * @returns {callback}
     */
    import: function(cb) {

        var self = this;

        /* Fetch the data from European Central Bank XML feed */
        self._fetchDataFeed(function(err, arrFeed) {

            if(err) { return cb(err, null); }

            var arrData = [];

            async.eachSeries(arrFeed, function(objFeed, callback) {
                /* Check if we need to add this currency to the table */

                var objData = Feed.toData(objFeed);

                self._objDb.currencyIsPresent(objData.currency, objData.base, objData.date, function(err, exists) {

                    /* Ignore errors - just go to next one */
                    if(err) { exists = false; }

                    if(exists === false) { arrData.push(objData); }

                    return callback(null);

                });
            }, function(err) {

                /* We will never receive errors here */
                if(err) { }

                self._objDb.insertData(arrData, function(err, objInsert) {

                    if(err) { return cb(err, null); }

                    /* Return number of elements added */
                    return cb(null, objInsert.getAffectedRows());

                });

            });

        });

    }

};