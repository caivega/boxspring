"use strict"

/**
 * Manages callbacks that requires synchronization with the display update rate.
 * @class boxspring.render.RenderLoop
 * @since 0.9
 */
var RenderLoop = boxspring.define('boxspring.render.RenderLoop', {

	//--------------------------------------------------------------------------
	// Statics
	//--------------------------------------------------------------------------

	statics: {

		/**
		 * Execute a callback on the next render loop.
		 * @method run
		 * @static
		 * @since 0.9
		 */
		run: function(callback, priority) {
			instance.run(callback, priority)
		},

		/**
		 * Cancel a callback.
		 * @method run
		 * @static
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
	 * @overridden
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function() {
		RenderLoop.parent.constructor.apply(this, arguments)
		this.__levels = []
		this.__queues = {}
		this.__update = this.bind('update')
		return this
	},

	/**
	 * @overridden
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {
		this.__levels = null
		this.__queues = null
		this.__update = null
		RenderLoop.parent.destroy.call(this)
	},

	/**
	 * Execute a callback on the next render loop at a specified priority.
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
		if (index > -1)
			return this

		queue.push(action)

		if (this.__request == null) {
			this.__request = requestFrame(this.__update)
		}

		if (this.__processing &&
			this.__processingLevel >= level) {
			this.__reschedule = true
		}

		this.__actions++

		return this
	},

	/**
	 * Cancel the execution of a specified callback.
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
			this.__request = cancelFrame(this.__update)
		}

		return this
	},

	/**
	 * Called when the screen is about to update.
	 * @method onRefresh
	 * @since 0.9
	 */
	update: function() {

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
			this.__request = requestFrame(this.__update)
		} else  {
			this.__request = null
		}

		return this
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * The schedule array.
	 * @since 0.9
	 * @private
	 */
	__levels: null,

	/**
	 * The callbacks array.
	 * @since 0.9
	 * @private
	 */
	__queues: null,

	/**
	 * The next request animation frame id.
	 * @since 0.9
	 * @private
	 */
	__request: null,

	/**
	 * The ammount of actions to be executed on the next loop.
	 * @since 0.9
	 * @private
	 */
	__actions: 0,

	/**
	 * Whether the render loop is processing the callbacks.
	 * @since 0.9
	 * @private
	 */
	__processing: false,

	/**
	 * The current level begin processed.
	 * @since 0.9
	 * @private
	 */
	__processingLevel: null,

	/**
	 * The current queue begin processed.
	 * @since 0.9
	 * @private
	 */
	__processingQueue: null,

	/**
	 * The current action begin processed.
	 * @since 0.9
	 * @private
	 */
	__processingAction: null,

	/**
	 * Whether the render loop should reschedule after processing.
	 * @since 0.9
	 * @private
	 */
	__reschedule: false

})

/**
 * The global instance.
 * @since 0.9
 * @private
 */
var instance = new RenderLoop()

/**
 * Constants that defines rendering priorities.
 * @since 0.9
 * @private
 */
RenderLoop.DEFAULT_PRIORITY = 50
RenderLoop.ANIMATION_PRIORITY = 250
RenderLoop.RENDER_PRIORITY = 500

/**
 * Function aliases.
 * @since 0.9
 * @private
 */
var cancelFrame = webkitCancelAnimationFrame
var requestFrame = webkitRequestAnimationFrame
