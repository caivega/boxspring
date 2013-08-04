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

			var transaction = new boxspring.animation.ViewPropertyTransaction()
			if (duration) transaction.duration = duration
			if (equation) transaction.equation = equation

			transaction.on('end', function() {
				_.remove(animationsRunning, transaction)
				transaction.destroy() // important mais devrais pas
			})

			_.include(animationsReading, transaction)

			return transaction
		},

		/**
		 * @method startAnimation
		 * @scope static
		 * @since 0.9
		 */
		startAnimation: function() {

			var view = null
			var root = null

			for (var i = 0; i < animationsLayout.length; i++) {

				var view = animationsLayout[i]
				if (view instanceof boxspring.view.Window) {
					root = view
					break
				}

				if (view.window == null)
					continue

				var parent = view.parent
				if (parent) {
					while (parent) {
						if (parent === root) break
						parent = parent.parent
					}
				}

				root = view
			}

			if (root) {
				root.layoutIfNeeded()
				root = null
			}

			animationsLayout.length = 0
			animationsRunning = animationsReading
			animationsReading = []

			_.invoke(animationsRunning, 'start')
		},

		/**
		 * @method animationStatus
		 * @scope static internal
		 * @since 0.9
		 */
		animationStatus: function() {
			if (animationsRunning.length) return 'running'
			if (animationsReading.length) return 'reading'
			return 'idle'
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
			value: null
		},

		/**
		 * @property window
		 * @since 0.9
		 */
		window: {
			value: null,
			write: false
		},

		/**
		 * @property parent
		 * @since 0.9
		 */
		parent: {
			value: null,
			write: false
		},

		/**
		 * @property children
		 * @since 0.9
		 */
		children: {
			value: [],
			write: false,
			clone: true
		},

		/**
		 * @property contentLayout
		 * @since 0.9
		 */
		contentLayout: {
			value: function() {
				return new boxspring.layout.FlexibleLayout()
			}
		},

		/**
		 * @property contentOffset
		 * @since 0.9
		 */
		contentOffset: {
			value: function() {
				return new boxspring.geom.Point()
			}
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
			value: 0
		},

		/**
		 * @property borderRadius
		 * @since 0.9
		 */
		borderRadius: {
			value: 0
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
		 * @property transform
		 * @since 0.9
		 */
		transform: {
			value: function() {
				return new boxspring.geom.Matrix()
			}
		},

		/**
		 * @property overflow
		 * @since 0.9
		 */
		overflow: {
			value: 'visible'
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
			value: 1
		},

		/**
		 * @property margin
		 * @since 0.9
		 */
		margin: {

			value: function() {
				return new boxspring.geom.Thickness()
			},

			onSet: function(value) {
				if (typeof value === 'number') {
					this.margin.top = value
					this.margin.left = value
					this.margin.right = value
					this.margin.bottom = value
				}
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

			onSet: function(value) {
				if (typeof value === 'number') {
					this.padding.top = value
					this.padding.left = value
					this.padding.right = value
					this.padding.bottom = value
				}
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
			}
		},

		/**
		 * @property minSize
		 * @since 0.9
		 */
		minSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			}
		},

		/**
		 * @property maxSize
		 * @since 0.9
		 */
		maxSize: {
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			}
		},

		/**
		 * @property measuredSize
		 * @since 0.9
		 */
		measuredSize:{
			value: function() {
				return new boxspring.geom.Size('none', 'none')
			}
		},

		/**
		 * @property measuredOffset
		 * @since 0.9
		 */
		measuredOffset: {
			value: function() {
				return new boxspring.geom.Point('none', 'none')
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
		this.on('propertychange', 'contentOffset.x', onPropertyChange)
		this.on('propertychange', 'contentOffset.y', onPropertyChange)

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

		this.emit('add', view)

		this.scheduleLayout()

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

		this.emit('remove', view)

		this.scheduleLayout()

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
	 * @method viewAtPoint
	 * @since 0.9
	 */
	viewAtPoint: function(x, y) {

		if (this.pointInside(x, y) === false)
			return null

		var o = this.measuredOffset;
		var px = x - o.x
		var py = y - o.y

		var children = this.__children

		for (var i = children.length - 1; i >= 0; i--) {
			var child = children[i]
			if (child.pointInside(px, py)) return child.viewAtPoint(px, py)
		}

		return this
	},

	/**
	 * @method pointInside
	 * @since 0.9
	 */
	pointInside: function(x, y) {

		var point = arguments[0]
		if (point instanceof boxspring.geom.Point) {
			x = point.x
			y = point.y
		}

		var s = this.measuredSize
		var o = this.measuredOffset

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
		if (value == null) {
			// TEMP
			switch (property) {
				case 'backgroundColor': return this.backgroundColor
				case 'backgroundImage': return this.backgroundImage
				case 'backgroundSize.x': return this.backgroundSize.x
				case 'backgroundSize.y': return this.backgroundSize.y
				case 'borderColor': return this.borderColor
				case 'borderWidth': return this.borderWidth
				case 'borderRadius': return this.borderRadius
				case 'shadowBlur': return this.shadowBlur
				case 'shadowColor': return this.shadowColor
				case 'shadowOffset.x': return this.shadowOffset.x
				case 'shadowOffset.y': return this.shadowOffset.y
				case 'opacity': return this.opacity
				case 'measuredSize.x': return this.measuredSize.x
				case 'measuredSize.y': return this.measuredSize.y
				case 'measuredOffset.x': return this.measuredOffset.x
				case 'measuredOffset.y': return this.measuredOffset.y
			}
		}

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
			case 'shadowColor': return new boxspring.animation.ColorEvaluator
			case 'backgroundImage': return new boxspring.animation.ImageEvaluator
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
			case 'contentOffset.x':
			case 'contentOffset.y': return new boxspring.animation.NumberEvaluator
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
		return false
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
	scheduleRedraw: function() {
		this.__needsRedraw = true
		return this
	},

	/**
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		this.__needsLayout = true
		if (animationsReading.length) _.include(animationsLayout, this)
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
	 * @method redraw
	 * @since 0.9
	 */
	redrawIfNeeded: function(context) {

		if (this.__needsRedraw) {
			this.__needsRedraw = false
			this.redraw(context)
			this.emit('redraw', context)
		}

		return this
	},

   /**
	 * @method layoutTree
	 * @since 0.9
	 */
	layoutIfNeeded: function() {

		var parent = this.parent
		if (parent && parent.__needsLayout) {
			parent.layoutIfNeeded()
			return
		}

		if (this.__needsLayout) {
			this.__needsLayout = false
			this.layout()
			this.emit('layout')
		}

		_.invoke(this.__children, 'layoutIfNeeded')

		return this
	},

   /**
	 * @method redraw
	 * @since 0.9
	 */
	redraw: function(context) {
		return this
	},

   /**
	 * @method layout
	 * @since 0.9
	 */
	layout: function() {
		// todo find a way to provide a different layout
		if (this.contentLayout) {
			this.contentLayout.view = this
			this.contentLayout.size.x = this.measuredSize.x
			this.contentLayout.size.y = this.measuredSize.y
			this.contentLayout.layout()
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

		if (this.redrawOnPropertyChange(property)) this.scheduleRedraw()
		if (this.layoutOnPropertyChange(property)) this.scheduleLayout()
		if (this.reflowOnPropertyChange(property)) this.scheduleReflow()

		var animation = _.last(animationsReading)
		if (animation) {

			if (this.propertyIsAnimatable(property)) {

				var t = newValue
				var f = oldValue

				if (property === 'measuredSize.x' && oldValue === 'none' ||
					property === 'measuredSize.y' && oldValue === 'none' ||
					property === 'measuredOffset.x' && oldValue === 'none' ||
					property === 'measuredOffset.y' && oldValue === 'none') {
					f = t
				}

				animation.addAnimatedProperty(this, property, f, t)
			}
		}
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
		// TODO MAKE BETTER
		var parent = this.__parent
		if (parent && value === null) {
			this.__parent = value
			this.emit('propertychange', 'parent', value) // BROKEN
			this.emit('removefromparent', parent)
			return this
		}

		if (parent === null && value) {
			this.__parent = value
			this.emit('propertychange', 'parent', value)  // BROKEN
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
		// TODO MAKE BETTER
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
	 * @brief Whether the view needs to be redrawn.
	 * @scope private
	 * @since 0.9
	 */
	__needsRedraw: false,

	/**
	 * @brief Whether the view needs to relayout.
	 * @scope private
	 * @since 0.9
	 */
	__needsLayout: false,

	/**
	 * @brief Current animated property values.
	 * @scope private
	 * @since 0.9
	 */
	__animatedPropertyValues: null

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
	'contentLayout',
	'measuredSize.x',
	'measuredSize.y',
	'borderWidth',
	'padding.top',
	'padding.left',
	'padding.right',
	'padding.bottom'
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
	'contentOffset.x',
	'contentOffset.y'
]

/**
 * @brief Animation that are reading current property changes.
 * @scope hidden
 * @since 0.9
 */
var animationsReading = []

/**
 * @brief Animation that are currently running.
 * @scope hidden
 * @since 0.9
 */
var animationsRunning = []

/**
 * @brief Views that needs a layout before the animation starts.
 * @scope hidden
 * @since 0.9
 */
var animationsLayout = []
