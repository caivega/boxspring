"use strict"

var ViewPropertyAnimationGroup = boxspring.view.ViewPropertyAnimationGroup

/**
 * Handle screen layout and interaction with the user.
 * @class boxspring.view.View
 * @since 0.9
 */
var View = boxspring.define('boxspring.view.View', {

	/**
	 * @inherits boxspring.event.Emitter
	 */
	inherits: boxspring.event.Emitter,

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * Create a new transaction with the specified options.
		 * @method setup
		 * @static
		 * @since 0.9
		 */
		setupAnimation: function(duration, equation) {
			animating++
			if (layoutRoot) {
				layoutRoot.layoutIfNeeded()
				// this has to be made better
			}
			var group = new ViewPropertyAnimationGroup()
			if (duration) group.duration = duration
			if (equation) group.equation = equation
			group.on('start', onViewPropertyAnimationGroupStart)
			group.on('end', onViewPropertyAnimationGroupEnd)
			_.include(animations, group)
			return this
		},

		/**
		 * Starts all created transactionStack.
		 * @method start
		 * @static
		 * @since 0.9
		 */
		startAnimation: function() {
			if (layoutRoot) {
				layoutRoot.layoutIfNeeded()
				// this has to be made better
			}
			for (var i = 0; i < animations.length; i++) {
				var group = animations[i]
				group.start()
			}
			animations = []
		}
	},

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
				return new boxspring.geom.Size('auto', 'auto')
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
			onSet: Math.abs
		},

		/**
		 * The border radius.
		 * @property borderRadius
		 * @since 0.9
		 */
		borderRadius: {
			value: 0,
			onSet: Math.abs
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
				return new boxspring.geom.Point()
			}
		},

	   /**
		 * The layout.
		 * @property layout
		 * @since 0.9
		 */
		layout: {
			value: function() {
				return new boxspring.layout.LinearLayout()
			}
		},

		/**
		 * The view transform matrix.
		 * @property transform
		 * @since 0.9
		 */
		transform: {
			value: function() {
				return new boxspring.geom.Matrix()
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
			onSet: function(value) {
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
				return new boxspring.geom.Thickness()
			},

			onSet: function(newValue, oldValue) {

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
				return new boxspring.geom.Thickness()
			},

			onSet: function(newValue, oldValue) {

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
				return new boxspring.geom.Position('auto')
			},

			onSet: function(newValue, oldValue) {

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
		 * The weight of this view within its layout.
		 * @property weight
		 * @since 0.9
		 */
		weight: {
			value: 1
		},

		/**
		 * The expected size.
		 * @property width
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size('fill', 'fill')
			},
		},

		/**
		 * The minimum size.
		 * @property minSize
		 * @since 0.9
		 */
		minSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * The maximum size.
		 * @property maxSize
		 * @since 0.9
		 */
		maxSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * The size of this view once it's been measured.
		 * @property measuredSize
		 * @since 0.9
		 */
		measuredSize:{
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * The position of this view once it's been measured.
		 * @property measuredOffset
		 * @since 0.9
		 */
		measuredOffset: {
			value: function() {
				return new boxspring.geom.Point('none', 'none')
			},
		},

		animating: {
			onGet: function() {
				return animating > 0
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

		View.parent.constructor.call(this)

		var onPropertyChange = this.bind('onPropertyChange')

		this.on('propertychange', 'size.x', onPropertyChange)
		this.on('propertychange', 'size.y', onPropertyChange)
		this.on('propertychange', 'minSize.x', onPropertyChange)
		this.on('propertychange', 'minSize.y', onPropertyChange)
		this.on('propertychange', 'maxSize.x', onPropertyChange)
		this.on('propertychange', 'maxSize.y', onPropertyChange)
		this.on('propertychange', 'shadowBlur', onPropertyChange)
		this.on('propertychange', 'shadowColor', onPropertyChange)
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
		this.on('propertychange', 'measuredSize.x', onPropertyChange)
		this.on('propertychange', 'measuredSize.y', onPropertyChange)
		this.on('propertychange', 'measuredOffset.x', onPropertyChange)
		this.on('propertychange', 'measuredOffset.y', onPropertyChange)

		this.on('propertyanimationstart', this.bind('onPropertyAnimationStart'))
		this.on('propertyanimationupdate', this.bind('onPropertyAnimationUpdate'))
		this.on('propertyanimationend', this.bind('onPropertyAnimationEnd'))

		this.on('layout', this.bind('onLayout'))
		this.on('redraw', this.bind('onRedraw'))

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

		this.__animatedPropertyValues = {}

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
		this.off('propertychange', 'shadowBlur', onPropertyChange)
		this.off('propertychange', 'shadowColor', onPropertyChange)
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
		this.off('propertychange', 'measuredSize.x', onPropertyChange)
		this.off('propertychange', 'measuredSize.y', onPropertyChange)
		this.off('propertychange', 'measuredOffset.x', onPropertyChange)
		this.off('propertychange', 'measuredOffset.y', onPropertyChange)

		this.off('propertyanimationstart', this.bind('onPropertyAnimationStart'))
		this.off('propertyanimationupdate', this.bind('onPropertyAnimationUpdate'))
		this.off('propertyanimationend', this.bind('onPropertyAnimationEnd'))

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

		view.removeFromParent()

		var children = this.__children

		if (index > children.length) {
			index = children.length
		} else if (index < 0) {
			index = 0
		}

		children.splice(index, 1, view)
		view.__setWindow(this.window)
		view.__setParent(this)
		view.__setParentReceiver(this)

		this.scheduleLayout()

		this.emit('add', view)

		return this
	},

	/**
	 * Insert a view before another view in the view's list of child views.
	 * @method addChildBefore
	 * @since 0.9
	 */
	addChildBefore: function(view, before) {

		var index = this.childIndex(before)
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

		var index = this.childIndex(before)
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

		var index = this.childIndex(view)
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

		this.scheduleLayout()

		this.emit('remove', view)

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
	 * @method childIndex
	 * @since 0.9
	 */
	childIndex: function(view) {
		return this.__children.indexOf(view)
	},

	/**
	 * Retrieve a view using its name from the view's list of child views.
	 * @method childByName
	 * @since 0.9
	 */
	childByName: function(name) {

	},

	/**
	 * Retrieve a view using its index from this view's list of child views.
	 * @method childAt
	 * @since 0.9
	 */
	childAt: function(index) {
		return this.__children[index] || null
	},

	/**
	 * Retrieve a view using its coordinates from this view's list of child views.
	 * @method childAtPoint
	 * @since 0.9
	 */
	childAtPoint: function(x, y) {

		if (this.pointInside(x, y) === false)
			return null

		var children = this.__children

		for (var i = children.length - 1; i >= 0; i--) {

			var child = children[i]
			if (child.pointInside(x, y) === false)
				continue

			var o = child.origin;
			var px = x - o.x
			var py = y - o.y

			return child.childAtPoint(px, py)
		}

		return this
	},

	/**
	 * Determine whether the point is inside this view.
	 * @method pointInside
	 * @since 0.9
	 */
	pointInside: function(x, y) {

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
	 * Animate a property from this view
	 * @method animate
	 * @since 0.9
	 */
	animate: function(property, value, duration, equation) {
		View.beginAnimation(duration, equation)
		this.set(property, value)
		View.startAnimation()
		return this
	},

	/**
	 * Returns the current value of an animated property.
	 * @method animatedPropertyValue
	 * @since 0.9
	 */
	animatedPropertyValue: function(property) {

		var value = this.__animatedPropertyValues[property]
		if (value == null)
			return this.get(property)

		return value
	},

	/**
	 * Returns the property animation evaluator for a given property.
	 * @method getAnimatedPropertyEvaluator
	 * @since 0.9
	 */
	animatedPropertyEvaluator: function(property) {

		switch (property) {
			case 'backgroundColor':
			case 'borderColor':
			case 'shadowColor':
				return new boxspring.animation.ColorEvaluator
			case 'backgroundImage':
				return new boxspring.animation.ImageEvaluator
			case 'backgroundSize.x':
			case 'backgroundSize.y':
			case 'borderWidth':
			case 'borderRadius':
			case 'shadowBlur':
			case 'shadowOffset.x':
			case 'shadowOffset.y':
			case 'opacity':
			case 'measuredSize.x':
			case 'measuredSize.y':
			case 'measuredOffset.x':
			case 'measuredOffset.y':
				return new boxspring.animation.NumberEvaluator
		}

		return null
	},

   /**
	 * Indicates whether a property is animatable.
	 * @method propertyIsAnimatable
	 * @since 0.9
	 */
	propertyIsAnimatable: function(property) {
		return animatableProperties.indexOf(property) !== -1
	},

   /**
     * Indicates whether a redraw is needed when the specified propery changes.
     * @method redrawOnPropertyChange
     * @since 0.9
     */
	redrawOnPropertyChange: function(property) {
		return scheduleRedrawProperties.indexOf(property) !== -1
	},

   /**
	 * Indicates whether a reflow is needed when the specified propery changes.
	 * @method reflowOnPropertyChange
	 * @since 0.9
	 */
	reflowOnPropertyChange: function(property) {
		return scheduleReflowProperties.indexOf(property) !== -1
	},

   /**
	 * Indicates whether a layout is needed when the specified propery changes.
	 * @method layoutOnPropertyChange
	 * @since 0.9
	 */
	layoutOnPropertyChange: function(property) {
		return scheduleLayoutProperties.indexOf(property) !== -1
	},

   /**
     * Schedule this view to be redrawn on the next cycle.
     * @method scheduleRedraw
     * @since 0.9
     */
    scheduleRedraw: function(area) {

        if (area) {

            if (this.__redrawArea === null) {
                this.__redrawArea = new boxspring.geom.Rectangle()
            }

            this.__redrawArea = boxspring.geom.Rectangle.union(this.__redrawArea, area)
        }

       	this.__redrawScheduled = true

        return this
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
                rect = new boxspring.geom.Rectangle()
                rect.size.x = this.measuredSize.x
                rect.size.y = this.measuredSize.y
            } else {
                rect = new boxspring.geom.Rectangle()
                rect.size.x = area.size.x || this.measuredSize.x
                rect.size.y = area.size.y || this.measuredSize.y
                rect.origin.x = area.origin.x
                rect.origin.y = area.origin.y
            }

            this.redraw(context, area)

            this.emit('redraw', context, area)
        }

        return this
    },

   /**
	 * Layout the tree starting with the first ancestor who requires layout.
	 * @method layoutTree
	 * @since 0.9
	 */
	layoutIfNeeded: function() {

		var parent = this.parent
		if (parent && parent.__layoutScheduled) {
			parent.layoutIfNeeded()
			return
		}

		if (this.__layoutScheduled) {
			this.__layoutScheduled = false
			this.layoutChildren()
			this.emit('layout')
		}

		_.invoke(this.__children, 'layoutIfNeeded')

		return this
	},

   /**
     * Draw the view into its context.
     * @method redraw
     * @since 0.9
     */
	redraw: function(context, area) {
		return this
	},

   /**
	 * Layout the child views.
	 * @method layoutChildren
	 * @since 0.9
	 */
	layoutChildren: function() {

		if (this.layout) {
			this.layout.target = this
			this.layout.update()
		}

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

		var ViewPropertyAnimationGroup = boxspring.view.ViewPropertyAnimationGroup

		if (this.reflowOnPropertyChange(property)) this.scheduleReflow()
		if (this.layoutOnPropertyChange(property)) this.scheduleLayout()

		if (layoutRoot === null) {
			layoutRoot = this.window
		}

		var viewPropertyAnimationGroup = animations[animations.length - 1]
		if (viewPropertyAnimationGroup && this.propertyIsAnimatable(property)) {

			var t = newValue
			var f = oldValue

			if (property === 'measuredSize.x' && this.__measuredSizeXSet === false ||
				property === 'measuredSize.y' && this.__measuredSizeYSet === false ||
				property === 'measuredOffset.x' && this.__measuredOffsetXSet === false ||
				property === 'measuredOffset.y' && this.__measuredOffsetYSet === false) {
				f = t
			}

			viewPropertyAnimationGroup.addAnimatedProperty(this, property, f, t)
		}

		if (property === 'measuredSize.x') this.__measuredSizeXSet = true
		if (property === 'measuredSize.y') this.__measuredSizeYSet = true
		if (property === 'measuredOffset.x') this.__measuredOffsetXSet = true
		if (property === 'measuredOffset.y') this.__measuredOffsetYSet = true
	},

    /**
     * Called once a view redraw occured
     * @method onLayout
     * @since 0.9
     */
    onRedraw: function(e) {

    },

    /**
     * Called once a view layout occured
     * @method onLayout
     * @since 0.9
     */
    onLayout: function(e) {

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
	 * Called when an animated property begins animating.
	 * @method onPropertyAnimationStart
	 * @since 0.9
	 */
	onPropertyAnimationStart: function(property, value) {
		this.__animatedPropertyValues[property] = value
	},

	/**
	 * Called when an animated property updates its value.
	 * @method onPropertyAnimationUpdate
	 * @since 0.9
	 */
	onPropertyAnimationUpdate: function(property, value) {
		this.__animatedPropertyValues[property] = value
		if (this.redrawOnPropertyChange(property)) this.scheduleRedraw()
	},

	/**
	 * Called when an animated property ends its animation.
	 * @method onPropertyAnimationUpdate
	 * @since 0.9
	 */
	onPropertyAnimationEnd: function(property, value) {
		delete this.__animatedPropertyValues[property]
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
	 * @since 0.9
	 * @private
	 */
	__animatedPropertyValues: null,

    /**
     * The area to redraw on the view.
	 * @since 0.9
     * @private
     */
    __redrawArea: null,

    /**
     * Whether the view needs to be redrawn.
	 * @since 0.9
     * @private
     */
    __redrawScheduled: false,

	/**
	 * Whether the view needs to relayout.
	 * @since 0.9
	 * @private
	 */
	__layoutScheduled: false,

	/**
	 * Whether the measured size has been set.
	 * @since 0.9
	 * @private
	 */
	__measuredSizeXSet: false,

	/**
	 * Whether the measured size has been set.
	 * @since 0.9
	 * @private
	 */
	__measuredSizeYSet: false,

	/**
	 * Whether the measured offset has been set.
	 * @since 0.9
	 * @private
	 */
	__measuredOffsetXSet: false,

	/**
	 * Whether the measured offset has been set.
	 * @since 0.9
	 * @private
	 */
	__measuredOffsetYSet: false,

	/**
	 * Set the parent view.
	 * @since 0.9
	 * @private
	 */
	__setParent: function(value) {

		var parent = this.__parent
		if (parent && value === null) {
			this.__parent = value
			this.emit('propertychange', 'parent', value)
			this.emit('removefromparent', parent)
			return this
		}

		if (parent === null && value) {
			this.__parent = value
			this.emit('propertychange', 'parent', value)
			this.emit('addtoparent', parent)
			return this
		}

		return this
	},

	/**
	 * Set the window that contains this view.
	 * @since 0.9
	 * @private
	 */
	__setWindow: function(value) {

		var window = this.__window
		if (window && value === null) {
			this.__window = value
			this.emit('propertychange', 'window', value)
			this.emit('removefromwindow', value)
			return this
		}

		if (window === null && value) {
			this.__window = value
			this.emit('propertychange', 'window', value)
			this.emit('addtowindow', window)
			return this
		}

		_.invoke(this.__children, '__setWindow', value)

		return this
	}

})

/**
 * Properties that trigger a reflow.
 * @since 0.9
 * @private
 */
var scheduleReflowProperties = [
	  'size.x',
	  'size.y',
	  'minSize.x',
	  'minSize.y',
	  'maxSize.x',
	  'maxSize.y',
	  'visible',
	  'margin.top',
	  'margin.left',
	  'margin.right',
	  'margin.bottom',
	  'position.top',
	  'position.left',
	  'position.right',
	  'position.bottom'
]

/**
 * Properties that trigger a layout.
 * @since 0.9
 * @private
 */
var scheduleLayoutProperties = [
	'measuredSize.x',
	'measuredSize.y',
	'borderWidth',
	'padding.top',
	'padding.left',
	'padding.right',
	'padding.bottom',
	'layout'
]

/**
 * Animatable properties.
 * @since 0.9
 * @private
 */
var animatableProperties = [
	'backgroundColor',
	'borderColor',
	'shadowColor',
	'backgroundImage',
	'backgroundSize.x',
	'backgroundSize.y',
	'borderWidth',
	'borderRadius',
	'shadowBlur',
	'shadowOffset.x',
	'shadowOffset.y',
	'opacity',
	'measuredSize.x',
	'measuredSize.y',
	'measuredOffset.x',
	'measuredOffset.y',
]

/**
 * The root element of the transaction, the window.
 * @since 0.9
 * @private
 */
var layoutRoot = null

var animations = []
var animating = 0

var onViewPropertyAnimationGroupStart = function(e) {

}

var onViewPropertyAnimationGroupEnd = function(e) {
	e.source.destroy()
	animating--
}
