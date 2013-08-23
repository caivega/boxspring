"use strict"

/**
 * @class boxspring.render.RenderLoop
 * @super boxspring.Object
 * @since 0.9
 */
var RenderLoop = boxspring.define('boxspring.render.RenderLoop', {

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * @method run
		 * @scope static
		 * @since 0.9
		 */
		run: function(callback, priority) {
			instance.run(callback, priority)
		},

		/**
		 * @method cancel
		 * @score static
		 * @since 0.9
		 */
		cancel: function(callback) {
			instance.cancel(callback)
		}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		RenderLoop.parent.constructor.apply(this, arguments)
		this.__levels = []
		this.__queues = {}
		return this
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		this.__levels = null
		this.__queues = null
		RenderLoop.parent.destroy.call(this)
	},

	/**
	 * @method run
	 * @since 0.9
	 */
	run: function(action, level) {

		if (level == null) {
			level = RenderLoop.DEFAULT_PRIORITY
		}

		_.include(this.__levels, level)

		var queue = this.__queues[level]
		if (queue == null) {
			queue = this.__queues[level] = []
		}

		var index = queue.indexOf(action)
		if (index === -1) {

			queue.push(action)

			if (this.__request == null) {
				this.__request = requestFrame(this.bind('loop'))
			}

			if (this.__processing &&
				this.__processingLevel >= level) {
				this.__reschedule = true
			}

			this.__actions++
		}

		return this
	},

	/**
	 * @method cancel
	 * @since 0.9
	 */
	cancel: function(action) {

		for (var level in this.__queues) {
			var queue = this.__queues[level]
			var index = queue.indexOf(action)
			if (index > -1) {
				queue.splice(index, 1)
				this.__actions--
				break
			}
		}

		if (this.__actions === 0) {
			this.__request = cancelFrame(this.bind('loop'))
		}

		return this
	},

	/**
	 * @method loop
	 * @since 0.9
	 */
	loop: function() {

		var now = Date.now()

		this.__processing = true

		this.__levels.sort()

		for (var i = 0; i < this.__levels.length; i++) {

			var level = this.__levels[i]

			var queue = this.__queues[level]
			if (queue.length === 0)
				continue

			this.__queues[level] = []
			this.__processingLevel = level
			this.__processingQueue = queue

			for (var j = 0; j < queue.length; j++) {
				this.__processingAction = queue[j]
				this.__processingAction.call(null, now)
				this.__processingAction = null
				this.__actions--
			}
		}

		this.__processing = false
		this.__processingQueue = null
		this.__processingLevel = null

		if (this.__reschedule) {
			this.__reschedule = false
			this.__request = requestFrame(this.bind('loop'))
		} else  {
			this.__request = null
		}

		return this
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @brief The levels array.
	 * @scope private
	 * @since 0.9
	 */
	__levels: null,

	/**
	 * @brief The queues array.
	 * @scope private
	 * @since 0.9
	 */
	__queues: null,

	/**
	 * @brief The next animation frame.
	 * @scope private
	 * @since 0.9
	 */
	__request: null,

	/**
	 * @brief The ammount of actions to be executed on the next loop.
	 * @scope private
	 * @since 0.9
	 */
	__actions: 0,

	/**
	 * @brief Whether the render loop is processing the callbacks.
	 * @scope private
	 * @since 0.9
	 */
	__processing: false,

	/**
	 * @brief The current level begin processed.
	 * @scope private
	 * @since 0.9
	 */
	__processingLevel: null,

	/**
	 * @brief The current queue begin processed.
	 * @scope private
	 * @since 0.9
	 */
	__processingQueue: null,

	/**
	 * @brief The current action begin processed.
	 * @scope private
	 * @since 0.9
	 */
	__processingAction: null,

	/**
	 * @brief Whether to reschedule once the loop is completed.
	 * @scope private
	 * @since 0.9
	 */
	__reschedule: false

})

/**
 * The render loop instance.
 * @scope hidden
 */
var instance = new RenderLoop()

/**
 * Level definitions.
 * @scope hidden
 */
RenderLoop.DEFAULT_PRIORITY = 50
RenderLoop.ANIMATION_PRIORITY = 250
RenderLoop.RENDER_PRIORITY = 500

/**
 * Request Animation Frame.
 * @scope hidden
 */
var cancelFrame = webkitCancelAnimationFrame
var requestFrame = webkitRequestAnimationFrame
