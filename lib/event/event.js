"use strict"

/**
 * The base class of all events.
 * @class boxspring.event.Event
 * @since 0.9
 */
var Event = boxspring.define('boxspring.event.Event', {

    //--------------------------------------------------------------------------
    // Properties
    //--------------------------------------------------------------------------

    properties: {

        /**
         * The event type.
         * @property type
         * @since 0.9
         */
        type: {
            write: false,
        },

        /**
         * The object that triggered the event.
         * @property source
         * @since 0.9
         */
        source: {
            write: false,
        },

        /**
         * The object that the event is dispatched to.
         * @property target
         * @since 0.9
         */
        target: {
            write: false,
        },

        /**
         * The list of arguments supplied to the event.
         * @property parameters
         * @since 0.9
         */
        parameters: {
            write: false,
            clone: true,
            value: []
        },

        /**
         * Whether the event bubbles to the parent.
         * @property bubbleable
         * @since 0.9
         */
        bubbleable: {
            write: false,
            value: false
        },

        /**
         * Whether the event is cancelable.
         * @property cancelable
         * @since 0.9
         */
        cancelable: {
            write: false,
            value: true
        },

        /**
         * Whether the event bubbling is stopped.
         * @property stopped
         * @since 0.9
         */
        stopped: {
            write: false,
            value: false
        },

        /**
         * Whether the event is canceled.
         * @property canceled
         * @since 0.9
         */
        canceled: {
            write: false,
            value: false
        }
    },

    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------

    /**
     * Initialize the event.
     * @method constructor
     * @since 0.9
     */
    constructor: function(type, bubbleable, cancelable) {
        this.__type = type
        this.__bubbleable = bubbleable
        this.__cancelable = cancelable
        return this
    },

    /**
     * Stop the propagation of the current event.
     * @method stop
     * @since 0.9
     */
    stop: function() {
        this.__stopped = true
        return this
    },

    /**
     * Cancel the current event.
     * @method cancel
     * @since 0.9
     */
    cancel: function() {
        this.__stopped = true
        this.__canceled = true
        return this
    },

    //--------------------------------------------------------------------------
    // Private API
    //--------------------------------------------------------------------------

    /**
     * Set the target.
     * @method __setTarget
     * @private
     */
    __setTarget: function(target) {
        this.__target = target
        return this
    },

    /**
     * Set the source.
     * @method __setSource
     * @private
     */
    __setSource: function(source) {
        this.__source = source
        return this
    },

    /**
     * Set the parameters.
     * @method __setParameters
     * @private
     */
    __setParameters: function(parameters) {
        this.__parameters = Array.prototype.slice.call(parameters)
        return this
    }

})
