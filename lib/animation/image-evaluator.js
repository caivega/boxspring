"use strict"

/**
 * @class boxspring.animation.ImageEvaluator
 * @super boxspring.animation.TypeEvaluator
 * @since 0.9
 */
var ImageEvaluator = boxspring.define('boxspring.animation.ImageEvaluator', {

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