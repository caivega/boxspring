"use strict"

/**
 * @class boxspring.geom.Size
 * @super boxspring.Object
 * @since 0.9
 */
var Size = boxspring.define('boxspring.geom.Size', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property x
		 * @since 0.9
		 */
		x: {
			value: 0,
			onSet: function(value) {
				return value || 0
			}
		},

		/**
		 * @property y
		 * @since 0.9
		 */
		y: {
			value: 0,
			onSet: function(value) {
				return value || 0
			}
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(x, y) {

		Size.parent.constructor.call(this)

		var size = arguments[0]
		if (size instanceof Size) {
			x = size.x
			y = size.y
		}

		this.x = x
		this.y = y

		return this
	}
})