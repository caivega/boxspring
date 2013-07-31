"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner
var PropertyAnimation = boxspring.animation.PropertyAnimation

/**
 * Handle animated properties from multiple views.
 * @class boxspring.view.ViewPropertyAnimationGroup
 * @since 0.9
 */
var ViewPropertyAnimationGroup = boxspring.define('boxspring.view.ViewPropertyAnimationGroup', {

	/**
	 * @inherits boxspring.animation.AnimationGroup,
	 */
	inherits: boxspring.animation.AnimationGroup,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		ViewPropertyAnimationGroup.parent.constructor.call(this)
		_.include(instances, this)
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
		_.remove(instances, this)
		this.__animatedViews = null
		this.__animatedItems = null
		this.__animatedProperties = null
		ViewPropertyAnimationGroup.parent.destroy.call(this)
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
			animation = animations[view.UID] = new boxspring.view.ViewPropertyAnimation()
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
		ViewPropertyAnimationGroup.parent.onStart.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationstart')
	},

	/**
	 * @overridden
	 * @method onPause
	 * @since 0.9
	 */
	onPause: function(e) {
		ViewPropertyAnimationGroup.parent.onPause.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationpause')
	},

	/**
	 * @overridden
	 * @method __onEnd
	 * @since 0.9
	 * @private
	 */
	onEnd: function(e) {
		ViewPropertyAnimationGroup.parent.onEnd.apply(this, arguments)
		_.invoke(this.__animatedViews, 'emit', 'animationend')
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
 * The view property animation group instances.
 * @since 0.9
 * @private
 */
var instances = []
