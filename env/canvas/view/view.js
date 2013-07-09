"use strict"

var Rectangle = boxspring.geom.Rectangle

/**
 * Handle screen layout and interaction with the user.
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

		if (property === 'backgroundColor' ||
			property === 'backgroundImage' ||
			property === 'backgroundRepeat' ||
			property === 'backgroundClip' ||
			property === 'backgroundSize' ||
			property === 'backgroundSize.x' ||
			property === 'backgroundSize.y' ||
			property === 'borderRadius' ||
			property === 'borderColor' ||
			property === 'borderWidth' ||
			property === 'shadowBlur' ||
			property === 'shadowColor' ||
			property === 'shadowOffset' ||
			property === 'shadowOffset.x' ||
			property === 'shadowOffset.y') {
			return true
		}

		return View.parent.redrawOnPropertyChange.apply(this, arguments)
	},

	/**
	 * @overridden
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		updateDisplayWithMask(this, LAYOUT_UPDATE_MASK)
		return View.parent.scheduleLayout.call(this)
	},

	/**
	 * @overridden
	 * @method scheduleRedraw
	 * @since 0.9
	 */
	scheduleRedraw: function(area) {
		updateDisplayWithMask(this, REDRAW_UPDATE_MASK)
		return View.parent.scheduleRedraw.apply(this, arguments)
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
		View.parent.redraw.apply(this, arguments)
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

		if (property === 'measuredSize' ||
			property === 'measuredSize.x' ||
			property === 'measuredSize.y') {
			updateDisplayWithMask(this, MEASURED_SIZE_UPDATE_MASK)
		}

		if (property === 'measuredOffset' ||
			property === 'measuredOffset.x' ||
			property === 'measuredOffset.y') {
			updateDisplayWithMask(this, MEASURED_OFFSET_UPDATE_MASK)
		}

		if (property === 'shadowBlur' ||
			property === 'shadowColor' ||
			property === 'shadowOffset' ||
			property === 'shadowOffset.x' ||
			property === 'shadowOffset.y') {
			updateDisplayWithMask(this, SHADOW_UPDATE_MASK)
		}

		if (property === 'opacity') {
			updateDisplayWithMask(this, OPACITY_UPADTE_MASK)
		}

		if (property === 'transform') {
			updateDisplayWithMask(this, TRANSFORM_UPDATE_MASK)
		}

		View.parent.onPropertyChange.apply(this, arguments)
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

		var borderRadius = this.borderRadius
		var backgroundClip = this.backgroundClip
		var backgroundColor = this.backgroundColor
		var backgroundImage = this.backgroundImage
		var backgroundRepeat = this.backgroundRepeat

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

			this.__createRectPath(context, 0, 0, backgroundSizeX, backgroundSizeY, backgroundRadius)

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

		var sizeX = this.measuredSize.x
		var sizeY = this.measuredSize.y

  		var borderWidth = this.borderWidth
        var borderColor = this.borderColor
        var borderRadius = this.borderRadius

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

            this.__createRectPath(context, strokeOriginX, strokeOriginY, strokeSizeX, strokeSizeY, strokeRadius)

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
		console.log('TODO REDRAW SHADOW')
	},

	/**
	 * Create a new rectangular path with a specified radius.
	 * @method __createRectPath
	 * @private
	 */
	__createRectPath: function(context, originX, originY, sizeX, sizeY, radius) {

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
})

var RenderLoop = boxspring.render.RenderLoop

/**
 * Display update masks.
 * @private
 */
var MEASURED_SIZE_UPDATE_MASK = 1
var MEASURED_OFFSET_UPDATE_MASK = 2
var OPACITY_UPADTE_MASK = 4
var TRANSFORM_UPDATE_MASK = 8
var SHADOW_UPDATE_MASK = 16
var LAYOUT_UPDATE_MASK = 32
var REDRAW_UPDATE_MASK = 64

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
 * Schedule an update on the next rendering cycle.
 */
var updateDisplayWithMask = function(view, mask) {

	if (updateDisplayMasks[view.UID] == null) {
		updateDisplayMasks[view.UID] = 0
	}

	updateDisplayViews[view.UID] = view
	updateDisplayMasks[view.UID] |= mask

	RenderLoop.run(updateDisplay, 500)

	return this
}

/**
 * Recompose the entire view hierarchy.
 */
var updateDisplay = function() {

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
//    updateDisplayRequest = null
}

/**
 * Paint the specified view onto the screen.
 */
var composite = function(view, screen) {

	var mask = updateDisplayMasks[view.UID]
	if (mask & LAYOUT_UPDATE_MASK) {
		view.layoutIfNeeded()
	}

	var sizeX = view.measuredSize.x
	var sizeY = view.measuredSize.y
	var offsetX = view.measuredOffset.x
	var offsetY = view.measuredOffset.y

	var cache = renderCaches[view.UID]
	if (cache == null) {
		cache = renderCaches[view.UID] = document.createElement('canvas')
		cache.width = sizeX
		cache.height = sizeY
	}

	if (mask & REDRAW_UPDATE_MASK) {

        var area = view.__redrawArea
        if (area === null) {
            area = new Rectangle()
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

	if (sizeX && sizeY) screen.drawImage(
        cache, 0, 0,
        cache.width,
        cache.height,
        offsetX,
        offsetY,
        sizeX,
        sizeY
    )

	screen.save()
	screen.translate(offsetX, offsetY)

    var children = view.__children
    for (var i = 0; i < children.length; i++) {
        composite(children[i], screen)
    }

    screen.restore()
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
});
