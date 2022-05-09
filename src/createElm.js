import { htmlDomApi } from "./htmldomapi";
import { isDef, isUndef } from "./utils";
import * as is from "./is";

function documentFragmentIsNotSupported() {
  throw new Error("The document fragment is not supported on this platform.");
}

export function createElm(vnode, options, insertedVnodeQueue) {
  let i;
  let data = vnode.data;

  if (data !== undefined) {
    // 执行init钩子
    const init = data.hook?.init;
    if (isDef(init)) {
      init(vnode);
      data = vnode.data;
    }
  }

  const children = vnode.children;
  const sel = vnode.sel;

  if (sel === "!") {
    if (isUndef(vnode.text)) vnode.text = "";
    vnode.elm = htmlDomApi.createComment(vnode.text);
  } else if (sel !== undefined) {
    // 判断是否存在id
    const hashIdx = sel.indexOf("#");
    // 判断是否存在class
    const dotIdx = sel.indexOf(".", hashIdx);

    // 去除id、class，找到tag名
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;
    const tag =
      hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;

    // 创建节点
    const elm = (vnode.elm =
      isDef(data) && isDef((i = data.ns))
        ? htmlDomApi.createElementNS(i, tag, data)
        : htmlDomApi.createElement(tag, data));

    // 设置 id 值
    if (hash < dot) elm.setAttribute("id", sel.slice(hash + 1, dot));

    // 设置 class 值
    if (dotIdx > 0)
      elm.setAttribute("class", sel.slice(dot + 1).replace(/\,/g, " "));

    // 执行create 钩子
    // for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);

    if (is.array(children)) {
      for (i = 0; i < children.length; i++) {
        const ch = children[i];
        if (ch != null) {
          htmlDomApi.appendChild(
            elm,
            createElm(ch, options, insertedVnodeQueue)
          );
        }
      }
    } else if (is.primitive(vnode.text)) {
      htmlDomApi.appendChild(elm, htmlDomApi.createTextNode(vnode.text));
    }
  } else if (options?.experimental?.fragments && children) {
    const children = vnode.children;
    vnode.elm = (
      htmlDomApi.createDocumentFragment ?? documentFragmentIsNotSupported
    )();
    for (i = 0; i < children.length; ++i) {
      const ch = children[i];
      if (ch != null) {
        htmlDomApi.appendChild(
          vnode.elm,
          createElm(ch, options, insertedVnodeQueue)
        );
      }
    }
  } else {
    vnode.elm = htmlDomApi.createTextNode(vnode.text);
  }

  return vnode.elm;
}
