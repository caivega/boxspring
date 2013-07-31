"use strict"

/**
 * A geometrical point on an x and y axis.
 * @class boxspring.geom.Point
 * @since 0.9
 */
var Point = boxspring.define('boxspring.geom.Point', {

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

        /**
         * The position on the x axis.
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
         * The position on the y axis.
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
     * Initialize the object.
     * @method constructor
     * @since 0.9
     */
    constructor: function(x, y) {

       Point.parent.constructor.call(this)

        var point = arguments[0]
        if (point instanceof Point) {
            x = point.x
            y = point.y
        }

        this.x = x
        this.y = y

        return this
    }

})