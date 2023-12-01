'use strict';

describe('QUnit test page', () => {
  it('should pass QUnit tests', async () => {
    const url = 'http://localhost:8080/test-resources/openui5/smartmockserver/unit/unitTests.html';
    await browser.url(url);
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();

    const coverage = await browser.getCoverageReport();
    expect(coverage?.statements.pct).toBeGreaterThan(80);
  });
});
