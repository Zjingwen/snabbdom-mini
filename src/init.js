import { htmlDomApi } from "./htmldomapi";
import { vnode } from "./vnode";
import { createElm } from "./createElm";
import { isDef, isUndef } from "./utils";

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

// 对比oldVnode 和 newVnode 更新节点
function updateChildren() {}

// 插入节点
function addVnodes() {}

// 删除节点
function removeVnodes(parnetElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    let listeners;
    let rm = () => {};
    const ch = vnodes[startIdx];
    if (ch != null) {
      if (isDef(ch.sel)) {
        listeners = cbs.remove.length + 1;
        rm = createRmCb(ch.elm, listeners);
        const removeHook = ch?.data?.remove;
        if (isDef(removeHook)) {
          removeHook(ch, rm);
        } else {
          rm();
        }
      } else {
        htmlDomApi.removeChild(parnetElm, ch.elm);
      }
    }
  }
}

function createRmCb(childElm, listeners) {
  return function rmCb() {
    if (--listeners === 0) {
      const parent = htmlDomApi.parentNode(childElm);
      htmlDomApi.removeChild(parent, childElm);
    }
  };
}

export function init(modules, domApi, options) {
  // const api = domApi !== undefined ? domApi : htmlDomApi;
  const cbs = {
    create: [],
    updata: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };
  // 判断 oldVnode和newVnode 是否相等
  // 根据不同的状态，执行updateChildren、addVnode、removeVnode
  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    const oldCh = oldVnode.children; // old node的子节点
    const ch = vnode.children; // new node的子节点
    const elm = (vnode.elm = oldVnode.elm); // 既然elm相同，就直接取出elm公用

    // 新旧vnode相等直接返回
    if (oldVnode === vnode) return;
    debugger;
    if (
      vnode.data !== undefined ||
      (isDef(vnode.text) && vnode.text !== oldVnode.text)
    ) {
      vnode.data ??= {};
      oldVnode.data ??= {};
      // vnode.data?.hook?.update?.(oldVnode, vnode);
    }

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        // 如果oldVnode.text 不为 undefined，先将 oldVnode 清空
        if (isDef(oldVnode.text)) htmlDomApi.setTextContent(elm, "");
        // 插入新节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        htmlDomApi.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode.text) {
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      htmlDomApi.setTextContent(elm, vnode.text);
    }
  }

  function removeVnodes(parnetElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners;
      let rm = () => {};
      const ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          const removeHook = ch?.data?.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else {
            rm();
          }
        } else {
          htmlDomApi.removeChild(parnetElm, ch.elm);
        }
      }
    }
  }

  return function patch(oldVnode, vnode) {
    let i, elm, parent;
    let insertedVnodeQueue = [];

    if (htmlDomApi.isElement(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    } else if (htmlDomApi.isDocumentFragment(oldVnode)) {
      oldVnode = emptyDocumentFragmentAt(oldVnode);
    }

    // 对比两个vnode，相同 => 更新，不同 => 创建
    if (sameVnode(oldVnode, vnode)) {
      // 更新
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      // 创建
      
      // 直接入new node
      createElm(vnode, options, insertedVnodeQueue);

      elm = oldVnode.elm; // 获取 old node 的 element
      parent = htmlDomApi.parentNode(elm);// 获取 old node 的父元素
      if (parent !== null) {
        htmlDomApi.insertBefore(parent, vnode.elm, htmlDomApi.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }

      // for (i = 0; i < insertedVnodeQueue.length; ++i) {
      //   insertedVnodeQueue[i].data &&
      //     insertedVnodeQueue[i].data.hook &&
      //     insertedVnodeQueue[i].data.hook.insert &&
      //     insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
      // }
    }

    return vnode;
  };
}
