import { htmlDomApi } from "./htmlDomApi";
import { vnode } from "./vnode";

// 将element重组为vnode数据
function emptyNodeAt(elm) {
  const id = elm.id ? "#" + elm.id : "";

  const classes = elm.getAttribute("class");
  const c = classes ? "." + classes.split(" ").join(".") : "";

  return vnode(
    htmlDomApi.tagName(elm).toLowerCase() + id + c,
    {},
    [],
    undefined,
    elm
  );
}

// 将document fragement 重组为vnode数据
function emptyDocumentFragmentAt(frag) {
  return vnode(undefined, {}, [], undefined, frag);
}

// 判断两个vnode是否相等
function sameVnode(vnode1, vnode2) {
  const isSameKey = vnode1.key === vnode2.key;
  const isSameIs = vnode1.data?.is === vnode2.data?.is;
  const isSameSel = vnode1.sel === vnode2.sel;

  return isSameSel && isSameKey && isSameIs;
}

// 对比两个节点
function patchVnode() {}

// 创建新节点
function createElm() {}

export function init(modules, domApi, options) {
  // const api = domApi !== undefined ? domApi : htmlDomApi;

  return function patch(oldVnode, vnode) {
    let elm, parent;
    const insertedVnodeQueue = [];

    if (htmlDomApi.isElement(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    } else if (htmlDomApi.isDocumentFragment(oldVnode)) {
      oldVnode = emptyDocumentFragmentAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      // patchVnode(oldVnode, vnode,insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = htmlDomApi.parentNode(elm);

      // createElm(vnode, insertedVnodeQueue)

      if (parent !== null) {
        htmlDomApi.insertBefore(parent, vnode.elm, htmlDomApi.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }

      for (i = 0; i < insertedVnodeQueue.length; ++i) {
        // TODO
      }
    }

    return vnode;
  };
}
