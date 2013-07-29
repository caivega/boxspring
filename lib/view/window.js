"use strict"

/**
 * Root view of a hierarchy.
 * @class boxspring.view.Window
 * @since 0.9
 */
var Window = boxspring.define('boxspring.view.Window', {

	inherits: boxspring.view.View,

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		instance: function() {

			if (instance == null) {
				instance = new boxspring.view.Window()
			}

			return instance
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	constructor: function() {
		Window.parent.constructor.call(this)
		this.measuredOffset.x = 0
		this.measuredOffset.y = 0
		return this
	},

	/**
	 * @overridden
	 * @method onAdd
	 * @since 0.9
	 */
	onAdd: function(view, e) {
		Window.parent.onAdd.call(this, view)
		view.__setWindow(this)
	},

	/**
	 * @overridden
	 * @method onRemove
	 * @since 0.9
	 */
	onRemove: function(view, e) {
		Window.parent.onRemove.call(this, view)
		view.__setWindow(null)
	}

})

/**
 * The current instance.
 * @private
 */
var instance = null
