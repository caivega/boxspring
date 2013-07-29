"use strict"

/**
 * Animates the property of a view.
 * @class boxspring.animation.ViewAnimation
 * @since 0.9
 */
var PropertyAnimation = boxspring.define('boxspring.view.animation.PropertyAnimation', {

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
        view: {},

		/**
		 * The property name.
		 * @property property
		 * @since 0.9
		 */
		property: {}

 	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, value) {

		PropertyAnimation.parent.onPropertyChange.apply(this, arguments)

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
	 * @overridden
	 * @method onStart
	 * @since 0.9
	 */
	onStart: function(e) {
		this.view.emit('propertyanimationstart', this.property, this.from)
	},

	/**
	 * @overridden
	 * @method onUpdate
	 * @since 0.9
	 */
	onUpdate: function(e) {
		this.view.emit('propertyanimationupdate', this.property, this.value)
	},

	/**
	 * @overridden
	 * @method onEnd
	 * @since 0.9
	 */
	onEnd: function(e) {
		this.view.emit('propertyanimationend', this.property, this.value)
	}

})
