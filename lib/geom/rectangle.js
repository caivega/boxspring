"use strict"

/**
 * @class boxspring.geom.Rectangle
 * @super boxspring.Object
 * @since 0.9
 */
var Rectangle = boxspring.define('boxspring.geom.Rectangle', {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method union
		 * @scope static
		 * @since 0.9
		 */
		union: function(r1, r2) {
			var x1 = Math.min(r1.origin.x, r2.origin.x)
			var y1 = Math.min(r1.origin.y, r2.origin.y)
			var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x)
			var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y)
			return new boxspring.geom.Rectangle(x1, y1, x2 - x1, y2 - y1)
		}
	},

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property origin
		 * @since 0.9
		 */
		origin: {
			value: function() {
				return new boxspring.geom.Point(0, 0)
			}
		},

		/**
		 * @property size
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size(0, 0)
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
	constructor: function(x, y, w, h) {

		Rectangle.parent.constructor.call(this)

		var rect = arguments[0]
		if (rect instanceof Rectangle) {
			x = rect.origin.x
			y = rect.origin.y
			w = rect.size.x
			h = rect.size.y
		}

		this.origin.x = x
		this.origin.y = y
		this.size.x = w
		this.size.y = h

		return this
	}
})