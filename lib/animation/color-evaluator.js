"use strict"

/**
 * Evaluates a color value of an animation based on its progress.
 * @class boxspring.animation.ColorEvaluator
 * @since 0.9
 */
var ColorEvaluator = boxspring.define('boxspring.animation.ColorEvaluator', {

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