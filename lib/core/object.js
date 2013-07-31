"use strict"

/**
 * @class boxspring.Object
 * @since 0.9
 */
var O = boxspring.define('boxspring.Object', {

	inherits: null,

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method forPath
		 * @scope static
		 * @since 0.9
		 */
		forPath: function(object, path, callback, context) {

			var head = []
			var tail = expand(path)
			var owner = object
			var value = null

			while (tail.length) {
				var name = tail.shift()
				owns(owner, name) || error('Error parsing property path ' + path + ' for key ' + name)
				value = owner[name]
				var h = head.join('.')
				var t = tail.join('.')
				callback.call(context, owner, value, name, h, t)
				owner = owner[name]
				head.push(name)
			}

			return object
		},

		/**
		 * @method set
		 * @scope static
		 * @since 0.9
		 */
		set: function(object, path, value) {

			O.forPath(object, path, function(owner, item, name, head, tail) {
				if (tail === '') owner[name] = value
			})

			return object
		},

		/**
		 * @method get
		 * @scope static
		 * @since 0.9
		 */
		get: function(object, path) {

			var value = null

			O.forPath(object, path, function(owner, item, name, head, tail) {
				if (tail === '') value = owner[name]
			})

			return value
		},
	},

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property UID
		 * @since 0.9
		 */
		UID: {
			write: false,
			value: function() {
				return UID++
			}
		},

		/**
		 * @property kind
		 * @since 0.9
		 */
		kind: {
			write: false,
			value: function() {
				return this.$kind
			}
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {

		this.__bound = {}
		this.__propertyListeners = {}
		this.__propertyObservers = {}

		var constructor = this.constructor
		while (constructor) {

			var properties = constructor.$properties
			if (properties) {
				for (var key in properties) {
					properties[key].setup.call(this)
				}
			}

			var parent = constructor.parent
			if (parent == null) {
				break
			}

			constructor = parent.constructor
		}

		return this
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		this.__bound = null
		this.__propertyListeners = null
		this.__propertyObservers = null
		return this
	},

	/**
	 * @method set
	 * @since 0.9
	 */
	set: function(path, value) {
		return O.set(this, path, value)
	},

	/**
	 * @method get
	 * @since 0.9
	 */
	get: function(path) {
		return O.get(this, path)
	},

	/**
	 * @method addPropertyChangeListener
	 * @since 0.9
	 */
	addPropertyChangeListener: function(property, listener) {

		var listeners = this.__propertyListeners[property]
		if (listeners === undefined) {
			listeners = this.__propertyListeners[property] = []
		}

		var index = listeners.indexOf(listener)
		if (index > -1) {
			return this
		}

		if (listeners.length === 0) addPropertyChangeObserver(this, this, property)

		listeners.push(listener)

		return this
	},

	/**
	 * @method addPropertyChangeListener
	 * @since 0.9
	 */
	hasPropertyChangeListener: function(property, callback) {

		var listeners = this.__propertyListeners[property]
		if (listeners === undefined)
			return false

		return listeners.indexOf(callback) > -1
	},

	/**
	 * @method removePropertyListener
	 * @since 0.9
	 */
	removePropertyChangeListener: function(property, listener) {

		var listeners = this.__propertyListeners[property]
		if (listeners === undefined)
			return this

		var index = listeners.indexOf(listener)
		if (index > -1) {
			listeners.splice(index, 1)
		}

		if (listeners.length === 0) remPropertyChangeObserver(this, this, property)

		return this
	},

	/**
	 * @method removePropertyListeners
	 * @since 0.9
	 */
	removePropertyChangeListeners: function(property) {

		var listeners = this.__propertyListeners[property]
		if (listeners === undefined)
			return this

		delete this.__propertyListeners[property]

		remPropertyChangeObserver(this, this, property)

		return this
	},

	/**
	 * @method notifyPropertyChangeListeners
	 * @since 0.9
	 */
	notifyPropertyChangeListeners: function(property, newValue, oldValue) {

		var event = new boxspring.event.Event('propertychange', false, true)
		event.setTarget(this)
		event.setSource(this)

		if (this.onPropertyChange) {
			this.onPropertyChange(this, property, newValue, oldValue, event)
		}

		if (event.stopped || event.cancelled)
			return this

		var observers = this.__propertyObservers[property]
		if (observers === undefined)
			return this

		for (var i = 0; i < observers.length; i++) {

			var item = observers[i]

			var observerInstance = item.observer
			var observerProperty = item.property
			var observerChain = item.chain

			var propertyOldValue = oldValue
			var propertyNewValue = newValue

			if (observerChain) {
				propertyNewValue = newValue.get(observerChain)
				propertyOldValue = oldValue.get(observerChain)
				remPropertyChangeObserver(oldValue, observerInstance, observerProperty, observerChain)
				addPropertyChangeObserver(newValue, observerInstance, observerProperty, observerChain)
			}

			event.setParameters([
				observerProperty,
				propertyNewValue,
				propertyOldValue
			])

			if (propertyNewValue === propertyOldValue)
				continue

			var callbacks = observerInstance.__propertyListeners[observerProperty]
			if (callbacks) {
				for (var j = 0; j < callbacks.length; j++) {
					callbacks[j].call(observerInstance, observerInstance, observerProperty, propertyNewValue, propertyOldValue, event)
					if (event.canceled || event.stoped)
						break
				}
			}
		}
	},

	/**
	 * @method notifyPropertyChangeListeners
	 * @since 0.9
	 */
	bind: function(name) {

		if (name in this) {

			var bound = this.__bound[name]
			if (bound === undefined) {
				bound = this.__bound[name] = _.bind(this[name], this)
			}

			return bound
		}

		throw new Error('Method "' + name + '" does not exists within this object')
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, newValue, oldValue, e) {

	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @brief The property listener array.
	 * @scope private
	 * @since 0.9
	 */
	__propertyListeners: null,

	/**
	 * @brief The property observer array.
	 * @scope private
	 * @since 0.9
	 */
	__propertyObservers: null

})

/**
 * @brief The current unique identifier index.
 * @scope hidden
 */
var UID = 0

/**
 * @brief Add observer to all keys of a path
 * @scope hidden
 */
var addPropertyChangeObserver = function(object, observer, property, path) {

	O.forPath(object, path || property, function(owner, value, name, head, tail) {

		var observers = owner.__propertyObservers[name]
		if (observers === undefined) {
			observers = owner.__propertyObservers[name] = []
		}

		observers.push({
			observer: observer,
			property: property,
			chain: tail
		})
	})

	return object
}

/**
 * @brief Remove observers from all keys of a path
 * @scope hidden
 */
var remPropertyChangeObserver = function(object, observer, property, path) {

	O.forPath(object, path || property, function(owner, value, name, head, tail) {

		var observers = owner.__propertyObservers[name]
		if (observers === undefined)
			return false

		for (var i = observers.length - 1; i >= 0; i--) {
			var item = observers[i]
			if (item.observer === observer &&
				item.property === property) {
				observers.splice(i, 1)
			}
		}
	})

	return object
}

/**
 * @scope hidden
 */
var expand = function(path) {
	return path.split('.')
}

/**
 * @scope hidden
 */
var error = function(message) {
	throw new Error(message)
}

/**
 * @scope hidden
 */
var owns = function(object, key) {
	return key in object
}
