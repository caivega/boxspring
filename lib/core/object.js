"use strict"

var Event = null

var forIn = _.forIn

/**
 * The current unique identifier index.
 * @private
 */
var UID = 0

/**
 * @class boxspring.Object
 * @version 1.0
 */
var O = boxspring.define('boxspring.Object', {

	inherits: null,

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * Return an array the object associated to each items of a path.
		 * @method forPath
		 * @since 0.9
		 * @static
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
		 * Set the value of an object using a path.
		 * @method set
		 * @since 0.9
		 * @static
		 */
		set: function(object, path, value) {

			O.forPath(object, path, function(owner, item, name, head, tail) {
				if (tail === '') owner[name] = value
			})

			return object
		},

		/**
		 * Set the value of an object using a path.
		 * @method get
		 * @since 0.9
		 * @static
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
		 * This instance unique identifier.
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
		 * This instance class name.
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
     * Initialize the object.
     * @method constructor
     * @since 0.9
     */
	constructor: function() {

		if (Event === null) {
			Event = boxspring.event.Event
		}

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
     * Prepare this object for garbage collection.
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
     * Assign a value to a specified key property.
     * @method set
     * @since 0.9
     */
	set: function(path, value) {
		return O.set(this, path, value)
	},

    /**
     * Return the value of a specified key property.
     * @method get
     * @since 0.9
     */
	get: function(path) {
		return O.get(this, path)
	},

    /**
     * Add a listener for a specified property.
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
     * Indicate whether the specified callback exists.
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
     * Remove a listener for a specified property.
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
     * Remove all observers for a specified property.
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
     * Notify all the listeners of a specified property.
     * @method notifyPropertyChangeListeners
     * @since 0.9
     */
	notifyPropertyChangeListeners: function(property, newValue, oldValue) {

		var event = new Event('propertychange', false, true)
		event.__setTarget(this)
		event.__setSource(this)

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

			event.__setParameters([
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
     * Returns a method bound to this context.
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
	// Default Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * Called when a property from this object changes.
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, newValue, oldValue, e) {

	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @private
	 */
	__propertyListeners: null,

	/**
	 * @private
	 */
	__propertyObservers: null
})

/**
 * Add observer to all keys of a path
 * @function addPropertyChangeObserver
 * @private
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
 * Remove observers from all keys of a path
 * @function remPropertyChangeObserver
 * @private
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
 * @private
 */
var expand = function(path) {
	return path.split('.')
}

/**
 * @private
 */
var error = function(message) {
	throw new Error(message)
}

/**
 * @private
 */
var owns = function(object, key) {
	return key in object
}
