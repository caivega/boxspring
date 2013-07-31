"use strict"

/**
 * @class boxspring.view.Window
 * @super boxspring.view.View
 * @since 0.9
 */
var Window = boxspring.define('boxspring.view.Window', {

	inherits: boxspring.view.View,

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method instance
		 * @scope static
		 * @since 0.9
		 */
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

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		Window.parent.constructor.call(this)
		this.measuredOffset.x = 0
		this.measuredOffset.y = 0
		return this
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onAdd
	 * @since 0.9
	 */
	onAdd: function(view, e) {
		Window.parent.onAdd.call(this, view)
		view.setWindow(this)
	},

	/**
	 * @method onRemove
	 * @since 0.9
	 */
	onRemove: function(view, e) {
		Window.parent.onRemove.call(this, view)
		view.setWindow(null)
	}

})

/**
 * @brief The current instance.
 * @scope hidden
 * @since 0.9
 */
var instance = null