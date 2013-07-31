"use strict"

/**
 * @class boxspring.event.Emitter
 * @super boxspring.Object
 * @since 0.9
 */
var Emitter = boxspring.define('boxspring.event.Emitter', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property parentReceiver
		 * @since 0.9
		 */
		parentReceiver: {
			write: false
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method addListener
	 * @since 0.9
	 */
	addListener: function(type, listener) {

		type = type.toLowerCase()

		if (type === 'propertychange') {
			if (this.addPropertyChangeListener) {
				this.addPropertyChangeListener(arguments[1], arguments[2])
				return this
			}
		}

		var listeners = this.__listeners || (this.__listeners = {})

		var events = listeners[type]
		if (events === undefined) {
			events = listeners[type] = []
		}

		if (events.indexOf(listener) === -1) {
			events.push(listener)
		}

		return this
	},

	/**
	 * @method hasListener
	 * @since 0.9
	 */
	hasListener: function(type, listener) {

		type = type.toLowerCase()

		if (type === 'propertychange') {
			if (this.hasPropertyListener) {
				this.hasPropertyListener(arguments[1], arguments[2])
				return this
			}
		}

		var listeners = this.__listeners || (this.__listeners = {})

		var events = listeners[type]
		if (events === undefined)
			return this

		return events.indexOf(listener) > -1
	},

	/**
	 * @method removeListener
	 * @since 0.9
	 */
	removeListener: function(type, listener) {

		type = type.toLowerCase()

		if (type === 'propertychange') {
			if (this.removePropertyListener) {
				this.removePropertyListener(arguments[1], arguments[2])
				return this
			}
		}

		var events = this.__listeners[type]
		if (events === undefined)
			return this

		var index = events.indexOf(listener)
		if (index > -1) {
			events.splice(index, 1)
		}

		return this
	},

	/**
	 * @method removeAllListeners
	 * @since 0.9
	 */
	removeAllListeners: function(type) {

		if (type) {

			type = type.toLowerCase()

			if (type === 'propertychange') {
				if (this.removePropertyListeners) {
					this.removePropertyListeners(arguments[1])
					return this
				}
			}

			delete this.__listeners[type]
			return this
		}

		this.__listeners = []

		return this
	},

	/**
	 * @method on
	 * @since 0.9
	 */
	on: function() {
		return this.addListener.apply(this, arguments)
	},

	/**
	 * @method off
	 * @since 0.9
	 */
	off: function() {
		return this.removeListener.apply(this, arguments)
	},

	/**
	 * @method once
	 * @since 0.9
	 */
	once: function(type, listener) {

		var callback = function(e) {
			this.removeListener(type, callback)
			listener(e)
		}

		return this.addListener(type, callback)
	},

	/**
	 * @method emit
	 * @since 0.9
	 */
	emit: function(event) {

		if (typeof event === 'string') {
			event = new boxspring.event.Event(event, false, true)
		}

		var parameters = slice.call(arguments, 1)
		if (parameters.length) {
			event.setParameters(parameters)
		}

		if (event.__source === null) {
			event.setSource(this)
		}

		event.setTarget(this);

		var listeners = this.__listeners && this.__listeners[event.type]
		if (listeners) {

			var args = event.parameters
			args.push(event)
			for (var i = 0, l = listeners.length; i < l; i++) {
				listeners[i].apply(this, args)
			}
		}

		if (!event.bubbles || event.stopped)
			return this

		var parentReceiver = this.parentReceiver
		if (parentReceiver instanceof Emitter) {
			parentReceiver.emit.call(parentReceiver, e)
		}

		return this
	},

	//--------------------------------------------------------------------------
	// Methods (Internal)
	//--------------------------------------------------------------------------

	/**
	 * @method setParentReceiver
	 * @scope internal
	 * @since 0.9
	 */
	setParentReceiver: function(receiver) {
		this.__parentReceiver = receiver
		return this
	}
})

var slice = Array.prototype.slice