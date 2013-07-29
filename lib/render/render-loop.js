"use strict"

/**
 * Manages callbacks that requires synchronization with the display refresh rate.
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
        },

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
        this.__priority = []
        this.__schedules = {}
        this.__callbacks = []
        return this
    },

    /**
     * @overridden
     * @method destroy
     * @since 0.9
     */
    destroy: function() {
        this.__priority = null
        this.__schedules = null
        this.__callbacks = null
        RenderLoop.parent.destroy.call(this)
    },

    /**
     * Execute a callback on the next render loop at a specified priority.
     * @method run
     * @since 0.9
     */
    run: function(callback, priority) {

        if (this.__frame == null) {
            this.__frame = requestFrame(this.bind('onRefresh'))
        } else {
            if (this.__processing) {
                this.__reschedule = true
            }
        }

        priority = priority == null ? RenderLoop.DEFAULT_PRIORITY : priority

        var index = this.__callbacks.indexOf(callback)
        if (index > -1)
            return this

        var index = this.__priority.indexOf(priority)
        if (index === -1) {
            this.__priority.push(priority)
            this.__priority.sort()
        }

        var schedule = this.__schedules[priority]
        if (schedule == null) {
            schedule = this.__schedules[priority] = []
        }

        schedule.push(callback)

        this.__callbacks.push(callback)

        return this
    },

    /**
     * Cancel the execution of a specified callback.
     * @method cancel
     * @since 0.9
     */
    cancel: function(callback) {

        var index = this.__callbacks.indexOf(callback)
        if (index > -1)
            return this

        this.__callbacks.splice(index, 1)

        for (var i = 0; i < this.__priority.length; i++) {

            var priority = this.__priority[i]

            var callbacks = this.__schedules[priority]
            if (callbacks == null)
                continue

            var index = callbacks.indexOf(callback)
            if (index === -1)
                continue

            callbacks.splice(index, 1)
            return this
        }

        return this
    },

    //--------------------------------------------------------------------------
    // Event Handlers
    //--------------------------------------------------------------------------

    /**
     * Called when the screen is about to refresh.
     * @method onRefresh
     * @since 0.9
     */
    onRefresh: function() {

        var now = Date.now()

        this.__processing = true

        for (var i = 0; i < this.__priority.length; i++) {

            var priority = this.__priority[i]

            var callbacks = this.__schedules[priority]
            if (callbacks == null)
                continue

            each(this.__schedules[priority].slice(), function(callback) { callback.call(null, now) })

            this.__callbacks[priority] = []
        }

        this.__processing = false

        if (this.__reschedule) {
            this.__reschedule = false
            this.__frame = requestFrame(this.bind('onRefresh'))
        } else  {
            this.__frame = null
        }
    },

    //--------------------------------------------------------------------------
    // Private API
    //--------------------------------------------------------------------------

    /**
     * The next request animation frame id.
     * @private
     */
    __frame: null,

    /**
     * The callbacks array.
     * @private
     */
    __callbacks: null,

    /**
     * The schedule array.
     * @private
     */
    __schedules: null,

    /**
     * The priority array.
     * @private
     */
    __priority: null,

    /**
     * Whether the render loop is processing the callbacks.
     * @private
     */
    __processing: false,

    /**
     * Whether the render loop should reschedule after processing.
     * @private
     */
    __reschedule: false,

})

/**
 * The global instance.
 */
var instance = new RenderLoop()

/**
 * Constants that defines priorities for certain types of actions.
 */
RenderLoop.DEFAULT_PRIORITY = 50
RenderLoop.ANIMATION_PRIORITY = 250
RenderLoop.RENDER_PRIORITY = 500

/**
 * Functions.
 */
var find = _.find
var each = _.each
var cancelFrame = webkitCancelAnimationFrame
var requestFrame = webkitRequestAnimationFrame
