var expect = require('chai').expect;
var AdminReporter = require('../utils/adminReporter');

describe('AdminReporter setup', function(){
  var reporter = new AdminReporter();
  it('should have dataExport', function(){
    expect(reporter.dataExport).to.be.an('array');
  });
  it('should have dataStore', function(){
    expect(reporter.dataStore).to.be.an('object');
  });
});

describe('AdminReporter.register', function(){
  var reporter = new AdminReporter();
  var testVal = 0;
  var testWatcher = function(){
    return testVal;
  };
  var testKey = 'test';
  it('should have AdminReporter.register method', function(){
    expect(reporter).to.respondTo('register');
  });

  reporter.register(testKey, testWatcher);

  it('should set initial value immediately', function(){
    expect(reporter.dataStore[testKey].data.value).to.equal(testVal);
  });

  it('should link dataExport and dataStore', function(){
    expect(reporter.dataStore[testKey].data).to.equal(reporter.dataExport[0]);
  });

  it('should set watcher function', function(){
    expect(reporter.dataStore[testKey].watcher).to.equal(testWatcher);
  })
});

describe('AdminReporter.update', function(){
  var reporter = new AdminReporter();
  var testVal = 0;
  var testWatcher = function(){
    return testVal;
  };
  var testKey = 'test';
  reporter.register(testKey, testWatcher);

  it('should return current value', function(){
    expect(reporter.update()[0].value).to.equal(testVal);
  });

  it('should return latest value after value has changed', function(){
    testVal = 2;
    expect(reporter.update()[0].value).to.equal(2);
  });
});
