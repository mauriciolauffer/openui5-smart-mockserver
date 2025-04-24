'use strict';

window.suite = function() {
  const testSuite = new parent.jsUnitTestSuite();
  const contextPath = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
  testSuite.addTestPage(contextPath + 'unit/unitTests.html');
  return testSuite;
};
