"use strict"

var Size      = boxspring.geom.Size
var Point     = boxspring.geom.Point
var Matrix    = boxspring.geom.Matrix
var Rectangle = boxspring.geom.Rectangle
var Thickness = boxspring.geom.Thickness
var Position  = boxspring.geom.Position
var Layout    = boxspring.layout.Layout

/**
 * Handle screen layout and interaction with the user.
 * @class boxspring.view.View
 * @since 0.9
 */
var View = boxspring.define('boxspring.view.View', {

    inherits: boxspring.event.Emitter,

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

        /**
         * The view name.
         * @property name
         * @since 0.9
         */
        name: {
            value: ''
        },

        /**
         * The view at the top of the hierarchy.
         * @property window
         * @since 0.9
         */
        window: {
            write: false
        },

        /**
         * The view that contains this view.
         * @property parent
         * @since 0.9
         */
        parent: {
            write: false
        },

        /**
         * The views this view contains.
         * @property children
         * @since 0.9
         */
        children: {
            write: false,
            clone: true,
            value: []
        },

       /**
         * The background color.
         * @property backgroundColor
         * @since 0.9
         */
        backgroundColor: {
            value: '#fff'
        },

        /**
         * The background image.
         * @property backgroundImage
         * @since 0.9
         */
        backgroundImage: {
            value: ''
        },

        /**
         * The background repeat.
         * @property backgroundRepeat
         * @since 0.9
         */
        backgroundRepeat: {
            value: 'repeat'
        },

        /**
         * The background size.
         * @property backgroundSize
         * @since 0.9
         */
        backgroundSize: {
            value: function() {
                return new Size('auto', 'auto')
            }
        },

        /**
         * The background clip.
         * @property backgroundClip
         * @since 0.9
         */
        backgroundClip: {
            value: 'border'
        },

        /**
         * The border color.
         * @property borderColor
         * @since 0.9
         */
        borderColor: {
            value: '#000'
        },

        /**
         * The border width.
         * @property borderSize
         * @since 0.9
         */
        borderWidth: {
            value: 0,
            check: Math.abs
        },

        /**
         * The border radius.
         * @property borderRadius
         * @since 0.9
         */
        borderRadius: {
            value: 0,
            check: Math.abs
        },

        /**
         * The shadow blur.
         * @property shadowBlur
         * @since 0.9
         */
        shadowBlur: {
            value: 0
        },

        /**
         * The shadow color.
         * @property shadowColor
         * @since 0.9
         */
        shadowColor: {
            value: '#000'
        },

        /**
         * The shadow offset.
         * @property shadowOffset
         * @since 0.9
         */
        shadowOffset: {
            value: function() {
                return new Point()
            }
        },

       /**
         * The layout.
         * @property layout
         * @since 0.9
         */
        layout: {
            value: function() {
                return new Layout()
            }
        },

        /**
         * The view transform matrix.
         * @property transform
         * @since 0.9
         */
        transform: {
            value: function() {
                return new Matrix()
            }
        },

        /**
         * The view visibility status.
         * @property visible
         * @since 0.9
         */
        visible: {
            value: true
        },

        /**
         * The opacity.
         * @property opacity
         * @since 0.9
         */
        opacity: {
            value: 1,
            check: function(value) {
                if (value > 1) value = 1
                if (value < 0) value = 0
                return value
            }
        },

        /**
         * The margin.
         * @property margin
         * @since 0.9
         */
        margin: {

            value: function() {
                return new Thickness()
            },

            check: function(newValue, oldValue) {

                if (typeof newValue === 'number') {
                    this.margin.top = newValue
                    this.margin.left = newValue
                    this.margin.right = newValue
                    this.margin.bottom = newValue
                    return oldValue
                }

                return newValue
            }
        },

        /**
         * The padding.
         * @property padding
         * @since 0.9
         */
        padding: {

            value: function() {
                return new Thickness()
            },

            check: function(newValue, oldValue) {

                if (typeof newValue === 'number') {
                    this.padding.top = newValue
                    this.padding.left = newValue
                    this.padding.right = newValue
                    this.padding.bottom = newValue
                    return oldValue
                }

                return newValue
            }
        },

        /**
         * The position.
         * @property position
         * @since 0.9
         */
        position: {

            value: function() {
                return new Position('auto')
            },

            check: function(newValue, oldValue) {

                if (newValue === 'auto') {
                    this.position.top = newValue
                    this.position.left = newValue
                    this.position.right = newValue
                    this.position.bottom = newValue
                    return oldValue
                }

                return newValue
            }
        },

        /**
         * The expected size.
         * @property width
         * @since 0.9
         */
        size: {
            value: function() {
                return new Size('fill', 'fill')
            },
        },

        /**
         * The minimum size.
         * @property minSize
         * @since 0.9
         */
        minSize: {
            value: function() {
                return new Size('none', 'none')
            },
        },

        /**
         * The maximum size.
         * @property maxSize
         * @since 0.9
         */
        maxSize: {
            value: function() {
                return new Size('none', 'none')
            },
        },

        /**
         * The size of this view once it's been measured.
         * @property measuredSize
         * @since 0.9
         */
        measuredSize:{
            value: function() {
                return new Size()
            },
        },

        /**
         * The position of this view once it's been measured.
         * @property measuredOffset
         * @since 0.9
         */
        measuredOffset: {
            value: function() {
                return new Point()
            },
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

        View.parent.constructor.call(this)

        var onPropertyChange = this.bind('onPropertyChange')

        this.on('propertychange', 'size.x', onPropertyChange)
        this.on('propertychange', 'size.y', onPropertyChange)
        this.on('propertychange', 'minSize.x', onPropertyChange)
        this.on('propertychange', 'minSize.y', onPropertyChange)
        this.on('propertychange', 'maxSize.x', onPropertyChange)
        this.on('propertychange', 'maxSize.y', onPropertyChange)
        this.on('propertychange', 'shadowOffset.x', onPropertyChange)
        this.on('propertychange', 'shadowOffset.y', onPropertyChange)
        this.on('propertychange', 'margin.top', onPropertyChange)
        this.on('propertychange', 'margin.left', onPropertyChange)
        this.on('propertychange', 'margin.right', onPropertyChange)
        this.on('propertychange', 'margin.bottom', onPropertyChange)
        this.on('propertychange', 'padding.top', onPropertyChange)
        this.on('propertychange', 'padding.left', onPropertyChange)
        this.on('propertychange', 'padding.right', onPropertyChange)
        this.on('propertychange', 'padding.bottom', onPropertyChange)
        this.on('propertychange', 'position.top', onPropertyChange)
        this.on('propertychange', 'position.left', onPropertyChange)
        this.on('propertychange', 'position.right', onPropertyChange)
        this.on('propertychange', 'position.bottom', onPropertyChange)

        this.on('add', this.bind('onAdd'))
        this.on('remove', this.bind('onRemove'))
        this.on('addtoparent', this.bind('onAddToParent'))
        this.on('addtowindow', this.bind('onAddToWindow'))
        this.on('removefromparent', this.bind('onRemoveFromParent'))
        this.on('removefromwindow', this.bind('onRemoveFromWindow'))

        this.on('touchcancel', this.bind('onTouchCancel'))
        this.on('touchstart', this.bind('onTouchStart'))
        this.on('touchmove', this.bind('onTouchMove'))
        this.on('touchend', this.bind('onTouchEnd'))

        return this
    },

    /**
     * Prepare this object for garbage collection.
     * @method destroy
     * @since 0.9
     */
    destroy: function() {

        this.removeFromParent()

        var onPropertyChange = this.bind('onPropertyChange')

        this.off('propertychange', 'size.x', onPropertyChange)
        this.off('propertychange', 'size.y', onPropertyChange)
        this.off('propertychange', 'minSize.x', onPropertyChange)
        this.off('propertychange', 'minSize.y', onPropertyChange)
        this.off('propertychange', 'maxSize.x', onPropertyChange)
        this.off('propertychange', 'maxSize.y', onPropertyChange)
        this.off('propertychange', 'shadowOffset.x', onPropertyChange)
        this.off('propertychange', 'shadowOffset.y', onPropertyChange)
        this.off('propertychange', 'margin.top', onPropertyChange)
        this.off('propertychange', 'margin.left', onPropertyChange)
        this.off('propertychange', 'margin.right', onPropertyChange)
        this.off('propertychange', 'margin.bottom', onPropertyChange)
        this.off('propertychange', 'padding.top', onPropertyChange)
        this.off('propertychange', 'padding.left', onPropertyChange)
        this.off('propertychange', 'padding.right', onPropertyChange)
        this.off('propertychange', 'padding.bottom', onPropertyChange)
        this.off('propertychange', 'position.top', onPropertyChange)
        this.off('propertychange', 'position.left', onPropertyChange)
        this.off('propertychange', 'position.right', onPropertyChange)
        this.off('propertychange', 'position.bottom', onPropertyChange)

        this.off('add', this.bind('onAdd'))
        this.off('remove', this.bind('onRemove'))
        this.off('addtoparent', this.bind('onAddToParent'))
        this.off('addtowindow', this.bind('onAddToWindow'))
        this.off('removefromparent', this.bind('onRemoveFromParent'))
        this.off('removefromwindow', this.bind('onRemoveFromWindow'))

        this.off('touchcancel', this.bind('onTouchCancel'))
        this.off('touchstart', this.bind('onTouchStart'))
        this.off('touchmove', this.bind('onTouchMove'))
        this.off('touchend', this.bind('onTouchEnd'))

        this.removeAllListeners()

        return View.parent.destroy.call(this)
    },

    /**
     * Append a view to the view's list of child views.
     * @method addChild
     * @since 0.9
     */
    addChild: function(view) {
        return this.addChildAt(view, this.__children.length)
    },

    /**
     * Insert a view at a specified index in the view's list of child views.
     * @method addChildAt
     * @since 0.9
     */
    addChildAt: function(view, index) {

        var children = this.__children

        if (index > children.length) {
            index = children.length;
        } else if (index < 0) {
            index = 0;
        }

        view.removeFromParent()

        children.splice(index, 1, view)
        view.__setWindow(this.window)
        view.__setParent(this)
        view.__setParentReceiver(this)

        this.emit('add', view)
        this.scheduleLayout()

        return this
    },

    /**
     * Insert a view before another view in the view's list of child views.
     * @method addChildBefore
     * @since 0.9
     */
    addChildBefore: function(view, before) {

        var index = this.getChildIndex(before)
        if (index === null)
            return this

        return this.addChildAt(view, index)
    },

    /**
     * Insert a view after another view in the view's list of child views.
     * @method addChildAfter
     * @since 0.9
     */
    addChildAfter: function(view, after) {

        var index = this.getChildIndex(before)
        if (index === null)
            return this

        return this.addChildAt(view, index + 1)
    },

    /**
     * Remove a view from the view's list of child views.
     * @method removeChild
     * @since 0.9
     */
    removeChild: function(view) {

        var index = this.getChildIndex(view)
        if (index === null)
            return this

        return this.removeChildAt(index)
    },

    /**
     * Remove a view at an index from the view's list of child views.
     * @method removeChildAt
     * @since 0.9
     */
    removeChildAt: function(index) {

        var children = this.__children

        var view = children[index]
        if (view == null)
            return this

        children.splice(index, 1)
        view.__setWindow(null)
        view.__setParent(null)
        view.__setParentReceiver(null)

        this.emit('remove', view)
        this.scheduleLayout()

        return this
    },

    /**
     * Remove this view from its parent view's list of child views.
     * @method removeFromParent
     * @since 0.9
     */
    removeFromParent: function() {
        var parent = this.parent
        if (parent) parent.removeChild(this)
        return this
    },

    /**
     * Retrieve the index of a specified view.
     * @method getChildIndex
     * @since 0.9
     */
    getChildIndex: function(view) {
        return this.__children.indexOf(view)
    },

    /**
     * Retrieve a view using its name from the view's list of child views.
     * @method getChildByName
     * @since 0.9
     */
    getChildByName: function(name) {

    },

    /**
     * Retrieve a view using its index from this view's list of child views.
     * @method getChildAtIndex
     * @since 0.9
     */
    getChildAtIndex: function(index) {
        return this.__children[index] || null
    },

    /**
     * Retrieve a view using its coordinates from this view's list of child views.
     * @method getChildAtPoint
     * @since 0.9
     */
    getChildAtPoint: function(x, y) {

        if (this.isPointInside(x, y) === false)
            return null

        var children = this.__children

        for (var i = children.length - 1; i >= 0; i--) {

            var child = children[i]
            if (child.isPointInside(x, y) === false)
                continue

            var o = child.origin;
            var px = x - o.x
            var py = y - o.y

            return child.getChildAtPoint(px, py)
        }

        return this
    },

    /**
     * Determine whether the point is inside this view.
     * @method isPointInside
     * @since 0.9
     */
    isPointInside: function(x, y) {

        var point = arguments[0]
        if (point instanceof Point) {
            x = point.x
            y = point.y
        }

        var s = this.size
        var o = this.origin

        return x >= o.x && x <= o.x + s.x && y >= o.y && y <= o.y + s.y
    },

    /**
     * Indicate whether changing a property requires a reflow.
     * @method layoutOnPropertyChange
     * @since 0.9
     */
    reflowOnPropertyChange: function(property) {

        if (property === 'size' ||
            property === 'size.x' ||
            property === 'size.y' ||
            property === 'minSize' ||
            property === 'minSize.x' ||
            property === 'minSize.y' ||
            property === 'maxSize' ||
            property === 'maxSize.x' ||
            property === 'maxSize.y' ||
            property === 'visible' ||
            property === 'margin' ||
            property === 'margin.top' ||
            property === 'margin.left' ||
            property === 'margin.right' ||
            property === 'margin.bottom' ||
            property === 'position.top' ||
            property === 'position.left' ||
            property === 'position.right' ||
            property === 'position.bottom' ) {
            return true
        }

        return false
    },

    /**
     * Indicate whether changing a property requires a layout.
     * @method layoutOnPropertyChange
     * @since 0.9
     */
    layoutOnPropertyChange: function(property) {

        if (property === 'measuredSize' ||
            property === 'measuredSize.x' ||
            property === 'measuredSize.y' ||
            property === 'borderWidth' ||
            property === 'padding' ||
            property === 'padding.top' ||
            property === 'padding.left' ||
            property === 'padding.right' ||
            property === 'padding.bottom' ||
            property === 'layout') {
            return true
        }

        return false
    },

    /**
     * Indicate whether changing a property requires a redraw.
     * @method layoutOnPropertyChange
     * @since 0.9
     */
    redrawOnPropertyChange: function(property) {

    },

   /**
     * Schedule a layout of the parent view on the next cycle.
     * @method scheduleReflow
     * @since 0.9
     */
    scheduleReflow: function() {
        var parent = this.parent
        if (parent) parent.scheduleLayout()
        return this
    },

    /**
     * Schedule a layout on the next cycle.
     * @method scheduleLayout
     * @since 0.9
     */
    scheduleLayout: function() {
        this.__layoutScheduled = true
        return this
    },

    /**
     * Schedule this view to be redrawn on the next cycle.
     * @method scheduleRedraw
     * @since 0.9
     */
    scheduleRedraw: function(area) {

        if (area) {

            if (this.__redrawArea === null) {
                this.__redrawArea = new Rectangle()
            }

            this.__redrawArea = Rectangle.union(this.__redrawArea, area)
        }

        this.__redrawScheduled = true

        return this
    },

   /**
     * Layout the tree starting with the first ancestor who requires layout.
     * @method layoutTree
     * @since 0.9
     */
    layoutIfNeeded: function() {

        // TODO: Move up then layout all descendant (event if parent does not requires it)

        if (this.__layoutScheduled) {
            this.__layoutScheduled = false
            this.layoutChildren()
        }

        return this
    },

   /**
     * Layout the child views.
     * @method layoutChildren
     * @since 0.9
     */
    layoutChildren: function() {

        if (this.layout) {
            this.layout.view = this
            this.layout.update()
        }

        return this
    },

   /**
     * Draw the view into its context.
     * @method redraw
     * @since 0.9
     */
    redrawIfNeeded: function(context) {

        if (this.__redrawScheduled) {
            this.__redrawScheduled = false

            var rect = null
            var area = this.__redrawArea
            if (area === null) {
                rect = new Rectangle()
                rect.size.x = this.measuredSize.x
                rect.size.y = this.measuredSize.y
            } else {
                rect = new Rectangle()
                rect.size.x = area.size.x || this.measuredSize.x
                rect.size.y = area.size.y || this.measuredSize.y
                rect.origin.x = area.origin.x
                rect.origin.y = area.origin.y
            }

            this.redraw(context, area)
        }

        return this
    },

   /**
     * Draw the view into its context.
     * @method redraw
     * @since 0.9
     */
    redraw: function(context, area) {
        this.emit('redraw', context, area)
        return this
    },

    //--------------------------------------------------------------------------
    // Event Handlers
    //--------------------------------------------------------------------------

    /**
     * Called when a property changes.
     * @method onPropertyChange
     * @since 0.9
     */
    onPropertyChange: function(target, property, newValue, oldValue, e) {
        /*
        var transaction = AnimationTransaction.getCurrent()
        if (transaction) {

            var animation = null

            switch (property) {
                case 'backgroundImage':
                    animation = new ImagePropertyAnimation
                    break
                case 'backgroundColor':
                    animation = new ColorPropertyAnimation
                    break
                case 'opacity':
                case 'measuredSize.x':
                case 'measuredSize.y':
                case 'measuredOffset.x':
                case 'measuredOffset.y':
                    animation = new PropertyAnimation
                    break
            }

            if (animation) {
                transaction.animate(this, property, oldValue, newValue, animation)
                return
            }
        }
        */
        if (this.reflowOnPropertyChange(property)) {
            this.scheduleReflow()
        }

        if (this.layoutOnPropertyChange(property)) {
            this.scheduleLayout()
        }

        if (this.redrawOnPropertyChange(property)) {
            this.scheduleRedraw()
        }
    },

    /**
     * Called once a view layout occured.
     * @method onLayout
     * @since 0.9
     */
    onLayout: function(e) {

    },

    /**
     * Called once a view redraw occured
     * @method onLayout
     * @since 0.9
     */
    onRedraw: function(e) {

    },

   /**
     * Called when a child view is added.
     * @method onAdd
     * @since 0.9
     */
    onAdd: function(view, e) {

    },

    /**
     * Called when a child view is removed.
     * @method onRemove
     * @since 0.9
     */
    onRemove: function(view, e) {

    },

    /**
     * Called when the view is added to another view.
     * @method onAddToParent
     * @since 0.9
     */
    onAddToParent: function(parent, e) {

    },

    /**
     * Called when the view is removed from its parent.
     * @method onRemoveFromParent
     * @since 0.9
     */
    onRemoveFromParent: function(parent, e) {

    },

    /**
     * Called when the view is added to a window.
     * @method onRemoveFromParent
     * @since 0.9
     */
    onAddToWindow: function(window, e) {

    },

    /**
     * Called when the view is removed from its window.
     * @method onRemoveFromParent
     * @since 0.9
     */
    onRemoveFromWindow: function(window, e) {

    },

   /**
     * Called a touch cancel event occurs within this view.
     * @method onTouchCancel
     * @since 0.9
     */
    onTouchCancel: function(touches, e) {

    },

    /**
     * Called when a touch start event occurs within this view.
     * @method onTouchStart
     * @since 0.9
     */
    onTouchStart: function(touches, e) {

    },

    /**
     * Called when a touch move event occurs within this view.
     * @method onTouchMove
     * @since 0.9
     */
    onTouchMove: function(touches, e) {

    },

    /**
     * Called when a touch end event occurs within this view.
     * @method onTouchEnd
     * @since 0.9
     */
    onTouchEnd: function(touches, e) {

    },

    //--------------------------------------------------------------------------
    // Private API
    //--------------------------------------------------------------------------

    /**
     * The animation that are running.
     * @method __animations
     * @private
     */
    __animations: null,

    /**
     * The area to redraw on the view.
     * @method __redrawArea
     * @private
     */
    __redrawArea: null,

    /**
     * Whether the view needs to be redrawn.
     * @method __needsRedraw
     * @private
     */
    __redrawScheduled: false,

    /**
     * Whether the view needs to relayout.
     * @method __needsLayout
     * @private
     */
    __layoutScheduled: false,

    /**
     * Set the parent view.
     * @method __setParent
     * @private
     */
    __setParent: function(value) {

        var parent = this.__parent

        if (parent && value === null) {
            this.__parent = value
            return this.emit('removefromparent', parent)
        }

        if (parent === null && value) {
            this.__parent = value
            return this.emit('addtoparent', parent)
        }

        return this
    },

    /**
     * Set the window that contains this view.
     * @method __setWindow
     * @private
     */
    __setWindow: function(value) {

        var window = this.__window

        if (window && value === null) {
            this.__window = value
            return this.emit('removefromwindow', window)
        }

        if (window === null && value) {
            this.__window = value
            return this.emit('addtowindow', window)
        }

        invoke(this.__children, '__setWindow', value)

        return this
    }

})

var invoke = _.invoke
