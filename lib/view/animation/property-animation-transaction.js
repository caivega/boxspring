"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner
var PropertyAnimation = boxspring.animation.PropertyAnimation

/**
 * Handle animated properties from multiple views.
 * @class boxspring.view.animation.PropertyAnimationTransaction
 * @since 0.9
 */
var PropertyAnimationTransaction = boxspring.define('boxspring.view.animation.PropertyAnimationTransaction', {

	/**
	 * @inherits boxspring.animation.AnimationGroup,
	 */
	inherits: boxspring.animation.AnimationGroup,

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
		setup: function(duration, equation) {
			transactionStatus = PropertyAnimationTransaction.STATUS_READING
			var transaction = new PropertyAnimationTransaction()
			if (duration) transaction.duration = duration
			if (equation) transaction.equation = equation
			_.include(transactionStack, transaction)
			return this
		},

		/**
		 * Starts all created transactionStack.
		 * @method start
		 * @static
		 * @since 0.9
		 */
		start: function() {
			transactionStatus = PropertyAnimationTransaction.STATUS_RUNNING
			for (var i = 0; i < transactionStack.length; i++) {
				var transaction = transactionStack[i]
				if (transaction.running === false) {
					transaction.start()
				}
			}
		},

		/**
		 * Animate the property of a view in the current transaction.
		 * @method animate
		 * @static
		 * @since 0.9
		 */
		animate: function(view, property, from, to) {
			var transaction = transactionStack[transactionStack.length - 1]
			if (transaction) {
				transaction.addAnimatedProperty(view, property, from, to)
			}
		},

		/**
		 * Animate the property of a view in the current transaction.
		 * @method animate
		 * @static
		 * @since 0.9
		 */
		status: function() {
			return transactionStatus
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {

		PropertyAnimationTransaction.parent.constructor.call(this)

		this.__animatedViews = {}
		this.__animatedItems = {}
		this.__animatedProperties = {}

		return this
	},

	/**
	 * @overridden
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {

		this.__animatedViews = null
		this.__animatedItems = null
		this.__animatedProperties = null

		PropertyAnimationTransaction.parent.destroy.call(this)
	},

	run: function() {

	},

	/**
	 * Add the property of a view to the animation list.
	 * @method addAnimatedProperty
	 * @since 0.9
	 */
	addAnimatedProperty: function(view, property, from, to) {

		this.__animatedViews[view.UID] = view

		var animations = this.__animatedProperties[property]
		if (animations == null) {
			animations = this.__animatedProperties[property] = {}
		}

		for (var i = 0; i < transactionStack.length; i++) {

			var transaction = transactionStack[i]
			if (transaction === this)
				continue

			var animation = transaction.animationForViewProperty(view, property)
			if (animation === null)
				continue

			transaction.removeAnimatedProperty(view, property)

			animations[view.UID] = animation
			if (animation.running) {
				animation.from = animation.value
				animation.end()
			} else {
				animation.from = from
			}

			this.__animatedItems[view.UID]++

			break

		}

		var animation = animations[view.UID]
		if (animation == null) {
			animation = animations[view.UID] = new boxspring.view.animation.PropertyAnimation()
			animation.property = property
			animation.view = view
			animation.from = from


			if (this.__animatedItems[view.UID] == null) {
				this.__animatedItems[view.UID] = 0
			}
			this.__animatedItems[view.UID]++
		}

		animation.to = to

		animation.__transaction = this

		this.addAnimation(animation)

		return this
	},

	/**
	 * Remove the property of a view from the animation list.
	 * @method removeAnimatedProperty
	 * @since 0.9
	 */
	removeAnimatedProperty: function(view, property) {

		var animations = this.__animatedProperties[property]
		if (animations == null)
			return this

		var animation = animations[view.UID]
		if (animation == null)
			return this

		if (--this.__animatedItems[view.UID] === 0) {
			delete this.__animatedViews[view.UID]
			delete this.__animatedItems[view.UID]
		}

		delete animations[view.UID]

		this.removeAnimation(animation)

		animation.__transaction = null

		return this
	},

	/**
	 * Returns the animator that handles the property of a view.
	 * @method animationForViewProperty
	 * @since 0.9
	 */
	animationForViewProperty: function(view, property) {

		var animations = this.__animatedProperties[property]
		if (animations == null)
			return null

		return animations[view.UID] || null
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method onStart
	 * @since 0.9
	 */
	onStart: function(e) {
		PropertyAnimationTransaction.parent.onStart.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationstart')
	},

	/**
	 * @overridden
	 * @method onStart
	 * @since 0.9
	 */
	onPause: function(e) {

	},

	/**
	 * @overridden
	 * @method __onEnd
	 * @since 0.9
	 * @private
	 */
	onEnd: function(e) {

		PropertyAnimationTransaction.parent.onEnd.apply(this, arguments)

		_.invoke(this.__animatedViews, 'emit', 'animationend')

		_.remove(transactionStack, e.source) // Mrh...

		if (transactionStack.length === 0) {
			transactionStatus = PropertyAnimationTransaction.STATUS_NONE
		}
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * The views being animated by this transaction.
	 * @since 0.9
	 * @private
	 */
	__animatedViews: null,

	/**
	 * The animated property count for each views.
	 * @since 0.9
	 * @private
	 */
	__animatedItems: null,

	/**
	 * The animator for each animated properties.
	 * @since 0.9
	 * @private
	 */
	__animatedProperties: null

})

/**
 * The transaction statuses.
 * @since 0.9
 * @private
 */
PropertyAnimationTransaction.STATUS_NONE = 0
PropertyAnimationTransaction.STATUS_READING = 1
PropertyAnimationTransaction.STATUS_RUNNING = 1

/**
 * The transaction status.
 * @since 0.9
 * @private
 */
var transactionStatus = PropertyAnimationTransaction.STATUS_NONE

/**
 * The transaction instances that will be or are running.
 * @since 0.9
 * @private
 */
var transactionStack = []

