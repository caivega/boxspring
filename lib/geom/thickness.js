"use strict"

/**
 * @class boxspring.geom.Thickness
 * @super boxspring.Object
 * @since 0.9
 */
var Thickness = boxspring.define('boxspring.geom.Thickness', {

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

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