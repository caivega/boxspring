"use strict"

/**
 * @class boxspring.layout.Layout
 * @super boxspring.Object
 * @since 0.9
 */
var Layout = boxspring.define('boxspring.layout.Layout', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property target
		 * @since 0.9
		 */
		target: {},
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method update
	 * @since 0.9
	 */
	update: function() {

		var view = this.target
		if (view === null)
			return this

		var border = view.borderWidth

		var outerSizeX = view.measuredSize.x - border * 2
		var outerSizeY = view.measuredSize.y - border * 2

		var measures = []
		var children = view.children

		for (var i = 0; i < children.length; i++) {

			var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT === 'auto' && positionB === 'auto' &&
				positionL === 'auto' && positionR === 'auto') {
				measures.push(child)
				continue
			}

			var sizeX = child.size.x
			var sizeY = child.size.y
			var maxSizeX = child.maxSize.x
			var maxSizeY = child.maxSize.y
			var minSizeX = child.minSize.x
			var minSizeY = child.minSize.y

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom
			var marginX = marginL + marginR
			var marginY = marginT + marginB

			var measuredSizeX = sizeX === 'fill' ? outerSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? outerSizeY : sizeY
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			if (positionL !== 'auto' &&
				positionR !== 'auto') {
				measuredSizeX = outerSizeX - positionL - positionR - marginX
			}

			if (positionT !== 'auto' &&
				positionB !== 'auto') {
				measuredSizeY = outerSizeY - positionT - positionB - marginY
			}

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (positionL !== 'auto') {
				measuredOffsetX = positionL + marginL + border
			} else if (positionR !== 'auto') {
				measuredOffsetX = outerSizeX - measuredSizeX - positionR + border
			}

			if (positionT !== 'auto') {
				measuredOffsetY = positionT + marginT + border
			} else if (positionB !== 'auto') {
				measuredOffsetY = outerSizeY - measuredSizeY - positionB + border
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY
		}

		this.updateLayout(measures)

		return this
	},

	/**
	 * @method updateLayout
	 * @since 0.9
	 */
	updateLayout: function(children) {

	}
})