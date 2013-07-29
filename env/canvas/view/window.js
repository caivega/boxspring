"use strict"

/**
 * Root view of a hierarchy.
 * @class boxspring.view.Window
 * @since 0.9
 */
var Window = boxspring.override('boxspring.view.Window', {

	constructor: function() {
		Window.parent.constructor.call(this)
		window.addEventListener('resize', this.bind('__onWindowResize'))
		return this
	},

	__onWindowResize: function() {
		this.scheduleLayout()
	}

})