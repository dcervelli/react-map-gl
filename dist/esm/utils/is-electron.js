import _typeof from "@babel/runtime/helpers/esm/typeof";

// based on https://github.com/uber/luma.gl/blob/master/src/utils/is-electron.js

/* global window, process, navigator */
function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  } // Main process


  if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && Boolean(process.versions.electron)) {
    return true;
  } // Detect the user agent when the `nodeIntegration` option is set to true


  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

export default isElectron();
//# sourceMappingURL=is-electron.js.map