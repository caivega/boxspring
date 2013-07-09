"use strict"

//------------------------------------------------------------------------------
// Aliases
//------------------------------------------------------------------------------

var each = _.each

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Add the specified key to the constructor object.
 * @function boxspring.extend
 * @since 0.9
 */
boxspring.extend = function(name, object) {

	var constructor = boxspring.constructors[name]
	if (constructor == null) {
		throw new Error('The class ' + name + ' does not exists')
	}

	each(object, function(val, key) {

		if (key === 'constructor' || key === 'prototype' || key === 'parent')
			return this

		constructor[key] = val
	})

	return constructor
}