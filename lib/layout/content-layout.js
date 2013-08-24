"use strict"

/**
 * @class boxspring.layout.ContentLayout
 * @super boxspring.Object
 * @since 0.9
 */
var ContentLayout = boxspring.define('boxspring.layout.ContentLayout', {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	properties: {

		/**
		 * @property size
		 * @since 0.9
		 */
		size: {
			value: function() {
				return new boxspring.geom.Size()
			}
		},

		/**
		 * @property offset
		 * @since 0.9
		 */
		offset: {
			value: function() {
				return new boxspring.geom.Point()
			}
		},

		/**
		 * @property orientation
		 * @since 0.9
		 */
		orientation: {
			value: 'vertical'
		},

		/**
		 * @property alignment
		 * @since 0.9
		 */
		alignment: {
			value: function() {
				return new boxspring.geom.Alignment()
			}
		}
	},

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	__layout__: function(view, children) {

		var contentBorder = view.borderWidth
		var contentPaddingT = view.padding.top
		var contentPaddingL = view.padding.left
		var contentPaddingB = view.padding.bottom
		var contentPaddingR = view.padding.right
		var outerContentSizeX = this.size.x - contentBorder * 2
		var outerContentSizeY = this.size.y - v=contentBorder * 2
		var innerContentSizeX = outerContentSizeX - contentPaddingL - contentPaddingR
		var innerContentSizeY = outerContentSizeY - contentPaddingT - contentPaddingB

		for (var i = 0; i < children.length; i++) {

			var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

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

			var measuredSizeX = sizeX === 'fill' ? outerContentSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? outerContentSizeY : sizeY
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			// absolute position
			if (positionT !== 'auto' || positionB !== 'auto' ||
				positionL !== 'auto' || positionR !== 'auto') {

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

				view.measuredSize.x = measuredSizeX
				view.measuredSize.y = measuredSizeY
				view.measuredOffset.x = measuredOffsetX + frameOffsetX
				view.measuredOffset.y = measuredOffsetY + frameOffsetY
				continue
			}
		}
	},

	/**
	 * @method layout
	 * @since 0.9
	 */
	layout: function(from, children) {

		var border = from.borderWidth

		var frameSizeX = this.size.x - border * 2
		var frameSizeY = this.size.y - border * 2
		var frameOffsetX = this.offset.x
		var frameOffsetY = this.offset.y

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

			view.measuredSize.x = measuredSizeX
			view.measuredSize.y = measuredSizeY
			view.measuredOffset.x = measuredOffsetX + frameOffsetX
			view.measuredOffset.y = measuredOffsetY + frameOffsetY
		}

		switch (this.orientation) {
			case 'vertical':
				this.__layoutVertically(from, children)
				break
			case 'horizontal':
				this.__layoutHorizontally(from, children)
				break
		}
	},

//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method __layoutHorizontally
	 * @scope private
	 * @since 0.9
	 */
	__layoutHorizontally: function(view, children) {

		var contentAlignmentX = this.alignment.x
		var contentAlignmentY = this.alignment.y

		var border = view.borderWidth
		var paddingT = view.padding.top
		var paddingL = view.padding.left
		var paddingB = view.padding.bottom
		var paddingR = view.padding.right

		var contentSizeX = this.size.x - paddingL - paddingR - border * 2
		var contentSizeY = this.size.y - paddingT - paddingB - border * 2

		var usedSpace = 0
		var freeSpace = contentSizeX
		var fluidItems = []
		var fluidSpace = 0
		var fluidCount = 0

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
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

			var measuredSizeX = sizeX === 'fill' ? contentSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? contentSizeY : sizeY

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (sizeX === 'fill') {
				fluidItems.push(child)
			} else {
				var space = measuredSizeX - marginX
				freeSpace -= space
				usedSpace += space
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
		}

		fluidCount = fluidItems.length
		fluidSpace = freeSpace / fluidCount

	// super 2 passes probablement mauvais

		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeX = child.maxSize.x
			var minSizeX = child.minSize.x

			if (maxSizeX === 'none')
				continue

			var space = fluidSpace
			if (maxSizeX !== 'none' && space > maxSizeX) space = maxSizeX
			if (minSizeX !== 'none' && space < minSizeX) space = minSizeX
			child.measuredSize.x = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeX = child.maxSize.x
			var minSizeX = child.minSize.x

			if (maxSizeX !== 'none')
				continue

			var space = fluidSpace
			if (maxSizeX !== 'none' && space > maxSizeX) space = maxSizeX
			if (minSizeX !== 'none' && space < minSizeX) space = minSizeX
			child.measuredSize.x = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}

		var offset = 0

		switch (contentAlignmentX) {
			case 'start':
				offset = paddingL + border
				break
			case 'end':
				offset = paddingL + border + contentSizeX - usedSpace
				break
			case 'center':
				offset = contentSizeX / 2 - usedSpace / 2
				break
		}

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			var measuredSizeX = child.measuredSize.x
			var measuredSizeY = child.measuredSize.y
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			measuredOffsetX = offset + marginL

			switch (contentAlignmentY) {
				case 'start':
					measuredOffsetY = paddingT + border
					break
				case 'end':
					measuredOffsetY = paddingT + border + contentSizeY - measuredSizeY
					break
				case 'center':
					measuredOffsetY = paddingT + border + contentSizeY / 2 - measuredSizeY / 2
					break
			}

			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY

			offset = measuredOffsetX + measuredSizeX
		}

		return this
	},

	/**
	 * @method __layoutVertically
	 * @scope private
	 * @since 0.9
	 */
	__layoutVertically: function(view, children) {

		var contentAlignmentX = this.alignment.x
		var contentAlignmentY = this.alignment.y

		var border = view.borderWidth
		var paddingT = view.padding.top
		var paddingL = view.padding.left
		var paddingB = view.padding.bottom
		var paddingR = view.padding.right

		console.log(view.name)
		if (view.name === 'window')
		console.log(paddingT, paddingL, paddingB, paddingR)

		var contentSizeX = this.size.x - paddingL - paddingR - border * 2
		var contentSizeY = this.size.y - paddingT - paddingB - border * 2

		var usedSpace = 0
		var freeSpace = contentSizeY
		var fluidItems = []
		var fluidSpace = 0
		var fluidCount = 0

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
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

			var measuredSizeX = sizeX === 'fill' ? contentSizeX : sizeX
			var measuredSizeY = sizeY === 'fill' ? contentSizeY : sizeY

			if (maxSizeX !== 'none' && measuredSizeX > maxSizeX) measuredSizeX = maxSizeX
			if (minSizeX !== 'none' && measuredSizeX < minSizeX) measuredSizeX = minSizeX
			if (maxSizeY !== 'none' && measuredSizeY > maxSizeY) measuredSizeY = maxSizeY
			if (minSizeY !== 'none' && measuredSizeY < minSizeY) measuredSizeY = minSizeY

			if (sizeY === 'fill') {
				fluidItems.push(child)
			} else {
				var space = measuredSizeY - marginY
				freeSpace -= space
				usedSpace += space
			}

			child.measuredSize.x = measuredSizeX
			child.measuredSize.y = measuredSizeY
		}

		fluidCount = fluidItems.length
		fluidSpace = freeSpace / fluidCount

		// super 2 passes probablement mauvais

		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeY = child.maxSize.y
			var minSizeY = child.minSize.y

			if (maxSizeY === 'none')
				continue

			var space = fluidSpace
			if (maxSizeY !== 'none' && space > maxSizeY) space = maxSizeY
			if (minSizeY !== 'none' && space < minSizeY) space = minSizeY
			child.measuredSize.y = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		for (var i = 0; i < fluidItems.length; i++) {

			var child = fluidItems[i]

			var maxSizeY = child.maxSize.y
			var minSizeY = child.minSize.y

			if (maxSizeY !== 'none')
				continue

			var space = fluidSpace
			if (maxSizeY !== 'none' && space > maxSizeY) space = maxSizeY
			if (minSizeY !== 'none' && space < minSizeY) space = minSizeY
			child.measuredSize.y = space

			usedSpace += space
			freeSpace -= space

			fluidCount--
			fluidSpace = freeSpace / fluidCount
		}



		var offset = 0

		switch (contentAlignmentY) {
			case 'start':
				offset = paddingT + border
				break
			case 'end':
				offset = paddingT + border + contentSizeX - usedSpace
				break
			case 'center':
				offset = contentSizeY / 2 - usedSpace / 2
				break
		}

		for (var i = 0; i < children.length; i++) {

            var child = children[i]

			var positionT = child.position.top
			var positionL = child.position.left
			var positionR = child.position.right
			var positionB = child.position.bottom

			if (positionT !== 'auto' || positionB !== 'auto' &&
				positionL !== 'auto' || positionR !== 'auto') {
				continue
			}

			var marginT = child.margin.top
			var marginL = child.margin.left
			var marginR = child.margin.right
			var marginB = child.margin.bottom

			var measuredSizeX = child.measuredSize.x
			var measuredSizeY = child.measuredSize.y
			var measuredOffsetX = 0
			var measuredOffsetY = 0

			measuredOffsetY = offset + marginT

			switch (contentAlignmentX) {
				case 'start':
					measuredOffsetX = paddingT + border
					break
				case 'end':
					measuredOffsetX = paddingT + border + contentSizeY - measuredSizeY
					break
				case 'center':
					measuredOffsetX = paddingT + border + contentSizeY / 2 - measuredSizeY / 2
					break
			}

			child.measuredOffset.x = measuredOffsetX
			child.measuredOffset.y = measuredOffsetY

			offset = measuredOffsetY + measuredSizeY
		}

		return this
	}


})