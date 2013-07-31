"use strict"

/**
 * @class boxspring.animation.NumberEvaluator
 * @super boxspring.animation.TypeEvaluator
 * @since 0.9
 */
var NumberEvaluator = boxspring.define('boxspring.animation.NumberEvaluator', {

	inherit: boxspring.animation.TypeEvaluator,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method evaluate
	 * @since 0.9
	 */
	evaluate: function(progress, from, to) {
		return progress * (to - from) + from
	}
})