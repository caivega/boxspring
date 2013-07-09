"use strict"

var Size  = boxspring.geom.Size
var Point = boxspring.geom.Point

/**
 * Represents a geometrical rectangle with an origin and size.
 * @class boxspring.geom.Rectangle
 * @since 0.9
 */
var Rectangle = boxspring.define('boxspring.geom.Rectangle', {

    //--------------------------------------------------------------------------
    // Static
    //--------------------------------------------------------------------------

    statics: {

        /**
         * Retrieve the rectangle created by joining two rectangles.
         * @method union
         * @static
         */
        union: function(r1, r2) {
            var x1 = Math.min(r1.origin.x, r2.origin.x)
            var y1 = Math.min(r1.origin.y, r2.origin.y)
            var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x)
            var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y)
            return new Rectangle(x1, y1, x2 - x1, y2 - y1)
        }
    },

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

        /**
         * The origin of the rectangle.
         * @property origin
         * @since 0.9
         */
        origin: {
            value: function() {
                return new Point(0, 0)
            }
        },

        /**
         * The size of the rectangle.
         * @property size
         * @since 0.9
         */
        size: {
            value: function() {
                return new Size(0, 0)
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