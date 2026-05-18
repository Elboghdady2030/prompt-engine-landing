const test = require("node:test");
const assert = require("node:assert/strict");

function clampHealth(value) {
  return Math.max(0, Math.min(100, value));
}

test("health values stay within dashboard range", () => {
  assert.equal(clampHealth(122), 100);
  assert.equal(clampHealth(-12), 0);
  assert.equal(clampHealth(67), 67);
});
