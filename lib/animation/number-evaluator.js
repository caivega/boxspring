"use strict"

/**
 * Evaluates a numeric value of an animation based on its progress.
 * @class boxspring.animation.NumberEvaluator
 * @since 0.9
 */
var NumberEvaluator = boxspring.define('boxspring.animation.NumberEvaluator', {

	/**
	 * @inherits boxspring.animation.TypeEvaluator
	 */
	inherit: boxspring.animation.TypeEvaluator,

    /**
     * @overridden
	 * @method evaluate
     * @since 0.9
     */
	evaluate: function(progress, from, to) {
		return progress * (to - from) + from
	}
})