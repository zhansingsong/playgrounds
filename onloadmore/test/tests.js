// var ce = require('../customEvents.js');
var ce = window.customevt;
// var should = chai.should();

describe('customEvents', function() {
    it('eventObject1', function(done) {
        ce.addEvent(window.document.body, 'eventObject1', function(e) {
            done();
        });
        var eventObj = ce.fireEvent(window.document.body, 'eventObject1', { detail: { foo: 'bar' }, cancelable: true });
        should.equal(eventObj.type, 'eventObject1');
        should.equal(eventObj.bubbles, false);
        should.equal(eventObj.cancelable, true);
        should.equal(eventObj.detail.foo, 'bar');
    })
    it('eventObject2', function(done) {
        ce.addEvent(window.document.body, 'eventObject2', function(e) {
            should.equal(e.type, 'eventObject2');
            should.equal(e.bubbles, true);
            should.equal(e.cancelable, false);
            should.equal(e.detail.foo, 'bar');
            done();
        });
        ce.fireEvent(window.document.body, 'eventObject2', { detail: { foo: 'bar' }, bubbles: true });
    })

    it('fireEvent', function(done) {
        ce.addEvent(window.document.body, 'fireEventTest', function(e) {
            should.equal(e.type, 'fireEventTest');
            done();
        });
        should.doesNotThrow(ce.fireEvent(window.document.body, 'fireEventTest'), "fireEvent fail");
    })

    it('addEvent', function(done) {
        var callback = function(e) {
            should.equal(e.type, 'addEventTest');
            done();
        }
        should(ce.addEvent(window.document.body, 'addEventTest', callback)).not.throw("addEventTest fail");
        ce.fireEvent(window.document.body, 'addEventTest');
    })
    it('removeEvent', function(done) {
        var callback = function(e) {
            should.equal(e.type, 'removeEventTest');
            should(ce.removeEvent(window.document.body, 'removeEventTest', callback)).not.throw("removeEvent fail");
            done();
        }
        ce.addEvent(window.document.body, 'removeEventTest', callback);
        ce.fireEvent(window.document.body, 'removeEventTest');
    })
});
