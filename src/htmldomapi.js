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

export const htmlDomApi = {
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
