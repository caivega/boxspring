"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner

/**
 * Animate a specified value using an evaluator.
 * @class boxspring.animation.ValueAnimator
 * @since 0.9
 */
var ValueAnimator = boxspring.define('boxspring.animation.ValueAnimator', {

	/**
	 * @inherits boxspring.animation.Animator
	 */
	inherits: boxspring.animation.Animator,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * The evaluator.
		 * @property evaluator
		 * @since 0.9
		 */
		evaluator: {
			value: function() {
				return new boxspring.animation.NumberEvaluator()
			}
		},

		/**
		 * The current animation value.
		 * @property value
		 * @since 0.9
		 */
		value: {},

		/**
		 * The value to animate from.
		 * @property from
		 * @since 0.9
		 */
		from: {},

		/**
		 * The value to animate to.
		 * @property to
		 * @since 0.9
		 */
		to: {}
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
        ValueAnimator.parent.constructor.call(this)
        this.on('update', this.bind('onUpdate'))
        AnimationRunner.add(this)
        return this
    },

    /**
     * @overridden
     * @method destroy
     * @since 0.9
     */
    destroy: function() {
    	AnimationRunner.remove(this)
    	this.off('update', this.bind('onUpdate'))
        ValueAnimator.parent.destroy.call(this)
    },

    /**
     * @overridden
	 * @method progress
     * @since 0.9
     */
	progress: function(progress) {
		this.emit('update', this.value = this.evaluator.evaluate(progress, this.from, this.to))
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * Called when the animation updates its value.
	 * @method onUpdate
	 * @since 0.9
	 */
	onUpdate: function(value) {

	}

})
