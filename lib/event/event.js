"use strict"

/**
 * @class boxspring.event.Event
 * @super boxspring.Object
 * @since 0.9
 */
var Event = boxspring.define('boxspring.event.Event', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property type
		 * @since 0.9
		 */
		type: {
			write: false,
		},

		/**
		 * @property source
		 * @since 0.9
		 */
		source: {
			write: false,
		},

		/**
		 * @property target
		 * @since 0.9
		 */
		target: {
			write: false,
		},

		/**
		 * @property parameters
		 * @since 0.9
		 */
		parameters: {
			write: false,
			clone: true,
			value: []
		},

		/**
		 * @property bubbleable
		 * @since 0.9
		 */
		bubbleable: {
			write: false,
			value: false
		},

		/**
		 * @property cancelable
		 * @since 0.9
		 */
		cancelable: {
			write: false,
			value: true
		},

		/**
		 * @property stopped
		 * @since 0.9
		 */
		stopped: {
			write: false,
			value: false
		},

		/**
		 * @property canceled
		 * @since 0.9
		 */
		canceled: {
			write: false,
			value: false
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method stop
	 * @since 0.9
	 */
	stop: function() {
		this.__stopped = true
		return this
	},

	/**
	 * @method cancel
	 * @since 0.9
	 */
	cancel: function() {
		this.__stopped = true
		this.__canceled = true
		return this
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(type, bubbleable, cancelable) {
		Event.parent.constructor.call(this)
		this.__bubbleable = bubbleable
		this.__cancelable = cancelable
		this.__type = type
		return this
	},

	//--------------------------------------------------------------------------
	// Internal
	//--------------------------------------------------------------------------

	/**
	 * @method setTarget
	 * @scope internal
	 * @since 0.9
	 */
	setTarget: function(target) {
		this.__target = target
		return this
	},

	/**
	 * @method setSource
	 * @scope internal
	 * @since 0.9
	 */
	setSource: function(source) {
		this.__source = source
		return this
	},

	/**
	 * @method setParameters
	 * @scope internal
	 * @since 0.9
	 */
	setParameters: function(parameters) {
		this.__parameters = Array.prototype.slice.call(parameters)
		return this
	}
})