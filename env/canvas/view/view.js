"use strict"

/**
 * Handle screen layout and interaction with the user.
 * @env canvas
 * @class boxspring.view.View
 * @since 0.9
 */
var View = boxspring.override('boxspring.view.View', {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method destroy
	 * @since 0.9
	 */
	destroy: function() {

		var renderCache = renderCaches[this.UID]
		if (renderCache) {
			renderCache.width = 0
			renderCache.height = 0
			delete renderCaches[this.UID]
		}

		var shadowCache = shadowCaches[this.UID]
		if (shadowCache) {
			shadowCache.width = 0
			shadowCache.height = 0
			delete shadowCaches[this.UID]
		}

		View.parent.destroy.call(this)

		return this
	},

   /**
	 * @overridden
     * @method redrawOnPropertyChange
     * @since 0.9
     */
	redrawOnPropertyChange: function(property) {
		return scheduleRedrawProperties.indexOf(property) !== -1
	},

	/**
	 * @overridden
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		View.parent.scheduleLayout.call(this)
		// called even if the view does not have a window
		updateDisplayWithMask(this, LAYOUT_UPDATE_MASK)
		return this
	},

    /**
	 * @overridden
     * @method scheduleRedraw
     * @since 0.9
     */
    scheduleRedraw: function(area) {
    	View.parent.scheduleRedraw.call(this, area)
       	// called even if the view does not have a window
       	updateDisplayWithMask(this, REDRAW_UPDATE_MASK)
        return this
    },

   /**
	 * @overridden
     * @method redraw
     * @since 0.9
     */
	redraw: function(context, area) {
		this.__redrawBackground(context, area)
		this.__redrawBorder(context, area)
		this.__redrawShadow(context, area)
		return this
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
	 * @overridden
	 * @method onPropertyChange
	 * @since 0.9
	 */
	onPropertyChange: function(target, property, newValue, oldValue, e) {

		if (property === 'shadowBlur' ||
			property === 'shadowColor' ||
			property === 'shadowOffset' ||
			property === 'shadowOffset.x' ||
			property === 'shadowOffset.y') {
			updateDisplayWithMask(this, REDRAW_SHADOW_UPDATE_MASK)
		}

		if (property === 'measuredSize' ||
			property === 'measuredSize.x' ||
			property === 'measuredSize.y' ||
			property === 'measuredOffset' ||
			property === 'measuredOffset.x' ||
			property === 'measuredOffset.y' ||
			property === 'opacity' ||
			property === 'transform') {
			updateDisplayWithMask(this, RENDER_UPDATE_MASK)
		}

		if (this.redrawOnPropertyChange(property)) {
			this.scheduleRedraw()
		}

		View.parent.onPropertyChange.call(this, target, property, newValue, oldValue, e)
	},

	/**
	 * @overridden
	 * @method onPropertyAnimationUpdate
	 * @since 0.9
	 */
	onPropertyAnimationUpdate: function(property, value) {
       View.parent.onPropertyAnimationUpdate.call(this, property, value)
       updateDisplayWithMask(this, ANIMATE_UPDATE_MASK)
    },

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * Redraw the view background.
	 * @method __redrawBorder
	 * @private
	 */
	__redrawBackground: function(context, area) {

		var sizeX = this.measuredSize.x
		var sizeY = this.measuredSize.y

		var borderRadius = this.animatedPropertyValue('borderRadius')
		var backgroundClip = this.animatedPropertyValue('backgroundClip')
		var backgroundColor = this.animatedPropertyValue('backgroundColor')
		var backgroundImage = this.animatedPropertyValue('backgroundImage')
		var backgroundRepeat = this.animatedPropertyValue('backgroundRepeat')

		if (backgroundColor || backgroundImage) {

			var backgroundSizeX = sizeX
			var backgroundSizeY = sizeY
			var backgroundRadius = borderRadius

			if (backgroundClip === 'content') {
				backgroundSizeX -= borderWidth * 2
				backgroundSizeY -= borderWidth * 2
				backgroundRadius -= borderWidth
				backgroundOriginX += borderWidth
				backgroundOriginY += borderWidth
			}

			if (backgroundRadius < 0) {
				backgroundRadius = 0
			}

			context.save()

			createRectPath(context, 0, 0, backgroundSizeX, backgroundSizeY, backgroundRadius)

			if (backgroundColor) {
				context.fillStyle = backgroundColor
				context.fill()
			 }

			if (backgroundImage) {
				context.fillStyle = context.createPattern(backgroundImage, backgroundRepeat)
				context.fill()
			}

			context.restore()
		}

		return this
	},

	/**
	 * Redraw the view border.
	 * @method __redrawBorder
	 * @private
	 */
	__redrawBorder: function(context, area) {

		var sizeX = this.animatedPropertyValue('measuredSize.x')
		var sizeY = this.animatedPropertyValue('measuredSize.y')

  		var borderWidth = this.animatedPropertyValue('borderWidth')
        var borderColor = this.animatedPropertyValue('borderColor')
        var borderRadius = this.animatedPropertyValue('borderRadius')

		if (borderWidth && borderColor) {

            var strokeSizeX = sizeX - borderWidth
            var strokeSizeY = sizeY - borderWidth
            var strokeOriginX = borderWidth / 2
            var strokeOriginY = borderWidth / 2

            var strokeRadius = borderRadius - borderWidth / 2
            if (strokeRadius < 0) {
                strokeRadius = 0
            }

            context.save()

            createRectPath(context, strokeOriginX, strokeOriginY, strokeSizeX, strokeSizeY, strokeRadius)

            context.lineCap = 'butt'
            context.lineWidth = borderWidth
            context.strokeStyle = borderColor
            context.stroke()
            context.restore()
        }

        return this
	},

	/**
	 * Redraw the view shadow.
	 * @method __redrawShadow
	 * @private
	 */
	__redrawShadow: function(context, area) {
		//console.log('TODO REDRAW SHADOW')
	}
})

/**
 * The list of properties that triggers a redraw.
 */
var scheduleRedrawProperties = [
	'backgroundColor',
	'backgroundImage',
	'backgroundRepeat',
	'backgroundClip',
	'backgroundSize',
	'backgroundSize.x',
	'backgroundSize.y',
	'borderRadius',
	'borderColor',
	'borderWidth',
	'shadowBlur',
	'shadowColor',
	'shadowOffset',
	'shadowOffset.x',
	'shadowOffset.y'
]

/**
 * Display update masks.
 * @private
 */
var RENDER_UPDATE_MASK = 1
var LAYOUT_UPDATE_MASK = 2
var REDRAW_UPDATE_MASK = 4
var REDRAW_SHADOW_UPDATE_MASK = 8
var ANIMATE_UPDATE_MASK = 16

/**
 * Rendering caches.
 */
var renderCaches = {}
var shadowCaches = {}

/**
 * Display update data.
 */
var updateDisplayViews = {}
var updateDisplayMasks = {}

/**
 * Whether an update display is scheduled.
 */
var updateDisplayScheduled = false

/**
 * Schedule an update on the next rendering cycle.
 */
var updateDisplayWithMask = function(view, mask) {

	if (updateDisplayMasks[view.UID] == null) {
		updateDisplayMasks[view.UID] = 0
	}

	updateDisplayViews[view.UID] = view
	updateDisplayMasks[view.UID] |= mask

	if (view.animating) {
		if (mask == ANIMATE_UPDATE_MASK) {
			if (updateDisplayScheduled === false) {
				updateDisplayScheduled = true
				boxspring.render.RenderLoop.run(updateDisplay, boxspring.render.RenderLoop.RENDER_PRIORITY)
			}
		}
		return this
	}

	if (updateDisplayScheduled === false) {
		updateDisplayScheduled = true
		boxspring.render.RenderLoop.run(updateDisplay, boxspring.render.RenderLoop.RENDER_PRIORITY)
	}

	return this
}

var lastCalledTime;
var fps;

/**
 * Recompose the entire view hierarchy.
 */
var updateDisplay = function() {

	console.log(' --- Update Display --- ')

	updateDisplayScheduled = false

	var root = null

	for (var key in updateDisplayViews) {
		var view = updateDisplayViews[key]
		if (view instanceof boxspring.view.Window) {
			root = view
			break
		}
		root = updateDisplayViews[key].window
		if (root) break
	}

	if (root == null)
		return

	console.log(' --- Rendering --- ')

    if (root.size.x === 'auto') root.measuredSize.x = window.innerWidth
    if (root.size.y === 'auto') root.measuredSize.y = window.innerHeight

    screenContext.clearRect(
    	0, 0,
    	screenCanvas.width,
    	screenCanvas.height
    )

    composite(root, screenContext)

    updateDisplayViews = {}
    updateDisplayMasks = {}

	if (!lastCalledTime) {
		lastCalledTime = new Date().getTime();
		fps = 0;
		return;
	}
	var delta = (new Date().getTime() - lastCalledTime)/1000;
	lastCalledTime = new Date().getTime();
	fps = 1/delta;
	screenContext.fillText(fps.toFixed(1) + "fps", 10, 10)
}

/**
 * Paint the specified view onto the screen.
 */
var composite = function(view, screen) {

	var mask = updateDisplayMasks[view.UID]
	if (mask & LAYOUT_UPDATE_MASK) {
		view.layoutIfNeeded()
	}

	var sizeX = view.animatedPropertyValue('measuredSize.x')
	var sizeY = view.animatedPropertyValue('measuredSize.y')
	var offsetX = view.animatedPropertyValue('measuredOffset.x')
	var offsetY = view.animatedPropertyValue('measuredOffset.y')

	var cache = renderCaches[view.UID]
	if (cache == null) {
		cache = renderCaches[view.UID] = document.createElement('canvas')
		cache.width  = Math.floor(view.measuredSize.x)
		cache.height = Math.floor(view.measuredSize.y)
	} else if (cache.width  !== Math.floor(view.measuredSize.x) || cache.height !== Math.floor(view.measuredSize.y)) {
		cache.width  = view.measuredSize.x
		cache.height = view.measuredSize.y
		mask |= REDRAW_UPDATE_MASK
		view.scheduleRedraw()
	}

	if (mask & REDRAW_UPDATE_MASK) {

        var area = view.__redrawArea
        if (area === null) {
            area = new boxspring.geom.Rectangle()
            area.size.x = view.measuredSize.x
            area.size.y = view.measuredSize.y
        }

		var context = cache.getContext('2d')

		context.save()
		context.clearRect(
			area.origin.x,
			area.origin.y,
			area.size.x,
			area.size.y
		)

		view.redrawIfNeeded(context)

		context.restore()
	}

	screen.save()
	screen.globalAlpha = screen.globalAlpha * view.animatedPropertyValue('opacity');

	if (sizeX > 0 && sizeY  > 0 && cache.width > 0 && cache.height > 0) {

		screen.drawImage(
	        cache, 0, 0,
	        cache.width,
	        cache.height,
	        offsetX,
	        offsetY,
	        sizeX,
	        sizeY
	    )

	}

	screen.translate(offsetX, offsetY)

    var children = view.__children
    for (var i = 0; i < children.length; i++) {
        composite(children[i], screen)
    }

    screen.restore()
}

/**
 * Create a new rectangular path with a specified radius.
 * @private
 */
var createRectPath = function(context, originX, originY, sizeX, sizeY, radius) {

	context.beginPath()

	if (radius) {
		context.moveTo(originX + radius, originY)
		context.lineTo(originX + sizeX - radius, originY)
		context.quadraticCurveTo(originX + sizeX, originY, originX + sizeX, originY + radius)
		context.lineTo(originX + sizeX, originY + sizeY - radius)
		context.quadraticCurveTo(originX + sizeX, originY + sizeY, originX + sizeX - radius, originY + sizeY)
		context.lineTo(originX + radius, originY + sizeY)
		context.quadraticCurveTo(originX, originY + sizeY, originX, originY + sizeY - radius)
		context.lineTo(originX, originY + radius)
		context.quadraticCurveTo(originX, originY, originX + radius, originY)
	} else {
		context.rect(originX, originY, sizeX, sizeY)
	}

	context.closePath()

	return this
}

/**
 * The screen canvas.
 */
var screenCanvas = null

/**
 * The screen canvas.
 */
var screenContext = null



/**
 * Create the main canvas.
 */
document.addEventListener("DOMContentLoaded", function(event) {
	screenCanvas = document.createElement('canvas')
	screenCanvas.width = window.innerWidth
	screenCanvas.height = window.innerHeight
	document.body.appendChild(screenCanvas)
	screenContext = screenCanvas.getContext('2d')

	window.addEventListener('resize', function() {
	    screenCanvas.width = window.innerWidth
	    screenCanvas.height = window.innerHeight
	})

});
