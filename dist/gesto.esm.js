/*
Copyright (c) 2019 Daybrush
name: gesto
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/gesture.git
version: 1.3.0
*/
import EventEmitter from '@scena/event-emitter';
import { removeEvent, document, now, addEvent } from '@daybrush/utils';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

function getRad(pos1, pos2) {
  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var rad = Math.atan2(distY, distX);
  return rad >= 0 ? rad : rad + Math.PI * 2;
}
function getRotatiion(touches) {
  return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
}
function isMultiTouch(e) {
  return e.touches && e.touches.length >= 2;
}
function getEventClients(e) {
  if (e.touches) {
    return getClients(e.touches);
  } else {
    return [getClient(e)];
  }
}
function getPosition(clients, prevClients, startClients) {
  var length = startClients.length;

  var _a = getAverageClient(clients, length),
      clientX = _a.clientX,
      clientY = _a.clientY,
      originalClientX = _a.originalClientX,
      originalClientY = _a.originalClientY;

  var _b = getAverageClient(prevClients, length),
      prevX = _b.clientX,
      prevY = _b.clientY;

  var _c = getAverageClient(startClients, length),
      startX = _c.clientX,
      startY = _c.clientY;

  var deltaX = clientX - prevX;
  var deltaY = clientY - prevY;
  var distX = clientX - startX;
  var distY = clientY - startY;
  return {
    clientX: originalClientX,
    clientY: originalClientY,
    deltaX: deltaX,
    deltaY: deltaY,
    distX: distX,
    distY: distY
  };
}
function getDist(clients) {
  return Math.sqrt(Math.pow(clients[0].clientX - clients[1].clientX, 2) + Math.pow(clients[0].clientY - clients[1].clientY, 2));
}
function getClients(touches) {
  var length = Math.min(touches.length, 2);
  var clients = [];

  for (var i = 0; i < length; ++i) {
    clients.push(getClient(touches[i]));
  }

  return clients;
}
function getClient(e) {
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}
function getAverageClient(clients, length) {
  if (length === void 0) {
    length = clients.length;
  }

  var sumClient = {
    clientX: 0,
    clientY: 0,
    originalClientX: 0,
    originalClientY: 0
  };

  for (var i = 0; i < length; ++i) {
    var client = clients[i];
    sumClient.originalClientX += "originalClientX" in client ? client.originalClientX : client.clientX;
    sumClient.originalClientY += "originalClientY" in client ? client.originalClientY : client.clientY;
    sumClient.clientX += client.clientX;
    sumClient.clientY += client.clientY;
  }

  if (!length) {
    return sumClient;
  }

  return {
    clientX: sumClient.clientX / length,
    clientY: sumClient.clientY / length,
    originalClientX: sumClient.originalClientX / length,
    originalClientY: sumClient.originalClientY / length
  };
}

var ClientStore =
/*#__PURE__*/
function () {
  function ClientStore(clients) {
    this.prevClients = [];
    this.startClients = [];
    this.movement = 0;
    this.length = 0;
    this.startClients = clients;
    this.prevClients = clients;
    this.length = clients.length;
  }

  var __proto = ClientStore.prototype;

  __proto.addClients = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    var position = this.getPosition(clients);
    var deltaX = position.deltaX,
        deltaY = position.deltaY;
    this.movement += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.prevClients = clients;
    return position;
  };

  __proto.getAngle = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    return getRotatiion(clients);
  };

  __proto.getRotation = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    return getRotatiion(clients) - getRotatiion(this.startClients);
  };

  __proto.getPosition = function (clients) {
    return getPosition(clients || this.prevClients, this.prevClients, this.startClients);
  };

  __proto.getPositions = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    var prevClients = this.prevClients;
    return this.startClients.map(function (startClient, i) {
      return getPosition([clients[i]], [prevClients[i]], [startClient]);
    });
  };

  __proto.getMovement = function (clients) {
    var movement = this.movement;

    if (!clients) {
      return movement;
    }

    var currentClient = getAverageClient(clients, this.length);
    var prevClient = getAverageClient(this.prevClients, this.length);
    var deltaX = currentClient.clientX - prevClient.clientX;
    var deltaY = currentClient.clientY - prevClient.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY) + movement;
  };

  __proto.getDistance = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    return getDist(clients);
  };

  __proto.getScale = function (clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }

    return getDist(clients) / getDist(this.startClients);
  };

  __proto.move = function (deltaX, deltaY) {
    this.startClients.forEach(function (client) {
      client.clientX -= deltaX;
      client.clientY -= deltaY;
    });
    this.prevClients.forEach(function (client) {
      client.clientX -= deltaX;
      client.clientY -= deltaY;
    });
  };

  return ClientStore;
}();

var INPUT_TAGNAMES = ["textarea", "input"];
/**
 * You can set up drag, pinch events in any browser.
 */

var Gesto =
/*#__PURE__*/
function (_super) {
  __extends(Gesto, _super);
  /**
   *
   */


  function Gesto(targets, options) {
    if (options === void 0) {
      options = {
        iframeSelector: ""
      };
    }

    var _this = _super.call(this) || this;

    _this.options = {
      iframeSelector: ""
    };
    _this.flag = false;
    _this.pinchFlag = false;
    _this.datas = {};
    _this.isDrag = false;
    _this.isPinch = false;
    _this.isMouse = false;
    _this.isTouch = false;
    _this.clientStores = [];
    _this.targets = [];
    _this.prevTime = 0;
    _this.doubleFlag = false;

    _this.onDragStart = function (e, isTrusted) {
      if (isTrusted === void 0) {
        isTrusted = true;
      }

      if (!_this.flag && e.cancelable === false) {
        return;
      }

      var _a = _this.options,
          container = _a.container,
          pinchOutside = _a.pinchOutside,
          preventRightClick = _a.preventRightClick,
          preventDefault = _a.preventDefault,
          checkInput = _a.checkInput,
          iframeSelector = _a.iframeSelector;
      var isTouch = _this.isTouch;
      var isDragStart = !_this.flag;

      if (isDragStart) {
        var iframe = iframeSelector ? document.querySelector(iframeSelector) : null;
        var contentDocument = iframe ? iframe.contentDocument : document;
        var activeElement = contentDocument.activeElement;
        var target = e.target;
        var tagName = target.tagName.toLowerCase();
        var hasInput = INPUT_TAGNAMES.indexOf(tagName) > -1;
        var hasContentEditable = target.isContentEditable;

        if (hasInput || hasContentEditable) {
          if (checkInput || activeElement === target) {
            // force false or already focused.
            return false;
          }

          if (activeElement && hasContentEditable && activeElement.isContentEditable && activeElement.contains(target)) {
            return false;
          }
        } else if ((preventDefault || e.type === "touchstart") && activeElement) {
          var activeTagName = activeElement.tagName;

          if (activeElement.isContentEditable || INPUT_TAGNAMES.indexOf(activeTagName) > -1) {
            activeElement.blur();
          }
        }

        _this.clientStores = [new ClientStore(getEventClients(e))];
        _this.flag = true;
        _this.isDrag = false;
        _this.datas = {};

        if (preventRightClick && (e.which === 3 || e.button === 2)) {
          _this.initDrag();

          return false;
        }

        _this.doubleFlag = now() - _this.prevTime < 200;

        var result = _this.emit("dragStart", __assign({
          datas: _this.datas,
          inputEvent: e,
          isTrusted: isTrusted,
          isDouble: _this.doubleFlag
        }, _this.getCurrentStore().getPosition()));

        if (result === false) {
          _this.initDrag();
        }

        _this.flag && preventDefault && e.preventDefault();
      }

      if (!_this.flag) {
        return false;
      }

      var timer = 0;

      if (isDragStart && isTouch && pinchOutside) {
        timer = setTimeout(function () {
          addEvent(container, "touchstart", _this.onDragStart, {
            passive: false
          });
        });
      }

      if (!isDragStart && isTouch && pinchOutside) {
        removeEvent(container, "touchstart", _this.onDragStart);
      }

      if (_this.flag && isMultiTouch(e)) {
        clearTimeout(timer);

        if (isDragStart && e.touches.length !== e.changedTouches.length) {
          return;
        }

        if (!_this.pinchFlag) {
          _this.onPinchStart(e);
        }
      }
    };

    _this.onDrag = function (e, isScroll) {
      if (!_this.flag) {
        return;
      }

      var clients = getEventClients(e);

      var result = _this.moveClients(clients, e, false);

      if (_this.pinchFlag || result.deltaX || result.deltaY) {
        _this.emit("drag", __assign({}, result, {
          isScroll: !!isScroll,
          inputEvent: e
        }));
      }

      if (_this.pinchFlag) {
        _this.onPinch(e, clients);
      }

      _this.getCurrentStore().addClients(clients);
    };

    _this.onDragEnd = function (e) {
      if (!_this.flag) {
        return;
      }

      var _a = _this.options,
          pinchOutside = _a.pinchOutside,
          container = _a.container;

      if (_this.isTouch && pinchOutside) {
        removeEvent(container, "touchstart", _this.onDragStart);
      }

      _this.flag = false;

      var position = _this.getCurrentStore().getPosition();

      var currentTime = now();
      var isDouble = !_this.isDrag && _this.doubleFlag;
      _this.prevTime = _this.isDrag || isDouble ? 0 : currentTime;

      _this.emit("dragEnd", __assign({
        datas: _this.datas,
        isDouble: isDouble,
        isDrag: _this.isDrag,
        inputEvent: e
      }, position));

      if (_this.pinchFlag) {
        _this.onPinchEnd(e);
      }

      _this.clientStores = [];
    };

    _this.onBlur = function () {
      _this.onDragEnd();
    };

    var elements = [].concat(targets);
    _this.options = __assign({
      checkInput: false,
      container: elements.length > 1 ? window : elements[0],
      preventRightClick: true,
      preventDefault: true,
      checkWindowBlur: false,
      pinchThreshold: 0,
      events: ["touch", "mouse"]
    }, options);
    var _a = _this.options,
        container = _a.container,
        events = _a.events,
        checkWindowBlur = _a.checkWindowBlur;
    _this.isTouch = events.indexOf("touch") > -1;
    _this.isMouse = events.indexOf("mouse") > -1;
    _this.targets = elements;

    if (_this.isMouse) {
      elements.forEach(function (el) {
        addEvent(el, "mousedown", _this.onDragStart);
      });
      addEvent(container, "mousemove", _this.onDrag);
      addEvent(container, "mouseup", _this.onDragEnd);
      addEvent(container, "contextmenu", _this.onDragEnd);
    }

    if (checkWindowBlur) {
      addEvent(window, "blur", _this.onBlur);
    }

    if (_this.isTouch) {
      var passive_1 = {
        passive: false
      };
      elements.forEach(function (el) {
        addEvent(el, "touchstart", _this.onDragStart, passive_1);
      });
      addEvent(container, "touchmove", _this.onDrag, passive_1);
      addEvent(container, "touchend", _this.onDragEnd, passive_1);
      addEvent(container, "touchcancel", _this.onDragEnd, passive_1);
    }

    return _this;
  }
  /**
   * The total moved distance
   */


  var __proto = Gesto.prototype;

  __proto.getMovement = function (clients) {
    return this.getCurrentStore().getMovement(clients) + this.clientStores.slice(1).reduce(function (prev, cur) {
      return prev + cur.movement;
    }, 0);
  };
  /**
   * Whether to drag
   */


  __proto.isDragging = function () {
    return this.isDrag;
  };
  /**
   * Whether to start drag
   */


  __proto.isFlag = function () {
    return this.flag;
  };
  /**
   * Whether to start pinch
   */


  __proto.isPinchFlag = function () {
    return this.pinchFlag;
  };
  /**
   * Whether to start double click
   */


  __proto.isDoubleFlag = function () {
    return this.doubleFlag;
  };
  /**
   * Whether to pinch
   */


  __proto.isPinching = function () {
    return this.isPinch;
  };
  /**
   * If a scroll event occurs, it is corrected by the scroll distance.
   */


  __proto.scrollBy = function (deltaX, deltaY, e, isCallDrag) {
    if (isCallDrag === void 0) {
      isCallDrag = true;
    }

    if (!this.flag) {
      return;
    }

    this.clientStores[0].move(deltaX, deltaY);
    isCallDrag && this.onDrag(e, true);
  };
  /**
   * Create a virtual drag event.
   */


  __proto.move = function (_a, inputEvent) {
    var deltaX = _a[0],
        deltaY = _a[1];
    var store = this.getCurrentStore();
    var nextClients = store.prevClients;
    return this.moveClients(nextClients.map(function (_a) {
      var clientX = _a.clientX,
          clientY = _a.clientY;
      return {
        clientX: clientX + deltaX,
        clientY: clientY + deltaY,
        originalClientX: clientX,
        originalClientY: clientY
      };
    }), inputEvent, true);
  };
  /**
   * The dragStart event is triggered by an external event.
   */


  __proto.triggerDragStart = function (e) {
    this.onDragStart(e, false);
  };
  /**
   * Set the event data while dragging.
   */


  __proto.setEventDatas = function (datas) {
    var currentDatas = this.datas;

    for (var name in datas) {
      currentDatas[name] = datas[name];
    }

    return this;
  };
  /**
   * Set the event data while dragging.
   */


  __proto.getEventDatas = function () {
    return this.datas;
  };
  /**
   * Unset Gesto
   */


  __proto.unset = function () {
    var _this = this;

    var targets = this.targets;
    var container = this.options.container;
    this.off();
    removeEvent(window, "blur", this.onBlur);

    if (this.isMouse) {
      targets.forEach(function (target) {
        removeEvent(target, "mousedown", _this.onDragStart);
      });
      removeEvent(container, "mousemove", this.onDrag);
      removeEvent(container, "mouseup", this.onDragEnd);
      removeEvent(container, "contextmenu", this.onDragEnd);
    }

    if (this.isTouch) {
      targets.forEach(function (target) {
        removeEvent(target, "touchstart", _this.onDragStart);
      });
      removeEvent(container, "touchstart", this.onDragStart);
      removeEvent(container, "touchmove", this.onDrag);
      removeEvent(container, "touchend", this.onDragEnd);
      removeEvent(container, "touchcancel", this.onDragEnd);
    }
  };

  __proto.onPinchStart = function (e) {
    var pinchThreshold = this.options.pinchThreshold;

    if (this.isDrag && this.getMovement() > pinchThreshold) {
      return;
    }

    var store = new ClientStore(getEventClients(e));
    this.pinchFlag = true;
    this.clientStores.splice(0, 0, store);
    var result = this.emit("pinchStart", __assign({
      datas: this.datas,
      angle: store.getAngle(),
      touches: this.getCurrentStore().getPositions()
    }, store.getPosition(), {
      inputEvent: e
    }));

    if (result === false) {
      this.pinchFlag = false;
    }
  };

  __proto.onPinch = function (e, clients) {
    if (!this.flag || !this.pinchFlag || clients.length < 2) {
      return;
    }

    var store = this.getCurrentStore();
    this.isPinch = true;
    this.emit("pinch", __assign({
      datas: this.datas,
      movement: this.getMovement(clients),
      angle: store.getAngle(clients),
      rotation: store.getRotation(clients),
      touches: store.getPositions(clients),
      scale: store.getScale(clients),
      distance: store.getDistance(clients)
    }, store.getPosition(clients), {
      inputEvent: e
    }));
  };

  __proto.onPinchEnd = function (e) {
    if (!this.pinchFlag) {
      return;
    }

    var isPinch = this.isPinch;
    this.isPinch = false;
    this.pinchFlag = false;
    var store = this.getCurrentStore();
    this.emit("pinchEnd", __assign({
      datas: this.datas,
      isPinch: isPinch,
      touches: store.getPositions()
    }, store.getPosition(), {
      inputEvent: e
    }));
    this.isPinch = false;
    this.pinchFlag = false;
  };

  __proto.initDrag = function () {
    this.clientStores = [];
    this.pinchFlag = false;
    this.doubleFlag = false;
    this.prevTime = 0;
    this.flag = false;
  };

  __proto.getCurrentStore = function () {
    return this.clientStores[0];
  };

  __proto.moveClients = function (clients, inputEvent, isAdd) {
    var store = this.getCurrentStore();
    var position = store[isAdd ? "addClients" : "getPosition"](clients);
    this.isDrag = true;
    return __assign({
      datas: this.datas
    }, position, {
      movement: this.getMovement(clients),
      isDrag: this.isDrag,
      isPinch: this.isPinch,
      isScroll: false,
      inputEvent: inputEvent
    });
  };

  return Gesto;
}(EventEmitter);

export default Gesto;
//# sourceMappingURL=gesto.esm.js.map
