"use strict"

var constructors = boxspring.constructors = {}

//------------------------------------------------------------------------------
// Alias
//------------------------------------------------------------------------------

var has = _.has

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Define a new class that will inherit the boxspring base object.
 * @function boxspring.define
 * @since 0.9
 */
boxspring.define = function(name, prototype) {

	var sprototype = null
	var sconstruct = prototype.inherits || boxspring.Object
	if (sconstruct) {
		sprototype = sconstruct.prototype
	}

	var constructor = has(prototype, 'constructor') ? prototype.constructor : sconstruct ? function() {
		return sconstruct.apply(this, arguments)
	} : function() {}

	constructors[name] = constructor

	if (sconstruct) {
		constructor.prototype = Object.create(sprototype)
		constructor.prototype.constructor = constructor
		constructor.parent = sprototype
	}

	constructor.prototype.$kind = name

	boxspring.set(global, name, constructor)

	return boxspring.implement(name, prototype)
}

boxspring.get = function(object, key) {

}

boxspring.set = function(object, key, val) {
	return assign(key, val, object || global)
}

/**
 * Assign a value created by the path of a string to an object
 * @private
 */
var assign = function(key, val, obj) {

	if (!obj) obj = global

	var nodes = _.isArray(key) ? key : key.split('.')
	if (nodes.length === 1) {
		obj[key] = val
		return
	}

	var node = nodes.shift()

	assign(nodes, val, obj[node] || (obj[node] = {}))
}
