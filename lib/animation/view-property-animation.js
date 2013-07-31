"use strict"

/**
 * @class boxspring.animation.ViewAnimation
 * @super boxspring.animation.ValueAnimation
 * @since 0.9
 */
var ViewPropertyAnimation = boxspring.define('boxspring.animation.ViewPropertyAnimation', {

	inherits: boxspring.animation.ValueAnimation,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

        /**
         * @property view
         * @since 0.9
         */
        view: {},

		/**
		 * @property property
		 * @since 0.9
		 */
		property: {}

 	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, value) {

		ViewPropertyAnimation.parent.onPropertyChange.apply(this, arguments)

		if (property === 'property' || property === 'view' && value) {

			var view = this.view
			if (view == null)
				return

			var evaluator = view.animatedPropertyEvaluator(this.property)
			if (evaluator == null)
				throw new Error('Property ' + this.property + 'is not animatable')

			this.evaluator = evaluator
		}
	},

	/**
	 * @method onStart
	 * @since 0.9
	 */
	onStart: function(e) {
		this.view.emit('propertyanimationstart', this.property, this.from)
	},

	/**
	 * @method onPause
	 * @since 0.9
	 */
	onPause: function(e) {
		this.view.emit('propertyanimationpause', this.property, this.from)
	},

	/**
	 * @method onUpdate
	 * @since 0.9
	 */
	onUpdate: function(e) {
		this.view.emit('propertyanimationupdate', this.property, this.value)
	},

	/**
	 * @method onEnd
	 * @since 0.9
	 */
	onEnd: function(e) {
		this.view.emit('propertyanimationend', this.property, this.value)
	}
})