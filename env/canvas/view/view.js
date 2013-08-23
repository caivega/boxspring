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
	 * @method renderOnPropertyChange
	 * @since 0.9
	 */
	renderOnPropertyChange: function(property) {
		return scheduleRenderProperties.indexOf(property) !== -1
	},

	/**
	 * @method redrawOnPropertyChange
	 * @since 0.9
	 */
	redrawOnPropertyChange: function(property) {
		return scheduleRedrawProperties.indexOf(property) !== -1
	},

	/**
	 * @method scheduleRender
	 * @since 0.9
	 */
	scheduleRender: function() {

		var RenderLoop = boxspring.render.RenderLoop

		var status = View.animationStatus()

		if (this.__needsRender && status !== 'running')
			return this

		this.__needsRender = true

		var status = View.animationStatus()
		if (status === 'reading')
			return this

		if (this.window || this instanceof boxspring.view.Window) {

			if (updateDisplayRoot === null) {
				updateDisplayRoot = this
			}

			if (updateDisplayScheduled === false) {
				updateDisplayScheduled = true
				RenderLoop.run(updateDisplay, RenderLoop.RENDER_PRIORITY)
			}
		}

		return this
	},

	/**
	 * @method scheduleRedraw
	 * @since 0.9
	 */
	scheduleRedraw: function() {
		View.parent.scheduleRedraw.call(this)
		this.scheduleRender()
		return this
	},

	/**
	 * @method scheduleLayout
	 * @since 0.9
	 */
	scheduleLayout: function() {
		View.parent.scheduleLayout.call(this)
		this.scheduleRender()
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

		View.parent.onPropertyChange.apply(this, arguments)

		if (property === 'shadowBlur' ||
			property === 'shadowColor' ||
			property === 'shadowOffset' ||
			property === 'shadowOffset.x' ||
			property === 'shadowOffset.y') {
			this.__needsShadow = true
		}

		if (this.renderOnPropertyChange(property)) this.scheduleRender()
	},

	/**
	 * @method onPropertyAnimationUpdate
	 * @since 0.9
	 */
	onPropertyAnimationUpdate: function(property, value) {
		View.parent.onPropertyAnimationUpdate.apply(this, arguments)
		if (this.redrawOnPropertyChange(property)) this.scheduleRedraw()
		if (this.renderOnPropertyChange(property)) this.scheduleRender()
	},

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @brief Whether the view needs to be rendered.
	 * @scope private
	 * @since 0.9
	 */
	__needsRender: false,

	/**
	 * @brief Whether the view shadow needs to be updated.
	 * @scope private
	 * @since 0.9
	 */
	__needsShadow: false,

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
		var backgroundColor = this.animatedPropertyValue('backgroundColor')
		var backgroundImage = this.animatedPropertyValue('backgroundImage')
		var backgroundClip = this.backgroundClip
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
 * @brief The list of properties that triggers a render.
 * @scope hidden
 * @since 0.9
 */
var scheduleRenderProperties = [
	'measuredSize',
	'measuredSize.x',
	'measuredSize.y',
	'measuredOffset',
	'measuredOffset.x',
	'measuredOffset.y',
	'contentOffset.x',
	'contentOffset.y',
	'transform.values',
	'transform.origin.x',
	'transform.origin.y',
	'transform.translation.x',
	'transform.translation.y',
	'transform.rotation',
	'transform.scale.x',
	'transform.scale.y',
	'transform.shear.x',
	'transform.shear.y',

	'overflow',
	'opacity'
]

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
 * @brief View render caches.
 * @scope hidden
 * @since 0.9
 */
var renderCaches = {}

/**
 * @brief View shadow caches.
 * @scope hidden
 * @since 0.9
 */
var shadowCaches = {}

/**
 * @brief Whether an update display is scheduled.
 * @scope hidden
 * @since 0.9
 */
var updateDisplayScheduled = false

/**
 * @brief The root node that needs to be updated.
 * @scope hidden
 * @since 0.9
 */
var updateDisplayRoot = null

/**
 * @brief Recompose the entire view hierarchy.
 * @scope hidden
 * @since 0.9
 */
var updateDisplay = function() {

	updateDisplayScheduled = false

	if (updateDisplayRoot == null)
		return

	if (root.size.x === 'auto') updateDisplayRoot.measuredSize.x = window.innerWidth
	if (root.size.y === 'auto') updateDisplayRoot.measuredSize.y = window.innerHeight

	screenContext.clearRect(
		0, 0,
		screenCanvas.width,
		screenCanvas.height
	)

	composite(updateDisplayRoot, screenContext, 0, 0)

	showFPS()
}

/**
 * Paint the specified view onto the screen.
 * @scope hidden
 * @since 0.9
 */
var composite = function(view, screen) {

	if (view.__needsLayout) view.layoutIfNeeded()

	var contentOffsetX = 0
	var contentOffsetY = 0

	var parent = view.parent
	if (parent) {
		contentOffsetX = parent.contentOffset.x
		contentOffsetY = parent.contentOffset.y
	}

	var viewSizeX = view.animatedPropertyValue('measuredSize.x')
	var viewSizeY = view.animatedPropertyValue('measuredSize.y')
	var viewOffsetX = view.animatedPropertyValue('measuredOffset.x') + contentOffsetX
	var viewOffsetY = view.animatedPropertyValue('measuredOffset.y') + contentOffsetY
	var viewOpacity = view.animatedPropertyValue('opacity')

	var originX = view.animatedPropertyValue('transform.origin.x')
	var originY = view.animatedPropertyValue('transform.origin.y')

	var translateX = view.animatedPropertyValue('transform.translation.x')
	var translateY = view.animatedPropertyValue('transform.translation.y')
	var rotate = view.animatedPropertyValue('transform.rotation')
	var scaleX = view.animatedPropertyValue('transform.scale.x')
	var scaleY = view.animatedPropertyValue('transform.scale.y')
	var shearX = view.animatedPropertyValue('transform.shear.x')
	var shearY = view.animatedPropertyValue('transform.shear.y')

	screen.save()
	screen.globalAlpha = screen.globalAlpha * viewOpacity;
	screen.translate(viewOffsetX, viewOffsetY)

	screen.translate(translateX, translateY)
	screen.translate(originX, originY)
	screen.rotate(rotate)
	screen.scale(scaleX, scaleY)
	// screen.transform(
	// 	matrix[0], matrix[3], matrix[1],
	// 	matrix[4], matrix[2], matrix[5]
	// )
	screen.translate(-originX, -originY)

	//
	// TODO make with bounds rectangle object and test when transform applied
	//

	var r1x1 = 0
	var r1x2 = 0 + updateDisplayRoot.measuredSize.x
	var r1y1 = 0
	var r1y2 = 0 + updateDisplayRoot.measuredSize.y

	var r2x1 = viewOffsetX
	var r2x2 = viewOffsetX + viewSizeX
	var r2y1 = viewOffsetY
	var r2y2 = viewOffsetY + viewSizeY

	if (r1x1 < r2x2 && r1x2 > r2x1 && r1y1 < r2y2 && r1y2 > r2y1) {

		var cache = renderCaches[view.UID]
		if (cache == null) {
			cache = renderCaches[view.UID] = document.createElement('canvas')
			cache.width  = Math.floor(view.measuredSize.x)
			cache.height = Math.floor(view.measuredSize.y)
			view.scheduleRedraw()
		} else if (cache.width !== Math.floor(view.measuredSize.x) || cache.height !== Math.floor(view.measuredSize.y)) {
			cache.width  = view.measuredSize.x
			cache.height = view.measuredSize.y
			view.scheduleRedraw()
		}

		view.__needsRender = false

		if (view.__needsRedraw) {
			var context = cache.getContext('2d')
			context.save()
			context.clearRect(0, 0, view.measuredSize.x, view.measuredSize.y)
			view.redrawIfNeeded(context)
			context.restore()
		}

		//
		// TODO overflow with offscreen canvas
		//

		if (view.overflow === 'hidden') {

		}

		if (viewSizeX > 0 && viewSizeY > 0 && cache.width > 0 && cache.height > 0) {
			screen.drawImage(cache, 0, 0, cache.width, cache.height, 0, 0, viewSizeX, viewSizeY)
		}
	}

	var children = view.__children
	for (var i = 0; i < children.length; i++) composite(children[i], screen)

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

	var lastCalledTime;
var fps;

var showFPS = function() {

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












// returns the length of the passed vector

var length = function(a){
    return Math.sqrt(a[0] * a[0] + a[1] * a[1])
}

// normalizes the length of the passed point to 1

var normalize = function(a){
    var l = length(a)
    return l ? [a[0] / l, a[1] / l] : [0, 0]
}

// returns the dot product of the passed points

var dot = function(a, b){
    return a[0] * b[0] + a[1] * b[1]
}

// returns the principal value of the arc tangent of
// y/x, using the signs of both arguments to determine
// the quadrant of the return value

var atan2 = Math.atan2

var combine = function(a, b, ascl, bscl){
    return [
        (ascl * a[0]) + (bscl * b[0]),
        (ascl * a[1]) + (bscl * b[1])
    ]
}

var unmatrix = function(a, b, c, d, tx, ty){

    // Make sure the matrix is invertible
    if ((a * d - b * c) === 0) return false

    // Take care of translation

    var translate = [tx, ty]

    // Put the components into a 2x2 matrix
    var m = [[a, b], [c, d]]

    // Compute X scale factor and normalize first row.

    var scale = [length(m[0])]
    m[0] = normalize(m[0])

    // Compute shear factor and make 2nd row orthogonal to 1st.

    var skew = dot(m[0], m[1])
    m[1] = combine(m[1], m[0], 1, -skew)

    // Now, compute Y scale and normalize 2nd row.

    scale[1] = length(m[1])
    // m[1] = normalize(m[1]) //
    skew /= scale[1]

    // Now, get the rotation out

    var rotate = atan2(m[0][1], m[0][0])

    return [translate, rotate, scale, skew]

}