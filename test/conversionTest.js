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


    it('should convert where both are base currency', function(done) {

        /* Create the from object */
        var objFrom = new Feed({
            currency: 'EUR'
        });

        /* Create the to object */
        var objTo = new Feed({
            currency: 'EUR'
        });

        objConvert = new Convert(objFrom, objTo, 10.56);

        expect(objConvert).to.be.instanceof(Convert);
        expect(objConvert.getToValue()).to.be.eql(10.56);
        expect(objConvert.getToFormatted()).to.be.eql('10.56');
        expect(objConvert.getFromValue()).to.be.eql(10.56);
        expect(objConvert.getFromFormatted()).to.be.eql('10.56');

        /* Calculate another value */
        objConvert.calculate(26);
        expect(objConvert.getToValue()).to.be.eql(26);
        expect(objConvert.getToFormatted()).to.be.eql('26.00');
        expect(objConvert.getFromValue()).to.be.eql(26);
        expect(objConvert.getFromFormatted()).to.be.eql('26.00');

        /* Calculate a reverse value */
        objConvert.calculateReverse(357890.994578);
        expect(objConvert.getToValue()).to.be.eql(357890.994578);
        expect(objConvert.getToFormatted()).to.be.eql('357,890.99');
        expect(objConvert.getFromValue()).to.be.eql(357890.994578);
        expect(objConvert.getFromFormatted()).to.be.eql('357,890.99');

        done();

    });


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
        expect(objConvert.getToValue()).to.be.eql(25.52);
        expect(objConvert.getToFormatted()).to.be.eql('25.52');
        expect(objConvert.getFromValue()).to.be.eql(22);
        expect(objConvert.getFromFormatted()).to.be.eql('22.00');

        /* Calculate another value */
        objConvert.calculate(6.96);
        expect(objConvert.getToValue()).to.be.eql(8.0736);
        expect(objConvert.getToFormatted()).to.be.eql('8.07');
        expect(objConvert.getFromValue()).to.be.eql(6.96);
        expect(objConvert.getFromFormatted()).to.be.eql('6.96');

        /* Calculate a reverse value */
        objConvert.calculateReverse(8.0736);
        expect(objConvert.getToValue()).to.be.eql(8.0736);
        expect(objConvert.getToFormatted()).to.be.eql('8.07');
        expect(objConvert.getFromValue()).to.be.eql(6.96);
        expect(objConvert.getFromFormatted()).to.be.eql('6.96');

        done();

    });


    it('should convert values where neither is base currency', function(done) {

        /* Create the from object */
        var objFrom = new Feed({
            currency: 'GBP',
            base: 'EUR',
            rate: 1.16
        });

        /* Create the to object */
        var objTo = new Feed({
            currency: 'USD',
            base: 'EUR',
            rate: 0.78
        });

        objConvert = new Convert(objFrom, objTo, 10);

        expect(objConvert).to.be.instanceof(Convert);
        expect(objConvert.getToValue()).to.be.eql(14.871794871794872);
        expect(objConvert.getToFormatted()).to.be.eql('14.87');
        expect(objConvert.getFromValue()).to.be.eql(10);
        expect(objConvert.getFromFormatted()).to.be.eql('10.00');

        /* Calculate another value */
        objConvert.calculate(26);
        expect(objConvert.getToValue()).to.be.eql(38.666666666666664);
        expect(objConvert.getToFormatted()).to.be.eql('38.67');
        expect(objConvert.getFromValue()).to.be.eql(26);
        expect(objConvert.getFromFormatted()).to.be.eql('26.00');

        /* Calculate a reverse value */
        objConvert.calculateReverse(38.6666666666666); /* Limitation of the dependency - can only accept max. 15 digits */
        expect(objConvert.getToValue()).to.be.eql(38.6666666666666);
        expect(objConvert.getToFormatted()).to.be.eql('38.67');
        expect(objConvert.getFromValue()).to.be.eql(25.999999999999954);
        expect(objConvert.getFromFormatted()).to.be.eql('26.00');

        done();

    });


    it('should convert values where both are same currency and non-base', function(done) {

        /* Create the from object */
        var objFrom = new Feed({
            currency: 'GBP',
            base: 'EUR',
            rate: 1.16
        });

        /* Create the to object */
        var objTo = new Feed({
            currency: 'GBP',
            base: 'EUR',
            rate: 1.16
        });

        objConvert = new Convert(objFrom, objTo, 268.45);

        expect(objConvert).to.be.instanceof(Convert);
        expect(objConvert.getToValue()).to.be.eql(268.45);
        expect(objConvert.getToFormatted()).to.be.eql('268.45');
        expect(objConvert.getFromValue()).to.be.eql(268.45);
        expect(objConvert.getFromFormatted()).to.be.eql('268.45');

        /* Calculate another value */
        objConvert.calculate(4578.45);
        expect(objConvert.getToValue()).to.be.eql(4578.45);
        expect(objConvert.getToFormatted()).to.be.eql('4,578.45');
        expect(objConvert.getFromValue()).to.be.eql(4578.45);
        expect(objConvert.getFromFormatted()).to.be.eql('4,578.45');

        /* Calculate a reverse value */
        objConvert.calculateReverse(5247);
        expect(objConvert.getToValue()).to.be.eql(5247);
        expect(objConvert.getToFormatted()).to.be.eql('5,247.00');
        expect(objConvert.getFromValue()).to.be.eql(5247);
        expect(objConvert.getFromFormatted()).to.be.eql('5,247.00');

        done();

    });


});