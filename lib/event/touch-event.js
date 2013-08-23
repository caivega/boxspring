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
	// Internal
	//--------------------------------------------------------------------------

	/**
	 * @method setTouches
	 * @scope internal
	 * @since 0.9
	 */
	setTouches: function(touches) {
		this.__touches = touches
		return this
		// notifyPropertyChangeListeners
	}

})