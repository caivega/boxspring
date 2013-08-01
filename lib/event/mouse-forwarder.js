"use strict"

/**
 * @class boxspring.event.MouseForwarder
 * @super boxspring.event.Forwarder
 * @since 0.9
 */
var MouseForwarder = boxspring.define('boxspring.event.MouseForwarder', {

	inherits: boxspring.event.Forwarder,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(receiver) {

		MouseForwarder.parent.constructor.call(this, receiver)

		window.addEventListener('mousedown', this.bind('onMouseDown'))
		window.addEventListener('mousemove', this.bind('onMouseMove'))
		window.addEventListener('mouseup', this.bind('onMouseUp'))
		window.addEventListener('click', this.bind('onClick'))

		return this;
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {

		window.removeEventListener('mousedown', this.bind('onMouseDown'))
		window.removeEventListener('mousemove', this.bind('onMouseMove'))
		window.removeEventListener('mouseup', this.bind('onMouseUp'))
		window.removeEventListener('click', this.bind('onClick'))

		MouseForwarder.parent.destroy.call(this)
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onMouseDown
	 * @since 0.9
	 */
	onMouseDown: function(e) {

	},

	/**
	 * @method onMouseMove
	 * @since 0.9
	 */
	onMouseMove: function(e) {

	},

	/**
	 * @method onMouseUp
	 * @since 0.9
	 */
	onMouseUp: function(e) {

	},

	/**
	 * @method onClick
	 * @since 0.9
	 */
	onClick: function(e) {

	}

})