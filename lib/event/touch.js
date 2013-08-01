"use strict"

/**
 * @class boxspring.event.Touch
 * @super boxspring.Object
 * @since 0.9
 */
var Touch = boxspring.define('boxspring.event.Touch', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

        /**
         * @property identifier
         * @since 0.9
         */
		identifier: {
			write: false
		},

		/**
		 * @property target
		 * @since 0.9
		 */
		target: {
			write: false
		},

        /**
         * @property location
         * @since 0.9
         */
		location: {
			write: false,
			value: function() {
				return new boxspring.geom.Point(0, 0)
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
		Touch.parent.constructor.call(this)
		this.__identifier = (UID++).toString(36)
		return this
	},

	//--------------------------------------------------------------------------
	// Internal
	//--------------------------------------------------------------------------

    /**
     * @method setTarget
     * @scope internal
     * @since 0.9
     */
	setTarget: function(target) {
		this.__target = target
		return this
	},

    /**
     * @method setLocation
     * @scope internal
     * @since 0.9
     */
	setLocation: function(x, y) {
		this.__location.x = x
		this.__location.y = y
		return this
	}

})

var UID = Date.now()