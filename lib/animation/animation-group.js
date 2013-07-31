"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner

/**
 * Synchrozine all animations with a single one.
 * @class boxspring.animation.AnimationGroup
 * @since 0.9
 */
var AnimationGroup = boxspring.define('boxspring.animation.AnimationGroup', {

	/**
	 * @inherits boxspring.animation.Animation
	 */
	inherits: boxspring.animation.Animation,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * The animations.
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
     * @overridden
     * @method constructor
     * @since 0.9
     */
    constructor: function() {
        AnimationGroup.parent.constructor.call(this)
        AnimationRunner.add(this)
        return this
    },

    /**
     * @overridden
     * @method destroy
     * @since 0.9
     */
    destroy: function() {
    	_.invoke(this.__animations, 'destroy')
    	AnimationRunner.remove(this)
        AnimationGroup.parent.destroy.call(this)
    },

	/**
	 * Add an animation to the group.
	 * @method destroy
	 * @since 0.9
	 */
	addAnimation: function(animation) {
		_.include(this.__animations, animation)
		return this
	},

	/**
	 * Remove an animation from the group.
	 * @method removeAnimation
	 * @since 0.9
	 */
	removeAnimation: function(animation) {
		_.remove(this.__animations, animation)
		return this
	},

	/**
	 * Remove all animations from the group.
	 * @method removeAllAnimations
	 * @since 0.9
	 */
	removeAllAnimations: function(animation) {
		this.__animations = []
		return this
	},

	/**
	 * Return an animation at the specified index.
	 * @method animationAt
	 * @since 0.9
	 */
	animationAt: function(index) {
		return this.__animations[index] || null
	},

	/**
	 * @overridden
	 * @method progress
	 * @since 0.9
	 */
	progress: function(progress) {
		_.invoke(this.__animations, 'progress', progress)
	}

})
