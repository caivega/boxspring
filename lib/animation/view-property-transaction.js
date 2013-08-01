"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner
var PropertyAnimation = boxspring.animation.PropertyAnimation

/**
 * @class boxspring.animation.ViewPropertyTransaction
 * @super boxspring.animation.AnimationGroup
 * @since 0.9
 */
var ViewPropertyTransaction = boxspring.define('boxspring.animation.ViewPropertyTransaction', {

	inherits: boxspring.animation.AnimationGroup,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		ViewPropertyTransaction.parent.constructor.call(this)
		_.include(instances, this)
		this.__animatedViews = {}
		this.__animatedItems = {}
		this.__animatedProperties = {}
		return this
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		_.remove(instances, this)
		this.__animatedViews = null
		this.__animatedItems = null
		this.__animatedProperties = null
		ViewPropertyTransaction.parent.destroy.call(this)
	},

	/**
	 * @method addAnimatedProperty
	 * @since 0.9
	 */
	addAnimatedProperty: function(view, property, from, to) {

		this.__animatedViews[view.UID] = view

		var animations = this.__animatedProperties[property]
		if (animations == null) {
			animations = this.__animatedProperties[property] = {}
		}

		for (var i = 0; i < instances.length; i++) {

			var transaction = instances[i]
			if (transaction === this)
				continue

			var animation = transaction.animationForViewProperty(view, property)
			if (animation === null)
				continue

			transaction.removeAnimatedProperty(view, property)

			animations[view.UID] = animation
			if (transaction.running) {
				animation.from = animation.value === null ? animation.from : animation.value
				animation.end()

			} else {
				animation.from = from
			}

			this.__animatedItems[view.UID]++

			break

		}

		var animation = animations[view.UID]
		if (animation == null) {
			animation = animations[view.UID] = new boxspring.animation.ViewPropertyAnimation()
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
	 * @method onStart
	 * @since 0.9
	 */
	onStart: function(e) {
		ViewPropertyTransaction.parent.onStart.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationstart')
	},

	/**
	 * @method onPause
	 * @since 0.9
	 */
	onPause: function(e) {
		ViewPropertyTransaction.parent.onPause.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationpause')
	},

	/**
	 * @method onEnd
	 * @since 0.9
	 */
	onEnd: function(e) {
		ViewPropertyTransaction.parent.onEnd.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationend')
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @brief The views being animated by this transaction.
	 * @scope private
	 * @since 0.9
	 */
	__animatedViews: null,

	/**
	 * @brief The animated property count for each views.
	 * @scope private
	 * @since 0.9
	 */
	__animatedItems: null,

	/**
	 * @brief The animator for each animated properties.
	 * @scope private
	 * @since 0.9
	 */
	__animatedProperties: null

})

/**
 * @brief The view property animation group instances.
 * @scope hidden
 * @since 0.9
 */
var instances = []
