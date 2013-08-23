"use strict"

var AnimationScheduler = boxspring.animation.AnimationScheduler

/**
 * @class boxspring.animation.AnimationGroup
 * @super boxspring.animation.Animation
 * @since 0.9
 */
var AnimationGroup = boxspring.define('boxspring.animation.AnimationGroup', {

	inherits: boxspring.animation.Animation,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property animations
		 * @since 0.9
		 */
		animations: {
			write: false,
			clone: true,
			value: []
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
		AnimationGroup.parent.constructor.call(this)
		AnimationScheduler.add(this)
		return this
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		_.invoke(this.__animations, 'destroy')
		AnimationScheduler.remove(this)
		AnimationGroup.parent.destroy.call(this)
	},

	/**
	 * @method progress
	 * @since 0.9
	 */
	progress: function(progress) {
		_.invoke(this.__animations, 'progress', progress)
	},

	/**
	 * @method addAnimation
	 * @since 0.9
	 */
	addAnimation: function(animation) {
		_.include(this.__animations, animation)
		return this
	},

	/**
	 * @method removeAnimation
	 * @since 0.9
	 */
	removeAnimation: function(animation) {
		_.remove(this.__animations, animation)
		return this
	},

	/**
	 * @method removeAllAnimations
	 * @since 0.9
	 */
	removeAllAnimations: function(animation) {
		this.__animations = []
		return this
	},

	/**
	 * @method animationAt
	 * @since 0.9
	 */
	animationAt: function(index) {
		return this.__animations[index] || null
	}
})