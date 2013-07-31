"use strict"

/**
 * @class boxspring.view.Window
 * @super boxspring.view.Window
 * @since 0.9
 */
var Window = boxspring.override('boxspring.view.Window', {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		Window.parent.constructor.call(this)
		window.addEventListener('resize', this.bind('__onWindowResize'))
		return this
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method __onWindowResize
	 * @brief Called when the window resizes.
	 * @scope private
	 * @since 0.9
	 */
	__onWindowResize: function() {
		this.scheduleLayout()
	}

})