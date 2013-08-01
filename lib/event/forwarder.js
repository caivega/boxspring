"use strict"

/**
 * @class boxspring.event.Forwarder
 * @super boxspring.Object
 * @since  0.9
 */
var Forwarder = boxspring.define('boxspring.event.Forwarder', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property receiver
		 * @since 0.9
		 */
		receiver: {}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(receiver) {
		Forwarder.parent.constructor.call(this)
		this.receiver = receiver
		return this
	}

})