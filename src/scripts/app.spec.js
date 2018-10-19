describe('first test', function() {
    var expect;
    beforeEach(module('app'));
    beforeEach(function() {
        expect = chai.expect;
    });
    it('should run test successfully', function() {
        expect(true).to.be.true;
    });
});
