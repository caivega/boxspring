"use strict"

/**
 * @class boxspring.geom.Alignment
 * @super boxspring.Object
 * @since 0.9
 */
var Alignment = boxspring.define('boxspring.geom.Alignment', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property x
		 * @since 0.9
		 */
		x: {
			value: 'start'
		},

		/**
		 * @property y
		 * @since 0.9
		 */
		y: {
			value: 'start'
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

		Alignment.parent.constructor.call(this)

		var alignment = arguments[0]
		if (alignment instanceof Alignment) {
			x = alignment.x
			y = alignment.y
		}

		this.x = x
		this.y = y

		return this
	}
})