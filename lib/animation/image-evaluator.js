"use strict"

/**
 * Evaluates an image value of an animation based on its progress.
 * @class boxspring.animation.ImageEvaluator
 * @since 0.9
 */
var ImageEvaluator = boxspring.define('boxspring.animation.ImageEvaluator', {

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
		return to // TODO FIXME
	}
})