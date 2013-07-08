/**
 * Integration Test
 * 
 * Tests that require a database connection
 * to work
 * 
 * @author Simon Emms <simon@simonemms.com>
 */
var expect = require('chai').expect;

var CurrencyJS = require('../lib/CurrencyJS');
var Convert = require('../lib/model/Convert');

/* Fetch configuration */
var objConfig = require('./TestConfig');
var objDbConfig = objConfig.db || {};

/* DB config objects */
var objMongoDB = objDbConfig.mongodb || {};
var objMySQL = objDbConfig.mysql || {};
var objPGSQL = objDbConfig.postgresql || {};

/* Define dates used in this test */
var objNow = new Date();
var today = objNow.getDay();

/* How many days ago was most recent weekday (yesterday or before) */
var weekday = today <= 1 ? today + 2 : 1;
var objWeekday = new Date(objNow.getTime() - (weekday * 86400000));

/* How many days ago was most recent weekend (yesterday or before) */
var weekend = today === 0 ? 1 : today;
var objWeekend = new Date(objNow.getTime() - (weekend * 86400000));

/* Declare currency object */
var objCurrency;

describe('Tests on MySQL', function() {
    
    var objDb = {
        type: 'mysql',
        host: objMySQL.host || null,
        user: objMySQL.username || null,
        pass: objMySQL.password || null,
        db: objMySQL.db || null,
        port: objMySQL.port || null
    };
    
    /* Create instance with MySQL */
    objCurrency = new CurrencyJS(objDb);
    
    describe('building the instance', function() {
        
        it('should correctly build the data table', function(done) {

            objCurrency.createTable(function(err, result) {

                expect(err).to.be.null;
                expect(result).to.be.eql(true);

                done();

            });

        });

        it('should correctly input the currency info from source', function(done) {

            /* Set timeout for 30 seconds */
            this.timeout(30000);

            objCurrency.import(function(err, importCount) {

                expect(err).to.be.null;

                expect(importCount).to.be.a('number');
                expect(importCount).to.be.at.least(0);

                done();

            });
        
        });
    
    });
    
    /*
    describe('converting currencies', function() {
        
        it('should convert different currencies at current rate', function(done) {

            objCurrency.convert('USD', 'EUR', function(err, objOut) {

                done();

            });

        });

        it('should throw errors when not set up correctly', function(done) {

            objCurrency.convert('currency', 'rubbish', function(err, objOut) {

                done();

            });

        });
        
    });*/
    
});