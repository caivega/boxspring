"use strict"

/**
 * Animates the property of an object.
 * @class boxspring.animation.ViewAnimation
 * @since 0.9
 */
var ObjectAnimator = boxspring.define('boxspring.animation.ObjectAnimator', {

	/**
	 * @inherits boxspring.animation.ValueAnimator
	 */
	inherits: boxspring.animation.ValueAnimator,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

        /**
         * The property target.
         * @property target
         * @since 0.9
         */
        target: {},

		/**
		 * The property name.
		 * @property property
		 * @since 0.9
		 */
		property: {}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

    /**
     * @overridden
	 * @method progress
     * @since 0.9
     */
	progress: function(progress) {

		PropertyAnimation.parent.progress.call(this, progress)

		var target = this.target
		if (target == null)
			throw new Error('Missing target for object animator')

		var property = this.property
		if (property == null)
			throw new Error('Missing property for object animator')

		target.set(property, this.value)
	}

})