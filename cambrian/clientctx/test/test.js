/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../index.js":
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var create = __webpack_require__(/*! ./src */ \"../src/index.js\")\n\nmodule.exports = Object.freeze({ create })\n\n\n//# sourceURL=webpack:///../index.js?");

/***/ }),

/***/ "../node_modules/events/events.js":
/*!****************************************!*\
  !*** ../node_modules/events/events.js ***!
  \****************************************/
/***/ (function(module) {

"use strict";
eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack:///../node_modules/events/events.js?");

/***/ }),

/***/ "../src/commons.js":
/*!*************************!*\
  !*** ../src/commons.js ***!
  \*************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var commons = __webpack_require__(/*! @permian/web-commons */ \"../../../permian/web-commons/index.js\")\n\nmodule.exports = {\n  WhenBuilder: commons.matcher.WhenBuilder,\n  isObject: commons.lang.isObject,\n  MatcherBuilder: commons.matcher.MatcherBuilder,\n  throwError: commons.lang.throwError\n}\n\n\n//# sourceURL=webpack:///../src/commons.js?");

/***/ }),

/***/ "../src/compatibility.js":
/*!*******************************!*\
  !*** ../src/compatibility.js ***!
  \*******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var commons = __webpack_require__(/*! ./commons */ \"../src/commons.js\")\n\nvar checkDesktopChrome = window => true\n\nvar checkDesktopMozilla = window => true\n\nvar clientOk = w => w\n\nvar checkCompatibility = commons.MatcherBuilder()\n  .on(checkDesktopChrome, clientOk)\n  .on(checkDesktopMozilla, clientOk)\n  .otherwise(window => Promise.reject('Unsupported user agent: ' + window.navigator.userAgent))\n  .build()\n\nmodule.exports = window => checkCompatibility(window) \n\n\n//# sourceURL=webpack:///../src/compatibility.js?");

/***/ }),

/***/ "../src/element-builder.js":
/*!*********************************!*\
  !*** ../src/element-builder.js ***!
  \*********************************/
/***/ (function(module) {

eval("function ElementBuilder(window, elementName, p, peek = p || (() => { })) {\n  var element = window.document.createElement(elementName)\n\n  peek(element)\n\n  var removeChildren = () => element.childNodes.forEach(n => n.remove())\n\n  this.setChildren = children => {\n    removeChildren()\n    children.forEach(e => element.appendChild(e))\n    return this\n  }\n\n  this.setAttribute = (name, value) => {\n    element.setAttribute(name, value)\n    return this\n  }\n\n  this.setCss = cssText => {\n    element.style = cssText\n    return this\n  }\n\n  this.setId = id => {\n    element.id = id\n    return this\n  }\n\n  this.setClasses = classes => {\n    Array.isArray(classes) || (classes = [classes])\n    element.classList.value = ''\n    classes.forEach(c => element.classList.add(c))\n    return this\n  }\n\n  this.setTextContent = txt => {\n    removeChildren()\n    element.innerHTML = txt\n    return this\n  }\n\n  this.build = () => element\n}\n\nmodule.exports = ElementBuilder\n\n\n//# sourceURL=webpack:///../src/element-builder.js?");

/***/ }),

/***/ "../src/index.js":
/*!***********************!*\
  !*** ../src/index.js ***!
  \***********************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var EventEmitter = __webpack_require__(/*! events */ \"../node_modules/events/events.js\")\nvar checkCompatibility = __webpack_require__(/*! ./compatibility */ \"../src/compatibility.js\")\nvar getWindow = __webpack_require__(/*! ./window */ \"../src/window.js\")\nvar tools = __webpack_require__(/*! ./tools */ \"../src/tools.js\")\n\nvar MAX_EVENT_LISTENERS = 100\n\nvar createEventLoop = () => {\n  var eventLoop = new EventEmitter()\n  eventLoop.setMaxListeners(MAX_EVENT_LISTENERS)\n  return eventLoop\n}\n\nvar waitWindowLoad = window => new Promise(resolve => window.onload = e => resolve(window, e))\n\nvar createClientContext = () => getWindow()\n  .then(window => checkCompatibility(window))\n  .then(waitWindowLoad)\n  .then(window => Object.freeze({\n    tools: tools(window),\n    eventLoop: createEventLoop(),\n    MAX_EVENT_LISTENERS,\n    getWindow: () => window,\n    getDocument: () => window.document\n  }))\n\nmodule.exports = createClientContext\n\n\n//# sourceURL=webpack:///../src/index.js?");

/***/ }),

/***/ "../src/tools.js":
/*!***********************!*\
  !*** ../src/tools.js ***!
  \***********************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var ElementBuilder = __webpack_require__(/*! ./element-builder */ \"../src/element-builder.js\")\nvar commons = __webpack_require__(/*! ./commons */ \"../src/commons.js\")\n\nfunction InputBuilder(window) {\n  var types = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week']\n\n  this.setType = type => {\n    types.includes(type) || commons.throwError('Bad input type ' + type)\n    this.setAttribute('type', type)\n    return this\n  }\n\n  this.setChildren = () => commons.throwError('Do not add children to an input')\n\n  ElementBuilder.call(this, window, 'input')\n}\n\nvar getTools = window => ({\n  jsonToCss: json => Object.keys(json).map(k => k + ': ' + json[k] + ';').join('\\n'),\n  divBuilder: () => new ElementBuilder(window, 'div'),\n  inputBuilder: () => new InputBuilder(window),\n  spanBuilder: () => new ElementBuilder(window, 'span')\n})\n\nmodule.exports = window => getTools(window)\n\n\n//# sourceURL=webpack:///../src/tools.js?");

/***/ }),

/***/ "../src/window.js":
/*!************************!*\
  !*** ../src/window.js ***!
  \************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var commons = __webpack_require__(/*! ./commons */ \"../src/commons.js\")\n\n/* global window */\n\nvar getWindow = commons.WhenBuilder()\n  .then((b, w) => Promise.resolve(w))\n  .otherwise(() => Promise.reject('Could not detect window object.'))\n  .build()\n\nmodule.exports = () => getWindow(commons.isObject(window), window) \n\n\n//# sourceURL=webpack:///../src/window.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("var WebClientContext = __webpack_require__(/*! .. */ \"../index.js\")\n\nvar start = ctx => {\n  var root = ctx.getDocument().getElementById('pageroot')\n  var mainElement = ctx.tools.divBuilder()\n    .setTextContent('Furulya')\n    .build()\n  root.appendChild(mainElement)\n  console.log('OK\\n')\n}\n\n/* global window */ \n\nWebClientContext.create()\n  .then(start)\n  .catch(err => console.log('ERROR:\\n', err))\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "../../../permian/fluent/index.js":
/*!****************************************!*\
  !*** ../../../permian/fluent/index.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var fluent = __webpack_require__(/*! ./src */ \"../../../permian/fluent/src/index.js\")\n\nmodule.exports = Object.freeze(fluent)\n\n//# sourceURL=webpack:///../../../permian/fluent/index.js?");

/***/ }),

/***/ "../../../permian/fluent/src/commons.js":
/*!**********************************************!*\
  !*** ../../../permian/fluent/src/commons.js ***!
  \**********************************************/
/***/ (function(module) {

eval("var commons = {\n  isNil: o => o === null || o === undefined,\n  isArray: o => Array.isArray(o),\n  isFunction: o => !commons.isNil(o) && typeof o === 'function',\n  isString: o => !commons.isNil(o) && typeof o === 'string' || o instanceof String,\n  isBoolean: o => !commons.isNil(o) && typeof o === 'boolean',\n  isNumber: o => !commons.isNil(o) && !commons.isBoolean(o) && !commons.isString(o) && !isNaN(o),\n  isObject: o => !commons.isNil(o) && typeof o === 'object',\n  isSymbol: o => typeof o === 'symbol', \n  throwError: e => { throw new Error(e) }\n}\n\nmodule.exports = commons\n\n\n//# sourceURL=webpack:///../../../permian/fluent/src/commons.js?");

/***/ }),

/***/ "../../../permian/fluent/src/index.js":
/*!********************************************!*\
  !*** ../../../permian/fluent/src/index.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var validateRules = __webpack_require__(/*! ./validate-rules */ \"../../../permian/fluent/src/validate-rules.js\")\nvar commons = __webpack_require__(/*! ./commons */ \"../../../permian/fluent/src/commons.js\")\n\nfunction Factory(rules) {\n  var startState = Object.keys(rules).find(k => rules[k].startState)\n\n  var createState = (name, ctx) => rules[name].transitions?.reduce((acc, n) => {\n    acc[n] = (...args) => {\n      rules[n].handler && rules[n].handler(ctx, ...args)\n      return createState(n, ctx) || ctx.result\n    }\n    return acc\n  }, {})\n\n  this.createInstance = () => (...args) => {\n    var ctx = {}\n    rules[startState].handler && rules[startState].handler(ctx, ...args)\n    return createState(startState, ctx)\n  }\n}\n\nvar buildFactory = r => new Factory(validateRules(r))\n\nmodule.exports = {\n  util: commons,\n  Factory,\n  buildFactory,\n  build: rules => buildFactory(rules).createInstance()\n}\n\n//# sourceURL=webpack:///../../../permian/fluent/src/index.js?");

/***/ }),

/***/ "../../../permian/fluent/src/validate-rules.js":
/*!*****************************************************!*\
  !*** ../../../permian/fluent/src/validate-rules.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var { throwError, isFunction, isBoolean, isArray, isObject, isString } = __webpack_require__(/*! ./commons */ \"../../../permian/fluent/src/commons.js\")\n\nvar wrapChecker = (field, f) => field ? f() : {}\n\nvar checkHandler = (handler, rule) => wrapChecker(handler, () => isFunction(handler) ? result = { handler } : throwError('Bad handler in rule ' + rule))\n\nvar checkStartState = (startState, rule) => wrapChecker(startState, () => isBoolean(startState) ? { startState } : throwError('Bad startState in rule ' + rule))\n\nvar checkTransitions = (transitions, rule) => wrapChecker(transitions, () => {\n  isArray(transitions) || throwError('Bad transitions in rule ' + rule)\n  transitions.forEach(t => isString(t) || throwError('Non string transition in rule ' + rule))\n  return ({ transitions })\n})\n\nvar checkAndCopyRuleBody = (r, body, rule = `\"${r}\"`) => {\n  isObject(body) || throwError('Rule is not an object: ' + rule)\n  var copy = Object.assign({}, checkHandler(body.handler, rule), checkStartState(body.startState, rule), checkTransitions(body.transitions, rule))\n  Object.keys(body).length !== Object.keys(copy).length && throwError('Bad entry in rule ' + rule)\n  return copy\n}\n\nvar checkRule = (acc, entry) => {\n  var rule = entry[0]\n  var bodyCopy = checkAndCopyRuleBody(rule, entry[1])\n  acc[rule] = bodyCopy\n  return acc\n}\n\nvar checkSingleStartState = rules => {\n  var startStateCount = Object.values(rules).reduce((acc, e) => acc + (!!e.startState), 0)\n  startStateCount === 1 || throwError('Missing or multiple start states.')\n}\n\nvar checkStateTransitions = (alloweds, tr, rule) => tr.forEach(tr => alloweds.includes(tr) || throwError('Invalid transition(s) in rule ' + rule))\n\nvar checkStateTransitions = rules => {\n  var transitions = Object.keys(rules)\n  Object.entries(rules).forEach(e => e[1].transitions ? checkStateTransitions(transitions, e[1].transitions, e[0]) : e[1].isTerminal = true)\n}\n\nmodule.exports = r => {\n  isObject(r) || throwError('Rule set is not an object.')\n  var rules = Object.entries(r).reduce(checkRule, {})\n  checkSingleStartState(rules)\n  checkStateTransitions(rules)\n  return rules\n}\n\n\n//# sourceURL=webpack:///../../../permian/fluent/src/validate-rules.js?");

/***/ }),

/***/ "../../../permian/matcher/index.js":
/*!*****************************************!*\
  !*** ../../../permian/matcher/index.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var MatcherBuilder = __webpack_require__(/*! ./src/matcher */ \"../../../permian/matcher/src/matcher.js\")\nvar WhenBuilder = __webpack_require__(/*! ./src/when */ \"../../../permian/matcher/src/when.js\")\n\nmodule.exports = Object.freeze({ WhenBuilder, MatcherBuilder})\n\n\n//# sourceURL=webpack:///../../../permian/matcher/index.js?");

/***/ }),

/***/ "../../../permian/matcher/src/matcher.js":
/*!***********************************************!*\
  !*** ../../../permian/matcher/src/matcher.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var fluent = __webpack_require__(/*! @permian/fluent */ \"../../../permian/fluent/index.js\")\nvar { isFunction, throwError } = fluent.util\n\nvar functionify = obj => isFunction(obj) ? obj : () => obj\n\nvar checkContext = ctx => !ctx.otherwise && ctx.ons.length === 0 && throwError('At least one  otherwise()  or  on()  must be declared.')\n\nvar val = v => ({ val: v })\n\nvar fetchAllResults = (ctx, arg) => ctx.ons.filter(on => on.o1(arg)).map(on => val(on.o2(arg)))\n\nvar fetchFirstHit = (ctx, arg) => {\n  var found = ctx.ons.find(on => on.o1(arg))\n  return found ? [val(found.o2(arg))] : []\n}\n\nvar rules = {\n  start: {\n    handler: ctx => ctx.ons = [],\n    transitions: ['on', 'otherwise', 'all'],\n    startState: true\n  },\n  on: {\n    handler: (ctx, on1, on2) => ctx.ons.push({\n      o1: isFunction(on1) ? on1 : arg => arg === on1,\n      o2: functionify(on2)\n    }),\n    transitions: ['on', 'build', 'otherwise']\n  },\n  all: {\n    handler: ctx => ctx.all = true,\n    transitions: ['on', 'otherwise']\n  },\n  otherwise: {\n    handler: (ctx, otherwise) => ctx.otherwise = functionify(otherwise),\n    transitions: ['build']\n  },\n  build: {\n    handler: ctx => ctx.result = arg => {\n      checkContext(ctx)\n      var results = ctx.all ? fetchAllResults(ctx, arg) : fetchFirstHit(ctx, arg)\n      results.length === 0 && results.push(ctx.otherwise ? val(ctx.otherwise(arg)) : val())\n      return ctx.all ? results.map(r => r.val) : results[0].val\n    }\n  }\n}\n\nmodule.exports = fluent.buildFactory(rules).createInstance()\n\n//# sourceURL=webpack:///../../../permian/matcher/src/matcher.js?");

/***/ }),

/***/ "../../../permian/matcher/src/when.js":
/*!********************************************!*\
  !*** ../../../permian/matcher/src/when.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var fluent = __webpack_require__(/*! @permian/fluent */ \"../../../permian/fluent/index.js\")\nvar { isSymbol, isString, isObject, isNumber, isArray, isFunction } = fluent.util\n\nvar boolEvaluate = obj => {\n  var boolEvaluation = obj\n  if (obj === true || isString(obj) || isArray(obj) || isSymbol(obj) || isObject(obj) || isNumber(obj) || isFunction(obj)) {\n    boolEvaluation = true\n  } else if (obj === false) {\n    boolEvaluation = false\n  } else {\n    boolEvaluation = !!obj\n  }\n  return boolEvaluation\n}\n\nvar build = {\n  handler: ctx => ctx.result = (arg, k) => {\n    var result\n    if (fluent.util.isNil(arg) && ctx.onNil) {\n      result = ctx.onNil(arg, k)\n    } else if (boolEvaluate(arg) && ctx.onTrue) {\n      result = ctx.onTrue(arg, k)\n    } else {\n      result = ctx.otherwise(arg, k)\n    }\n    return result\n  }\n}\n\nvar functionify = obj => isFunction(obj) ? obj : () => obj\n\nvar rules = {\n  build,\n  isNil: {\n    handler: (ctx, onNil) => ctx.onNil = functionify(onNil),\n    transitions: ['then', 'otherwise', 'build']\n  },\n  then: {\n    handler: (ctx, onTrue) => ctx.onTrue = functionify(onTrue),\n    transitions: ['otherwise', 'build']\n  },\n  otherwise: {\n    handler: (ctx, otherwise) => ctx.otherwise = functionify(otherwise),\n    transitions: ['build']\n  },\n  start: {\n    handler: ctx => ctx.otherwise = () => undefined,\n    transitions: ['isNil', 'then', 'otherwise', 'build'],\n    startState: true\n  }\n}\n\nmodule.exports = fluent.buildFactory(rules).createInstance()\n\n//# sourceURL=webpack:///../../../permian/matcher/src/when.js?");

/***/ }),

/***/ "../../../permian/web-commons/index.js":
/*!*********************************************!*\
  !*** ../../../permian/web-commons/index.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var lang = __webpack_require__(/*! ./lang */ \"../../../permian/web-commons/lang.js\")\nvar matcher = __webpack_require__(/*! @permian/matcher */ \"../../../permian/matcher/index.js\")\n\nmodule.exports = {\n  lang,\n  matcher\n}\n\n//# sourceURL=webpack:///../../../permian/web-commons/index.js?");

/***/ }),

/***/ "../../../permian/web-commons/lang.js":
/*!********************************************!*\
  !*** ../../../permian/web-commons/lang.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var fluent = __webpack_require__(/*! @permian/fluent */ \"../../../permian/fluent/index.js\")\n\nmodule.exports = {\n  isObject: fluent.util.isObject,\n  throwError: fluent.util.throwError\n}\n\n//# sourceURL=webpack:///../../../permian/web-commons/lang.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;