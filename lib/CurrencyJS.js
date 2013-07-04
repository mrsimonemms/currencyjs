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
var xml2js = require('xml2js');

var DB = require('./db');
var Feed = require('./model/Feed');

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
                fs.readFile(__dirname + '/../eurofxref-hist-90d.xml', 'utf8', callback);
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

            return cb(null, true);

            /*this._objDb.importData(function(err, result) {

                if(err) { return cb(err, null); }

                console.log(result);

                return cb(null, true);

            });*/
        
        });
        
    }
    
};