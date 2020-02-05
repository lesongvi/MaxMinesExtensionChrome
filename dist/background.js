/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global chrome:true */
class Storage {
  static get(callback) {
    chrome.storage.local.get(null, storage => {
      callback(storage);
    });
  }

  static set(item, callback = () => {}) {
    chrome.storage.local.set(item, storage => {
      callback(storage);
    });
  }

  static addonChangedListener(listener) {
    chrome.storage.onChanged.addListener(listener);
  }

}

exports.default = Storage;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MinerDefinition = _interopRequireDefault(__webpack_require__(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global chrome:true */
const {
  short_name: shortName,
  version
} = chrome.runtime.getManifest();
const donateSiteKey = 'teobeNtStrmOnnMLGbP3FJ52q3ePwVdZYLkGDZUi';
const donateMinerDefinition = Object.freeze(new _MinerDefinition.default(donateSiteKey, `${shortName} (${version})`, 0));
const defaultSettings = Object.freeze({
  isEnabled: true,
  userMinerSettings: []
});

class Settings {
  static fromStoreage(storage) {
    const settings = Object.assign({}, defaultSettings, storage);
    settings.userMinerDefinitions = settings.userMinerSettings.map(({
      siteKey,
      userName,
      cpuUsage
    }) => Object.freeze(new _MinerDefinition.default(siteKey, userName, cpuUsage)));
    settings.minerDefinitions = settings.userMinerDefinitions.concat(donateMinerDefinition);
    return Object.freeze(settings);
  }

  static isDonateSiteKey(siteKey) {
    return donateSiteKey === siteKey;
  }

}

var _default = Settings;
exports.default = _default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const clamp = (x, lower, upper) => Math.max(lower, Math.min(x, upper));

class MinerDefinition {
  constructor(siteKey, userName, cpuUsage) {
    this.siteKey = String(siteKey).trim();
    this.userName = String(userName).trim().substring(0, 128);
    this.cpuUsage = clamp(Math.trunc(cpuUsage), 1, 99);
    this.options = {
      autoThreads: 'auto',
      throttle: (100 - cpuUsage) / 100
    };
  }

}

exports.default = MinerDefinition;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _App = _interopRequireDefault(__webpack_require__(5));

var _Storage = _interopRequireDefault(__webpack_require__(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global chrome:true window:true */
const app = new _App.default(); // Run on page load.

window.addEventListener('load', () => app.run()); // Re-run when changed.

_Storage.default.addonChangedListener(() => app.run());

window.addEventListener('online', () => app.run());
window.addEventListener('offline', () => app.run()); // Menu icon clicks.

chrome.browserAction.onClicked.addListener(() => app.toggle());

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Badge = _interopRequireDefault(__webpack_require__(6));

var _Miners = _interopRequireDefault(__webpack_require__(7));

var _Notification = _interopRequireDefault(__webpack_require__(8));

var _Settings = _interopRequireDefault(__webpack_require__(1));

var _Storage = _interopRequireDefault(__webpack_require__(0));

var _MaxMinesCop = _interopRequireDefault(__webpack_require__(9));

var _InternetConnectionCop = _interopRequireDefault(__webpack_require__(10));

var _SettingsCop = _interopRequireDefault(__webpack_require__(11));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["toggle"] }] */
class App {
  constructor() {
    this.miners = new _Miners.default();
    this.notification = new _Notification.default();
    this.cops = [new _SettingsCop.default(), new _InternetConnectionCop.default(), new _MaxMinesCop.default(this.notification)];
  }

  toggle() {
    _Storage.default.get(storage => {
      const {
        isEnabled
      } = _Settings.default.fromStoreage(storage);

      _Storage.default.set({
        isEnabled: !isEnabled
      });
    });
  }

  run() {
    _Storage.default.get(storage => {
      const settings = _Settings.default.fromStoreage(storage);

      const shouldMine = this.shouldMine(settings);
      const minerDefinitions = shouldMine ? settings.minerDefinitions : [];
      this.resetUi(shouldMine);
      this.check();
      this.resetMiners(minerDefinitions);
      this.miners.start();
    });
  }

  shouldMine(settings) {
    return this.cops.reduce((shouldMine, cop) => shouldMine && cop.shouldMine(settings), true);
  }

  resetUi(shouldMine) {
    this.notification.reset();

    _Badge.default.updateIcon(shouldMine);

    _Badge.default.updateText(0);
  }

  check() {
    this.cops.forEach(cop => cop.check());
  }

  resetMiners(minerDefinitions) {
    this.miners.reset(minerDefinitions);
    this.miners.on('open', () => _Badge.default.showColoredIcon());
    this.miners.on('authed', () => _Badge.default.showColoredIcon());
    this.miners.on('job', () => _Badge.default.updateText(this.getHashesPerSecond()));
    this.miners.on('accepted', () => _Badge.default.updateText(this.getHashesPerSecond()));
    this.miners.on('found', () => _Badge.default.updateText(this.getHashesPerSecond()));
    this.miners.on('error', () => _Badge.default.updateIcon(this.isMining()));
    this.miners.on('error', () => _Badge.default.updateText(this.getHashesPerSecond()));
    this.miners.on('error', (siteKey, params) => {
      this.notification.minerError(siteKey, params);
    });
    this.miners.on('close', () => _Badge.default.updateIcon(this.isMining()));
    this.miners.on('close', () => _Badge.default.updateText(this.getHashesPerSecond()));
  }

  isMining() {
    return this.miners.isRunning();
  }

  getHashesPerSecond() {
    return Math.trunc(this.miners.getHashesPerSecond());
  }

}

var _default = App;
exports.default = _default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global chrome:true */
const iconPaths = Object.freeze({
  16: 'icons/icon16.png',
  32: 'icons/icon32.png',
  48: 'icons/icon48.png',
  128: 'icons/icon128.png'
});
const grayscaleIconPaths = Object.freeze({
  16: 'icons/icon16-grayscale.png',
  32: 'icons/icon32-grayscale.png',
  48: 'icons/icon48-grayscale.png',
  128: 'icons/icon128-grayscale.png'
});

class Badge {
  static updateIcon(isRunning) {
    if (isRunning) {
      this.showColoredIcon();
    } else {
      this.showGrayscaleIcon();
    }
  }

  static showGrayscaleIcon() {
    chrome.browserAction.setIcon({
      path: grayscaleIconPaths
    });
  }

  static showColoredIcon() {
    chrome.browserAction.setIcon({
      path: iconPaths
    });
  }

  static updateText(hashRate) {
    let text = String(hashRate);

    if (hashRate > 9999) {
      text = '>10k';
    } else if (hashRate < 1) {
      text = '';
    }

    chrome.browserAction.setBadgeText({
      text
    });
  }

}

var _default = Badge;
exports.default = _default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global MaxMines:true */

/* eslint no-underscore-dangle: ["error", { "allow": ["_siteKey"] }] */

/* eslint no-console: "off" */
class Miners {
  constructor() {
    console.log('Miners: init');
    this.miners = [];
  }

  reset(configs) {
    console.log('Miners: reset');
    this.stop();
    this.miners = [];
    configs.forEach(({
      siteKey,
      userName,
      options
    }) => {
      const miner = userName ? new MaxMines.User(siteKey, userName, options) : new MaxMines.Anonymous(siteKey, options);
      this.miners.push(miner);
    }, this);
    console.log('Miners: ', this.miners);
  }

  on(eventName, callback) {
    this.miners.forEach(miner => {
      miner.on(eventName, params => callback(miner._siteKey, params));
    });
  }

  start() {
    console.log('Miners: start');
    this.miners.forEach(miner => {
      miner.start(MaxMines.FORCE_MULTI_TAB);
    });
  }

  stop() {
    console.log('Miners: stop');
    this.miners.forEach(miner => {
      miner.stop();
    });
  }

  isRunning() {
    return this.miners.reduce((anyRunning, miner) => anyRunning || miner.isRunning(), false);
  }

  getHashesPerSecond() {
    return this.miners.reduce((sum, miner) => sum + miner.getHashesPerSecond(), 0);
  }

}

exports.default = Miners;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global chrome:true */

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["MaxMinesOffline"] }] */
class Notification {
  constructor() {
    this.ids = {
      minerErrors: []
    };
    this.addOnClickedListener();
  }

  addOnClickedListener() {
    chrome.notifications.onClicked.addListener(notificationId => {
      if (this.ids.minerErrors.includes(notificationId)) {
        chrome.runtime.openOptionsPage();
      }
    });
  }

  minerError(siteKey, {
    error
  }) {
    const id = `maxmines-extension-error-${siteKey}-${error}`;

    if (this.ids.minerErrors.includes(id)) {
      return;
    }

    this.ids.minerErrors.push(id);
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `Error: ${error}`,
      message: `MaxMines Extension ${siteKey}`,
      requireInteraction: ['invalid_site_key', 'invalid_user_name'].includes(error)
    });
  }

  MaxMinesOffline() {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Unable to download MaxMines JS library',
      message: 'MaxMines Extension will restart itself when internet connection is back'
    });
  }

  reset() {
    chrome.notifications.getAll(notifications => {
      Object.keys(notifications).forEach(id => {
        chrome.notifications.clear(id);
      });
    });
    this.ids.minerErrors = [];
  }

}

exports.default = Notification;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global chrome:true, navigator:true */

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["shouldMine"] }] */
class MaxMinesCop {
  constructor(notification) {
    this.notification = notification;
  }

  shouldMine() {
    return typeof MaxMines !== 'undefined';
  }

  check() {
    if (this.shouldMine()) {
      return;
    }

    if (navigator.onLine) {
      setTimeout(() => {
        chrome.runtime.reload();
      }, 60000);
    } else {
      this.notification.MaxMinesOffline();
    }
  }

}

exports.default = MaxMinesCop;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global navigator:true */

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["check", "shouldMine"] }] */
class InternetConnectionCop {
  shouldMine() {
    return navigator.onLine;
  }

  check() {}

}

exports.default = InternetConnectionCop;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["check", "shouldMine"] }] */
class SettingsCop {
  shouldMine({
    isEnabled
  }) {
    return isEnabled;
  }

  check() {}

}

exports.default = SettingsCop;

/***/ })
/******/ ]);