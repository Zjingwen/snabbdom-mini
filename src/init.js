export function init(modules, domApi, options) {
  return function patch(oldVnode, vnode) {
    console.log("patch", oldVnode, vnode);
  };
}
