"use strict"

var parse = require('color-parser')

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

		var f = parse(from)
		var t = parse(to)

		if (f.a == null) f.a = 1
		if (t.a == null) t.a = 1

		var r = Math.round(progress * (t.r - f.r) + f.r)
		var g = Math.round(progress * (t.g - f.g) + f.g)
		var b = Math.round(progress * (t.b - f.b) + f.b)
		var a = progress * (t.a - f.a) + f.a

		a = Math.round(a * 100) / 100

		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
	}

})