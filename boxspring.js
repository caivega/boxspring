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
        require("z");
        require("11");
        require("1g");
        require("1k");
        module.exports = boxspring;
    },
    "1": function(require, module, exports, global) {
        "use strict";
        if (global.boxspring === undefined) {
            global.boxspring = {};
        }
        global._ = require("2");
        _.mixin({
            include: function(array, value) {
                var index = _.indexOf(array, value);
                if (index < 0) array.push(value);
            },
            remove: function(array, value) {
                var index = _.indexOf(array, value);
                if (index > -1) array.splice(index, 1);
            }
        });
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
        boxspring.define = function(name, prototype) {
            var sprototype = null;
            var sconstruct = prototype.inherits || boxspring.Object;
            if (sconstruct) {
                sprototype = sconstruct.prototype;
            }
            var constructor = _.has(prototype, "constructor") ? prototype.constructor : sconstruct ? function() {
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
        var constructors = boxspring.constructors = {};
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
        boxspring.extend = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            _.each(object, function(val, key) {
                if (key === "constructor" || key === "prototype" || key === "parent") return this;
                constructor[key] = val;
            });
            return constructor;
        };
    },
    "5": function(require, module, exports, global) {
        "use strict";
        boxspring.implement = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var prototype = constructor.prototype;
            _.each(object, function(val, key) {
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
        boxspring.override = function(name, prototype) {
            var inherits = boxspring.constructors[name];
            if (inherits == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var sconstruct = inherits;
            var sprototype = inherits.prototype;
            var constructor = _.has(prototype, "constructor") ? prototype.constructor : sconstruct ? function() {
                return sconstruct.apply(this, arguments);
            } : function() {};
            boxspring.constructors[name] = constructor;
            if (sconstruct) {
                constructor.prototype = Object.create(sprototype);
                constructor.prototype.constructor = constructor;
                constructor.parent = sprototype;
            }
            constructor.prototype.$kind = name;
            _.forOwn(sconstruct, function(val, key) {
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
        boxspring.properties = function(name, object) {
            var constructor = boxspring.constructors[name];
            if (constructor == null) {
                throw new Error("The class " + name + " does not exists");
            }
            var parent = constructor.parent;
            var prototype = constructor.prototype;
            var properties = parent ? parent.constructor.$properties : null;
            _.each(object, function(val, key) {
                var name = "__" + key;
                var value = _.has(val, "value") ? val.value : _.has(properties, name) && _.has(properties[name], "value") ? properties[name].value : null;
                var write = _.has(val, "write") ? val.write : _.has(properties, name) && _.has(properties[name], "write") ? properties[name].write : true;
                var clone = _.has(val, "clone") ? val.clone : _.has(properties, name) && _.has(properties[name], "clone") ? properties[name].clone : false;
                var onSet = _.has(val, "onSet") ? val.onSet : _.has(properties, name) && _.has(properties[name], "onSet") ? properties[name].onSet : function(value) {
                    return value;
                };
                var onGet = _.has(val, "onGet") ? val.onGet : _.has(properties, name) && _.has(properties[name], "onGet") ? properties[name].onGet : function(value) {
                    return value;
                };
                var setup = function() {
                    if (_.has(this, name)) return;
                    if (value) switch (true) {
                      case _.isFunction(value):
                        this[name] = value.call(this);
                        return;
                      case _.isArray(value):
                      case _.isObject(value):
                        this[name] = _.clone(value);
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
                    onSet: onSet,
                    onGet: onGet
                };
                Object.defineProperty(prototype, key, {
                    get: function() {
                        var curValue = this[name];
                        var retValue = onGet.call(this, curValue);
                        if (retValue === undefined) {
                            retValue = curValue;
                        }
                        return clone ? _.clone(retValue) : retValue;
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
                        var oldValue = this[name];
                        var newValue = onSet.call(this, value, oldValue);
                        if (newValue === undefined) {
                            newValue = oldValue;
                        }
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
        var O = boxspring.define("boxspring.Object", {
            inherits: null,
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
                this.__bound = {};
                this.__propertyListeners = {};
                this.__propertyObservers = {};
                this.__propertyCaches = {};
                var constructor = this.constructor;
                while (constructor) {
                    var properties = constructor.$properties;
                    if (properties) {
                        for (var key in properties) properties[key].setup.call(this);
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
                return set(this, path, value);
            },
            get: function(path) {
                return get(this, path);
            },
            addPropertyChangeListener: function(property, listener) {
                var listeners = this.__propertyListeners[property];
                if (listeners == null) {
                    listeners = this.__propertyListeners[property] = [];
                }
                var index = listeners.indexOf(listener);
                if (index > -1) return this;
                if (listeners.length === 0) addPropertyChangeObserver(this, this, property);
                listeners.push(listener);
                return this;
            },
            hasPropertyChangeListener: function(property, callback) {
                var listeners = this.__propertyListeners[property];
                if (listeners == null) return false;
                return listeners.indexOf(callback) > -1;
            },
            removePropertyChangeListener: function(property, listener) {
                var listeners = this.__propertyListeners[property];
                if (listeners == null) return this;
                var index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
                if (listeners.length === 0) remPropertyChangeObserver(this, this, property);
                return this;
            },
            removePropertyChangeListeners: function(property) {
                var listeners = this.__propertyListeners[property];
                if (listeners == null) return this;
                delete this.__propertyListeners[property];
                remPropertyChangeObserver(this, this, property);
                return this;
            },
            notifyPropertyChangeListeners: function(property, newValue, oldValue) {
                var event = new boxspring.event.Event("propertychange", false, true);
                event.setTarget(this);
                event.setSource(this);
                if (this.onPropertyChange) {
                    this.onPropertyChange(this, property, newValue, oldValue, event);
                }
                if (event.stopped || event.cancelled) return this;
                var observers = this.__propertyObservers[property];
                if (observers == null) return this;
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
                    event.setParameters([ observerProperty, propertyNewValue, propertyOldValue ]);
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
                    if (bound == null) {
                        bound = this.__bound[name] = _.bind(this[name], this);
                    }
                    return bound;
                }
                throw new Error('Method "' + name + '" does not exists within this object');
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {},
            __propertyListeners: null,
            __propertyObservers: null,
            __propertyCaches: null
        });
        var UID = 0;
        var set = function(object, path, value) {
            var cache = object.__propertyCaches;
            forPath(object, path, function(owner, item, name, head, tail) {
                if (tail === "") {
                    owner[name] = value;
                    cache[path] = {
                        owner: owner,
                        key: name
                    };
                }
            });
            return object;
        };
        var get = function(object, path) {
            var cache = object.__propertyCaches;
            var value = null;
            forPath(object, path, function(owner, item, name, head, tail) {
                if (tail === "") {
                    value = owner[name];
                    cache[path] = {
                        owner: owner,
                        key: name
                    };
                }
            });
            return value;
        };
        var forPath = function(object, path, callback, context) {
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
        };
        var addPropertyChangeObserver = function(object, observer, property, path) {
            forPath(object, path || property, function(owner, value, name, head, tail) {
                var observers = owner.__propertyObservers[name];
                if (observers == null) {
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
            forPath(object, path || property, function(owner, value, name, head, tail) {
                var observers = owner.__propertyObservers[name];
                if (observers == null) return false;
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
        var Point = boxspring.define("boxspring.geom.Point", {
            properties: {
                x: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    onSet: function(value) {
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
    b: function(require, module, exports, global) {
        "use strict";
        var Size = boxspring.define("boxspring.geom.Size", {
            properties: {
                x: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    onSet: function(value) {
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
    c: function(require, module, exports, global) {
        "use strict";
        var Rectangle = boxspring.define("boxspring.geom.Rectangle", {
            statics: {
                union: function(r1, r2) {
                    var x1 = Math.min(r1.origin.x, r2.origin.x);
                    var y1 = Math.min(r1.origin.y, r2.origin.y);
                    var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x);
                    var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y);
                    return new boxspring.geom.Rectangle(x1, y1, x2 - x1, y2 - y1);
                }
            },
            properties: {
                origin: {
                    value: function() {
                        return new boxspring.geom.Point(0, 0);
                    }
                },
                size: {
                    value: function() {
                        return new boxspring.geom.Size(0, 0);
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
    d: function(require, module, exports, global) {
        "use strict";
        var Thickness = boxspring.define("boxspring.geom.Thickness", {
            properties: {
                top: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                bottom: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                left: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                right: {
                    value: 0,
                    onSet: function(value) {
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
    e: function(require, module, exports, global) {
        "use strict";
        var Position = boxspring.define("boxspring.geom.Position", {
            properties: {
                x: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                y: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                top: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                bottom: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                left: {
                    value: 0,
                    onSet: function(value) {
                        return value || 0;
                    }
                },
                right: {
                    value: 0,
                    onSet: function(value) {
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
                switch (property) {
                  case "x":
                    this.left = value;
                    break;
                  case "y":
                    this.top = value;
                    break;
                  case "left":
                    this.x = value;
                    break;
                  case "bottom":
                    this.y = value;
                    break;
                }
                Position.parent.onPropertyChange.apply(this, arguments);
            }
        });
    },
    f: function(require, module, exports, global) {
        "use strict";
        var Transform = boxspring.define("boxspring.geom.Transform", {
            properties: {
                origin: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
                },
                translation: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
                },
                rotation: {
                    value: 0
                },
                scale: {
                    value: function() {
                        return new boxspring.geom.Point(1, 1);
                    }
                },
                shear: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
                }
            }
        });
    },
    g: function(require, module, exports, global) {
        "use strict";
        require("h");
        require("i");
        require("j");
        require("k");
        require("l");
        require("m");
        require("n");
        require("y");
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
            stop: function() {
                this.__stopped = true;
                return this;
            },
            cancel: function() {
                this.__stopped = true;
                this.__canceled = true;
                return this;
            },
            constructor: function(type, bubbleable, cancelable) {
                Event.parent.constructor.call(this);
                this.__bubbleable = bubbleable;
                this.__cancelable = cancelable;
                this.__type = type;
                return this;
            },
            setTarget: function(target) {
                this.__target = target;
                return this;
            },
            setSource: function(source) {
                this.__source = source;
                return this;
            },
            setParameters: function(parameters) {
                this.__parameters = Array.prototype.slice.call(parameters);
                return this;
            }
        });
    },
    i: function(require, module, exports, global) {
        "use strict";
        var TouchEvent = boxspring.define("boxspring.event.TouchEvent", {
            inherits: boxspring.event.Event,
            properties: {
                touches: {
                    write: false
                }
            },
            setTouches: function(touches) {
                this.__touches = touches;
                return this;
            }
        });
    },
    j: function(require, module, exports, global) {
        "use strict";
        var MouseEvent = boxspring.define("boxspring.event.MouseEvent", {
            inherits: boxspring.event.Event
        });
    },
    k: function(require, module, exports, global) {
        "use strict";
        var Emitter = boxspring.define("boxspring.event.Emitter", {
            properties: {
                parentReceiver: {
                    write: false
                }
            },
            constructor: function() {
                Emitter.parent.constructor.call(this);
                this.__listeners = {};
                return this;
            },
            addListener: function(type, listener) {
                type = type.toLowerCase();
                if (type === "propertychange") {
                    if (this.addPropertyChangeListener) {
                        this.addPropertyChangeListener(arguments[1], arguments[2]);
                        return this;
                    }
                }
                var listeners = this.__listeners[type];
                if (listeners == null) {
                    listeners = this.__listeners[type] = [];
                }
                _.include(listeners, listener);
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
                var listeners = this.__listeners[type];
                if (listeners == null) return false;
                return listeners.indexOf(listener) > -1;
            },
            removeListener: function(type, listener) {
                type = type.toLowerCase();
                if (type === "propertychange") {
                    if (this.removePropertyListener) {
                        this.removePropertyListener(arguments[1], arguments[2]);
                        return this;
                    }
                }
                var listeners = this.__listeners[type];
                if (listeners == null) return false;
                _.remove(listeners, listener);
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
                var callback = function() {
                    listener.apply(this, arguments);
                    this.removeListener(type, callback);
                };
                return this.addListener(type, callback);
            },
            emit: function(event) {
                if (typeof event === "string") {
                    event = new boxspring.event.Event(event, false, true);
                }
                var parameters = slice.call(arguments, 1);
                if (parameters.length) {
                    event.setParameters(parameters);
                }
                if (event.source === null) {
                    event.setSource(this);
                }
                event.setTarget(this);
                var listeners = this.__listeners && this.__listeners[event.type];
                if (listeners) {
                    var args = event.parameters;
                    args.push(event);
                    for (var i = 0, l = listeners.length; i < l; i++) {
                        listeners[i].apply(this, args);
                    }
                }
                if (!event.bubbleable || event.stopped) return this;
                var parentReceiver = this.parentReceiver;
                if (parentReceiver instanceof Emitter) {
                    parentReceiver.emit.call(parentReceiver, event);
                }
                return this;
            },
            setParentReceiver: function(receiver) {
                this.__parentReceiver = receiver;
                return this;
            },
            __listeners: null
        });
        var slice = Array.prototype.slice;
    },
    l: function(require, module, exports, global) {
        "use strict";
        var Forwarder = boxspring.define("boxspring.event.Forwarder", {
            properties: {
                receiver: {}
            },
            constructor: function(receiver) {
                Forwarder.parent.constructor.call(this);
                this.receiver = receiver;
                return this;
            }
        });
    },
    m: function(require, module, exports, global) {
        "use strict";
        var MouseForwarder = boxspring.define("boxspring.event.MouseForwarder", {
            inherits: boxspring.event.Forwarder,
            constructor: function(receiver) {
                MouseForwarder.parent.constructor.call(this, receiver);
                window.addEventListener("mousedown", this.bind("onMouseDown"));
                window.addEventListener("mousemove", this.bind("onMouseMove"));
                window.addEventListener("mouseup", this.bind("onMouseUp"));
                window.addEventListener("click", this.bind("onClick"));
                return this;
            },
            destroy: function() {
                window.removeEventListener("mousedown", this.bind("onMouseDown"));
                window.removeEventListener("mousemove", this.bind("onMouseMove"));
                window.removeEventListener("mouseup", this.bind("onMouseUp"));
                window.removeEventListener("click", this.bind("onClick"));
                MouseForwarder.parent.destroy.call(this);
            },
            onMouseDown: function(e) {},
            onMouseMove: function(e) {},
            onMouseUp: function(e) {},
            onClick: function(e) {}
        });
    },
    n: function(require, module, exports, global) {
        "use strict";
        var Map = require("o");
        var TouchForwarder = boxspring.define("boxspring.event.TouchForwarder", {
            inherits: boxspring.event.Forwarder,
            properties: {
                touches: {
                    value: {}
                }
            },
            constructor: function(receiver) {
                TouchForwarder.parent.constructor.apply(this, arguments);
                document.addEventListener("touchcancel", this.bind("onTouchCancel"));
                document.addEventListener("touchstart", this.bind("onTouchStart"));
                document.addEventListener("touchmove", this.bind("onTouchMove"));
                document.addEventListener("touchend", this.bind("onTouchEnd"));
                return this;
            },
            destroy: function() {
                this.touches = null;
                document.removeEventListener("touchcancel", this.bind("onTouchCancel"));
                document.removeEventListener("touchstart", this.bind("onTouchStart"));
                document.removeEventListener("touchmove", this.bind("onTouchMove"));
                document.removeEventListener("touchend", this.bind("onTouchEnd"));
                TouchForwarder.parent.destroy.call(this);
            },
            onTouchCancel: function(e) {
                var targets = new Map;
                _.each(e.changedTouches, function(t) {
                    var touch = this.touches[t.identifier];
                    if (touch === undefined) return;
                    delete this.touches[t.identifier];
                    var touches = targets.get(touch.target);
                    if (touches === null) {
                        targets.set(touch.target, touches = []);
                    }
                    touches.push(touch);
                });
                var all = _.clone(this.touches);
                targets.forEach(function(touches, target) {
                    target.emit(new boxspring.event.TouchEvent("touchcancel", true, true, all), touches);
                }, this);
            },
            onTouchStart: function(e) {
                var targets = new Map;
                _.each(e.changedTouches, function(t) {
                    var x = t.pageX;
                    var y = t.pageY;
                    var target = this.receiver.viewAtPoint(x, y);
                    if (target) {
                        var touch = new boxspring.event.Touch;
                        touch.setLocation(x, y);
                        touch.setTarget(target);
                        this.touches[t.identifier] = touch;
                        var touches = targets.get(target);
                        if (touches === null) {
                            targets.set(target, touches = []);
                        }
                        touches.push(touch);
                    }
                }, this);
                var all = _.clone(this.touches);
                targets.forEach(function(touches, target) {
                    target.emit(new boxspring.event.TouchEvent("touchstart", true, true, all), touches);
                });
            },
            onTouchMove: function(e) {
                var targets = new Map;
                _.each(e.changedTouches, function(t) {
                    var touch = this.touches[t.identifier];
                    if (touch === undefined) return;
                    touch.setLocation(t.pageX, t.pageY);
                    var touches = targets.get(touch.target);
                    if (touches === null) {
                        targets.set(touch.target, touches = []);
                    }
                    touches.push(touch);
                }, this);
                var all = _.clone(this.touches);
                targets.forEach(function(touches, target) {
                    target.emit(new boxspring.event.TouchEvent("touchmove", true, true, all), touches);
                });
            },
            onTouchEnd: function(e) {
                var targets = new Map;
                _.each(e.changedTouches, function(t) {
                    var touch = this.touches[t.identifier];
                    if (touch === undefined) return;
                    delete this.touches[t.identifier];
                    var touches = targets.get(touch.target);
                    if (touches === null) {
                        targets.set(touch.target, touches = []);
                    }
                    touches.push(touch);
                }, this);
                var all = _.clone(this.touches);
                targets.forEach(function(touches, target) {
                    target.emit(new boxspring.event.TouchEvent("touchend", true, true, all), touches);
                });
            }
        });
    },
    o: function(require, module, exports, global) {
        "use strict";
        var prime = require("p"), indexOf = require("x");
        var Map = prime({
            constructor: function Map() {
                if (!this instanceof Map) return new Map;
                this.length = 0;
                this._values = [];
                this._keys = [];
            },
            set: function(key, value) {
                var index = indexOf(this._keys, key);
                if (index === -1) {
                    this._keys.push(key);
                    this._values.push(value);
                    this.length++;
                } else {
                    this._values[index] = value;
                }
                return this;
            },
            get: function(key) {
                var index = indexOf(this._keys, key);
                return index === -1 ? null : this._values[index];
            },
            count: function() {
                return this.length;
            },
            forEach: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (method.call(context, this._values[i], this._keys[i], this) === false) break;
                }
                return this;
            },
            map: function(method, context) {
                var results = new Map;
                this.forEach(function(value, key) {
                    results.set(key, method.call(context, value, key, this));
                }, this);
                return results;
            },
            filter: function(method, context) {
                var results = new Map;
                this.forEach(function(value, key) {
                    if (method.call(context, value, key, this)) results.set(key, value);
                }, this);
                return results;
            },
            every: function(method, context) {
                var every = true;
                this.forEach(function(value, key) {
                    if (!method.call(context, value, key, this)) return every = false;
                }, this);
                return every;
            },
            some: function(method, context) {
                var some = false;
                this.forEach(function(value, key) {
                    if (method.call(context, value, key, this)) return !(some = true);
                }, this);
                return some;
            },
            indexOf: function(value) {
                var index = indexOf(this._values, value);
                return index > -1 ? this._keys[index] : null;
            },
            remove: function(value) {
                var index = indexOf(this._values, value);
                if (index !== -1) {
                    this._values.splice(index, 1);
                    this.length--;
                    return this._keys.splice(index, 1)[0];
                }
                return null;
            },
            unset: function(key) {
                var index = indexOf(this._keys, key);
                if (index !== -1) {
                    this._keys.splice(index, 1);
                    this.length--;
                    return this._values.splice(index, 1)[0];
                }
                return null;
            },
            keys: function() {
                return this._keys.slice();
            },
            values: function() {
                return this._values.slice();
            }
        });
        module.exports = Map;
    },
    p: function(require, module, exports, global) {
        "use strict";
        var hasOwn = require("q"), forIn = require("r"), mixIn = require("s"), filter = require("u"), create = require("v"), type = require("w");
        var defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        try {
            defineProperty({}, "~", {});
            getOwnPropertyDescriptor({}, "~");
        } catch (e) {
            defineProperty = null;
            getOwnPropertyDescriptor = null;
        }
        var define = function(value, key, from) {
            defineProperty(this, key, getOwnPropertyDescriptor(from, key) || {
                writable: true,
                enumerable: true,
                configurable: true,
                value: value
            });
        };
        var copy = function(value, key) {
            this[key] = value;
        };
        var implement = function(proto) {
            forIn(proto, defineProperty ? define : copy, this.prototype);
            return this;
        };
        var verbs = /^constructor|inherits|mixin$/;
        var prime = function(proto) {
            if (type(proto) === "function") proto = {
                constructor: proto
            };
            var superprime = proto.inherits;
            var constructor = hasOwn(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superprime.apply(this, arguments);
            } : function() {};
            if (superprime) {
                mixIn(constructor, superprime);
                var superproto = superprime.prototype;
                var cproto = constructor.prototype = create(superproto);
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            if (!constructor.implement) constructor.implement = implement;
            var mixins = proto.mixin;
            if (mixins) {
                if (type(mixins) !== "array") mixins = [ mixins ];
                for (var i = 0; i < mixins.length; i++) constructor.implement(create(mixins[i].prototype));
            }
            return constructor.implement(filter(proto, function(value, key) {
                return !key.match(verbs);
            }));
        };
        module.exports = prime;
    },
    q: function(require, module, exports, global) {
        "use strict";
        var hasOwnProperty = Object.hasOwnProperty;
        var hasOwn = function(self, key) {
            return hasOwnProperty.call(self, key);
        };
        module.exports = hasOwn;
    },
    r: function(require, module, exports, global) {
        "use strict";
        var has = require("q");
        var forIn = function(self, method, context) {
            for (var key in self) if (method.call(context, self[key], key, self) === false) break;
            return self;
        };
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",");
            var proto = Object.prototype;
            forIn = function(self, method, context) {
                for (var key in self) if (method.call(context, self[key], key, self) === false) return self;
                for (var i = 0; key = buggy[i]; i++) {
                    var value = self[key];
                    if ((value !== proto[key] || has(self, key)) && method.call(context, value, key, self) === false) break;
                }
                return self;
            };
        }
        module.exports = forIn;
    },
    s: function(require, module, exports, global) {
        "use strict";
        var forOwn = require("t");
        var copy = function(value, key) {
            this[key] = value;
        };
        var mixIn = function(self) {
            for (var i = 1, l = arguments.length; i < l; i++) forOwn(arguments[i], copy, self);
            return self;
        };
        module.exports = mixIn;
    },
    t: function(require, module, exports, global) {
        "use strict";
        var forIn = require("r"), hasOwn = require("q");
        var forOwn = function(self, method, context) {
            forIn(self, function(value, key) {
                if (hasOwn(self, key)) return method.call(context, value, key, self);
            });
            return self;
        };
        module.exports = forOwn;
    },
    u: function(require, module, exports, global) {
        "use strict";
        var forIn = require("r");
        var filter = function(self, method, context) {
            var results = {};
            forIn(self, function(value, key) {
                if (method.call(context, value, key, self)) results[key] = value;
            });
            return results;
        };
        module.exports = filter;
    },
    v: function(require, module, exports, global) {
        "use strict";
        var create = function(self) {
            var constructor = function() {};
            constructor.prototype = self;
            return new constructor;
        };
        module.exports = create;
    },
    w: function(require, module, exports, global) {
        "use strict";
        var toString = Object.prototype.toString, types = /number|object|array|string|function|date|regexp|boolean/;
        var type = function(object) {
            if (object == null) return "null";
            var string = toString.call(object).slice(8, -1).toLowerCase();
            if (string === "number" && isNaN(object)) return "null";
            if (types.test(string)) return string;
            return "object";
        };
        module.exports = type;
    },
    x: function(require, module, exports, global) {
        "use strict";
        var indexOf = function(self, item, from) {
            for (var l = self.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                if (self[i] === item) return i;
            }
            return -1;
        };
        module.exports = indexOf;
    },
    y: function(require, module, exports, global) {
        "use strict";
        var Touch = boxspring.define("boxspring.event.Touch", {
            properties: {
                identifier: {
                    write: false,
                    value: function() {
                        return (UID++).toString(36);
                    }
                },
                target: {
                    write: false
                },
                location: {
                    write: false,
                    value: function() {
                        return new boxspring.geom.Point(0, 0);
                    }
                }
            },
            setTarget: function(target) {
                this.__target = target;
                return this;
            },
            setLocation: function(x, y) {
                this.__location.x = x;
                this.__location.y = y;
                return this;
            }
        });
        var UID = Date.now();
    },
    z: function(require, module, exports, global) {
        "use strict";
        require("10");
    },
    "10": function(require, module, exports, global) {
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
                this.__levels = [];
                this.__queues = {};
                return this;
            },
            destroy: function() {
                this.__levels = null;
                this.__queues = null;
                RenderLoop.parent.destroy.call(this);
            },
            run: function(action, level) {
                if (level == null) {
                    level = RenderLoop.DEFAULT_PRIORITY;
                }
                _.include(this.__levels, level);
                var queue = this.__queues[level];
                if (queue == null) {
                    queue = this.__queues[level] = [];
                }
                var index = queue.indexOf(action);
                if (index === -1) {
                    queue.push(action);
                    if (this.__request == null) {
                        this.__request = requestFrame(this.bind("loop"));
                    }
                    if (this.__processing && this.__processingLevel >= level) {
                        this.__reschedule = true;
                    }
                    this.__actions++;
                }
                return this;
            },
            cancel: function(action) {
                for (var level in this.__queues) {
                    var queue = this.__queues[level];
                    var index = queue.indexOf(action);
                    if (index > -1) {
                        queue.splice(index, 1);
                        this.__actions--;
                        break;
                    }
                }
                if (this.__actions === 0) {
                    this.__request = cancelFrame(this.bind("loop"));
                }
                return this;
            },
            loop: function() {
                var now = Date.now();
                this.__processing = true;
                this.__levels.sort();
                for (var i = 0; i < this.__levels.length; i++) {
                    var level = this.__levels[i];
                    var queue = this.__queues[level];
                    if (queue.length === 0) continue;
                    this.__queues[level] = [];
                    this.__processingLevel = level;
                    this.__processingQueue = queue;
                    for (var j = 0; j < queue.length; j++) {
                        this.__processingAction = queue[j];
                        this.__processingAction.call(null, now);
                        this.__processingAction = null;
                        this.__actions--;
                    }
                }
                this.__processing = false;
                this.__processingQueue = null;
                this.__processingLevel = null;
                if (this.__reschedule) {
                    this.__reschedule = false;
                    this.__request = requestFrame(this.bind("loop"));
                } else {
                    this.__request = null;
                }
                return this;
            },
            __levels: null,
            __queues: null,
            __request: null,
            __actions: 0,
            __processing: false,
            __processingLevel: null,
            __processingQueue: null,
            __processingAction: null,
            __reschedule: false
        });
        var instance = new RenderLoop;
        RenderLoop.DEFAULT_PRIORITY = 50;
        RenderLoop.ANIMATION_PRIORITY = 250;
        RenderLoop.RENDER_PRIORITY = 500;
        var cancelFrame = webkitCancelAnimationFrame;
        var requestFrame = webkitRequestAnimationFrame;
    },
    "11": function(require, module, exports, global) {
        "use strict";
        require("12");
        require("13");
        require("16");
        require("17");
        require("18");
        require("19");
        require("1b");
        require("1c");
        require("1d");
        require("1e");
        require("1f");
    },
    "12": function(require, module, exports, global) {
        "use strict";
        var TypeEvaluator = boxspring.define("boxspring.animation.TypeEvaluator", {
            evaluate: function(progress, from, to) {}
        });
    },
    "13": function(require, module, exports, global) {
        "use strict";
        var parse = require("14");
        var ColorEvaluator = boxspring.define("boxspring.animation.ColorEvaluator", {
            inherit: boxspring.animation.TypeEvaluator,
            evaluate: function(progress, from, to) {
                var f = parse(from);
                var t = parse(to);
                if (f.a == null) f.a = 1;
                if (t.a == null) t.a = 1;
                var r = Math.round(progress * (t.r - f.r) + f.r);
                var g = Math.round(progress * (t.g - f.g) + f.g);
                var b = Math.round(progress * (t.b - f.b) + f.b);
                var a = progress * (t.a - f.a) + f.a;
                a = Math.round(a * 100) / 100;
                return "rgba(" + r + "," + g + "," + b + "," + a + ")";
            }
        });
    },
    "14": function(require, module, exports, global) {
        var colors = require("15");
        module.exports = parse;
        function parse(str) {
            return named(str) || hex3(str) || hex6(str) || rgb(str) || rgba(str);
        }
        function named(str) {
            var c = colors[str.toLowerCase()];
            if (!c) return;
            return {
                r: c[0],
                g: c[1],
                b: c[2]
            };
        }
        function rgb(str) {
            if (0 == str.indexOf("rgb(")) {
                str = str.match(/rgb\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: 1
                };
            }
        }
        function rgba(str) {
            if (0 == str.indexOf("rgba(")) {
                str = str.match(/rgba\(([^)]+)\)/)[1];
                var parts = str.split(/ *, */).map(Number);
                return {
                    r: parts[0],
                    g: parts[1],
                    b: parts[2],
                    a: parts[3]
                };
            }
        }
        function hex6(str) {
            if ("#" == str[0] && 7 == str.length) {
                return {
                    r: parseInt(str.slice(1, 3), 16),
                    g: parseInt(str.slice(3, 5), 16),
                    b: parseInt(str.slice(5, 7), 16),
                    a: 1
                };
            }
        }
        function hex3(str) {
            if ("#" == str[0] && 4 == str.length) {
                return {
                    r: parseInt(str[1] + str[1], 16),
                    g: parseInt(str[2] + str[2], 16),
                    b: parseInt(str[3] + str[3], 16),
                    a: 1
                };
            }
        }
    },
    "15": function(require, module, exports, global) {
        module.exports = {
            aliceblue: [ 240, 248, 255 ],
            antiquewhite: [ 250, 235, 215 ],
            aqua: [ 0, 255, 255 ],
            aquamarine: [ 127, 255, 212 ],
            azure: [ 240, 255, 255 ],
            beige: [ 245, 245, 220 ],
            bisque: [ 255, 228, 196 ],
            black: [ 0, 0, 0 ],
            blanchedalmond: [ 255, 235, 205 ],
            blue: [ 0, 0, 255 ],
            blueviolet: [ 138, 43, 226 ],
            brown: [ 165, 42, 42 ],
            burlywood: [ 222, 184, 135 ],
            cadetblue: [ 95, 158, 160 ],
            chartreuse: [ 127, 255, 0 ],
            chocolate: [ 210, 105, 30 ],
            coral: [ 255, 127, 80 ],
            cornflowerblue: [ 100, 149, 237 ],
            cornsilk: [ 255, 248, 220 ],
            crimson: [ 220, 20, 60 ],
            cyan: [ 0, 255, 255 ],
            darkblue: [ 0, 0, 139 ],
            darkcyan: [ 0, 139, 139 ],
            darkgoldenrod: [ 184, 132, 11 ],
            darkgray: [ 169, 169, 169 ],
            darkgreen: [ 0, 100, 0 ],
            darkgrey: [ 169, 169, 169 ],
            darkkhaki: [ 189, 183, 107 ],
            darkmagenta: [ 139, 0, 139 ],
            darkolivegreen: [ 85, 107, 47 ],
            darkorange: [ 255, 140, 0 ],
            darkorchid: [ 153, 50, 204 ],
            darkred: [ 139, 0, 0 ],
            darksalmon: [ 233, 150, 122 ],
            darkseagreen: [ 143, 188, 143 ],
            darkslateblue: [ 72, 61, 139 ],
            darkslategray: [ 47, 79, 79 ],
            darkslategrey: [ 47, 79, 79 ],
            darkturquoise: [ 0, 206, 209 ],
            darkviolet: [ 148, 0, 211 ],
            deeppink: [ 255, 20, 147 ],
            deepskyblue: [ 0, 191, 255 ],
            dimgray: [ 105, 105, 105 ],
            dimgrey: [ 105, 105, 105 ],
            dodgerblue: [ 30, 144, 255 ],
            firebrick: [ 178, 34, 34 ],
            floralwhite: [ 255, 255, 240 ],
            forestgreen: [ 34, 139, 34 ],
            fuchsia: [ 255, 0, 255 ],
            gainsboro: [ 220, 220, 220 ],
            ghostwhite: [ 248, 248, 255 ],
            gold: [ 255, 215, 0 ],
            goldenrod: [ 218, 165, 32 ],
            gray: [ 128, 128, 128 ],
            green: [ 0, 128, 0 ],
            greenyellow: [ 173, 255, 47 ],
            grey: [ 128, 128, 128 ],
            honeydew: [ 240, 255, 240 ],
            hotpink: [ 255, 105, 180 ],
            indianred: [ 205, 92, 92 ],
            indigo: [ 75, 0, 130 ],
            ivory: [ 255, 255, 240 ],
            khaki: [ 240, 230, 140 ],
            lavender: [ 230, 230, 250 ],
            lavenderblush: [ 255, 240, 245 ],
            lawngreen: [ 124, 252, 0 ],
            lemonchiffon: [ 255, 250, 205 ],
            lightblue: [ 173, 216, 230 ],
            lightcoral: [ 240, 128, 128 ],
            lightcyan: [ 224, 255, 255 ],
            lightgoldenrodyellow: [ 250, 250, 210 ],
            lightgray: [ 211, 211, 211 ],
            lightgreen: [ 144, 238, 144 ],
            lightgrey: [ 211, 211, 211 ],
            lightpink: [ 255, 182, 193 ],
            lightsalmon: [ 255, 160, 122 ],
            lightseagreen: [ 32, 178, 170 ],
            lightskyblue: [ 135, 206, 250 ],
            lightslategray: [ 119, 136, 153 ],
            lightslategrey: [ 119, 136, 153 ],
            lightsteelblue: [ 176, 196, 222 ],
            lightyellow: [ 255, 255, 224 ],
            lime: [ 0, 255, 0 ],
            limegreen: [ 50, 205, 50 ],
            linen: [ 250, 240, 230 ],
            magenta: [ 255, 0, 255 ],
            maroon: [ 128, 0, 0 ],
            mediumaquamarine: [ 102, 205, 170 ],
            mediumblue: [ 0, 0, 205 ],
            mediumorchid: [ 186, 85, 211 ],
            mediumpurple: [ 147, 112, 219 ],
            mediumseagreen: [ 60, 179, 113 ],
            mediumslateblue: [ 123, 104, 238 ],
            mediumspringgreen: [ 0, 250, 154 ],
            mediumturquoise: [ 72, 209, 204 ],
            mediumvioletred: [ 199, 21, 133 ],
            midnightblue: [ 25, 25, 112 ],
            mintcream: [ 245, 255, 250 ],
            mistyrose: [ 255, 228, 225 ],
            moccasin: [ 255, 228, 181 ],
            navajowhite: [ 255, 222, 173 ],
            navy: [ 0, 0, 128 ],
            oldlace: [ 253, 245, 230 ],
            olive: [ 128, 128, 0 ],
            olivedrab: [ 107, 142, 35 ],
            orange: [ 255, 165, 0 ],
            orangered: [ 255, 69, 0 ],
            orchid: [ 218, 112, 214 ],
            palegoldenrod: [ 238, 232, 170 ],
            palegreen: [ 152, 251, 152 ],
            paleturquoise: [ 175, 238, 238 ],
            palevioletred: [ 219, 112, 147 ],
            papayawhip: [ 255, 239, 213 ],
            peachpuff: [ 255, 218, 185 ],
            peru: [ 205, 133, 63 ],
            pink: [ 255, 192, 203 ],
            plum: [ 221, 160, 203 ],
            powderblue: [ 176, 224, 230 ],
            purple: [ 128, 0, 128 ],
            red: [ 255, 0, 0 ],
            rosybrown: [ 188, 143, 143 ],
            royalblue: [ 65, 105, 225 ],
            saddlebrown: [ 139, 69, 19 ],
            salmon: [ 250, 128, 114 ],
            sandybrown: [ 244, 164, 96 ],
            seagreen: [ 46, 139, 87 ],
            seashell: [ 255, 245, 238 ],
            sienna: [ 160, 82, 45 ],
            silver: [ 192, 192, 192 ],
            skyblue: [ 135, 206, 235 ],
            slateblue: [ 106, 90, 205 ],
            slategray: [ 119, 128, 144 ],
            slategrey: [ 119, 128, 144 ],
            snow: [ 255, 255, 250 ],
            springgreen: [ 0, 255, 127 ],
            steelblue: [ 70, 130, 180 ],
            tan: [ 210, 180, 140 ],
            teal: [ 0, 128, 128 ],
            thistle: [ 216, 191, 216 ],
            tomato: [ 255, 99, 71 ],
            turquoise: [ 64, 224, 208 ],
            violet: [ 238, 130, 238 ],
            wheat: [ 245, 222, 179 ],
            white: [ 255, 255, 255 ],
            whitesmoke: [ 245, 245, 245 ],
            yellow: [ 255, 255, 0 ],
            yellowgreen: [ 154, 205, 5 ]
        };
    },
    "16": function(require, module, exports, global) {
        "use strict";
        var ImageEvaluator = boxspring.define("boxspring.animation.ImageEvaluator", {
            inherit: boxspring.animation.TypeEvaluator,
            evaluate: function(progress, from, to) {
                return to;
            }
        });
    },
    "17": function(require, module, exports, global) {
        "use strict";
        var NumberEvaluator = boxspring.define("boxspring.animation.NumberEvaluator", {
            inherit: boxspring.animation.TypeEvaluator,
            evaluate: function(progress, from, to) {
                return progress * (to - from) + from;
            }
        });
    },
    "18": function(require, module, exports, global) {
        "use strict";
        var AnimationScheduler = boxspring.define("boxspring.animation.AnimationScheduler", {
            statics: {
                add: function(animation) {
                    animation.on("start", onAnimationStart);
                    animation.on("pause", onAnimationPause);
                    animation.on("end", onAnimationEnd);
                },
                remove: function(animation) {
                    animation.off("start", onAnimationStart);
                    animation.off("pause", onAnimationPause);
                    animation.off("end", onAnimationEnd);
                }
            }
        });
        var animations = [];
        var play = function() {
            boxspring.render.RenderLoop.run(tick, boxspring.render.RenderLoop.ANIMATION_PRIORITY);
        };
        var stop = function() {
            boxspring.render.RenderLoop.cancel(tick);
        };
        var tick = function(now) {
            for (var i = animations.length - 1; i >= 0; i--) {
                var animation = animations[i];
                if (animation) {
                    animation.tick(now);
                }
            }
            if (animations.length) play();
        };
        var onAnimationStart = function(e) {
            _.include(animations, e.source);
            if (animations.length === 1) play();
        };
        var onAnimationPause = function(e) {
            _.remove(animations, e.source);
            if (animations.length === 0) stop();
        };
        var onAnimationEnd = function(e) {
            _.remove(animations, e.source);
            if (animations.length === 0) stop();
        };
    },
    "19": function(require, module, exports, global) {
        "use strict";
        var bezier = require("1a");
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
                    value: 0,
                    onSet: function(value) {
                        if (value === true) return Infinity;
                    }
                },
                running: {
                    value: false,
                    write: false
                }
            },
            constructor: function() {
                Animation.parent.constructor.call(this);
                this.on("start", this.bind("onStart"));
                this.on("pause", this.bind("onPause"));
                this.on("end", this.bind("onEnd"));
                return this;
            },
            destroy: function() {
                this.off("start", this.bind("onStart"));
                this.off("pause", this.bind("onPause"));
                this.off("end", this.bind("onEnd"));
                Animation.parent.destroy.call(this);
            },
            start: function() {
                if (this.__running) return this;
                var time = Date.now();
                if (this.__pauseTime) {
                    this.__pauseTime = 0;
                    time = time - this.__progress * this.duration;
                } else {
                    this.__progressTo = 0;
                    this.__progressFrom = 0;
                }
                this.__running = true;
                this.__startTime = time;
                this.__tweenTime = time;
                this.__pauseTime = 0;
                this.__progress = 0;
                this.__curve = parse(this.equation, this.duration);
                this.emit("start");
                return this;
            },
            pause: function() {
                if (this.__running === false) return this;
                this.__running = false;
                this.__startTime = 0;
                this.__tweenTime = 0;
                this.__pauseTime = Date.now();
                this.emit("pause");
                return this;
            },
            end: function() {
                if (this.running === false) return this;
                var p = this.__progress;
                var t = this.__progressTo;
                if (p !== t) this.progress(t);
                this.__running = false;
                this.__startTime = 0;
                this.__pauseTime = 0;
                this.__tweenTime = 0;
                this.__progress = 0;
                this.__progressTo = 0;
                this.__progressFrom = 0;
                this.emit("end");
                return this;
            },
            tick: function(now) {
                var time = this.__tweenTime;
                if (time) {
                    var factor = (now - time) / this.duration;
                    if (factor > 1) {
                        factor = 1;
                    }
                    var f = null;
                    var t = null;
                    var p = null;
                    if (this.__reversed) {
                        t = this.__progressTo = 0;
                        f = this.__progressFrom = 1;
                    } else {
                        t = this.__progressTo = 1;
                        f = this.__progressFrom = 0;
                    }
                    p = this.__progress = compute(f, t, this.__curve(factor));
                    this.progress(p);
                    if (factor === 1) {
                        var repeat = this.reverse ? this.repeat * 2 - 1 : this.repeat;
                        var repeated = ++this.__repeated;
                        if (repeated >= repeat) {
                            this.end();
                            return;
                        }
                        if (this.reverse) this.__reversed = !this.__reversed;
                        this.__tweenTime = now;
                    }
                }
            },
            progress: function(progress) {},
            onStart: function(e) {},
            onPause: function(e) {},
            onEnd: function(e) {},
            __curve: null,
            __startTime: 0,
            __pauseTime: 0,
            __tweenTime: 0,
            __progress: 0,
            __progressTo: 0,
            __progressFrom: 0,
            __repeated: 0,
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
        var parse = function(equation, duration) {
            if (typeof equation === "function") return equation;
            equation = equations[equation] || equation;
            equation = equation.replace(/\s+/g, "");
            equation = equation.match(/cubic-bezier\(([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)\)/);
            return bezier(+equation[1], +equation[2], +equation[3], +equation[4], 1e3 / 60 / duration / 4);
        };
    },
    "1a": function(require, module, exports, global) {
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
    "1b": function(require, module, exports, global) {
        "use strict";
        var AnimationScheduler = boxspring.animation.AnimationScheduler;
        var AnimationGroup = boxspring.define("boxspring.animation.AnimationGroup", {
            inherits: boxspring.animation.Animation,
            properties: {
                animations: {
                    write: false,
                    clone: true,
                    value: []
                }
            },
            constructor: function() {
                AnimationGroup.parent.constructor.call(this);
                AnimationScheduler.add(this);
                return this;
            },
            destroy: function() {
                _.invoke(this.__animations, "destroy");
                AnimationScheduler.remove(this);
                AnimationGroup.parent.destroy.call(this);
            },
            progress: function(progress) {
                _.invoke(this.__animations, "progress", progress);
            },
            addAnimation: function(animation) {
                _.include(this.__animations, animation);
                return this;
            },
            removeAnimation: function(animation) {
                _.remove(this.__animations, animation);
                return this;
            },
            removeAllAnimations: function(animation) {
                this.__animations = [];
                return this;
            },
            animationAt: function(index) {
                return this.__animations[index] || null;
            }
        });
    },
    "1c": function(require, module, exports, global) {
        "use strict";
        var AnimationScheduler = boxspring.animation.AnimationScheduler;
        var ValueAnimation = boxspring.define("boxspring.animation.ValueAnimation", {
            inherits: boxspring.animation.Animation,
            properties: {
                evaluator: {
                    value: function() {
                        return new boxspring.animation.NumberEvaluator;
                    }
                },
                value: {},
                from: {},
                to: {}
            },
            constructor: function() {
                ValueAnimation.parent.constructor.call(this);
                this.on("update", this.bind("onUpdate"));
                AnimationScheduler.add(this);
                return this;
            },
            destroy: function() {
                AnimationScheduler.remove(this);
                this.off("update", this.bind("onUpdate"));
                ValueAnimation.parent.destroy.call(this);
            },
            progress: function(progress) {
                this.emit("update", this.value = this.evaluator.evaluate(progress, this.from, this.to));
            },
            onUpdate: function(value) {}
        });
    },
    "1d": function(require, module, exports, global) {
        "use strict";
        var ObjectAnimation = boxspring.define("boxspring.animation.ObjectAnimation", {
            inherits: boxspring.animation.ValueAnimation,
            properties: {
                target: {},
                property: {}
            },
            progress: function(progress) {
                PropertyAnimation.parent.progress.apply(this, arguments);
                var target = this.target;
                if (target == null) throw new Error("Missing target for object animator");
                var property = this.property;
                if (property == null) throw new Error("Missing property for object animator");
                target.set(property, this.value);
            }
        });
    },
    "1e": function(require, module, exports, global) {
        "use strict";
        var ViewPropertyAnimation = boxspring.define("boxspring.animation.ViewPropertyAnimation", {
            inherits: boxspring.animation.ValueAnimation,
            properties: {
                view: {},
                property: {}
            },
            onPropertyChange: function(target, property, value) {
                ViewPropertyAnimation.parent.onPropertyChange.apply(this, arguments);
                if (property === "property" || property === "view" && value) {
                    var view = this.view;
                    if (view == null) return;
                    var evaluator = view.animatedPropertyEvaluator(this.property);
                    if (evaluator == null) throw new Error("Property " + this.property + " is not animatable");
                    this.evaluator = evaluator;
                }
            },
            onStart: function(e) {
                this.view.emit("propertyanimationstart", this.property, this.from);
            },
            onPause: function(e) {
                this.view.emit("propertyanimationpause", this.property, this.from);
            },
            onUpdate: function(e) {
                this.view.emit("propertyanimationupdate", this.property, this.value);
            },
            onEnd: function(e) {
                this.view.emit("propertyanimationend", this.property, this.value);
            }
        });
    },
    "1f": function(require, module, exports, global) {
        "use strict";
        var AnimationScheduler = boxspring.animation.AnimationScheduler;
        var PropertyAnimation = boxspring.animation.PropertyAnimation;
        var ViewPropertyTransaction = boxspring.define("boxspring.animation.ViewPropertyTransaction", {
            inherits: boxspring.animation.AnimationGroup,
            constructor: function() {
                ViewPropertyTransaction.parent.constructor.call(this);
                _.include(instances, this);
                this.__animatedViews = {};
                this.__animatedItems = {};
                this.__animatedProperties = {};
                return this;
            },
            destroy: function() {
                _.remove(instances, this);
                this.__animatedViews = null;
                this.__animatedItems = null;
                this.__animatedProperties = null;
                ViewPropertyTransaction.parent.destroy.call(this);
            },
            addAnimatedProperty: function(view, property, from, to) {
                this.__animatedViews[view.UID] = view;
                var animations = this.__animatedProperties[property];
                if (animations == null) {
                    animations = this.__animatedProperties[property] = {};
                }
                for (var i = 0; i < instances.length; i++) {
                    var transaction = instances[i];
                    if (transaction === this) continue;
                    var animation = transaction.animationForViewProperty(view, property);
                    if (animation === null) continue;
                    transaction.removeAnimatedProperty(view, property);
                    animations[view.UID] = animation;
                    if (transaction.running) {
                        animation.from = animation.value === null ? animation.from : animation.value;
                        animation.end();
                    } else {
                        animation.from = from;
                    }
                    this.__animatedItems[view.UID]++;
                    break;
                }
                var animation = animations[view.UID];
                if (animation == null) {
                    animation = animations[view.UID] = new boxspring.animation.ViewPropertyAnimation;
                    animation.property = property;
                    animation.view = view;
                    animation.from = from;
                    if (this.__animatedItems[view.UID] == null) {
                        this.__animatedItems[view.UID] = 0;
                    }
                    this.__animatedItems[view.UID]++;
                }
                animation.to = to;
                animation.__transaction = this;
                this.addAnimation(animation);
                return this;
            },
            removeAnimatedProperty: function(view, property) {
                var animations = this.__animatedProperties[property];
                if (animations == null) return this;
                var animation = animations[view.UID];
                if (animation == null) return this;
                if (--this.__animatedItems[view.UID] === 0) {
                    delete this.__animatedViews[view.UID];
                    delete this.__animatedItems[view.UID];
                }
                delete animations[view.UID];
                this.removeAnimation(animation);
                animation.__transaction = null;
                return this;
            },
            animationForViewProperty: function(view, property) {
                var animations = this.__animatedProperties[property];
                if (animations == null) return null;
                return animations[view.UID] || null;
            },
            onStart: function(e) {
                ViewPropertyTransaction.parent.onStart.apply(this, arguments);
                _.invoke(this.__animatedViews, "emit", "animationstart");
            },
            onPause: function(e) {
                ViewPropertyTransaction.parent.onPause.apply(this, arguments);
                _.invoke(this.__animatedViews, "emit", "animationpause");
            },
            onEnd: function(e) {
                ViewPropertyTransaction.parent.onEnd.apply(this, arguments);
                _.invoke(this.__animatedViews, "emit", "animationend");
            },
            __animatedViews: null,
            __animatedItems: null,
            __animatedProperties: null
        });
        var instances = [];
    },
    "1g": function(require, module, exports, global) {
        "use strict";
        require("1h");
        require("1i");
        require("1j");
    },
    "1h": function(require, module, exports, global) {
        "use strict";
        var Layout = boxspring.define("boxspring.layout.Layout", {
            properties: {
                view: {
                    value: null
                },
                size: {
                    value: function() {
                        return new boxspring.geom.Size;
                    }
                },
                offset: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
                }
            },
            layout: function() {}
        });
    },
    "1i": function(require, module, exports, global) {
        "use strict";
        var FixedLayout = boxspring.define("boxspring.layout.FixedLayout", {
            inherits: boxspring.layout.Layout,
            layout: function() {
                var border = this.view.borderWidth;
                var frameSizeX = this.size.x - border * 2;
                var frameSizeY = this.size.y - border * 2;
                var frameOffsetX = this.offset.x;
                var frameOffsetY = this.offset.y;
                var children = this.view.children;
                for (var i = 0; i < children.length; i++) {
                    var view = children[i];
                    var positionT = view.position.top;
                    var positionL = view.position.left;
                    var positionR = view.position.right;
                    var positionB = view.position.bottom;
                    if (positionT === "auto" && positionB === "auto" && positionL === "auto" && positionR === "auto") {
                        continue;
                    }
                    var sizeX = view.size.x;
                    var sizeY = view.size.y;
                    var maxSizeX = view.maxSize.x;
                    var maxSizeY = view.maxSize.y;
                    var minSizeX = view.minSize.x;
                    var minSizeY = view.minSize.y;
                    var marginT = view.margin.top;
                    var marginL = view.margin.left;
                    var marginR = view.margin.right;
                    var marginB = view.margin.bottom;
                    var marginX = marginL + marginR;
                    var marginY = marginT + marginB;
                    var measuredSizeX = sizeX === "fill" ? frameSizeX : sizeX;
                    var measuredSizeY = sizeY === "fill" ? frameSizeY : sizeY;
                    var measuredOffsetX = 0;
                    var measuredOffsetY = 0;
                    if (positionL !== "auto" && positionR !== "auto") {
                        measuredSizeX = frameSizeX - positionL - positionR - marginX;
                    }
                    if (positionT !== "auto" && positionB !== "auto") {
                        measuredSizeY = frameSizeY - positionT - positionB - marginY;
                    }
                    if (maxSizeX !== "none" && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX;
                    if (minSizeX !== "none" && measuredSizeX < minSizeX) measuredSizeX = minSizeX;
                    if (maxSizeY !== "none" && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY;
                    if (minSizeY !== "none" && measuredSizeY < minSizeY) measuredSizeY = minSizeY;
                    if (positionL !== "auto") {
                        measuredOffsetX = positionL + marginL + border;
                    } else if (positionR !== "auto") {
                        measuredOffsetX = frameSizeX - measuredSizeX - positionR + border;
                    }
                    if (positionT !== "auto") {
                        measuredOffsetY = positionT + marginT + border;
                    } else if (positionB !== "auto") {
                        measuredOffsetY = frameSizeY - measuredSizeY - positionB + border;
                    }
                    view.measuredSize.x = measuredSizeX;
                    view.measuredSize.y = measuredSizeY;
                    view.measuredOffset.x = measuredOffsetX + frameOffsetX;
                    view.measuredOffset.y = measuredOffsetY + frameOffsetY;
                }
            }
        });
    },
    "1j": function(require, module, exports, global) {
        "use strict";
        var FlexibleLayout = boxspring.define("boxspring.layout.FlexibleLayout", {
            inherits: boxspring.layout.FixedLayout,
            properties: {
                orientation: {
                    value: "vertical"
                },
                verticalAlignment: {
                    value: "start"
                },
                horizontalAlignment: {
                    value: "start"
                }
            },
            layout: function() {
                FlexibleLayout.parent.layout.call(this);
                switch (this.orientation) {
                  case "vertical":
                    this.__layoutVertically();
                    break;
                  case "horizontal":
                    this.__layoutHorizontally();
                    break;
                }
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue) {
                if (property === "orientation" || property === "verticalAlignment" || property === "horizontalAlignment") {
                    if (this.view) this.view.scheduleLayout();
                }
                FlexibleLayout.parent.onPropertyChange.apply(this, arguments);
            },
            __layoutHorizontally: function() {
                var contentAlignmentY = this.verticalAlignment;
                var contentAlignmentX = this.horizontalAlignment;
                var border = this.view.borderWidth;
                var paddingT = this.view.padding.top;
                var paddingL = this.view.padding.left;
                var paddingB = this.view.padding.bottom;
                var paddingR = this.view.padding.right;
                var contentSizeX = this.size.x - paddingL - paddingR - border * 2;
                var contentSizeY = this.size.y - paddingT - paddingB - border * 2;
                var usedSpace = 0;
                var freeSpace = contentSizeX;
                var fluidItems = [];
                var fluidSpace = 0;
                var fluidCount = 0;
                var children = this.view.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var positionT = child.position.top;
                    var positionL = child.position.left;
                    var positionR = child.position.right;
                    var positionB = child.position.bottom;
                    if (positionT !== "auto" || positionB !== "auto" && positionL !== "auto" || positionR !== "auto") {
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
                    var minSizeX = child.minSize.x;
                    if (maxSizeX === "none") continue;
                    var space = fluidSpace;
                    if (maxSizeX !== "none" && space > maxSizeX) space = maxSizeX;
                    if (minSizeX !== "none" && space < minSizeX) space = minSizeX;
                    child.measuredSize.x = space;
                    usedSpace += space;
                    freeSpace -= space;
                    fluidCount--;
                    fluidSpace = freeSpace / fluidCount;
                }
                for (var i = 0; i < fluidItems.length; i++) {
                    var child = fluidItems[i];
                    var maxSizeX = child.maxSize.x;
                    var minSizeX = child.minSize.x;
                    if (maxSizeX !== "none") continue;
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
                    var positionT = child.position.top;
                    var positionL = child.position.left;
                    var positionR = child.position.right;
                    var positionB = child.position.bottom;
                    if (positionT !== "auto" || positionB !== "auto" && positionL !== "auto" || positionR !== "auto") {
                        continue;
                    }
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
            __layoutVertically: function() {
                var contentAlignmentY = this.verticalAlignment;
                var contentAlignmentX = this.horizontalAlignment;
                var border = this.view.borderWidth;
                var paddingT = this.view.padding.top;
                var paddingL = this.view.padding.left;
                var paddingB = this.view.padding.bottom;
                var paddingR = this.view.padding.right;
                var contentSizeX = this.size.x - paddingL - paddingR - border * 2;
                var contentSizeY = this.size.y - paddingT - paddingB - border * 2;
                var usedSpace = 0;
                var freeSpace = contentSizeY;
                var fluidItems = [];
                var fluidSpace = 0;
                var fluidCount = 0;
                var children = this.view.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var positionT = child.position.top;
                    var positionL = child.position.left;
                    var positionR = child.position.right;
                    var positionB = child.position.bottom;
                    if (positionT !== "auto" || positionB !== "auto" && positionL !== "auto" || positionR !== "auto") {
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
                    var maxSizeY = child.maxSize.y;
                    var minSizeY = child.minSize.y;
                    if (maxSizeY === "none") continue;
                    var space = fluidSpace;
                    if (maxSizeY !== "none" && space > maxSizeY) space = maxSizeY;
                    if (minSizeY !== "none" && space < minSizeY) space = minSizeY;
                    child.measuredSize.y = space;
                    usedSpace += space;
                    freeSpace -= space;
                    fluidCount--;
                    fluidSpace = freeSpace / fluidCount;
                }
                for (var i = 0; i < fluidItems.length; i++) {
                    var child = fluidItems[i];
                    var maxSizeY = child.maxSize.y;
                    var minSizeY = child.minSize.y;
                    if (maxSizeY !== "none") continue;
                    var space = fluidSpace;
                    if (maxSizeY !== "none" && space > maxSizeY) space = maxSizeY;
                    if (minSizeY !== "none" && space < minSizeY) space = minSizeY;
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
                    var positionT = child.position.top;
                    var positionL = child.position.left;
                    var positionR = child.position.right;
                    var positionB = child.position.bottom;
                    if (positionT !== "auto" || positionB !== "auto" && positionL !== "auto" || positionR !== "auto") {
                        continue;
                    }
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
    "1k": function(require, module, exports, global) {
        "use strict";
        require("1l");
        require("1m");
        require("1n");
        require("1o");
        require("1p");
        require("1q");
    },
    "1l": function(require, module, exports, global) {
        "use strict";
        var View = boxspring.define("boxspring.view.View", {
            inherits: boxspring.event.Emitter,
            statics: {
                setupAnimation: function(duration, equation) {
                    var root = getRootLayoutView();
                    if (root) {
                        root.layoutIfNeeded();
                    }
                    var transaction = new boxspring.animation.ViewPropertyTransaction;
                    if (duration) transaction.duration = duration;
                    if (equation) transaction.equation = equation;
                    transaction.on("end", function() {
                        _.remove(animationsRunning, transaction);
                        transaction.destroy();
                    });
                    _.include(animationsReading, transaction);
                    return transaction;
                },
                startAnimation: function() {
                    var root = getRootLayoutView();
                    if (root) {
                        root.layoutIfNeeded();
                    }
                    animationsRunning = animationsReading;
                    animationsReading = [];
                    _.invoke(animationsRunning, "start");
                },
                animationStatus: function() {
                    if (animationsRunning.length) return "running";
                    if (animationsReading.length) return "reading";
                    return "idle";
                }
            },
            properties: {
                name: {
                    value: null
                },
                window: {
                    value: null,
                    write: false
                },
                parent: {
                    value: null,
                    write: false
                },
                children: {
                    value: [],
                    write: false,
                    clone: true
                },
                contentLayout: {
                    value: function() {
                        return new boxspring.layout.FlexibleLayout;
                    }
                },
                contentOffset: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
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
                        return new boxspring.geom.Size("auto", "auto");
                    }
                },
                backgroundClip: {
                    value: "border"
                },
                borderColor: {
                    value: "#000"
                },
                borderWidth: {
                    value: 0
                },
                borderRadius: {
                    value: 0
                },
                shadowBlur: {
                    value: 0
                },
                shadowColor: {
                    value: "#000"
                },
                shadowOffset: {
                    value: function() {
                        return new boxspring.geom.Point;
                    }
                },
                transform: {
                    value: function() {
                        return new boxspring.geom.Transform;
                    }
                },
                overflow: {
                    value: "visible"
                },
                visible: {
                    value: true
                },
                opacity: {
                    value: 1
                },
                margin: {
                    value: function() {
                        return new boxspring.geom.Thickness;
                    },
                    onSet: function(value) {
                        if (typeof value === "number") {
                            this.margin.top = value;
                            this.margin.left = value;
                            this.margin.right = value;
                            this.margin.bottom = value;
                        }
                    }
                },
                padding: {
                    value: function() {
                        return new boxspring.geom.Thickness;
                    },
                    onSet: function(value) {
                        if (typeof value === "number") {
                            this.padding.top = value;
                            this.padding.left = value;
                            this.padding.right = value;
                            this.padding.bottom = value;
                        }
                    }
                },
                position: {
                    value: function() {
                        return new boxspring.geom.Position("auto");
                    }
                },
                size: {
                    value: function() {
                        return new boxspring.geom.Size("fill", "fill");
                    }
                },
                minSize: {
                    value: function() {
                        return new boxspring.geom.Size("none", "none");
                    }
                },
                maxSize: {
                    value: function() {
                        return new boxspring.geom.Size("none", "none");
                    }
                },
                measuredSize: {
                    value: function() {
                        return new boxspring.geom.Size("none", "none");
                    }
                },
                measuredOffset: {
                    value: function() {
                        return new boxspring.geom.Point("none", "none");
                    }
                },
                absoluteOffset: {
                    value: function() {
                        return new boxspring.geom.Point(0, 0);
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
                this.on("propertychange", "shadowBlur", onPropertyChange);
                this.on("propertychange", "shadowColor", onPropertyChange);
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
                this.on("propertychange", "measuredSize.x", onPropertyChange);
                this.on("propertychange", "measuredSize.y", onPropertyChange);
                this.on("propertychange", "measuredOffset.x", onPropertyChange);
                this.on("propertychange", "measuredOffset.y", onPropertyChange);
                this.on("propertychange", "contentOffset.x", onPropertyChange);
                this.on("propertychange", "contentOffset.y", onPropertyChange);
                this.on("propertychange", "transform.origin.x", onPropertyChange);
                this.on("propertychange", "transform.origin.y", onPropertyChange);
                this.on("propertychange", "transform.translation.x", onPropertyChange);
                this.on("propertychange", "transform.translation.y", onPropertyChange);
                this.on("propertychange", "transform.rotation", onPropertyChange);
                this.on("propertychange", "transform.scale.x", onPropertyChange);
                this.on("propertychange", "transform.scale.y", onPropertyChange);
                this.on("propertychange", "transform.shear.x", onPropertyChange);
                this.on("propertychange", "transform.shear.y", onPropertyChange);
                this.on("propertyanimationstart", this.bind("onPropertyAnimationStart"));
                this.on("propertyanimationupdate", this.bind("onPropertyAnimationUpdate"));
                this.on("propertyanimationend", this.bind("onPropertyAnimationEnd"));
                this.on("layout", this.bind("onLayout"));
                this.on("redraw", this.bind("onRedraw"));
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
                this.__animatedPropertyValues = {};
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
                this.off("propertychange", "shadowBlur", onPropertyChange);
                this.off("propertychange", "shadowColor", onPropertyChange);
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
                this.off("propertychange", "measuredSize.x", onPropertyChange);
                this.off("propertychange", "measuredSize.y", onPropertyChange);
                this.off("propertychange", "measuredOffset.x", onPropertyChange);
                this.off("propertychange", "measuredOffset.y", onPropertyChange);
                this.off("propertychange", "contentOffset.x", onPropertyChange);
                this.off("propertychange", "contentOffset.y", onPropertyChange);
                this.off("propertychange", "transform.origin.x", onPropertyChange);
                this.off("propertychange", "transform.origin.y", onPropertyChange);
                this.off("propertychange", "transform.translation.x", onPropertyChange);
                this.off("propertychange", "transform.translation.y", onPropertyChange);
                this.off("propertychange", "transform.rotation", onPropertyChange);
                this.off("propertychange", "transform.scale.x", onPropertyChange);
                this.off("propertychange", "transform.scale.y", onPropertyChange);
                this.off("propertyanimationstart", this.bind("onPropertyAnimationStart"));
                this.off("propertyanimationupdate", this.bind("onPropertyAnimationUpdate"));
                this.off("propertyanimationend", this.bind("onPropertyAnimationEnd"));
                this.off("layout", this.bind("onLayout"));
                this.off("redraw", this.bind("onRedraw"));
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
                view.removeFromParent();
                var children = this.__children;
                if (index > children.length) {
                    index = children.length;
                } else if (index < 0) {
                    index = 0;
                }
                children.splice(index, 0, view);
                view.setWindow(this.window);
                view.setParent(this);
                view.setParentReceiver(this);
                this.emit("add", view);
                this.scheduleLayout();
                return this;
            },
            addChildBefore: function(view, before) {
                var index = this.childIndex(before);
                if (index === null) return this;
                return this.addChildAt(view, index);
            },
            addChildAfter: function(view, after) {
                var index = this.childIndex(before);
                if (index === null) return this;
                return this.addChildAt(view, index + 1);
            },
            removeChild: function(view) {
                var index = this.childIndex(view);
                if (index === null) return this;
                return this.removeChildAt(index);
            },
            removeChildAt: function(index) {
                var children = this.__children;
                var view = children[index];
                if (view == null) return this;
                children.splice(index, 1);
                view.setWindow(null);
                view.setParent(null);
                view.setParentReceiver(null);
                this.emit("remove", view);
                this.scheduleLayout();
                return this;
            },
            removeFromParent: function() {
                var parent = this.parent;
                if (parent) parent.removeChild(this);
                return this;
            },
            childIndex: function(view) {
                return this.__children.indexOf(view);
            },
            childByName: function(name) {},
            childAt: function(index) {
                return this.__children[index] || null;
            },
            viewAtPoint: function(x, y) {
                if (this.pointInside(x, y) === false) return null;
                var o = this.measuredOffset;
                var px = x - o.x;
                var py = y - o.y;
                var children = this.__children;
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    if (child.pointInside(px, py)) return child.viewAtPoint(px, py);
                }
                return this;
            },
            pointInside: function(x, y) {
                var point = arguments[0];
                if (point instanceof boxspring.geom.Point) {
                    x = point.x;
                    y = point.y;
                }
                var s = this.measuredSize;
                var o = this.measuredOffset;
                return x >= o.x && x <= o.x + s.x && y >= o.y && y <= o.y + s.y;
            },
            animate: function(property, value, duration, equation) {
                View.beginAnimation(duration, equation);
                this.set(property, value);
                View.startAnimation();
                return this;
            },
            animatedPropertyValue: function(property) {
                var value = this.__animatedPropertyValues[property];
                if (value == null) {
                    switch (property) {
                      case "backgroundColor":
                        return this.backgroundColor;
                      case "backgroundImage":
                        return this.backgroundImage;
                      case "backgroundSize.x":
                        return this.backgroundSize.x;
                      case "backgroundSize.y":
                        return this.backgroundSize.y;
                      case "borderColor":
                        return this.borderColor;
                      case "borderWidth":
                        return this.borderWidth;
                      case "borderRadius":
                        return this.borderRadius;
                      case "shadowBlur":
                        return this.shadowBlur;
                      case "shadowColor":
                        return this.shadowColor;
                      case "shadowOffset.x":
                        return this.shadowOffset.x;
                      case "shadowOffset.y":
                        return this.shadowOffset.y;
                      case "opacity":
                        return this.opacity;
                      case "measuredSize.x":
                        return this.measuredSize.x;
                      case "measuredSize.y":
                        return this.measuredSize.y;
                      case "measuredOffset.x":
                        return this.measuredOffset.x;
                      case "measuredOffset.y":
                        return this.measuredOffset.y;
                      case "transform.translation.x":
                        return this.transform.translation.x;
                      case "transform.translation.y":
                        return this.transform.translation.y;
                      case "transform.rotation":
                        return this.transform.rotation;
                      case "transform.scale.x":
                        return this.transform.scale.x;
                      case "transform.scale.y":
                        return this.transform.scale.y;
                      case "transform.shear.x":
                        return this.transform.shear.x;
                      case "transform.shear.y":
                        return this.transform.shear.y;
                      case "transform.origin.x":
                        return this.transform.origin.x;
                      case "transform.origin.y":
                        return this.transform.origin.y;
                    }
                }
                return value;
            },
            animatedPropertyEvaluator: function(property) {
                switch (property) {
                  case "backgroundColor":
                  case "borderColor":
                  case "shadowColor":
                    return new boxspring.animation.ColorEvaluator;
                  case "backgroundImage":
                    return new boxspring.animation.ImageEvaluator;
                  case "backgroundSize.x":
                  case "backgroundSize.y":
                  case "borderWidth":
                  case "borderRadius":
                  case "shadowBlur":
                  case "shadowOffset.x":
                  case "shadowOffset.y":
                  case "opacity":
                  case "measuredSize.x":
                  case "measuredSize.y":
                  case "measuredOffset.x":
                  case "measuredOffset.y":
                  case "contentOffset.x":
                  case "contentOffset.y":
                  case "transform.origin.x":
                  case "transform.origin.y":
                  case "transform.translation.x":
                  case "transform.translation.y":
                  case "transform.rotation":
                  case "transform.scale.x":
                  case "transform.scale.y":
                  case "transform.shear.x":
                  case "transform.shear.y":
                    return new boxspring.animation.NumberEvaluator;
                }
                return null;
            },
            propertyIsAnimatable: function(property) {
                return animatableProperties.indexOf(property) !== -1;
            },
            redrawOnPropertyChange: function(property) {
                return false;
            },
            reflowOnPropertyChange: function(property) {
                return scheduleReflowProperties.indexOf(property) !== -1;
            },
            layoutOnPropertyChange: function(property) {
                return scheduleLayoutProperties.indexOf(property) !== -1;
            },
            scheduleRedraw: function() {
                if (this.__needsRedraw === false) {
                    this.__needsRedraw = true;
                    viewRedrawList.push(this);
                }
                return this;
            },
            scheduleLayout: function() {
                if (this.__needsLayout === false) {
                    this.__needsLayout = true;
                    viewLayoutList.push(this);
                }
                return this;
            },
            scheduleReflow: function() {
                var parent = this.parent;
                if (parent) parent.scheduleLayout();
                return this;
            },
            redrawIfNeeded: function(context) {
                if (this.__needsRedraw) {
                    this.__needsRedraw = false;
                    this.redraw(context);
                    this.emit("redraw", context);
                    _.remove(this, viewRedrawList);
                }
                return this;
            },
            layoutIfNeeded: function() {
                var parent = this.parent;
                if (parent && parent.__needsLayout) {
                    parent.layoutIfNeeded();
                    return;
                }
                if (this.__needsLayout) {
                    this.__needsLayout = false;
                    this.layout();
                    this.emit("layout");
                    _.remove(this, viewLayoutList);
                }
                _.invoke(this.__children, "layoutIfNeeded");
                return this;
            },
            redraw: function(context) {
                return this;
            },
            layout: function() {
                if (this.contentLayout) {
                    this.contentLayout.view = this;
                    this.contentLayout.size.x = this.measuredSize.x;
                    this.contentLayout.size.y = this.measuredSize.y;
                    this.contentLayout.layout();
                }
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {
                if (this.redrawOnPropertyChange(property)) this.scheduleRedraw();
                if (this.layoutOnPropertyChange(property)) this.scheduleLayout();
                if (this.reflowOnPropertyChange(property)) this.scheduleReflow();
                var parent = this.parent;
                if (parent) {
                    switch (property) {
                      case "measuredOffset.x":
                        this.absoluteOffset.x = parent.absoluteOffset.x + newValue;
                        break;
                      case "measuredOffset.y":
                        this.absoluteOffset.y = parent.absoluteOffset.y + newValue;
                        break;
                    }
                }
                var animation = _.last(animationsReading);
                if (animation) {
                    if (this.propertyIsAnimatable(property)) {
                        var t = newValue;
                        var f = oldValue;
                        if (property === "measuredSize.x" && oldValue === "none" || property === "measuredSize.y" && oldValue === "none" || property === "measuredOffset.x" && oldValue === "none" || property === "measuredOffset.y" && oldValue === "none") {
                            f = t;
                        }
                        animation.addAnimatedProperty(this, property, f, t);
                    }
                }
            },
            onRedraw: function(e) {},
            onLayout: function(e) {},
            onAdd: function(view, e) {},
            onRemove: function(view, e) {},
            onAddToParent: function(parent, e) {},
            onRemoveFromParent: function(parent, e) {},
            onAddToWindow: function(window, e) {},
            onRemoveFromWindow: function(window, e) {},
            onPropertyAnimationStart: function(property, value) {
                this.__animatedPropertyValues[property] = value;
            },
            onPropertyAnimationUpdate: function(property, value) {
                this.__animatedPropertyValues[property] = value;
            },
            onPropertyAnimationEnd: function(property, value) {
                delete this.__animatedPropertyValues[property];
            },
            onTouchCancel: function(touches, e) {},
            onTouchStart: function(touches, e) {},
            onTouchMove: function(touches, e) {},
            onTouchEnd: function(touches, e) {},
            setParent: function(value) {
                var parent = this.__parent;
                if (parent && value === null) {
                    this.__parent = value;
                    this.emit("propertychange", "parent", value);
                    this.emit("removefromparent", parent);
                    return this;
                }
                if (parent === null && value) {
                    this.__parent = value;
                    this.emit("propertychange", "parent", value);
                    this.emit("addtoparent", parent);
                    return this;
                }
                return this;
            },
            setWindow: function(value) {
                var window = this.__window;
                if (window && value === null) {
                    this.__window = value;
                    this.emit("propertychange", "window", value);
                    this.emit("removefromwindow", value);
                    return this;
                }
                if (window === null && value) {
                    this.__window = value;
                    this.emit("propertychange", "window", value);
                    this.emit("addtowindow", window);
                    return this;
                }
                _.invoke(this.__children, "setWindow", value);
                return this;
            },
            __needsRedraw: false,
            __needsLayout: false,
            __animatedPropertyValues: null
        });
        var viewLayoutList = [];
        var viewRedrawList = [];
        var getRootLayoutView = function() {
            var root = null;
            for (var i = 0; i < viewLayoutList.length; i++) {
                var view = viewLayoutList[i];
                if (view instanceof boxspring.view.Window) return view;
                if (view.window == null) continue;
                var assign = true;
                var parent = view.parent;
                while (parent) {
                    if (parent === root) {
                        assign = false;
                        break;
                    }
                    parent = parent.parent;
                }
                if (assign) root = view;
            }
            return root;
        };
        var getRootRedrawView = function() {
            var root = null;
            for (var i = 0; i < viewRedrawList.length; i++) {
                var view = viewRedrawList[i];
                if (view instanceof boxspring.view.Window) return view;
                if (view.window == null) continue;
                var assign = true;
                var parent = view.parent;
                while (parent) {
                    if (parent === root) {
                        assign = false;
                        break;
                    }
                    parent = parent.parent;
                }
                if (assign) root = view;
            }
            return root;
        };
        var scheduleReflowProperties = [ "size.x", "size.y", "minSize.x", "minSize.y", "maxSize.x", "maxSize.y", "visible", "margin.top", "margin.left", "margin.right", "margin.bottom" ];
        var scheduleLayoutProperties = [ "contentLayout", "measuredSize.x", "measuredSize.y", "borderWidth", "padding.top", "padding.left", "padding.right", "padding.bottom" ];
        var animatableProperties = [ "backgroundColor", "borderColor", "shadowColor", "backgroundImage", "backgroundSize.x", "backgroundSize.y", "borderWidth", "borderRadius", "shadowBlur", "shadowOffset.x", "shadowOffset.y", "opacity", "measuredSize.x", "measuredSize.y", "measuredOffset.x", "measuredOffset.y", "contentOffset.x", "contentOffset.y", "transform.origin.x", "transform.origin.y", "transform.translation.x", "transform.translation.y", "transform.rotation", "transform.scale.x", "transform.scale.y", "transform.shear.x", "transform.shear.y" ];
        var animationsReading = [];
        var animationsRunning = [];
    },
    "1m": function(require, module, exports, global) {
        "use strict";
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
            renderOnPropertyChange: function(property) {
                return scheduleRenderProperties.indexOf(property) !== -1;
            },
            redrawOnPropertyChange: function(property) {
                return scheduleRedrawProperties.indexOf(property) !== -1;
            },
            scheduleRender: function() {
                var RenderLoop = boxspring.render.RenderLoop;
                var status = View.animationStatus();
                if (this.__needsRender && status !== "running") return this;
                this.__needsRender = true;
                var status = View.animationStatus();
                if (status === "reading") return this;
                if (this.window || this instanceof boxspring.view.Window) {
                    if (updateDisplayRoot === null) {
                        updateDisplayRoot = this;
                    }
                    if (updateDisplayScheduled === false) {
                        updateDisplayScheduled = true;
                        RenderLoop.run(updateDisplay, RenderLoop.RENDER_PRIORITY);
                    }
                }
                return this;
            },
            scheduleRedraw: function() {
                View.parent.scheduleRedraw.call(this);
                this.scheduleRender();
                return this;
            },
            scheduleLayout: function() {
                View.parent.scheduleLayout.call(this);
                this.scheduleRender();
                return this;
            },
            redraw: function(context) {
                this.__redrawBackground(context);
                this.__redrawBorder(context);
                this.__redrawShadow(context);
                return this;
            },
            onPropertyChange: function(target, property, newValue, oldValue, e) {
                View.parent.onPropertyChange.apply(this, arguments);
                if (property === "shadowBlur" || property === "shadowColor" || property === "shadowOffset" || property === "shadowOffset.x" || property === "shadowOffset.y") {
                    this.__needsShadow = true;
                }
                if (this.renderOnPropertyChange(property)) this.scheduleRender();
            },
            onPropertyAnimationUpdate: function(property, value) {
                View.parent.onPropertyAnimationUpdate.apply(this, arguments);
                if (this.redrawOnPropertyChange(property)) this.scheduleRedraw();
                if (this.renderOnPropertyChange(property)) this.scheduleRender();
            },
            __needsRender: false,
            __needsShadow: false,
            __redrawBackground: function(context) {
                var sizeX = this.measuredSize.x;
                var sizeY = this.measuredSize.y;
                var borderRadius = this.animatedPropertyValue("borderRadius");
                var backgroundColor = this.animatedPropertyValue("backgroundColor");
                var backgroundImage = this.animatedPropertyValue("backgroundImage");
                var backgroundClip = this.backgroundClip;
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
                    createRectPath(context, 0, 0, backgroundSizeX, backgroundSizeY, backgroundRadius);
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
                var sizeX = this.animatedPropertyValue("measuredSize.x");
                var sizeY = this.animatedPropertyValue("measuredSize.y");
                var borderWidth = this.animatedPropertyValue("borderWidth");
                var borderColor = this.animatedPropertyValue("borderColor");
                var borderRadius = this.animatedPropertyValue("borderRadius");
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
                    createRectPath(context, strokeOriginX, strokeOriginY, strokeSizeX, strokeSizeY, strokeRadius);
                    context.lineCap = "butt";
                    context.lineWidth = borderWidth;
                    context.strokeStyle = borderColor;
                    context.stroke();
                    context.restore();
                }
                return this;
            },
            __redrawShadow: function(context, area) {}
        });
        var scheduleRenderProperties = [ "measuredSize", "measuredSize.x", "measuredSize.y", "measuredOffset", "measuredOffset.x", "measuredOffset.y", "contentOffset.x", "contentOffset.y", "transform.values", "transform.origin.x", "transform.origin.y", "transform.translation.x", "transform.translation.y", "transform.rotation", "transform.scale.x", "transform.scale.y", "transform.shear.x", "transform.shear.y", "overflow", "opacity" ];
        var scheduleRedrawProperties = [ "backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundClip", "backgroundSize", "backgroundSize.x", "backgroundSize.y", "borderRadius", "borderColor", "borderWidth", "shadowBlur", "shadowColor", "shadowOffset", "shadowOffset.x", "shadowOffset.y" ];
        var renderCaches = {};
        var shadowCaches = {};
        var updateDisplayScheduled = false;
        var updateDisplayRoot = null;
        var updateDisplay = function() {
            updateDisplayScheduled = false;
            if (updateDisplayRoot == null) return;
            if (root.size.x === "auto") updateDisplayRoot.measuredSize.x = window.innerWidth;
            if (root.size.y === "auto") updateDisplayRoot.measuredSize.y = window.innerHeight;
            screenContext.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
            composite(updateDisplayRoot, screenContext, 0, 0);
        };
        var composite = function(view, screen) {
            if (view.__needsLayout) view.layoutIfNeeded();
            var contentOffsetX = 0;
            var contentOffsetY = 0;
            var parent = view.parent;
            if (parent) {
                contentOffsetX = parent.contentOffset.x;
                contentOffsetY = parent.contentOffset.y;
            }
            var viewSizeX = view.animatedPropertyValue("measuredSize.x");
            var viewSizeY = view.animatedPropertyValue("measuredSize.y");
            var viewOffsetX = view.animatedPropertyValue("measuredOffset.x") + contentOffsetX;
            var viewOffsetY = view.animatedPropertyValue("measuredOffset.y") + contentOffsetY;
            var viewOpacity = view.animatedPropertyValue("opacity");
            var originX = view.animatedPropertyValue("transform.origin.x");
            var originY = view.animatedPropertyValue("transform.origin.y");
            var translateX = view.animatedPropertyValue("transform.translation.x");
            var translateY = view.animatedPropertyValue("transform.translation.y");
            var rotate = view.animatedPropertyValue("transform.rotation");
            var scaleX = view.animatedPropertyValue("transform.scale.x");
            var scaleY = view.animatedPropertyValue("transform.scale.y");
            var shearX = view.animatedPropertyValue("transform.shear.x");
            var shearY = view.animatedPropertyValue("transform.shear.y");
            screen.save();
            screen.globalAlpha = screen.globalAlpha * viewOpacity;
            screen.translate(viewOffsetX, viewOffsetY);
            screen.translate(translateX, translateY);
            screen.translate(originX, originY);
            screen.rotate(rotate);
            screen.scale(scaleX, scaleY);
            screen.translate(-originX, -originY);
            var r1x1 = 0;
            var r1x2 = 0 + updateDisplayRoot.measuredSize.x;
            var r1y1 = 0;
            var r1y2 = 0 + updateDisplayRoot.measuredSize.y;
            var r2x1 = viewOffsetX;
            var r2x2 = viewOffsetX + viewSizeX;
            var r2y1 = viewOffsetY;
            var r2y2 = viewOffsetY + viewSizeY;
            if (r1x1 < r2x2 && r1x2 > r2x1 && r1y1 < r2y2 && r1y2 > r2y1) {
                var cache = renderCaches[view.UID];
                if (cache == null) {
                    cache = renderCaches[view.UID] = document.createElement("canvas");
                    cache.width = Math.floor(view.measuredSize.x);
                    cache.height = Math.floor(view.measuredSize.y);
                    view.scheduleRedraw();
                } else if (cache.width !== Math.floor(view.measuredSize.x) || cache.height !== Math.floor(view.measuredSize.y)) {
                    cache.width = view.measuredSize.x;
                    cache.height = view.measuredSize.y;
                    view.scheduleRedraw();
                }
                view.__needsRender = false;
                if (view.__needsRedraw) {
                    var context = cache.getContext("2d");
                    context.save();
                    context.clearRect(0, 0, view.measuredSize.x, view.measuredSize.y);
                    view.redrawIfNeeded(context);
                    context.restore();
                }
                if (view.overflow === "hidden") {}
                if (viewSizeX > 0 && viewSizeY > 0 && cache.width > 0 && cache.height > 0) {
                    screen.drawImage(cache, 0, 0, cache.width, cache.height, 0, 0, viewSizeX, viewSizeY);
                }
            }
            var children = view.__children;
            for (var i = 0; i < children.length; i++) composite(children[i], screen);
            screen.restore();
        };
        var createRectPath = function(context, originX, originY, sizeX, sizeY, radius) {
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
        };
        var showFPS = function() {
            var lastCalledTime;
            var fps;
            if (!lastCalledTime) {
                lastCalledTime = (new Date).getTime();
                fps = 0;
                return;
            }
            var delta = ((new Date).getTime() - lastCalledTime) / 1e3;
            lastCalledTime = (new Date).getTime();
            fps = 1 / delta;
            screenContext.fillText(fps.toFixed(1) + "fps", 10, 10);
        };
        var screenCanvas = null;
        var screenContext = null;
        document.addEventListener("DOMContentLoaded", function(event) {
            screenCanvas = document.createElement("canvas");
            screenCanvas.width = window.innerWidth;
            screenCanvas.height = window.innerHeight;
            document.body.appendChild(screenCanvas);
            screenContext = screenCanvas.getContext("2d");
            window.addEventListener("resize", function() {
                screenCanvas.width = window.innerWidth;
                screenCanvas.height = window.innerHeight;
            });
        });
        var length = function(a) {
            return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
        };
        var normalize = function(a) {
            var l = length(a);
            return l ? [ a[0] / l, a[1] / l ] : [ 0, 0 ];
        };
        var dot = function(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        };
        var atan2 = Math.atan2;
        var combine = function(a, b, ascl, bscl) {
            return [ ascl * a[0] + bscl * b[0], ascl * a[1] + bscl * b[1] ];
        };
        var unmatrix = function(a, b, c, d, tx, ty) {
            if (a * d - b * c === 0) return false;
            var translate = [ tx, ty ];
            var m = [ [ a, b ], [ c, d ] ];
            var scale = [ length(m[0]) ];
            m[0] = normalize(m[0]);
            var skew = dot(m[0], m[1]);
            m[1] = combine(m[1], m[0], 1, -skew);
            scale[1] = length(m[1]);
            skew /= scale[1];
            var rotate = atan2(m[0][1], m[0][0]);
            return [ translate, rotate, scale, skew ];
        };
    },
    "1n": function(require, module, exports, global) {
        "use strict";
        var ScrollView = boxspring.define("boxspring.view.ScrollView", {
            inherits: boxspring.view.View,
            properties: {
                contentSize: {
                    value: function() {
                        return new boxspring.geom.Size;
                    }
                }
            },
            constructor: function() {
                ScrollView.parent.constructor.call(this);
                var onPropertyChange = this.bind("onPropertyChange");
                this.on("propertychange", "contentSize.x", onPropertyChange);
                this.on("propertychange", "contentSize.y", onPropertyChange);
                this.overflow = "hidden";
                return this;
            },
            layout: function() {
                if (this.contentLayout) {
                    this.contentLayout.view = this;
                    this.contentLayout.size.x = this.contentSize.x === "fill" ? this.measuredSize.x : this.contentSize.x;
                    this.contentLayout.size.y = this.contentSize.y === "fill" ? this.measuredSize.y : this.contentSize.y;
                    this.contentLayout.layout();
                }
                return this;
            },
            scrollTo: function() {},
            scrollBy: function() {}
        });
    },
    "1o": function(require, module, exports, global) {
        "use strict";
        var ScrollView = boxspring.override("boxspring.view.ScrollView", {
            scroller: null,
            constructor: function() {
                ScrollView.parent.constructor.call(this);
                var self = this;
                this.scroller = new Scroller(function(x, y, zoom) {
                    self.contentOffset.x = -x;
                    self.contentOffset.y = -y;
                });
                return this;
            },
            composite: function(context, buffer) {
                ScrollView.parent.composite.call(this, context, buffer);
            },
            onPropertyChange: function(target, property, oldValue, newValue) {
                ScrollView.parent.onPropertyChange.apply(this, arguments);
                if (property === "contentSize.x" || property === "contentSize.y") {
                    this.scheduleLayout();
                    this.scroller.setDimensions(this.measuredSize.x, this.measuredSize.y, this.contentSize.x, this.contentSize.y);
                }
                if (property === "measuredSize.x" || property === "measuredSize.y") {
                    this.scroller.setDimensions(this.measuredSize.x, this.measuredSize.y, this.contentSize.x, this.contentSize.y);
                }
                if (property === "contentOffset.x" || property === "contentOffset.y") {
                    this.scheduleRender();
                }
            },
            onTouchStart: function(touches, e) {
                var ts = _.map(touches, function(touch) {
                    return {
                        pageX: touch.location.x,
                        pageY: touch.location.y
                    };
                });
                this.scroller.doTouchStart(ts, Date.now());
            },
            onTouchMove: function(touches, e) {
                var ts = _.map(touches, function(touch) {
                    return {
                        pageX: touch.location.x,
                        pageY: touch.location.y
                    };
                });
                this.scroller.doTouchMove(ts, Date.now());
            },
            onTouchEnd: function(touches, e) {
                var ts = _.map(touches, function(touch) {
                    return {
                        pageX: touch.location.x,
                        pageY: touch.location.y
                    };
                });
                this.scroller.doTouchEnd(Date.now());
            }
        });
        var Scroller;
        (function() {
            var NOOP = function() {};
            Scroller = function(callback, options) {
                this.__callback = callback;
                this.options = {
                    scrollingX: true,
                    scrollingY: true,
                    animating: true,
                    animationDuration: 250,
                    bouncing: true,
                    locking: true,
                    paging: false,
                    snapping: false,
                    zooming: false,
                    minZoom: .5,
                    maxZoom: 3,
                    speedMultiplier: 1,
                    scrollingComplete: NOOP,
                    penetrationDeceleration: .03,
                    penetrationAcceleration: .08
                };
                for (var key in options) {
                    this.options[key] = options[key];
                }
            };
            var easeOutCubic = function(pos) {
                return Math.pow(pos - 1, 3) + 1;
            };
            var easeInOutCubic = function(pos) {
                if ((pos /= .5) < 1) {
                    return .5 * Math.pow(pos, 3);
                }
                return .5 * (Math.pow(pos - 2, 3) + 2);
            };
            var members = {
                __isSingleTouch: false,
                __isTracking: false,
                __didDecelerationComplete: false,
                __isGesturing: false,
                __isDragging: false,
                __isDecelerating: false,
                __isAnimating: false,
                __clientLeft: 0,
                __clientTop: 0,
                __clientWidth: 0,
                __clientHeight: 0,
                __contentWidth: 0,
                __contentHeight: 0,
                __snapWidth: 100,
                __snapHeight: 100,
                __refreshHeight: null,
                __refreshActive: false,
                __refreshActivate: null,
                __refreshDeactivate: null,
                __refreshStart: null,
                __zoomLevel: 1,
                __scrollLeft: 0,
                __scrollTop: 0,
                __maxScrollLeft: 0,
                __maxScrollTop: 0,
                __scheduledLeft: 0,
                __scheduledTop: 0,
                __scheduledZoom: 0,
                __lastTouchLeft: null,
                __lastTouchTop: null,
                __lastTouchMove: null,
                __positions: null,
                __minDecelerationScrollLeft: null,
                __minDecelerationScrollTop: null,
                __maxDecelerationScrollLeft: null,
                __maxDecelerationScrollTop: null,
                __decelerationVelocityX: null,
                __decelerationVelocityY: null,
                setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {
                    var self = this;
                    if (clientWidth === +clientWidth) {
                        self.__clientWidth = clientWidth;
                    }
                    if (clientHeight === +clientHeight) {
                        self.__clientHeight = clientHeight;
                    }
                    if (contentWidth === +contentWidth) {
                        self.__contentWidth = contentWidth;
                    }
                    if (contentHeight === +contentHeight) {
                        self.__contentHeight = contentHeight;
                    }
                    self.__computeScrollMax();
                    self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
                },
                setPosition: function(left, top) {
                    var self = this;
                    self.__clientLeft = left || 0;
                    self.__clientTop = top || 0;
                },
                setSnapSize: function(width, height) {
                    var self = this;
                    self.__snapWidth = width;
                    self.__snapHeight = height;
                },
                activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback) {
                    var self = this;
                    self.__refreshHeight = height;
                    self.__refreshActivate = activateCallback;
                    self.__refreshDeactivate = deactivateCallback;
                    self.__refreshStart = startCallback;
                },
                finishPullToRefresh: function() {
                    var self = this;
                    self.__refreshActive = false;
                    if (self.__refreshDeactivate) {
                        self.__refreshDeactivate();
                    }
                    self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
                },
                getValues: function() {
                    var self = this;
                    return {
                        left: self.__scrollLeft,
                        top: self.__scrollTop,
                        zoom: self.__zoomLevel
                    };
                },
                getScrollMax: function() {
                    var self = this;
                    return {
                        left: self.__maxScrollLeft,
                        top: self.__maxScrollTop
                    };
                },
                zoomTo: function(level, animate, originLeft, originTop) {
                    var self = this;
                    if (!self.options.zooming) {
                        throw new Error("Zooming is not enabled!");
                    }
                    if (self.__isDecelerating) {
                        core.effect.Animate.stop(self.__isDecelerating);
                        self.__isDecelerating = false;
                    }
                    var oldLevel = self.__zoomLevel;
                    if (originLeft == null) {
                        originLeft = self.__clientWidth / 2;
                    }
                    if (originTop == null) {
                        originTop = self.__clientHeight / 2;
                    }
                    level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
                    self.__computeScrollMax(level);
                    var left = (originLeft + self.__scrollLeft) * level / oldLevel - originLeft;
                    var top = (originTop + self.__scrollTop) * level / oldLevel - originTop;
                    if (left > self.__maxScrollLeft) {
                        left = self.__maxScrollLeft;
                    } else if (left < 0) {
                        left = 0;
                    }
                    if (top > self.__maxScrollTop) {
                        top = self.__maxScrollTop;
                    } else if (top < 0) {
                        top = 0;
                    }
                    self.__publish(left, top, level, animate);
                },
                zoomBy: function(factor, animate, originLeft, originTop) {
                    var self = this;
                    self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);
                },
                scrollTo: function(left, top, animate, zoom) {
                    var self = this;
                    if (self.__isDecelerating) {
                        core.effect.Animate.stop(self.__isDecelerating);
                        self.__isDecelerating = false;
                    }
                    if (zoom != null && zoom !== self.__zoomLevel) {
                        if (!self.options.zooming) {
                            throw new Error("Zooming is not enabled!");
                        }
                        left *= zoom;
                        top *= zoom;
                        self.__computeScrollMax(zoom);
                    } else {
                        zoom = self.__zoomLevel;
                    }
                    if (!self.options.scrollingX) {
                        left = self.__scrollLeft;
                    } else {
                        if (self.options.paging) {
                            left = Math.round(left / self.__clientWidth) * self.__clientWidth;
                        } else if (self.options.snapping) {
                            left = Math.round(left / self.__snapWidth) * self.__snapWidth;
                        }
                    }
                    if (!self.options.scrollingY) {
                        top = self.__scrollTop;
                    } else {
                        if (self.options.paging) {
                            top = Math.round(top / self.__clientHeight) * self.__clientHeight;
                        } else if (self.options.snapping) {
                            top = Math.round(top / self.__snapHeight) * self.__snapHeight;
                        }
                    }
                    left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
                    top = Math.max(Math.min(self.__maxScrollTop, top), 0);
                    if (left === self.__scrollLeft && top === self.__scrollTop) {
                        animate = false;
                    }
                    self.__publish(left, top, zoom, animate);
                },
                scrollBy: function(left, top, animate) {
                    var self = this;
                    var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
                    var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;
                    self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
                },
                doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {
                    var self = this;
                    var change = wheelDelta > 0 ? .97 : 1.03;
                    return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);
                },
                doTouchStart: function(touches, timeStamp) {
                    if (touches.length == null) {
                        throw new Error("Invalid touch list: " + touches);
                    }
                    if (timeStamp instanceof Date) {
                        timeStamp = timeStamp.valueOf();
                    }
                    if (typeof timeStamp !== "number") {
                        throw new Error("Invalid timestamp value: " + timeStamp);
                    }
                    var self = this;
                    self.__interruptedAnimation = true;
                    if (self.__isDecelerating) {
                        core.effect.Animate.stop(self.__isDecelerating);
                        self.__isDecelerating = false;
                        self.__interruptedAnimation = true;
                    }
                    if (self.__isAnimating) {
                        core.effect.Animate.stop(self.__isAnimating);
                        self.__isAnimating = false;
                        self.__interruptedAnimation = true;
                    }
                    var currentTouchLeft, currentTouchTop;
                    var isSingleTouch = touches.length === 1;
                    if (isSingleTouch) {
                        currentTouchLeft = touches[0].pageX;
                        currentTouchTop = touches[0].pageY;
                    } else {
                        currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                        currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
                    }
                    self.__initialTouchLeft = currentTouchLeft;
                    self.__initialTouchTop = currentTouchTop;
                    self.__zoomLevelStart = self.__zoomLevel;
                    self.__lastTouchLeft = currentTouchLeft;
                    self.__lastTouchTop = currentTouchTop;
                    self.__lastTouchMove = timeStamp;
                    self.__lastScale = 1;
                    self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
                    self.__enableScrollY = !isSingleTouch && self.options.scrollingY;
                    self.__isTracking = true;
                    self.__didDecelerationComplete = false;
                    self.__isDragging = !isSingleTouch;
                    self.__isSingleTouch = isSingleTouch;
                    self.__positions = [];
                },
                doTouchMove: function(touches, timeStamp, scale) {
                    if (touches.length == null) {
                        throw new Error("Invalid touch list: " + touches);
                    }
                    if (timeStamp instanceof Date) {
                        timeStamp = timeStamp.valueOf();
                    }
                    if (typeof timeStamp !== "number") {
                        throw new Error("Invalid timestamp value: " + timeStamp);
                    }
                    var self = this;
                    if (!self.__isTracking) {
                        return;
                    }
                    var currentTouchLeft, currentTouchTop;
                    if (touches.length === 2) {
                        currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                        currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
                    } else {
                        currentTouchLeft = touches[0].pageX;
                        currentTouchTop = touches[0].pageY;
                    }
                    var positions = self.__positions;
                    if (self.__isDragging) {
                        var moveX = currentTouchLeft - self.__lastTouchLeft;
                        var moveY = currentTouchTop - self.__lastTouchTop;
                        var scrollLeft = self.__scrollLeft;
                        var scrollTop = self.__scrollTop;
                        var level = self.__zoomLevel;
                        if (scale != null && self.options.zooming) {
                            var oldLevel = level;
                            level = level / self.__lastScale * scale;
                            level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
                            if (oldLevel !== level) {
                                var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
                                var currentTouchTopRel = currentTouchTop - self.__clientTop;
                                scrollLeft = (currentTouchLeftRel + scrollLeft) * level / oldLevel - currentTouchLeftRel;
                                scrollTop = (currentTouchTopRel + scrollTop) * level / oldLevel - currentTouchTopRel;
                                self.__computeScrollMax(level);
                            }
                        }
                        if (self.__enableScrollX) {
                            scrollLeft -= moveX * this.options.speedMultiplier;
                            var maxScrollLeft = self.__maxScrollLeft;
                            if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                                if (self.options.bouncing) {
                                    scrollLeft += moveX / 2 * this.options.speedMultiplier;
                                } else if (scrollLeft > maxScrollLeft) {
                                    scrollLeft = maxScrollLeft;
                                } else {
                                    scrollLeft = 0;
                                }
                            }
                        }
                        if (self.__enableScrollY) {
                            scrollTop -= moveY * this.options.speedMultiplier;
                            var maxScrollTop = self.__maxScrollTop;
                            if (scrollTop > maxScrollTop || scrollTop < 0) {
                                if (self.options.bouncing) {
                                    scrollTop += moveY / 2 * this.options.speedMultiplier;
                                    if (!self.__enableScrollX && self.__refreshHeight != null) {
                                        if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
                                            self.__refreshActive = true;
                                            if (self.__refreshActivate) {
                                                self.__refreshActivate();
                                            }
                                        } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
                                            self.__refreshActive = false;
                                            if (self.__refreshDeactivate) {
                                                self.__refreshDeactivate();
                                            }
                                        }
                                    }
                                } else if (scrollTop > maxScrollTop) {
                                    scrollTop = maxScrollTop;
                                } else {
                                    scrollTop = 0;
                                }
                            }
                        }
                        if (positions.length > 60) {
                            positions.splice(0, 30);
                        }
                        positions.push(scrollLeft, scrollTop, timeStamp);
                        self.__publish(scrollLeft, scrollTop, level);
                    } else {
                        var minimumTrackingForScroll = self.options.locking ? 3 : 0;
                        var minimumTrackingForDrag = 5;
                        var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
                        var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
                        self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
                        self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
                        positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);
                        self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
                        if (self.__isDragging) {
                            self.__interruptedAnimation = false;
                        }
                    }
                    self.__lastTouchLeft = currentTouchLeft;
                    self.__lastTouchTop = currentTouchTop;
                    self.__lastTouchMove = timeStamp;
                    self.__lastScale = scale;
                },
                doTouchEnd: function(timeStamp) {
                    if (timeStamp instanceof Date) {
                        timeStamp = timeStamp.valueOf();
                    }
                    if (typeof timeStamp !== "number") {
                        throw new Error("Invalid timestamp value: " + timeStamp);
                    }
                    var self = this;
                    if (!self.__isTracking) {
                        return;
                    }
                    self.__isTracking = false;
                    if (self.__isDragging) {
                        self.__isDragging = false;
                        if (self.__isSingleTouch && self.options.animating && timeStamp - self.__lastTouchMove <= 100) {
                            var positions = self.__positions;
                            var endPos = positions.length - 1;
                            var startPos = endPos;
                            for (var i = endPos; i > 0 && positions[i] > self.__lastTouchMove - 100; i -= 3) {
                                startPos = i;
                            }
                            if (startPos !== endPos) {
                                var timeOffset = positions[endPos] - positions[startPos];
                                var movedLeft = self.__scrollLeft - positions[startPos - 2];
                                var movedTop = self.__scrollTop - positions[startPos - 1];
                                self.__decelerationVelocityX = movedLeft / timeOffset * (1e3 / 60);
                                self.__decelerationVelocityY = movedTop / timeOffset * (1e3 / 60);
                                var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;
                                if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                                    if (!self.__refreshActive) {
                                        self.__startDeceleration(timeStamp);
                                    }
                                }
                            } else {
                                self.options.scrollingComplete();
                            }
                        } else if (timeStamp - self.__lastTouchMove > 100) {
                            self.options.scrollingComplete();
                        }
                    }
                    if (!self.__isDecelerating) {
                        if (self.__refreshActive && self.__refreshStart) {
                            self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);
                            if (self.__refreshStart) {
                                self.__refreshStart();
                            }
                        } else {
                            if (self.__interruptedAnimation || self.__isDragging) {
                                self.options.scrollingComplete();
                            }
                            self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
                            if (self.__refreshActive) {
                                self.__refreshActive = false;
                                if (self.__refreshDeactivate) {
                                    self.__refreshDeactivate();
                                }
                            }
                        }
                    }
                    self.__positions.length = 0;
                },
                __publish: function(left, top, zoom, animate) {
                    var self = this;
                    var wasAnimating = self.__isAnimating;
                    if (wasAnimating) {
                        core.effect.Animate.stop(wasAnimating);
                        self.__isAnimating = false;
                    }
                    if (animate && self.options.animating) {
                        self.__scheduledLeft = left;
                        self.__scheduledTop = top;
                        self.__scheduledZoom = zoom;
                        var oldLeft = self.__scrollLeft;
                        var oldTop = self.__scrollTop;
                        var oldZoom = self.__zoomLevel;
                        var diffLeft = left - oldLeft;
                        var diffTop = top - oldTop;
                        var diffZoom = zoom - oldZoom;
                        var step = function(percent, now, render) {
                            if (render) {
                                self.__scrollLeft = oldLeft + diffLeft * percent;
                                self.__scrollTop = oldTop + diffTop * percent;
                                self.__zoomLevel = oldZoom + diffZoom * percent;
                                if (self.__callback) {
                                    self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);
                                }
                            }
                        };
                        var verify = function(id) {
                            return self.__isAnimating === id;
                        };
                        var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                            if (animationId === self.__isAnimating) {
                                self.__isAnimating = false;
                            }
                            if (self.__didDecelerationComplete || wasFinished) {
                                self.options.scrollingComplete();
                            }
                            if (self.options.zooming) {
                                self.__computeScrollMax();
                            }
                        };
                        self.__isAnimating = core.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
                    } else {
                        self.__scheduledLeft = self.__scrollLeft = left;
                        self.__scheduledTop = self.__scrollTop = top;
                        self.__scheduledZoom = self.__zoomLevel = zoom;
                        if (self.__callback) {
                            self.__callback(left, top, zoom);
                        }
                        if (self.options.zooming) {
                            self.__computeScrollMax();
                        }
                    }
                },
                __computeScrollMax: function(zoomLevel) {
                    var self = this;
                    if (zoomLevel == null) {
                        zoomLevel = self.__zoomLevel;
                    }
                    self.__maxScrollLeft = Math.max(self.__contentWidth * zoomLevel - self.__clientWidth, 0);
                    self.__maxScrollTop = Math.max(self.__contentHeight * zoomLevel - self.__clientHeight, 0);
                },
                __startDeceleration: function(timeStamp) {
                    var self = this;
                    if (self.options.paging) {
                        var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
                        var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
                        var clientWidth = self.__clientWidth;
                        var clientHeight = self.__clientHeight;
                        self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
                        self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
                        self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
                        self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
                    } else {
                        self.__minDecelerationScrollLeft = 0;
                        self.__minDecelerationScrollTop = 0;
                        self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
                        self.__maxDecelerationScrollTop = self.__maxScrollTop;
                    }
                    var step = function(percent, now, render) {
                        self.__stepThroughDeceleration(render);
                    };
                    var minVelocityToKeepDecelerating = self.options.snapping ? 4 : .1;
                    var verify = function() {
                        var shouldContinue = Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
                        if (!shouldContinue) {
                            self.__didDecelerationComplete = true;
                        }
                        return shouldContinue;
                    };
                    var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                        self.__isDecelerating = false;
                        if (self.__didDecelerationComplete) {
                            self.options.scrollingComplete();
                        }
                        self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
                    };
                    self.__isDecelerating = core.effect.Animate.start(step, verify, completed);
                },
                __stepThroughDeceleration: function(render) {
                    var self = this;
                    var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
                    var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
                    if (!self.options.bouncing) {
                        var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
                        if (scrollLeftFixed !== scrollLeft) {
                            scrollLeft = scrollLeftFixed;
                            self.__decelerationVelocityX = 0;
                        }
                        var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
                        if (scrollTopFixed !== scrollTop) {
                            scrollTop = scrollTopFixed;
                            self.__decelerationVelocityY = 0;
                        }
                    }
                    if (render) {
                        self.__publish(scrollLeft, scrollTop, self.__zoomLevel);
                    } else {
                        self.__scrollLeft = scrollLeft;
                        self.__scrollTop = scrollTop;
                    }
                    if (!self.options.paging) {
                        var frictionFactor = .95;
                        self.__decelerationVelocityX *= frictionFactor;
                        self.__decelerationVelocityY *= frictionFactor;
                    }
                    if (self.options.bouncing) {
                        var scrollOutsideX = 0;
                        var scrollOutsideY = 0;
                        var penetrationDeceleration = self.options.penetrationDeceleration;
                        var penetrationAcceleration = self.options.penetrationAcceleration;
                        if (scrollLeft < self.__minDecelerationScrollLeft) {
                            scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
                        } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
                            scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
                        }
                        if (scrollTop < self.__minDecelerationScrollTop) {
                            scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
                        } else if (scrollTop > self.__maxDecelerationScrollTop) {
                            scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
                        }
                        if (scrollOutsideX !== 0) {
                            if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
                                self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                            } else {
                                self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                            }
                        }
                        if (scrollOutsideY !== 0) {
                            if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
                                self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                            } else {
                                self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                            }
                        }
                    }
                }
            };
            for (var key in members) {
                Scroller.prototype[key] = members[key];
            }
        })();
        (function(global) {
            var time = Date.now || function() {
                return +(new Date);
            };
            var desiredFrames = 60;
            var millisecondsPerSecond = 1e3;
            var running = {};
            var counter = 1;
            if (!global.core) {
                global.core = {
                    effect: {}
                };
            } else if (!core.effect) {
                core.effect = {};
            }
            core.effect.Animate = {
                requestAnimationFrame: function() {
                    var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
                    var isNative = !!requestFrame;
                    if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
                        isNative = false;
                    }
                    if (isNative) {
                        return function(callback, root) {
                            requestFrame(callback, root);
                        };
                    }
                    var TARGET_FPS = 60;
                    var requests = {};
                    var requestCount = 0;
                    var rafHandle = 1;
                    var intervalHandle = null;
                    var lastActive = +(new Date);
                    return function(callback, root) {
                        var callbackHandle = rafHandle++;
                        requests[callbackHandle] = callback;
                        requestCount++;
                        if (intervalHandle === null) {
                            intervalHandle = setInterval(function() {
                                var time = +(new Date);
                                var currentRequests = requests;
                                requests = {};
                                requestCount = 0;
                                for (var key in currentRequests) {
                                    if (currentRequests.hasOwnProperty(key)) {
                                        currentRequests[key](time);
                                        lastActive = time;
                                    }
                                }
                                if (time - lastActive > 2500) {
                                    clearInterval(intervalHandle);
                                    intervalHandle = null;
                                }
                            }, 1e3 / TARGET_FPS);
                        }
                        return callbackHandle;
                    };
                }(),
                stop: function(id) {
                    var cleared = running[id] != null;
                    if (cleared) {
                        running[id] = null;
                    }
                    return cleared;
                },
                isRunning: function(id) {
                    return running[id] != null;
                },
                start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
                    var start = time();
                    var lastFrame = start;
                    var percent = 0;
                    var dropCounter = 0;
                    var id = counter++;
                    if (!root) {
                        root = document.body;
                    }
                    if (id % 20 === 0) {
                        var newRunning = {};
                        for (var usedId in running) {
                            newRunning[usedId] = true;
                        }
                        running = newRunning;
                    }
                    var step = function(virtual) {
                        var render = virtual !== true;
                        var now = time();
                        if (!running[id] || verifyCallback && !verifyCallback(id)) {
                            running[id] = null;
                            completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
                            return;
                        }
                        if (render) {
                            var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
                            for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                                step(true);
                                dropCounter++;
                            }
                        }
                        if (duration) {
                            percent = (now - start) / duration;
                            if (percent > 1) {
                                percent = 1;
                            }
                        }
                        var value = easingMethod ? easingMethod(percent) : percent;
                        if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                            running[id] = null;
                            completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
                        } else if (render) {
                            lastFrame = now;
                            core.effect.Animate.requestAnimationFrame(step, root);
                        }
                    };
                    running[id] = true;
                    core.effect.Animate.requestAnimationFrame(step, root);
                    return id;
                }
            };
        })(global);
    },
    "1p": function(require, module, exports, global) {
        "use strict";
        var Window = boxspring.define("boxspring.view.Window", {
            inherits: boxspring.view.View,
            statics: {
                instance: function() {
                    if (instance == null) {
                        instance = new boxspring.view.Window;
                    }
                    return instance;
                }
            },
            constructor: function() {
                Window.parent.constructor.call(this);
                this.measuredOffset.x = 0;
                this.measuredOffset.y = 0;
                return this;
            },
            onAdd: function(view, e) {
                Window.parent.onAdd.apply(this, arguments);
                view.setWindow(this);
            },
            onRemove: function(view, e) {
                Window.parent.onRemove.apply(this, arguments);
                view.setWindow(null);
            }
        });
        var instance = null;
    },
    "1q": function(require, module, exports, global) {
        "use strict";
        var Window = boxspring.override("boxspring.view.Window", {
            constructor: function() {
                Window.parent.constructor.call(this);
                window.addEventListener("resize", this.bind("__onWindowResize"));
                return this;
            },
            __onWindowResize: function() {
                this.scheduleLayout();
            }
        });
    }
});
