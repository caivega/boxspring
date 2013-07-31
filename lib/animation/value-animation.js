"use strict"

var AnimationRunner = boxspring.animation.AnimationRunner

/**
 * @class boxspring.animation.ValueAnimation
 * @super boxspring.animation.Animation
 * @since 0.9
 */
var ValueAnimation = boxspring.define('boxspring.animation.ValueAnimation', {

	inherits: boxspring.animation.Animation,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property evaluator
		 * @since 0.9
		 */
		evaluator: {
			value: function() {
				return new boxspring.animation.NumberEvaluator()
			}
		},

		/**
		 * @property value
		 * @since 0.9
		 */
		value: {},

		/**
		 * @property from
		 * @since 0.9
		 */
		from: {},

		/**
		 * @property to
		 * @since 0.9
		 */
		to: {}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		ValueAnimation.parent.constructor.call(this)
		this.on('update', this.bind('onUpdate'))
		AnimationRunner.add(this)
		return this
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		AnimationRunner.remove(this)
		this.off('update', this.bind('onUpdate'))
		ValueAnimation.parent.destroy.call(this)
	},

	/**
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
	 * @method onUpdate
	 * @since 0.9
	 */
	onUpdate: function(value) {

	}
})