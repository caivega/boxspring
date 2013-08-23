"use strict"

/**
 * @class boxspring.geom.Transform
 * @super boxspring.Object
 * @since 0.9
 */
var Transform = boxspring.define('boxspring.geom.Transform', {

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
				return new boxspring.geom.Point()
			}
		},

		/**
		 * @property translation
		 * @since 0.9
		 */
		translation: {
			value: function() {
				return new boxspring.geom.Point()
			}
		},

		/**
		 * @property rotation
		 * @since 0.9
		 */
		rotation: {
			value: 0
		},

		/**
		 * @property scale
		 * @since 0.9
		 */
		scale: {
			value: function() {
				return new boxspring.geom.Point(1, 1)
			}
		},

		/**
		 * @property skew
		 * @since 0.9
		 */
		shear: {
			value: function() {
				return new boxspring.geom.Point()
			}
		}
	}

})