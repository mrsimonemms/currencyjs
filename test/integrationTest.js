/**
 * Integration Test
 * 
 * Tests that require a database connection
 * to work.
 * 
 * To run these tests locally:
 *  - copy TestConfig.travis.json to TestConfig.json
 *  - change the database connection info as appropriate
 *  - DO NOT COMMIT THIS FILE TO A PUBLIC REPOSITORY!!!
 * 
 * @author Simon Emms <simon@simonemms.com>
 */
var dateformat = require('dateformat');
var expect = require('chai').expect;

var CurrencyJS = require('../lib/CurrencyJS');
var Convert = require('../lib/model/Convert');
var Feed = require('../lib/model/Feed');

/* Fetch configuration */
var objConfig = require('./TestConfig');
var objDbConfig = objConfig.db || {};

/* DB config objects */
var objMongoDB = objDbConfig.mongodb || {};
var objMySQL = objDbConfig.mysql || {};
var objPGSQL = objDbConfig.postgresql || {};

/* Define dates used in this test */
var objNow = new Date(dateformat(new Date(), 'yyyy-mm-dd'));
var today = objNow.getDay();

/* How many days ago was most recent weekday (yesterday or before) */
var weekday = today <= 1 ? today + 2 : 1;
var objWeekday = new Date(objNow.getTime() - (weekday * 86400000));

/* How many days ago was most recent weekend (yesterday or before) */
var weekend = today === 0 ? 1 : today;
var objWeekend = new Date(objNow.getTime() - (weekend * 86400000));

var objWeekAgo = new Date(objWeekday.getTime() - (7 * 86400000));

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
    
    
    describe('currency conversion', function() {
        
        it('should convert same currency', function(done) {

            objCurrency.convert('USD', 'usd', function(err, objConvert) {
                
                expect(err).to.be.null;
                
                expect(objConvert).to.be.instanceof(Convert);
                expect(objConvert).to.have.property('objFrom');
                expect(objConvert.objFrom).to.be.instanceof(Feed);
                expect(objConvert).to.have.property('objTo');
                expect(objConvert.objTo).to.be.instanceof(Feed);
                expect(objConvert.objFrom.date).to.be.eql(objConvert.objTo.date);
                expect(objConvert).to.have.property('fromValue');
                expect(objConvert.fromValue).to.be.a('number');
                expect(objConvert).to.have.property('toValue');
                expect(objConvert.toValue).to.be.a('number');
                expect(objConvert).to.have.property('date');
                expect(objConvert.date).to.be.instanceof(Date);
                expect(objConvert).to.have.property('rate');
                expect(objConvert.rate).to.be.an('object');
                expect(objConvert).to.have.property('reverseRate');
                expect(objConvert.reverseRate).to.be.an('object');
                
                done();

            });

        });
        
        it('should convert where from is base', function(done) {

            objCurrency.convert('EUR', 'usd', function(err, objConvert) {
                
                expect(err).to.be.null;
                
                expect(objConvert).to.be.instanceof(Convert);
                expect(objConvert).to.have.property('objFrom');
                expect(objConvert.objFrom).to.be.instanceof(Feed);
                expect(objConvert).to.have.property('objTo');
                expect(objConvert.objTo).to.be.instanceof(Feed);
                expect(objConvert.objFrom.date).to.be.eql(objConvert.objTo.date);
                expect(objConvert).to.have.property('fromValue');
                expect(objConvert.fromValue).to.be.a('number');
                expect(objConvert).to.have.property('toValue');
                expect(objConvert.toValue).to.be.a('number');
                expect(objConvert).to.have.property('date');
                expect(objConvert.date).to.be.instanceof(Date);
                expect(objConvert).to.have.property('rate');
                expect(objConvert.rate).to.be.an('object');
                expect(objConvert).to.have.property('reverseRate');
                expect(objConvert.reverseRate).to.be.an('object');
                
                done();

            });

        });
        
        it('should convert where to is base', function(done) {

            objCurrency.convert('USD', 'eur', function(err, objConvert) {
                
                expect(err).to.be.null;
                
                expect(objConvert).to.be.instanceof(Convert);
                expect(objConvert).to.have.property('objFrom');
                expect(objConvert.objFrom).to.be.instanceof(Feed);
                expect(objConvert).to.have.property('objTo');
                expect(objConvert.objTo).to.be.instanceof(Feed);
                expect(objConvert.objFrom.date).to.be.eql(objConvert.objTo.date);
                expect(objConvert).to.have.property('fromValue');
                expect(objConvert.fromValue).to.be.a('number');
                expect(objConvert).to.have.property('toValue');
                expect(objConvert.toValue).to.be.a('number');
                expect(objConvert).to.have.property('date');
                expect(objConvert.date).to.be.instanceof(Date);
                expect(objConvert).to.have.property('rate');
                expect(objConvert.rate).to.be.an('object');
                expect(objConvert).to.have.property('reverseRate');
                expect(objConvert.reverseRate).to.be.an('object');
                
                done();

            });

        });
        
        it('should receive options with weekday', function(done) {
            
            var objOptions = {
                date: objWeekday,
                value: 6.32
            };

            objCurrency.convert('usd', 'GBP', objOptions, function(err, objConvert) {
                
                expect(err).to.be.null;
                
                expect(objConvert).to.be.instanceof(Convert);
                expect(objConvert).to.have.property('objFrom');
                expect(objConvert.objFrom).to.be.instanceof(Feed);
                expect(objConvert).to.have.property('objTo');
                expect(objConvert.objTo).to.be.instanceof(Feed);
                expect(objConvert.objFrom.date).to.be.eql(objConvert.objTo.date);
                expect(objConvert).to.have.property('fromValue');
                expect(objConvert.fromValue).to.be.a('number').to.be.eql(6.32);
                expect(objConvert).to.have.property('toValue');
                expect(objConvert.toValue).to.be.a('number');
                expect(objConvert).to.have.property('date');
                expect(objConvert.date).to.be.instanceof(Date);
                expect(dateformat(objConvert.date, 'yyyy-mm-dd')).to.be.eql(dateformat(objWeekday, 'yyyy-mm-dd'));
                expect(objConvert).to.have.property('rate');
                expect(objConvert.rate).to.be.an('object');
                expect(objConvert).to.have.property('reverseRate');
                expect(objConvert.reverseRate).to.be.an('object');
                
                done();

            });

        });
        
        it('should receive options with weekend day', function(done) {
            
            var objOptions = {
                date: objWeekend,
                value: 12.00
            };

            objCurrency.convert('usd', 'GBP', objOptions, function(err, objConvert) {
                
                expect(err).to.be.null;
                
                expect(objConvert).to.be.instanceof(Convert);
                expect(objConvert).to.have.property('objFrom');
                expect(objConvert.objFrom).to.be.instanceof(Feed);
                expect(objConvert).to.have.property('objTo');
                expect(objConvert.objTo).to.be.instanceof(Feed);
                expect(objConvert.objFrom.date).to.be.eql(objConvert.objTo.date);
                expect(objConvert).to.have.property('fromValue');
                expect(objConvert.fromValue).to.be.a('number').to.be.eql(12);
                expect(objConvert).to.have.property('toValue');
                expect(objConvert.toValue).to.be.a('number');
                expect(objConvert).to.have.property('date');
                expect(objConvert.date).to.be.instanceof(Date);
                expect(dateformat(objConvert.date, 'yyyy-mm-dd'));
                expect(objConvert).to.have.property('rate');
                expect(objConvert.rate).to.be.an('object');
                expect(objConvert).to.have.property('reverseRate');
                expect(objConvert.reverseRate).to.be.an('object');
                
                /**
                 * For weekend dates, it gets the last possible
                 * weekday. This may not be a Friday - eg, Good
                 * Friday is a holiday.  Set allowable range to
                 * be one week
                 */
                var validDate = objConvert.date >= objWeekAgo && objConvert.date <= objNow;
                
                expect(validDate).to.be.true;
                
                done();

            });

        });
        
    });
        
    describe('error handling', function() {

        it('should handle From Currency error', function(done) {

            objCurrency.convert('fail', 'GBP', function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid "from" currency');

                expect(objConvert).to.be.null;

                done();

            });

        });

        it('should handle To Currency error', function(done) {

            objCurrency.convert('USD', 'fail', function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid "to" currency');

                expect(objConvert).to.be.null;

                done();

            });

        });

        it('should handle From Currency error with to as Base Currency', function(done) {

            objCurrency.convert('fail', 'EUR', function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid "from" currency');

                expect(objConvert).to.be.null;

                done();

            });

        });

        it('should handle To Currency error with from as Base Currency', function(done) {

            objCurrency.convert('EUR', 'fail', function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid "to" currency');

                expect(objConvert).to.be.null;

                done();

            });

        });

        it('should handle date errors', function(done) {

            objCurrency.convert('gbp', 'GBP', {date: 'invalid date'}, function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid date given - must be a date object');

                expect(objConvert).to.be.null;

                done();

            });

        });

        it('should handle value errors', function(done) {

            objCurrency.convert('eur', 'eur', {value: 'invalid value'}, function(err, objConvert) {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.eql('Invalid value given - must be a number');

                expect(objConvert).to.be.null;

                done();

            });

        });

    });
    
});