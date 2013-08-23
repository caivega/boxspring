"use strict"

/**
 * @class boxspring.animation.AnimationScheduler
 * @super boxspring.Object
 * @since 0.9
 */
var AnimationScheduler = boxspring.define('boxspring.animation.AnimationScheduler', {

	//--------------------------------------------------------------------------
	// Methods (Static)
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method add
		 * @scope static
		 * @since 0.9
		 */
		add: function(animation) {
			animation.on('start', onAnimationStart)
			animation.on('pause', onAnimationPause)
			animation.on('end', onAnimationEnd)
		},

		/**
		 * @method add
		 * @scope static
		 * @since 0.9
		 */
		remove: function(animation) {
			animation.off('start', onAnimationStart)
			animation.off('pause', onAnimationPause)
			animation.off('end', onAnimationEnd)
		}
	}
})

/**
 * The animations that needs to be running.
 * @scope hidden
 */
var animations = []

/**
 * Add the tick callback to the render loop.
 * @scope hidden
 */
var play = function() {
	boxspring.render.RenderLoop.run(tick, boxspring.render.RenderLoop.ANIMATION_PRIORITY)
}

/**
 * Remove the tick callback from the render loop.
 * @scope hidden
 */
var stop = function() {
	boxspring.render.RenderLoop.cancel(tick)
}

/**
 * Call the tick method on all running animations.
 * @scope hidden
 */
var tick = function(now) {

	for (var i = animations.length - 1; i >= 0; i--) {
		var animation = animations[i]
		if (animation) {
			animation.tick(now)
		}
	}

	if (animations.length) play()
}

/**
 * Called when a managed animation starts.
 * @scope hidden
 */
var onAnimationStart = function(e) {
	_.include(animations, e.source)
	if (animations.length === 1) play()
}

/**
 * Called when a managed animation pauses.
 * @scope hidden
 */
var onAnimationPause = function(e) {
	_.remove(animations, e.source)
	if (animations.length === 0) stop()
}

/**
 * Called when a managed animation ends.
 * @scope hidden
 */
var onAnimationEnd = function(e) {
	_.remove(animations, e.source)
	if (animations.length === 0) stop()
}