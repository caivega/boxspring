"use strict"

var Map = require('prime/map')

/**
 * @class boxspring.event.TouchForwarder
 * @super boxspring.event.Forwarder
 * @since  1.0
 */
var TouchForwarder = boxspring.define('boxspring.event.TouchForwarder', {

	inherits: boxspring.event.Forwarder,

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property touches
		 * @since 0.9
		 */
		touches: {
			value: {}
		}

	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method constructor
	 * @since 0.9
	 */
	constructor: function(receiver) {

		TouchForwarder.parent.constructor.call(this, receiver)

		document.addEventListener('touchcancel', this.bind('onTouchCancel'))
		document.addEventListener('touchstart', this.bind('onTouchStart'))
		document.addEventListener('touchmove', this.bind('onTouchMove'))
		document.addEventListener('touchend', this.bind('onTouchEnd'))

		return this;
	},

	/**
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {

		this.touches = null

		document.removeEventListener('touchcancel', this.bind('onTouchCancel'))
		document.removeEventListener('touchstart', this.bind('onTouchStart'))
		document.removeEventListener('touchmove', this.bind('onTouchMove'))
		document.removeEventListener('touchend', this.bind('onTouchEnd'))

		TouchForwarder.parent.destroy.call(this)
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @method onTouchCancel
	 * @since 0.9
	 */
	onTouchCancel: function(e) {

		var targets = new Map()

		_.each(e.changedTouches, function(t) {

			var touch = this.touches[t.identifier]
			if (touch === undefined)
				return

			delete this.touches[t.identifier]

			var touches = targets.get(touch.target)
			if (touches === null) {
				targets.set(touch.target, touches = [])
			}

			touches.push(touch)
		})

		var all = _.clone(this.touches)

		targets.forEach(function(touches, target) {
			target.emit(new boxspring.event.TouchEvent('touchcancel', true, true, all), touches)
		}, this)
	},

	/**
	 * @method onTouchStart
	 * @since 0.9
	 */
	onTouchStart: function(e) {

		var targets = new Map()

		_.each(e.changedTouches, function(t) {

			var x = t.pageX
			var y = t.pageY

			var target = this.receiver.viewAtPoint(x, y)
			if (target) {

				var touch = new boxspring.event.Touch()
				touch.setLocation(x, y)
				touch.setTarget(target)

				this.touches[t.identifier] = touch

				var touches = targets.get(target)
				if (touches === null) {
					targets.set(target, touches = [])
				}

				touches.push(touch)
			}

		}, this)

		var all = _.clone(this.touches)

		targets.forEach(function(touches, target) {
			target.emit(new boxspring.event.TouchEvent('touchstart', true, true, all), touches)
		})
	},

	/**
	 * @method onTouchMove
	 * @since 0.9
	 */
	onTouchMove: function(e) {

		var targets = new Map()

		_.each(e.changedTouches, function(t) {

			var touch = this.touches[t.identifier]
			if (touch === undefined)
				return

			touch.setLocation(t.pageX, t.pageY)

			var touches = targets.get(touch.target)
			if (touches === null) {
				targets.set(touch.target, touches = [])
			}

			touches.push(touch)

		}, this)

		var all = _.clone(this.touches)

		targets.forEach(function(touches, target) {
			target.emit(new boxspring.event.TouchEvent('touchmove', true, true, all), touches)
		})
	},

	/**
	 * @method onTouchEnd
	 * @since 0.9
	 */
	onTouchEnd: function(e) {

		var targets = new Map()

		_.each(e.changedTouches, function(t) {

			var touch = this.touches[t.identifier]
			if (touch === undefined)
				return

			delete this.touches[t.identifier]

			var touches = targets.get(touch.target)
			if (touches === null) {
				targets.set(touch.target, touches = [])
			}

			touches.push(touch)

		}, this)

		var all = _.clone(this.touches)

		targets.forEach(function(touches, target) {
			target.emit(new boxspring.event.TouchEvent('touchend', true, true, all), touches)
		})
	}

})