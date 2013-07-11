(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {};
            var exports = module.exports = {};
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    window["boxspring"] = require("0");
})({
    "0": function(require, module, exports, global) {
        "use strict";
        require("1");
        require("9");
        require("g");
        require("j");
        require("l");
        require("u");
        require("x");
        module.exports = boxspring;
    },
    "1": function(require, module, exports, global) {
        "use strict";
        if (global.boxspring === undefined) {
            global.boxspring = {};
        }
        global._ = require("2");
        boxspring.version = "0.0.1-dev";
        require("3");
        require("4");
        require("5");
        require("6");
        require("7");
        require("8");
    },
    "2": function(require, module, exports, global) {
        (function(window) {
            var undefined;
            var arrayPool = [], objectPool = [];
            var idCounter = 0;
            var indicatorObject = {};
            var keyPrefix = +(new Date) + "";
            var largeArraySize = 75;
            var maxPoolSize = 40;
            var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
            var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
            var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
            var reFlags = /\w*$/;
            var reInterpolate = /<%=([\s\S]+?)%>/g;
            var reThis = (reThis = /\bthis\b/) && reThis.test(runInContext) && reThis;
            var whitespace = " 	\f ﻿" + "\n\r\u2028\u2029" + " ᠎             　";
            var reLeadingSpacesAndZeros = RegExp("^[" + whitespace + "]*0+(?=.$)");
            var reNoMatch = /($^)/;
            var reUnescapedHtml = /[&<>"']/g;
            var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
            var contextProps = [ "Array", "Boolean", "Date", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setImmediate", "setTimeout" ];
            var templateCounter = 0;
            var argsClass = "[object Arguments]", arrayClass = "[object Array]", boolClass = "[object Boolean]", dateClass = "[object Date]", errorClass = "[object Error]", funcClass = "[object Function]", numberClass = "[object Number]", objectClass = "[object Object]", regexpClass = "[object RegExp]", stringClass = "[object String]";
            var cloneableClasses = {};
            cloneableClasses[funcClass] = false;
            cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
            var objectTypes = {
                "boolean": false,
                "function": true,
                object: true,
                number: false,
                string: false,
                "undefined": false
            };
            var stringEscapes = {
                "\\": "\\",
                "'": "'",
                "\n": "n",
                "\r": "r",
                "	": "t",
                "\u2028": "u2028",
                "\u2029": "u2029"
            };
            var freeExports = objectTypes[typeof exports] && exports;
            var freeModule = objectTypes[typeof module] && module && module.exports == freeExports && module;
            var freeGlobal = objectTypes[typeof global] && global;
            if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
                window = freeGlobal;
            }
            function basicIndexOf(array, value, fromIndex) {
                var index = (fromIndex || 0) - 1, length = array.length;
                while (++index < length) {
                    if (array[index] === value) {
                        return index;
                    }
                }
                return -1;
            }
            function cacheIndexOf(cache, value) {
                var type = typeof value;
                cache = cache.cache;
                if (type == "boolean" || value == null) {
                    return cache[value];
                }
                if (type != "number" && type != "string") {
                    type = "object";
                }
                var key = type == "number" ? value : keyPrefix + value;
                cache = cache[type] || (cache[type] = {});
                return type == "object" ? cache[key] && basicIndexOf(cache[key], value) > -1 ? 0 : -1 : cache[key] ? 0 : -1;
            }
            function cachePush(value) {
                var cache = this.cache, type = typeof value;
                if (type == "boolean" || value == null) {
                    cache[value] = true;
                } else {
                    if (type != "number" && type != "string") {
                        type = "object";
                    }
                    var key = type == "number" ? value : keyPrefix + value, typeCache = cache[type] || (cache[type] = {});
                    if (type == "object") {
                        if ((typeCache[key] || (typeCache[key] = [])).push(value) == this.array.length) {
                            cache[type] = false;
                        }
                    } else {
                        typeCache[key] = true;
                    }
                }
            }
            function charAtCallback(value) {
                return value.charCodeAt(0);
            }
            function compareAscending(a, b) {
                var ai = a.index, bi = b.index;
                a = a.criteria;
                b = b.criteria;
                if (a !== b) {
                    if (a > b || typeof a == "undefined") {
                        return 1;
                    }
                    if (a < b || typeof b == "undefined") {
                        return -1;
                    }
                }
                return ai < bi ? -1 : 1;
            }
            function createCache(array) {
                var index = -1, length = array.length;
                var cache = getObject();
                cache["false"] = cache["null"] = cache["true"] = cache["undefined"] = false;
                var result = getObject();
                result.array = array;
                result.cache = cache;
                result.push = cachePush;
                while (++index < length) {
                    result.push(array[index]);
                }
                return cache.object === false ? (releaseObject(result), null) : result;
            }
            function escapeStringChar(match) {
                return "\\" + stringEscapes[match];
            }
            function getArray() {
                return arrayPool.pop() || [];
            }
            function getObject() {
                return objectPool.pop() || {
                    array: null,
                    cache: null,
                    criteria: null,
                    "false": false,
                    index: 0,
                    leading: false,
                    maxWait: 0,
                    "null": false,
                    number: null,
                    object: null,
                    push: null,
                    string: null,
                    trailing: false,
                    "true": false,
                    "undefined": false,
                    value: null
                };
            }
            function noop() {}
            function releaseArray(array) {
                array.length = 0;
                if (arrayPool.length < maxPoolSize) {
                    arrayPool.push(array);
                }
            }
            function releaseObject(object) {
                var cache = object.cache;
                if (cache) {
                    releaseObject(cache);
                }
                object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
                if (objectPool.length < maxPoolSize) {
                    objectPool.push(object);
                }
            }
            function slice(array, start, end) {
                start || (start = 0);
                if (typeof end == "undefined") {
                    end = array ? array.length : 0;
                }
                var index = -1, length = end - start || 0, result = Array(length < 0 ? 0 : length);
                while (++index < length) {
                    result[index] = array[start + index];
                }
                return result;
            }
            function runInContext(context) {
                context = context ? _.defaults(window.Object(), context, _.pick(window, contextProps)) : window;
                var Array = context.Array, Boolean = context.Boolean, Date = context.Date, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
                var arrayRef = [];
                var objectProto = Object.prototype, stringProto = String.prototype;
                var oldDash = context._;
                var reNative = RegExp("^" + String(objectProto.valueOf).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/valueOf|for [^\]]+/g, ".+?") + "$");
                var ceil = Math.ceil, clearTimeout = context.clearTimeout, concat = arrayRef.concat, floor = Math.floor, fnToString = Function.prototype.toString, getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty = objectProto.hasOwnProperty, push = arrayRef.push, propertyIsEnumerable = objectProto.propertyIsEnumerable, setImmediate = context.setImmediate, setTimeout = context.setTimeout, toString = objectProto.toString;
                var nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind, nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate, nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite = context.isFinite, nativeIsNaN = context.isNaN, nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys, nativeMax = Math.max, nativeMin = Math.min, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeSlice = arrayRef.slice;
                var isIeOpera = reNative.test(context.attachEvent), isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);
                var ctorByClass = {};
                ctorByClass[arrayClass] = Array;
                ctorByClass[boolClass] = Boolean;
                ctorByClass[dateClass] = Date;
                ctorByClass[funcClass] = Function;
                ctorByClass[objectClass] = Object;
                ctorByClass[numberClass] = Number;
                ctorByClass[regexpClass] = RegExp;
                ctorByClass[stringClass] = String;
                function lodash(value) {
                    return value && typeof value == "object" && !isArray(value) && hasOwnProperty.call(value, "__wrapped__") ? value : new lodashWrapper(value);
                }
                function lodashWrapper(value) {
                    this.__wrapped__ = value;
                }
                lodashWrapper.prototype = lodash.prototype;
                var support = lodash.support = {};
                support.fastBind = nativeBind && !isV8;
                lodash.templateSettings = {
                    escape: /<%-([\s\S]+?)%>/g,
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: reInterpolate,
                    variable: "",
                    imports: {
                        _: lodash
                    }
                };
                function createBound(func, thisArg, partialArgs, indicator) {
                    var isFunc = isFunction(func), isPartial = !partialArgs, key = thisArg;
                    if (isPartial) {
                        var rightIndicator = indicator;
                        partialArgs = thisArg;
                    } else if (!isFunc) {
                        if (!indicator) {
                            throw new TypeError;
                        }
                        thisArg = func;
                    }
                    function bound() {
                        var args = arguments, thisBinding = isPartial ? this : thisArg;
                        if (!isFunc) {
                            func = thisArg[key];
                        }
                        if (partialArgs.length) {
                            args = args.length ? (args = nativeSlice.call(args), rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args)) : partialArgs;
                        }
                        if (this instanceof bound) {
                            thisBinding = createObject(func.prototype);
                            var result = func.apply(thisBinding, args);
                            return isObject(result) ? result : thisBinding;
                        }
                        return func.apply(thisBinding, args);
                    }
                    return bound;
                }
                function createObject(prototype) {
                    return isObject(prototype) ? nativeCreate(prototype) : {};
                }
                function escapeHtmlChar(match) {
                    return htmlEscapes[match];
                }
                function getIndexOf(array, value, fromIndex) {
                    var result = (result = lodash.indexOf) === indexOf ? basicIndexOf : result;
                    return result;
                }
                function overloadWrapper(func) {
                    return function(array, flag, callback, thisArg) {
                        if (typeof flag != "boolean" && flag != null) {
                            thisArg = callback;
                            callback = !(thisArg && thisArg[flag] === array) ? flag : undefined;
                            flag = false;
                        }
                        if (callback != null) {
                            callback = lodash.createCallback(callback, thisArg);
                        }
                        return func(array, flag, callback, thisArg);
                    };
                }
                function shimIsPlainObject(value) {
                    var ctor, result;
                    if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
                        return false;
                    }
                    forIn(value, function(value, key) {
                        result = key;
                    });
                    return result === undefined || hasOwnProperty.call(value, result);
                }
                function unescapeHtmlChar(match) {
                    return htmlUnescapes[match];
                }
                function isArguments(value) {
                    return toString.call(value) == argsClass;
                }
                var isArray = nativeIsArray;
                var shimKeys = function(object) {
                    var index, iterable = object, result = [];
                    if (!iterable) return result;
                    if (!objectTypes[typeof object]) return result;
                    for (index in iterable) {
                        if (hasOwnProperty.call(iterable, index)) {
                            result.push(index);
                        }
                    }
                    return result;
                };
                var keys = !nativeKeys ? shimKeys : function(object) {
                    if (!isObject(object)) {
                        return [];
                    }
                    return nativeKeys(object);
                };
                var htmlEscapes = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                };
                var htmlUnescapes = invert(htmlEscapes);
                var assign = function(object, source, guard) {
                    var index, iterable = object, result = iterable;
                    if (!iterable) return result;
                    var args = arguments, argsIndex = 0, argsLength = typeof guard == "number" ? 2 : args.length;
                    if (argsLength > 3 && typeof args[argsLength - 2] == "function") {
                        var callback = lodash.createCallback(args[--argsLength - 1], args[argsLength--], 2);
                    } else if (argsLength > 2 && typeof args[argsLength - 1] == "function") {
                        callback = args[--argsLength];
                    }
                    while (++argsIndex < argsLength) {
                        iterable = args[argsIndex];
                        if (iterable && objectTypes[typeof iterable]) {
                            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                            while (++ownIndex < length) {
                                index = ownProps[ownIndex];
                                result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
                            }
                        }
                    }
                    return result;
                };
                function clone(value, deep, callback, thisArg, stackA, stackB) {
                    var result = value;
                    if (typeof deep != "boolean" && deep != null) {
                        thisArg = callback;
                        callback = deep;
                        deep = false;
                    }
                    if (typeof callback == "function") {
                        callback = typeof thisArg == "undefined" ? callback : lodash.createCallback(callback, thisArg, 1);
                        result = callback(result);
                        if (typeof result != "undefined") {
                            return result;
                        }
                        result = value;
                    }
                    var isObj = isObject(result);
                    if (isObj) {
                        var className = toString.call(result);
                        if (!cloneableClasses[className]) {
                            return result;
                        }
                        var isArr = isArray(result);
                    }
                    if (!isObj || !deep) {
                        return isObj ? isArr ? slice(result) : assign({}, result) : result;
                    }
                    var ctor = ctorByClass[className];
                    switch (className) {
                      case boolClass:
                      case dateClass:
                        return new ctor(+result);
                      case numberClass:
                      case stringClass:
                        return new ctor(result);
                      case regexpClass:
                        return ctor(result.source, reFlags.exec(result));
                    }
                    var initedStack = !stackA;
                    stackA || (stackA = getArray());
                    stackB || (stackB = getArray());
                    var length = stackA.length;
                    while (length--) {
                        if (stackA[length] == value) {
                            return stackB[length];
                        }
                    }
                    result = isArr ? ctor(result.length) : {};
                    if (isArr) {
                        if (hasOwnProperty.call(value, "index")) {
                            result.index = value.index;
                        }
                        if (hasOwnProperty.call(value, "input")) {
                            result.input = value.input;
                        }
                    }
                    stackA.push(value);
                    stackB.push(result);
                    (isArr ? forEach : forOwn)(value, function(objValue, key) {
                        result[key] = clone(objValue, deep, callback, undefined, stackA, stackB);
                    });
                    if (initedStack) {
                        releaseArray(stackA);
                        releaseArray(stackB);
                    }
                    return result;
                }
                function cloneDeep(value, callback, thisArg) {
                    return clone(value, true, callback, thisArg);
                }
                var defaults = function(object, source, guard) {
                    var index, iterable = object, result = iterable;
                    if (!iterable) return result;
                    var args = arguments, argsIndex = 0, argsLength = typeof guard == "number" ? 2 : args.length;
                    while (++argsIndex < argsLength) {
                        iterable = args[argsIndex];
                        if (iterable && objectTypes[typeof iterable]) {
                            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                            while (++ownIndex < length) {
                                index = ownProps[ownIndex];
                                if (typeof result[index] == "undefined") result[index] = iterable[index];
                            }
                        }
                    }
                    return result;
                };
                function findKey(object, callback, thisArg) {
                    var result;
                    callback = lodash.createCallback(callback, thisArg);
                    forOwn(object, function(value, key, object) {
                        if (callback(value, key, object)) {
                            result = key;
                            return false;
                        }
                    });
                    return result;
                }
                var forIn = function(collection, callback, thisArg) {
                    var index, iterable = collection, result = iterable;
                    if (!iterable) return result;
                    if (!objectTypes[typeof iterable]) return result;
                    callback = callback && typeof thisArg == "undefined" ? callback : lodash.createCallback(callback, thisArg);
                    for (index in iterable) {
                        if (callback(iterable[index], index, collection) === false) return result;
                    }
                    return result;
                };
                var forOwn = function(collection, callback, thisArg) {
                    var index, iterable = collection, result = iterable;
                    if (!iterable) return result;
                    if (!objectTypes[typeof iterable]) return result;
                    callback = callback && typeof thisArg == "undefined" ? callback : lodash.createCallback(callback, thisArg);
                    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
                    while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        if (callback(iterable[index], index, collection) === false) return result;
                    }
                    return result;
                };
                function functions(object) {
                    var result = [];
                    forIn(object, function(value, key) {
                        if (isFunction(value)) {
                            result.push(key);
                        }
                    });
                    return result.sort();
                }
                function has(object, property) {
                    return object ? hasOwnProperty.call(object, property) : false;
                }
                function invert(object) {
                    var index = -1, props = keys(object), length = props.length, result = {};
                    while (++index < length) {
                        var key = props[index];
                        result[object[key]] = key;
                    }
                    return result;
                }
                function isBoolean(value) {
                    return value === true || value === false || toString.call(value) == boolClass;
                }
                function isDate(value) {
                    return value ? typeof value == "object" && toString.call(value) == dateClass : false;
                }
                function isElement(value) {
                    return value ? value.nodeType === 1 : false;
                }
                function isEmpty(value) {
                    var result = true;
                    if (!value) {
                        return result;
                    }
                    var className = toString.call(value), length = value.length;
                    if (className == arrayClass || className == stringClass || className == argsClass || className == objectClass && typeof length == "number" && isFunction(value.splice)) {
                        return !length;
                    }
                    forOwn(value, function() {
                        return result = false;
                    });
                    return result;
                }
                function isEqual(a, b, callback, thisArg, stackA, stackB) {
                    var whereIndicator = callback === indicatorObject;
                    if (typeof callback == "function" && !whereIndicator) {
                        callback = lodash.createCallback(callback, thisArg, 2);
                        var result = callback(a, b);
                        if (typeof result != "undefined") {
                            return !!result;
                        }
                    }
                    if (a === b) {
                        return a !== 0 || 1 / a == 1 / b;
                    }
                    var type = typeof a, otherType = typeof b;
                    if (a === a && (!a || type != "function" && type != "object") && (!b || otherType != "function" && otherType != "object")) {
                        return false;
                    }
                    if (a == null || b == null) {
                        return a === b;
                    }
                    var className = toString.call(a), otherClass = toString.call(b);
                    if (className == argsClass) {
                        className = objectClass;
                    }
                    if (otherClass == argsClass) {
                        otherClass = objectClass;
                    }
                    if (className != otherClass) {
                        return false;
                    }
                    switch (className) {
                      case boolClass:
                      case dateClass:
                        return +a == +b;
                      case numberClass:
                        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
                      case regexpClass:
                      case stringClass:
                        return a == String(b);
                    }
                    var isArr = className == arrayClass;
                    if (!isArr) {
                        if (hasOwnProperty.call(a, "__wrapped__ ") || hasOwnProperty.call(b, "__wrapped__")) {
                            return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, thisArg, stackA, stackB);
                        }
                        if (className != objectClass) {
                            return false;
                        }
                        var ctorA = a.constructor, ctorB = b.constructor;
                        if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB)) {
                            return false;
                        }
                    }
                    var initedStack = !stackA;
                    stackA || (stackA = getArray());
                    stackB || (stackB = getArray());
                    var length = stackA.length;
                    while (length--) {
                        if (stackA[length] == a) {
                            return stackB[length] == b;
                        }
                    }
                    var size = 0;
                    result = true;
                    stackA.push(a);
                    stackB.push(b);
                    if (isArr) {
                        length = a.length;
                        size = b.length;
                        result = size == a.length;
                        if (!result && !whereIndicator) {
                            return result;
                        }
                        while (size--) {
                            var index = length, value = b[size];
                            if (whereIndicator) {
                                while (index--) {
                                    if (result = isEqual(a[index], value, callback, thisArg, stackA, stackB)) {
                                        break;
                                    }
                                }
                            } else if (!(result = isEqual(a[size], value, callback, thisArg, stackA, stackB))) {
                                break;
                            }
                        }
                        return result;
                    }
                    forIn(b, function(value, key, b) {
                        if (hasOwnProperty.call(b, key)) {
                            size++;
                            return result = hasOwnProperty.call(a, key) && isEqual(a[key], value, callback, thisArg, stackA, stackB);
                        }
                    });
                    if (result && !whereIndicator) {
                        forIn(a, function(value, key, a) {
                            if (hasOwnProperty.call(a, key)) {
                                return result = --size > -1;
                            }
                        });
                    }
                    if (initedStack) {
                        releaseArray(stackA);
                        releaseArray(stackB);
                    }
                    return result;
                }
                function isFinite(value) {
                    return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
                }
                function isFunction(value) {
                    return typeof value == "function";
                }
                function isObject(value) {
                    return !!(value && objectTypes[typeof value]);
                }
                function isNaN(value) {
                    return isNumber(value) && value != +value;
                }
                function isNull(value) {
                    return value === null;
                }
                function isNumber(value) {
                    return typeof value == "number" || toString.call(value) == numberClass;
                }
                var isPlainObject = function(value) {
                    if (!(value && toString.call(value) == objectClass)) {
                        return false;
                    }
                    var valueOf = value.valueOf, objProto = typeof valueOf == "function" && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
                    return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
                };
                function isRegExp(value) {
                    return value ? typeof value == "object" && toString.call(value) == regexpClass : false;
                }
                function isString(value) {
                    return typeof value == "string" || toString.call(value) == stringClass;
                }
                function isUndefined(value) {
                    return typeof value == "undefined";
                }
                function merge(object, source, deepIndicator) {
                    var args = arguments, index = 0, length = 2;
                    if (!isObject(object)) {
                        return object;
                    }
                    if (deepIndicator === indicatorObject) {
                        var callback = args[3], stackA = args[4], stackB = args[5];
                    } else {
                        var initedStack = true;
                        stackA = getArray();
                        stackB = getArray();
                        if (typeof deepIndicator != "number") {
                            length = args.length;
                        }
                        if (length > 3 && typeof args[length - 2] == "function") {
                            callback = lodash.createCallback(args[--length - 1], args[length--], 2);
                        } else if (length > 2 && typeof args[length - 1] == "function") {
                            callback = args[--length];
                        }
                    }
                    while (++index < length) {
                        (isArray(args[index]) ? forEach : forOwn)(args[index], function(source, key) {
                            var found, isArr, result = source, value = object[key];
                            if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
                                var stackLength = stackA.length;
                                while (stackLength--) {
                                    if (found = stackA[stackLength] == source) {
                                        value = stackB[stackLength];
                                        break;
                                    }
                                }
                                if (!found) {
                                    var isShallow;
                                    if (callback) {
                                        result = callback(value, source);
                                        if (isShallow = typeof result != "undefined") {
                                            value = result;
                                        }
                                    }
                                    if (!isShallow) {
                                        value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {};
                                    }
                                    stackA.push(source);
                                    stackB.push(value);
                                    if (!isShallow) {
                                        value = merge(value, source, indicatorObject, callback, stackA, stackB);
                                    }
                                }
                            } else {
                                if (callback) {
                                    result = callback(value, source);
                                    if (typeof result == "undefined") {
                                        result = source;
                                    }
                                }
                                if (typeof result != "undefined") {
                                    value = result;
                                }
                            }
                            object[key] = value;
                        });
                    }
                    if (initedStack) {
                        releaseArray(stackA);
                        releaseArray(stackB);
                    }
                    return object;
                }
                function omit(object, callback, thisArg) {
                    var indexOf = getIndexOf(), isFunc = typeof callback == "function", result = {};
                    if (isFunc) {
                        callback = lodash.createCallback(callback, thisArg);
                    } else {
                        var props = concat.apply(arrayRef, nativeSlice.call(arguments, 1));
                    }
                    forIn(object, function(value, key, object) {
                        if (isFunc ? !callback(value, key, object) : indexOf(props, key) < 0) {
                            result[key] = value;
                        }
                    });
                    return result;
                }
                function pairs(object) {
                    var index = -1, props = keys(object), length = props.length, result = Array(length);
                    while (++index < length) {
                        var key = props[index];
                        result[index] = [ key, object[key] ];
                    }
                    return result;
                }
                function pick(object, callback, thisArg) {
                    var result = {};
                    if (typeof callback != "function") {
                        var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = isObject(object) ? props.length : 0;
                        while (++index < length) {
                            var key = props[index];
                            if (key in object) {
                                result[key] = object[key];
                            }
                        }
                    } else {
                        callback = lodash.createCallback(callback, thisArg);
                        forIn(object, function(value, key, object) {
                            if (callback(value, key, object)) {
                                result[key] = value;
                            }
                        });
                    }
                    return result;
                }
                function transform(object, callback, accumulator, thisArg) {
                    var isArr = isArray(object);
                    callback = lodash.createCallback(callback, thisArg, 4);
                    if (accumulator == null) {
                        if (isArr) {
                            accumulator = [];
                        } else {
                            var ctor = object && object.constructor, proto = ctor && ctor.prototype;
                            accumulator = createObject(proto);
                        }
                    }
                    (isArr ? forEach : forOwn)(object, function(value, index, object) {
                        return callback(accumulator, value, index, object);
                    });
                    return accumulator;
                }
                function values(object) {
                    var index = -1, props = keys(object), length = props.length, result = Array(length);
                    while (++index < length) {
                        result[index] = object[props[index]];
                    }
                    return result;
                }
                function at(collection) {
                    var index = -1, props = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), length = props.length, result = Array(length);
                    while (++index < length) {
                        result[index] = collection[props[index]];
                    }
                    return result;
                }
                function contains(collection, target, fromIndex) {
                    var index = -1, indexOf = getIndexOf(), length = collection ? collection.length : 0, result = false;
                    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
                    if (length && typeof length == "number") {
                        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
                    } else {
                        forOwn(collection, function(value) {
                            if (++index >= fromIndex) {
                                return !(result = value === target);
                            }
                        });
                    }
                    return result;
                }
                function countBy(collection, callback, thisArg) {
                    var result = {};
                    callback = lodash.createCallback(callback, thisArg);
                    forEach(collection, function(value, key, collection) {
                        key = String(callback(value, key, collection));
                        hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1;
                    });
                    return result;
                }
                function every(collection, callback, thisArg) {
                    var result = true;
                    callback = lodash.createCallback(callback, thisArg);
                    var index = -1, length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                        while (++index < length) {
                            if (!(result = !!callback(collection[index], index, collection))) {
                                break;
                            }
                        }
                    } else {
                        forOwn(collection, function(value, index, collection) {
                            return result = !!callback(value, index, collection);
                        });
                    }
                    return result;
                }
                function filter(collection, callback, thisArg) {
                    var result = [];
                    callback = lodash.createCallback(callback, thisArg);
                    var index = -1, length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                        while (++index < length) {
                            var value = collection[index];
                            if (callback(value, index, collection)) {
                                result.push(value);
                            }
                        }
                    } else {
                        forOwn(collection, function(value, index, collection) {
                            if (callback(value, index, collection)) {
                                result.push(value);
                            }
                        });
                    }
                    return result;
                }
                function find(collection, callback, thisArg) {
                    callback = lodash.createCallback(callback, thisArg);
                    var index = -1, length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                        while (++index < length) {
                            var value = collection[index];
                            if (callback(value, index, collection)) {
                                return value;
                            }
                        }
                    } else {
                        var result;
                        forOwn(collection, function(value, index, collection) {
                            if (callback(value, index, collection)) {
                                result = value;
                                return false;
                            }
                        });
                        return result;
                    }
                }
                function forEach(collection, callback, thisArg) {
                    var index = -1, length = collection ? collection.length : 0;
                    callback = callback && typeof thisArg == "undefined" ? callback : lodash.createCallback(callback, thisArg);
                    if (typeof length == "number") {
                        while (++index < length) {
                            if (callback(collection[index], index, collection) === false) {
                                break;
                            }
                        }
                    } else {
                        forOwn(collection, callback);
                    }
                    return collection;
                }
                function groupBy(collection, callback, thisArg) {
                    var result = {};
                    callback = lodash.createCallback(callback, thisArg);
                    forEach(collection, function(value, key, collection) {
                        key = String(callback(value, key, collection));
                        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
                    });
                    return result;
                }
                function invoke(collection, methodName) {
                    var args = nativeSlice.call(arguments, 2), index = -1, isFunc = typeof methodName == "function", length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
                    forEach(collection, function(value) {
                        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
                    });
                    return result;
                }
                function map(collection, callback, thisArg) {
                    var index = -1, length = collection ? collection.length : 0;
                    callback = lodash.createCallback(callback, thisArg);
                    if (typeof length == "number") {
                        var result = Array(length);
                        while (++index < length) {
                            result[index] = callback(collection[index], index, collection);
                        }
                    } else {
                        result = [];
                        forOwn(collection, function(value, key, collection) {
                            result[++index] = callback(value, key, collection);
                        });
                    }
                    return result;
                }
                function max(collection, callback, thisArg) {
                    var computed = -Infinity, result = computed;
                    if (!callback && isArray(collection)) {
                        var index = -1, length = collection.length;
                        while (++index < length) {
                            var value = collection[index];
                            if (value > result) {
                                result = value;
                            }
                        }
                    } else {
                        callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg);
                        forEach(collection, function(value, index, collection) {
                            var current = callback(value, index, collection);
                            if (current > computed) {
                                computed = current;
                                result = value;
                            }
                        });
                    }
                    return result;
                }
                function min(collection, callback, thisArg) {
                    var computed = Infinity, result = computed;
                    if (!callback && isArray(collection)) {
                        var index = -1, length = collection.length;
                        while (++index < length) {
                            var value = collection[index];
                            if (value < result) {
                                result = value;
                            }
                        }
                    } else {
                        callback = !callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg);
                        forEach(collection, function(value, index, collection) {
                            var current = callback(value, index, collection);
                            if (current < computed) {
                                computed = current;
                                result = value;
                            }
                        });
                    }
                    return result;
                }
                function pluck(collection, property) {
                    var index = -1, length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                        var result = Array(length);
                        while (++index < length) {
                            result[index] = collection[index][property];
                        }
                    }
                    return result || map(collection, property);
                }
                function reduce(collection, callback, accumulator, thisArg) {
                    if (!collection) return accumulator;
                    var noaccum = arguments.length < 3;
                    callback = lodash.createCallback(callback, thisArg, 4);
                    var index = -1, length = collection.length;
                    if (typeof length == "number") {
                        if (noaccum) {
                            accumulator = collection[++index];
                        }
                        while (++index < length) {
                            accumulator = callback(accumulator, collection[index], index, collection);
                        }
                    } else {
                        forOwn(collection, function(value, index, collection) {
                            accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
                        });
                    }
                    return accumulator;
                }
                function reduceRight(collection, callback, accumulator, thisArg) {
                    var iterable = collection, length = collection ? collection.length : 0, noaccum = arguments.length < 3;
                    if (typeof length != "number") {
                        var props = keys(collection);
                        length = props.length;
                    }
                    callback = lodash.createCallback(callback, thisArg, 4);
                    forEach(collection, function(value, index, collection) {
                        index = props ? props[--length] : --length;
                        accumulator = noaccum ? (noaccum = false, iterable[index]) : callback(accumulator, iterable[index], index, collection);
                    });
                    return accumulator;
                }
                function reject(collection, callback, thisArg) {
                    callback = lodash.createCallback(callback, thisArg);
                    return filter(collection, function(value, index, collection) {
                        return !callback(value, index, collection);
                    });
                }
                function shuffle(collection) {
                    var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
                    forEach(collection, function(value) {
                        var rand = floor(nativeRandom() * (++index + 1));
                        result[index] = result[rand];
                        result[rand] = value;
                    });
                    return result;
                }
                function size(collection) {
                    var length = collection ? collection.length : 0;
                    return typeof length == "number" ? length : keys(collection).length;
                }
                function some(collection, callback, thisArg) {
                    var result;
                    callback = lodash.createCallback(callback, thisArg);
                    var index = -1, length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                        while (++index < length) {
                            if (result = callback(collection[index], index, collection)) {
                                break;
                            }
                        }
                    } else {
                        forOwn(collection, function(value, index, collection) {
                            return !(result = callback(value, index, collection));
                        });
                    }
                    return !!result;
                }
                function sortBy(collection, callback, thisArg) {
                    var index = -1, length = collection ? collection.length : 0, result = Array(typeof length == "number" ? length : 0);
                    callback = lodash.createCallback(callback, thisArg);
                    forEach(collection, function(value, key, collection) {
                        var object = result[++index] = getObject();
                        object.criteria = callback(value, key, collection);
                        object.index = index;
                        object.value = value;
                    });
                    length = result.length;
                    result.sort(compareAscending);
                    while (length--) {
                        var object = result[length];
                        result[length] = object.value;
                        releaseObject(object);
                    }
                    return result;
                }
                function toArray(collection) {
                    if (collection && typeof collection.length == "number") {
                        return slice(collection);
                    }
                    return values(collection);
                }
                var where = filter;
                function compact(array) {
                    var index = -1, length = array ? array.length : 0, result = [];
                    while (++index < length) {
                        var value = array[index];
                        if (value) {
                            result.push(value);
                        }
                    }
                    return result;
                }
                function difference(array) {
                    var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, seen = concat.apply(arrayRef, nativeSlice.call(arguments, 1)), result = [];
                    var isLarge = length >= largeArraySize && indexOf === basicIndexOf;
                    if (isLarge) {
                        var cache = createCache(seen);
                        if (cache) {
                            indexOf = cacheIndexOf;
                            seen = cache;
                        } else {
                            isLarge = false;
                        }
                    }
                    while (++index < length) {
                        var value = array[index];
                        if (indexOf(seen, value) < 0) {
                            result.push(value);
                        }
                    }
                    if (isLarge) {
                        releaseObject(seen);
                    }
                    return result;
                }
                function findIndex(array, callback, thisArg) {
                    var index = -1, length = array ? array.length : 0;
                    callback = lodash.createCallback(callback, thisArg);
                    while (++index < length) {
                        if (callback(array[index], index, array)) {
                            return index;
                        }
                    }
                    return -1;
                }
                function first(array, callback, thisArg) {
                    if (array) {
                        var n = 0, length = array.length;
                        if (typeof callback != "number" && callback != null) {
                            var index = -1;
                            callback = lodash.createCallback(callback, thisArg);
                            while (++index < length && callback(array[index], index, array)) {
                                n++;
                            }
                        } else {
                            n = callback;
                            if (n == null || thisArg) {
                                return array[0];
                            }
                        }
                        return slice(array, 0, nativeMin(nativeMax(0, n), length));
                    }
                }
                var flatten = overloadWrapper(function flatten(array, isShallow, callback) {
                    var index = -1, length = array ? array.length : 0, result = [];
                    while (++index < length) {
                        var value = array[index];
                        if (callback) {
                            value = callback(value, index, array);
                        }
                        if (isArray(value)) {
                            push.apply(result, isShallow ? value : flatten(value));
                        } else {
                            result.push(value);
                        }
                    }
                    return result;
                });
                function indexOf(array, value, fromIndex) {
                    if (typeof fromIndex == "number") {
                        var length = array ? array.length : 0;
                        fromIndex = fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0;
                    } else if (fromIndex) {
                        var index = sortedIndex(array, value);
                        return array[index] === value ? index : -1;
                    }
                    return array ? basicIndexOf(array, value, fromIndex) : -1;
                }
                function initial(array, callback, thisArg) {
                    if (!array) {
                        return [];
                    }
                    var n = 0, length = array.length;
                    if (typeof callback != "number" && callback != null) {
                        var index = length;
                        callback = lodash.createCallback(callback, thisArg);
                        while (index-- && callback(array[index], index, array)) {
                            n++;
                        }
                    } else {
                        n = callback == null || thisArg ? 1 : callback || n;
                    }
                    return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
                }
                function intersection(array) {
                    var args = arguments, argsLength = args.length, argsIndex = -1, caches = getArray(), index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [], seen = getArray();
                    while (++argsIndex < argsLength) {
                        var value = args[argsIndex];
                        caches[argsIndex] = indexOf === basicIndexOf && (value ? value.length : 0) >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen);
                    }
                    outer : while (++index < length) {
                        var cache = caches[0];
                        value = array[index];
                        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
                            argsIndex = argsLength;
                            (cache || seen).push(value);
                            while (--argsIndex) {
                                cache = caches[argsIndex];
                                if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                                    continue outer;
                                }
                            }
                            result.push(value);
                        }
                    }
                    while (argsLength--) {
                        cache = caches[argsLength];
                        if (cache) {
                            releaseObject(cache);
                        }
                    }
                    releaseArray(caches);
                    releaseArray(seen);
                    return result;
                }
                function last(array, callback, thisArg) {
                    if (array) {
                        var n = 0, length = array.length;
                        if (typeof callback != "number" && callback != null) {
                            var index = length;
                            callback = lodash.createCallback(callback, thisArg);
                            while (index-- && callback(array[index], index, array)) {
                                n++;
                            }
                        } else {
                            n = callback;
                            if (n == null || thisArg) {
                                return array[length - 1];
                            }
                        }
                        return slice(array, nativeMax(0, length - n));
                    }
                }
                function lastIndexOf(array, value, fromIndex) {
                    var index = array ? array.length : 0;
                    if (typeof fromIndex == "number") {
                        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
                    }
                    while (index--) {
                        if (array[index] === value) {
                            return index;
                        }
                    }
                    return -1;
                }
                function range(start, end, step) {
                    start = +start || 0;
                    step = +step || 1;
                    if (end == null) {
                        end = start;
                        start = 0;
                    }
                    var index = -1, length = nativeMax(0, ceil((end - start) / step)), result = Array(length);
                    while (++index < length) {
                        result[index] = start;
                        start += step;
                    }
                    return result;
                }
                function rest(array, callback, thisArg) {
                    if (typeof callback != "number" && callback != null) {
                        var n = 0, index = -1, length = array ? array.length : 0;
                        callback = lodash.createCallback(callback, thisArg);
                        while (++index < length && callback(array[index], index, array)) {
                            n++;
                        }
                    } else {
                        n = callback == null || thisArg ? 1 : nativeMax(0, callback);
                    }
                    return slice(array, n);
                }
                function sortedIndex(array, value, callback, thisArg) {
                    var low = 0, high = array ? array.length : low;
                    callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
                    value = callback(value);
                    while (low < high) {
                        var mid = low + high >>> 1;
                        callback(array[mid]) < value ? low = mid + 1 : high = mid;
                    }
                    return low;
                }
                function union(array) {
                    if (!isArray(array)) {
                        arguments[0] = array ? nativeSlice.call(array) : arrayRef;
                    }
                    return uniq(concat.apply(arrayRef, arguments));
                }
                var uniq = overloadWrapper(function(array, isSorted, callback) {
                    var index = -1, indexOf = getIndexOf(), length = array ? array.length : 0, result = [];
                    var isLarge = !isSorted && length >= largeArraySize && indexOf === basicIndexOf, seen = callback || isLarge ? getArray() : result;
                    if (isLarge) {
                        var cache = createCache(seen);
                        if (cache) {
                            indexOf = cacheIndexOf;
                            seen = cache;
                        } else {
                            isLarge = false;
                            seen = callback ? seen : (releaseArray(seen), result);
                        }
                    }
                    while (++index < length) {
                        var value = array[index], computed = callback ? callback(value, index, array) : value;
                        if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
                            if (callback || isLarge) {
                                seen.push(computed);
                            }
                            result.push(value);
                        }
                    }
                    if (isLarge) {
                        releaseArray(seen.array);
                        releaseObject(seen);
                    } else if (callback) {
                        releaseArray(seen);
                    }
                    return result;
                });
                function unzip(array) {
                    var index = -1, length = array ? max(pluck(array, "length")) : 0, result = Array(length < 0 ? 0 : length);
                    while (++index < length) {
                        result[index] = pluck(array, index);
                    }
                    return result;
                }
                function without(array) {
                    return difference(array, nativeSlice.call(arguments, 1));
                }
                function zip(array) {
                    return array ? unzip(arguments) : [];
                }
                function zipObject(keys, values) {
                    var index = -1, length = keys ? keys.length : 0, result = {};
                    while (++index < length) {
                        var key = keys[index];
                        if (values) {
                            result[key] = values[index];
                        } else {
                            result[key[0]] = key[1];
                        }
                    }
                    return result;
                }
                function after(n, func) {
                    if (n < 1) {
                        return func();
                    }
                    return function() {
                        if (--n < 1) {
                            return func.apply(this, arguments);
                        }
                    };
                }
                function bind(func, thisArg) {
                    return support.fastBind || nativeBind && arguments.length > 2 ? nativeBind.call.apply(nativeBind, arguments) : createBound(func, thisArg, nativeSlice.call(arguments, 2));
                }
                function bindAll(object) {
                    var funcs = arguments.length > 1 ? concat.apply(arrayRef, nativeSlice.call(arguments, 1)) : functions(object), index = -1, length = funcs.length;
                    while (++index < length) {
                        var key = funcs[index];
                        object[key] = bind(object[key], object);
                    }
                    return object;
                }
                function bindKey(object, key) {
                    return createBound(object, key, nativeSlice.call(arguments, 2), indicatorObject);
                }
                function compose() {
                    var funcs = arguments;
                    return function() {
                        var args = arguments, length = funcs.length;
                        while (length--) {
                            args = [ funcs[length].apply(this, args) ];
                        }
                        return args[0];
                    };
                }
                function createCallback(func, thisArg, argCount) {
                    if (func == null) {
                        return identity;
                    }
                    var type = typeof func;
                    if (type != "function") {
                        if (type != "object") {
                            return function(object) {
                                return object[func];
                            };
                        }
                        var props = keys(func);
                        return function(object) {
                            var length = props.length, result = false;
                            while (length--) {
                                if (!(result = isEqual(object[props[length]], func[props[length]], indicatorObject))) {
                                    break;
                                }
                            }
                            return result;
                        };
                    }
                    if (typeof thisArg == "undefined" || reThis && !reThis.test(fnToString.call(func))) {
                        return func;
                    }
                    if (argCount === 1) {
                        return function(value) {
                            return func.call(thisArg, value);
                        };
                    }
                    if (argCount === 2) {
                        return function(a, b) {
                            return func.call(thisArg, a, b);
                        };
                    }
                    if (argCount === 4) {
                        return function(accumulator, value, index, collection) {
                            return func.call(thisArg, accumulator, value, index, collection);
                        };
                    }
                    return function(value, index, collection) {
                        return func.call(thisArg, value, index, collection);
                    };
                }
                function debounce(func, wait, options) {
                    var args, result, thisArg, callCount = 0, lastCalled = 0, maxWait = false, maxTimeoutId = null, timeoutId = null, trailing = true;
                    function clear() {
                        clearTimeout(maxTimeoutId);
                        clearTimeout(timeoutId);
                        callCount = 0;
                        maxTimeoutId = timeoutId = null;
                    }
                    function delayed() {
                        var isCalled = trailing && (!leading || callCount > 1);
                        clear();
                        if (isCalled) {
                            if (maxWait !== false) {
                                lastCalled = new Date;
                            }
                            result = func.apply(thisArg, args);
                        }
                    }
                    function maxDelayed() {
                        clear();
                        if (trailing || maxWait !== wait) {
                            lastCalled = new Date;
                            result = func.apply(thisArg, args);
                        }
                    }
                    wait = nativeMax(0, wait || 0);
                    if (options === true) {
                        var leading = true;
                        trailing = false;
                    } else if (isObject(options)) {
                        leading = options.leading;
                        maxWait = "maxWait" in options && nativeMax(wait, options.maxWait || 0);
                        trailing = "trailing" in options ? options.trailing : trailing;
                    }
                    return function() {
                        args = arguments;
                        thisArg = this;
                        callCount++;
                        clearTimeout(timeoutId);
                        if (maxWait === false) {
                            if (leading && callCount < 2) {
                                result = func.apply(thisArg, args);
                            }
                        } else {
                            var now = new Date;
                            if (!maxTimeoutId && !leading) {
                                lastCalled = now;
                            }
                            var remaining = maxWait - (now - lastCalled);
                            if (remaining <= 0) {
                                clearTimeout(maxTimeoutId);
                                maxTimeoutId = null;
                                lastCalled = now;
                                result = func.apply(thisArg, args);
                            } else if (!maxTimeoutId) {
                                maxTimeoutId = setTimeout(maxDelayed, remaining);
                            }
                        }
                        if (wait !== maxWait) {
                            timeoutId = setTimeout(delayed, wait);
                        }
                        return result;
                    };
                }
                function defer(func) {
                    var args = nativeSlice.call(arguments, 1);
                    return setTimeout(function() {
                        func.apply(undefined, args);
                    }, 1);
                }
                if (isV8 && freeModule && typeof setImmediate == "function") {
                    defer = bind(setImmediate, context);
                }
                function delay(func, wait) {
                    var args = nativeSlice.call(arguments, 2);
                    return setTimeout(function() {
                        func.apply(undefined, args);
                    }, wait);
                }
                function memoize(func, resolver) {
                    function memoized() {
                        var cache = memoized.cache, key = keyPrefix + (resolver ? resolver.apply(this, arguments) : arguments[0]);
                        return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments);
                    }
                    memoized.cache = {};
                    return memoized;
                }
                function once(func) {
                    var ran, result;
                    return function() {
                        if (ran) {
                            return result;
                        }
                        ran = true;
                        result = func.apply(this, arguments);
                        func = null;
                        return result;
                    };
                }
                function partial(func) {
                    return createBound(func, nativeSlice.call(arguments, 1));
                }
                function partialRight(func) {
                    return createBound(func, nativeSlice.call(arguments, 1), null, indicatorObject);
                }
                function throttle(func, wait, options) {
                    var leading = true, trailing = true;
                    if (options === false) {
                        leading = false;
                    } else if (isObject(options)) {
                        leading = "leading" in options ? options.leading : leading;
                        trailing = "trailing" in options ? options.trailing : trailing;
                    }
                    options = getObject();
                    options.leading = leading;
                    options.maxWait = wait;
                    options.trailing = trailing;
                    var result = debounce(func, wait, options);
                    releaseObject(options);
                    return result;
                }
                function wrap(value, wrapper) {
                    return function() {
                        var args = [ value ];
                        push.apply(args, arguments);
                        return wrapper.apply(this, args);
                    };
                }
                function escape(string) {
                    return string == null ? "" : String(string).replace(reUnescapedHtml, escapeHtmlChar);
                }
                function identity(value) {
                    return value;
                }
                function mixin(object) {
                    forEach(functions(object), function(methodName) {
                        var func = lodash[methodName] = object[methodName];
                        lodash.prototype[methodName] = function() {
                            var value = this.__wrapped__, args = [ value ];
                            push.apply(args, arguments);
                            var result = func.apply(lodash, args);
                            return value && typeof value == "object" && value === result ? this : new lodashWrapper(result);
                        };
                    });
                }
                function noConflict() {
                    context._ = oldDash;
                    return this;
                }
                var parseInt = nativeParseInt(whitespace + "08") == 8 ? nativeParseInt : function(value, radix) {
                    return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, "") : value, radix || 0);
                };
                function random(min, max) {
                    if (min == null && max == null) {
                        max = 1;
                    }
                    min = +min || 0;
                    if (max == null) {
                        max = min;
                        min = 0;
                    } else {
                        max = +max || 0;
                    }
                    var rand = nativeRandom();
                    return min % 1 || max % 1 ? min + nativeMin(rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max) : min + floor(rand * (max - min + 1));
                }
                function result(object, property) {
                    var value = object ? object[property] : undefined;
                    return isFunction(value) ? object[property]() : value;
                }
                function template(text, data, options) {
                    var settings = lodash.templateSettings;
                    text || (text = "");
                    options = defaults({}, options, settings);
                    var imports = defaults({}, options.imports, settings.imports), importsKeys = keys(imports), importsValues = values(imports);
                    var isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
                    var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
                    text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                        interpolateValue || (interpolateValue = esTemplateValue);
                        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                        if (escapeValue) {
                            source += "' +\n__e(" + escapeValue + ") +\n'";
                        }
                        if (evaluateValue) {
                            isEvaluating = true;
                            source += "';\n" + evaluateValue + ";\n__p += '";
                        }
                        if (interpolateValue) {
                            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
                        }
                        index = offset + match.length;
                        return match;
                    });
                    source += "';\n";
                    var variable = options.variable, hasVariable = variable;
                    if (!hasVariable) {
                        variable = "obj";
                        source = "with (" + variable + ") {\n" + source + "\n}\n";
                    }
                    source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
                    source = "function(" + variable + ") {\n" + (hasVariable ? "" : variable + " || (" + variable + " = {});\n") + "var __t, __p = '', __e = _.escape" + (isEvaluating ? ", __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                    var sourceURL = "\n/*\n//@ sourceURL=" + (options.sourceURL || "/lodash/template/source[" + templateCounter++ + "]") + "\n*/";
                    try {
                        var result = Function(importsKeys, "return " + source + sourceURL).apply(undefined, importsValues);
                    } catch (e) {
                        e.source = source;
                        throw e;
                    }
                    if (data) {
                        return result(data);
                    }
                    result.source = source;
                    return result;
                }
                function times(n, callback, thisArg) {
                    n = (n = +n) > -1 ? n : 0;
                    var index = -1, result = Array(n);
                    callback = lodash.createCallback(callback, thisArg, 1);
                    while (++index < n) {
                        result[index] = callback(index);
                    }
                    return result;
                }
                function unescape(string) {
                    return string == null ? "" : String(string).replace(reEscapedHtml, unescapeHtmlChar);
                }
                function uniqueId(prefix) {
                    var id = ++idCounter;
                    return String(prefix == null ? "" : prefix) + id;
                }
                function tap(value, interceptor) {
                    interceptor(value);
                    return value;
                }
                function wrapperToString() {
                    return String(this.__wrapped__);
                }
                function wrapperValueOf() {
                    return this.__wrapped__;
                }
                lodash.after = after;
                lodash.assign = assign;
                lodash.at = at;
                lodash.bind = bind;
                lodash.bindAll = bindAll;
                lodash.bindKey = bindKey;
                lodash.compact = compact;
                lodash.compose = compose;
                lodash.countBy = countBy;
                lodash.createCallback = createCallback;
                lodash.debounce = debounce;
                lodash.defaults = defaults;
                lodash.defer = defer;
                lodash.delay = delay;
                lodash.difference = difference;
                lodash.filter = filter;
                lodash.flatten = flatten;
                lodash.forEach = forEach;
                lodash.forIn = forIn;
                lodash.forOwn = forOwn;
                lodash.functions = functions;
                lodash.groupBy = groupBy;
                lodash.initial = initial;
                lodash.intersection = intersection;
                lodash.invert = invert;
                lodash.invoke = invoke;
                lodash.keys = keys;
                lodash.map = map;
                lodash.max = max;
                lodash.memoize = memoize;
                lodash.merge = merge;
                lodash.min = min;
                lodash.omit = omit;
                lodash.once = once;
                lodash.pairs = pairs;
                lodash.partial = partial;
                lodash.partialRight = partialRight;
                lodash.pick = pick;
                lodash.pluck = pluck;
                lodash.range = range;
                lodash.reject = reject;
                lodash.rest = rest;
                lodash.shuffle = shuffle;
                lodash.sortBy = sortBy;
                lodash.tap = tap;
                lodash.throttle = throttle;
                lodash.times = times;
                lodash.toArray = toArray;
                lodash.transform = transform;
                lodash.union = union;
                lodash.uniq = uniq;
                lodash.unzip = unzip;
                lodash.values = values;
                lodash.where = where;
                lodash.without = without;
                lodash.wrap = wrap;
                lodash.zip = zip;
                lodash.zipObject = zipObject;
                lodash.collect = map;
                lodash.drop = rest;
                lodash.each = forEach;
                lodash.extend = assign;
                lodash.methods = functions;
                lodash.object = zipObject;
                lodash.select = filter;
                lodash.tail = rest;
                lodash.unique = uniq;
                mixin(lodash);
                lodash.chain = lodash;
                lodash.prototype.chain = function() {
                    return this;
                };
                lodash.clone = clone;
                lodash.cloneDeep = cloneDeep;
                lodash.contains = contains;
                lodash.escape = escape;
                lodash.every = every;
                lodash.find = find;
                lodash.findIndex = findIndex;
                lodash.findKey = findKey;
                lodash.has = has;
                lodash.identity = identity;
                lodash.indexOf = indexOf;
                lodash.isArguments = isArguments;
                lodash.isArray = isArray;
                lodash.isBoolean = isBoolean;
                lodash.isDate = isDate;
                lodash.isElement = isElement;
                lodash.isEmpty = isEmpty;
                lodash.isEqual = isEqual;
                lodash.isFinite = isFinite;
                lodash.isFunction = isFunction;
                lodash.isNaN = isNaN;
                lodash.isNull = isNull;
                lodash.isNumber = isNumber;
                lodash.isObject = isObject;
                lodash.isPlainObject = isPlainObject;
                lodash.isRegExp = isRegExp;
                lodash.isString = isString;
                lodash.isUndefined = isUndefined;
                lodash.lastIndexOf = lastIndexOf;
                lodash.mixin = mixin;
                lodash.noConflict = noConflict;
                lodash.parseInt = parseInt;
                lodash.random = random;
                lodash.reduce = reduce;
                lodash.reduceRight = reduceRight;
                lodash.result = result;
                lodash.runInContext = runInContext;
                lodash.size = size;
                lodash.some = some;
                lodash.sortedIndex = sortedIndex;
                lodash.template = template;
                lodash.unescape = unescape;
                lodash.uniqueId = uniqueId;
                lodash.all = every;
                lodash.any = some;
                lodash.detect = find;
                lodash.findWhere = find;
                lodash.foldl = reduce;
                lodash.foldr = reduceRight;
                lodash.include = contains;
                lodash.inject = reduce;
                forOwn(lodash, function(func, methodName) {
                    if (!lodash.prototype[methodName]) {
                        lodash.prototype[methodName] = function() {
                            var args = [ this.__wrapped__ ];
                            push.apply(args, arguments);
                            return func.apply(lodash, args);
                        };
                    }
                });
                lodash.first = first;
                lodash.last = last;
                lodash.take = first;
                lodash.head = first;
                forOwn(lodash, function(func, methodName) {
                    if (!lodash.prototype[methodName]) {
                        lodash.prototype[methodName] = function(callback, thisArg) {
                            var result = func(this.__wrapped__, callback, thisArg);
                            return callback == null || thisArg && typeof callback != "function" ? result : new lodashWrapper(result);
                        };
                    }
                });
                lodash.VERSION = "1.3.1";
                lodash.prototype.toString = wrapperToString;
                lodash.prototype.value = wrapperValueOf;
                lodash.prototype.valueOf = wrapperValueOf;
                forEach([ "join", "pop", "shift" ], function(methodName) {
                    var func = arrayRef[methodName];
                    lodash.prototype[methodName] = function() {
                        return func.apply(this.__wrapped__, arguments);
                    };
                });
                forEach([ "push", "reverse", "sort", "unshift" ], function(methodName) {
                    var func = arrayRef[methodName];
                    lodash.prototype[methodName] = function() {
                        func.apply(this.__wrapped__, arguments);
                        return this;
                    };
                });
                forEach([ "concat", "slice", "splice" ], function(methodName) {
                    var func = arrayRef[methodName];
                    lodash.prototype[methodName] = function() {
                        return new lodashWrapper(func.apply(this.__wrapped__, arguments));
                    };
                });
                return lodash;
            }
            var _ = runInContext();
            if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
                window._ = _;
                define(function() {
                    return _;
                });
            } else if (freeExports && !freeExports.nodeType) {
                if (freeModule) {
                    (freeModule.exports = _)._ = _;
                } else {
                    freeExports._ = _;
                }
            } else {
                window._ = _;
            }
        })(this);
    },
    "3": function(require, module, exports, global) {
        "use strict";
        var constructors = boxspring.constructors = {};
        var has = _.has;
        boxspring.define = function(name, prototype) {
            var sprototype = null;
            var sconstruct = prototype.inherits || boxspring.Object;
            if (sconstruct) {
                sprototype = sconstruct.prototype;
            }
            var constructor = has(prototype, "constructor") ? prototype.constructor : sconstruct ? function() {
                return sconstruct.apply(this, arguments);
            } : function() {};
            constructors[name] = constructor;
            if (sconstruct) {
                constructor.prototype = Object.create(sprototype);
                constructor.prototype.constructor = constructor;
                constructor.parent = sprototype;
            }
            constructor.prototype.$kind = name;
            boxspring.set(global, name, constructor);
            return boxspring.implement(name, prototype);
        };
        boxspring.get = function(object, key) {};
        boxspring.set = function(object, key, val) {
            return assign(key, val, object || global);
        };
        var assign = function(key, val, obj) {
            if (!obj) obj = global;
            var nodes = _.isArray(key) ? key : key.split(".");
            if (nodes.length === 1) {
                obj[key] = val;
                return;
            }
            var node = nodes.shift();
            assign(nodes, val, obj[node] || (obj[node] = {}));
        };
    },
    "4": function(require, module, exports, global) {
        "use strict";
        var each = _.each;
        boxspring.extend = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            each(object, function(val, key) {
                if (key === "constructor" || key === "prototype" || key === "parent") return this;
                constructor[key] = val;
            });
            return constructor;
        };
    },
    "5": function(require, module, exports, global) {
        "use strict";
        var each = _.each;
        boxspring.implement = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var prototype = constructor.prototype;
            each(object, function(val, key) {
                if (key === "statics") {
                    boxspring.extend(name, val);
                    return;
                }
                if (key === "properties") {
                    boxspring.properties(name, val);
                    return;
                }
                if (key === "constructor" || key === "prototype" || key === "inherits") return this;
                var descriptor = Object.getOwnPropertyDescriptor(prototype, key);
                if (descriptor) {
                    Object.defineProperty(prototype, key, descriptor);
                } else {
                    prototype[key] = val;
                }
            });
            return constructor;
        };
    },
    "6": function(require, module, exports, global) {
        "use strict";
        var has = _.has;
        var forOwn = _.each;
        boxspring.override = function(name, prototype) {
            var inherits = boxspring.constructors[name];
            if (inherits == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var sconstruct = inherits;
            var sprototype = inherits.prototype;
            var constructor = has(prototype, "constructor") ? prototype.constructor : sconstruct ? function() {
                return sconstruct.apply(this, arguments);
            } : function() {};
            boxspring.constructors[name] = constructor;
            if (sconstruct) {
                constructor.prototype = Object.create(sprototype);
                constructor.prototype.constructor = constructor;
                constructor.parent = sprototype;
            }
            constructor.prototype.$kind = name;
            forOwn(sconstruct, function(val, key) {
                if (key !== "prototype" && key !== "constructor" && key !== "parent" && key !== "$properties") {
                    constructor[key] = val;
                }
            });
            boxspring.set(global, name, constructor);
            return boxspring.implement(name, prototype);
        };
    },
    "7": function(require, module, exports, global) {
        "use strict";
        var has = _.has;
        var each = _.each;
        var copy = _.clone;
        var isEmpty = _.isEmpty;
        var isArray = _.isArray;
        var isObject = _.isObject;
        var isFunction = _.isFunction;
        boxspring.properties = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var parent = constructor.parent;
            var prototype = constructor.prototype;
            var properties = parent ? parent.constructor.$properties : null;
            each(object, function(val, key) {
                var name = "__" + key;
                var value = has(val, "value") ? val.value : has(properties, "value") ? properties.value : null;
                var write = has(val, "write") ? val.write : has(properties, "write") ? properties.write : true;
                var clone = has(val, "clone") ? val.clone : has(properties, "clone") ? properties.clone : false;
                var check = has(val, "check") ? val.check : has(properties, "check") ? properties.check : function(value) {
                    return value;
                };
                var setup = function() {
                    if (has(this, name)) return;
                    if (value) switch (true) {
                      case isFunction(value):
                        this[name] = value.call(this);
                        return;
                      case isArray(value):
                      case isObject(value):
                        this[name] = copy(value);
                        return;
                    }
                    this[name] = value;
                };
                if (constructor.$properties == null) {
                    constructor.$properties = {};
                }
                constructor.$properties[key] = {
                    setup: setup,
                    value: value,
                    write: write,
                    clone: clone,
                    check: check
                };
                Object.defineProperty(prototype, key, {
                    get: function() {
                        setup.call(this);
                        return clone ? copy(this[name]) : this[name];
                    },
                    set: function(value) {
                        if (write === "once") {
                            if (this[name + "$set"] === undefined) {
                                this[name + "$set"] = true;
                            } else {
                                throw new Error("Property " + key + " can only be written once");
                            }
                        } else if (!write) {
                            throw new Error("Property " + key + " is read only");
                        }
                        setup.call(this);
                        var oldValue = this[name];
                        var newValue = check.call(this, value, oldValue);
                        if (newValue === undefined) newValue = value;
                        if (newValue === oldValue) return;
                        this[name] = newValue;
                        if (this.notifyPropertyChangeListeners) {
                            this.notifyPropertyChangeListeners(key, newValue, oldValue);
                        }
                    }
                });
            });
            return constructor;
        };
        var inherit = function(key, object, parent, def) {
            if (object && key in object) return object[key];
            if (parent && key in parent) return parent[key];
            return def;
        };
    },
    "8": function(require, module, exports, global) {
        "use strict";
        var Event = null;
        var forIn = _.forIn;
        var UID = 0;
        var O = boxspring.define("boxspring.Object", {
            inherits: null,
            statics: {
                forPath: function(object, path, callback, context) {
                    var head = [];
                    var tail = expand(path);
                    var owner = object;
                    var value = null;
                    while (tail.length) {
                        var name = tail.shift();
                        owns(owner, name) || error("Error parsing property path " + path + " for key " + name);
                        value = owner[name];
                        var h = head.join(".");
                        var t = tail.join(".");
                        callback.call(context, owner, value, name, h, t);
                        owner = owner[name];
                        head.push(name);
                    }
                    return object;
                },
                set: function(object, path, value) {
                    O.forPath(object, path, function(owner, item, name, head, tail) {
                        if (tail === "") owner[name] = value;
                    });
                    return object;
                },
                get: function(object, path) {
                    var value = null;
                    O.forPath(object, path, function(owner, item, name, head, tail) {
                        if (tail === "") value = owner[name];
                    });
                    return value;
                }
            },
            properties: {
                UID: {
                    write: false,
                    value: function() {
                        return UID++;
                    }
                },
                kind: {
                    write: false,
                    value: function() {
                        return this.$kind;
                    }
                }
            },
            constructor: function() {
                if (Event === null) {
                    Event = boxspring.event.Event;
                }
                this.__bound = {};
                this.__propertyListeners = {};
                this.__propertyObservers = {};
                var constructor = this.constructor;
                while (constructor) {
                    var properties = constructor.$properties;
                    if (properties) {
                        for (var key in properties) {
                            properties[key].setup.call(this);
                        }
                    }
                    var parent = constructor.parent;
                    if (parent == null) {
                        break;
                    }
                    constructor = parent.constructor;
                }
                return this;
            },
            destroy: function() {
                this.__bound = null;
                this.__propertyListeners = null;
                this.__propertyObservers = null;
                return this;
            },
            set: function(path, value) {
                return O.set(this, path, value);
            },
            get: function(path) {
                return O.get(this, path);
            },
            addPropertyChangeListener: function(property, listener) {
                var listeners = this.__propertyListeners[property];
                if (listeners === undefined) {
                    listeners = this.__propertyListeners[property] = [];
                }
                var index = listeners.indexOf(listener);
                if (index > -1) {
                    return this;
                }
                if (listeners.length === 0) addPropertyChangeObserver(this, this, property);
                listeners.push(listener);
                return this;
            },
            hasPropertyChangeListener: function(property, callback) {
                var listeners = this.__propertyListeners[property];
                if (listeners === undefined) return false;
                return listeners.indexOf(callback) > -1;
            },
            removePropertyChangeListener: function(property, listener) {
                var listeners = this.__propertyListeners[property];
                if (listeners === undefined) return this;
                var index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
                if (listeners.length === 0) remPropertyChangeObserver(this, this, property);
                return this;
            },
            removePropertyChangeListeners: function(property) {
                var listeners = this.__propertyListeners[property];
                if (listeners === undefined) return this;
                delete this.__propertyListeners[property];
                remPropertyChangeObserver(this, this, property);
                return this;
            },
            notifyPropertyChangeListeners: function(property, newValue, oldValue) {
                var event = new Event("propertychange", false, true);
                event.__setTarget(this);
                event.__setSource(this);
                if (this.onPropertyChange) {
                    this.onPropertyChange(this, property, newValue, oldValue, event);
                }
                if (event.stopped || event.cancelled) return this;
                var observers = this.__propertyObservers[property];
                if (observers === undefined) return this;
                for (var i = 0; i < observers.length; i++) {
                    var item = observers[i];
                    var observerInstance = item.observer;
                    var observerProperty = item.property;
                    var observerChain = item.chain;
                    var propertyOldValue = oldValue;
                    var propertyNewValue = newValue;
                    if (observerChain) {
                        propertyNewValue = newValue.get(observerChain);
                        propertyOldValue = oldValue.get(observerChain);
                        remPropertyChangeObserver(oldValue, observerInstance, observerProperty, observerChain);
                        addPropertyChangeObserver(newValue, observerInstance, observerProperty, observerChain);
                    }
                    event.__setParameters([ observerProperty, propertyNewValue, propertyOldValue ]);
                    if (propertyNewValue === propertyOldValue) continue;
                    var callbacks = observerInstance.__propertyListeners[observerProperty];
                    if (callbacks) {
                        for (var j = 0; j < callbacks.length; j++) {
                            callbacks[j].call(observerInstance, observerInstance, observerProperty, propertyNewValue, propertyOldValue, event);
                            if (event.canceled || event.stoped) break;
                        }
                    }
                }
            },
            bind: function(name) {
                if (name in this) {
                    var bound = this.__bound[name];
                    if (bound === undefined) {
                        bound = this.__bound[name] = _.bind(this[name], this);
                    }
                    return bound;
                }
                throw new Error('Method "' + name + '" does not exists within this object');
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {},
            __propertyListeners: null,
            __propertyObservers: null
        });
        var addPropertyChangeObserver = function(object, observer, property, path) {
            O.forPath(object, path || property, function(owner, value, name, head, tail) {
                var observers = owner.__propertyObservers[name];
                if (observers === undefined) {
                    observers = owner.__propertyObservers[name] = [];
                }
                observers.push({
                    observer: observer,
                    property: property,
                    chain: tail
                });
            });
            return object;
        };
        var remPropertyChangeObserver = function(object, observer, property, path) {
            O.forPath(object, path || property, function(owner, value, name, head, tail) {
                var observers = owner.__propertyObservers[name];
                if (observers === undefined) return false;
                for (var i = observers.length - 1; i >= 0; i--) {
                    var item = observers[i];
                    if (item.observer === observer && item.property === property) {
                        observers.splice(i, 1);
                    }
                }
            });
            return object;
        };
        var expand = function(path) {
            return path.split(".");
        };
        var error = function(message) {
            throw new Error(message);
        };
        var owns = function(object, key) {
            return key in object;
        };
    },
    "9": function(require, module, exports, global) {
        "use strict";
        require("a");
        require("b");
        require("c");
        require("d");
        require("e");
        require("f");
    },
    a: function(require, module, exports, global) {
        "use strict";
        var Matrix = boxspring.define("boxspring.geom.Matrix", {
            properties: {
                scaleX: {
                    value: 0
                },
                scaleY: {
                    value: 0
                },
                scaleZ: {
                    value: 0
                },
                shearX: {
                    value: 0
                },
                shearY: {
                    value: 0
                },
                shearZ: {
                    value: 0
                },
                rotateX: {
                    value: 0
                },
                rotateY: {
                    value: 0
                },
                rotateZ: {
                    value: 0
                },
                translateX: {
                    value: 0
                },
                translateY: {
                    value: 0
                },
                translateZ: {
                    value: 0
                }
            },
            constructor: function() {
                return Matrix.parent.constructor.call(this);
            },
            destroy: function() {
                return Matrix.parent.destroy.call(this);
            },
            translate: function(x, y, z) {
                if (x == null) x = 0;
                if (y == null) y = 0;
                if (z == null) z = 0;
                var matrix = [ 1, 0, 0, 0, 0, 1, 0, 0, x, y, 1, 0, 0, 0, 0, 1 ];
                return this.combine(matrix);
            },
            scale: function(x, y, z) {
                if (x == null) x = 1;
                if (y == null) y = 1;
                if (z == null) z = 1;
                var matrix = [ x, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                return this.combine(matrix);
            },
            rotate: function(x, y, z) {
                if (x == null) x = 0;
                if (y == null) y = 0;
                if (z == null) z = 0;
                var s = Math.sin(x);
                var c = Math.cos(y);
                var matrix = [ c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                return this.combine(matrix);
            },
            shear: function(x, y, z) {
                if (x == null) x = 0;
                if (y == null) y = 0;
                if (z == null) z = 0;
                var x = Math.tan(x);
                var y = Math.tan(y);
                var matrix = [ 1, x, 0, 0, y, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                return this.combine(matrix);
            },
            combine: function(matrix) {
                var a, b, c, d, e, f;
                if (matrix instanceof Matrix) {
                    a = matrix.a;
                    b = matrix.b;
                    c = matrix.c;
                    d = matrix.d;
                    e = matrix.e;
                    f = matrix.f;
                } else {
                    a = matrix[0];
                    b = matrix[1];
                    c = matrix[3];
                    d = matrix[4];
                    e = matrix[6];
                    f = matrix[7];
                }
                this.values = [ a * this.a + b * this.c + 0 * this.e, a * this.b + b * this.d + 0 * this.f, 0, c * this.a + d * this.c + 0 * this.e, c * this.b + d * this.d + 0 * this.f, 0, e * this.a + f * this.c + 1 * this.e, e * this.b + f * this.d + 1 * this.f, 1 ];
                return this;
            },
            reset: function() {
                this.scaleX = 1;
                this.scaleY = 1;
                this.scaleZ = 1;
                this.translateX = 0;
                this.translateY = 0;
                this.translateZ = 0;
                this.values = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                return this;
            }
        });
    },
    b: function(require, module, exports, global) {
        "use strict";
        var Point = boxspring.define("boxspring.geom.Point", {
            properties: {
                x: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                }
            },
            constructor: function(x, y) {
                Point.parent.constructor.call(this);
                var point = arguments[0];
                if (point instanceof Point) {
                    x = point.x;
                    y = point.y;
                }
                this.x = x;
                this.y = y;
                return this;
            }
        });
    },
    c: function(require, module, exports, global) {
        "use strict";
        var Size = boxspring.define("boxspring.geom.Size", {
            properties: {
                x: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                }
            },
            constructor: function(x, y) {
                Size.parent.constructor.call(this);
                var size = arguments[0];
                if (size instanceof Size) {
                    x = size.x;
                    y = size.y;
                }
                this.x = x;
                this.y = y;
                return this;
            }
        });
    },
    d: function(require, module, exports, global) {
        "use strict";
        var Size = boxspring.geom.Size;
        var Point = boxspring.geom.Point;
        var Rectangle = boxspring.define("boxspring.geom.Rectangle", {
            statics: {
                union: function(r1, r2) {
                    var x1 = Math.min(r1.origin.x, r2.origin.x);
                    var y1 = Math.min(r1.origin.y, r2.origin.y);
                    var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x);
                    var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y);
                    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
                }
            },
            properties: {
                origin: {
                    value: function() {
                        return new Point(0, 0);
                    }
                },
                size: {
                    value: function() {
                        return new Size(0, 0);
                    }
                }
            },
            constructor: function(x, y, w, h) {
                Rectangle.parent.constructor.call(this);
                var rect = arguments[0];
                if (rect instanceof Rectangle) {
                    x = rect.origin.x;
                    y = rect.origin.y;
                    w = rect.size.x;
                    h = rect.size.y;
                }
                this.origin.x = x;
                this.origin.y = y;
                this.size.x = w;
                this.size.y = h;
                return this;
            }
        });
    },
    e: function(require, module, exports, global) {
        "use strict";
        var Thickness = boxspring.define("boxspring.geom.Thickness", {
            properties: {
                top: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                bottom: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                left: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                right: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                }
            },
            constructor: function() {
                Thickness.parent.constructor.call(this);
                switch (arguments.length) {
                  case 1:
                    this.top = arguments[0];
                    this.left = arguments[0];
                    this.right = arguments[0];
                    this.bottom = arguments[0];
                    break;
                  case 2:
                    this.top = arguments[0];
                    this.left = arguments[1];
                    this.right = arguments[1];
                    this.bottom = arguments[0];
                    break;
                  default:
                    this.top = arguments[0];
                    this.left = arguments[1];
                    this.right = arguments[2];
                    this.bottom = arguments[3];
                    break;
                }
                return this;
            }
        });
    },
    f: function(require, module, exports, global) {
        "use strict";
        var Position = boxspring.define("boxspring.geom.Position", {
            properties: {
                x: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                top: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                bottom: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                left: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                },
                right: {
                    value: 0,
                    check: function(value) {
                        return value || 0;
                    }
                }
            },
            constructor: function() {
                Position.parent.constructor.call(this);
                switch (arguments.length) {
                  case 1:
                    this.top = arguments[0];
                    this.left = arguments[0];
                    this.right = arguments[0];
                    this.bottom = arguments[0];
                    break;
                  case 2:
                    this.top = arguments[0];
                    this.left = arguments[1];
                    this.right = arguments[1];
                    this.bottom = arguments[0];
                    break;
                  default:
                    this.top = arguments[0];
                    this.left = arguments[1];
                    this.right = arguments[2];
                    this.bottom = arguments[3];
                    break;
                }
                return this;
            },
            onPropertyChange: function(target, property, value) {
                var update = function(property, value) {
                    if (this[property] !== value) this[property] = value;
                };
                switch (property) {
                  case "x":
                    update.call(this, "left", value);
                    break;
                  case "y":
                    update.call(this, "top", value);
                    break;
                  case "left":
                    update.call(this, "x", value);
                    break;
                  case "right":
                    update.call(this, "y", value);
                    break;
                }
                Position.parent.onPropertyChange.apply(this, arguments);
            }
        });
    },
    g: function(require, module, exports, global) {
        "use strict";
        require("h");
        require("i");
    },
    h: function(require, module, exports, global) {
        "use strict";
        var Event = boxspring.define("boxspring.event.Event", {
            properties: {
                type: {
                    write: false
                },
                source: {
                    write: false
                },
                target: {
                    write: false
                },
                parameters: {
                    write: false,
                    clone: true,
                    value: []
                },
                bubbleable: {
                    write: false,
                    value: false
                },
                cancelable: {
                    write: false,
                    value: true
                },
                stopped: {
                    write: false,
                    value: false
                },
                canceled: {
                    write: false,
                    value: false
                }
            },
            constructor: function(type, bubbleable, cancelable) {
                this.__type = type;
                this.__bubbleable = bubbleable;
                this.__cancelable = cancelable;
                return this;
            },
            stop: function() {
                this.__stopped = true;
                return this;
            },
            cancel: function() {
                this.__stopped = true;
                this.__canceled = true;
                return this;
            },
            __setTarget: function(target) {
                this.__target = target;
                return this;
            },
            __setSource: function(source) {
                this.__source = source;
                return this;
            },
            __setParameters: function(parameters) {
                this.__parameters = Array.prototype.slice.call(parameters);
                return this;
            }
        });
    },
    i: function(require, module, exports, global) {
        "use strict";
        var Event = boxspring.event.Event;
        var slice = Array.prototype.slice;
        var Emitter = boxspring.define("boxspring.event.Emitter", {
            properties: {
                parentReceiver: {
                    write: false
                }
            },
            addListener: function(type, listener) {
                type = type.toLowerCase();
                if (type === "propertychange") {
                    if (this.addPropertyChangeListener) {
                        this.addPropertyChangeListener(arguments[1], arguments[2]);
                        return this;
                    }
                }
                var listeners = this.__listeners || (this.__listeners = {});
                var events = listeners[type];
                if (events === undefined) {
                    events = listeners[type] = [];
                }
                if (events.indexOf(listener) === -1) {
                    events.push(listener);
                }
                return this;
            },
            hasListener: function(type, listener) {
                type = type.toLowerCase();
                if (type === "propertychange") {
                    if (this.hasPropertyListener) {
                        this.hasPropertyListener(arguments[1], arguments[2]);
                        return this;
                    }
                }
                var events = this.__listeners[type];
                if (events === undefined) return this;
                return events.indexOf(listener) > -1;
            },
            removeListener: function(type, listener) {
                type = type.toLowerCase();
                if (type === "propertychange") {
                    if (this.removePropertyListener) {
                        this.removePropertyListener(arguments[1], arguments[2]);
                        return this;
                    }
                }
                var events = this.__listeners[type];
                if (events === undefined) return this;
                var index = events.indexOf(listener);
                if (index > -1) {
                    events.splice(index, 1);
                }
                return this;
            },
            removeAllListeners: function(type) {
                if (type) {
                    type = type.toLowerCase();
                    if (type === "propertychange") {
                        if (this.removePropertyListeners) {
                            this.removePropertyListeners(arguments[1]);
                            return this;
                        }
                    }
                    delete this.__listeners[type];
                    return this;
                }
                this.__listeners = [];
                return this;
            },
            on: function() {
                return this.addListener.apply(this, arguments);
            },
            off: function() {
                return this.removeListener.apply(this, arguments);
            },
            once: function(type, listener) {
                var callback = function(e) {
                    this.removeListener(type, callback);
                    listener(e);
                };
                return this.addListener(type, callback);
            },
            emit: function(event) {
                if (typeof event === "string") {
                    event = new Event(event, false, true);
                }
                var parameters = slice.call(arguments, 1);
                if (parameters.length) {
                    event.__setParameters(parameters);
                }
                if (event.__source === null) {
                    event.__setSource(this);
                }
                event.__setTarget(this);
                var listeners = this.__listeners && this.__listeners[event.type];
                if (listeners) {
                    var args = event.parameters;
                    args.push(event);
                    for (var i = 0, l = listeners.length; i < l; i++) {
                        listeners[i].apply(this, args);
                    }
                }
                if (!event.bubbles || event.stopped) return this;
                var parentReceiver = this.parentReceiver;
                if (parentReceiver instanceof Emitter) {
                    parentReceiver.emit.call(parentReceiver, e);
                }
                return this;
            },
            __setParentReceiver: function(receiver) {
                this.__parentReceiver = receiver;
                return this;
            }
        });
    },
    j: function(require, module, exports, global) {
        "use strict";
        require("k");
    },
    k: function(require, module, exports, global) {
        "use strict";
        var RenderLoop = boxspring.define("boxspring.render.RenderLoop", {
            statics: {
                run: function(callback, priority) {
                    instance.run(callback, priority);
                },
                cancel: function(callback) {
                    instance.cancel(callback);
                }
            },
            constructor: function() {
                RenderLoop.parent.constructor.apply(this, arguments);
                this.__priority = [];
                this.__schedules = {};
                this.__callbacks = [];
                return this;
            },
            destroy: function() {
                this.__priority = null;
                this.__schedules = null;
                this.__callbacks = null;
                RenderLoop.parent.destroy.call(this);
            },
            run: function(callback, priority) {
                if (this.__frame == null) {
                    this.__frame = requestFrame(this.bind("onRefresh"));
                } else {
                    if (this.__processing) {
                        this.__reschedule = true;
                    }
                }
                priority = priority || 0;
                var index = this.__callbacks.indexOf(callback);
                if (index > -1) return this;
                var index = this.__priority.indexOf(priority);
                if (index === -1) {
                    this.__priority.push(priority);
                    this.__priority.sort();
                }
                var schedule = this.__schedules[priority];
                if (schedule == null) {
                    schedule = this.__schedules[priority] = [];
                }
                schedule.push(callback);
                this.__callbacks.push(callback);
                return this;
            },
            cancel: function(callback) {
                var index = this.__callbacks.indexOf(callback);
                if (index > -1) return this;
                this.__callbacks.splice(index, 1);
                for (var i = 0; i < this.__priority.length; i++) {
                    var priority = this.__priority[i];
                    var callbacks = this.__schedules[priority];
                    if (callbacks == null) continue;
                    var index = callbacks.indexOf(callback);
                    if (index === -1) continue;
                    callbacks.splice(index, 1);
                    return this;
                }
                return this;
            },
            onRefresh: function() {
                var now = Date.now();
                this.__processing = true;
                for (var i = 0; i < this.__priority.length; i++) {
                    var priority = this.__priority[i];
                    var callbacks = this.__schedules[priority];
                    if (callbacks == null) continue;
                    each(this.__schedules[priority].slice(), function(callback) {
                        callback.call(null, now);
                    });
                    this.__callbacks[priority] = [];
                }
                this.__processing = false;
                if (this.__reschedule) {
                    this.__reschedule = false;
                    this.__frame = requestFrame(this.bind("onRefresh"));
                } else {
                    this.__frame = null;
                }
            },
            __frame: null,
            __callbacks: null,
            __schedules: null,
            __priority: null,
            __processing: false,
            __reschedule: false
        });
        var instance = new RenderLoop;
        RenderLoop.ANIMATION_PRIORITY = 250;
        RenderLoop.RENDER_PRIORITY = 500;
        var find = _.find;
        var each = _.each;
        var cancelFrame = webkitCancelAnimationFrame;
        var requestFrame = webkitRequestAnimationFrame;
    },
    l: function(require, module, exports, global) {
        "use strict";
        require("m");
        require("o");
        require("p");
        require("q");
        require("r");
        require("s");
        require("t");
    },
    m: function(require, module, exports, global) {
        "use strict";
        var bezier = require("n");
        var Animation = boxspring.define("boxspring.animation.Animation", {
            inherits: boxspring.event.Emitter,
            properties: {
                duration: {
                    value: 250
                },
                equation: {
                    value: "default"
                },
                reverse: {
                    value: false
                },
                repeat: {
                    value: 0
                },
                running: {
                    value: false,
                    write: false
                }
            },
            start: function() {
                if (this.__running) return this;
                this.__running = true;
                this.__startTime = Date.now();
                this.__tweenTime = Date.now();
                this.__pauseTime = 0;
                var type = typeof this.equation;
                switch (type) {
                  case "function":
                    this.__compute = this.equation;
                    break;
                  case "string":
                    var equation = equations[this.equation] || this.equation;
                    equation = equation.replace(/\s+/g, "");
                    equation = equation.match(/cubic-bezier\(([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)\)/);
                    equation = _.map(equation.slice(1), function(v) {
                        return +v;
                    });
                    this.__compute = bezier(equation[0], equation[1], equation[2], equation[3], 1e3 / 60 / this.duration / 4);
                    break;
                }
                this.emit("start");
                return this;
            },
            pause: function() {
                this.__running = false;
                this.__pauseTime = Date.now();
                this.__startTime = 0;
                this.__tweenTime = 0;
                this.emit("pause");
                return this;
            },
            stop: function() {
                this.__running = false;
                this.__startTime = 0;
                this.__tweenTime = 0;
                this.__pauseTime = 0;
                this.emit("end");
                return this;
            },
            step: function(now) {
                var time = this.__tweenTime;
                if (time) {
                    var factor = (now - time) / this.duration;
                    if (factor > 1) {
                        factor = 1;
                    }
                    var f = 0;
                    var t = 1;
                    if (this.__reversed) {
                        f = 1;
                        t = 0;
                    }
                    var progress = compute(f, t, this.__compute(factor));
                    this.update(progress);
                    if (factor === 1) {
                        this.__repeatCount++;
                        if (this.__repeatCount > this.repeat) {
                            this.stop();
                            return;
                        }
                        if (this.reverse) {
                            this.__reversed = !this.__reversed;
                        }
                        this.__tweenTime = now;
                    }
                }
            },
            update: function(progress) {},
            __compute: null,
            __startTime: null,
            __pauseTime: null,
            __tweenTime: null,
            __repeatCount: 0,
            __reversed: false
        });
        var equations = {
            "default": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
            linear: "cubic-bezier(0, 0, 1, 1)",
            "ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
            "ease-out": "cubic-bezier(0, 0, 0.58, 1.0)",
            "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1.0)"
        };
        var compute = function(from, to, delta) {
            return (to - from) * delta + from;
        };
    },
    n: function(require, module, exports, global) {
        module.exports = function(x1, y1, x2, y2, epsilon) {
            var curveX = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
            };
            var curveY = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
            };
            var derivativeCurveX = function(t) {
                var v = 1 - t;
                return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
            };
            return function(t) {
                var x = t, t0, t1, t2, x2, d2, i;
                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = curveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return curveY(t2);
                    d2 = derivativeCurveX(t2);
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }
                t0 = 0, t1 = 1, t2 = x;
                if (t2 < t0) return curveY(t0);
                if (t2 > t1) return curveY(t1);
                while (t0 < t1) {
                    x2 = curveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return curveY(t2);
                    if (x > x2) t0 = t2; else t1 = t2;
                    t2 = (t1 - t0) * .5 + t0;
                }
                return curveY(t2);
            };
        };
    },
    o: function(require, module, exports, global) {
        "use strict";
        var AnimationSet = boxspring.define("boxspring.animation.AnimationSet", {
            inherits: boxspring.animation.Animation,
            properties: {
                animations: {
                    write: false,
                    clone: true,
                    value: []
                }
            },
            addAnimation: function(animation) {
                animation.duration = this.duration;
                animation.equation = this.equation;
                animation.reverse = this.reverse;
                animation.repeat = this.repeat;
                include(this.__animations, animation);
                return this;
            },
            removeAnimation: function(animation) {
                remove(this.__animations, animation);
                return this;
            },
            removeAllAnimations: function(animation) {
                this.__animations = [];
                return this;
            },
            start: function() {
                Animation.parent.start.apply(this, arguments);
                invoke(this.__animations, "start");
                return this;
            },
            pause: function() {
                Animation.parent.pause.apply(this, arguments);
                invoke(this.__animations, "pause");
                return this;
            },
            stop: function() {
                Animation.parent.stop.apply(this, arguments);
                invoke(this.__animations, "stop");
                return this;
            },
            step: function(now) {
                AnimationSet.parent.step.apply(this, arguments);
                invoke(this.__animations, "step", now);
                return this;
            }
        });
        var invoke = _.invoke;
        var include = function(array, object) {
            var index = array.indexOf(object);
            if (index === -1) {
                array.push(object);
            }
        };
        var remove = function(array, object) {
            var index = array.indexOf(object);
            if (index > -1) {
                array.splice(index, 1);
            }
        };
    },
    p: function(require, module, exports, global) {
        "use strict";
        var AnimationMap = boxspring.define("boxspring.animation.AnimationMap", {
            inherits: boxspring.animation.Animation,
            properties: {
                animations: {
                    write: false,
                    clone: true,
                    value: {}
                }
            },
            setAnimation: function(name, animation) {
                var anim = this.__animations[name];
                if (anim == null) {
                    anim = this.__animations[name] = animation;
                    anim.duration = this.duration;
                    anim.equation = this.equation;
                    anim.reverse = this.reverse;
                    anim.repeat = this.repeat;
                }
                return this;
            },
            getAnimation: function(name) {
                return this.__animations[name] || null;
            },
            removeAnimation: function(name) {
                delete this.__animations[name];
                return this;
            },
            removeAllAnimations: function() {
                this.__animations = {};
                return this;
            },
            start: function() {
                Animation.parent.start.apply(this, arguments);
                invoke(this.__animations, "start");
                return this;
            },
            pause: function() {
                Animation.parent.pause.apply(this, arguments);
                invoke(this.__animations, "pause");
                return this;
            },
            stop: function() {
                Animation.parent.stop.apply(this, arguments);
                invoke(this.__animations, "stop");
                return this;
            },
            step: function(now) {
                AnimationSet.parent.step.apply(this, arguments);
                invoke(this.__animations, "step", now);
                return this;
            }
        });
        var invoke = _.invoke;
    },
    q: function(require, module, exports, global) {
        "use strict";
        var AnimationMap = boxspring.animation.AnimationMap;
        var PropertyAnimation = boxspring.animation.PropertyAnimation;
        var AnimationTransaction = boxspring.define("boxspring.animation.AnimationTransaction", {
            inherits: boxspring.animation.Animation,
            statics: {
                begin: function() {
                    instances.push(new AnimationTransaction);
                },
                commit: function() {
                    var animation = instances.pop();
                    if (animation) {
                        animation.start();
                    }
                },
                isRunning: function() {},
                getCurrent: function() {
                    return instances[instances.length - 1] || null;
                },
                setDuration: function(duration) {
                    var animation = AnimationTransaction.getCurrent();
                    if (animation) {
                        animation.duraction = duraction;
                    }
                },
                setEquation: function(equation) {
                    var animation = AnimationTransaction.getCurrent();
                    if (animation) {
                        animation.equation = equation;
                    }
                },
                setReverse: function(reverse) {
                    var animation = AnimationTransaction.getCurrent();
                    if (animation) {
                        animation.reverse = reverse;
                    }
                },
                setRepeat: function(repeat) {
                    var animation = AnimationTransaction.getCurrent();
                    if (animation) {
                        animation.repeat = repeat;
                    }
                }
            },
            constructor: function() {
                AnimationTransaction.parent.constructor.apply(this);
                this.__views = [];
                this.__animations = [];
                return this;
            },
            animate: function(view, property, from, to, animation) {
                var animationMap = this.__animationForView(view);
                if (animationMap === null) {
                    animationMap = new AnimationMap;
                }
                var anim = animationMap.getAnimation(property);
                if (anim === null) {
                    anim = animation || new PropertyAnimation;
                    anim.view = view;
                    anim.from = from;
                    anim.to = to;
                    animationMap.setAnimation(property, anim);
                } else {
                    anim.to = to;
                }
                return this;
            },
            update: function(progress) {
                invoke(this.__animations, "update", progress);
            },
            onPropertyChange: function() {},
            __views: null,
            __animations: null,
            __animationForView: function(view) {
                var index = this.__views.indexOf(view);
                if (index > -1) {
                    return this.__animations[index];
                }
                return null;
            }
        });
        var instances = [];
    },
    r: function(require, module, exports, global) {
        "use strict";
        var PropertyAnimation = boxspring.define("boxspring.animation.PropertyAnimation", {
            inherits: boxspring.animation.Animation,
            properties: {
                view: {
                    value: null
                },
                property: {
                    value: null
                },
                from: {
                    value: 0
                },
                to: {
                    value: 0
                }
            },
            update: function(progress) {
                var view = this.view;
                if (view) {
                    view.set(this.property, progress * (this.to - this.from) + this.from);
                }
            },
            start: function() {
                PropertyAnimation.parent.start.call(this);
                RenderLoop.run(this.bind("step"), RenderLoop.ANIMATION_PRIORITY);
                this.__run = true;
                return this;
            },
            stop: function() {
                PropertyAnimation.parent.stop.call(this);
                this.__run = false;
                return this;
            },
            step: function(now) {
                PropertyAnimation.parent.step.call(this, now);
                if (this.__run) {
                    RenderLoop.run(this.bind("step"), RenderLoop.ANIMATION_PRIORITY);
                }
            },
            __run: false
        });
        var RenderLoop = boxspring.render.RenderLoop;
    },
    s: function(require, module, exports, global) {},
    t: function(require, module, exports, global) {},
    u: function(require, module, exports, global) {
        "use strict";
        require("v");
        require("w");
    },
    v: function(require, module, exports, global) {
        "use strict";
        var Layout = boxspring.define("boxspring.layout.Layout", {
            properties: {
                view: {
                    value: null
                }
            },
            update: function() {
                var view = this.view;
                if (view === null) return this;
                var border = view.borderWidth;
                var outerSizeX = view.measuredSize.x - border * 2;
                var outerSizeY = view.measuredSize.y - border * 2;
                var measures = [];
                var children = view.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var positionT = child.position.top;
                    var positionL = child.position.left;
                    var positionR = child.position.right;
                    var positionB = child.position.bottom;
                    if (positionT === "auto" && positionB === "auto" && positionL === "auto" && positionR === "auto") {
                        measures.push(child);
                        continue;
                    }
                    var sizeX = child.size.x;
                    var sizeY = child.size.y;
                    var maxSizeX = child.maxSize.x;
                    var maxSizeY = child.maxSize.y;
                    var minSizeX = child.minSize.x;
                    var minSizeY = child.minSize.y;
                    var marginT = child.margin.top;
                    var marginL = child.margin.left;
                    var marginR = child.margin.right;
                    var marginB = child.margin.bottom;
                    var marginX = marginL + marginR;
                    var marginY = marginT + marginB;
                    var measuredSizeX = sizeX === "fill" ? outerSizeX : sizeX;
                    var measuredSizeY = sizeY === "fill" ? outerSizeY : sizeY;
                    var measuredOffsetX = 0;
                    var measuredOffsetY = 0;
                    if (positionL !== "auto" && positionR !== "auto") {
                        measuredSizeX = outerSizeX - positionL - positionR - marginX;
                    }
                    if (positionT !== "auto" && positionB !== "auto") {
                        measuredSizeY = outerSizeY - positionT - positionB - marginY;
                    }
                    if (maxSizeX !== "none" && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX;
                    if (minSizeX !== "none" && measuredSizeX < minSizeX) measuredSizeX = minSizeX;
                    if (maxSizeY !== "none" && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY;
                    if (minSizeY !== "none" && measuredSizeY < minSizeY) measuredSizeY = minSizeY;
                    if (positionL !== "auto") {
                        measuredOffsetX = positionL + marginL + border;
                    } else if (positionR !== "auto") {
                        measuredOffsetX = outerSizeX - measuredSizeX - positionR + border;
                    }
                    if (positionT !== "auto") {
                        measuredOffsetY = positionT + marginT + border;
                    } else if (positionB !== "auto") {
                        measuredOffsetY = outerSizeY - measuredSizeY - positionB + border;
                    }
                    child.measuredSize.x = measuredSizeX;
                    child.measuredSize.y = measuredSizeY;
                    child.measuredOffset.x = measuredOffsetX;
                    child.measuredOffset.y = measuredOffsetY;
                }
                this.updateLayout(measures);
                return this;
            },
            updateLayout: function(children) {}
        });
        Layout.parse;
    },
    w: function(require, module, exports, global) {
        "use strict";
        var LinearLayout = boxspring.define("boxspring.layout.LinearLayout", {
            inherits: boxspring.layout.Layout,
            properties: {
                orientation: {
                    value: "vertical"
                },
                contentVerticalAlignment: {
                    value: "start"
                },
                contentHorizontalAlignment: {
                    value: "start"
                }
            },
            updateLayout: function(children) {
                switch (this.orientation) {
                  case "vertical":
                    this.__updateLayoutVertically(children);
                    break;
                  case "horizontal":
                    this.__updateLayoutHorizontally(children);
                    break;
                }
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue) {
                if (property === "orientation" || property === "contentVerticalAlignment" || property === "contentHorizontalAlignment") {
                    if (this.view) this.view.scheduleLayout();
                }
                LinearLayout.parent.onPropertyChange.apply(this, arguments);
            },
            __updateLayoutHorizontally: function(children) {
                var contentAlignmentY = this.contentVerticalAlignment;
                var contentAlignmentX = this.contentHorizontalAlignment;
                var border = this.view.borderWidth;
                var paddingT = this.view.padding.top;
                var paddingL = this.view.padding.left;
                var paddingB = this.view.padding.bottom;
                var paddingR = this.view.padding.right;
                var contentSizeX = this.view.measuredSize.x - paddingL - paddingR - border * 2;
                var contentSizeY = this.view.measuredSize.y - paddingT - paddingB - border * 2;
                var usedSpace = 0;
                var freeSpace = contentSizeX;
                var fluidItems = [];
                var fluidSpace = 0;
                var fluidCount = 0;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var sizeX = child.size.x;
                    var sizeY = child.size.y;
                    var maxSizeX = child.maxSize.x;
                    var maxSizeY = child.maxSize.y;
                    var minSizeX = child.minSize.x;
                    var minSizeY = child.minSize.y;
                    var marginT = child.margin.top;
                    var marginL = child.margin.left;
                    var marginR = child.margin.right;
                    var marginB = child.margin.bottom;
                    var marginX = marginL + marginR;
                    var marginY = marginT + marginB;
                    var measuredSizeX = sizeX === "fill" ? contentSizeX : sizeX;
                    var measuredSizeY = sizeY === "fill" ? contentSizeY : sizeY;
                    if (maxSizeX !== "none" && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX;
                    if (minSizeX !== "none" && measuredSizeX < minSizeX) measuredSizeX = minSizeX;
                    if (maxSizeY !== "none" && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY;
                    if (minSizeY !== "none" && measuredSizeY < minSizeY) measuredSizeY = minSizeY;
                    if (sizeX === "fill") {
                        fluidItems.push(child);
                    } else {
                        var space = measuredSizeX - marginX;
                        freeSpace -= space;
                        usedSpace += space;
                    }
                    child.measuredSize.x = measuredSizeX;
                    child.measuredSize.y = measuredSizeY;
                }
                fluidCount = fluidItems.length;
                fluidSpace = freeSpace / fluidCount;
                for (var i = 0; i < fluidItems.length; i++) {
                    var child = fluidItems[i];
                    var maxSizeX = child.maxSize.x;
                    var maxSizeY = child.maxSize.y;
                    var minSizeX = child.minSize.x;
                    var minSizeY = child.minSize.y;
                    var space = fluidSpace;
                    if (maxSizeX !== "none" && space > maxSizeX) space = maxSizeX;
                    if (minSizeX !== "none" && space < minSizeX) space = minSizeX;
                    child.measuredSize.x = space;
                    usedSpace += space;
                    freeSpace -= space;
                    fluidCount--;
                    fluidSpace = freeSpace / fluidCount;
                }
                var offset = 0;
                switch (contentAlignmentX) {
                  case "start":
                    offset = paddingL + border;
                    break;
                  case "end":
                    offset = paddingL + border + contentSizeX - usedSpace;
                    break;
                  case "center":
                    offset = contentSizeX / 2 - usedSpace / 2;
                    break;
                }
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var marginT = child.margin.top;
                    var marginL = child.margin.left;
                    var marginR = child.margin.right;
                    var marginB = child.margin.bottom;
                    var measuredSizeX = child.measuredSize.x;
                    var measuredSizeY = child.measuredSize.y;
                    var measuredOffsetX = 0;
                    var measuredOffsetY = 0;
                    measuredOffsetX = offset + marginL;
                    switch (contentAlignmentY) {
                      case "start":
                        measuredOffsetY = paddingT + border;
                        break;
                      case "end":
                        measuredOffsetY = paddingT + border + contentSizeY - measuredSizeY;
                        break;
                      case "center":
                        measuredOffsetY = paddingT + border + contentSizeY / 2 - measuredSizeY / 2;
                        break;
                    }
                    child.measuredOffset.x = measuredOffsetX;
                    child.measuredOffset.y = measuredOffsetY;
                    offset = measuredOffsetX + measuredSizeX;
                }
                return this;
            },
            __updateLayoutVertically: function(children) {
                var contentAlignmentY = this.contentVerticalAlignment;
                var contentAlignmentX = this.contentHorizontalAlignment;
                var border = this.view.borderWidth;
                var paddingT = this.view.padding.top;
                var paddingL = this.view.padding.left;
                var paddingB = this.view.padding.bottom;
                var paddingR = this.view.padding.right;
                var contentSizeX = this.view.measuredSize.x - paddingL - paddingR - border * 2;
                var contentSizeY = this.view.measuredSize.y - paddingT - paddingB - border * 2;
                var usedSpace = 0;
                var freeSpace = contentSizeY;
                var fluidItems = [];
                var fluidSpace = 0;
                var fluidCount = 0;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var sizeX = child.size.x;
                    var sizeY = child.size.y;
                    var maxSizeX = child.maxSize.x;
                    var maxSizeY = child.maxSize.y;
                    var minSizeX = child.minSize.x;
                    var minSizeY = child.minSize.y;
                    var marginT = child.margin.top;
                    var marginL = child.margin.left;
                    var marginR = child.margin.right;
                    var marginB = child.margin.bottom;
                    var marginX = marginL + marginR;
                    var marginY = marginT + marginB;
                    var measuredSizeX = sizeX === "fill" ? contentSizeX : sizeX;
                    var measuredSizeY = sizeY === "fill" ? contentSizeY : sizeY;
                    if (maxSizeX !== "none" && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX;
                    if (minSizeX !== "none" && measuredSizeX < minSizeX) measuredSizeX = minSizeX;
                    if (maxSizeY !== "none" && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY;
                    if (minSizeY !== "none" && measuredSizeY < minSizeY) measuredSizeY = minSizeY;
                    if (sizeY === "fill") {
                        fluidItems.push(child);
                    } else {
                        var space = measuredSizeY - marginY;
                        freeSpace -= space;
                        usedSpace += space;
                    }
                    child.measuredSize.x = measuredSizeX;
                    child.measuredSize.y = measuredSizeY;
                }
                fluidCount = fluidItems.length;
                fluidSpace = freeSpace / fluidCount;
                for (var i = 0; i < fluidItems.length; i++) {
                    var child = fluidItems[i];
                    var maxSizeX = child.maxSize.x;
                    var maxSizeY = child.maxSize.y;
                    var minSizeX = child.minSize.x;
                    var minSizeY = child.minSize.y;
                    var space = fluidSpace;
                    if (maxSizeX !== "none" && space > maxSizeX) space = maxSizeX;
                    if (minSizeX !== "none" && space < minSizeX) space = minSizeX;
                    child.measuredSize.y = space;
                    usedSpace += space;
                    freeSpace -= space;
                    fluidCount--;
                    fluidSpace = freeSpace / fluidCount;
                }
                var offset = 0;
                switch (contentAlignmentY) {
                  case "start":
                    offset = paddingT + border;
                    break;
                  case "end":
                    offset = paddingT + border + contentSizeX - usedSpace;
                    break;
                  case "center":
                    offset = contentSizeY / 2 - usedSpace / 2;
                    break;
                }
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var marginT = child.margin.top;
                    var marginL = child.margin.left;
                    var marginR = child.margin.right;
                    var marginB = child.margin.bottom;
                    var measuredSizeX = child.measuredSize.x;
                    var measuredSizeY = child.measuredSize.y;
                    var measuredOffsetX = 0;
                    var measuredOffsetY = 0;
                    measuredOffsetY = offset + marginT;
                    switch (contentAlignmentX) {
                      case "start":
                        measuredOffsetX = paddingT + border;
                        break;
                      case "end":
                        measuredOffsetX = paddingT + border + contentSizeY - measuredSizeY;
                        break;
                      case "center":
                        measuredOffsetX = paddingT + border + contentSizeY / 2 - measuredSizeY / 2;
                        break;
                    }
                    child.measuredOffset.x = measuredOffsetX;
                    child.measuredOffset.y = measuredOffsetY;
                    offset = measuredOffsetY + measuredSizeY;
                }
                return this;
            }
        });
    },
    x: function(require, module, exports, global) {
        "use strict";
        require("y");
        require("z");
        require("10");
        require("11");
    },
    y: function(require, module, exports, global) {
        "use strict";
        var Size = boxspring.geom.Size;
        var Point = boxspring.geom.Point;
        var Matrix = boxspring.geom.Matrix;
        var Rectangle = boxspring.geom.Rectangle;
        var Thickness = boxspring.geom.Thickness;
        var Position = boxspring.geom.Position;
        var Layout = boxspring.layout.Layout;
        var View = boxspring.define("boxspring.view.View", {
            inherits: boxspring.event.Emitter,
            properties: {
                name: {
                    value: ""
                },
                window: {
                    write: false
                },
                parent: {
                    write: false
                },
                children: {
                    write: false,
                    clone: true,
                    value: []
                },
                backgroundColor: {
                    value: "#fff"
                },
                backgroundImage: {
                    value: ""
                },
                backgroundRepeat: {
                    value: "repeat"
                },
                backgroundSize: {
                    value: function() {
                        return new Size("auto", "auto");
                    }
                },
                backgroundClip: {
                    value: "border"
                },
                borderColor: {
                    value: "#000"
                },
                borderWidth: {
                    value: 0,
                    check: Math.abs
                },
                borderRadius: {
                    value: 0,
                    check: Math.abs
                },
                shadowBlur: {
                    value: 0
                },
                shadowColor: {
                    value: "#000"
                },
                shadowOffset: {
                    value: function() {
                        return new Point;
                    }
                },
                layout: {
                    value: function() {
                        return new Layout;
                    }
                },
                transform: {
                    value: function() {
                        return new Matrix;
                    }
                },
                visible: {
                    value: true
                },
                opacity: {
                    value: 1,
                    check: function(value) {
                        if (value > 1) value = 1;
                        if (value < 0) value = 0;
                        return value;
                    }
                },
                margin: {
                    value: function() {
                        return new Thickness;
                    },
                    check: function(newValue, oldValue) {
                        if (typeof newValue === "number") {
                            this.margin.top = newValue;
                            this.margin.left = newValue;
                            this.margin.right = newValue;
                            this.margin.bottom = newValue;
                            return oldValue;
                        }
                        return newValue;
                    }
                },
                padding: {
                    value: function() {
                        return new Thickness;
                    },
                    check: function(newValue, oldValue) {
                        if (typeof newValue === "number") {
                            this.padding.top = newValue;
                            this.padding.left = newValue;
                            this.padding.right = newValue;
                            this.padding.bottom = newValue;
                            return oldValue;
                        }
                        return newValue;
                    }
                },
                position: {
                    value: function() {
                        return new Position("auto");
                    },
                    check: function(newValue, oldValue) {
                        if (newValue === "auto") {
                            this.position.top = newValue;
                            this.position.left = newValue;
                            this.position.right = newValue;
                            this.position.bottom = newValue;
                            return oldValue;
                        }
                        return newValue;
                    }
                },
                size: {
                    value: function() {
                        return new Size("fill", "fill");
                    }
                },
                minSize: {
                    value: function() {
                        return new Size("none", "none");
                    }
                },
                maxSize: {
                    value: function() {
                        return new Size("none", "none");
                    }
                },
                measuredSize: {
                    value: function() {
                        return new Size;
                    }
                },
                measuredOffset: {
                    value: function() {
                        return new Point;
                    }
                }
            },
            constructor: function() {
                View.parent.constructor.call(this);
                var onPropertyChange = this.bind("onPropertyChange");
                this.on("propertychange", "size.x", onPropertyChange);
                this.on("propertychange", "size.y", onPropertyChange);
                this.on("propertychange", "minSize.x", onPropertyChange);
                this.on("propertychange", "minSize.y", onPropertyChange);
                this.on("propertychange", "maxSize.x", onPropertyChange);
                this.on("propertychange", "maxSize.y", onPropertyChange);
                this.on("propertychange", "shadowOffset.x", onPropertyChange);
                this.on("propertychange", "shadowOffset.y", onPropertyChange);
                this.on("propertychange", "margin.top", onPropertyChange);
                this.on("propertychange", "margin.left", onPropertyChange);
                this.on("propertychange", "margin.right", onPropertyChange);
                this.on("propertychange", "margin.bottom", onPropertyChange);
                this.on("propertychange", "padding.top", onPropertyChange);
                this.on("propertychange", "padding.left", onPropertyChange);
                this.on("propertychange", "padding.right", onPropertyChange);
                this.on("propertychange", "padding.bottom", onPropertyChange);
                this.on("propertychange", "position.top", onPropertyChange);
                this.on("propertychange", "position.left", onPropertyChange);
                this.on("propertychange", "position.right", onPropertyChange);
                this.on("propertychange", "position.bottom", onPropertyChange);
                this.on("add", this.bind("onAdd"));
                this.on("remove", this.bind("onRemove"));
                this.on("addtoparent", this.bind("onAddToParent"));
                this.on("addtowindow", this.bind("onAddToWindow"));
                this.on("removefromparent", this.bind("onRemoveFromParent"));
                this.on("removefromwindow", this.bind("onRemoveFromWindow"));
                this.on("touchcancel", this.bind("onTouchCancel"));
                this.on("touchstart", this.bind("onTouchStart"));
                this.on("touchmove", this.bind("onTouchMove"));
                this.on("touchend", this.bind("onTouchEnd"));
                return this;
            },
            destroy: function() {
                this.removeFromParent();
                var onPropertyChange = this.bind("onPropertyChange");
                this.off("propertychange", "size.x", onPropertyChange);
                this.off("propertychange", "size.y", onPropertyChange);
                this.off("propertychange", "minSize.x", onPropertyChange);
                this.off("propertychange", "minSize.y", onPropertyChange);
                this.off("propertychange", "maxSize.x", onPropertyChange);
                this.off("propertychange", "maxSize.y", onPropertyChange);
                this.off("propertychange", "shadowOffset.x", onPropertyChange);
                this.off("propertychange", "shadowOffset.y", onPropertyChange);
                this.off("propertychange", "margin.top", onPropertyChange);
                this.off("propertychange", "margin.left", onPropertyChange);
                this.off("propertychange", "margin.right", onPropertyChange);
                this.off("propertychange", "margin.bottom", onPropertyChange);
                this.off("propertychange", "padding.top", onPropertyChange);
                this.off("propertychange", "padding.left", onPropertyChange);
                this.off("propertychange", "padding.right", onPropertyChange);
                this.off("propertychange", "padding.bottom", onPropertyChange);
                this.off("propertychange", "position.top", onPropertyChange);
                this.off("propertychange", "position.left", onPropertyChange);
                this.off("propertychange", "position.right", onPropertyChange);
                this.off("propertychange", "position.bottom", onPropertyChange);
                this.off("add", this.bind("onAdd"));
                this.off("remove", this.bind("onRemove"));
                this.off("addtoparent", this.bind("onAddToParent"));
                this.off("addtowindow", this.bind("onAddToWindow"));
                this.off("removefromparent", this.bind("onRemoveFromParent"));
                this.off("removefromwindow", this.bind("onRemoveFromWindow"));
                this.off("touchcancel", this.bind("onTouchCancel"));
                this.off("touchstart", this.bind("onTouchStart"));
                this.off("touchmove", this.bind("onTouchMove"));
                this.off("touchend", this.bind("onTouchEnd"));
                this.removeAllListeners();
                return View.parent.destroy.call(this);
            },
            addChild: function(view) {
                return this.addChildAt(view, this.__children.length);
            },
            addChildAt: function(view, index) {
                var children = this.__children;
                if (index > children.length) {
                    index = children.length;
                } else if (index < 0) {
                    index = 0;
                }
                view.removeFromParent();
                children.splice(index, 1, view);
                view.__setWindow(this.window);
                view.__setParent(this);
                view.__setParentReceiver(this);
                this.emit("add", view);
                this.scheduleLayout();
                return this;
            },
            addChildBefore: function(view, before) {
                var index = this.getChildIndex(before);
                if (index === null) return this;
                return this.addChildAt(view, index);
            },
            addChildAfter: function(view, after) {
                var index = this.getChildIndex(before);
                if (index === null) return this;
                return this.addChildAt(view, index + 1);
            },
            removeChild: function(view) {
                var index = this.getChildIndex(view);
                if (index === null) return this;
                return this.removeChildAt(index);
            },
            removeChildAt: function(index) {
                var children = this.__children;
                var view = children[index];
                if (view == null) return this;
                children.splice(index, 1);
                view.__setWindow(null);
                view.__setParent(null);
                view.__setParentReceiver(null);
                this.emit("remove", view);
                this.scheduleLayout();
                return this;
            },
            removeFromParent: function() {
                var parent = this.parent;
                if (parent) parent.removeChild(this);
                return this;
            },
            getChildIndex: function(view) {
                return this.__children.indexOf(view);
            },
            getChildByName: function(name) {},
            getChildAtIndex: function(index) {
                return this.__children[index] || null;
            },
            getChildAtPoint: function(x, y) {
                if (this.isPointInside(x, y) === false) return null;
                var children = this.__children;
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    if (child.isPointInside(x, y) === false) continue;
                    var o = child.origin;
                    var px = x - o.x;
                    var py = y - o.y;
                    return child.getChildAtPoint(px, py);
                }
                return this;
            },
            isPointInside: function(x, y) {
                var point = arguments[0];
                if (point instanceof Point) {
                    x = point.x;
                    y = point.y;
                }
                var s = this.size;
                var o = this.origin;
                return x >= o.x && x <= o.x + s.x && y >= o.y && y <= o.y + s.y;
            },
            reflowOnPropertyChange: function(property) {
                if (property === "size" || property === "size.x" || property === "size.y" || property === "minSize" || property === "minSize.x" || property === "minSize.y" || property === "maxSize" || property === "maxSize.x" || property === "maxSize.y" || property === "visible" || property === "margin" || property === "margin.top" || property === "margin.left" || property === "margin.right" || property === "margin.bottom" || property === "position.top" || property === "position.left" || property === "position.right" || property === "position.bottom") {
                    return true;
                }
                return false;
            },
            layoutOnPropertyChange: function(property) {
                if (property === "measuredSize" || property === "measuredSize.x" || property === "measuredSize.y" || property === "borderWidth" || property === "padding" || property === "padding.top" || property === "padding.left" || property === "padding.right" || property === "padding.bottom" || property === "layout") {
                    return true;
                }
                return false;
            },
            redrawOnPropertyChange: function(property) {},
            scheduleReflow: function() {
                var parent = this.parent;
                if (parent) parent.scheduleLayout();
                return this;
            },
            scheduleLayout: function() {
                this.__layoutScheduled = true;
                return this;
            },
            scheduleRedraw: function(area) {
                if (area) {
                    if (this.__redrawArea === null) {
                        this.__redrawArea = new Rectangle;
                    }
                    this.__redrawArea = Rectangle.union(this.__redrawArea, area);
                }
                this.__redrawScheduled = true;
                return this;
            },
            layoutIfNeeded: function() {
                if (this.__layoutScheduled) {
                    this.__layoutScheduled = false;
                    this.layoutChildren();
                }
                return this;
            },
            layoutChildren: function() {
                if (this.layout) {
                    this.layout.view = this;
                    this.layout.update();
                }
                return this;
            },
            redrawIfNeeded: function(context) {
                if (this.__redrawScheduled) {
                    this.__redrawScheduled = false;
                    var rect = null;
                    var area = this.__redrawArea;
                    if (area === null) {
                        rect = new Rectangle;
                        rect.size.x = this.measuredSize.x;
                        rect.size.y = this.measuredSize.y;
                    } else {
                        rect = new Rectangle;
                        rect.size.x = area.size.x || this.measuredSize.x;
                        rect.size.y = area.size.y || this.measuredSize.y;
                        rect.origin.x = area.origin.x;
                        rect.origin.y = area.origin.y;
                    }
                    this.redraw(context, area);
                }
                return this;
            },
            redraw: function(context, area) {
                this.emit("redraw", context, area);
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {
                if (this.reflowOnPropertyChange(property)) {
                    this.scheduleReflow();
                }
                if (this.layoutOnPropertyChange(property)) {
                    this.scheduleLayout();
                }
                if (this.redrawOnPropertyChange(property)) {
                    this.scheduleRedraw();
                }
            },
            onLayout: function(e) {},
            onRedraw: function(e) {},
            onAdd: function(view, e) {},
            onRemove: function(view, e) {},
            onAddToParent: function(parent, e) {},
            onRemoveFromParent: function(parent, e) {},
            onAddToWindow: function(window, e) {},
            onRemoveFromWindow: function(window, e) {},
            onTouchCancel: function(touches, e) {},
            onTouchStart: function(touches, e) {},
            onTouchMove: function(touches, e) {},
            onTouchEnd: function(touches, e) {},
            __animations: null,
            __redrawArea: null,
            __redrawScheduled: false,
            __layoutScheduled: false,
            __setParent: function(value) {
                var parent = this.__parent;
                if (parent && value === null) {
                    this.__parent = value;
                    return this.emit("removefromparent", parent);
                }
                if (parent === null && value) {
                    this.__parent = value;
                    return this.emit("addtoparent", parent);
                }
                return this;
            },
            __setWindow: function(value) {
                var window = this.__window;
                if (window && value === null) {
                    this.__window = value;
                    return this.emit("removefromwindow", window);
                }
                if (window === null && value) {
                    this.__window = value;
                    return this.emit("addtowindow", window);
                }
                invoke(this.__children, "__setWindow", value);
                return this;
            }
        });
        var invoke = _.invoke;
    },
    z: function(require, module, exports, global) {
        "use strict";
        var Rectangle = boxspring.geom.Rectangle;
        var View = boxspring.override("boxspring.view.View", {
            destroy: function() {
                var renderCache = renderCaches[this.UID];
                if (renderCache) {
                    renderCache.width = 0;
                    renderCache.height = 0;
                    delete renderCaches[this.UID];
                }
                var shadowCache = shadowCaches[this.UID];
                if (shadowCache) {
                    shadowCache.width = 0;
                    shadowCache.height = 0;
                    delete shadowCaches[this.UID];
                }
                View.parent.destroy.call(this);
                return this;
            },
            redrawOnPropertyChange: function(property) {
                if (property === "backgroundColor" || property === "backgroundImage" || property === "backgroundRepeat" || property === "backgroundClip" || property === "backgroundSize" || property === "backgroundSize.x" || property === "backgroundSize.y" || property === "borderRadius" || property === "borderColor" || property === "borderWidth" || property === "shadowBlur" || property === "shadowColor" || property === "shadowOffset" || property === "shadowOffset.x" || property === "shadowOffset.y") {
                    return true;
                }
                return View.parent.redrawOnPropertyChange.apply(this, arguments);
            },
            scheduleLayout: function() {
                updateDisplayWithMask(this, LAYOUT_UPDATE_MASK);
                return View.parent.scheduleLayout.call(this);
            },
            scheduleRedraw: function(area) {
                updateDisplayWithMask(this, REDRAW_UPDATE_MASK);
                return View.parent.scheduleRedraw.apply(this, arguments);
            },
            redraw: function(context, area) {
                this.__redrawBackground(context, area);
                this.__redrawBorder(context, area);
                this.__redrawShadow(context, area);
                View.parent.redraw.apply(this, arguments);
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {
                if (property === "measuredSize" || property === "measuredSize.x" || property === "measuredSize.y") {
                    updateDisplayWithMask(this, MEASURED_SIZE_UPDATE_MASK);
                }
                if (property === "measuredOffset" || property === "measuredOffset.x" || property === "measuredOffset.y") {
                    updateDisplayWithMask(this, MEASURED_OFFSET_UPDATE_MASK);
                }
                if (property === "shadowBlur" || property === "shadowColor" || property === "shadowOffset" || property === "shadowOffset.x" || property === "shadowOffset.y") {
                    updateDisplayWithMask(this, SHADOW_UPDATE_MASK);
                }
                if (property === "opacity") {
                    updateDisplayWithMask(this, OPACITY_UPADTE_MASK);
                }
                if (property === "transform") {
                    updateDisplayWithMask(this, TRANSFORM_UPDATE_MASK);
                }
                View.parent.onPropertyChange.apply(this, arguments);
            },
            __redrawBackground: function(context, area) {
                var sizeX = this.measuredSize.x;
                var sizeY = this.measuredSize.y;
                var borderRadius = this.borderRadius;
                var backgroundClip = this.backgroundClip;
                var backgroundColor = this.backgroundColor;
                var backgroundImage = this.backgroundImage;
                var backgroundRepeat = this.backgroundRepeat;
                if (backgroundColor || backgroundImage) {
                    var backgroundSizeX = sizeX;
                    var backgroundSizeY = sizeY;
                    var backgroundRadius = borderRadius;
                    if (backgroundClip === "content") {
                        backgroundSizeX -= borderWidth * 2;
                        backgroundSizeY -= borderWidth * 2;
                        backgroundRadius -= borderWidth;
                        backgroundOriginX += borderWidth;
                        backgroundOriginY += borderWidth;
                    }
                    if (backgroundRadius < 0) {
                        backgroundRadius = 0;
                    }
                    context.save();
                    this.__createRectPath(context, 0, 0, backgroundSizeX, backgroundSizeY, backgroundRadius);
                    if (backgroundColor) {
                        context.fillStyle = backgroundColor;
                        context.fill();
                    }
                    if (backgroundImage) {
                        context.fillStyle = context.createPattern(backgroundImage, backgroundRepeat);
                        context.fill();
                    }
                    context.restore();
                }
                return this;
            },
            __redrawBorder: function(context, area) {
                var sizeX = this.measuredSize.x;
                var sizeY = this.measuredSize.y;
                var borderWidth = this.borderWidth;
                var borderColor = this.borderColor;
                var borderRadius = this.borderRadius;
                if (borderWidth && borderColor) {
                    var strokeSizeX = sizeX - borderWidth;
                    var strokeSizeY = sizeY - borderWidth;
                    var strokeOriginX = borderWidth / 2;
                    var strokeOriginY = borderWidth / 2;
                    var strokeRadius = borderRadius - borderWidth / 2;
                    if (strokeRadius < 0) {
                        strokeRadius = 0;
                    }
                    context.save();
                    this.__createRectPath(context, strokeOriginX, strokeOriginY, strokeSizeX, strokeSizeY, strokeRadius);
                    context.lineCap = "butt";
                    context.lineWidth = borderWidth;
                    context.strokeStyle = borderColor;
                    context.stroke();
                    context.restore();
                }
                return this;
            },
            __redrawShadow: function(context, area) {
                console.log("TODO REDRAW SHADOW");
            },
            __createRectPath: function(context, originX, originY, sizeX, sizeY, radius) {
                context.beginPath();
                if (radius) {
                    context.moveTo(originX + radius, originY);
                    context.lineTo(originX + sizeX - radius, originY);
                    context.quadraticCurveTo(originX + sizeX, originY, originX + sizeX, originY + radius);
                    context.lineTo(originX + sizeX, originY + sizeY - radius);
                    context.quadraticCurveTo(originX + sizeX, originY + sizeY, originX + sizeX - radius, originY + sizeY);
                    context.lineTo(originX + radius, originY + sizeY);
                    context.quadraticCurveTo(originX, originY + sizeY, originX, originY + sizeY - radius);
                    context.lineTo(originX, originY + radius);
                    context.quadraticCurveTo(originX, originY, originX + radius, originY);
                } else {
                    context.rect(originX, originY, sizeX, sizeY);
                }
                context.closePath();
                return this;
            }
        });
        var RenderLoop = boxspring.render.RenderLoop;
        var MEASURED_SIZE_UPDATE_MASK = 1;
        var MEASURED_OFFSET_UPDATE_MASK = 2;
        var OPACITY_UPADTE_MASK = 4;
        var TRANSFORM_UPDATE_MASK = 8;
        var SHADOW_UPDATE_MASK = 16;
        var LAYOUT_UPDATE_MASK = 32;
        var REDRAW_UPDATE_MASK = 64;
        var renderCaches = {};
        var shadowCaches = {};
        var updateDisplayViews = {};
        var updateDisplayMasks = {};
        var updateDisplayWithMask = function(view, mask) {
            if (updateDisplayMasks[view.UID] == null) {
                updateDisplayMasks[view.UID] = 0;
            }
            updateDisplayViews[view.UID] = view;
            updateDisplayMasks[view.UID] |= mask;
            RenderLoop.run(updateDisplay, 500);
            return this;
        };
        var updateDisplay = function() {
            var root = null;
            for (var key in updateDisplayViews) {
                var view = updateDisplayViews[key];
                if (view instanceof boxspring.view.Window) {
                    root = view;
                    break;
                }
                root = updateDisplayViews[key].window;
                if (root) break;
            }
            if (root == null) return;
            if (root.size.x === "auto") root.measuredSize.x = window.innerWidth;
            if (root.size.y === "auto") root.measuredSize.y = window.innerHeight;
            screenContext.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
            composite(root, screenContext);
            updateDisplayViews = {};
            updateDisplayMasks = {};
        };
        var composite = function(view, screen) {
            var mask = updateDisplayMasks[view.UID];
            if (mask & LAYOUT_UPDATE_MASK) {
                view.layoutIfNeeded();
            }
            var sizeX = view.measuredSize.x;
            var sizeY = view.measuredSize.y;
            var offsetX = view.measuredOffset.x;
            var offsetY = view.measuredOffset.y;
            var cache = renderCaches[view.UID];
            if (cache == null) {
                cache = renderCaches[view.UID] = document.createElement("canvas");
                cache.width = sizeX;
                cache.height = sizeY;
            }
            if (mask & REDRAW_UPDATE_MASK) {
                var area = view.__redrawArea;
                if (area === null) {
                    area = new Rectangle;
                    area.size.x = view.measuredSize.x;
                    area.size.y = view.measuredSize.y;
                }
                var context = cache.getContext("2d");
                context.save();
                context.clearRect(area.origin.x, area.origin.y, area.size.x, area.size.y);
                view.redrawIfNeeded(context);
                context.restore();
            }
            if (sizeX && sizeY) screen.drawImage(cache, 0, 0, cache.width, cache.height, offsetX, offsetY, sizeX, sizeY);
            screen.save();
            screen.translate(offsetX, offsetY);
            var children = view.__children;
            for (var i = 0; i < children.length; i++) {
                composite(children[i], screen);
            }
            screen.restore();
        };
        var screenCanvas = null;
        var screenContext = null;
        document.addEventListener("DOMContentLoaded", function(event) {
            screenCanvas = document.createElement("canvas");
            screenCanvas.width = window.innerWidth;
            screenCanvas.height = window.innerHeight;
            document.body.appendChild(screenCanvas);
            screenContext = screenCanvas.getContext("2d");
        });
    },
    "10": function(require, module, exports, global) {
        "use strict";
        var Window = boxspring.define("boxspring.view.Window", {
            inherits: boxspring.view.View,
            onAdd: function(view, e) {
                Window.parent.onAdd.call(this, view);
                view.__setWindow(this);
            },
            onRemove: function(view, e) {
                Window.parent.onRemove.call(this, view);
                view.__setWindow(null);
            }
        });
    },
    "11": function(require, module, exports, global) {
        "use strict";
        var Window = boxspring.override("boxspring.view.Window", {});
    }
});
