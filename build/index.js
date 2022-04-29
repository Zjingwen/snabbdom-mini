var snabbdom = (function (exports) {
  'use strict';

  function h() {
    console.log("h");
  }

  function init() {
    console.log("init");
  }

  exports.h = h;
  exports.init = init;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
