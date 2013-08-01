"use strict"

/**
 * @class boxspring.view.View
 * @super boxspring.event.Emitter
 * @since 0.9
 */
var View = boxspring.define('boxspring.view.View', {

	inherits: boxspring.event.Emitter,

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method setupAnimation
		 * @scope static
		 * @since 0.9
		 */
		setupAnimation: function(duration, equation) {

			if (animationStatus == null) {
				animationStatus = 'reading'
			}

			if (layoutRoot) {
				layoutRoot.layoutIfNeeded()
			}

			var group = new boxspring.animation.ViewPropertyTransaction()
			if (duration) group.duration = duration
			if (equation) group.equation = equation
			group.on('start', onViewPropertyTransactionStart)
			group.on('end', onViewPropertyTransactionEnd)

			_.include(animations, group)
		},

		/**
		 * @method startAnimation
		 * @scope static
		 * @since 0.9
		 */
		startAnimation: function() {

			if (layoutRoot) {
				layoutRoot.layoutIfNeeded()
			}

			for (var i = 0; i < animations.length; i++) {
				animations[i].start()
			}

			animations = []
		},

		/**
		 * @method animationStatus
		 * @scope static internal
		 * @since 0.9
		 */
		animationStatus: function() {
			return animationStatus
		}
	},

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property name
		 * @since 0.9
		 */
		name: {
			value: ''
		},

		/**
		 * @property window
		 * @since 0.9
		 */
		window: {
			write: false
		},

		/**
		 * @property parent
		 * @since 0.9
		 */
		parent: {
			write: false
		},

		/**
		 * @property children
		 * @since 0.9
		 */
		children: {
			write: false,
			clone: true,
			value: []
		},

	   /**
		 * @property backgroundColor
		 * @since 0.9
		 */
		backgroundColor: {
			value: '#fff'
		},

		/**
		 * @property backgroundImage
		 * @since 0.9
		 */
		backgroundImage: {
			value: ''
		},

		/**
		 * @property backgroundRepeat
		 * @since 0.9
		 */
		backgroundRepeat: {
			value: 'repeat'
		},

		/**
		 * @property backgroundSize
		 * @since 0.9
		 */
		backgroundSize: {
			value: function() {
				return new boxspring.geom.Size('auto', 'auto')
			}
		},

		/**
		 * @property backgroundClip
		 * @since 0.9
		 */
		backgroundClip: {
			value: 'border'
		},

		/**
		 * @property borderColor
		 * @since 0.9
		 */
		borderColor: {
			value: '#000'
		},

		/**
		 * @property borderSize
		 * @since 0.9
		 */
		borderWidth: {
			value: 0,
			onSet: Math.abs
		},

		/**
		 * @property borderRadius
		 * @since 0.9
		 */
		borderRadius: {
			value: 0,
			onSet: Math.abs
		},

		/**
		 * @property shadowBlur
		 * @since 0.9
		 */
		shadowBlur: {
			value: 0
		},

		/**
		 * @property shadowColor
		 * @since 0.9
		 */
		shadowColor: {
			value: '#000'
		},

		/**
		 * @property shadowOffset
		 * @since 0.9
		 */
		shadowOffset: {
			value: function() {
				return new boxspring.geom.Point()
			}
		},

	   /**
		 * @property layout
		 * @since 0.9
		 */
		layout: {
			value: function() {
				return new boxspring.layout.LinearLayout()
			}
		},

		/**
		 * @property transform
		 * @since 0.9
		 */
		transform: {
			value: function() {
				return new boxspring.geom.Matrix()
			}
		},

		/**
		 * @property visible
		 * @since 0.9
		 */
		visible: {
			value: true
		},

		/**
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
		 * @property weight
		 * @since 0.9
		 */
		weight: {
			value: 1
		},

		/**
		 * @property width
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size('fill', 'fill')
			},
		},

		/**
		 * @property minSize
		 * @since 0.9
		 */
		minSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * @property maxSize
		 * @since 0.9
		 */
		maxSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * @property measuredSize
		 * @since 0.9
		 */
		measuredSize:{
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			},
		},

		/**
		 * @property measuredOffset
		 * @since 0.9
		 */
		measuredOffset: {
			value: function() {
				return new boxspring.geom.Point('none', 'none')
			},
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
	 * @method addChild
	 * @since 0.9
	 */
	addChild: function(view) {
		return this.addChildAt(view, this.__children.length)
	},

	/**
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

		children.splice(index, 0, view)

		view.setWindow(this.window)
		view.setParent(this)
		view.setParentReceiver(this)

		this.scheduleLayout()

		this.emit('add', view)

		return this
	},

	/**
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
	 * @method removeChildAt
	 * @since 0.9
	 */
	removeChildAt: function(index) {

		var children = this.__children

		var view = children[index]
		if (view == null)
			return this

		children.splice(index, 1)
		view.setWindow(null)
		view.setParent(null)
		view.setParentReceiver(null)

		this.scheduleLayout()

		this.emit('remove', view)

		return this
	},

	/**
	 * @method removeFromParent
	 * @since 0.9
	 */
	removeFromParent: function() {
		var parent = this.parent
		if (parent) parent.removeChild(this)
		return this
	},

	/**
	 * @method childIndex
	 * @since 0.9
	 */
	childIndex: function(view) {
		return this.__children.indexOf(view)
	},

	/**
	 * @method childByName
	 * @since 0.9
	 */
	childByName: function(name) {

	},

	/**
	 * @method childAt
	 * @since 0.9
	 */
	childAt: function(index) {
		return this.__children[index] || null
	},

	/**
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
	 * @method propertyIsAnimatable
	 * @since 0.9
	 */
	propertyIsAnimatable: function(property) {
		return animatableProperties.indexOf(property) !== -1
	},

   /**
	 * @method redrawOnPropertyChange
	 * @since 0.9
	 */
	redrawOnPropertyChange: function(property) {
		return scheduleRedrawProperties.indexOf(property) !== -1
	},

   /**
	 * @method reflowOnPropertyChange
	 * @since 0.9
	 */
	reflowOnPropertyChange: function(property) {
		return scheduleReflowProperties.indexOf(property) !== -1
	},

   /**
	 * @method layoutOnPropertyChange
	 * @since 0.9
	 */
	layoutOnPropertyChange: function(property) {
		return scheduleLayoutProperties.indexOf(property) !== -1
	},

   /**
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
	 * @method scheduleReflow
	 * @since 0.9
	 */
	scheduleReflow: function() {
		var parent = this.parent
		if (parent) parent.scheduleLayout()
		return this
	},

	/**
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		this.__layoutScheduled = true
		return this
	},

	/**
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
	 * @method redraw
	 * @since 0.9
	 */
	redraw: function(context, area) {
		return this
	},

   /**
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
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, newValue, oldValue, e) {

		var ViewPropertyTransaction = boxspring.animation.ViewPropertyTransaction

		if (this.redrawOnPropertyChange(property)) this.scheduleRedraw()
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
	 * @method onLayout
	 * @since 0.9
	 */
	onRedraw: function(e) {

	},

	/**
	 * @method onLayout
	 * @since 0.9
	 */
	onLayout: function(e) {

	},

   /**
	 * @method onAdd
	 * @since 0.9
	 */
	onAdd: function(view, e) {

	},

	/**
	 * @method onRemove
	 * @since 0.9
	 */
	onRemove: function(view, e) {

	},

	/**
	 * @method onAddToParent
	 * @since 0.9
	 */
	onAddToParent: function(parent, e) {

	},

	/**
	 * @method onRemoveFromParent
	 * @since 0.9
	 */
	onRemoveFromParent: function(parent, e) {

	},

	/**
	 * @method onAddToWindow
	 * @since 0.9
	 */
	onAddToWindow: function(window, e) {

	},

	/**
	 * @method onRemoveFromWindow
	 * @since 0.9
	 */
	onRemoveFromWindow: function(window, e) {

	},

	/**
	 * @method onPropertyAnimationStart
	 * @since 0.9
	 */
	onPropertyAnimationStart: function(property, value) {
		this.__animatedPropertyValues[property] = value
	},

	/**
	 * @method onPropertyAnimationUpdate
	 * @since 0.9
	 */
	onPropertyAnimationUpdate: function(property, value) {
		this.__animatedPropertyValues[property] = value
		if (this.redrawOnPropertyChange(property)) this.scheduleRedraw()
	},

	/**
	 * @method onPropertyAnimationEnd
	 * @since 0.9
	 */
	onPropertyAnimationEnd: function(property, value) {
		delete this.__animatedPropertyValues[property]
	},

	/**
	 * @method onTouchCancel
	 * @since 0.9
	 */
	onTouchCancel: function(touches, e) {

	},

	/**
	 * @method onTouchStart
	 * @since 0.9
	 */
	onTouchStart: function(touches, e) {

	},

	/**
	 * @method onTouchMove
	 * @since 0.9
	 */
	onTouchMove: function(touches, e) {

	},

	/**
	 * @method onTouchEnd
	 * @since 0.9
	 */
	onTouchEnd: function(touches, e) {

	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method setParent
	 * @scope internal
	 * @since 0.9
	 */
	setParent: function(value) {

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
	 * @method setWindow
	 * @scope internal
	 * @since 0.9
	 */
	setWindow: function(value) {

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

		_.invoke(this.__children, 'setWindow', value)

		return this
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @brief Current animated property values.
	 * @scope private
	 * @since 0.9
	 */
	__animatedPropertyValues: null,

	/**
	 * @brief The area to redraw on the view.
	 * @scope private
	 * @since 0.9
	 */
	__redrawArea: null,

	/**
	 * @brief Whether the view needs to be redrawn.
	 * @scope private
	 * @since 0.9
	 */
	__redrawScheduled: false,

	/**
	 * @brief Whether the view needs to relayout.
	 * @scope private
	 * @since 0.9
	 */
	__layoutScheduled: false,

	/**
	 * @brief Whether the measured size has been set.
	 * @scope private
	 * @since 0.9
	 */
	__measuredSizeXSet: false,

	/**
	 * @brief Whether the measured size has been set.
	 * @scope private
	 * @since 0.9
	 */
	__measuredSizeYSet: false,

	/**
	 * @brief Whether the measured offset has been set.
	 * @scope private
	 * @since 0.9
	 */
	__measuredOffsetXSet: false,

	/**
	 * @brief Whether the measured offset has been set.
	 * @scope private
	 * @since 0.9
	 */
	__measuredOffsetYSet: false,

})

/**
 * @brief Properties that trigger a reflow.
 * @scope hidden
 * @since 0.9
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
 * @brief Properties that trigger a layout.
 * @scope hidden
 * @since 0.9
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
 * @brief Animatable properties.
 * @scope hidden
 * @since 0.9
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
 * @brief The root element of the transaction, the window.
 * @scope hidden
 * @since 0.9
 */
var layoutRoot = null

/**
 * @brief The series of animations to be started.
 * @scope hidden
 * @since 0.9
 */
var animations = []

/**
 * @brief The animation status.
 * @scope hidden
 * @since 0.9
 */
var animationStatus = null;

/**
 * @brief The ammount of running animations.
 * @scope hidden
 * @since 0.9
 */
var animationCount = 0

var onViewPropertyTransactionStart = function(e) {
	animationCount++
	animationStatus = 'running'
}

var onViewPropertyTransactionEnd = function(e) {
	animationCount--
	animationStatus = animationCount === 0 && animationStatus !== 'reading' ? null : 'reading'
	e.source.destroy()
}
