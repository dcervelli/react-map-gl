import _typeof from "@babel/runtime/helpers/esm/typeof";
// based on https://github.com/uber/luma.gl/blob/master/src/utils/is-browser.js
// This function is needed in initialization stages,
// make sure it can be imported in isolation

/* global process */
import isElectron from './is-electron';
var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && String(process) === '[object process]' && !process.browser;
var isBrowser = !isNode || isElectron; // document does not exist on worker thread

export var isBrowserMainThread = isBrowser && typeof document !== 'undefined';
export default isBrowser;
//# sourceMappingURL=is-browser.js.map