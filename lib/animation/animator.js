"use strict"

var bezier = require('cubic-bezier')

/**
 * The base animation class.
 * @class boxspring.animation.Animator
 * @since 0.9
 */
var Animator = boxspring.define('boxspring.animation.Animator', {

    /**
     * @inherits boxspring.event.Emitter
     */
	inherits: boxspring.event.Emitter,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

        /**
         * The duration.
         * @property duration
         * @since 0.9
         */
		duration: {
			value: 250
		},

        /**
         * The equation.
         * @property equation
         * @since 0.9
         */
		equation: {
			value: 'default'
		},

        /**
         * Whether to reverse the animation.
         * @property reverse
         * @since 0.9
         */
		reverse: {
			value: false
		},

        /**
         * Whether to repeat the animation.
         * @property repeat
         * @since 0.9
         */
		repeat: {
			value: 0,
            check: function(value) {
                if (value === true) return Infinity
            }
		},

        /**
         * Whether the animation is running.
         * @property running
         * @since 0.9
         */
		running: {
			value: false,
			write: false
		}
	},

    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------

    /**
     * @overridden
     * @method constructor
     * @since 0.9
     */
    constructor: function() {
        Animator.parent.constructor.call(this)
        this.on('start', this.bind('onStart'))
        this.on('pause', this.bind('onPause'))
        this.on('end', this.bind('onEnd'))
        return this
    },

    /**
     * @overridden
     * @method destroy
     * @since 0.9
     */
    destroy: function() {
        this.off('start', this.bind('onStart'))
        this.off('pause', this.bind('onPause'))
        this.off('end', this.bind('onEnd'))
        Animator.parent.destroy.call(this)
    },

    /**
     * Start the animation.
	 * @method start
     * @since 0.9
     */
	start: function() {

        if (this.__running)
            return this

        var time = Date.now()

        if (this.__pauseTime) {
            this.__pauseTime = 0
            time = time - this.__progress * this.duration
        } else {
            this.__progressTo = 0
            this.__progressFrom = 0
        }

        this.__running = true
		this.__startTime = time
		this.__tweenTime = time
        this.__pauseTime = 0
        this.__progress = 0

        this.__curve = parse(this.equation, this.duration)

		this.emit('start')

		return this
	},

    /**
     * Pause the animation.
     * @method start
     * @since 0.9
     */
    pause: function() {

        if (this.__running === false)
            return this

        this.__running = false
        this.__startTime = 0
        this.__tweenTime = 0
        this.__pauseTime = Date.now()

        this.emit('pause')

        return this
    },

    /**
     * Stop the animation.
     * @method stop
     * @since 0.9
     */
    end: function() {

        if (this.running === false)
            return this

        var p = this.__progress
        var t = this.__progressTo

        if (p !== t) this.progress(t)

        this.__running = false
        this.__startTime = 0
        this.__pauseTime = 0
        this.__tweenTime = 0
        this.__progress = 0
        this.__progressTo = 0
        this.__progressFrom = 0

        this.emit('end')

        return this
    },

    /**
     * Step the animation.
	 * @method step
     * @since 0.9
     */
	tick: function(now) {

		var time = this.__tweenTime
		if (time) {

            var factor = (now - time) / this.duration
            if (factor > 1) {
                factor = 1
            }

            var f = null
            var t = null
            var p = null

            if (this.__reversed) {
            	t = this.__progressTo = 0
                f = this.__progressFrom = 1
            } else {
                t = this.__progressTo = 1
                f = this.__progressFrom = 0
            }

            p = this.__progress = compute(f, t, this.__curve(factor))

            this.progress(p)

            if (factor === 1) {

                var repeat = this.reverse ? (this.repeat * 2 - 1) : this.repeat

      			var repeated = ++this.__repeated
                if (repeated >= repeat) {
                    this.end()
                    return
                }

      			if (this.reverse) this.__reversed = !this.__reversed

      			this.__tweenTime = now
            }
        }
	},

    /**
     * Update the animation based on the progress.
     * @method progress
     * @since 0.9
     */
	progress: function(progress) {

	},

    //--------------------------------------------------------------------------
    // Event Handlers
    //--------------------------------------------------------------------------

    /**
     * Called when the animation starts.
     * @method onStart
     * @since 0.9
     */
    onStart: function(e) {

    },

    /**
     * Called when the animation pauses.
     * @method onPause
     * @since 0.9
     */
    onPause: function(e) {

    },

    /**
     * Called when the animation ends.
     * @method onEnd
     * @since 0.9
     */
    onEnd: function(e) {

    },

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

    /**
     * The timing function made from the equation.
     * @private
     * @since 0.9
     */
    __curve: null,

   /**
     * The time the animation started.
     * @private
     * @since 0.9
     */
    __startTime: 0,

   /**
     * The time the animation paused.
     * @private
     * @since 0.9
     */
    __pauseTime: 0,

    /**
     * The time the animation start a single loop.
     * @private
     * @since 0.9
     */
    __tweenTime: 0,

    /**
     * The current progress.
     * @private
     * @since 0.9
     */
    __progress: 0,

    /**
     * The value the progress is heading to.
     * @private
     * @since 0.9
     */
    __progressTo: 0,

    /**
     * The value the progress was started from.
     * @private
     * @since 0.9
     */
    __progressFrom: 0,

    /**
     * The ammount of time the animation was repeated.
     * @private
     * @since 0.9
     */
    __repeated: 0,

    /**
     * Whether the animation is reversed.
     * @private
     * @since 0.9
     */
    __reversed: false

})

/**
 * Equations shortcuts.
 * @since 0.9
 * @private
 */
var equations = {
    "default"     : "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    "linear"      : "cubic-bezier(0, 0, 1, 1)",
    "ease-in"     : "cubic-bezier(0.42, 0, 1.0, 1.0)",
    "ease-out"    : "cubic-bezier(0, 0, 0.58, 1.0)",
    "ease-in-out" : "cubic-bezier(0.42, 0, 0.58, 1.0)"
}

/**
 * Compute a value.
 * @since 0.9
 * @private
 */
var compute = function(from, to, delta){
    return (to - from) * delta + from
}

/**
 * Parse a cubic besier equation into a function.
 * @since 0.9
 * @private
 */
var parse = function(equation, duration) {
    if (typeof equation === 'function') return equation
    equation = equations[equation] || equation
    equation = equation.replace(/\s+/g, '')
    equation = equation.match(/cubic-bezier\(([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)\)/)
    return bezier(
        +equation[1],
        +equation[2],
        +equation[3],
        +equation[4],
        1e3 / 60 / duration / 4
    )
}
