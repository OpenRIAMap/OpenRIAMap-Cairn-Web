var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../config-publication-transport-diagnostics-20261019/node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/process-nextick-args/index.js"(exports, module) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module.exports = { nextTick };
    } else {
      module.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/isarray/index.js
var require_isarray = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/isarray/index.js"(exports, module) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module) {
    module.exports = __require("stream");
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key2 in src) {
        dst[key2] = src[key2];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject2(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject2;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = __require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/inherits/inherits.js"(exports, module) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function") throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = __require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = (function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    })();
    if (util && util.inspect && util.inspect.custom) {
      module.exports.prototype[util.inspect.custom] = function() {
        var obj = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj;
      };
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/util-deprecate/node.js"(exports, module) {
    module.exports = __require("util").deprecate;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current2 = this.bufferedRequest;
      var out = [];
      while (current2) {
        out.push(current2);
        current2 = current2.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ended) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) pna.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key2 in obj) {
        keys2.push(key2);
      }
      return keys2;
    };
    module.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false) this.readable = false;
      if (options && options.writable === false) this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = __require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) stream.emit("error", new Error("stream.unshift() after end event"));
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync) pna.nextTick(emitReadable_, stream);
        else emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) pna.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false) this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ (function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          })(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.head.data;
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      if (n < list.head.data.length) {
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret = list.shift();
      } else {
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;
        else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    module.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/readable-stream/readable.js"(exports, module) {
    var Stream = __require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module.exports = Stream;
      exports = module.exports = Stream.Readable;
      exports.Readable = Stream.Readable;
      exports.Writable = Stream.Writable;
      exports.Duplex = Stream.Duplex;
      exports.Transform = Stream.Transform;
      exports.PassThrough = Stream.PassThrough;
      exports.Stream = Stream;
    } else {
      exports = module.exports = require_stream_readable();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable();
      exports.Duplex = require_stream_duplex();
      exports.Transform = require_stream_transform();
      exports.PassThrough = require_stream_passthrough();
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/support.js
var require_support = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/support.js"(exports) {
    "use strict";
    exports.base64 = true;
    exports.array = true;
    exports.string = true;
    exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    exports.nodebuffer = typeof Buffer !== "undefined";
    exports.uint8array = typeof Uint8Array !== "undefined";
    if (typeof ArrayBuffer === "undefined") {
      exports.blob = false;
    } else {
      buffer = new ArrayBuffer(0);
      try {
        exports.blob = new Blob([buffer], {
          type: "application/zip"
        }).size === 0;
      } catch (e) {
        try {
          Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          builder = new Builder();
          builder.append(buffer);
          exports.blob = builder.getBlob("application/zip").size === 0;
        } catch (e2) {
          exports.blob = false;
        }
      }
    }
    var buffer;
    var Builder;
    var builder;
    try {
      exports.nodestream = !!require_readable().Readable;
    } catch (e) {
      exports.nodestream = false;
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/base64.js
var require_base64 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/base64.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    exports.encode = function(input) {
      var output = [];
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0, len = input.length, remainingBytes = len;
      var isArray = utils.getTypeOf(input) !== "string";
      while (i < input.length) {
        remainingBytes = len - i;
        if (!isArray) {
          chr1 = input.charCodeAt(i++);
          chr2 = i < len ? input.charCodeAt(i++) : 0;
          chr3 = i < len ? input.charCodeAt(i++) : 0;
        } else {
          chr1 = input[i++];
          chr2 = i < len ? input[i++] : 0;
          chr3 = i < len ? input[i++] : 0;
        }
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
        enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
      }
      return output.join("");
    };
    exports.decode = function(input) {
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0, resultIndex = 0;
      var dataUrlPrefix = "data:";
      if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
        throw new Error("Invalid base64 input, it looks like a data url.");
      }
      input = input.replace(/[^A-Za-z0-9+/=]/g, "");
      var totalLength = input.length * 3 / 4;
      if (input.charAt(input.length - 1) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (input.charAt(input.length - 2) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (totalLength % 1 !== 0) {
        throw new Error("Invalid base64 input, bad content length.");
      }
      var output;
      if (support.uint8array) {
        output = new Uint8Array(totalLength | 0);
      } else {
        output = new Array(totalLength | 0);
      }
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output[resultIndex++] = chr1;
        if (enc3 !== 64) {
          output[resultIndex++] = chr2;
        }
        if (enc4 !== 64) {
          output[resultIndex++] = chr3;
        }
      }
      return output;
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejsUtils.js"(exports, module) {
    "use strict";
    module.exports = {
      /**
       * True if this is running in Nodejs, will be undefined in a browser.
       * In a browser, browserify won't include this file and the whole module
       * will be resolved an empty object.
       */
      isNode: typeof Buffer !== "undefined",
      /**
       * Create a new nodejs Buffer from an existing content.
       * @param {Object} data the data to pass to the constructor.
       * @param {String} encoding the encoding to use.
       * @return {Buffer} a new Buffer.
       */
      newBufferFrom: function(data, encoding) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) {
          return Buffer.from(data, encoding);
        } else {
          if (typeof data === "number") {
            throw new Error('The "data" argument must not be a number');
          }
          return new Buffer(data, encoding);
        }
      },
      /**
       * Create a new nodejs Buffer with the specified size.
       * @param {Integer} size the size of the buffer.
       * @return {Buffer} a new Buffer.
       */
      allocBuffer: function(size) {
        if (Buffer.alloc) {
          return Buffer.alloc(size);
        } else {
          var buf = new Buffer(size);
          buf.fill(0);
          return buf;
        }
      },
      /**
       * Find out if an object is a Buffer.
       * @param {Object} b the object to test.
       * @return {Boolean} true if the object is a Buffer, false otherwise.
       */
      isBuffer: function(b) {
        return Buffer.isBuffer(b);
      },
      isStream: function(obj) {
        return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
      }
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/immediate/lib/index.js
var require_lib = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/immediate/lib/index.js"(exports, module) {
    "use strict";
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;
    var scheduleDrain;
    if (process.browser) {
      if (Mutation) {
        called = 0;
        observer = new Mutation(nextTick);
        element = global.document.createTextNode("");
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function() {
          element.data = called = ++called % 2;
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
        channel2 = new global.MessageChannel();
        channel2.port1.onmessage = nextTick;
        scheduleDrain = function() {
          channel2.port2.postMessage(0);
        };
      } else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) {
        scheduleDrain = function() {
          var scriptEl = global.document.createElement("script");
          scriptEl.onreadystatechange = function() {
            nextTick();
            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function() {
          setTimeout(nextTick, 0);
        };
      }
    } else {
      scheduleDrain = function() {
        process.nextTick(nextTick);
      };
    }
    var called;
    var observer;
    var element;
    var channel2;
    var draining;
    var queue = [];
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }
    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/lie/lib/index.js
var require_lib2 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/lie/lib/index.js"(exports, module) {
    "use strict";
    var immediate = require_lib();
    function INTERNAL() {
    }
    var handlers = {};
    var REJECTED = ["REJECTED"];
    var FULFILLED = ["FULFILLED"];
    var PENDING = ["PENDING"];
    if (!process.browser) {
      UNHANDLED = ["UNHANDLED"];
    }
    var UNHANDLED;
    module.exports = Promise2;
    function Promise2(resolver) {
      if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function");
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (!process.browser) {
        this.handled = UNHANDLED;
      }
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }
    Promise2.prototype.finally = function(callback) {
      if (typeof callback !== "function") {
        return this;
      }
      var p = this.constructor;
      return this.then(resolve2, reject2);
      function resolve2(value) {
        function yes() {
          return value;
        }
        return p.resolve(callback()).then(yes);
      }
      function reject2(reason) {
        function no() {
          throw reason;
        }
        return p.resolve(callback()).then(no);
      }
    };
    Promise2.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };
    Promise2.prototype.then = function(onFulfilled, onRejected) {
      if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (!process.browser) {
        if (this.handled === UNHANDLED) {
          this.handled = null;
        }
      }
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }
      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === "function") {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === "function") {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function(value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function(value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function(value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function(value) {
      unwrap(this.promise, this.onRejected, value);
    };
    function unwrap(promise, func, value) {
      immediate(function() {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }
    handlers.resolve = function(self2, value) {
      var result = tryCatch(getThen, value);
      if (result.status === "error") {
        return handlers.reject(self2, result.value);
      }
      var thenable = result.value;
      if (thenable) {
        safelyResolveThenable(self2, thenable);
      } else {
        self2.state = FULFILLED;
        self2.outcome = value;
        var i = -1;
        var len = self2.queue.length;
        while (++i < len) {
          self2.queue[i].callFulfilled(value);
        }
      }
      return self2;
    };
    handlers.reject = function(self2, error) {
      self2.state = REJECTED;
      self2.outcome = error;
      if (!process.browser) {
        if (self2.handled === UNHANDLED) {
          immediate(function() {
            if (self2.handled === UNHANDLED) {
              process.emit("unhandledRejection", error, self2);
            }
          });
        }
      }
      var i = -1;
      var len = self2.queue.length;
      while (++i < len) {
        self2.queue[i].callRejected(error);
      }
      return self2;
    };
    function getThen(obj) {
      var then = obj && obj.then;
      if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }
    function safelyResolveThenable(self2, thenable) {
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self2, value);
      }
      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self2, value);
      }
      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }
      var result = tryCatch(tryToUnwrap);
      if (result.status === "error") {
        onError(result.value);
      }
    }
    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = "success";
      } catch (e) {
        out.status = "error";
        out.value = e;
      }
      return out;
    }
    Promise2.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }
    Promise2.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }
    Promise2.all = all;
    function all(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var values2 = new Array(len);
      var resolved2 = 0;
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i2) {
        self2.resolve(value).then(resolveFromAll, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values2[i2] = outValue;
          if (++resolved2 === len && !called) {
            called = true;
            handlers.resolve(promise, values2);
          }
        }
      }
    }
    Promise2.race = race;
    function race(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self2.resolve(value).then(function(response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/external.js
var require_external = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/external.js"(exports, module) {
    "use strict";
    var ES6Promise = null;
    if (typeof Promise !== "undefined") {
      ES6Promise = Promise;
    } else {
      ES6Promise = require_lib2();
    }
    module.exports = {
      Promise: ES6Promise
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/setimmediate/setImmediate.js"(exports) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate) {
        return;
      }
      var nextHandle = 1;
      var tasksByHandle = {};
      var currentlyRunningATask = false;
      var doc = global2.document;
      var registerImmediate;
      function setImmediate2(callback) {
        if (typeof callback !== "function") {
          callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
        }
        var task = { callback, args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(runIfPresent, 0, handle);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              run(task);
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global2.onmessage;
          global2.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global2.postMessage("", "*");
          global2.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
          if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global2.addEventListener) {
          global2.addEventListener("message", onGlobalMessage, false);
        } else {
          global2.attachEvent("onmessage", onGlobalMessage);
        }
        registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel2 = new MessageChannel();
        channel2.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        registerImmediate = function(handle) {
          channel2.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
      if ({}.toString.call(global2.process) === "[object process]") {
        installNextTickImplementation();
      } else if (canUsePostMessage()) {
        installPostMessageImplementation();
      } else if (global2.MessageChannel) {
        installMessageChannelImplementation();
      } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
      } else {
        installSetTimeoutImplementation();
      }
      attachTo.setImmediate = setImmediate2;
      attachTo.clearImmediate = clearImmediate;
    })(typeof self === "undefined" ? typeof global === "undefined" ? exports : global : self);
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/utils.js
var require_utils = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/utils.js"(exports) {
    "use strict";
    var support = require_support();
    var base64 = require_base64();
    var nodejsUtils = require_nodejsUtils();
    var external = require_external();
    require_setImmediate();
    function string2binary(str) {
      var result = null;
      if (support.uint8array) {
        result = new Uint8Array(str.length);
      } else {
        result = new Array(str.length);
      }
      return stringToArrayLike(str, result);
    }
    exports.newBlob = function(part, type) {
      exports.checkSupport("blob");
      try {
        return new Blob([part], {
          type
        });
      } catch (e) {
        try {
          var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          var builder = new Builder();
          builder.append(part);
          return builder.getBlob(type);
        } catch (e2) {
          throw new Error("Bug : can't construct the Blob.");
        }
      }
    };
    function identity2(input) {
      return input;
    }
    function stringToArrayLike(str, array) {
      for (var i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i) & 255;
      }
      return array;
    }
    var arrayToStringHelper = {
      /**
       * Transform an array of int into a string, chunk by chunk.
       * See the performances notes on arrayLikeToString.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @param {String} type the type of the array.
       * @param {Integer} chunk the chunk size.
       * @return {String} the resulting string.
       * @throws Error if the chunk is too big for the stack.
       */
      stringifyByChunk: function(array, type, chunk) {
        var result = [], k = 0, len = array.length;
        if (len <= chunk) {
          return String.fromCharCode.apply(null, array);
        }
        while (k < len) {
          if (type === "array" || type === "nodebuffer") {
            result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
          } else {
            result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
          }
          k += chunk;
        }
        return result.join("");
      },
      /**
       * Call String.fromCharCode on every item in the array.
       * This is the naive implementation, which generate A LOT of intermediate string.
       * This should be used when everything else fail.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      stringifyByChar: function(array) {
        var resultStr = "";
        for (var i = 0; i < array.length; i++) {
          resultStr += String.fromCharCode(array[i]);
        }
        return resultStr;
      },
      applyCanBeUsed: {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array: (function() {
          try {
            return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch (e) {
            return false;
          }
        })(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer: (function() {
          try {
            return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
          } catch (e) {
            return false;
          }
        })()
      }
    };
    function arrayLikeToString(array) {
      var chunk = 65536, type = exports.getTypeOf(array), canUseApply = true;
      if (type === "uint8array") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
      } else if (type === "nodebuffer") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
      }
      if (canUseApply) {
        while (chunk > 1) {
          try {
            return arrayToStringHelper.stringifyByChunk(array, type, chunk);
          } catch (e) {
            chunk = Math.floor(chunk / 2);
          }
        }
      }
      return arrayToStringHelper.stringifyByChar(array);
    }
    exports.applyFromCharCode = arrayLikeToString;
    function arrayLikeToArrayLike(arrayFrom, arrayTo) {
      for (var i = 0; i < arrayFrom.length; i++) {
        arrayTo[i] = arrayFrom[i];
      }
      return arrayTo;
    }
    var transform = {};
    transform["string"] = {
      "string": identity2,
      "array": function(input) {
        return stringToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["string"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": function(input) {
        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
      }
    };
    transform["array"] = {
      "string": arrayLikeToString,
      "array": identity2,
      "arraybuffer": function(input) {
        return new Uint8Array(input).buffer;
      },
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["arraybuffer"] = {
      "string": function(input) {
        return arrayLikeToString(new Uint8Array(input));
      },
      "array": function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
      },
      "arraybuffer": identity2,
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(new Uint8Array(input));
      }
    };
    transform["uint8array"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return input.buffer;
      },
      "uint8array": identity2,
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["nodebuffer"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["nodebuffer"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": identity2
    };
    exports.transformTo = function(outputType, input) {
      if (!input) {
        input = "";
      }
      if (!outputType) {
        return input;
      }
      exports.checkSupport(outputType);
      var inputType = exports.getTypeOf(input);
      var result = transform[inputType][outputType](input);
      return result;
    };
    exports.resolve = function(path2) {
      var parts = path2.split("/");
      var result = [];
      for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) {
          continue;
        } else if (part === "..") {
          result.pop();
        } else {
          result.push(part);
        }
      }
      return result.join("/");
    };
    exports.getTypeOf = function(input) {
      if (typeof input === "string") {
        return "string";
      }
      if (Object.prototype.toString.call(input) === "[object Array]") {
        return "array";
      }
      if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
        return "nodebuffer";
      }
      if (support.uint8array && input instanceof Uint8Array) {
        return "uint8array";
      }
      if (support.arraybuffer && input instanceof ArrayBuffer) {
        return "arraybuffer";
      }
    };
    exports.checkSupport = function(type) {
      var supported = support[type.toLowerCase()];
      if (!supported) {
        throw new Error(type + " is not supported by this platform");
      }
    };
    exports.MAX_VALUE_16BITS = 65535;
    exports.MAX_VALUE_32BITS = -1;
    exports.pretty = function(str) {
      var res = "", code, i;
      for (i = 0; i < (str || "").length; i++) {
        code = str.charCodeAt(i);
        res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
      }
      return res;
    };
    exports.delay = function(callback, args, self2) {
      setImmediate(function() {
        callback.apply(self2 || null, args || []);
      });
    };
    exports.inherits = function(ctor, superCtor) {
      var Obj = function() {
      };
      Obj.prototype = superCtor.prototype;
      ctor.prototype = new Obj();
    };
    exports.extend = function() {
      var result = {}, i, attr;
      for (i = 0; i < arguments.length; i++) {
        for (attr in arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
            result[attr] = arguments[i][attr];
          }
        }
      }
      return result;
    };
    exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
      var promise = external.Promise.resolve(inputData).then(function(data) {
        var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);
        if (isBlob && typeof FileReader !== "undefined") {
          return new external.Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) {
              resolve(e.target.result);
            };
            reader.onerror = function(e) {
              reject(e.target.error);
            };
            reader.readAsArrayBuffer(data);
          });
        } else {
          return data;
        }
      });
      return promise.then(function(data) {
        var dataType = exports.getTypeOf(data);
        if (!dataType) {
          return external.Promise.reject(
            new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
          );
        }
        if (dataType === "arraybuffer") {
          data = exports.transformTo("uint8array", data);
        } else if (dataType === "string") {
          if (isBase64) {
            data = base64.decode(data);
          } else if (isBinary) {
            if (isOptimizedBinaryString !== true) {
              data = string2binary(data);
            }
          }
        }
        return data;
      });
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/GenericWorker.js"(exports, module) {
    "use strict";
    function GenericWorker(name) {
      this.name = name || "default";
      this.streamInfo = {};
      this.generatedError = null;
      this.extraStreamInfo = {};
      this.isPaused = true;
      this.isFinished = false;
      this.isLocked = false;
      this._listeners = {
        "data": [],
        "end": [],
        "error": []
      };
      this.previous = null;
    }
    GenericWorker.prototype = {
      /**
       * Push a chunk to the next workers.
       * @param {Object} chunk the chunk to push
       */
      push: function(chunk) {
        this.emit("data", chunk);
      },
      /**
       * End the stream.
       * @return {Boolean} true if this call ended the worker, false otherwise.
       */
      end: function() {
        if (this.isFinished) {
          return false;
        }
        this.flush();
        try {
          this.emit("end");
          this.cleanUp();
          this.isFinished = true;
        } catch (e) {
          this.emit("error", e);
        }
        return true;
      },
      /**
       * End the stream with an error.
       * @param {Error} e the error which caused the premature end.
       * @return {Boolean} true if this call ended the worker with an error, false otherwise.
       */
      error: function(e) {
        if (this.isFinished) {
          return false;
        }
        if (this.isPaused) {
          this.generatedError = e;
        } else {
          this.isFinished = true;
          this.emit("error", e);
          if (this.previous) {
            this.previous.error(e);
          }
          this.cleanUp();
        }
        return true;
      },
      /**
       * Add a callback on an event.
       * @param {String} name the name of the event (data, end, error)
       * @param {Function} listener the function to call when the event is triggered
       * @return {GenericWorker} the current object for chainability
       */
      on: function(name, listener) {
        this._listeners[name].push(listener);
        return this;
      },
      /**
       * Clean any references when a worker is ending.
       */
      cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
        this._listeners = [];
      },
      /**
       * Trigger an event. This will call registered callback with the provided arg.
       * @param {String} name the name of the event (data, end, error)
       * @param {Object} arg the argument to call the callback with.
       */
      emit: function(name, arg) {
        if (this._listeners[name]) {
          for (var i = 0; i < this._listeners[name].length; i++) {
            this._listeners[name][i].call(this, arg);
          }
        }
      },
      /**
       * Chain a worker with an other.
       * @param {Worker} next the worker receiving events from the current one.
       * @return {worker} the next worker for chainability
       */
      pipe: function(next) {
        return next.registerPrevious(this);
      },
      /**
       * Same as `pipe` in the other direction.
       * Using an API with `pipe(next)` is very easy.
       * Implementing the API with the point of view of the next one registering
       * a source is easier, see the ZipFileWorker.
       * @param {Worker} previous the previous worker, sending events to this one
       * @return {Worker} the current worker for chainability
       */
      registerPrevious: function(previous) {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.streamInfo = previous.streamInfo;
        this.mergeStreamInfo();
        this.previous = previous;
        var self2 = this;
        previous.on("data", function(chunk) {
          self2.processChunk(chunk);
        });
        previous.on("end", function() {
          self2.end();
        });
        previous.on("error", function(e) {
          self2.error(e);
        });
        return this;
      },
      /**
       * Pause the stream so it doesn't send events anymore.
       * @return {Boolean} true if this call paused the worker, false otherwise.
       */
      pause: function() {
        if (this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = true;
        if (this.previous) {
          this.previous.pause();
        }
        return true;
      },
      /**
       * Resume a paused stream.
       * @return {Boolean} true if this call resumed the worker, false otherwise.
       */
      resume: function() {
        if (!this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = false;
        var withError = false;
        if (this.generatedError) {
          this.error(this.generatedError);
          withError = true;
        }
        if (this.previous) {
          this.previous.resume();
        }
        return !withError;
      },
      /**
       * Flush any remaining bytes as the stream is ending.
       */
      flush: function() {
      },
      /**
       * Process a chunk. This is usually the method overridden.
       * @param {Object} chunk the chunk to process.
       */
      processChunk: function(chunk) {
        this.push(chunk);
      },
      /**
       * Add a key/value to be added in the workers chain streamInfo once activated.
       * @param {String} key the key to use
       * @param {Object} value the associated value
       * @return {Worker} the current worker for chainability
       */
      withStreamInfo: function(key2, value) {
        this.extraStreamInfo[key2] = value;
        this.mergeStreamInfo();
        return this;
      },
      /**
       * Merge this worker's streamInfo into the chain's streamInfo.
       */
      mergeStreamInfo: function() {
        for (var key2 in this.extraStreamInfo) {
          if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key2)) {
            continue;
          }
          this.streamInfo[key2] = this.extraStreamInfo[key2];
        }
      },
      /**
       * Lock the stream to prevent further updates on the workers chain.
       * After calling this method, all calls to pipe will fail.
       */
      lock: function() {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.isLocked = true;
        if (this.previous) {
          this.previous.lock();
        }
      },
      /**
       *
       * Pretty print the workers chain.
       */
      toString: function() {
        var me = "Worker " + this.name;
        if (this.previous) {
          return this.previous + " -> " + me;
        } else {
          return me;
        }
      }
    };
    module.exports = GenericWorker;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/utf8.js
var require_utf8 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/utf8.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var nodejsUtils = require_nodejsUtils();
    var GenericWorker = require_GenericWorker();
    var _utf8len = new Array(256);
    for (i = 0; i < 256; i++) {
      _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
    }
    var i;
    _utf8len[254] = _utf8len[254] = 1;
    var string2buf = function(str) {
      var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      if (support.uint8array) {
        buf = new Uint8Array(buf_len);
      } else {
        buf = new Array(buf_len);
      }
      for (i2 = 0, m_pos = 0; i2 < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i2++] = c;
        } else if (c < 2048) {
          buf[i2++] = 192 | c >>> 6;
          buf[i2++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i2++] = 224 | c >>> 12;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        } else {
          buf[i2++] = 240 | c >>> 18;
          buf[i2++] = 128 | c >>> 12 & 63;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        }
      }
      return buf;
    };
    var utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
    var buf2string = function(buf) {
      var i2, out, c, c_len;
      var len = buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i2 = 0; i2 < len; ) {
        c = buf[i2++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i2 += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i2 < len) {
          c = c << 6 | buf[i2++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      if (utf16buf.length !== out) {
        if (utf16buf.subarray) {
          utf16buf = utf16buf.subarray(0, out);
        } else {
          utf16buf.length = out;
        }
      }
      return utils.applyFromCharCode(utf16buf);
    };
    exports.utf8encode = function utf8encode(str) {
      if (support.nodebuffer) {
        return nodejsUtils.newBufferFrom(str, "utf-8");
      }
      return string2buf(str);
    };
    exports.utf8decode = function utf8decode(buf) {
      if (support.nodebuffer) {
        return utils.transformTo("nodebuffer", buf).toString("utf-8");
      }
      buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
      return buf2string(buf);
    };
    function Utf8DecodeWorker() {
      GenericWorker.call(this, "utf-8 decode");
      this.leftOver = null;
    }
    utils.inherits(Utf8DecodeWorker, GenericWorker);
    Utf8DecodeWorker.prototype.processChunk = function(chunk) {
      var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
      if (this.leftOver && this.leftOver.length) {
        if (support.uint8array) {
          var previousData = data;
          data = new Uint8Array(previousData.length + this.leftOver.length);
          data.set(this.leftOver, 0);
          data.set(previousData, this.leftOver.length);
        } else {
          data = this.leftOver.concat(data);
        }
        this.leftOver = null;
      }
      var nextBoundary = utf8border(data);
      var usableData = data;
      if (nextBoundary !== data.length) {
        if (support.uint8array) {
          usableData = data.subarray(0, nextBoundary);
          this.leftOver = data.subarray(nextBoundary, data.length);
        } else {
          usableData = data.slice(0, nextBoundary);
          this.leftOver = data.slice(nextBoundary, data.length);
        }
      }
      this.push({
        data: exports.utf8decode(usableData),
        meta: chunk.meta
      });
    };
    Utf8DecodeWorker.prototype.flush = function() {
      if (this.leftOver && this.leftOver.length) {
        this.push({
          data: exports.utf8decode(this.leftOver),
          meta: {}
        });
        this.leftOver = null;
      }
    };
    exports.Utf8DecodeWorker = Utf8DecodeWorker;
    function Utf8EncodeWorker() {
      GenericWorker.call(this, "utf-8 encode");
    }
    utils.inherits(Utf8EncodeWorker, GenericWorker);
    Utf8EncodeWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: exports.utf8encode(chunk.data),
        meta: chunk.meta
      });
    };
    exports.Utf8EncodeWorker = Utf8EncodeWorker;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/ConvertWorker.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var utils = require_utils();
    function ConvertWorker(destType) {
      GenericWorker.call(this, "ConvertWorker to " + destType);
      this.destType = destType;
    }
    utils.inherits(ConvertWorker, GenericWorker);
    ConvertWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: utils.transformTo(this.destType, chunk.data),
        meta: chunk.meta
      });
    };
    module.exports = ConvertWorker;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js"(exports, module) {
    "use strict";
    var Readable = require_readable().Readable;
    var utils = require_utils();
    utils.inherits(NodejsStreamOutputAdapter, Readable);
    function NodejsStreamOutputAdapter(helper, options, updateCb) {
      Readable.call(this, options);
      this._helper = helper;
      var self2 = this;
      helper.on("data", function(data, meta) {
        if (!self2.push(data)) {
          self2._helper.pause();
        }
        if (updateCb) {
          updateCb(meta);
        }
      }).on("error", function(e) {
        self2.emit("error", e);
      }).on("end", function() {
        self2.push(null);
      });
    }
    NodejsStreamOutputAdapter.prototype._read = function() {
      this._helper.resume();
    };
    module.exports = NodejsStreamOutputAdapter;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/StreamHelper.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ConvertWorker = require_ConvertWorker();
    var GenericWorker = require_GenericWorker();
    var base64 = require_base64();
    var support = require_support();
    var external = require_external();
    var NodejsStreamOutputAdapter = null;
    if (support.nodestream) {
      try {
        NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
      } catch (e) {
      }
    }
    function transformZipOutput(type, content, mimeType) {
      switch (type) {
        case "blob":
          return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
        case "base64":
          return base64.encode(content);
        default:
          return utils.transformTo(type, content);
      }
    }
    function concat(type, dataArray) {
      var i, index = 0, res = null, totalLength = 0;
      for (i = 0; i < dataArray.length; i++) {
        totalLength += dataArray[i].length;
      }
      switch (type) {
        case "string":
          return dataArray.join("");
        case "array":
          return Array.prototype.concat.apply([], dataArray);
        case "uint8array":
          res = new Uint8Array(totalLength);
          for (i = 0; i < dataArray.length; i++) {
            res.set(dataArray[i], index);
            index += dataArray[i].length;
          }
          return res;
        case "nodebuffer":
          return Buffer.concat(dataArray);
        default:
          throw new Error("concat : unsupported type '" + type + "'");
      }
    }
    function accumulate(helper, updateCallback) {
      return new external.Promise(function(resolve, reject) {
        var dataArray = [];
        var chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
        helper.on("data", function(data, meta) {
          dataArray.push(data);
          if (updateCallback) {
            updateCallback(meta);
          }
        }).on("error", function(err) {
          dataArray = [];
          reject(err);
        }).on("end", function() {
          try {
            var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
            resolve(result);
          } catch (e) {
            reject(e);
          }
          dataArray = [];
        }).resume();
      });
    }
    function StreamHelper(worker, outputType, mimeType) {
      var internalType = outputType;
      switch (outputType) {
        case "blob":
        case "arraybuffer":
          internalType = "uint8array";
          break;
        case "base64":
          internalType = "string";
          break;
      }
      try {
        this._internalType = internalType;
        this._outputType = outputType;
        this._mimeType = mimeType;
        utils.checkSupport(internalType);
        this._worker = worker.pipe(new ConvertWorker(internalType));
        worker.lock();
      } catch (e) {
        this._worker = new GenericWorker("error");
        this._worker.error(e);
      }
    }
    StreamHelper.prototype = {
      /**
       * Listen a StreamHelper, accumulate its content and concatenate it into a
       * complete block.
       * @param {Function} updateCb the update callback.
       * @return Promise the promise for the accumulation.
       */
      accumulate: function(updateCb) {
        return accumulate(this, updateCb);
      },
      /**
       * Add a listener on an event triggered on a stream.
       * @param {String} evt the name of the event
       * @param {Function} fn the listener
       * @return {StreamHelper} the current helper.
       */
      on: function(evt, fn) {
        var self2 = this;
        if (evt === "data") {
          this._worker.on(evt, function(chunk) {
            fn.call(self2, chunk.data, chunk.meta);
          });
        } else {
          this._worker.on(evt, function() {
            utils.delay(fn, arguments, self2);
          });
        }
        return this;
      },
      /**
       * Resume the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      resume: function() {
        utils.delay(this._worker.resume, [], this._worker);
        return this;
      },
      /**
       * Pause the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      pause: function() {
        this._worker.pause();
        return this;
      },
      /**
       * Return a nodejs stream for this helper.
       * @param {Function} updateCb the update callback.
       * @return {NodejsStreamOutputAdapter} the nodejs stream.
       */
      toNodejsStream: function(updateCb) {
        utils.checkSupport("nodestream");
        if (this._outputType !== "nodebuffer") {
          throw new Error(this._outputType + " is not supported by this method");
        }
        return new NodejsStreamOutputAdapter(this, {
          objectMode: this._outputType !== "nodebuffer"
        }, updateCb);
      }
    };
    module.exports = StreamHelper;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/defaults.js
var require_defaults = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/defaults.js"(exports) {
    "use strict";
    exports.base64 = false;
    exports.binary = false;
    exports.dir = false;
    exports.createFolders = true;
    exports.date = null;
    exports.compression = null;
    exports.compressionOptions = null;
    exports.comment = null;
    exports.unixPermissions = null;
    exports.dosPermissions = null;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/DataWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var DEFAULT_BLOCK_SIZE = 16 * 1024;
    function DataWorker(dataP) {
      GenericWorker.call(this, "DataWorker");
      var self2 = this;
      this.dataIsReady = false;
      this.index = 0;
      this.max = 0;
      this.data = null;
      this.type = "";
      this._tickScheduled = false;
      dataP.then(function(data) {
        self2.dataIsReady = true;
        self2.data = data;
        self2.max = data && data.length || 0;
        self2.type = utils.getTypeOf(data);
        if (!self2.isPaused) {
          self2._tickAndRepeat();
        }
      }, function(e) {
        self2.error(e);
      });
    }
    utils.inherits(DataWorker, GenericWorker);
    DataWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this.data = null;
    };
    DataWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this._tickScheduled && this.dataIsReady) {
        this._tickScheduled = true;
        utils.delay(this._tickAndRepeat, [], this);
      }
      return true;
    };
    DataWorker.prototype._tickAndRepeat = function() {
      this._tickScheduled = false;
      if (this.isPaused || this.isFinished) {
        return;
      }
      this._tick();
      if (!this.isFinished) {
        utils.delay(this._tickAndRepeat, [], this);
        this._tickScheduled = true;
      }
    };
    DataWorker.prototype._tick = function() {
      if (this.isPaused || this.isFinished) {
        return false;
      }
      var size = DEFAULT_BLOCK_SIZE;
      var data = null, nextIndex = Math.min(this.max, this.index + size);
      if (this.index >= this.max) {
        return this.end();
      } else {
        switch (this.type) {
          case "string":
            data = this.data.substring(this.index, nextIndex);
            break;
          case "uint8array":
            data = this.data.subarray(this.index, nextIndex);
            break;
          case "array":
          case "nodebuffer":
            data = this.data.slice(this.index, nextIndex);
            break;
        }
        this.index = nextIndex;
        return this.push({
          data,
          meta: {
            percent: this.max ? this.index / this.max * 100 : 0
          }
        });
      }
    };
    module.exports = DataWorker;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/crc32.js
var require_crc32 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/crc32.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    function crc32str(crc, str, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
      }
      return crc ^ -1;
    }
    module.exports = function crc32wrapper(input, crc) {
      if (typeof input === "undefined" || !input.length) {
        return 0;
      }
      var isArray = utils.getTypeOf(input) !== "string";
      if (isArray) {
        return crc32(crc | 0, input, input.length, 0);
      } else {
        return crc32str(crc | 0, input, input.length, 0);
      }
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/Crc32Probe.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var crc32 = require_crc32();
    var utils = require_utils();
    function Crc32Probe() {
      GenericWorker.call(this, "Crc32Probe");
      this.withStreamInfo("crc32", 0);
    }
    utils.inherits(Crc32Probe, GenericWorker);
    Crc32Probe.prototype.processChunk = function(chunk) {
      this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
      this.push(chunk);
    };
    module.exports = Crc32Probe;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/stream/DataLengthProbe.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function DataLengthProbe(propName) {
      GenericWorker.call(this, "DataLengthProbe for " + propName);
      this.propName = propName;
      this.withStreamInfo(propName, 0);
    }
    utils.inherits(DataLengthProbe, GenericWorker);
    DataLengthProbe.prototype.processChunk = function(chunk) {
      if (chunk) {
        var length = this.streamInfo[this.propName] || 0;
        this.streamInfo[this.propName] = length + chunk.data.length;
      }
      GenericWorker.prototype.processChunk.call(this, chunk);
    };
    module.exports = DataLengthProbe;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/compressedObject.js
var require_compressedObject = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/compressedObject.js"(exports, module) {
    "use strict";
    var external = require_external();
    var DataWorker = require_DataWorker();
    var Crc32Probe = require_Crc32Probe();
    var DataLengthProbe = require_DataLengthProbe();
    function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
      this.compressedSize = compressedSize;
      this.uncompressedSize = uncompressedSize;
      this.crc32 = crc32;
      this.compression = compression;
      this.compressedContent = data;
    }
    CompressedObject.prototype = {
      /**
       * Create a worker to get the uncompressed content.
       * @return {GenericWorker} the worker.
       */
      getContentWorker: function() {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
        var that = this;
        worker.on("end", function() {
          if (this.streamInfo["data_length"] !== that.uncompressedSize) {
            throw new Error("Bug : uncompressed data size mismatch");
          }
        });
        return worker;
      },
      /**
       * Create a worker to get the compressed content.
       * @return {GenericWorker} the worker.
       */
      getCompressedWorker: function() {
        return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      }
    };
    CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
      return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
    };
    module.exports = CompressedObject;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipObject.js
var require_zipObject = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipObject.js"(exports, module) {
    "use strict";
    var StreamHelper = require_StreamHelper();
    var DataWorker = require_DataWorker();
    var utf8 = require_utf8();
    var CompressedObject = require_compressedObject();
    var GenericWorker = require_GenericWorker();
    var ZipObject = function(name, data, options) {
      this.name = name;
      this.dir = options.dir;
      this.date = options.date;
      this.comment = options.comment;
      this.unixPermissions = options.unixPermissions;
      this.dosPermissions = options.dosPermissions;
      this._data = data;
      this._dataBinary = options.binary;
      this.options = {
        compression: options.compression,
        compressionOptions: options.compressionOptions
      };
    };
    ZipObject.prototype = {
      /**
       * Create an internal stream for the content of this object.
       * @param {String} type the type of each chunk.
       * @return StreamHelper the stream.
       */
      internalStream: function(type) {
        var result = null, outputType = "string";
        try {
          if (!type) {
            throw new Error("No output type specified.");
          }
          outputType = type.toLowerCase();
          var askUnicodeString = outputType === "string" || outputType === "text";
          if (outputType === "binarystring" || outputType === "text") {
            outputType = "string";
          }
          result = this._decompressWorker();
          var isUnicodeString = !this._dataBinary;
          if (isUnicodeString && !askUnicodeString) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          if (!isUnicodeString && askUnicodeString) {
            result = result.pipe(new utf8.Utf8DecodeWorker());
          }
        } catch (e) {
          result = new GenericWorker("error");
          result.error(e);
        }
        return new StreamHelper(result, outputType, "");
      },
      /**
       * Prepare the content in the asked type.
       * @param {String} type the type of the result.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Promise the promise of the result.
       */
      async: function(type, onUpdate) {
        return this.internalStream(type).accumulate(onUpdate);
      },
      /**
       * Prepare the content as a nodejs stream.
       * @param {String} type the type of each chunk.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Stream the stream.
       */
      nodeStream: function(type, onUpdate) {
        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
      },
      /**
       * Return a worker for the compressed content.
       * @private
       * @param {Object} compression the compression object to use.
       * @param {Object} compressionOptions the options to use when compressing.
       * @return Worker the worker.
       */
      _compressWorker: function(compression, compressionOptions) {
        if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) {
          return this._data.getCompressedWorker();
        } else {
          var result = this._decompressWorker();
          if (!this._dataBinary) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
        }
      },
      /**
       * Return a worker for the decompressed content.
       * @private
       * @return Worker the worker.
       */
      _decompressWorker: function() {
        if (this._data instanceof CompressedObject) {
          return this._data.getContentWorker();
        } else if (this._data instanceof GenericWorker) {
          return this._data;
        } else {
          return new DataWorker(this._data);
        }
      }
    };
    var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
    var removedFn = function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    };
    for (i = 0; i < removedMethods.length; i++) {
      ZipObject.prototype[removedMethods[i]] = removedFn;
    }
    var i;
    module.exports = ZipObject;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/utils/common.js"(exports) {
    "use strict";
    var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
    function _has(obj, key2) {
      return Object.prototype.hasOwnProperty.call(obj, key2);
    }
    exports.assign = function(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        var source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (var p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    };
    exports.shrinkBuf = function(buf, size) {
      if (buf.length === size) {
        return buf;
      }
      if (buf.subarray) {
        return buf.subarray(0, size);
      }
      buf.length = size;
      return buf;
    };
    var fnTyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
          return;
        }
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
        len = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          len += chunks[i].length;
        }
        result = new Uint8Array(len);
        pos = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          chunk = chunks[i];
          result.set(chunk, pos);
          pos += chunk.length;
        }
        return result;
      }
    };
    var fnUntyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    exports.setTyped = function(on) {
      if (on) {
        exports.Buf8 = Uint8Array;
        exports.Buf16 = Uint16Array;
        exports.Buf32 = Int32Array;
        exports.assign(exports, fnTyped);
      } else {
        exports.Buf8 = Array;
        exports.Buf16 = Array;
        exports.Buf32 = Array;
        exports.assign(exports, fnUntyped);
      }
    };
    exports.setTyped(TYPED_OK);
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/trees.js"(exports) {
    "use strict";
    var utils = require_common();
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = (
      /* extra bits for each length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    );
    var extra_dbits = (
      /* extra bits for each distance code */
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    );
    var extra_blbits = (
      /* extra bits for each bit length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    );
    var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value, length) {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }
    function send_code(s, c, tree) {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree;
      var max_code = desc.max_code;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var extra = desc.stat_desc.extra_bits;
      var base = desc.stat_desc.extra_base;
      var max_length = desc.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1);
      var code = 0;
      var bits;
      var n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    function tr_static_init() {
      var n;
      var bits;
      var length;
      var code;
      var dist;
      var bl_count = new Array(MAX_BITS + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s);
      if (header) {
        put_short(s, len);
        put_short(s, ~len);
      }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
      s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2;
      var _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k) {
      var v = s.heap[k];
      var j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (s.last_lit !== 0) {
        do {
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
          lc = s.pending_buf[s.l_buf + lx];
          lx++;
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (lx < s.last_lit);
      }
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var elems = desc.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree(s) {
      var max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447;
      var n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }
    var static_init_done = false;
    function _tr_init(s) {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      copy_block(s, buf, stored_len, true);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }
    function _tr_tally(s, dist, lc) {
      s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
      s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
      s.last_lit++;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.last_lit === s.lit_bufsize - 1;
    }
    exports._tr_init = _tr_init;
    exports._tr_stored_block = _tr_stored_block;
    exports._tr_flush_block = _tr_flush_block;
    exports._tr_tally = _tr_tally;
    exports._tr_align = _tr_align;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/adler32.js"(exports, module) {
    "use strict";
    function adler32(adler, buf, len, pos) {
      var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    module.exports = adler32;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/crc32.js"(exports, module) {
    "use strict";
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    module.exports = crc32;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/messages.js"(exports, module) {
    "use strict";
    module.exports = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/deflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var trees = require_trees();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var msg = require_messages();
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED = 4;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_UNKNOWN = 2;
    var Z_DEFLATED = 8;
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    function err(strm, errorCode) {
      strm.msg = msg[errorCode];
      return errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    function flush_pending(strm) {
      var s = strm.state;
      var len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }
    function flush_block_only(s, last) {
      trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      utils.arraySet(buf, strm.input, strm.next_in, len, start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length;
      var scan = s.strstart;
      var match;
      var len;
      var best_len = s.prev_length;
      var nice_match = s.nice_match;
      var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      var _win = s.window;
      var wmask = s.w_mask;
      var prev = s.prev;
      var strend = s.strstart + MAX_MATCH;
      var scan_end1 = _win[scan + best_len - 1];
      var scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size;
      var p, n, m, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          n = s.hash_size;
          p = n;
          do {
            m = s.head[--p];
            s.head[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          n = _w_size;
          p = n;
          do {
            m = s.prev[--p];
            s.prev[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
          while (s.insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5;
      }
      for (; ; ) {
        if (s.lookahead <= 1) {
          fill_window(s);
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.strstart += s.lookahead;
        s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
          s.lookahead = s.strstart - max_start;
          s.strstart = max_start;
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.strstart > s.block_start) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_NEED_MORE;
    }
    function deflate_fast(s, flush) {
      var hash_head;
      var bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
          }
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      var hash_head;
      var bflush;
      var max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      var bflush;
      var prev;
      var scan, strend;
      var _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      var bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table;
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new utils.Buf16(MAX_BITS + 1);
      this.heap = new utils.Buf16(2 * L_CODES + 1);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new utils.Buf16(2 * L_CODES + 1);
      zero(this.depth);
      this.l_buf = 0;
      this.lit_bufsize = 0;
      this.last_lit = 0;
      this.d_buf = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = s.wrap ? INIT_STATE : BUSY_STATE;
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = Z_NO_FLUSH;
      trees._tr_init(s);
      return Z_OK;
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    }
    function deflateSetHeader(strm, head) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      if (strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      var wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      var s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new utils.Buf8(s.w_size * 2);
      s.head = new utils.Buf16(s.hash_size);
      s.prev = new utils.Buf16(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new utils.Buf8(s.pending_buf_size);
      s.d_buf = 1 * s.lit_bufsize;
      s.l_buf = (1 + 2) * s.lit_bufsize;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate(strm, flush) {
      var old_flush, s;
      var beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      s = strm.state;
      if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      s.strm = strm;
      old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
          } else {
            put_byte(
              s,
              (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
            );
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        } else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          var level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          s.status = BUSY_STATE;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          beg = s.pending;
          while (s.gzindex < (s.gzhead.extra.length & 65535)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                break;
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
            s.gzindex++;
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0;
            s.status = NAME_STATE;
          }
        } else {
          s.status = NAME_STATE;
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.gzindex = 0;
            s.status = COMMENT_STATE;
          }
        } else {
          s.status = COMMENT_STATE;
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.status = HCRC_STATE;
          }
        } else {
          s.status = HCRC_STATE;
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
            s.status = BUSY_STATE;
          }
        } else {
          s.status = BUSY_STATE;
        }
      }
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees._tr_align(s);
          } else if (flush !== Z_BLOCK) {
            trees._tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }
    function deflateEnd(strm) {
      var status;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      status = strm.state.status;
      if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var s;
      var str, n;
      var wrap;
      var avail;
      var next;
      var input;
      var tmpDict;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      s = strm.state;
      wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        tmpDict = new utils.Buf8(s.w_size);
        utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      avail = strm.avail_in;
      next = strm.next_in;
      input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        str = s.strstart;
        n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK;
    }
    exports.deflateInit = deflateInit;
    exports.deflateInit2 = deflateInit2;
    exports.deflateReset = deflateReset;
    exports.deflateResetKeep = deflateResetKeep;
    exports.deflateSetHeader = deflateSetHeader;
    exports.deflate = deflate;
    exports.deflateEnd = deflateEnd;
    exports.deflateSetDictionary = deflateSetDictionary;
    exports.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/utils/strings.js"(exports) {
    "use strict";
    var utils = require_common();
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (__) {
      STR_APPLY_OK = false;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new utils.Buf8(256);
    for (q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    var q;
    _utf8len[254] = _utf8len[254] = 1;
    exports.string2buf = function(str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new utils.Buf8(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
      var result = "";
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }
    exports.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    exports.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i = 0, len = buf.length; i < len; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    };
    exports.buf2string = function(buf, max) {
      var i, out, c, c_len;
      var len = max || buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    exports.utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/zstream.js"(exports, module) {
    "use strict";
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    module.exports = ZStream;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/deflate.js"(exports) {
    "use strict";
    var zlib_deflate = require_deflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var toString = Object.prototype.toString;
    var Z_NO_FLUSH = 0;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_SYNC_FLUSH = 2;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate)) return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        var dict;
        if (typeof opt.dictionary === "string") {
          dict = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_deflate.deflate(strm, _mode);
        if (status !== Z_STREAM_END && status !== Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      if (_mode === Z_FINISH) {
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }
      if (_mode === Z_SYNC_FLUSH) {
        this.onEnd(Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      var deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate(input, options);
    }
    exports.Deflate = Deflate;
    exports.deflate = deflate;
    exports.deflateRaw = deflateRaw;
    exports.gzip = gzip;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inffast.js"(exports, module) {
    "use strict";
    var BAD = 30;
    var TYPE = 12;
    module.exports = function inflate_fast(strm, start) {
      var state;
      var _in;
      var last;
      var _out;
      var beg;
      var end;
      var dmax;
      var wsize;
      var whave;
      var wnext;
      var s_window;
      var hold;
      var bits;
      var lcode;
      var dcode;
      var lmask;
      var dmask;
      var here;
      var op;
      var len;
      var dist;
      var from;
      var from_source;
      var input, output;
      state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
    "use strict";
    var utils = require_common();
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = [
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ];
    var lext = [
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ];
    var dbase = [
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ];
    var dext = [
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits;
      var len = 0;
      var sym = 0;
      var min = 0, max = 0;
      var root = 0;
      var curr = 0;
      var drop = 0;
      var left = 0;
      var used = 0;
      var huff = 0;
      var incr;
      var fill;
      var low;
      var mask;
      var next;
      var base = null;
      var base_index = 0;
      var end;
      var count = new utils.Buf16(MAXBITS + 1);
      var offs = new utils.Buf16(MAXBITS + 1);
      var extra = null;
      var extra_index = 0;
      var here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root < min) {
        root = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base = extra = work;
        end = 19;
      } else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
      } else {
        base = dbase;
        extra = dext;
        end = -1;
      }
      huff = 0;
      sym = 0;
      len = min;
      next = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base[base_index + work[sym]];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/inflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var inflate_fast = require_inffast();
    var inflate_table = require_inftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_TREES = 6;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR = -5;
    var Z_DEFLATED = 8;
    var HEAD = 1;
    var FLAGS = 2;
    var TIME = 3;
    var OS = 4;
    var EXLEN = 5;
    var EXTRA = 6;
    var NAME = 7;
    var COMMENT = 8;
    var HCRC = 9;
    var DICTID = 10;
    var DICT = 11;
    var TYPE = 12;
    var TYPEDO = 13;
    var STORED = 14;
    var COPY_ = 15;
    var COPY = 16;
    var TABLE = 17;
    var LENLENS = 18;
    var CODELENS = 19;
    var LEN_ = 20;
    var LEN = 21;
    var LENEXT = 22;
    var DIST = 23;
    var DISTEXT = 24;
    var MATCH = 25;
    var LIT = 26;
    var CHECK = 27;
    var LENGTH = 28;
    var DONE = 29;
    var BAD = 30;
    var MEM = 31;
    var SYNC = 32;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new utils.Buf16(320);
      this.work = new utils.Buf16(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    }
    function inflateReset(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }
    function inflateReset2(strm, windowBits) {
      var wrap;
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      state = new InflateState();
      strm.state = state;
      state.window = null;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = true;
    var lenfix;
    var distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy) {
      var dist;
      var state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new utils.Buf8(state.wsize);
      }
      if (copy >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        utils.arraySet(state.window, src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
          utils.arraySet(state.window, src, end - copy, copy, 0);
          state.wnext = copy;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }
    function inflate(strm, flush) {
      var state;
      var input, output;
      var next;
      var put;
      var have, left;
      var hold;
      var bits;
      var _in, _out;
      var copy;
      var from;
      var from_source;
      var here = 0;
      var here_bits, here_op, here_val;
      var last_bits, last_op, last_val;
      var len;
      var ret;
      var hbuf = new utils.Buf8(4);
      var opts;
      var n;
      var order = (
        /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
      );
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              } else if (len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            /* falls through */
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            /* falls through */
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                utils.arraySet(output, input, next, copy, put);
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                  state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var state;
      var dictid;
      var ret;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    }
    exports.inflateReset = inflateReset;
    exports.inflateReset2 = inflateReset2;
    exports.inflateResetKeep = inflateResetKeep;
    exports.inflateInit = inflateInit;
    exports.inflateInit2 = inflateInit2;
    exports.inflate = inflate;
    exports.inflateEnd = inflateEnd;
    exports.inflateGetHeader = inflateGetHeader;
    exports.inflateSetDictionary = inflateSetDictionary;
    exports.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/zlib/gzheader.js"(exports, module) {
    "use strict";
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    module.exports = GZheader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/lib/inflate.js"(exports) {
    "use strict";
    var zlib_inflate = require_inflate();
    var utils = require_common();
    var strings = require_strings();
    var c = require_constants();
    var msg = require_messages();
    var ZStream = require_zstream();
    var GZheader = require_gzheader();
    var toString = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate)) return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== c.Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var dictionary = this.options.dictionary;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
      var allowBufError = false;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.binstring2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
        if (status === c.Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
        }
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
            if (this.options.to === "string") {
              next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              tail = strm.next_out - next_out_utf8;
              utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) {
                utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
              }
              this.onData(utf8str);
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === c.Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      var inflator = new Inflate(options);
      inflator.push(input, true);
      if (inflator.err) {
        throw inflator.msg || msg[inflator.err];
      }
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    exports.Inflate = Inflate;
    exports.inflate = inflate;
    exports.inflateRaw = inflateRaw;
    exports.ungzip = inflate;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/pako/index.js
var require_pako = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/pako/index.js"(exports, module) {
    "use strict";
    var assign = require_common().assign;
    var deflate = require_deflate2();
    var inflate = require_inflate2();
    var constants = require_constants();
    var pako = {};
    assign(pako, deflate, inflate, constants);
    module.exports = pako;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/flate.js
var require_flate = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/flate.js"(exports) {
    "use strict";
    var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
    var pako = require_pako();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
    exports.magic = "\b\0";
    function FlateWorker(action, options) {
      GenericWorker.call(this, "FlateWorker/" + action);
      this._pako = null;
      this._pakoAction = action;
      this._pakoOptions = options;
      this.meta = {};
    }
    utils.inherits(FlateWorker, GenericWorker);
    FlateWorker.prototype.processChunk = function(chunk) {
      this.meta = chunk.meta;
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
    };
    FlateWorker.prototype.flush = function() {
      GenericWorker.prototype.flush.call(this);
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push([], true);
    };
    FlateWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this._pako = null;
    };
    FlateWorker.prototype._createPako = function() {
      this._pako = new pako[this._pakoAction]({
        raw: true,
        level: this._pakoOptions.level || -1
        // default compression
      });
      var self2 = this;
      this._pako.onData = function(data) {
        self2.push({
          data,
          meta: self2.meta
        });
      };
    };
    exports.compressWorker = function(compressionOptions) {
      return new FlateWorker("Deflate", compressionOptions);
    };
    exports.uncompressWorker = function() {
      return new FlateWorker("Inflate", {});
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/compressions.js
var require_compressions = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/compressions.js"(exports) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    exports.STORE = {
      magic: "\0\0",
      compressWorker: function() {
        return new GenericWorker("STORE compression");
      },
      uncompressWorker: function() {
        return new GenericWorker("STORE decompression");
      }
    };
    exports.DEFLATE = require_flate();
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/signature.js
var require_signature = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/signature.js"(exports) {
    "use strict";
    exports.LOCAL_FILE_HEADER = "PK";
    exports.CENTRAL_FILE_HEADER = "PK";
    exports.CENTRAL_DIRECTORY_END = "PK";
    exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
    exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
    exports.DATA_DESCRIPTOR = "PK\x07\b";
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/generate/ZipFileWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var utf8 = require_utf8();
    var crc32 = require_crc32();
    var signature = require_signature();
    var decToHex = function(dec, bytes) {
      var hex = "", i;
      for (i = 0; i < bytes; i++) {
        hex += String.fromCharCode(dec & 255);
        dec = dec >>> 8;
      }
      return hex;
    };
    var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
      var result = unixPermissions;
      if (!unixPermissions) {
        result = isDir ? 16893 : 33204;
      }
      return (result & 65535) << 16;
    };
    var generateDosExternalFileAttr = function(dosPermissions) {
      return (dosPermissions || 0) & 63;
    };
    var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
      var file = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date;
      var dataInfo = {
        crc32: 0,
        compressedSize: 0,
        uncompressedSize: 0
      };
      if (!streamedContent || streamingEnded) {
        dataInfo.crc32 = streamInfo["crc32"];
        dataInfo.compressedSize = streamInfo["compressedSize"];
        dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
      }
      var bitflag = 0;
      if (streamedContent) {
        bitflag |= 8;
      }
      if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
        bitflag |= 2048;
      }
      var extFileAttr = 0;
      var versionMadeBy = 0;
      if (dir) {
        extFileAttr |= 16;
      }
      if (platform === "UNIX") {
        versionMadeBy = 798;
        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
      } else {
        versionMadeBy = 20;
        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
      }
      dosTime = date.getUTCHours();
      dosTime = dosTime << 6;
      dosTime = dosTime | date.getUTCMinutes();
      dosTime = dosTime << 5;
      dosTime = dosTime | date.getUTCSeconds() / 2;
      dosDate = date.getUTCFullYear() - 1980;
      dosDate = dosDate << 4;
      dosDate = dosDate | date.getUTCMonth() + 1;
      dosDate = dosDate << 5;
      dosDate = dosDate | date.getUTCDate();
      if (useUTF8ForFileName) {
        unicodePathExtraField = // Version
        decToHex(1, 1) + // NameCRC32
        decToHex(crc32(encodedFileName), 4) + // UnicodeName
        utfEncodedFileName;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "up" + // size
        decToHex(unicodePathExtraField.length, 2) + // content
        unicodePathExtraField;
      }
      if (useUTF8ForComment) {
        unicodeCommentExtraField = // Version
        decToHex(1, 1) + // CommentCRC32
        decToHex(crc32(encodedComment), 4) + // UnicodeName
        utfEncodedComment;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "uc" + // size
        decToHex(unicodeCommentExtraField.length, 2) + // content
        unicodeCommentExtraField;
      }
      var header = "";
      header += "\n\0";
      header += decToHex(bitflag, 2);
      header += compression.magic;
      header += decToHex(dosTime, 2);
      header += decToHex(dosDate, 2);
      header += decToHex(dataInfo.crc32, 4);
      header += decToHex(dataInfo.compressedSize, 4);
      header += decToHex(dataInfo.uncompressedSize, 4);
      header += decToHex(encodedFileName.length, 2);
      header += decToHex(extraFields.length, 2);
      var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
      var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
      decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
      header + // file comment length
      decToHex(encodedComment.length, 2) + // disk number start
      "\0\0\0\0" + // external file attributes
      decToHex(extFileAttr, 4) + // relative offset of local header
      decToHex(offset, 4) + // file name
      encodedFileName + // extra field
      extraFields + // file comment
      encodedComment;
      return {
        fileRecord,
        dirRecord
      };
    };
    var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
      var dirEnd = "";
      var encodedComment = utils.transformTo("string", encodeFileName(comment));
      dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
      "\0\0\0\0" + // total number of entries in the central directory on this disk
      decToHex(entriesCount, 2) + // total number of entries in the central directory
      decToHex(entriesCount, 2) + // size of the central directory   4 bytes
      decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
      decToHex(localDirLength, 4) + // .ZIP file comment length
      decToHex(encodedComment.length, 2) + // .ZIP file comment
      encodedComment;
      return dirEnd;
    };
    var generateDataDescriptors = function(streamInfo) {
      var descriptor = "";
      descriptor = signature.DATA_DESCRIPTOR + // crc-32                          4 bytes
      decToHex(streamInfo["crc32"], 4) + // compressed size                 4 bytes
      decToHex(streamInfo["compressedSize"], 4) + // uncompressed size               4 bytes
      decToHex(streamInfo["uncompressedSize"], 4);
      return descriptor;
    };
    function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
      GenericWorker.call(this, "ZipFileWorker");
      this.bytesWritten = 0;
      this.zipComment = comment;
      this.zipPlatform = platform;
      this.encodeFileName = encodeFileName;
      this.streamFiles = streamFiles;
      this.accumulate = false;
      this.contentBuffer = [];
      this.dirRecords = [];
      this.currentSourceOffset = 0;
      this.entriesCount = 0;
      this.currentFile = null;
      this._sources = [];
    }
    utils.inherits(ZipFileWorker, GenericWorker);
    ZipFileWorker.prototype.push = function(chunk) {
      var currentFilePercent = chunk.meta.percent || 0;
      var entriesCount = this.entriesCount;
      var remainingFiles = this._sources.length;
      if (this.accumulate) {
        this.contentBuffer.push(chunk);
      } else {
        this.bytesWritten += chunk.data.length;
        GenericWorker.prototype.push.call(this, {
          data: chunk.data,
          meta: {
            currentFile: this.currentFile,
            percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
          }
        });
      }
    };
    ZipFileWorker.prototype.openedSource = function(streamInfo) {
      this.currentSourceOffset = this.bytesWritten;
      this.currentFile = streamInfo["file"].name;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      if (streamedContent) {
        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
      } else {
        this.accumulate = true;
      }
    };
    ZipFileWorker.prototype.closedSource = function(streamInfo) {
      this.accumulate = false;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
      this.dirRecords.push(record.dirRecord);
      if (streamedContent) {
        this.push({
          data: generateDataDescriptors(streamInfo),
          meta: { percent: 100 }
        });
      } else {
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
        while (this.contentBuffer.length) {
          this.push(this.contentBuffer.shift());
        }
      }
      this.currentFile = null;
    };
    ZipFileWorker.prototype.flush = function() {
      var localDirLength = this.bytesWritten;
      for (var i = 0; i < this.dirRecords.length; i++) {
        this.push({
          data: this.dirRecords[i],
          meta: { percent: 100 }
        });
      }
      var centralDirLength = this.bytesWritten - localDirLength;
      var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
      this.push({
        data: dirEnd,
        meta: { percent: 100 }
      });
    };
    ZipFileWorker.prototype.prepareNextSource = function() {
      this.previous = this._sources.shift();
      this.openedSource(this.previous.streamInfo);
      if (this.isPaused) {
        this.previous.pause();
      } else {
        this.previous.resume();
      }
    };
    ZipFileWorker.prototype.registerPrevious = function(previous) {
      this._sources.push(previous);
      var self2 = this;
      previous.on("data", function(chunk) {
        self2.processChunk(chunk);
      });
      previous.on("end", function() {
        self2.closedSource(self2.previous.streamInfo);
        if (self2._sources.length) {
          self2.prepareNextSource();
        } else {
          self2.end();
        }
      });
      previous.on("error", function(e) {
        self2.error(e);
      });
      return this;
    };
    ZipFileWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this.previous && this._sources.length) {
        this.prepareNextSource();
        return true;
      }
      if (!this.previous && !this._sources.length && !this.generatedError) {
        this.end();
        return true;
      }
    };
    ZipFileWorker.prototype.error = function(e) {
      var sources = this._sources;
      if (!GenericWorker.prototype.error.call(this, e)) {
        return false;
      }
      for (var i = 0; i < sources.length; i++) {
        try {
          sources[i].error(e);
        } catch (e2) {
        }
      }
      return true;
    };
    ZipFileWorker.prototype.lock = function() {
      GenericWorker.prototype.lock.call(this);
      var sources = this._sources;
      for (var i = 0; i < sources.length; i++) {
        sources[i].lock();
      }
    };
    module.exports = ZipFileWorker;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/generate/index.js
var require_generate = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/generate/index.js"(exports) {
    "use strict";
    var compressions = require_compressions();
    var ZipFileWorker = require_ZipFileWorker();
    var getCompression = function(fileCompression, zipCompression) {
      var compressionName = fileCompression || zipCompression;
      var compression = compressions[compressionName];
      if (!compression) {
        throw new Error(compressionName + " is not a valid compression method !");
      }
      return compression;
    };
    exports.generateWorker = function(zip, options, comment) {
      var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
      var entriesCount = 0;
      try {
        zip.forEach(function(relativePath, file) {
          entriesCount++;
          var compression = getCompression(file.options.compression, options.compression);
          var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
          var dir = file.dir, date = file.date;
          file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
            name: relativePath,
            dir,
            date,
            comment: file.comment || "",
            unixPermissions: file.unixPermissions,
            dosPermissions: file.dosPermissions
          }).pipe(zipFileWorker);
        });
        zipFileWorker.entriesCount = entriesCount;
      } catch (e) {
        zipFileWorker.error(e);
      }
      return zipFileWorker;
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function NodejsStreamInputAdapter(filename, stream) {
      GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
      this._upstreamEnded = false;
      this._bindStream(stream);
    }
    utils.inherits(NodejsStreamInputAdapter, GenericWorker);
    NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
      var self2 = this;
      this._stream = stream;
      stream.pause();
      stream.on("data", function(chunk) {
        self2.push({
          data: chunk,
          meta: {
            percent: 0
          }
        });
      }).on("error", function(e) {
        if (self2.isPaused) {
          this.generatedError = e;
        } else {
          self2.error(e);
        }
      }).on("end", function() {
        if (self2.isPaused) {
          self2._upstreamEnded = true;
        } else {
          self2.end();
        }
      });
    };
    NodejsStreamInputAdapter.prototype.pause = function() {
      if (!GenericWorker.prototype.pause.call(this)) {
        return false;
      }
      this._stream.pause();
      return true;
    };
    NodejsStreamInputAdapter.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (this._upstreamEnded) {
        this.end();
      } else {
        this._stream.resume();
      }
      return true;
    };
    module.exports = NodejsStreamInputAdapter;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/object.js
var require_object = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/object.js"(exports, module) {
    "use strict";
    var utf8 = require_utf8();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var StreamHelper = require_StreamHelper();
    var defaults = require_defaults();
    var CompressedObject = require_compressedObject();
    var ZipObject = require_zipObject();
    var generate = require_generate();
    var nodejsUtils = require_nodejsUtils();
    var NodejsStreamInputAdapter = require_NodejsStreamInputAdapter();
    var fileAdd = function(name, data, originalOptions) {
      var dataType = utils.getTypeOf(data), parent;
      var o = utils.extend(originalOptions || {}, defaults);
      o.date = o.date || /* @__PURE__ */ new Date();
      if (o.compression !== null) {
        o.compression = o.compression.toUpperCase();
      }
      if (typeof o.unixPermissions === "string") {
        o.unixPermissions = parseInt(o.unixPermissions, 8);
      }
      if (o.unixPermissions && o.unixPermissions & 16384) {
        o.dir = true;
      }
      if (o.dosPermissions && o.dosPermissions & 16) {
        o.dir = true;
      }
      if (o.dir) {
        name = forceTrailingSlash(name);
      }
      if (o.createFolders && (parent = parentFolder(name))) {
        folderAdd.call(this, parent, true);
      }
      var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
      if (!originalOptions || typeof originalOptions.binary === "undefined") {
        o.binary = !isUnicodeString;
      }
      var isCompressedEmpty = data instanceof CompressedObject && data.uncompressedSize === 0;
      if (isCompressedEmpty || o.dir || !data || data.length === 0) {
        o.base64 = false;
        o.binary = true;
        data = "";
        o.compression = "STORE";
        dataType = "string";
      }
      var zipObjectContent = null;
      if (data instanceof CompressedObject || data instanceof GenericWorker) {
        zipObjectContent = data;
      } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        zipObjectContent = new NodejsStreamInputAdapter(name, data);
      } else {
        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
      }
      var object = new ZipObject(name, zipObjectContent, o);
      this.files[name] = object;
    };
    var parentFolder = function(path2) {
      if (path2.slice(-1) === "/") {
        path2 = path2.substring(0, path2.length - 1);
      }
      var lastSlash = path2.lastIndexOf("/");
      return lastSlash > 0 ? path2.substring(0, lastSlash) : "";
    };
    var forceTrailingSlash = function(path2) {
      if (path2.slice(-1) !== "/") {
        path2 += "/";
      }
      return path2;
    };
    var folderAdd = function(name, createFolders) {
      createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
      name = forceTrailingSlash(name);
      if (!this.files[name]) {
        fileAdd.call(this, name, null, {
          dir: true,
          createFolders
        });
      }
      return this.files[name];
    };
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    var out = {
      /**
       * @see loadAsync
       */
      load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Call a callback function for each entry at this folder level.
       * @param {Function} cb the callback function:
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       */
      forEach: function(cb) {
        var filename, relativePath, file;
        for (filename in this.files) {
          file = this.files[filename];
          relativePath = filename.slice(this.root.length, filename.length);
          if (relativePath && filename.slice(0, this.root.length) === this.root) {
            cb(relativePath, file);
          }
        }
      },
      /**
       * Filter nested files/folders with the specified function.
       * @param {Function} search the predicate to use :
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       * @return {Array} An array of matching elements.
       */
      filter: function(search) {
        var result = [];
        this.forEach(function(relativePath, entry) {
          if (search(relativePath, entry)) {
            result.push(entry);
          }
        });
        return result;
      },
      /**
       * Add a file to the zip file, or search a file.
       * @param   {string|RegExp} name The name of the file to add (if data is defined),
       * the name of the file to find (if no data) or a regex to match files.
       * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
       * @param   {Object} o     File options
       * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
       * a file (when searching by string) or an array of files (when searching by regex).
       */
      file: function(name, data, o) {
        if (arguments.length === 1) {
          if (isRegExp(name)) {
            var regexp = name;
            return this.filter(function(relativePath, file) {
              return !file.dir && regexp.test(relativePath);
            });
          } else {
            var obj = this.files[this.root + name];
            if (obj && !obj.dir) {
              return obj;
            } else {
              return null;
            }
          }
        } else {
          name = this.root + name;
          fileAdd.call(this, name, data, o);
        }
        return this;
      },
      /**
       * Add a directory to the zip file, or search.
       * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
       * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
       */
      folder: function(arg) {
        if (!arg) {
          return this;
        }
        if (isRegExp(arg)) {
          return this.filter(function(relativePath, file) {
            return file.dir && arg.test(relativePath);
          });
        }
        var name = this.root + arg;
        var newFolder = folderAdd.call(this, name);
        var ret = this.clone();
        ret.root = newFolder.name;
        return ret;
      },
      /**
       * Delete a file, or a directory and all sub-files, from the zip
       * @param {string} name the name of the file to delete
       * @return {JSZip} this JSZip object
       */
      remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (!file) {
          if (name.slice(-1) !== "/") {
            name += "/";
          }
          file = this.files[name];
        }
        if (file && !file.dir) {
          delete this.files[name];
        } else {
          var kids = this.filter(function(relativePath, file2) {
            return file2.name.slice(0, name.length) === name;
          });
          for (var i = 0; i < kids.length; i++) {
            delete this.files[kids[i].name];
          }
        }
        return this;
      },
      /**
       * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
       */
      generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Generate the complete zip file as an internal stream.
       * @param {Object} options the options to generate the zip file :
       * - compression, "STORE" by default.
       * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
       * @return {StreamHelper} the streamed zip file.
       */
      generateInternalStream: function(options) {
        var worker, opts = {};
        try {
          opts = utils.extend(options || {}, {
            streamFiles: false,
            compression: "STORE",
            compressionOptions: null,
            type: "",
            platform: "DOS",
            comment: null,
            mimeType: "application/zip",
            encodeFileName: utf8.utf8encode
          });
          opts.type = opts.type.toLowerCase();
          opts.compression = opts.compression.toUpperCase();
          if (opts.type === "binarystring") {
            opts.type = "string";
          }
          if (!opts.type) {
            throw new Error("No output type specified.");
          }
          utils.checkSupport(opts.type);
          if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") {
            opts.platform = "UNIX";
          }
          if (opts.platform === "win32") {
            opts.platform = "DOS";
          }
          var comment = opts.comment || this.comment || "";
          worker = generate.generateWorker(this, opts, comment);
        } catch (e) {
          worker = new GenericWorker("error");
          worker.error(e);
        }
        return new StreamHelper(worker, opts.type || "string", opts.mimeType);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateAsync: function(options, onUpdate) {
        return this.generateInternalStream(options).accumulate(onUpdate);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateNodeStream: function(options, onUpdate) {
        options = options || {};
        if (!options.type) {
          options.type = "nodebuffer";
        }
        return this.generateInternalStream(options).toNodejsStream(onUpdate);
      }
    };
    module.exports = out;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/DataReader.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function DataReader(data) {
      this.data = data;
      this.length = data.length;
      this.index = 0;
      this.zero = 0;
    }
    DataReader.prototype = {
      /**
       * Check that the offset will not go too far.
       * @param {string} offset the additional offset to check.
       * @throws {Error} an Error if the offset is out of bounds.
       */
      checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
      },
      /**
       * Check that the specified index will not be too far.
       * @param {string} newIndex the index to check.
       * @throws {Error} an Error if the index is out of bounds.
       */
      checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0) {
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
        }
      },
      /**
       * Change the index.
       * @param {number} newIndex The new index.
       * @throws {Error} if the new index is out of the data.
       */
      setIndex: function(newIndex) {
        this.checkIndex(newIndex);
        this.index = newIndex;
      },
      /**
       * Skip the next n bytes.
       * @param {number} n the number of bytes to skip.
       * @throws {Error} if the new index is out of the data.
       */
      skip: function(n) {
        this.setIndex(this.index + n);
      },
      /**
       * Get the byte at the specified index.
       * @param {number} i the index to use.
       * @return {number} a byte.
       */
      byteAt: function() {
      },
      /**
       * Get the next number with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {number} the corresponding number.
       */
      readInt: function(size) {
        var result = 0, i;
        this.checkOffset(size);
        for (i = this.index + size - 1; i >= this.index; i--) {
          result = (result << 8) + this.byteAt(i);
        }
        this.index += size;
        return result;
      },
      /**
       * Get the next string with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {string} the corresponding string.
       */
      readString: function(size) {
        return utils.transformTo("string", this.readData(size));
      },
      /**
       * Get raw data without conversion, <size> bytes.
       * @param {number} size the number of bytes to read.
       * @return {Object} the raw data, implementation specific.
       */
      readData: function() {
      },
      /**
       * Find the last occurrence of a zip signature (4 bytes).
       * @param {string} sig the signature to find.
       * @return {number} the index of the last occurrence, -1 if not found.
       */
      lastIndexOfSignature: function() {
      },
      /**
       * Read the signature (4 bytes) at the current position and compare it with sig.
       * @param {string} sig the expected signature
       * @return {boolean} true if the signature matches, false otherwise.
       */
      readAndCheckSignature: function() {
      },
      /**
       * Get the next date.
       * @return {Date} the date.
       */
      readDate: function() {
        var dostime = this.readInt(4);
        return new Date(Date.UTC(
          (dostime >> 25 & 127) + 1980,
          // year
          (dostime >> 21 & 15) - 1,
          // month
          dostime >> 16 & 31,
          // day
          dostime >> 11 & 31,
          // hour
          dostime >> 5 & 63,
          // minute
          (dostime & 31) << 1
        ));
      }
    };
    module.exports = DataReader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/ArrayReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function ArrayReader(data) {
      DataReader.call(this, data);
      for (var i = 0; i < this.data.length; i++) {
        data[i] = data[i] & 255;
      }
    }
    utils.inherits(ArrayReader, DataReader);
    ArrayReader.prototype.byteAt = function(i) {
      return this.data[this.zero + i];
    };
    ArrayReader.prototype.lastIndexOfSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
      for (var i = this.length - 4; i >= 0; --i) {
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
          return i - this.zero;
        }
      }
      return -1;
    };
    ArrayReader.prototype.readAndCheckSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
      return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
    };
    ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return [];
      }
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = ArrayReader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/StringReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function StringReader(data) {
      DataReader.call(this, data);
    }
    utils.inherits(StringReader, DataReader);
    StringReader.prototype.byteAt = function(i) {
      return this.data.charCodeAt(this.zero + i);
    };
    StringReader.prototype.lastIndexOfSignature = function(sig) {
      return this.data.lastIndexOf(sig) - this.zero;
    };
    StringReader.prototype.readAndCheckSignature = function(sig) {
      var data = this.readData(4);
      return sig === data;
    };
    StringReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = StringReader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/Uint8ArrayReader.js"(exports, module) {
    "use strict";
    var ArrayReader = require_ArrayReader();
    var utils = require_utils();
    function Uint8ArrayReader(data) {
      ArrayReader.call(this, data);
    }
    utils.inherits(Uint8ArrayReader, ArrayReader);
    Uint8ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return new Uint8Array(0);
      }
      var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = Uint8ArrayReader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/NodeBufferReader.js"(exports, module) {
    "use strict";
    var Uint8ArrayReader = require_Uint8ArrayReader();
    var utils = require_utils();
    function NodeBufferReader(data) {
      Uint8ArrayReader.call(this, data);
    }
    utils.inherits(NodeBufferReader, Uint8ArrayReader);
    NodeBufferReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = NodeBufferReader;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/reader/readerFor.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var ArrayReader = require_ArrayReader();
    var StringReader = require_StringReader();
    var NodeBufferReader = require_NodeBufferReader();
    var Uint8ArrayReader = require_Uint8ArrayReader();
    module.exports = function(data) {
      var type = utils.getTypeOf(data);
      utils.checkSupport(type);
      if (type === "string" && !support.uint8array) {
        return new StringReader(data);
      }
      if (type === "nodebuffer") {
        return new NodeBufferReader(data);
      }
      if (support.uint8array) {
        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
      }
      return new ArrayReader(utils.transformTo("array", data));
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipEntry.js
var require_zipEntry = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipEntry.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var CompressedObject = require_compressedObject();
    var crc32fn = require_crc32();
    var utf8 = require_utf8();
    var compressions = require_compressions();
    var support = require_support();
    var MADE_BY_DOS = 0;
    var MADE_BY_UNIX = 3;
    var findCompression = function(compressionMethod) {
      for (var method in compressions) {
        if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
          continue;
        }
        if (compressions[method].magic === compressionMethod) {
          return compressions[method];
        }
      }
      return null;
    };
    function ZipEntry(options, loadOptions) {
      this.options = options;
      this.loadOptions = loadOptions;
    }
    ZipEntry.prototype = {
      /**
       * say if the file is encrypted.
       * @return {boolean} true if the file is encrypted, false otherwise.
       */
      isEncrypted: function() {
        return (this.bitFlag & 1) === 1;
      },
      /**
       * say if the file has utf-8 filename/comment.
       * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
       */
      useUTF8: function() {
        return (this.bitFlag & 2048) === 2048;
      },
      /**
       * Read the local part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;
        reader.skip(22);
        this.fileNameLength = reader.readInt(2);
        localExtraFieldsLength = reader.readInt(2);
        this.fileName = reader.readData(this.fileNameLength);
        reader.skip(localExtraFieldsLength);
        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        }
        compression = findCompression(this.compressionMethod);
        if (compression === null) {
          throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
        }
        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2);
        reader.skip(2);
        this.bitFlag = reader.readInt(2);
        this.compressionMethod = reader.readString(2);
        this.date = reader.readDate();
        this.crc32 = reader.readInt(4);
        this.compressedSize = reader.readInt(4);
        this.uncompressedSize = reader.readInt(4);
        var fileNameLength = reader.readInt(2);
        this.extraFieldsLength = reader.readInt(2);
        this.fileCommentLength = reader.readInt(2);
        this.diskNumberStart = reader.readInt(2);
        this.internalFileAttributes = reader.readInt(2);
        this.externalFileAttributes = reader.readInt(4);
        this.localHeaderOffset = reader.readInt(4);
        if (this.isEncrypted()) {
          throw new Error("Encrypted zip are not supported");
        }
        reader.skip(fileNameLength);
        this.readExtraFields(reader);
        this.parseZIP64ExtraField(reader);
        this.fileComment = reader.readData(this.fileCommentLength);
      },
      /**
       * Parse the external file attributes and get the unix/dos permissions.
       */
      processAttributes: function() {
        this.unixPermissions = null;
        this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;
        this.dir = this.externalFileAttributes & 16 ? true : false;
        if (madeBy === MADE_BY_DOS) {
          this.dosPermissions = this.externalFileAttributes & 63;
        }
        if (madeBy === MADE_BY_UNIX) {
          this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
        }
        if (!this.dir && this.fileNameStr.slice(-1) === "/") {
          this.dir = true;
        }
      },
      /**
       * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
       * @param {DataReader} reader the reader to use.
       */
      parseZIP64ExtraField: function() {
        if (!this.extraFields[1]) {
          return;
        }
        var extraReader = readerFor(this.extraFields[1].value);
        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
          this.uncompressedSize = extraReader.readInt(8);
        }
        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
          this.compressedSize = extraReader.readInt(8);
        }
        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
          this.localHeaderOffset = extraReader.readInt(8);
        }
        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
          this.diskNumberStart = extraReader.readInt(4);
        }
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readExtraFields: function(reader) {
        var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
        if (!this.extraFields) {
          this.extraFields = {};
        }
        while (reader.index + 4 < end) {
          extraFieldId = reader.readInt(2);
          extraFieldLength = reader.readInt(2);
          extraFieldValue = reader.readData(extraFieldLength);
          this.extraFields[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
        reader.setIndex(end);
      },
      /**
       * Apply an UTF8 transformation if needed.
       */
      handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) {
          this.fileNameStr = utf8.utf8decode(this.fileName);
          this.fileCommentStr = utf8.utf8decode(this.fileComment);
        } else {
          var upath = this.findExtraFieldUnicodePath();
          if (upath !== null) {
            this.fileNameStr = upath;
          } else {
            var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
          }
          var ucomment = this.findExtraFieldUnicodeComment();
          if (ucomment !== null) {
            this.fileCommentStr = ucomment;
          } else {
            var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
          }
        }
      },
      /**
       * Find the unicode path declared in the extra field, if any.
       * @return {String} the unicode path, null otherwise.
       */
      findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[28789];
        if (upathField) {
          var extraReader = readerFor(upathField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(upathField.length - 5));
        }
        return null;
      },
      /**
       * Find the unicode comment declared in the extra field, if any.
       * @return {String} the unicode comment, null otherwise.
       */
      findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[25461];
        if (ucommentField) {
          var extraReader = readerFor(ucommentField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
        }
        return null;
      }
    };
    module.exports = ZipEntry;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipEntries.js
var require_zipEntries = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/zipEntries.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var sig = require_signature();
    var ZipEntry = require_zipEntry();
    var support = require_support();
    function ZipEntries(loadOptions) {
      this.files = [];
      this.loadOptions = loadOptions;
    }
    ZipEntries.prototype = {
      /**
       * Check that the reader is on the specified signature.
       * @param {string} expectedSignature the expected signature.
       * @throws {Error} if it is an other signature.
       */
      checkSignature: function(expectedSignature) {
        if (!this.reader.readAndCheckSignature(expectedSignature)) {
          this.reader.index -= 4;
          var signature = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
      },
      /**
       * Check if the given signature is at the given index.
       * @param {number} askedIndex the index to check.
       * @param {string} expectedSignature the signature to expect.
       * @return {boolean} true if the signature is here, false otherwise.
       */
      isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4);
        var result = signature === expectedSignature;
        this.reader.setIndex(currentIndex);
        return result;
      },
      /**
       * Read the end of the central directory.
       */
      readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2);
        this.diskWithCentralDirStart = this.reader.readInt(2);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
        this.centralDirRecords = this.reader.readInt(2);
        this.centralDirSize = this.reader.readInt(4);
        this.centralDirOffset = this.reader.readInt(4);
        this.zipCommentLength = this.reader.readInt(2);
        var zipComment = this.reader.readData(this.zipCommentLength);
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        var decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
      },
      /**
       * Read the end of the Zip 64 central directory.
       * Not merged with the method readEndOfCentral :
       * The end of central can coexist with its Zip64 brother,
       * I don't want to read the wrong number of bytes !
       */
      readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8);
        this.reader.skip(4);
        this.diskNumber = this.reader.readInt(4);
        this.diskWithCentralDirStart = this.reader.readInt(4);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
        this.centralDirRecords = this.reader.readInt(8);
        this.centralDirSize = this.reader.readInt(8);
        this.centralDirOffset = this.reader.readInt(8);
        this.zip64ExtensibleData = {};
        var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
        while (index < extraDataSize) {
          extraFieldId = this.reader.readInt(2);
          extraFieldLength = this.reader.readInt(4);
          extraFieldValue = this.reader.readData(extraFieldLength);
          this.zip64ExtensibleData[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
      },
      /**
       * Read the end of the Zip 64 central directory locator.
       */
      readBlockZip64EndOfCentralLocator: function() {
        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
        this.disksCount = this.reader.readInt(4);
        if (this.disksCount > 1) {
          throw new Error("Multi-volumes zip are not supported");
        }
      },
      /**
       * Read the local files, based on the offset read in the central part.
       */
      readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++) {
          file = this.files[i];
          this.reader.setIndex(file.localHeaderOffset);
          this.checkSignature(sig.LOCAL_FILE_HEADER);
          file.readLocalPart(this.reader);
          file.handleUTF8();
          file.processAttributes();
        }
      },
      /**
       * Read the central directory.
       */
      readCentralDir: function() {
        var file;
        this.reader.setIndex(this.centralDirOffset);
        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
          file = new ZipEntry({
            zip64: this.zip64
          }, this.loadOptions);
          file.readCentralPart(this.reader);
          this.files.push(file);
        }
        if (this.centralDirRecords !== this.files.length) {
          if (this.centralDirRecords !== 0 && this.files.length === 0) {
            throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          } else {
          }
        }
      },
      /**
       * Read the end of central directory.
       */
      readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
          var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
          if (isGarbage) {
            throw new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          } else {
            throw new Error("Corrupted zip: can't find end of central directory");
          }
        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
        this.readBlockEndOfCentral();
        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
          this.zip64 = true;
          offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          if (offset < 0) {
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          }
          this.reader.setIndex(offset);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          this.readBlockZip64EndOfCentralLocator();
          if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
            this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            if (this.relativeOffsetEndOfZip64CentralDir < 0) {
              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            }
          }
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
          this.readBlockZip64EndOfCentral();
        }
        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        if (this.zip64) {
          expectedEndOfCentralDirOffset += 20;
          expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
        }
        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
        if (extraBytes > 0) {
          if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
          } else {
            this.reader.zero = extraBytes;
          }
        } else if (extraBytes < 0) {
          throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
        }
      },
      prepareReader: function(data) {
        this.reader = readerFor(data);
      },
      /**
       * Read a zip file and create ZipEntries.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
       */
      load: function(data) {
        this.prepareReader(data);
        this.readEndOfCentral();
        this.readCentralDir();
        this.readLocalFiles();
      }
    };
    module.exports = ZipEntries;
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/load.js
var require_load = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/load.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var external = require_external();
    var utf8 = require_utf8();
    var ZipEntries = require_zipEntries();
    var Crc32Probe = require_Crc32Probe();
    var nodejsUtils = require_nodejsUtils();
    function checkEntryCRC32(zipEntry) {
      return new external.Promise(function(resolve, reject) {
        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
        worker.on("error", function(e) {
          reject(e);
        }).on("end", function() {
          if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
            reject(new Error("Corrupted zip : CRC32 mismatch"));
          } else {
            resolve();
          }
        }).resume();
      });
    }
    module.exports = function(data, options) {
      var zip = this;
      options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString: false,
        createFolders: false,
        decodeFileName: utf8.utf8decode
      });
      if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
      }
      return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data2) {
        var zipEntries = new ZipEntries(options);
        zipEntries.load(data2);
        return zipEntries;
      }).then(function checkCRC32(zipEntries) {
        var promises = [external.Promise.resolve(zipEntries)];
        var files = zipEntries.files;
        if (options.checkCRC32) {
          for (var i = 0; i < files.length; i++) {
            promises.push(checkEntryCRC32(files[i]));
          }
        }
        return external.Promise.all(promises);
      }).then(function addFiles(results) {
        var zipEntries = results.shift();
        var files = zipEntries.files;
        for (var i = 0; i < files.length; i++) {
          var input = files[i];
          var unsafeName = input.fileNameStr;
          var safeName = utils.resolve(input.fileNameStr);
          zip.file(safeName, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment: input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
          });
          if (!input.dir) {
            zip.file(safeName).unsafeOriginalName = unsafeName;
          }
        }
        if (zipEntries.zipComment.length) {
          zip.comment = zipEntries.zipComment;
        }
        return zip;
      });
    };
  }
});

// ../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/index.js
var require_lib3 = __commonJS({
  "../config-publication-transport-diagnostics-20261019/node_modules/jszip/lib/index.js"(exports, module) {
    "use strict";
    function JSZip3() {
      if (!(this instanceof JSZip3)) {
        return new JSZip3();
      }
      if (arguments.length) {
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
      }
      this.files = /* @__PURE__ */ Object.create(null);
      this.comment = null;
      this.root = "";
      this.clone = function() {
        var newObj = new JSZip3();
        for (var i in this) {
          if (typeof this[i] !== "function") {
            newObj[i] = this[i];
          }
        }
        return newObj;
      };
    }
    JSZip3.prototype = require_object();
    JSZip3.prototype.loadAsync = require_load();
    JSZip3.support = require_support();
    JSZip3.defaults = require_defaults();
    JSZip3.version = "3.10.1";
    JSZip3.loadAsync = function(content, options) {
      return new JSZip3().loadAsync(content, options);
    };
    JSZip3.external = require_external();
    module.exports = JSZip3;
  }
});

// src/configRuntime/configurationFingerprint.ts
function stableConfigText(value) {
  if (Array.isArray(value)) return "[" + value.map((item) => stableConfigText(item) ?? "null").join(",") + "]";
  if (value && typeof value === "object") {
    const record = value;
    return "{" + Object.keys(record).sort().filter((key2) => record[key2] !== void 0).map((key2) => JSON.stringify(key2) + ":" + stableConfigText(record[key2])).join(",") + "}";
  }
  return JSON.stringify(value);
}

// src/configRuntime/classificationCompatibility.ts
var indexes = /* @__PURE__ */ new WeakMap();
var key = (path2) => JSON.stringify([path2.class, path2.kind ?? "", path2.skind ?? "", path2.skind2 ?? ""]);
function readableClassification(config, raw) {
  let paths = Object.isFrozen(config) ? indexes.get(config) : void 0;
  if (!paths) {
    paths = new Set(config.nodes.map((node) => key(node.path)));
    if (Object.isFrozen(config)) indexes.set(config, paths);
  }
  if (paths.has(key(raw))) return raw;
  if (raw.class === "ROD" && raw.kind && (!raw.skind || raw.skind === "NOM") && (!raw.skind2 || raw.skind2 === "NOM")) {
    const candidate = { class: raw.class, kind: raw.kind };
    if (paths.has(key(candidate))) return candidate;
  }
  return void 0;
}

// src/core/geometry/multipartGeometry.ts
var DEFAULT_GEOMETRY_Y = -64;
var isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
var numberOrNull = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};
function canonicalGeometryField(type) {
  if (type === "Point") return "CoordP";
  if (type === "LineString") return "CoordL";
  return "CoordG";
}
function geometryTypeFromFeatureType(value) {
  const type = String(value ?? "").trim();
  if (type === "Points") return "Point";
  if (type === "Polyline") return "LineString";
  if (type === "Polygon") return "Polygon";
  return null;
}
function featureTypeFromGeometryType(type) {
  return type === "Point" ? "Points" : type === "LineString" ? "Polyline" : "Polygon";
}
function tupleToCoord(value) {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const x = numberOrNull(value[0]);
  const y = numberOrNull(value[1]);
  const z = numberOrNull(value[2]);
  return x === null || y === null || z === null ? null : { x, y, z };
}
function legacyTupleToCoord(value) {
  if (Array.isArray(value)) {
    const x2 = numberOrNull(value[0]);
    const y2 = value.length >= 3 ? numberOrNull(value[1]) : DEFAULT_GEOMETRY_Y;
    const z2 = value.length >= 3 ? numberOrNull(value[2]) : numberOrNull(value[1]);
    return x2 === null || y2 === null || z2 === null ? null : { x: x2, y: y2, z: z2 };
  }
  if (!isObject(value)) return null;
  const x = numberOrNull(value.x);
  const z = numberOrNull(value.z);
  const y = numberOrNull(value.y);
  return x === null || z === null ? null : { x, y: y ?? DEFAULT_GEOMETRY_Y, z };
}
function coordinatesEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
function removeClosingCoordinate(ring) {
  if (ring.length >= 2 && coordinatesEqual(ring[0], ring[ring.length - 1])) return ring.slice(0, -1);
  return ring;
}
function normalizeRingCoordinates(ring) {
  const withoutConsecutiveDuplicates = ring.filter((coordinate, index) => index === 0 || !coordinatesEqual(ring[index - 1], coordinate));
  return removeClosingCoordinate(withoutConsecutiveDuplicates);
}
function parseCanonical(value, type) {
  if (!Array.isArray(value)) return null;
  if (type === "Point") {
    const parts2 = value.map(tupleToCoord);
    return parts2.every(Boolean) ? { type, parts: parts2 } : null;
  }
  if (type === "LineString") {
    const parts2 = value.map((part) => Array.isArray(part) ? part.map(tupleToCoord) : null);
    return parts2.every((part) => Array.isArray(part) && part.every(Boolean)) ? { type, parts: parts2 } : null;
  }
  const parts = value.map((part) => Array.isArray(part) ? part.map((ring) => Array.isArray(ring) ? normalizeRingCoordinates(ring.map(tupleToCoord).filter((coord) => Boolean(coord))) : null) : null);
  if (!parts.every((part) => Array.isArray(part) && part.length > 0 && part.every((ring) => Array.isArray(ring)))) return null;
  for (const component of value) {
    if (!Array.isArray(component)) return null;
    for (const ring of component) {
      if (!Array.isArray(ring) || ring.some((tuple) => !tupleToCoord(tuple))) return null;
    }
  }
  return { type, parts };
}
function parseLegacy(value, type) {
  if (type === "Point") {
    const coord = legacyTupleToCoord(value);
    return coord ? { type, parts: [coord] } : null;
  }
  if (!Array.isArray(value)) return null;
  const path2 = value.map(legacyTupleToCoord);
  if (!path2.every(Boolean)) return null;
  if (type === "LineString") return { type, parts: [path2] };
  return { type, parts: [[normalizeRingCoordinates(path2)]] };
}
function stableGeometry(geometry) {
  return JSON.stringify(serializeMultipartGeometry(geometry));
}
function readMultipartGeometry(featureInfo, type, legacySourceField) {
  const info = isObject(featureInfo) ? featureInfo : {};
  const canonicalField = canonicalGeometryField(type);
  const hasCanonical = Object.prototype.hasOwnProperty.call(info, canonicalField);
  const canonical2 = hasCanonical ? parseCanonical(info[canonicalField], type) : null;
  if (hasCanonical && !canonical2) return { geometry: null, source: "canonical", error: `${canonicalField} \u683C\u5F0F\u65E0\u6548` };
  const legacyCandidates = Array.from(new Set([
    legacySourceField,
    type === "Point" ? "coordinate" : void 0,
    type === "LineString" ? "PLpoints" : void 0,
    type === "LineString" ? "Linepoints" : void 0,
    type === "Polygon" ? "Conpoints" : void 0,
    type === "Polygon" ? "Flrpoints" : void 0
  ].filter((field) => Boolean(field))));
  const legacyEntries = legacyCandidates.filter((field) => Object.prototype.hasOwnProperty.call(info, field));
  const parsedLegacy = legacyEntries.map((field) => ({ field, geometry: parseLegacy(info[field], type) }));
  const invalidLegacy = parsedLegacy.find((entry) => !entry.geometry);
  if (invalidLegacy) return { geometry: null, source: "legacy", error: `${invalidLegacy.field} \u683C\u5F0F\u65E0\u6548` };
  const legacy = parsedLegacy[0]?.geometry ?? null;
  if (legacy && parsedLegacy.some((entry) => stableGeometry(entry.geometry) !== stableGeometry(legacy))) {
    return { geometry: null, source: "legacy", error: "geometry-field-conflict" };
  }
  if (canonical2 && legacy && stableGeometry(canonical2) !== stableGeometry(legacy)) {
    return { geometry: null, source: "canonical", error: "geometry-field-conflict" };
  }
  if (canonical2) return { geometry: canonical2, source: "canonical" };
  if (legacy) return { geometry: legacy, source: "legacy" };
  return { geometry: null, source: "none" };
}
function serializeMultipartGeometry(geometry) {
  const tuple = (coord) => [coord.x, coord.y, coord.z];
  if (geometry.type === "Point") return geometry.parts.map(tuple);
  if (geometry.type === "LineString") return geometry.parts.map((part) => part.map(tuple));
  return geometry.parts.map((part) => part.map((ring) => normalizeRingCoordinates(ring).map(tuple)));
}
function withCanonicalMultipartGeometry(featureInfo, geometry) {
  const out = { ...featureInfo };
  out[canonicalGeometryField(geometry.type)] = serializeMultipartGeometry(geometry);
  const legacyFields = geometry.type === "Point" ? ["coordinate"] : geometry.type === "LineString" ? ["PLpoints", "Linepoints"] : ["Conpoints", "Flrpoints"];
  for (const field of legacyFields) delete out[field];
  return out;
}
function multipartGeometryFromSinglePath(type, coords) {
  const normalized = coords.map((coord) => ({
    x: Number(coord.x),
    y: Number.isFinite(Number(coord.y)) ? Number(coord.y) : DEFAULT_GEOMETRY_Y,
    z: Number(coord.z)
  }));
  if (type === "Point") return { type, parts: normalized };
  if (type === "LineString") return { type, parts: [normalized] };
  return { type, parts: [[normalized]] };
}
function flattenMultipartCoordinates(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Point") return geometry.parts;
  if (geometry.type === "LineString") return geometry.parts.flat();
  return geometry.parts.flat(2);
}
function signedArea(ring) {
  let area = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const a = ring[index];
    const b = ring[(index + 1) % ring.length];
    area += a.x * b.z - b.x * a.z;
  }
  return area / 2;
}
function orientation(a, b, c) {
  const result = (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  return Math.abs(result) < 1e-9 ? 0 : result > 0 ? 1 : -1;
}
function onSegment(a, b, c) {
  return Math.min(a.x, c.x) <= b.x && b.x <= Math.max(a.x, c.x) && Math.min(a.z, c.z) <= b.z && b.z <= Math.max(a.z, c.z);
}
function segmentsIntersect(a, b, c, d) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  return o1 === 0 && onSegment(a, c, b) || o2 === 0 && onSegment(a, d, b) || o3 === 0 && onSegment(c, a, d) || o4 === 0 && onSegment(c, b, d);
}
function ringSelfIntersects(ring) {
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    for (let j = i + 1; j < ring.length; j += 1) {
      if (j === i || (j + 1) % ring.length === i || (i + 1) % ring.length === j) continue;
      const c = ring[j];
      const d = ring[(j + 1) % ring.length];
      if (segmentsIntersect(a, b, c, d)) return true;
    }
  }
  return false;
}
function pointInRing(point, ring) {
  for (let index = 0; index < ring.length; index += 1) {
    const a = ring[index];
    const b = ring[(index + 1) % ring.length];
    if (orientation(a, point, b) === 0 && onSegment(a, point, b)) return false;
  }
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    const intersects = a.z > point.z !== b.z > point.z && point.x < (b.x - a.x) * (point.z - a.z) / (b.z - a.z) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}
function ringsIntersect(a, b) {
  for (let ai = 0; ai < a.length; ai += 1) {
    const aNext = a[(ai + 1) % a.length];
    for (let bi = 0; bi < b.length; bi += 1) {
      if (segmentsIntersect(a[ai], aNext, b[bi], b[(bi + 1) % b.length])) return true;
    }
  }
  return false;
}
function validateMultipartGeometry(geometry) {
  if (!geometry) return "\u7F3A\u5C11\u51E0\u4F55\u5750\u6807";
  const invalidCoordinate = flattenMultipartCoordinates(geometry).find((coord) => !Number.isFinite(coord.x) || !Number.isFinite(coord.y) || !Number.isFinite(coord.z));
  if (invalidCoordinate) return "\u5750\u6807\u5FC5\u987B\u4E3A\u6709\u9650\u7684 [x, y, z] \u6570\u5B57";
  if (geometry.type === "Point") return geometry.parts.length > 0 ? void 0 : "CoordP \u81F3\u5C11\u9700\u8981 1 \u4E2A\u5750\u6807";
  if (geometry.type === "LineString") {
    const invalidPart = geometry.parts.findIndex((part) => part.length < 2);
    return invalidPart >= 0 ? `CoordL \u7B2C ${invalidPart + 1} \u4E2A\u90E8\u4EF6\u81F3\u5C11\u9700\u8981 2 \u4E2A\u5750\u6807` : void 0;
  }
  for (let partIndex = 0; partIndex < geometry.parts.length; partIndex += 1) {
    const [outer, ...holes] = geometry.parts[partIndex];
    if (!outer || outer.length < 3) return `CoordG \u7B2C ${partIndex + 1} \u4E2A\u90E8\u4EF6\u5916\u8FB9\u754C\u81F3\u5C11\u9700\u8981 3 \u4E2A\u5750\u6807`;
    if (Math.abs(signedArea(outer)) < 1e-9 || ringSelfIntersects(outer)) return `CoordG \u7B2C ${partIndex + 1} \u4E2A\u90E8\u4EF6\u5916\u8FB9\u754C\u62D3\u6251\u65E0\u6548`;
    for (let holeIndex = 0; holeIndex < holes.length; holeIndex += 1) {
      const hole = holes[holeIndex];
      if (hole.length < 3 || Math.abs(signedArea(hole)) < 1e-9 || ringSelfIntersects(hole)) return `CoordG \u7B2C ${partIndex + 1} \u4E2A\u90E8\u4EF6\u5185\u90E8\u6D1E ${holeIndex + 1} \u62D3\u6251\u65E0\u6548`;
      if (!pointInRing(hole[0], outer) || ringsIntersect(hole, outer)) return `CoordG \u7B2C ${partIndex + 1} \u4E2A\u90E8\u4EF6\u5185\u90E8\u6D1E ${holeIndex + 1} \u5FC5\u987B\u5B8C\u5168\u4F4D\u4E8E\u5916\u8FB9\u754C\u5185`;
      for (let prior = 0; prior < holeIndex; prior += 1) {
        if (ringsIntersect(hole, holes[prior]) || pointInRing(hole[0], holes[prior])) return `CoordG \u7B2C ${partIndex + 1} \u4E2A\u90E8\u4EF6\u5185\u90E8\u6D1E\u4E0D\u80FD\u91CD\u53E0`;
      }
    }
  }
  return void 0;
}

// scripts/config-tools/server-validation-entry.ts
var import_jszip2 = __toESM(require_lib3(), 1);
import { File } from "node:buffer";
import { createHash } from "node:crypto";

// src/configStudio/nativeArchive.ts
var import_jszip = __toESM(require_lib3(), 1);

// src/configStudio/archivePolicy.ts
var CONFIG_IMPORT_LIMITS = Object.freeze({ compressedBytes: 64 * 1024 * 1024, totalBytes: 128 * 1024 * 1024, fileBytes: 64 * 1024 * 1024, entries: 512, jsonDepth: 64 });
function importProgress(options, stage) {
  options.signal?.throwIfAborted();
  options.onProgress?.(stage);
}
function parseConfigJson(text) {
  let depth = 0, quoted = false, escape2 = false;
  for (const char of text) {
    if (quoted) {
      if (escape2) escape2 = false;
      else if (char === "\\") escape2 = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{" || char === "[") {
      if (++depth > CONFIG_IMPORT_LIMITS.jsonDepth) throw Error(`JSON \u5D4C\u5957\u6DF1\u5EA6\u8D85\u8FC7\u5BFC\u5165\u9884\u7B97 ${CONFIG_IMPORT_LIMITS.jsonDepth}\uFF1B\u8BF7\u79BB\u7EBF\u68C0\u67E5\u540E\u62C6\u9664\u65E0\u6548\u5D4C\u5957\u3002`);
    } else if (char === "}" || char === "]") depth--;
  }
  return JSON.parse(text);
}
function safeArchivePath(path2) {
  return Boolean(path2) && !/[\\\x00-\x1f:]/.test(path2) && !path2.startsWith("/") && path2.split("/").every((part, index, parts) => part !== "." && part !== ".." && (part !== "" || index === parts.length - 1));
}
function inspectConfigZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), names2 = /* @__PURE__ */ new Map();
  let end = -1;
  for (let at2 = bytes.length - 22; at2 >= Math.max(0, bytes.length - 65557); at2--) if (view.getUint32(at2, true) === 101010256 && at2 + 22 + view.getUint16(at2 + 20, true) === bytes.length) {
    end = at2;
    break;
  }
  if (end < 0) throw Error("ZIP \u76EE\u5F55\u635F\u574F\u3002");
  const count = view.getUint16(end + 10, true), size = view.getUint32(end + 12, true), offset = view.getUint32(end + 16, true);
  if (view.getUint16(end + 4, true) || view.getUint16(end + 6, true) || view.getUint16(end + 8, true) !== count || count === 65535 || offset === 4294967295 || size === 4294967295) throw Error("\u4E0D\u652F\u6301\u591A\u5377\u6216 ZIP64 \u914D\u7F6E\u5F52\u6863\uFF1B\u8BF7\u4F7F\u7528\u6807\u51C6\u914D\u7F6E ZIP/JSON\u3002");
  if (count > CONFIG_IMPORT_LIMITS.entries) throw Error(`ZIP \u6761\u76EE ${count} \u8D85\u8FC7\u5BFC\u5165\u9884\u7B97 ${CONFIG_IMPORT_LIMITS.entries}\u3002`);
  if (offset + size > end) throw Error("ZIP \u76EE\u5F55\u8303\u56F4\u65E0\u6548\u3002");
  let at = offset, total = 0;
  for (let index = 0; index < count; index++) {
    if (at + 46 > offset + size || view.getUint32(at, true) !== 33639248) throw Error("ZIP \u6761\u76EE\u635F\u574F\u3002");
    const length = view.getUint16(at + 28, true), extra = view.getUint16(at + 30, true), comment = view.getUint16(at + 32, true), fileSize = view.getUint32(at + 24, true);
    if (at + 46 + length + extra + comment > offset + size) throw Error("ZIP \u6761\u76EE\u540D\u79F0\u8303\u56F4\u65E0\u6548\u3002");
    const name = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(at + 46, at + 46 + length));
    if (!safeArchivePath(name) || names2.has(name)) throw Error(`ZIP \u8DEF\u5F84\u4E0D\u5408\u6CD5\u6216\u91CD\u590D\uFF1A${name}`);
    if (fileSize > CONFIG_IMPORT_LIMITS.fileBytes || (total += fileSize) > CONFIG_IMPORT_LIMITS.totalBytes) throw Error(`ZIP \u89E3\u538B\u9884\u7B97\u8D85\u9650\uFF1A\u5355\u6587\u4EF6 ${fileSize} / ${CONFIG_IMPORT_LIMITS.fileBytes} \u5B57\u8282\uFF0C\u7D2F\u8BA1 ${total} / ${CONFIG_IMPORT_LIMITS.totalBytes} \u5B57\u8282\u3002\u8BF7\u79BB\u7EBF\u68C0\u67E5\u6216\u8C03\u6574\u96C6\u4E2D\u5BFC\u5165\u7B56\u7565\u3002`);
    names2.set(name, fileSize);
    at += 46 + length + extra + comment;
  }
  if (at !== offset + size) throw Error("ZIP \u76EE\u5F55\u957F\u5EA6\u4E0D\u4E00\u81F4\u3002");
  return names2;
}

// src/configStudio/nativeArchive.ts
var isRecord = (value) => !!value && typeof value === "object" && !Array.isArray(value);
async function sha256(value) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", value))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function readRawNativePackage(file, options = {}) {
  importProgress(options, "\u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6");
  if (file.size > CONFIG_IMPORT_LIMITS.compressedBytes) throw Error(`\u914D\u7F6E\u6587\u4EF6 ${file.size} \u5B57\u8282\uFF0C\u8D85\u8FC7\u5BFC\u5165\u9884\u7B97 ${CONFIG_IMPORT_LIMITS.compressedBytes} \u5B57\u8282\u3002\u8BF7\u79BB\u7EBF\u68C0\u67E5\u6216\u8C03\u6574\u96C6\u4E2D\u5BFC\u5165\u7B56\u7565\u3002`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isZip = bytes[0] === 80 && bytes[1] === 75;
  if (!isZip) {
    importProgress(options, "\u68C0\u67E5 JSON \u7ED3\u6784\u4E0E\u7248\u672C");
    return parseConfigJson(new TextDecoder().decode(bytes));
  }
  const entries = inspectConfigZip(bytes);
  importProgress(options, "\u68C0\u67E5\u5F52\u6863\u76EE\u5F55");
  const zip = await import_jszip.default.loadAsync(bytes);
  const manifestRaw = await zip.file("manifest.json")?.async("string");
  if (!manifestRaw || !zip.file("config.json")) throw new Error("\u914D\u7F6E\u5305\u7F3A\u5C11 manifest.json \u6216 config.json\u3002");
  const manifest = parseConfigJson(manifestRaw);
  if (!isRecord(manifest) || manifest.schemaVersion !== "cairnmap.config-package-manifest.v3") throw Error("\u4E0D\u652F\u6301\u6B64\u914D\u7F6E manifest \u7248\u672C\uFF1B\u8BF7\u4F7F\u7528\u517C\u5BB9\u7248\u672C\u5347\u7EA7\u540E\u91CD\u65B0\u5BFC\u51FA\u3002");
  const manifestKeys = /* @__PURE__ */ new Set(["schemaVersion", "contractRevision", "packageId", "projectId", "revision", "createdAt", "sourceManifestSha256", "files"]);
  if (Object.keys(manifest).some((key2) => !manifestKeys.has(key2))) throw Error("manifest \u5305\u542B\u5F53\u524D schema \u672A\u5B9A\u4E49\u7684\u5C5E\u6027\u3002");
  if (!Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > CONFIG_IMPORT_LIMITS.entries || typeof manifest.packageId !== "string" || typeof manifest.projectId !== "string" || !Number.isSafeInteger(manifest.revision) || !Number.isSafeInteger(manifest.contractRevision) || typeof manifest.createdAt !== "string" || !Number.isFinite(Date.parse(manifest.createdAt))) throw Error("\u914D\u7F6E manifest \u7ED3\u6784\u6216\u8EAB\u4EFD\u65E0\u6548\u3002");
  const declared = /* @__PURE__ */ new Set(), bodies = /* @__PURE__ */ new Map();
  for (const item of manifest.files) {
    if (!isRecord(item) || Object.keys(item).some((key2) => !["path", "sha256", "byteLength"].includes(key2)) || typeof item.path !== "string" || !safeArchivePath(item.path) || item.path.endsWith("/") || item.path === "manifest.json" || declared.has(item.path) || typeof item.sha256 !== "string" || !/^[0-9a-f]{64}$/i.test(item.sha256) || !Number.isSafeInteger(item.byteLength) || Number(item.byteLength) < 0) throw Error("manifest \u6587\u4EF6\u58F0\u660E\u5B58\u5728\u65E0\u6548\u5C5E\u6027\u3001\u8DEF\u5F84\u3001\u91CD\u590D\u6216\u6458\u8981\u683C\u5F0F\u9519\u8BEF\u3002");
    declared.add(item.path);
    importProgress(options, `\u6838\u5BF9\u6587\u4EF6\u5B8C\u6574\u6027\uFF1A${item.path}`);
    const entry = zip.file(item.path);
    if (!entry) throw Error(`\u914D\u7F6E\u5305\u7F3A\u5C11\u58F0\u660E\u6587\u4EF6 ${item.path}\u3002`);
    const body = await entry.async("uint8array");
    if (body.byteLength !== item.byteLength || body.byteLength !== entries.get(item.path) || await sha256(body) !== item.sha256.toLowerCase()) throw Error(`\u914D\u7F6E\u5305 ${item.path} \u54C8\u5E0C\u6821\u9A8C\u5931\u8D25\u6216 byteLength \u4E0D\u4E00\u81F4\u3002`);
    bodies.set(item.path, body);
  }
  for (const required of ["config.json", "reports/validation-report.json", "reports/v1-parity-report.json"]) if (!declared.has(required)) throw Error(`manifest \u7F3A\u5C11\u5FC5\u9700\u6587\u4EF6 ${required}\u3002`);
  for (const name of entries.keys()) if (name !== "manifest.json" && !name.endsWith("/") && !declared.has(name)) throw Error(`\u914D\u7F6E\u5305\u5305\u542B\u672A\u58F0\u660E\u9644\u52A0\u6587\u4EF6 ${name}\uFF1B\u8BF7\u91CD\u65B0\u5BFC\u51FA\uFF0C\u4E0D\u80FD\u5C06\u5176\u9690\u5F0F\u5E94\u7528\u3002`);
  const raw = parseConfigJson(new TextDecoder("utf-8", { fatal: true }).decode(bodies.get("config.json")));
  if (!isRecord(raw) || ["packageId", "projectId", "revision", "contractRevision", "sourceManifestSha256"].some((key2) => manifest[key2] !== raw[key2])) throw Error("manifest \u4E0E config \u7684\u5305\u8EAB\u4EFD\u3001revision \u6216\u5951\u7EA6\u4E0D\u4E00\u81F4\u3002");
  importProgress(options, "\u8FC1\u79FB\u4E0E\u68C0\u67E5\u914D\u7F6E\u7ED3\u6784");
  return raw;
}

// src/core/project/applicationResources.ts
var DYNMAP_FLAT_PRESET = { id: "dynmap-flat", worldToMap: [4, 0, 0, 0, 0, -4, 0, 1, 0], mapToWorld: [0.25, 0, 0, 0, 0, 1, 0, -0.25, 0], mapzoomin: 2, mapzoomout: 3, tileSize: 128, tilescale: 0 };
var DEFAULT_TILE_SETTINGS = { prefix: "flat", imageFormat: "jpg", extraZoomLevels: 2, minNativeZoom: -2, maxNativeZoom: 3, maxRetries: 3, retryDelay: 1e3 };
var REGISTERED_TILE_PROXIES = [{ id: "ria-satellite", name: "RIA Satellite \u540C\u6E90\u4EE3\u7406", target: "https://satellite.ria.red/map/", path: "/api/dynmap/" }];
var isWorldGroups = (sources) => "kind" in sources && sources.kind === "world-groups";
var escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function attributionMarkup(value) {
  const name = escape(value.name || value.legacyText || "");
  return value.url ? `&copy; <a href="${escape(value.url)}">${name}</a>` : name;
}
function expandWorldTemplate(template, worldKey) {
  if (!/^[A-Za-z0-9_.-]+$/.test(worldKey) || worldKey === "." || worldKey === "..") throw Error("\u8FDC\u7AEF\u4E16\u754C\u952E\u5FC5\u987B\u662F\u5408\u6CD5\u8DEF\u5F84\u6BB5\u3002");
  if (/[{}]/.test(template.split("{world}").join("")) || template.includes("..") || template.includes("\\")) throw Error("\u4E16\u754C\u8DEF\u5F84\u6A21\u677F\u5305\u542B\u672A\u77E5 token \u6216\u975E\u6CD5\u8DEF\u5F84\u3002");
  return template.split("{world}").join(encodeURIComponent(worldKey));
}
function resourceGroupForWorld(application, worldId2) {
  if (!isWorldGroups(application.sources)) return void 0;
  const id = application.sources.bindings[worldId2] ?? application.sources.defaultGroupId;
  const group = application.sources.groups.find((group2) => group2.id === id);
  if (!group || !group.enabled) throw Error(`\u4E16\u754C ${worldId2} \u7684\u6765\u6E90\u914D\u7F6E\u7EC4 ${id} \u4E0D\u5B58\u5728\u6216\u672A\u542F\u7528\u3002`);
  return group;
}
function defaultSourceSettings(application) {
  const sources = application.sources;
  if (!isWorldGroups(sources)) return sources;
  const group = sources.groups.find((group2) => group2.id === sources.defaultGroupId);
  if (!group || !group.enabled) throw Error("\u9ED8\u8BA4\u6765\u6E90\u914D\u7F6E\u7EC4\u4E0D\u5B58\u5728\u6216\u672A\u542F\u7528\u3002");
  return group.sources;
}
function resolveGroupTiles(profile, worldKey) {
  const baseUrl = expandWorldTemplate(profile.baseUrlTemplate, worldKey);
  let filteredBaseUrl = baseUrl;
  if (profile.filteredAccess === "registered-proxy") {
    const proxy = REGISTERED_TILE_PROXIES.find((proxy2) => proxy2.id === profile.proxyId);
    if (!proxy || !baseUrl.startsWith(proxy.target)) throw Error("\u74E6\u7247\u4EE3\u7406\u672A\u6CE8\u518C\u6216\u4E0E\u5B9E\u9645\u539F\u56FE\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u90E8\u7F72\u5BF9\u5E94\u4EE3\u7406\u6216\u4F7F\u7528\u652F\u6301 CORS \u7684\u76F4\u8FDE\u3002");
    filteredBaseUrl = proxy.path + baseUrl.slice(proxy.target.length);
  }
  if (profile.legacyFilteredTemplate) throw Error("\u5386\u53F2\u6EE4\u955C\u4EE3\u7406\u5730\u5740\u5C1A\u672A\u786E\u8BA4\u90E8\u7F72\u6620\u5C04\uFF0C\u5DF2\u4FDD\u7559\uFF0C\u8BF7\u9009\u62E9\u5DF2\u6CE8\u518C\u4EE3\u7406\u6216\u660E\u786E\u4F7F\u7528\u76F4\u8FDE\u3002");
  return { ...DEFAULT_TILE_SETTINGS, ...Object.fromEntries(Object.entries(profile).filter(([key2, value]) => key2 in DEFAULT_TILE_SETTINGS && value !== void 0)), baseUrl, filteredBaseUrl, attribution: attributionMarkup(profile.attribution) };
}
function resolveApplicationWorld(application, world) {
  const group = resourceGroupForWorld(application, world.id);
  if (!group) {
    if (!world.tiles || !world.projection || !world.dataSourceId) throw Error(`\u65E7\u4E16\u754C ${world.id} \u7684\u6765\u6E90\uFF0F\u6295\u5F71\uFF0F\u74E6\u7247\u914D\u7F6E\u4E0D\u5B8C\u6574\u3002`);
    return world;
  }
  return { ...world, dataSourceId: group.sources.defaultSourceId, projection: world.projectionOverride ?? DYNMAP_FLAT_PRESET, tiles: resolveGroupTiles(group.tiles, world.remoteWorldId ?? world.id) };
}
function resolveApplicationSettings(application) {
  return { ...application, sources: defaultSourceSettings(application), worlds: application.worlds.map((world) => resolveApplicationWorld(application, world)) };
}
function validateResourceGroups(application) {
  if (!isWorldGroups(application.sources)) return [];
  const issues = [], fail = (path2, message) => issues.push({ path: path2, message });
  const config = application.sources, ids = /* @__PURE__ */ new Set(), storage = /* @__PURE__ */ new Set(), worlds = new Set(application.worlds.map((world) => world.id));
  for (const group of config.groups) {
    const path2 = `sources/groups/${group.id}`;
    if (!/^[A-Za-z0-9_-]+$/.test(group.id) || ["__proto__", "constructor", "prototype"].includes(group.id) || ids.has(group.id)) fail(path2, "\u6765\u6E90\u7EC4 ID \u975E\u6CD5\u6216\u91CD\u590D\u3002");
    ids.add(group.id);
    if (!(group.label.zh.trim() || group.label.en.trim())) fail(path2, "\u6765\u6E90\u7EC4\u81F3\u5C11\u9700\u8981\u4E00\u79CD\u8BED\u8A00\u7684\u540D\u79F0\u3002");
    if (!group.sources.storageKey.trim() || storage.has(group.sources.storageKey)) fail(path2, "\u5404\u6765\u6E90\u7EC4\u987B\u4F7F\u7528\u4E0D\u540C\u4E14\u975E\u7A7A\u7684\u9009\u6E90\u72B6\u6001\u5B58\u50A8\u952E\u3002");
    storage.add(group.sources.storageKey);
    if (!group.sources.linkModes.storageKey.trim() || storage.has(group.sources.linkModes.storageKey)) fail(path2, "\u6765\u6E90\u7EC4\u94FE\u63A5\u6A21\u5F0F\u5B58\u50A8\u952E\u987B\u72EC\u7ACB\u4E14\u975E\u7A7A\u3002");
    storage.add(group.sources.linkModes.storageKey);
    if (!["fixed", "user-select", "user-select-on-failure"].includes(group.sources.selectionMode)) fail(path2, "\u672A\u77E5\u6765\u6E90\u9009\u62E9\u65B9\u5F0F\u3002");
    const sourceIds = /* @__PURE__ */ new Set();
    for (const source of group.sources.items) {
      if (!/^[A-Za-z0-9_-]+$/.test(source.id) || sourceIds.has(source.id)) fail(path2, "\u7EC4\u5185\u6570\u636E\u6E90 ID \u975E\u6CD5\u6216\u91CD\u590D\u3002");
      sourceIds.add(source.id);
      for (const [key2, url] of [["rootUrl", source.rootUrl], ["mediaRootUrl", source.mediaRootUrl]]) if (url || key2 === "rootUrl") try {
        const value = new URL(url);
        if (!["http:", "https:"].includes(value.protocol) || value.username || value.password) throw Error();
      } catch {
        fail(path2 + "/" + key2, "\u6570\u636E\uFF0F\u5A92\u4F53\u6765\u6E90\u987B\u4E3A\u65E0\u51ED\u636E\u7684 HTTP(S) \u5730\u5740\u3002");
      }
      if (source.readerKind !== "formal-release-v2" || source.readerSchemaVersion !== "openriamap.formal-release-reader.v2") fail(path2, "\u672A\u77E5\u8BFB\u53D6\u534F\u8BAE\uFF1B\u5F53\u524D\u53EA\u652F\u6301 formal-release-v2\u3002");
      if (!["direct", "github-raw-compatible"].includes(source.transport)) fail(path2, "\u672A\u77E5\u6570\u636E\u8BBF\u95EE\u65B9\u5F0F\u3002");
      if (source.transport === "github-raw-compatible" && !group.sources.github.sourceIds.includes(source.id)) fail(path2, "GitHub \u8BBF\u95EE\u65B9\u5F0F\u672A\u7ED1\u5B9A\u8BE5\u7EC4\u6570\u636E\u6E90\u3002");
    }
    if (!group.sources.items.some((source) => source.id === group.sources.defaultSourceId && source.enabled)) fail(path2, "\u7EC4\u5185\u9ED8\u8BA4\u6570\u636E\u6E90\u4E0D\u5B58\u5728\u6216\u672A\u542F\u7528\u3002");
    if (group.sources.github.sourceIds.some((id) => !sourceIds.has(id))) fail(path2, "\u7EC4\u5185 GitHub \u6765\u6E90\u5F15\u7528\u4E0D\u5B58\u5728\u3002");
    if (group.sources.linkModes.items.filter((mode) => mode.default).length !== 1) fail(path2, "\u7EC4\u5185\u987B\u6709\u4E00\u4E2A\u9ED8\u8BA4\u94FE\u63A5\u6A21\u5F0F\u3002");
    const modeIds = /* @__PURE__ */ new Set();
    for (const mode of group.sources.linkModes.items) {
      if (!/^[A-Za-z0-9_-]+$/.test(mode.id) || modeIds.has(mode.id)) fail(path2, "\u94FE\u63A5\u6A21\u5F0F ID \u975E\u6CD5\u6216\u91CD\u590D\u3002");
      modeIds.add(mode.id);
      try {
        const url = new URL(mode.baseUrl);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw Error();
      } catch {
        fail(path2, "\u94FE\u63A5\u6A21\u5F0F\u6839\u5730\u5740\u987B\u4E3A\u65E0\u51ED\u636E\u7684 HTTP(S) \u5730\u5740\u3002");
      }
    }
    for (const part of [group.sources.github.owner, group.sources.github.repo, group.sources.github.branch]) if (!part || !/^[A-Za-z0-9_.\/-]+$/.test(part) || part.includes("..")) fail(path2, "\u7EC4\u5185 GitHub \u4ED3\u5E93\u53C2\u6570\u975E\u6CD5\u3002");
    try {
      for (const template of [group.dataPathTemplate, group.mediaPathTemplate]) {
        expandWorldTemplate(template, "world");
        if (template.startsWith("/") || /^[a-z]+:/i.test(template)) throw Error("\u6570\u636E\uFF0F\u5A92\u4F53\u5B50\u8DEF\u5F84\u6A21\u677F\u987B\u4E3A\u6839\u5730\u5740\u4E0B\u7684\u76F8\u5BF9\u8DEF\u5F84\u3002");
      }
      const tile = resolveGroupTiles(group.tiles, "world"), url = new URL(tile.baseUrl);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw Error("\u74E6\u7247\u6765\u6E90\u987B\u4E3A\u65E0\u51ED\u636E\u7684 HTTP(S) \u5730\u5740\u3002");
      if (![tile.extraZoomLevels, tile.maxRetries].every(Number.isSafeInteger) || tile.extraZoomLevels < 0 || tile.extraZoomLevels > 16 || tile.maxRetries < 0 || tile.maxRetries > 10 || !Number.isFinite(tile.retryDelay) || tile.retryDelay < 0) throw Error("\u74E6\u7247\u989D\u5916\u7EA7\u522B\uFF0F\u91CD\u8BD5\u53C2\u6570\u975E\u6CD5\u3002");
      if (!Number.isInteger(tile.minNativeZoom) || !Number.isInteger(tile.maxNativeZoom) || tile.minNativeZoom > tile.maxNativeZoom || tile.minNativeZoom < application.preferences.map.leafletOffset || tile.maxNativeZoom > 8 + application.preferences.map.leafletOffset) throw Error("\u539F\u751F\u74E6\u7247\u8303\u56F4\u4E0D\u5728\u5171\u4EAB Zoom \u6620\u5C04\u4E2D\u3002");
      if (group.tiles.attribution.url) {
        const link = new URL(group.tiles.attribution.url);
        if (!["http:", "https:"].includes(link.protocol) || link.username || link.password) throw Error("\u7F72\u540D\u94FE\u63A5\u975E\u6CD5\u3002");
      }
    } catch (error) {
      fail(path2, error instanceof Error ? error.message : String(error));
    }
  }
  if (!config.groups.some((group) => group.id === config.defaultGroupId && group.enabled)) fail("sources/defaultGroupId", "\u9ED8\u8BA4\u6765\u6E90\u7EC4\u5FC5\u987B\u5B58\u5728\u4E14\u542F\u7528\u3002");
  if (config.sharedInterfaceGroupId && !ids.has(config.sharedInterfaceGroupId)) fail("sources/sharedInterfaceGroupId", "\u5F53\u524D\u5E94\u7528\u5BA1\u6838\uFF0F\u73A9\u5BB6\u670D\u52A1\u7684\u6765\u6E90\u7EC4\u5F15\u7528\u4E0D\u5B58\u5728\u3002");
  for (const [world, id] of Object.entries(config.bindings)) if (!worlds.has(world) || !config.groups.some((group) => group.id === id && group.enabled)) fail("sources/bindings/" + world, "\u7ED1\u5B9A\u7684\u4E16\u754C\u6216\u542F\u7528\u6765\u6E90\u7EC4\u4E0D\u5B58\u5728\u3002");
  const normalizedWorlds = /* @__PURE__ */ new Set();
  for (const world of application.worlds) {
    const normalized = world.id.toLowerCase();
    if (normalizedWorlds.has(normalized) || ["__proto__", "constructor", "prototype"].includes(normalized)) fail("worlds/" + world.id, "\u4E16\u754C ID \u4E0D\u80FD\u4E0E\u53E6\u4E00\u4E16\u754C\u4EC5\u5927\u5C0F\u5199\u4E0D\u540C\u6216\u4F7F\u7528\u4FDD\u7559\u540D\u79F0\u3002");
    normalizedWorlds.add(normalized);
    if (world.dataSourceId !== void 0 || world.tiles !== void 0 || world.projection !== void 0) fail("worlds/" + world.id, "\u6765\u6E90\u7EC4\u4E16\u754C\u4E0D\u80FD\u540C\u65F6\u4FDD\u5B58\u65E7\u7684\u96F6\u6563\u6570\u636E\u6E90\uFF0F\u6295\u5F71\uFF0F\u74E6\u7247\u8BBE\u7F6E\u3002");
    try {
      expandWorldTemplate("{world}", world.remoteWorldId ?? world.id);
    } catch (error) {
      fail("worlds/" + world.id, String(error));
    }
  }
  return issues;
}

// src/configStudio/workflowExpression.ts
var WORKFLOW_FUNCTIONS = [
  { name: "join", label: "\u53EF\u9009\u6BB5\u62FC\u63A5", signature: 'join("_",A,B)', description: "\u4EE5\u5206\u9694\u7B26\u8FDE\u63A5\u975E\u7A7A\u7247\u6BB5\uFF0C\u4FDD\u7559 0 \u548C false\u3002", min: 2, max: 4096 },
  { name: "coalesce", label: "\u9996\u4E2A\u975E\u7A7A\u503C", signature: "coalesce(A,B)", description: "\u53D6\u9996\u4E2A\u975E\u7A7A\u503C\uFF0C0 \u548C false \u4E0D\u8DF3\u8FC7\u3002", min: 1, max: 4096 },
  { name: "text", label: "\u8F6C\u4E3A\u6587\u672C", signature: "text(A)", description: "\u4EE5\u53D7\u63A7\u65B9\u5F0F\u5C06\u503C\u8F6C\u6362\u4E3A\u6587\u672C\u3002", min: 1, max: 1 },
  { name: "number", label: "\u8F6C\u4E3A\u6570\u5B57", signature: "number(A)", description: "\u8FD4\u56DE\u6709\u6548\u6709\u9650\u6570\u5B57\uFF0C\u65E0\u6548\u503C\u62A5\u9519\u3002", min: 1, max: 1 },
  { name: "trim", label: "\u53BB\u9664\u4E24\u7AEF\u7A7A\u767D", signature: "trim(A)", description: "\u8FD4\u56DE\u53BB\u9664\u4E24\u7AEF\u7A7A\u767D\u540E\u7684\u6587\u672C\u3002", min: 1, max: 1 },
  { name: "upper", label: "\u8F6C\u5927\u5199", signature: "upper(A)", description: "\u5C06\u6587\u672C\u8F6C\u6362\u4E3A\u5927\u5199\u3002", min: 1, max: 1 },
  { name: "lower", label: "\u8F6C\u5C0F\u5199", signature: "lower(A)", description: "\u5C06\u6587\u672C\u8F6C\u6362\u4E3A\u5C0F\u5199\u3002", min: 1, max: 1 },
  { name: "abs", label: "\u7EDD\u5BF9\u503C", signature: "abs(A)", description: "\u8FD4\u56DE\u6709\u9650\u6570\u5B57\u7684\u7EDD\u5BF9\u503C\u3002", min: 1, max: 1 },
  { name: "round", label: "\u56DB\u820D\u4E94\u5165", signature: "round(A)", description: "\u5C06\u6709\u9650\u6570\u5B57\u56DB\u820D\u4E94\u5165\u4E3A\u6574\u6570\u3002", min: 1, max: 1 },
  { name: "add", label: "\u6570\u503C\u52A0\u6CD5", signature: "add(A,B)", description: "\u6309\u6570\u503C\u76F8\u52A0\uFF1B+ \u4ECD\u4FDD\u6301\u539F\u6709\u6587\u672C\u62FC\u63A5\u3002", min: 2, max: 2 },
  { name: "subtract", label: "\u6570\u503C\u51CF\u6CD5", signature: "subtract(A,B)", description: "\u6309\u6570\u503C\u76F8\u51CF\u3002", min: 2, max: 2 },
  { name: "multiply", label: "\u6570\u503C\u4E58\u6CD5", signature: "multiply(A,B)", description: "\u6309\u6570\u503C\u76F8\u4E58\u3002", min: 2, max: 2 },
  { name: "divide", label: "\u6570\u503C\u9664\u6CD5", signature: "divide(A,B)", description: "\u6309\u6570\u503C\u76F8\u9664\uFF1B\u9664\u4EE5\u96F6\u62A5\u9519\u3002", min: 2, max: 2 },
  { name: "point", label: "\u5355\u70B9\u5750\u6807\u5BF9\u8C61", signature: "point(A)", description: "\u5C06\u4E00\u4E2A\u70B9\u7684 CoordP \u6570\u7EC4\u53D8\u4E3A {x,y,z}\uFF1B\u591A\u70B9\u62A5\u9519\u3002\u7ED8\u5236\u8FD4\u56DE\u683C\u5F0F\u5DF2\u63D0\u4F9B\u76F4\u63A5\u9009\u62E9\u3002", min: 1, max: 1 },
  { name: "x", label: "\u9996\u70B9 X", signature: "x(A)", description: "\u8BFB\u53D6\u5750\u6807\u5BF9\u8C61\u6216\u89C4\u8303\u51E0\u4F55\u6570\u7EC4\u7684\u9996\u70B9 x\u3002", min: 1, max: 1 },
  { name: "y", label: "\u9996\u70B9 Y", signature: "y(A)", description: "\u8BFB\u53D6\u5750\u6807\u5BF9\u8C61\u6216\u89C4\u8303\u51E0\u4F55\u6570\u7EC4\u7684\u9996\u70B9 y\u3002", min: 1, max: 1 },
  { name: "z", label: "\u9996\u70B9 Z", signature: "z(A)", description: "\u8BFB\u53D6\u5750\u6807\u5BF9\u8C61\u6216\u89C4\u8303\u51E0\u4F55\u6570\u7EC4\u7684\u9996\u70B9 z\u3002", min: 1, max: 1 }
];
var WORKFLOW_SYSTEM_TOKENS = ["ID", "World", "WorldPrefix", "Class", "Kind", "Skind", "Skind2", "Creator"];
var PROTECTED_WORKFLOW_TARGETS = /* @__PURE__ */ new Set(["World", "Class", "Kind", "Skind", "Skind2", "SKind", "SKind2", "Type", "Creator", "CreateBy", "CreateTime", "EditBy", "EditTime", "CoordP", "CoordL", "CoordG", "Geometry"]);
function workflowConditionMatches(condition, slots, system = {}) {
  if (!condition) return true;
  if (condition.all) return condition.all.every((item) => workflowConditionMatches(item, slots, system));
  if (condition.any) return condition.any.some((item) => workflowConditionMatches(item, slots, system));
  const value = Object.prototype.hasOwnProperty.call(system, condition.token) ? system[condition.token] : slots[condition.token];
  const empty3 = value == null || typeof value === "string" && !value.trim();
  if (condition.operator === "empty") return empty3;
  if (condition.operator === "present") return !empty3;
  if (condition.operator === "in") return condition.values?.includes(value) ?? false;
  return value === condition.value;
}
function workflowCaptureSlots(workflow) {
  return workflow.steps.flatMap((step) => [.../* @__PURE__ */ new Set([step.drawing?.pointSlot, step.drawing?.captureSlot, ...(step.drawing?.auxiliaryPoints ?? []).map((point) => point.slot)])]).filter((slot) => Boolean(slot));
}
function workflowDerivedPointTokens(workflow) {
  return workflowCaptureSlots(workflow).flatMap((slot) => [slot, `${slot}_X`, `${slot}_Y`, `${slot}_Z`, `${slot}_HEIGHT`]);
}
function workflowOutputAssemblyOrder(workflow) {
  const dependencies = workflow.outputs.map((output, index) => new Set(output.assignments.flatMap((assignment) => [...workflowExpressionTokens(parseWorkflowExpression(assignment.expression)), ...assignment.when ? [assignment.when.token] : []].flatMap((token) => {
    const match = /^ID_(\d+)$/.exec(token);
    if (!match) return [];
    const target = Number(match[1]) - 1;
    if (target < 0 || target >= workflow.outputs.length) throw new Error(`\u4E0D\u5B58\u5728\u8F93\u51FA token ${token}\u3002`);
    if (target === index) {
      if (assignment.target === "ID") throw new Error(`\u8F93\u51FA ${output.id} \u7684 ID \u4E0D\u80FD\u4F9D\u8D56\u81EA\u8EAB\u6700\u7EC8 ID\u3002`);
      return [];
    }
    return [target];
  }))));
  const visiting = /* @__PURE__ */ new Set();
  const done = /* @__PURE__ */ new Set();
  const order = [];
  const visit = (index) => {
    if (done.has(index)) return;
    if (visiting.has(index)) throw new Error("\u5DE5\u4F5C\u6D41\u8F93\u51FA ID \u4F9D\u8D56\u5F62\u6210\u5FAA\u73AF\u3002");
    visiting.add(index);
    for (const dependency of dependencies[index]) visit(dependency);
    visiting.delete(index);
    done.add(index);
    order.push(index);
  };
  workflow.outputs.forEach((_, index) => visit(index));
  return order;
}
var unsafeSegments = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function isSafeWorkflowTarget(path2) {
  return /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(path2) && !path2.split(".").some((part) => unsafeSegments.has(part));
}
function parseWorkflowExpression(source) {
  if (!source.trim() || source.length > 4096) throw new Error("\u8868\u8FBE\u5F0F\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u8D85\u8FC7 4096 \u5B57\u7B26\u3002");
  let cursor = 0;
  const space = () => {
    while (/\s/.test(source[cursor] ?? "") && cursor < source.length) cursor += 1;
  };
  const atom = (depth) => {
    if (depth > 32) throw new Error("\u8868\u8FBE\u5F0F\u5D4C\u5957\u8FC7\u6DF1\u3002");
    space();
    const quote = source[cursor];
    if (quote === '"' || quote === "'") {
      cursor += 1;
      let value = "";
      while (cursor < source.length) {
        const char = source[cursor++];
        if (char === quote) return { kind: "literal", value };
        if (char !== "\\") {
          value += char;
          continue;
        }
        const escaped = source[cursor++];
        if (escaped === "u") {
          const hex = source.slice(cursor, cursor + 4);
          if (!/^[0-9a-f]{4}$/i.test(hex)) throw new Error("\u6587\u672C\u4E2D\u7684 Unicode \u8F6C\u4E49\u65E0\u6548\u3002");
          value += String.fromCharCode(parseInt(hex, 16));
          cursor += 4;
        } else {
          const escapes = { n: "\n", r: "\r", t: "	", b: "\b", f: "\f", "\\": "\\", '"': '"', "'": "'", "/": "/" };
          if (!(escaped in escapes)) throw new Error("\u6587\u672C\u8F6C\u4E49\u65E0\u6548\u3002");
          value += escapes[escaped];
        }
      }
      throw new Error("\u6587\u672C\u7F3A\u5C11\u7ED3\u675F\u5F15\u53F7\u3002");
    }
    const number2 = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(source.slice(cursor));
    if (number2) {
      cursor += number2[0].length;
      const value = Number(number2[0]);
      if (!Number.isFinite(value)) throw new Error("\u6570\u503C\u65E0\u6548\u3002");
      return { kind: "literal", value };
    }
    const name = /^[A-Za-z][A-Za-z0-9_]*/.exec(source.slice(cursor));
    if (!name) throw new Error(`\u65E0\u6CD5\u89E3\u6790\u7B2C ${cursor + 1} \u4E2A\u5B57\u7B26\uFF1B\u53EA\u5141\u8BB8\u69FD\u4F4D\u3001\u7CFB\u7EDF\u5B57\u6BB5\u3001\u6587\u672C\u3001+ \u548C join\u3002`);
    cursor += name[0].length;
    space();
    if (source[cursor] !== "(") {
      if (name[0] === "true" || name[0] === "false") return { kind: "literal", value: name[0] === "true" };
      if (name[0] === "null") return { kind: "literal", value: null };
      return { kind: "token", name: name[0] };
    }
    const definition = WORKFLOW_FUNCTIONS.find((item) => item.name === name[0]);
    if (!definition) throw new Error(`\u7B2C ${cursor - name[0].length + 1} \u4E2A\u5B57\u7B26\uFF1A\u4E0D\u652F\u6301\u51FD\u6570 ${name[0]}\u3002`);
    cursor += 1;
    const args = [];
    while (true) {
      args.push(expression(depth + 1));
      space();
      if (source[cursor] === ")") {
        cursor += 1;
        break;
      }
      if (source[cursor] !== ",") throw new Error("join \u53C2\u6570\u5FC5\u987B\u7528\u9017\u53F7\u5206\u9694\u5E76\u4EE5 ) \u7ED3\u675F\u3002");
      cursor += 1;
    }
    if (args.length < definition.min || args.length > definition.max) throw new Error(`${name[0]} \u53C2\u6570\u6570\u91CF\u5E94\u4E3A ${definition.min}\u2013${definition.max}\u3002`);
    return name[0] === "join" ? { kind: "join", args } : { kind: "call", name: name[0], args };
  };
  const expression = (depth) => {
    const parts = [atom(depth)];
    space();
    while (source[cursor] === "+") {
      cursor += 1;
      parts.push(atom(depth));
      space();
    }
    return parts.length === 1 ? parts[0] : { kind: "concat", parts };
  };
  const parsed = expression(0);
  space();
  if (cursor !== source.length) throw new Error(`\u7B2C ${cursor + 1} \u4E2A\u5B57\u7B26\u8D77\u6709\u4E0D\u652F\u6301\u7684\u8868\u8FBE\u5F0F\u3002`);
  return parsed;
}
function workflowExpressionTokens(expression) {
  if (expression.kind === "token") return [expression.name];
  if (expression.kind === "literal") return [];
  return [...new Set((expression.kind === "join" || expression.kind === "call" ? expression.args : expression.parts).flatMap(workflowExpressionTokens))];
}
function evaluateWorkflowExpression(source, slots, system) {
  const text = (value) => value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  const run = (expression) => {
    if (expression.kind === "literal") return expression.value;
    if (expression.kind === "token") return Object.prototype.hasOwnProperty.call(system, expression.name) ? system[expression.name] : Object.prototype.hasOwnProperty.call(slots, expression.name) ? slots[expression.name] : void 0;
    if (expression.kind === "concat") return expression.parts.map((part) => text(run(part))).join("");
    if (expression.kind === "call") {
      const values2 = expression.args.map(run);
      const value = values2[0];
      const numeric2 = (raw) => {
        if (raw == null || typeof raw === "string" && !raw.trim()) throw new Error("\u6570\u503C\u53C2\u6570\u5C1A\u672A\u586B\u5199\u3002");
        const number2 = Number(raw);
        if (!Number.isFinite(number2)) throw new Error("\u6570\u503C\u53C2\u6570\u65E0\u6548\u3002");
        return number2;
      };
      const finite = (value2) => {
        if (!Number.isFinite(value2)) throw new Error("\u8BA1\u7B97\u7ED3\u679C\u8D85\u51FA\u6709\u9650\u6570\u503C\u8303\u56F4\u3002");
        return value2;
      };
      const coordinate = (raw) => {
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
          const point2 = raw;
          return { x: numeric2(point2.x), y: numeric2(point2.y), z: numeric2(point2.z) };
        }
        let point = raw;
        while (Array.isArray(point) && Array.isArray(point[0])) point = point[0];
        if (!Array.isArray(point) || point.length !== 3) throw new Error("\u53C2\u6570\u4E0D\u662F\u6709\u6548\u5750\u6807\u3002");
        return { x: numeric2(point[0]), y: numeric2(point[1]), z: numeric2(point[2]) };
      };
      switch (expression.name) {
        case "coalesce":
          return values2.find((item) => item != null && !(typeof item === "string" && !item.trim()));
        case "text":
          return text(value);
        case "number":
          return numeric2(value);
        case "trim":
          return text(value).trim();
        case "upper":
          return text(value).toUpperCase();
        case "lower":
          return text(value).toLowerCase();
        case "abs":
          return Math.abs(numeric2(value));
        case "round":
          return Math.round(numeric2(value));
        case "add":
          return finite(numeric2(value) + numeric2(values2[1]));
        case "subtract":
          return finite(numeric2(value) - numeric2(values2[1]));
        case "multiply":
          return finite(numeric2(value) * numeric2(values2[1]));
        case "divide": {
          const divisor = numeric2(values2[1]);
          if (divisor === 0) throw new Error("\u4E0D\u80FD\u9664\u4EE5\u96F6\u3002");
          return finite(numeric2(value) / divisor);
        }
        case "point":
          if (Array.isArray(value) && (value.length !== 1 || !Array.isArray(value[0]) || value[0].length !== 3 || value[0].some(Array.isArray))) throw new Error("\u5355\u70B9\u5BF9\u8C61\u8F6C\u6362\u53EA\u5141\u8BB8\u4E00\u4E2A\u70B9\u3002");
          return coordinate(value);
        case "x":
          return coordinate(value).x;
        case "y":
          return coordinate(value).y;
        case "z":
          return coordinate(value).z;
        default:
          throw new Error("\u672A\u77E5\u53D7\u63A7\u51FD\u6570\u3002");
      }
    }
    const [separator, ...parts] = expression.args;
    return parts.map(run).filter((value) => value != null && String(value).trim()).map(text).join(text(run(separator)));
  };
  return run(parseWorkflowExpression(source));
}

// src/configStudio/workflowPreflight.ts
var CONDITION_BUDGET = 128;
function clauses(condition, depth = 0, budget = { remaining: 2048 }, unstable = /* @__PURE__ */ new Set()) {
  if (depth > 32 || --budget.remaining < 0) throw new Error("condition budget");
  if (!condition) return [[]];
  if (condition.any) {
    const result = condition.any.flatMap((child) => clauses(child, depth + 1, budget, unstable));
    if (result.length > CONDITION_BUDGET) throw new Error("condition budget");
    return result;
  }
  if (condition.all) return condition.all.reduce((result, child) => {
    const next = clauses(child, depth + 1, budget, unstable);
    if (result.length * next.length > CONDITION_BUDGET) throw new Error("condition budget");
    return result.flatMap((left) => next.map((right) => [...left, ...right]));
  }, [[]]);
  budget.remaining -= condition.values?.length ?? 0;
  if (budget.remaining < 0) throw new Error("condition value budget");
  return unstable.has(condition.token) ? [[]] : [[condition]];
}
var isEmpty = (value) => value == null || typeof value === "string" && !value.trim();
function impossible(clause) {
  const constraints = /* @__PURE__ */ new Map();
  for (const item of clause) {
    const prior = constraints.get(item.token) ?? {};
    const presence = item.operator === "empty" ? false : item.operator === "present" ? true : void 0;
    if (presence !== void 0) {
      if (prior.presence !== void 0 && prior.presence !== presence) return true;
      prior.presence = presence;
    } else {
      const values2 = item.operator === "equals" && item.value !== void 0 ? [item.value] : item.operator === "in" ? item.values : void 0;
      if (!values2) throw new Error("unknown condition");
      const allowed = new Set(values2);
      prior.values = prior.values ? prior.values.filter((value) => allowed.has(value)) : values2;
    }
    if (prior.values && !prior.values.some((value) => prior.presence === void 0 || !isEmpty(value) === prior.presence)) return true;
    constraints.set(item.token, prior);
  }
  return false;
}
function workflowConditionsDisjoint(left, right, unstable = /* @__PURE__ */ new Set()) {
  try {
    const items = [...left, ...right].filter(Boolean);
    const combined = clauses({ all: items }, 0, { remaining: 2048 }, unstable);
    return combined.every(impossible);
  } catch {
    return void 0;
  }
}
var shape = (...kinds) => ({ kinds });
function constant(value) {
  const result = shape(value == null ? "null" : Array.isArray(value) ? "array" : typeof value);
  result.constants = [value];
  if (Array.isArray(value)) result.item = value.length ? union(value.map(constant)) : shape("unknown");
  return result;
}
function union(values2) {
  return {
    kinds: [...new Set(values2.flatMap((value) => value.kinds))],
    ...values2.every((value) => value.constants) ? { constants: values2.flatMap((value) => value.constants) } : {},
    ...values2.some((value) => value.item) ? { item: union(values2.flatMap((value) => value.item ? [value.item] : [])) } : {}
  };
}
function fieldShape(field) {
  if (!field) return shape("unknown");
  const type = field.type === "enum" ? field.optionValueType ?? "string" : field.type === "reference" ? "string" : field.type;
  const result = type === "json" ? field.coordinateFormat ? shape(field.coordinateFormat === "pointObject" ? "object" : "array") : shape("unknown") : shape(type);
  if (field.cardinality === "multiple") return { kinds: ["array"], item: result };
  return result;
}
function validateWorkflowWrites(workflow, fields) {
  const issues = [];
  const base = `workflows/${workflow.id}`;
  const add = (code, path2, message, severity = "error") => issues.push({ severity, code, path: path2, message });
  const tokens = /* @__PURE__ */ new Map();
  for (const token of WORKFLOW_SYSTEM_TOKENS) {
    tokens.set(token, shape("string"));
    workflow.outputs.forEach((_, index) => tokens.set(`${token}_${index + 1}`, shape("string")));
  }
  const controlShape = (control) => {
    if (control.kind === "group" && "group" in control) return { kinds: ["array"], item: control.group?.storage === "scalar" ? controlShape(control.group.itemFields[0]) : shape("object") };
    if (control.kind === "json" || control.kind === "runtimeValue" || control.kind === "component") return shape("unknown");
    if (control.kind === "select") {
      const type = control.optionValueType ?? "string";
      const options = control.options?.map((option) => type === "number" ? Number(option.value) : type === "boolean" ? option.value === "true" : option.value);
      return { kinds: [type], ...options?.length ? { constants: options } : {} };
    }
    if (control.valueNormalization === "trim" || control.valueNormalization === "abbr") return shape("string");
    if (control.kind === "number" || control.valueNormalization === "number") return shape("number");
    if (control.kind === "toggle") return shape("boolean");
    if ((control.kind === "featureSearch" || control.kind === "coarseSearch") && control.search) return fieldShape(fields(control.search.target).find((field) => field.key === control.search.returnField));
    return shape("string");
  };
  for (const step of workflow.steps) {
    for (const control of step.controls ?? []) {
      for (const leaf of [control, ...control.group?.itemFields ?? []]) if (leaf.kind === "toggle" && leaf.valueNormalization && leaf.valueNormalization !== "none") add("workflow-value-normalization-kind-conflict", `${base}/steps/${step.id}/controls/${control.id}`, "\u5E03\u5C14\u63A7\u4EF6\u5E94\u4FDD\u5B58\u5E03\u5C14\u503C\uFF0C\u4E0D\u80FD\u6B8B\u7559\u6587\u5B57\u6216\u6570\u503C\u89C4\u8303\u5316\u3002\u9700\u8981\u6570\u503C\u65F6\u8BF7\u5728\u7EC4\u88C5\u8868\u8FBE\u5F0F\u4E2D\u663E\u5F0F\u8F6C\u6362\u3002");
      if (control.slot) tokens.set(control.slot, controlShape(control));
    }
    for (const slot of [step.drawing?.pointSlot, step.drawing?.captureSlot, ...(step.drawing?.auxiliaryPoints ?? []).map((point) => point.slot)]) if (slot) {
      tokens.set(slot, step.drawing?.returnFormat === "pointObject" ? shape("object") : { kinds: ["array"], item: shape("array", "number") });
      for (const dimension of ["X", "Y", "Z", "HEIGHT"]) tokens.set(`${slot}_${dimension}`, shape("number"));
    }
  }
  const infer = (node) => {
    if (node.kind === "literal") return constant(node.value);
    if (node.kind === "token") return tokens.get(node.name) ?? shape("unknown");
    if (node.kind === "concat" || node.kind === "join") return shape("string");
    if (["text", "trim", "upper", "lower"].includes(node.name)) return shape("string");
    if (node.name === "coalesce") {
      const parts = node.args.map(infer).filter((part) => !part.constants?.every(isEmpty));
      return parts.length ? union(parts) : shape("null");
    }
    if (node.name === "point") return shape("object");
    return shape("number");
  };
  for (const output of workflow.outputs) {
    const writers = [];
    const targetFields = fields(output.classification);
    for (const assignment of output.assignments) {
      const path2 = `${base}/outputs/${output.id}/assignments/${assignment.id}`;
      writers.push({ target: assignment.target, path: path2, conditions: [output.when, assignment.when] });
      const field = targetFields.find((field2) => field2.key === assignment.target);
      try {
        const ast = parseWorkflowExpression(assignment.expression);
        const actual = workflowExpressionTokens(ast).length ? infer(ast) : constant(evaluateWorkflowExpression(assignment.expression, {}, {}));
        if (!field || field.type === "json" && field.cardinality === "single" && !field.coordinateFormat) continue;
        if (actual.constants?.every(isEmpty)) continue;
        const expected = fieldShape(field);
        const actualKinds = actual.kinds.filter((kind) => kind !== "null");
        const incompatible = actualKinds.some((kind) => kind !== "unknown" && !expected.kinds.includes(kind)) || actual.kinds.includes("array") && expected.item && !expected.item.kinds.includes("unknown") && actual.item?.kinds.some((kind) => kind !== "unknown" && !expected.item.kinds.includes(kind));
        if (incompatible) add("workflow-expression-type-conflict", path2, `\u8868\u8FBE\u5F0F\u8FD4\u56DE ${actual.kinds.join("/")}\uFF0C\u76EE\u6807 ${field.key} \u9700\u8981 ${field.cardinality === "multiple" ? "\u591A\u503C " : "\u5355\u503C "}${field.type}\u3002\u8BF7\u8C03\u6574\u8868\u8FBE\u5F0F\u6216\u63A7\u4EF6\u4FDD\u5B58\u7C7B\u578B\u3002`);
        else if (actualKinds.includes("unknown") || actual.item?.kinds.includes("unknown")) add("workflow-expression-type-unknown", path2, `\u76EE\u6807 ${field.key} \u7684\u52A8\u6001\u7ED3\u679C\u7C7B\u578B\u65E0\u6CD5\u9759\u6001\u786E\u5B9A\uFF0C\u8BF7\u4F7F\u7528\u8BD5\u8FD0\u884C\u6838\u5BF9\uFF1B\u63D0\u4EA4\u524D\u4ECD\u4F1A\u68C0\u67E5\u5B9E\u9645\u8BB0\u5F55\u3002`, "warning");
        const constants = actual.constants ?? (actual.kinds.length === 1 && actual.kinds[0] === "array" ? actual.item?.constants : void 0);
        if (field.type === "enum" && constants) {
          const allowed = new Set(field.options?.map((option) => field.optionValueType === "number" ? Number(option.value) : field.optionValueType === "boolean" ? option.value === "true" : option.value));
          if (constants.flatMap((value) => Array.isArray(value) ? value : [value]).some((value) => !isEmpty(value) && !allowed.has(value))) add("workflow-expression-enum-conflict", path2, `\u8868\u8FBE\u5F0F\u5305\u542B\u76EE\u6807 ${field.key} \u5BF9\u7167\u8868\u4E0D\u5141\u8BB8\u7684\u4FDD\u5B58\u503C\u3002`);
        }
      } catch (error) {
        try {
          parseWorkflowExpression(assignment.expression);
          add("workflow-expression-result-invalid", path2, error instanceof Error ? error.message : "\u8868\u8FBE\u5F0F\u65E0\u6CD5\u4EA7\u751F\u6709\u6548\u7ED3\u679C\u3002");
        } catch {
        }
      }
    }
    for (const step of workflow.steps) for (const [index, binding] of (step.drawing?.bindings ?? []).entries()) if (binding.outputId === output.id) writers.push({ target: binding.target, path: `${base}/steps/${step.id}/drawing/bindings/${index}`, conditions: [output.when, step.when, workflow.outputs.find((item) => item.id === step.outputId)?.when] });
    const indexed = /* @__PURE__ */ new Map();
    for (const writer of writers) indexed.set(writer.target, [...indexed.get(writer.target) ?? [], writer]);
    for (const group of indexed.values()) {
      let comparisons = 0;
      pairs: for (let a = 0; a < group.length; a++) for (let b = a + 1; b < group.length; b++) {
        const left = group[a], right = group[b];
        if (++comparisons > 2048) {
          add("workflow-target-write-conflict", right.path, `\u76EE\u6807 ${right.target} \u7684\u91CD\u590D\u5199\u5165\u6570\u91CF\u8D85\u8FC7\u4E92\u65A5\u5206\u6790\u9884\u7B97\uFF0C\u65E0\u6CD5\u8BC1\u660E\u5B89\u5168\u3002\u8BF7\u5408\u5E76\u7EC4\u88C5\u884C\u3002`);
          break pairs;
        }
        const unstable = right.target === "ID" ? /* @__PURE__ */ new Set(["ID", `ID_${workflow.outputs.indexOf(output) + 1}`]) : void 0;
        const disjoint = workflowConditionsDisjoint(left.conditions, right.conditions, unstable);
        if (disjoint !== true) add("workflow-target-write-conflict", right.path, `\u76EE\u6807 ${right.target} \u540C\u65F6\u7531 ${left.path} \u4E0E ${right.path} \u5199\u5165${disjoint === void 0 ? "\uFF0C\u6761\u4EF6\u8D85\u51FA\u5206\u6790\u9884\u7B97\uFF0C\u65E0\u6CD5\u8BC1\u660E\u4E92\u65A5" : "\uFF0C\u6267\u884C\u6761\u4EF6\u4E0D\u80FD\u8BC1\u660E\u4E92\u65A5"}\u3002\u8BF7\u5408\u5E76\u7EC4\u88C5\u6216\u8BBE\u7F6E\u4E92\u65A5\u6761\u4EF6\u3002`);
      }
    }
    for (const writer of writers) {
      const parts = writer.target.split(".");
      for (let at = 1; at < parts.length; at++) {
        const parent = parts.slice(0, at).join(".");
        if (indexed.has(parent)) add("workflow-target-path-overlap", writer.path, `\u7236\u5B50\u8DEF\u5F84 ${parent} / ${writer.target} \u53EF\u80FD\u53D1\u751F\u8986\u76D6\uFF0C\u8BF7\u6838\u5BF9\u7EC4\u88C5\u610F\u56FE\u3002`, "warning");
      }
    }
  }
  return issues;
}

// src/configStudio/workflowDrawingMigration.ts
function migrateWorkflowDrawings(value) {
  const workflow = structuredClone(value);
  if (workflow.mode !== "composed") return workflow;
  const steps = [];
  for (const original of workflow.steps) {
    if (original.kind !== "geometry") {
      steps.push(original);
      continue;
    }
    const { auxiliaryPoints: points, ...drawing } = original.drawing ?? {};
    const main = { ...original, geometryRole: original.geometryRole ?? "output", drawing: { ...drawing } };
    if (main.geometryRole === "output" && main.drawing.pointSlot) {
      main.drawing.captureSlot ??= `${main.drawing.pointSlot}_GEOMETRY`;
      main.drawing.returnFormat ??= main.geometry?.[0] === "Point" ? "coordP" : main.geometry?.[0] === "LineString" ? "coordL" : "coordG";
    }
    if (workflow.outputs.find((output2) => output2.id === main.outputId)?.classification.class === "TPP" && main.label.zh === "\u7ED8\u5236") main.label = { ...main.label, zh: "\u8D77\u70B9\u5750\u6807" };
    steps.push(main);
    for (const point of points ?? []) {
      const moved = (main.controls ?? []).filter((control) => point.when && JSON.stringify(control.when) === JSON.stringify(point.when));
      main.controls = main.controls?.filter((control) => !moved.includes(control));
      const extra = { id: `extra-${point.id}`, kind: "geometry", geometryRole: "auxiliary", label: point.label, when: point.when, geometry: ["Point"], controls: moved.map((control) => {
        const { when: _when, ...next } = control;
        return next;
      }), drawing: { enabledFromThisPage: true, allowBack: true, keepDrawingWhenBack: true, captureSlot: point.slot, returnFormat: "pointObject", multiple: false, heightSlot: moved.find((control) => control.kind === "number")?.slot, bindings: [] } };
      steps.push(extra);
      const output2 = workflow.outputs.find((output3) => output3.id === original.outputId);
      if (output2?.classification.class === "TPP") {
        const known = output2.assignments.filter((assignment) => ["TGTcoordinate.x", "TGTcoordinate.y", "TGTcoordinate.z", "TGTelevation"].includes(assignment.target));
        const recognized = known.every((assignment) => ["-64", `${point.slot}_X`, `${point.slot}_Y`, `${point.slot}_Z`, extra.drawing?.heightSlot].includes(assignment.expression));
        if (recognized) {
          output2.assignments = output2.assignments.filter((assignment) => !known.includes(assignment));
          extra.drawing.bindings = [{ outputId: output2.id, target: "TGTcoordinate", value: "geometry" }, { outputId: output2.id, target: "TGTelevation", value: "height" }];
        }
      }
    }
    const output = workflow.outputs.find((output2) => output2.id === main.outputId);
    if (output && ["TPP", "WRP"].includes(output.classification.class) && main.drawing.pointSlot) {
      const elevation = (main.controls ?? []).find((control) => control.slot === "SOURCE_ELEVATION");
      const rows = output.assignments.filter((assignment) => assignment.target === "elevation");
      if (elevation && rows.length && rows.every((assignment) => ["SOURCE_ELEVATION", "SOURCE_POINT_Y"].includes(assignment.expression))) {
        output.assignments = output.assignments.filter((assignment) => !rows.includes(assignment));
        main.drawing.heightSlot = elevation.slot;
        main.drawing.bindings = [...main.drawing.bindings ?? [], { outputId: output.id, target: "elevation", value: "height" }];
      }
    }
  }
  workflow.steps = steps;
  for (const step of steps.filter((step2) => step2.geometryRole === "output" && step2.drawing?.pointSlot)) {
    const slot = step.drawing.pointSlot;
    const used = workflow.outputs.some((output) => output.assignments.some((row2) => new RegExp(`\\b${slot}(?:_[XYZ])?\\b`).test(row2.expression) || JSON.stringify(row2.when ?? {}).includes(`"${slot}`))) || steps.some((item) => JSON.stringify([item.when, ...(item.controls ?? []).flatMap((control) => [control.when, ...control.requiredWhen ?? []])]).includes(`"${slot}`)) || workflow.outputs.some((output) => JSON.stringify(output.when ?? {}).includes(`"${slot}`));
    if (!used) delete step.drawing.pointSlot;
  }
  return workflow;
}

// src/configStudio/cssColor.ts
var names = new Set("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent".split(" "));
var number = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
var numeric = (value) => number.test(value) && Number.isFinite(Number(value));
var channel = (value) => numeric(value.endsWith("%") ? value.slice(0, -1) : value);
function validCssColor(input) {
  if (typeof input !== "string") return false;
  const value = input.trim().toLowerCase();
  if (names.has(value) || /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/.test(value)) return true;
  const match = /^(rgb|rgba|hsl|hsla)\((.*)\)$/.exec(value);
  if (!match) return false;
  const comma = match[2].includes(",");
  if (comma && match[2].includes("/")) return false;
  const parts = comma ? match[2].split(",").map((part) => part.trim()) : match[2].trim().split(/\s*\/\s*/);
  const channels = comma ? parts.slice(0, 3) : parts[0].split(/\s+/);
  const alpha = comma ? parts[3] : parts[1];
  if (channels.length !== 3 || parts.length > (comma ? 4 : 2) || comma && parts.length < 3 || alpha !== void 0 && !channel(alpha)) return false;
  if (match[1].startsWith("rgb")) return channels.every(channel) && (!comma || channels.every((part) => part.endsWith("%")) || channels.every((part) => !part.endsWith("%")));
  const hue = channels[0].replace(/(?:deg|grad|rad|turn)$/, "");
  return numeric(hue) && channels.slice(1).every((part) => part.endsWith("%") && numeric(part.slice(0, -1)));
}

// src/configStudio/customPill.ts
function customPillErrors(size, value) {
  if (!value) return [{ key: "pill", message: "\u81EA\u5B9A\u4E49\u80F6\u56CA\u9700\u8981\u5B8C\u6574\u7684\u80F6\u56CA\u8BBE\u7F6E\u3002" }];
  const errors = [];
  if (!Number.isFinite(size) || size < 6 || size > 72) errors.push({ key: "size", message: "\u80F6\u56CA\u5B57\u53F7\u5FC5\u987B\u4ECB\u4E8E 6\u201372px\u3002" });
  for (const key2 of ["lineHeightRatio", "paddingYRatio", "paddingXRatio", "radiusRatio"]) {
    const number2 = value[key2];
    if (!Number.isFinite(number2) || number2 > 10 || number2 < 0 || key2 === "lineHeightRatio" && number2 === 0)
      errors.push({ key: key2, message: `${key2} \u5FC5\u987B\u662F${key2 === "lineHeightRatio" ? "\u5927\u4E8E 0" : "\u975E\u8D1F"}\u4E14\u4E0D\u8D85\u8FC7 10 \u7684\u6709\u9650\u6570\u5B57\u3002` });
  }
  if (!Number.isFinite(value.strokeWidth) || value.strokeWidth < 0 || value.strokeWidth > 72)
    errors.push({ key: "strokeWidth", message: "\u80F6\u56CA\u63CF\u8FB9\u5BBD\u5EA6\u5FC5\u987B\u4ECB\u4E8E 0\u201372px\u3002" });
  return errors;
}

// src/configStudio/pinhead-capabilities.generated.json
var pinhead_capabilities_generated_default = { library: "pinhead", version: "25", manifestSha256: "c77abb1e97bbb5cf3976d79757e45baecbb922c3ab80fa5ad5b48bca1d0f61fe", ids: ["a", "a_frame_sidewall_tent", "a_frame_sidewall_tents", "a_frame_signboard", "a_frame_tent", "a_frame_tents", "activity_panel", "adit_profile", "adit_profile_with_rocks", "aerial_cargo_lift", "aerial_cargo_lift_with_crates", "aerial_drag_lift", "aerial_gondola", "aerial_j_bar_lift", "aerial_platter_lift", "aerial_t_bar_lift", "aerial_tram", "aerialway_pole", "africa", "africa_and_madagascar", "ahimsa_hand_outline", "airboat_on_water", "airport_terminal", "airport_terminal_with_plane_takeoff", "alabama", "alabama_with_capital_star", "alaska", "american_football", "ampersand", "analog_tv_with_rabbitears", "analog_watch", "anchor", "angel_moroni", "angelfish", "angelfish_under_water", "angry_face", "angry_face_in_circle", "angry_face_in_circle_outline", "anguished_face", "anguished_face_in_circle", "anguished_face_in_circle_outline", "anguished_face_with_spots", "anguished_face_with_spots_in_circle", "anguished_face_with_spots_in_circle_outline", "anime_eye_and_eyebrow", "ankh", "antenna_array", "antibody", "antler", "anus", "anvil", "anvil_and_mallet", "apple", "apple_core", "arch", "archery_arrow", "archery_bow", "archery_bow_and_archery_arrow", "arizona", "arizona_with_capital_star", "arkansas", "arkansas_with_capital_star", "arm", "army_tent", "arrow_bottom_left", "arrow_bottom_right", "arrow_bottom_right_to_eight_point_asterisk", "arrow_down", "arrow_down_from_banknote_in_slot", "arrow_down_from_book_with_bookmark_in_slot", "arrow_down_from_envelope_in_slot", "arrow_down_from_payment_card_in_slot", "arrow_down_from_rectangle_outline", "arrow_down_from_ticket_in_slot", "arrow_down_from_up_bracket", "arrow_down_to_down_bracket", "arrow_down_to_rectangle_outline", "arrow_left", "arrow_left_from_rectangle_tall_outline", "arrow_left_from_right_bracket", "arrow_left_to_left_bracket", "arrow_left_to_rectangle_tall_outline", "arrow_right", "arrow_right_from_left_bracket", "arrow_right_from_rectangle_tall_outline", "arrow_right_to_rectangle_tall_outline", "arrow_right_to_right_bracket", "arrow_top_left", "arrow_top_right", "arrow_top_right_from_square_outline", "arrow_up", "arrow_up_from_down_bracket", "arrow_up_from_rectangle_outline", "arrow_up_to_banknote_in_slot", "arrow_up_to_book_with_bookmark_in_slot", "arrow_up_to_envelope_in_slot", "arrow_up_to_payment_card_in_slot", "arrow_up_to_rectangle_outline", "arrow_up_to_ticket_in_slot", "arrow_up_to_up_bracket", "arrows_left_right", "arrows_left_right_above_water", "arrows_left_right_above_waters", "arrows_recirculating", "arrows_up_down_in_left_right_brackets", "art_text", "art_text_above_swash_line", "astrologers_hat", "at_sign", "atm_text", "atv", "axe", "axe_and_chipped_log", "axe_and_firewood_pile", "axial_reflecting_dish_with_monopod_antenna_and_beams", "axial_reflecting_dish_with_tripod_antenna", "b", "baby", "baby_crawling", "baby_in_swaddle", "bacteria", "badge_shield", "badge_shield_with_fire", "badge_shield_with_star", "badminton_racket_and_shuttlecock", "bag", "bag_of_trash", "bag_of_trash_with_stink", "bag_with_greek_cross", "bagel", "bagel_seeded", "baguette", "baht", "balance_scales", "balloon", "banana", "banana_and_apple", "banana_hand", "banknote", "banknote_in_hand", "banknote_in_slot", "barbecue_grill_wheeled_with_steam", "barbecue_grill_with_steam", "barbed_hook", "barbell", "barn", "barn_and_silo", "barrel_with_bunghole", "barricade", "baseball_bat_and_baseball", "basket_swing", "basketball_in_basketball_net", "bathroom_scale", "beach_umbrella_in_ground", "bear", "bear_spray_can", "bear_spray_can_with_spray", "bear_spray_can_with_spray_and_arrow_right_above_arrow_left", "bear_spray_can_with_spray_and_baht", "bear_spray_can_with_spray_and_dollar", "bear_spray_can_with_spray_and_euro", "bear_spray_can_with_spray_and_peso", "bear_spray_can_with_spray_and_pound", "bear_spray_can_with_spray_and_recycling_symbol", "bear_spray_can_with_spray_and_ruble", "bear_spray_can_with_spray_and_rupee", "bear_spray_can_with_spray_and_shekel", "bear_spray_can_with_spray_and_yen_yuan", "beaver_in_water", "bed", "bee", "bee_skep", "beer_bottle_and_drink_bottle", "beer_bottles_row", "beer_mug_with_foam", "belgium", "belgium_with_capital_star", "bell", "bell_in_tall_gable_roofed_building", "bench", "bench_with_armrests", "bench_with_armrests_and_backrest", "bench_with_armrests_and_backrest_with_plaque", "bench_with_backrest", "bench_with_backrest_in_rectangular_shelter", "bench_with_backrest_with_plaque", "bench_with_plaque", "bench_with_plaque_and_armrests", "bicycle", "bicycle_and_arrow_right_above_arrow_left", "bicycle_and_baht", "bicycle_and_dollar", "bicycle_and_euro", "bicycle_and_key", "bicycle_and_locked_lock_with_keyhole", "bicycle_and_peso", "bicycle_and_pound", "bicycle_and_ruble", "bicycle_and_rupee", "bicycle_and_shekel", "bicycle_and_tag", "bicycle_and_taxi_checkerboard", "bicycle_and_wrench", "bicycle_and_yen_yuan", "bicycle_barrier", "bicycle_in_garage", "bicycle_in_locker", "bicycle_in_parking_structure", "bicycle_in_rectangle_outline", "bicycle_on_parking_line", "bicycle_under_list_beside_checkmark", "bicycle_under_shower_spray", "bicycle_with_staple_stand", "bifold_map_with_dotted_line_to_x", "bifold_pamphlet", "big_top_tent_with_pennant", "billboard", "binoculars", "biohazard_symbol", "bird", "bird_flying", "bishops_miter_with_latin_cross_beside_crozier_head", "bison", "bladder", "bleachers", "blood_cells", "boat_on_trailer", "boat_on_trailer_on_ramp_on_water", "bohr_atomic_model", "bollard", "bollard_row", "bolt", "bone", "book", "book_with_arrows_recirculating", "book_with_balance_scales", "book_with_bookmark", "book_with_bookmark_in_slot", "book_with_dna", "book_with_info_i", "book_with_molar_tooth", "book_with_music_notes_eighth", "book_with_pawprint", "book_with_pencil_and_apple", "book_with_raised_cover", "book_with_rocketship", "book_with_square_academic_cap", "bookmark", "bookmark_outline", "boombox", "border_officer_with_open_suitcase", "border_officer_with_stop_arm_with_passport", "bowling_ball", "bowling_pin", "bowling_pin_and_bowling_ball", "bowling_pins", "box_truck", "boxes_on_pallet", "boxing_glove_up", "brick_trowel", "bridge", "bridge_tied_arch", "briefcase", "briefcase_with_bolt", "briefcase_with_greek_cross", "briefcase_with_heavy_six_point_asterisk", "briefcase_with_info_i", "briefcase_with_shield", "broadleaved_tree", "broadleaved_tree_in_water", "bucket", "budded_latin_cross", "buffer_stop", "bulbed_star", "bull", "bulldozer", "bullet_train", "bullet_train_on_railway_track", "bulletin_board", "bunker", "bunker_silo", "buoy_on_water", "burger", "burger_and_drink_cup_with_straw", "bus", "bus_with_destination_display", "bus_with_destination_display_and_pantograph", "bus_with_destination_display_within_guideway", "bus_with_pantograph", "bus_within_guideway", "bust_on_plinth", "butterfly", "butterfly_with_stars_and_dots", "button", "c", "cabin", "cabin_with_chimney", "cable", "cairn", "calculator", "calendar", "calendar_with_wheelie_bin", "california", "california_with_capital_star", "calm_face", "calm_face_in_circle", "calm_face_in_circle_outline", "camera", "camper_trailer", "camper_trailer_with_waste_dump", "campfire", "campfire_in_arch", "campsite", "campsite_above_water", "campsite_above_waters", "campsite_and_droplet", "campsite_and_wifi", "campsite_beside_campsite_above_campsite_beside_campsite", "campsite_beside_conifer_tree", "campsite_beside_conifer_tree_above_water", "campsite_beside_oval_broadleaved_tree", "campsite_beside_oval_broadleaved_tree_above_water", "campsite_on_pier_in_water", "campsite_on_platform", "campsite_under_list_beside_checkmark", "campsite_under_paragraph", "campsite_with_baht", "campsite_with_canoe", "campsite_with_dollar", "campsite_with_euro", "campsite_with_peso", "campsite_with_pound", "campsite_with_ruble", "campsite_with_rupee", "campsite_with_shekel", "campsite_with_yen_yuan", "campsites", "can", "candle_with_flame", "candlepin_with_ball", "candlepins", "canister_vacuum_cleaner", "cannon", "canoe", "canoe_and_arrow_right_above_arrow_left", "canoe_and_key", "canoe_and_locked_lock_with_keyhole", "canoe_and_tag", "canoe_and_taxi_checkerboard", "canoe_on_pickup_truck", "canoe_on_ramp_on_water", "canoe_on_sedan", "canoe_on_station_wagon", "canoe_on_trailer_on_ramp_on_water", "canoe_on_water", "canoe_under_list_beside_checkmark", "cape_landform", "car", "car_and_arrow_right_above_arrow_left", "car_and_key", "car_and_locked_lock_with_keyhole", "car_and_tag", "car_and_wrench", "car_battery", "car_beside_car", "car_beside_car_above_car_beside_car", "car_beside_person_sleeping_in_bed", "car_between_roller_brushes", "car_in_gable_roofed_building", "car_in_parking_structure", "car_on_parking_line", "car_under_height_restrictor", "car_under_list_beside_checkmark", "car_under_shower_spray", "car_under_toll_gantry", "car_wheel_with_tire", "car_with_baht", "car_with_checkmark", "car_with_dollar", "car_with_emphasis_marks", "car_with_euro", "car_with_peso", "car_with_pound", "car_with_ruble", "car_with_rupee", "car_with_shekel", "car_with_taxi_checkerboard", "car_with_yen_yuan", "cargobike", "cargobike_and_arrow_right_above_arrow_left", "cargobike_and_baht", "cargobike_and_dollar", "cargobike_and_euro", "cargobike_and_key", "cargobike_and_locked_lock_with_keyhole", "cargobike_and_peso", "cargobike_and_pound", "cargobike_and_ruble", "cargobike_and_rupee", "cargobike_and_shekel", "cargobike_and_tag", "cargobike_and_taxi_checkerboard", "cargobike_and_wrench", "cargobike_and_yen_yuan", "cargobike_in_parking_structure", "cargobike_on_parking_line", "cargobike_under_list_beside_checkmark", "carousel", "carpet", "cars_on_barge_on_water", "cartoon_bomb_with_lit_fuse", "cartoon_cannon_with_lit_fuse", "cast_iron_key_with_heart_shaped_handle", "castle", "castle_gate_with_battlements", "castle_gate_with_battlements_and_spires", "castle_keep", "castle_tower_with_battlement_and_spire_and_pennon", "castle_with_battlements", "castle_with_battlements_and_spires", "castle_with_battlements_and_turret", "castle_with_spires", "cat_sitting", "cattle_grid", "cave", "cc_text", "cell_nuclei", "celtic_cross", "chainsaw", "champagne_bottle_and_champagne_glass", "chapel", "charging_station", "charging_station_with_bolt", "checkmark", "cheese_wedge", "chefs_knife", "chess_knight", "chest_of_drawers", "chevron_up_tall", "chevron_up_tall_outline", "chicane_arrow", "chimney_with_smoke", "chip_bag", "chip_bag_with_chip", "chocolate_drop", "chopsticks", "chopsticks_crossed", "cigarette", "cigarette_with_smoke_curl", "cindercone_volcano_erupting", "circle", "circle_a", "circle_outline", "circle_outline_with_dot", "circle_outline_with_dot_outline", "circle_outline_with_star", "circle_outline_with_top_left_quarter_and_bottom_right_quarter", "circle_with_dot", "circle_with_dot_outline", "circle_with_fallout_shelter_symbol", "circular_labyrinth", "city_buildings", "city_gate", "clapperboard", "classical_building", "classical_building_with_clock", "classical_building_with_dome_and_flag", "classical_building_with_flag", "classical_statue", "cleaver", "cliff_with_rocks", "climbing_wall", "clock_face", "cloth", "clothes_hanger", "clothes_hanger_holding_cloth", "club", "club_chair", "cocktail", "cocktail_with_straw", "coconut_palm_tree", "coconut_palm_tree_on_hill_in_water", "coffee_bean", "coffee_mug_with_steam", "coffin", "coffin_with_latin_cross", "colorado", "colorado_with_capital_star", "column_shrine", "comb", "comb_and_dog_wearing_collar", "comedy_mask", "comedy_mask_and_tragedy_mask", "commercial_building", "compact_box_truck", "compact_box_truck_with_box_peak", "compact_box_truck_with_greek_cross", "compact_box_truck_with_heavy_six_point_asterisk", "compass", "compass_rose", "compass_rose_in_circle_outline", "condom", "condom_and_mars", "condom_and_venus", "confetti_ball", "confucian_bell", "confused_face", "confused_face_in_circle", "confused_face_in_circle_outline", "conifer_tree", "conifer_tree_and_bench_on_ground", "conifer_tree_and_flower_and_mountain_snowcapped", "conifer_tree_and_oval_broadleaved_tree", "conifer_tree_beside_conifer_tree", "conifer_tree_with_antenna_array", "conifer_tree_with_star_and_ornaments", "connecticut", "connecticut_with_capital_star", "contiguous_united_states", "contiguous_united_states_with_capital_star", "conveyor_with_chevrons_right", "cooling_tower", "cooling_tower_with_radiation_symbol", "coral", "coral_and_angelfish", "corn_cob", "cot_campsite", "cot_campsite_with_eyes", "couch", "coughing_face", "coughing_face_in_circle", "coughing_face_in_circle_outline", "coughing_face_with_phlegm", "coughing_face_with_phlegm_in_circle", "coughing_face_with_phlegm_in_circle_outline", "coughing_face_with_spittle", "coughing_face_with_spittle_in_circle", "coughing_face_with_spittle_in_circle_outline", "crab", "crane", "crates_under_roof", "crescent", "croissant", "crosshair", "crosswalk_markings_dashes", "crosswalk_markings_dots", "crosswalk_markings_ladder", "crosswalk_markings_ladder_paired", "crosswalk_markings_ladder_skewed", "crosswalk_markings_lines", "crosswalk_markings_lines_paired", "crosswalk_markings_surface", "crosswalk_markings_zebra", "crosswalk_markings_zebra_double", "crosswalk_markings_zebra_paired", "crowd_of_people", "crown", "crystal_ball_on_sphere_stand", "cube", "cup_and_saucer", "cup_and_saucer_and_pawprint", "cup_and_saucer_and_wifi", "cupcake_with_cherry", "curtains", "cylinder", "d", "dagger", "daisy", "dam", "deer_head", "deer_head_with_antlers", "deer_with_antlers", "delaware", "delaware_with_capital_star", "delicate_arch", "desk_lamp", "detergent_bottle", "dharma_wheel", "dharma_wheel_on_square", "diamond", "diamond_outline", "diamond_tall", "diamond_tall_outline", "diaper", "dice", "die_face_with_five_pips", "die_face_with_four_pips", "die_face_with_one_pip", "die_face_with_six_pips", "die_face_with_three_pips", "die_face_with_two_pips", "diesel_train", "diesel_train_on_railway_track", "digital_totem", "digital_totem_with_apps", "digital_totem_with_info_i", "digital_totem_with_wifi", "disc_golf_basket", "district_of_columbia", "district_of_columbia_with_capital_star", "dna", "dog", "dog_sitting", "dog_sitting_and_exclamation_point", "dog_sitting_wearing_collar", "dog_sitting_wearing_collar_and_exclamation_point", "dog_sitting_wearing_collar_and_heart", "dog_sitting_wearing_collar_and_whistle", "dog_sitting_wearing_collar_on_leash", "dog_sitting_wearing_harness", "dog_sitting_wearing_harness_and_whistle", "dog_sitting_wearing_harness_on_leash", "dog_wearing_collar", "dog_wearing_collar_in_shelter", "dog_wearing_collar_on_leash", "dog_wearing_harness", "dog_wearing_harness_on_leash", "dollar", "dollar_swap_to_euro", "dome_with_crescent_moon_and_star_and_planet", "dome_with_flag", "domed_tower", "donut", "dot", "dot_outline", "dot_with_rays_right", "dot_with_rays_up", "double_diamond_tall", "double_mars", "double_venus", "dove", "dove_and_laurel", "dress", "drink_bottle_and_drink_cup_with_straw", "drink_bottle_and_milk_carton_and_can", "drink_can", "drink_can_and_drink_bottle", "drink_cup_with_straw", "drink_cup_with_straw_and_boba", "droplet", "droplet_from_pipes", "droplet_with_greek_cross", "duck", "duck_in_water", "dumbbell", "dumping_ash_in_bin", "dvd_case", "e", "e_wide", "e_wide_in_parking_structure", "e_wide_on_parking_line", "e_wide_under_roof", "e_wide_with_arrow_bottom_right", "e_wide_with_arrow_right", "e_wide_with_bicycle", "e_wide_with_parking_meter", "ear", "ear_atop_slash", "ear_atop_slash_with_t", "ear_with_hearing_aid", "egg", "eight", "electrical_circuit_and_bolt", "electrical_current_transformer_and_bolt", "electrical_curved_circuit_breaker_and_bolt", "electrical_isolator_and_bolt", "electrical_lightning_arrestor_and_bolt", "electrical_square_circuit_breaker_and_bolt", "electrical_switch_and_bolt", "electrical_transformer_and_bolt", "elephant", "elevator_rider", "elevator_three_riders", "eleven", "entrance_station", "envelope", "envelope_in_slot", "enzyme", "escalator", "ethernet_port", "ethernet_port_in_square", "euro", "exclamation_point", "exclamation_point_above_water", "exclamation_point_beside_exclamation_point", "exclamation_point_beside_question_mark", "eye", "eye_outline", "eyebrow", "eyebrow_and_eyelashes", "eyeglasses", "eyelashes", "f", "f22_raptor_fighter_jet", "face_mask", "face_with_tongue_out", "face_with_tongue_out_in_circle", "face_with_tongue_out_in_circle_outline", "fallout_shelter_symbol", "family_restroom_symbol", "fancy_mirror_with_reflection_and_stars", "faravahar", "female_groin", "female_reproductive_system", "fence", "ferris_wheel", "ferryboat", "fetus", "fetus_in_circle", "fetus_in_circle_outline", "field_hockey_stick", "field_hockey_stick_with_ball", "fighter_jet_plane", "file_box", "file_box_and_tag", "fillet_knife", "film", "film_and_optical_disc", "film_movie_projector", "fingernail_polished", "fire", "fire_extinguisher", "fish", "fish_head", "fish_head_beside_barbed_hook_on_line", "fish_head_beside_barbed_hook_on_line_under_ice", "fish_head_beside_barbed_hook_on_line_under_water", "fish_head_beside_barbed_hook_under_paragraph", "fish_jumping_up_cascade", "fish_under_barbed_hook", "fish_under_fillet_knife", "fish_under_list_beside_checkmark", "fish_under_paragraph", "fish_under_water", "fishes", "five", "five_above_water", "five_minus", "five_minus_above_water", "five_plus", "five_plus_above_water", "flag", "flag_above_railway_track", "flag_checkered", "flagpole_with_flag", "flagstick_with_flag", "flagstick_with_flag_in_hole", "flagstick_with_pennant", "flagstick_with_pennant_in_hole", "flagstick_with_pennant_on_square", "flaming_chalice", "flaming_chalice_on_square", "flash_camera", "flat_coin", "flat_head_thumb_tack", "flatbed_truck", "flintlock_pistol", "floor_lamp", "florida", "flower_bouquet", "flush_curb", "flush_curb_under_shoe", "flush_curb_with_arrow_right", "flush_curb_with_question_mark", "flying_saucer", "foot", "fork", "fork_and_knife", "fork_and_sausage", "fork_and_spoon", "fork_crossing_knife", "fort", "fortress", "fountain", "fountain_from_fountain_basin", "fountain_from_water", "four", "four_above_water", "four_legged_octopus", "four_legged_octopus_with_cartoon_eyes", "four_legged_squid", "four_legged_squid_with_cartoon_eyes", "four_minus", "four_minus_above_water", "four_plus", "four_plus_above_water", "four_square_court", "four_square_court_with_ball", "freight_car", "frog_with_cartoon_eyes_and_open_mouth", "frowning_face_with_head_bandage", "frowning_face_with_head_bandage_in_circle", "frowning_face_with_head_bandage_in_circle_outline", "g", "gable_roofed_building", "gable_roofed_shelter", "gable_roofed_shelter_with_fireplace_and_chimney", "gable_roofed_shelter_with_spoon_and_knife", "gallbladder", "game_controller_with_wire", "garage", "garage_and_key", "garage_and_wrench", "gas_flame", "gasoline_pump", "gasoline_pump_with_d", "gasoline_pump_with_e", "gate", "gate_tall", "gavel_with_sound_block", "gazebo", "genie_lamp_with_stardust", "georgia_us", "georgia_us_with_capital_star", "geyser", "geyser_from_ground", "giftwrapped_box", "giftwrapped_box_and_tag", "giraffe", "globe", "globe_gasoline_pump", "globe_gasoline_pump_with_d", "globe_gasoline_pump_with_e", "goggles", "golf_cart", "golf_green", "gown", "grapes", "grass", "grass_in_water", "graticule_globe", "gravestone", "grecian_vase", "greek_cross", "greenhouse", "guidepost", "gull", "gull_and_exclamation_point", "gumdrop_head_and_shoulders", "guyed_mast", "guyed_mast_with_antenna_array", "h", "hair_dryer", "hairy_caterpillar", "hairy_caterpillar_and_exclamation_point", "hammer", "hammer_and_inverted_shoe", "hammer_and_nail", "hand", "hand_dropping_circles", "hand_dropping_circles_into_container", "hand_grenade", "hand_holding_heart", "hand_holding_service_tray", "hand_reaching_down", "hand_reaching_down_toward_rough_surface", "hand_with_eye", "handled_bowl_with_steam", "hands_sign_language_interpretation", "handshake", "handwheel", "hangar", "hanging_rail_transit_vehicle_with_destination_display", "hanging_sign_with_house", "happy_face", "happy_face_in_circle", "happy_face_in_circle_outline", "happy_face_with_face_mask", "happy_face_with_face_mask_in_circle", "happy_face_with_face_mask_in_circle_outline", "hard_candy_in_wrapper", "hash", "hawaii", "hazmat_suit", "head_and_shoulders", "headphones_with_info_i", "heart", "heart_organ", "heart_outine_with_top_left_quarter", "heart_outline", "heart_outline_with_left_half", "heart_outline_with_left_half_and_bottom_right_quarter", "heart_shaped_carriage", "heart_with_bolt", "heart_with_crack", "heart_with_ecg_line", "heart_with_greek_cross", "heavy_six_point_asterisk", "hedge", "height_restrictor", "helicopter", "honeycomb", "hook", "horizontal_storage_tank_on_supports", "horn_cleat", "horse_head_wearing_bridle", "horse_in_shelter", "horseshoe", "horseshoe_with_stake", "hospital_h", "hot_dog", "hot_dog_with_mustard", "house_and_industrial_building_and_lowrise_building", "house_and_trees_on_hill_in_water", "house_with_chimney", "house_with_flag", "house_with_flag_and_info_i", "houseboat_on_water", "human_head", "hunting_stand", "hydrant", "i", "ice_cream_on_cone", "ice_skate", "ice_text", "ice_text_above_icicles", "ichthys", "icicles", "id_card", "idaho", "idaho_with_capital_star", "illinois", "illinois_with_capital_star", "inclined_information_panel", "indiana", "indiana_with_capital_star", "industrial_building", "info_i", "inline_skate", "international_wheelchair_symbol", "intestine", "iowa", "iowa_with_capital_star", "isosceles_trapezoid_tall_down", "isosceles_trapezoid_tall_up", "j", "jack_o_lantern", "jai_alai_cesta_and_ball", "jail_door", "japanese_teacup_with_steam", "jar", "jeep", "jet_plane_front", "jewel", "joint", "jp_castle", "jp_cemetery", "jp_college", "jp_ferry", "jp_fire_station", "jp_hospital", "jp_hot_spring", "jp_landmark", "jp_lighthouse", "jp_monument", "jp_police", "jp_post", "jug_and_apple", "junk_car", "k", "kansas", "kansas_with_capital_star", "kayak_beside_kayak_paddle", "kayak_paddle_crossing_kayak", "kentucky", "kentucky_with_capital_star", "key", "key_and_arrow_right_above_arrow_left", "key_with_house_keychain", "keyhole", "keystone", "khanda", "khanda_on_square", "kidneys", "kids_train", "kids_train_on_railway_track", "kids_train_with_tires", "kitchen_sink", "knife", "l", "ladder", "lantern", "lantern_lamppost", "laptop", "latin_cross", "latin_cross_on_square", "latrine", "lattice_power_tower", "lattice_tower_with_ball_tip_antenna_on_ground_with_beams", "lattice_tower_with_lookout_deck", "lattice_tower_with_observation_deck_on_ground", "laughing_face", "laughing_face_in_circle", "laughing_face_in_circle_outline", "leaf", "leafless_tree", "left_bracket_and_cube", "leg", "leg_with_varicose_veins", "letter_box_us", "life_jacket", "life_ring", "lift_gate", "lift_gate_lowered", "lightbulb", "lighthouse", "lion", "lips", "lips_and_lipstick", "lipstick", "liver", "liver_with_bile_duct", "loaf_of_bread", "loaf_of_bread_with_steam", "loaf_of_pan_bread", "loaf_of_pan_bread_with_steam", "locked_lock", "locked_lock_with_keyhole", "lockers_terminal", "lotus_flower", "louisiana", "louisiana_with_capital_star", "lounger", "low_mounted_beam", "low_shrub", "lowered_curb", "lowered_curb_under_shoe", "lowered_curb_with_arrow_bottom_right", "lowered_curb_with_question_mark", "lowrise_apartment_building_on_ground", "lowrise_building", "lowrise_building_and_tree_on_ground", "lu_zi_symbol", "lucha_libre_mask", "lungs", "lungs_with_right_side_spots", "m", "madagascar", "madagascar_with_capital_star", "madison_cross", "magic_wand_and_sparkles", "magnifying_glass", "magnifying_glass_for_search_ui", "maine", "maine_with_capital_star", "male_genitalia", "male_genitalia_with_testicles", "male_genitalia_with_urethra", "male_groin", "manhole_cover", "manhole_cover_with_bolt", "manhole_cover_with_cable", "manhole_cover_with_droplet", "manhole_cover_with_gas_flame", "manhole_cover_with_hydrant", "manhole_cover_with_sewage_pipe_cross_section", "manicured_grass", "manor", "manufactured_home", "map_outline", "map_outline_with_info_i", "map_outline_with_swap_arrows", "map_pin", "map_pin_outline", "map_pin_outline_with_dot", "map_pin_with_dot", "maple_leaf", "marae", "market_stall", "mars", "martini_glass_and_wine_bottle", "maryland", "massachusetts", "massachusetts_with_capital_star", "maze", "meat", "medal_ribbon", "medal_ribbon_with_anchor", "medal_ribbon_with_star", "megalith", "megaphone", "memorial_stone", "memorial_stone_with_inscription", "memorial_stone_with_latin_cross", "mens_restroom_symbol", "mesoamerican_pyramid", "michigan", "michigan_lower_peninsula", "michigan_upper_peninsula", "michigan_with_capital_star", "microphone", "microscope", "milestone", "military_police_officer", "military_police_officer_with_stop_arm", "milk_carton_and_apple", "milk_carton_and_apple_and_baht", "milk_carton_and_apple_and_dollar", "milk_carton_and_apple_and_euro", "milk_carton_and_apple_and_peso", "milk_carton_and_apple_and_pound", "milk_carton_and_apple_and_ruble", "milk_carton_and_apple_and_rupee", "milk_carton_and_apple_and_shekel", "milk_carton_and_apple_and_yen_yuan", "milk_carton_and_cheese", "milk_churn", "mineshaft_cage", "mineshaft_profile", "minnesota", "minnesota_with_capital_star", "mississippi", "mississippi_with_capital_star", "missouri", "missouri_with_capital_star", "mobile_phone_with_keypad_and_antenna", "mobile_phone_with_keypad_and_antenna_and_bolt", "mobile_phone_with_keypad_and_antenna_and_wifi", "mobile_phone_with_keypad_and_antenna_beside_mobile_phone_with_touchscreen_and_antenna", "mobile_phone_with_touchscreen_and_antenna", "mobile_phone_with_touchscreen_and_antenna_and_bolt", "mobile_phone_with_touchscreen_and_antenna_and_wifi", "molar_tooth", "monopod_antenna_with_beams", "monorail_transit_vehicle_with_destination_display", "montana", "montana_with_capital_star", "mortar_and_pestle_with_greek_cross", "mosquito", "motor_scooter", "motorboat", "motorboat_and_arrow_right_above_arrow_left", "motorboat_and_baht", "motorboat_and_dollar", "motorboat_and_euro", "motorboat_and_key", "motorboat_and_locked_lock_with_keyhole", "motorboat_and_peso", "motorboat_and_pound", "motorboat_and_ruble", "motorboat_and_rupee", "motorboat_and_shekel", "motorboat_and_tag", "motorboat_and_taxi_checkerboard", "motorboat_and_wrench", "motorboat_and_yen_yuan", "motorboat_in_parking_structure", "motorboat_on_parking_line", "motorboat_on_ramp", "motorboat_on_water", "motorboat_under_list_beside_checkmark", "motorcycle", "motorcycle_and_arrow_right_above_arrow_left", "motorcycle_and_baht", "motorcycle_and_dollar", "motorcycle_and_euro", "motorcycle_and_key", "motorcycle_and_locked_lock_with_keyhole", "motorcycle_and_peso", "motorcycle_and_pound", "motorcycle_and_ruble", "motorcycle_and_rupee", "motorcycle_and_shekel", "motorcycle_and_tag", "motorcycle_and_taxi_checkerboard", "motorcycle_and_wrench", "motorcycle_and_yen_yuan", "motorcycle_in_parking_structure", "motorcycle_on_parking_line", "motorcycle_under_list_beside_checkmark", "mountain", "mountain_with_greek_cross", "mountain_with_heavy_six_point_asterisk", "mountains_and_lake", "mounted_scope", "mounted_slotted_dispenser", "mounted_slotted_dispenser_with_dog_wearing_collar", "mounted_slotted_dispenser_with_poo_pile", "music_note_with_optical_disc", "music_notes_eighth", "music_notes_sixteenth", "n", "nauseous_face", "nauseous_face_in_circle", "nauseous_face_in_circle_outline", "navigation_arrow_top_right", "navigation_arrow_up", "nebraska", "nebraska_with_capital_star", "needle", "needle_and_spool_of_thread", "nervous_face", "nervous_face_in_circle", "nervous_face_in_circle_outline", "netherlands", "netherlands_with_capital_star", "neutral_face", "neutral_face_in_circle", "neutral_face_in_circle_outline", "nevada", "nevada_with_capital_star", "new_hampshire", "new_hampshire_with_capital_star", "new_jersey", "new_jersey_with_capital_star", "new_mexico", "new_mexico_with_capital_star", "new_york", "new_york_with_capital_star", "newspaper", "newspaper_box_with_newspaper", "nine", "nine_one_one", "nine_point_star", "nine_point_star_outline", "no_entry", "noodle_bowl_and_chopsticks_with_noodles", "noodle_bowl_with_steam", "nordic_cross", "north_carolina", "north_carolina_with_capital_star", "north_dakota", "north_dakota_with_capital_star", "nose_outline", "o", "oak_leaf", "obelisk", "obelisk_on_plinth", "observatory_dome", "oc_text", "octagon", "octagon_outline", "office_building_with_flag", "officer", "officer_with_stop_arm", "ohio", "ohio_with_capital_star", "oklahoma", "oklahoma_with_capital_star", "om", "om_on_square", "one", "one_above_water", "one_minus", "one_minus_above_water", "one_plus", "one_plus_above_water", "open_book", "open_book_under_roof", "open_chest_with_treasure_and_sparkles", "open_envelope_right", "open_envelope_right_with_baht", "open_envelope_right_with_dollar", "open_envelope_right_with_euro", "open_envelope_right_with_peso", "open_envelope_right_with_pound", "open_envelope_right_with_ruble", "open_envelope_right_with_rupee", "open_envelope_right_with_shekel", "open_envelope_right_with_yen_yuan", "open_scissors", "open_scissors_crossing_handled_comb", "ordnance_survey_benchmark", "oregon", "oregon_with_capital_star", "oval_broadleaved_tree", "oval_broadleaved_tree_beside_oval_broadleaved_tree", "overweight_person", "p", "p_wide", "p_wide_in_parking_structure", "p_wide_on_parking_line", "p_wide_under_roof", "p_wide_with_arrow_bottom_right", "p_wide_with_arrow_right", "p_wide_with_bicycle", "p_wide_with_parking_meter", "paifang", "paint_roller", "paintbrush", "palace", "palette", "palette_with_music_note", "palm_tree", "pancreas", "papal_cross", "paper_and_pencil", "paperclip", "parachute", "parallelogram_tall_left", "parallelogram_tall_right", "parking_line", "parking_stall_markings", "parking_stall_markings_with_e_wide", "parking_stall_markings_with_p_wide", "parking_stall_markings_with_person_in_wheelchair", "parking_structure", "parrot", "party_popper", "passport_with_belgium", "passport_with_bundesadler", "passport_with_graticule_globe", "passport_with_netherlands", "patriarchal_cross", "pawprint", "pawprint_and_whistle", "pawprint_with_greek_cross", "pawprints_and_heart", "payment_card", "payment_card_in_slot", "peace_sign", "pen_nib", "pencil_and_apple", "pencil_bottom_left_to_square_outline", "pennsylvania", "pennsylvania_with_capital_star", "pentagram_in_circle_outline", "people_above_car", "people_and_person_pointing", "people_in_car", "people_sitting_in_theater", "people_sitting_on_seesaw", "people_sleeping_in_bunkbeds", "people_sleeping_in_opposing_bunkbeds", "people_wearing_traditional_festive_latin_clothes", "perfume_bottle_with_spray", "person_aiming_archery_bow", "person_aiming_rifle", "person_balancing", "person_balancing_on_low_mounted_beam", "person_baseball_batting", "person_behind_barred_window", "person_behind_desk", "person_bicycle_racing", "person_boarding", "person_boarding_aerial_gondola", "person_boarding_bullet_train_on_railway_track", "person_boarding_bus_with_destination_display", "person_boarding_bus_with_destination_display_and_pantograph", "person_boarding_car", "person_boarding_diesel_train_on_railway_track", "person_boarding_ferryboat", "person_boarding_hanging_rail_transit_vehicle_with_destination_display", "person_boarding_kids_train_on_railway_track", "person_boarding_monorail_transit_vehicle_with_destination_display", "person_boarding_school_bus", "person_boarding_steam_train_on_railway_track", "person_boarding_taxi", "person_boarding_tram_with_destination_display_and_pantograph_on_tram_track", "person_boarding_transit_vehicle_on_railway_track", "person_boarding_transit_vehicle_with_destination_display", "person_boarding_transit_vehicle_with_destination_display_and_pantograph_on_tram_track", "person_boarding_transit_vehicle_with_destination_display_on_railway_track", "person_boarding_transit_vehicle_with_destination_display_on_railway_track_under_ground", "person_boat_racing_in_waves", "person_carrying_canoe", "person_carrying_ski", "person_carrying_ski_and_ski_poles", "person_carrying_skis", "person_carrying_skis_and_ski_poles", "person_climbing", "person_climbing_on_climbing_frame", "person_climbing_with_climbing_rope", "person_cricket_batting_at_cricket_ball", "person_cross_country_skiing", "person_dancing_with_person_wearing_dress", "person_dancing_with_sparkles", "person_diving_into_water", "person_driving_motorboat_on_water", "person_driving_motorboat_on_water_under_paragraph", "person_dropping_trash_into_wheelie_bin", "person_falling_on_rough_surface", "person_fishing_from_pier_above_water", "person_hanging_from_horizontal_bar", "person_holding_barbell", "person_holding_branches", "person_holding_cane", "person_holding_chestfeeding_baby", "person_holding_open_book", "person_holding_open_book_profile", "person_holding_shopping_bags_walking", "person_ice_skating", "person_in_water", "person_in_water_wearing_swim_briefs_holding_bucket", "person_in_water_with_steam", "person_in_wheelchair", "person_inline_skating", "person_jockeying_racehorse", "person_jumping_in_puddle_with_splashes", "person_jumping_on_bouncy_cushion", "person_jumping_on_trampoline", "person_kneeling_and_praying", "person_leaping_over_hurdle", "person_lounging_on_lounger", "person_lying_on_front_in_sun_on_surface", "person_massaging_person_lying_on_front", "person_on_escalator", "person_on_ground_dragging_raft_to_water", "person_on_inclined_swing", "person_on_swing", "person_paddling_canoe_on_water", "person_piloting_hang_glider", "person_playing_soccer", "person_playing_tennis", "person_reaching_into_bins", "person_reaching_up", "person_riding_bicycle", "person_riding_bicycle_down_uneven_slope", "person_riding_bicycle_on_crosswalk", "person_riding_bicycle_up_uneven_slope", "person_riding_dog_sled", "person_riding_horse", "person_riding_in_stroller", "person_riding_jetski_on_water", "person_riding_pedal_boat_on_water", "person_riding_skateboard", "person_riding_snowmobile", "person_riding_surfboard", "person_riding_tube_on_water", "person_rowing_rowboat_on_water", "person_running", "person_running_after_person", "person_shoveling_dirt", "person_showering_with_soap_under_shower_spray", "person_shushing", "person_sitting_in_seat", "person_sitting_in_steam_sauna", "person_sitting_on_bench", "person_sitting_on_bench_with_armrests", "person_sitting_on_bench_with_armrests_and_backrest", "person_sitting_on_bench_with_backrest", "person_sitting_on_lifeguard_stand_above_water", "person_ski_jumping", "person_skiing_downhill", "person_sledding_downhill", "person_sleeping", "person_sleeping_in_bed", "person_sleeping_in_bed_above_car", "person_sleeping_in_bed_between_floor_and_ceiling", "person_sleeping_in_shelter", "person_sliding_down_cliff", "person_sliding_down_cliff_into_water", "person_slipping_down_cliff", "person_slipping_down_cliff_into_water", "person_slipping_down_ramp", "person_slipping_down_steps", "person_snowboarding_downhill", "person_snowshoeing", "person_speaking_to_amphitheater", "person_spiking_volleyball", "person_squatting", "person_squatting_and_person_reaching_up", "person_standing", "person_swimming_in_water", "person_swimming_in_waters", "person_swinging_golf_club", "person_swinging_golf_club_beside_flagstick_with_pennant", "person_swinging_golf_club_beside_windmill", "person_tow_skiing_on_water", "person_using_mounted_binoculars", "person_using_terminal_kiosk", "person_using_terminal_kiosk_with_baht", "person_using_terminal_kiosk_with_dollar", "person_using_terminal_kiosk_with_euro", "person_using_terminal_kiosk_with_peso", "person_using_terminal_kiosk_with_pound", "person_using_terminal_kiosk_with_ruble", "person_using_terminal_kiosk_with_rupee", "person_using_terminal_kiosk_with_shekel", "person_using_terminal_kiosk_with_yen_yuan", "person_vomiting", "person_walking", "person_walking_and_person_riding_bicycle", "person_walking_and_person_riding_bicycle_on_crosswalk", "person_walking_between_walls", "person_walking_bicycle", "person_walking_holding_railing", "person_walking_in_water", "person_walking_in_waters", "person_walking_on_crosswalk", "person_walking_under_icy_eave", "person_walking_with_hiking_pole", "person_walking_with_white_cane", "person_wearing_backpack_and_headlamp_crouching", "person_wearing_backpack_scrambling_up_cliff", "person_wearing_backpack_walking_with_hiking_pole", "person_wearing_backpack_walking_with_hiking_pole_in_gable_roofed_shelter", "person_wearing_cheese_wedge_hat", "person_wearing_cowboy_hat_holding_coiled_rope", "person_wearing_dress_holding_cane", "person_wearing_helmet_padding_raft_on_water", "person_wearing_helmet_paddling_kayak_on_water", "person_wearing_helmet_riding_atv", "person_wearing_martial_arts_belt_front_kicking", "person_wearing_racing_helmet_driving_go_kart", "person_wearing_racing_helmet_driving_racecar", "person_wearing_scuba_gear_diving", "person_wearing_scuba_gear_diving_under_water", "person_wearing_seatbelt", "person_wearing_skis_riding_chairlift", "person_wearing_waiters_attire_holding_tray_with_wine_glass", "person_wind_surfing_on_water", "person_with_droplets", "person_with_open_arms", "person_with_ponytail_riding_zip_line", "peso", "petrine_cross", "phone_bars", "phone_bars_no_signal", "phone_bars_no_signal_with_x", "phone_bars_weak_signal", "phone_bars_weaker_signal", "phone_bars_weakest_signal", "phone_bottom_right", "phone_down", "phone_down_above_eight_one_one", "phone_down_above_five_one_one", "phone_down_above_four_one_one", "phone_down_above_keyboard", "phone_down_above_nine_eight_eight", "phone_down_above_nine_nine_nine", "phone_down_above_nine_one_one", "phone_down_above_one_one_one", "phone_down_above_one_one_two", "phone_down_above_one_two_three", "phone_down_above_seven_one_one", "phone_down_above_six_one_one", "phone_down_above_sos_text", "phone_down_above_three_one_one", "phone_down_above_two_one_one", "phone_right", "phone_right_with_beams_from_receiver", "phone_right_with_exclamation_point", "phone_top_right", "phone_top_right_with_greek_cross", "phone_top_right_with_plus", "piano_keys", "pick_hammer", "pick_hammer_with_rocks", "picket_fence", "pickleball_paddle_with_ball", "pickup_truck", "pickup_truck_and_tag", "pickup_truck_with_crates", "pickup_truck_with_raised_hood", "pickup_truck_with_slidein_camper", "pickup_truck_with_truck_cap", "picnic_table", "picnic_table_in_shelter", "pier_mounted_in_water", "pier_on_water", "pill", "pill_bottle_with_greek_cross", "pin", "pin_pad_with_baht", "pin_pad_with_dollar", "pin_pad_with_euro", "pin_pad_with_peso", "pin_pad_with_pound", "pin_pad_with_ruble", "pin_pad_with_rupee", "pin_pad_with_shekel", "pin_pad_with_yen_yuan", "pint_glass", "pipe", "pixel_anchor", "pixel_ape_face", "pixel_ape_face_with_eye_patch", "pixel_apple", "pixel_arrows_left_right_above_water", "pixel_baht", "pixel_bell", "pixel_bicycle", "pixel_bowling_ball", "pixel_broadleaved_tree", "pixel_burger_on_bun", "pixel_burger_on_bun_with_seeds", "pixel_burger_with_cheese_on_bun", "pixel_burger_with_cheese_on_bun_with_seeds", "pixel_bus", "pixel_car", "pixel_circle", "pixel_circle_outline", "pixel_circle_with_dot", "pixel_circle_with_star", "pixel_classical_building", "pixel_classical_building_with_dome_and_flag", "pixel_classical_building_with_flag", "pixel_conifer_tree", "pixel_dollar", "pixel_dome_with_flag", "pixel_droplet", "pixel_droplet_with_shine", "pixel_envelope", "pixel_euro", "pixel_exclamation_point", "pixel_fork_and_knife", "pixel_gasoline_pump", "pixel_ghost", "pixel_head_and_shoulders", "pixel_house_with_chimney", "pixel_house_with_flag", "pixel_invader", "pixel_map_pin", "pixel_map_pin_with_dot", "pixel_megalith", "pixel_peso", "pixel_plane", "pixel_pound", "pixel_question_mark", "pixel_ruble", "pixel_rupee", "pixel_shekel", "pixel_skull", "pixel_star", "pixel_taxi", "pixel_three_inch_floppy_disk", "pixel_transit_vehicle_on_railway_track", "pixel_water", "pixel_waters", "pixel_yen_yuan", "pizza_slice", "place_of_worship_building", "plane_right", "plane_takeoff_above_ground", "plane_taxiing", "plane_top_right", "plane_up", "planes", "planes_bidirectional", "plant", "plant_in_raised_planter", "plaque", "play_shelter", "play_structure_with_slide", "plug", "plug_with_bolt", "plus", "plus_squat", "pointy_rock", "pole_with_antenna_array", "pole_with_floodlights", "police_officer", "police_officer_with_stop_arm", "poo_pile", "portable_fence", "portable_radio", "post_box", "postage_stamp", "poster_box", "pot", "potted_flower", "poultry_drumstick", "pound", "pregnant_person", "pretzel_with_salt", "profile_of_person_in_hat", "profile_of_person_in_hat_in_frame", "propane_tank", "propane_tank_with_gas_flame", "propane_tank_with_recycling_symbol", "propeller_plane", "prostate", "pumpjack", "pumpkin", "pumpkin_shaped_carriage", "pumpkin_under_stardust", "purse", "puzzle_piece", "q", "quadcopter_drone", "quaker_star", "quaker_star_on_square", "quay", "question_mark", "question_mark_above_water", "r", "racetrack_eight_with_dashes", "racetrack_oval", "racetrack_oval_with_dashes", "racquet", "radiation_symbol", "ragged_flag_with_skull", "rail_profile", "railway_cable_track", "railway_track", "railway_track_askew", "railway_track_crossing_dashed_line", "railway_track_crossing_railway_track", "railway_track_crossing_solid_line", "railway_track_crossing_striped_line", "railway_track_mini", "railway_track_narrow_gauge", "railway_track_partial", "raised_curb", "raised_curb_under_shoe", "raised_curb_with_arrow_down", "raised_curb_with_question_mark", "ranger_hat", "rattlesnake", "rays_outward", "rectangle", "rectangle_outline", "rectangle_tall", "rectangle_tall_outline", "recycling_symbol", "rememberance_ribbon", "respirator", "rhode_island", "rhode_island_with_capital_star", "rigging", "ring_linked_to_ring_with_jewel", "ring_with_jewel", "rocket_firework", "rocketship", "rocking_horse", "rolled_curb", "rolled_curb_under_shoe", "rolled_curb_with_arrow_bottom_right", "rolled_curb_with_question_mark", "rolled_paper_in_bottle", "rolled_paper_in_bottle_in_water", "roller_brushes", "roller_coaster", "roman_numeral_i", "roman_numeral_i_above_water", "roman_numeral_ii", "roman_numeral_ii_above_water", "roman_numeral_iii", "roman_numeral_iii_above_water", "roman_numeral_iv", "roman_numeral_iv_above_water", "roman_numeral_ix", "roman_numeral_v", "roman_numeral_v_above_water", "roman_numeral_vi", "roman_numeral_vi_above_water", "roman_numeral_vii", "roman_numeral_viii", "roman_numeral_x", "roman_numeral_xi", "roman_numeral_xii", "roman_numeral_xx", "roofed_information_board", "room", "rooster_fighting", "rope_fence", "round_bottomed_flask", "round_rock", "round_rock_with_inscription", "round_structure_with_flag", "row_houses", "rss", "ruble", "rumble_strip", "rupee", "russian_cross", "russian_orthodox_cross", "s", "sad_face", "sad_face_in_circle", "sad_face_in_circle_outline", "sad_face_with_tear", "sad_face_with_tear_in_circle", "sad_face_with_tear_in_circle_outline", "saddle_shape", "saguaro", "sail", "sailboat", "sailboat_on_water", "sailing_ship", "sailing_ship_in_water", "saint_georges_cross", "sandbox", "sandbox_with_sand_trowel", "sausage", "sauvastika", "sauvastika_with_dots", "sayana_press", "scaffold", "school_bus", "scissors_and_comb", "screw_beside_nail", "sculpture", "sea_lion", "sea_star", "seaplane_takeoff", "seaplane_takeoff_above_water", "sedan", "sedan_and_tag", "sedan_with_raised_hood", "semi_trailer", "semi_trailer_with_bolt", "seven", "sewage_pipe_cross_section", "shaker_pint_glass", "shark_dorsal_fin_in_water", "shark_dorsal_fin_in_waters", "shed", "shekel", "shelter", "shield", "ships_wheel", "shipwreck_in_water", "shoe", "shoe_under_shower_spray", "shooting_stars", "shopping_bag", "shopping_bag_and_tag", "shopping_bag_with_ampersand", "shopping_bag_with_anime_eye_and_eyebrow", "shopping_bag_with_arrows_recirculating", "shopping_bag_with_baht", "shopping_bag_with_dollar", "shopping_bag_with_euro", "shopping_bag_with_heart", "shopping_bag_with_pawprint", "shopping_bag_with_peso", "shopping_bag_with_pound", "shopping_bag_with_ruble", "shopping_bag_with_rupee", "shopping_bag_with_shekel", "shopping_bag_with_tag", "shopping_bag_with_yen_yuan", "shopping_basket", "shopping_cart", "shore", "showerhead_with_spray", "shrub", "shuffleboard_court_with_pucks", "sign", "sign_beside_bench_with_backrest", "sign_beside_car", "sign_beside_person_walking", "sign_beside_taxi", "signboard", "silo", "sitting_tank_toilet", "sitting_tank_toilet_with_droplet", "six", "six_above_water", "six_minus", "six_minus_above_water", "six_plus", "six_plus_above_water", "skateboard", "skull", "skull_above_crossed_bones", "skull_above_crossed_cutlasses", "skull_above_water", "skull_rock", "skull_rock_outline", "skull_with_x_oblique", "skyscraper_on_ground", "slice_of_pan_bread", "slice_of_pan_bread_outline", "slide", "slot", "slot_machine", "smiling_face", "smiling_face_in_circle", "smiling_face_in_circle_outline", "smiling_face_with_eyeglasses", "smiling_face_with_eyeglasses_in_circle", "smiling_face_with_eyeglasses_in_circle_outline", "smoke_curl", "snorkel_and_diving_mask", "snowcapped_mountain", "snowcapped_mountain_range", "snowcapped_mountain_saddle", "snowcapped_mountain_valley", "snowflake", "snowflake_above_icicles", "snowmobile", "sobbing_face", "sobbing_face_in_circle", "sobbing_face_in_circle_outline", "soccer_ball", "sos_text", "south_carolina", "south_carolina_with_capital_star", "south_dakota", "south_dakota_with_capital_star", "spade", "speaker", "speech_bubble", "speech_bubbles", "speed_bump", "speed_dip", "speed_dip_double", "speed_hump", "speed_table", "sperm", "spherical_virus", "spherical_virus_with_exclamation_point", "spice_bottle", "spike_strip", "spiky_fish", "spiky_fish_under_list_beside_checkmark", "spiky_fish_under_paragraph", "spiky_fish_under_water", "spiky_fish_with_x", "spinal_vertebrae", "spiral_labyrinth", "spleen", "spooky_ghost", "spoon", "spoon_and_chefs_knife_and_pot", "spoon_and_chopsticks", "spoon_and_fork", "spring_rider", "spyglass", "square", "square_academic_cap", "square_dot", "square_outline", "square_with_dot", "square_with_square_dot", "squat_rock", "squeeze_stile", "stagecoach", "star", "star_and_crescent", "star_and_crescent_on_square", "star_of_david", "star_of_david_filled", "star_of_david_filled_outline", "star_of_david_on_square", "star_of_david_with_dot", "star_outline", "star_wand_with_stardust", "station_wagon", "station_wagon_and_tag", "station_wagon_with_raised_hood", "statue", "steam_train", "steam_train_on_railway_track", "steam_train_with_tires", "steel_square_and_drafting_compass", "step_ladder", "step_ladder_doubled_sided", "stethoscope", "stomach", "stone_arrowhead_down", "stone_arrowhead_right", "stone_arrowhead_top_right", "stone_arrowhead_up", "stone_wall", "storage_drum", "storage_fermenter", "storage_tank", "street_lamp_arm", "striped_zone", "stroller", "sub_sandwich", "sub_sandwich_with_steam", "sugar_cubes", "sugarcane_stalk_with_leaves", "sugarcane_stalk_with_top_leaves", "sugarcane_stalks_with_top_leaves", "suitcase", "suitcase_and_arrow_right_above_arrow_left", "suitcase_and_key", "suitcase_and_locked_lock_with_keyhole", "suitcase_in_rectangle_outline_and_key", "suitcase_under_list_beside_checkmark", "suitcase_xray", "sun", "surprised_face", "surprised_face_in_circle", "surprised_face_in_circle_outline", "surprised_face_with_x_eyes", "surprised_face_with_x_eyes_in_circle", "surprised_face_with_x_eyes_in_circle_outline", "survey_triangulation_disk", "sushi", "swastika", "swastika_with_dots", "swim_bra_and_swim_briefs", "swing", "swinging_doors", "syringe", "syrup_jug", "syrup_jug_and_droplet", "syrup_jug_with_maple_leaf", "syrup_jug_with_maple_leaf_and_droplet", "syrup_jug_with_sugarcane_stalk_with_leaves", "syrup_jug_with_sugarcane_stalk_with_leaves_and_droplet", "t", "table_soccer_players_with_ball", "table_tennis_paddle", "table_with_chairs", "table_with_umbrella", "table_with_umbrella_and_chairs", "tabletop_microphone", "tabletop_microphone_in_gable_roofed_building", "taco", "tag", "tag_with_baht", "tag_with_dollar", "tag_with_euro", "tag_with_peso", "tag_with_pound", "tag_with_ruble", "tag_with_rupee", "tag_with_shekel", "tag_with_yen_yuan", "tags", "target", "target_with_archery_arrow_at_bullseye", "tattoo_machine", "taxi", "taxi_and_arrow_right_above_arrow_left", "taxi_and_taxi_checkerboard", "taxi_checkerboard", "tea_bag", "teapot", "telegraph_key", "telescope", "telescope_with_sparkles", "temaki", "ten", "tennessee", "tennessee_with_capital_star", "terminal_screen_with_dollar_prompt", "terminal_screen_with_greater_than_prompt", "terminal_screen_with_hash_prompt", "terminal_screen_with_percent_prompt", "texas", "texas_with_capital_star", "thatched_roof_hut", "three", "three_above_water", "three_books_stacked", "three_dot_horizontal_line", "three_dot_horizontal_line_in_rectangle", "three_dot_vertical_line", "three_dot_vertical_line_in_rectangle", "three_inch_floppy_disk", "three_minus", "three_minus_above_water", "three_plus", "three_plus_above_water", "thumbs_up_hand_with_sleeve", "thyroid", "ticket", "ticket_in_slot", "tiling", "tipi_campsite", "tipi_campsite_and_droplet", "tipi_campsite_with_baht", "tipi_campsite_with_dollar", "tipi_campsite_with_euro", "tipi_campsite_with_peso", "tipi_campsite_with_pound", "tipi_campsite_with_ruble", "tipi_campsite_with_rupee", "tipi_campsite_with_shekel", "tipi_campsite_with_yen_yuan", "tipi_campsites", "tire", "tire_course", "tired_face", "tired_face_in_circle", "tired_face_in_circle_outline", "tired_face_with_oral_thermometer_and_brow_sweat", "tired_face_with_oral_thermometer_and_brow_sweat_in_circle", "tired_face_with_oral_thermometer_and_brow_sweat_in_circle_outline", "tired_face_with_sweat", "tired_face_with_sweat_in_circle", "tired_face_with_sweat_in_circle_outline", "tired_face_with_z", "tired_face_with_z_in_circle", "tired_face_with_z_in_circle_outline", "tissue", "to_go_cup_with_cup_sleeve", "toilet_paper_roll", "toll_booth", "toll_gantry", "toolbox", "toothbrush", "torii", "torii_on_square", "tornado", "tornado_beside_shelter", "tour_van", "tourboat_on_water", "tow_truck", "tower_with_observation_deck", "town_buildings", "traditional_storage_jars", "traffic_cone", "traffic_cone_and_exclamation_point", "tram_on_tram_track", "tram_profile", "tram_track_crossing_dashed_line", "tram_track_crossing_solid_line", "tram_track_crossing_striped_line", "tram_with_destination_display_and_pantograph_on_tram_track", "tram_with_destination_display_on_tram_track", "tram_with_pantograph_on_tram_track", "transit_vehicle", "transit_vehicle_on_railway_track", "transit_vehicle_on_railway_track_between_roller_brushes", "transit_vehicle_on_railway_track_in_tunnel", "transit_vehicle_with_destination_display", "transit_vehicle_with_destination_display_and_pantograph_on_tram_track", "transit_vehicle_with_destination_display_on_railway_track", "transit_vehicle_with_destination_display_on_railway_track_in_tunnel", "transit_vehicle_with_pantograph_on_railway_track", "trapezoidal_rock", "trash_can", "trash_truck", "treasure_map", "treasure_map_x", "tree_and_bench_with_backrest", "tree_on_hill_in_water", "tree_row", "tree_stump", "trench", "triangle_down", "triangle_down_outline", "triangle_down_squat", "triangle_up", "triangle_up_outline", "triangle_up_with_exclamation_point", "triangle_up_with_skull", "triangles_left_right", "triangles_left_right_in_rectangle", "triangles_left_right_in_rectangle_outline", "triangles_up_down", "triangles_up_down_in_rectangle", "triangles_up_down_in_rectangle_outline", "tricorne_hat_with_skull", "trifold_brochure", "trophy", "trophy_with_star", "truck", "trumpet", "tshirt", "tshirt_on_clothes_hanger_and_folded_linens", "tube", "tube_and_toothbrush", "tulip", "tumor", "tunnel", "tunnel_entrance", "turnstile", "turntable", "turtle_shell_top", "turtle_top", "twelve", "two", "two_above_water", "two_button_computer_mouse_with_scroll_wheel", "two_dot_horizontal_line_in_rectangle", "two_dot_vertical_line_in_rectangle", "two_minus", "two_minus_above_water", "two_plus", "two_plus_above_water", "typha_and_duck_in_water", "typha_in_water", "u", "underweight_person", "unicorn_head", "unicorn_rearing", "utah", "utah_with_capital_star", "utility_device", "utility_device_with_bolt", "utility_device_with_cable", "utility_device_with_droplet", "utility_device_with_gas_flame", "utility_device_with_sewage_pipe_cross_section", "utility_meter", "utility_meter_with_bolt", "utility_meter_with_cable", "utility_meter_with_droplet", "utility_meter_with_gas_flame", "utility_pole", "utility_pole_with_bolt", "utility_shutoff", "utility_shutoff_with_bolt", "utility_shutoff_with_cable", "utility_valve", "utility_valve_with_droplet", "utility_valve_with_gas_flame", "utv", "v", "vacuum_cleaner", "vacuum_station", "vase", "veiled_hennin_with_star", "vending_machine", "vending_machine_with_baguette", "vending_machine_with_cigarette_with_smoke_curl", "vending_machine_with_drink_can", "vending_machine_with_drink_cup_with_steam", "vending_machine_with_egg", "vending_machine_with_greek_cross", "vending_machine_with_heart", "vending_machine_with_ice_cream_on_cone", "vending_machine_with_postage_stamp", "vending_machine_with_shelves", "vending_machine_with_ticket", "vending_machine_with_venus", "venus", "venus_mars", "venus_with_mars", "vermont", "vermont_with_capital_star", "vertical_rotisserie", "vertical_slot", "video_camera_symbol", "village_buildings", "vinyl_record", "virginia", "virginia_with_capital_star", "vneck_tshirt", "vneck_tshirt_and_tag", "volleyball", "vomiting_face", "vomiting_face_in_circle", "vomiting_face_in_circle_outline", "w", "wall_hanging_with_mountains_and_sun", "wall_tent", "wall_tents", "wallmounted_surveillance_camera", "washing_machine", "washington", "washington_with_capital_star", "water", "water_bottle", "water_glass", "water_pipe_return_bend_with_handle", "water_pipe_return_bend_with_motor_and_handle", "water_standpipe_with_handle", "water_standpipe_with_handle_and_drinking_glass", "water_standpipe_with_handle_and_droplet", "water_standpipe_with_motor_and_handle", "water_standpipe_with_motor_and_handle_and_drinking_glass", "water_standpipe_with_motor_and_handle_and_droplet", "water_standpipe_with_pump_handle", "water_standpipe_with_pump_handle_and_drinking_glass", "water_standpipe_with_pump_handle_and_droplet", "water_tap", "water_tap_with_drinking_glass", "water_tap_with_droplet", "water_tap_with_handle", "water_tap_with_handle_and_drinking_glass", "water_tap_with_handle_and_droplet", "water_tower", "waterfall", "waterfall_into_water", "waterfall_with_froth", "waterfowl", "watering_can", "watermill_on_water", "waters", "wc_text", "webcam", "west_virginia", "west_virginia_with_capital_star", "whale_tail", "whale_tail_in_water", "wheelchair", "wheelie_bin", "wheelie_bin_and_apple_core", "wheelie_bin_and_bag_of_trash", "wheelie_bin_and_drink_bottle_and_can", "wheelie_bin_and_leaf", "whistle", "wifi", "wifi_no_signal", "wifi_no_signal_with_x", "wifi_weak_signal", "wifi_weakest_signal", "wind_turbine", "winding_way", "winding_way_narrow", "winding_way_wide", "windmill", "window", "windpump", "windsock", "wine_bottle", "wine_bottle_and_wine_glass", "wine_glass", "winged_horse_rearing", "wisconsin", "wisconsin_with_capital_star", "wizards_hat_with_star", "wolf_head", "wolf_head_and_exclamation_point", "womens_and_mens_restroom_symbol", "womens_and_mens_separate_restrooms_symbol", "womens_restroom_symbol", "woozy_face", "woozy_face_in_circle", "woozy_face_in_circle_outline", "wrench", "wrench_and_hammer", "wyoming", "wyoming_with_capital_star", "x", "x_above_water", "x_cross", "x_oblique", "y", "y_junction", "yen_yuan", "yin_yang", "yin_yang_on_square", "z", "zero", "zero_above_water"] };

// src/configStudio/renderScalar.ts
function scalarType(field) {
  return field.type === "enum" ? field.optionValueType ?? "string" : field.type === "number" ? "number" : field.type === "boolean" ? "boolean" : "string";
}
function scalarValueErrors(field, value) {
  if (field.cardinality !== "single" || field.type === "json") return [`${field.key} \u9700\u8981\u660E\u786E\u7684\u5355\u503C\u6807\u91CF\uFF0C\u4E0D\u80FD\u6BD4\u8F83\u5BF9\u8C61/\u6570\u7EC4\u3002`];
  if (typeof value !== scalarType(field) || typeof value === "number" && !Number.isFinite(value)) return [`${field.key} \u7684\u6BD4\u8F83\u503C\u7C7B\u578B\u4E0D\u5339\u914D\u3002`];
  if (field.type === "enum" && !field.options?.some((option) => option.value === String(value))) return [`${field.key} \u7684\u503C\u4E0D\u5728\u5DF2\u5B9A\u4E49\u5B57\u5178\u4E2D\u3002`];
  return [];
}
var validMappedColor = (color) => typeof color === "string" && /^#[a-f\d]{6}$/i.test(color);

// src/configStudio/pointSymbol.ts
var ICON_LIBRARY = { library: "pinhead", version: pinhead_capabilities_generated_default.version, manifestSha256: pinhead_capabilities_generated_default.manifestSha256 };
var iconIds = new Set(pinhead_capabilities_generated_default.ids);
var supportedIconId = (id) => iconIds.has(id);
function acceptableImageUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 8192) return false;
  try {
    const url = new URL(value, "https://cairn.invalid");
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}
function placementAnchor(value, width, height) {
  const positions = { center: [width / 2, height / 2], topCenter: [width / 2, 0], bottomCenter: [width / 2, height], leftCenter: [0, height / 2], rightCenter: [width, height / 2], topLeft: [0, 0], topRight: [width, 0], bottomLeft: [0, height], bottomRight: [width, height] };
  const anchor = value.anchor.mode === "custom" ? [value.anchor.x, value.anchor.y] : positions[value.anchor.mode];
  return [anchor[0] - value.offsetPx.x, anchor[1] - value.offsetPx.y];
}
function pointSymbolProblems(value, fields, config) {
  const issues = [], fail = (path2, message) => issues.push({ path: path2, message });
  const finite = (n) => typeof n === "number" && Number.isFinite(n);
  const range = (n, min, max) => finite(n) && n >= min && n <= max;
  const field = (key2, at) => {
    const definition = fields.find((f) => f.key === key2);
    if (!definition || definition.cardinality !== "single" || definition.type === "json") fail(at, "\u6765\u6E90\u9700\u8981\u5B58\u5728\u7684\u5355\u503C\u6807\u91CF\u5B57\u6BB5\u3002");
    return definition;
  };
  const placement = (p, at) => {
    if (!p || !p.anchor || !p.offsetPx) {
      fail(at, "\u7F3A\u5C11\u5B8C\u6574\u951A\u70B9\u53CA\u5C40\u90E8\u504F\u79FB\u3002");
      return;
    }
    if (!["center", "topCenter", "bottomCenter", "leftCenter", "rightCenter", "topLeft", "topRight", "bottomLeft", "bottomRight", "custom"].includes(p.anchor.mode)) fail(at, "\u951A\u70B9\u6A21\u5F0F\u65E0\u6548\u3002");
    if (p.anchor.mode === "custom" && (!finite(p.anchor.x) || !finite(p.anchor.y)) || !finite(p.offsetPx.x) || !finite(p.offsetPx.y)) fail(at, "\u951A\u70B9\u53CA\u5C40\u90E8\u504F\u79FB\u5FC5\u987B\u662F\u6709\u9650\u6570\u5B57\u3002");
    if (p.anchor.mode !== "custom" && (p.anchor.x !== void 0 || p.anchor.y !== void 0)) fail(at, "\u9884\u8BBE\u951A\u70B9\u4E0D\u80FD\u540C\u65F6\u4FDD\u5B58\u53E6\u4E00\u5957\u81EA\u5B9A\u4E49\u5750\u6807\u3002");
    if ([p.anchor.x ?? 0, p.anchor.y ?? 0, p.offsetPx.x, p.offsetPx.y].every(finite) && !placementAnchor(p, 2048, 2048).every(finite)) fail(at, "\u7EC4\u5408\u951A\u70B9\u4E0E\u504F\u79FB\u8BA1\u7B97\u8D85\u51FA\u6709\u9650\u6570\u503C\u8303\u56F4\u3002");
  };
  const base = (p, at) => {
    if (!p) {
      fail(at, "\u7F3A\u5C11\u5B8C\u6574\u57FA\u7840\u70B9\u6837\u5F0F\u3002");
      return;
    }
    if (!range(p.size, 0, 512) || !range(p.weight, 0, 72)) fail(at, "\u57FA\u7840\u70B9\u5927\u5C0F\uFF0F\u63CF\u8FB9\u5BBD\u5EA6\u8D85\u51FA\u8303\u56F4\u3002");
    if (!["circle", "square", "triangle", "regular4", "regular5", "regular6"].includes(p.pointShape)) fail(at, "\u56DE\u9000\u4EC5\u5141\u8BB8\u57FA\u7840\u70B9\u5F62\u72B6\u3002");
    if (!range(p.strokeOpacity, 0, 1) || !range(p.fillOpacity, 0, 1)) fail(at, "\u57FA\u7840\u70B9\u900F\u660E\u5EA6\u5FC5\u987B\u4ECB\u4E8E 0\u20131\u3002");
  };
  const item = (p, at) => {
    if (p.library !== "pinhead" || !supportedIconId(p.id)) fail(at, "\u56FE\u6807\u4E0D\u5728\u56FA\u5B9A Pinhead \u6E05\u5355\u4E2D\u3002");
    if (!config.resources?.iconLibraries.some((r) => r.library === "pinhead" && r.version === ICON_LIBRARY.version && r.manifestSha256 === ICON_LIBRARY.manifestSha256)) fail(at, "\u914D\u7F6E\u672A\u58F0\u660E\u53D7\u652F\u6301\u7684 Pinhead \u7248\u672C\u53CA\u8D44\u6E90\u6458\u8981\u3002");
    if (!range(p.sizePx, 1, 512) || !range(p.foregroundOpacity, 0, 1)) fail(at, "\u56FE\u6807\u5927\u5C0F\u6216\u900F\u660E\u5EA6\u65E0\u6548\u3002");
    const plate = p.plate;
    if (plate) {
      if (!range(plate.paddingPx, 0, 512) || !range(plate.strokeWidthPx, 0, 72) || 2 * (plate.paddingPx + plate.strokeWidthPx) >= p.sizePx) fail(at + "/plate", "\u5E95\u677F\u5185\u8FB9\u8DDD\u53CA\u63CF\u8FB9\u4E0D\u80FD\u5360\u6EE1\u56FE\u6848\u533A\u57DF\u3002");
      if (!range(plate.fillOpacity, 0, 1) || !range(plate.strokeOpacity, 0, 1) || plate.radiusPx !== void 0 && !range(plate.radiusPx, 0, 512)) fail(at + "/plate", "\u5E95\u677F\u900F\u660E\u5EA6\u6216\u5706\u89D2\u65E0\u6548\u3002");
    }
    placement(p.placement, at + "/placement");
  };
  const rows = (key2, entries, at, inspect) => {
    const definition = field(key2, at + "/field"), seen = /* @__PURE__ */ new Set();
    if (!entries.length) fail(at, "\u81F3\u5C11\u9700\u8981\u4E00\u6761\u6709\u6548\u6620\u5C04\u3002");
    entries.forEach((entry, i) => {
      const row2 = `${at}/entries/${i}`;
      if (seen.has(entry.value)) fail(row2, "\u6620\u5C04\u4FDD\u5B58\u503C\u91CD\u590D\u3002");
      seen.add(entry.value);
      if (definition) for (const message of scalarValueErrors(definition, entry.value)) fail(row2, message);
      inspect(entry, row2);
    });
  };
  if (value.kind === "shape") base(value.shape, "shape");
  else if (value.kind === "icon") {
    base(value.fallback, "fallback");
    if (value.icon.mode === "single") item(value.icon.item, "icon/item");
    else rows(value.icon.field, value.icon.entries, "icon", (row2, at) => item(row2.item, at + "/item"));
  } else if (value.kind === "externalImage") {
    base(value.fallback, "fallback");
    const source = value.image;
    const presentation = (p, at) => {
      if (!range(p.sizePx.width, 1, 2048) || !range(p.sizePx.height, 1, 2048)) fail(at, "\u56FE\u7247\u5BBD\u9AD8\u987B\u4ECB\u4E8E 1\u20132048px\u3002");
      placement(p.placement, at + "/placement");
    };
    if (source.mode === "valueMap") rows(source.field, source.entries, "image", (row2, at) => {
      if (!acceptableImageUrl(row2.url)) fail(at + "/url", "\u56FE\u7247\u94FE\u63A5\u5FC5\u987B\u662F\u6709\u6548 HTTP(S) \u6216\u7AD9\u5185\u5730\u5740\u3002");
      presentation(row2.presentation, at + "/presentation");
    });
    else {
      presentation(source.presentation, "image/presentation");
      if (source.mode === "fixed" && !acceptableImageUrl(source.url)) fail("image/url", "\u56FE\u7247\u94FE\u63A5\u5FC5\u987B\u662F\u6709\u6548 HTTP(S) \u6216\u7AD9\u5185\u5730\u5740\u3002");
      if (source.mode === "fieldUrl") field(source.field, "image/field");
      if (source.mode === "externalFieldUrl") {
        const id = field(source.targetIdField, "image/targetIdField");
        if (id && !["string", "reference", "enum"].includes(id.type)) fail("image/targetIdField", "\u5916\u90E8\u76EE\u6807 ID \u9700\u8981\u5355\u503C\u6587\u672C\uFF0F\u5F15\u7528\u5B57\u6BB5\u3002");
        if (!source.targetUrlField || !source.targetUrlField.split(".").every((part) => /^[A-Za-z_][A-Za-z0-9_-]*$/.test(part) && !["constructor", "prototype", "__proto__"].includes(part))) fail("image/targetUrlField", "\u624B\u586B\u76EE\u6807\u5B57\u6BB5\u8DEF\u5F84\u65E0\u6548\u3002");
      }
    }
  }
  return issues;
}
function pointSymbolBindings(value) {
  if (!value) return [];
  const result = [];
  const base = (p, at) => {
    result.push({ path: at + "/stroke", value: p.stroke }, { path: at + "/fill", value: p.fill });
  };
  if (value.kind === "shape") base(value.shape, "shape");
  else {
    base(value.fallback, "fallback");
    if (value.kind === "icon") {
      const item = (p, at) => {
        result.push({ path: at + "/foreground", value: p.foreground });
        if (p.plate) result.push({ path: at + "/plate/fill", value: p.plate.fill }, { path: at + "/plate/stroke", value: p.plate.stroke });
      };
      if (value.icon.mode === "single") item(value.icon.item, "icon/item");
      else value.icon.entries.forEach((row2, i) => item(row2.item, `icon/entries/${i}/item`));
    }
  }
  return result;
}

// src/configStudio/renderBooleanFormula.ts
var cache = /* @__PURE__ */ new WeakMap();
function parse(text, known) {
  if (text.length > 16384) throw Error("\u6761\u4EF6\u516C\u5F0F\u8D85\u8FC7 16 KiB\u3002");
  const tokens = [];
  const re = /\s*([A-Z][A-Z0-9_]*|[()])/igy;
  let offset = 0;
  while (offset < text.length) {
    if (!text.slice(offset).trim()) break;
    re.lastIndex = offset;
    const token = re.exec(text);
    if (!token) throw Error(`\u6761\u4EF6\u516C\u5F0F\u5728\u7B2C ${offset + 1} \u4E2A\u5B57\u7B26\u65E0\u6548\u3002`);
    tokens.push(token[1].toUpperCase());
    offset = re.lastIndex;
  }
  let index = 0;
  const unary = (depth) => {
    if (depth > 32) throw Error("\u6761\u4EF6\u516C\u5F0F\u8D85\u8FC7 32 \u5C42\u3002");
    const token = tokens[index++];
    if (token === "NOT") return { kind: "not", child: unary(depth + 1) };
    if (token === "(") {
      const result2 = or(depth + 1);
      if (tokens[index++] !== ")") throw Error("\u6761\u4EF6\u516C\u5F0F\u62EC\u53F7\u4E0D\u914D\u5BF9\u3002");
      return result2;
    }
    if (!token || !known.has(token)) throw Error(`\u672A\u77E5\u6761\u4EF6/\u7EC4 ${token ?? "\uFF08\u7A7A\uFF09"}\u3002`);
    return { kind: "term", id: token };
  };
  const balanced = (items, kind) => {
    if (items.length === 1) return items[0];
    const mid = Math.floor(items.length / 2);
    return { kind, left: balanced(items.slice(0, mid), kind), right: balanced(items.slice(mid), kind) };
  };
  const and = (depth) => {
    const items = [unary(depth)];
    while (tokens[index] === "AND") {
      index++;
      items.push(unary(depth));
    }
    return balanced(items, "and");
  };
  const or = (depth) => {
    const items = [and(depth)];
    while (tokens[index] === "OR") {
      index++;
      items.push(and(depth));
    }
    return balanced(items, "or");
  };
  const result = or(0);
  if (index !== tokens.length) throw Error(`\u591A\u4F59\u7684\u6761\u4EF6\u7B26\u53F7 ${tokens[index]}\u3002`);
  return result;
}
function compileRenderFormula(formula) {
  if (Object.isFrozen(formula) && cache.has(formula)) return cache.get(formula);
  if (!formula.terms.length || formula.terms.length > 256) throw Error("\u6761\u4EF6\u516C\u5F0F\u9700\u8981 1\u2013256 \u4E2A\u539F\u5B50\u6761\u4EF6\u3002");
  if ((formula.groups?.length ?? 0) > 256 || formula.expression.length + (formula.groups ?? []).reduce((sum2, g) => sum2 + g.expression.length, 0) > 16384) throw Error("\u6761\u4EF6\u53CA\u547D\u540D\u7EC4\u516C\u5F0F\u603B\u957F\u5EA6\u8D85\u8FC7 16 KiB\uFF0C\u6216\u547D\u540D\u7EC4\u8D85\u8FC7 256 \u9879\u3002");
  if (formula.terms.some((t) => !/^C\d+$/.test(t.id)) || formula.groups?.some((g) => !/^G\d+$/.test(g.id))) throw Error("\u6761\u4EF6\u4F7F\u7528 C \u7F16\u53F7\uFF0C\u547D\u540D\u7EC4\u4F7F\u7528 G \u7F16\u53F7\u3002");
  const ids = [...formula.terms.map((t) => t.id), ...(formula.groups ?? []).map((g) => g.id)];
  if (ids.some((id) => !/^C\d+$|^G\d+$/.test(id)) || new Set(ids).size !== ids.length) throw Error("\u6761\u4EF6/\u7EC4\u7F16\u53F7\u65E0\u6548\u6216\u91CD\u590D\u3002");
  const known = new Set(ids), termIds = new Set(formula.terms.map((t) => t.id)), groups = new Map(formula.groups?.map((g) => [g.id, g.expression])), compiledGroups = /* @__PURE__ */ new Map();
  const resolve = (ast2, stack, depth) => {
    if (depth > 32) throw Error("\u7EC4\u5408\u516C\u5F0F\u8D85\u8FC7 32 \u5C42\u3002");
    if (ast2.kind === "term") {
      if (termIds.has(ast2.id)) return ast2;
      if (stack.has(ast2.id)) throw Error(`\u6761\u4EF6\u7EC4\u5FAA\u73AF\u5F15\u7528 ${ast2.id}\u3002`);
      if (compiledGroups.has(ast2.id)) return compiledGroups.get(ast2.id);
      const next = new Set(stack);
      next.add(ast2.id);
      const result = resolve(parse(groups.get(ast2.id), known), next, depth + 1);
      compiledGroups.set(ast2.id, result);
      return result;
    }
    return ast2.kind === "not" ? { ...ast2, child: resolve(ast2.child, stack, depth + 1) } : { ...ast2, left: resolve(ast2.left, stack, depth + 1), right: resolve(ast2.right, stack, depth + 1) };
  };
  for (const [id, text] of groups) if (!compiledGroups.has(id)) compiledGroups.set(id, resolve(parse(text, known), /* @__PURE__ */ new Set([id]), 0));
  const ast = resolve(parse(formula.expression, known), /* @__PURE__ */ new Set(), 0);
  if (Object.isFrozen(formula)) cache.set(formula, ast);
  return ast;
}
function evaluate(ast, read, memo = /* @__PURE__ */ new Map()) {
  if (memo.has(ast)) return memo.get(ast);
  const result = ast.kind === "term" ? read(ast.id) : ast.kind === "not" ? !evaluate(ast.child, read, memo) : ast.kind === "and" ? evaluate(ast.left, read, memo) && evaluate(ast.right, read, memo) : evaluate(ast.left, read, memo) || evaluate(ast.right, read, memo);
  memo.set(ast, result);
  return result;
}
function matchesAtomicCondition(condition, read) {
  const raw = read(condition.field);
  if (condition.kind !== "fieldCompare") {
    const value = String(raw ?? "").trim();
    return condition.kind === "fieldEquals" ? value === condition.value : condition.kind === "fieldIn" ? condition.values.includes(value) : condition.present ? value.length > 0 : value.length === 0;
  }
  const empty3 = raw == null || typeof raw === "string" && !raw.trim() || Array.isArray(raw) && !raw.length;
  if (condition.operator === "present" || condition.operator === "empty") return condition.operator === "empty" ? empty3 : !empty3;
  if (condition.operator === "in" || condition.operator === "notIn") {
    const hit = condition.values?.some((value) => value === raw) ?? false;
    return condition.operator === "in" ? hit : !hit;
  }
  if (condition.operator === "eq" || condition.operator === "ne") return condition.operator === "eq" ? raw === condition.value : raw !== condition.value;
  if (typeof raw !== "number" || !Number.isFinite(raw) || typeof condition.value !== "number" || !Number.isFinite(condition.value)) return false;
  return condition.operator === "gt" ? raw > condition.value : condition.operator === "ge" ? raw >= condition.value : condition.operator === "lt" ? raw < condition.value : raw <= condition.value;
}
function formulaContradiction(formula) {
  const ast = compileRenderFormula(formula);
  const facts = [], terms = new Map(formula.terms.map((t) => [t.id, t.condition]));
  const conjunction = (node, positive = true) => node.kind === "term" ? (facts.push({ condition: terms.get(node.id), positive }), true) : node.kind === "not" ? conjunction(node.child, !positive) : node.kind === "and" && positive ? conjunction(node.left) && conjunction(node.right) : node.kind === "or" && !positive ? conjunction(node.left, false) && conjunction(node.right, false) : false;
  if (conjunction(ast)) for (const field of new Set(facts.map((f) => f.condition.field))) {
    const constraints = facts.filter((f) => f.condition.field === field), literals = constraints.flatMap(({ condition: c }) => c.kind === "fieldEquals" ? [c.value] : c.kind === "fieldIn" ? c.values : c.kind === "fieldCompare" ? c.values ?? (c.value !== void 0 ? [c.value] : []) : []);
    if (literals.length > 256) continue;
    const numbers = [...new Set(literals.flatMap((v) => typeof v === "number" ? [v] : typeof v === "string" && v.trim() && Number.isFinite(Number(v)) ? [Number(v)] : []))].sort((a, b) => a - b);
    const candidates = [void 0, null, "", 0, false, true, [], [null], [""], {}, ...literals.map((value) => [value]), ...literals, ...numbers, ...numbers.flatMap((v, i) => [v - Math.max(1, Math.abs(v) * 0.1), v + Math.max(1, Math.abs(v) * 0.1), ...i ? [numbers[i - 1] / 2 + v / 2] : []])];
    let other = "__other__";
    while (literals.includes(other)) other += "_";
    candidates.push(other);
    if (!candidates.some((value) => constraints.every(({ condition, positive }) => matchesAtomicCondition(condition, () => value) === positive))) return true;
  }
  if (formula.terms.length > 10) return false;
  for (let mask = 0; mask < 2 ** formula.terms.length; mask++) if (evaluate(ast, (id) => Boolean(mask & 1 << formula.terms.findIndex((t) => t.id === id)))) return false;
  return true;
}

// src/configStudio/conditionWitness.ts
var MAX_BRANCHES = 128;
var MAX_TERMS = 4096;
var numericBits = new DataView(new ArrayBuffer(8));
function nextNumber(value, direction) {
  if (!Number.isFinite(value)) return value;
  if (value === 0) return direction * Number.MIN_VALUE;
  numericBits.setFloat64(0, value);
  const bits = numericBits.getBigUint64(0);
  numericBits.setBigUint64(0, value > 0 === direction > 0 ? bits + 1n : bits - 1n);
  return numericBits.getFloat64(0);
}
function product(left, right) {
  const values2 = [];
  let complete = left.complete && right.complete;
  for (const a of left.values) for (const b of right.values) {
    if (values2.length >= MAX_BRANCHES || a.length + b.length > MAX_TERMS) {
      complete = false;
      continue;
    }
    values2.push([...a, ...b]);
  }
  return { values: values2, complete };
}
function sum(left, right) {
  const all = [...left.values, ...right.values];
  return { values: all.slice(0, MAX_BRANCHES), complete: left.complete && right.complete && all.length <= MAX_BRANCHES };
}
function branches(group, positive = true) {
  if (!("op" in group)) return { values: [[{ condition: group, positive }]], complete: true };
  if (group.formula) {
    const terms = new Map(group.formula.terms.map((t) => [t.id, t.condition]));
    const visit = (ast, polarity) => {
      if (ast.kind === "term") return { values: [[{ condition: terms.get(ast.id), positive: polarity }]], complete: true };
      if (ast.kind === "not") return visit(ast.child, !polarity);
      return ast.kind === "and" === polarity ? product(visit(ast.left, polarity), visit(ast.right, polarity)) : sum(visit(ast.left, polarity), visit(ast.right, polarity));
    };
    return visit(compileRenderFormula(group.formula), positive);
  }
  if (!group.items.length || group.op === "not" && group.items.length !== 1) throw Error("\u6761\u4EF6\u7EC4\u4E0D\u5B8C\u6574\u3002");
  if (group.op === "not") return branches(group.items[0], !positive);
  const isAnd = group.op === "all" === positive;
  return group.items.map((item) => branches(item, positive)).reduce(isAnd ? product : sum);
}
function readPath(value, key2) {
  return key2.split(".").reduce((node, part) => node && typeof node === "object" && !["__proto__", "prototype", "constructor"].includes(part) ? node[part] : void 0, value);
}
function literalsFor(condition) {
  return condition.kind === "fieldEquals" ? [condition.value] : condition.kind === "fieldIn" ? condition.values : condition.kind === "fieldCompare" ? condition.values ?? (condition.value !== void 0 ? [condition.value] : []) : [];
}
function candidateDomain(field, facts, seed, respectRequired) {
  const literals = facts.flatMap((f) => literalsFor(f.condition));
  const values2 = [];
  if (seed !== void 0) values2.push(seed);
  const required = respectRequired && field?.required;
  if (!required) values2.push(void 0);
  let complete = true;
  if (field?.cardinality === "multiple" || field?.type === "json" || field?.type === "reference") {
    if (field.type === "reference") values2.push(...literals.filter((value) => typeof value === "string"));
    complete = false;
  } else if (field?.type === "enum") {
    const type = scalarType(field);
    const options = (field.options ?? []).map((o) => type === "number" ? Number(o.value) : type === "boolean" ? o.value === "true" : o.value);
    if (type === "number") options.sort((a, b) => Number(a) - Number(b));
    if (type === "boolean") options.sort((a, b) => Number(a) - Number(b));
    values2.push(...options);
  } else {
    const type = field ? scalarType(field) : void 0;
    if (!type || type === "boolean") values2.push(false, true);
    if (!type || type === "number") {
      let lower, strict = false;
      for (const fact of facts) {
        const c = fact.condition;
        if (c.kind !== "fieldCompare" || typeof c.value !== "number") continue;
        const bound = fact.positive ? c.operator : { lt: "ge", le: "gt", gt: "le", ge: "lt" }[c.operator];
        if (bound !== "gt" && bound !== "ge") continue;
        if (lower === void 0 || c.value > lower) {
          lower = c.value;
          strict = bound === "gt";
        } else if (c.value === lower && bound === "gt") strict = true;
      }
      if (lower !== void 0) values2.push(strict ? nextNumber(lower, 1) : lower);
      values2.push(0);
      const numbers = literals.flatMap((value) => typeof value === "number" ? [value] : typeof value === "string" && value.trim() && Number.isFinite(Number(value)) ? [Number(value)] : []);
      for (const number2 of numbers) values2.push(number2, nextNumber(number2, 1), nextNumber(number2, -1));
    }
    if (!type || type === "string") {
      if (!required) values2.push("");
      values2.push(...literals.filter((value) => typeof value === "string"), ...literals.filter((value) => typeof value !== "string").map(String));
      let other = "a";
      while (literals.includes(other)) other += "a";
      values2.push(other);
    }
    if (!field) complete = false;
  }
  return { values: [...new Set(values2)].filter((value) => {
    if (typeof value === "number" && !Number.isFinite(value)) return false;
    if (required && (value === void 0 || value === null || typeof value === "string" && !value.trim())) return false;
    if (value !== void 0 && field && field.type !== "json" && field.cardinality === "single") {
      if (typeof value !== scalarType(field)) return false;
      if (field.type === "enum" && !field.options?.some((option) => option.value === String(value))) return false;
    }
    return true;
  }), complete };
}
function solveConditionWitness(groups, fields, pins = [], options = {}) {
  let all = { values: [[]], complete: true };
  try {
    for (const { group, negate } of groups) all = product(all, branches(group, !negate));
  } catch (error) {
    return { status: "unknown", reason: String(error) };
  }
  const facts = pins.map((pin) => ({ condition: { kind: "fieldCompare", field: pin.field, operator: "eq", value: pin.value }, positive: true }));
  all = product(all, { values: [facts], complete: true });
  const seed = options.seed ?? {}, definitions = new Map(fields.map((f) => [f.key, f]));
  let best, unknown = !all.complete;
  for (const branch of all.values) {
    const byField = /* @__PURE__ */ new Map();
    for (const literal of branch) {
      const field = literal.condition.field;
      byField.set(field, [...byField.get(field) ?? [], literal]);
    }
    const keys = [...byField.keys()];
    if (keys.some((key2) => !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(key2) || key2.split(".").some((part) => ["__proto__", "prototype", "constructor"].includes(part)))) return { status: "unknown", reason: "\u6761\u4EF6\u5B57\u6BB5\u8DEF\u5F84\u65E0\u6548\u6216\u4E0D\u5B89\u5168\u3002" };
    if (keys.some((key2, i) => keys.some((other, j) => i !== j && other.startsWith(key2 + ".")))) {
      unknown = true;
      continue;
    }
    const values2 = /* @__PURE__ */ Object.create(null);
    let valid = true, changes = 0;
    for (const [key2, conditions] of byField) {
      const original = readPath(seed, key2), domain = candidateDomain(definitions.get(key2), conditions, original, options.respectRequired !== false);
      const match = domain.values.findIndex((value) => conditions.every((literal) => matchesAtomicCondition(literal.condition, () => value) === literal.positive));
      if (match < 0) {
        valid = false;
        if (!domain.complete) unknown = true;
        break;
      }
      values2[key2] = domain.values[match];
      if (!Object.is(values2[key2], original)) changes++;
    }
    if (valid && (!best || changes < best.changes)) best = { status: "satisfiable", values: values2, changes, minimal: all.complete };
  }
  return best ?? (unknown ? { status: "unknown", reason: "\u5F53\u524D\u503C\u57DF\uFF0F\u5206\u652F\u9884\u7B97\u5185\u672A\u80FD\u5B89\u5168\u6784\u9020\uFF1B\u672A\u8BC1\u660E\u77DB\u76FE\u3002" } : { status: "unsatisfiable", reason: "\u5B57\u6BB5\u7684\u5B9E\u9645\u53D6\u503C\u57DF\u53CA\u5168\u90E8\u6761\u4EF6\u6CA1\u6709\u5171\u540C\u89E3\u3002" });
}

// src/configStudio/localMappingConstraints.ts
function unreachableLocalMappingRows(rule, fields, parents = []) {
  return localMappingConstraints(rule).filter((row2) => solveConditionWitness(rule.when?.fields ? [{ group: rule.when.fields }] : [], fields, [...parents, ...row2.pins]).status === "unsatisfiable");
}
function localMappingConstraints(rule) {
  const rows = [];
  const colors = (color, path2, parents = []) => {
    if (color?.mode === "valueMap") color.entries.forEach((row2, i) => rows.push({ path: `${path2}/entries/${i}`, pins: [...parents, { field: color.field, value: row2.value }] }));
  };
  const icon = (item, path2, parents) => {
    colors(item.foreground, path2 + "/foreground", parents);
    colors(item.plate?.fill, path2 + "/plate/fill", parents);
    colors(item.plate?.stroke, path2 + "/plate/stroke", parents);
  };
  const symbol = rule.style?.pointSymbol;
  if (symbol) {
    const base = symbol.kind === "shape" ? symbol.shape : symbol.fallback;
    colors(base.stroke, "style/pointSymbol/" + (symbol.kind === "shape" ? "shape" : "fallback") + "/stroke");
    colors(base.fill, "style/pointSymbol/" + (symbol.kind === "shape" ? "shape" : "fallback") + "/fill");
    if (symbol.kind === "icon") {
      if (symbol.icon.mode === "single") icon(symbol.icon.item, "style/pointSymbol/icon/item", []);
      else {
        const source = symbol.icon;
        source.entries.forEach((row2, i) => {
          const pins = [{ field: source.field, value: row2.value }], path2 = `style/pointSymbol/icon/entries/${i}`;
          rows.push({ path: path2, pins });
          icon(row2.item, path2 + "/item", pins);
        });
      }
    } else if (symbol.kind === "externalImage" && symbol.image.mode === "valueMap") {
      const source = symbol.image;
      source.entries.forEach((row2, i) => rows.push({ path: `style/pointSymbol/image/entries/${i}`, pins: [{ field: source.field, value: row2.value }] }));
    }
  } else {
    colors(rule.style?.stroke, "style/stroke");
    colors(rule.style?.fill, "style/fill");
  }
  colors(rule.label?.style?.color, "label/style/color");
  const pill = rule.label?.style?.pill;
  if (pill) for (const key2 of ["textColor", "backgroundColor", "strokeColor"]) colors(pill[key2], "label/style/pill/" + key2);
  for (const [state, value] of Object.entries(rule.extensions?.interaction ?? {})) if (value?.enabled) colors(value.strokeColorBinding, `extensions/interaction/${state}/strokeColorBinding`);
  return rows;
}

// src/core/project/buttonVisualCatalog.ts
var BUTTON_ICONS = [
  ["train", "\u94C1\u8DEF"],
  ["route", "\u9053\u8DEF"],
  ["leaf", "\u81EA\u7136"],
  ["home", "\u4F4F\u5B85"],
  ["map", "\u5730\u56FE"],
  ["zap", "\u4F20\u9001"],
  ["shoppingCart", "\u8D38\u6613"],
  ["building2", "\u5EFA\u7B51"],
  ["treePine", "\u6811\u6797"],
  ["mountain", "\u5C71\u5730"],
  ["waves", "\u6C34\u57DF"],
  ["landmark", "\u5730\u6807"],
  ["hospital", "\u533B\u7597"],
  ["school", "\u5B66\u6821"],
  ["factory", "\u5DE5\u5382"],
  ["warehouse", "\u4ED3\u5E93"],
  ["church", "\u6559\u5802"],
  ["castle", "\u57CE\u5821"],
  ["tent", "\u8425\u5730"],
  ["plane", "\u673A\u573A"],
  ["ship", "\u6E2F\u53E3"],
  ["bus", "\u516C\u4EA4"],
  ["bike", "\u9A91\u884C"],
  ["footprints", "\u6B65\u884C"],
  ["mapPin", "\u5730\u70B9"],
  ["flag", "\u6807\u8BB0"],
  ["circleParking", "\u505C\u8F66"],
  ["cableCar", "\u7F06\u8F66"],
  ["network", "\u7F51\u7EDC"],
  ["layers", "\u56FE\u5C42"],
  ["compass", "\u65B9\u5411"],
  ["ferrisWheel", "\u6E38\u4E50"]
];
var BUTTON_TONES = {
  blue: { label: "\u84DD", active: "bg-blue-100 text-blue-600" },
  green: { label: "\u7EFF", active: "bg-green-100 text-green-600" },
  cyan: { label: "\u9752", active: "bg-cyan-100 text-cyan-600" },
  purple: { label: "\u7D2B", active: "bg-purple-100 text-purple-600" },
  gray: { label: "\u7070", active: "bg-gray-100 text-gray-700" },
  orange: { label: "\u6A59", active: "bg-orange-100 text-orange-700" },
  slate: { label: "\u77F3\u677F", active: "bg-slate-300 text-slate-800" },
  red: { label: "\u7EA2", active: "bg-red-100 text-red-700" },
  teal: { label: "\u84DD\u7EFF", active: "bg-teal-100 text-teal-700" },
  pink: { label: "\u7C89", active: "bg-pink-100 text-pink-700" },
  amber: { label: "\u7425\u73C0", active: "bg-amber-100 text-amber-700" },
  indigo: { label: "\u975B\u84DD", active: "bg-indigo-100 text-indigo-700" }
};
var isButtonIcon = (value) => BUTTON_ICONS.some(([id]) => id === value);
var isButtonTone = (value) => Object.prototype.hasOwnProperty.call(BUTTON_TONES, value);

// src/core/project/applicationValidation.ts
function validateApplication(input, classCodes) {
  const issues = validateResourceGroups(input), fail = (path2, message) => issues.push({ path: path2, message });
  let value;
  try {
    value = resolveApplicationSettings(input);
  } catch (error) {
    fail("sources", error instanceof Error ? error.message : String(error));
    return issues;
  }
  const unique = (rows, path2) => {
    const ids = /* @__PURE__ */ new Set();
    for (const row2 of rows) {
      if (!/^[A-Za-z0-9_-]+$/.test(row2.id) || ids.has(row2.id)) fail(path2, `ID \u975E\u6CD5\u6216\u91CD\u590D\uFF1A${row2.id}`);
      ids.add(row2.id);
    }
    return ids;
  };
  const url = (value2, path2, empty3 = false) => {
    if (empty3 && !value2) return;
    try {
      const parsed = new URL(value2);
      if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw Error();
    } catch {
      fail(path2, "\u5FC5\u987B\u662F\u65E0\u51ED\u636E\u7684 HTTP(S) \u5730\u5740\u3002");
    }
  };
  const worlds = unique(value.worlds, "worlds"), buttons = unique(value.buttons.items, "buttons/items"), sources = unique(value.sources.items, "sources/items"), modes = unique(value.sources.linkModes.items, "sources/linkModes");
  if (value.worlds.filter((world) => world.enabled && world.default).length !== 1) fail("worlds", "\u5FC5\u987B\u6709\u4E14\u4EC5\u6709\u4E00\u4E2A\u542F\u7528\u7684\u9ED8\u8BA4\u4E16\u754C\u3002");
  const numbers = /* @__PURE__ */ new Set(), prefixes2 = /* @__PURE__ */ new Set();
  for (const world of value.worlds) {
    const path2 = `worlds/${world.id}`;
    if (!Number.isSafeInteger(world.numericCode) || world.numericCode < 0 || numbers.has(world.numericCode)) fail(path2, "\u4E16\u754C\u6570\u5B57\u7F16\u53F7\u5FC5\u987B\u552F\u4E00\u4E14\u4E3A\u975E\u8D1F\u6574\u6570\u3002");
    numbers.add(world.numericCode);
    if (!/^[A-Z]$/.test(world.prefix) || prefixes2.has(world.prefix)) fail(path2, "\u7B80\u79F0\u5FC5\u987B\u662F\u552F\u4E00\u7684\u5927\u5199\u5B57\u6BCD\u3002");
    prefixes2.add(world.prefix);
    const worldSources = resourceGroupForWorld(input, world.id)?.sources ?? value.sources;
    if (!worldSources.items.some((source) => source.id === world.dataSourceId && (!world.enabled || source.enabled))) fail(path2, "\u4E16\u754C\u7ED1\u5B9A\u7684\u6570\u636E\u6E90\u4E0D\u5B58\u5728\u6216\u672A\u542F\u7528\u3002");
    if (!Object.values(world.center).every(Number.isFinite)) fail(path2, "\u4E16\u754C\u4E2D\u5FC3\u5FC5\u987B\u662F\u6709\u9650\u5750\u6807\u3002");
    url(world.mapLink, path2 + "/mapLink");
    url(world.tiles.baseUrl, path2 + "/tiles/baseUrl");
    if (!world.tiles.filteredBaseUrl.startsWith("/") || world.tiles.filteredBaseUrl.startsWith("//")) url(world.tiles.filteredBaseUrl, path2 + "/tiles/filteredBaseUrl");
    const projection = world.projection;
    if (projection.id !== "dynmap-flat" || projection.worldToMap.length !== 9 || projection.mapToWorld.length !== 9 || ![...projection.worldToMap, ...projection.mapToWorld].every(Number.isFinite)) fail(path2, "\u6295\u5F71\u5FC5\u987B\u4F7F\u7528\u6CE8\u518C\u7684 dynmap-flat \u548C\u4E24\u7EC4 9 \u9879\u6709\u9650\u53C2\u6570\u3002");
    if (![projection.mapzoomin, projection.mapzoomout, projection.tilescale, world.tiles.extraZoomLevels].every((number2) => Number.isSafeInteger(number2) && number2 >= 0 && number2 <= 16)) fail(path2, "\u6295\u5F71/\u74E6\u7247\u7F29\u653E\u53C2\u6570\u987B\u4E3A 0\u201316 \u6574\u6570\u3002");
    if (!Number.isInteger(world.tiles.minNativeZoom) || !Number.isInteger(world.tiles.maxNativeZoom) || world.tiles.minNativeZoom > world.tiles.maxNativeZoom || world.tiles.minNativeZoom < value.preferences.map.leafletOffset || world.tiles.maxNativeZoom > 8 + value.preferences.map.leafletOffset) fail(path2, "\u539F\u751F\u74E6\u7247\u8303\u56F4\u5FC5\u987B\u4F4D\u4E8E\u903B\u8F91 Zoom \u6620\u5C04\u5185\u4E14\u4E0B\u9650\u4E0D\u5927\u4E8E\u4E0A\u9650\u3002");
    if (!Number.isInteger(world.tiles.maxRetries) || world.tiles.maxRetries < 0 || world.tiles.maxRetries > 10 || !Number.isFinite(world.tiles.retryDelay) || world.tiles.retryDelay < 0) fail(path2, "\u74E6\u7247\u91CD\u8BD5\u6B21\u6570/\u95F4\u9694\u65E0\u6548\u3002");
  }
  for (const button of value.buttons.items) {
    const path2 = `buttons/${button.id}`;
    if (!isButtonIcon(button.iconKey)) fail(path2, "\u56FE\u6807\u672A\u6CE8\u518C\u3002");
    if (!isButtonTone(button.tone)) fail(path2, "\u914D\u8272\u672A\u6CE8\u518C\u3002");
    if (button.criteria.paths) {
      if (!button.criteria.paths.length) fail(path2, "\u81F3\u5C11\u9700\u8981\u4E00\u6761\u663E\u793A\u5185\u5BB9\u3002");
      if (Object.keys(button.criteria).some((key2) => key2 !== "paths")) fail(path2, "\u5B8C\u6574\u5206\u7C7B\u8303\u56F4\u4E0D\u80FD\u4E0E\u65E7\u6761\u4EF6\u6570\u7EC4\u5E76\u5B58\u3002");
      for (const [index, row2] of button.criteria.paths.entries()) {
        if (!row2.class || row2.skind && !row2.kind || row2.skind2 && !row2.skind) fail(`${path2}/criteria/paths/${index}`, "Class \u5FC5\u586B\uFF0C\u7236\u7EA7\u8DEF\u5F84\u5FC5\u987B\u8FDE\u7EED\u3002");
        if (classCodes && !classCodes.has(row2.class)) fail(path2, `\u7ED1\u5B9A Class \u4E0D\u5B58\u5728\uFF1A${row2.class}`);
      }
    }
    if (classCodes) {
      for (const code of button.criteria.classCode ?? []) if (!classCodes.has(code)) fail(path2, `\u7ED1\u5B9A Class \u4E0D\u5B58\u5728\uFF1A${code}`);
    }
    const behavior = button.behavior;
    for (const target of [...behavior?.exclusiveWith ?? [], ...behavior?.disableWhenEnabled ?? [], ...behavior?.enableWhenEnabled ?? [], ...(behavior?.linkedButtons ?? []).map((row2) => row2.targetId)]) if (target === button.id || !buttons.has(target)) fail(path2, `\u5173\u8054\u6309\u94AE\u4E0D\u5B58\u5728\u6216\u5F15\u7528\u81EA\u8EAB\uFF1A${target}`);
    const enables = /* @__PURE__ */ new Set([...behavior?.enableWhenEnabled ?? [], ...(behavior?.linkedButtons ?? []).filter((row2) => row2.mode !== "disableWhenThisEnabled").map((row2) => row2.targetId)]), disables = /* @__PURE__ */ new Set([...behavior?.disableWhenEnabled ?? [], ...behavior?.exclusiveWith ?? [], ...(behavior?.linkedButtons ?? []).filter((row2) => row2.mode === "disableWhenThisEnabled").map((row2) => row2.targetId)]);
    for (const id of enables) if (disables.has(id)) fail(path2, `\u6309\u94AE\u540C\u65F6\u8981\u6C42\u5F00/\u5173\uFF1A${id}`);
  }
  const graph = new Map(value.buttons.items.map((button) => [button.id, [...button.behavior?.enableWhenEnabled ?? [], ...button.behavior?.linkedButtons?.filter((row2) => row2.mode !== "disableWhenThisEnabled").map((row2) => row2.targetId) ?? []]]));
  const walk = (id, stack, done2) => {
    if (stack.has(id)) {
      fail("buttons", "\u8054\u52A8\u5B58\u5728\u5FAA\u73AF\uFF1A" + id);
      return;
    }
    if (done2.has(id)) return;
    stack.add(id);
    for (const next of graph.get(id) ?? []) walk(next, stack, done2);
    stack.delete(id);
    done2.add(id);
  };
  const done = /* @__PURE__ */ new Set();
  for (const id of buttons) walk(id, /* @__PURE__ */ new Set(), done);
  for (const [world, ids] of Object.entries(value.buttons.byWorld)) {
    if (!worlds.has(world)) fail("buttons/byWorld", "\u9ED8\u8BA4\u6309\u94AE\u4E16\u754C\u4E0D\u5B58\u5728\uFF1A" + world);
    checkDefaults(ids, world);
  }
  checkDefaults(value.buttons.fallback, "fallback");
  function checkDefaults(ids, context) {
    if (new Set(ids).size !== ids.length || ids.some((id) => !buttons.has(id))) fail("buttons/defaults", `\u9ED8\u8BA4\u6309\u94AE\u91CD\u590D\u6216\u4E0D\u5B58\u5728\uFF1A${context}`);
    if (value.buttons.maxActive > 0 && ids.length > value.buttons.maxActive) fail("buttons/defaults", `\u9ED8\u8BA4\u6570\u91CF\u8D85\u8FC7\u4E0A\u9650\uFF1A${context}`);
    for (const id of ids) {
      const button = value.buttons.items.find((row2) => row2.id === id);
      if (button?.behavior?.exclusiveWith?.some((target) => ids.includes(target))) fail("buttons/defaults", `\u9ED8\u8BA4\u6309\u94AE\u4E92\u65A5\uFF1A${context}/${id}`);
    }
  }
  if (!Number.isInteger(value.buttons.maxActive) || value.buttons.maxActive < 0) fail("buttons/maxActive", "\u6700\u5927\u6D3B\u52A8\u6570\u987B\u4E3A\u975E\u8D1F\u6574\u6570\u3002");
  if (!value.sources.items.some((source) => source.id === value.sources.defaultSourceId && source.enabled)) fail("sources/defaultSourceId", "\u9ED8\u8BA4\u6765\u6E90\u5FC5\u987B\u5B58\u5728\u4E14\u542F\u7528\u3002");
  for (const source of value.sources.items) {
    url(source.rootUrl, `sources/${source.id}/rootUrl`);
    url(source.mediaRootUrl, `sources/${source.id}/mediaRootUrl`, true);
    if (source.readerKind !== "formal-release-v2" || source.readerSchemaVersion !== "openriamap.formal-release-reader.v2") fail("sources", "\u53EA\u63A5\u53D7\u73B0\u5F79\u6B63\u5F0F\u53D1\u5E03\u683C\u5F0F\u3002");
    if (source.transport === "github-raw-compatible" && !value.sources.github.sourceIds.includes(source.id)) fail("sources", "GitHub transport \u7F3A\u5C11\u6E90\u7ED1\u5B9A\u3002");
  }
  for (const id of value.sources.github.sourceIds) if (!sources.has(id)) fail("sources/github", "\u955C\u50CF\u6E90\u4E0D\u5B58\u5728\uFF1A" + id);
  if (![value.sources.github.owner, value.sources.github.repo, value.sources.github.branch].every((part) => part && /^[A-Za-z0-9_.\/-]+$/.test(part) && !part.includes(".."))) fail("sources/github", "\u4ED3\u5E93/\u5206\u652F\u53C2\u6570\u65E0\u6548\u3002");
  if (!modes.size || value.sources.linkModes.items.filter((mode) => mode.default).length !== 1) fail("sources/linkModes", "\u5FC5\u987B\u6709\u4E00\u4E2A\u9ED8\u8BA4\u94FE\u63A5\u6A21\u5F0F\u3002");
  for (const mode of value.sources.linkModes.items) url(mode.baseUrl, `sources/linkModes/${mode.id}`);
  const modules = unique(value.modules.items, "modules");
  for (const module of value.modules.items) for (const id of module.exclusiveWith) if (!modules.has(id) || id === module.id) fail("modules", "\u6A21\u5757\u4E92\u65A5\u76EE\u6807\u4E0D\u5B58\u5728\u6216\u662F\u81EA\u8EAB\u3002");
  for (const id of ["mapping", "measurement", "navigation", "search", "review", "players", "settings", "publicReleases"]) if (!modules.has(id)) fail("modules", "\u7F3A\u5C11\u6CE8\u518C\u6A21\u5757\uFF1A" + id);
  for (const module of value.modules.items) if (!["mapping", "measurement", "review"].includes(module.id) && module.load !== "eager") fail("modules", "\u5185\u7F6E\u6A21\u5757\u4F7F\u7528 eager \u52A0\u8F7D\uFF1B\u6309\u9700/\u9884\u8F7D\u53EA\u7528\u4E8E\u6CE8\u518C\u5206\u5305\u3002");
  for (const id of ["mapping", "measurement", "review"]) for (const other of ["mapping", "measurement", "review"]) if (id !== other && !value.modules.items.find((module) => module.id === id)?.exclusiveWith.includes(other)) fail("modules", "\u6D4B\u7ED8\u3001\u6D4B\u91CF\u3001\u5BA1\u6838\u5FC5\u987B\u4FDD\u7559\u5355\u4E00\u6D3B\u52A8\u5DE5\u4F5C\u533A\u4E92\u65A5\u5173\u7CFB\u3002");
  if (value.modules.players.pollIntervalMs < 1e3 || value.modules.players.requestTimeoutMs < 1e3) fail("modules/players", "\u73A9\u5BB6\u8F6E\u8BE2\u548C\u8D85\u65F6\u4E0D\u80FD\u5C0F\u4E8E 1000ms\u3002");
  if (!value.modules.players.endpoint.startsWith("/") || value.modules.players.endpoint.startsWith("//")) url(value.modules.players.endpoint.replace("{timestamp}", "0").replace("{world}", "zth"), "modules/players/endpoint");
  url(value.modules.players.directEndpoint.replace("{timestamp}", "0").replace("{world}", "zth"), "modules/players/directEndpoint");
  for (const [key2, path2] of Object.entries({ ...value.review.auth, control: value.review.control, workflow: value.review.workflow, publicReleases: value.review.publicReleases })) if ((value.review.enabled || path2) && (!path2.startsWith("/") || path2.startsWith("//") || path2.includes("..") || /[?#]/.test(path2))) fail("review/" + key2, "\u5BA1\u6838\u4F7F\u7528\u540C\u6E90\u7EDD\u5BF9\u8DEF\u5F84\uFF1B\u542F\u7528\u65F6\u4E0D\u53EF\u4E3A\u7A7A\u3002");
  for (const ref of Object.values(value.review.serverReferences)) if (!/^[A-Z][A-Z0-9_]*$/.test(ref)) fail("review/serverReferences", "\u4EC5\u4FDD\u5B58\u670D\u52A1\u7AEF\u73AF\u5883\u53D8\u91CF\u5F15\u7528\u540D\u3002");
  const preferences = value.preferences;
  if (!Number.isInteger(preferences.map.leafletOffset) || Math.abs(preferences.map.leafletOffset) > 8 || !Number.isInteger(preferences.map.logicalInitialZoom) || preferences.map.logicalInitialZoom < 0 || preferences.map.logicalInitialZoom > 8) fail("preferences/map", "\u903B\u8F91 Zoom \u4E3A 0\u20138\uFF0C\u6620\u5C04\u504F\u79FB\u987B\u4E3A -8\u20138 \u6574\u6570\u3002");
  for (const count of [preferences.search.homepageLimit, preferences.search.navigationLimit]) if (!Number.isInteger(count) || count < 1 || count > 200) fail("preferences/search", "\u7ED3\u679C\u6570\u91CF\u987B\u4E3A 1\u2013200 \u6574\u6570\u3002");
  if (!Number.isFinite(preferences.search.debounceMs) || preferences.search.debounceMs < 0 || preferences.search.debounceMs > 2e3) fail("preferences/search", "\u5EF6\u8FDF\u987B\u4E3A 0\u20132000ms\u3002");
  for (const [key2, number2] of Object.entries(value.preferences.navigation)) if (!Number.isFinite(number2) || number2 < 0 || key2 !== "normalPlatformTransferCost" && number2 === 0) fail("preferences/navigation/" + key2, "\u5BFC\u822A\u901F\u5EA6/\u7CFB\u6570\u5FC5\u987B\u4E3A\u6B63\u6709\u9650\u6570\u503C\uFF0C\u6362\u4E58\u6210\u672C\u53EF\u4E3A\u96F6\u3002");
  return issues;
}

// src/configStudio/labelTemplate.ts
var forbidden = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function parseLabelTemplate(template) {
  if (!template || template.length > 8192) throw Error("\u7EC4\u5408\u6765\u6E90\u5FC5\u987B\u586B\u5199\uFF0C\u4E14\u4E0D\u80FD\u8D85\u8FC7 8192 \u5B57\u7B26\u3002");
  const tokens = [];
  let literal = "";
  const push = (kind, value) => {
    if (value) tokens.push({ kind, value });
    if (tokens.length > 256) throw Error("\u7EC4\u5408\u6765\u6E90\u4E0D\u80FD\u8D85\u8FC7 256 \u4E2A\u7247\u6BB5\u3002");
  };
  const escaped = (value) => value === "n" ? "\n" : value === "t" ? "	" : value === '"' || value === "\\" ? value : (() => {
    throw Error('\u4EC5\u652F\u6301 \\"\u3001\\\\\u3001\\n\u3001\\t \u8F6C\u4E49\u3002');
  })();
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    if (char === "\\") {
      if (++i >= template.length) throw Error("\u8F6C\u4E49\u4E0D\u5B8C\u6574\u3002");
      literal += escaped(template[i]);
      continue;
    }
    if (char !== '"') {
      literal += char;
      continue;
    }
    push("literal", literal);
    literal = "";
    let path2 = "";
    let closed = false;
    while (++i < template.length) {
      if (template[i] === '"') {
        closed = true;
        break;
      }
      if (template[i] === "\\") throw Error("\u5B57\u6BB5\u5F15\u7528\u5185\u4E0D\u80FD\u8F6C\u4E49\uFF1B\u8DEF\u5F84\u8BF7\u4F7F\u7528\u5B9E\u9645\u5B57\u6BB5\u540D\u3002");
      path2 += template[i];
    }
    if (!closed) throw Error("\u5B57\u6BB5\u5F15\u7528\u7F3A\u5C11\u7ED3\u675F\u53CC\u5F15\u53F7\u3002");
    if (!/^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(path2) || path2.split(".").some((part) => forbidden.has(part))) throw Error(`\u975E\u6CD5\u5B57\u6BB5\u8DEF\u5F84\uFF1A${path2}`);
    push("field", path2);
  }
  push("literal", literal);
  if (!tokens.some((token) => token.kind === "field")) throw Error("\u7EC4\u5408\u6765\u6E90\u81F3\u5C11\u5F15\u7528\u4E00\u4E2A\u5B57\u6BB5\u3002");
  return Object.freeze(tokens);
}

// src/configStudio/externalEditRegistry.ts
var EXTERNAL_EDIT_OPTIONS = [{ key: "tradePointEditor", label: "TRP \u5DE5\u4F5C\u6D41\u5F0F\u7F16\u8F91\u5B8C\u6210\u54C1", reason: "trp-integrated", version: 1, classes: ["TRP"] }];
function validateExternalEditBinding(workflow) {
  const definition = EXTERNAL_EDIT_OPTIONS.find((d) => d.key === workflow.external?.componentKey), scope = workflow.editor?.scope ?? workflow.target;
  if (!definition || workflow.external?.purpose !== "edit" || workflow.external.version !== definition.version || workflow.external.reason !== definition.reason) return ["\u5916\u90E8\u7F16\u8F91\u7EC4\u4EF6\u3001\u7528\u9014\u3001\u7248\u672C\u6216\u767B\u8BB0\u7406\u7531\u65E0\u6548\u3002"];
  if (!workflow.editor?.enabled || !workflow.editor.dedicated || workflow.quickMapping !== false || scope?.class !== "TRP" || workflow.steps.length || workflow.outputs.length || !workflow.external.coveredClassifications?.length || workflow.external.coveredClassifications.some((p) => p.class !== "TRP")) return ["TRP \u5916\u90E8\u7F16\u8F91\u987B\u4E3A\u6709\u6548 TRP \u8303\u56F4\u3001\u4E13\u4F9B\u7F16\u8F91\u4E14\u5173\u95ED\u4FBF\u6377\u6D4B\u7ED8\u7684\u767B\u8BB0\u5B8C\u6210\u54C1\u3002"];
  return [];
}

// src/configStudio/workflowFieldControl.ts
function workflowControlFromField(field, slot, id, config) {
  if (!isSafeWorkflowTarget(field.key) || PROTECTED_WORKFLOW_TARGETS.has(field.key) || field.key === "ID") throw new Error("\u7CFB\u7EDF\u5B57\u6BB5\u4E0D\u80FD\u901A\u8FC7\u666E\u901A\u5B57\u6BB5\u8F93\u5165\u91CD\u65B0\u5B9A\u4E49\u3002");
  if (field.scenes?.workflow === false) throw new Error("\u6B64\u5B57\u6BB5\u672A\u5F00\u653E\u4E3A\u65B0\u5DE5\u4F5C\u6D41\u8F93\u5165\u3002");
  const kind = field.input === "text" && field.type === "number" ? "number" : field.input;
  const search = kind === "featureSearch" ? field.reference ? {
    target: { class: field.reference.classCode },
    queryFields: [.../* @__PURE__ */ new Set([field.reference.matchField, field.reference.displayField ?? "Name"])],
    returnField: field.reference.matchField,
    displayTemplate: `{{${field.reference.matchField}}} ({{${field.reference.displayField ?? "Name"}}})`,
    matcher: "contains",
    minQueryLength: 1,
    maxResults: 30,
    debounceMs: 180,
    cacheScope: "world"
  } : void 0 : void 0;
  if (kind === "featureSearch" && !search) throw new Error("\u8981\u7D20\u641C\u7D22\u8F93\u5165\u9700\u8981\u5148\u5728\u5B57\u6BB5\u5B9A\u4E49\u4E2D\u8BBE\u7F6E\u5F15\u7528\u76EE\u6807\u3002");
  const common = { id, slot, columns: 1, label: structuredClone(field.labels), required: field.required, placeholder: field.placeholder, defaultValue: structuredClone(field.defaultValue), optionValueType: field.optionValueType ?? (field.type === "number" ? "number" : field.type === "boolean" ? "boolean" : void 0), fieldFormat: field.format };
  if (field.type === "json" && field.cardinality === "multiple") return { ...common, kind: "json" };
  if (field.cardinality === "multiple") return { ...common, kind: "group", group: {
    storage: "scalar",
    optional: !field.required,
    addLabel: { zh: `\u6DFB\u52A0${field.labels.zh}`, en: "" },
    itemFields: [{ key: "", kind, label: structuredClone(field.labels), options: config ? resolveWorkflowSelectOptions(config, field) : field.options, search, required: true, placeholder: field.placeholder, optionValueType: field.optionValueType ?? (field.type === "number" ? "number" : field.type === "boolean" ? "boolean" : void 0), fieldFormat: field.format }]
  } };
  return { ...common, kind, options: field.options, optionSource: field.optionSource, search };
}

// src/configStudio/lookupTables.ts
function referencedField(config, ref) {
  const node = config.nodes.find((node2) => node2.nodeId === ref.nodeId);
  const matches = node ? resolveEffectiveFields(config, node.path).filter((field) => field.fieldId === ref.fieldId) : [];
  return matches.length === 1 ? matches[0] : void 0;
}
function effectiveOptionTable(config, owner) {
  if (owner.optionsFieldRef) {
    if (!("nodes" in config)) return { valueType: owner.optionValueType ?? "string", rows: [] };
    const field = referencedField(config, owner.optionsFieldRef);
    return field ? { valueType: field.optionValueType ?? field.optionTable?.valueType ?? "string", rows: field.options ?? [] } : { valueType: owner.optionValueType ?? "string", rows: [] };
  }
  const table = owner.optionsTableId ? config.lookupTables?.find((table2) => table2.id === owner.optionsTableId) : void 0;
  if (owner.optionsTableId) return { valueType: table?.valueType ?? owner.optionValueType ?? "string", rows: table?.rows ?? [] };
  return owner.optionTable ?? { valueType: owner.optionValueType ?? "string", rows: owner.options ?? [] };
}
function effectiveOptions(config, owner) {
  const rows = effectiveOptionTable(config, owner).rows;
  return rows.map(({ value, label }) => ({ value, label }));
}
function effectiveOptionsOwner(config, owner) {
  if (!owner.optionsFieldRef && !owner.optionsTableId && !owner.optionTable) return owner;
  const table = effectiveOptionTable(config, owner);
  return { ...owner, options: effectiveOptions(config, owner), optionValueType: table.valueType };
}
function cardOptionsOwner(item) {
  return { ...item, options: item.valueOptions };
}
function resolveBoundCard(config, item) {
  const field = item.fieldBinding ? referencedField(config, item.fieldBinding) : void 0;
  const next = field ? { ...item, source: field.key, label: field.labels, options: { ...item.options, format: field.options?.length ? "enum" : field.format ?? "plain" } } : item;
  const owner = cardOptionsOwner(next);
  return owner.optionTable || owner.optionsTableId || owner.optionsFieldRef ? { ...next, valueOptions: effectiveOptions(config, owner) } : next;
}
function validateLookupTables(config, includeNodes = true) {
  const issues = [];
  const error = (path2, message, code = "lookup-table-invalid") => issues.push({ severity: "error", code, path: path2, message });
  if (config.contractRevision < 10 && (config.lookupTables?.length || config.nodes.some((n) => n.fields.some((f) => f.optionsTableId)) || config.workflows.some((w) => w.steps.some((s) => s.controls?.some((c) => c.optionsTableId || c.group?.itemFields.some((f) => f.optionsTableId)))))) error("lookupTables", "\u5BF9\u7167\u8868\u9700\u8981 r10 \u5951\u7EA6\u3002");
  const ids = /* @__PURE__ */ new Set();
  for (const table of config.lookupTables ?? []) {
    const path2 = `lookupTables/${table.id}`;
    if (!/^[a-z][a-z0-9-]{1,80}$/.test(table.id) || ids.has(table.id)) error(path2, "\u8868\u683C ID \u5FC5\u987B\u6709\u6548\u4E14\u552F\u4E00\u3002");
    ids.add(table.id);
    if (!(table.label.zh.trim() || config.contractRevision >= 11 && table.label.en.trim())) error(path2, "\u8868\u683C\u9700\u8981\u4E2D\u6587\u6216\u82F1\u6587\u540D\u79F0\u3002");
    if (!table.rows.length) error(path2, "\u8868\u683C\u81F3\u5C11\u9700\u8981\u4E00\u884C\u3002");
    const values2 = /* @__PURE__ */ new Set();
    const pointIds = /* @__PURE__ */ new Set();
    for (const [index, row2] of table.rows.entries()) {
      const at = `${path2}/rows/${index}`, normalized = table.valueType === "number" ? String(Number(row2.value)) : row2.value;
      if (!row2.value.trim() || values2.has(normalized) || table.valueType === "number" && !Number.isFinite(Number(row2.value)) || table.valueType === "boolean" && !["true", "false"].includes(row2.value)) error(at, "\u5B58\u50A8\u503C\u4E3A\u7A7A\u3001\u91CD\u590D\u6216\u7C7B\u578B\u4E0D\u7B26\u3002");
      values2.add(normalized);
      if (!(row2.label.zh.trim() || config.contractRevision >= 11 && row2.label.en.trim())) error(at, "\u5BF9\u7167\u884C\u9700\u8981\u4E2D\u6587\u6216\u82F1\u6587\u540D\u79F0\u3002");
      if (table.functionKind === "none" && row2.functionValue !== void 0) error(at, "\u65E0\u529F\u80FD\u503C\u8868\u683C\u4E0D\u80FD\u5305\u542B\u529F\u80FD\u503C\u3002");
      if (table.functionKind === "speed" && (typeof row2.functionValue !== "number" || !Number.isFinite(row2.functionValue) || row2.functionValue <= 0)) error(at, "\u51FA\u884C\u901F\u5EA6\u5FC5\u987B\u4E3A\u6B63\u6570\uFF0C\u5355\u4F4D\u4E3A\u65B9\u5757/\u79D2\u3002");
      if (table.functionKind === "teleportHub") {
        const hub = row2.functionValue;
        if (!hub || typeof hub === "number" || !("world" in hub) || !hub.world.trim() || !Number.isFinite(hub.range) || hub.range <= 0 || !hub.returnPoints.length) {
          error(at, "\u67A2\u7EBD\u9700\u8BBE\u7F6E\u4E16\u754C\u3001\u6B63\u6570\u8303\u56F4\u53CA\u81F3\u5C11\u4E00\u4E2A\u8FD4\u56DE\u70B9\u3002");
          continue;
        }
        for (const point of hub.returnPoints) {
          if (!point.id.trim() || pointIds.has(`${hub.world}/${point.id}`) || ![point.x, point.y, point.z].every(Number.isFinite) || !point.label.zh.trim()) error(at, "\u8FD4\u56DE\u70B9 ID/\u540D\u79F0/\u5750\u6807\u65E0\u6548\uFF0C\u6216\u540C\u4E16\u754C ID \u91CD\u590D\u3002");
          pointIds.add(`${hub.world}/${point.id}`);
        }
      }
    }
  }
  const inspect = (owner, path2) => {
    if (!owner.optionsTableId) return;
    const table = config.lookupTables?.find((row2) => row2.id === owner.optionsTableId);
    if (!table) error(path2, `\u5F15\u7528\u7684\u5BF9\u7167\u8868 ${owner.optionsTableId} \u4E0D\u5B58\u5728\u3002`, "lookup-table-reference-missing");
    if (table && table.valueType !== (owner.optionValueType ?? "string")) error(path2, "\u8868\u683C\u5B58\u50A8\u503C\u7C7B\u578B\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u8868\u683C\u786E\u8BA4\u7ED1\u5B9A\u7C7B\u578B\u3002", "lookup-table-type-changed");
    if (owner.options?.length) error(path2, "\u7ED1\u5B9A\u8868\u683C\u540E\u4E0D\u80FD\u540C\u65F6\u4FDD\u5B58\u72EC\u7ACB\u5BF9\u7167\u884C\uFF0C\u8BF7\u5148\u89E3\u9664\u7ED1\u5B9A\u3002");
  };
  if (includeNodes) config.nodes.forEach((node) => node.fields.forEach((field) => inspect(field, `nodes/${node.nodeId}/fields/${field.fieldId}`)));
  config.workflows.forEach((w) => w.steps.forEach((s) => s.controls?.forEach((c) => {
    inspect(c, `workflows/${w.id}/${c.id}`);
    c.group?.itemFields.forEach((f) => inspect(f, `workflows/${w.id}/${c.id}/${f.key}`));
  })));
  if (config.contractRevision >= 11) {
    const check = (owner, path2, expected, defaultValue) => {
      if ([Boolean(owner.optionsFieldRef), Boolean(owner.optionsTableId), Boolean(owner.optionTable)].filter(Boolean).length > 1) error(path2, "\u526F\u672C\u3001\u5B57\u6BB5\u5BF9\u7167\u548C\u516C\u5171\u8868\u53EA\u80FD\u9009\u62E9\u4E00\u79CD\u6765\u6E90\u3002");
      if ((owner.optionsTableId || owner.optionsFieldRef || owner.optionTable) && owner.options?.length) error(path2, "\u5BF9\u7167\u4E3B\u4F53\u6216\u7ED1\u5B9A\u4E0D\u80FD\u540C\u65F6\u4FDD\u5B58\u65E7\u5F0F\u72EC\u7ACB\u884C\u3002");
      const table = effectiveOptionTable(config, owner), binding = owner.optionsTableId || owner.optionsFieldRef;
      if (owner.optionsFieldRef && !referencedField(config, owner.optionsFieldRef)) error(path2, "\u7ED1\u5B9A\u5B57\u6BB5\u4E0D\u5B58\u5728\u6216\u5728\u8BE5\u5206\u7C7B\u4E2D\u4E0D\u518D\u6709\u6548\u3002", "lookup-field-reference-missing");
      if (binding && !table.rows.length) error(path2, "\u7ED1\u5B9A\u6765\u6E90\u4E3A\u7A7A\uFF0C\u5FC5\u987B\u624B\u52A8\u4FEE\u590D\u3002", "lookup-binding-empty");
      if (binding && owner.optionValueType && table.valueType !== owner.optionValueType) error(path2, "\u7ED1\u5B9A\u6765\u6E90\u7C7B\u578B\u5DF2\u6539\u53D8\uFF0C\u8BF7\u91CD\u65B0\u7ED1\u5B9A\u786E\u8BA4\u3002", "lookup-binding-type-changed");
      if (expected && table.rows.length && table.valueType !== expected) error(path2, "\u5BF9\u7167\u503C\u7C7B\u578B\u4E0E\u76EE\u6807\u5B57\u6BB5\u4FDD\u5B58\u7C7B\u578B\u4E0D\u517C\u5BB9\u3002");
      const values2 = /* @__PURE__ */ new Set();
      for (const row2 of table.rows) {
        const key2 = table.valueType === "number" ? String(Number(row2.value)) : row2.value;
        if (!row2.value.trim() || values2.has(key2) || table.valueType === "number" && !Number.isFinite(Number(row2.value)) || table.valueType === "boolean" && !["true", "false"].includes(row2.value) || !(row2.label.zh.trim() || row2.label.en.trim())) error(path2, "\u5BF9\u7167\u5305\u542B\u7A7A\u540D\u79F0\u3001\u91CD\u590D\u503C\u6216\u4E0D\u5408\u6CD5\u7684\u4FDD\u5B58\u503C\u3002");
        values2.add(key2);
      }
      if (defaultValue !== void 0 && table.rows.length && (!table.rows.some((row2) => row2.value === String(defaultValue)) || typeof defaultValue !== table.valueType)) error(path2, "\u9ED8\u8BA4\u503C\u4E0E\u5F53\u524D\u5BF9\u7167\u7684\u4FDD\u5B58\u503C\u6216\u7C7B\u578B\u4E0D\u517C\u5BB9\u3002");
    };
    if (includeNodes) config.nodes.forEach((node) => {
      node.fields.forEach((field) => check(field, `nodes/${node.nodeId}/fields/${field.fieldId}`, field.type === "enum" ? field.optionValueType ?? "string" : field.type === "number" ? "number" : field.type === "boolean" ? "boolean" : field.type === "string" ? "string" : void 0));
      if (node.card?.mode === "fields") node.card.items.forEach((item) => {
        const path2 = `nodes/${node.nodeId}/card/${item.id}`;
        check(cardOptionsOwner(item), path2);
        if (item.fieldBinding) {
          const field = referencedField(config, item.fieldBinding);
          if (!field) error(path2, "\u4FE1\u606F\u5361\u5B57\u6BB5\u7ED1\u5B9A\u6765\u6E90\u4E0D\u5B58\u5728\u3002", "card-field-binding-missing");
          else if (!(field.labels.zh.trim() || field.labels.en.trim())) error(path2, "\u7ED1\u5B9A\u5B57\u6BB5\u6CA1\u6709\u6709\u6548\u663E\u793A\u540D\u79F0\u3002");
        }
      });
    });
    config.workflows.forEach((w) => w.steps.forEach((s) => s.controls?.forEach((c) => {
      check(c, `workflows/${w.id}/${c.id}`, void 0, c.defaultValue);
      c.group?.itemFields.forEach((f) => check(f, `workflows/${w.id}/${c.id}/${f.key}`, void 0, f.defaultValue));
    })));
  }
  return issues;
}

// src/configStudio/fieldReuse.ts
var FIELD_IMPORT_PROPERTIES = ["label", "kind", "options", "optionValueType", "placeholder", "defaultValue", "required", "requiredWhen", "search", "group", "rows", "valueNormalization", "fieldFormat"];
function fieldSourceSnapshot(field) {
  const { key: key2, type, cardinality, labels: labels2, options, optionValueType, format, defaultValue, required, requiredWhen, input, placeholder, reference } = field;
  return structuredClone({ key: key2, type, cardinality, labels: labels2, options, optionValueType, format, defaultValue, required, requiredWhen, input, placeholder, reference });
}
function resolveSourceField(config, source) {
  const node = config.nodes.find((item) => item.nodeId === source.nodeId);
  if (!node) return void 0;
  const fields = resolveEffectiveFields(config, node.path);
  return fields.find((field) => field.fieldId === source.fieldId) ?? fields.find((field) => field.key === source.snapshot.key && field.overrideOf === source.snapshot.key);
}
function requiredConditions(field, workflow) {
  return (field.requiredWhen ?? []).flatMap((condition) => {
    if (condition.kind === "always") return [];
    if (!("field" in condition)) throw new Error(`\u5B57\u6BB5 ${field.key} \u7684\u5FC5\u586B\u6761\u4EF6\u4E0D\u80FD\u8F6C\u6362\u4E3A\u8F93\u5165\u69FD\u4F4D\u3002`);
    const bindings = workflow.outputs.flatMap((output) => output.assignments).filter((item) => item.target === condition.field && /^[A-Z][A-Z0-9_]*$/.test(item.expression));
    const tokens = [...new Set(bindings.map((item) => item.expression))];
    if (tokens.length !== 1) throw new Error(`\u8BF7\u5148\u5C06\u6761\u4EF6\u5B57\u6BB5 ${condition.field} \u660E\u786E\u7ED1\u5B9A\u5230\u4E00\u4E2A\u8F93\u5165\u69FD\u4F4D\u3002`);
    const source = workflow.steps.flatMap((step) => step.controls ?? []).find((control) => control.slot === tokens[0]);
    const typed = (value) => source?.kind === "number" || source?.optionValueType === "number" ? Number(value) : source?.kind === "toggle" || source?.optionValueType === "boolean" ? value === "true" : value;
    if (condition.kind === "fieldEquals") return [{ token: tokens[0], operator: "equals", value: typed(condition.value) }];
    if (condition.kind === "fieldPresent") return [{ token: tokens[0], operator: condition.present ? "present" : "empty" }];
    return [{ token: tokens[0], operator: "in", values: condition.values.map(typed) }];
  });
}
function importFieldIntoControl(config, workflow, control, nodeId, field) {
  const imported = workflowControlFromField(field, control.slot ?? control.id, control.id, config);
  return {
    ...control,
    ...imported,
    columns: control.columns,
    required: Boolean(field.required || field.requiredWhen?.length),
    requiredWhen: field.required || field.requiredWhen?.some((condition) => condition.kind === "always") ? [] : field.requiredWhen?.length ? [{ token: "", operator: "present", any: requiredConditions(field, workflow) }] : [],
    fieldFormat: field.format,
    optionValueType: imported.optionValueType,
    fieldSource: { nodeId, fieldId: field.fieldId, snapshot: fieldSourceSnapshot(field), overrides: [] }
  };
}
function resolveImportedControl(config, workflow, control) {
  if (config.contractRevision >= 9 || !control.fieldSource) return control;
  const field = resolveSourceField(config, control.fieldSource);
  if (!field) return control;
  let generated;
  try {
    generated = importFieldIntoControl(config, workflow, control, control.fieldSource.nodeId, field);
  } catch {
    return control;
  }
  const next = { ...control };
  for (const key2 of FIELD_IMPORT_PROPERTIES) if (!control.fieldSource.overrides.includes(key2)) {
    next[key2] = generated[key2];
  }
  return next;
}
function resolveImportedGroupField(config, workflow, field) {
  if (!field.fieldSource) return field;
  const control = resolveImportedControl(config, workflow, { ...field, id: field.key, slot: "GROUP_VALUE", columns: 1 });
  const { id: _id, slot: _slot, columns: _columns, ...resolved2 } = control;
  return { ...field, ...resolved2, key: field.key };
}
function resolveWorkflowFields(config, workflow) {
  return { ...workflow, steps: workflow.steps.map((step) => ({ ...step, controls: step.controls?.map((raw) => {
    const control = effectiveOptionsOwner(config, resolveImportedControl(config, workflow, raw));
    return control.group ? { ...control, group: { ...control.group, itemFields: control.group.itemFields.map((field) => effectiveOptionsOwner(config, resolveImportedGroupField(config, workflow, field))) } } : control;
  }) })) };
}
function fieldImportErrors(config, workflow, control) {
  const source = control.fieldSource;
  if (!source) return [];
  const field = resolveSourceField(config, source);
  if (!field) return [`\u6765\u6E90\u5206\u7C7B/\u5B57\u6BB5 ${source.nodeId}/${source.snapshot.key} \u5DF2\u4E0D\u5B58\u5728\u6216\u4E0D\u518D\u6709\u6548\u3002`];
  const errors = [];
  if (field.type === "enum" && (field.optionValueType ?? "string") !== (source.snapshot.optionValueType ?? "string")) errors.push(`\u6765\u6E90\u5B57\u6BB5 ${field.key} \u7684\u4FDD\u5B58\u503C\u7C7B\u578B\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u5BFC\u5165\u3002`);
  if (field.type !== source.snapshot.type || field.cardinality !== source.snapshot.cardinality) errors.push(`\u6765\u6E90\u5B57\u6BB5 ${field.key} \u7684\u7C7B\u578B\u6216\u503C\u6570\u91CF\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u5BFC\u5165\u540E\u786E\u8BA4\u7ED1\u5B9A\u3002`);
  if (source.overrides.some((key2) => !FIELD_IMPORT_PROPERTIES.includes(key2))) errors.push("\u5B58\u5728\u672A\u77E5\u5B57\u6BB5\u8986\u5199\u9879\u3002");
  if (field.scenes?.workflow === false) errors.push(`\u6765\u6E90\u5B57\u6BB5 ${field.key} \u5DF2\u5173\u95ED\u5DE5\u4F5C\u6D41\u4F7F\u7528\u3002`);
  try {
    requiredConditions(field, workflow);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "\u5FC5\u586B\u4F9D\u8D56\u65E0\u6CD5\u8F6C\u6362\u3002");
  }
  return errors;
}
function storedOptionValue(value, kind) {
  if (value === "" || value == null) return value;
  if (kind === "number") return Number(value);
  if (kind === "boolean") return value === true || value === "true" ? true : value === false || value === "false" ? false : value;
  if (kind === "string") return typeof value === "object" ? value : String(value);
  return value;
}

// src/configStudio/nodeFieldSettings.ts
var cache2 = /* @__PURE__ */ new WeakMap();
function resolveNodeFieldSettings(config, path2) {
  const key2 = classificationPathKey(path2), cached = cache2.get(config)?.get(key2);
  if (cached) return cached;
  const value = {}, owners = {}, fixed = /* @__PURE__ */ new Set();
  let propagate = true;
  for (const [index, node] of resolveCategoryNodes(config, path2).entries()) {
    if (index > 0) for (const module of ["structure", "search"]) {
      if (propagate && value[module] && (module === "structure" || value.search?.inheritance === "sealed")) fixed.add(module);
      else if (!propagate && !fixed.has(module)) {
        delete value[module];
        delete owners[module];
      }
    }
    for (const module of ["structure", "search"]) if (!fixed.has(module) && node.fieldSettings?.[module]) {
      Object.assign(value, { [module]: node.fieldSettings[module] });
      owners[module] = node.nodeId;
    }
    propagate = inheritanceControls(node).fields;
  }
  const result = { value, owners };
  if (Object.isFrozen(config)) {
    Object.freeze(value);
    Object.freeze(owners);
    Object.freeze(result);
    let entries = cache2.get(config);
    if (!entries) {
      entries = /* @__PURE__ */ new Map();
      cache2.set(config, entries);
    }
    entries.set(key2, result);
  }
  return result;
}
function incomingNodeFieldSettings(config, node) {
  const effective = resolveNodeFieldSettings(config, node.path);
  return Object.fromEntries(Object.entries(effective.value).filter(([key2]) => effective.owners[key2] !== node.nodeId));
}
function validateNodeFieldSettings(config, resolveFields) {
  const issues = [];
  const error = (path2, message) => issues.push({ severity: "error", code: "field-settings-invalid", path: path2, message });
  if (config.contractRevision < 10) {
    if (config.nodes.some((node) => node.fieldSettings)) error("nodes", "\u901A\u7528\u5305\u542B\u5173\u7CFB\u4E0E\u641C\u7D22\u63A7\u5236\u9700\u8981 r10\u3002");
    return issues;
  }
  if (config.contextBindings?.length) error("contextBindings", "r10 \u4EE5\u5206\u7C7B\u81EA\u8EAB\u89D2\u8272\u5B9A\u4E49\u5305\u542B\u5173\u7CFB\uFF0C\u4E0D\u80FD\u4FDD\u7559\u65E7\u7684\u5206\u7C7B\u5BF9\u7ED1\u5B9A\u3002");
  for (const node of config.nodes) {
    const path2 = `nodes/${node.nodeId}/fieldSettings`, effective = resolveNodeFieldSettings(config, node.path), incoming = incomingNodeFieldSettings(config, node);
    for (const module of ["structure", "search"]) if (incoming[module] && node.fieldSettings?.[module] && (module === "structure" || incoming.search?.inheritance === "sealed")) error(`${path2}/${module}`, "\u8BE5\u6A21\u5757\u7531\u7956\u5148\u5B57\u6BB5\u8BBE\u8BA1\u56FA\u5B9A\u7EE7\u627F\uFF0C\u4E0D\u80FD\u7528\u672C\u5730\u526F\u672C\u8986\u76D6\u3002");
    const fields = resolveFields(config, node.path), byKey = new Map(fields.map((field) => [field.key, field]));
    const has = (key2) => Boolean(key2 && (["ID", "Name", "World", "Class", "Kind", "SKind", "SKind2"].includes(key2) || byKey.has(key2)));
    const idField = (key2, reverse = false) => {
      if (!has(key2)) return false;
      if (key2 === "ID") return true;
      const field = byKey.get(key2);
      return field && (["string", "reference"].includes(field.type) || field.type === "enum" && (field.optionValueType ?? "string") === "string" || reverse && field.type === "json") && (reverse || field.cardinality === "single");
    };
    const role = effective.value.structure;
    if (role?.enabled) {
      if (role.role === "main" && role.memberField && !idField(role.memberField, true)) error(`${path2}/structure`, "\u4E3B\u7ED3\u6784\u6307\u5411\u9644\u5C5E\u5B57\u6BB5\u5FC5\u987B\u662F\u5DF2\u5B9A\u4E49\u7684 ID/ID \u5217\u8868\u5B57\u6BB5\u3002");
      if (role.role === "member") {
        if (!idField(role.hostField)) error(`${path2}/structure`, "\u9644\u5C5E\u7ED3\u6784\u5FC5\u987B\u9009\u62E9\u5355\u503C\u7684\u4E3B\u7ED3\u6784 ID \u5B57\u6BB5\u3002");
        const selector = role.selectorField ? byKey.get(role.selectorField) : void 0;
        if (!selector || selector.cardinality !== "single" || selector.type === "json") error(`${path2}/structure`, "\u9644\u5C5E\u7ED3\u6784\u5FC5\u987B\u9009\u62E9\u5355\u503C\u6807\u91CF\u5C42\u7EA7\u5B57\u6BB5\u3002");
      }
      if (role.role === "main" && (role.hostField || role.selectorField) || role.role === "member" && role.memberField) error(`${path2}/structure`, "\u5305\u542B\u5173\u7CFB\u914D\u7F6E\u542B\u6709\u4E0E\u81EA\u8EAB\u8EAB\u4EFD\u4E0D\u7B26\u7684\u5B57\u6BB5\u3002");
    }
    const search = effective.value.search;
    if (!search) continue;
    if (!search.queryFields.includes("ID") || !search.queryFields.includes("Name") || new Set(search.queryFields).size !== search.queryFields.length || search.queryFields.some((key2) => !has(key2))) error(`${path2}/search`, "\u641C\u7D22\u6765\u6E90\u5FC5\u987B\u5305\u542B Name\u3001ID\uFF0C\u4E14\u4E0D\u80FD\u91CD\u590D\u6216\u5F15\u7528\u672A\u5B9A\u4E49\u5B57\u6BB5\u3002");
    if (search.priority !== void 0 && (!Number.isFinite(search.priority) || search.priority < 0)) error(`${path2}/search`, "\u641C\u7D22\u6392\u5E8F\u4F18\u5148\u7EA7\u5FC5\u987B\u662F\u975E\u8D1F\u6570\u3002");
    const subtitle = search.subtitle;
    if (subtitle.mode !== "classification") {
      if (!has(subtitle.field)) error(`${path2}/search/subtitle`, "\u526F\u6807\u9898\u5B57\u6BB5\u672A\u5B9A\u4E49\u3002");
      if (subtitle.valueMode === "reference" && (!idField(subtitle.field) || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(subtitle.referenceDisplayField ?? "Name") || /(?:^|\.)(?:__proto__|constructor|prototype)(?:\.|$)/.test(subtitle.referenceDisplayField ?? ""))) error(`${path2}/search/subtitle`, "\u5173\u8054\u663E\u793A\u9700\u8981\u5355\u503C ID \u5B57\u6BB5\u548C\u5B89\u5168\u7684\u76EE\u6807\u5B57\u6BB5\u8DEF\u5F84\u3002");
      if (subtitle.valueMode === "meaning") {
        const rows = subtitle.valueOptions ?? [], values2 = new Set(rows.map((row2) => row2.value)), field = byKey.get(subtitle.field);
        if (!rows.length || values2.size !== rows.length || rows.some((row2) => !row2.value.trim() || !row2.label.zh.trim() || !row2.label.en.trim()) || (field?.options ?? []).some((option) => !values2.has(option.value))) error(`${path2}/search/subtitle`, "\u610F\u4E49\u663E\u793A\u9700\u975E\u7A7A\u3001\u552F\u4E00\u3001\u8986\u76D6\u5B57\u6BB5\u53EF\u9009\u503C\u4E14\u540C\u65F6\u5177\u6709 zh/en \u7684\u672C\u5730\u5BF9\u7167\u3002");
        if (field && (field.cardinality !== "single" || field.type === "json")) error(`${path2}/search/subtitle`, "\u610F\u4E49\u663E\u793A\u9700\u8981\u5355\u503C\u6807\u91CF\u5B57\u6BB5\u3002");
      }
    }
    if (search.extension.mode === "nameColorCapsule" && (!has(search.extension.nameField) || !has(search.extension.colorField))) error(`${path2}/search/extension`, "\u540D\u79F0\u4E0E\u989C\u8272\u80F6\u56CA\u5FC5\u987B\u9009\u62E9\u6709\u6548\u7684\u540D\u79F0\u5B57\u6BB5\u548C\u989C\u8272\u5B57\u6BB5\u3002");
    if (search.extension.mode === "lineChips" && !search.extension.lineChipSource) error(`${path2}/search/extension`, "\u5173\u8054\u7EBF\u8DEF\u80F6\u56CA\u5FC5\u987B\u9009\u62E9\u5173\u8054\u5C42\u7EA7\u3002");
  }
  return issues;
}

// src/configStudio/structureCommit.ts
var path = (record) => ({ class: String(record.Class ?? ""), kind: record.Kind, skind: record.SKind ?? record.Skind, skind2: record.SKind2 ?? record.Skind2 });
function assertStructureTargets(config, created, existing) {
  if (config.contractRevision < 10) return;
  const records = [...existing, ...created];
  const normalizeRuleSourceWorldId2 = (value) => config.application?.worlds.find((world) => [world.id, String(world.numericCode), world.prefix, world.label.zh, world.label.en].includes(value))?.id ?? value;
  for (const record of created) {
    const role = resolveNodeFieldSettings(config, path(record)).value.structure;
    if (!role?.enabled || role.role !== "member") continue;
    const id = role.hostField ? readRecordPath(record, role.hostField) : void 0, world = normalizeRuleSourceWorldId2(String(record.World ?? ""));
    const candidates = records.filter((row2) => normalizeRuleSourceWorldId2(String(row2.World ?? "")) === world && row2.ID === id);
    const targetRole = candidates.length === 1 ? resolveNodeFieldSettings(config, path(candidates[0])).value.structure : void 0;
    if (candidates.length !== 1 || !targetRole?.enabled || targetRole.role !== "main") throw Error(`\u9644\u5C5E ${record.ID} \u7684\u4E3B\u7ED3\u6784 ${String(id)} \u4E0D\u5B58\u5728\u3001\u4E0D\u552F\u4E00\u6216\u672A\u542F\u7528\u4E3B\u7ED3\u6784\u8EAB\u4EFD\u3002`);
  }
}

// src/configStudio/workflowAnnotations.ts
var plain = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
function annotationEqual(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) return left.length === right.length && left.every((value, index) => annotationEqual(value, right[index]));
  if (plain(left) && plain(right)) return Object.keys(left).length === Object.keys(right).length && Object.keys(left).every((key2) => Object.prototype.hasOwnProperty.call(right, key2) && annotationEqual(left[key2], right[key2]));
  return false;
}
function mergeAnnotations(target, incoming, prefix = "") {
  for (const [key2, value] of Object.entries(incoming)) {
    const path2 = prefix ? `${prefix}.${key2}` : key2;
    if (["__proto__", "prototype", "constructor"].includes(key2)) throw new Error(`\u65E0\u6548\u6807\u7B7E/\u6269\u5C55\u8DEF\u5F84\uFF1A${path2}`);
    validateAnnotationValue(value);
    if (!Object.prototype.hasOwnProperty.call(target, key2)) {
      target[key2] = structuredClone(value);
      continue;
    }
    if (plain(target[key2]) && plain(value)) {
      mergeAnnotations(target[key2], value, path2);
      continue;
    }
    if (!annotationEqual(target[key2], value)) throw new Error(`\u6807\u7B7E/\u6269\u5C55 ${path2} \u5B58\u5728\u4E0D\u540C\u503C\uFF1A\u8BF7\u7F16\u8F91\u5DF2\u6709\u8F93\u5165\u6216\u5220\u9664\u91CD\u590D\u884C\u3002`);
  }
}
function rowValue(row2) {
  if (row2.type === "null") return null;
  if (row2.type === "bool") {
    if (![true, false, "true", "false"].includes(row2.value)) throw new Error("\u5E03\u5C14\u503C\u5FC5\u987B\u9009\u62E9\u662F\u6216\u5426\u3002");
    return row2.value === true || row2.value === "true";
  }
  if (row2.type === "number") {
    if (row2.value == null || String(row2.value).trim() === "" || !Number.isFinite(Number(row2.value))) throw new Error("\u6570\u503C\u5FC5\u987B\u662F\u6709\u9650\u6570\u5B57\u3002");
    return Number(row2.value);
  }
  if (row2.type === "json") return typeof row2.value === "string" ? JSON.parse(row2.value) : structuredClone(row2.value);
  return String(row2.value ?? "");
}
function assembleAnnotations(value) {
  const result = { tags: {}, extensions: {} };
  for (const namespace of ["tags", "extensions"]) {
    const text = value?.advancedText?.[namespace];
    const advanced = text?.trim() ? JSON.parse(text) : value?.advanced?.[namespace];
    if (advanced !== void 0) {
      if (!plain(advanced)) throw new Error(`${namespace} \u9AD8\u7EA7\u6570\u636E\u5FC5\u987B\u4E3A\u5BF9\u8C61\u3002`);
      if (namespace === "extensions" && Object.values(advanced).some((group) => !plain(group))) throw new Error("\u6269\u5C55\u9AD8\u7EA7\u5BF9\u8C61\u7684\u6BCF\u4E2A\u7EC4\u5FC5\u987B\u662F\u5B57\u6BB5\u5BF9\u8C61\u3002");
      mergeAnnotations(result[namespace], advanced, namespace);
    }
    for (const [index, row2] of (value?.[namespace] ?? []).entries()) {
      const key2 = row2.key.trim(), group = row2.group?.trim() ?? "";
      if (row2.type !== "null" && (row2.value == null || String(row2.value).trim() === "")) continue;
      if (!key2 && !group && row2.type === "text" && !row2.value) continue;
      if (!key2 || namespace === "extensions" && !group) throw new Error(`${namespace} \u7B2C ${index + 1} \u884C\u7F3A\u5C11${!key2 ? "\u5B57\u6BB5\u540D" : "\u7EC4\u540D"}\u3002`);
      try {
        mergeAnnotations(result[namespace], namespace === "tags" ? { [key2]: rowValue(row2) } : { [group]: { [key2]: rowValue(row2) } }, namespace);
      } catch (error) {
        throw new Error(`${namespace} \u7B2C ${index + 1} \u884C\uFF1A${error instanceof Error ? error.message : "\u503C\u65E0\u6548"}`);
      }
    }
  }
  return result;
}
function annotationsForOutput(workflow, slots, outputId) {
  const result = assembleAnnotations(void 0);
  for (const control of workflow.steps.flatMap((step) => step.controls ?? []).filter((control2) => control2.kind === "tagsExtensions")) {
    const stored = slots[control.id];
    const next = assembleAnnotations(stored?.[outputId]);
    mergeAnnotations(result.tags, next.tags, "tags");
    mergeAnnotations(result.extensions, next.extensions, "extensions");
  }
  return result;
}
function annotationPaths(value, prefix) {
  return Object.entries(value).flatMap(([key2, value2]) => {
    const path2 = `${prefix}.${key2}`;
    return [path2, ...plain(value2) ? annotationPaths(value2, path2) : []];
  });
}
function validateAnnotationValue(value, depth = 0) {
  if (depth > 64) throw new Error("\u6807\u7B7E/\u6269\u5C55\u6570\u636E\u5D4C\u5957\u8FC7\u6DF1\u3002");
  if (typeof value === "number" && !Number.isFinite(value)) throw new Error("\u6807\u7B7E/\u6269\u5C55\u5FC5\u987B\u4F7F\u7528\u6709\u9650\u6570\u503C\u3002");
  if (Array.isArray(value)) for (const item of value) validateAnnotationValue(item, depth + 1);
  else if (plain(value)) for (const [key2, item] of Object.entries(value)) {
    if (["__proto__", "prototype", "constructor"].includes(key2)) throw new Error(`\u5371\u9669\u6807\u7B7E/\u6269\u5C55\u952E\uFF1A${key2}`);
    validateAnnotationValue(item, depth + 1);
  }
}

// src/configStudio/workflowValues.ts
function leafValue(field, value) {
  if (value == null || typeof value === "object" || (field.kind === "featureSearch" || field.kind === "coarseSearch") && typeof value !== "string") return value;
  if (field.kind === "select") return storedOptionValue(value, field.optionValueType);
  if (field.kind === "json" && typeof value === "string" && value.trim()) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  if (field.valueNormalization === "abbr") return String(value).trim().replace(/\s+/g, "").replace(/[^A-Za-z0-9_-]/g, "");
  if (field.valueNormalization === "trim") return String(value).replace(/\r\n?/g, "\n").trim();
  if ((field.kind === "number" || field.valueNormalization === "number") && String(value).trim() && Number.isFinite(Number(value))) return Number(value);
  return value;
}
function coerceWorkflowValues(workflow, raw) {
  const slots = { ...raw };
  for (const control of workflow.steps.flatMap((step) => step.controls ?? [])) {
    if (!control.slot || slots[control.slot] == null) continue;
    const value = slots[control.slot];
    if (control.kind === "select") {
      slots[control.slot] = storedOptionValue(value, control.optionValueType);
      continue;
    }
    if (control.kind === "group" && Array.isArray(value) && control.group) {
      slots[control.slot] = value.map((row2) => control.group.storage === "scalar" ? control.group.itemFields[0] ? leafValue(control.group.itemFields[0], row2) : row2 : row2 && typeof row2 === "object" && !Array.isArray(row2) ? Object.fromEntries(Object.entries(row2).map(([key2, value2]) => [key2, control.group.itemFields.find((field) => field.key === key2) ? leafValue(control.group.itemFields.find((field) => field.key === key2), value2) : value2])) : row2);
      continue;
    }
    if (control.kind === "json" && typeof value === "string" && value.trim()) {
      try {
        slots[control.slot] = JSON.parse(value);
      } catch {
      }
      continue;
    }
    if (control.valueNormalization === "abbr") slots[control.slot] = String(value).trim().replace(/\s+/g, "").replace(/[^A-Za-z0-9_-]/g, "");
    else if (control.valueNormalization === "trim") slots[control.slot] = String(value).replace(/\r\n?/g, "\n").trim();
    else if ((control.valueNormalization === "number" || control.kind === "number") && String(value).trim()) {
      const number2 = Number(value);
      if (Number.isFinite(number2)) slots[control.slot] = number2;
    }
  }
  return slots;
}

// project-config/packages/openriamap-ria/environment/ruleButtons.json
var ruleButtons_default = {
  schemaVersion: "cairnmap.rule-buttons.v1",
  projectId: "openriamap-ria",
  storageKey: "cairnmap_rule_button_state_v1",
  legacyStorageKeys: [
    "ria_rule_button_state_v1"
  ],
  policy: {
    maxActive: 0
  },
  defaults: {
    fallback: [
      "railway_new",
      "road",
      "natural_geo",
      "settlement",
      "planning",
      "teleport_point",
      "trade_point",
      "building"
    ],
    byWorld: {}
  },
  items: [
    {
      id: "railway_new",
      label: "\u94C1\u8DEF-\u65B0",
      tone: "blue",
      iconKey: "train",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "RLE",
          "STA",
          "STB",
          "PLF",
          "PFB",
          "SBP",
          "STF"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "road",
      label: "\u9053\u8DEF",
      tone: "orange",
      iconKey: "route",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "ROD"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "natural_geo",
      label: "\u81EA\u7136\u5730\u7406",
      tone: "green",
      iconKey: "leaf",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "ISG",
          "ISL"
        ],
        kind: [
          "NGF"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "settlement",
      label: "\u805A\u843D",
      tone: "cyan",
      iconKey: "home",
      defaultEnabled: true,
      criteria: {
        kind: [
          "ADM"
        ],
        skind: [
          "DBZ",
          "DBP"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "planning",
      label: "\u89C4\u5212",
      tone: "slate",
      iconKey: "map",
      defaultEnabled: true,
      criteria: {
        kind: [
          "ADM"
        ],
        skind: [
          "PLP"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "teleport_point",
      label: "\u4F20\u9001\u70B9",
      tone: "cyan",
      iconKey: "zap",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "TPP",
          "WRP"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "trade_point",
      label: "\u4EA4\u6613\u70B9",
      tone: "green",
      iconKey: "shoppingCart",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "TRP"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    },
    {
      id: "building",
      label: "\u5EFA\u7B51",
      tone: "purple",
      iconKey: "building2",
      defaultEnabled: true,
      criteria: {
        classCode: [
          "BUD",
          "FLR",
          "STB",
          "STF"
        ]
      },
      behavior: {
        exclusiveWith: [],
        exclusiveGroup: null,
        linkedButtons: [],
        disableWhenEnabled: [],
        enableWhenEnabled: [],
        persistState: true
      }
    }
  ]
};

// .cairn/formal-data-source-runtime.json
var formal_data_source_runtime_default = {
  schemaVersion: "openriamap.formal-data-source-runtime.v1",
  projectId: "openriamap-ria",
  selection: {
    schemaVersion: "cairnmap.data-source-selection.v1",
    storageKey: "openriamap_formal_data_source_v1",
    sources: [
      {
        id: "formal-cos",
        label: "\u6B63\u5F0F\u6570\u636E\u6E90\uFF08COS\uFF09",
        readerKind: "formal-release-v2",
        enabled: true,
        selectable: true
      },
      {
        id: "formal-github",
        label: "\u6B63\u5F0F\u6570\u636E\u6E90\uFF08GitHub \u955C\u50CF\uFF09",
        readerKind: "formal-release-v2",
        enabled: true,
        selectable: true
      }
    ],
    policy: {
      defaultSourceId: "formal-cos",
      selectionMode: "user-select",
      requireExplicitApply: true,
      automaticFallback: false,
      clearCacheOnApply: "source-dependent",
      retryOnFailure: true
    }
  },
  githubRawTransport: {
    sourceIds: [
      "formal-github"
    ],
    repository: {
      owner: "OpenRIAMap",
      repo: "OpenRIAMap-Cairn-Data",
      branch: "main"
    }
  },
  bindings: [
    {
      id: "formal-cos",
      readerKind: "formal-release-v2",
      readerSchemaVersion: "openriamap.formal-release-reader.v2",
      rootUrl: "https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com",
      mediaRootUrl: "https://openriamap-cairn-media-1433163128.cos.ap-shanghai.myqcloud.com",
      transport: "direct"
    },
    {
      id: "formal-github",
      readerKind: "formal-release-v2",
      readerSchemaVersion: "openriamap.formal-release-reader.v2",
      rootUrl: "https://raw.githubusercontent.com/OpenRIAMap/OpenRIAMap-Cairn-Data/main",
      mediaRootUrl: "https://openriamap-cairn-media-1433163128.cos.ap-shanghai.myqcloud.com",
      transport: "github-raw-compatible"
    }
  ]
};

// project-config/packages/openriamap-ria/environment/sourceLinkModes.json
var sourceLinkModes_default = {
  schemaVersion: "cairnmap.source-link-modes.v1",
  projectId: "openriamap-ria",
  storageKey: "cairnmap_source_link_mode_v1",
  legacyStorageKeys: [
    "ria_source_link_mode_v1"
  ],
  items: [
    {
      id: "cdn639",
      label: "CDN\u52A0\u901F(639)",
      rawCompatibleBaseUrl: "https://data.ozk639.top",
      default: true
    },
    {
      id: "github_raw",
      label: "Github Raw",
      rawCompatibleBaseUrl: "https://raw.githubusercontent.com"
    }
  ]
};

// project-config/packages/openriamap-ria/environment/worlds.json
var worlds_default = {
  schemaVersion: "cairnmap.worlds.v1",
  projectId: "openriamap-ria",
  items: [
    {
      id: "zth",
      numericCode: 0,
      label: "\u4E3B\u4E16\u754C",
      enabled: true,
      default: true
    },
    {
      id: "naraku",
      numericCode: 1,
      label: "\u5948\u843D",
      enabled: true
    },
    {
      id: "houtu",
      numericCode: 2,
      label: "\u540E\u571F",
      enabled: true
    },
    {
      id: "eden",
      numericCode: 3,
      label: "\u4F0A\u7538",
      enabled: true
    },
    {
      id: "laputa",
      numericCode: 4,
      label: "\u62C9\u666E\u8FBE",
      enabled: true
    },
    {
      id: "yunduan",
      numericCode: 5,
      label: "\u4E91\u7AEF",
      enabled: true
    }
  ]
};

// src/core/project/applicationDefaults.ts
var centers = { zth: { x: -643, y: 35, z: -1562 }, laputa: { x: 272, y: 64, z: 104 } };
var labels = { zth: "\u96F6\u6D32", eden: "\u4F0A\u7538", naraku: "\u5948\u843D\u6D32", houtu: "\u540E\u571F\u6D32", laputa: "\u62C9\u666E\u5854", yunduan: "\u4E91\u7AEF" };
var prefixes = { zth: "Z", eden: "E", naraku: "N", houtu: "H", laputa: "L", yunduan: "Y" };
function defaultApplicationSettings() {
  return {
    schemaVersion: "cairnmap.application.v1",
    worlds: [...worlds_default.items].sort((a, b) => ["zth", "eden", "naraku", "houtu", "laputa", "yunduan"].indexOf(a.id) - ["zth", "eden", "naraku", "houtu", "laputa", "yunduan"].indexOf(b.id)).map((world) => ({
      id: world.id,
      prefix: prefixes[world.id],
      numericCode: world.numericCode,
      label: { zh: labels[world.id], en: "" },
      enabled: world.id !== "yunduan",
      default: world.id === "zth",
      center: centers[world.id] ?? { x: 0, y: 64, z: 0 },
      mapLink: `https://satellite.ria.red/map/_${world.id}/`,
      dataSourceId: formal_data_source_runtime_default.selection.policy.defaultSourceId,
      projection: { id: "dynmap-flat", worldToMap: [4, 0, 0, 0, 0, -4, 0, 1, 0], mapToWorld: [0.25, 0, 0, 0, 0, 1, 0, -0.25, 0], mapzoomin: 2, mapzoomout: 3, tileSize: 128, tilescale: 0 },
      tiles: { filteredBaseUrl: `/api/dynmap/_${world.id}/tiles/world/`, baseUrl: `https://satellite.ria.red/map/_${world.id}/tiles/world/`, prefix: "flat", imageFormat: "jpg", extraZoomLevels: 2, minNativeZoom: -2, maxNativeZoom: 3, attribution: '&copy; <a href="https://satellite.ria.red">RIA Satellite</a>', maxRetries: 3, retryDelay: 1e3 }
    })),
    buttons: { storageKey: ruleButtons_default.storageKey, legacyStorageKeys: ruleButtons_default.legacyStorageKeys ?? [], maxActive: ruleButtons_default.policy.maxActive, fallback: ruleButtons_default.defaults.fallback, byWorld: ruleButtons_default.defaults.byWorld, items: ruleButtons_default.items.map(({ label, ...item }) => ({ ...item, tone: item.tone, names: { zh: label, en: "" }, size: 36, group: "default" })) },
    sources: {
      storageKey: formal_data_source_runtime_default.selection.storageKey,
      defaultSourceId: formal_data_source_runtime_default.selection.policy.defaultSourceId,
      selectionMode: "user-select",
      retryOnFailure: true,
      items: formal_data_source_runtime_default.bindings.filter((binding) => binding.readerKind === "formal-release-v2").map((binding) => ({ ...binding, readerKind: "formal-release-v2", readerSchemaVersion: "openriamap.formal-release-reader.v2", mediaRootUrl: binding.mediaRootUrl ?? "", transport: binding.transport, label: { zh: formal_data_source_runtime_default.selection.sources.find((item) => item.id === binding.id).label, en: "" }, enabled: true, selectable: true })),
      github: { sourceIds: formal_data_source_runtime_default.githubRawTransport.sourceIds, ...formal_data_source_runtime_default.githubRawTransport.repository },
      linkModes: { storageKey: sourceLinkModes_default.storageKey, legacyStorageKeys: sourceLinkModes_default.legacyStorageKeys ?? [], items: sourceLinkModes_default.items.map((item) => ({ id: item.id, label: { zh: item.label, en: "" }, baseUrl: item.rawCompatibleBaseUrl, default: Boolean(item.default) })) }
    },
    modules: { items: ["mapping", "measurement", "navigation", "search", "review", "players", "settings", "publicReleases"].map((id) => ({ id, enabled: true, load: id === "mapping" || id === "measurement" || id === "review" ? "lazy" : "eager", exclusiveWith: id === "mapping" ? ["measurement", "review"] : id === "measurement" ? ["mapping", "review"] : id === "review" ? ["mapping", "measurement"] : [] })), players: { endpoint: "/api/dynmap/_{world}/up/world/world/{timestamp}", directEndpoint: "https://satellite.ria.red/map/_{world}/up/world/world/{timestamp}", mode: "proxy", pollIntervalMs: 5e3, requestTimeoutMs: 1e4 } },
    review: { enabled: true, provider: "github-cookie", protocol: "openriamap-review-v1", auth: { start: "/api/auth/github/start", session: "/api/auth/github/session", logout: "/api/auth/github/logout" }, control: "/api/review-control", workflow: "/api/review-workflow", publicReleases: "/api/public-review-releases", serverReferences: { oauthClientId: "CAIRN_GITHUB_OAUTH_CLIENT_ID", oauthRedirectUri: "CAIRN_GITHUB_OAUTH_REDIRECT_URI", sessionSigning: "CAIRN_SESSION_SIGNING_SECRET", controlApiBase: "CAIRN_CONTROL_API_BASE", brokerSecret: "CAIRN_BROKER_TO_DISPATCHER_SECRET" } },
    preferences: { language: "zh", search: { homepageLimit: 35, navigationLimit: 30, debounceMs: 0 }, navigation: { transferWalkSpeed: 3, railRideSpeed: 16, transferCostFactor: 1, normalPlatformTransferCost: 5 }, map: { logicalInitialZoom: 5, leafletOffset: -3, scrollWheelZoom: true, doubleClickZoom: true, dragging: true }, toolbar: { position: "right", compact: false } }
  };
}

// src/core/project/applicationRuntime.ts
var current = defaultApplicationSettings();
var resolved = resolveApplicationSettings(current);
var getApplicationSettings = () => resolved;
function applicationWorld(id) {
  const value = resolved.worlds.find((world) => world.id === id) || resolved.worlds.find((world) => world.enabled && world.default) || resolved.worlds.find((world) => world.enabled);
  if (!value) throw Error("\u6CA1\u6709\u5DF2\u542F\u7528\u4E16\u754C\u3002");
  return value;
}

// src/core/project/worldIdentity.ts
function normalizeRuleSourceWorldId(worldId2) {
  const raw = String(worldId2 ?? "").trim(), worlds = getApplicationSettings().worlds;
  return worlds.find((world) => world.id.toLowerCase() === raw.toLowerCase() || world.prefix.toLowerCase() === raw.toLowerCase() || String(world.numericCode) === raw || world.label.zh === raw || world.label.en && world.label.en === raw)?.id ?? (raw || applicationWorld("").id);
}

// src/configStudio/workflowDrawing.ts
var drawingKey = (step) => step.geometryRole === "auxiliary" ? step.id : step.outputId;
function enabledDrawing(step, workflow, slots) {
  if (step.geometryRole === "auxiliary" && step.drawing?.bindings?.length && !step.drawing.bindings.some((binding) => activeOutputIds(workflow, slots).includes(binding.outputId))) return false;
  return workflowConditionMatches(step.when, slots) && (step.geometryRole === "auxiliary" || workflowConditionMatches(workflow.outputs.find((output) => output.id === step.outputId)?.when, slots));
}
function activeOutputIds(workflow, slots) {
  return workflow.outputs.filter((output) => workflowConditionMatches(output.when, slots) && workflow.steps.filter((step) => step.kind === "geometry" && step.geometryRole !== "auxiliary" && step.outputId === output.id).every((step) => enabledDrawing(step, workflow, slots))).map((output) => output.id);
}
function serializeDrawingCapture(step, capture, slots) {
  for (const point of capture.coordinates) if (!Number.isFinite(point.x) || !Number.isFinite(point.z) || point.y != null && !Number.isFinite(point.y)) throw new Error("\u5750\u6807\u5FC5\u987B\u4E3A\u6709\u9650\u6570\u503C\u3002");
  const type = step.geometry?.[0];
  if (!type) throw new Error("\u7ED8\u5236\u5FC5\u987B\u6307\u5B9A\u51E0\u4F55\u7C7B\u578B\u3002");
  const geometry = capture.geometry ?? multipartGeometryFromSinglePath(type, capture.coordinates);
  const error = validateMultipartGeometry(geometry);
  if (error) throw new Error(error);
  if (geometry.type !== type) throw new Error("\u91C7\u96C6\u51E0\u4F55\u4E0E\u7ED8\u5236\u7C7B\u578B\u4E0D\u4E00\u81F4\u3002");
  if (step.drawing?.returnFormat === "pointObject" && geometry.parts.length !== 1) throw new Error("\u5355\u70B9\u5750\u6807\u5BF9\u8C61\u683C\u5F0F\u5FC5\u987B\u4E14\u53EA\u80FD\u91C7\u96C6\u4E00\u4E2A\u70B9\u3002");
  if (step.drawing?.multiple === false && geometry.parts.length > 1) throw new Error("\u6B64\u7ED8\u5236\u53EA\u5141\u8BB8\u4E00\u4E2A\u90E8\u4EF6\u3002");
  const entered = step.drawing?.heightSlot ? slots[step.drawing.heightSlot] : void 0;
  const rawHeight = capture.point?.y;
  const height = typeof rawHeight === "number" && Number.isFinite(rawHeight) ? rawHeight : entered !== "" && entered != null && Number.isFinite(Number(entered)) ? Number(entered) : void 0;
  const selected = structuredClone(geometry);
  if (type === "Point" && step.geometryRole === "auxiliary" && height !== void 0) for (const point of selected.parts) point.y = height;
  if (step.drawing?.returnFormat === "pointObject") {
    if (selected.type !== "Point" || selected.parts.length !== 1) throw new Error("\u5355\u70B9\u5750\u6807\u5BF9\u8C61\u683C\u5F0F\u5FC5\u987B\u4E14\u53EA\u80FD\u91C7\u96C6\u4E00\u4E2A\u70B9\u3002");
    return { value: { ...selected.parts[0] }, height, geometry: selected };
  }
  return { value: serializeMultipartGeometry(selected), height, geometry: selected };
}
function captureDrawingSnapshot(workflow, rawSlots, previous, capture) {
  const slots = coerceWorkflowValues(workflow, rawSlots);
  const captures = { ...previous };
  for (const step of workflow.steps.filter((step2) => step2.kind === "geometry")) {
    const key2 = drawingKey(step);
    if (!enabledDrawing(step, workflow, slots)) {
      for (const slot of [step.drawing?.captureSlot, step.drawing?.pointSlot]) if (slot) for (const token of [slot, `${slot}_RAW_POINT`, `${slot}_X`, `${slot}_Y`, `${slot}_Z`, `${slot}_HEIGHT`]) delete slots[token];
      for (const control of step.controls ?? []) if (control.slot) delete slots[control.slot];
      continue;
    }
    if (capture) {
      const next = capture(key2, step.geometry[0]);
      captures[key2] = Array.isArray(next) ? { coordinates: next } : next;
    }
    const result = serializeDrawingCapture(step, captures[key2] ?? { coordinates: [] }, slots);
    if (step.drawing?.captureSlot) {
      slots[step.drawing.captureSlot] = result.value;
      slots[`${step.drawing.captureSlot}_RAW_POINT`] = captures[key2]?.point ?? captures[key2]?.coordinates[0];
    }
    if (step.drawing?.pointSlot) slots[step.drawing.pointSlot] = captures[key2]?.point ?? captures[key2]?.coordinates[0];
    if (step.drawing?.captureSlot) slots[`${step.drawing.captureSlot}_HEIGHT`] = result.height;
    const rawPoint = captures[key2]?.point ?? captures[key2]?.coordinates[0];
    for (const slot of [step.drawing?.captureSlot, step.drawing?.pointSlot]) if (slot) for (const axis of ["x", "y", "z"]) slots[`${slot}_${axis.toUpperCase()}`] = typeof rawPoint?.[axis] === "number" ? rawPoint[axis] : void 0;
  }
  return { slots, captures };
}

// src/configStudio/workflowEditing.ts
var recordClassification = (record) => ({ class: String(record.Class ?? ""), ...record.Kind ? { kind: String(record.Kind) } : {}, ...record.SKind ?? record.Skind ? { skind: String(record.SKind ?? record.Skind) } : {}, ...record.SKind2 ?? record.Skind2 ? { skind2: String(record.SKind2 ?? record.Skind2) } : {} });
function compileWorkflowEditPlan(workflow, config) {
  workflow = resolveWorkflowFields(config, workflow);
  const errors = [];
  if (workflow.mode !== "composed") throw Error("\u5916\u90E8\u65B9\u6848\u901A\u8FC7\u5DF2\u767B\u8BB0\u7684\u7F16\u8F91\u63A5\u53E3\u6267\u884C\uFF0C\u4E0D\u8F6C\u6362\u6807\u51C6\u5DE5\u4F5C\u6D41\u3002");
  if (workflow.steps.length !== 3 || workflow.steps.map((s) => s.kind).join(",") !== "actor,form,geometry") errors.push("\u5FC5\u987B\u6070\u4E3A\u586B\u5199\u4EBA\u3001\u4FE1\u606F\u6536\u96C6\u3001\u8981\u7D20\u7ED8\u5236\u4E09\u9875\u3002");
  const drawings = workflow.steps.filter((s) => s.kind === "geometry");
  if (drawings.some((s) => s.geometryRole === "auxiliary" || s.drawing?.auxiliaryPoints?.length)) errors.push("\u4E0D\u80FD\u5305\u542B\u989D\u5916\u7ED8\u5236\u3002");
  if (workflow.outputs.length !== 1 || drawings.length !== 1 || drawings[0]?.outputId !== workflow.outputs[0]?.id) errors.push("\u5FC5\u987B\u53EA\u6709\u4E00\u4E2A\u660E\u786E\u7ED1\u5B9A\u8F93\u51FA\u7684\u8981\u7D20\u7ED8\u5236\u3002");
  if (workflow.steps.some((s) => s.when || s.controls?.some((c) => c.when || c.group?.itemFields.some((f) => "when" in f && f.when))) || workflow.outputs.some((o) => o.when || o.assignments.some((a) => a.when))) errors.push("\u4E0D\u80FD\u5305\u542B\u8F93\u5165\u3001\u9875\u9762\u6216\u8F93\u51FA\u7684\u542F\u7528\u6761\u4EF6\u3002");
  if (errors.length) throw Error(errors.join("\n"));
  const output = workflow.outputs[0], scope = workflow.editor?.scope ?? output.classification;
  if (!pathMatchesScope(scope, output.classification) || !config.nodes.some((n) => classificationPathKey(n.path) === classificationPathKey(scope))) throw Error("\u7F16\u8F91\u4F5C\u7528\u8303\u56F4\u5FC5\u987B\u4E3A\u8F93\u51FA\u8303\u56F4\u5185\u7684\u5B9E\u9645\u5206\u7C7B\u3002");
  const controls = workflow.steps.flatMap((s) => s.controls ?? []), tokens = new Set(controls.flatMap((c) => c.slot ? [c.slot] : [])), needed = /* @__PURE__ */ new Set(), idOnly = /* @__PURE__ */ new Set(), bindings = [];
  for (const assignment of output.assignments) {
    const ast = parseWorkflowExpression(assignment.expression), used = workflowExpressionTokens(ast).filter((t) => tokens.has(t));
    if (assignment.target === "ID") used.forEach((t) => idOnly.add(t));
    else {
      used.forEach((t) => needed.add(t));
      if (ast.kind === "token" && tokens.has(ast.name)) bindings.push({ slot: ast.name, target: assignment.target });
    }
  }
  for (const step of drawings) {
    if (step.drawing?.heightSlot) needed.add(step.drawing.heightSlot);
    for (const binding of step.drawing?.bindings ?? []) if (binding.value === "height" && step.drawing?.heightSlot) bindings.push({ slot: step.drawing.heightSlot, target: binding.target });
  }
  for (const control of controls) for (const condition of control.requiredWhen ?? []) for (const token of conditionTokens(condition)) if (tokens.has(token)) needed.add(token);
  const explicit = workflow.editor?.backfill ?? [];
  for (const binding of explicit) {
    if (!tokens.has(binding.slot) || !isSafeWorkflowTarget(binding.target) || !resolveSelectableFields(config, scope).some((f) => f.key === binding.target) || ["World", "Class", "Kind", "SKind", "SKind2", "Creator", "CreateBy", "CreateTime"].includes(binding.target)) errors.push(`\u56DE\u586B\u6620\u5C04 ${binding.slot} \u2192 ${binding.target} \u65E0\u6548\u3002`);
    else bindings.push({ ...binding });
  }
  const removed = controls.filter((c) => c.slot && idOnly.has(c.slot) && !needed.has(c.slot)), kept = controls.filter((c) => !removed.includes(c));
  for (const control of kept) if (control.slot && !bindings.some((b) => b.slot === control.slot) && !["classificationPicker", "tagsExtensions"].includes(control.kind)) errors.push(`\u63A7\u4EF6 ${control.slot}\uFF08${control.label.zh}\uFF09\u7F3A\u5C11\u53EF\u9006\u76F4\u63A5\u8D4B\u503C\u6216\u660E\u786E\u56DE\u586B\u6620\u5C04\u3002`);
  if (errors.length) throw Error(errors.join("\n"));
  return { workflow: structuredClone(workflow), scope, controls: structuredClone(kept), removed: structuredClone(removed), bindings: bindings.filter((b, i, all) => all.findIndex((x) => x.slot === b.slot && x.target === b.target) === i) };
}
function conditionTokens(condition) {
  return [condition.token, ...(condition.all ?? condition.any ?? []).flatMap(conditionTokens)].filter(Boolean);
}
function setPath(record, path2, value) {
  if (!isSafeWorkflowTarget(path2)) throw Error("\u975E\u6CD5\u5B57\u6BB5\u8DEF\u5F84");
  let node = record;
  const parts = path2.split(".");
  for (const key2 of parts.slice(0, -1)) {
    if (node[key2] == null) node[key2] = {};
    if (typeof node[key2] !== "object" || Array.isArray(node[key2])) throw Error(`\u5B57\u6BB5\u8DEF\u5F84 ${path2} \u4E0E\u73B0\u6709\u6570\u636E\u51B2\u7A81\u3002`);
    node = node[key2];
  }
  if (value === void 0) delete node[parts[parts.length - 1]];
  else node[parts[parts.length - 1]] = structuredClone(value);
}
function removePath(record, path2) {
  const parts = path2.split(".");
  let node = record;
  for (const key2 of parts.slice(0, -1)) {
    if (!node[key2] || typeof node[key2] !== "object" || Array.isArray(node[key2])) return;
    node = node[key2];
  }
  delete node[parts[parts.length - 1]];
}
var row = (key2, value, group) => ({ key: key2, ...group ? { group } : {}, type: value === null ? "null" : typeof value === "number" ? "number" : typeof value === "boolean" ? "bool" : typeof value === "object" ? "json" : "text", value: structuredClone(value) });
function residualAnnotations(plan, record) {
  const residual = structuredClone({ tags: record.tags ?? {}, extensions: record.extensions ?? {} });
  for (const a of plan.workflow.outputs[0].assignments) if (a.target.startsWith("tags.") || a.target.startsWith("extensions.")) removePath(residual, a.target);
  const tags = Object.entries(residual.tags ?? {}).map(([key2, value]) => row(key2, value)), extensions = Object.entries(residual.extensions ?? {}).flatMap(([group, values2]) => Object.entries(values2 ?? {}).map(([key2, value]) => row(key2, value, group)));
  return { [plan.workflow.outputs[0].id]: { tags, extensions } };
}
function hydrateWorkflowEdit(plan, record) {
  const classification = recordClassification(record);
  if (!pathMatchesScope(classification, plan.scope)) throw Error("\u8BB0\u5F55\u4E0D\u5728\u7F16\u8F91\u5DE5\u4F5C\u6D41\u7684\u4F5C\u7528\u8303\u56F4\u5185\u3002");
  const slots = { EDIT_ID: record.ID };
  for (const control of plan.controls) {
    if (control.kind === "classificationPicker") {
      slots[control.slot ?? control.id] = JSON.stringify(classification);
      continue;
    }
    if (control.kind === "tagsExtensions") {
      slots[control.id] = residualAnnotations(plan, record);
      continue;
    }
    if (!control.slot) continue;
    const values2 = plan.bindings.filter((b) => b.slot === control.slot).map((b) => readRecordPath(record, b.target));
    if (values2.some((v) => !annotationEqual(v, values2[0]))) throw Error(`\u69FD\u4F4D ${control.slot} \u7684\u591A\u4E2A\u56DE\u586B\u76EE\u6807\u5177\u6709\u4E0D\u540C\u503C\uFF0C\u4E0D\u80FD\u731C\u6D4B\u3002`);
    slots[control.slot] = structuredClone(values2[0]);
  }
  const draft = { slots, classification, initialSlots: structuredClone(slots) }, filled = workflowEditSlots(plan, record, draft);
  return { ...draft, slots: filled, initialSlots: structuredClone(filled) };
}
function workflowEditSlots(plan, original, draft, supplied) {
  const geometry = supplied ?? readMultipartGeometry(original, plan.workflow.outputs[0].geometry.selected).geometry, step = plan.workflow.steps.find((s) => s.kind === "geometry");
  if (!geometry || !step) return { ...draft.slots };
  const coords = geometry.type === "Point" ? geometry.parts : geometry.type === "LineString" ? geometry.parts[0] : geometry.parts[0][0];
  const result = captureDrawingSnapshot(plan.workflow, draft.slots, { [drawingKey(step)]: { geometry, coordinates: coords, point: coords[0] } }).slots;
  const controls = new Set(plan.controls.flatMap((c) => c.slot ? [c.slot] : []));
  return { ...draft.slots, ...Object.fromEntries(Object.entries(result).filter(([key2]) => !controls.has(key2))) };
}
function buildWorkflowEditRecord(plan, original, draft, options = {}) {
  const record = structuredClone(original), slots = coerceWorkflowValues(plan.workflow, workflowEditSlots(plan, original, draft, options.geometry)), initial = draft.initialSlots;
  const id = String(draft.slots.EDIT_ID ?? "").trim();
  if (!id) throw Error("ID \u4E0D\u80FD\u4E3A\u7A7A\u3002");
  record.ID = id;
  if (!pathMatchesScope(draft.classification, plan.scope)) throw Error("\u4E0D\u80FD\u5C06\u8981\u7D20\u6539\u4E3A\u5DE5\u4F5C\u6D41\u4F5C\u7528\u8303\u56F4\u4E4B\u5916\u7684\u5206\u7C7B\u3002");
  if (!annotationEqual(draft.classification, recordClassification(original))) {
    for (const [key2, value] of [["Class", draft.classification.class], ["Kind", draft.classification.kind], ["SKind", draft.classification.skind], ["SKind2", draft.classification.skind2]]) if (value) record[key2] = value;
    else delete record[key2];
  }
  const system = { ID: id, World: original.World, Class: draft.classification.class, Kind: draft.classification.kind ?? "", Skind: draft.classification.skind ?? "", Skind2: draft.classification.skind2 ?? "", Creator: original.CreateBy ?? "" };
  Object.assign(system, Object.fromEntries(Object.entries(system).map(([key2, value]) => [`${key2}_1`, value])));
  const geometryDirty = Boolean(options.geometry && !annotationEqual(options.geometry, readMultipartGeometry(original, plan.workflow.outputs[0].geometry.selected).geometry));
  const geometryTokens = new Set(plan.workflow.steps.flatMap((s) => [s.drawing?.captureSlot, s.drawing?.pointSlot]).filter((slot) => Boolean(slot)).flatMap((slot) => [slot, `${slot}_X`, `${slot}_Y`, `${slot}_Z`, `${slot}_HEIGHT`]));
  const beforePath = recordClassification(original), classificationDirty = !annotationEqual(draft.classification, beforePath);
  for (const assignment of plan.workflow.outputs[0].assignments) if (assignment.target !== "ID") {
    const tokens = workflowExpressionTokens(parseWorkflowExpression(assignment.expression));
    if (tokens.some((t) => plan.controls.some((c) => c.slot === t) && !annotationEqual(draft.slots[t], initial[t]) || geometryDirty && geometryTokens.has(t) || /^ID(?:_1)?$/.test(t) && id !== String(original.ID) || classificationDirty && /^(Class|Kind|Skind|Skind2)(?:_1)?$/.test(t))) setPath(record, assignment.target, evaluateWorkflowExpression(assignment.expression, slots, system));
  }
  for (const binding of plan.bindings) if (plan.workflow.steps.some((step) => step.drawing?.heightSlot === binding.slot) && !annotationEqual(draft.slots[binding.slot], initial[binding.slot])) setPath(record, binding.target, slots[binding.slot]);
  for (const step of plan.workflow.steps) for (const binding of step.drawing?.bindings ?? []) if (binding.outputId === plan.workflow.outputs[0].id && (geometryDirty || step.drawing?.heightSlot && !annotationEqual(draft.slots[step.drawing.heightSlot], initial[step.drawing.heightSlot]))) {
    const capture = step.drawing?.captureSlot, value = capture ? slots[binding.value === "height" ? `${capture}_HEIGHT` : capture] : binding.value === "height" && step.drawing?.heightSlot ? slots[step.drawing.heightSlot] : void 0;
    if (value !== void 0) setPath(record, binding.target, value);
  }
  for (const control of plan.controls.filter((c) => c.kind === "tagsExtensions")) if (!annotationEqual(draft.slots[control.id], initial[control.id])) {
    const before = annotationsForOutput({ ...plan.workflow, steps: [{ id: "annotations", kind: "form", label: { zh: "", en: "" }, controls: [control] }] }, initial, plan.workflow.outputs[0].id), after = annotationsForOutput({ ...plan.workflow, steps: [{ id: "annotations", kind: "form", label: { zh: "", en: "" }, controls: [control] }] }, draft.slots, plan.workflow.outputs[0].id);
    for (const namespace of ["tags", "extensions"]) {
      for (const [key2, value] of Object.entries(before[namespace])) if (namespace === "extensions" && value && typeof value === "object") for (const child of Object.keys(value)) removePath(record, `${namespace}.${key2}.${child}`);
      else removePath(record, `${namespace}.${key2}`);
      for (const [key2, value] of Object.entries(after[namespace])) if (namespace === "extensions" && value && typeof value === "object") for (const [child, data] of Object.entries(value)) setPath(record, `${namespace}.${key2}.${child}`, data);
      else setPath(record, `${namespace}.${key2}`, value);
    }
  }
  return record;
}

// src/configStudio/standardTagFields.ts
function tagMetadata(field) {
  const type = field.type === "enum" || field.input === "select" ? "select" : field.type === "number" ? "number" : field.type === "boolean" ? "bool" : "text";
  return { kind: "tagField", type, ...field.format === "externalLink" || field.format === "date" ? { format: field.format } : {}, ...type === "select" ? { valueTable: { valueType: field.optionValueType ?? "string", rows: structuredClone(field.options ?? []) } } : {} };
}
var stable = (value) => JSON.stringify(value);
function standardTagFields(config, path2) {
  const fields = resolveEffectiveFields(config, path2).filter((field) => field.key.startsWith("tags."));
  if (config.contractRevision < 11) return fields;
  const table = config.lookupTables?.find((table2) => table2.id === "standard-tag-fields");
  if (!table || table.functionKind !== "tagField") throw Error("\u6807\u51C6\u6807\u7B7E\u5B57\u6BB5\u76EE\u5F55\u4E0D\u5B58\u5728\u6216\u683C\u5F0F\u65E0\u6548\u3002");
  const result = table.rows.map((row2) => {
    const meta = row2.functionValue;
    if (!meta || typeof meta !== "object" || !("kind" in meta) || meta.kind !== "tagField") throw Error(`\u6807\u7B7E ${row2.value} \u7F3A\u5C11\u53D7\u63A7\u7C7B\u578B\u3002`);
    const options = meta.type === "select" ? effectiveOptionTable(config, { optionTable: meta.valueTable, optionsTableId: meta.valueTableId }) : void 0;
    return { fieldId: `tag-catalog-${row2.value}`, key: `tags.${row2.value}`, scope: "tags", type: meta.type === "select" ? "enum" : meta.type === "number" ? "number" : meta.type === "bool" ? "boolean" : "string", input: meta.type === "select" ? "select" : meta.type === "bool" ? "toggle" : "text", cardinality: "single", labels: row2.label, description: { zh: "", en: "" }, format: meta.format, options: options?.rows, optionValueType: options?.valueType };
  });
  for (const field of fields) {
    const index = result.findIndex((row2) => row2.key === field.key);
    if (index >= 0) result[index] = field;
    else result.push(field);
  }
  return result;
}
function tagRecordErrors(config, path2, record) {
  if (config.contractRevision < 11 || !record.tags || typeof record.tags !== "object") return [];
  const fields = standardTagFields(config, path2), tags = record.tags, errors = [];
  for (const field of fields) {
    const value = tags[field.key.slice(5)];
    if (value === void 0 || value === null) continue;
    const values2 = field.cardinality === "multiple" && Array.isArray(value) ? value : [value], type = field.type === "number" ? "number" : field.type === "boolean" ? "boolean" : field.type === "enum" ? field.optionValueType ?? "string" : "string";
    if (values2.some((value2) => typeof value2 !== type || field.type === "enum" && !field.options?.some((option) => option.value === String(value2)))) errors.push(`${field.key} \u4E0E\u6807\u51C6\u76EE\u5F55\uFF0F\u5206\u7C7B\u5B57\u6BB5\u7684\u7C7B\u578B\u6216\u53EF\u9009\u503C\u4E0D\u7B26\u3002`);
  }
  return errors;
}
function standardTagTableErrors(config) {
  if (config.contractRevision < 11) return [];
  const errors = [], fail = (path2, message) => errors.push({ path: path2, message });
  for (const [id, kind] of [["teleport-hubs", "teleportHub"], ["road-travel-modes", "speed"], ["standard-tag-fields", "tagField"]]) {
    const table2 = config.lookupTables?.find((table3) => table3.id === id);
    if (!table2 || table2.functionKind !== kind || table2.valueType !== "string") fail(`lookupTables/${id}`, "\u7CFB\u7EDF\u6807\u51C6\u8868\u7F3A\u5931\uFF0C\u6216\u5176\u56FA\u5B9A ID\u3001\u7528\u9014\u3001\u4FDD\u5B58\u503C\u7C7B\u578B\u88AB\u4FEE\u6539\u3002");
  }
  for (const table2 of config.lookupTables ?? []) if (table2.functionKind === "tagField") {
    if (table2.valueType !== "string") fail(`lookupTables/${table2.id}`, "\u6807\u7B7E\u540D\u79F0\u76EE\u5F55\u5FC5\u987B\u4EE5\u6587\u672C key \u4FDD\u5B58\u3002");
    for (const row2 of table2.rows) {
      const path2 = `lookupTables/${table2.id}/${row2.value}`, meta = row2.functionValue;
      if (row2.value === "__other__" || !/^[A-Za-z][A-Za-z0-9_]*$/.test(row2.value)) fail(path2, "\u6807\u7B7E key \u65E0\u6548\uFF1B\u5176\u4ED6\u5B57\u6BB5\u5165\u53E3\u4E0D\u80FD\u5B58\u5165\u76EE\u5F55\u3002");
      if (!meta || typeof meta !== "object" || !("kind" in meta) || meta.kind !== "tagField") {
        fail(path2, "\u6807\u7B7E\u76EE\u5F55\u9700\u8981\u53D7\u63A7\u7684\u6807\u7B7E\u7C7B\u578B\u529F\u80FD\u503C\u3002");
        continue;
      }
      if (meta.type !== "select" && (meta.valueTable || meta.valueTableId)) fail(path2, "\u53EA\u6709\u4E0B\u62C9\u6807\u7B7E\u53EF\u4EE5\u8BBE\u7F6E\u503C\u9009\u9879\u3002");
      if (meta.type === "select") {
        if (meta.valueTable && meta.valueTableId) fail(path2, "\u6807\u7B7E\u503C\u526F\u672C\u4E0E\u8868\u683C\u5F15\u7528\u4E0D\u80FD\u5E76\u5B58\u3002");
        const source = meta.valueTableId ? config.lookupTables?.find((table3) => table3.id === meta.valueTableId) : void 0;
        if (meta.valueTableId && (!source || source.functionKind === "tagField")) fail(path2, "\u6807\u7B7E\u503C\u5BF9\u7167\u4E0D\u80FD\u5F15\u7528\u540D\u79F0\u76EE\u5F55\u6216\u7F3A\u5931\u8868\u683C\uFF0C\u9632\u6B62\u5FAA\u73AF\u3002");
        const values2 = effectiveOptionTable(config, { optionTable: meta.valueTable, optionsTableId: meta.valueTableId });
        if (!values2.rows.length) fail(path2, "\u4E0B\u62C9\u6807\u7B7E\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u6709\u6548\u503C\u9009\u9879\u3002");
        const keys = /* @__PURE__ */ new Set();
        for (const value of values2.rows) {
          const key2 = values2.valueType === "number" ? String(Number(value.value)) : value.value;
          if (!value.value.trim() || keys.has(key2) || !(value.label.zh.trim() || value.label.en.trim()) || values2.valueType === "number" && !Number.isFinite(Number(value.value)) || values2.valueType === "boolean" && !["true", "false"].includes(value.value)) fail(path2, "\u6807\u7B7E\u503C\u5BF9\u7167\u5B58\u5728\u91CD\u590D\u3001\u7A7A\u540D\u79F0\u6216\u65E0\u6548\u4FDD\u5B58\u503C\u3002");
          keys.add(key2);
        }
      }
    }
  }
  const table = config.lookupTables?.find((table2) => table2.id === "standard-tag-fields");
  for (const node of config.nodes) for (const field of resolveEffectiveFields(config, node.path).filter((field2) => field2.key.startsWith("tags."))) {
    const row2 = table?.rows.find((row3) => row3.value === field.key.slice(5)), meta = row2?.functionValue;
    if (meta && typeof meta === "object" && "kind" in meta && meta.kind === "tagField") {
      const definition = tagMetadata(field), dictionary = meta.type === "select" ? effectiveOptionTable(config, { optionTable: meta.valueTable, optionsTableId: meta.valueTableId }) : void 0;
      if (meta.type !== definition.type || dictionary && stable(dictionary) !== stable(definition.valueTable)) fail(`nodes/${node.nodeId}/fields/${field.fieldId}`, "\u5206\u7C7B\u4E13\u7528\u6807\u7B7E\u4E0E\u6807\u51C6\u76EE\u5F55\u7684\u7C7B\u578B\uFF0F\u503C\u9009\u9879\u5B58\u5728\u51B2\u7A81\uFF0C\u8BF7\u660E\u786E\u4FEE\u590D\u3002");
    }
  }
  return errors;
}

// src/configStudio/workflowRecord.ts
function finalizeV3WorkflowRecord(config, output, raw, options) {
  const fields = new Map(resolveEffectiveFields(config, output.classification).map((field) => [field.key, field]));
  const input = structuredClone(raw);
  for (const field of fields.values()) if (field.defaultValue !== void 0 && isSafeWorkflowTarget(field.key)) {
    const parts = field.key.split(".");
    let node = input;
    let blocked = false;
    for (const key3 of parts.slice(0, -1)) {
      const value = node[key3];
      if (value !== void 0 && (!value || typeof value !== "object" || Array.isArray(value))) {
        blocked = true;
        break;
      }
      if (value === void 0) node[key3] = {};
      node = node[key3];
    }
    if (blocked) continue;
    const key2 = parts[parts.length - 1];
    if (node[key2] === void 0) node[key2] = structuredClone(field.defaultValue);
  }
  const preserved = new Set(options.preservePaths ?? []);
  const clean = (value, path2) => {
    if (value === void 0) return void 0;
    if (Array.isArray(value)) return value.length ? value.map((item) => clean(item, path2)) : preserved.has(path2) ? [] : void 0;
    if (value && typeof value === "object") {
      const entries = Object.entries(value).flatMap(([key2, item]) => {
        const next = clean(item, path2 ? `${path2}.${key2}` : key2);
        return next === void 0 ? [] : [[key2, next]];
      });
      return entries.length ? Object.fromEntries(entries) : preserved.has(path2) ? {} : void 0;
    }
    const field = fields.get(path2);
    if (value === "" && !preserved.has(path2) && !field?.required && field?.emptyValue !== "preserve") return void 0;
    if (field?.type === "number" && value !== null && value !== "") {
      const number2 = Number(value);
      return Number.isFinite(number2) ? number2 : value;
    }
    if (field?.type === "boolean" && typeof value === "string") return value === "true" ? true : value === "false" ? false : value;
    return value;
  };
  const record = clean(input, "");
  const creator = String(raw.Creator ?? "").trim();
  delete record.Creator;
  if (creator) record.CreateBy = creator;
  const date = options.now;
  record.CreateTime = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  record.Type = featureTypeFromGeometryType(output.geometry.selected);
  return withCanonicalMultipartGeometry(record, options.geometry ?? multipartGeometryFromSinglePath(output.geometry.selected, options.coords));
}

// src/configStudio/workflowKernel.ts
function resolveV3WorldPrefix(world) {
  const raw = normalizeV3WorldId(world);
  return applicationWorld(raw).prefix;
}
function normalizeV3WorldId(world) {
  return normalizeRuleSourceWorldId(String(world ?? ""));
}
var evaluateV3Expression = evaluateWorkflowExpression;
function setPath2(target, path2, value) {
  if (!isSafeWorkflowTarget(path2)) throw new Error(`\u65E0\u6548\u7EC4\u88C5\u8DEF\u5F84\uFF1A${path2}`);
  const parts = String(path2 ?? "").split(".").filter(Boolean);
  if (!parts.length) return;
  let cursor = target;
  for (const key2 of parts.slice(0, -1)) {
    if (!cursor[key2] || typeof cursor[key2] !== "object" || Array.isArray(cursor[key2])) cursor[key2] = {};
    cursor = cursor[key2];
  }
  cursor[parts[parts.length - 1]] = value;
}
function resolvedClassification(output, selections) {
  return selections[output.id] ?? output.classification;
}
function parseStructuredOutput(target, value) {
  if (target !== "tags" && target !== "extensions") return value;
  if (typeof value !== "string" || !value.trim()) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
function normalizeV3WorkflowSlots(workflow, raw) {
  const slots = coerceWorkflowValues(workflow, raw);
  for (const point of workflow.steps.flatMap((step) => step.drawing?.auxiliaryPoints ?? [])) if (!workflowConditionMatches(point.when, slots)) delete slots[point.slot];
  for (const step of workflow.steps.filter((step2) => step2.kind === "geometry")) if (!enabledDrawing(step, workflow, slots)) {
    for (const slot of [step.drawing?.captureSlot, step.drawing?.pointSlot].filter(Boolean)) for (const key2 of [slot, `${slot}_RAW_POINT`, `${slot}_X`, `${slot}_Y`, `${slot}_Z`, `${slot}_HEIGHT`]) delete slots[key2];
    for (const control of step.controls ?? []) if (control.slot) delete slots[control.slot];
  }
  for (const slot of workflowCaptureSlots(workflow)) {
    let raw2 = slots[`${slot}_RAW_POINT`] ?? slots[slot];
    while (Array.isArray(raw2) && Array.isArray(raw2[0])) raw2 = raw2[0];
    const point = Array.isArray(raw2) ? { x: raw2[0], y: raw2[1], z: raw2[2] } : raw2;
    if (!Object.prototype.hasOwnProperty.call(slots, `${slot}_HEIGHT`)) slots[`${slot}_HEIGHT`] = typeof point?.y === "number" && Number.isFinite(point.y) ? point.y : void 0;
    for (const axis of ["x", "y", "z"]) {
      const value = point?.[axis];
      slots[`${slot}_${axis.toUpperCase()}`] = typeof value === "number" && Number.isFinite(value) ? value : void 0;
    }
  }
  return slots;
}
function workflowOutputSystem(workflow, slots, options, outputId) {
  const world = normalizeV3WorldId(options.world ?? slots.World ?? "zth");
  const values2 = (classification) => ({ World: world, WorldPrefix: resolveV3WorldPrefix(world), Class: classification.class, Kind: classification.kind ?? "", Skind: classification.skind ?? "", Skind2: classification.skind2 ?? "", Creator: slots.actor ?? "", ID: slots.ID ?? "" });
  const selected = workflow.outputs.find((output) => output.id === outputId) ?? workflow.outputs[0];
  const system = selected ? values2(resolvedClassification(selected, options.classifications ?? {})) : {};
  workflow.outputs.forEach((output, index) => Object.entries(values2(resolvedClassification(output, options.classifications ?? {}))).forEach(([key2, value]) => {
    system[`${key2}_${index + 1}`] = value;
  }));
  return system;
}
function evaluateV3WorkflowOutputs(workflow, slots, options = {}) {
  if (options.config) workflow = resolveWorkflowFields(options.config, workflow);
  slots = normalizeV3WorkflowSlots(workflow, slots);
  const world = normalizeV3WorldId(options.world ?? slots.World ?? "zth");
  const assembled = /* @__PURE__ */ new Map();
  const active = new Set(activeOutputIds(workflow, slots));
  for (const output of workflow.outputs.filter((item) => active.has(item.id))) for (const assignment of output.assignments) for (const token of workflowExpressionTokens(parseWorkflowExpression(assignment.expression))) {
    const index = /^(?:ID|Class|Kind|Skind|Skind2)_(\d+)$/.exec(token);
    if (index && !active.has(workflow.outputs[Number(index[1]) - 1]?.id)) throw new Error(`\u8F93\u51FA ${output.id} \u4F9D\u8D56\u672A\u542F\u7528\u7684\u8F93\u51FA ${token}\u3002`);
  }
  for (const index of workflowOutputAssemblyOrder(workflow)) {
    const output = workflow.outputs[index];
    if (!active.has(output.id)) continue;
    const classification = resolvedClassification(output, options.classifications ?? {});
    const system = workflowOutputSystem(workflow, slots, { ...options, world }, output.id);
    for (const [otherIndex, result] of assembled) system[`ID_${otherIndex + 1}`] = result.record.ID ?? "";
    if (options.config && (!hasCategoryNode(options.config, classification) || hasDescendants(options.config, classification) || !pathMatchesScope(classification, output.classification) || !resolveGeometryProfile(options.config, classification, output.geometry.selected)?.enabled)) throw new Error(`\u8F93\u51FA ${output.id} \u5FC5\u987B\u9009\u62E9\u6700\u7EC8\u5206\u7C7B\u4E0E\u6709\u6548\u51E0\u4F55\u3002`);
    const record = { World: world, Class: classification.class, ...classification.kind ? { Kind: classification.kind } : {}, ...classification.skind ? { SKind: classification.skind } : {}, ...classification.skind2 ? { SKind2: classification.skind2 } : {} };
    const actor = String(slots.actor ?? "").trim();
    if (actor) record.Creator = actor;
    for (const namespace of ["tags", "extensions"]) {
      const value = parseStructuredOutput(namespace, slots[namespace]);
      if (value && typeof value === "object" && !Array.isArray(value)) record[namespace] = structuredClone(value);
    }
    const assignmentOrder = [...output.assignments.filter((assignment) => assignment.target === "ID"), ...output.assignments.filter((assignment) => assignment.target !== "ID")];
    for (const assignment of assignmentOrder) {
      if (!workflowConditionMatches(assignment.when, slots, system)) continue;
      if (PROTECTED_WORKFLOW_TARGETS.has(assignment.target.split(".")[0])) {
        const source = assignment.target === "SKind" ? "Skind" : assignment.target === "SKind2" ? "Skind2" : assignment.target;
        if (assignment.expression.trim() === source && source in system) continue;
        throw new Error(`\u7CFB\u7EDF\u5B57\u6BB5 ${assignment.target} \u4E0D\u80FD\u7531\u7EC4\u88C5\u8986\u76D6\u3002`);
      }
      const value = parseStructuredOutput(assignment.target, evaluateV3Expression(assignment.expression, slots, system));
      if (value !== void 0) setPath2(record, assignment.target, value);
      system.ID = record.ID ?? "";
      system[`ID_${index + 1}`] = record.ID ?? "";
    }
    const custom = annotationsForOutput(workflow, slots, output.id);
    for (const namespace of ["tags", "extensions"]) if (Object.keys(custom[namespace]).length) {
      if (record[namespace] != null && (typeof record[namespace] !== "object" || Array.isArray(record[namespace]))) throw new Error(`${namespace} \u81EA\u52A8\u7EC4\u88C5\u5FC5\u987B\u4E3A\u5BF9\u8C61\u3002`);
      record[namespace] ??= {};
      mergeAnnotations(record[namespace], custom[namespace], namespace);
    }
    record.World = world;
    for (const step of workflow.steps.filter((step2) => step2.kind === "geometry" && enabledDrawing(step2, workflow, slots))) for (const binding of step.drawing?.bindings ?? []) if (binding.outputId === output.id) {
      const slot = step.drawing?.captureSlot;
      let value = binding.value === "height" ? slot ? slots[`${slot}_HEIGHT`] : void 0 : slot ? slots[slot] : void 0;
      if (binding.value === "height" && value == null && step.drawing?.heightSlot) {
        const entered = slots[step.drawing.heightSlot];
        if (entered !== "" && entered != null && Number.isFinite(Number(entered))) value = Number(entered);
      }
      if (binding.value === "geometry" && step.drawing?.returnFormat === "pointObject" && value && typeof value === "object" && !Array.isArray(value) && !(typeof value.y === "number")) {
        const entered = step.drawing.heightSlot ? slots[step.drawing.heightSlot] : void 0;
        value = { ...value, y: entered !== "" && entered != null ? Number(entered) : -64 };
      }
      if (value !== void 0) setPath2(record, binding.target, value);
    }
    const captured = options.coordinates?.[output.id];
    const geometry = captured && !Array.isArray(captured) ? captured : void 0;
    const finalized = options.config && captured ? finalizeV3WorkflowRecord(options.config, { ...output, classification }, record, { coords: Array.isArray(captured) ? captured : [], geometry, preservePaths: [...annotationPaths(custom.tags, "tags"), ...annotationPaths(custom.extensions, "extensions")], now: options.now ?? /* @__PURE__ */ new Date() }) : record;
    assembled.set(index, { outputId: output.id, classification, geometry: output.geometry.selected, record: finalized });
  }
  const results = workflow.outputs.flatMap((_, index) => assembled.has(index) ? [assembled.get(index)] : []);
  Object.defineProperty(results, "executionSlots", { value: structuredClone(slots), enumerable: false });
  return results;
}
function empty(value) {
  return value === void 0 || value === null || typeof value === "string" && !value.trim() || Array.isArray(value) && value.length === 0;
}
function validateV3WorkflowRecords(config, workflow, result) {
  const issues = [];
  for (const output of result) {
    const definition = workflow.outputs.find((item) => item.id === output.outputId);
    if (!definition || !hasCategoryNode(config, output.classification) || !pathMatchesScope(output.classification, definition.classification)) {
      issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7684\u5206\u7C7B\u65E0\u6548\u3002` });
      continue;
    }
    for (const message of tagRecordErrors(config, output.classification, output.record)) issues.push({ message });
    const geometry = readMultipartGeometry(output.record, definition.geometry.selected).geometry;
    if (geometry && geometry.parts.length > 1 && resolveGeometryProfile(config, output.classification, definition.geometry.selected)?.allowMultipleParts === false) issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7684\u5206\u7C7B\u53EA\u5141\u8BB8\u5355\u90E8\u4EF6\u51E0\u4F55\u3002` });
    if (!String(output.record.ID ?? "").trim()) issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7F3A\u5C11\u6709\u6548 ID\u3002` });
    if (config.contractRevision >= 10) {
      const role = resolveNodeFieldSettings(config, output.classification).value.structure;
      if (role?.enabled && role.role === "member") {
        const host = role.hostField ? readRecordPath(output.record, role.hostField) : void 0, selector = role.selectorField ? readRecordPath(output.record, role.selectorField) : void 0;
        if (typeof host !== "string" || !host.trim()) issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7F3A\u5C11\u5355\u503C\u4E3B\u7ED3\u6784 ID\uFF08${role.hostField}\uFF09\u3002` });
        if (!["string", "number", "boolean"].includes(typeof selector) || typeof selector === "string" && !selector.trim() || typeof selector === "number" && !Number.isFinite(selector)) issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7F3A\u5C11\u6709\u6548\u9644\u5C5E\u5C42\u7EA7\uFF08${role.selectorField}\uFF09\u3002` });
      }
    }
    for (const field of resolveEffectiveFields(config, output.classification)) {
      const value = readRecordPath(output.record, field.key);
      const required = field.required || field.requiredWhen?.some((condition) => condition.kind === "always" || condition.kind === "fieldPresent" && !empty(readRecordPath(output.record, condition.field)) === condition.present || condition.kind === "fieldEquals" && String(readRecordPath(output.record, condition.field) ?? "") === condition.value || condition.kind === "fieldIn" && condition.values.includes(String(readRecordPath(output.record, condition.field) ?? "")));
      if (required && empty(value)) issues.push({ message: `\u8F93\u51FA ${output.outputId} \u7684 ${field.key} \u4E3A\u5FC5\u586B\u9879\u3002` });
      if (empty(value)) continue;
      const values2 = field.cardinality === "multiple" ? Array.isArray(value) ? value : [value] : [value];
      if (field.cardinality === "multiple" && !Array.isArray(value)) issues.push({ message: `${field.key} \u5FC5\u987B\u662F\u6570\u7EC4\u3002` });
      if (["string", "reference"].includes(field.type) && values2.some((item) => typeof item !== "string")) issues.push({ message: `${field.key} \u5FC5\u987B\u662F\u6587\u672C\u503C\u3002` });
      if (field.type === "enum" && field.optionValueType && values2.some((item) => typeof item !== field.optionValueType)) issues.push({ message: `${field.key} \u7684\u9009\u9879\u4FDD\u5B58\u503C\u7C7B\u578B\u4E0D\u7B26\u3002` });
      if (field.type === "number" && values2.some((item) => typeof item !== "number" || !Number.isFinite(item))) issues.push({ message: `${field.key} \u5FC5\u987B\u662F\u6709\u9650\u6570\u503C\u3002` });
      if (field.type === "boolean" && values2.some((item) => typeof item !== "boolean")) issues.push({ message: `${field.key} \u5FC5\u987B\u662F\u5E03\u5C14\u503C\u3002` });
      if (field.type === "enum" && field.options?.length && values2.some((item) => !field.options.some((option) => option.value === String(item)))) issues.push({ message: `${field.key} \u4E0D\u662F\u6709\u6548\u9009\u9879\u503C\u3002` });
    }
  }
  return issues;
}

// src/configStudio/workflowEditCommit.ts
function testWorkflowEditConversion(config, workflow, records = []) {
  workflow = resolveWorkflowFields(config, workflow);
  const plan = compileWorkflowEditPlan(workflow, config), output = workflow.outputs[0], matching = records.filter((r) => pathMatchesScope(recordClassification(r), plan.scope));
  const path2 = config.nodes.find((n) => pathMatchesScope(n.path, plan.scope) && !hasDescendants(config, n.path) && resolveGeometryProfile(config, n.path, output.geometry.selected)?.enabled)?.path;
  if (!path2) throw Error("\u7F16\u8F91\u8303\u56F4\u6CA1\u6709\u6700\u7EC8\u53EF\u7528\u5206\u7C7B\u3002");
  const slots = { ID: "EDIT_SAMPLE", actor: "editing-test" };
  for (const control of workflow.steps.flatMap((s) => s.controls ?? [])) {
    const scalar = (field) => field.kind === "number" ? 0 : field.kind === "toggle" ? false : field.kind === "select" ? field.optionValueType === "number" ? Number(field.options?.[0]?.value ?? 0) : field.optionValueType === "boolean" ? field.options?.[0]?.value === "true" : field.options?.[0]?.value ?? "" : field.kind === "json" ? { kept: 0 } : "\u6837\u672C";
    if (control.kind === "classificationPicker") {
      slots[control.slot ?? control.id] = JSON.stringify(path2);
      continue;
    }
    if (control.kind === "tagsExtensions") continue;
    slots[control.slot ?? control.id] = control.kind === "group" && control.group ? Array.from({ length: Math.max(1, control.group.minItems ?? 0) }, () => control.group.storage === "scalar" ? scalar(control.group.itemFields[0]) : Object.fromEntries(control.group.itemFields.map((f) => [f.key, scalar(f)]))) : scalar(control);
  }
  const geometry = output.geometry.selected === "Point" ? { type: "Point", parts: [{ x: 0, y: 0, z: 0 }] } : output.geometry.selected === "LineString" ? { type: "LineString", parts: [[{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 }]] } : { type: "Polygon", parts: [[[{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }, { x: 10, y: 0, z: 10 }]]] };
  const step = workflow.steps.find((s) => s.kind === "geometry"), coords = geometry.type === "Point" ? geometry.parts : geometry.type === "LineString" ? geometry.parts[0] : geometry.parts[0][0], captured = captureDrawingSnapshot(workflow, slots, { [drawingKey(step)]: { geometry, coordinates: coords, point: coords[0] } });
  const sample = evaluateV3WorkflowOutputs(workflow, captured.slots, { config, world: "zth", classifications: { [output.id]: path2 }, coordinates: { [output.id]: geometry }, now: /* @__PURE__ */ new Date("2026-10-12T00:00:00Z") })[0]?.record;
  if (!sample) throw Error("\u65E0\u6CD5\u751F\u6210\u5B9E\u9645\u7F16\u8F91\u8BD5\u9A8C\u8BB0\u5F55\u3002");
  for (const record of [sample, ...matching]) {
    const draft = hydrateWorkflowEdit(plan, record), result = buildWorkflowEditRecord(plan, record, draft);
    if (JSON.stringify(result) !== JSON.stringify(record)) throw Error(`\u8BB0\u5F55 ${record.ID} \u65E0\u4FEE\u6539\u56DE\u586B\u8F93\u51FA\u53D1\u751F\u53D8\u5316\u3002`);
  }
  return { plan, report: [`\u4E09\u9875/\u5355\u8F93\u51FA/\u65E0\u989D\u5916\u7ED8\u5236/\u65E0\u542F\u7528\u6761\u4EF6\u901A\u8FC7`, `\u4FDD\u7559 ${plan.controls.length} \u4E2A\u6A21\u5757\uFF0C\u79FB\u9664 ${plan.removed.length} \u4E2A\u4EC5\u7528\u4E8E ID \u7684\u6A21\u5757`, `\u6837\u672C\u4E0E ${matching.length} \u6761\u73B0\u6709\u8BB0\u5F55\u5B9E\u9645\u56DE\u586B\u53CA\u65E0\u4FEE\u6539\u8F93\u51FA\u4E00\u81F4`] };
}

// src/configStudio/contract.ts
function isNativeConfigRevision(value) {
  return value === 5 || value === 6 || value === 7 || value === 8 || value === 9 || value === 10 || value === 11 || value === 12;
}

// src/configStudio/cardInheritance.ts
var identity = (origin) => `${origin.nodeId}/${origin.itemId}`;
function mergeInheritedCard(parent, local, parentId) {
  if (!parent || parent.mode !== "fields") return local ?? parent;
  if (local && local.mode !== "fields") return local;
  if (!local) return { ...parent, items: parent.items.map((item) => ({ ...item, inheritFrom: item.inheritFrom ?? { nodeId: parentId, itemId: item.id } })) };
  const upstream = new Map(parent.items.map((item) => [identity(item.inheritFrom ?? { nodeId: parentId, itemId: item.id }), item]));
  const represented = /* @__PURE__ */ new Set();
  const items = local.items.flatMap((item) => {
    if (!item.inheritFrom) return [item];
    const key2 = identity(item.inheritFrom), source = upstream.get(key2);
    if (!source) return [];
    represented.add(key2);
    return [{ ...item, source: source.source, label: source.label, valueOptions: source.valueOptions, fieldBinding: source.fieldBinding, optionTable: source.optionTable, optionsFieldRef: source.optionsFieldRef, optionsTableId: source.optionsTableId, optionValueType: source.optionValueType, prefillAudit: void 0 }];
  });
  for (const [key2, item] of upstream) if (!represented.has(key2)) items.push({ ...item, id: `inherited:${key2}`, inheritFrom: item.inheritFrom ?? { nodeId: parentId, itemId: item.id }, prefillAudit: void 0 });
  return { ...local, items };
}

// src/configStudio/prefillAudit.ts
function canonical(value) {
  return Array.isArray(value) ? "[" + value.map(canonical).join(",") + "]" : value && typeof value === "object" ? "{" + Object.entries(value).filter(([, v]) => v !== void 0).sort(([a], [b]) => a.localeCompare(b)).map(([key2, v]) => JSON.stringify(key2) + ":" + canonical(v)).join(",") + "}" : JSON.stringify(value);
}
function fieldFingerprint(field) {
  const text = canonical({ key: field.key, type: field.type, cardinality: field.cardinality, input: field.input, labels: field.labels, description: field.description, options: field.options, optionValueType: field.optionValueType, format: field.format });
  let a = 2166136261, b = 5381;
  for (let i = 0; i < text.length; i++) {
    a = Math.imul(a ^ text.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ text.charCodeAt(i);
  }
  return `field-v1-${(a >>> 0).toString(16).padStart(8, "0")}${(b >>> 0).toString(16).padStart(8, "0")}`;
}
function visitPrefillCopies(config, visit) {
  config.nodes.forEach((node) => {
    if (node.card?.mode === "fields") node.card.items.filter((item) => !item.inheritFrom).forEach((item) => visit(item, `nodes/${node.nodeId}/card/${item.id}`));
    if (node.fieldSettings?.search) visit(node.fieldSettings.search.subtitle, `nodes/${node.nodeId}/fieldSettings/search/subtitle`);
  });
  config.workflows.forEach((w) => w.steps.forEach((s) => s.controls?.forEach((c) => {
    if (!c.optionsTableId) visit(c, `workflows/${w.id}/${c.id}`);
    c.group?.itemFields.filter((f) => !f.optionsTableId).forEach((f) => visit(f, `workflows/${w.id}/${c.id}/${f.key}`));
  })));
}
function validatePrefillCopies(config, resolve) {
  const issues = [];
  if (config.contractRevision < 10) return issues;
  visitPrefillCopies(config, (owner, path2) => {
    const audit = owner.prefillAudit;
    if (!audit) return;
    const fields = resolve(config, audit.source.path), field = fields.find((field2) => field2.fieldId === audit.source.fieldId) ?? fields.find((field2) => field2.key === audit.source.key);
    const source = Object.values(audit.source.path).filter(Boolean).join("/");
    if (!field) {
      issues.push({ severity: config.contractRevision >= 11 ? "warning" : "error", code: "prefill-source-field-missing", path: path2, field: audit.source.key, message: `\u9884\u586B\u6765\u6E90 ${source} / ${audit.source.key} \u5DF2\u4E0D\u5B58\u5728\uFF1B\u5F53\u524D\u526F\u672C\u4ECD\u72EC\u7ACB\u4FDD\u5B58\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u9700\u8981\u66F4\u65B0\u3002` });
      return;
    }
    const current2 = fieldFingerprint(field);
    if (current2 !== audit.fingerprint && current2 !== audit.confirmedFingerprint) issues.push({ severity: "warning", code: "prefill-copy-outdated", path: path2, field: field.key, message: `\u6765\u6E90 ${source} / ${field.key} \u7684\u5B9A\u4E49\u3001\u540D\u79F0\u3001\u7C7B\u578B\u6216\u5BF9\u7167\u5DF2\u53D8\u5316\uFF1B${path2} \u4ECD\u4FDD\u7559\u72EC\u7ACB\u526F\u672C\u3002\u8BF7\u91CD\u65B0\u9884\u586B\uFF0C\u6216\u786E\u8BA4\u4FDD\u7559\u672C\u6B21\u81EA\u5B9A\u4E49\u526F\u672C\u3002` });
  });
  return issues;
}

// src/configStudio/structureRoleIndex.ts
var STRUCTURE_CONTEXT_ID = "structure-role-context";
var recordPath = (record) => {
  const fi = record.featureInfo ?? {}, sig = record.meta.sig ?? {};
  return { class: record.meta.Class ?? String(fi.Class ?? ""), kind: fi.Kind ?? sig.Kind, skind: fi.SKind ?? fi.Skind ?? sig.SKind ?? sig.Skind, skind2: fi.SKind2 ?? fi.Skind2 ?? sig.SKind2 ?? sig.Skind2 };
};
var recordValue = (record, key2) => key2 === "ID" ? record.featureInfo?.ID ?? record.meta.idValue : key2.split(".").reduce((value, key3) => value && typeof value === "object" ? value[key3] : void 0, record.featureInfo);
var recordWorld = (record) => normalizeRuleSourceWorldId(String(record.featureInfo?.World ?? record.meta.World ?? ""));
var recordId = (record) => String(recordValue(record, "ID") ?? "").trim();
var values = (record, key2) => {
  if (!key2) return [];
  const value = recordValue(record, key2);
  return (Array.isArray(value) ? value : [value]).flatMap((value2) => typeof value2 === "string" || typeof value2 === "number" ? [String(value2).trim()].filter(Boolean) : value2 && typeof value2 === "object" && "ID" in value2 && typeof value2.ID === "string" ? [value2.ID.trim()].filter(Boolean) : []);
};
var cache3 = /* @__PURE__ */ new WeakMap();
function buildStructureIndex(config, store) {
  const existing = cache3.get(store)?.get(config);
  if (existing) return existing;
  const result = { byUid: /* @__PURE__ */ new Map(), roles: /* @__PURE__ */ new Map(), hostsByMember: /* @__PURE__ */ new Map(), membersByHost: /* @__PURE__ */ new Map(), diagnostics: [] }, ids = /* @__PURE__ */ new Map();
  const key2 = (record, id = recordId(record)) => `${recordWorld(record)}/${id}`;
  for (const record of store.all) {
    if (record.featureInfo?.__disabled || record.meta.disabled) continue;
    result.byUid.set(record.uid, record);
    const id = recordId(record);
    if (id) {
      const rows = ids.get(key2(record)) ?? [];
      rows.push(record);
      ids.set(key2(record), rows);
    }
    const role = resolveNodeFieldSettings(config, recordPath(record)).value.structure;
    if (role?.enabled) result.roles.set(record, role);
  }
  const add = (host, member) => {
    const previous = result.hostsByMember.get(member);
    if (previous && previous !== host) {
      result.hostsByMember.delete(member);
      result.diagnostics.push({ code: "structure-host-ambiguous", record: member.uid, message: "\u9644\u5C5E\u8BB0\u5F55\u540C\u65F6\u6307\u5411\u591A\u4E2A\u4E3B\u7ED3\u6784\uFF0C\u672A\u81EA\u52A8\u9009\u62E9\u3002" });
      return;
    }
    result.hostsByMember.set(member, host);
  };
  const ambiguousMembers = /* @__PURE__ */ new Set();
  for (const [member, role] of result.roles) if (role.role === "member") {
    if (!structureSelector(result, member)) result.diagnostics.push({ code: "structure-selector-missing", record: member.uid, message: "\u9644\u5C5E\u8BB0\u5F55\u7F3A\u5C11\u6709\u6548\u7684\u5C42\u7EA7\u503C\u3002" });
    const refs = values(member, role.hostField);
    if (refs.length > 1) {
      ambiguousMembers.add(member);
      result.diagnostics.push({ code: "structure-host-ambiguous", record: member.uid, message: "\u4E3B\u7ED3\u6784 ID \u4E0D\u662F\u5355\u503C\u3002" });
      continue;
    }
    if (refs.length) {
      const matches = ids.get(key2(member, refs[0])) ?? [];
      if (matches.length > 1) {
        ambiguousMembers.add(member);
        result.diagnostics.push({ code: "structure-id-ambiguous", record: member.uid, message: "\u540C\u4E16\u754C\u76EE\u6807 ID \u91CD\u590D\uFF0C\u672A\u9009\u62E9\u4EFB\u610F\u8BB0\u5F55\u3002" });
      } else if (matches[0] && result.roles.get(matches[0])?.role === "main") add(matches[0], member);
      else result.diagnostics.push({ code: "structure-target-missing", record: member.uid, message: `\u6CA1\u6709\u627E\u5230\u540C\u4E16\u754C\u4E3B\u7ED3\u6784 ${refs[0]}\u3002` });
    }
  }
  for (const [host, role] of result.roles) if (role.role === "main" && role.memberField) for (const id of values(host, role.memberField)) {
    const matches = ids.get(key2(host, id)) ?? [];
    if (matches.length > 1) {
      result.diagnostics.push({ code: "structure-id-ambiguous", record: host.uid, message: `\u540C\u4E16\u754C\u9644\u5C5E ID ${id} \u91CD\u590D\u3002` });
      continue;
    }
    const member = matches[0], memberRole = member ? result.roles.get(member) : void 0;
    if (!member || memberRole?.role !== "member") {
      result.diagnostics.push({ code: "structure-reverse-target-missing", record: host.uid, message: `\u6CA1\u6709\u627E\u5230\u540C\u4E16\u754C\u9644\u5C5E\u7ED3\u6784 ${id}\u3002` });
      continue;
    }
    if (member && memberRole?.role === "member" && !ambiguousMembers.has(member) && !values(member, memberRole.hostField).length) {
      const prior = result.hostsByMember.get(member);
      if (prior && prior !== host) {
        ambiguousMembers.add(member);
        result.hostsByMember.delete(member);
        result.diagnostics.push({ code: "structure-host-ambiguous", record: member.uid, message: "\u591A\u4E2A\u4E3B\u7ED3\u6784\u53CD\u5411\u5F15\u7528\u540C\u4E00\u9644\u5C5E\u8BB0\u5F55\u3002" });
      } else add(host, member);
    }
  }
  for (const [member, role] of result.roles) if (role.role === "member" && !ambiguousMembers.has(member) && !result.hostsByMember.has(member) && !values(member, role.hostField).length) result.diagnostics.push({ code: "structure-target-missing", record: member.uid, message: "\u9644\u5C5E\u8BB0\u5F55\u6CA1\u6709\u4E3B\u7ED3\u6784 ID\uFF0C\u4E5F\u6CA1\u6709\u53EF\u7528\u7684\u4E3B\u7ED3\u6784\u53CD\u5411\u5F15\u7528\u3002" });
  for (const [member, host] of result.hostsByMember) {
    if (ambiguousMembers.has(member)) continue;
    const members = result.membersByHost.get(host) ?? [];
    members.push(member);
    result.membersByHost.set(host, members);
  }
  if (Object.isFrozen(config)) {
    let configs = cache3.get(store);
    if (!configs) {
      configs = /* @__PURE__ */ new WeakMap();
      cache3.set(store, configs);
    }
    configs.set(config, result);
  }
  return result;
}
function structureSelector(index, member) {
  const field = index.roles.get(member)?.selectorField, value = field ? recordValue(member, field) : void 0;
  return typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value) ? String(value).trim() : "";
}
function validateMountedStructureRoles(config, records) {
  if (config.contractRevision < 10 || !records.length) return [];
  const all = records.map((record, index2) => ({ uid: `mounted:${index2}`, type: "Points", featureInfo: record, meta: { Class: String(record.Class ?? ""), Type: "Points", World: record.World, idField: "ID", idValue: String(record.ID ?? ""), sig: {}, signatureKey: `mounted:${index2}`, groups: {} } }));
  const index = buildStructureIndex(config, { all });
  return index.diagnostics.map((diagnostic) => {
    const record = index.byUid.get(diagnostic.record);
    return { severity: diagnostic.code.includes("ambiguous") ? "error" : "warning", code: `mounted-${diagnostic.code}`, path: `mounted/${recordId(record)}`, message: diagnostic.message, count: 1, affectedFeatures: [{ id: recordId(record), name: String(record?.featureInfo?.Name ?? "") }] };
  });
}

// src/configStudio/renderRuleConditions.ts
var classificationNames = /* @__PURE__ */ new Set(["class", "kind", "skind", "skind2", "plinekind", "plineskind", "plineskind2", "pgonkind", "pgonskind", "pgonskind2"]);
var dangerous = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function safeConditionPath(path2) {
  return /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(path2) && !path2.split(".").some((part) => dangerous.has(part));
}
function isClassificationConditionField(key2, fields = []) {
  const normalized = key2.replace(/^(tags|Tags)\./, "").toLowerCase();
  if (classificationNames.has(normalized)) return true;
  const field = fields.find((field2) => field2.key === key2);
  return Boolean(field?.sourceRuntimeField && classificationNames.has(field.sourceRuntimeField.replace(/^(tags|Tags)\./, "").toLowerCase()));
}
function validateRenderFields(group, fields, selectable, contractRevision = 11) {
  if (!group) return [];
  const issues = [];
  let leaves = 0;
  const visit = (node, depth) => {
    if (depth > 4) {
      issues.push("\u5B57\u6BB5\u7EC4\u5408\u6700\u591A\u56DB\u5C42\u3002");
      return;
    }
    if ("op" in node) {
      if (node.formula) {
        try {
          compileRenderFormula(node.formula);
          if (contractRevision < 12 && formulaContradiction(node.formula)) issues.push("\u6761\u4EF6\u516C\u5F0F\u5B58\u5728\u53EF\u8BC1\u660E\u7684\u77DB\u76FE\uFF0C\u65E0\u6CD5\u547D\u4E2D\u3002");
        } catch (error) {
          issues.push(String(error instanceof Error ? error.message : error));
        }
        if (node.items.length) issues.push("\u516C\u5F0F\u4E0E\u65E7\u7EC4\u5408\u4E0D\u80FD\u540C\u65F6\u5305\u542B\u6761\u4EF6\u884C\u3002");
        node.formula.terms.forEach((term) => {
          if (!["AND", "OR", "NOT"].includes(term.relation)) issues.push("\u6761\u4EF6\u884C\u5173\u7CFB\u65E0\u6548\u3002");
          visit(term.condition, 0);
        });
        return;
      }
      if (!["all", "any", "not"].includes(node.op) || !node.items.length || node.op === "not" && node.items.length !== 1) issues.push("\u7EC4\u5408\u5FC5\u987B\u4E3A\u975E\u7A7A AND/OR\uFF0C\u6216\u53EA\u5305\u542B\u4E00\u9879\u7684 NOT\u3002");
      node.items.forEach((item) => visit(item, depth + 1));
      return;
    }
    leaves++;
    if (!safeConditionPath(node.field) || isClassificationConditionField(node.field, fields)) issues.push(`\u6761\u4EF6\u5B57\u6BB5 ${node.field} \u662F\u5206\u7C7B\u5B57\u6BB5\u3001\u522B\u540D\u6216\u5371\u9669\u8DEF\u5F84\uFF0C\u4E0D\u80FD\u7528\u4E8E\u89C4\u5219\u6761\u4EF6\u3002`);
    else if (!selectable.includes(node.field) && !/^(tags|extensions)\./.test(node.field)) issues.push(`\u5F53\u524D\u5206\u7C7B\u4E0D\u5B58\u5728\u6761\u4EF6\u5B57\u6BB5 ${node.field}\u3002`);
    if (node.kind === "fieldIn" && !node.values.length) issues.push("\u5217\u8868\u6761\u4EF6\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u4FDD\u5B58\u503C\u3002");
    if (node.kind === "fieldCompare") {
      const definition = fields.find((field) => field.key === node.field);
      if (!["eq", "ne", "in", "notIn", "present", "empty", "gt", "ge", "lt", "le"].includes(node.operator)) issues.push("\u5B57\u6BB5\u6BD4\u8F83\u5173\u7CFB\u65E0\u6548\u3002");
      if (!["present", "empty"].includes(node.operator)) {
        if (!definition) issues.push(`\u6807\u91CF\u6BD4\u8F83\u9700\u8981\u5DF2\u5B9A\u4E49\u5B57\u6BB5 ${node.field}\u3002`);
        else {
          const values2 = ["in", "notIn"].includes(node.operator) ? node.values : [node.value];
          if (!values2?.length) issues.push("\u6BD4\u8F83\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u503C\u3002");
          else for (const value of values2) issues.push(...scalarValueErrors(definition, value));
          if (["gt", "ge", "lt", "le"].includes(node.operator) && definition.type !== "number" && !(definition.type === "enum" && definition.optionValueType === "number")) issues.push("\u5927\u5C0F\u6BD4\u8F83\u53EA\u80FD\u7528\u4E8E\u6570\u503C\u5B57\u6BB5\u3002");
        }
      }
    }
  };
  visit(group, 0);
  if (leaves > (group.formula ? 256 : 64)) issues.push(`\u5B57\u6BB5\u6761\u4EF6\u6700\u591A ${group.formula ? 256 : 64} \u9879\u3002`);
  if (contractRevision >= 12) {
    if (!issues.length && solveConditionWitness([{ group }], fields).status === "unsatisfiable") issues.push("\u5B57\u6BB5\u6761\u4EF6\u5728\u5B9E\u9645\u53D6\u503C\u57DF\u4E2D\u5B58\u5728\u53EF\u8BC1\u660E\u7684\u77DB\u76FE\uFF0C\u65E0\u6CD5\u547D\u4E2D\u3002");
  } else if (provenFieldContradiction(group)) issues.push("\u5B57\u6BB5\u6761\u4EF6\u5B58\u5728\u53EF\u8BC1\u660E\u7684\u77DB\u76FE\uFF0C\u65E0\u6CD5\u547D\u4E2D\u3002");
  return issues;
}
function provenFieldContradiction(group) {
  if (group.formula) return false;
  const positive = [], negative = [];
  const collect = (node, negate = false) => {
    if (!("op" in node)) {
      if (node.kind !== "fieldCompare") (negate ? negative : positive).push(node);
      return;
    }
    if (node.op === "not" && node.items.length === 1) collect(node.items[0], !negate);
    else if (node.op === "all" && !negate || node.items.length === 1) node.items.forEach((item) => collect(item, negate));
  };
  collect(group);
  for (const field of new Set(positive.map((item) => item.field))) {
    let values2;
    for (const item of positive.filter((item2) => item2.field === field && item2.kind !== "fieldPresent")) {
      const next = new Set(item.kind === "fieldEquals" ? [item.value] : item.kind === "fieldIn" ? item.values : []);
      values2 = values2 ? new Set([...values2].filter((value) => next.has(value))) : next;
    }
    if (values2?.size === 0) return true;
    const present = positive.filter((item) => item.field === field && item.kind === "fieldPresent").map((item) => item.present);
    if (present.includes(true) && present.includes(false)) return true;
    if (values2) for (const value of [...values2]) {
      if (present.includes(true) && !value.length || present.includes(false) && value.length || negative.some((item) => item.field === field && (item.kind === "fieldEquals" ? value === item.value : item.kind === "fieldIn" ? item.values.includes(value) : item.present ? value.length > 0 : value.length === 0))) values2.delete(value);
    }
    if (values2?.size === 0) return true;
  }
  return false;
}
function canonicalRenderFields(group) {
  if (!group) return "true";
  if (group.formula) return JSON.stringify({ expression: group.formula.expression.trim().toUpperCase(), terms: [...group.formula.terms].sort((a, b) => a.id.localeCompare(b.id)).map((t) => ({ id: t.id, condition: t.condition })), groups: [...group.formula.groups ?? []].sort((a, b) => a.id.localeCompare(b.id)) });
  const normalize = (node) => "op" in node ? `${node.op}(${node.items.map(normalize).sort().join(",")})` : node.kind === "fieldIn" ? JSON.stringify({ ...node, values: [...node.values].sort() }) : JSON.stringify(node);
  return normalize(group);
}

// src/configStudio/native-contract-schema.generated.json
var native_contract_schema_generated_default = {
  root: {
    ref: "t0"
  },
  definitions: {
    t1: {
      type: "object",
      properties: {
        zh: {
          type: "string"
        },
        en: {
          type: "string"
        }
      },
      required: [
        "zh",
        "en"
      ]
    },
    t3: {
      type: "object",
      properties: {
        field: {
          const: "World"
        },
        assignment: {
          const: "activeWorld"
        },
        required: {
          const: true
        }
      },
      required: [
        "field",
        "assignment",
        "required"
      ]
    },
    t4: {
      type: "object",
      properties: {
        minZoom: {
          type: "number"
        },
        activationRadiusPx: {
          type: "number"
        },
        retainRadiusPx: {
          type: "number"
        }
      },
      required: [
        "minZoom",
        "activationRadiusPx",
        "retainRadiusPx"
      ]
    },
    t5: {
      type: "object",
      properties: {
        polygonMinScreenAreaPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        lineMinScreenLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: []
    },
    t9: {
      type: "object",
      properties: {
        kind: {
          anyOf: [
            {
              const: "circle"
            },
            {
              const: "pin"
            }
          ]
        },
        radius: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        size: {
          anyOf: [
            {
              type: "array",
              tuple: [
                {
                  type: "number"
                },
                {
                  type: "number"
                }
              ]
            }
          ]
        }
      },
      required: [
        "kind"
      ]
    },
    t10: {
      type: "object",
      properties: {
        color: {
          type: "string"
        },
        width: {
          type: "number"
        },
        opacity: {
          type: "number"
        }
      },
      required: [
        "color",
        "width",
        "opacity"
      ]
    },
    t12: {
      type: "object",
      properties: {
        value: {
          anyOf: [
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        color: {
          type: "string"
        }
      },
      required: [
        "value",
        "color"
      ]
    },
    t11: {
      type: "object",
      properties: {
        mode: {
          const: "valueMap"
        },
        field: {
          type: "string"
        },
        entries: {
          type: "array",
          items: {
            ref: "t12"
          }
        },
        fallbackColor: {
          type: "string"
        }
      },
      required: [
        "mode",
        "field",
        "entries",
        "fallbackColor"
      ]
    },
    t13: {
      type: "object",
      properties: {
        mode: {
          const: "fixed"
        },
        color: {
          type: "string"
        }
      },
      required: [
        "mode",
        "color"
      ]
    },
    t14: {
      type: "object",
      properties: {
        mode: {
          const: "field"
        },
        field: {
          type: "string"
        },
        fallbackColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "mode",
        "field"
      ]
    },
    t16: {
      type: "object",
      properties: {
        class: {
          type: "string"
        },
        kind: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        skind: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        skind2: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "class"
      ]
    },
    t15: {
      type: "object",
      properties: {
        mode: {
          const: "external"
        },
        target: {
          ref: "t16"
        },
        targetIdField: {
          type: "string"
        },
        targetColorField: {
          type: "string"
        },
        fallbackColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "mode",
        "target",
        "targetIdField",
        "targetColorField"
      ]
    },
    t17: {
      type: "object",
      properties: {
        mode: {
          const: "relatedLine"
        },
        strategy: {
          anyOf: [
            {
              const: "featureRelation"
            },
            {
              const: "platformFirstLine"
            },
            {
              const: "stationFirstPlatform"
            }
          ]
        },
        fallbackColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "mode",
        "strategy"
      ]
    },
    t8: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        strokeColor: {
          type: "string"
        },
        strokeWidth: {
          type: "number"
        },
        strokeOpacity: {
          type: "number"
        },
        fillColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fillOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        zIndexOffset: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        forceShowLabel: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        labelPriority: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        symbol: {
          anyOf: [
            {
              ref: "t9"
            }
          ]
        },
        outline: {
          anyOf: [
            {
              ref: "t10"
            }
          ]
        },
        dashArray: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        strokeColorBinding: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        }
      },
      required: [
        "enabled",
        "strokeColor",
        "strokeWidth",
        "strokeOpacity"
      ]
    },
    t7: {
      type: "object",
      properties: {
        hover: {
          ref: "t8"
        },
        selected: {
          ref: "t8"
        },
        searchResult: {
          ref: "t8"
        },
        editing: {
          ref: "t8"
        },
        deletionMarked: {
          ref: "t8"
        },
        hitTolerancePx: {
          type: "number"
        }
      },
      required: [
        "hover",
        "selected",
        "searchResult",
        "editing",
        "deletionMarked",
        "hitTolerancePx"
      ]
    },
    t6: {
      type: "object",
      properties: {
        Point: {
          ref: "t7"
        },
        LineString: {
          ref: "t7"
        },
        Polygon: {
          ref: "t7"
        }
      },
      required: [
        "Point",
        "LineString",
        "Polygon"
      ]
    },
    t18: {
      type: "object",
      properties: {
        overlay: {
          type: "string"
        },
        "overlay-top": {
          type: "string"
        },
        point: {
          type: "string"
        },
        "point-top": {
          type: "string"
        }
      },
      required: [
        "overlay",
        "overlay-top",
        "point",
        "point-top"
      ]
    },
    t21: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "override"
            }
          ]
        },
        minScreenAreaPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        minScreenLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t22: {
      type: "object",
      properties: {
        maxChars: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        minChars: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        multiline: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        maxLines: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        suffix: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        abbreviationEnabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        emptyBehavior: {
          anyOf: [
            {
              const: "hide"
            },
            {
              const: "showID"
            },
            {
              const: "showKind"
            },
            {
              const: "placeholder"
            }
          ]
        },
        opacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: []
    },
    t23: {
      type: "object",
      properties: {
        profile: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "standard"
            },
            {
              const: "network"
            },
            {
              const: "strict-on-line"
            }
          ]
        },
        mode: {
          anyOf: [
            {
              const: "free"
            },
            {
              const: "strictOnLine"
            }
          ]
        },
        endpointPaddingRatio: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        endpointPaddingMinPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxTurnAngleDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        minLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textMode: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "rotatedLabel"
            },
            {
              const: "textPath"
            }
          ]
        },
        anchorSamples: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateSpacing: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateMinSpacing: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateMax: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        shortThresholdMultiplier: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        longMode: {
          anyOf: [
            {
              const: "evenSplit"
            }
          ]
        },
        preferPreviousCandidate: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        candidateHysteresisPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMinLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathPaddingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMaxAngleDeltaDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMaxTotalBendDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathPreferReadableDirection: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        textPathFallback: {
          anyOf: [
            {
              const: "hide"
            },
            {
              const: "rotatedLabel"
            },
            {
              const: "svgStraightLabel"
            }
          ]
        },
        textPathCollisionPaddingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathLetterSpacingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathCurvedLetterSpacingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathCurvedSpacingMinBendDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        orientationPolicy: {
          anyOf: [
            {
              const: "autoCjkUpright"
            },
            {
              const: "alwaysTextPath"
            },
            {
              const: "alwaysRotated"
            },
            {
              const: "scriptAware"
            }
          ]
        },
        textPathLengthMode: {
          anyOf: [
            {
              const: "fixed"
            },
            {
              const: "actualText"
            }
          ]
        },
        textPathVerticalAngleThresholdDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathVerticalLengthRatio: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateOrdering: {
          anyOf: [
            {
              const: "startToEnd"
            },
            {
              const: "centerOut"
            }
          ]
        },
        candidateWeightMode: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "distanceToCenter"
            }
          ]
        },
        candidateSwitchThreshold: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateReuseBonus: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        candidateViewportPreference: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        candidateEdgePenalty: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        centerWeightMode: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "distanceToCenter"
            }
          ]
        },
        centerSwitchThreshold: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        centerReuseBonus: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkVerticalRenderMode: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "legacyVertical"
            },
            {
              const: "svgVertical"
            }
          ]
        },
        svgVerticalCjkMinLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        svgVerticalCjkLetterSpacingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        advancedTextEnabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        advancedTextBudgetGroup: {
          anyOf: [
            {
              const: "network"
            },
            {
              const: "none"
            },
            {
              const: "surface"
            }
          ]
        },
        advancedTextMaxLabels: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        advancedTextMaxCandidatesPerPass: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphRotationPolicy: {
          anyOf: [
            {
              const: "uprightWhenSteep"
            },
            {
              const: "followLine"
            },
            {
              const: "alwaysUpright"
            }
          ]
        },
        cjkGlyphUprightAngleThresholdDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphPathMode: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "off"
            },
            {
              const: "force"
            }
          ]
        },
        cjkGlyphSpacingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphCollisionPaddingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphMinPathLengthPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphMaxCount: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphMaxAngleDeltaDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphMaxTotalBendDeg: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphPreferReadableDirection: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        cjkGlyphAllowTextPathFallback: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        textPathHalfLengthMultiplier: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMinHalfLengthWorld: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMaxHalfLengthWorld: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textPathMaxHalfLengthRatio: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        textCollisionRectMode: {
          anyOf: [
            {
              const: "pathBox"
            },
            {
              const: "textBox"
            },
            {
              const: "compactTextBox"
            }
          ]
        },
        cjkGlyphCompactMode: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "off"
            }
          ]
        },
        cjkGlyphMinAdvanceScale: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cjkGlyphFallbackMode: {
          anyOf: [
            {
              const: "hide"
            },
            {
              const: "rotatedLabel"
            },
            {
              const: "simpleLineLabel"
            },
            {
              const: "textPathIfAllowed"
            }
          ]
        },
        simpleFallbackEnabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        simpleFallbackRotate: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        repositionMode: {
          anyOf: [
            {
              const: "off"
            },
            {
              const: "chainageSearch"
            }
          ]
        },
        repositionAttemptsPerDirection: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        repositionStepMode: {
          anyOf: [
            {
              const: "labelSpan"
            },
            {
              const: "fixedWorld"
            },
            {
              const: "fixedPx"
            }
          ]
        },
        repositionFailure: {
          anyOf: [
            {
              const: "hide"
            },
            {
              const: "simpleLineLabel"
            }
          ]
        },
        repositionStrictSvg: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        avoidLineGeometry: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        avoidPolygonGeometry: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        avoidPointSymbols: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        repositionCollisionScope: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "lineLabel"
                  },
                  {
                    const: "surfaceLabel"
                  },
                  {
                    const: "pointLabel"
                  },
                  {
                    const: "pointSymbol"
                  },
                  {
                    const: "requiredLabel"
                  },
                  {
                    const: "selectedLabel"
                  },
                  {
                    const: "searchResultLabel"
                  }
                ]
              }
            }
          ]
        },
        viewportRectMode: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "rawMetrics"
            },
            {
              const: "anchorNormalized"
            }
          ]
        },
        viewportCandidateMode: {
          anyOf: [
            {
              const: "off"
            },
            {
              const: "stableFirstViewportFallback"
            }
          ]
        },
        viewportCandidateBufferPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        viewportCandidateMaxTargets: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        viewportCandidateMinIntervalPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "profile"
      ]
    },
    t25: {
      type: "object",
      properties: {
        x: {
          type: "number"
        },
        y: {
          type: "number"
        }
      },
      required: [
        "x",
        "y"
      ]
    },
    t26: {
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        x: {
          type: "number"
        },
        y: {
          type: "number"
        }
      },
      required: [
        "name",
        "x",
        "y"
      ]
    },
    t24: {
      type: "object",
      properties: {
        candidatePlacement: {
          anyOf: [
            {
              const: "relativeToPlacement"
            },
            {
              const: "aroundAnchor"
            }
          ]
        },
        strategy: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "featureCenter"
            },
            {
              const: "interior"
            },
            {
              const: "visibleInterior"
            },
            {
              const: "lineCenter"
            },
            {
              const: "lineCandidates"
            }
          ]
        },
        candidates: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "C"
                  },
                  {
                    const: "N"
                  },
                  {
                    const: "S"
                  },
                  {
                    const: "E"
                  },
                  {
                    const: "W"
                  },
                  {
                    const: "NE"
                  },
                  {
                    const: "NW"
                  },
                  {
                    const: "SE"
                  },
                  {
                    const: "SW"
                  }
                ]
              }
            }
          ]
        },
        offsetPx: {
          anyOf: [
            {
              ref: "t25"
            }
          ]
        },
        candidateOffsetsPx: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t26"
              }
            }
          ]
        },
        allowOutsideGeometry: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        requireInsideGeometry: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        preferViewportCenter: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t27: {
      type: "object",
      properties: {
        weightMode: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "distanceToCenter"
            }
          ]
        },
        weightedSwitchThreshold: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        reuseBonus: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        viewportPreference: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        edgePenalty: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        mode: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "none"
            },
            {
              const: "fixedInterior"
            },
            {
              const: "autoInteriorGrid"
            },
            {
              const: "largeFeatureGrid"
            },
            {
              const: "viewportAwareCandidateSet"
            },
            {
              const: "gridByWorldUnits"
            }
          ]
        },
        count: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        gridSize: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        gridMinSize: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxCandidates: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        scanMax: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        overflow: {
          anyOf: [
            {
              const: "rankedPrune"
            },
            {
              const: "seededPrune"
            }
          ]
        },
        preferPreviousCandidate: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        switchThreshold: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        allowViewportFallback: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        minScreenAreaPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        preferViewportCenter: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t29: {
      type: "object",
      properties: {
        x: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        y: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        width: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        height: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: []
    },
    t28: {
      type: "object",
      properties: {
        boundsAdjustment: {
          anyOf: [
            {
              ref: "t29"
            }
          ]
        },
        collideWith: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "symbol"
                  },
                  {
                    const: "requiredLabel"
                  },
                  {
                    const: "importantLabel"
                  },
                  {
                    const: "optionalLabel"
                  },
                  {
                    const: "softLabel"
                  },
                  {
                    const: "geometry"
                  }
                ]
              }
            }
          ]
        },
        blocks: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "optionalLabel"
                  },
                  {
                    const: "softLabel"
                  },
                  {
                    const: "poiLabel"
                  },
                  {
                    const: "structureLabel"
                  }
                ]
              }
            }
          ]
        },
        allowOverlap: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        paddingPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        hidePolicy: {
          anyOf: [
            {
              const: "hide"
            },
            {
              const: "abbreviateThenHide"
            },
            {
              const: "forceShow"
            },
            {
              const: "showWithoutBlocking"
            },
            {
              const: "geometryOnly"
            }
          ]
        }
      },
      required: []
    },
    t30: {
      type: "object",
      properties: {
        enabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        cacheKey: {
          anyOf: [
            {
              const: "featureID"
            },
            {
              const: "featureID+zoomBucket"
            },
            {
              const: "featureID+mode"
            },
            {
              const: "custom"
            }
          ]
        },
        zoomBucketSize: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        freezeDuringPan: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        recomputeOnMoveEnd: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        recomputeOnZoomEnd: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        hysteresisPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        keepPreviousCandidate: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        keepPreviousAnchor: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        invalidateWhen: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "zoomBucketChanged"
                  },
                  {
                    const: "featureGeometryChanged"
                  },
                  {
                    const: "featureTextChanged"
                  },
                  {
                    const: "modeChanged"
                  },
                  {
                    const: "worldChanged"
                  },
                  {
                    const: "labelOutOfViewport"
                  },
                  {
                    const: "collisionFailedRepeatedly"
                  }
                ]
              }
            }
          ]
        }
      },
      required: []
    },
    t31: {
      type: "object",
      properties: {
        enabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        mode: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "override"
            }
          ]
        },
        gridSizePx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxLabelsPerGrid: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxSymbolsPerGrid: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        reduceOrder: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "geometryOnly"
                  },
                  {
                    const: "hideSoftLabels"
                  },
                  {
                    const: "abbreviateOptionalLabels"
                  },
                  {
                    const: "hideOptionalLabels"
                  },
                  {
                    const: "hideSymbols"
                  }
                ]
              }
            }
          ]
        },
        importanceField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        preserveSelected: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        preserveRequired: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t32: {
      type: "object",
      properties: {
        whenNoLabelText: {
          anyOf: [
            {
              const: "showID"
            },
            {
              const: "placeholder"
            },
            {
              const: "hideLabel"
            },
            {
              const: "showClassKind"
            }
          ]
        },
        whenCollisionFailed: {
          anyOf: [
            {
              const: "forceShow"
            },
            {
              const: "hideLabel"
            },
            {
              const: "abbreviate"
            },
            {
              const: "showGeometryOnly"
            }
          ]
        },
        whenRuleMissing: {
          anyOf: [
            {
              const: "geometryOnly"
            },
            {
              const: "hidden"
            },
            {
              const: "debugDefault"
            },
            {
              const: "legacyDefault"
            }
          ]
        },
        whenGeometryInvalid: {
          anyOf: [
            {
              const: "skip"
            },
            {
              const: "showErrorMarker"
            },
            {
              const: "debugOnly"
            }
          ]
        }
      },
      required: []
    },
    t34: {
      type: "object",
      properties: {
        target: {
          ref: "t16"
        },
        sourceField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        targetField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        behavior: {
          anyOf: [
            {
              const: "hideIfExists"
            },
            {
              const: "showIfExists"
            }
          ]
        }
      },
      required: [
        "target",
        "behavior"
      ]
    },
    t35: {
      type: "object",
      properties: {
        target: {
          ref: "t16"
        },
        behavior: {
          anyOf: [
            {
              const: "hideIfExists"
            },
            {
              const: "showIfExists"
            }
          ]
        },
        targetField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        targetEquals: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        targetNotEquals: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        precision: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "target",
        "behavior"
      ]
    },
    t36: {
      type: "object",
      properties: {
        field: {
          type: "string"
        },
        primaryValue: {
          type: "string"
        },
        overlayValues: {
          type: "array",
          items: {
            type: "string"
          }
        },
        switchZoom: {
          type: "number"
        },
        precision: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "field",
        "primaryValue",
        "overlayValues",
        "switchZoom"
      ]
    },
    t37: {
      type: "object",
      properties: {
        bindingId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        requireSelector: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t33: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "inherit"
            },
            {
              const: "always"
            },
            {
              const: "sameId"
            },
            {
              const: "coincidentPoint"
            },
            {
              const: "lineContainmentChoice"
            },
            {
              const: "activeContextMember"
            }
          ]
        },
        sameId: {
          anyOf: [
            {
              ref: "t34"
            }
          ]
        },
        coincidentPoint: {
          anyOf: [
            {
              ref: "t35"
            }
          ]
        },
        lineContainmentChoice: {
          anyOf: [
            {
              ref: "t36"
            }
          ]
        },
        activeContextMember: {
          anyOf: [
            {
              ref: "t37"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t39: {
      type: "object",
      properties: {
        enabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        strokeColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        strokeWidth: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        strokeOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        fillColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fillOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        zIndexOffset: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        forceShowLabel: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        labelPriority: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        symbol: {
          anyOf: [
            {
              ref: "t9"
            }
          ]
        },
        outline: {
          anyOf: [
            {
              ref: "t10"
            }
          ]
        },
        dashArray: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        strokeColorBinding: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        }
      },
      required: []
    },
    t38: {
      type: "object",
      properties: {
        hover: {
          anyOf: [
            {
              ref: "t39"
            }
          ]
        },
        selected: {
          anyOf: [
            {
              ref: "t39"
            }
          ]
        },
        searchResult: {
          anyOf: [
            {
              ref: "t39"
            }
          ]
        },
        editing: {
          anyOf: [
            {
              ref: "t39"
            }
          ]
        },
        deletionMarked: {
          anyOf: [
            {
              ref: "t39"
            }
          ]
        }
      },
      required: []
    },
    t20: {
      type: "object",
      properties: {
        screenGate: {
          anyOf: [
            {
              ref: "t21"
            }
          ]
        },
        pane: {
          anyOf: [
            {
              const: "auto"
            },
            {
              const: "overlay"
            },
            {
              const: "overlay-top"
            },
            {
              const: "point"
            },
            {
              const: "point-top"
            }
          ]
        },
        hitTolerancePx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        labelText: {
          anyOf: [
            {
              ref: "t22"
            }
          ]
        },
        lineLabel: {
          anyOf: [
            {
              ref: "t23"
            }
          ]
        },
        anchor: {
          anyOf: [
            {
              ref: "t24"
            }
          ]
        },
        polygonCandidates: {
          anyOf: [
            {
              ref: "t27"
            }
          ]
        },
        collision: {
          anyOf: [
            {
              ref: "t28"
            }
          ]
        },
        stability: {
          anyOf: [
            {
              ref: "t30"
            }
          ]
        },
        density: {
          anyOf: [
            {
              ref: "t31"
            }
          ]
        },
        fallback: {
          anyOf: [
            {
              ref: "t32"
            }
          ]
        },
        visibility: {
          anyOf: [
            {
              ref: "t33"
            }
          ]
        },
        interaction: {
          anyOf: [
            {
              ref: "t38"
            }
          ]
        }
      },
      required: []
    },
    t19: {
      type: "object",
      properties: {
        Point: {
          anyOf: [
            {
              ref: "t20"
            }
          ]
        },
        LineString: {
          anyOf: [
            {
              ref: "t20"
            }
          ]
        },
        Polygon: {
          anyOf: [
            {
              ref: "t20"
            }
          ]
        }
      },
      required: []
    },
    t2: {
      type: "object",
      properties: {
        world: {
          ref: "t3"
        },
        contextView: {
          ref: "t4"
        },
        screenGateDefaults: {
          ref: "t5"
        },
        interactionBaselines: {
          ref: "t6"
        },
        paneDefaults: {
          ref: "t18"
        },
        renderDefaults: {
          anyOf: [
            {
              ref: "t19"
            }
          ]
        }
      },
      required: [
        "world",
        "contextView",
        "screenGateDefaults",
        "interactionBaselines",
        "paneDefaults"
      ]
    },
    t42: {
      type: "object",
      properties: {
        value: {
          type: "string"
        },
        label: {
          ref: "t1"
        }
      },
      required: [
        "value",
        "label"
      ]
    },
    t41: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        options: {
          type: "array",
          items: {
            ref: "t42"
          }
        }
      },
      required: [
        "id",
        "label",
        "options"
      ]
    },
    t44: {
      type: "object",
      properties: {
        key: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        type: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "boolean"
            },
            {
              const: "text"
            },
            {
              const: "select"
            }
          ]
        },
        options: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        }
      },
      required: [
        "key",
        "label",
        "type"
      ]
    },
    t43: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        allowedClasses: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        optionSchema: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t44"
              }
            }
          ]
        }
      },
      required: [
        "id",
        "label"
      ]
    },
    t40: {
      type: "object",
      properties: {
        optionSets: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t41"
              }
            }
          ]
        },
        cardLayouts: {
          type: "array",
          items: {
            ref: "t43"
          }
        },
        cardComponents: {
          type: "array",
          items: {
            ref: "t43"
          }
        },
        displayProfiles: {
          type: "array",
          items: {
            ref: "t43"
          }
        },
        specialDisplayLogic: {
          type: "array",
          items: {
            ref: "t43"
          }
        },
        workflowControls: {
          type: "array",
          items: {
            ref: "t43"
          }
        },
        workflowBlocks: {
          type: "array",
          items: {
            ref: "t43"
          }
        }
      },
      required: [
        "cardLayouts",
        "cardComponents",
        "displayProfiles",
        "specialDisplayLogic",
        "workflowControls",
        "workflowBlocks"
      ]
    },
    t48: {
      type: "object",
      properties: {
        valueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        rows: {
          type: "array",
          items: {
            ref: "t42"
          }
        }
      },
      required: [
        "valueType",
        "rows"
      ]
    },
    t47: {
      type: "object",
      properties: {
        kind: {
          const: "tagField"
        },
        type: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "text"
            },
            {
              const: "select"
            },
            {
              const: "bool"
            }
          ]
        },
        format: {
          anyOf: [
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            }
          ]
        },
        valueTable: {
          anyOf: [
            {
              ref: "t48"
            }
          ]
        },
        valueTableId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "kind",
        "type"
      ]
    },
    t50: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        x: {
          type: "number"
        },
        y: {
          type: "number"
        },
        z: {
          type: "number"
        }
      },
      required: [
        "id",
        "label",
        "x",
        "y",
        "z"
      ]
    },
    t49: {
      type: "object",
      properties: {
        world: {
          type: "string"
        },
        range: {
          type: "number"
        },
        returnPoints: {
          type: "array",
          items: {
            ref: "t50"
          }
        }
      },
      required: [
        "world",
        "range",
        "returnPoints"
      ]
    },
    t46: {
      type: "object",
      properties: {
        value: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        functionValue: {
          anyOf: [
            {
              type: "number"
            },
            {
              ref: "t47"
            },
            {
              ref: "t49"
            }
          ]
        }
      },
      required: [
        "value",
        "label"
      ]
    },
    t45: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        valueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        functionKind: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "speed"
            },
            {
              const: "teleportHub"
            },
            {
              const: "tagField"
            }
          ]
        },
        rows: {
          type: "array",
          items: {
            ref: "t46"
          }
        }
      },
      required: [
        "id",
        "label",
        "valueType",
        "functionKind",
        "rows"
      ]
    },
    t53: {
      type: "object",
      properties: {
        zh: {
          type: "string"
        },
        en: {
          type: "string"
        }
      },
      required: [
        "zh",
        "en"
      ]
    },
    t54: {
      type: "object",
      properties: {
        x: {
          type: "number"
        },
        y: {
          type: "number"
        },
        z: {
          type: "number"
        }
      },
      required: [
        "x",
        "y",
        "z"
      ]
    },
    t55: {
      type: "object",
      properties: {
        id: {
          const: "dynmap-flat"
        },
        worldToMap: {
          type: "array",
          items: {
            type: "number"
          }
        },
        mapToWorld: {
          type: "array",
          items: {
            type: "number"
          }
        },
        mapzoomin: {
          type: "number"
        },
        mapzoomout: {
          type: "number"
        },
        tileSize: {
          const: 128
        },
        tilescale: {
          type: "number"
        }
      },
      required: [
        "id",
        "worldToMap",
        "mapToWorld",
        "mapzoomin",
        "mapzoomout",
        "tileSize",
        "tilescale"
      ]
    },
    t56: {
      type: "object",
      properties: {
        baseUrl: {
          type: "string"
        },
        filteredBaseUrl: {
          type: "string"
        },
        prefix: {
          type: "string"
        },
        imageFormat: {
          anyOf: [
            {
              const: "jpg"
            },
            {
              const: "png"
            },
            {
              const: "webp"
            }
          ]
        },
        extraZoomLevels: {
          type: "number"
        },
        minNativeZoom: {
          type: "number"
        },
        maxNativeZoom: {
          type: "number"
        },
        attribution: {
          type: "string"
        },
        maxRetries: {
          type: "number"
        },
        retryDelay: {
          type: "number"
        }
      },
      required: [
        "baseUrl",
        "filteredBaseUrl",
        "prefix",
        "imageFormat",
        "extraZoomLevels",
        "minNativeZoom",
        "maxNativeZoom",
        "attribution",
        "maxRetries",
        "retryDelay"
      ]
    },
    t52: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prefix: {
          type: "string"
        },
        numericCode: {
          type: "number"
        },
        label: {
          ref: "t53"
        },
        enabled: {
          type: "boolean"
        },
        default: {
          type: "boolean"
        },
        center: {
          ref: "t54"
        },
        mapLink: {
          type: "string"
        },
        remoteWorldId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        dataSourceId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        projection: {
          anyOf: [
            {
              ref: "t55"
            }
          ]
        },
        tiles: {
          anyOf: [
            {
              ref: "t56"
            }
          ]
        },
        projectionOverride: {
          anyOf: [
            {
              ref: "t55"
            }
          ]
        }
      },
      required: [
        "id",
        "prefix",
        "numericCode",
        "label",
        "enabled",
        "default",
        "center",
        "mapLink"
      ]
    },
    t58: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    t61: {
      type: "object",
      properties: {
        class: {
          type: "string"
        },
        kind: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        skind: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        skind2: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "class"
      ]
    },
    t60: {
      type: "object",
      properties: {
        paths: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t61"
              }
            }
          ]
        },
        classCode: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        kind: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        skind: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        skind2: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        }
      },
      required: []
    },
    t63: {
      type: "object",
      properties: {
        targetId: {
          type: "string"
        },
        mode: {
          anyOf: [
            {
              const: "enableWhenThisEnabled"
            },
            {
              const: "disableWhenThisEnabled"
            },
            {
              const: "mirrorThisState"
            }
          ]
        }
      },
      required: [
        "targetId",
        "mode"
      ]
    },
    t62: {
      type: "object",
      properties: {
        exclusiveWith: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        exclusiveGroup: {
          anyOf: [
            {
              type: "null"
            },
            {
              type: "string"
            }
          ]
        },
        linkedButtons: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t63"
              }
            }
          ]
        },
        disableWhenEnabled: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        enableWhenEnabled: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        persistState: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t59: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        tone: {
          anyOf: [
            {
              const: "blue"
            },
            {
              const: "green"
            },
            {
              const: "cyan"
            },
            {
              const: "purple"
            },
            {
              const: "gray"
            },
            {
              const: "orange"
            },
            {
              const: "slate"
            },
            {
              const: "red"
            },
            {
              const: "teal"
            },
            {
              const: "pink"
            },
            {
              const: "amber"
            },
            {
              const: "indigo"
            }
          ]
        },
        iconKey: {
          type: "string"
        },
        defaultEnabled: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        criteria: {
          ref: "t60"
        },
        behavior: {
          anyOf: [
            {
              ref: "t62"
            }
          ]
        },
        names: {
          ref: "t53"
        },
        size: {
          anyOf: [
            {
              const: 28
            },
            {
              const: 36
            },
            {
              const: 44
            }
          ]
        },
        group: {
          type: "string"
        }
      },
      required: [
        "id",
        "tone",
        "iconKey",
        "criteria",
        "names",
        "size",
        "group"
      ]
    },
    t57: {
      type: "object",
      properties: {
        storageKey: {
          type: "string"
        },
        legacyStorageKeys: {
          type: "array",
          items: {
            type: "string"
          }
        },
        maxActive: {
          type: "number"
        },
        fallback: {
          type: "array",
          items: {
            type: "string"
          }
        },
        byWorld: {
          ref: "t58"
        },
        items: {
          type: "array",
          items: {
            ref: "t59"
          }
        }
      },
      required: [
        "storageKey",
        "legacyStorageKeys",
        "maxActive",
        "fallback",
        "byWorld",
        "items"
      ]
    },
    t65: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t53"
        },
        enabled: {
          type: "boolean"
        },
        selectable: {
          type: "boolean"
        },
        readerKind: {
          const: "formal-release-v2"
        },
        readerSchemaVersion: {
          const: "openriamap.formal-release-reader.v2"
        },
        rootUrl: {
          type: "string"
        },
        mediaRootUrl: {
          type: "string"
        },
        transport: {
          anyOf: [
            {
              const: "direct"
            },
            {
              const: "github-raw-compatible"
            }
          ]
        }
      },
      required: [
        "id",
        "label",
        "enabled",
        "selectable",
        "readerKind",
        "readerSchemaVersion",
        "rootUrl",
        "mediaRootUrl",
        "transport"
      ]
    },
    t66: {
      type: "object",
      properties: {
        sourceIds: {
          type: "array",
          items: {
            type: "string"
          }
        },
        owner: {
          type: "string"
        },
        repo: {
          type: "string"
        },
        branch: {
          type: "string"
        }
      },
      required: [
        "sourceIds",
        "owner",
        "repo",
        "branch"
      ]
    },
    t68: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t53"
        },
        baseUrl: {
          type: "string"
        },
        default: {
          type: "boolean"
        }
      },
      required: [
        "id",
        "label",
        "baseUrl",
        "default"
      ]
    },
    t67: {
      type: "object",
      properties: {
        storageKey: {
          type: "string"
        },
        legacyStorageKeys: {
          type: "array",
          items: {
            type: "string"
          }
        },
        items: {
          type: "array",
          items: {
            ref: "t68"
          }
        }
      },
      required: [
        "storageKey",
        "legacyStorageKeys",
        "items"
      ]
    },
    t64: {
      type: "object",
      properties: {
        storageKey: {
          type: "string"
        },
        defaultSourceId: {
          type: "string"
        },
        selectionMode: {
          anyOf: [
            {
              const: "fixed"
            },
            {
              const: "user-select"
            },
            {
              const: "user-select-on-failure"
            }
          ]
        },
        retryOnFailure: {
          type: "boolean"
        },
        items: {
          type: "array",
          items: {
            ref: "t65"
          }
        },
        github: {
          ref: "t66"
        },
        linkModes: {
          ref: "t67"
        }
      },
      required: [
        "storageKey",
        "defaultSourceId",
        "selectionMode",
        "retryOnFailure",
        "items",
        "github",
        "linkModes"
      ]
    },
    t72: {
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        url: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        legacyText: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "name"
      ]
    },
    t71: {
      type: "object",
      properties: {
        baseUrlTemplate: {
          type: "string"
        },
        filteredAccess: {
          anyOf: [
            {
              const: "direct"
            },
            {
              const: "registered-proxy"
            }
          ]
        },
        proxyId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        legacyFilteredTemplate: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        prefix: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        imageFormat: {
          anyOf: [
            {
              const: "jpg"
            },
            {
              const: "png"
            },
            {
              const: "webp"
            }
          ]
        },
        extraZoomLevels: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        minNativeZoom: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxNativeZoom: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        attribution: {
          ref: "t72"
        },
        maxRetries: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        retryDelay: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "baseUrlTemplate",
        "filteredAccess",
        "attribution"
      ]
    },
    t70: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t53"
        },
        enabled: {
          type: "boolean"
        },
        sources: {
          ref: "t64"
        },
        dataPathTemplate: {
          type: "string"
        },
        mediaPathTemplate: {
          type: "string"
        },
        tiles: {
          ref: "t71"
        }
      },
      required: [
        "id",
        "label",
        "enabled",
        "sources",
        "dataPathTemplate",
        "mediaPathTemplate",
        "tiles"
      ]
    },
    t73: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: {
        type: "string"
      }
    },
    t69: {
      type: "object",
      properties: {
        kind: {
          const: "world-groups"
        },
        defaultGroupId: {
          type: "string"
        },
        sharedInterfaceGroupId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        groups: {
          type: "array",
          items: {
            ref: "t70"
          }
        },
        bindings: {
          ref: "t73"
        }
      },
      required: [
        "kind",
        "defaultGroupId",
        "groups",
        "bindings"
      ]
    },
    t75: {
      type: "object",
      properties: {
        id: {
          anyOf: [
            {
              const: "mapping"
            },
            {
              const: "measurement"
            },
            {
              const: "navigation"
            },
            {
              const: "search"
            },
            {
              const: "review"
            },
            {
              const: "players"
            },
            {
              const: "settings"
            },
            {
              const: "publicReleases"
            }
          ]
        },
        enabled: {
          type: "boolean"
        },
        load: {
          anyOf: [
            {
              const: "eager"
            },
            {
              const: "lazy"
            },
            {
              const: "preload"
            }
          ]
        },
        exclusiveWith: {
          type: "array",
          items: {
            anyOf: [
              {
                const: "mapping"
              },
              {
                const: "measurement"
              },
              {
                const: "navigation"
              },
              {
                const: "search"
              },
              {
                const: "review"
              },
              {
                const: "players"
              },
              {
                const: "settings"
              },
              {
                const: "publicReleases"
              }
            ]
          }
        }
      },
      required: [
        "id",
        "enabled",
        "load",
        "exclusiveWith"
      ]
    },
    t76: {
      type: "object",
      properties: {
        endpoint: {
          type: "string"
        },
        directEndpoint: {
          type: "string"
        },
        mode: {
          anyOf: [
            {
              const: "direct"
            },
            {
              const: "proxy"
            }
          ]
        },
        pollIntervalMs: {
          type: "number"
        },
        requestTimeoutMs: {
          type: "number"
        }
      },
      required: [
        "endpoint",
        "directEndpoint",
        "mode",
        "pollIntervalMs",
        "requestTimeoutMs"
      ]
    },
    t74: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            ref: "t75"
          }
        },
        players: {
          ref: "t76"
        }
      },
      required: [
        "items",
        "players"
      ]
    },
    t78: {
      type: "object",
      properties: {
        start: {
          type: "string"
        },
        session: {
          type: "string"
        },
        logout: {
          type: "string"
        }
      },
      required: [
        "start",
        "session",
        "logout"
      ]
    },
    t79: {
      type: "object",
      properties: {
        oauthClientId: {
          type: "string"
        },
        oauthRedirectUri: {
          type: "string"
        },
        sessionSigning: {
          type: "string"
        },
        controlApiBase: {
          type: "string"
        },
        brokerSecret: {
          type: "string"
        }
      },
      required: [
        "oauthClientId",
        "oauthRedirectUri",
        "sessionSigning",
        "controlApiBase",
        "brokerSecret"
      ]
    },
    t77: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        provider: {
          const: "github-cookie"
        },
        protocol: {
          const: "openriamap-review-v1"
        },
        auth: {
          ref: "t78"
        },
        control: {
          type: "string"
        },
        workflow: {
          type: "string"
        },
        publicReleases: {
          type: "string"
        },
        serverReferences: {
          ref: "t79"
        }
      },
      required: [
        "enabled",
        "provider",
        "protocol",
        "auth",
        "control",
        "workflow",
        "publicReleases",
        "serverReferences"
      ]
    },
    t81: {
      type: "object",
      properties: {
        homepageLimit: {
          type: "number"
        },
        navigationLimit: {
          type: "number"
        },
        debounceMs: {
          type: "number"
        }
      },
      required: [
        "homepageLimit",
        "navigationLimit",
        "debounceMs"
      ]
    },
    t82: {
      type: "object",
      properties: {
        transferWalkSpeed: {
          type: "number"
        },
        railRideSpeed: {
          type: "number"
        },
        transferCostFactor: {
          type: "number"
        },
        normalPlatformTransferCost: {
          type: "number"
        }
      },
      required: [
        "transferWalkSpeed",
        "railRideSpeed",
        "transferCostFactor",
        "normalPlatformTransferCost"
      ]
    },
    t83: {
      type: "object",
      properties: {
        logicalInitialZoom: {
          type: "number"
        },
        leafletOffset: {
          type: "number"
        },
        scrollWheelZoom: {
          type: "boolean"
        },
        doubleClickZoom: {
          type: "boolean"
        },
        dragging: {
          type: "boolean"
        }
      },
      required: [
        "logicalInitialZoom",
        "leafletOffset",
        "scrollWheelZoom",
        "doubleClickZoom",
        "dragging"
      ]
    },
    t84: {
      type: "object",
      properties: {
        position: {
          anyOf: [
            {
              const: "left"
            },
            {
              const: "right"
            }
          ]
        },
        compact: {
          type: "boolean"
        }
      },
      required: [
        "position",
        "compact"
      ]
    },
    t80: {
      type: "object",
      properties: {
        language: {
          anyOf: [
            {
              const: "zh"
            },
            {
              const: "en"
            }
          ]
        },
        search: {
          ref: "t81"
        },
        navigation: {
          ref: "t82"
        },
        map: {
          ref: "t83"
        },
        toolbar: {
          ref: "t84"
        }
      },
      required: [
        "language",
        "search",
        "navigation",
        "map",
        "toolbar"
      ]
    },
    t51: {
      type: "object",
      properties: {
        schemaVersion: {
          const: "cairnmap.application.v1"
        },
        worlds: {
          type: "array",
          items: {
            ref: "t52"
          }
        },
        buttons: {
          ref: "t57"
        },
        sources: {
          anyOf: [
            {
              ref: "t64"
            },
            {
              ref: "t69"
            }
          ]
        },
        modules: {
          ref: "t74"
        },
        review: {
          ref: "t77"
        },
        preferences: {
          ref: "t80"
        }
      },
      required: [
        "schemaVersion",
        "worlds",
        "buttons",
        "sources",
        "modules",
        "review",
        "preferences"
      ]
    },
    t86: {
      type: "object",
      properties: {
        library: {
          const: "pinhead"
        },
        version: {
          type: "string"
        },
        manifestSha256: {
          type: "string"
        }
      },
      required: [
        "library",
        "version",
        "manifestSha256"
      ]
    },
    t85: {
      type: "object",
      properties: {
        iconLibraries: {
          type: "array",
          items: {
            ref: "t86"
          }
        }
      },
      required: [
        "iconLibraries"
      ]
    },
    t88: {
      type: "object",
      properties: {
        class: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        kind: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        skind: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        skind2: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        }
      },
      required: []
    },
    t89: {
      type: "object",
      properties: {
        fields: {
          type: "boolean"
        },
        display: {
          type: "boolean"
        },
        card: {
          type: "boolean"
        }
      },
      required: [
        "fields",
        "display",
        "card"
      ]
    },
    t90: {
      type: "object",
      properties: {
        fields: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        geometry: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        display: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        card: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t91: {
      type: "object",
      properties: {
        fields: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            },
            {
              const: "localOnly"
            }
          ]
        },
        display: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            },
            {
              const: "localOnly"
            }
          ]
        },
        card: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            },
            {
              const: "localOnly"
            }
          ]
        },
        workflow: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            },
            {
              const: "localOnly"
            }
          ]
        }
      },
      required: [
        "fields",
        "display",
        "card"
      ]
    },
    t93: {
      type: "object",
      properties: {
        kind: {
          const: "always"
        }
      },
      required: [
        "kind"
      ]
    },
    t94: {
      type: "object",
      properties: {
        kind: {
          const: "zoomRange"
        },
        min: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        max: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "kind"
      ]
    },
    t95: {
      type: "object",
      properties: {
        kind: {
          const: "bboxArea"
        },
        min: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        max: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        scope: {
          anyOf: [
            {
              const: "part"
            },
            {
              const: "feature"
            }
          ]
        }
      },
      required: [
        "kind",
        "scope"
      ]
    },
    t96: {
      type: "object",
      properties: {
        kind: {
          const: "fieldEquals"
        },
        field: {
          type: "string"
        },
        value: {
          type: "string"
        }
      },
      required: [
        "kind",
        "field",
        "value"
      ]
    },
    t97: {
      type: "object",
      properties: {
        kind: {
          const: "fieldIn"
        },
        field: {
          type: "string"
        },
        values: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: [
        "kind",
        "field",
        "values"
      ]
    },
    t98: {
      type: "object",
      properties: {
        kind: {
          const: "fieldPresent"
        },
        field: {
          type: "string"
        },
        present: {
          type: "boolean"
        }
      },
      required: [
        "kind",
        "field",
        "present"
      ]
    },
    t99: {
      type: "object",
      properties: {
        registryKey: {
          type: "string"
        },
        runtimeField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "registryKey"
      ]
    },
    t100: {
      type: "object",
      properties: {
        workflow: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        editor: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        infocard: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        search: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t101: {
      type: "object",
      properties: {
        classCode: {
          type: "string"
        },
        matchField: {
          type: "string"
        },
        displayField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "classCode",
        "matchField"
      ]
    },
    t92: {
      type: "object",
      properties: {
        fieldId: {
          type: "string"
        },
        key: {
          type: "string"
        },
        scope: {
          anyOf: [
            {
              const: "root"
            },
            {
              const: "tags"
            },
            {
              const: "extensions"
            }
          ]
        },
        type: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            },
            {
              const: "enum"
            },
            {
              const: "json"
            },
            {
              const: "reference"
            }
          ]
        },
        cardinality: {
          anyOf: [
            {
              const: "single"
            },
            {
              const: "multiple"
            }
          ]
        },
        input: {
          anyOf: [
            {
              const: "text"
            },
            {
              const: "select"
            },
            {
              const: "json"
            },
            {
              const: "textarea"
            },
            {
              const: "toggle"
            },
            {
              const: "featureSearch"
            }
          ]
        },
        required: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        validateExistingData: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        requiredWhen: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    ref: "t93"
                  },
                  {
                    ref: "t94"
                  },
                  {
                    ref: "t95"
                  },
                  {
                    ref: "t96"
                  },
                  {
                    ref: "t97"
                  },
                  {
                    ref: "t98"
                  }
                ]
              }
            }
          ]
        },
        labels: {
          ref: "t1"
        },
        description: {
          ref: "t1"
        },
        options: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        optionsTableId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        optionTable: {
          anyOf: [
            {
              ref: "t48"
            }
          ]
        },
        optionValueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        format: {
          anyOf: [
            {
              const: "boolean"
            },
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            },
            {
              const: "json"
            }
          ]
        },
        coordinateFormat: {
          anyOf: [
            {
              const: "coordP"
            },
            {
              const: "pointObject"
            },
            {
              const: "coordL"
            },
            {
              const: "coordG"
            }
          ]
        },
        optionSource: {
          anyOf: [
            {
              ref: "t99"
            }
          ]
        },
        placeholder: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        defaultValue: {},
        emptyValue: {
          anyOf: [
            {
              const: "omit"
            },
            {
              const: "preserve"
            }
          ]
        },
        sourceRuntimeField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        scenes: {
          anyOf: [
            {
              ref: "t100"
            }
          ]
        },
        reference: {
          anyOf: [
            {
              ref: "t101"
            }
          ]
        },
        overrideOf: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        inheritance: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            },
            {
              const: "localOnly"
            }
          ]
        }
      },
      required: [
        "fieldId",
        "key",
        "type",
        "cardinality",
        "input",
        "labels",
        "description"
      ]
    },
    t103: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        role: {
          anyOf: [
            {
              const: "main"
            },
            {
              const: "member"
            }
          ]
        },
        memberField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        hostField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        selectorField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        visibility: {
          anyOf: [
            {
              const: "activeLevel"
            },
            {
              const: "allMembers"
            }
          ]
        }
      },
      required: [
        "enabled",
        "role"
      ]
    },
    t107: {
      type: "object",
      properties: {
        path: {
          ref: "t16"
        },
        fieldId: {
          type: "string"
        },
        key: {
          type: "string"
        }
      },
      required: [
        "path",
        "fieldId",
        "key"
      ]
    },
    t106: {
      type: "object",
      properties: {
        source: {
          ref: "t107"
        },
        fingerprint: {
          type: "string"
        },
        confirmedFingerprint: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "source",
        "fingerprint"
      ]
    },
    t105: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "field"
            },
            {
              const: "classification"
            },
            {
              const: "classificationField"
            }
          ]
        },
        classificationLabel: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        fallbackClassificationLabel: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        field: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        valueMode: {
          anyOf: [
            {
              const: "reference"
            },
            {
              const: "value"
            },
            {
              const: "meaning"
            }
          ]
        },
        referenceDisplayField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        valueOptions: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        prefillAudit: {
          anyOf: [
            {
              ref: "t106"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t108: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "nameColorCapsule"
            },
            {
              const: "lineChips"
            }
          ]
        },
        nameField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        displayName: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        colorField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fallbackColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        lineChipSource: {
          anyOf: [
            {
              const: "platform"
            },
            {
              const: "station"
            },
            {
              const: "stationBuilding"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t104: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        inheritance: {
          anyOf: [
            {
              const: "sealed"
            },
            {
              const: "overridable"
            }
          ]
        },
        queryFields: {
          type: "array",
          items: {
            type: "string"
          }
        },
        priority: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        subtitle: {
          ref: "t105"
        },
        extension: {
          ref: "t108"
        }
      },
      required: [
        "enabled",
        "queryFields",
        "subtitle",
        "extension"
      ]
    },
    t102: {
      type: "object",
      properties: {
        structure: {
          anyOf: [
            {
              ref: "t103"
            }
          ]
        },
        search: {
          anyOf: [
            {
              ref: "t104"
            }
          ]
        }
      },
      required: []
    },
    t111: {
      type: "object",
      properties: {
        weight: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        fillOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        opacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        dashArray: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: []
    },
    t112: {
      type: "object",
      properties: {
        zLevel: {
          type: "number"
        },
        pane: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        zIndexOffset: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "zLevel"
      ]
    },
    t115: {
      type: "object",
      properties: {
        kind: {
          anyOf: [
            {
              const: "field"
            },
            {
              const: "area"
            },
            {
              const: "length"
            },
            {
              const: "partCount"
            }
          ]
        },
        field: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        multiplier: {
          type: "number"
        },
        divisor: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        rounding: {
          anyOf: [
            {
              const: "none"
            },
            {
              const: "floor"
            },
            {
              const: "round"
            },
            {
              const: "ceil"
            }
          ]
        },
        min: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        max: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "kind",
        "multiplier",
        "rounding"
      ]
    },
    t114: {
      type: "object",
      properties: {
        role: {
          anyOf: [
            {
              const: "ignore"
            },
            {
              const: "soft"
            },
            {
              const: "optional"
            },
            {
              const: "important"
            },
            {
              const: "required"
            }
          ]
        },
        basePriority: {
          type: "number"
        },
        collisionGroup: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        hideWhenColliding: {
          type: "boolean"
        },
        densityLimit: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        metric: {
          anyOf: [
            {
              ref: "t115"
            }
          ]
        },
        compatibility: {
          anyOf: [
            {
              const: "r5DisplayPriority"
            }
          ]
        }
      },
      required: [
        "role",
        "basePriority",
        "hideWhenColliding"
      ]
    },
    t113: {
      type: "object",
      properties: {
        visible: {
          type: "boolean"
        },
        anchor: {
          anyOf: [
            {
              const: "perPart"
            },
            {
              const: "featureBbox"
            }
          ]
        },
        conditions: {
          type: "array",
          items: {
            anyOf: [
              {
                ref: "t93"
              },
              {
                ref: "t94"
              },
              {
                ref: "t95"
              },
              {
                ref: "t96"
              },
              {
                ref: "t97"
              },
              {
                ref: "t98"
              }
            ]
          }
        },
        collision: {
          ref: "t114"
        }
      },
      required: [
        "visible",
        "anchor",
        "conditions",
        "collision"
      ]
    },
    t119: {
      type: "object",
      properties: {
        min: {
          type: "number"
        },
        max: {
          type: "number"
        }
      },
      required: [
        "min",
        "max"
      ]
    },
    t121: {
      type: "object",
      properties: {
        kind: {
          const: "fieldCompare"
        },
        field: {
          type: "string"
        },
        operator: {
          anyOf: [
            {
              const: "eq"
            },
            {
              const: "ne"
            },
            {
              const: "in"
            },
            {
              const: "notIn"
            },
            {
              const: "present"
            },
            {
              const: "empty"
            },
            {
              const: "gt"
            },
            {
              const: "ge"
            },
            {
              const: "lt"
            },
            {
              const: "le"
            }
          ]
        },
        value: {
          anyOf: [
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        values: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  },
                  {
                    const: false
                  },
                  {
                    const: true
                  }
                ]
              }
            }
          ]
        }
      },
      required: [
        "kind",
        "field",
        "operator"
      ]
    },
    t123: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        relation: {
          anyOf: [
            {
              const: "AND"
            },
            {
              const: "OR"
            },
            {
              const: "NOT"
            }
          ]
        },
        condition: {
          anyOf: [
            {
              ref: "t96"
            },
            {
              ref: "t97"
            },
            {
              ref: "t98"
            },
            {
              ref: "t121"
            }
          ]
        }
      },
      required: [
        "id",
        "relation",
        "condition"
      ]
    },
    t124: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        expression: {
          type: "string"
        }
      },
      required: [
        "id",
        "expression"
      ]
    },
    t122: {
      type: "object",
      properties: {
        expression: {
          type: "string"
        },
        manual: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        terms: {
          type: "array",
          items: {
            ref: "t123"
          }
        },
        groups: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t124"
              }
            }
          ]
        }
      },
      required: [
        "expression",
        "terms"
      ]
    },
    t120: {
      type: "object",
      properties: {
        op: {
          anyOf: [
            {
              const: "all"
            },
            {
              const: "any"
            },
            {
              const: "not"
            }
          ]
        },
        items: {
          type: "array",
          items: {
            anyOf: [
              {
                ref: "t96"
              },
              {
                ref: "t97"
              },
              {
                ref: "t98"
              },
              {
                ref: "t120"
              },
              {
                ref: "t121"
              }
            ]
          }
        },
        formula: {
          anyOf: [
            {
              ref: "t122"
            }
          ]
        }
      },
      required: [
        "op",
        "items"
      ]
    },
    t118: {
      type: "object",
      properties: {
        zoom: {
          ref: "t119"
        },
        fields: {
          anyOf: [
            {
              ref: "t120"
            }
          ]
        }
      },
      required: [
        "zoom"
      ]
    },
    t126: {
      type: "object",
      properties: {
        x: {
          type: "number"
        },
        y: {
          type: "number"
        }
      },
      required: [
        "x",
        "y"
      ]
    },
    t128: {
      type: "object",
      properties: {
        pointShape: {
          anyOf: [
            {
              const: "circle"
            },
            {
              const: "square"
            },
            {
              const: "triangle"
            },
            {
              const: "regular4"
            },
            {
              const: "regular5"
            },
            {
              const: "regular6"
            }
          ]
        },
        size: {
          type: "number"
        },
        weight: {
          type: "number"
        },
        lineCap: {
          anyOf: [
            {
              const: "round"
            },
            {
              const: "square"
            },
            {
              const: "butt"
            }
          ]
        },
        lineJoin: {
          anyOf: [
            {
              const: "round"
            },
            {
              const: "miter"
            },
            {
              const: "bevel"
            }
          ]
        },
        stroke: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        fill: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        strokeOpacity: {
          type: "number"
        },
        fillOpacity: {
          type: "number"
        }
      },
      required: [
        "pointShape",
        "size",
        "weight",
        "lineCap",
        "lineJoin",
        "stroke",
        "fill",
        "strokeOpacity",
        "fillOpacity"
      ]
    },
    t127: {
      type: "object",
      properties: {
        kind: {
          const: "shape"
        },
        shape: {
          ref: "t128"
        }
      },
      required: [
        "kind",
        "shape"
      ]
    },
    t132: {
      type: "object",
      properties: {
        shape: {
          anyOf: [
            {
              const: "circle"
            },
            {
              const: "pin"
            },
            {
              const: "square"
            },
            {
              const: "roundedRect"
            }
          ]
        },
        paddingPx: {
          type: "number"
        },
        radiusPx: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        fill: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        stroke: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        strokeWidthPx: {
          type: "number"
        },
        fillOpacity: {
          type: "number"
        },
        strokeOpacity: {
          type: "number"
        }
      },
      required: [
        "shape",
        "paddingPx",
        "fill",
        "stroke",
        "strokeWidthPx",
        "fillOpacity",
        "strokeOpacity"
      ]
    },
    t134: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "custom"
            },
            {
              const: "center"
            },
            {
              const: "topCenter"
            },
            {
              const: "bottomCenter"
            },
            {
              const: "leftCenter"
            },
            {
              const: "rightCenter"
            },
            {
              const: "topLeft"
            },
            {
              const: "topRight"
            },
            {
              const: "bottomLeft"
            },
            {
              const: "bottomRight"
            }
          ]
        },
        x: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        y: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t135: {
      type: "object",
      properties: {
        x: {
          type: "number"
        },
        y: {
          type: "number"
        }
      },
      required: [
        "x",
        "y"
      ]
    },
    t133: {
      type: "object",
      properties: {
        anchor: {
          ref: "t134"
        },
        offsetPx: {
          ref: "t135"
        }
      },
      required: [
        "anchor",
        "offsetPx"
      ]
    },
    t131: {
      type: "object",
      properties: {
        library: {
          const: "pinhead"
        },
        id: {
          type: "string"
        },
        sizePx: {
          type: "number"
        },
        foreground: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        foregroundOpacity: {
          type: "number"
        },
        plate: {
          anyOf: [
            {
              ref: "t132"
            }
          ]
        },
        placement: {
          ref: "t133"
        }
      },
      required: [
        "library",
        "id",
        "sizePx",
        "foreground",
        "foregroundOpacity",
        "placement"
      ]
    },
    t130: {
      type: "object",
      properties: {
        mode: {
          const: "single"
        },
        item: {
          ref: "t131"
        }
      },
      required: [
        "mode",
        "item"
      ]
    },
    t137: {
      type: "object",
      properties: {
        value: {
          anyOf: [
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        item: {
          ref: "t131"
        }
      },
      required: [
        "value",
        "item"
      ]
    },
    t136: {
      type: "object",
      properties: {
        mode: {
          const: "valueMap"
        },
        field: {
          type: "string"
        },
        entries: {
          type: "array",
          items: {
            ref: "t137"
          }
        }
      },
      required: [
        "mode",
        "field",
        "entries"
      ]
    },
    t129: {
      type: "object",
      properties: {
        kind: {
          const: "icon"
        },
        icon: {
          anyOf: [
            {
              ref: "t130"
            },
            {
              ref: "t136"
            }
          ]
        },
        fallback: {
          ref: "t128"
        }
      },
      required: [
        "kind",
        "icon",
        "fallback"
      ]
    },
    t141: {
      type: "object",
      properties: {
        width: {
          type: "number"
        },
        height: {
          type: "number"
        }
      },
      required: [
        "width",
        "height"
      ]
    },
    t140: {
      type: "object",
      properties: {
        sizePx: {
          ref: "t141"
        },
        placement: {
          ref: "t133"
        }
      },
      required: [
        "sizePx",
        "placement"
      ]
    },
    t139: {
      type: "object",
      properties: {
        mode: {
          const: "fixed"
        },
        url: {
          type: "string"
        },
        presentation: {
          ref: "t140"
        }
      },
      required: [
        "mode",
        "url",
        "presentation"
      ]
    },
    t142: {
      type: "object",
      properties: {
        mode: {
          const: "fieldUrl"
        },
        field: {
          type: "string"
        },
        presentation: {
          ref: "t140"
        }
      },
      required: [
        "mode",
        "field",
        "presentation"
      ]
    },
    t143: {
      type: "object",
      properties: {
        mode: {
          const: "externalFieldUrl"
        },
        targetIdField: {
          type: "string"
        },
        targetUrlField: {
          type: "string"
        },
        presentation: {
          ref: "t140"
        }
      },
      required: [
        "mode",
        "targetIdField",
        "targetUrlField",
        "presentation"
      ]
    },
    t145: {
      type: "object",
      properties: {
        value: {
          anyOf: [
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        url: {
          type: "string"
        },
        presentation: {
          ref: "t140"
        }
      },
      required: [
        "value",
        "url",
        "presentation"
      ]
    },
    t144: {
      type: "object",
      properties: {
        mode: {
          const: "valueMap"
        },
        field: {
          type: "string"
        },
        entries: {
          type: "array",
          items: {
            ref: "t145"
          }
        }
      },
      required: [
        "mode",
        "field",
        "entries"
      ]
    },
    t138: {
      type: "object",
      properties: {
        kind: {
          const: "externalImage"
        },
        image: {
          anyOf: [
            {
              ref: "t139"
            },
            {
              ref: "t142"
            },
            {
              ref: "t143"
            },
            {
              ref: "t144"
            }
          ]
        },
        fallback: {
          ref: "t128"
        }
      },
      required: [
        "kind",
        "image",
        "fallback"
      ]
    },
    t146: {
      type: "object",
      properties: {
        source: {
          type: "string"
        },
        size: {
          type: "array",
          tuple: [
            {
              type: "number"
            },
            {
              type: "number"
            }
          ]
        },
        anchor: {
          type: "array",
          tuple: [
            {
              type: "number"
            },
            {
              type: "number"
            }
          ]
        },
        fallback: {
          anyOf: [
            {
              const: "circle"
            },
            {
              const: "hide"
            }
          ]
        }
      },
      required: [
        "source",
        "size",
        "anchor",
        "fallback"
      ]
    },
    t125: {
      type: "object",
      properties: {
        symbolOffsetPx: {
          anyOf: [
            {
              ref: "t126"
            }
          ]
        },
        symbolVisibility: {
          anyOf: [
            {
              const: "independent"
            },
            {
              const: "withLabel"
            }
          ]
        },
        symbolAnchor: {
          anyOf: [
            {
              const: "geometry"
            },
            {
              const: "label"
            }
          ]
        },
        pointShape: {
          anyOf: [
            {
              const: "circle"
            },
            {
              const: "square"
            },
            {
              const: "triangle"
            },
            {
              const: "regular4"
            },
            {
              const: "regular5"
            },
            {
              const: "regular6"
            }
          ]
        },
        pointSymbol: {
          anyOf: [
            {
              ref: "t127"
            },
            {
              ref: "t129"
            },
            {
              ref: "t138"
            }
          ]
        },
        icon: {
          anyOf: [
            {
              ref: "t146"
            }
          ]
        },
        size: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        weight: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        stroke: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        fill: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        strokeOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        fillOpacity: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        dashPreset: {
          anyOf: [
            {
              const: "solid"
            },
            {
              const: "dash"
            },
            {
              const: "dotDash"
            },
            {
              const: "dotDotDash"
            }
          ]
        },
        lineCap: {
          anyOf: [
            {
              const: "round"
            },
            {
              const: "square"
            },
            {
              const: "butt"
            }
          ]
        },
        lineJoin: {
          anyOf: [
            {
              const: "round"
            },
            {
              const: "miter"
            },
            {
              const: "bevel"
            }
          ]
        }
      },
      required: []
    },
    t149: {
      type: "object",
      properties: {
        italic: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        underline: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        bold: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t150: {
      type: "object",
      properties: {
        lineHeightRatio: {
          type: "number"
        },
        paddingYRatio: {
          type: "number"
        },
        paddingXRatio: {
          type: "number"
        },
        radiusRatio: {
          type: "number"
        },
        textColor: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        backgroundColor: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        strokeColor: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        strokeWidth: {
          type: "number"
        }
      },
      required: [
        "lineHeightRatio",
        "paddingYRatio",
        "paddingXRatio",
        "radiusRatio",
        "textColor",
        "backgroundColor",
        "strokeColor",
        "strokeWidth"
      ]
    },
    t148: {
      type: "object",
      properties: {
        family: {
          anyOf: [
            {
              const: "gm-bw"
            },
            {
              const: "gm-outline"
            },
            {
              const: "gm-wtb"
            },
            {
              const: "structure-label"
            },
            {
              const: "bubble-dark"
            },
            {
              const: "rle-line-color"
            },
            {
              const: "rle-pill-color"
            },
            {
              const: "custom_pill_1"
            }
          ]
        },
        size: {
          type: "number"
        },
        modifiers: {
          anyOf: [
            {
              ref: "t149"
            }
          ]
        },
        color: {
          anyOf: [
            {
              ref: "t11"
            },
            {
              ref: "t13"
            },
            {
              ref: "t14"
            },
            {
              ref: "t15"
            },
            {
              ref: "t17"
            }
          ]
        },
        pill: {
          anyOf: [
            {
              ref: "t150"
            }
          ]
        }
      },
      required: [
        "family",
        "size"
      ]
    },
    t151: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: {
        anyOf: [
          {
            const: "plain"
          },
          {
            const: "floorLabel"
          }
        ]
      }
    },
    t147: {
      type: "object",
      properties: {
        visible: {
          type: "boolean"
        },
        style: {
          anyOf: [
            {
              ref: "t148"
            }
          ]
        },
        font: {
          anyOf: [
            {
              const: "blue"
            },
            {
              const: "whiteBlackOutline"
            },
            {
              const: "capsule"
            }
          ]
        },
        size: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        italic: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        underline: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        source: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        sourceMode: {
          anyOf: [
            {
              const: "single"
            },
            {
              const: "combined"
            }
          ]
        },
        template: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fallbackSources: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        valueFormat: {
          anyOf: [
            {
              const: "plain"
            },
            {
              const: "floorLabel"
            }
          ]
        },
        fallbackValueFormats: {
          anyOf: [
            {
              ref: "t151"
            }
          ]
        },
        placement: {
          anyOf: [
            {
              const: "N"
            },
            {
              const: "S"
            },
            {
              const: "E"
            },
            {
              const: "W"
            },
            {
              const: "NE"
            },
            {
              const: "NW"
            },
            {
              const: "SE"
            },
            {
              const: "SW"
            },
            {
              const: "center"
            },
            {
              const: "aboveLine"
            },
            {
              const: "belowLine"
            },
            {
              const: "near"
            }
          ]
        },
        offsetY: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        offsetX: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        withDot: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        dotAnchorMode: {
          anyOf: [
            {
              const: "anchorRight"
            },
            {
              const: "inline"
            }
          ]
        },
        collision: {
          ref: "t114"
        }
      },
      required: [
        "visible",
        "collision"
      ]
    },
    t153: {
      type: "object",
      properties: {
        point: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        line: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        boundary: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        interior: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        label: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        }
      },
      required: []
    },
    t152: {
      type: "object",
      properties: {
        triggers: {
          ref: "t153"
        }
      },
      required: [
        "triggers"
      ]
    },
    t155: {
      type: "object",
      properties: {
        mode: {
          anyOf: [
            {
              const: "add"
            },
            {
              const: "replace"
            }
          ]
        },
        base: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        metric: {
          anyOf: [
            {
              ref: "t115"
            }
          ]
        }
      },
      required: [
        "mode"
      ]
    },
    t154: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        when: {
          type: "array",
          items: {
            anyOf: [
              {
                ref: "t93"
              },
              {
                ref: "t94"
              },
              {
                ref: "t95"
              },
              {
                ref: "t96"
              },
              {
                ref: "t97"
              },
              {
                ref: "t98"
              }
            ]
          }
        },
        representation: {
          anyOf: [
            {
              const: "point"
            },
            {
              const: "geometry"
            },
            {
              const: "hidden"
            },
            {
              const: "labelOnly"
            }
          ]
        },
        style: {
          anyOf: [
            {
              ref: "t125"
            }
          ]
        },
        label: {
          anyOf: [
            {
              ref: "t147"
            }
          ]
        },
        geometryStack: {
          anyOf: [
            {
              ref: "t112"
            }
          ]
        },
        priority: {
          anyOf: [
            {
              ref: "t155"
            }
          ]
        },
        extensions: {
          anyOf: [
            {
              ref: "t20"
            }
          ]
        }
      },
      required: [
        "id",
        "when"
      ]
    },
    t157: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: {}
    },
    t158: {
      type: "object",
      properties: {
        preserveFallback: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        sourceRuleName: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: []
    },
    t156: {
      type: "object",
      properties: {
        predicates: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        visibility: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        geometry: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        symbol: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        label: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        collision: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        selection: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        specialLogic: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        legacyRuntime: {
          anyOf: [
            {
              ref: "t158"
            }
          ]
        }
      },
      required: []
    },
    t117: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        when: {
          anyOf: [
            {
              ref: "t118"
            }
          ]
        },
        minZoom: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxZoom: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        representation: {
          anyOf: [
            {
              const: "point"
            },
            {
              const: "geometry"
            },
            {
              const: "hidden"
            },
            {
              const: "labelOnly"
            }
          ]
        },
        style: {
          anyOf: [
            {
              ref: "t125"
            }
          ]
        },
        label: {
          anyOf: [
            {
              ref: "t147"
            }
          ]
        },
        interaction: {
          anyOf: [
            {
              ref: "t152"
            }
          ]
        },
        geometryStack: {
          anyOf: [
            {
              ref: "t112"
            }
          ]
        },
        extensions: {
          anyOf: [
            {
              ref: "t20"
            }
          ]
        },
        conditionalOverrides: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t154"
              }
            }
          ]
        },
        advanced: {
          anyOf: [
            {
              ref: "t156"
            }
          ]
        },
        minExclusive: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxExclusive: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        labelRole: {
          anyOf: [
            {
              const: "ignore"
            },
            {
              const: "soft"
            },
            {
              const: "optional"
            },
            {
              const: "important"
            },
            {
              const: "required"
            }
          ]
        },
        priority: {
          anyOf: [
            {
              ref: "t155"
            }
          ]
        }
      },
      required: [
        "id"
      ]
    },
    t116: {
      type: "object",
      properties: {
        rules: {
          type: "array",
          items: {
            ref: "t117"
          }
        }
      },
      required: [
        "rules"
      ]
    },
    t159: {
      type: "object",
      properties: {
        triggers: {
          ref: "t153"
        }
      },
      required: [
        "triggers"
      ]
    },
    t160: {
      type: "object",
      properties: {
        ruleIds: {
          type: "array",
          items: {
            type: "string"
          }
        },
        profileIds: {
          type: "array",
          items: {
            type: "string"
          }
        },
        specialLogicKeys: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: [
        "ruleIds",
        "profileIds",
        "specialLogicKeys"
      ]
    },
    t110: {
      type: "object",
      properties: {
        renderState: {
          anyOf: [
            {
              const: "enabled"
            },
            {
              const: "unconfigured"
            }
          ]
        },
        enabled: {
          type: "boolean"
        },
        allowMultipleParts: {
          type: "boolean"
        },
        anchor: {
          anyOf: [
            {
              const: "perPart"
            },
            {
              const: "featureBbox"
            }
          ]
        },
        color: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        style: {
          anyOf: [
            {
              ref: "t111"
            }
          ]
        },
        geometryStack: {
          anyOf: [
            {
              ref: "t112"
            }
          ]
        },
        label: {
          anyOf: [
            {
              ref: "t113"
            }
          ]
        },
        zoomPriority: {
          ref: "t116"
        },
        interaction: {
          anyOf: [
            {
              ref: "t159"
            }
          ]
        },
        legacyDisplay: {
          anyOf: [
            {
              ref: "t160"
            }
          ]
        }
      },
      required: [
        "enabled",
        "allowMultipleParts",
        "zoomPriority"
      ]
    },
    t109: {
      type: "object",
      properties: {
        Point: {
          anyOf: [
            {
              ref: "t110"
            }
          ]
        },
        LineString: {
          anyOf: [
            {
              ref: "t110"
            }
          ]
        },
        Polygon: {
          anyOf: [
            {
              ref: "t110"
            }
          ]
        }
      },
      required: []
    },
    t161: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        role: {
          anyOf: [
            {
              const: "parent"
            },
            {
              const: "child"
            }
          ]
        },
        parentReferenceField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        viewProfileKey: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "enabled"
      ]
    },
    t164: {
      type: "object",
      properties: {
        nodeId: {
          type: "string"
        },
        fieldId: {
          type: "string"
        }
      },
      required: [
        "nodeId",
        "fieldId"
      ]
    },
    t165: {
      type: "object",
      properties: {
        nodeId: {
          type: "string"
        },
        itemId: {
          type: "string"
        }
      },
      required: [
        "nodeId",
        "itemId"
      ]
    },
    t166: {
      type: "object",
      properties: {
        colorSource: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        nameSource: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fallbackColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        tagColor: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        mediaSource: {
          anyOf: [
            {
              const: "picture-index"
            },
            {
              const: "external-url"
            }
          ]
        },
        lineChipSource: {
          anyOf: [
            {
              const: "platform"
            },
            {
              const: "station"
            },
            {
              const: "stationBuilding"
            }
          ]
        },
        format: {
          anyOf: [
            {
              const: "boolean"
            },
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            },
            {
              const: "enum"
            },
            {
              const: "json"
            },
            {
              const: "classification"
            },
            {
              const: "world"
            }
          ]
        },
        linkText: {
          anyOf: [
            {
              const: "raw"
            },
            {
              const: "href"
            }
          ]
        }
      },
      required: []
    },
    t167: {
      type: "object",
      properties: {
        targetRole: {
          anyOf: [
            {
              const: "main"
            }
          ]
        },
        targetClassification: {
          anyOf: [
            {
              ref: "t16"
            }
          ]
        },
        targetMatchField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        targetDisplayField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        clickable: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        multiple: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        sourceValuePath: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fallbackDisplay: {
          anyOf: [
            {
              const: "raw"
            },
            {
              const: "unknown"
            }
          ]
        }
      },
      required: []
    },
    t163: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        fieldBinding: {
          anyOf: [
            {
              ref: "t164"
            }
          ]
        },
        optionsFieldRef: {
          anyOf: [
            {
              ref: "t164"
            }
          ]
        },
        optionsTableId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        optionTable: {
          anyOf: [
            {
              ref: "t48"
            }
          ]
        },
        optionValueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        inheritFrom: {
          anyOf: [
            {
              ref: "t165"
            }
          ]
        },
        prefillAudit: {
          anyOf: [
            {
              ref: "t106"
            }
          ]
        },
        source: {
          type: "string"
        },
        fallbackSources: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        afterRemaining: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        visible: {
          type: "boolean"
        },
        renderer: {
          anyOf: [
            {
              const: "text"
            },
            {
              const: "nameColorCapsule"
            },
            {
              const: "lineChips"
            },
            {
              const: "tag"
            },
            {
              const: "colorCapsule"
            },
            {
              const: "relationLink"
            },
            {
              const: "media"
            }
          ]
        },
        section: {
          anyOf: [
            {
              const: "main"
            },
            {
              const: "other"
            }
          ]
        },
        hideWhenEmpty: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        label: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        labelMode: {
          anyOf: [
            {
              const: "field"
            },
            {
              const: "override"
            }
          ]
        },
        valueMode: {
          anyOf: [
            {
              const: "field"
            },
            {
              const: "override"
            }
          ]
        },
        valueOptions: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        options: {
          anyOf: [
            {
              ref: "t166"
            }
          ]
        },
        relation: {
          anyOf: [
            {
              ref: "t167"
            }
          ]
        }
      },
      required: [
        "id",
        "source",
        "visible",
        "renderer"
      ]
    },
    t168: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        section: {
          anyOf: [
            {
              const: "main"
            },
            {
              const: "other"
            }
          ]
        },
        includeSystem: {
          type: "boolean"
        },
        exclude: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        hideWhenEmpty: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        order: {
          anyOf: [
            {
              const: "record"
            },
            {
              const: "alphabetical"
            }
          ]
        },
        maxDepth: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxArrayLength: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "enabled",
        "section",
        "includeSystem"
      ]
    },
    t162: {
      type: "object",
      properties: {
        mode: {
          const: "fields"
        },
        items: {
          type: "array",
          items: {
            ref: "t163"
          }
        },
        remaining: {
          anyOf: [
            {
              ref: "t168"
            }
          ]
        }
      },
      required: [
        "mode",
        "items"
      ]
    },
    t169: {
      type: "object",
      properties: {
        mode: {
          const: "layout"
        },
        layoutId: {
          type: "string"
        },
        options: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: [
        "mode",
        "layoutId"
      ]
    },
    t170: {
      type: "object",
      properties: {
        mode: {
          const: "component"
        },
        componentKey: {
          type: "string"
        },
        options: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: [
        "mode",
        "componentKey"
      ]
    },
    t171: {
      type: "object",
      properties: {
        classCode: {
          type: "string"
        },
        displayRuleIds: {
          type: "array",
          items: {
            type: "string"
          }
        },
        cardLayoutId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        specialCardKey: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        source: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: [
        "classCode",
        "displayRuleIds"
      ]
    },
    t87: {
      type: "object",
      properties: {
        nodeId: {
          type: "string"
        },
        path: {
          ref: "t16"
        },
        classificationLabels: {
          anyOf: [
            {
              ref: "t88"
            }
          ]
        },
        children: {
          type: "array",
          items: {
            type: "string"
          }
        },
        inheritDown: {
          anyOf: [
            {
              ref: "t89"
            }
          ]
        },
        receiveFromParent: {
          anyOf: [
            {
              ref: "t90"
            }
          ]
        },
        policies: {
          anyOf: [
            {
              ref: "t91"
            }
          ]
        },
        fields: {
          type: "array",
          items: {
            ref: "t92"
          }
        },
        fieldSettings: {
          anyOf: [
            {
              ref: "t102"
            }
          ]
        },
        geometryType: {
          anyOf: [
            {
              const: "Point"
            },
            {
              const: "LineString"
            },
            {
              const: "Polygon"
            }
          ]
        },
        geometryProfiles: {
          ref: "t109"
        },
        containment: {
          anyOf: [
            {
              ref: "t161"
            }
          ]
        },
        card: {
          anyOf: [
            {
              ref: "t162"
            },
            {
              ref: "t169"
            },
            {
              ref: "t170"
            }
          ]
        },
        legacy: {
          anyOf: [
            {
              ref: "t171"
            }
          ]
        }
      },
      required: [
        "nodeId",
        "path",
        "children",
        "fields",
        "geometryProfiles"
      ]
    },
    t173: {
      type: "object",
      properties: {
        classification: {
          ref: "t16"
        },
        referenceField: {
          type: "string"
        }
      },
      required: [
        "classification",
        "referenceField"
      ]
    },
    t172: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        host: {
          ref: "t173"
        },
        member: {
          ref: "t173"
        },
        memberSelectorField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        enabled: {
          type: "boolean"
        },
        profile: {
          anyOf: [
            {
              const: "default"
            },
            {
              const: "keep-host-context"
            },
            {
              const: "show-active-member-only"
            }
          ]
        }
      },
      required: [
        "id",
        "label",
        "host",
        "member",
        "enabled",
        "profile"
      ]
    },
    t176: {
      type: "object",
      properties: {
        slot: {
          type: "string"
        },
        target: {
          type: "string"
        }
      },
      required: [
        "slot",
        "target"
      ]
    },
    t175: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean"
        },
        dedicated: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        scope: {
          anyOf: [
            {
              ref: "t16"
            }
          ]
        },
        backfill: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t176"
              }
            }
          ]
        }
      },
      required: [
        "enabled"
      ]
    },
    t177: {
      type: "object",
      properties: {
        required: {
          type: "boolean"
        }
      },
      required: [
        "required"
      ]
    },
    t181: {
      type: "object",
      properties: {
        placeholder: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        reference: {
          anyOf: [
            {
              ref: "t101"
            }
          ]
        },
        required: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        key: {
          type: "string"
        },
        type: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            },
            {
              const: "enum"
            },
            {
              const: "json"
            },
            {
              const: "reference"
            }
          ]
        },
        cardinality: {
          anyOf: [
            {
              const: "single"
            },
            {
              const: "multiple"
            }
          ]
        },
        labels: {
          ref: "t1"
        },
        options: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        optionValueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        format: {
          anyOf: [
            {
              const: "boolean"
            },
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            },
            {
              const: "json"
            }
          ]
        },
        defaultValue: {},
        requiredWhen: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    ref: "t93"
                  },
                  {
                    ref: "t94"
                  },
                  {
                    ref: "t95"
                  },
                  {
                    ref: "t96"
                  },
                  {
                    ref: "t97"
                  },
                  {
                    ref: "t98"
                  }
                ]
              }
            }
          ]
        },
        input: {
          anyOf: [
            {
              const: "text"
            },
            {
              const: "select"
            },
            {
              const: "json"
            },
            {
              const: "textarea"
            },
            {
              const: "toggle"
            },
            {
              const: "featureSearch"
            }
          ]
        }
      },
      required: [
        "key",
        "type",
        "cardinality",
        "labels",
        "input"
      ]
    },
    t180: {
      type: "object",
      properties: {
        nodeId: {
          type: "string"
        },
        fieldId: {
          type: "string"
        },
        snapshot: {
          ref: "t181"
        },
        overrides: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: [
        "nodeId",
        "fieldId",
        "snapshot",
        "overrides"
      ]
    },
    t182: {
      type: "object",
      properties: {
        token: {
          type: "string"
        },
        operator: {
          anyOf: [
            {
              const: "in"
            },
            {
              const: "present"
            },
            {
              const: "empty"
            },
            {
              const: "equals"
            }
          ]
        },
        value: {
          anyOf: [
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        values: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  },
                  {
                    const: false
                  },
                  {
                    const: true
                  }
                ]
              }
            }
          ]
        },
        all: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t182"
              }
            }
          ]
        },
        any: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t182"
              }
            }
          ]
        }
      },
      required: [
        "token",
        "operator"
      ]
    },
    t183: {
      type: "object",
      properties: {
        registryKey: {
          type: "string"
        }
      },
      required: [
        "registryKey"
      ]
    },
    t185: {
      type: "object",
      properties: {
        matcher: {
          anyOf: [
            {
              const: "contains"
            },
            {
              const: "prefix"
            },
            {
              const: "token"
            },
            {
              const: "fuzzy"
            }
          ]
        },
        minQueryLength: {
          type: "number"
        },
        maxResults: {
          type: "number"
        },
        debounceMs: {
          anyOf: [
            {
              type: "number"
            }
          ]
        }
      },
      required: [
        "matcher",
        "minQueryLength",
        "maxResults"
      ]
    },
    t184: {
      type: "object",
      properties: {
        target: {
          ref: "t16"
        },
        targetRole: {
          anyOf: [
            {
              const: "main"
            }
          ]
        },
        queryFields: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        displayTemplate: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        returnField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        matcher: {
          anyOf: [
            {
              const: "contains"
            },
            {
              const: "prefix"
            },
            {
              const: "token"
            },
            {
              const: "fuzzy"
            }
          ]
        },
        minQueryLength: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        maxResults: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        debounceMs: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        cacheScope: {
          anyOf: [
            {
              const: "world"
            },
            {
              const: "loadedWorlds"
            }
          ]
        },
        mode: {
          anyOf: [
            {
              const: "feature"
            },
            {
              const: "coarse"
            }
          ]
        },
        searchFields: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        displayFields: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        returnFields: {
          anyOf: [
            {
              type: "array",
              items: {
                type: "string"
              }
            }
          ]
        },
        coarse: {
          anyOf: [
            {
              ref: "t185"
            }
          ]
        }
      },
      required: [
        "target",
        "cacheScope"
      ]
    },
    t187: {
      type: "object",
      properties: {
        optionTable: {
          anyOf: [
            {
              ref: "t48"
            }
          ]
        },
        optionsFieldRef: {
          anyOf: [
            {
              ref: "t164"
            }
          ]
        },
        prefillAudit: {
          anyOf: [
            {
              ref: "t106"
            }
          ]
        },
        prefillField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        key: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        kind: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "text"
            },
            {
              const: "select"
            },
            {
              const: "json"
            },
            {
              const: "textarea"
            },
            {
              const: "toggle"
            },
            {
              const: "featureSearch"
            },
            {
              const: "coarseSearch"
            }
          ]
        },
        required: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        options: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        optionsTableId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        placeholder: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        defaultValue: {},
        rows: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        search: {
          anyOf: [
            {
              ref: "t184"
            }
          ]
        },
        optionValueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        fieldFormat: {
          anyOf: [
            {
              const: "boolean"
            },
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            },
            {
              const: "json"
            }
          ]
        },
        fieldSource: {
          anyOf: [
            {
              ref: "t180"
            }
          ]
        },
        requiredWhen: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t182"
              }
            }
          ]
        },
        valueNormalization: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "none"
            },
            {
              const: "trim"
            },
            {
              const: "abbr"
            }
          ]
        }
      },
      required: [
        "key",
        "label",
        "kind"
      ]
    },
    t186: {
      type: "object",
      properties: {
        itemFields: {
          type: "array",
          items: {
            ref: "t187"
          }
        },
        storage: {
          anyOf: [
            {
              const: "object"
            },
            {
              const: "scalar"
            }
          ]
        },
        optional: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        minItems: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        addLabel: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        }
      },
      required: [
        "itemFields"
      ]
    },
    t188: {
      type: "object",
      properties: {
        tagsEnabled: {
          type: "boolean"
        },
        extensionsEnabled: {
          type: "boolean"
        }
      },
      required: [
        "tagsEnabled",
        "extensionsEnabled"
      ]
    },
    t179: {
      type: "object",
      properties: {
        optionTable: {
          anyOf: [
            {
              ref: "t48"
            }
          ]
        },
        optionsFieldRef: {
          anyOf: [
            {
              ref: "t164"
            }
          ]
        },
        prefillAudit: {
          anyOf: [
            {
              ref: "t106"
            }
          ]
        },
        prefillField: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        id: {
          type: "string"
        },
        slot: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        valueNormalization: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "none"
            },
            {
              const: "trim"
            },
            {
              const: "abbr"
            }
          ]
        },
        kind: {
          anyOf: [
            {
              const: "number"
            },
            {
              const: "text"
            },
            {
              const: "select"
            },
            {
              const: "json"
            },
            {
              const: "textarea"
            },
            {
              const: "toggle"
            },
            {
              const: "featureSearch"
            },
            {
              const: "component"
            },
            {
              const: "tagsExtensions"
            },
            {
              const: "classificationPicker"
            },
            {
              const: "coarseSearch"
            },
            {
              const: "group"
            },
            {
              const: "notice"
            },
            {
              const: "runtimeValue"
            }
          ]
        },
        columns: {
          anyOf: [
            {
              const: 3
            },
            {
              const: 2
            },
            {
              const: 1
            }
          ]
        },
        label: {
          ref: "t1"
        },
        fieldSource: {
          anyOf: [
            {
              ref: "t180"
            }
          ]
        },
        fieldFormat: {
          anyOf: [
            {
              const: "boolean"
            },
            {
              const: "plain"
            },
            {
              const: "externalLink"
            },
            {
              const: "date"
            },
            {
              const: "json"
            }
          ]
        },
        optionValueType: {
          anyOf: [
            {
              const: "string"
            },
            {
              const: "number"
            },
            {
              const: "boolean"
            }
          ]
        },
        requiredWhen: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t182"
              }
            }
          ]
        },
        options: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t42"
              }
            }
          ]
        },
        optionsTableId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        optionSource: {
          anyOf: [
            {
              ref: "t183"
            }
          ]
        },
        placeholder: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        defaultValue: {},
        rows: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        search: {
          anyOf: [
            {
              ref: "t184"
            }
          ]
        },
        classificationScope: {
          anyOf: [
            {
              ref: "t16"
            }
          ]
        },
        outputId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        required: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        when: {
          anyOf: [
            {
              ref: "t182"
            }
          ]
        },
        systemManaged: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        group: {
          anyOf: [
            {
              ref: "t186"
            }
          ]
        },
        tagsExtensions: {
          anyOf: [
            {
              ref: "t188"
            }
          ]
        },
        componentKey: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        legacyBlock: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: [
        "id",
        "kind",
        "columns",
        "label"
      ]
    },
    t189: {
      type: "object",
      properties: {
        tagsEnabled: {
          type: "boolean"
        },
        extensionsEnabled: {
          type: "boolean"
        }
      },
      required: [
        "tagsEnabled",
        "extensionsEnabled"
      ]
    },
    t191: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        slot: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        required: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        when: {
          anyOf: [
            {
              ref: "t182"
            }
          ]
        }
      },
      required: [
        "id",
        "slot",
        "label"
      ]
    },
    t192: {
      type: "object",
      properties: {
        outputId: {
          type: "string"
        },
        target: {
          type: "string"
        },
        value: {
          anyOf: [
            {
              const: "geometry"
            },
            {
              const: "height"
            }
          ]
        }
      },
      required: [
        "outputId",
        "target",
        "value"
      ]
    },
    t190: {
      type: "object",
      properties: {
        enabledFromThisPage: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        drawMode: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        allowBack: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        keepDrawingWhenBack: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        pointSlot: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        auxiliaryPoints: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t191"
              }
            }
          ]
        },
        captureSlot: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        returnFormat: {
          anyOf: [
            {
              const: "coordP"
            },
            {
              const: "pointObject"
            },
            {
              const: "coordL"
            },
            {
              const: "coordG"
            }
          ]
        },
        multiple: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        heightSlot: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        bindings: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t192"
              }
            }
          ]
        }
      },
      required: []
    },
    t178: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        kind: {
          anyOf: [
            {
              const: "geometry"
            },
            {
              const: "actor"
            },
            {
              const: "form"
            },
            {
              const: "tagsExtensions"
            },
            {
              const: "special"
            }
          ]
        },
        label: {
          ref: "t1"
        },
        subtitle: {
          anyOf: [
            {
              ref: "t1"
            }
          ]
        },
        controls: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t179"
              }
            }
          ]
        },
        geometry: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "Point"
                  },
                  {
                    const: "LineString"
                  },
                  {
                    const: "Polygon"
                  }
                ]
              }
            }
          ]
        },
        outputId: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        geometryRole: {
          anyOf: [
            {
              const: "output"
            },
            {
              const: "auxiliary"
            }
          ]
        },
        when: {
          anyOf: [
            {
              ref: "t182"
            }
          ]
        },
        specialKey: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        tagsExtensions: {
          anyOf: [
            {
              ref: "t189"
            }
          ]
        },
        drawing: {
          anyOf: [
            {
              ref: "t190"
            }
          ]
        },
        legacyPage: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: [
        "id",
        "kind",
        "label"
      ]
    },
    t194: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        target: {
          type: "string"
        },
        expression: {
          type: "string"
        },
        when: {
          anyOf: [
            {
              ref: "t182"
            }
          ]
        }
      },
      required: [
        "id",
        "target",
        "expression"
      ]
    },
    t195: {
      type: "object",
      properties: {
        selected: {
          anyOf: [
            {
              const: "Point"
            },
            {
              const: "LineString"
            },
            {
              const: "Polygon"
            }
          ]
        },
        allowed: {
          anyOf: [
            {
              type: "array",
              items: {
                anyOf: [
                  {
                    const: "Point"
                  },
                  {
                    const: "LineString"
                  },
                  {
                    const: "Polygon"
                  }
                ]
              }
            }
          ]
        }
      },
      required: [
        "selected"
      ]
    },
    t193: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        classification: {
          ref: "t16"
        },
        assignments: {
          type: "array",
          items: {
            ref: "t194"
          }
        },
        when: {
          anyOf: [
            {
              ref: "t182"
            }
          ]
        },
        geometry: {
          ref: "t195"
        }
      },
      required: [
        "id",
        "classification",
        "assignments",
        "geometry"
      ]
    },
    t196: {
      type: "object",
      properties: {
        componentKey: {
          type: "string"
        },
        purpose: {
          anyOf: [
            {
              const: "capture"
            },
            {
              const: "edit"
            }
          ]
        },
        version: {
          anyOf: [
            {
              type: "number"
            }
          ]
        },
        reason: {
          anyOf: [
            {
              const: "railway-integrated"
            },
            {
              const: "station-integrated"
            },
            {
              const: "trp-integrated"
            }
          ]
        },
        coveredClassifications: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t16"
              }
            }
          ]
        }
      },
      required: [
        "componentKey",
        "reason"
      ]
    },
    t197: {
      type: "object",
      properties: {
        runtimeMode: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        componentKey: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        output: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        },
        source: {
          anyOf: [
            {
              ref: "t157"
            }
          ]
        }
      },
      required: []
    },
    t174: {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        label: {
          ref: "t1"
        },
        mode: {
          anyOf: [
            {
              const: "external"
            },
            {
              const: "composed"
            }
          ]
        },
        quickMapping: {
          anyOf: [
            {
              const: false
            },
            {
              const: true
            }
          ]
        },
        editor: {
          anyOf: [
            {
              ref: "t175"
            }
          ]
        },
        actor: {
          anyOf: [
            {
              ref: "t177"
            }
          ]
        },
        target: {
          anyOf: [
            {
              ref: "t16"
            }
          ]
        },
        steps: {
          type: "array",
          items: {
            ref: "t178"
          }
        },
        outputs: {
          type: "array",
          items: {
            ref: "t193"
          }
        },
        assignments: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t194"
              }
            }
          ]
        },
        external: {
          anyOf: [
            {
              ref: "t196"
            }
          ]
        },
        legacy: {
          anyOf: [
            {
              ref: "t197"
            }
          ]
        }
      },
      required: [
        "id",
        "label",
        "mode",
        "steps",
        "outputs"
      ]
    },
    t199: {
      type: "object",
      properties: {
        kind: {
          anyOf: [
            {
              const: "class"
            },
            {
              const: "workflow"
            },
            {
              const: "shared"
            }
          ]
        },
        id: {
          type: "string"
        },
        source: {
          type: "string"
        },
        status: {
          anyOf: [
            {
              const: "resolved"
            },
            {
              const: "registryReference"
            },
            {
              const: "unsupported"
            }
          ]
        },
        details: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        fingerprint: {
          anyOf: [
            {
              type: "string"
            }
          ]
        }
      },
      required: [
        "kind",
        "id",
        "source",
        "status"
      ]
    },
    t198: {
      type: "object",
      properties: {
        schemaVersion: {
          const: "cairnmap.v1-parity-report.v2"
        },
        sourceManifestSha256: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        entries: {
          type: "array",
          items: {
            ref: "t199"
          }
        },
        generatedAt: {
          type: "string"
        }
      },
      required: [
        "schemaVersion",
        "entries",
        "generatedAt"
      ]
    },
    t0: {
      type: "object",
      properties: {
        schemaVersion: {
          const: "cairnmap.config-package.v3"
        },
        contractRevision: {
          anyOf: [
            {
              const: 3
            },
            {
              const: 4
            },
            {
              const: 5
            },
            {
              const: 6
            },
            {
              const: 7
            },
            {
              const: 8
            },
            {
              const: 9
            },
            {
              const: 10
            },
            {
              const: 11
            },
            {
              const: 12
            }
          ]
        },
        packageId: {
          type: "string"
        },
        projectId: {
          type: "string"
        },
        revision: {
          type: "number"
        },
        displayName: {
          ref: "t1"
        },
        sourceManifestSha256: {
          anyOf: [
            {
              type: "string"
            }
          ]
        },
        engine: {
          anyOf: [
            {
              ref: "t2"
            }
          ]
        },
        registries: {
          ref: "t40"
        },
        lookupTables: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t45"
              }
            }
          ]
        },
        application: {
          anyOf: [
            {
              ref: "t51"
            }
          ]
        },
        resources: {
          anyOf: [
            {
              ref: "t85"
            }
          ]
        },
        nodes: {
          type: "array",
          items: {
            ref: "t87"
          }
        },
        contextBindings: {
          anyOf: [
            {
              type: "array",
              items: {
                ref: "t172"
              }
            }
          ]
        },
        workflows: {
          type: "array",
          items: {
            ref: "t174"
          }
        },
        parity: {
          anyOf: [
            {
              ref: "t198"
            }
          ]
        }
      },
      required: [
        "schemaVersion",
        "contractRevision",
        "packageId",
        "projectId",
        "revision",
        "displayName",
        "registries",
        "nodes",
        "workflows"
      ]
    }
  }
};

// src/configStudio/nativeContractValidation.ts
function validateNativeStructure(value) {
  const definitions = native_contract_schema_generated_default.definitions;
  const inspect = (value2, input, path2, depth) => {
    if (depth > 64) return [{ path: path2, message: "\u914D\u7F6E\u5D4C\u5957\u8D85\u8FC7 64 \u5C42\u3002" }];
    const schema = input.ref ? definitions[input.ref] : input;
    if (schema.anyOf) {
      const choices = schema.anyOf.map((branch) => inspect(value2, branch, path2, depth + 1));
      if (choices.some((issues) => !issues.length)) return [];
      return choices.sort((a, b) => a.length - b.length)[0] ?? [{ path: path2, message: "\u914D\u7F6E\u503C\u7C7B\u578B\u65E0\u6548\u3002" }];
    }
    if ("const" in schema) return value2 === schema.const ? [] : [{ path: path2, message: `\u914D\u7F6E\u503C\u5FC5\u987B\u4E3A ${JSON.stringify(schema.const)}\u3002` }];
    if (!schema.type) return [];
    if (schema.type === "null") return value2 === null ? [] : [{ path: path2, message: "\u914D\u7F6E\u503C\u5FC5\u987B\u4E3A\u7A7A\u3002" }];
    if (schema.type === "array") {
      if (!Array.isArray(value2)) return [{ path: path2, message: "\u914D\u7F6E\u503C\u5FC5\u987B\u4E3A\u6570\u7EC4\u3002" }];
      if (schema.tuple && schema.tuple.length !== value2.length) return [{ path: path2, message: `\u6570\u7EC4\u5FC5\u987B\u5305\u542B ${schema.tuple.length} \u9879\u3002` }];
      return value2.flatMap((item, index) => inspect(item, schema.tuple?.[index] ?? schema.items ?? {}, `${path2}/${index}`, depth + 1)).slice(0, 100);
    }
    if (schema.type === "object") {
      if (!value2 || typeof value2 !== "object" || Array.isArray(value2)) return [{ path: path2, message: "\u914D\u7F6E\u503C\u5FC5\u987B\u4E3A\u5BF9\u8C61\u3002" }];
      const record = value2;
      const issues = (schema.required ?? []).filter((key2) => record[key2] === void 0).map((key2) => ({ path: `${path2}/${key2}`, message: "\u7F3A\u5C11\u5FC5\u9700\u7684\u914D\u7F6E\u5C5E\u6027\u3002" }));
      for (const [key2, item] of Object.entries(record)) {
        if (item === void 0) continue;
        const shape2 = schema.properties?.[key2] ?? schema.additionalProperties;
        if (!shape2 || ["__proto__", "constructor", "prototype"].includes(key2)) issues.push({ path: `${path2}/${key2}`, message: `\u672A\u77E5\u6216\u4E0D\u5B89\u5168\u7684\u914D\u7F6E\u5C5E\u6027 ${key2}\u3002` });
        else issues.push(...inspect(item, shape2, `${path2}/${key2}`, depth + 1));
        if (issues.length >= 100) break;
      }
      return issues.slice(0, 100);
    }
    return typeof value2 === schema.type && (schema.type !== "number" || Number.isFinite(value2)) ? [] : [{ path: path2, message: `\u914D\u7F6E\u503C\u5FC5\u987B\u4E3A\u6709\u6548\u7684 ${schema.type}\u3002` }];
  };
  return inspect(value, native_contract_schema_generated_default.root, "config", 0);
}

// src/configStudio/runtime.ts
var packageValidationRuns = 0;
var GEOMETRIES = ["Point", "LineString", "Polygon"];
var SYSTEM_FIELD_KEYS = /* @__PURE__ */ new Set([
  "ID",
  "Name",
  "World",
  "Class",
  "Kind",
  "Skind",
  "Skind2",
  "SKind",
  "SKind2",
  "Type",
  "CreateBy",
  "CreateTime",
  "ModifityTime",
  "ModifityBy",
  "CoordP",
  "CoordL",
  "CoordG"
]);
var PROTECTED_FIELD_KEYS = new Set([...SYSTEM_FIELD_KEYS].filter((key2) => key2 !== "Name"));
var EXTERNAL_WORKFLOW_REASONS = /* @__PURE__ */ new Set(["railway-integrated", "station-integrated", "trp-integrated"]);
var CARD_RENDERERS = /* @__PURE__ */ new Set(["text", "tag", "colorCapsule", "nameColorCapsule", "relationLink", "lineChips", "media"]);
var compiledConfigs = /* @__PURE__ */ new WeakMap();
var compiledPathKey = (path2) => JSON.stringify([path2.class, path2.kind ?? "", path2.skind ?? "", path2.skind2 ?? ""]);
function freezeData(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeData);
    Object.freeze(value);
  }
  return value;
}
function cachedPathValue(map, key2, value) {
  if (map.size < 1024) map.set(key2, value);
  return value;
}
function classificationPathKey(path2) {
  return [path2.class, path2.kind, path2.skind, path2.skind2].filter((value) => Boolean(value)).join("/");
}
function fieldScope(field) {
  if (field.scope) return field.scope;
  if (field.key === "tags" || field.key.startsWith("tags.")) return "tags";
  if (field.key === "extensions" || field.key.startsWith("extensions.")) return "extensions";
  return "root";
}
function readRecordPath(record, path2) {
  if (Object.prototype.hasOwnProperty.call(record, path2)) return record[path2];
  return path2.split(".").reduce((current2, part) => current2 && typeof current2 === "object" && Object.prototype.hasOwnProperty.call(current2, part) ? current2[part] : void 0, record);
}
function normalizeSearchProfile(search) {
  if (!search) return void 0;
  const coarse = search.coarse;
  const queryFields = search.queryFields?.filter(Boolean) ?? search.searchFields?.filter(Boolean) ?? [];
  const displayFields = search.displayFields?.filter(Boolean) ?? [];
  const returnFields = search.returnFields?.filter(Boolean) ?? [];
  const returnField = search.returnField?.trim() || returnFields[0] || "ID";
  const displayTemplate = search.displayTemplate?.trim() || (displayFields.length ? displayFields.map((field) => `{{${field}}}`).join(" ") : "{{ID}} ({{Name}})");
  return {
    target: search.target,
    ...search.targetRole ? { targetRole: search.targetRole } : {},
    queryFields,
    displayTemplate,
    returnField,
    matcher: search.matcher ?? coarse?.matcher ?? "contains",
    minQueryLength: search.minQueryLength ?? coarse?.minQueryLength ?? 1,
    maxResults: search.maxResults ?? coarse?.maxResults ?? 30,
    ...search.debounceMs ?? coarse?.debounceMs ? { debounceMs: search.debounceMs ?? coarse?.debounceMs } : {},
    cacheScope: search.cacheScope
  };
}
function pathDepth(path2) {
  return [path2.class, path2.kind, path2.skind, path2.skind2].filter(Boolean).length;
}
function isContinuousPath(path2) {
  return Boolean(path2.class) && (!path2.skind || Boolean(path2.kind)) && (!path2.skind2 || Boolean(path2.skind));
}
function nodeMatchesPath(node, path2) {
  return Object.entries(node.path).every(([key2, value]) => !value || path2[key2] === value);
}
function pathMatchesScope(candidate, scope) {
  return Object.entries(scope).every(([key2, value]) => !value || candidate[key2] === value);
}
function parentClassificationPath(path2) {
  if (path2.skind2) return { class: path2.class, kind: path2.kind, skind: path2.skind };
  if (path2.skind) return { class: path2.class, kind: path2.kind };
  if (path2.kind) return { class: path2.class };
  return void 0;
}
function inheritanceControls(node) {
  if (node.inheritDown) return node.inheritDown;
  return {
    fields: node.policies?.fields !== "localOnly",
    display: node.policies?.display !== "localOnly",
    card: node.policies?.card !== "localOnly"
  };
}
function resolveCategoryNodes(config, path2) {
  const compiled = compiledConfigs.get(config);
  if (compiled) {
    const key2 = compiledPathKey(path2);
    const cached = compiled.ancestors.get(key2);
    if (cached) {
      compiled.hits++;
      return cached;
    }
    return cachedPathValue(compiled.ancestors, key2, freezeData((compiled.byClass.get(path2.class) ?? []).filter((node) => nodeMatchesPath(node, path2))));
  }
  return config.nodes.filter((node) => nodeMatchesPath(node, path2)).sort((a, b) => pathDepth(a.path) - pathDepth(b.path));
}
function listCategoryPaths(config, scope = { class: "" }) {
  return config.nodes.map((node) => node.path).filter((path2) => pathMatchesScope(path2, scope)).sort((a, b) => pathDepth(a) - pathDepth(b) || classificationPathKey(a).localeCompare(classificationPathKey(b)));
}
function hasCategoryNode(config, path2) {
  return config.nodes.some((node) => classificationPathKey(node.path) === classificationPathKey(path2));
}
function hasDescendants(config, path2) {
  const compiled = compiledConfigs.get(config);
  if (compiled) return compiled.descendants.has(compiledPathKey(path2));
  return config.nodes.some((node) => pathDepth(node.path) > pathDepth(path2) && pathMatchesScope(node.path, path2));
}
function resolveEffectiveFields(config, path2) {
  const compiled = compiledConfigs.get(config);
  const cacheKey = compiledPathKey(path2);
  const cached = compiled?.fields.get(cacheKey);
  if (cached) {
    compiled.hits++;
    return cached;
  }
  const values2 = /* @__PURE__ */ new Map();
  let inherited = true;
  for (const [index, node] of resolveCategoryNodes(config, path2).entries()) {
    if (index > 0 && !inherited) {
      if (config.contractRevision >= 10) {
        for (const [key2, field] of values2) if (field.inheritance !== "sealed") values2.delete(key2);
      } else values2.clear();
    }
    if (index > 0 && config.contractRevision >= 10 && inherited) {
      for (const [key2, field] of values2) if (field.inheritance !== "localOnly") values2.set(key2, { ...field, inheritance: "sealed" });
    }
    if (index > 0 && config.contractRevision >= 9 && node.receiveFromParent?.fields === false) {
      for (const [key2, field] of values2) if (field.inheritance !== "sealed") values2.delete(key2);
    }
    if (index > 0) {
      for (const [key2, field] of values2) if (field.inheritance === "localOnly") values2.delete(key2);
    }
    for (const field of node.fields) {
      const key2 = field.overrideOf || field.key;
      if (values2.get(key2)?.inheritance === "sealed") continue;
      values2.set(key2, effectiveOptionsOwner(config, { ...field, key: key2, ...field.optionSource ? { options: config.registries.optionSets?.find((set) => set.id === field.optionSource?.registryKey)?.options ?? field.options } : {} }));
    }
    inherited = inheritanceControls(node).fields;
  }
  const result = [...values2.values()];
  return compiled ? cachedPathValue(compiled.fields, cacheKey, freezeData(result)) : result;
}
function resolveIncomingFields(config, path2) {
  const parent = parentClassificationPath(path2);
  if (!parent) return [];
  const node = config.nodes.find((node2) => classificationPathKey(node2.path) === classificationPathKey(parent));
  const fields = resolveEffectiveFields(config, parent);
  if (config.contractRevision < 10) return fields.filter((field) => field.inheritance === "sealed");
  return fields.filter((field) => field.inheritance === "sealed" || node && inheritanceControls(node).fields && field.inheritance !== "localOnly").map((field) => ({ ...field, inheritance: "sealed" }));
}
function resolveWorkflowSelectOptions(config, control) {
  if (control.optionsTableId || control.optionsFieldRef || control.optionTable) return effectiveOptions(config, control);
  if (config.contractRevision >= 8) return control.options ?? [];
  return control.optionSource ? config.registries.optionSets?.find((set) => set.id === control.optionSource?.registryKey)?.options ?? [] : control.options ?? [];
}
function systemFieldDefinition(key2) {
  return {
    fieldId: `system-${key2}`,
    key: key2,
    type: "string",
    cardinality: "single",
    input: "text",
    labels: { zh: key2, en: key2 },
    description: { zh: "\u8FD0\u884C\u65F6\u7CFB\u7EDF\u5B57\u6BB5", en: "Runtime system field" },
    inheritance: "sealed"
  };
}
function resolveSelectableFields(config, scope, options = {}) {
  const systemKeys = [...SYSTEM_FIELD_KEYS].filter((key2) => config.contractRevision < 8 || !["Skind", "Skind2"].includes(key2));
  const compiled = compiledConfigs.get(config);
  const cacheKey = `${compiledPathKey(scope)}:${options.includeSystem !== false}`;
  const cached = compiled?.selectable.get(cacheKey);
  if (cached) {
    compiled.hits++;
    return cached;
  }
  const concrete = config.nodes.filter((node) => pathMatchesScope(node.path, scope) && !hasDescendants(config, node.path));
  const candidates = concrete.length ? concrete : config.nodes.filter((node) => pathMatchesScope(node.path, scope));
  if (!candidates.length) return options.includeSystem === false ? [] : systemKeys.map(systemFieldDefinition);
  const fieldSets = candidates.map((node) => new Map(resolveEffectiveFields(config, node.path).map((field) => [field.key, field])));
  const common = [...fieldSets[0].values()].filter((field) => fieldSets.every((set) => set.has(field.key)));
  if (options.includeSystem === false) return compiled ? cachedPathValue(compiled.selectable, cacheKey, freezeData(common)) : common;
  const custom = new Set(common.map((field) => field.key));
  const result = [...systemKeys.filter((key2) => !custom.has(key2)).map(systemFieldDefinition), ...common];
  return compiled ? cachedPathValue(compiled.selectable, cacheKey, freezeData(result)) : result;
}
function resolveInheritedValue(config, path2, branch, read) {
  let result;
  let inherited = true;
  for (const [index, node] of resolveCategoryNodes(config, path2).entries()) {
    if (index > 0 && (!inherited || config.contractRevision >= 9 && node.receiveFromParent?.[branch] === false)) result = void 0;
    const candidate = read(node);
    if (candidate !== void 0) result = candidate;
    inherited = inheritanceControls(node)[branch];
  }
  return result;
}
function resolveGeometryProfile(config, path2, geometry) {
  const compiled = compiledConfigs.get(config);
  const key2 = `${compiledPathKey(path2)}:${geometry}`;
  if (compiled?.profiles.has(key2)) {
    compiled.hits++;
    return compiled.profiles.get(key2);
  }
  const selectedType = resolveInheritedValue(config, path2, "display", (node) => node.geometryType);
  const result = selectedType && selectedType !== geometry ? void 0 : resolveInheritedValue(config, path2, "display", (node) => node.geometryProfiles[geometry]);
  return compiled ? cachedPathValue(compiled.profiles, key2, result) : result;
}
function resolveRenderExtensions(config, geometry, local) {
  const compiled = compiledConfigs.get(config);
  const cached = local ? compiled?.extensions.get(local)?.get(geometry) : compiled?.defaults.get(geometry);
  if (cached) {
    compiled.hits++;
    return cached;
  }
  const result = structuredClone(config.engine?.renderDefaults?.[geometry] ?? {});
  for (const [key2, value] of Object.entries(local ?? {})) {
    if (value === void 0) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const object = value;
      if (object.mode === "inherit") continue;
      const previous = result[key2];
      const patch = Object.fromEntries(Object.entries(object).filter(([, item]) => item !== void 0 && item !== "inherit"));
      result[key2] = { ...previous && typeof previous === "object" ? previous : {}, ...patch };
    } else result[key2] = value;
  }
  if (compiled) {
    freezeData(result);
    if (!local) compiled.defaults.set(geometry, result);
    else {
      const map = compiled.extensions.get(local) ?? /* @__PURE__ */ new Map();
      map.set(geometry, result);
      compiled.extensions.set(local, map);
    }
  }
  return result;
}
function resolveCardConfiguration(config, path2, bindings = true) {
  const compiled = bindings ? compiledConfigs.get(config) : void 0;
  const key2 = compiledPathKey(path2);
  if (compiled?.cards.has(key2)) {
    compiled.hits++;
    return compiled.cards.get(key2);
  }
  let result = resolveInheritedValue(config, path2, "card", (node) => node.card);
  if (config.contractRevision >= 10) {
    result = void 0;
    let parentId = "", propagate = true;
    for (const node of resolveCategoryNodes(config, path2)) {
      const continuing = result?.mode === "fields" ? { ...result, items: result.items.filter((item) => item.inheritFrom) } : void 0;
      result = mergeInheritedCard(propagate ? result : continuing, node.card, parentId);
      parentId = node.nodeId;
      propagate = inheritanceControls(node).card;
    }
  }
  if (bindings && config.contractRevision >= 11 && result?.mode === "fields") result = { ...result, items: result.items.map((item) => resolveBoundCard(config, item)) };
  return compiled ? cachedPathValue(compiled.cards, key2, result) : result;
}
function issue(issues, severity, code, path2, message, extra = {}) {
  issues.push({ severity, code, path: path2, message, ...extra });
}
function validateCondition(condition, path2, issues) {
  if (condition.kind === "zoomRange" && condition.min !== void 0 && condition.max !== void 0 && condition.min >= condition.max) issue(issues, "error", "zoom-range-invalid", path2, "Zoom \u533A\u95F4\u7684\u4E0B\u754C\u5FC5\u987B\u5C0F\u4E8E\u4E0A\u754C\u3002");
  if (condition.kind === "bboxArea" && condition.min !== void 0 && condition.max !== void 0 && condition.min > condition.max) issue(issues, "error", "bbox-range-invalid", path2, "\u9762\u79EF\u533A\u95F4\u7684\u4E0B\u754C\u4E0D\u80FD\u5927\u4E8E\u4E0A\u754C\u3002");
}
function validateField(field, path2, known, issues) {
  const scope = fieldScope(field);
  const rootKey = /^(?!tags\.)(?!extensions\.)[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/;
  const nestedKey = /^(?:tags|extensions)\.[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/;
  if (!(scope === "root" ? rootKey.test(field.key) : nestedKey.test(field.key) && field.key.startsWith(`${scope}.`))) issue(issues, "error", "field-key-invalid", path2, `\u5B57\u6BB5\u8DEF\u5F84 ${field.key || "\uFF08\u7A7A\uFF09"} \u5FC5\u987B\u4E0E\u6240\u5C5E\u5B57\u6BB5\u7EC4\u4E00\u81F4\u3002`, { field: field.key });
  if (field.key === "tags" || field.key === "extensions") issue(issues, "error", "field-group-redefined", path2, "tags/extensions \u662F\u56FA\u5B9A\u5B57\u6BB5\u7EC4\uFF0C\u4E0D\u80FD\u5B9A\u4E49\u4E3A\u666E\u901A\u5B57\u6BB5\u6216\u5220\u9664\u3002");
  if (PROTECTED_FIELD_KEYS.has(field.key)) issue(issues, "error", "system-field-redefined", path2, `\u7CFB\u7EDF\u5B57\u6BB5 ${field.key} \u4E0D\u80FD\u5728\u5206\u7C7B\u914D\u7F6E\u4E2D\u91CD\u65B0\u5B9A\u4E49\u3002`, { field: field.key });
  if (known.has(field.key)) issue(issues, "error", "field-key-duplicate", path2, `\u5B57\u6BB5 ${field.key} \u5728\u540C\u4E00\u5206\u7C7B\u8282\u70B9\u4E2D\u91CD\u590D\u3002`, { field: field.key });
  known.add(field.key);
  if (!(field.labels.zh.trim() || field.labels.en.trim())) issue(issues, "error", "field-label-zh-required", path2, "\u5B57\u6BB5\u5FC5\u987B\u63D0\u4F9B\u4E2D\u6587\u6216\u82F1\u6587\u6807\u7B7E\u3002", { field: field.key });
  if (field.type === "enum" && (!field.options?.length && !field.optionSource?.registryKey)) issue(issues, "error", "enum-options-required", path2, "\u679A\u4E3E\u5B57\u6BB5\u5FC5\u987B\u63D0\u4F9B\u9759\u6001\u9009\u9879\u6216\u53D7\u63A7\u9009\u9879\u6CE8\u518C\u8868\u3002", { field: field.key });
  const optionValues = /* @__PURE__ */ new Set();
  for (const option of field.options ?? []) {
    const normalized = field.optionValueType === "number" ? String(Number(option.value)) : option.value;
    if (!option.value.trim() || optionValues.has(normalized) || field.optionValueType === "number" && !Number.isFinite(Number(option.value)) || field.optionValueType === "boolean" && !["true", "false"].includes(option.value)) issue(issues, "error", "field-option-invalid", path2, "\u5BF9\u7167\u5B58\u50A8\u503C\u5FC5\u987B\u6709\u6548\u3001\u7B26\u5408\u7C7B\u578B\u4E14\u4E0D\u80FD\u91CD\u590D\u3002", { field: field.key });
    optionValues.add(normalized);
  }
  if (!isSafeWorkflowTarget(field.key)) issue(issues, "error", "field-key-unsafe", path2, "\u5B57\u6BB5\u8DEF\u5F84\u5305\u542B\u4E0D\u5B89\u5168\u7684\u5C5E\u6027\u540D\u3002");
  field.requiredWhen?.forEach((item, index) => validateCondition(item, `${path2}/requiredWhen/${index}`, issues));
  if (field.overrideOf && field.key !== field.overrideOf) issue(issues, "error", "field-override-key-invalid", path2, "\u7EE7\u627F\u8986\u76D6\u4E0D\u80FD\u66F4\u6539\u5B57\u6BB5\u8DEF\u5F84\uFF1B\u8BF7\u65B0\u589E\u53E6\u4E00\u4E2A\u5B57\u6BB5\u3002");
  if (field.requiredWhen?.some((condition) => condition.kind === "zoomRange" || condition.kind === "bboxArea")) issue(issues, "error", "field-required-context-unsupported", path2, "\u6761\u4EF6\u5FC5\u586B\u4F7F\u7528\u5B57\u6BB5\u6761\u4EF6\uFF1BZoom/\u9762\u79EF\u6761\u4EF6\u5C5E\u4E8E\u663E\u793A\u89C4\u5219\u3002");
  if (field.defaultValue !== void 0) {
    const values2 = field.cardinality === "multiple" && Array.isArray(field.defaultValue) ? field.defaultValue : [field.defaultValue];
    if (field.cardinality === "multiple" && !Array.isArray(field.defaultValue) || values2.some((value) => field.type === "number" ? typeof value !== "number" || !Number.isFinite(value) : field.type === "boolean" ? typeof value !== "boolean" : field.type === "enum" ? typeof value !== (field.optionValueType ?? "string") || !field.options?.some((option) => option.value === String(value)) : ["string", "reference"].includes(field.type) ? typeof value !== "string" : false)) issue(issues, "error", "field-default-invalid", path2, "\u9ED8\u8BA4\u503C\u4E0E\u5B57\u6BB5\u7C7B\u578B/\u503C\u6570\u91CF\u4E0D\u4E00\u81F4\u3002");
  }
}
function validateRenderColorBinding(binding, config, sourcePath, path2, issues) {
  if (!binding || typeof binding !== "object") {
    issue(issues, "error", "render-color-binding-required", path2, "\u6E32\u67D3\u989C\u8272\u5FC5\u987B\u8BBE\u7F6E\u4E3A\u76F4\u63A5\u989C\u8272\u3001\u5F53\u524D\u5B57\u6BB5\u6216\u5916\u90E8\u8981\u7D20\u5B57\u6BB5\u3002");
    return;
  }
  const value = binding;
  const fallback = binding.fallbackColor;
  if (fallback !== void 0 && !validCssColor(fallback)) issue(issues, "error", "render-color-fallback-invalid", path2, "\u56DE\u9000\u989C\u8272\u9700\u8981\u6709\u6548\u7684\u5341\u516D\u8FDB\u5236\u3001RGB/HSL\u3001\u547D\u540D\u8272\u6216 transparent\u3002");
  const sourceFields = new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key));
  if (value.mode === "valueMap") {
    const mapping = binding, field = resolveSelectableFields(config, sourcePath).find((f) => f.key === mapping.field);
    if (config.contractRevision < 9) issue(issues, "error", "render-color-r9-required", path2, "\u6309\u503C\u8BBE\u8272\u9700\u8981 r9\u3002");
    if (!field) issue(issues, "error", "render-color-map-field-invalid", path2, "\u8BBE\u8272\u5B57\u6BB5\u4E0D\u5B58\u5728\u3002");
    if (!validMappedColor(mapping.fallbackColor)) issue(issues, "error", "render-color-map-fallback-invalid", path2, "\u56DE\u9000\u989C\u8272\u5FC5\u987B\u4E3A\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u989C\u8272\u3002");
    if (!Array.isArray(mapping.entries) || !mapping.entries.length) {
      issue(issues, "error", "render-color-map-empty", path2, "\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u8BBE\u8272\u503C\u3002");
      return;
    }
    const seen = /* @__PURE__ */ new Set();
    for (const entry of mapping.entries) {
      if (seen.has(entry.value)) issue(issues, "error", "render-color-map-duplicate", path2, "\u8BBE\u8272\u4FDD\u5B58\u503C\u91CD\u590D\u3002");
      seen.add(entry.value);
      if (!validMappedColor(entry.color)) issue(issues, "error", "render-color-map-color-invalid", path2, "\u6620\u5C04\u989C\u8272\u5FC5\u987B\u4E3A\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u989C\u8272\u3002");
      if (field) for (const message of scalarValueErrors(field, entry.value)) issue(issues, "error", "render-color-map-value-invalid", path2, message);
    }
    return;
  }
  if (value.mode === "fixed") {
    if (!validCssColor(value.color)) issue(issues, "error", "render-color-fixed-required", path2, "\u76F4\u63A5\u989C\u8272\u5FC5\u987B\u4E3A\u6709\u6548\u7684\u5341\u516D\u8FDB\u5236\u3001RGB/HSL\u3001\u547D\u540D\u8272\u6216 transparent\u3002");
    return;
  }
  if (value.mode === "field") {
    if (!value.field || !sourceFields.has(value.field)) issue(issues, "error", "render-color-field-invalid", path2, "\u7ED1\u5B9A\u989C\u8272\u5B57\u6BB5\u5FC5\u987B\u662F\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3002", { field: value.field });
    return;
  }
  if (value.mode === "external") {
    if (!value.target || !isContinuousPath(value.target) || !hasCategoryNode(config, value.target)) issue(issues, "error", "render-color-target-classification-invalid", path2, "\u5916\u90E8\u989C\u8272\u5FC5\u987B\u9009\u62E9\u5B58\u5728\u4E14\u8FDE\u7EED\u7684\u76EE\u6807\u5206\u7C7B\u3002");
    if (!value.targetIdField || !sourceFields.has(value.targetIdField) && !SYSTEM_FIELD_KEYS.has(value.targetIdField)) issue(issues, "error", "render-color-target-id-field-invalid", path2, "\u989C\u8272\u76EE\u6807\u8981\u7D20 ID \u5B57\u6BB5\u5FC5\u987B\u662F\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3002", { field: value.targetIdField });
    const targetFields = value.target && isContinuousPath(value.target) && hasCategoryNode(config, value.target) ? new Set(resolveSelectableFields(config, value.target).map((field) => field.key)) : /* @__PURE__ */ new Set();
    if (!value.targetColorField || !targetFields.has(value.targetColorField)) issue(issues, "error", "render-color-target-field-invalid", path2, "\u76EE\u6807\u8981\u7D20\u989C\u8272\u5B57\u6BB5\u5FC5\u987B\u5728\u76EE\u6807\u5206\u7C7B\u4E2D\u6709\u6548\u3002", { field: value.targetColorField });
    return;
  }
  if (value.mode === "relatedLine") {
    if (!["featureRelation", "platformFirstLine", "stationFirstPlatform"].includes(String(value.strategy ?? ""))) issue(issues, "error", "render-color-related-line-strategy-invalid", path2, "\u5173\u8054\u7EBF\u8DEF\u989C\u8272\u5FC5\u987B\u9009\u62E9\u5DF2\u652F\u6301\u7684\u5173\u7CFB\u7B56\u7565\u3002");
    return;
  }
  issue(issues, "error", "render-color-mode-invalid", path2, "\u6E32\u67D3\u989C\u8272\u6A21\u5F0F\u65E0\u6548\u3002");
}
function allowedTriggerKeys(geometry) {
  if (geometry === "Point") return ["point", "label"];
  if (geometry === "LineString") return ["line", "label"];
  return ["boundary", "interior", "label"];
}
function allowedMetrics(geometry) {
  return geometry === "Point" ? /* @__PURE__ */ new Set(["partCount", "field"]) : geometry === "LineString" ? /* @__PURE__ */ new Set(["length", "partCount", "field"]) : /* @__PURE__ */ new Set(["area", "partCount", "field"]);
}
function numericMetricField(config, path2, key2) {
  const field = resolveEffectiveFields(config, path2).find((field2) => field2.key === key2);
  return Boolean(field && field.cardinality === "single" && (field.type === "number" || field.type === "enum" && field.optionValueType === "number"));
}
function validateRuleLabel(rule, rulePath, config, sourcePath, issues) {
  const label = rule.label;
  if (!label) {
    issue(issues, "error", "render-label-required", rulePath, "\u6BCF\u4E2A\u6E32\u67D3\u89C4\u5219\u5FC5\u987B\u5B9A\u4E49 Label \u6548\u679C\u3002");
    return;
  }
  for (const axis of ["offsetX", "offsetY"]) if (label[axis] !== void 0 && !Number.isFinite(label[axis])) issue(issues, "error", "label-offset-invalid", rulePath, `${axis} \u5FC5\u987B\u662F\u6709\u9650\u6570\u5B57\u3002`);
  if (label.placement && !["center", "near", "N", "S", "E", "W", "NE", "NW", "SE", "SW", "aboveLine", "belowLine"].includes(label.placement)) issue(issues, "error", "label-placement-invalid", rulePath, "Label \u4F4D\u7F6E\u65E0\u6548\u3002");
  if (!Number.isFinite(label.collision.basePriority)) issue(issues, "error", "label-base-priority-invalid", rulePath, "Label \u57FA\u7840\u4F18\u5148\u7EA7\u5FC5\u987B\u662F\u6709\u9650\u6570\u5B57\u3002");
  const metric = label.collision.metric;
  if (metric) {
    if (!["area", "length", "partCount", "field"].includes(metric.kind)) issue(issues, "error", "label-metric-kind-invalid", rulePath, "\u78B0\u649E\u6307\u6807\u7C7B\u578B\u65E0\u6548\u3002");
    for (const key2 of ["multiplier", "divisor", "min", "max"]) if (metric[key2] !== void 0 && (!Number.isFinite(metric[key2]) || key2 === "divisor" && metric[key2] === 0)) issue(issues, "error", "label-metric-value-invalid", rulePath, "\u78B0\u649E\u6307\u6807\u53C2\u6570\u5FC5\u987B\u4E3A\u6709\u9650\u6570\u5B57\uFF0C\u9664\u6570\u4E0D\u53EF\u4E3A\u96F6\u3002");
    if (metric.min !== void 0 && metric.max !== void 0 && metric.min > metric.max) issue(issues, "error", "label-metric-range-invalid", rulePath, "\u78B0\u649E\u6307\u6807\u4E0B\u9650\u4E0D\u80FD\u5927\u4E8E\u4E0A\u9650\u3002");
    if (metric.kind === "field" && !numericMetricField(config, sourcePath, metric.field)) issue(issues, "error", "label-metric-field-invalid", rulePath, "\u78B0\u649E\u6307\u6807\u9700\u8981\u5B58\u5728\u7684\u5355\u503C\u6570\u503C\u5B57\u6BB5\u6216\u6570\u503C\u679A\u4E3E\u5B57\u6BB5\u3002");
  }
  const fields = new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key));
  if (label.sourceMode === "combined") {
    if (config.contractRevision < 10) issue(issues, "error", "label-template-revision", rulePath, "\u7EC4\u5408 Label \u6765\u6E90\u9700\u8981 r10 \u5951\u7EA6\u3002");
    try {
      for (const token of parseLabelTemplate(label.template ?? "")) if (token.kind === "field" && !sourceExists(token.value, fields)) issue(issues, "error", "label-template-field", rulePath, `\u7EC4\u5408\u6765\u6E90\u5B57\u6BB5\u4E0D\u5B58\u5728\uFF1A${token.value}`);
    } catch (error) {
      issue(issues, "error", "label-template-invalid", rulePath, error.message);
    }
  }
  if (label.sourceMode !== "combined" && label.source && !sourceExists(label.source, fields)) issue(issues, "error", "render-label-source-invalid", rulePath, "Label \u6765\u6E90\u5FC5\u987B\u662F\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3001tags.xxx \u6216 extensions.xxx\u3002", { field: label.source });
  if (config.contractRevision >= 10) {
    const referenced = label.sourceMode === "combined" ? (() => {
      try {
        return parseLabelTemplate(label.template ?? "").filter((token) => token.kind === "field").map((token) => token.value);
      } catch {
        return [];
      }
    })() : label.source ? [label.source] : [];
    for (const path2 of referenced) {
      const field = resolveEffectiveFields(config, sourcePath).find((field2) => field2.key === path2);
      if (field && (field.type === "json" || field.cardinality !== "single")) issue(issues, "error", "label-complex-source-format", rulePath, "Label \u6765\u6E90\u9700\u8981\u6807\u91CF\u5B57\u6BB5\uFF1B\u6570\u7EC4/\u5BF9\u8C61\u5FC5\u987B\u5148\u6CE8\u518C\u660E\u786E\u7684\u663E\u793A\u683C\u5F0F\u3002", { field: path2 });
    }
  }
  for (const fallback of label.fallbackSources ?? []) if (!sourceExists(fallback, fields)) issue(issues, "error", "render-label-fallback-source-invalid", rulePath, "Label \u56DE\u9000\u6765\u6E90\u5FC5\u987B\u662F\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3001tags.xxx \u6216 extensions.xxx\u3002", { field: fallback });
  if (label.valueFormat && !["plain", "floorLabel"].includes(label.valueFormat)) issue(issues, "error", "render-label-value-format-invalid", rulePath, "Label \u503C\u683C\u5F0F\u65E0\u6548\u3002");
  for (const [source, format] of Object.entries(label.fallbackValueFormats ?? {})) {
    if (!(label.fallbackSources ?? []).includes(source)) issue(issues, "error", "render-label-fallback-format-source-invalid", rulePath, "\u56DE\u9000\u683C\u5F0F\u53EA\u80FD\u7ED1\u5B9A\u5230\u5DF2\u58F0\u660E\u7684 Label \u56DE\u9000\u6765\u6E90\u3002", { field: source });
    if (!["plain", "floorLabel"].includes(format)) issue(issues, "error", "render-label-fallback-format-invalid", rulePath, "\u56DE\u9000 Label \u683C\u5F0F\u65E0\u6548\u3002", { field: source });
  }
  const visual = label.style;
  if (isNativeConfigRevision(config.contractRevision) && (label.font !== void 0 || label.size !== void 0 || label.italic !== void 0 || label.underline !== void 0)) {
    issue(issues, "error", "legacy-label-field-forbidden", rulePath, "V3.2 \u5FC5\u987B\u4F7F\u7528 style.family / style.size / style.modifiers\uFF0C\u4E0D\u80FD\u6DF7\u5165\u65E7\u5B57\u4F53\u5B57\u6BB5\u3002");
  }
  if (!visual) {
    if (isNativeConfigRevision(config.contractRevision)) issue(issues, "error", "label-style-required", rulePath, "V3.2 \u539F\u751F\u89C4\u5219\u5FC5\u987B\u9009\u62E9\u4E00\u4E2A Label \u6837\u5F0F\u3002");
    return;
  }
  if (!Number.isFinite(visual.size) || visual.size < 6 || visual.size > 72) issue(issues, "error", "label-style-size-invalid", rulePath, "Label \u6837\u5F0F\u5B57\u53F7\u5FC5\u987B\u4ECB\u4E8E 6 \u5230 72\u3002");
  const supportsModifiers = /* @__PURE__ */ new Set(["gm-bw", "gm-outline", "gm-wtb", "structure-label"]);
  if ((visual.modifiers?.italic || visual.modifiers?.underline) && !supportsModifiers.has(visual.family)) issue(issues, "error", "label-style-modifier-invalid", rulePath, "\u659C\u4F53\u548C\u4E0B\u5212\u7EBF\u4EC5\u9002\u7528\u4E8E\u65E0\u80CC\u666F\u5BB9\u5668\u7684\u6587\u5B57\u6837\u5F0F\u3002");
  const needsColor = visual.family === "rle-line-color" || visual.family === "rle-pill-color";
  if (visual.family === "custom_pill_1") {
    if (config.contractRevision < 12) issue(issues, "error", "custom-pill-revision", rulePath, "\u81EA\u5B9A\u4E49\u80F6\u56CA1\u9700\u8981 r12 \u5951\u7EA6\u3002");
    for (const error of customPillErrors(visual.size, visual.pill)) issue(issues, "error", "custom-pill-invalid", `${rulePath}/label/style/pill/${error.key}`, error.message);
    if (visual.color || Object.values(visual.modifiers ?? {}).some(Boolean)) issue(issues, "error", "custom-pill-conflicting-style", rulePath, "\u81EA\u5B9A\u4E49\u80F6\u56CA\u4E0D\u80FD\u6DF7\u7528\u65E7\u989C\u8272\u6216\u5B57\u4F53\u4FEE\u9970\u3002");
    if (visual.pill) for (const key2 of ["textColor", "backgroundColor", "strokeColor"])
      validateRenderColorBinding(visual.pill[key2], config, sourcePath, `${rulePath}/label/style/pill/${key2}`, issues);
  } else if (visual.pill) issue(issues, "error", "custom-pill-inactive", rulePath, "\u5F53\u524D Label \u6837\u5F0F\u4E0D\u80FD\u643A\u5E26\u672A\u542F\u7528\u7684\u80F6\u56CA\u8BBE\u7F6E\u3002");
  if (needsColor) validateRenderColorBinding(visual.color, config, sourcePath, `${rulePath}/label/style/color`, issues);
  if (!needsColor && visual.color) issue(issues, "warning", "label-style-color-ignored", rulePath, "\u5F53\u524D\u6837\u5F0F\u65CF\u4F7F\u7528\u56FA\u5B9A\u7684 V1 \u8C03\u8272\u677F\uFF0C\u989C\u8272\u7ED1\u5B9A\u4E0D\u4F1A\u751F\u6548\u3002");
}
function validateRuleExtensions(rule, geometry, rulePath, config, sourcePath, issues) {
  const extensions = rule.extensions;
  if (!extensions) return;
  if (extensions.fallback?.whenRuleMissing && !["geometryOnly", "hidden"].includes(extensions.fallback.whenRuleMissing)) issue(issues, "error", "fallback-rule-unsupported", rulePath, "\u539F\u751F\u89C4\u5219\u7F3A\u5931\u4EC5\u652F\u6301\u9690\u85CF\u6216\u901A\u7528\u51E0\u4F55\uFF1B\u4E0D\u652F\u6301\u65E7\u89C4\u5219\u6216\u8C03\u8BD5\u6E32\u67D3\u5668\u56DE\u9000\u3002");
  if (extensions.fallback?.whenGeometryInvalid && extensions.fallback.whenGeometryInvalid !== "skip") issue(issues, "error", "fallback-geometry-unsupported", rulePath, "\u65E0\u6709\u6548\u51E0\u4F55\u65F6\u53EA\u80FD\u8DF3\u8FC7\uFF1B\u9519\u8BEF\u6807\u8BB0\u548C\u4EC5\u8C03\u8BD5\u5C1A\u672A\u5B9E\u73B0\uFF0C\u4E0D\u80FD\u4FDD\u5B58\u4E3A\u6709\u6548\u914D\u7F6E\u3002");
  for (const key2 of ["weightedSwitchThreshold", "reuseBonus", "edgePenalty"]) {
    const value = extensions.polygonCandidates?.[key2];
    if (value !== void 0 && value < 0) issue(issues, "error", "polygon-weight-invalid", rulePath, "\u9762\u5019\u9009\u6743\u91CD\u53C2\u6570\u5FC5\u987B\u975E\u8D1F\u3002");
  }
  for (const value of Object.values(extensions.collision?.boundsAdjustment ?? {})) if (value !== void 0 && (!Number.isFinite(value) || Math.abs(value) > 80)) issue(issues, "error", "collision-bounds-invalid", rulePath, "\u78B0\u649E\u6846\u8C03\u6574\u987B\u4E3A -80 \u5230 80 \u50CF\u7D20\u3002");
  const screen = extensions.screenGate;
  if (screen && screen.mode !== "inherit" && screen.mode !== "override") issue(issues, "error", "screen-gate-mode-invalid", rulePath, "\u5C4F\u5E55\u9608\u503C\u5FC5\u987B\u9009\u62E9\u7EE7\u627F\u5168\u5C40\u6216\u672C\u89C4\u5219\u8986\u76D6\u3002");
  if (screen?.mode === "override") {
    if (screen.minScreenAreaPx !== void 0 && (!Number.isFinite(screen.minScreenAreaPx) || screen.minScreenAreaPx < 0)) issue(issues, "error", "screen-gate-area-invalid", rulePath, "\u5C4F\u5E55\u9762\u79EF\u9608\u503C\u5FC5\u987B\u662F\u975E\u8D1F\u6570\u3002");
    if (screen.minScreenLengthPx !== void 0 && (!Number.isFinite(screen.minScreenLengthPx) || screen.minScreenLengthPx < 0)) issue(issues, "error", "screen-gate-length-invalid", rulePath, "\u5C4F\u5E55\u957F\u5EA6\u9608\u503C\u5FC5\u987B\u662F\u975E\u8D1F\u6570\u3002");
    if (geometry !== "Polygon" && screen.minScreenAreaPx !== void 0) issue(issues, "warning", "screen-gate-area-ignored", rulePath, "\u5C4F\u5E55\u9762\u79EF\u9608\u503C\u53EA\u9002\u7528\u4E8E\u9762\u8981\u7D20\u3002");
    if (geometry !== "LineString" && screen.minScreenLengthPx !== void 0) issue(issues, "warning", "screen-gate-length-ignored", rulePath, "\u5C4F\u5E55\u957F\u5EA6\u9608\u503C\u53EA\u9002\u7528\u4E8E\u7EBF\u8981\u7D20\u3002");
  }
  if (extensions.hitTolerancePx !== void 0 && (!Number.isFinite(extensions.hitTolerancePx) || extensions.hitTolerancePx < 0 || extensions.hitTolerancePx > 80)) issue(issues, "error", "hit-tolerance-invalid", rulePath, "\u70B9\u51FB\u5BB9\u5DEE\u5FC5\u987B\u4ECB\u4E8E 0 \u5230 80 \u50CF\u7D20\u3002");
  for (const [state, override] of Object.entries(extensions.interaction ?? {})) {
    if (!["hover", "selected", "searchResult", "editing", "deletionMarked"].includes(state)) issue(issues, "error", "interaction-state-invalid", rulePath, "\u4EA4\u4E92\u72B6\u6001\u65E0\u6548\u3002");
    const visual = { ...config.engine?.interactionBaselines[geometry][state], ...override };
    validateInteractionShape(visual, `${rulePath}/interaction/${state}`, issues);
    if (visual.strokeColorBinding) validateRenderColorBinding(visual.strokeColorBinding, config, sourcePath, `${rulePath}/interaction/${state}/strokeColorBinding`, issues);
  }
  if (extensions.pane && !["auto", "overlay", "overlay-top", "point", "point-top"].includes(extensions.pane)) issue(issues, "error", "pane-invalid", rulePath, "Pane \u8986\u76D6\u503C\u65E0\u6548\u3002");
  const labelText = extensions.labelText;
  if (labelText?.maxChars !== void 0 && (!Number.isInteger(labelText.maxChars) || labelText.maxChars < 1)) issue(issues, "error", "label-max-chars-invalid", rulePath, "Label \u6700\u5927\u5B57\u7B26\u6570\u5FC5\u987B\u662F\u6B63\u6574\u6570\u3002");
  if (labelText?.maxLines !== void 0 && (!Number.isInteger(labelText.maxLines) || labelText.maxLines < 1)) issue(issues, "error", "label-max-lines-invalid", rulePath, "Label \u6700\u5927\u884C\u6570\u5FC5\u987B\u662F\u6B63\u6574\u6570\u3002");
  if (labelText?.maxLines !== void 0 && !labelText.multiline) issue(issues, "warning", "label-max-lines-ignored", rulePath, "\u672A\u5F00\u542F\u591A\u884C Label \u65F6\uFF0C\u6700\u5927\u884C\u6570\u4E0D\u4F1A\u751F\u6548\u3002");
  const anchor = extensions.anchor;
  const allowedAnchorStrategies = geometry === "Point" ? /* @__PURE__ */ new Set(["inherit", "featureCenter"]) : geometry === "LineString" ? /* @__PURE__ */ new Set(["inherit", "featureCenter", "lineCenter", "lineCandidates"]) : /* @__PURE__ */ new Set(["inherit", "featureCenter", "interior", "visibleInterior"]);
  if (anchor?.strategy && !allowedAnchorStrategies.has(anchor.strategy)) issue(issues, "error", "anchor-strategy-geometry-invalid", rulePath, "\u5F53\u524D\u51E0\u4F55\u7C7B\u578B\u4E0D\u80FD\u4F7F\u7528\u8BE5\u5019\u9009\u951A\u70B9\u7B56\u7565\u3002");
  if (anchor?.candidates && new Set(anchor.candidates).size !== anchor.candidates.length) issue(issues, "error", "anchor-candidates-duplicate", rulePath, "\u5019\u9009\u951A\u70B9\u65B9\u5411\u4E0D\u80FD\u91CD\u590D\u3002");
  if (anchor?.candidateOffsetsPx) {
    const names2 = /* @__PURE__ */ new Set();
    for (const offset of anchor.candidateOffsetsPx) {
      if (!offset.name.trim() || names2.has(offset.name) || !Number.isFinite(offset.x) || !Number.isFinite(offset.y)) issue(issues, "error", "candidate-offset-invalid", rulePath, "\u5019\u9009\u540D\u79F0\u5FC5\u987B\u975E\u7A7A\u4E14\u552F\u4E00\uFF0CX/Y \u5FC5\u987B\u4E3A\u6709\u9650\u6570\u5B57\u3002");
      names2.add(offset.name);
    }
  }
  if (anchor?.offsetPx && (!Number.isFinite(anchor.offsetPx.x) || !Number.isFinite(anchor.offsetPx.y))) issue(issues, "error", "anchor-offset-invalid", rulePath, "\u951A\u70B9 X/Y \u5FC5\u987B\u4E3A\u6709\u9650\u6570\u5B57\u3002");
  const lists = [
    ["invalidateWhen", extensions.stability?.invalidateWhen, ["zoomBucketChanged", "featureGeometryChanged", "featureTextChanged", "modeChanged", "worldChanged", "labelOutOfViewport", "collisionFailedRepeatedly"]],
    ["reduceOrder", extensions.density?.reduceOrder, ["hideSoftLabels", "abbreviateOptionalLabels", "hideOptionalLabels", "hideSymbols", "geometryOnly"]],
    ["collideWith", extensions.collision?.collideWith, ["symbol", "requiredLabel", "importantLabel", "optionalLabel", "softLabel", "geometry"]],
    ["blocks", extensions.collision?.blocks, ["optionalLabel", "softLabel", "poiLabel", "structureLabel"]]
  ];
  for (const [name, values2, allowed] of lists) if (values2 && (new Set(values2).size !== values2.length || values2.some((value) => !allowed.includes(value)))) issue(issues, "error", "extension-list-invalid", `${rulePath}/${name}`, "\u7B56\u7565\u5217\u8868\u5B58\u5728\u91CD\u590D\u6216\u672A\u77E5\u503C\u3002");
  const density = extensions.density;
  if (density && density.mode !== "inherit" && density.mode !== "override") issue(issues, "error", "density-mode-invalid", rulePath, "\u5BC6\u5EA6\u9884\u7B97\u5FC5\u987B\u9009\u62E9\u7EE7\u627F\u6216\u672C\u89C4\u5219\u8986\u76D6\u3002");
  if (density?.mode === "override") {
    for (const [name, value] of Object.entries({ gridSizePx: density.gridSizePx, maxLabelsPerGrid: density.maxLabelsPerGrid, maxSymbolsPerGrid: density.maxSymbolsPerGrid })) {
      if (value !== void 0 && (!Number.isFinite(value) || Number(value) <= 0)) issue(issues, "error", "density-value-invalid", `${rulePath}/density/${name}`, "\u5BC6\u5EA6\u7F51\u683C\u53CA\u6BCF\u683C\u9884\u7B97\u5FC5\u987B\u4E3A\u6B63\u6570\u3002");
    }
  }
  const line = extensions.lineLabel;
  if (line && (line.orientationPolicy === "scriptAware" || line.textPathLengthMode !== void 0) && config.contractRevision < 12) issue(issues, "error", "line-script-revision", rulePath, "\u4E2D\u82F1\u5206\u6D41\u548C\u5B9E\u9645\u6587\u5B57\u8DEF\u5F84\u957F\u5EA6\u9700\u8981\u5951\u7EA6 r12\u3002");
  if (line && config.contractRevision >= 12) {
    for (const [key2, value] of Object.entries(line)) if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) issue(issues, "error", "line-setting-number-invalid", rulePath + "/lineLabel/" + key2, "\u8D34\u7EBF\u6570\u503C\u5FC5\u987B\u662F\u6709\u9650\u975E\u8D1F\u6570\u3002");
    for (const key2 of ["maxTurnAngleDeg", "textPathMaxAngleDeltaDeg", "textPathVerticalAngleThresholdDeg", "cjkGlyphUprightAngleThresholdDeg", "cjkGlyphMaxAngleDeltaDeg"]) if (line[key2] !== void 0 && line[key2] > 180) issue(issues, "error", "line-angle-invalid", rulePath + "/lineLabel/" + key2, "\u5C40\u90E8\u89D2\u5EA6\u5FC5\u987B\u4ECB\u4E8E 0\u2013180\xB0\u3002");
    for (const key2 of ["textPathVerticalLengthRatio", "cjkGlyphMinAdvanceScale", "textPathMaxHalfLengthRatio"]) if (line[key2] !== void 0 && (line[key2] < 0 || line[key2] > 1)) issue(issues, "error", "line-ratio-invalid", rulePath + "/lineLabel/" + key2, "\u6BD4\u4F8B\u5FC5\u987B\u4ECB\u4E8E 0\u20131\u3002");
    for (const key2 of ["cjkGlyphMaxCount", "advancedTextMaxLabels", "advancedTextMaxCandidatesPerPass", "candidateMax", "anchorSamples"]) if (line[key2] !== void 0 && (!Number.isInteger(line[key2]) || line[key2] < 1)) issue(issues, "error", "line-count-invalid", rulePath + "/lineLabel/" + key2, "\u9884\u7B97\u548C\u6570\u91CF\u5FC5\u987B\u4E3A\u6B63\u6574\u6570\u3002");
    if (line.orientationPolicy === "scriptAware" && (line.cjkGlyphPathMode === "off" || line.advancedTextEnabled === false)) issue(issues, "error", "line-script-disabled", rulePath, "\u4E2D\u82F1\u5206\u6D41\u9700\u8981\u542F\u7528\u5171\u4EAB\u5B57\u5F62\u8DEF\u5F84\uFF0C\u4E0D\u80FD\u540C\u65F6\u5173\u95ED\u3002");
    if (line.orientationPolicy === "scriptAware" && line.repositionMode === "chainageSearch" && line.repositionStrictSvg !== false && (line.cjkGlyphFallbackMode === "simpleLineLabel" || line.cjkGlyphFallbackMode === "rotatedLabel" || line.textPathFallback === "rotatedLabel" || line.repositionFailure === "simpleLineLabel" || line.simpleFallbackEnabled === true)) issue(issues, "error", "line-svg-fallback-conflict", rulePath, "\u4E25\u683C SVG \u91CD\u5B9A\u4F4D\u4E0D\u80FD\u540C\u65F6\u58F0\u660E HTML\uFF0F\u7B80\u5355\u6587\u5B57\u56DE\u9000\uFF1B\u8BF7\u9009\u62E9\u9690\u85CF\u6216\u660E\u786E\u7684 SVG \u8DEF\u5F84\u56DE\u9000\u3002");
    const background = ["custom_pill_1", "bubble-dark", "rle-pill-color"].includes(rule.label?.style?.family ?? "");
    if (background && (line.textMode === "textPath" || line.advancedTextEnabled !== false && (line.textMode === "auto" || line.orientationPolicy === "scriptAware" || line.profile === "strict-on-line"))) issue(issues, "error", "label-background-svg-capability", rulePath, "\u80F6\u56CA\uFF0F\u6C14\u6CE1\u9700\u8981\u80CC\u666F\u5BB9\u5668\uFF1B\u5F53\u524D\u7EAF\u6587\u5B57\u8D34\u7EBF SVG \u4E0D\u652F\u6301\u8BE5\u6837\u5F0F\uFF0C\u8BF7\u9009\u62E9\u666E\u901A\u6807\u7B7E\u6A21\u5F0F\u3002");
  }
  const lineExtensionConfigured = Boolean(line && Object.entries(line).some(([key2, value]) => key2 === "profile" ? value !== "inherit" : value !== void 0));
  if (lineExtensionConfigured && geometry !== "LineString") issue(issues, "error", "line-label-extension-geometry-invalid", rulePath, "\u7EBF Label \u6269\u5C55\u53EA\u80FD\u7528\u4E8E\u7EBF\u8981\u7D20\u3002");
  if (line && line.maxTurnAngleDeg !== void 0 && (!Number.isFinite(line.maxTurnAngleDeg) || line.maxTurnAngleDeg < 0 || line.maxTurnAngleDeg > 180)) issue(issues, "error", "line-label-turn-angle-invalid", rulePath, "\u7EBF Label \u8F6C\u89D2\u9608\u503C\u5FC5\u987B\u4ECB\u4E8E 0 \u5230 180 \u5EA6\u3002");
  if (line && line.endpointPaddingRatio !== void 0 && (!Number.isFinite(line.endpointPaddingRatio) || line.endpointPaddingRatio < 0 || line.endpointPaddingRatio > 0.5)) issue(issues, "error", "line-label-endpoint-padding-invalid", rulePath, "\u7AEF\u70B9\u7559\u767D\u6BD4\u4F8B\u5FC5\u987B\u4ECB\u4E8E 0 \u5230 0.5\u3002");
  if (line && line.endpointPaddingMinPx !== void 0 && (!Number.isFinite(line.endpointPaddingMinPx) || line.endpointPaddingMinPx < 0)) issue(issues, "error", "line-label-endpoint-padding-px-invalid", rulePath, "\u7AEF\u70B9\u6700\u5C0F\u7559\u767D\u5FC5\u987B\u662F\u975E\u8D1F\u50CF\u7D20\u503C\u3002");
  if (line && line.minLengthPx !== void 0 && (!Number.isFinite(line.minLengthPx) || line.minLengthPx < 0)) issue(issues, "error", "line-label-min-length-invalid", rulePath, "\u6700\u5C0F\u7EBF\u957F\u5FC5\u987B\u662F\u975E\u8D1F\u50CF\u7D20\u503C\u3002");
  const visibility = extensions.visibility;
  if (visibility) {
    if (!["inherit", "always", "sameId", "coincidentPoint", "lineContainmentChoice", "activeContextMember"].includes(visibility.mode)) issue(issues, "error", "visibility-extension-mode-invalid", rulePath, "\u53EF\u89C1\u6027\u6269\u5C55\u6A21\u5F0F\u65E0\u6548\u3002");
    if (visibility.mode === "sameId") {
      const spec = visibility.sameId;
      if (!spec || !spec.target || !hasCategoryNode(config, spec.target)) issue(issues, "error", "visibility-same-id-target-invalid", rulePath, "\u540C ID \u53EF\u89C1\u6027\u89C4\u5219\u5FC5\u987B\u9009\u62E9\u6709\u6548\u76EE\u6807\u5206\u7C7B\u3002");
      const fields = new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key));
      if (spec?.sourceField && !sourceExists(spec.sourceField, fields)) issue(issues, "error", "visibility-same-id-source-invalid", rulePath, "\u540C ID \u6765\u6E90\u5B57\u6BB5\u65E0\u6548\u3002", { field: spec.sourceField });
      if (spec?.target && hasCategoryNode(config, spec.target) && spec.targetField && !sourceExists(spec.targetField, new Set(resolveSelectableFields(config, spec.target).map((field) => field.key)))) issue(issues, "error", "visibility-same-id-target-field-invalid", rulePath, "\u540C ID \u76EE\u6807\u5339\u914D\u5B57\u6BB5\u65E0\u6548\u3002", { field: spec.targetField });
    }
    if (visibility.mode === "coincidentPoint") {
      const spec = visibility.coincidentPoint;
      if (geometry !== "Point") issue(issues, "error", "visibility-coincident-geometry-invalid", rulePath, "\u91CD\u5408\u70B9\u53EF\u89C1\u6027\u89C4\u5219\u53EA\u80FD\u7528\u4E8E\u70B9\u8981\u7D20\u3002");
      if (!spec || !spec.target || !hasCategoryNode(config, spec.target)) issue(issues, "error", "visibility-coincident-target-invalid", rulePath, "\u91CD\u5408\u70B9\u53EF\u89C1\u6027\u89C4\u5219\u5FC5\u987B\u9009\u62E9\u6709\u6548\u76EE\u6807\u5206\u7C7B\u3002");
      if (spec?.target && hasCategoryNode(config, spec.target) && spec.targetField && !sourceExists(spec.targetField, new Set(resolveSelectableFields(config, spec.target).map((field) => field.key)))) issue(issues, "error", "visibility-coincident-target-field-invalid", rulePath, "\u91CD\u5408\u70B9\u76EE\u6807\u5B57\u6BB5\u65E0\u6548\u3002", { field: spec.targetField });
    }
    if (visibility.mode === "lineContainmentChoice") {
      const spec = visibility.lineContainmentChoice;
      const fields = new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key));
      if (geometry !== "LineString") issue(issues, "error", "visibility-line-choice-geometry-invalid", rulePath, "\u8D34\u7EBF\u4E92\u65A5\u53EF\u89C1\u6027\u89C4\u5219\u53EA\u80FD\u7528\u4E8E\u7EBF\u8981\u7D20\u3002");
      if (!spec?.field || !sourceExists(spec.field, fields) || !spec.primaryValue || !spec.overlayValues?.length || !Number.isFinite(spec.switchZoom)) issue(issues, "error", "visibility-line-choice-invalid", rulePath, "\u8D34\u7EBF\u4E92\u65A5\u53EF\u89C1\u6027\u89C4\u5219\u5FC5\u987B\u63D0\u4F9B\u5B57\u6BB5\u3001\u4E3B\u503C\u3001\u8986\u76D6\u503C\u4E0E\u5207\u6362 Zoom\u3002");
    }
    if (visibility.mode === "activeContextMember") {
      const spec = visibility.activeContextMember;
      if (spec?.bindingId && !(config.contractRevision >= 10 ? spec.bindingId === STRUCTURE_CONTEXT_ID : (config.contextBindings ?? []).some((binding) => binding.enabled && binding.id === spec.bindingId))) issue(issues, "error", "visibility-context-binding-invalid", rulePath, "\u697C\u5C42/\u5355\u5143\u53EF\u89C1\u6027\u89C4\u5219\u5F15\u7528\u4E86\u4E0D\u5B58\u5728\u7684\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u3002");
      if (config.contractRevision >= 10) {
        const role = resolveNodeFieldSettings(config, sourcePath).value.structure;
        if (!role?.enabled || role.role !== "member") issue(issues, "error", "visibility-structure-role-invalid", rulePath, "\u9644\u5C5E\u53EF\u89C1\u6027\u9700\u8981\u8BE5\u5206\u7C7B\u542F\u7528\u9644\u5C5E\u8EAB\u4EFD\u4E0E\u5F15\u7528\u5B57\u6BB5\u3002");
      }
    }
  }
}
function validateProfile(profile, geometry, path2, config, sourcePath, issues) {
  if (isNativeConfigRevision(config.contractRevision) && (profile.color !== void 0 || profile.style !== void 0 || profile.geometryStack !== void 0 || profile.label !== void 0 || profile.legacyDisplay !== void 0)) {
    issue(issues, "error", "legacy-profile-field-forbidden", path2, "V3.2 \u7684\u663E\u793A\u503C\u5FC5\u987B\u4F4D\u4E8E\u5404 Zoom \u6E32\u67D3\u89C4\u5219\u5185\uFF0C\u4E0D\u80FD\u4F7F\u7528\u65E7\u51E0\u4F55\u5C42\u7EA7\u6216 label \u914D\u7F6E\u5B57\u6BB5\u3002");
  }
  if (!profile.allowMultipleParts && profile.anchor === "perPart") issue(issues, "error", "anchor-requires-multipart", path2, "\u4EC5\u5141\u8BB8\u591A\u90E8\u4EF6\u65F6\u624D\u80FD\u9009\u62E9\u201C\u5404\u90E8\u4EF6\u201D\u951A\u70B9\u3002");
  const allowed = new Set(allowedTriggerKeys(geometry));
  const triggers = profile.interaction?.triggers ?? {};
  for (const [key2, enabled] of Object.entries(triggers)) if (enabled && !allowed.has(key2)) issue(issues, "error", "interaction-trigger-geometry-invalid", path2, `${key2} \u4E0D\u9002\u7528\u4E8E ${geometry}\u3002`);
  if (profile.enabled && !Object.values(triggers).some(Boolean)) issue(issues, "warning", "interaction-trigger-none", path2, "\u5DF2\u542F\u7528\u7684\u51E0\u4F55\u7C7B\u578B\u6CA1\u6709\u4EA4\u4E92\u89E6\u53D1\u5668\uFF0C\u5C06\u4E0D\u80FD\u901A\u8FC7\u5730\u56FE\u6253\u5F00\u4FE1\u606F\u5361\u3002");
  if (!profile.zoomPriority.rules.length && !(config.contractRevision >= 9 && profile.renderState === "unconfigured")) issue(issues, "error", "render-rule-missing", path2, "\u6BCF\u79CD\u5DF2\u542F\u7528\u51E0\u4F55\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u6E32\u67D3\u89C4\u5219\u3002");
  if (config.contractRevision >= 9 && profile.renderState === "unconfigured" && profile.zoomPriority.rules.length) issue(issues, "error", "unconfigured-render-has-rules", path2, "\u672A\u914D\u7F6E\u663E\u793A\u72B6\u6001\u4E0D\u80FD\u542B\u6709\u6D3B\u52A8\u89C4\u5219\u3002");
  const intervals = [];
  for (const [index, rule] of profile.zoomPriority.rules.entries()) {
    const rulePath = `${path2}/renderRules/${rule.id || index + 1}`;
    const min = rule.when?.zoom.min ?? rule.minZoom;
    const max = rule.when?.zoom.max ?? rule.maxZoom;
    if (config.contractRevision >= 7) {
      if (!rule.when || !Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max > 8 || min > max) issue(issues, "error", "render-match-zoom-required", rulePath, "r7 \u5FC5\u987B\u586B\u5199 0\u20138 \u7684\u95ED\u533A\u95F4\u6574\u6570 Zoom\uFF0C\u5141\u8BB8\u5355\u7EA7\u533A\u95F4\u3002");
      if (rule.minZoom !== void 0 || rule.maxZoom !== void 0 || rule.minExclusive !== void 0 || rule.maxExclusive !== void 0 || rule.conditionalOverrides !== void 0) issue(issues, "error", "render-legacy-match-forbidden", rulePath, "r7 \u53EA\u4F7F\u7528 when.zoom \u548C\u975E\u5206\u7C7B\u5B57\u6BB5\u7EC4\u5408\uFF0C\u4E0D\u80FD\u4FDD\u7559\u65E7\u5339\u914D\u6216\u5206\u652F\u3002");
      for (const message of validateRenderFields(rule.when?.fields, resolveSelectableFields(config, sourcePath), resolveSelectableFields(config, sourcePath).map((field) => field.key), config.contractRevision)) issue(issues, "error", "render-field-condition-invalid", `${rulePath}/when/fields`, message);
    } else if (rule.when) issue(issues, "error", "render-match-revision-invalid", rulePath, "\u7EC4\u5408\u89C4\u5219\u9700\u8981\u539F\u751F r7\uFF1B\u65E7\u5305\u8BF7\u5148\u65E0\u635F\u8FC1\u79FB\u3002");
    if (!rule.representation) issue(issues, "error", "render-representation-required", rulePath, "\u6E32\u67D3\u89C4\u5219\u5FC5\u987B\u9009\u62E9\u663E\u793A\u79CD\u7C7B\u3002");
    else if (!["hidden", "geometry", "point", "labelOnly"].includes(rule.representation)) issue(issues, "error", "render-representation-invalid", rulePath, "\u672A\u77E5\u663E\u793A\u79CD\u7C7B\u3002");
    if (rule.representation === "labelOnly" && config.contractRevision < 6) issue(issues, "error", "render-contract-capability-invalid", rulePath, "\u4EC5\u6807\u7B7E\u663E\u793A\u9700\u8981\u539F\u751F\u5951\u7EA6 revision 6 \u6216\u66F4\u65B0\u7248\u672C\u3002");
    if (min !== void 0 && max !== void 0 && min > max) issue(issues, "error", "zoom-interval-invalid", rulePath, "\u663E\u793A\u533A\u95F4\u5FC5\u987B\u7B26\u5408\u4E0B\u754C \u2264 Zoom \u2264 \u4E0A\u754C\u3002");
    intervals.push({ id: rule.id, min: min ?? -Infinity, max: max ?? Infinity });
    const stack = rule.geometryStack;
    if (!stack || !Number.isInteger(stack.zLevel) || stack.zLevel < 0 || stack.zLevel > 9999) issue(issues, "error", "geometry-zlevel-invalid", rulePath, "\u6BCF\u4E2A\u6E32\u67D3\u89C4\u5219\u7684\u51E0\u4F55 zLevel \u5FC5\u987B\u662F 0 \u5230 9999 \u4E4B\u95F4\u7684\u6574\u6570\u3002");
    const style = rule.style;
    if (style?.symbolOffsetPx && (!Number.isFinite(style.symbolOffsetPx.x) || !Number.isFinite(style.symbolOffsetPx.y))) issue(issues, "error", "render-symbol-offset-invalid", rulePath, "\u7B26\u53F7\u504F\u79FB\u5FC5\u987B\u4E3A\u6709\u9650\u50CF\u7D20\u503C\u3002");
    if (style?.symbolAnchor && !["geometry", "label"].includes(style.symbolAnchor) || style?.symbolVisibility && !["independent", "withLabel"].includes(style.symbolVisibility)) issue(issues, "error", "render-symbol-policy-invalid", rulePath, "\u7B26\u53F7\u951A\u70B9\u6216\u53EF\u89C1\u6027\u7B56\u7565\u65E0\u6548\u3002");
    if (rule.representation !== "hidden" && !style) issue(issues, "error", "render-style-required", rulePath, "\u975E\u9690\u85CF\u6E32\u67D3\u89C4\u5219\u5FC5\u987B\u5B9A\u4E49\u663E\u793A\u6548\u679C\u3002");
    if (config.contractRevision >= 12 && rule.representation !== "hidden" && (geometry === "Point" || rule.representation === "point") && !style?.pointSymbol) issue(issues, "error", "point-symbol-required", rulePath, "r12 \u70B9\u72B6\u663E\u793A\u5FC5\u987B\u4F7F\u7528\u5355\u4E00 pointSymbol\uFF1B\u65E7 hide \u56FE\u7247\u9700\u8981\u660E\u786E\u786E\u8BA4\u56DE\u9000\u3002");
    if (style && !style.pointSymbol) {
      if (style.size !== void 0 && (!Number.isFinite(style.size) || style.size <= 0)) issue(issues, "error", "render-size-invalid", rulePath, "\u70B9\u7B26\u53F7\u5927\u5C0F\u5FC5\u987B\u4E3A\u6B63\u6570\u3002");
      if (style.weight !== void 0 && (!Number.isFinite(style.weight) || style.weight < 0)) issue(issues, "error", "render-stroke-width-invalid", rulePath, "\u63CF\u8FB9\u7C97\u7EC6\u5FC5\u987B\u4E3A\u975E\u8D1F\u6570\u3002");
      if (!Number.isFinite(style.strokeOpacity) || (style.strokeOpacity ?? -1) < 0 || (style.strokeOpacity ?? -1) > 1) issue(issues, "error", "render-stroke-opacity-invalid", rulePath, "\u63CF\u8FB9\u900F\u660E\u5EA6\u5FC5\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002");
      if (style.fillOpacity !== void 0 && (!Number.isFinite(style.fillOpacity) || style.fillOpacity < 0 || style.fillOpacity > 1)) issue(issues, "error", "render-fill-opacity-invalid", rulePath, "\u586B\u8272\u900F\u660E\u5EA6\u5FC5\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002");
      validateRenderColorBinding(style.stroke, config, sourcePath, `${rulePath}/style/stroke`, issues);
      if (style.fill) validateRenderColorBinding(style.fill, config, sourcePath, `${rulePath}/style/fill`, issues);
      if ((geometry === "Point" || rule.representation === "point") && !style.fill) issue(issues, "error", "render-fill-required", rulePath, "\u70B9\u6837\u5F0F\u4E0E\u9762\u5185\u4E2D\u70B9\u6837\u5F0F\u5FC5\u987B\u5B9A\u4E49\u586B\u8272\u3002");
      if (style.icon) {
        const iconFields = new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key));
        if (!sourceExists(style.icon.source, iconFields)) issue(issues, "error", "render-icon-source-invalid", rulePath, "\u56FE\u6807 URL \u5FC5\u987B\u6765\u81EA\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3001tags.xxx \u6216 extensions.xxx\u3002", { field: style.icon.source });
        if (geometry !== "Point" && rule.representation !== "point") issue(issues, "error", "render-icon-geometry-invalid", rulePath, "\u56FE\u6807\u8986\u76D6\u53EA\u9002\u7528\u4E8E\u70B9\u6216\u9762\u5185\u4E2D\u70B9\u6E32\u67D3\u3002");
        if (!Array.isArray(style.icon.size) || style.icon.size.length !== 2 || style.icon.size.some((value) => !Number.isFinite(value) || value <= 0)) issue(issues, "error", "render-icon-size-invalid", rulePath, "\u56FE\u6807\u5C3A\u5BF8\u5FC5\u987B\u662F\u4E24\u4E2A\u6B63\u6570\u3002");
        if (!Array.isArray(style.icon.anchor) || style.icon.anchor.length !== 2 || style.icon.anchor.some((value) => !Number.isFinite(value))) issue(issues, "error", "render-icon-anchor-invalid", rulePath, "\u56FE\u6807\u951A\u70B9\u5FC5\u987B\u662F\u4E24\u4E2A\u6709\u9650\u6570\u5B57\u3002");
      }
    }
    if (style?.pointSymbol) {
      if (config.contractRevision < 12) issue(issues, "error", "point-symbol-revision", rulePath, "\u65B0\u70B9\u7B26\u53F7\u6765\u6E90\u9700\u8981 r12 \u5951\u7EA6\u3002");
      if (geometry !== "Point" && rule.representation !== "point") issue(issues, "error", "point-symbol-geometry", rulePath, "\u70B9\u7B26\u53F7\u4EC5\u7528\u4E8E\u70B9\u6216\u660E\u786E\u7684\u70B9\u72B6\u8868\u793A\u3002");
      for (const key2 of ["icon", "pointShape", "size", "weight", "stroke", "fill", "strokeOpacity", "fillOpacity", "lineCap", "lineJoin"])
        if (style[key2] !== void 0) issue(issues, "error", "point-symbol-conflicting-style", `${rulePath}/style/${key2}`, "\u70B9\u7B26\u53F7\u4E0D\u80FD\u540C\u65F6\u4FDD\u7559\u65E7\u5916\u89C2\u6765\u6E90\u3002");
      for (const row2 of pointSymbolProblems(style.pointSymbol, resolveSelectableFields(config, sourcePath), config))
        issue(issues, "error", "point-symbol-invalid", `${rulePath}/style/pointSymbol/${row2.path}`, row2.message);
      for (const row2 of pointSymbolBindings(style.pointSymbol)) validateRenderColorBinding(row2.value, config, sourcePath, `${rulePath}/style/pointSymbol/${row2.path}`, issues);
    }
    validateRuleLabel(rule, rulePath, config, sourcePath, issues);
    if (config.contractRevision >= 12) for (const row2 of unreachableLocalMappingRows(rule, resolveSelectableFields(config, sourcePath))) {
      issue(issues, "error", "render-mapping-unreachable", `${rulePath}/${row2.path}`, "\u672C\u5730\u6620\u5C04\u884C\u4E0E\u5B8C\u6574\u5B57\u6BB5\u6761\u4EF6\uFF0F\u5916\u5C42\u6620\u5C04\u503C\u5B58\u5728\u53EF\u8BC1\u660E\u7684\u51B2\u7A81\u3002");
    }
    const metric = rule.priority?.metric;
    if (metric && !allowedMetrics(geometry).has(metric.kind)) issue(issues, "error", "dynamic-priority-metric-geometry-invalid", rulePath, `${metric.kind} \u4E0D\u9002\u7528\u4E8E ${geometry}\u3002`);
    if (metric && (!Number.isFinite(metric.multiplier) || metric.divisor !== void 0 && (!Number.isFinite(metric.divisor) || metric.divisor === 0) || metric.min !== void 0 && metric.max !== void 0 && metric.min > metric.max)) issue(issues, "error", "dynamic-priority-invalid", rulePath, "\u52A8\u6001\u4F18\u5148\u7EA7\u7684\u500D\u7387\u3001\u9664\u6570\u6216\u4E0A\u4E0B\u754C\u65E0\u6548\u3002");
    if (metric?.kind === "field" && !numericMetricField(config, sourcePath, metric.field)) issue(issues, "error", "dynamic-priority-field-required", rulePath, "\u5B57\u6BB5\u578B\u52A8\u6001\u4F18\u5148\u7EA7\u9700\u8981\u5B58\u5728\u7684\u5355\u503C\u6570\u503C\u5B57\u6BB5\u6216\u6570\u503C\u679A\u4E3E\u5B57\u6BB5\u3002");
    validateRuleExtensions({ ...rule, extensions: resolveRenderExtensions(config, geometry, rule.extensions) }, geometry, rulePath, config, sourcePath, issues);
    const overrideIds = /* @__PURE__ */ new Set();
    for (const [overrideIndex, override] of (rule.conditionalOverrides ?? []).entries()) {
      const overridePath = `${rulePath}/conditionalOverrides/${override.id || overrideIndex + 1}`;
      if (!override.id || overrideIds.has(override.id)) issue(issues, "error", "render-conditional-override-id-invalid", overridePath, "\u5B57\u6BB5\u6761\u4EF6\u8986\u76D6\u5FC5\u987B\u5177\u6709\u552F\u4E00 ID\u3002");
      overrideIds.add(override.id);
      if (!override.when.length) issue(issues, "error", "render-conditional-override-condition-required", overridePath, "\u5B57\u6BB5\u6761\u4EF6\u8986\u76D6\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u6761\u4EF6\u3002");
      for (const [conditionIndex, condition] of override.when.entries()) {
        validateCondition(condition, `${overridePath}/when/${conditionIndex}`, issues);
        if ((condition.kind === "fieldEquals" || condition.kind === "fieldIn" || condition.kind === "fieldPresent") && !sourceExists(condition.field, new Set(resolveEffectiveFields(config, sourcePath).map((field) => field.key)))) issue(issues, "error", "render-conditional-override-field-invalid", `${overridePath}/when/${conditionIndex}`, "\u5B57\u6BB5\u6761\u4EF6\u5FC5\u987B\u4F7F\u7528\u5F53\u524D\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3002", { field: condition.field });
      }
      if (override.style?.pointSymbol) {
        if (config.contractRevision < 12) issue(issues, "error", "point-symbol-revision", overridePath, "\u70B9\u7B26\u53F7\u9700\u8981\u5951\u7EA6 r12\u3002");
        for (const row2 of pointSymbolProblems(override.style.pointSymbol, resolveSelectableFields(config, sourcePath), config)) issue(issues, "error", "point-symbol-invalid", overridePath + "/style/pointSymbol/" + row2.path, row2.message);
        for (const row2 of pointSymbolBindings(override.style.pointSymbol)) validateRenderColorBinding(row2.value, config, sourcePath, overridePath + "/style/pointSymbol/" + row2.path, issues);
        for (const key2 of ["icon", "pointShape", "size", "weight", "stroke", "fill", "strokeOpacity", "fillOpacity", "lineCap", "lineJoin"]) if (override.style[key2] !== void 0) issue(issues, "error", "point-symbol-conflicting-style", overridePath + "/style/" + key2, "\u6761\u4EF6\u8986\u76D6\u4E0D\u53EF\u540C\u65F6\u4FDD\u5B58\u65E7\u70B9\u5916\u89C2\u3002");
      }
      if (override.style && !override.style.pointSymbol) {
        if (!Number.isFinite(override.style.strokeOpacity) || (override.style.strokeOpacity ?? -1) < 0 || (override.style.strokeOpacity ?? -1) > 1) issue(issues, "error", "render-conditional-style-opacity-invalid", overridePath, "\u6761\u4EF6\u8986\u76D6\u7684\u63CF\u8FB9\u900F\u660E\u5EA6\u5FC5\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002");
        validateRenderColorBinding(override.style.stroke, config, sourcePath, `${overridePath}/style/stroke`, issues);
        if (override.style.fill) validateRenderColorBinding(override.style.fill, config, sourcePath, `${overridePath}/style/fill`, issues);
      }
      if (override.label) validateRuleLabel({ ...rule, label: override.label }, overridePath, config, sourcePath, issues);
      if (override.extensions) validateRuleExtensions({ ...rule, extensions: override.extensions }, geometry, overridePath, config, sourcePath, issues);
    }
    if (isNativeConfigRevision(config.contractRevision) && rule.advanced && Object.keys(rule.advanced).some((key2) => {
      const value = rule.advanced?.[key2];
      return value !== void 0 && (typeof value !== "object" || value === null || Object.keys(value).length > 0);
    })) issue(issues, "error", "legacy-advanced-forbidden", rulePath, "V3.2 \u539F\u751F\u89C4\u5219\u53EA\u80FD\u4F7F\u7528\u7C7B\u578B\u5316\u201C\u6269\u5C55\u89C4\u5219\u201D\uFF0C\u4E0D\u5F97\u4FDD\u7559 V1 advanced/JSON \u56DE\u9000\u3002");
    if (!rule.id || profile.zoomPriority.rules.slice(0, index).some((prior) => prior.id === rule.id)) issue(issues, "error", "render-rule-id-required", rulePath, "\u6E32\u67D3\u89C4\u5219\u5FC5\u987B\u5177\u6709\u552F\u4E00 ID\u3002");
  }
  for (let left = 0; left < intervals.length; left += 1) for (let right = left + 1; right < intervals.length; right += 1) {
    const a = intervals[left];
    const b = intervals[right];
    if (config.contractRevision >= 7) {
      if (a.min === b.min && a.max === b.max && canonicalRenderFields(profile.zoomPriority.rules[left].when?.fields) === canonicalRenderFields(profile.zoomPriority.rules[right].when?.fields)) issue(issues, "error", "render-match-duplicate", path2, `\u6E32\u67D3\u89C4\u5219 ${a.id} \u4E0E ${b.id} \u7684\u5B8C\u6574\u6761\u4EF6\u91CD\u590D\u3002`);
      else if (a.min >= b.min && a.max <= b.max && !profile.zoomPriority.rules[right].when?.fields) issue(issues, "warning", "render-match-shadowed", path2, `\u89C4\u5219 ${a.id} \u88AB\u540E\u9879 ${b.id} \u5B8C\u5168\u8986\u76D6\u3002`);
    } else if (a.min <= b.max && b.min <= a.max) issue(issues, "error", "render-zoom-interval-overlap", path2, `\u6E32\u67D3\u89C4\u5219 ${a.id} \u4E0E ${b.id} \u7684\u95ED\u533A\u95F4\u91CD\u53E0\u3002`);
  }
}
function registryHas(items, id, classCode) {
  const item = items.find((entry) => entry.id === id);
  return Boolean(item && (!item.allowedClasses?.length || item.allowedClasses.includes(classCode)));
}
function sourceExists(source, fields) {
  const root = source.split(".")[0];
  return source.startsWith("tags.") || source.startsWith("extensions.") || SYSTEM_FIELD_KEYS.has(source) || fields.has(source) || fields.has(root);
}
function validateCard(node, config, issues) {
  const path2 = `nodes/${node.nodeId}/card`;
  const checkItemIds = (card2, scope) => {
    if (card2?.mode !== "fields") return;
    const ids = /* @__PURE__ */ new Map();
    for (const item of card2.items) {
      if (!item.id?.trim() || ids.has(item.id)) issue(issues, "error", "card-item-id-duplicate", `${path2}/${scope}/${item.id}`, `\u4FE1\u606F\u5361\u6761\u76EE ID ${item.id || "\uFF08\u7A7A\uFF09"} \u91CD\u590D\u6216\u4E3A\u7A7A\uFF1A${ids.get(item.id) ?? ""} / ${item.source}\u3002\u8BF7\u4E3A\u6761\u76EE\u4F7F\u7528\u72EC\u7ACB ID\u3002`);
      ids.set(item.id, item.source);
    }
  };
  checkItemIds(node.card, "local");
  if (config.contractRevision >= 10 && node.card?.mode === "fields") {
    const origins = /* @__PURE__ */ new Set(), ancestors = resolveCategoryNodes(config, node.path).filter((parent) => parent.nodeId !== node.nodeId);
    for (const item of node.card.items) if (item.inheritFrom) {
      const key2 = `${item.inheritFrom.nodeId}/${item.inheritFrom.itemId}`;
      if (origins.has(key2) || !ancestors.some((parent) => parent.nodeId === item.inheritFrom.nodeId)) issue(issues, "error", "card-inheritance-origin-invalid", `${path2}/${item.id}`, "\u786C\u7EE7\u627F\u6761\u76EE\u6765\u6E90\u5FC5\u987B\u662F\u540C\u5206\u652F\u7956\u5148\u4E14\u4E0D\u80FD\u91CD\u590D\u3002");
      origins.add(key2);
    }
  }
  if (config.contractRevision >= 9 && node.card?.mode === "fields" && node.card.items.some((item) => item.labelMode || item.valueMode)) issue(issues, "error", "live-card-source-forbidden", path2, "r9 \u4FE1\u606F\u5361\u4E0D\u4FDD\u7559\u8DDF\u968F/\u8986\u5199\u72B6\u6001\uFF0C\u8BF7\u5148\u8FC1\u79FB\u3002");
  const card = resolveCardConfiguration(config, node.path);
  checkItemIds(card, "effective");
  if (!card) {
    issue(issues, isNativeConfigRevision(config.contractRevision) ? "warning" : "error", isNativeConfigRevision(config.contractRevision) ? "card-migration-pending" : "card-inheritance-missing", path2, isNativeConfigRevision(config.contractRevision) ? "\u4FE1\u606F\u5361\u8FC1\u79FB\u5C1A\u672A\u6267\u884C\uFF1B\u672C\u8F6E\u539F\u751F\u6E32\u67D3\u5305\u4E0D\u9644\u5E26\u5361\u7247\u5B9A\u4E49\u3002" : "\u8BE5\u5206\u7C7B\u6CA1\u6709\u672C\u5730\u4FE1\u606F\u5361\uFF0C\u4E14\u6CA1\u6709\u53EF\u7EE7\u627F\u7684\u4FE1\u606F\u5361\u3002");
    return;
  }
  const fields = new Set(resolveEffectiveFields(config, node.path).map((field) => field.key));
  if (card.mode === "layout") {
    if (!registryHas(config.registries.cardLayouts, card.layoutId, node.path.class)) issue(issues, "error", "card-layout-invalid", path2, `\u4FE1\u606F\u5361\u5E03\u5C40 ${card.layoutId || "\uFF08\u7A7A\uFF09"} \u4E0D\u5728\u53D7\u63A7\u6CE8\u518C\u8868\u4E2D\u6216\u4E0D\u9002\u7528\u4E8E\u8BE5 Class\u3002`);
    return;
  }
  if (card.mode === "component") {
    if (!registryHas(config.registries.cardComponents, card.componentKey, node.path.class)) issue(issues, "error", "card-component-invalid", path2, `\u4E13\u7528\u4FE1\u606F\u5361\u7EC4\u4EF6 ${card.componentKey || "\u7A7A"} \u4E0D\u5728\u53D7\u63A7\u6CE8\u518C\u8868\u4E2D\u6216\u4E0D\u9002\u7528\u4E8E\u8BE5 Class\u3002`);
    return;
  }
  if (card.remaining) {
    if (!["main", "other"].includes(card.remaining.section)) issue(issues, "error", "card-remaining-section-invalid", path2, "\u5269\u4F59\u5B57\u6BB5\u533A\u57DF\u65E0\u6548\u3002");
    if (card.remaining.order && !["record", "alphabetical"].includes(card.remaining.order)) issue(issues, "error", "card-remaining-order-invalid", path2, "\u5269\u4F59\u5B57\u6BB5\u6392\u5E8F\u65B9\u5F0F\u65E0\u6548\u3002");
    for (const key2 of ["maxDepth", "maxArrayLength"]) if (card.remaining[key2] !== void 0 && (!Number.isInteger(card.remaining[key2]) || card.remaining[key2] <= 0)) issue(issues, "error", "card-remaining-limit-invalid", path2, "\u5269\u4F59\u5B57\u6BB5\u4E0A\u9650\u5FC5\u987B\u4E3A\u6B63\u6574\u6570\u3002");
  }
  for (const item of card.items) {
    const itemPath = `${path2}/items/${item.id}`;
    if (!CARD_RENDERERS.has(item.renderer)) issue(issues, "error", "card-renderer-invalid", itemPath, `\u672A\u77E5\u7684\u4FE1\u606F\u5361\u663E\u793A\u5668 ${String(item.renderer)}\u3002`);
    if (item.section !== void 0 && item.section !== "main" && item.section !== "other") issue(issues, "error", "card-section-invalid", itemPath, "\u4FE1\u606F\u5361\u533A\u57DF\u53EA\u80FD\u4E3A\u4E3B\u8981\u4FE1\u606F\u6216\u5176\u4ED6\u4FE1\u606F\u3002");
    if (!sourceExists(item.source, fields)) issue(issues, "error", "card-field-missing", itemPath, `\u4FE1\u606F\u5361\u5B57\u6BB5 ${item.source} \u672A\u5B9A\u4E49\u3002`, { field: item.source });
    const mapped = item.valueOptions ?? [];
    if (mapped.some((option) => !option.value.trim()) || new Set(mapped.map((option) => option.value)).size !== mapped.length) issue(issues, "error", "card-value-map-invalid", itemPath, "\u4FE1\u606F\u5361\u8986\u5199\u5BF9\u7167\u5FC5\u987B\u6709\u552F\u4E00\u975E\u7A7A\u7684\u5B58\u50A8\u503C\u3002");
    const definition = resolveEffectiveFields(config, node.path).find((field) => field.key === item.source);
    if (config.contractRevision >= 8 && item.valueMode === "override" && definition?.type === "enum" && mapped.some((option) => !definition.options?.some((value) => value.value === option.value))) issue(issues, "error", "card-field-map-conflict", itemPath, `\u4FE1\u606F\u5361 ${item.source} \u8986\u5199\u5BF9\u7167\u4F7F\u7528\u4E86\u6765\u6E90\u5B57\u6BB5\u5DF2\u5220\u9664\u7684\u9009\u9879\uFF0C\u8BF7\u8C03\u6574\u8986\u5199\u6216\u6062\u590D\u8DDF\u968F\u3002`);
    if (item.options?.format && !["plain", "externalLink", "boolean", "json", "classification", "enum", "date", "world"].includes(item.options.format)) issue(issues, "error", "card-format-invalid", itemPath, "\u672A\u77E5\u7684\u4FE1\u606F\u5361\u683C\u5F0F\u3002");
    if (config.contractRevision === 5 && item.options?.format && ["classification", "enum", "date", "world"].includes(item.options.format)) issue(issues, "error", "card-format-revision-invalid", itemPath, "\u8BE5\u4FE1\u606F\u5361\u683C\u5F0F\u8981\u6C42\u539F\u751F r6\u3002");
    if (item.renderer === "lineChips" && !item.options?.lineChipSource) issue(issues, "error", "card-line-chips-source-required", itemPath, "\u5173\u8054\u7EBF\u8DEF\u80F6\u56CA\u5FC5\u987B\u9009\u62E9\u5E73\u53F0\u3001\u8F66\u7AD9\u6216\u8F66\u7AD9\u5EFA\u7B51\u6765\u6E90\u3002");
    if (item.renderer !== "relationLink") continue;
    const relation = item.relation;
    if (config.contractRevision >= 10 && relation?.targetRole === "main") {
      if (relation.targetClassification || relation.targetMatchField !== "ID" || !isSafeWorkflowTarget(relation.targetDisplayField ?? "Name")) issue(issues, "error", "relation-role-target-invalid", itemPath, "\u901A\u7528\u4E3B\u7ED3\u6784\u5173\u7CFB\u6309 ID \u5339\u914D\uFF0C\u4E0D\u9650\u5236 Class\uFF1B\u76EE\u6807\u663E\u793A\u5B57\u6BB5\u5FC5\u987B\u4E3A\u5B89\u5168\u8DEF\u5F84\u3002");
      continue;
    }
    if (!relation?.targetClassification || !isContinuousPath(relation.targetClassification) || !hasCategoryNode(config, relation.targetClassification)) {
      issue(issues, "error", "relation-target-classification-invalid", itemPath, "\u5173\u7CFB\u5361\u5FC5\u987B\u9009\u62E9\u5B58\u5728\u4E14\u8FDE\u7EED\u7684\u76EE\u6807\u5206\u7C7B\u3002");
      continue;
    }
    const targetFields = new Set(resolveSelectableFields(config, relation.targetClassification).map((field) => field.key));
    const supports = (field) => Boolean(field && (targetFields.has(field) || SYSTEM_FIELD_KEYS.has(field)));
    if (!supports(relation.targetMatchField)) issue(issues, "error", "relation-target-match-field-invalid", itemPath, "\u5173\u7CFB\u5361\u7684\u76EE\u6807\u5339\u914D\u5B57\u6BB5\u4E0D\u5728\u76EE\u6807\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u96C6\u4E2D\u3002");
    if (!supports(relation.targetDisplayField)) issue(issues, "error", "relation-target-display-field-invalid", itemPath, "\u5173\u7CFB\u5361\u7684\u76EE\u6807\u5C55\u793A\u5B57\u6BB5\u4E0D\u5728\u76EE\u6807\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u96C6\u4E2D\u3002");
  }
}
function controlsFor(workflow) {
  return workflow.steps.flatMap((step) => step.controls ?? []);
}
function validateSearch(control, config, path2, issues) {
  const search = normalizeSearchProfile(control.search);
  if (!search || !search.targetRole && (!isContinuousPath(search.target) || !hasCategoryNode(config, search.target))) {
    issue(issues, "error", "workflow-search-target-invalid", path2, "\u641C\u7D22\u63A7\u4EF6\u5FC5\u987B\u9009\u62E9\u5B58\u5728\u4E14\u8FDE\u7EED\u7684\u76EE\u6807\u5206\u7C7B\u8303\u56F4\u3002");
    return;
  }
  const targets = search.targetRole === "main" ? config.nodes.filter((node) => {
    const role = resolveNodeFieldSettings(config, node.path).value.structure;
    return role?.enabled && role.role === "main";
  }) : [];
  if (search.targetRole && (config.contractRevision < 10 || !targets.length)) issue(issues, "error", "workflow-search-role-invalid", path2, "\u901A\u7528\u641C\u7D22\u9700\u8981 r10 \u4E14\u81F3\u5C11\u6709\u4E00\u4E2A\u542F\u7528\u7684\u4E3B\u7ED3\u6784\u5206\u7C7B\u3002");
  const selectable = new Set(search.targetRole ? targets.flatMap((node) => resolveSelectableFields(config, node.path).map((field) => field.key)).filter((key2) => targets.every((node) => resolveSelectableFields(config, node.path).some((field) => field.key === key2))) : resolveSelectableFields(config, search.target).map((field) => field.key));
  if (!search.queryFields?.length) issue(issues, "error", "workflow-search-fields-required", path2, "\u641C\u7D22\u63A7\u4EF6\u81F3\u5C11\u9700\u8981\u9009\u62E9\u4E00\u4E2A\u53EF\u5339\u914D\u5B57\u6BB5\u3002");
  for (const field of search.queryFields ?? []) if (!selectable.has(field)) issue(issues, "error", "workflow-search-field-invalid", path2, `\u641C\u7D22\u5B57\u6BB5 ${field} \u4E0D\u5728\u76EE\u6807\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u96C6\u4E2D\u3002`, { field });
  if (!search.returnField || !selectable.has(search.returnField)) issue(issues, "error", "workflow-search-return-field-invalid", path2, "\u641C\u7D22\u63A7\u4EF6\u5FC5\u987B\u9009\u62E9\u4E00\u4E2A\u6709\u6548\u7684\u5355\u4E00\u8FD4\u56DE\u5B57\u6BB5\u3002", { field: search.returnField });
  const templateFields = [...String(search.displayTemplate ?? "").matchAll(/{{\s*([A-Za-z][A-Za-z0-9_.]*)\s*}}/g)].map((match) => match[1]);
  if (!templateFields.length) issue(issues, "error", "workflow-search-display-template-invalid", path2, "\u5C55\u793A\u683C\u5F0F\u5FC5\u987B\u81F3\u5C11\u5F15\u7528\u4E00\u4E2A\u5B57\u6BB5\uFF0C\u4F8B\u5982 {{ID}} ({{Name}})\u3002");
  for (const field of templateFields) if (!selectable.has(field)) issue(issues, "error", "workflow-search-display-field-invalid", path2, `\u5C55\u793A\u683C\u5F0F\u5B57\u6BB5 ${field} \u4E0D\u5728\u76EE\u6807\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u96C6\u4E2D\u3002`, { field });
  if (!["contains", "prefix", "token", "fuzzy"].includes(search.matcher ?? "")) issue(issues, "error", "workflow-search-matcher-invalid", path2, "\u641C\u7D22\u5339\u914D\u65B9\u5F0F\u65E0\u6548\u3002");
  if (!["world", "loadedWorlds"].includes(search.cacheScope) || search.debounceMs !== void 0 && (!Number.isInteger(search.debounceMs) || search.debounceMs < 0)) issue(issues, "error", "workflow-search-cache-invalid", path2, "\u641C\u7D22\u8303\u56F4\u6216\u5EF6\u8FDF\u65E0\u6548\u3002");
  if (!Number.isInteger(search.minQueryLength) || Number(search.minQueryLength) < 0 || !Number.isInteger(search.maxResults) || Number(search.maxResults) < 1) issue(issues, "error", "workflow-search-options-invalid", path2, "\u641C\u7D22\u5FC5\u987B\u914D\u7F6E\u6709\u6548\u7684\u6700\u77ED\u8F93\u5165\u957F\u5EA6\u548C\u7ED3\u679C\u4E0A\u9650\u3002");
}
function targetSupportsClassificationPicker(config, target) {
  return hasDescendants(config, target);
}
function validateWorkflowOutput(output, _outputIndex, workflow, config, slots, issues) {
  const base = `workflows/${workflow.id}/outputs/${output.id}`;
  if (!isContinuousPath(output.classification) || !hasCategoryNode(config, output.classification)) issue(issues, "error", "workflow-output-classification-invalid", base, "\u5DE5\u4F5C\u6D41\u8F93\u51FA\u5FC5\u987B\u9009\u62E9\u5B58\u5728\u4E14\u8FDE\u7EED\u7684\u76EE\u6807\u5206\u7C7B\u3002");
  if (!output.geometry.selected) issue(issues, "error", "workflow-output-geometry-required", base, "\u6BCF\u4E2A\u5DE5\u4F5C\u6D41\u8F93\u51FA\u5FC5\u987B\u9009\u62E9\u56FA\u5B9A\u7ED8\u5236\u7C7B\u578B\u3002");
  else if (!listCategoryPaths(config, output.classification).some((path2) => !hasDescendants(config, path2) && resolveGeometryProfile(config, path2, output.geometry.selected)?.enabled)) issue(issues, "error", "workflow-output-geometry-disabled", base, `\u8F93\u51FA\u8303\u56F4\u6CA1\u6709\u6700\u7EC8\u5206\u7C7B\u542F\u7528 ${output.geometry.selected} \u7ED8\u5236\u7C7B\u578B\u3002`);
  const fields = new Set(resolveEffectiveFields(config, output.classification).map((field) => field.key));
  const tokens = /* @__PURE__ */ new Set([...WORKFLOW_SYSTEM_TOKENS, ...workflow.outputs.flatMap((_, index) => WORKFLOW_SYSTEM_TOKENS.map((item) => `${item}_${index + 1}`)), ...slots, ...workflowDerivedPointTokens(workflow)]);
  const assignmentIds = /* @__PURE__ */ new Set();
  for (const assignment of output.assignments) {
    const assignmentPath = `${base}/assignments/${assignment.id}`;
    validateWorkflowValueCondition(assignment.when, tokens, assignmentPath, issues);
    if (PROTECTED_WORKFLOW_TARGETS.has(assignment.target.split(".")[0])) {
      const token = assignment.target === "SKind" ? "Skind" : assignment.target === "SKind2" ? "Skind2" : assignment.target;
      if (assignment.expression.trim() !== token || !WORKFLOW_SYSTEM_TOKENS.includes(token)) issue(issues, "error", "workflow-system-target-protected", assignmentPath, `\u7CFB\u7EDF\u5B57\u6BB5 ${assignment.target} \u4E0D\u80FD\u7531\u5B57\u6BB5\u7EC4\u88C5\u8986\u76D6\u3002`);
    }
    if (!assignment.target.trim() || !assignment.expression.trim()) issue(issues, "error", "workflow-assignment-invalid", assignmentPath, "\u5B57\u6BB5\u7EC4\u88C5\u5FC5\u987B\u540C\u65F6\u6307\u5B9A\u76EE\u6807\u548C\u8868\u8FBE\u5F0F\u3002");
    if (!isSafeWorkflowTarget(assignment.target) || !fields.has(assignment.target) && !/^tags\.[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(assignment.target) && !/^extensions\.[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/.test(assignment.target) && !SYSTEM_FIELD_KEYS.has(assignment.target)) issue(issues, "error", "workflow-assignment-target-invalid", assignmentPath, `\u5B57\u6BB5\u7EC4\u88C5\u76EE\u6807 ${assignment.target} \u4E0D\u662F\u6709\u6548\u5B57\u6BB5\u3001tags \u6216 extensions \u8DEF\u5F84\u3002`);
    if (!assignment.id || assignmentIds.has(assignment.id)) issue(issues, "error", "workflow-assignment-id-invalid", assignmentPath, "\u7EC4\u88C5\u884C\u6807\u8BC6\u5FC5\u987B\u5B58\u5728\u4E14\u4E0D\u80FD\u91CD\u590D\u3002");
    const field = resolveEffectiveFields(config, output.classification).find((field2) => field2.key === assignment.target);
    const control = controlsFor(workflow).find((control2) => control2.slot === assignment.expression.trim());
    if (control && field && (control.fieldSource || config.contractRevision >= 8)) {
      const leaf = control.kind === "group" ? control.group?.itemFields[0] : control;
      const returned = leaf && (leaf.kind === "featureSearch" || leaf.kind === "coarseSearch") && leaf.search ? resolveSelectableFields(config, leaf.search.target).find((field2) => field2.key === leaf.search.returnField) : void 0;
      const actualType = control.kind === "group" && control.group?.storage === "object" ? "json" : leaf?.kind === "select" ? leaf.optionValueType ?? "string" : leaf?.kind === "json" ? "json" : leaf?.valueNormalization === "trim" || leaf?.valueNormalization === "abbr" ? "string" : leaf?.kind === "number" || leaf?.valueNormalization === "number" ? "number" : leaf?.kind === "toggle" ? "boolean" : returned ? returned.type === "enum" ? returned.optionValueType ?? "string" : returned.type === "reference" ? "string" : returned.type : "string";
      const actualMultiple = control.kind === "group" || returned?.cardinality === "multiple";
      const expectedType = field.type === "enum" ? field.optionValueType ?? "string" : field.type === "reference" ? "string" : field.type;
      const dynamicJson = !(control.kind === "group" && control.group?.storage !== "scalar") && (leaf?.kind === "json" || returned?.type === "json" && !returned.coordinateFormat);
      const unknownMultiplicity = dynamicJson && control.kind !== "group" && returned?.cardinality !== "multiple";
      if (field.type !== "json" && (!unknownMultiplicity && field.cardinality === "multiple" !== Boolean(actualMultiple) || !dynamicJson && actualType !== expectedType)) issue(issues, "error", "field-import-target-conflict", assignmentPath, "\u8F93\u5165\u63A7\u4EF6\u4E0E\u8F93\u51FA\u76EE\u6807\u7684\u4FDD\u5B58\u503C\u7C7B\u578B\u6216\u503C\u6570\u91CF\u4E0D\u517C\u5BB9\u3002");
      if (field.type === "enum" && (control.kind === "group" ? control.group?.itemFields[0]?.options : control.options)?.some((option) => !field.options?.some((target) => target.value === option.value))) issue(issues, "error", "field-import-target-conflict", assignmentPath, "\u5DE5\u4F5C\u6D41\u9009\u9879\u5305\u542B\u8F93\u51FA\u76EE\u6807\u5B57\u6BB5\u4E0D\u5141\u8BB8\u7684\u4FDD\u5B58\u503C\u3002");
    }
    assignmentIds.add(assignment.id);
    try {
      for (const token of workflowExpressionTokens(parseWorkflowExpression(assignment.expression))) if (!tokens.has(token)) issue(issues, "error", "workflow-assignment-slot-missing", assignmentPath, `\u5B57\u6BB5\u7EC4\u88C5\u5F15\u7528\u4E86\u4E0D\u5B58\u5728\u7684\u8F93\u5165\u69FD\u4F4D\u6216\u7CFB\u7EDF\u5B57\u6BB5 ${token}\u3002`);
    } catch (error) {
      issue(issues, "error", "workflow-assignment-expression-invalid", assignmentPath, error instanceof Error ? error.message : "\u7EC4\u88C5\u8868\u8FBE\u5F0F\u65E0\u6548\u3002");
    }
  }
}
function validateWorkflowValueCondition(condition, tokens, path2, issues) {
  if (!condition) return;
  if (condition.all || condition.any) {
    const items = condition.all ?? condition.any ?? [];
    if (!items.length || condition.all && condition.any) issue(issues, "error", "workflow-value-condition-invalid", path2, "\u7EC4\u5408\u6761\u4EF6\u5FC5\u987B\u6709\u5185\u5BB9\u4E14\u53EA\u80FD\u9009\u62E9\u5168\u90E8\u6216\u4EFB\u610F\u3002");
    for (const child of items) validateWorkflowValueCondition(child, tokens, path2, issues);
    return;
  }
  if (!tokens.has(condition.token) || !["empty", "present", "equals", "in"].includes(condition.operator)) issue(issues, "error", "workflow-value-condition-invalid", path2, "\u6267\u884C\u6761\u4EF6\u5FC5\u987B\u4F7F\u7528\u5DF2\u58F0\u660E token \u4E0E\u53D7\u63A7\u64CD\u4F5C\u3002");
  if (condition.operator === "equals" && !["string", "number", "boolean"].includes(typeof condition.value)) issue(issues, "error", "workflow-value-condition-invalid", path2, "\u76F8\u7B49\u6761\u4EF6\u5FC5\u987B\u6709\u6709\u6548\u6BD4\u8F83\u503C\u3002");
  if (condition.operator === "in" && (!condition.values?.length || condition.values.some((value) => !["string", "number", "boolean"].includes(typeof value)))) issue(issues, "error", "workflow-value-condition-invalid", path2, "\u5C5E\u4E8E\u6761\u4EF6\u5FC5\u987B\u5305\u542B\u6709\u6548\u6BD4\u8F83\u503C\u3002");
}
function validateWorkflow(workflow, config, issues) {
  for (const step of workflow.steps) for (const control of step.controls ?? []) {
    const path2 = `workflows/${workflow.id}/steps/${step.id}/controls/${control.id}`;
    for (const message of fieldImportErrors(config, workflow, control)) issue(issues, "error", "field-import-conflict", path2, message);
    for (const field of control.group?.itemFields ?? []) for (const message of fieldImportErrors(config, workflow, field)) issue(issues, "error", "field-import-conflict", `${path2}/group/${field.key}`, message);
  }
  workflow = resolveWorkflowFields(config, workflow);
  const base = `workflows/${workflow.id}`;
  if (workflow.editor?.dedicated && workflow.quickMapping !== false) issue(issues, "error", "workflow-editor-dedicated-visible", base, "\u4E13\u4F9B\u7F16\u8F91\u5DE5\u4F5C\u6D41\u5FC5\u987B\u5173\u95ED\u4FBF\u6377\u6D4B\u7ED8\u3002");
  if (workflow.editor?.enabled && workflow.mode === "composed") try {
    testWorkflowEditConversion(config, workflow);
  } catch (error) {
    issue(issues, "error", "workflow-editor-conversion-invalid", base, error instanceof Error ? error.message : "\u7F16\u8F91\u8D44\u683C\u6216\u56DE\u586B\u5931\u8D25\u3002");
  }
  if (config.contractRevision < 9 && (workflow.editor || workflow.quickMapping !== void 0 || workflow.external?.purpose)) issue(issues, "error", "workflow-editor-r9-required", base, "\u5DE5\u4F5C\u6D41\u7F16\u8F91\u7528\u9014\u9700\u8981 r9\u3002");
  if (config.contractRevision >= 9) {
    for (const step of workflow.steps) for (const control of step.controls ?? []) if ([control, ...control.group?.itemFields ?? []].some((item) => item.fieldSource)) issue(issues, "error", "live-field-source-forbidden", base, "r9 \u9884\u586B\u4E0D\u4FDD\u7559\u6765\u6E90\u5173\u7CFB\uFF0C\u8BF7\u8FC1\u79FB\u5C55\u5F00\u65E7\u63A7\u4EF6\u3002");
  }
  try {
    workflowOutputAssemblyOrder(workflow);
  } catch (error) {
    issue(issues, "error", "workflow-output-dependency-invalid", base, error instanceof Error ? error.message : "\u8F93\u51FA\u4F9D\u8D56\u65E0\u6548\u3002");
  }
  const checkIds = (items, kind) => {
    const ids = /* @__PURE__ */ new Set();
    for (const item of items ?? []) {
      if (!item.id?.trim() || ids.has(item.id)) issue(issues, "error", "workflow-id-invalid", base, `${kind}\u6807\u8BC6\u5FC5\u987B\u5B58\u5728\u4E14\u4E0D\u80FD\u91CD\u590D\u3002`);
      ids.add(item.id);
    }
  };
  checkIds(workflow.steps, "\u9875\u9762");
  checkIds(workflow.outputs, "\u8F93\u51FA");
  checkIds(controlsFor(workflow), "\u63A7\u4EF6");
  if (workflow.mode === "external") {
    if (workflow.external?.purpose === "edit") {
      for (const message of validateExternalEditBinding(workflow)) issue(issues, "error", "external-editor-invalid", base, message);
      const scope = workflow.editor?.scope ?? workflow.target;
      if (!scope || !hasCategoryNode(config, scope)) issue(issues, "error", "external-editor-scope-invalid", base, "\u5916\u90E8\u7F16\u8F91\u5206\u7C7B\u8303\u56F4\u4E0D\u5B58\u5728\u3002");
      else for (const node of config.nodes.filter((n) => pathMatchesScope(n.path, scope))) {
        const fields = resolveSelectableFields(config, node.path);
        for (const [key2, type] of [["Name", "string"], ["Interaction", "string"], ["Situation", "string"], ["Trade", "json"], ["elevation", "number"], ["tags.Land", "string"], ["tags.UAdm", "string"], ["tags.UAdmG", "string"], ["extensions.link.wiki", "string"], ["extensions.character.brief", "string"]]) {
          const field = fields.find((f) => f.key === key2);
          if (!field && !key2.includes(".") || field && (field.cardinality !== "single" || field.type !== type && !(type === "string" && field.type === "reference"))) issue(issues, "error", "external-editor-field-contract-conflict", base, `TRP \u7F16\u8F91\u6210\u54C1\u9700\u8981 ${classificationPathKey(node.path)} \u7684 ${key2} \u4E3A\u5355\u503C ${type} \u5B57\u6BB5\u3002`);
        }
        if (!hasDescendants(config, node.path) && !resolveGeometryProfile(config, node.path, "Point")?.enabled) issue(issues, "error", "external-editor-geometry-conflict", base, `TRP \u7F16\u8F91\u8303\u56F4 ${classificationPathKey(node.path)} \u672A\u542F\u7528\u70B9\u51E0\u4F55\u3002`);
      }
      return;
    }
    if (workflow.editor?.enabled) issue(issues, "error", "external-capture-editor-forbidden", base, "\u5916\u90E8\u91C7\u96C6\u65B9\u6848\u4E0D\u80FD\u5145\u5F53\u7F16\u8F91\u5668\uFF0C\u8BF7\u9009\u62E9\u72EC\u7ACB\u7F16\u8F91\u6210\u54C1\u3002");
    if (workflow.external?.purpose !== void 0 && workflow.external.purpose !== "capture") issue(issues, "error", "external-purpose-invalid", base, "\u5916\u90E8\u7528\u9014\u65E0\u6548\u3002");
    const allowedComponents = { "railway-integrated": "railwayWorkflow", "station-integrated": "stationWorkflow", "trp-integrated": "tradePointWorkflow" };
    if (!workflow.external?.componentKey || !EXTERNAL_WORKFLOW_REASONS.has(workflow.external.reason) || allowedComponents[workflow.external.reason] !== workflow.external.componentKey || workflow.steps.length || workflow.outputs.length || !workflow.external.coveredClassifications?.length) issue(issues, "error", "external-workflow-invalid", base, "\u5916\u90E8\u6574\u4F53\u5DE5\u4F5C\u6D41\u5FC5\u987B\u662F\u94C1\u8DEF\u4E00\u4F53\u3001\u8F66\u7AD9\u4E00\u4F53\u6216 TRP \u4E00\u4F53\u7684\u53D7\u63A7\u6210\u54C1\uFF0C\u4E14\u5FC5\u987B\u58F0\u660E\u53D7\u63A7\u5206\u7C7B\u3002");
    return;
  }
  if (!workflow.outputs.length) issue(issues, "error", "workflow-output-required", base, "\u7EC4\u5408\u5F0F\u5DE5\u4F5C\u6D41\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u8F93\u51FA\u5206\u7C7B\u3002");
  const actorIndex = workflow.steps.findIndex((step) => step.kind === "actor");
  const tailIndex = workflow.steps.findIndex((step) => step.kind === "tagsExtensions");
  const geometryIndexes = workflow.steps.map((step, index) => step.kind === "geometry" ? index : -1).filter((index) => index >= 0);
  const formIndexes = workflow.steps.map((step, index) => step.kind === "form" ? index : -1).filter((index) => index >= 0);
  if (actorIndex !== 0) issue(issues, "error", "workflow-actor-must-be-first", base, "\u586B\u5199\u4EBA\u9875\u5FC5\u987B\u4E14\u53EA\u80FD\u4F4D\u4E8E\u5DE5\u4F5C\u6D41\u7B2C\u4E00\u6B65\u3002");
  if (!formIndexes.length) issue(issues, "error", "workflow-form-page-required", base, "\u5DE5\u4F5C\u6D41\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u57FA\u672C\u4FE1\u606F\u586B\u5361\u9875\u3002");
  if (!geometryIndexes.length || geometryIndexes[geometryIndexes.length - 1] !== workflow.steps.length - 1) issue(issues, "error", "workflow-geometry-must-be-last", base, "\u6700\u540E\u4E00\u6B65\u5FC5\u987B\u662F\u4EFB\u4E00\u7ED8\u5236\u9875\u3002");
  if (config.contractRevision < 8 && (tailIndex < 0 || !geometryIndexes.length || tailIndex !== geometryIndexes[0] - 1)) issue(issues, "error", "workflow-tail-before-geometry-required", base, "tags/extensions \u5C3E\u90E8\u533A\u5FC5\u987B\u7D27\u90BB\u7B2C\u4E00\u5F20\u7ED8\u5236\u9875\u3002");
  if (formIndexes.some((index) => index <= actorIndex || geometryIndexes.length && index >= geometryIndexes[0])) issue(issues, "error", "workflow-form-page-order-invalid", base, "\u57FA\u672C\u4FE1\u606F\u9875\u5FC5\u987B\u4F4D\u4E8E\u586B\u5199\u4EBA\u548C tags/extensions \u5C3E\u90E8\u533A\u4E4B\u95F4\u3002");
  if (workflow.steps.filter((step) => step.kind === "geometry" && step.geometryRole !== "auxiliary").length !== workflow.outputs.length) issue(issues, "error", "workflow-geometry-output-count-invalid", base, "\u6BCF\u4E2A\u5DE5\u4F5C\u6D41\u8F93\u51FA\u5FC5\u987B\u6709\u4E14\u53EA\u6709\u4E00\u4E2A\u5C3E\u90E8\u7ED8\u5236\u9875\u3002");
  const geometryOutputIds = workflow.steps.filter((step) => step.kind === "geometry" && step.geometryRole !== "auxiliary").map((step) => step.outputId);
  if (new Set(geometryOutputIds).size !== workflow.outputs.length || workflow.outputs.some((output) => !geometryOutputIds.includes(output.id))) issue(issues, "error", "workflow-geometry-output-binding-invalid", base, "\u7ED8\u5236\u9875\u5FC5\u987B\u9010\u4E00\u7ED1\u5B9A\u5BF9\u5E94\u5DE5\u4F5C\u6D41\u8F93\u51FA\u3002");
  const slots = /* @__PURE__ */ new Set();
  const controlList = controlsFor(workflow);
  if (config.contractRevision >= 8) {
    const modules = controlList.filter((control) => control.kind === "tagsExtensions");
    if (tailIndex >= 0 || modules.length !== 1 || !modules[0]?.systemManaged || workflow.steps.some((step) => step.kind !== "form" && step.controls?.some((control) => control.kind === "tagsExtensions"))) issue(issues, "error", "workflow-inline-annotations-required", base, "\u5FC5\u987B\u5728\u4FE1\u606F\u6536\u96C6\u9875\u4FDD\u7559\u4E00\u4E2A\u4E0D\u53EF\u5220\u9664\u3001\u53EF\u79FB\u52A8\u7684\u6807\u7B7E\u4E0E\u6269\u5C55\u56FA\u5B9A\u5355\u5143\u3002");
  }
  const allTokens = /* @__PURE__ */ new Set([...controlList.flatMap((control) => control.slot ? [control.slot] : []), ...workflowDerivedPointTokens(workflow), ...WORKFLOW_SYSTEM_TOKENS, ...workflow.outputs.flatMap((_, index) => WORKFLOW_SYSTEM_TOKENS.map((token) => `${token}_${index + 1}`))]);
  const captured = workflowCaptureSlots(workflow);
  const derivedTokens = workflowDerivedPointTokens(workflow);
  for (const token of derivedTokens) if (!/^[A-Z][A-Z0-9_]*$/.test(token) || controlList.some((control) => control.slot === token) || derivedTokens.filter((item) => item === token).length > 1 || WORKFLOW_SYSTEM_TOKENS.some((system) => token === system || new RegExp(`^${system}_\\d+$`).test(token))) issue(issues, "error", "workflow-capture-slot-invalid", base, `\u5750\u6807\u69FD\u4F4D ${token} \u65E0\u6548\u3001\u91CD\u590D\u6216\u5360\u7528\u7CFB\u7EDF token\u3002`);
  if (config.contractRevision === 5 && captured.length) issue(issues, "error", "workflow-capture-revision-invalid", base, "\u5750\u6807\u69FD\u4F4D\u8981\u6C42\u539F\u751F r6\u3002");
  const earlierTokens = /* @__PURE__ */ new Set(["World", "Creator"]);
  for (const step of workflow.steps) {
    if (step.kind === "geometry") {
      const path2 = `${base}/steps/${step.id}`;
      validateWorkflowValueCondition(step.when, earlierTokens, path2, issues);
      validateWorkflowValueCondition(workflow.outputs.find((output) => output.id === step.outputId)?.when, earlierTokens, path2, issues);
      const drawing = step.drawing;
      if (step.geometryRole === "auxiliary" && !drawing?.captureSlot) issue(issues, "error", "workflow-extra-slot-required", path2, "\u989D\u5916\u7ED8\u5236\u5FC5\u987B\u5B9A\u4E49\u8FD4\u56DE\u69FD\u4F4D\u3002");
      if (drawing?.heightSlot && !controlsFor(workflow).some((control) => control.slot === drawing.heightSlot && control.kind === "number")) issue(issues, "error", "workflow-height-slot-invalid", path2, "\u9AD8\u5EA6\u8F93\u5165\u5FC5\u987B\u7ED1\u5B9A\u5DF2\u5B58\u5728\u7684\u6570\u503C\u69FD\u4F4D\u3002");
      const expected = step.geometry?.[0] === "Point" ? ["coordP", "pointObject"] : step.geometry?.[0] === "LineString" ? ["coordL"] : ["coordG"];
      if (drawing?.returnFormat && !expected.includes(drawing.returnFormat)) issue(issues, "error", "workflow-drawing-format-invalid", path2, "\u8FD4\u56DE\u683C\u5F0F\u4E0E\u70B9/\u7EBF/\u9762\u7C7B\u578B\u4E0D\u5339\u914D\u3002");
      if (drawing?.returnFormat === "pointObject" && drawing.multiple) issue(issues, "error", "workflow-drawing-format-invalid", path2, "\u5750\u6807\u5BF9\u8C61\u53EA\u80FD\u9009\u62E9\u5355\u70B9\u3002");
      for (const binding of drawing?.bindings ?? []) {
        const output = workflow.outputs.find((output2) => output2.id === binding.outputId);
        const field = output && resolveEffectiveFields(config, output.classification).find((field2) => field2.key === binding.target);
        if (!output || !isSafeWorkflowTarget(binding.target) || PROTECTED_WORKFLOW_TARGETS.has(binding.target.split(".")[0]) || !field && !/^(tags|extensions)\./.test(binding.target)) issue(issues, "error", "workflow-drawing-target-invalid", path2, `\u7ED8\u5236\u7ED1\u5B9A ${binding.target} \u5FC5\u987B\u9009\u62E9\u5BF9\u5E94\u8F93\u51FA\u7684\u6709\u6548\u5B57\u6BB5\u3002`);
        if (field && binding.value === "geometry" && (field.type !== "json" || field.coordinateFormat && field.coordinateFormat !== drawing?.returnFormat)) issue(issues, "error", "workflow-drawing-target-format-invalid", path2, "\u5750\u6807\u8FD4\u56DE\u683C\u5F0F\u4E0E\u76EE\u6807\u5B57\u6BB5\u7ED3\u6784\u4E0D\u4E00\u81F4\u3002");
        if (field && binding.value === "height" && field.type !== "number") issue(issues, "error", "workflow-drawing-target-format-invalid", path2, "\u9AD8\u5EA6\u76EE\u6807\u5FC5\u987B\u4E3A\u6570\u503C\u5B57\u6BB5\u3002");
      }
      for (const slot of [drawing?.captureSlot, drawing?.pointSlot]) if (slot) for (const token of [slot, `${slot}_X`, `${slot}_Y`, `${slot}_Z`, `${slot}_HEIGHT`]) earlierTokens.add(token);
    }
    for (const control of step.controls ?? []) if (control.slot) earlierTokens.add(control.slot);
  }
  for (const step of workflow.steps) {
    if (step.drawing?.drawMode && step.drawing.drawMode !== { Point: "point", LineString: "polyline", Polygon: "polygon" }[step.geometry?.[0] ?? "Point"]) issue(issues, "error", "workflow-draw-mode-invalid", `${base}/steps/${step.id}`, "\u7ED8\u5236\u6A21\u5F0F\u5FC5\u987B\u4E0E\u56FA\u5B9A\u51E0\u4F55\u7C7B\u578B\u4E00\u81F4\u3002");
    const ids = (step.drawing?.auxiliaryPoints ?? []).map((point) => point.id);
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) issue(issues, "error", "workflow-auxiliary-id-invalid", `${base}/steps/${step.id}`, "\u8F85\u52A9\u70B9\u6807\u8BC6\u5FC5\u987B\u5B58\u5728\u4E14\u552F\u4E00\u3002");
  }
  for (const step of workflow.steps) for (const point of step.drawing?.auxiliaryPoints ?? []) validateWorkflowValueCondition(point.when, allTokens, `${base}/steps/${step.id}/drawing/${point.id}`, issues);
  const validateOptions = (control, path2) => {
    if (control.kind !== "select") return;
    const options = resolveWorkflowSelectOptions(config, control);
    const values2 = options.map((option) => option.value);
    const normalized = values2.map((value) => "optionValueType" in control && control.optionValueType === "number" ? String(Number(value)) : value);
    const typed = effectiveOptionsOwner(config, control);
    if (typed.optionValueType === "number" && values2.some((value) => !Number.isFinite(Number(value))) || typed.optionValueType === "boolean" && values2.some((value) => !["true", "false"].includes(value))) issue(issues, "error", "workflow-option-value-type-invalid", path2, "\u4E0B\u62C9\u9009\u9879\u4FDD\u5B58\u503C\u4E0E\u6570\u5B57/\u5E03\u5C14\u7C7B\u578B\u4E0D\u7B26\u3002");
    if (!values2.length || values2.some((value) => !value.trim()) || new Set(normalized).size !== values2.length) issue(issues, "error", "workflow-select-options-invalid", path2, "\u4E0B\u62C9\u9009\u9879\u5FC5\u987B\u5177\u6709\u975E\u7A7A\u4E14\u552F\u4E00\u7684\u4FDD\u5B58\u503C\u3002");
  };
  for (const step of workflow.steps) for (const control of step.controls ?? []) {
    const controlPath = `${base}/steps/${step.id}/controls/${control.id}`;
    validateWorkflowValueCondition(control.when, allTokens, controlPath, issues);
    for (const condition of control.requiredWhen ?? []) validateWorkflowValueCondition(condition, allTokens, controlPath, issues);
    if (["notice", "runtimeValue", "component"].includes(control.kind)) issue(issues, "error", "workflow-control-kind-not-composed", controlPath, "\u7EC4\u5408\u5F0F\u5DE5\u4F5C\u6D41\u53EA\u5141\u8BB8\u6807\u51C6\u8868\u5355\u63A7\u4EF6\uFF1B\u4E13\u6709\u6D41\u7A0B\u5E94\u5207\u6362\u4E3A\u5916\u90E8\u6574\u4F53\u5DE5\u4F5C\u6D41\u3002");
    if (control.slot) {
      if (!/^[A-Z][A-Z0-9_]*$/.test(control.slot) || slots.has(control.slot) || WORKFLOW_SYSTEM_TOKENS.some((token) => control.slot === token || new RegExp(`^${token}_\\d+$`).test(control.slot))) issue(issues, "error", "workflow-slot-invalid", controlPath, `\u8F93\u51FA\u69FD\u4F4D ${control.slot} \u65E0\u6548\u3001\u91CD\u590D\u6216\u4E0E\u7CFB\u7EDF token \u51B2\u7A81\u3002`);
      slots.add(control.slot);
    } else if (!control.systemManaged) issue(issues, "error", "workflow-slot-required", controlPath, "\u8868\u5355\u8F93\u5165\u5FC5\u987B\u58F0\u660E\u8F93\u51FA\u69FD\u4F4D\u3002");
    validateOptions(control, controlPath);
    if (control.rows !== void 0 && (!Number.isInteger(control.rows) || control.rows < 1)) issue(issues, "error", "workflow-control-rows-invalid", controlPath, "\u8F93\u5165\u884C\u6570\u5FC5\u987B\u4E3A\u6B63\u6574\u6570\u3002");
    if (control.defaultValue !== void 0) {
      if (control.kind === "number" && !Number.isFinite(Number(control.defaultValue)) || control.kind === "toggle" && typeof control.defaultValue !== "boolean" || control.kind === "select" && !resolveWorkflowSelectOptions(config, control).some((option) => option.value === String(control.defaultValue))) issue(issues, "error", "workflow-default-invalid", controlPath, "\u9ED8\u8BA4\u503C\u4E0E\u8F93\u5165\u7C7B\u578B/\u9009\u9879\u4E0D\u4E00\u81F4\u3002");
      if (control.kind === "json") try {
        if (typeof control.defaultValue === "string") JSON.parse(control.defaultValue);
      } catch {
        issue(issues, "error", "workflow-default-invalid", controlPath, "\u9ED8\u8BA4\u503C\u5FC5\u987B\u4E3A\u6709\u6548 JSON\u3002");
      }
    }
    if (control.kind === "featureSearch" || control.kind === "coarseSearch") validateSearch(control, config, controlPath, issues);
    if (control.kind === "classificationPicker") {
      if (!control.outputId || !workflow.outputs.some((output) => output.id === control.outputId)) issue(issues, "error", "workflow-classification-output-invalid", controlPath, "\u7CFB\u7EDF Classification \u63A7\u4EF6\u5FC5\u987B\u7CBE\u786E\u7ED1\u5B9A\u4E00\u4E2A\u5DE5\u4F5C\u6D41\u8F93\u51FA\u3002");
      if (!control.classificationScope || !isContinuousPath(control.classificationScope) || !hasCategoryNode(config, control.classificationScope)) issue(issues, "error", "workflow-classification-scope-invalid", controlPath, "\u7CFB\u7EDF Classification \u63A7\u4EF6\u5FC5\u987B\u9009\u62E9\u6709\u6548\u7684\u5206\u7C7B\u8303\u56F4\u3002");
    }
    if (control.kind === "group") {
      const group = control.group;
      if (!group || !group.itemFields.length) {
        issue(issues, "error", "workflow-repeat-group-invalid", controlPath, "\u91CD\u590D\u5B57\u6BB5\u7EC4\u5FC5\u987B\u81F3\u5C11\u5B9A\u4E49\u4E00\u4E2A\u9879\u76EE\u5B57\u6BB5\u3002");
        continue;
      }
      const keys = /* @__PURE__ */ new Set();
      if (group.storage !== void 0 && !["object", "scalar"].includes(group.storage)) issue(issues, "error", "workflow-repeat-group-storage-invalid", controlPath, "\u91CD\u590D\u5B57\u6BB5\u7EC4\u4FDD\u5B58\u5F62\u5F0F\u65E0\u6548\u3002");
      if (group.storage === "scalar" && group.itemFields.length !== 1) issue(issues, "error", "workflow-repeat-group-scalar-shape-invalid", controlPath, "\u7EAF\u503C\u6570\u7EC4\u5FC5\u987B\u4E14\u53EA\u80FD\u5B9A\u4E49\u4E00\u4E2A\u7EC4\u5B57\u6BB5\u3002");
      for (const field of group.itemFields) {
        const fieldPath = `${controlPath}/group/${field.key}`;
        if (group.storage === "scalar" ? field.key.trim() !== "" : !/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key) || keys.has(field.key)) issue(issues, "error", "workflow-repeat-group-field-invalid", fieldPath, group.storage === "scalar" ? "\u7EAF\u503C\u6570\u7EC4\u7684\u552F\u4E00\u7EC4\u5B57\u6BB5\u5FC5\u987B\u7559\u7A7A\u4FDD\u5B58\u952E\u3002" : "\u91CD\u590D\u5B57\u6BB5\u7EC4\u5B57\u6BB5\u540D\u5FC5\u987B\u4EE5\u5B57\u6BCD\u5F00\u5934\u4E14\u4E0D\u80FD\u91CD\u590D\u3002");
        keys.add(field.key);
        validateOptions(field, fieldPath);
        if (field.kind === "featureSearch" || field.kind === "coarseSearch") validateSearch(field, config, fieldPath, issues);
      }
      if (group.minItems !== void 0 && (!Number.isInteger(group.minItems) || group.minItems < 0)) issue(issues, "error", "workflow-repeat-group-min-items-invalid", controlPath, "\u91CD\u590D\u5B57\u6BB5\u7EC4\u7684\u6700\u5C0F\u9879\u76EE\u6570\u5FC5\u987B\u662F\u975E\u8D1F\u6574\u6570\u3002");
    }
  }
  ;
  for (const [outputIndex, output] of workflow.outputs.entries()) {
    const managed = controlList.filter((control) => control.kind === "classificationPicker" && control.systemManaged && (control.outputId === output.id || !control.outputId && control.classificationScope && classificationPathKey(control.classificationScope) === classificationPathKey(output.classification)));
    if (targetSupportsClassificationPicker(config, output.classification) !== Boolean(managed.length)) issue(issues, "error", "workflow-classification-picker-stale", `${base}/outputs/${output.id}`, "\u5DE5\u4F5C\u6D41\u8F93\u51FA\u5206\u7C7B\u7684\u5B50\u5206\u7C7B\u72B6\u6001\u5DF2\u53D8\u5316\uFF1B\u8BF7\u6253\u5F00\u5DE5\u4F5C\u6D41\u4EE5\u5237\u65B0\u7CFB\u7EDF Classification \u63A7\u4EF6\u3002");
    validateWorkflowOutput(output, outputIndex, workflow, config, slots, issues);
  }
  issues.push(...validateWorkflowWrites(config.contractRevision < 8 ? migrateWorkflowDrawings(workflow) : workflow, (path2) => resolveSelectableFields(config, path2)));
}
function conditionMatches(record, conditions) {
  if (!conditions?.length) return true;
  return conditions.every((condition) => {
    if (condition.kind === "always" || condition.kind === "zoomRange" || condition.kind === "bboxArea") return true;
    const raw = readRecordPath(record, condition.field);
    const value = String(raw ?? "").trim();
    if (condition.kind === "fieldEquals") return value === condition.value;
    if (condition.kind === "fieldIn") return condition.values.includes(value);
    return condition.present ? !empty2(raw) : empty2(raw);
  });
}
function empty2(value) {
  return value == null || typeof value === "string" && !value.trim() || Array.isArray(value) && !value.length;
}
function recordId2(record, index) {
  return String(record.ID ?? `${String(record.World ?? "unknown-world")}/${String(record.Class ?? "unknown-class")}/${index}`);
}
function recordName(record) {
  return String(record.Name ?? record.ID ?? "\u672A\u547D\u540D\u8981\u7D20");
}
function aggregateMountedIssues(records, config) {
  const grouped = /* @__PURE__ */ new Map();
  records.forEach((record, index) => {
    const path2 = { class: String(record.Class ?? ""), ...record.Kind ? { kind: String(record.Kind) } : {}, ...record.Skind ?? record.SKind ? { skind: String(record.Skind ?? record.SKind) } : {}, ...record.Skind2 ?? record.SKind2 ? { skind2: String(record.Skind2 ?? record.SKind2) } : {} };
    for (const field of resolveEffectiveFields(config, path2).filter((item) => item.required && item.validateExistingData && conditionMatches(record, item.requiredWhen))) {
      if (!empty2(readRecordPath(record, field.key))) continue;
      const key2 = `mounted-data-required-field-missing|${field.key}|${classificationPathKey(path2)}`;
      const prior = grouped.get(key2) ?? { severity: "error", code: "mounted-data-required-field-missing", path: `mounted/${classificationPathKey(path2)}/${field.key}`, field: field.key, expected: "required", message: `\u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5 ${field.key}\uFF08${classificationPathKey(path2)}\uFF09\u3002`, affectedFeatures: [], count: 0 };
      prior.affectedFeatures?.push({ id: recordId2(record, index), name: recordName(record) });
      prior.count = (prior.count ?? 0) + 1;
      grouped.set(key2, prior);
    }
  });
  return [...grouped.values()].map((entry) => {
    const unique = /* @__PURE__ */ new Map();
    entry.affectedFeatures?.forEach((feature) => unique.set(feature.id, feature));
    return { ...entry, affectedFeatures: [...unique.values()].sort((a, b) => a.id.localeCompare(b.id)) };
  });
}
function validateInteractionShape(visual, path2, issues) {
  if (!validCssColor(visual.strokeColor) || visual.fillColor !== void 0 && !validCssColor(visual.fillColor) || visual.outline && !validCssColor(visual.outline.color)) issue(issues, "error", "interaction-color-invalid", path2, "\u4EA4\u4E92\u63CF\u8FB9\u3001\u586B\u5145\u548C\u5916\u63CF\u8FB9\u5FC5\u987B\u4F7F\u7528\u6709\u6548 CSS \u989C\u8272\u3002");
  if (typeof visual.enabled !== "boolean" || !visual.strokeColor?.trim() || !Number.isFinite(visual.strokeWidth) || visual.strokeWidth < 0 || !Number.isFinite(visual.strokeOpacity) || visual.strokeOpacity < 0 || visual.strokeOpacity > 1 || visual.fillOpacity !== void 0 && (!Number.isFinite(visual.fillOpacity) || visual.fillOpacity < 0 || visual.fillOpacity > 1)) issue(issues, "error", "interaction-visual-invalid", path2, "\u4EA4\u4E92\u989C\u8272\u3001\u7EBF\u5BBD\u548C\u900F\u660E\u5EA6\u65E0\u6548\u3002");
  if (visual.symbol && (!["circle", "pin"].includes(visual.symbol.kind) || visual.symbol.radius !== void 0 && (!Number.isFinite(visual.symbol.radius) || visual.symbol.radius <= 0) || visual.symbol.size?.some((value) => !Number.isFinite(value) || value <= 0))) issue(issues, "error", "interaction-symbol-invalid", path2, "\u4EA4\u4E92\u7B26\u53F7\u7C7B\u578B\u3001\u534A\u5F84\u548C\u5C3A\u5BF8\u65E0\u6548\u3002");
  if (visual.outline && (!visual.outline.color?.trim() || !Number.isFinite(visual.outline.width) || visual.outline.width < 0 || !Number.isFinite(visual.outline.opacity) || visual.outline.opacity < 0 || visual.outline.opacity > 1)) issue(issues, "error", "interaction-outline-invalid", path2, "\u5916\u63CF\u8FB9\u53C2\u6570\u65E0\u6548\u3002");
  if (visual.dashArray && !/^\d+(?:\.\d+)?(?:[ ,]+\d+(?:\.\d+)?)*$/.test(visual.dashArray)) issue(issues, "error", "interaction-dash-invalid", path2, "\u865A\u7EBF\u5FC5\u987B\u4E3A\u975E\u8D1F\u6570\u5B57\u5E8F\u5217\u3002");
}
function validateEngine(config, issues) {
  const engine = config.engine;
  if (!engine) {
    issue(issues, "error", "engine-settings-required", "engine", "V3.2 \u539F\u751F\u914D\u7F6E\u5FC5\u987B\u63D0\u4F9B\u5305\u7EA7\u5F15\u64CE\u8BBE\u7F6E\u3002");
    return;
  }
  if (engine.world.field !== "World" || engine.world.assignment !== "activeWorld" || engine.world.required !== true) issue(issues, "error", "world-system-field-invalid", "engine/world", "World \u5FC5\u987B\u662F\u7531\u5F53\u524D\u4E16\u754C\u81EA\u52A8\u8D4B\u503C\u7684\u5FC5\u586B\u7CFB\u7EDF\u5B57\u6BB5\u3002");
  const contextView = engine.contextView;
  if (!contextView || !Number.isFinite(contextView.minZoom) || contextView.minZoom < 0 || contextView.minZoom > 8 || !Number.isFinite(contextView.activationRadiusPx) || contextView.activationRadiusPx < 0 || !Number.isFinite(contextView.retainRadiusPx) || contextView.retainRadiusPx < contextView.activationRadiusPx) {
    issue(issues, "error", "context-view-default-invalid", "engine/contextView", "\u5305\u542B\u5173\u7CFB\u89C6\u89D2\u5FC5\u987B\u63D0\u4F9B 0\u20138 \u7684\u8FDB\u5165 Zoom\uFF0C\u4EE5\u53CA\u4E0D\u5C0F\u4E8E\u8FDB\u5165\u534A\u5F84\u7684\u4FDD\u6301\u534A\u5F84\u3002");
  }
  for (const [key2, value] of Object.entries(engine.screenGateDefaults)) {
    if (value !== void 0 && (!Number.isFinite(value) || Number(value) < 0)) issue(issues, "error", "screen-gate-default-invalid", `engine/screenGateDefaults/${key2}`, "\u5168\u5C40\u5C4F\u5E55\u9608\u503C\u5FC5\u987B\u662F\u975E\u8D1F\u6570\u3002");
  }
  for (const [key2, value] of Object.entries(engine.paneDefaults)) if (!/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(value)) issue(issues, "error", "pane-name-invalid", `engine/paneDefaults/${key2}`, "Pane \u540D\u79F0\u53EA\u80FD\u4F7F\u7528\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u6216\u8FDE\u5B57\u7B26\u3002");
  for (const geometry of GEOMETRIES) {
    const baseline = engine.interactionBaselines[geometry];
    const baselinePath = `engine/interactionBaselines/${geometry}`;
    if (!baseline || !Number.isFinite(baseline.hitTolerancePx) || baseline.hitTolerancePx < 0 || baseline.hitTolerancePx > 80) {
      issue(issues, "error", "interaction-baseline-invalid", baselinePath, "\u70B9\u3001\u7EBF\u3001\u9762\u90FD\u5FC5\u987B\u6709\u6709\u6548\u7684\u7EDF\u4E00\u4EA4\u4E92\u57FA\u51C6\u548C\u70B9\u51FB\u5BB9\u5DEE\u3002");
      continue;
    }
    for (const state of ["hover", "selected", "searchResult", "editing", "deletionMarked"]) {
      const visual = baseline[state];
      const path2 = `${baselinePath}/${state}`;
      if (visual) validateInteractionShape(visual, path2, issues);
      if (!visual || typeof visual.enabled !== "boolean" || !String(visual.strokeColor ?? "").trim() || !Number.isFinite(visual.strokeWidth) || visual.strokeWidth < 0 || !Number.isFinite(visual.strokeOpacity) || visual.strokeOpacity < 0 || visual.strokeOpacity > 1) {
        issue(issues, "error", "interaction-visual-invalid", path2, "\u4EA4\u4E92\u89C6\u89C9\u5FC5\u987B\u5305\u542B\u542F\u7528\u72B6\u6001\u3001\u63CF\u8FB9\u989C\u8272\u3001\u975E\u8D1F\u63CF\u8FB9\u7C97\u7EC6\u548C 0\u20131 \u63CF\u8FB9\u900F\u660E\u5EA6\u3002");
      }
      if (visual.fillOpacity !== void 0 && (!Number.isFinite(visual.fillOpacity) || visual.fillOpacity < 0 || visual.fillOpacity > 1)) issue(issues, "error", "interaction-fill-opacity-invalid", path2, "\u4EA4\u4E92\u586B\u8272\u900F\u660E\u5EA6\u5FC5\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002");
      if (visual.zIndexOffset !== void 0 && !Number.isFinite(visual.zIndexOffset)) issue(issues, "error", "interaction-zindex-invalid", path2, "\u4EA4\u4E92 zIndex \u504F\u79FB\u5FC5\u987B\u662F\u6709\u6548\u6570\u5B57\u3002");
      if (visual.labelPriority !== void 0 && !Number.isFinite(visual.labelPriority)) issue(issues, "error", "interaction-label-priority-invalid", path2, "\u4EA4\u4E92 Label \u4F18\u5148\u7EA7\u5FC5\u987B\u662F\u6709\u6548\u6570\u5B57\u3002");
    }
  }
}
function endpointFields(config, endpoint) {
  return new Set(resolveSelectableFields(config, endpoint.classification).map((field) => field.key));
}
function validateContextBindings(config, issues) {
  const bindings = config.contextBindings ?? [];
  const ids = /* @__PURE__ */ new Set();
  const seenPairs = /* @__PURE__ */ new Set();
  const edges = /* @__PURE__ */ new Map();
  for (const binding of bindings) {
    const base = `contextBindings/${binding.id || "unknown"}`;
    if (!binding.enabled) continue;
    if (!binding.id || ids.has(binding.id)) issue(issues, "error", "context-binding-id-invalid", base, "\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u5FC5\u987B\u5177\u6709\u552F\u4E00 ID\u3002");
    ids.add(binding.id);
    if (!binding.label.zh.trim()) issue(issues, "error", "context-binding-label-required", base, "\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u5FC5\u987B\u63D0\u4F9B\u4E2D\u6587\u540D\u79F0\u3002");
    for (const [side, endpoint] of [["host", binding.host], ["member", binding.member]]) {
      if (!endpoint || !isContinuousPath(endpoint.classification) || !hasCategoryNode(config, endpoint.classification)) {
        issue(issues, "error", "context-binding-classification-invalid", `${base}/${side}`, "\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u5FC5\u987B\u9009\u62E9\u5B58\u5728\u4E14\u8FDE\u7EED\u7684\u5206\u7C7B\u3002");
        continue;
      }
      const fields = endpointFields(config, endpoint);
      if (!endpoint.referenceField || !fields.has(endpoint.referenceField)) issue(issues, "error", "context-binding-reference-field-invalid", `${base}/${side}`, "\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u7684\u5F15\u7528\u5B57\u6BB5\u5FC5\u987B\u662F\u8BE5\u5206\u7C7B\u7684\u6709\u6548\u5B57\u6BB5\u3002", { field: endpoint.referenceField });
    }
    const hostKey = classificationPathKey(binding.host?.classification ?? { class: "" });
    const memberKey = classificationPathKey(binding.member?.classification ?? { class: "" });
    if (hostKey && hostKey === memberKey) issue(issues, "error", "context-binding-self-reference-invalid", base, "\u4E3B\u7ED3\u6784\u548C\u9644\u5C5E\u7ED3\u6784\u4E0D\u80FD\u662F\u540C\u4E00\u5206\u7C7B\u3002");
    const pair = `${hostKey}|${binding.host?.referenceField ?? ""}|${memberKey}|${binding.member?.referenceField ?? ""}`;
    if (seenPairs.has(pair)) issue(issues, "error", "context-binding-duplicate", base, "\u540C\u4E00\u4E0A\u4E0B\u6587\u5173\u7CFB\u4E0D\u80FD\u91CD\u590D\u4FDD\u5B58\u3002");
    seenPairs.add(pair);
    if (binding.memberSelectorField && binding.member && hasCategoryNode(config, binding.member.classification)) {
      const memberFields = endpointFields(config, binding.member);
      if (!memberFields.has(binding.memberSelectorField)) issue(issues, "error", "context-binding-selector-field-invalid", base, "\u5355\u5143/\u697C\u5C42\u9009\u62E9\u5B57\u6BB5\u5FC5\u987B\u5C5E\u4E8E\u9644\u5C5E\u7ED3\u6784\u5206\u7C7B\u3002", { field: binding.memberSelectorField });
    }
    if (hostKey && memberKey) {
      const next = edges.get(hostKey) ?? /* @__PURE__ */ new Set();
      next.add(memberKey);
      edges.set(hostKey, next);
    }
  }
  const visiting = /* @__PURE__ */ new Set();
  const visited = /* @__PURE__ */ new Set();
  const visit = (key2) => {
    if (visiting.has(key2)) return true;
    if (visited.has(key2)) return false;
    visiting.add(key2);
    for (const target of edges.get(key2) ?? []) if (visit(target)) return true;
    visiting.delete(key2);
    visited.add(key2);
    return false;
  };
  if ([...edges.keys()].some(visit)) issue(issues, "error", "context-binding-cycle-invalid", "contextBindings", "\u4E0A\u4E0B\u6587\u7ED1\u5B9A\u4E0D\u80FD\u5F62\u6210\u4E3B\u7ED3\u6784\u5230\u9644\u5C5E\u7ED3\u6784\u7684\u5FAA\u73AF\u3002");
}
function validateConfigPackage(config, mountedRecords = []) {
  packageValidationRuns++;
  const issues = [];
  const structure = validateNativeStructure(config);
  if (structure.length) return { schemaVersion: "cairnmap.config-validation-report.v3", valid: false, createdAt: (/* @__PURE__ */ new Date()).toISOString(), issues: structure.map((item) => ({ severity: "error", code: "native-contract-structure-invalid", ...item })) };
  if (config.resources) {
    if (config.contractRevision < 12) issue(issues, "error", "icon-resources-revision", "resources", "\u56FE\u6807\u8D44\u6E90\u80FD\u529B\u9700\u8981\u5951\u7EA6 r12\u3002");
    const seen = /* @__PURE__ */ new Set();
    for (const item of config.resources.iconLibraries) {
      if (seen.has(item.library)) issue(issues, "error", "icon-resource-duplicate", "resources", "\u540C\u4E00\u56FE\u5E93\u53EA\u80FD\u58F0\u660E\u4E00\u6B21\u3002");
      seen.add(item.library);
      if (item.library !== ICON_LIBRARY.library || item.version !== ICON_LIBRARY.version || item.manifestSha256 !== ICON_LIBRARY.manifestSha256) issue(issues, "error", "icon-resource-unsupported", "resources", "\u56FE\u5E93\u7248\u672C\u6216\u8D44\u6E90\u6458\u8981\u4E0D\u5728\u5F53\u524D\u652F\u6301\u7684\u56FA\u5B9A\u6E05\u5355\u4E2D\u3002");
    }
  }
  if (config.contractRevision >= 11) for (const button of config.application?.buttons.items ?? []) {
    const rows = button.criteria.paths;
    if (!rows) issue(issues, "error", "button-path-migration-required", `application/buttons/${button.id}`, "r11 \u6309\u94AE\u9700\u8981\u5B8C\u6574\u5206\u7C7B\u8DEF\u5F84\u3002");
    else for (const [index, row2] of rows.entries()) {
      if (!hasCategoryNode(config, row2)) issue(issues, "error", "button-path-invalid", `application/buttons/${button.id}/${index}`, "\u6309\u94AE\u663E\u793A\u5185\u5BB9\u4E0D\u662F\u6709\u6548\u5206\u7C7B\u8DEF\u5F84\u3002");
      if (rows.some((other, at) => at !== index && Object.entries(other).every(([key2, value]) => !value || row2[key2] === value))) issue(issues, "warning", "button-path-redundant", `application/buttons/${button.id}/${index}`, "\u8BE5\u8303\u56F4\u5DF2\u88AB\u53E6\u4E00\u6761\u4E0A\u7EA7\u6216\u91CD\u590D\u8303\u56F4\u5305\u542B\uFF0C\u53EF\u5220\u9664\u5197\u4F59\u884C\u3002");
    }
  }
  if (config.contractRevision < 11 && config.application && isWorldGroups(config.application.sources)) issue(issues, "error", "resource-groups-revision", "application/sources", "World resource groups require contract r11.");
  if (config.contractRevision >= 10 && !config.application) issue(issues, "error", "application-required", "application", "r10 \u5B8C\u6574\u5E94\u7528\u5305\u5FC5\u987B\u5305\u542B\u603B\u4F53\u89C4\u5219\u3002");
  if (config.contractRevision >= 10 && config.application) for (const row2 of validateApplication(config.application, new Set(config.nodes.map((node) => node.path.class)))) issue(issues, "error", "application-invalid", "application/" + row2.path, row2.message);
  issues.push(...validateLookupTables(config));
  for (const error of standardTagTableErrors(config)) issue(issues, "error", "standard-tag-table-invalid", error.path, error.message);
  issues.push(...validatePrefillCopies(config, resolveEffectiveFields));
  issues.push(...validateNodeFieldSettings(config, resolveEffectiveFields));
  if (config.contractRevision >= 8 && (config.registries.optionSets || config.nodes.some((node) => node.fields.some((field) => field.optionSource)) || config.workflows.some((workflow) => controlsFor(workflow).some((control) => control.optionSource)))) issue(issues, "error", "legacy-option-source-forbidden", "registries", "r8 \u4F7F\u7528\u5B57\u6BB5\u5185\u5BF9\u7167\uFF1B\u65E7\u5168\u5C40\u9009\u9879\u6765\u6E90\u5FC5\u987B\u5148\u8FC1\u79FB\u3002");
  if (config.schemaVersion !== "cairnmap.config-package.v3") issue(issues, "error", "schema-version-invalid", "manifest", "\u914D\u7F6E\u5305\u4E0D\u662F cairnmap.config-package.v3\u3002");
  if (!isNativeConfigRevision(config.contractRevision)) issue(issues, "error", "contract-revision-invalid", "manifest", "\u914D\u7F6E\u5305\u5FC5\u987B\u4F7F\u7528 V3.2 \u539F\u751F\u5951\u7EA6 revision 5/6\u3002");
  validateEngine(config, issues);
  if (!/^[a-z][a-z0-9-]{2,80}$/.test(config.packageId)) issue(issues, "error", "package-id-invalid", "manifest", "\u914D\u7F6E\u5305 ID \u683C\u5F0F\u65E0\u6548\u3002");
  if (!Number.isSafeInteger(config.revision) || config.revision < 1) issue(issues, "error", "revision-invalid", "manifest", "\u5305 revision \u5FC5\u987B\u662F\u6B63\u6574\u6570\u3002");
  for (const [registryName, items] of Object.entries(config.registries)) {
    const ids = /* @__PURE__ */ new Set();
    for (const item of items ?? []) {
      if (!item.id || ids.has(item.id)) issue(issues, "error", "registry-id-invalid", `registries/${registryName}`, `${registryName} \u4E2D\u5B58\u5728\u7A7A\u6216\u91CD\u590D\u7684\u6CE8\u518C\u8868\u952E\u3002`);
      ids.add(item.id);
    }
  }
  const nodeIds = /* @__PURE__ */ new Set();
  const paths = /* @__PURE__ */ new Set();
  for (const node of config.nodes) {
    const base = `nodes/${node.nodeId}`;
    if (config.contractRevision >= 9) {
      for (const field of node.fields) if (field.defaultValue !== void 0 || field.placeholder !== void 0) issue(issues, "error", "field-input-setting-forbidden", base, "\u8F93\u5165\u9ED8\u8BA4\u503C\u548C\u63D0\u793A\u5C5E\u4E8E\u63A7\u4EF6\uFF0C\u4E0D\u5C5E\u4E8E\u5B57\u6BB5\u5B9A\u4E49\u3002");
    }
    const parentScope = parentClassificationPath(node.path);
    const inheritedFields = config.contractRevision >= 10 ? resolveIncomingFields(config, node.path) : parentScope ? resolveEffectiveFields(config, parentScope) : [];
    for (const field of node.fields) {
      if (inheritedFields.some((inherited) => inherited.key === (field.overrideOf ?? field.key) && inherited.inheritance === "sealed")) issue(issues, "error", "field-sealed-override", base, `\u5B57\u6BB5 ${field.key} \u5DF2\u9501\u5B9A\u7EE7\u627F\uFF0C\u4E0D\u80FD\u8986\u76D6\u3002`);
      if (field.optionSource && !config.registries.optionSets?.some((set) => set.id === field.optionSource?.registryKey)) issue(issues, "error", "field-option-source-invalid", base, `\u5B57\u6BB5 ${field.key} \u7684\u5171\u4EAB\u9009\u9879\u6765\u6E90\u4E0D\u5B58\u5728\u3002`);
      if (field.reference) {
        const target = { class: field.reference.classCode };
        if (!hasCategoryNode(config, target) || !resolveSelectableFields(config, target).some((candidate) => candidate.key === field.reference?.matchField)) issue(issues, "error", "field-reference-invalid", base, `\u5B57\u6BB5 ${field.key} \u7684\u5F15\u7528\u5206\u7C7B\u6216\u5339\u914D\u5B57\u6BB5\u65E0\u6548\u3002`);
      }
    }
    const pathKey = classificationPathKey(node.path);
    if (nodeIds.has(node.nodeId)) issue(issues, "error", "node-id-duplicate", base, "\u5206\u7C7B\u8282\u70B9 ID \u91CD\u590D\u3002");
    nodeIds.add(node.nodeId);
    if (!isContinuousPath(node.path)) issue(issues, "error", "classification-path-invalid", base, "\u5206\u7C7B\u8DEF\u5F84\u5FC5\u987B\u4ECE Class \u8FDE\u7EED\u5411\u4E0B\u5B9A\u4E49\u3002");
    if (paths.has(pathKey)) issue(issues, "error", "classification-path-duplicate", base, "\u5206\u7C7B\u8DEF\u5F84\u91CD\u590D\u3002");
    paths.add(pathKey);
    const parent = parentClassificationPath(node.path);
    if (parent && !hasCategoryNode(config, parent)) issue(issues, "error", "category-parent-missing", base, "\u5B50\u5206\u7C7B\u8282\u70B9\u5FC5\u987B\u5177\u6709\u8FDE\u7EED\u7684\u7236\u5206\u7C7B\u8282\u70B9\u3002");
    const keys = /* @__PURE__ */ new Set();
    node.fields.forEach((field, index) => validateField(effectiveOptionsOwner(config, field), `${base}/fields/${index}`, keys, issues));
    const identities = /* @__PURE__ */ new Map();
    for (const field of resolveEffectiveFields(config, node.path)) {
      const prior = identities.get(field.fieldId);
      if (prior !== void 0 && prior !== field.key) issue(issues, "error", "field-id-duplicate", `${base}/fields/${field.fieldId}`, `\u6709\u6548\u5206\u7C7B ${pathKey} \u7684 fieldId ${field.fieldId} \u540C\u65F6\u5C5E\u4E8E ${prior} \u548C ${field.key}\u3002\u8BF7\u4FEE\u590D\u8EAB\u4EFD\u53CA\u5176\u5F15\u7528\u540E\u518D\u4FDD\u5B58\u3002`);
      identities.set(field.fieldId, field.key);
    }
    for (const geometry of GEOMETRIES) {
      const profile = node.geometryProfiles[geometry];
      if (config.contractRevision >= 7 && profile?.enabled && resolveCategoryNodes(config, node.path).some((ancestor) => ancestor.nodeId !== node.nodeId && ancestor.geometryType && ancestor.geometryType !== geometry)) issue(issues, "error", "geometry-type-inheritance-invalid", `${base}/geometry/${geometry}`, "\u672C\u7EA7\u51E0\u4F55\u4E0E\u7956\u5148\u5DF2\u6307\u5B9A\u7684\u7C7B\u578B\u4E0D\u4E00\u81F4\u3002");
      if (profile) validateProfile(profile, geometry, `${base}/geometry/${geometry}`, config, node.path, issues);
      if (node.geometryType && geometry !== node.geometryType && profile?.enabled) issue(issues, "error", "geometry-type-multiple-enabled", `${base}/geometry/${geometry}`, "\u540C\u4E00\u5206\u7C7B\u8282\u70B9\u53EA\u80FD\u542F\u7528\u4E00\u79CD\u51E0\u4F55\u7C7B\u578B\u3002");
    }
    if (node.geometryType && !node.geometryProfiles[node.geometryType]?.enabled) issue(issues, "error", "geometry-type-profile-missing", `${base}/geometry`, "\u5DF2\u9009\u62E9\u7684\u51E0\u4F55\u7C7B\u578B\u5FC5\u987B\u5177\u6709\u542F\u7528\u7684\u51E0\u4F55\u914D\u7F6E\u3002");
    if (parent) {
      const parentNode = config.nodes.find((candidate) => classificationPathKey(candidate.path) === classificationPathKey(parent));
      if (parentNode?.geometryType && node.geometryType && parentNode.geometryType !== node.geometryType) issue(issues, "error", "geometry-type-inheritance-invalid", `${base}/geometry`, "\u7236\u5206\u7C7B\u5DF2\u6307\u5B9A\u51E0\u4F55\u7C7B\u578B\u65F6\uFF0C\u5B50\u5206\u7C7B\u5FC5\u987B\u4F7F\u7528\u76F8\u540C\u7C7B\u578B\u3002");
    }
    if (node.containment?.enabled) {
      if (isNativeConfigRevision(config.contractRevision)) issue(issues, "error", "legacy-containment-forbidden", `${base}/containment`, "V3.2 \u539F\u751F\u5305\u5FC5\u987B\u5C06\u5305\u542B\u5173\u7CFB\u8FC1\u79FB\u5230 contextBindings\uFF0C\u4E0D\u80FD\u4F7F\u7528\u8282\u70B9\u5185\u65E7\u7ED1\u5B9A\u3002");
      if (!node.containment.role) issue(issues, "error", "containment-role-required", `${base}/containment`, "\u5305\u542B\u5173\u7CFB\u7ED1\u5B9A\u5DF2\u542F\u7528\uFF0C\u4F46\u5C1A\u672A\u9009\u62E9\u4E3B\u7ED3\u6784\u6216\u9644\u5C5E\u7ED3\u6784\u3002");
      const fields = new Set(resolveEffectiveFields(config, node.path).map((field) => field.key));
      if (node.containment.role === "child" && (!node.containment.parentReferenceField || !fields.has(node.containment.parentReferenceField))) issue(issues, "error", "containment-parent-field-invalid", `${base}/containment`, "\u9644\u5C5E\u7ED3\u6784\u5FC5\u987B\u9009\u62E9\u4E00\u4E2A\u5F53\u524D\u6709\u6548\u7684\u4E3B\u7ED3\u6784\u5F15\u7528\u5B57\u6BB5\u3002");
      if (node.containment.role === "parent" && node.containment.parentReferenceField && !fields.has(node.containment.parentReferenceField) && !SYSTEM_FIELD_KEYS.has(node.containment.parentReferenceField)) issue(issues, "error", "containment-optional-parent-field-invalid", `${base}/containment`, "\u4E3B\u7ED3\u6784\u5F15\u7528\u5B57\u6BB5\uFF08\u53EF\u9009\uFF09\u5FC5\u987B\u662F\u5F53\u524D\u6709\u6548\u5B57\u6BB5\u3002");
    }
    validateCard(node, config, issues);
  }
  for (const node of config.nodes) {
    const expected = config.nodes.filter((child) => classificationPathKey(parentClassificationPath(child.path) ?? { class: "" }) === classificationPathKey(node.path)).map((child) => child.nodeId);
    const seen = /* @__PURE__ */ new Set();
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) issue(issues, "error", "category-child-missing", `nodes/${node.nodeId}/children`, `\u5B50\u5206\u7C7B\u8282\u70B9 ${childId} \u4E0D\u5B58\u5728\u3002`);
      else if (!expected.includes(childId)) issue(issues, "error", "category-child-parent-conflict", `nodes/${node.nodeId}/children`, `\u5B50\u5206\u7C7B ${childId} \u7684 path \u4E0D\u5C5E\u4E8E\u8BE5\u76F4\u63A5\u7236\u7EA7\uFF0C\u8BF7\u4F9D\u636E\u8FDE\u7EED path \u4FEE\u590D children\u3002`);
      if (seen.has(childId)) issue(issues, "error", "category-child-duplicate", `nodes/${node.nodeId}/children`, `\u5B50\u5206\u7C7B ${childId} \u91CD\u590D\u3002`);
      seen.add(childId);
    }
    for (const id of expected) if (!seen.has(id)) issue(issues, "error", "category-child-omitted", `nodes/${node.nodeId}/children`, `children \u9057\u6F0F path \u5B9A\u4E49\u7684\u76F4\u63A5\u5B50\u5206\u7C7B ${id}\u3002`);
  }
  const workflowIds = /* @__PURE__ */ new Set();
  for (const workflow of config.workflows) {
    if (workflowIds.has(workflow.id)) issue(issues, "error", "workflow-id-duplicate", `workflows/${workflow.id}`, "\u5DE5\u4F5C\u6D41 ID \u91CD\u590D\u3002");
    workflowIds.add(workflow.id);
    validateWorkflow(workflow, config, issues);
  }
  const editorScopes = /* @__PURE__ */ new Set();
  for (const workflow of config.workflows.filter((w) => w.editor?.enabled)) {
    const scope = workflow.editor?.scope ?? workflow.outputs[0]?.classification ?? workflow.target;
    if (!scope) {
      issue(issues, "error", "workflow-editor-scope-required", `workflows/${workflow.id}`, "\u7F16\u8F91\u5DE5\u4F5C\u6D41\u7F3A\u5C11\u4F5C\u7528\u8303\u56F4\u3002");
      continue;
    }
    const key2 = classificationPathKey(scope);
    if (editorScopes.has(key2)) issue(issues, "error", "workflow-editor-route-duplicate", `workflows/${workflow.id}`, "\u540C\u4E00\u5206\u7C7B\u8303\u56F4\u5B58\u5728\u591A\u4E2A\u7F16\u8F91\u5DE5\u4F5C\u6D41\u3002");
    editorScopes.add(key2);
  }
  validateContextBindings(config, issues);
  for (const node of config.nodes) {
    const hasChildren = node.children.length > 0;
    if (!hasChildren && !resolveInheritedValue(config, node.path, "display", (candidate) => candidate.geometryType)) issue(issues, "error", "leaf-geometry-type-required", `nodes/${node.nodeId}/geometry`, "\u603B\u914D\u7F6E\u4FDD\u5B58\u65F6\uFF0C\u6BCF\u4E2A\u6700\u7EC8\u5206\u7C7B\u5FC5\u987B\u89E3\u6790\u4E3A\u4E00\u79CD\u660E\u786E\u51E0\u4F55\u7C7B\u578B\u3002");
  }
  if (!config.parity) issue(issues, "warning", "v1-parity-report-pending", "parity", "V1 \u8BED\u4E49\u8FC1\u79FB\u5C1A\u672A\u6267\u884C\uFF1B\u5F53\u524D\u4EC5\u53EF\u4F5C\u4E3A V3 \u539F\u751F\u8BD5\u9A8C\u5305\u3002");
  else for (const entry of config.parity.entries.filter((item) => item.status === "unsupported")) issue(issues, "warning", "v1-parity-unsupported-pending", `parity/${entry.kind}/${entry.id}`, `V1 \u914D\u7F6E ${entry.id} \u5C1A\u672A\u8FC1\u79FB\uFF1A${entry.details ?? "\u672A\u8BF4\u660E\u539F\u56E0"}\u3002`);
  const mounted = aggregateMountedIssues(mountedRecords, config);
  mounted.push(...validateMountedStructureRoles(config, mountedRecords));
  issues.push(...mounted);
  const configuration = issues.filter((item) => !item.code.startsWith("mounted-") && !item.code.startsWith("v1-parity")).length;
  const parity = issues.filter((item) => item.code.startsWith("v1-parity")).length;
  return { schemaVersion: "cairnmap.config-validation-report.v3", valid: !issues.some((item) => item.severity === "error"), createdAt: (/* @__PURE__ */ new Date()).toISOString(), issues, summary: { configuration, parity, mountedData: mounted.length, affectedFeatures: mounted.reduce((total, item) => total + (item.affectedFeatures?.length ?? 0), 0) } };
}

// src/configStudio/multipartPolicy.ts
function recordCategory(record) {
  return { class: String(record.Class ?? ""), ...record.Kind ? { kind: String(record.Kind) } : {}, ...record.SKind ?? record.Skind ? { skind: String(record.SKind ?? record.Skind) } : {}, ...record.SKind2 ?? record.Skind2 ? { skind2: String(record.SKind2 ?? record.Skind2) } : {} };
}

// scripts/config-tools/server-validation-entry.ts
var rulesVersion = "cairnmap-r12-production-1";
var validateConfiguration = validateConfigPackage;
async function validateConfigurationArchive(bytes) {
  const config = await readRawNativePackage(new File([bytes], "configuration.zip"));
  if (![11, 12].includes(config.contractRevision)) throw Error("Publication requires native contract r11 or r12; historical imports remain editable.");
  const report = validateConfigPackage(config);
  if (!report.valid) throw Object.assign(Error("configuration-semantic-validation-failed"), { report });
  const zip = await import_jszip2.default.loadAsync(bytes), configBody = await zip.file("config.json").async("uint8array"), manifestBody = await zip.file("manifest.json").async("uint8array");
  return { config, report, configBody, manifestBody, configSha256: createHash("sha256").update(configBody).digest("hex"), manifestSha256: createHash("sha256").update(manifestBody).digest("hex"), rulesVersion };
}
function validatePublishedRecords(config, records) {
  return validateConfigPackage(config, records);
}
function validateRecordGeometry(config, record) {
  const raw = recordCategory(record), path2 = readableClassification(config, raw) ?? raw, node = config.nodes.find((node2) => JSON.stringify(node2.path) === JSON.stringify(path2));
  if (!hasCategoryNode(config, path2) || hasDescendants(config, path2) || !node) return ["configuration-unknown-final-classification"];
  const type = node.geometryType ?? geometryTypeFromFeatureType(record.Type);
  if (!type) return ["configuration-geometry-not-defined"];
  if (geometryTypeFromFeatureType(record.Type) !== type) return ["configuration-record-type-mismatch"];
  const profile = resolveGeometryProfile(config, path2, type), read = readMultipartGeometry(record, type);
  const error = read.error ?? validateMultipartGeometry(read.geometry);
  return [...!profile?.enabled ? ["configuration-geometry-disabled"] : [], ...error ? [error] : [], ...read.geometry && read.geometry.parts.length > 1 && !profile?.allowMultipleParts ? ["configuration-single-part-required"] : []];
}
function worldId(config, value) {
  return config.application?.worlds.find((world) => [world.id, String(world.numericCode), world.prefix, world.label.zh, world.label.en].includes(String(value)))?.id;
}
function validateIncomingRecord(config, record, expectedWorld) {
  const errors = validateRecordGeometry(config, record);
  if (errors.length) return errors;
  const world = worldId(config, record.World);
  if (!world || expectedWorld && world !== expectedWorld) return ["configuration-record-world-mismatch"];
  const raw = recordCategory(record), classification = readableClassification(config, raw) ?? raw, geometry = config.nodes.find((node) => JSON.stringify(node.path) === JSON.stringify(classification)).geometryType ?? geometryTypeFromFeatureType(record.Type);
  const output = { id: "incoming-record", classification, geometry: { selected: geometry }, assignments: [] };
  return validateV3WorkflowRecords(config, { outputs: [output] }, [{ outputId: output.id, classification, geometry, record }]).map((issue2) => issue2.message);
}
function validateIncomingBatch(config, created, existing, deletes = []) {
  const identity2 = (record) => `${worldId(config, record.World)}:${record.ID}`;
  const current2 = /* @__PURE__ */ new Set();
  for (const record of created) {
    const key2 = identity2(record);
    if (current2.has(key2)) throw Error("configuration-record-id-duplicate");
    current2.add(key2);
  }
  const surviving = existing.filter((record) => readableClassification(config, recordCategory(record)) && !deletes.some((item) => item.worldId === worldId(config, record.World) && item.classCode === record.Class && item.featureId === record.ID)).filter((record) => {
    const update = created.find((next) => identity2(next) === identity2(record));
    if (update && update.Class !== record.Class) throw Error("configuration-record-id-collision");
    return !update;
  });
  assertStructureTargets(config, created, surviving);
}
export {
  stableConfigText as configurationSnapshotText,
  rulesVersion,
  validateConfiguration,
  validateConfigurationArchive,
  validateIncomingBatch,
  validateIncomingRecord,
  validatePublishedRecords,
  validateRecordGeometry
};
