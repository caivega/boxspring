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

		if (this.__f == null) this.__f = parse(from)
		if (this.__t == null) this.__t = parse(to)

		var f = this.__f
		var t = this.__t

		var r = progress * (f.r - t.r) + f.r
		var g = progress * (f.g - t.g) + f.g
		var b = progress * (f.b - t.b) + f.b
		var a = progress * (f.a - t.a) + f.a

		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
	},

	//--------------------------------------------------------------------------
	// Private
	//--------------------------------------------------------------------------

	__f: null,

	__t: null,

})