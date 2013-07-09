 "use strict"

//------------------------------------------------------------------------------
// Aliases
//------------------------------------------------------------------------------

var each = _.each

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Add the specified key to the constructor prototype.
 * @function boxspring.extend
 * @since 0.9
 */
boxspring.implement = function(name, object) {

	var constructor = boxspring.constructors[name]
	if (constructor == null) {
		throw new Error('The class ' + name + ' does not exists')
	}

	var prototype = constructor.prototype

	each(object, function(val, key) {

		if (key === 'statics') {
			boxspring.extend(name, val)
			return
		}

		if (key === 'properties') {
			boxspring.properties(name, val)
			return
		}

		if (key === 'constructor' || key === 'prototype' || key === 'inherits')
			return this

		var descriptor = Object.getOwnPropertyDescriptor(prototype, key)
		if (descriptor) {
			Object.defineProperty(prototype, key, descriptor)
		} else {
			prototype[key] = val
		}

	})

	return constructor
}
