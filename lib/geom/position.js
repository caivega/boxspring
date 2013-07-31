"use strict"

/**
 * @class boxspring.geom.Position
 * @super boxspring.Object
 * @since 0.9
 */
var Position = boxspring.define('boxspring.geom.Position', {

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
		},

		/**
		 * @property top
		 * @since 0.9
		 */
		top: {
			value: 0,
			onSet: function(value) {
				return value || 0
			}
		},

		/**
		 * @property bottom
		 * @since 0.9
		 */
		bottom: {
			value: 0,
			onSet: function(value) {
				return value || 0
			}
		},

		/**
		 * @property left
		 * @since 0.9
		 */
		left: {
			value: 0,
			onSet: function(value) {
				return value || 0
			}
		},

		/**
		 * @property right
		 * @since 0.9
		 */
		right: {
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
	constructor: function() {

		Position.parent.constructor.call(this)

		switch (arguments.length) {

			case 1:
				this.top = arguments[0]
				this.left = arguments[0]
				this.right = arguments[0]
				this.bottom = arguments[0]
				break

			case 2:
				this.top = arguments[0]
				this.left = arguments[1]
				this.right = arguments[1]
				this.bottom = arguments[0]
				break

			default:
				this.top = arguments[0]
				this.left = arguments[1]
				this.right = arguments[2]
				this.bottom = arguments[3]
				break
		}

		return this
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, value) {

		var update = function(property, value) {
			if (this[property] !== value) this[property] = value
		}

		switch (property) {
			case 'x':
				update.call(this, 'left', value)
				break
			case 'y':
				update.call(this, 'top', value)
				break
			case 'left':
				update.call(this, 'x', value)
				break
			case 'right':
				update.call(this, 'y', value)
				break
		}

		Position.parent.onPropertyChange.apply(this, arguments)
	}
})