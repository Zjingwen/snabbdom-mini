import * as is from "./is";
import { vnode } from "./vnode";

export function addNS(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      if (typeof child === "string") continue;
      const childData = child.data;
      if (childData !== undefined) {
        addNS(childData, child.children, child.sel);
      }
    }
  }
}

export function h(sel, b, c) {
  let data = {};
  let children, text, i;
  if (c !== undefined) {
    if (b !== null) data = b;

    if (is.array(c)) {
      children = c;
    } else if (is.primitive(c)) {
      text = c.toString();
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== undefined && b !== null) {
    if (is.array(b)) {
      children = b;
    } else if (is.primitive(b)) {
      text = b.toString();
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }

  if (children !== undefined) {
    for (i = 0; i < children.length; i++) {
      if (is.primitive(children[i])) {
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined
        );
      }
    }
  }

  if (
    sel[0] === "s" &&
    sel[1] === "v" &&
    sel[2] === "g" &&
    (sel.length === 3 || sel[3] === "." || sel[3] === "#")
  ) {
    addNS(data, children, sel);
  }

  return vnode(sel, data, children, text, undefined);
}
