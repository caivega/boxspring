"use strict"

/**
 * Animates the property of an object.
 * @class boxspring.animation.ObjectAnimation
 * @super boxspring.animation.ValueAnimation
 * @since 0.9
 */
var ObjectAnimation = boxspring.define('boxspring.animation.ObjectAnimation', {

	inherits: boxspring.animation.ValueAnimation,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property target
		 * @since 0.9
		 */
		target: {},

		/**
		 * @property property
		 * @since 0.9
		 */
		property: {}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method progress
	 * @since 0.9
	 */
	progress: function(progress) {

		PropertyAnimation.parent.progress.apply(this, arguments)

		var target = this.target
		if (target == null)
			throw new Error('Missing target for object animator')

		var property = this.property
		if (property == null)
			throw new Error('Missing property for object animator')

		target.set(property, this.value)
	}
})