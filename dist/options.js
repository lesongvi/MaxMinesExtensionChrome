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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(13);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Settings = _interopRequireDefault(__webpack_require__(1));

var _Storage = _interopRequireDefault(__webpack_require__(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global document:true */
const getLast = nodeListOrArray => nodeListOrArray[nodeListOrArray.length - 1];

const removeRow = ({
  path
}) => {
  const row = path.find(element => element.tagName === 'TR');
  row.parentNode.removeChild(row);
};

const addRow = () => {
  const rowHtml = `
  <tr>
  <th scope="row" class="align-middle">
    <div class="form-group text_box">
      <input type="text" class="form-control" name="siteKeys[]" size="40" required>
    </div>
  </th>
  <td class="align-middle">
    <div class="form-group text_box">
      <input type="text" class="form-control" name="userNames[]" size="25" maxlength="128">
    </div>
  </td>
  <td class="align-middle">
    <div class="form-group text_box">
      <select class="custom-select form-control" name="cpuUsages[]">
        <option value="10">10 %</option>
        <option value="20">20 %</option>
        <option value="30">30 %</option>
        <option value="40">40 %</option>
        <option value="50">50 %</option>
        <option value="60">60 %</option>
        <option value="70">70 %</option>
        <option value="80">80 %</option>
        <option value="90">90 %</option>
      </select>
    </div>
  </td>
  <td class="text-center align-middle">
    <div class="form-group text_box">
      <button type="button" class="btn_hover agency_banner_btn pay_btn cus_mb-10" name="remove-button">Remove</button>
    </div>
  </td>
  </tr>
  `;
  const tbody = document.getElementById('miner-settings-tbody');
  tbody.insertAdjacentHTML('beforeend', rowHtml);
  const removeButtons = document.getElementsByName('remove-button');
  const lastRemoveButton = getLast(removeButtons);
  lastRemoveButton.addEventListener('click', event => removeRow(event));
};

const getMinerSettingsElements = () => ({
  siteKeys: document.getElementsByName('siteKeys[]'),
  userNames: document.getElementsByName('userNames[]'),
  cpuUsages: document.getElementsByName('cpuUsages[]')
});

const addRowWithValues = ({
  siteKey,
  userName,
  cpuUsage
}) => {
  addRow();
  const {
    siteKeys,
    userNames,
    cpuUsages
  } = getMinerSettingsElements();
  const lastSiteKey = getLast(siteKeys);
  const lastUserName = getLast(userNames);
  const lastCpuUsage = getLast(cpuUsages);
  lastSiteKey.value = siteKey;
  lastUserName.value = userName;
  lastCpuUsage.value = cpuUsage;
};

const updateFormValues = () => {
  _Storage.default.get(storage => {
    const {
      userMinerSettings
    } = _Settings.default.fromStoreage(storage); // Reset tbody


    document.getElementById('miner-settings-tbody').innerHTML = '';
    userMinerSettings.forEach(config => {
      addRowWithValues(config);
    });

    if (userMinerSettings.length < 1) {
      addRow();
    }
  });
};

_Storage.default.addonChangedListener(updateFormValues);

document.addEventListener('DOMContentLoaded', updateFormValues);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-miner-button').addEventListener('click', addRow);
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('miner-settings-form').addEventListener('submit', event => {
    event.preventDefault();
    const {
      siteKeys,
      userNames,
      cpuUsages
    } = getMinerSettingsElements();
    const userMinerSettings = [];

    for (let i = 0; i < siteKeys.length; i += 1) {
      userMinerSettings.push({
        siteKey: siteKeys[i].value.trim(),
        userName: userNames[i].value.trim().substring(0, 128),
        cpuUsage: cpuUsages[i].value.trim()
      });
    }

    _Storage.default.set({
      userMinerSettings
    }, () => {
      document.getElementById('form-saved-alert').style.display = 'block';
    });
  });
});

/***/ })
/******/ ]);