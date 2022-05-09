var snabbdom = (function (exports) {
  'use strict';

  // 创建一个dom
  function createElement(tagName, options) {
    return document.createElement(tagName, options);
  }

  // 创建一个有命名空间URI和限定名称的元素
  function createElementNS(namespaceURI, qualifiedName, options) {
    return document.createElementNS(namespaceURI, qualifiedName, options);
  }

  // 创建一个空白的文档片段
  function createDocumentFragment() {
    return document.createDocumentFragment();
  }

  // 创建一个新的文本节点
  function createTextNode(text) {
    return document.createTextNode(text);
  }

  // 创建一个注释节点
  function createComment(text) {
    return document.createComment(text);
  }

  // 在参考节点之前插入一个拥有指定父节点的子节点
  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  // 删除节点
  function removeChild(node, child) {
    node.removeChild(child);
  }

  // 插入节点
  function appendChild(node, child) {
    node.appendChild(child);
  }

  // 返回父节点
  function parentNode(node) {
    return node.parentNode;
  }

  // 返回兄弟节点
  function nextSibling(node) {
    return node.nextSibling;
  }

  // 返回元素名
  function tagName(elm) {
    return elm.tagName;
  }

  // 设置一个节点内容
  function setTextContent(node, text) {
    node.textContent = text;
  }

  // 获取节点内容
  function getTextContent(node) {
    return node.textContent;
  }

  // 判断是否是节点
  function isElement(node) {
    return node.nodeType === 1;
  }

  // 判断是否是文本
  function isText(node) {
    return node.nodeType === 3;
  }

  // 判断是否是注释
  function isComment(node) {
    return node.nodeType === 8;
  }

  // 判断是否是虚拟文档
  function isDocumentFragment(node) {
    return node.nodeType === 11;
  }

  const htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    createDocumentFragment,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment,
    isDocumentFragment,
  };

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

  function isDef(s) {
    return s !== undefined;
  }

  function isUndef(s) {
    return s === undefined;
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

  function documentFragmentIsNotSupported() {
    throw new Error("The document fragment is not supported on this platform.");
  }

  function createElm(vnode, options, insertedVnodeQueue) {
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

      if (array(children)) {
        for (i = 0; i < children.length; i++) {
          const ch = children[i];
          if (ch != null) {
            htmlDomApi.appendChild(
              elm,
              createElm(ch, options)
            );
          }
        }
      } else if (primitive(vnode.text)) {
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
            createElm(ch, options)
          );
        }
      }
    } else {
      vnode.elm = htmlDomApi.createTextNode(vnode.text);
    }

    return vnode.elm;
  }

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

  // 插入节点
  function addVnodes() {}

  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = htmlDomApi.parentNode(childElm);
        htmlDomApi.removeChild(parent, childElm);
      }
    };
  }

  function init(modules, domApi, options) {
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
        if (isDef(oldCh) && isDef(ch)) ; else if (isDef(ch)) {
          // 如果oldVnode.text 不为 undefined，先将 oldVnode 清空
          if (isDef(oldVnode.text)) htmlDomApi.setTextContent(elm, "");
          // 插入新节点
          addVnodes(elm, null, ch, 0, ch.length - 1);
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
      let elm, parent;

      if (htmlDomApi.isElement(oldVnode)) {
        oldVnode = emptyNodeAt(oldVnode);
      } else if (htmlDomApi.isDocumentFragment(oldVnode)) {
        oldVnode = emptyDocumentFragmentAt(oldVnode);
      }

      // 对比两个vnode，相同 => 更新，不同 => 创建
      if (sameVnode(oldVnode, vnode)) {
        // 更新
        patchVnode(oldVnode, vnode);
      } else {
        // 创建
        
        // 直接入new node
        createElm(vnode, options);

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

  function addNS(data, children, sel) {
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

    if (children !== undefined) {
      for (i = 0; i < children.length; i++) {
        if (primitive(children[i])) {
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

  exports.h = h;
  exports.init = init;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
