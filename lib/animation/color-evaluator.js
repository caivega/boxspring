"use strict"

/**
 * @class boxspring.animation.ColorEvaluator
 * @super boxspring.animation.TypeEvaluator
 * @since 0.9
 */
var ColorEvaluator = boxspring.define('boxspring.animation.ColorEvaluator', {

	inherit: boxspring.animation.TypeEvaluator,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method evaluate
	 * @since 0.9
	 */
	evaluate: function(progress, from, to) {
		return to // TODO FIXME
	}
})