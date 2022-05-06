import { h } from "../src/index";

import { assert } from "chai";

describe("snabbdom", function () {
  it("can create vnode with proper tag", function () {
    assert.strictEqual(h("div").sel, "div");
    assert.strictEqual(h("a").sel, "a");
  });
  it("can create vnode with children", function () {
    const vnode = h("div", [h("span#hello"), h("b.world")]);
    assert.strictEqual(vnode.sel, "div");
    const { children } = vnode;
    assert.strictEqual(children[0].sel, "span#hello");
    assert.strictEqual(children[1].sel, "b.world");
  });
  it("can create vnode with one child vnode", function () {
    const vnode = h("div", h("span#hello"));
    assert.strictEqual(vnode.sel, "div");
    const { children } = vnode;
    assert.strictEqual(children[0].sel, "span#hello");
  });
  it("can create vnode with props and one child vnode", function () {
    const vnode = h("div", {}, h("span#hello"));
    assert.strictEqual(vnode.sel, "div");
    const { children } = vnode;
    assert.strictEqual(children[0].sel, "span#hello");
  });
  it("can create vnode with text content", function () {
    const vnode = h("a", ["I am a string"]);
    const { children } = vnode;
    assert.strictEqual(children[0].text, "I am a string");
  });
  it("can create vnode with text content in string", function () {
    const vnode = h("a", "I am a string");
    assert.strictEqual(vnode.text, "I am a string");
  });
  it("can create vnode with props and text content in string", function () {
    const vnode = h("a", {}, "I am a string");
    assert.strictEqual(vnode.text, "I am a string");
  });
  it("can create vnode with String obj content", function () {
    const vnode = h("a", new String("b"));
    assert.equal(vnode.text, "b");
  });
  it("can create vnode with props and String obj content", function () {
    const vnode = h("a", {}, new String("b"));
    assert.equal(vnode.text, "b");
  });
  it("can create vnode with Number obj content", function () {
    const vnode = h("a", new Number(1));
    assert.equal(vnode.text, "1");
  });
  it("can create vnode with null props", function () {
    let vnode = h("a", null);
    assert.deepEqual(vnode.data, {});
    vnode = h("a", null, ["I am a string"]);
    const { children } = vnode;
    assert.strictEqual(children[0].text, "I am a string");
  });
  it("can create vnode for comment", function () {
    const vnode = h("!", "test");
    assert.strictEqual(vnode.sel, "!");
    assert.strictEqual(vnode.text, "test");
  });
  it("创建一个svg元素", function () {
    const vnode = h("svg", [
      h("foreignObject", [h("div", ["I am HTML embedded in SVG"])]),
    ]);
    assert.strictEqual(vnode.sel, "svg");
    const { ns } = vnode.data;
    assert.strictEqual(ns, "http://www.w3.org/2000/svg");
    const { children } = vnode;
    assert.strictEqual(children[0].sel, "foreignObject");
    assert.strictEqual(children[0].data.ns, "http://www.w3.org/2000/svg");
  });
});
