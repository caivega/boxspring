"use strict"

/**
 * @class boxspring.view.View
 * @super boxspring.view.View
 * @since 0.9
 */
var View = boxspring.override('boxspring.view.View', {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
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
     * @method redrawOnPropertyChange
     * @since 0.9
     */
	redrawOnPropertyChange: function(property) {
		return scheduleRedrawProperties.indexOf(property) !== -1
	},

	/**
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		View.parent.scheduleLayout.call(this)
		updateDisplayWithMask(this, LAYOUT_UPDATE_MASK)
		return this
	},

    /**
     * @method scheduleRedraw
     * @since 0.9
     */
    scheduleRedraw: function() {
    	View.parent.scheduleRedraw.call(this)
       	updateDisplayWithMask(this, REDRAW_UPDATE_MASK)
        return this
    },

   /**
     * @method redraw
     * @since 0.9
     */
	redraw: function(context) {
		this.__redrawBackground(context)
		this.__redrawBorder(context)
		this.__redrawShadow(context)
		return this
	},

	//--------------------------------------------------------------------------
	// Event Handlers
	//--------------------------------------------------------------------------

	/**
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

		View.parent.onPropertyChange.call(this, target, property, newValue, oldValue, e)
	},

	/**
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
	 * @method __redrawBackground
	 * @brief Redraw the view background.
	 * @scope private
	 * @since 0.9
	 */
	__redrawBackground: function(context) {

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
	 * @method __redrawBorder
	 * @brief Redraw the view border.
	 * @scope private
	 * @since 0.9
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
	 * @method __redrawShadow
	 * @brief Redraw the view shadow.
	 * @scope private
	 * @since 0.9
	 */
	__redrawShadow: function(context, area) {
		//console.log('TODO REDRAW SHADOW')
	}
})

/**
 * @brief The list of properties that triggers a redraw.
 * @scope hidden
 * @since 0.9
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
 * @brief Display update masks.
 * @scope hidden
 * @since 0.9
 */
var RENDER_UPDATE_MASK = 1
var LAYOUT_UPDATE_MASK = 2
var REDRAW_UPDATE_MASK = 4
var REDRAW_SHADOW_UPDATE_MASK = 8
var ANIMATE_UPDATE_MASK = 16

/**
 * @brief Rendering caches.
 * @scope hidden
 * @since 0.9
 */
var renderCaches = {}
var shadowCaches = {}

/**
 * @brief Display update data.
 * @scope hidden
 * @since 0.9
 */
var updateDisplayViews = {}
var updateDisplayMasks = {}

/**
 * @brief Whether an update display is scheduled.
 * @scope hidden
 * @since 0.9
 */
var updateDisplayScheduled = false

/**
 * @brief Schedule an update on the next rendering cycle.
 * @scope hidden
 * @since 0.9
 */
var updateDisplayWithMask = function(view, mask) {

	if (updateDisplayMasks[view.UID] == null) {
		updateDisplayMasks[view.UID] = 0
	}

	updateDisplayViews[view.UID] = view
	updateDisplayMasks[view.UID] |= mask

	var status = View.animationStatus()
	if (status === 'reading' ||
		status === 'running') {
		if (mask !== ANIMATE_UPDATE_MASK) return
	}

	if (updateDisplayScheduled === false && (view.window || view instanceof boxspring.view.Window)) {
		updateDisplayScheduled = true
		boxspring.render.RenderLoop.run(updateDisplay, boxspring.render.RenderLoop.RENDER_PRIORITY)
	}
}

var lastCalledTime;
var fps;

/**
 * @brief Recompose the entire view hierarchy.
 * @scope hidden
 * @since 0.9
 */
var updateDisplay = function() {

//	console.log(' --- Update Display --- ')

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

	//console.log(' --- Rendering --- ')

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
 * @scope hidden
 * @since 0.9
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
	} else if (cache.width !== Math.floor(view.measuredSize.x) || cache.height !== Math.floor(view.measuredSize.y)) {
		cache.width  = view.measuredSize.x
		cache.height = view.measuredSize.y
		mask |= REDRAW_UPDATE_MASK
		view.scheduleRedraw()
	}

	if (mask & REDRAW_UPDATE_MASK) {


		var context = cache.getContext('2d')

		context.save()
		context.clearRect(
			0, 0,
			view.measuredSize.x,
			view.measuredSize.y
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
 * @brief Create a new rectangular path with a specified radius.
 * @scope hidden
 * @since 0.9
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
 * @brief The screen canvas.
 * @scope hidden
 * @since 0.9
 */
var screenCanvas = null

/**
 * @brief The screen canvas.
 * @scope hidden
 * @since 0.9
 */
var screenContext = null

/**
 * @brief Create the main canvas.
 * @scope hidden
 * @since 0.9
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
})
