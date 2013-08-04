"use strict"

/**
 * @class boxspring.layout.FixedLayout
 * @super boxspring.layout.Layout
 * @since 0.9
 */
var FixedLayout = boxspring.define('boxspring.layout.FixedLayout', {

	inherits: boxspring.layout.Layout,

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @method layout
	 * @since 0.9
	 */
	layout: function() {

		var border = this.view.borderWidth

		var frameSizeX = this.size.x - border * 2
		var frameSizeY = this.size.y - border * 2
		var frameOffsetX = this.offset.x
		var frameOffsetY = this.offset.y

		var children = this.view.children

		for (var i = 0; i < children.length; i++) {

			var view = children[i]

			var positionT = view.position.top
			var positionL = view.position.left
			var positionR = view.position.right
			var positionB = view.position.bottom

			if (positionT === 'auto' && positionB === 'auto' &&
				positionL === 'auto' && positionR === 'auto') {
				continue
			}

			var sizeX = view.size.x
			var sizeY = view.size.y
			var maxSizeX = view.maxSize.x
			var maxSizeY = view.maxSize.y
			var minSizeX = view.minSize.x
			var minSizeY = view.minSize.y

			var marginT = view.margin.top
			var marginL = view.margin.left
			var marginR = view.margin.right
			var marginB = view.margin.bottom
			var marginX = marginL + marginR
			var marginY = marginT + marginB

			var measuredSizeX = sizeX === 'fill' ? frameSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? frameSizeY : sizeY
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			if (positionL !== 'auto' &&
				positionR !== 'auto') {
				measuredSizeX = frameSizeX - positionL - positionR - marginX
			}

			if (positionT !== 'auto' &&
				positionB !== 'auto') {
				measuredSizeY = frameSizeY - positionT - positionB - marginY
			}

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (positionL !== 'auto') {
				measuredOffsetX = positionL + marginL + border
			} else if (positionR !== 'auto') {
				measuredOffsetX = frameSizeX - measuredSizeX - positionR + border
			}

			if (positionT !== 'auto') {
				measuredOffsetY = positionT + marginT + border
			} else if (positionB !== 'auto') {
				measuredOffsetY = frameSizeY - measuredSizeY - positionB + border
			}
console.log('Measured offset', measuredOffsetX, measuredOffsetY)
			view.measuredSize.x = measuredSizeX
			view.measuredSize.y = measuredSizeY
			view.measuredOffset.x = measuredOffsetX + frameOffsetX
			view.measuredOffset.y = measuredOffsetY + frameOffsetY
		}
	}
})