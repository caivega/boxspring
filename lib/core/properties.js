"use strict"

/**
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

	_.each(object, function(val, key) {

		var name = '__' + key

		var value = _.has(val, 'value') ? val.value : _.has(properties, name) && _.has(properties[name], 'value') ? properties[name].value : null
		var write = _.has(val, 'write') ? val.write : _.has(properties, name) && _.has(properties[name], 'write') ? properties[name].write : true
		var clone = _.has(val, 'clone') ? val.clone : _.has(properties, name) && _.has(properties[name], 'clone') ? properties[name].clone : false
		var onSet = _.has(val, 'onSet') ? val.onSet : _.has(properties, name) && _.has(properties[name], 'onSet') ? properties[name].onSet : function(value) { return value }
		var onGet = _.has(val, 'onGet') ? val.onGet : _.has(properties, name) && _.has(properties[name], 'onGet') ? properties[name].onGet : function(value) { return value }

		var setup = function() {

			if (_.has(this, name))
				return

			if (value) switch (true) {
				case _.isFunction(value):
					this[name] = value.call(this)
					return
				case _.isArray(value):
				case _.isObject(value):
					this[name] = _.clone(value)
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

				var curValue = this[name]
				var retValue = onGet.call(this, curValue)
				if (retValue === undefined) {
					retValue = curValue
				}

				return clone ? _.clone(retValue) : retValue
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

				var oldValue = this[name]
				var newValue = onSet.call(this, value, oldValue)
				if (newValue === undefined) {
					newValue = oldValue
				}

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

