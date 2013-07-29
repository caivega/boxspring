"use strict"

/**
 * Schedule animation tick with the rendering loop.
 * @class boxspring.animation.AnimationRunner
 * @since 0.9
 */
var AnimationRunner = boxspring.define('boxspring.animation.AnimationRunner', {

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		add: function(animation) {
			animation.on('start', onAnimationStart)
			animation.on('pause', onAnimationPause)
			animation.on('end', onAnimationEnd)
		},

		remove: function(animation) {
			animation.off('start', onAnimationStart)
			animation.off('pause', onAnimationPause)
			animation.off('end', onAnimationEnd)
		}
	}
})

/**
 * The animations that needs to be running.
 * @since 0.9
 * @private
 */
var animations = []

/**
 * Add the tick callback to the render loop.
 * @since 0.9
 * @private
 */
var play = function() {
	boxspring.render.RenderLoop.run(tick, boxspring.render.RenderLoop.ANIMATION_PRIORITY)
}

/**
 * Remove the tick callback from the render loop.
 * @since 0.9
 * @private
 */
var stop = function() {
	boxspring.render.RenderLoop.cancel(tick)
}

/**
 * Call the tick method on all running animations.
 * @since 0.9
 * @private
 */
var tick = function(now) {

	for (var i = animations.length - 1; i >= 0; i--) {
		var animation = animations[i]
		if (animation) {
			animation.tick(now)
		}
	}

	play()
}

/**
 * Called when a managed animation starts.
 * @since 0.9
 * @private
 */
var onAnimationStart = function(e) {
	_.include(animations, e.source)
	if (animations.length === 1) play()
}

/**
 * Called when a managed animation pauses.
 * @since 0.9
 * @private
 */
var onAnimationPause = function(e) {
	_.remove(animations, e.source)
	if (animations.length === 0) stop()
}

/**
 * Called when a managed animation ends.
 * @since 0.9
 * @private
 */
var onAnimationEnd = function(e) {
	_.remove(animations, e.source)
	if (animations.length === 0) stop()
}