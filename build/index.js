var snabbdom = (function (exports) {
  'use strict';

  function init(modules, domApi, options) {
    return function patch(oldVnode, vnode) {
      console.log("patch", oldVnode, vnode);
    };
  }

  const array = Array.isArray;
  function primitive(s) {
    return (
      typeof s === "string" ||
      typeof s === "number" ||
      s instanceof String ||
      s instanceof Number
    );
  }

  function vnode(sel, data, children, text, elm) {
    const key = data === undefined ? undefined : data.key;
    return {
      sel,
      data,
      children,
      text,
      elm,
      key,
    };
  }

  function h(sel, b, c) {
    let data = {};
    let children, text, i;
    if (c !== undefined) {
      if (b !== null) data = b;

      if (array(c)) {
        children = c;
      } else if (primitive(c)) {
        text = c.toString();
      } else if (c && c.sel) {
        children = [c];
      }
    } else if (b !== undefined && b !== null) {
      if (array(b)) {
        children = b;
      } else if (primitive(b)) {
        text = b.toString();
      } else if (b && b.sel) {
        children = [b];
      } else {
        data = b;
      }
    }

    for (i = 0; i < children.length; i++) {
      if (primitive(children[i])) {
        children[i] = vnode(undefined, undefined, children[i], undefined);
      }
    }

    // todo svg

    return vnode(sel, data, children, text, undefined);
  }

  exports.h = h;
  exports.init = init;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
