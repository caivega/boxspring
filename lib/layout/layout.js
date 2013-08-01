"use strict"

/**
 * @class boxspring.layout.Layout
 * @super boxspring.Object
 * @since 0.9
 */
var Layout = boxspring.define('boxspring.layout.Layout', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property view
		 * @since 0.9
		 */
		view: {
			value: null
		},

		/**
		 * @property size
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size()
			}
		},

		/**
		 * @property offset
		 * @since 0.9
		 */
		offset: {
			value: function() {
				return new boxspring.geom.Point()
			}
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method layout
	 * @since 0.9
	 */
	layout: function() {

	}

})