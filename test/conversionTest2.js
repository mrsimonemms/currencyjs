/**
 * Conversion Test
 * 
 * Performs tests to validate the
 * mathematics work
 * 
 * @author Simon Emms <simon@simonemms.com>
 */
var expect = require('chai').expect;

var Convert = require('../lib/model/Convert');
var Feed = require('../lib/model/Feed');

var objConvert;

describe('Convert between currencies', function() {
    
    
    it('should convert values where one is base currency', function(done) {
        
        /* Create the from object */
        var objFrom = new Feed({
            currency: 'GBP',
            base: 'EUR',
            rate: 1.16
        });
        
        /* Create the to object */
        var objTo = new Feed({
            currency: 'EUR'
        });
        
        objConvert = new Convert(objFrom, objTo, 22);
        
        expect(objConvert).to.be.instanceof(Convert);
        expect(objConvert.getToFormatted()).to.be.eql('25.52');
        expect(objConvert.getFromFormatted()).to.be.eql('22.00');
        
        /* Calculate another value */
        objConvert.calculate(6.96);
        expect(objConvert.getToFormatted()).to.be.eql('8.07');
        expect(objConvert.getToValue()).to.be.eql(8.0736);
        expect(objConvert.getFromFormatted()).to.be.eql('6.96');
        expect(objConvert.getFromValue()).to.be.eql(6.96);
        
        /* Calculate a reverse value */
        objConvert.calculateReverse(8.076);
        expect(objConvert.getToFormatted()).to.be.eql('8.08');
        expect(objConvert.getFromFormatted()).to.be.eql('6.96');
        
        done();
        
    });
    
    
});