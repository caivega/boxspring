"use strict"

/**
 * @class boxspring.event.TouchEvent
 * @super boxspring.event.Event
 * @since 0.9
 */
var TouchEvent = boxspring.define('boxspring.event.TouchEvent', {

	inherits: boxspring.event.Event,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property touches
		 * @since 0.9
		 */
		touches: {
			write: false
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(type, bubbleable, cancelable, touches) {
		TouchEvent.parent.constructor.apply(this, arguments)
		this.__touches = touches
		return this;
	}

})