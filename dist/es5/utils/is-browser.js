"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isBrowserMainThread = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _isElectron = _interopRequireDefault(require("./is-electron"));

// based on https://github.com/uber/luma.gl/blob/master/src/utils/is-browser.js
// This function is needed in initialization stages,
// make sure it can be imported in isolation

/* global process */
var isNode = (typeof process === "undefined" ? "undefined" : (0, _typeof2.default)(process)) === 'object' && String(process) === '[object process]' && !process.browser;
var isBrowser = !isNode || _isElectron.default; // document does not exist on worker thread

var isBrowserMainThread = isBrowser && typeof document !== 'undefined';
exports.isBrowserMainThread = isBrowserMainThread;
var _default = isBrowser;
exports.default = _default;
//# sourceMappingURL=is-browser.js.map