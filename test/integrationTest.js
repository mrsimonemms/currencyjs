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

/* Fetch configuration */
var objConfig = require('./TestConfig');
var objDbConfig = objConfig.db || {};

/* DB config objects */
var objMySQL = objDbConfig.mysql || {};
var objPGSQL = objDbConfig.postgresql || {};

describe('Tests on MySQL', function() {
    
    var objDb = {
        type: 'mysql',
        host: objMySQL.host || null,
        user: objMySQL.username || null,
        pass: objMySQL.password || null,
        db: objMySQL.db || null,
        port: objMySQL.port || null
    };
    
    it('should correctly build the data table', function(done) {
        
        var objCurrency = new CurrencyJS(objDb);
        
        objCurrency.createTable(function(err, result) {
            
            expect(err).to.be.eql(null);
            expect(result).to.be.eql(true);
            
            done();
            
        });
        
    });
    
    it('should correctly input the currency info from source', function(done) {
        
        /* Set timeout for 30 seconds */
        this.timeout(30000);
        
        var objCurrency = new CurrencyJS(objDb);
        
        objCurrency.import(function(err, result) {
            
            expect(err).to.be.eql(null);
            
            expect(result).to.be.a('number');
            expect(result).to.be.at.least(0);
            
            done();
            
        });
        
    });
    
});