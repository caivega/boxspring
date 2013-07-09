"use strict"

/**
 * The thickness of a frame around a rectangle.
 * @class boxspring.geom.Thickness
 * @since 0.9
 */
var Thickness = boxspring.define('boxspring.geom.Thickness', {

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

        /**
         * The top edge of the frame.
         * @property top
         * @since 0.9
         */
        top: {
            value: 0,
            check: function(value) {
                return value || 0
            }
        },

        /**
         * The bottom edge of the frame.
         * @property bottom
         * @since 0.9
         */
        bottom: {
            value: 0,
            check: function(value) {
                return value || 0
            }
        },

        /**
         * The left edge of the frame.
         * @property left
         * @since 0.9
         */
        left: {
            value: 0,
            check: function(value) {
                return value || 0
            }
        },

        /**
         * The right edge of the frame.
         * @property right
         * @since 0.9
         */
        right: {
            value: 0,
            check: function(value) {
                return value || 0
            }
        }
    },

    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------

    /**
     * Initialize the object.
     * @method constructor
     * @since 0.9
     */
    constructor: function() {

        Thickness.parent.constructor.call(this)

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
    }

})