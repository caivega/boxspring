"use strict"

//------------------------------------------------------------------------------
// Aliases
//------------------------------------------------------------------------------

var has        = _.has
var each       = _.each
var copy       = _.clone
var isEmpty    = _.isEmpty
var isArray    = _.isArray
var isObject   = _.isObject
var isFunction = _.isFunction

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Define a property for the specified constructor.
 * @function boxspring.properties
 * @since 0.9
 */
boxspring.properties = function(name, object) {

	var constructor = boxspring.constructors[name]
	if (constructor == null) {
		throw new Error('The class ' + name + ' does not exists')
	}

	var parent = constructor.parent
	var prototype = constructor.prototype
	var properties = parent ? parent.constructor.$properties : null

	each(object, function(val, key) {

		var name = '__' + key

		var value = has(val, 'value') ? val.value : has(properties, name) && has(properties[name], 'value') ? properties[name].value : null
		var write = has(val, 'write') ? val.write : has(properties, name) && has(properties[name], 'write') ? properties[name].write : true
		var clone = has(val, 'clone') ? val.clone : has(properties, name) && has(properties[name], 'clone') ? properties[name].clone : false
		var onSet = has(val, 'onSet') ? val.onSet : has(properties, name) && has(properties[name], 'onSet') ? properties[name].onSet : function(value) { return value }
		var onGet = has(val, 'onGet') ? val.onGet : has(properties, name) && has(properties[name], 'onGet') ? properties[name].onGet : function(value) { return value }

		var setup = function() {

			if (has(this, name))
				return

			if (value) switch (true) {
				case isFunction(value):
					this[name] = value.call(this)
					return
				case isArray(value):
				case isObject(value):
					this[name] = copy(value)
					return
			}

			this[name] = value
		}

		if (constructor.$properties == null) {
			constructor.$properties = {}
		}

		constructor.$properties[key] = {
			setup: setup,
			value: value,
			write: write,
			clone: clone,
			onSet: onSet,
			onGet: onGet
		}

		Object.defineProperty(prototype, key, {

			get: function() {
				setup.call(this)
				var v = onGet.call(this, this[name])
				return clone ? copy(v) : v
			},

			set: function(value) {

				if (write === 'once') {
					if (this[name + '$set'] === undefined) {
						this[name + '$set'] = true
					} else {
						throw new Error('Property ' + key + ' can only be written once')
					}
				} else if (!write) {
					throw new Error('Property ' + key + ' is read only')
				}

				setup.call(this)

				var oldValue = this[name]
				var newValue = onSet.call(this, value, oldValue)
				if (newValue === undefined)
					newValue = value

				if (newValue === oldValue)
					return

				this[name] = newValue

				if (this.notifyPropertyChangeListeners) {
					this.notifyPropertyChangeListeners(key, newValue, oldValue)
				}
			}
		})
	})

	return constructor
}

var inherit = function(key, object, parent, def) {
	if (object && key in object) return object[key]
	if (parent && key in parent) return parent[key]
	return def
}

