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
var fs = require('fs');
var http = require('http');
var request = require('request');
var xml2js = require('xml2js');

var DB = require('./db');
var Feed = require('./model/Feed');

/* Configure the feed URL - use last 90 day version */
var feed = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';

function CurrencyJS(objDb) {
    
    var self = this;
    
    /* Create the database object */
    if(objDb) { self._objDb = new DB(objDb); }
    else { self._objDb = {}; }
    
    
    
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
        
        /**
         * Download the XML from the web
         * 
         * @todo
         */
        
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