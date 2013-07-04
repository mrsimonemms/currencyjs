/**
 * Array Helper Test
 * 
 * Run these tests using Mocha framework. Eg..
 *  mocha datautilsTest.js
 * 
 * Mocha runs best when install as a global dependency.
 * 
 * @link http://visionmedia.github.io/mocha/
 * @author Simon Emms <simon@simonemms.com>
 */
var expect = require('chai').expect;

var ArrayUtils = require("../lib/helpers").arrayutils;

describe('Executing the arrayutils', function() {
    
    it('should correctly handle inArray', function(done) {
        
        /* True */
        expect(ArrayUtils.inArray('foo', ['foo'])).to.be.eql(true);
        expect(ArrayUtils.inArray('foo', ['foo', 'bar'])).to.be.eql(true);
        expect(ArrayUtils.inArray('foo', ['bar', 'foo'])).to.be.eql(true);
        expect(ArrayUtils.inArray(2, [2, 3])).to.be.eql(true);
        expect(ArrayUtils.inArray(true, [true, false])).to.be.eql(true);
        expect(ArrayUtils.inArray(null, [true, false, null])).to.be.eql(true);
        
        /* False */
        expect(ArrayUtils.inArray('foo', [])).to.be.eql(false);
        expect(ArrayUtils.inArray('foo', ['foo1', 'fo', 'bar'])).to.be.eql(false);
        expect(ArrayUtils.inArray('foo', null)).to.be.eql(false);
        expect(ArrayUtils.inArray('foo', {})).to.be.eql(false);
        expect(ArrayUtils.inArray(2, [1, 3])).to.be.eql(false);
        expect(ArrayUtils.inArray(2, ['1', '2', '3'])).to.be.eql(false);
        
        done();
        
    });
    
});