import { h } from "../src/index";

import { assert } from "chai";

describe("snabbdom", function () {
  it("can create vnode with children", function () {
    assert.strictEqual(h("div").sel, "div");
    assert.strictEqual(h("a").sel, "a");
  });
});
